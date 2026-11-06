const pageTitles = {
  projects: 'Projects',
  notice: 'NOTICE',
  qna: 'Q&A',
  login: 'LOGIN',
  signup: 'SIGN UP',
};

async function loadComponent(selector, path) {
  const placeholder = document.querySelector(selector);
  if (!placeholder) return;

  const response = await fetch(new URL(path, import.meta.url));
  if (!response.ok) throw new Error(`공통 영역을 불러오지 못했습니다: ${path}`);
  placeholder.outerHTML = await response.text();
}

await Promise.all([
  loadComponent('[data-site-header-slot]', '../../partials/site-header.html'),
  loadComponent('[data-site-footer-slot]', '../../partials/site-footer.html'),
]);

const page = document.body.dataset.page || 'home';
const header = document.querySelector('[data-site-header]');
const headerLayout = header?.querySelector('.site-header__layout');
const navigation = header?.querySelector('#site-header-navigation');
const menuToggle = header?.querySelector('[data-menu-toggle]');
const searchToggle = header?.querySelector('[data-search-toggle]');
const searchPanel = header?.querySelector('#site-search-panel');
const searchTagList = header?.querySelector('[data-search-tags]');
const desktopNavigation = window.matchMedia('(min-width: 1400px)');

if (header && page !== 'home') header.classList.add('site-header--light');

const mobileTitle = header?.querySelector('[data-mobile-title]');
if (mobileTitle && pageTitles[page]) {
  mobileTitle.textContent = pageTitles[page];
  mobileTitle.hidden = false;
}

const activePage = page === 'projects' ? 'projects' : page === 'notice' ? 'notice' : page === 'qna' ? 'qna' : '';
const activeItem = activePage && header?.querySelector(`[data-nav-item="${activePage}"]`);
if (activeItem) {
  activeItem.classList.add('is-active');
  activeItem.querySelector('a')?.setAttribute('aria-current', 'page');
}

if (searchTagList) {
  searchTagList.replaceChildren(...['GRAPHIC', 'AI', 'VIBE CODING', 'BX', 'etc.'].map((tag) => {
    const item = document.createElement('li');
    item.textContent = `#${tag}`;
    return item;
  }));
}

const setMenuOpen = (isOpen) => {
  if (!menuToggle || !headerLayout || !navigation) return;
  if (isOpen && searchToggle?.getAttribute('aria-expanded') === 'true') setSearchOpen(false);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
  navigation.setAttribute('aria-hidden', String(!desktopNavigation.matches && !isOpen));
  headerLayout.classList.toggle('is-menu-open', isOpen);
};

const setSearchOpen = (isOpen) => {
  if (!searchToggle || !searchPanel || !header || !headerLayout) return;
  if (isOpen && menuToggle?.getAttribute('aria-expanded') === 'true') setMenuOpen(false);
  searchToggle.setAttribute('aria-expanded', String(isOpen));
  searchToggle.setAttribute('aria-label', isOpen ? '프로젝트 검색 닫기' : '프로젝트 검색 열기');
  searchPanel.setAttribute('aria-hidden', String(!isOpen));
  searchPanel.inert = !isOpen;
  header.classList.toggle('is-search-open', isOpen);
  headerLayout.classList.toggle('is-search-open', isOpen);
};

if (menuToggle && headerLayout && navigation) {
  document.documentElement.classList.add('has-menu-toggle');
  menuToggle.hidden = false;
  setMenuOpen(false);
  menuToggle.addEventListener('click', () => {
    headerLayout.classList.add('has-menu-motion');
    setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
  });
  desktopNavigation.addEventListener('change', () => {
    headerLayout.classList.remove('has-menu-motion');
    setMenuOpen(false);
  });
}

if (searchToggle && searchPanel && header && headerLayout) {
  setSearchOpen(false);
  searchToggle.addEventListener('click', () => {
    setSearchOpen(searchToggle.getAttribute('aria-expanded') !== 'true');
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (searchToggle?.getAttribute('aria-expanded') === 'true') {
    setSearchOpen(false);
    searchToggle.focus();
  } else if (menuToggle?.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false);
    menuToggle.focus();
  }
});