/**
 * Projects Section Infinite Carousel Slider
 * - 3초 자동 슬라이드 (루프)
 * - 중앙 콘텐츠 강조 (양 옆 축소 및 명도 감소)
 * - 터치 스와이프 및 클릭 수동 인터랙션
 */

const SELECTORS = {
  root: '[data-projects-slider]',
  track: '[data-slider-track]',
  item: '.projects-slider__item',
};

const AUTO_PLAY_DELAY = 3000;
const SWIPE_THRESHOLD = 40;

export function initProjectsSlider(root = document.querySelector(SELECTORS.root)) {
  if (!root) {
    return;
  }

  const track = root.querySelector(SELECTORS.track);
  if (!track) {
    return;
  }

  const originalItems = Array.from(track.querySelectorAll(SELECTORS.item));
  const originalCount = originalItems.length;
  if (originalCount === 0) {
    return;
  }

  // 앞뒤로 원본 아이템을 복제하여 무한 루프를 구성한다.
  const prevClones = originalItems.map((item) => {
    const clone = item.cloneNode(true);
    clone.classList.add('is-clone');
    clone.setAttribute('aria-hidden', 'true');
    return clone;
  });

  const nextClones = originalItems.map((item) => {
    const clone = item.cloneNode(true);
    clone.classList.add('is-clone');
    clone.setAttribute('aria-hidden', 'true');
    return clone;
  });

  prevClones.forEach((clone) => track.insertBefore(clone, track.firstChild));
  nextClones.forEach((clone) => track.appendChild(clone));

  let allItems = Array.from(track.querySelectorAll(SELECTORS.item));
  let currentIndex = originalCount; // 원본 첫 번째 아이템(인덱스 6)에서 시작
  let timer = null;
  let isAnimating = false;

  // 터치/마우스 드래그 상태
  let isPointerDown = false;
  let startX = 0;
  let currentX = 0;
  let hasMoved = false;

  const updatePosition = (animate = true) => {
    if (animate) {
      track.classList.remove('no-transition');
    } else {
      track.classList.add('no-transition');
    }

    const viewportWidth = root.offsetWidth;
    const activeItem = allItems[currentIndex];
    if (!activeItem) {
      return;
    }

    const cardWidth = activeItem.offsetWidth;
    const computedGap = parseFloat(window.getComputedStyle(track).gap) || 20;

    const cardLeft = currentIndex * (cardWidth + computedGap);
    const cardCenter = cardLeft + cardWidth / 2;
    const viewportCenter = viewportWidth / 2;
    const translateX = viewportCenter - cardCenter;

    track.style.transform = `translate3d(${translateX}px, 0, 0)`;

    // 가운데 아이템 활성화 및 양 옆 아이템 축소/명도 감소 제어
    allItems.forEach((item, idx) => {
      const isActive = idx === currentIndex;
      item.classList.toggle('is-active', isActive);
      if (isActive) {
        item.removeAttribute('aria-hidden');
      } else if (item.classList.contains('is-clone')) {
        item.setAttribute('aria-hidden', 'true');
      }
    });
  };

  const startAutoPlay = () => {
    stopAutoPlay();
    timer = setTimeout(() => {
      goToNext();
    }, AUTO_PLAY_DELAY);
  };

  const stopAutoPlay = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  const goToIndex = (targetIndex, animate = true) => {
    if (isAnimating && animate) {
      return;
    }
    isAnimating = animate;
    currentIndex = targetIndex;
    updatePosition(animate);
    startAutoPlay();
  };

  const goToNext = () => {
    goToIndex(currentIndex + 1, true);
  };

  const goToPrev = () => {
    goToIndex(currentIndex - 1, true);
  };

  // 트랜지션 완료 시 무한 루프 랩어라운드 처리
  track.addEventListener('transitionend', () => {
    isAnimating = false;

    // 뒤쪽 클론 영역으로 넘어갔을 때 원본으로 무음 점프
    if (currentIndex >= originalCount * 2) {
      currentIndex = currentIndex - originalCount;
      updatePosition(false);
    }
    // 앞쪽 클론 영역으로 넘어갔을 때 원본으로 무음 점프
    else if (currentIndex < originalCount) {
      currentIndex = currentIndex + originalCount;
      updatePosition(false);
    }
  });

  // 클릭 인터랙션: 비활성 카드를 클릭하면 해당 카드가 가운데로 오도록 이동
  track.addEventListener('click', (event) => {
    if (hasMoved) {
      event.preventDefault();
      event.stopPropagation();
      hasMoved = false;
      return;
    }

    const clickedItem = event.target.closest(SELECTORS.item);
    if (!clickedItem) {
      return;
    }

    const itemIndex = allItems.indexOf(clickedItem);
    if (itemIndex !== -1 && itemIndex !== currentIndex) {
      goToIndex(itemIndex, true);
    }
  });

  // 터치 이벤트 (모바일)
  root.addEventListener(
    'touchstart',
    (event) => {
      stopAutoPlay();
      isPointerDown = true;
      hasMoved = false;
      startX = event.touches[0].clientX;
      currentX = startX;
    },
    { passive: true },
  );

  root.addEventListener(
    'touchmove',
    (event) => {
      if (!isPointerDown) {
        return;
      }
      currentX = event.touches[0].clientX;
      if (Math.abs(currentX - startX) > 10) {
        hasMoved = true;
      }
    },
    { passive: true },
  );

  root.addEventListener('touchend', () => {
    if (!isPointerDown) {
      return;
    }
    isPointerDown = false;
    const deltaX = currentX - startX;

    if (Math.abs(deltaX) >= SWIPE_THRESHOLD) {
      if (deltaX < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    } else {
      startAutoPlay();
    }
  });

  // 마우스 드래그 이벤트 (데스크톱)
  root.addEventListener('mousedown', (event) => {
    stopAutoPlay();
    isPointerDown = true;
    hasMoved = false;
    startX = event.clientX;
    currentX = startX;
    track.classList.add('is-dragging');
  });

  window.addEventListener('mousemove', (event) => {
    if (!isPointerDown) {
      return;
    }
    currentX = event.clientX;
    if (Math.abs(currentX - startX) > 8) {
      hasMoved = true;
    }
  });

  window.addEventListener('mouseup', () => {
    if (!isPointerDown) {
      return;
    }
    isPointerDown = false;
    track.classList.remove('is-dragging');
    const deltaX = currentX - startX;

    if (Math.abs(deltaX) >= SWIPE_THRESHOLD) {
      if (deltaX < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    } else {
      startAutoPlay();
    }
  });

  // 호버 시 일시 정지 및 재개
  root.addEventListener('mouseenter', () => {
    stopAutoPlay();
  });

  root.addEventListener('mouseleave', () => {
    if (!isPointerDown) {
      startAutoPlay();
    }
  });

  // 키보드 접근성 탐색
  root.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goToNext();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goToPrev();
    }
  });

  // 브라우저 리사이즈 시 중앙 정렬 보정
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updatePosition(false);
    }, 100);
  });

  // 초기 렌더링
  requestAnimationFrame(() => {
    updatePosition(false);
    startAutoPlay();
  });
}
