import { storageHelper } from './storageHelper.js';
import { seedIfEmpty } from './seed.js';
import { fileService } from '../fileService.js';
import { newId } from '../../utils/format.js';
import { PAGE_SIZE } from '../../config.js';

const POST_KEY = 'mock_posts';          // → Firestore 컬렉션: notices
const BOOKMARK_KEY = 'mock_bookmarks';  // → Firestore: users/{uid}/bookmarks/{postId}
const ready = seedIfEmpty(POST_KEY, (id) => `mock_file:${id}`);

const loadAll = async () => {
  await ready;
  const list = await storageHelper.get(POST_KEY, []);
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt)); // 최신순
};

export const postMockService = {
  /** 검색(제목) + 페이지네이션. @returns {Promise<import('../../types/post.js').ListResult>} */
  async list({ keyword = '', page = 1, pageSize = PAGE_SIZE } = {}) {
    const all = await loadAll();
    const kw = keyword.trim().toLowerCase();
    const filtered = kw ? all.filter((p) => p.title.toLowerCase().includes(kw)) : all;
    const start = (page - 1) * pageSize;
    return { items: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize };
  },

  async getById(id) {
    return (await loadAll()).find((p) => p.id === id) || null;
  },

  /** 이전글(newer)/다음글(older) — 최신순 목록 기준 */
  async getAdjacent(id) {
    const all = await loadAll();
    const i = all.findIndex((p) => p.id === id);
    const pick = (p) => (p ? { id: p.id, title: p.title } : null);
    return i < 0 ? { newer: null, older: null } : { newer: pick(all[i - 1]), older: pick(all[i + 1]) };
  },

  async create(dto) {
    const list = await loadAll();
    const now = new Date().toISOString();
    const post = { ...dto, id: newId(), viewCount: 0, createdAt: now, updatedAt: now };
    list.unshift(post);
    await storageHelper.set(POST_KEY, list);
    return post;
  },

  async update(id, dto) {
    const list = await loadAll();
    const i = list.findIndex((p) => p.id === id);
    if (i === -1) throw new Error(`게시글(${id})을 찾을 수 없습니다.`);
    list[i] = { ...list[i], ...dto, updatedAt: new Date().toISOString() };
    await storageHelper.set(POST_KEY, list);
    return list[i];
  },

  /** 게시글 + 연결된 첨부파일/본문 이미지까지 삭제 */
  async delete(id) {
    const list = await loadAll();
    const target = list.find((p) => p.id === id);
    if (!target) return;
    await storageHelper.set(POST_KEY, list.filter((p) => p.id !== id));
    await fileService.removeMany([...(target.imageIds || []), ...target.attachments.map((f) => f.id)]);
    const bm = await storageHelper.get(BOOKMARK_KEY, []);
    await storageHelper.set(BOOKMARK_KEY, bm.filter((x) => x !== id));
  },

  /** Firestore: updateDoc(ref, { viewCount: increment(1) }) */
  async increaseViewCount(id) {
    const list = await loadAll();
    const p = list.find((x) => x.id === id);
    if (!p) return;
    p.viewCount += 1;
    await storageHelper.set(POST_KEY, list);
  },

  async isBookmarked(id) {
    return (await storageHelper.get(BOOKMARK_KEY, [])).includes(id);
  },

  /** @returns {Promise<boolean>} 토글 후 북마크 상태 */
  async toggleBookmark(id) {
    const bm = await storageHelper.get(BOOKMARK_KEY, []);
    const next = bm.includes(id) ? bm.filter((x) => x !== id) : [...bm, id];
    await storageHelper.set(BOOKMARK_KEY, next);
    return next.includes(id);
  },
};
