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

  // ── 메인 화면 파티클 ────────────────────────────────────────────
(() => {
  const canvas = document.getElementById('sphere');
  const ctx = canvas.getContext('2d');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
 
  // ── 설정 ────────────────────────────────────────────
  const CONFIG = {
    count: 5500,          // 바깥 껍데기 파티클 개수
    coreCount: 2600,      // 내부에 집약된 코어 파티클 개수
    // (모바일이 버벅이면 count 3000 / coreCount 1500 정도로)
    radius: 0.33,         // 캔버스 대비 구체 반지름
    perspective: 2.4,     // 작을수록 원근감이 강함
    autoSpin: 0.0016,     // 자동 회전 속도
 
    // 파티클 크기 (px)
    sizeMin: 0.5,         // 가장 뒤쪽 파티클 지름
    sizeDepth: 0.7,       // 앞쪽일수록 더해지는 지름
 
    // 흩어진 먼지 파티클
    strayRatio: 0.12,     // 전체 중 먼지 비율
    strayDim: 0.55,       // 먼지 투명도 배율
    straySize: 0.7,       // 먼지 크기 배율
 
    // 우측 하단이 배경에 묻히는 효과 (화면 기준 고정)
    fadeStart: 0.05,      // 이 지점부터 투명해지기 시작 (-1 ~ 1)
    fadeEnd: 0.95,        // 이 지점에서 가장 투명
    fadeStrength: 0.92,   // 최대 투명 정도 (1이면 완전히 사라짐)
 
    // 내부 코어: 중심으로 갈수록 촘촘하고, 껍데기와 따로 회전/변형
    coreRadius: 5,      // 코어 크기 (바깥 구체 대비)
    coreDensity: 5,     // 클수록 중심에 더 집약됨
    coreSpin: 1.7,        // 껍데기 대비 회전 배율 (반대 방향)
    coreMorph: 0.7,       // 코어 변형 강도 (껍데기와 별개 타이밍)
    coreSize: 0.85,       // 코어 입자 크기 배율
 
    // 마우스: 범위 안 파티클이 커서 쪽으로 은은하게 끌려옴
    mouseRadius: 0.16,
    pull: 0.30,
    follow: 0.07,
    cursorLag: 0.10,
 
    // 불규칙 변형 후 원형 복귀
    morphAmount: 0.55,
    morphSpeed: 1.0,
  };
 
  let size = 0, dpr = 1;
  let rotY = 0, rotX = -0.25;
  let velY = CONFIG.autoSpin, velX = 0;
  const pointer = { x: 0, y: 0, active: false, down: false, lastX: 0, lastY: 0 };
  const soft = { x: 0, y: 0, influence: 0 };
 
  const smoothstep = (a, b, x) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };
 
  // ── 파티클 생성: 피보나치 구면 분포 + 두께 + 먼지 ──────────
  const particles = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < CONFIG.count; i++) {
    const y = 1 - (i / (CONFIG.count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const stray = Math.random() < CONFIG.strayRatio;
    particles.push({
      bx: Math.cos(theta) * r,
      by: y,
      bz: Math.sin(theta) * r,
      ox: 0, oy: 0,
      lag: 0.5 + Math.random(),
      seed: Math.random() * Math.PI * 2,
      // 일반: 표면 안쪽으로 두께를 줘서 속이 찬 느낌
      // 먼지: 바깥쪽, 멀어질수록 급격히 드물게
      shell: stray ? 1.04 + Math.pow(Math.random(), 2.5) * 0.7
                   : 0.82 + Math.random() * 0.18,
      dim: stray ? CONFIG.strayDim : 1,
      scl: stray ? CONFIG.straySize : 1,
    });
  }
 
  // 코어: 구 내부를 채우되 중심에 몰리도록 반지름 분포를 치우치게 함
  for (let i = 0; i < CONFIG.coreCount; i++) {
    const u = Math.random() * 2 - 1;
    const a = Math.random() * Math.PI * 2;
    const rr = Math.sqrt(1 - u * u);
    particles.push({
      core: true,
      bx: Math.cos(a) * rr,
      by: u,
      bz: Math.sin(a) * rr,
      ox: 0, oy: 0,
      lag: 0.5 + Math.random(),
      seed: Math.random() * Math.PI * 2,
      shell: CONFIG.coreRadius * Math.pow(Math.random(), CONFIG.coreDensity),
      dim: 1,
      scl: CONFIG.coreSize,
    });
  }
 
  // ── 불규칙 변형 ─────────────────────────────────────
  function shapeNoise(x, y, z, t) {
    const a = Math.sin(x * 2.1 + Math.sin(y * 1.7 + t * 0.5) * 1.4 + t * 0.7);
    const b = Math.sin(y * 2.7 - t * 0.6 + z * 1.9 + Math.sin(x * 1.3 + t * 0.3));
    const c = Math.sin(z * 2.3 + t * 0.4 + x * 1.1 + Math.sin(z * 2.0 - t * 0.8));
    return (a + b + c) / 3;
  }
  function morphEnvelope(t) {
    const w = Math.sin(t * 0.37) * 0.6 + Math.sin(t * 0.91 + 1.7) * 0.25 + Math.sin(t * 0.17 + 4.0) * 0.25;
    const v = Math.max(0, w + 0.05);
    const s = Math.min(1, v / 0.7);
    return s * s * (3 - 2 * s);
  }
 
  // ── 리사이즈 ────────────────────────────────────────
  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    size = rect.width;
    canvas.width = canvas.height = Math.round(size * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();
 
  // ── 포인터 ─────────────────────────────────────────
  function toLocal(e) {
    const rect = canvas.getBoundingClientRect();
    return { x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height };
  }
  canvas.addEventListener('pointermove', (e) => {
    const p = toLocal(e);
    if (!pointer.active) { soft.x = p.x; soft.y = p.y; }
    pointer.x = p.x; pointer.y = p.y; pointer.active = true;
    if (pointer.down) {
      velY = (e.clientX - pointer.lastX) * 0.006;
      velX = (e.clientY - pointer.lastY) * 0.006;
      pointer.lastX = e.clientX; pointer.lastY = e.clientY;
    }
  });
  canvas.addEventListener('pointerdown', (e) => {
    pointer.down = true; pointer.lastX = e.clientX; pointer.lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });
  const release = () => { pointer.down = false; };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);
  canvas.addEventListener('pointerleave', () => { pointer.active = false; });
 
  // ── 렌더 루프 ───────────────────────────────────────
  let t = 0;
  function frame() {
    t += 0.016 * CONFIG.morphSpeed;
 
    if (!pointer.down) {
      velY += (CONFIG.autoSpin - velY) * 0.03;
      velX *= 0.95;
    }
    rotY += reduceMotion ? 0 : velY;
    rotX += reduceMotion ? 0 : velX;
    rotX = Math.max(-1.2, Math.min(1.2, rotX));
 
    soft.x += (pointer.x - soft.x) * CONFIG.cursorLag;
    soft.y += (pointer.y - soft.y) * CONFIG.cursorLag;
    soft.influence += ((pointer.active && !pointer.down && !reduceMotion ? 1 : 0) - soft.influence) * 0.06;
 
    const R = size * CONFIG.radius;
    const cx = size / 2, cy = size / 2;
 
    // 그룹별 회전/변형: 코어는 반대 방향으로 더 빠르게, 변형 타이밍도 따로
    const tc = t * 1.3 + 9;
    const G = {
      shell: {
        cosY: Math.cos(rotY), sinY: Math.sin(rotY),
        cosX: Math.cos(rotX), sinX: Math.sin(rotX),
        morph: reduceMotion ? 0 : morphEnvelope(t) * CONFIG.morphAmount,
        t, zr: 1,
      },
      core: {
        cosY: Math.cos(-rotY * CONFIG.coreSpin + 0.7), sinY: Math.sin(-rotY * CONFIG.coreSpin + 0.7),
        cosX: Math.cos(rotX * 0.6 + 0.5), sinX: Math.sin(rotX * 0.6 + 0.5),
        morph: reduceMotion ? 0 : (0.25 + morphEnvelope(tc) * 0.75) * CONFIG.coreMorph,
        t: tc, zr: CONFIG.coreRadius,
      },
    };
 
    ctx.clearRect(0, 0, size, size);
 
    for (const p of particles) {
      const g = p.core ? G.core : G.shell;
      const { cosY, sinY, cosX, sinX } = g;
 
      // 1) 변형 + 두께(shell)
      const k = (1 + g.morph * shapeNoise(p.bx, p.by, p.bz, g.t)) * p.shell;
      const x = p.bx * k, y = p.by * k, z = p.bz * k;
 
      // 2) 회전 + 원근 투영
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;
      const y1 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;
      const scale = CONFIG.perspective / (CONFIG.perspective + z2);
      const sx = cx + x1 * R * scale;
      const sy = cy + y1 * R * scale;
 
      // 3) 커서에 은은하게 끌림
      let tx = 0, ty = 0;
      if (soft.influence > 0.001) {
        const dx = soft.x - sx / size;
        const dy = soft.y - sy / size;
        const d = Math.hypot(dx, dy);
        if (d < CONFIG.mouseRadius) {
          const w = smoothstep(0, 1, 1 - d / CONFIG.mouseRadius);
          const amt = w * CONFIG.pull * soft.influence;
          tx = dx * amt; ty = dy * amt;
        }
      }
      const ease = CONFIG.follow * p.lag;
      p.ox += (tx - p.ox) * ease;
      p.oy += (ty - p.oy) * ease;
 
      // 4) 화면 기준 우측 하단 → 투명 + 인디고 (회전해도 고정)
      const light = (x1 + y1) * 0.7071;
      const fade = smoothstep(CONFIG.fadeStart, CONFIG.fadeEnd, light);
      const tint = smoothstep(-0.3, 0.6, light);
 
      const depth = Math.max(0, Math.min(1, (1 - z2 / g.zr) / 2));
      const alpha = (0.25 + depth * 0.75) * (1 - fade * CONFIG.fadeStrength) * p.dim;
      if (alpha < 0.02) continue;
 
      const c = Math.round(255 - 165 * tint);   // 흰색 → 인디고
      ctx.fillStyle = `rgba(${c}, ${c}, 255, ${alpha})`;
 
      const s = (CONFIG.sizeMin + depth * CONFIG.sizeDepth) * scale * p.scl;
      ctx.fillRect(sx + p.ox * size - s / 2, sy + p.oy * size - s / 2, s, s);
    }
 
    requestAnimationFrame(frame);
  }
  frame();
})();