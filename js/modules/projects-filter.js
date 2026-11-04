/**
 * Projects Subpage Category Filter Module
 * - 카테고리 필터링 (All, Product, Mobility, Spatial, Interaction)
 * - 현재 선택된 메뉴 밑줄 및 활성 상태(aria-pressed) 동기화
 * - 선택된 카테고리에 맞는 썸네일 카드 노출/숨김
 */

export function initProjectsFilter() {
  const filterButtons = document.querySelectorAll('[data-filter]');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterButtons.length === 0 || projectCards.length === 0) {
    return;
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedCategory = btn.getAttribute('data-filter');

      // 1) 버튼 활성 상태 갱신
      filterButtons.forEach((b) => {
        const isActive = b === btn;
        b.classList.toggle('is-active', isActive);
        b.setAttribute('aria-pressed', String(isActive));
      });

      // 2) 카드 필터링
      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        const matches = selectedCategory === 'All' || cardCategory === selectedCategory;

        if (matches) {
          card.classList.remove('is-hidden');
          card.removeAttribute('hidden');
        } else {
          card.classList.add('is-hidden');
          card.setAttribute('hidden', '');
        }
      });
    });
  });
}

