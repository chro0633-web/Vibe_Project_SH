let region;
/** 화면 하단 알림 (aria-live) */
export function toast(message, type = 'info') {
  if (!region) {
    region = document.createElement('div');
    region.className = 'notice-toast-region';
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    document.body.append(region);
  }
  const el = document.createElement('div');
  el.className = `notice-toast notice-toast--${type}`;
  el.textContent = message;
  region.append(el);
  setTimeout(() => el.remove(), 3200);
}
