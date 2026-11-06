import { mountList } from './views/listView.js';
import { mountDetail } from './views/detailView.js';
import { mountForm } from './views/formView.js';
import { authService } from './services/authService.js';
import { toast } from './ui/toast.js';

const root = document.getElementById('notice-view');
const titleEl = document.getElementById('notice-title');
const subEl = document.getElementById('notice-subtitle');

let cleanup = null;
let listHref = '#/';
let session = { user: null, profile: null, isAdmin: false };
let authReady = false;

const navigate = (hash) => { if (location.hash === hash) route(); else location.hash = hash; };

function renderAuthStatus() {
  const message = document.querySelector('[data-auth-message]');
  const loginLink = document.querySelector('[data-login-link]');
  const logoutButton = document.querySelector('[data-logout]');
  if (!message || !loginLink || !logoutButton) return;

  message.textContent = session.user
    ? `${session.profile?.name || session.user.displayName || '사용자'}님 환영합니다`
    : '로그인 후 게시판을 이용하세요.';
  loginLink.hidden = Boolean(session.user);
  logoutButton.hidden = !session.user;
}

function route() {
  cleanup?.();
  cleanup = null;
  if (!authReady) {
    root.innerHTML = '<p class="notice-state">로그인 상태를 확인하고 있습니다...</p>';
    return;
  }

  const [path, qs = ''] = location.hash.slice(1).split('?');
  const [view, id] = path.split('/').filter(Boolean);
  const params = new URLSearchParams(qs);
  const isEdit = view === 'edit';

  if (view === 'login' || view === 'signup') {
    location.replace(view === 'login' ? 'login.html' : 'signup.html');
    return;
  }
  if ((view === 'write' || isEdit) && !session.isAdmin) {
    location.href = `login.html?return=${encodeURIComponent(location.hash)}`;
    return;
  }

  titleEl.textContent = isEdit ? 'Edit Notice' : 'Notice';
  subEl.textContent = isEdit ? '공지사항을 수정합니다.' : '새로운 소식을 만나보세요.';
  document.title = `${titleEl.textContent} | What If`;
  root.dataset.view = view || 'list';

  const ctx = { navigate, listHref, session };
  if (view === 'post' && id) cleanup = mountDetail(root, { ...ctx, id });
  else if (view === 'write') cleanup = mountForm(root, { ...ctx, mode: 'write' });
  else if (isEdit && id) cleanup = mountForm(root, { ...ctx, mode: 'edit', id });
  else { listHref = location.hash || '#/'; cleanup = mountList(root, { ...ctx, params }); }
  scrollTo({ top: 0 });
}

document.querySelector('[data-logout]')?.addEventListener('click', async () => {
  try {
    await authService.signOut();
    navigate('#/');
  } catch {
    toast('로그아웃하지 못했습니다.', 'error');
  }
});

window.addEventListener('hashchange', route);
route();
authService.subscribe((nextSession) => {
  session = nextSession;
  authReady = true;
  renderAuthStatus();
  route();
}, (error) => {
  console.error('인증 상태를 확인하지 못했습니다.', error);
  authReady = true;
  renderAuthStatus();
  route();
});
