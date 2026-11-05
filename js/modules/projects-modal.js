const selectors = {
  cards: '.project-card',
  dialog: '[data-project-modal]',
  close: '[data-project-modal-close]',
  image: '[data-project-modal-image]',
  title: '[data-project-modal-title]',
  subtitle: '[data-project-modal-subtitle]',
  body: '[data-project-modal-body]',
  scroll: '[data-project-modal-scroll]',
};

const description =
  'This project explores new possibilities in design by rethinking familiar experiences from a fresh perspective. Through thoughtful forms, emerging technologies, and human-centered research, it considers how small changes in everyday life can create more meaningful connections.';
const additionalDescription = 'Detailed project information will be added soon.';
const closeDuration = 650;
const modalImageSrc = 'images/test-img.png';

/* 이미지를 미리 받아 디코딩해 두면 모달이 올라오는 동안 메인 스레드가 막히지 않는다. */
const preloadModalImage = () => {
  const preload = new Image();
  preload.decoding = 'async';
  preload.src = modalImageSrc;
  return preload.decode ? preload.decode().catch(() => {}) : Promise.resolve();
};

export function initProjectsModal() {
  const cards = document.querySelectorAll(selectors.cards);
  const dialog = document.querySelector(selectors.dialog);

  if (!cards.length || !(dialog instanceof HTMLDialogElement)) {
    return;
  }

  const closeButton = dialog.querySelector(selectors.close);
  const image = dialog.querySelector(selectors.image);
  const title = dialog.querySelector(selectors.title);
  const subtitle = dialog.querySelector(selectors.subtitle);
  const body = dialog.querySelector(selectors.body);
  const scroller = dialog.querySelector(selectors.scroll);
  const panel = dialog.querySelector('.project-modal__panel');

  if (
    !(closeButton instanceof HTMLButtonElement) ||
    !(image instanceof HTMLImageElement) ||
    !(title instanceof HTMLElement) ||
    !(subtitle instanceof HTMLElement) ||
    !(body instanceof HTMLElement) ||
    !(scroller instanceof HTMLElement) ||
    !(panel instanceof HTMLElement)
  ) {
    return;
  }

  let activeCard = null;
  let closeTimer = 0;
  let isOpening = false;
  let lockX = 0;
  let lockY = 0;

  /* 페이지 스크롤바는 그대로 두고(레이아웃 변동 없음), 모달이 열려 있는 동안
     배경 페이지만 스크롤되지 않도록 막는다. */
  const canScrollInside = () => scroller.scrollHeight > scroller.clientHeight;

  const blockBackgroundScroll = (event) => {
    if (!dialog.open) {
      return;
    }

    if (!scroller.contains(event.target) || !canScrollInside()) {
      event.preventDefault();
    }
  };

  const keepPageScrollPosition = () => {
    if (!dialog.open) {
      return;
    }

    if (window.scrollX !== lockX || window.scrollY !== lockY) {
      window.scrollTo({ left: lockX, top: lockY, behavior: 'instant' });
    }
  };

  preloadModalImage();

  dialog.addEventListener('wheel', blockBackgroundScroll, { passive: false });
  dialog.addEventListener('touchmove', blockBackgroundScroll, { passive: false });
  window.addEventListener('scroll', keepPageScrollPosition, { passive: true });

  const closeModal = () => {
    if (!dialog.open || dialog.classList.contains('is-closing')) {
      return;
    }

    dialog.classList.remove('is-open');
    dialog.classList.add('is-closing');

    const finishClose = () => {
      window.clearTimeout(closeTimer);
      if (dialog.open) {
        dialog.close();
      }
      dialog.classList.remove('is-closing');
      activeCard?.focus({ preventScroll: true });
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finishClose();
      return;
    }

    closeTimer = window.setTimeout(finishClose, closeDuration);
  };

  const openModal = async (card) => {
    if (dialog.open || isOpening) {
      return;
    }

    const projectTitle = card.querySelector('.project-card__title')?.textContent?.trim();
    const category = card.querySelector('.project-card__category')?.textContent?.trim();
    const author = card.querySelector('.project-card__name')?.textContent?.trim();
    const thumbnail = card.querySelector('.project-card__thumb img');

    if (!projectTitle || !thumbnail) {
      return;
    }

    activeCard = card;
    isOpening = true;
    image.src = modalImageSrc;
    image.alt = projectTitle;
    title.textContent = projectTitle;
    subtitle.textContent = [category, author].filter(Boolean).join(' · ');
    body.replaceChildren();

    [description, additionalDescription].forEach((text) => {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      body.append(paragraph);
    });

    /* 이미지 디코딩이 끝난 뒤에 애니메이션을 시작한다 (최대 300ms 대기). */
    await Promise.race([
      image.decode ? image.decode().catch(() => {}) : Promise.resolve(),
      new Promise((resolve) => window.setTimeout(resolve, 300)),
    ]);
    isOpening = false;

    if (dialog.open) {
      return;
    }

    lockX = window.scrollX;
    lockY = window.scrollY;
    scroller.scrollTop = 0;

    dialog.showModal();
    /* 자동 포커스로 밀린 스크롤 위치가 있으면 즉시 원위치 */
    dialog.scrollTop = 0;
    dialog.scrollLeft = 0;

    /* 시작 상태(translateY(100%))를 먼저 렌더링에 반영한 뒤 is-open 을 붙여야
       닫힐 때와 동일하게 transition 이 실행된다. */
    void panel.getBoundingClientRect();

    window.requestAnimationFrame(() => {
      dialog.classList.add('is-open');
      closeButton.focus({ preventScroll: true });
    });
  };

  cards.forEach((card) => {
    card.setAttribute('role', 'button');
    card.setAttribute('aria-haspopup', 'dialog');
    const projectTitle = card.querySelector('.project-card__title')?.textContent?.trim();
    if (projectTitle) {
      card.setAttribute('aria-label', `${projectTitle} 프로젝트 상세 보기`);
    }

    card.addEventListener('click', () => openModal(card));
    card.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }

      event.preventDefault();
      openModal(card);
    });
  });

  closeButton.addEventListener('click', closeModal);
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal();
    }
  });
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeModal();
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      closeModal();
    }
  });
}