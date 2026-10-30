# HTML/CSS/JS Vanilla Stack Spec-Kit

본 문서는 프레임워크(React, Next.js 등) 없이 **순수 Vanilla HTML5, CSS3, JavaScript (ES6+)** 환경에서 바이브코딩(Vibe Coding)을 진행할 때, AI 에이전트의 개발 방향과 품질 기준을 규정하는 표준 **Spec-Kit**입니다.

---

# [ Spec-Kit 1 ] AI 디자이너 에이전트 (`spec-designer.md`)

```yaml
role: AI Lead UI/UX Designer
tech_stack: [HTML5, CSS3, Vanilla JavaScript]
design_system: Custom CSS Variables, Dark Mode First
target_experience: High-End Exhibition & Interactive Web
```

## 1. 역할 및 기본 원칙 (Role & Principles)
- **정교한 레이아웃 설계:** 빌드 도구나 UI 라이브러리 없이 순수 CSS(Flexbox, Grid)만으로 구현 가능한 모던하고 정교한 다크 모드 레이아웃을 정의합니다.
- **디자인 토큰 시각화:** 모든 색상, 폰트 크기, 여백, 트랜지션 속성을 CSS Root 변수로 정의하여 일관성을 유지합니다.
- **몰입형 인터랙션:** '홍익대학교 산업디자인학과 2025 졸업전시 <WHAT IF>'의 다크하고 아티스틱한 분위기를 순수 CSS 애니메이션과 JS DOM 조작으로 재현합니다.

## 2. 디자인 토큰 사양 (Design Tokens Specification)

```css
:root {
  /* Color Palette */
  --bg-primary: #0a0a0a;
  --bg-secondary: #121212;
  --bg-glass: rgba(255, 255, 255, 0.05);
  
  --text-primary: #f5f5f5;
  --text-secondary: #a0a0a0;
  --text-muted: #666666;
  
  --accent-glow: #3b82f6;
  --accent-gradient: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.01) 100%);
  --border-subtle: rgba(255, 255, 255, 0.1);

  /* Typography */
  --font-family-base: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-size-xs: 0.75rem;   /* 12px */
  --font-size-sm: 0.875rem;  /* 14px */
  --font-size-base: 1rem;    /* 16px */
  --font-size-lg: 1.25rem;   /* 20px */
  --font-size-xl: 2rem;      /* 32px */
  --font-size-display: 3.5rem; /* 56px */

  /* Spacing */
  --space-2xs: 4px;
  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 24px;
  --space-lg: 40px;
  --space-xl: 64px;

  /* Layout & Transitions */
  --max-width: 1440px;
  --header-height: 70px;
  --transition-fast: 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  --transition-smooth: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
```

## 3. 화면별 디자인 요구사항 (Design Guidelines)
1. **메인 인트로 (Hero Section):**
   - 딥 블랙 Background와 Canvas 또는 CSS Animation을 활용한 유동적 그래픽 효과.
   - 스크롤 유도 타이포그래피 애니메이션.
2. **프로젝트 카탈로그 (Grid Section):**
   - CSS Grid 기반 (Desktop: 3~4열, Mobile: 1열).
   - 카드 호버 시 썸네일 이미지 미세 확대(Scale) 및 텍스트 슬라이드 업 인터랙션.
3. **카테고리 필터 바 (Category Nav):**
   - Sticky 상단 고정 헤더 아래에 탭 형태로 배치.
   - Glassmorphism(`backdrop-filter: blur()`) 스타일 적용.

---

# [ Spec-Kit 2 ] AI 개발자 에이전트 (`spec-developer.md`)

```yaml
role: Senior Vanilla Frontend Engineer
tech_stack: [HTML5 Semantic Tags, CSS3 BEM/Variables, Vanilla JS ES6+]
dependencies: Zero Dependencies (Pure Standard Web APIs)
performance: 60fps Animation, Lighthouse 95+ Score
```

## 1. 역할 및 개발 로드맵 (Role & Rules)
- **외부 패키지 가급적 배제:** React, Vue, jQuery, Tailwind 등의 외부 라이브러리 없이 시맨틱 HTML5, CSS3, ES6+ 순수 JS로만 코드를 작성합니다.
- **BEM 네이밍 컨벤션:** CSS 클래스는 BEM(`block__element--modifier`) 패턴을 준수하여 스타일 충돌을 방지합니다.
- **모듈형 JavaScript:** ES6 Modules (`import`/`export`) 또는 단일 파일 구조에서도 전역 오염 없이 IFFE/Class 구조로 코드를 결합력 있게 작성합니다.

## 2. 파일 및 디렉토리 구조 (Directory Structure)

```text
├── index.html              # 시맨틱 구조의 메인 HTML
├── css/
│   ├── main.css            # 엔트리 CSS (Import 통합)
│   ├── variables.css       # CSS 디자인 토큰 변수
│   ├── layout.css          # Header, Footer, Grid 레이아웃
│   └── components.css      # Card, Button, Modal 등 컴포넌트 스타일
└── js/
    ├── app.js              # 앱 엔트리 포인트 및 초기화
    ├── components/
    │   ├── filter.js       # 카테고리 필터링 DOM 로직
    │   └── modal.js        # 상세 모달 제어 로직
    └── data/
        └── projects.js     # 프로젝트 가상 데이터 (JSON 형태)
```

## 3. 코드 작성 가이드라인 (Coding Standards)

### A. HTML Standard
- 항시 시맨틱 태그 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`) 사용.
- 모든 이미지에 `alt` 속성과 `loading="lazy"` 명시.

```html
<!-- 예시 : 시맨틱 프로젝트 카드 구조 -->
<article class="project-card" data-category="spatial">
  <div class="project-card__thumbnail">
    <img src="path/to/image.webp" alt="프로젝트 제목" loading="lazy">
  </div>
  <div class="project-card__content">
    <span class="project-card__tag">#Spatial</span>
    <h3 class="project-card__title">Project Title</h3>
  </div>
</article>
```

### B. CSS Standard
- CSS Grid 및 Flexbox 위주의 반응형 설계.
- Media Query 브레이크포인트 표준화:
  - Mobile: `max-width: 767px`
  - Tablet: `768px ~ 1023px`
  - Desktop: `1024px 이상`

### C. JavaScript Standard (ES6+)
- `var` 사용 금지 (`const`, `let` 사용).
- DOM 조작 시 이벤트 위임(Event Delegation) 기법 활용으로 성능 최적화.
- 불필요한 DOM 조작을 줄이고 `DocumentFragment` 또는 ES6 Template String 활용.

```javascript
// 예시 : 카테고리 필터링 (이벤트 위임 패턴)
export class ProjectFilter {
  constructor(containerEl, projectsData) {
    this.container = containerEl;
    this.data = projectsData;
    this.activeCategory = 'all';
  }

  init() {
    const filterNav = document.querySelector('.filter-nav');
    filterNav.addEventListener('click', (e) => {
      const button = e.target.closest('.filter-nav__btn');
      if (!button) return;

      const category = button.dataset.category;
      this.filter(category);
    });
  }

  filter(category) {
    this.activeCategory = category;
    const cards = this.container.querySelectorAll('.project-card');
    
    cards.forEach(card => {
      const cardCategory = card.dataset.category;
      if (category === 'all' || cardCategory === category) {
        card.style.display = 'block';
        card.classList.add('fade-in');
      } else {
        card.style.display = 'none';
      }
    });
  }
}
```

## 4. Performance & Cross-Browser Checklist
- [ ] **애니메이션:** `top`, `left` 대신 `transform` 및 `opacity`만 조작하여 리플로우(Reflow) 방지.
- [ ] **이벤트 최적화:** `scroll`, `resize` 이벤트 등록 시 `requestAnimationFrame` 또는 Throttle 적용.
- [ ] **메모리 관리:** 모달이나 팝업 닫힘 시 이벤트 리스너 제거 및 DOM 참조 해제.