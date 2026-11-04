import { initProjectsSlider } from './modules/projects-slider.js';
import { initProjectsFilter } from './modules/projects-filter.js';

const menuToggle = document.querySelector('[data-menu-toggle]');
const siteHeaderLayout = document.querySelector('.site-header__layout');
const siteHeader = document.querySelector('.site-header');
const siteHeaderNavigation = document.querySelector('#site-header-navigation');
const searchToggle = document.querySelector('[data-search-toggle]');
const searchPanel = document.querySelector('#site-search-panel');
const searchTagList = document.querySelector('[data-search-tags]');
const desktopNavigation = window.matchMedia('(min-width: 1400px)');

const searchTagNames = [
  'GRAPHIC',
  'AI',
  'VIBE CODING',
  'BX',
  'etc.'
];

if (searchTagList) {
  const searchTagItems = searchTagNames.map((tagName) => {
    const item = document.createElement('li');
    item.textContent = `#${tagName}`;
    return item;
  });

  searchTagList.replaceChildren(...searchTagItems);
}

const setMenuOpen = (isOpen) => {
  if (!menuToggle || !siteHeaderLayout || !siteHeaderNavigation) {
    return;
  }

  if (isOpen && searchToggle?.getAttribute('aria-expanded') === 'true') {
    setSearchOpen(false);
  }

  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
  siteHeaderNavigation.setAttribute(
    'aria-hidden',
    String(!desktopNavigation.matches && !isOpen),
  );
  siteHeaderLayout.classList.toggle('is-menu-open', isOpen);
};

const setSearchOpen = (isOpen) => {
  if (!searchToggle || !searchPanel || !siteHeader || !siteHeaderLayout) {
    return;
  }

  if (isOpen && menuToggle?.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false);
  }

  searchToggle.setAttribute('aria-expanded', String(isOpen));
  searchToggle.setAttribute(
    'aria-label',
    isOpen ? '프로젝트 검색 닫기' : '프로젝트 검색 열기',
  );
  searchPanel.setAttribute('aria-hidden', String(!isOpen));
  searchPanel.inert = !isOpen;
  siteHeader.classList.toggle('is-search-open', isOpen);
  siteHeaderLayout.classList.toggle('is-search-open', isOpen);
};

if (menuToggle && siteHeaderLayout && siteHeaderNavigation) {
  document.documentElement.classList.add('has-menu-toggle');
  menuToggle.hidden = false;

  setMenuOpen(false);

  menuToggle.addEventListener('click', () => {
    siteHeaderLayout.classList.add('has-menu-motion');
    setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  desktopNavigation.addEventListener('change', () => {
    siteHeaderLayout.classList.remove('has-menu-motion');
    setMenuOpen(false);
  });
}

if (searchToggle && searchPanel && siteHeader && siteHeaderLayout) {
  setSearchOpen(false);

  searchToggle.addEventListener('click', () => {
    const isOpen = searchToggle.getAttribute('aria-expanded') !== 'true';
    setSearchOpen(isOpen);
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') {
    return;
  }

  if (searchToggle?.getAttribute('aria-expanded') === 'true') {
    setSearchOpen(false);
    searchToggle.focus();
    return;
  }

  if (menuToggle?.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false);
    menuToggle.focus();
  }
});

initProjectsSlider();
initProjectsFilter();
