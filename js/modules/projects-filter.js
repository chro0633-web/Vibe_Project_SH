/**
 * Projects Subpage Category Filter Module
 * - 카테고리 필터링 (All, Graphic, AI, Branding, etc.)
 * - 현재 선택된 메뉴 밑줄 및 활성 상태(aria-pressed) 동기화
 * - 선택된 카테고리에 맞는 썸네일 카드 노출/숨김
 */

export function initProjectsFilter() {
  const filterButtons = document.querySelectorAll('[data-filter]');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterButtons.length === 0 || projectCards.length === 0) {
    return;
  }

  const applyFilter = (selectedCategory) => {
    filterButtons.forEach((button) => {
      const isActive = button.getAttribute('data-filter') === selectedCategory;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    projectCards.forEach((card) => {
      const cardCategories = (card.getAttribute('data-category') || '')
        .split(',')
        .map((category) => category.trim());
      const matches = selectedCategory === 'All' || cardCategories.includes(selectedCategory);

      card.classList.toggle('is-hidden', !matches);
      card.toggleAttribute('hidden', !matches);
    });
  };

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedCategory = btn.getAttribute('data-filter');
      if (selectedCategory) applyFilter(selectedCategory);
    });
  });

  const requestedCategory = new URLSearchParams(window.location.search).get('category');
  const requestedButton = [...filterButtons].find(
    (button) => button.getAttribute('data-filter') === requestedCategory,
  );
  requestedButton?.click();
}
