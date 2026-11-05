import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy, limit, increment,
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { db } from './firebaseConfig.js';
import { fileService } from '../fileService.js';
import { CURRENT_USER, PAGE_SIZE } from '../../config.js';

const COL = 'notices';
const toPost = (d) => ({ id: d.id, ...d.data() });
const bookmarkRef = (id) => doc(db, 'users', CURRENT_USER.id, 'bookmarks', id);

export const postFirebaseService = {
  async list({ keyword = '', page = 1, pageSize = PAGE_SIZE } = {}) {
    // 비공개 글은 관리자만 조회 → Security Rules + (일반 사용자용) where('isPublic','==',true) 추가
    const snap = await getDocs(query(collection(db, COL), orderBy('createdAt', 'desc')));
    const kw = keyword.trim().toLowerCase();
    const all = snap.docs.map(toPost).filter((p) => !kw || p.title.toLowerCase().includes(kw)); // Firestore는 부분일치 검색 불가 → 클라이언트 필터(소규모 전제)
    const start = (page - 1) * pageSize;
    return { items: all.slice(start, start + pageSize), total: all.length, page, pageSize };
  },

  async getById(id) {
    const d = await getDoc(doc(db, COL, id));
    return d.exists() ? toPost(d) : null;
  },

  async getAdjacent(id) {
    const cur = await this.getById(id);
    if (!cur) return { newer: null, older: null };
    const one = async (op, dir) => {
      const s = await getDocs(query(collection(db, COL), where('createdAt', op, cur.createdAt), orderBy('createdAt', dir), limit(1)));
      return s.empty ? null : { id: s.docs[0].id, title: s.docs[0].data().title };
    };
    const [newer, older] = await Promise.all([one('>', 'asc'), one('<', 'desc')]);
    return { newer, older };
  },

  async create(dto) {
    const ref = doc(collection(db, COL)); // 자동 ID
    const now = new Date().toISOString();
    const data = { ...dto, viewCount: 0, createdAt: now, updatedAt: now };
    await setDoc(ref, data);
    return { id: ref.id, ...data };
  },

  async update(id, dto) {
    await updateDoc(doc(db, COL, id), { ...dto, updatedAt: new Date().toISOString() });
    return this.getById(id);
  },

  async delete(id) {
    const post = await this.getById(id);
    if (!post) return;
    await deleteDoc(doc(db, COL, id));
    await fileService.removeMany([...(post.imageIds || []), ...post.attachments.map((f) => f.id)]);
    await deleteDoc(bookmarkRef(id));
  },

  async increaseViewCount(id) {
    await updateDoc(doc(db, COL, id), { viewCount: increment(1) });
  },

  async isBookmarked(id) {
    return (await getDoc(bookmarkRef(id))).exists();
  },

  async toggleBookmark(id) {
    if (await this.isBookmarked(id)) { await deleteDoc(bookmarkRef(id)); return false; }
    await setDoc(bookmarkRef(id), { postId: id, createdAt: new Date().toISOString() });
    return true;
  },
};
