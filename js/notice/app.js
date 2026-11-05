import { mountList } from './views/listView.js';
import { mountDetail } from './views/detailView.js';
import { mountForm } from './views/formView.js';

const root = document.getElementById('notice-view');
const titleEl = document.getElementById('notice-title');
const subEl = document.getElementById('notice-subtitle');

let cleanup = null;
let listHref = '#/';

const navigate = (hash) => { if (location.hash === hash) route(); else location.hash = hash; };

function route() {
  cleanup?.();
  const [path, qs = ''] = location.hash.slice(1).split('?');
  const [view, id] = path.split('/').filter(Boolean);
  const params = new URLSearchParams(qs);
  const isEdit = view === 'edit';
  titleEl.textContent = isEdit ? 'Edit Notice' : 'Notice';
  subEl.textContent = isEdit ? '공지사항을 수정합니다.' : 'What If의 새로운 소식을 만나보세요.';
  document.title = `${titleEl.textContent} | What If`;
  root.dataset.view = view || 'list';

  const ctx = { navigate, listHref };
  if (view === 'post' && id) cleanup = mountDetail(root, { ...ctx, id });
  else if (view === 'write') cleanup = mountForm(root, { ...ctx, mode: 'write' });
  else if (isEdit && id) cleanup = mountForm(root, { ...ctx, mode: 'edit', id });
  else { listHref = location.hash || '#/'; cleanup = mountList(root, { params, navigate }); }
  scrollTo({ top: 0 });
}

window.addEventListener('hashchange', route);
route();
