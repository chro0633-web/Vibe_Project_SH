const menuToggle = document.querySelector('[data-menu-toggle]');
const siteHeaderLayout = document.querySelector('.site-header__layout');
const siteHeaderNavigation = document.querySelector('#site-header-navigation');
const desktopNavigation = window.matchMedia('(min-width: 1400px)');

if (menuToggle && siteHeaderLayout && siteHeaderNavigation) {
  document.documentElement.classList.add('has-menu-toggle');
  menuToggle.hidden = false;

  const setMenuOpen = (isOpen) => {
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
    siteHeaderNavigation.setAttribute(
      'aria-hidden',
      String(!desktopNavigation.matches && !isOpen),
    );
    siteHeaderLayout.classList.toggle('is-menu-open', isOpen);
  };

  setMenuOpen(false);

  menuToggle.addEventListener('click', () => {
    setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  document.addEventListener('keydown', (event) => {
    if (
      event.key === 'Escape' &&
      menuToggle.getAttribute('aria-expanded') === 'true'
    ) {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });

  desktopNavigation.addEventListener('change', () => setMenuOpen(false));
}
