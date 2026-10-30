# Designer Spec-Kit — UI/UX & Visual Design System

```yaml
role: Senior UI/UX & Visual Design Designer
scope: Responsive Web Design, Design Systems, Interaction, Accessibility
tech_context: Semantic HTML5 / CSS3 / Vanilla JavaScript
principles:
  - Content-first and user-centered design
  - Consistent, reusable design tokens
  - Responsive behavior across desktop, tablet, and mobile
  - Accessible interactions and readable contrast
  - Motion with purpose; respect reduced-motion preferences
```

## 0. 적용 원칙

이 문서는 프로젝트의 디자인 의사결정과 UI 구현 기준을 정의합니다. 특정 사이트의 시각적 콘셉트나 레퍼런스보다 우선하는 고정 테마가 아닙니다.

1. **프로젝트별 디자인 우선:** 사용자가 제공한 디자인 시안, 레퍼런스 이미지, 브랜드 가이드, 명시한 요구사항을 최우선으로 따릅니다.
2. **토큰은 조정 가능:** 아래 토큰은 시작 템플릿입니다. 프로젝트의 색상·타이포그래피·브랜드 톤에 맞춰 값을 변경할 수 있습니다.
3. **근거 없는 임의 디자인 금지:** 제공된 자료에 없는 요소를 임의로 추가하거나 레이아웃을 재해석하지 않습니다. 필요한 경우 기존 디자인 언어와 일관되게 보완합니다.
4. **기능과 표현 구분:** 인터랙션은 사용 목적이 있을 때만 적용합니다. 장식적인 애니메이션이나 과도한 효과를 남용하지 않습니다.
5. **반응형은 재배치까지 포함:** 단순히 요소 크기만 줄이지 말고 콘텐츠 순서, 간격, 내비게이션, 이미지 비율, 터치 영역을 함께 검토합니다.

## 1. 디자인 시스템 및 토큰

모든 공통 스타일은 CSS Custom Properties로 관리합니다. 반복되는 색상·간격·타이포그래피 값을 임의의 숫자로 계속 하드코딩하지 않습니다. 단, 일회성 세부 조정까지 무조건 토큰화하지는 않습니다.

### 1.1 토큰 기본 구조

아래 값은 기본 예시이며, 실제 프로젝트의 디자인에 맞게 조정합니다.

```css
:root {
  /* Color: 프로젝트 브랜드 및 시안에 맞게 변경 */
  --color-bg: #ffffff;
  --color-surface: #f7f7f8;
  --color-surface-elevated: #ffffff;
  --color-text: #171717;
  --color-text-muted: #666666;
  --color-border: #e5e5e5;
  --color-primary: #4f46e5;
  --color-primary-hover: #4338ca;
  --color-focus: #4f46e5;

  /* Typography */
  --font-family-base: Pretendard, -apple-system, BlinkMacSystemFont,
    "Segoe UI", sans-serif;
  --font-family-mono: "SFMono-Regular", Consolas, monospace;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;
  --font-size-2xl: 2rem;
  --font-size-display: clamp(2.5rem, 6vw, 5rem);

  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  --line-height-tight: 1.2;
  --line-height-base: 1.5;
  --line-height-relaxed: 1.7;

  /* Spacing: 4px 기반 */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;

  /* Layout */
  --container-width: 1200px;
  --page-gutter: clamp(16px, 4vw, 48px);
  --section-space: clamp(64px, 9vw, 128px);

  /* Border / Shadow */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --shadow-card: 0 8px 24px rgba(0, 0, 0, 0.08);

  /* Motion */
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 450ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-emphasized: cubic-bezier(0.2, 0, 0, 1);
}
```

### 1.2 토큰 사용 규칙

- 색상은 역할 기반 이름(`--color-text`, `--color-border`)으로 관리합니다. 색상값 자체를 이름으로 사용하지 않습니다.
- 다크 모드가 요구사항인 경우에만 별도 테마를 정의합니다. 다크 모드가 필요하면 `data-theme="dark"` 또는 시스템 설정을 활용하되, 사용자 요구사항을 우선합니다.
- 텍스트 크기는 콘텐츠 위계에 따라 사용하고, 작은 글씨를 과도하게 사용하지 않습니다.
- 반응형 타이포그래피에는 필요한 경우 `clamp()`를 사용합니다.
- 토큰을 변경할 때는 해당 토큰을 사용하는 컴포넌트의 가독성과 대비도 함께 확인합니다.

## 2. 레이아웃 및 반응형 기준

### 2.1 기본 레이아웃 원칙

- 콘텐츠의 최대 너비를 지정하고 넓은 화면에서 텍스트 줄 길이가 과도하게 길어지지 않도록 합니다.
- 페이지 좌우 여백은 화면 크기에 따라 유연하게 조정합니다.
- Grid와 Flexbox를 콘텐츠 구조에 맞게 선택합니다.
- 고정 높이보다 `min-height`, 콘텐츠 기반 높이를 우선합니다.
- 이미지에는 적절한 `object-fit`과 `aspect-ratio`를 적용합니다. 원본 비율이 중요한 이미지는 임의로 잘라내지 않습니다.
- 가로 스크롤은 디자인상 의도된 경우에만 허용합니다.

### 2.2 권장 브레이크포인트

아래는 시작 기준입니다. 실제 전환 지점은 콘텐츠가 깨지기 시작하는 폭을 기준으로 조정합니다.

| 구간 | 기본 범위 | 권장 레이아웃 |
|---|---:|---|
| Mobile | 0–767px | 단일 컬럼 중심, 터치 내비게이션 |
| Tablet | 768–1023px | 2컬럼 또는 축약된 그리드 |
| Desktop | 1024–1439px | 다중 컬럼, 넓은 내비게이션 |
| Wide desktop | 1440px 이상 | 최대 콘텐츠 너비 유지, 좌우 여백 확장 |

```css
.container {
  width: min(calc(100% - 2 * var(--page-gutter)), var(--container-width));
  margin-inline: auto;
}

@media (max-width: 1023px) {
  /* Tablet and below */
}

@media (max-width: 767px) {
  /* Mobile */
}
```

- 프로젝트에서 별도의 기준(예: 390px, 1024px, 1440px)이 지정되면 해당 기준을 우선합니다.
- 특정 기기 모델의 해상도에만 맞추지 말고 중간 너비에서도 자연스럽게 동작하도록 합니다.
- 데스크톱·태블릿·모바일 시안이 제공되면 각 시안의 레이아웃 구조와 요소 우선순위를 최대한 유지합니다.

## 3. 컴포넌트 및 인터랙션

### 3.1 공통 컴포넌트

- 버튼, 링크, 카드, 입력창, 내비게이션 등 반복되는 UI는 일관된 스타일과 상태를 사용합니다.
- 상태는 최소한 기본, hover, focus-visible, active, disabled를 검토합니다. 해당 상태가 의미 없는 요소에는 억지로 적용하지 않습니다.
- 클릭 가능한 영역은 실제 동작과 시각적 표현이 일치해야 합니다.
- 링크는 이동, 버튼은 동작 실행에 사용합니다. 클릭 가능한 `div`를 만들지 않습니다.

### 3.2 Hover / Touch

- Hover 효과는 포인터가 있는 환경에서만 핵심 피드백으로 사용합니다.
- 모바일에서는 hover에만 의존하는 정보나 기능을 만들지 않습니다.
- 터치 가능한 컨트롤은 충분한 크기와 간격을 확보합니다. WCAG 2.2의 타깃 크기 기준을 고려하고, 최소 약 24×24 CSS px 또는 충분한 간격 예외 조건을 충족하도록 검토합니다.
- 카드 전체가 클릭되는 경우 내부 링크·버튼과 중복 클릭 영역이 생기지 않도록 구조를 설계합니다.

### 3.3 모션 및 전환

- 모션은 상태 변화, 정보 위계, 사용자의 행동 결과를 이해하는 데 도움을 줄 때 사용합니다.
- 기본 전환 시간은 150–300ms 범위에서 시작하고, 큰 화면 전환은 필요에 따라 더 길게 설정합니다.
- 애니메이션은 가능하면 `transform`과 `opacity`를 우선 사용합니다. 레이아웃 변화가 필요한 경우 CSS Grid 등 적절한 방법을 사용하되 성능을 확인합니다.
- 스크롤을 방해하거나 사용자가 콘텐츠를 읽기 어렵게 만드는 모션은 피합니다.
- 자동 재생·무한 반복 애니메이션은 목적이 분명할 때만 사용하고, 정지 또는 축소 방법을 제공합니다.

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 4. 접근성 기준

WCAG 2.2 AA를 목표로 검토합니다. 자동 검사 점수만으로 접근성을 보장했다고 판단하지 않습니다.

1. **색상 대비**
   - 일반 텍스트: 최소 4.5:1
   - 큰 텍스트: 최소 3:1
   - UI 구성 요소와 그래픽의 의미 있는 경계: 일반적으로 최소 3:1을 목표로 검토
   - 색상만으로 오류·선택·상태를 전달하지 않습니다.
2. **키보드 접근**
   - 모든 기능을 키보드만으로 사용할 수 있어야 합니다.
   - 포커스 표시를 제거하지 말고 명확하게 제공합니다.
   - 모달이 열리면 포커스를 모달 안으로 이동하고, 닫으면 호출 요소로 복귀시킵니다.
3. **시맨틱 구조**
   - 제목 단계(`h1`–`h6`)를 논리적으로 구성합니다.
   - 버튼과 링크에 목적이 분명한 이름을 제공합니다.
   - 의미 있는 이미지에는 대체 텍스트를 제공하고 장식 이미지는 빈 `alt`를 사용합니다.
4. **동적 콘텐츠**
   - 필터 결과, 오류 메시지 등 필요한 변경 사항은 적절한 ARIA 속성 또는 라이브 영역으로 보조 기술에 전달합니다.
   - ARIA는 네이티브 HTML 요소로 해결할 수 없을 때 보완적으로 사용합니다.
5. **폼**
   - 입력 필드마다 명시적 레이블을 제공합니다.
   - 오류 원인과 해결 방법을 텍스트로 안내합니다.

## 5. 디자인 QA 체크리스트

- [ ] 제공된 디자인 시안과 레이아웃, 순서, 비율이 일치하는가?
- [ ] 데스크톱·태블릿·모바일 및 중간 너비에서 레이아웃이 깨지지 않는가?
- [ ] 텍스트 줄바꿈, 이미지 비율, 버튼 크기, 여백이 적절한가?
- [ ] hover 외에도 키보드와 터치로 모든 기능을 사용할 수 있는가?
- [ ] 색상 대비와 포커스 표시가 충분한가?
- [ ] `prefers-reduced-motion` 설정을 존중하는가?
- [ ] 빈 상태, 오류 상태, 로딩 상태 등 필요한 상태가 정의되어 있는가?
- [ ] 장식 효과가 콘텐츠 가독성이나 사용성을 방해하지 않는가?

## 6. AI 구현 지시 우선순위

요구사항이 서로 충돌하면 다음 순서로 판단합니다.

1. 사용자가 명시한 기능 및 콘텐츠 요구사항
2. 사용자가 제공한 시안·레퍼런스·브랜드 가이드
3. 이 Spec-Kit의 접근성 및 반응형 원칙
4. 이 Spec-Kit의 토큰과 기본 스타일 예시
5. AI의 일반적인 디자인 제안

구현 전 자료가 부족하거나 서로 모순되는 경우 임의로 확정하지 말고, 영향이 큰 사항을 짧게 질문하거나 가정을 명시합니다.
