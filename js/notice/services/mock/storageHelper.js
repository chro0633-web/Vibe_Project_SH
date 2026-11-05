const LATENCY_MS = 120; // 네트워크 지연 시뮬레이션 (로딩 UI 검증용)
export const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export class StorageQuotaError extends Error {
  constructor() {
    super('저장 공간이 부족합니다. (localStorage 한도 초과 — Firebase Storage 전환 후 해소됩니다)');
    this.name = 'StorageQuotaError';
  }
}

const isQuotaError = (e) =>
  e instanceof DOMException && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED');

export const storageHelper = {
  async get(key, defaultValue) {
    await delay(LATENCY_MS);
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;
    try { return JSON.parse(raw); } catch { return defaultValue; }
  },
  async set(key, value) {
    await delay(LATENCY_MS);
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch (e) { throw isQuotaError(e) ? new StorageQuotaError() : e; }
  },
  async remove(key) {
    await delay(LATENCY_MS / 2);
    localStorage.removeItem(key);
  },
  async has(key) {
    return localStorage.getItem(key) !== null;
  },
};
