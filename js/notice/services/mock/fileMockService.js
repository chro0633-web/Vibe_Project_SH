import { storageHelper } from './storageHelper.js';
import { newId } from '../../utils/format.js';

/**
 * 파일 데이터(Base64)는 "mock_file:{id}" 키에 개별 보관 — 메타데이터(Post.attachments)와 분리.
 * Firebase Storage 전환 시 경로는 notice/{id} 로 동일하게 사용한다.
 */
const FILE_KEY = (id) => `mock_file:${id}`;

const readAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });

export const fileMockService = {
  /** @returns {Promise<import('../../types/post.js').FileMeta>} */
  async upload(file) {
    const id = newId();
    await storageHelper.set(FILE_KEY(id), await readAsDataUrl(file)); // 용량 초과 시 StorageQuotaError
    return { id, name: file.name, size: file.size, mimeType: file.type || 'application/octet-stream', createdAt: new Date().toISOString() };
  },
  async getUrl(id) {
    return storageHelper.get(FILE_KEY(id), null);
  },
  async remove(id) {
    await storageHelper.remove(FILE_KEY(id));
  },
  async removeMany(ids = []) {
    await Promise.all(ids.map((id) => this.remove(id)));
  },
};
