import { ref, uploadBytes, getDownloadURL, deleteObject } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js';
import { storage } from './firebaseConfig.js';
import { newId } from '../../utils/format.js';

const path = (id) => `notice/${id}`; // Mock과 동일한 ID ↔ 경로 규칙
const urlCache = new Map();

export const fileFirebaseService = {
  async upload(file) {
    const id = newId();
    await uploadBytes(ref(storage, path(id)), file, { contentType: file.type });
    return { id, name: file.name, size: file.size, mimeType: file.type || 'application/octet-stream', createdAt: new Date().toISOString() };
  },
  async getUrl(id) {
    if (!urlCache.has(id)) urlCache.set(id, getDownloadURL(ref(storage, path(id))).catch(() => null));
    return urlCache.get(id);
  },
  async remove(id) {
    try { await deleteObject(ref(storage, path(id))); } catch (e) { if (e.code !== 'storage/object-not-found') throw e; }
    urlCache.delete(id);
  },
  async removeMany(ids = []) {
    await Promise.all(ids.map((id) => this.remove(id)));
  },
};
