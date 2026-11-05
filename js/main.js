import { initProjectsSlider } from './modules/projects-slider.js';
import { initProjectsFilter } from './modules/projects-filter.js';
import { initProjectsModal } from './modules/projects-modal.js';

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
initProjectsModal();



  // ── 메인 화면 파티클 ────────────────────────────────────────────
  // ── 메인 화면 파티클 ────────────────────────────────────────────


'use strict';
 
/* ════════════════════════════════════════════════════════════
   설정 — 수정은 이 블록에서만 하면 됩니다
   ════════════════════════════════════════════════════════════ */
const CFG = {
  // 배경 (우주)
  bg: {
    drift: 0.0,             // 별/성운이 흐르는 속도 (0 = 정지, 0.018 = 천천히 흐름)
    mouseParallax: 0.02,    // 마우스에 따른 별 시차 (0 = 꺼짐)
    nebula: 0.45,           // 성운 밝기 (0이면 별만)
    starBright: 1.0,        // 별 밝기
    grain: 0.035,           // 필름 그레인 세기
    maxDpr: 1.5,            // 해상도 상한 (성능)
  },
 
  // 구체 본체
  sphere: {
    count: 4500,            // 껍데기 파티클 수
    coreCount: 2000,        // 내부 코어 파티클 수
    radius: 0.32,           // 화면 짧은 변 대비 구체 반지름
    perspective: 2.4,       // 작을수록 원근감이 강함
    autoSpin: 0.0016,       // 자동 회전 속도 (rad/frame)
    sizeMin: 0.5,           // 가장 뒤쪽 입자 지름 (px)
    sizeDepth: 0.7,         // 앞쪽일수록 더해지는 지름 (px)
 
    strayRatio: 0.12,       // 바깥에 흩어진 먼지 입자 비율
    strayDim: 0.55,         // 먼지 입자 밝기 배율
    straySize: 0.7,         // 먼지 입자 크기 배율
 
    // 변형: 불규칙하게 일그러졌다가 원형으로 복귀
    morphAmount: 0.45,      // 껍데기 변형 강도
    coreMorph: 0.7,         // 코어 변형 강도
    morphSpeed: 1.0,        // 변형 속도 배율
 
    // 코어
    coreRadius: 0.75,       // 코어 크기 (구체 대비)
    coreDensity: 1.6,       // 클수록 중심에 더 집약
    coreSpin: 1.7,          // 껍데기 대비 회전 배율 (반대 방향)
    coreSize: 0.85,         // 코어 입자 크기 배율
 
    // 우측 하단이 배경에 묻히는 효과 (화면 기준 고정, -1 ~ 1)
    fadeStart: 0.05,
    fadeEnd: 0.95,
    fadeStrength: 0.92,     // 1이면 완전히 사라짐
 
    // 마우스: 범위 안 입자가 커서 쪽으로 은은하게 끌림
    mouseRadius: 0.16,      // 영향 범위 (화면 짧은 변 대비)
    pull: 0.30,             // 끌림 정도
    follow: 0.07,           // 따라가는 부드러움 (작을수록 느림)
    cursorLag: 0.10,        // 커서 위치 지연
  },
 
  // 코어 → 외곽 방사선: 중심은 직선, 바깥은 흩어지는 입자
  lines: {
    count: 10,              // 선 개수
    alpha: 0.5,
    width: 0.7,
    solid: 0.42,            // 중심에서 이 비율까지만 직선 유지
    dots: 38,               // 선 하나당 외곽 입자 수
    scatter: 0.07,          // 외곽으로 갈수록 흩어지는 폭
  },
 
  // 빛번짐: 구체 뒤 후광 + 밝은 입자에서 번지는 빛
  glow: {
    haloRadius: 1.9,
    haloAlpha: 0.10,
    every: 5,               // N개 중 1개를 광원으로 (작을수록 많이 번짐)
    size: 16,
    alpha: 0.14,
  },
 
  // 구체 주위에 멈춰 있다가 마우스가 움직이면 모여들어 따라다니는 입자
  dust: {
    count: 20,
    inner: 1.15,            // 대기 위치가 구체 중심에서 최소 이 거리(구체 반지름=1) 밖
    radius: [1.1, 1.7],     // 대기 위치의 3D 반경 범위
    size: [0.6, 1.8],       // 기본 크기 (px)
    frontSize: 1.6,         // 구체 앞쪽에 있는 입자의 크기 배율
    alpha: 0.7,
    frontAlpha: 0.9,
    swarm: 0.5,            // 커서 주변에 모이는 범위 (클수록 넓게 흩어짐)
    follow: 0.06,           // 커서를 따라가는 속도
    restore: 0.025,         // 제자리로 돌아가는 속도
    idleMs: 600,            // 마우스가 멈춘 뒤 복귀를 시작하기까지의 시간 (ms)
    orbit: 0.6,             // 커서 주변에서 맴도는 속도 (0이면 정지)
  },
};
 
/* ════════════════════════════════════════════════════════════
   공용 유틸
   ════════════════════════════════════════════════════════════ */
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smoothstep = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
 
/* ════════════════════════════════════════════════════════════
   1. 배경: 우주 (WebGL 셰이더 — 별 3겹 + 희미한 성운 + 그레인)
   ════════════════════════════════════════════════════════════ */
(() => {
  const B = CFG.bg;
  const canvas = document.getElementById('bg');
  if (!canvas) return;
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
  if (!gl) return;
 
  const VERT = `attribute vec2 aPos; void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;
  const FRAG = `
    precision highp float;
    uniform vec2 uRes, uMouse;
    uniform float uTime, uDrift, uPar, uNeb, uStar, uGrain;
 
    float hash(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
    float noise(vec2 p){
      vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y);
    }
    float fbm(vec2 p){
      float v = 0.0, a = 0.5; mat2 m = mat2(1.6,1.2,-1.2,1.6);
      for(int i=0;i<4;i++){ v += a*noise(p); p = m*p; a *= 0.5; }
      return v;
    }
 
    // 별 한 겹: 격자 칸마다 확률적으로 별 하나, 깜빡임 포함
    vec3 stars(vec2 p, float density, float radius, float seed){
      vec2 g = floor(p), f = fract(p) - 0.5;
      float h = hash(g + seed);
      if (h > density) return vec3(0.0);
      vec2 off = (vec2(hash(g+seed+1.3), hash(g+seed+2.7)) - 0.5) * 0.7;
      float d = length(f - off);
      float core = smoothstep(radius, 0.0, d);
      float glow = smoothstep(radius*3.5, 0.0, d) * 0.15;
      float tw = 0.65 + 0.35 * sin(uTime * (0.8 + h*3.0) + h * 60.0);
      float lum = (core*core + glow) * tw * (0.35 + 0.65 * hash(g+seed+4.1));
      vec3 tint = mix(vec3(0.75,0.85,1.0), vec3(1.0,0.92,0.82), hash(g+seed+7.7));
      return tint * lum;
    }
 
    void main(){
      vec2 uv = (gl_FragCoord.xy - 0.5*uRes) / min(uRes.x, uRes.y);
      float t = uTime * uDrift;
 
      // 성운: 아주 어두운 남색/보라 연기 (우측 하단이 조금 더 푸름)
      vec2 np = uv * 1.1 + vec2(t*2.0, -t*1.2);
      float n1 = fbm(np + 2.0*fbm(np + t));
      float n2 = fbm(np*1.7 + vec2(7.3, 1.9) - t*1.5);
      vec3 neb = mix(vec3(0.0,0.035,0.13), vec3(0.11,0.04,0.17), n2);
      float mask = smoothstep(0.35, 0.85, n1);
      float lowerRight = smoothstep(0.7, -0.3, -(uv.x - uv.y)*0.6);
      vec3 col = vec3(0.012) + neb * mask * uNeb * (0.35 + 0.65*lowerRight);
 
      // 별 3겹: 가까운 층일수록 크고 빠르게 움직여 시차를 만듦
      // vec2(좌우, 상하) 부호를 뒤집으면 흐르는 방향이 반대가 됨
      vec2 m = uMouse * uPar;
      vec3 s = vec3(0.0);
      s += stars(uv * 46.0 + vec2( t*40.0, -t*22.0) + m*20.0, 0.16, 0.09,  1.0) * 0.55;  // 먼 별
      s += stars(uv * 26.0 + vec2( t*75.0, -t*40.0) + m*45.0, 0.11, 0.08,  9.0) * 0.85;  // 중간
      s += stars(uv * 12.0 + vec2(t*140.0, -t*75.0) + m*95.0, 0.06, 0.07, 21.0) * 1.25;  // 가까운 별
      col += s * uStar;
 
      col *= 1.0 - 0.35*dot(uv,uv);                                   // 가장자리 비네팅
      col += (hash(gl_FragCoord.xy + fract(uTime)*91.7) - 0.5) * uGrain;
      gl_FragColor = vec4(col, 1.0);
    }`;
 
  const compile = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  gl.useProgram(prog);
 
  // 화면 전체를 덮는 삼각형 하나
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
 
  const uni = (n) => gl.getUniformLocation(prog, n);
  gl.uniform1f(uni('uDrift'), B.drift);
  gl.uniform1f(uni('uPar'), B.mouseParallax);
  gl.uniform1f(uni('uNeb'), B.nebula);
  gl.uniform1f(uni('uStar'), B.starBright);
  gl.uniform1f(uni('uGrain'), B.grain);
  const uRes = uni('uRes'), uTime = uni('uTime'), uMouse = uni('uMouse');
 
  // 마우스 시차: 화면 중심 기준 -1~1, 부드럽게 따라옴
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  addEventListener('pointermove', (e) => {
    mouse.tx = (e.clientX / innerWidth) * 2 - 1;
    mouse.ty = -((e.clientY / innerHeight) * 2 - 1);
  });
 
  const draw = (time) => {
    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;
    gl.uniform2f(uMouse, mouse.x, mouse.y);
    gl.uniform1f(uTime, time);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, B.maxDpr);
    canvas.width = Math.round(innerWidth * dpr);
    canvas.height = Math.round(innerHeight * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    if (reduceMotion) draw(10);
  };
  addEventListener('resize', resize);
  resize();
 
  if (!reduceMotion) {
    const start = performance.now();
    (function loop(now) { draw((now - start) / 1000 + 10); requestAnimationFrame(loop); })(start);
  }
})();
 
/* ════════════════════════════════════════════════════════════
   2. 파티클 구체 (2D 캔버스, 화면 전체)
      껍데기 + 먼지 + 코어 + 방사선 + 빛번짐 + 마우스 반응 입자
   ════════════════════════════════════════════════════════════ */
(() => {
  const C = CFG.sphere, L = CFG.lines, GL = CFG.glow, D = CFG.dust;
  const canvas = document.getElementById('sphere');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
 
  // ── 상태 ────────────────────────────────────────────
  let W = 0, H = 0, S = 0;                          // 화면 가로, 세로, 짧은 변
  let rotY = 0, rotX = -0.25, velY = C.autoSpin, velX = 0;
  let t = 0, lastMove = -1e9, dustInfl = 0;
  const pointer = { x: 0, y: 0, active: false, down: false, lastX: 0, lastY: 0 };
  const soft = { x: 0, y: 0, influence: 0 };        // 지연되어 따라오는 커서
 
  const golden = Math.PI * (3 - Math.sqrt(5));
  const TAU = Math.PI * 2;
 
  // ── 불규칙 변형 ─────────────────────────────────────
  const shapeNoise = (x, y, z, t) =>
    (Math.sin(x * 2.1 + Math.sin(y * 1.7 + t * 0.5) * 1.4 + t * 0.7) +
     Math.sin(y * 2.7 - t * 0.6 + z * 1.9 + Math.sin(x * 1.3 + t * 0.3)) +
     Math.sin(z * 2.3 + t * 0.4 + x * 1.1 + Math.sin(z * 2.0 - t * 0.8))) / 3;
 
  // 변형 강도 0(구체) ↔ 1(최대). 음수 구간에서는 구체로 돌아와 머문다
  const morphEnvelope = (t) => {
    const w = Math.sin(t * 0.37) * 0.6 + Math.sin(t * 0.91 + 1.7) * 0.25 + Math.sin(t * 0.17 + 4.0) * 0.25;
    return smoothstep(0, 1, Math.max(0, w + 0.05) / 0.7);
  };
 
  // ── 데이터 생성 ─────────────────────────────────────
  // 껍데기(피보나치 구면 분포 + 두께 + 바깥 먼지) + 코어(중심에 집약)
  const particles = [];
  for (let i = 0; i < C.count; i++) {
    const y = 1 - (i / (C.count - 1)) * 2, r = Math.sqrt(1 - y * y), th = golden * i;
    const stray = Math.random() < C.strayRatio;
    particles.push({
      bx: Math.cos(th) * r, by: y, bz: Math.sin(th) * r,
      ox: 0, oy: 0,                                   // 커서에 끌려간 오프셋
      lag: 0.5 + Math.random(),
      shell: stray ? 1.04 + Math.pow(Math.random(), 2.5) * 0.7 : 0.82 + Math.random() * 0.18,
      dim: stray ? C.strayDim : 1,
      scl: stray ? C.straySize : 1,
      glow: i % GL.every === 0,
    });
  }
  for (let i = 0; i < C.coreCount; i++) {
    const u = Math.random() * 2 - 1, a = Math.random() * TAU, rr = Math.sqrt(1 - u * u);
    particles.push({
      core: true,
      bx: Math.cos(a) * rr, by: u, bz: Math.sin(a) * rr,
      ox: 0, oy: 0,
      lag: 0.5 + Math.random(),
      shell: C.coreRadius * Math.pow(Math.random(), C.coreDensity),
      dim: 1, scl: C.coreSize, glow: false,
    });
  }
 
  // 방사선: 방향 + 외곽 쪽에서 흩어질 입자
  const solid0 = L.solid * 0.85;                    // 직선 끝보다 살짝 안쪽에서 입자가 시작
  const lineDirs = [];
  for (let i = 0; i < L.count; i++) {
    const y = 1 - ((i + 0.5) / L.count) * 2, r = Math.sqrt(1 - y * y), th = golden * i * 1.7;
    const dots = [];
    for (let j = 0; j < L.dots; j++) {
      const u = solid0 + Math.random() * (1 - solid0);
      dots.push({
        u, amp: L.scatter * smoothstep(solid0, 1, u),   // 바깥일수록 넓게 흩어짐
        jx: Math.random() * 2 - 1, jy: Math.random() * 2 - 1, jz: Math.random() * 2 - 1,
        sz: 0.5 + Math.random() * 0.7, seed: Math.random() * TAU,
      });
    }
    lineDirs.push({ x: Math.cos(th) * r, y, z: Math.sin(th) * r, dots });
  }
 
  // 먼지: 구체 주변 고정 위치(대기)에 있다가 마우스 움직임에 따라 모여듦
  const [dr0, dr1] = D.radius, [ds0, ds1] = D.size;
  const dust = [];
  for (let i = 0; i < D.count; i++) {
    let x, y, z, sc;
    for (let tries = 0; tries < 30; tries++) {      // 구체 몸통을 가리지 않도록 바깥에서만 뽑음
      const u = Math.random() * 2 - 1, ang = Math.random() * TAU, r = dr0 + Math.random() * (dr1 - dr0);
      const rr = Math.sqrt(1 - u * u);
      x = Math.cos(ang) * rr * r; y = u * r; z = Math.sin(ang) * rr * r;
      sc = C.perspective / (C.perspective + z);
      if (Math.hypot(x, y) * sc >= D.inner) break;
    }
    const hx = x * sc * C.radius, hy = y * sc * C.radius;   // 대기 위치 (짧은 변 단위)
    dust.push({
      hx, hy, x: hx, y: hy, z, sc,
      eager: 0.6 + Math.random() * 0.4,             // 얼마나 적극적으로 모이는지
      sp: 0.6 + Math.random() * 0.8,                // 속도 편차 → 꼬리처럼 늘어짐
      sz: ds0 + Math.pow(Math.random(), 2) * (ds1 - ds0),
      swarmAng: Math.random() * TAU,
      swarmR: D.swarm * (0.25 + 0.75 * Math.pow(Math.random(), 0.7)),
      seed: Math.random() * TAU, g: 0, px: 0, py: 0,
    });
  }
 
  // 빛번짐용 스프라이트 (한 번만 그려 두고 재사용)
  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = 64;
  {
    const g = sprite.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(190,215,255,1)');
    gr.addColorStop(0.35, 'rgba(120,150,255,.35)');
    gr.addColorStop(1, 'rgba(60,80,220,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  }
  const glowBuf = new Float32Array(particles.length * 3);
 
  // ── 리사이즈 / 입력 ─────────────────────────────────
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight; S = Math.min(W, H);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  addEventListener('resize', resize);
  resize();
 
  canvas.addEventListener('pointermove', (e) => {
    if (!pointer.active) { soft.x = e.clientX; soft.y = e.clientY; }   // 처음 진입 시 점프 방지
    pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true;
    lastMove = performance.now();
    if (pointer.down) {                                                // 드래그 = 회전
      velY = (e.clientX - pointer.lastX) * 0.006;
      velX = (e.clientY - pointer.lastY) * 0.006;
      pointer.lastX = e.clientX; pointer.lastY = e.clientY;
    }
  });
  canvas.addEventListener('pointerdown', (e) => {
    pointer.down = true; pointer.lastX = e.clientX; pointer.lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });
  ['pointerup', 'pointercancel'].forEach((n) => canvas.addEventListener(n, () => { pointer.down = false; }));
  canvas.addEventListener('pointerleave', () => { pointer.active = false; });
 
  // ── 프레임 상태 갱신 ────────────────────────────────
  function updateInput() {
    if (!pointer.down) { velY += (C.autoSpin - velY) * 0.03; velX *= 0.95; }   // 드래그 후 관성
    if (!reduceMotion) { rotY += velY; rotX = Math.max(-1.2, Math.min(1.2, rotX + velX)); }
    soft.x += (pointer.x - soft.x) * C.cursorLag;
    soft.y += (pointer.y - soft.y) * C.cursorLag;
    soft.influence += ((pointer.active && !pointer.down && !reduceMotion ? 1 : 0) - soft.influence) * 0.06;
  }
 
  // 그룹별 회전/변형: 코어는 반대 방향으로 더 빠르게, 변형 타이밍도 따로
  function makeFrame() {
    const tc = t * 1.3 + 9;
    return {
      cx: W / 2, cy: H / 2, R: S * C.radius,
      shell: {
        cosY: Math.cos(rotY), sinY: Math.sin(rotY), cosX: Math.cos(rotX), sinX: Math.sin(rotX),
        morph: reduceMotion ? 0 : morphEnvelope(t) * C.morphAmount, t, zr: 1,
      },
      core: {
        cosY: Math.cos(-rotY * C.coreSpin + 0.7), sinY: Math.sin(-rotY * C.coreSpin + 0.7),
        cosX: Math.cos(rotX * 0.6 + 0.5), sinX: Math.sin(rotX * 0.6 + 0.5),
        morph: reduceMotion ? 0 : (0.25 + morphEnvelope(tc) * 0.75) * C.coreMorph, t: tc, zr: C.coreRadius,
      },
    };
  }
 
  // 화면 기준 우측 하단 → 투명 + 인디고 (구체가 회전해도 고정)
  const lightFade = (light) => 1 - smoothstep(C.fadeStart, C.fadeEnd, light) * C.fadeStrength;
  const lightTint = (light) => Math.round(255 - 165 * smoothstep(-0.3, 0.6, light));   // 흰색 → 인디고
 
  // ── 그리기 ──────────────────────────────────────────
  // ① 구체 뒤 후광 (변형이 클수록 살짝 커짐)
  function drawHalo(F) {
    const hr = F.R * GL.haloRadius * (1 + F.shell.morph * 0.25);
    const g = ctx.createRadialGradient(F.cx, F.cy, F.R * 0.2, F.cx, F.cy, hr);
    g.addColorStop(0, `rgba(70,100,230,${GL.haloAlpha})`);
    g.addColorStop(0.5, `rgba(45,65,190,${GL.haloAlpha * 0.4})`);
    g.addColorStop(1, 'rgba(20,30,120,0)');
    ctx.fillStyle = g;
    ctx.fillRect(F.cx - hr, F.cy - hr, hr * 2, hr * 2);
  }
 
  // 먼지: 위치 갱신 (마우스가 움직이는 동안 커서 주변으로, 멈추면 대기 위치로)
  function updateDust(F) {
    const moving = pointer.active && !reduceMotion && performance.now() - lastMove < D.idleMs;
    dustInfl += ((moving ? 1 : 0) - dustInfl) * (moving ? 0.08 : 0.03);
    const mx = (pointer.x - F.cx) / S, my = (pointer.y - F.cy) / S;     // 커서 (짧은 변 단위)
    const rate = moving ? D.follow : D.restore;
    for (const d of dust) {
      d.g = dustInfl * d.eager;
      const ang = d.swarmAng + t * D.orbit * d.sp;
      const gx = mx + Math.cos(ang) * d.swarmR, gy = my + Math.sin(ang) * d.swarmR;
      d.x += (d.hx + (gx - d.hx) * d.g - d.x) * rate * d.sp;
      d.y += (d.hy + (gy - d.hy) * d.g - d.y) * rate * d.sp;
      d.px = F.cx + d.x * S; d.py = F.cy + d.y * S;
    }
  }
  // front=false: 구체 뒤, front=true: 구체 앞 (z<0 이거나 커서로 모인 입자)
  function drawDust(front) {
    for (const d of dust) {
      if ((d.z < 0 || d.g > 0.35) !== front) continue;
      const near = clamp01((1 - d.z / dr1) / 2);
      const tw = 0.85 + 0.15 * Math.sin(t * 1.2 + d.seed);
      const alpha = D.alpha * (0.3 + 0.7 * near) * tw * (front ? D.frontAlpha : 0.7);
      if (alpha < 0.02) continue;
      const sz = d.sz * d.sc * (d.z < 0 ? D.frontSize : 1);
      if (sz > 2.4) {                               // 커진 입자는 흐릿한 보케처럼
        ctx.globalAlpha = alpha * 0.6;
        ctx.drawImage(sprite, d.px - sz * 2, d.py - sz * 2, sz * 4, sz * 4);
        ctx.globalAlpha = 1;
      } else {
        ctx.fillStyle = `rgba(215,228,255,${alpha})`;
        ctx.fillRect(d.px - sz / 2, d.py - sz / 2, sz, sz);
      }
    }
  }
 
  // 방사선: 중심부는 직선, 바깥쪽은 흩어지는 작은 입자
  function projectShell(F, x, y, z) {
    const g = F.shell;
    const x1 = x * g.cosY + z * g.sinY, z1 = -x * g.sinY + z * g.cosY;
    const y1 = y * g.cosX - z1 * g.sinX, z2 = y * g.sinX + z1 * g.cosX;
    const sc = C.perspective / (C.perspective + z2), light = (x1 + y1) * 0.7071;
    return { x: F.cx + x1 * F.R * sc, y: F.cy + y1 * F.R * sc, sc,
             vis: lightFade(light), c: lightTint(light), depth: clamp01((1 - z2) / 2) };
  }
  function drawLines(F) {
    const g = F.shell;
    ctx.lineWidth = L.width;
    for (const d of lineDirs) {
      const k = (1 + g.morph * shapeNoise(d.x, d.y, d.z, g.t)) * 0.97;
 
      // 직선 구간: 중심 → solid 지점, 끝으로 갈수록 옅어짐
      const e = projectShell(F, d.x * k * L.solid, d.y * k * L.solid, d.z * k * L.solid);
      const lg = ctx.createLinearGradient(F.cx, F.cy, e.x, e.y);
      lg.addColorStop(0, `rgba(255,255,255,${L.alpha * 0.9})`);
      lg.addColorStop(1, `rgba(${e.c},${e.c},255,${L.alpha * 0.25 * e.vis * (0.4 + 0.6 * e.depth)})`);
      ctx.strokeStyle = lg;
      ctx.beginPath(); ctx.moveTo(F.cx, F.cy); ctx.lineTo(e.x, e.y); ctx.stroke();
 
      // 입자 구간: 직선이 끝나는 지점부터 바깥으로 흩어짐
      for (const q of d.dots) {
        const a = q.amp + Math.sin(g.t * 0.8 + q.seed) * 0.012 * (q.amp > 0 ? 1 : 0);   // 살짝 흔들림
        const p = projectShell(F, (d.x * q.u + q.jx * a) * k, (d.y * q.u + q.jy * a) * k, (d.z * q.u + q.jz * a) * k);
        const alpha = L.alpha * 1.3 * p.vis * (0.3 + 0.7 * p.depth) * (1 - (q.u - solid0) * 0.5);
        if (alpha < 0.02) continue;
        ctx.fillStyle = `rgba(${p.c},${p.c},255,${alpha})`;
        const sz = q.sz * p.sc * (0.7 + p.depth * 0.6);
        ctx.fillRect(p.x - sz / 2, p.y - sz / 2, sz, sz);
      }
    }
  }
 
  // 파티클 본체. 빛번짐 후보를 glowBuf에 기록하고 개수를 반환
  function drawParticles(F) {
    let gn = 0;
    for (const p of particles) {
      const g = p.core ? F.core : F.shell;
      const k = (1 + g.morph * shapeNoise(p.bx, p.by, p.bz, g.t)) * p.shell;
      const x = p.bx * k, y = p.by * k, z = p.bz * k;
 
      // 회전 + 원근 투영
      const x1 = x * g.cosY + z * g.sinY, z1 = -x * g.sinY + z * g.cosY;
      const y1 = y * g.cosX - z1 * g.sinX, z2 = y * g.sinX + z1 * g.cosX;
      const scale = C.perspective / (C.perspective + z2);
      const sx = F.cx + x1 * F.R * scale, sy = F.cy + y1 * F.R * scale;
 
      // 커서 쪽으로 은은하게 끌림
      let tx = 0, ty = 0;
      if (soft.influence > 0.001) {
        const dx = (soft.x - sx) / S, dy = (soft.y - sy) / S, dist = Math.hypot(dx, dy);
        if (dist < C.mouseRadius) {
          const amt = smoothstep(0, 1, 1 - dist / C.mouseRadius) * C.pull * soft.influence;
          tx = dx * amt; ty = dy * amt;
        }
      }
      const ease = C.follow * p.lag;
      p.ox += (tx - p.ox) * ease; p.oy += (ty - p.oy) * ease;
 
      // 우측 하단 투명 처리 + 깊이에 따른 밝기
      const light = (x1 + y1) * 0.7071;
      const depth = clamp01((1 - z2 / g.zr) / 2);
      const alpha = (0.25 + depth * 0.75) * lightFade(light) * p.dim;
      if (alpha < 0.02) continue;
 
      const px = sx + p.ox * S, py = sy + p.oy * S;
      const c = lightTint(light);
      ctx.fillStyle = `rgba(${c},${c},255,${alpha})`;
      const sz = (C.sizeMin + depth * C.sizeDepth) * scale * p.scl;
      ctx.fillRect(px - sz / 2, py - sz / 2, sz, sz);
 
      // 밝은 입자(좌상단·앞쪽)만 빛번짐 후보 — 우측 하단은 alpha가 낮아 자동 제외
      if (p.glow && alpha > 0.3) { glowBuf[gn++] = px; glowBuf[gn++] = py; glowBuf[gn++] = alpha; }
    }
    return gn;
  }
 
  // ② 밝은 입자에서 번지는 빛: 가산 합성이라 겹칠수록 은은하게 밝아짐
  function drawGlow(gn) {
    ctx.globalCompositeOperation = 'lighter';
    const s = GL.size;
    for (let i = 0; i < gn; i += 3) {
      ctx.globalAlpha = glowBuf[i + 2] * GL.alpha;
      ctx.drawImage(sprite, glowBuf[i] - s / 2, glowBuf[i + 1] - s / 2, s, s);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
 
  // ── 메인 루프 (그리는 순서 = 뒤 → 앞) ──────────────────
  (function frame() {
    t += 0.016 * C.morphSpeed;
    updateInput();
    const F = makeFrame();
    ctx.clearRect(0, 0, W, H);
 
    drawHalo(F);                 // 후광
    updateDust(F);
    drawDust(false);             // 구체 뒤 먼지
    drawLines(F);                // 방사선
    drawGlow(drawParticles(F));  // 파티클 + 빛번짐
    drawDust(true);              // 구체 앞 먼지 (가장 위)
 
    requestAnimationFrame(frame);
  })();
})();