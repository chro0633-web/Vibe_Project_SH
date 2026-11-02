# WEB_STANDARDS.md

> HTML / CSS / Vanilla JS 웹사이트 프로젝트를 위한 **에이전트 AI 작업 규약**
> 이 문서는 15년차 시니어 디자이너(Designer)와 15년차 시니어 개발자(Developer)의 기준으로 작성되었습니다.
> **적용 프로젝트: 홍익대학교 산업디자인학과 2025 졸업전시 — 프로젝트 전용 규칙은 PART S(v3: common.css는 main.css에서 개발 후 이전 — S9)를 참고하세요. PART S는 PART A·B보다 우선합니다.**

---

## 0. 이 문서의 사용법

### 0.1 규범 수준
이 문서의 키워드는 다음 의미로 해석한다.

| 키워드 | 의미 |
|---|---|
| **MUST / 반드시** | 예외 없이 지킨다. 어기면 결과물은 미완성이다. |
| **MUST NOT / 금지** | 절대 하지 않는다. |
| **SHOULD / 권장** | 특별한 이유가 없으면 지킨다. 어길 땐 이유를 주석이나 커밋 메시지에 남긴다. |
| **MAY / 선택** | 상황에 따라 판단한다. |

### 0.2 에이전트 행동 원칙
1. 작업 시작 전에 이 문서와 `/design-tokens` 및 기존 코드를 **먼저 읽는다.** 읽지 않고 새로 만들지 않는다.
2. 이미 존재하는 컴포넌트, 토큰, 유틸리티가 있으면 **재사용한다.** 비슷한 것을 새로 만들지 않는다.
3. 요청받은 범위만 수정한다. 요청하지 않은 리팩터링, 파일 이동, 의존성 추가를 하지 않는다.
4. 규약과 사용자 요청이 충돌하면, **사용자 요청을 따르되** 충돌 사실과 대안을 한 줄로 알린다.
5. 모호한 요구사항은 추측으로 진행하지 말고, 가정을 명시한 뒤 진행하거나 질문한다.
6. **PART S의 `[추출 필요]` 값은 추측해서 채우지 않는다.** S7 절차로 측정하거나 오너에게 요청한다.
7. 작업이 끝나면 **[부록 A. 완료 정의(DoD)]** 와 **[S8]** 체크리스트를 스스로 검증한다.

### 0.3 우선순위
충돌 시 아래 순서로 결정한다.

```
접근성 · 보안 > 사용자 명시 요청 > PART S(프로젝트 전용) > PART A·B(일반) > 기존 코드 관례 > 개인 취향
```

---

## 1. 공통 원칙 (Designer · Developer 공유)

1. **토큰이 단일 진실 공급원(Single Source of Truth)이다.** 색, 간격, 글꼴, 그림자, 반경, 모션 값은 오직 디자인 토큰(CSS Custom Properties)에서 온다. 컴포넌트 CSS에 raw 값을 쓰지 않는다.
2. **콘텐츠가 먼저다.** 레이아웃은 실제 콘텐츠에서 출발한다. `Lorem ipsum` 금지. 실제 서비스에 쓰일 법한 구체적인 문구를 사용한다.
3. **모바일 퍼스트, 점진적 향상(Progressive Enhancement).** JS가 실패해도 핵심 콘텐츠와 내비게이션은 읽히고 동작해야 한다.
4. **접근성은 기능이다.** WCAG 2.2 AA를 최소 기준으로 한다. 나중에 붙이는 것이 아니라 처음부터 포함한다.
5. **일관성은 창의성보다 앞선다.** 새로운 패턴은 기존 패턴으로 해결이 불가능할 때만 도입하고, 도입하면 문서화한다.
6. **단순함을 선택한다.** 같은 문제를 푸는 두 해법이 있다면 코드와 시각 요소가 더 적은 쪽을 택한다.
7. **측정 가능한 품질.** "예뻐 보인다/빠른 것 같다"가 아니라 대비 비율, Lighthouse 점수, CLS/LCP 수치로 말한다.

---

# PART A. DESIGNER 규약

> 역할: 시각 언어, 정보 구조, 상호작용, 사용성의 책임자.
> 에이전트가 Designer 역할로 일할 때는 코드를 쓰기 전에 **의도를 먼저 결정**하고, 그 결정을 토큰과 규칙으로 고정한다.

## A1. 디자인 착수 절차 (Process)

디자인 작업은 반드시 아래 순서를 따른다. 코드는 3단계 이후에 작성한다.

1. **브리프 확인** — 제품이 무엇인지, 누구를 위한 것인지, 이 페이지의 핵심 임무(Primary Job)가 무엇인지 한 문장씩 정의한다. 브리프에 없으면 제안하고 확인받는다.
2. **디자인 플랜 작성** — 아래 4가지를 간결하게 정리한다.
   - **Color**: 핵심 팔레트 4~6개 (이름 + HEX)
   - **Type**: 서체와 역할
   - **Layout**: 레이아웃 개념 (한 문장 + 필요 시 ASCII 와이어프레임), 정렬 방침(좌/중앙/양끝)
   - **Principles**: 이 사이트를 다른 사이트와 구별하는 핵심 원칙 1~3개
3. **플랜 자기 검토** — 이 플랜이 비슷한 주제의 아무 사이트에나 그대로 쓸 수 있는 "기본값"처럼 보이면 수정한다. 무엇을 왜 바꿨는지 기록한다.
4. **토큰화** — 확정된 값을 `tokens.css`에 반영한다.
5. **구현 후 비평** — 모바일/데스크톱 스크린샷을 확인하고, **장식 하나를 제거**한다. (샤넬의 법칙)

## A2. 비주얼 아이덴티티 원칙

- **주제에서 출발한다.** 팔레트, 서체, 이미지 톤, 어휘는 해당 제품/산업의 세계관에서 가져온다. 어떤 주제에도 어울리는 "무난한 스타일"은 실패로 간주한다.
- **대담함은 한 곳에만 쓴다.** 기억에 남는 요소를 하나 정하고 나머지는 조용하고 절제되게 만든다.
- **히어로(Hero)는 해당 주제에서 가장 특징적인 것으로 연다.** 헤드라인, 이미지, 라이브 데모, 인터랙션 등 가장 적합한 형태를 선택한다. "큰 숫자 + 작은 라벨 + 그라디언트 강조" 조합은 기본값이므로, 그것이 진짜 최선일 때만 쓴다.
- 구조 요소(테두리, 구분선, 번호, 라벨)는 **정보를 전달할 때만** 쓴다. 장식 목적으로 쓰지 않는다. `01 / 02 / 03` 번호는 콘텐츠가 실제 순서(단계, 타임라인)일 때만 허용한다.

### A2.1 "AI 생성물 티"가 나는 기본값 — 의도 없이 쓰지 않는다

아래는 금지가 아니라 **선택의 근거가 없으면 쓰지 않는** 목록이다. 브리프가 명시하면 그대로 따른다.

| 패턴 | 설명 |
|---|---|
| 크림 배경 + 고대비 세리프 + 테라코타 포인트 | 가장 흔한 생성물 조합 |
| 근흑 배경 + 단일 형광(라임/버밀리언) 포인트 | 두 번째로 흔한 조합 |
| 신문 지면풍 (헤어라인, 직각, 빽빽한 다단) | 주제와 무관하게 반복됨 |
| SaaS 카드 키트 | 동일한 둥근 카드 반복, 같은 연한 그림자, 그라디언트 워시 |
| 템플릿 크롬 | 모든 제목 위 자간 넓은 대문자 아이브로, `A · B · C` 점 구분 문자열, `WORD — fragment` 라벨, 순수 검정 대신 `#0B0B0B`/`#111` 남발, 소형 데이터 라벨에 모노스페이스, 링크/버튼 끝의 `→` |
| 섹션마다 페이드+슬라이드업 | 모든 카드에 호버 트랜지션 |

## A3. 컬러 시스템

### A3.1 구조
- 팔레트는 **3계층**으로 정의한다.
  1. **Primitive** — 원시 색상 스케일 (`--color-neutral-50 … 900`, `--color-brand-50 … 900`)
  2. **Semantic** — 역할 기반 (`--color-bg`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-border`, `--color-accent`, `--color-success`, `--color-warning`, `--color-danger`, `--color-focus`)
  3. **Component** — 필요한 경우만 (`--button-bg`, `--card-border`)
- 컴포넌트는 **Semantic 이하만** 참조한다. Primitive를 직접 참조하지 않는다.

### A3.2 규칙
- **MUST** 본문 텍스트 대비 ≥ 4.5:1, 큰 텍스트(24px 이상 또는 18.66px bold 이상) ≥ 3:1, UI 컴포넌트 경계/아이콘 ≥ 3:1.
- **MUST** 색상만으로 상태를 전달하지 않는다. (오류 = 빨강 + 아이콘 + 텍스트)
- *(이 프로젝트는 다크 전용 — PART S5.1.)* **MUST** 다크 모드를 지원하기로 했다면 Semantic 토큰만 교체하여 구현한다. 컴포넌트별 다크 오버라이드를 만들지 않는다.
- **SHOULD** 색상 역할은 60-30-10 비율(배경/서피스 60, 보조 30, 강조 10)을 기준으로 배분한다.
- **SHOULD** 중립색은 브랜드 색조를 약하게 섞어 조화를 만든다. 순수 회색 계열을 그대로 쓰지 않는다.
- **MUST NOT** 의미 없는 그라디언트를 장식으로 쓰지 않는다.
- **MUST NOT** 한 화면에 강조색을 3개 이상 쓰지 않는다. (상태 색 제외)

## A4. 타이포그래피

- **서체는 1~2개 패밀리.** 2개를 쓸 때는 서로 뚜렷하게 다른 성격(예: 세리프 + 산세리프)이어야 한다. 비슷한 둘을 섞지 않는다.
- 서체는 습관적 기본값이 아니라 **프로젝트 성격에 맞게 의도적으로 선택**한다.
- 한글 사이트는 한글 가독성이 검증된 서체(예: Pretendard, Noto Sans KR, Noto Serif KR 등)를 기본 후보로 하고, 라틴 서체와의 **조합 균형**(x-height, 굵기)을 확인한다.
- 타입 스케일은 **고정 비율 스케일**로 정의한다. (예: Major Third 1.25, Perfect Fourth 1.333)

```css
:root {
  --font-size-xs:   clamp(0.75rem, 0.73rem + 0.1vw, 0.8125rem);
  --font-size-sm:   clamp(0.875rem, 0.85rem + 0.12vw, 0.9375rem);
  --font-size-base: clamp(1rem, 0.96rem + 0.2vw, 1.125rem);
  --font-size-lg:   clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem);
  --font-size-xl:   clamp(1.563rem, 1.35rem + 1vw, 2.25rem);
  --font-size-2xl:  clamp(1.953rem, 1.55rem + 2vw, 3.25rem);
  --font-size-3xl:  clamp(2.441rem, 1.7rem + 3.5vw, 4.75rem);
}
```

| 항목 | 규칙 |
|---|---|
| 본문 크기 | 최소 16px (1rem). 모바일에서도 16px 미만 금지. |
| 줄 길이 | 본문 한글 기준 **영문 45~75자 / 한글 28~45자** 내외, 최대 `max-width: 65ch` 수준. 80자 초과 금지. |
| 행간 | 본문 한글 1.6~1.8, 영문 산세리프 1.5~1.6, 세리프는 산세리프보다 약간 더 크게. 헤딩 1.1~1.3. |
| 자간 | 한글 본문 `letter-spacing: -0.01em ~ 0`, 대형 헤딩은 약간 좁게 허용. 소문자 본문에 넓은 자간 금지. |
| 굵기 | 사용하는 weight는 **최대 3~4개**(예: 400/500/700). 가변 폰트는 필요한 축만 사용. |
| 줄바꿈 | 한글은 `word-break: keep-all; overflow-wrap: break-word;` 를 기본으로 한다. |
| 정렬 | 본문은 좌측 정렬. 긴 글의 양끝 정렬 금지(한글 예외 시 근거 명시). |

**피해야 할 기본값 처리:**
- 헤드라인에서 **한 단어만** 이탤릭/볼드/다른 색으로 강조하는 처리
- 라벨을 습관적으로 **ALL CAPS**로 처리
- 콘텐츠에 불필요한 **타이포 라벨**(아이브로 텍스트)을 덧붙이는 것

대형 타이포가 비주얼 요소인 경우, 타입 자체를 디자인의 능동적 요소로 다룬다. (크기 대비, 굵기 대비, 배치, 자간)

## A5. 레이아웃 · 그리드 · 간격

### A5.1 간격 시스템
- 모든 간격은 **4px 기반, 주로 8px 배수** 스케일을 따른다.

```css
:root {
  --space-1: 0.25rem;  /*  4 */
  --space-2: 0.5rem;   /*  8 */
  --space-3: 0.75rem;  /* 12 */
  --space-4: 1rem;     /* 16 */
  --space-5: 1.5rem;   /* 24 */
  --space-6: 2rem;     /* 32 */
  --space-7: 3rem;     /* 48 */
  --space-8: 4rem;     /* 64 */
  --space-9: 6rem;     /* 96 */
  --space-10: 8rem;    /* 128 */
}
```

- **MUST** 스케일에 없는 임의 값(`13px`, `37px`)을 쓰지 않는다.
- **근접성 원칙**: 관련 요소 간 간격 < 무관한 요소 간 간격. 그룹 내부 간격과 그룹 사이 간격의 비율은 최소 1:2 이상.
- 섹션 수직 패딩은 토큰(`--space-8` ~ `--space-10`)에서 선택하며, 사이트 전체에서 **2가지 이하의 섹션 리듬**만 사용한다.

### A5.2 그리드 · 컨테이너
- ~~12컬럼 그리드 기준~~ → **PART S2에 따라 3단 박스(겉박스 > `.inner-box` > `.part-box`) + flex 파티션**으로 배치한다. 간격은 `--part-gap` 토큰.
- 콘텐츠 최대폭은 `--inner-max`(기본 1920px) 토큰으로 정의한다. 읽기용 `--container-prose: 65ch`는 텍스트 블록에만 사용한다.
- 좌우 안전 패딩: 모바일 ≥ 16px, 태블릿 ≥ 24px, 데스크톱 ≥ 32px.

### A5.3 브레이크포인트 (Mobile First, `min-width`)

> **이 프로젝트는 PART S1.4가 우선한다:** `813px`(Tablet), `1400px`(PC) 두 개만 사용.

| 이름 | 값 | 대상 |
|---|---|---|
| (기본) | 0 | 모바일 (360px 기준 설계) |
| `sm` | 640px | 큰 모바일 / 소형 태블릿 |
| `md` | 768px | 태블릿 |
| `lg` | 1024px | 소형 데스크톱 |
| `xl` | 1280px | 데스크톱 |
| `2xl` | 1536px | 와이드 |

- **MUST** 320px ~ 1920px 전 구간에서 깨지지 않는다. 가로 스크롤 발생 금지.
- **SHOULD** 브레이크포인트는 기기가 아니라 **콘텐츠가 깨지는 지점** 기준으로 보조 추가할 수 있다.

### A5.4 정렬 및 위계
- 한 페이지 안에서 **정렬 방침을 섞지 않는다.** (좌측 정렬 기본, 중앙 정렬은 히어로·짧은 CTA 등 제한적 사용)
- 시각적 위계는 **크기 > 굵기 > 색 > 위치** 순으로 설계한다. 한 화면에서 시선이 처음 닿는 곳은 **하나**여야 한다.
- 카드 남발 금지: 모든 콘텐츠를 동일한 카드로 쪼개지 않는다. 위계에 따라 크기, 형태, 반경을 다르게 한다.
- *(이 프로젝트는 PART S3.5가 우선: 반경은 `--radius-pill: 50px` 하나뿐.)* 반경(radius)은 토큰 3단계 이내(`--radius-sm/md/lg`)로 제한하고 **요소의 위계에 따라** 다르게 적용한다. 모든 요소에 같은 반경 금지.
- 그림자(elevation)는 토큰 3단계 이내. 단일 그림자를 모든 요소에 반복하지 않는다.

## A6. 컴포넌트 디자인 규칙

모든 인터랙티브 컴포넌트는 **상태 매트릭스**를 정의해야 한다.

| 상태 | 필수 여부 |
|---|---|
| Default | 필수 |
| Hover | 필수 (포인터 기기 한정) |
| Focus-visible | **필수** — 대비 3:1 이상, 2px 이상 윤곽선 |
| Active / Pressed | 필수 |
| Disabled | 해당 시 |
| Loading | 비동기 동작 시 |
| Error / Success | 폼·결과 피드백 시 |
| Empty | 목록·검색·데이터 영역 |

### A6.1 버튼
- **위계는 3단계 이하**: Primary(화면당 1개 원칙) / Secondary / Tertiary(텍스트).
- 최소 터치 영역 **44×44px** (WCAG 2.2 AA 최소 24×24, 권장 44).
- 라벨은 **동사로 구체적으로**: "저장", "구독 신청하기" ○ / "확인", "제출" △ (맥락 없는 경우).
- 같은 동작은 전체 흐름에서 **같은 이름**을 유지한다. ("게시" 버튼 → 토스트도 "게시되었습니다")

### A6.2 폼
- 라벨은 **항상 보인다**. 플레이스홀더를 라벨 대용으로 쓰지 않는다.
- 입력 필드 높이 ≥ 44px, 모바일 입력 `font-size` ≥ 16px (iOS 자동 확대 방지).
- 오류 메시지는 **무엇이 잘못됐고 어떻게 고치는지** 알려준다. 사과하지 않고, 모호하게 쓰지 않는다.
  - ✕ "오류가 발생했습니다."
  - ○ "이메일 형식이 올바르지 않습니다. 예: name@example.com"
- 필수/선택 표시는 일관된 방식으로 하고 색에만 의존하지 않는다.
- 오류는 필드 근처에 표시하고, 제출 실패 시 첫 오류로 포커스를 이동한다.

### A6.3 내비게이션
- 주 메뉴 항목 **7개 이하**. 현재 위치를 시각적·의미적(`aria-current`)으로 표시한다.
- 모바일 메뉴는 열림/닫힘 상태가 명확하고, 닫기 수단이 항상 보인다.
- 로고는 홈 링크이며, 스킵 링크("본문으로 건너뛰기")를 제공한다.

### A6.4 이미지 · 아이콘 · 일러스트
- 이미지는 **콘텐츠를 설명하는 데 기여**해야 한다. 장식용 스톡 이미지 금지.
- 모든 이미지의 **종횡비를 사전에 정의**하여 레이아웃 시프트를 방지한다.
- 아이콘은 **하나의 세트**만 사용하고, 선 굵기·모서리·크기 그리드(16/20/24px)를 통일한다.
- 이모지를 아이콘 대용으로 쓰지 않는다. (플랫폼별 렌더링 편차)

### A6.5 상태 화면
- **빈 화면(Empty)**은 무드가 아니라 **다음 행동의 안내**다.
- **오류 화면**은 원인과 해결 방법, 복귀 경로를 제시한다.
- **로딩**은 300ms 이상 걸리면 스켈레톤/스피너를 표시하고, 레이아웃 크기를 유지한다.

## A7. 모션 · 인터랙션

- 모션은 **의미가 있을 때만** 쓴다. 상태 변화(열림, 확장, 완료)를 설명하는 **사용자 행동 응답형 모션**은 환영한다.
- 사용자 행동과 무관한 자동 모션은 **절제**한다. 페이지 로드 시 **하나의 연출된 순간**이 여러 곳의 산발적 효과보다 낫다.
- 지속시간 토큰:

```css
:root {
  --duration-instant: 100ms;  /* 호버·토글 */
  --duration-fast: 150ms;
  --duration-base: 250ms;     /* 대부분의 전환 */
  --duration-slow: 400ms;     /* 큰 패널·모달 */
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-enter:    cubic-bezier(0, 0, 0, 1);
  --ease-exit:     cubic-bezier(0.3, 0, 1, 1);
}
```

- 이동·크기 변화는 `transform`/`opacity`만 애니메이션한다. (`width`, `height`, `top`, `left` 애니메이션 금지)
- **MUST** `prefers-reduced-motion: reduce`를 존중한다. 대체 수단(즉시 전환 또는 페이드)을 제공한다.
- **MUST NOT** 1초 이상 깜빡이거나 초당 3회 이상 점멸하는 요소를 만들지 않는다.
- 자동 재생 캐러셀, 무한 자동 스크롤, 패럴랙스 남발을 지양한다.

## A8. 카피라이팅 (UX Writing)

- 단어는 **이해와 사용을 돕기 위해서만** 존재한다. 장식이 아니다.
- **사용자 관점**으로 쓴다. 시스템 용어가 아니라 사용자가 이해하는 말로. ("웹훅 설정" ✕ → "알림 관리" ○)
- **능동태**를 기본으로 한다. CTA는 일어날 일을 정확히 말한다. ("변경사항 저장")
- 톤은 대화체에 가깝되 군더더기 없이. 브랜드와 대상에 맞게 조정한다.
- 홍보 문구보다 **구체적 설명**이 낫다. 영리함보다 명료함.
- 한 문구는 **하나의 역할**만 한다.
- **Lorem ipsum, "Your text here", 의미 없는 영어 문구** 금지. 실제와 유사한 한국어/해당 언어 카피를 작성한다.
- 한국어 표기 규칙: 존댓말 일관(해요체 또는 합쇼체 중 **하나로 통일**), 숫자·단위 표기 일관(`10,000원`, `3개`), 날짜 형식 통일(`2026.11.02` 또는 `2026년 11월 2일`).

## A9. 접근성 디자인 (Designer 책임 범위)

- **MUST** 포커스 표시를 제거하지 않는다. 디자인 시스템이 정의한 `:focus-visible` 스타일을 모든 인터랙티브 요소에 적용한다.
- **MUST** 정보의 계층이 **읽기 순서(DOM 순서)**와 일치하도록 설계한다.
- **MUST** 최소 터치 타깃 44px, 인접 타깃 간 간격 확보.
- **MUST** 텍스트 200% 확대 및 간격 확대 시에도 콘텐츠가 잘리지 않도록 한다.
- **MUST** 아이콘 단독 버튼에는 텍스트 대체(visually-hidden 라벨)를 설계에 포함한다.
- **SHOULD** 호버로만 노출되는 정보를 만들지 않는다. (터치·키보드 사용자 대응)
- **SHOULD** 시간 제한이 있는 UI(자동 사라지는 토스트 등)는 충분히 길게(최소 5초) 또는 닫기 수단을 제공한다.

## A10. 디자이너 산출물 체크리스트

- [ ] 디자인 플랜(Color/Type/Layout/Principles)을 작성하고 자기 검토했다.
- [ ] 모든 시각 값이 토큰으로 정의되었다.
- [ ] 320 / 768 / 1280px 레이아웃을 확인했다.
- [ ] 모든 인터랙티브 컴포넌트의 상태 매트릭스를 정의했다.
- [ ] 대비 비율(텍스트 4.5:1, UI 3:1)을 검증했다.
- [ ] 빈/오류/로딩 상태가 설계되었다.
- [ ] 카피가 실제 콘텐츠이며 톤이 일관된다.
- [ ] "기본값처럼 보이는 요소"를 점검했고, 장식 1개를 제거했다.

---

# PART B. DEVELOPER 규약

> 역할: 설계된 의도를 견고하고 빠르고 접근 가능하며 유지보수 가능한 코드로 구현하는 책임자.
> 에이전트가 Developer 역할로 일할 때는 **기존 구조를 존중하고, 추측하지 않고, 작게 변경한다.**

## B1. 기술 스택 및 환경 원칙

- **스택**: HTML5 + CSS3 + ES2022+ Vanilla JavaScript. 별도 지시 없이 프레임워크, 번들러, CSS 프리프로세서, 대형 라이브러리를 **추가하지 않는다.**
- 외부 의존성 추가가 필요하면 **사유, 크기, 대안**을 먼저 제시하고 승인을 받는다.
- 지원 브라우저: 최신 2버전의 Chrome, Edge, Safari, Firefox, Android Chrome, iOS Safari (별도 지정이 있으면 그것을 따른다).
- 새 CSS/JS 기능을 쓸 때는 **지원 범위를 확인**하고, 미지원 시 우아하게 저하(graceful degradation)되도록 `@supports` 또는 feature detection을 사용한다.
- 빌드 도구 없이도 열고 실행되는 구조를 **기본**으로 한다.

## B2. 프로젝트 구조

```
/
├─ index.html
├─ pages/                  # 추가 페이지 (about.html …)
├─ assets/
│  ├─ fonts/               # woff2 only
│  ├─ images/              # 원본 + 최적화본 (webp/avif)
│  ├─ icons/               # SVG
│  └─ media/
├─ css/
│  ├─ main.css             # 개발 단계: 공통+페이지 작업 파일 (PART S9). 최종: 페이지 스타일
│  ├─ common.css           # (나중에 생성) main.css의 [COMMON] 존을 이전 — PART S9
│  ├─ base/
│  │  ├─ tokens.css        # 디자인 토큰 (단일 진실 공급원)
│  │  ├─ reset.css
│  │  └─ typography.css
│  ├─ layout/              # outer(site-*), inner-box, part-box  ← PART S2 박스 3단 구조
│  ├─ components/          # button.css, card.css, nav.css …
│  ├─ utilities/           # sr-only, visually-hidden 등 최소한
│  └─ pages/               # 페이지 전용 (최소화)
├─ js/
│  ├─ main.js              # 진입점 (type="module")
│  ├─ modules/             # 기능 단위 모듈 (nav.js, modal.js …)
│  ├─ utils/               # 순수 함수 (dom.js, a11y.js …)
│  └─ config.js
├─ docs/                   # 컴포넌트 문서, 의사결정 기록(ADR)
│  └─ site-measurements-*.json   # 타겟 사이트 측정값 (PART S7)
├─ WEB_STANDARDS.md
└─ README.md
```

- **MUST** 파일명은 `kebab-case`, 소문자, 공백·한글·특수문자 금지.
- **MUST** 1파일 1책임. CSS 파일은 하나의 컴포넌트/영역, JS 파일은 하나의 모듈.
- **MUST NOT** 같은 역할의 파일을 `-new`, `-final`, `-copy`, `2` 같은 접미사로 늘리지 않는다.
- 파일 크기 가이드: CSS 파일 ≤ 300줄, JS 모듈 ≤ 250줄, 함수 ≤ 40줄. 초과하면 분리를 검토한다.

## B3. HTML 규칙

### B3.1 문서 기본
```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>페이지 제목 | 사이트명</title>
  <meta name="description" content="150자 이내의 고유한 설명">
  <link rel="canonical" href="https://example.com/">
  <meta name="theme-color" content="#...">
  <!-- OG / Twitter 메타 -->
  <link rel="preload" href="/assets/fonts/xxx.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/css/main.css">
  <script type="module" src="/js/main.js"></script>
</head>
```

- **MUST** `<!doctype html>`, `lang`, `charset`, `viewport`, 고유한 `<title>`과 `description`.
- **MUST NOT** `maximum-scale=1`, `user-scalable=no`로 확대를 막지 않는다.
- 스크립트는 `type="module"`(자동 defer) 또는 `defer`. 렌더링을 차단하는 동기 스크립트 금지.

### B3.2 시맨틱 마크업
- **MUST** 의미에 맞는 요소를 사용한다: `header`, `nav`, `main`(페이지당 1개), `section`(제목 포함), `article`, `aside`, `footer`, `figure/figcaption`, `ul/ol/dl`, `table`(데이터 용도만), `button`(동작), `a`(이동).
- **MUST NOT** `div`/`span`에 클릭 이벤트를 달아 버튼·링크 대용으로 쓰지 않는다.
- **MUST** 제목 계층(`h1`~`h6`)을 **건너뛰지 않고**, 페이지당 `h1`은 **1개**. 제목 수준은 시각적 크기가 아니라 구조로 결정한다. (크기는 CSS)
- **MUST** 레이아웃 목적으로 `table`을 사용하지 않는다.
- 불필요한 래퍼 `div`를 최소화한다. (div 수프 금지) 단, **`.inner-box` / `.part-box`는 구조상 필수 래퍼**다.
- **MUST** 페이지 최상위는 `header` + `main > section` + `footer` 이다. (PART S2.2)
- 중복 `id` 금지. `id`는 JS 훅/앵커/ARIA 연결용으로만 쓰고, 스타일링에 쓰지 않는다.

### B3.3 접근성 마크업
- **MUST** 모든 `<img>`에 `alt`. 장식 이미지는 `alt=""`. 정보 이미지는 의미를 서술한다.
- **MUST** 폼 컨트롤은 `<label for>` 또는 감싸기로 연결한다. 그룹은 `fieldset/legend`.
- **MUST** 올바른 `type`, `autocomplete`, `inputmode`, `required`를 지정한다.
- **MUST** 아이콘 전용 컨트롤에는 `aria-label` 또는 visually-hidden 텍스트.
- **MUST** 네이티브 요소로 해결 가능하면 ARIA를 쓰지 않는다. (**첫 번째 ARIA 규칙**) ARIA를 쓰면 **상태까지 동기화**한다 (`aria-expanded`, `aria-controls`, `aria-current`, `aria-hidden` 등).
- **MUST** 본문 첫 부분에 **스킵 링크**를 제공한다.
- 동적 변경은 `aria-live` 영역(`polite` 기본)으로 알린다.
- 모달/다이얼로그는 가능하면 `<dialog>`를 사용하고, 포커스 트랩·`Esc` 닫기·포커스 복귀를 보장한다.
- 키보드만으로 **모든 기능**을 사용할 수 있어야 한다. 탭 순서는 DOM 순서이며 `tabindex`는 `0` 또는 `-1`만 사용한다. (양수 `tabindex` 금지)

### B3.4 SEO · 메타
- 각 페이지에 고유한 `title`, `description`, `canonical`, OG/Twitter 카드.
- 구조화 데이터(JSON-LD)는 해당 콘텐츠가 있을 때 적용한다. (Organization, Article, Product, BreadcrumbList 등)
- `sitemap.xml`, `robots.txt`, `favicon`(SVG + PNG), `manifest`(필요 시) 제공.
- 링크 텍스트는 의미를 가진다. "여기를 클릭" 금지. 외부 링크 `target="_blank"`에는 `rel="noopener noreferrer"`.

### B3.5 이미지 · 미디어
```html
<img
  src="/assets/images/hero-800.webp"
  srcset="/assets/images/hero-400.webp 400w, /assets/images/hero-800.webp 800w, /assets/images/hero-1600.webp 1600w"
  sizes="(min-width: 1024px) 50vw, 100vw"
  width="1600" height="900"
  alt="…"
  loading="lazy" decoding="async">
```
- **MUST** `width`/`height`(또는 CSS `aspect-ratio`)로 공간을 예약한다 (CLS 방지).
- 화면 첫 영역(LCP 후보) 이미지는 `loading="lazy"` **금지**, `fetchpriority="high"` 사용.
- 포맷: AVIF/WebP 우선, 폴백 JPEG/PNG. 아이콘·로고는 SVG.
- 비디오는 `preload="metadata"`, 자동재생은 `muted playsinline`일 때만, `poster` 제공, 자막(`track`) 필요 시 제공.

## B4. CSS 규칙

### B4.1 아키텍처
- **MUST** 모든 값은 `tokens.css`의 Custom Properties를 거친다. (색, 간격, 폰트, 반경, 그림자, z-index, 모션)
- **MUST** 레이어 순서를 `@layer`로 명시한다.

```css
@layer reset, tokens, base, layout, components, utilities, pages;
```

- **MUST** 컴포넌트별 파일 + **BEM 네이밍**을 사용한다.

```css
.card { }
.card__title { }
.card__body { }
.card--featured { }       /* modifier */
.card.is-open { }         /* 상태: is-/has- 접두사 */
```

- **MUST** 박스 구조 클래스 `.site-header` `.site-section` `.site-footer` `.inner-box` `.part-box`는 **예약어**다. 컴포넌트가 이 이름을 재정의하거나 다른 의미로 쓰지 않는다. (PART S2)
- **MUST** JS 훅용 클래스는 `js-` 접두사를 쓰고 **스타일을 입히지 않는다.** (또는 `data-*` 속성 사용)
- **MUST** 선택자 **특이도를 낮게 유지**한다. 클래스 1개 수준 기본, 중첩 최대 **3단계**.
- **MUST NOT** `!important`를 쓰지 않는다. (유틸리티 레이어/접근성 오버라이드 예외, 사유 주석 필수)
- **MUST NOT** `id` 선택자, 요소 선택자 단독(`div {}`), 속성 과다 체이닝으로 스타일링하지 않는다. (리셋/베이스 레이어 제외)
- **MUST NOT** 인라인 `style` 속성을 쓰지 않는다. (JS가 동적 값을 CSS 변수로 주입하는 경우는 `style.setProperty('--x', v)`로 허용)
- 선택자 충돌 주의: `.section` 같은 구조 클래스와 `.cta` 같은 컴포넌트 클래스가 서로의 padding/margin을 덮어쓰지 않도록 **책임을 분리**한다. (구조 클래스는 간격, 컴포넌트는 내부 스타일)

### B4.2 토큰 정의 예시
```css
@layer tokens {
  :root {
    color-scheme: light dark;

    /* Primitive */
    --color-neutral-0:  #ffffff;
    --color-neutral-900:#1a1a1f;
    /* … */

    /* Semantic */
    --color-bg:        var(--color-neutral-0);
    --color-text:      var(--color-neutral-900);
    --color-accent:    /* 프로젝트 팔레트 */;
    --color-focus:     /* 대비 3:1 이상 */;

    /* Layers (z-index) */
    --z-base: 0;
    --z-sticky: 100;
    --z-dropdown: 200;
    --z-overlay: 300;
    --z-modal: 400;
    --z-toast: 500;
  }

  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) { /* semantic 토큰만 재정의 */ }
  }
  :root[data-theme="dark"] { /* semantic 토큰만 재정의 */ }
}
```

- `z-index`는 **토큰 외 숫자를 쓰지 않는다.** `9999` 금지.
- 매직 넘버 금지. 불가피하면 변수로 이름을 붙이고 이유를 주석으로 남긴다.

### B4.3 리셋 / 베이스
- **MUST** `box-sizing: border-box` 전역 적용, 최소한의 모던 리셋.
- **MUST** `html { scroll-behavior: smooth }`는 `prefers-reduced-motion: no-preference` 안에서만.
- **MUST** `html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }`.
- **MUST** `img, video, svg { max-width: 100%; height: auto; display: block; }` 수준의 안전 기본값.
- **MUST** 포커스 스타일:

```css
:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
```

- `outline: none`은 **대체 포커스 스타일이 있을 때만** 허용한다.

### B4.4 레이아웃 기술
- **페이지 뼈대는 Flexbox 파티션박스**(PART S2.4)로 만든다. **Grid는 파티션박스에 쓰지 않고, 내용 박스(카드 내부 등) 안에서만** 필요 시 사용한다. `float` 레이아웃, `position: absolute` 남용 금지.
- 간격은 `margin`을 흩뿌리지 않고 **`gap`** 과 **부모 책임의 간격**을 우선한다. (Lobotomized owl `* + *` 패턴 또는 `gap`)
- 반응형은 **Mobile First `min-width` 미디어쿼리**. 컴포넌트 단위 반응형은 **Container Queries**(`@container`)를 우선 검토한다.
- 유동 크기는 `clamp()`, `min()`, `max()`로. 고정 `px` 폭/높이를 레이아웃에 쓰지 않는다.
- **논리 속성(Logical Properties)** 을 기본으로 한다: `margin-inline`, `padding-block`, `inset-inline-start`, `inline-size`.
- 뷰포트 높이: `100vh` 대신 `100dvh`/`svh`를 사용한다. (모바일 주소창 대응)
- 고정 높이로 텍스트를 가두지 않는다. `min-height`를 사용한다.

### B4.5 단위
| 용도 | 단위 |
|---|---|
| 폰트 크기 | `rem` (+ `clamp`) |
| 간격 · 레이아웃 | `rem`, `%`, `fr`, `ch`, `dvh` |
| 테두리 · 그림자 · 헤어라인 | `px` 허용 |
| 미디어쿼리 | `em` 또는 `px` (프로젝트 내 하나로 통일) |
| 줄 높이 | 단위 없는 숫자 |

- 루트 `font-size`는 **16px 기본값을 유지**한다. (`62.5%` 트릭 금지)

### B4.6 성능 · 렌더링
- 애니메이션은 `transform`, `opacity`만. 필요한 곳에만 `will-change`를 한시적으로 쓴다.
- 대형 오프스크린 영역엔 `content-visibility: auto` + `contain-intrinsic-size`를 검토한다.
- 웹폰트: `woff2`만, `font-display: swap`(또는 `optional`), 서브셋 적용, 필요한 weight만 로드, 핵심 폰트 `preload`. 가변 폰트 우선.
- 크리티컬 CSS가 필요하면 `<head>`에 최소량 인라인한다. (1회성, 14KB 이하)
- 사용하지 않는 CSS는 제거한다.

### B4.7 CSS 작성 순서 (속성)
1. 위치/레이아웃 (`display`, `position`, `grid`, `flex`, `gap`, `inset`, `z-index`)
2. 박스 모델 (`inline-size`, `margin`, `padding`)
3. 타이포그래피
4. 시각 (`background`, `border`, `box-shadow`, `opacity`)
5. 모션 (`transition`, `animation`)
6. 기타

### B4.8 미디어 기능 대응
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
@media (hover: hover) and (pointer: fine) { /* 호버 스타일은 여기서만 */ }
@media (prefers-contrast: more) { /* 대비 강화 */ }
@media print { /* 인쇄 스타일 */ }
```
(위 reduce 블록은 `!important`가 허용되는 **예외 사례**다.)

## B5. JavaScript 규칙

### B5.1 기본
- **MUST** ES Modules (`import`/`export`) 사용. 전역 변수·전역 함수 금지.
- **MUST** `'use strict'` 상당(모듈은 기본 strict). `var` 금지, 기본 `const`, 필요 시 `let`.
- **MUST** 엄격 비교(`===`, `!==`) 사용.
- **MUST** 최신 문법 사용: optional chaining, nullish coalescing, `async/await`, `structuredClone`, `AbortController`.
- **MUST NOT** `eval`, `new Function`, `document.write`, 인라인 이벤트 핸들러(`onclick=""`)를 쓰지 않는다.
- **MUST NOT** 사용자 입력/외부 데이터를 `innerHTML`에 직접 넣지 않는다. `textContent`, `createElement`, `<template>` 사용. (HTML 삽입이 필요하면 신뢰 가능한 정적 문자열만)

### B5.2 구조 · 설계
- 기능은 **모듈 단위**로 분리하고 하나의 책임만 진다. 각 모듈은 `init()`을 export하고, `main.js`가 조립한다.

```js
// js/modules/nav.js
const SELECTORS = {
  root: '[data-nav]',
  toggle: '[data-nav-toggle]',
  panel: '[data-nav-panel]',
};

export function initNav(root = document.querySelector(SELECTORS.root)) {
  if (!root) return;                         // 대상이 없으면 조용히 종료
  const toggle = root.querySelector(SELECTORS.toggle);
  const panel  = root.querySelector(SELECTORS.panel);
  if (!toggle || !panel) return;

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { setOpen(false); toggle.focus(); }
  });
}
```

- DOM 훅은 **`data-*` 속성**을 사용한다. (스타일용 클래스와 분리)
- 상태는 **DOM 속성(`aria-*`, `data-state`, `hidden`)** 에 반영하고, CSS는 그 속성을 보고 스타일링한다. (JS가 인라인 스타일을 만지지 않도록)
- 함수는 **순수 함수를 선호**하고, 부수효과는 경계에 격리한다. 함수당 인자 ≤ 3개 (초과 시 객체).
- 매직 스트링/넘버는 상수로 추출한다.
- 중복 코드 3회 이상이면 유틸로 추출한다. (2회까지는 추출을 서두르지 않는다)

### B5.3 DOM · 이벤트
- **이벤트 위임**을 우선한다. 동적 요소에 개별 리스너를 달지 않는다.
- 스크롤/리사이즈/입력 이벤트는 `{ passive: true }`, **throttle/debounce** 또는 `requestAnimationFrame`을 적용한다.
- 스크롤 기반 로직은 **`IntersectionObserver`** 를 우선한다. (`scroll` 이벤트 폴링 지양) 크기 감지는 `ResizeObserver`.
- 레이아웃 스래싱 금지: DOM **읽기와 쓰기를 분리**하고 배치 처리한다.
- 리스너/옵저버/타이머를 만들었다면 **정리(cleanup) 경로**를 보장한다. (`AbortController` signal 활용)
- 키보드 상호작용을 **함께 구현**한다. (`Enter`/`Space`/`Esc`/방향키/`Tab`)
- 포커스 관리: 다이얼로그·메뉴·동적 콘텐츠 변경 시 포커스를 의도적으로 이동하고 복귀시킨다.

### B5.4 비동기 · 에러 처리
```js
export async function fetchJson(url, { signal } = {}) {
  try {
    const res = await fetch(url, { signal, headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    if (err.name === 'AbortError') return null;
    console.error('[fetchJson]', url, err);
    throw err;                       // 호출부가 UI 에러 상태를 결정
  }
}
```
- **MUST** 모든 비동기 호출에 에러 처리와 **사용자에게 보이는 실패 상태**를 둔다. 조용히 삼키지 않는다.
- **MUST** 요청 중 **로딩 상태**를 노출하고, 중복 제출을 방지한다.
- **MUST** 타임아웃/취소(`AbortController`)를 고려한다.
- `localStorage`/`sessionStorage` 접근은 `try/catch`로 감싸고 **사용 불가를 가정한 폴백**을 둔다.
- 개인정보·토큰·비밀번호를 `localStorage`에 저장하지 않는다.

### B5.5 네이밍 · 스타일
| 대상 | 규칙 | 예 |
|---|---|---|
| 변수/함수 | `camelCase`, 동사+명사 | `getUserName`, `toggleMenu` |
| 불리언 | `is/has/can/should` 접두사 | `isOpen`, `hasError` |
| 상수 | `UPPER_SNAKE_CASE` | `MAX_ITEMS` |
| 클래스/생성자 | `PascalCase` | `Carousel` |
| 이벤트 핸들러 | `handle` + 대상 + 이벤트 | `handleFormSubmit` |
| 파일 | `kebab-case.js` | `scroll-spy.js` |

- 들여쓰기 2스페이스, 세미콜론 사용, 작은따옴표, 후행 쉼표(ES5+), 한 줄 100자 이하. (Prettier 기본값에서 `singleQuote` 정도만 조정)
- 약어/한 글자 변수(`e`, `i` 같은 관용 제외) 금지. **의도가 드러나는 이름**을 쓴다.
- **주석은 "왜"를 쓴다.** "무엇"은 코드가 말한다. 복잡한 로직에는 JSDoc을 작성한다.
- `TODO`는 `TODO(담당/날짜): 내용` 형식으로, 방치하지 않는다.

### B5.6 브라우저 API 가이드
- 기능 감지로 대응한다. (`'IntersectionObserver' in window`) UA 스니핑 금지.
- 사용자 선호를 읽는다: `matchMedia('(prefers-reduced-motion: reduce)')`, `prefers-color-scheme`.
- 모션 로직은 reduced-motion일 때 **비활성화 또는 단순화**한다.
- 서드파티 스크립트는 `async/defer`, **동의/성능 영향**을 고려해 지연 로드한다.

## B6. 성능 예산 (Performance Budget)

| 지표 | 목표 (모바일, 4G 기준) |
|---|---|
| Lighthouse Performance / Accessibility / Best Practices / SEO | **각 90+ (A11y는 100 목표)** |
| LCP | ≤ 2.5s |
| INP | ≤ 200ms |
| CLS | ≤ 0.1 |
| TBT | ≤ 200ms |
| 초기 HTML | ≤ 30KB (gzip) |
| 초기 CSS | ≤ 60KB (gzip) |
| 초기 JS | ≤ 100KB (gzip) |
| 초기 이미지(Above the fold) | ≤ 200KB |
| 웹폰트 | ≤ 2 패밀리, 총 ≤ 150KB |

- **MUST** 예산 초과 시 원인을 제거하거나 사유를 문서화한다.
- **SHOULD** 폴드 아래 JS는 `import()`로 **지연 로딩**하고, 상호작용 시점에 로드한다.
- **SHOULD** 정적 자산에 캐시 가능한 파일명(해시)과 적절한 캐시 헤더를 적용한다. (배포 환경 해당 시)
- 외부 도메인 연결은 `preconnect`/`dns-prefetch`로 최소화하되 **필요한 것만**.

## B7. 보안

- **MUST** 모든 사용자 입력을 **신뢰하지 않는다.** 클라이언트 검증은 UX용이며 서버 검증을 대체하지 않는다.
- **MUST** XSS 방지: B5.1의 `innerHTML` 금지 규칙 준수. URL은 `new URL()`로 검증하고 `javascript:` 스킴을 차단한다.
- **MUST** 외부 링크 `rel="noopener noreferrer"`. 외부 스크립트에 SRI(`integrity` + `crossorigin`)를 적용한다.
- **SHOULD** CSP(Content-Security-Policy), `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` 헤더를 배포 설정에 포함한다. (인라인 스크립트 최소화로 CSP 호환)
- **MUST NOT** API 키, 시크릿, 토큰을 소스에 커밋하지 않는다. 공개용 키라도 **도메인 제한**을 건다.
- **MUST** HTTPS 전제. 혼합 콘텐츠 금지.
- 폼은 CSRF 방어(서버)와 스팸 방어(허니팟/캡차)를 고려한다.
- 쿠키 사용 시 `Secure`, `HttpOnly`, `SameSite`를 적용한다. (서버 영역)

## B8. 개인정보 · 법규

- 쿠키/추적 도구는 **동의 전 로드하지 않는다.** (해당 지역 법규 준수)
- 개인정보 처리방침, 이용약관 링크를 푸터에 제공한다. (서비스 성격에 따라)
- 수집하는 정보는 **필요 최소한**으로 한다.

## B9. 접근성 구현 (Developer 책임 범위)

- 자동 검사(axe, Lighthouse)는 **필요조건일 뿐**이다. 수동 검증을 반드시 한다.
- **수동 검증 절차:**
  1. 마우스를 떼고 `Tab`/`Shift+Tab`/`Enter`/`Space`/`Esc`/방향키만으로 전 기능 사용
  2. 포커스가 항상 보이고 논리적 순서로 이동하는지
  3. 스크린리더(NVDA/VoiceOver)로 제목·랜드마크·폼·상태 변경이 읽히는지
  4. 브라우저 200% 확대, 텍스트 간격 확대에서 깨짐 없음
  5. `prefers-reduced-motion` 활성화 시 모션 감소
  6. 색상 대비 및 흑백 모드에서 정보 손실 없음
- 동적 UI(탭, 아코디언, 메뉴, 모달, 툴팁, 콤보박스)는 **WAI-ARIA Authoring Practices 패턴**을 따른다.
- 커스텀 컨트롤은 네이티브 대체(`details/summary`, `dialog`, `popover`, `input`)를 **먼저 검토**한다.

## B10. 에러 · 엣지 케이스

구현 시 아래를 반드시 고려한다.

- 콘텐츠가 **매우 길 때 / 비었을 때 / 한 글자일 때** (텍스트 오버플로, 말줄임, 최소 높이)
- 이미지 로딩 실패 (대체 배경/`alt` 노출)
- JS 비활성/실패 (`<noscript>` 안내, 핵심 콘텐츠 접근 가능)
- 느린 네트워크 / 오프라인
- 다양한 언어, 긴 단어, RTL 가능성 (논리 속성으로 대비)
- 브라우저 뒤로가기/새로고침 시 상태
- 터치 / 마우스 / 키보드 혼용
- 고해상도(2x/3x) 디스플레이, 다크 모드, 고대비 모드, 인쇄

## B11. 품질 도구 · 워크플로

- **포맷터/린터(권장)**: Prettier, ESLint(`eslint:recommended` + `no-var`, `eqeqeq`), Stylelint(`stylelint-config-standard`), HTMLHint 또는 html-validate.
- **검증**: W3C HTML Validator, CSS Validator, Lighthouse, axe DevTools.
- **Git 규칙**
  - 브랜치: `main`(배포), `feat/…`, `fix/…`, `chore/…`
  - 커밋: Conventional Commits (`feat: 내비게이션 모바일 메뉴 추가`, `fix: 폼 오류 메시지 포커스 이동`)
  - 한 커밋 = 한 논리적 변경. 포맷팅 변경과 기능 변경을 섞지 않는다.
- **문서화**: 새 컴포넌트는 `docs/`에 용도, 마크업 예시, 변형, 상태, 접근성 메모를 남긴다. 의미 있는 설계 결정은 ADR(결정 사유 1단락)로 기록한다.
- **테스트**: 최소한 핵심 유틸 함수의 단위 테스트 가능성을 확보하고, 핵심 흐름(폼 제출, 내비게이션)은 수동 체크리스트를 따른다.

## B12. 개발자 산출물 체크리스트

- [ ] HTML이 W3C 검증을 통과하고, 제목 계층·랜드마크가 올바르다.
- [ ] CSS에 raw 색/간격/폰트 값이 없다. (전부 토큰)
- [ ] `!important`, 인라인 스타일, ID 선택자, 인라인 이벤트가 없다.
- [ ] 키보드만으로 전 기능이 동작하고 포커스가 항상 보인다.
- [ ] `prefers-reduced-motion`, 다크 모드(해당 시)를 지원한다.
- [ ] 320px ~ 1920px에서 가로 스크롤/깨짐이 없다.
- [ ] 이미지에 `alt`, `width/height`, 적절한 `loading`/`srcset`이 있다.
- [ ] JS에 전역 오염, 미처리 에러, 누수(리스너/타이머)가 없다.
- [ ] 콘솔 에러/경고가 0건이다.
- [ ] Lighthouse 목표 점수와 성능 예산을 충족한다.
- [ ] 외부 의존성을 추가하지 않았거나, 사유를 문서화했다.

---

# PART C. 협업 규칙 (Designer ↔ Developer)

1. **토큰이 계약서다.** 디자인 변경은 토큰 변경으로 전달되고, 개발은 토큰만 참조한다. 컴포넌트 CSS 수정으로 디자인을 바꾸지 않는다.
2. **새 패턴 제안 절차**: ① 기존 컴포넌트로 불가능한 이유 설명 → ② 상태 매트릭스 + 접근성 설계 포함 → ③ 구현 → ④ `docs/` 반영.
3. **디자인-코드 불일치**는 코드가 아니라 **토큰/문서**에서 먼저 바로잡는다.
4. **디자이너 에이전트**는 산출물을 "토큰 + 컴포넌트 명세 + 상태 + 카피"로 넘기고, **개발자 에이전트**는 그 명세 밖의 시각 결정을 임의로 하지 않는다. 명세가 비어 있으면 질문하거나 가정을 명시한다.
5. 성능·접근성·보안 문제는 디자인/개발 어느 쪽에서 발견해도 **즉시 공유**하고, 해결 전까지 완료로 간주하지 않는다.

---

# PART S. 프로젝트 전용 규약 — 홍익대학교 산업디자인학과 2025 졸업전시 `<WHAT IF>`

> **Part S는 Part A · B보다 우선한다.** 충돌하는 항목은 이 Part의 내용이 일반 규칙을 덮어쓴다.
> 타겟 사이트: https://hongik-id-degreeshow2025.com/
> **복제 범위**: 타겟 사이트의 **디자인 언어(박스 수치 · 글자 · 색상)** 만 계승한다. **내부 레이아웃은 계승하지 않는다.** 레이아웃은 S2의 3단 박스 구조를 따른다.

## S0. 값의 신뢰 등급 (에이전트 필독)

이 Part의 수치는 출처에 따라 등급이 다르다. 등급을 임의로 올리지 않는다.

| 등급 | 의미 | 에이전트 행동 |
|---|---|---|
| **[확정]** | 오너가 지정했거나, 제공된 원본 HTML/CSS에서 직접 확인된 값 | 그대로 따른다 |
| **[기본값]** | 오너 규칙에 따라 정해진 임시 기본값 | 사용하되, 사이트 값이 추출되면 교체한다 |
| **[main.css 개발]** | `common.css` 대응 영역(서체·헤더·푸터·검색·전체 메뉴·리셋·본문 기본값). 오너 결정으로 **측정하지 않고 `main.css`에서 직접 개발**한다 | PART S9 절차대로 제안 → 승인 → 구현 → 결정 기록 |
| **[추출 필요]** | 원본에서 아직 확인되지 않은 항목(현재는 `common.css` 미제공 영역). 현재 값 없음 | **추측하여 채우지 않는다.** S7의 추출 절차로 얻은 값만 기록한다 |

> 값이 `[추출 필요]`인 상태에서 구현이 필요하면, 임의 수치를 쓰지 말고 `tokens.css`에 `/* TODO(extract) */` 주석과 함께 중립적 임시값을 두고, 완료 보고의 "가정한 사항"에 반드시 적는다.

## S1. 타겟 사이트 구조 분석 `[확정]`

> 출처: 오너가 제공한 `index` HTML 원본 + `index_pc.css` / `index_tablet.css` / `index_mobile.css` (+ 웹 수집 텍스트).
> **미제공**: `common.css`는 **0바이트(빈 파일)** 로 전달되었다. 따라서 **본문(body) 기본값, 서체(font-family), 헤더·푸터·GNB·전체메뉴·검색 패널의 스타일은 아직 알 수 없다.** 이 영역은 계속 `[추출 필요]`다. (S7)
> `swiper.min.css`는 라이브러리 CSS이며 **홈 HTML에 Swiper 마크업이 없다.** 이 프로젝트에 가져오지 않는다.

### S1.1 사이트 개요
- 사이트명: 홍익대학교 산업디자인학과 / 2025 졸업전시회 `<WHAT IF>` ("쓸모없음의 쓸모, 만약에")
- 페이지: `HOME`, `PROJECTS`(하위: All / Product / Mobility / Spatial / Interaction), `MAGAZINE`, `EXHIBITION`, `INDEX`, `ARCHIVE`
- 언어: **한국어 + 영어 병기**
- 뷰포트 메타: `width=device-width, initial-scale=1.0, maximum-scale=2.0, user-scalable=yes` (확대 허용 — Part B3.1과 일치)
- **다크 전용 사이트**다. 모든 섹션 배경이 검정 계열이다. (S5)

### S1.2 원본 DOM 구조 (참고용 — 우리는 이 구조를 따르지 않는다)

```
#wrap
 ├─ ul.blind > a[href=#contents]            스킵 링크
 ├─ .cursor                                 커스텀 커서 (JS)
 ├─ #header
 │   ├─ .head > h1(로고 링크) · .mobileTitle · .gnb(ul 5개 + .btnSearch + .btnMenu)
 │   ├─ .fixSearch > form(input + button) + .searchKeyword(ul 해시태그 28개)
 │   └─ .allMenu > ul(HOME, PROJECTS[하위 5], MAGAZINE, EXHIBITION, INDEX, ARCHIVE)
 └─ #container > #contents
     ├─ .visual   (position:fixed, 100vh, 비디오 배경 + .btnNtext[2025. | Enter] + .mobileTxts + .scroll)
     ├─ .sec1     소개: .whatif(타이틀 이미지) + .con(.bg, .txtWrap[.slg, .txts[h3 + .kr + .en]])
     ├─ .sec2     Offline Exhibition: .titlearea[h3 + 날짜 prev/next] + .con > video(100vh)
     ├─ .sec3     Branding Identity (※ 원본에서 inline style="display:none" → 현재 비노출)
     ├─ .sec4     Projects: .titlearea[h3 + Preview/Click Enter] + .con > ul(li 10개) + .btn(Enter)
     └─ #footer > .foot > .conWrap[.whatif, .textarea] + .conBtmWrap[ul.fm, .info dl×3, ul.link]
```

- 프로젝트 프리뷰 10개는 **서버에서 동적으로 채워진다.** (프로젝트 카드 = 썸네일 + 호버 시 `prjName` / `prjExp` / `name`)
- 카드 구조: `li > a > .thumb + img + .hover(.info[.prjName .prjExp] + .name)`

### S1.3 원본에서 확인된 동작 (디자인 정체성에 해당)
| 동작 | 내용 |
|---|---|
| **커버 리빌** | `.visual`이 `position: fixed; 100vh`로 뒤에 깔리고, `#contents`가 `padding-top: 100vh`로 그 위를 덮으며 올라온다 |
| 스크롤 안내 | 아이콘이 `translateY(0 → 5px)`를 1s `infinite alternate`로 반복 (PC에서만 표시) |
| 텍스트 등장 | 소개/브랜딩 텍스트가 `opacity: 0` + `translateY(40px)`(제목은 `translateX(40px)`, 브랜딩 `h4`는 `scale(.5)`)에서 시작 → JS(GSAP ScrollTrigger)가 등장시킴 |
| `Enter` 호버 | 색이 `#FA4616`으로 바뀌고 `→`가 아래에서 슬라이드 인 (0.4s) |
| GNB 호버 | 링크가 `translate(0.3rem, -0.4rem)` 이동 + 흰색 |
| 프로젝트 카드 호버 | 파란 그라디언트 막이 아래→위로 올라오고, `info`(+0.3s 지연)와 `name`(+0.4s 지연)이 차례로 나타남 |
| Enter 버튼 호버 | `#de3b29` → `#005ada` 순서로 좌→우 채움 (0.4s, 두 번째는 0.15s 지연), PC에서만 |
| 영상 | 히어로 영상은 `autoplay muted playsinline`, 모바일은 영상을 숨기고 정지 이미지(`mobile_mainVisual.jpg`) 사용. 전시 영상은 `loop` 포함 |

### S1.4 반응형 구간 `[확정]`

원본은 **3개의 CSS 파일을 `media` 속성으로 분기**한다.

| 구간 | 조건 | 비고 |
|---|---|---|
| PC | `min-width: 1400px` | 내부에 1700 / 1650 / 1560px 미세 조정이 더 있음 |
| Tablet | `813px ~ 1399px` | |
| Mobile | `max-width: 812px` | |

- **우리 구현**: Mobile First로 뒤집는다. 기본 = Mobile, `@media (min-width: 813px)` = Tablet, `@media (min-width: 1400px)` = PC. 이 두 값은 Part A5.3의 일반 브레이크포인트(640/768/1024…)를 **대체**한다.
- 1700/1650/1560px 미세 조정은 **미디어쿼리로 따라 만들지 않고** `clamp()` 보간으로 흡수한다. (S4.5)
- 토큰: `--bp-tablet: 813px; --bp-pc: 1400px;` (CSS 변수는 미디어쿼리에 쓸 수 없으므로 **주석·문서용**이다. 값은 쿼리에 직접 적되 이 두 수치만 쓴다.)

### S1.5 원본에서 계승하지 않는 것 (MUST NOT 복제)

원본은 일반 규약(Part A·B)과 충돌하는 구현이 있다. **디자인 값만 가져오고 구현은 따라 하지 않는다.**

| 원본 구현 | 문제 | 우리 방식 |
|---|---|---|
| `#wrap`, `#header`, `#container`, `#contents`, `#footer` ID 구조 | ID 스타일링 금지(B4.1), 3단 박스 구조와 불일치 | `.site-header` / `main > .site-section` / `.site-footer` + `.inner-box` |
| `<html charset="utf-8">`, `language="javascript"` | 무효 속성 | `<html lang="ko">`, `<meta charset>` |
| `<a class="btnMenu">`, `<a class="btnSearch">`에 `href` 없음 | 키보드 접근 불가 | `<button type="button" aria-expanded aria-controls>` |
| 날짜 `<a class="prev">`/`.next`(링크 아님) | 의미 오용 | `<time datetime>` |
| `alt=""` 인 타이틀 이미지(`whatif.png` 등 **글자가 들어간 이미지**) | 정보 손실 | 실제 텍스트/SVG, 또는 `alt="What If"` |
| 카드 정보가 **호버에서만** 표시 | 터치·키보드 불가 | `:hover`, `:focus-visible`, `:focus-within` 모두 대응 + 터치 기기는 기본 표시(S6.3) |
| `opacity: 0` 이 기본값(JS가 켜야 보임) | JS 실패 시 본문이 영구 숨김 | 기본은 보이게, `.js` 클래스가 붙은 뒤에만 숨김 상태 적용(S6.5) |
| GSAP 두 버전(3.12.5 + 3.11.5) 중복 로드, jQuery, jQuery UI | 불필요한 의존성·중복 | 의존성 추가 없음. `IntersectionObserver` + CSS. GSAP 사용 여부는 오너가 정한다 |
| `position: absolute` + `transform` 중심 레이아웃 | 3단 박스 규칙 위반, 반응형 취약 | flex 파티션(S2) |
| `font-size`를 `px`/`vw`로 직접 지정 | 확대 대응 불가, 토큰 없음 | `rem` + `clamp()` 토큰(S4) |
| `sec3`의 인라인 `display:none` | 인라인 스타일 금지 | 섹션을 포함할지 오너에게 확인. 제외 시 마크업 자체를 만들지 않는다 |
| 소개문 오탈자(`spontaneou Inaction`) | | 원문을 그대로 복사하지 말고 오너에게 확인 |
| 로고를 `<h1>`로 사용 | 페이지 제목이 아님 | 로고는 홈 링크. `h1`은 페이지당 1개, 히어로 타이틀에 부여 |

## S2. 전체 레이아웃 규칙 `[확정]`

### S2.1 3단 박스 구조 (MUST)

모든 페이지는 아래 **3단 박스**만으로 뼈대를 만든다.

```
겉박스(Outer)  →  속박스(Inner)  →  파티션박스(Partition)
```

| 단계 | 정의 | 실체 | 클래스 | 주 책임 |
|---|---|---|---|---|
| 1. 겉박스 | 영역 전체를 감싸는 가로 전체폭 박스 | `<header>`, `<main>` 안의 `<section>`, `<footer>` 요소 자체 | `.site-header` / `.site-section` / `.site-footer` | 배경, 세로 패딩(`padding-block`) |
| 2. 속박스 | 콘텐츠 폭을 제한하고 중앙에 두는 박스 | `<div>` | **`.inner-box`** (이름 고정) | `max-inline-size`, 중앙 정렬, 가로 패딩 |
| 3. 파티션박스 | 속박스 안을 나누는 박스 | `<div>` | `.part-box` | `display: flex`, `gap`, `flex-wrap` |

> `.inner-box`는 오너가 지정한 이름이다. `.site-*`, `.part-box`는 이 문서가 제안한 이름이며 프로젝트 전체에서 **동일하게 고정**한다.
> **금지 이름**: `.container`, `.wrapper`, `.wrap`, `.inner`, `.content-wrap`, `.box`, `.row`, `.col` 등 같은 역할의 다른 이름.

### S2.2 겉박스 전체 구조 (MUST)

```html
<body>
  <a class="skip-link" href="#contents">본문 바로가기</a>

  <header class="site-header">
    <div class="inner-box">
      <div class="part-box"> <!-- 로고 | GNB | 도구(검색·메뉴) --> </div>
    </div>
  </header>

  <main id="contents">
    <section class="site-section" aria-labelledby="intro-title">
      <div class="inner-box">
        <div class="part-box"> … </div>
        <div class="part-box"> … </div>
      </div>
    </section>
    <!-- section 반복 -->
  </main>

  <footer class="site-footer">
    <div class="inner-box">
      <div class="part-box"> … </div>
    </div>
  </footer>
</body>
```

- **MUST** 페이지의 최상위 구조는 **`header` + `main > section(여러 개)` + `footer`** 이다. 이 외의 최상위 박스를 만들지 않는다.
- **MUST** `main`의 직계 자식은 `section`뿐이다. (`main > div` 금지)
- **MUST** 모든 `section`은 **자기 `.inner-box`를 1개** 가진다. (`section > .inner-box`)
- **MUST** `header`, `footer`도 각각 `.inner-box`를 가진다.
- **MUST NOT** `.inner-box` 안에 `.inner-box`를 중첩하지 않는다.
- **MUST NOT** 박스 단계를 늘리지 않는다. (겉 > 속 > 파티션 이외의 "래퍼 박스" 추가 금지)

### S2.3 속박스 `.inner-box` (MUST)

```css
@layer layout {
  .inner-box {
    inline-size: 100%;
    max-inline-size: var(--inner-max);      /* 기본 1920px */
    margin-inline: auto;                    /* 중앙 정렬 */
    padding-inline: var(--inner-pad-x);     /* 가로 패딩은 속박스 책임 */
  }
}
```

| 토큰 | 값 | 등급 | 규칙 |
|---|---|---|---|
| `--inner-max` | `1920px` | **[확정·기본값]** | 오너 규칙: *사이트에 max-width가 적용되지 않았으면 1920px로 설정*. 타겟 사이트에서 별도 max-width가 확인되면 그 값으로 교체 |
| `--inner-pad-x` | `[추출 필요]` | 추출 필요 | 모바일/태블릿/데스크톱 3단계로 `clamp()` 정의 가능 |

- **MUST** `.inner-box`에 배경색·배경이미지를 넣지 않는다. 배경은 **겉박스**에 둔다. (배경이 전체폭으로 펼쳐지도록)
- **MUST** `.inner-box`의 `max-inline-size`는 **토큰으로만** 지정한다. 섹션별로 다른 폭이 필요하면 **modifier 토큰 오버라이드**(`.inner-box--narrow { --inner-max: … }`)로 처리하고, 수치를 직접 쓰지 않는다.
- **MUST** 가로 패딩은 `.inner-box`에만 둔다. 겉박스·파티션박스에 좌우 패딩/마진을 주지 않는다.

### S2.4 파티션박스 `.part-box` (MUST)

```css
@layer layout {
  .part-box {
    display: flex;
    gap: var(--part-gap);
    min-inline-size: 0;
  }
  .part-box--wrap { flex-wrap: wrap; }       /* 줄바꿈이 필요한 내용일 때만 */
}
```

- **MUST** 파티션박스는 **기본적으로 `display: flex`** 를 사용한다.
- **MUST** 내용이 줄바꿈되어야 하면(카드 목록, 태그 목록, 작품 리스트 등) `flex-wrap: wrap`을 적용한다. (`.part-box--wrap`)
- **MUST NOT** 파티션박스를 `display: grid`로 만들지 않는다.
- **MAY** 파티션박스 **내부의 내용 박스(content box)** 에는 필요 시 `display: grid`를 쓴다. (예: 프로젝트 카드 내부의 이미지/텍스트 배치, 날짜 표)
- 파티션 간 간격은 **`gap`** 으로만 만든다. 파티션박스끼리 `margin`으로 간격을 만들지 않는다.
- 파티션박스의 크기는 `flex` 단축 속성으로 정한다.

```css
.part-box__item--half { flex: 1 1 calc(50% - var(--part-gap) / 2); min-inline-size: 0; }
.part-box__item--fixed { flex: 0 0 var(--part-fixed-w); }
.part-box__item--fill  { flex: 1 1 0; min-inline-size: 0; }
```

- **MUST** 파티션 자식에 `min-inline-size: 0`을 두어 텍스트·이미지가 flex 컨테이너를 밀어내지 않게 한다.
- **MUST** 모바일에서는 파티션이 **세로로 쌓이도록**(`flex-direction: column` 또는 wrap) 설계하고, 데스크톱에서 `row`로 전환한다. (Mobile First)

### S2.5 박스 규칙 요약 (치트시트)

| 항목 | 겉박스 | 속박스 `.inner-box` | 파티션박스 `.part-box` | 내용 박스 |
|---|---|---|---|---|
| 배경 | ○ | ✕ | ✕ (필요 시 `--surface` 토큰만) | △ |
| `padding-block` | ○ (섹션 세로 리듬) | ✕ | ✕ | ○ |
| `padding-inline` | ✕ | ○ | ✕ | △ |
| `max-inline-size` | ✕ | ○ | ✕ | △ |
| `margin-inline: auto` | ✕ | ○ | ✕ | ✕ |
| `display` | block | block | **flex** | flex / **grid 허용** |
| `gap` | ✕ | ✕ | ○ | ○ |
| 요소 간 `margin` | ✕ | ✕ | ✕ | 최소한(텍스트 흐름용) |

### S2.6 Part A · B 규칙 중 이 구조 때문에 바뀐 것

| 기존 규칙 | 변경 |
|---|---|
| A5.2 "12컬럼 그리드 기준" | **폐기.** 컬럼 그리드 대신 파티션박스 `flex` 비율로 배치한다. |
| A5.2 컨테이너 최대폭 토큰 | `--container-max` → **`--inner-max`** 로 일원화. |
| B4.4 "2차원 레이아웃은 Grid" | **페이지 뼈대에는 적용하지 않는다.** Grid는 *내용 박스* 안에서만 쓴다. |
| B4.1 BEM 예시 `.card` 등 | 박스 구조 클래스(`.site-*`, `.inner-box`, `.part-box`)는 **예약어**다. 컴포넌트가 이 이름을 재사용·재정의하지 않는다. |

## S3. 박스 관련 수치 규칙 (크기 · 패딩 · 마진) `[확정]`

> 출처: `index_pc/tablet/mobile.css`의 선언값. **단, 헤더·푸터 영역은 `common.css` 미제공으로 아직 미확정.**
> 모든 값은 **토큰으로만** 선언한다. `rem` 환산은 16px 기준. 원본의 수치는 4/8px 스케일에 맞지 않는 값(30, 70, 378 등)이 있으며, Part A5.1의 "사이트 측정값 우선" 원칙에 따라 **반올림하지 않고 그대로 토큰화**한다. (`--space-*` 스케일에 섞지 않고 용도명 토큰으로 별도 선언)

### S3.1 속박스 · 겉박스 토큰

| 토큰 | Mobile (≤812) | Tablet (813~1399) | PC (≥1400) | 원본 근거 |
|---|---|---|---|---|
| `--inner-max` | `1920px` | `1920px` | `1920px` | 원본에 max-width 없음(전폭) → 오너 규칙에 따라 **1920px** |
| `--inner-pad-x` | `5%` | `2.25rem`(36px) | `2.25rem`(36px) | `.objLeft/.objRight/.scroll/.titlearea .prev·.next`의 좌우 오프셋: PC·Tablet **36px**, Mobile **5%** |
| `--section-min-h` | `100dvh` | `100dvh` | `100dvh` | 히어로·전시 영상·브랜딩·프로젝트가 모두 `100vh` |
| `--hero-h` | `100dvh` | `100dvh` | `100dvh` | `.visual` 100vh |

- `100vh`는 원본 값이지만 우리는 **`100dvh`** 로 쓴다(모바일 주소창 대응, Part B4.4). 폴백이 필요하면 `100vh`를 먼저 선언하고 `100dvh`를 덮어쓴다.
- 좌우 36px은 **`.inner-box`의 `padding-inline`** 으로만 구현한다. (원본처럼 각 요소에 `left:36px` 절대 배치하지 않는다)

### S3.2 파티션 · 내용 간격 토큰

| 토큰 | Mobile | Tablet | PC | 용도 / 원본 근거 |
|---|---|---|---|---|
| `--part-gap` | `1.25rem`(20px) | `1.25rem` | `1.25rem` | 프로젝트 카드 사이 `gap:20px` |
| `--title-to-content` (전시) | `4.375rem`(70px) | `4.375rem` | `4.375rem` | `.sec2 .titlearea` `margin-bottom:70px` |
| `--title-to-content` (프로젝트) | `3.75rem`(60px) | `7.5rem`(120px) | `7.5rem` | `.sec4 .titlearea` `padding-bottom` |
| `--cta-margin-top` | `3.75rem`(60px) | `7.5rem`(120px) | `7.5rem` | `.sec4 .btn` `margin-top` |
| `--intro-text-top` | `5vw` | `5vw` | `5vw` | `.txts` `margin-top:5vw` (→ `clamp(1.5rem, 5vw, 6rem)`로 보간) |
| `--intro-block-top` | `2.5rem`(40px) | `2.5rem` | — | `.txts>div` `margin:40px auto 0` (Tablet·Mobile) |
| `--para-gap` | `1.875rem`(30px) | `1.875rem` | `1.875rem` | `.kr p`, `.en p` `margin-bottom:30px` (마지막 문단은 0) |
| `--lang-group-gap` | `3.75rem`(60px) | `3.75rem` | `3.75rem` | `.kr` `margin-bottom:60px` (KO 묶음 ↔ EN 묶음) |
| `--brand-title-gap` | `2.5rem`(40px) | `5rem`(80px) | `5rem` | `.sec3 h4` `margin-bottom` |
| `--brand-para-gap` (KO) | `2.5rem`(40px) | `3.75rem`(60px) | `3.75rem` | `.sec3 p` `margin-bottom` |
| `--brand-para-gap` (EN) | `1.25rem`(20px) | `1.875rem`(30px) | `1.875rem` | `.sec3 p.en` `margin-bottom` |
| `--info-name-gap` | `1.25rem`(20px) | 동일 | 동일 | 카드 `.prjExp` `margin-top:20px` |

### S3.3 소개 섹션 파티션 비율 `[확정]`

| 구간 | 구성 |
|---|---|
| PC | 가로 `flex` 2분할: **제목 25% : 본문 75%**. 전체 폭은 `.inner-box` 안에서 `90%`(원본 `.txts{width:90%}`) |
| Tablet · Mobile | **세로 적층**, 중앙 정렬. 본문 폭 `85%`(`margin: 40px auto 0`) |

```css
.part-box__item--intro-title { flex: 0 0 25%; }
.part-box__item--intro-body  { flex: 1 1 75%; min-inline-size: 0; }
```

### S3.4 컴포넌트 크기

| 컴포넌트 | Mobile | Tablet | PC | 비고 |
|---|---|---|---|---|
| 프로젝트 카드(정사각) | `180px` | `378px` | `378px` | `aspect-ratio: 1/1`, `flex-shrink: 0` |
| `Enter` 버튼 | `160 × 50px` | `223 × 71px` | `223 × 71px` | `border-radius: 50px`(완전한 알약형) |
| 스크롤 아이콘 | 숨김 | 숨김 | `40 × 40px` | PC에서만 표시 |
| 브랜딩 배경 이미지(sec3) | 폭 100%(상·하단 장식) | 폭 `70%` | 폭 `55%` | `aspect-ratio: 996 / 893` |

> 카드·버튼의 `px` 크기는 **고정 크기 컴포넌트**이므로 예외적으로 `px`를 허용하되, 반드시 `--card-size`, `--btn-w`, `--btn-h` 토큰으로 선언한다.

### S3.5 반경 · 선 · 그림자 `[확정]`
- 반경: **`50px`(알약형 버튼)만** 사용. 그 외 모든 박스는 **0**. → `--radius-pill: 50px` 하나만 정의하고 `--radius-sm/md/lg`는 만들지 않는다. (Part A5.4의 3단계 반경 규칙을 이 프로젝트에서는 **적용하지 않는다**)
- 테두리: 원본에 없음. 박스 구분은 **색(검정 계열 간 미세 차이)과 여백**으로만 한다.
- 그림자: 박스 그림자 없음. 예외로 브랜딩 EN 문단에 `text-shadow: 1px 1px 2px rgba(255,255,255,.1)`가 있다(≤1560px, 선택 사항).
- `z-index` 사용: `10`(장식 레이어), `100`(텍스트·버튼 오버레이). → `--z-deco: 10; --z-overlay-text: 100;` Part B4.2의 `z-index` 토큰 체계 안에 **병합**한다.

### S3.6 아직 미확정 `[main.css 개발]` (common.css 대응 영역)
`--header-h`(PC/Tablet/Mobile), `--footer-pad-y`, 헤더 내부 간격, 검색 패널 높이, 전체 메뉴 패널 간격, 푸터 내부 파티션 간격.

## S4. 글자 관련 규칙

### S4.1 확인된 사실 `[확정]`
- **영문 라벨·내비게이션은 대문자 표기**: `PROJECTS`, `MAGAZINE`, `EXHIBITION`, `INDEX`, `ARCHIVE`, 해시태그(`#AUTOMOTIVE INTERIOR` 등).
- **제목/라벨 영문은 Title Case**: `Offline Exhibition`, `Branding Identity`, `Projects`, `Scroll down`.
- **본문은 한국어, 이어서 영어를 병기**한다.
- 메인 타이틀은 3줄로 끊어 표기한다: `Hongik University / Industrial Design / Degree Show`.
- 날짜는 `2025. 11. 04` 형식(마침표 + 공백)이다. 모바일은 앞 `20`을 생략한다(`25. 11. 04`) — 원본 마크업의 `<span class="pcv">20</span>`. 우리는 `<time datetime>` 안에서 `<span class="pc-only">20</span>`로 구현한다.
- 본문 줄바꿈은 `<span class="pcbr">`(PC 전용 `<br>`)로 **문장 단위** 제어한다. 우리는 이 방식을 복제하지 않고 `max-inline-size: 65ch`/파티션 폭 + `text-wrap: pretty`로 제어한다.
- 슬로건은 2줄(`쓸모없음의 쓸모, 무쓸모 디자인` / `만약에, What If`)로 끊는다. `<br>` 대신 `<span class="line">` 블록으로 처리한다(S4.4).
- 푸터 연락처 라벨은 `Tel.`, `Post Code.`, `Address.` 형식이다.

### S4.2 Part A4와의 충돌 처리
Part A4는 "ALL CAPS 라벨을 습관적으로 쓰지 말 것"을 권장한다. 이 사이트는 **대문자 영문 내비게이션이 디자인 언어 자체**이므로 다음 예외를 둔다.

| 영역 | 대문자 처리 |
|---|---|
| GNB, 푸터 메뉴, 검색 해시태그 | **허용** (`text-transform: uppercase` 대신 **소스 텍스트를 대문자로 작성**하여 스크린리더·복사 시 일관되게 한다) |
| 섹션 제목, 본문, 연락처 라벨 | 원본 표기(Title Case) 유지. 임의로 대문자 변환하지 않는다 |
| 자간이 넓은 소형 대문자 아이브로(제목 위 장식 라벨) | **여전히 금지** — 타겟 사이트에 없는 장식이다 |

### S4.3 타입 토큰 `[확정]` (본문·섹션 영역) / `[추출 필요]` (서체·헤더·푸터)

| 토큰 | 역할 | Mobile | Tablet | PC | 굵기 | 행간 | 색 |
|---|---|---|---|---|---|---|---|
| `--fs-slogan` | 소개 슬로건(`.slg`) | `1.25rem`(20) | `1.5625rem`(25) | `1.5625rem` | 500 | 1.8 | `--color-text-body` |
| `--fs-intro-title` | 소개 제목(`h3`) | `1.125rem`(18) | `1.5625rem`(25) | `clamp(1.375rem, 1.6vw, 2.5rem)` | 700 | 1.3 | `--color-text` |
| `--fs-body-ko` | KO 본문 | `1rem`(16) | `1.4375rem`(23) | `1.4375rem`(23) | 500 | 1.5 | `--color-text-body` |
| `--fs-body-en` | EN 본문 | `0.875rem`(14) | `1.1875rem`(19) | `1.0625rem`(17) | 500 | 1.5 | `--color-text-en` |
| `--fs-section-title` | 전시·프로젝트 제목(`h2`) | sec2 `clamp(1.25rem, 6vw, 2.1875rem)` / sec4 `2.1875rem`(35) | `2.1875rem` | `2.1875rem` | 700 | — | `--color-text` |
| `--fs-meta` | 날짜·`Preview`/`Click Enter` | `0.875rem`(14) | `1.4375rem`(23) | `1.4375rem` | — | — | `--color-text-meta` |
| `--fs-hero-side` | 히어로 `2025.` / `Enter` | `1rem`(16) | `1.4375rem`(23) | `1.4375rem` | — | — | `--color-text` |
| `--fs-hero-mobile` | 히어로 모바일 타이틀 | `0.875rem`(14) | — | — | — | — | `--color-text` |
| `--fs-scroll` | `Scroll down` | 숨김 | 숨김 | `1.5rem`(24) | — | — | `--color-text` |
| `--fs-brand-title` | 브랜딩 제목(`h3`) | `1.3125rem`(21) | `2.1875rem`(35) | `2.1875rem` | 700 | — | `--color-text` |
| `--fs-brand-sub` | 브랜딩 부제(`h4`) | `1.3125rem`(21) | `clamp(1.5rem, 3.4vw, 3.5rem)` | `clamp(1.5rem, 3.5vw, 4.5rem)` | 700 | — | `--color-text` |
| `--fs-brand-ko` | 브랜딩 KO 본문 | `1rem`(16) | `1.25rem`(20) | `1.5625rem`(25) | 500 | 1.5 | `--color-text-body` |
| `--fs-brand-en` | 브랜딩 EN 본문 | `0.875rem`(14) | `1rem`(16) | `1.1875rem`(19) | 500 | 1.5 | `--color-text-en` |
| `--fs-card-name` | 카드 프로젝트명 | `1.6875rem`(27) | 동일 | 동일 | 700 | — | `--color-text` |
| `--fs-card-exp` | 카드 부제 | `0.875rem`(14) | 동일 | 동일 | 500 | — | `--color-text` |
| `--fs-card-author` | 카드 작가명 | `0.75rem`(12) | 동일 | 동일 | — | — | `--color-text` |
| `--fs-btn` | `Enter` 버튼 | `1.125rem`(18) | `1.5625rem`(25) | `1.5625rem` | 500 | — | `--color-text` |

| 항목 | 값 | 등급 |
|---|---|---|
| `--font-ko`, `--font-en` | **서체 불명** (`common.css` 미제공) | `[main.css 개발]` — 오너가 서체를 지정하기 전에는 시스템 폰트 스택을 임시 사용하고 TODO 표시 |
| 헤더 GNB / 검색 / 전체메뉴 / 푸터 글자 크기·행간·자간 | `common.css` 미제공 | `[main.css 개발]` — 본문 영역 타입 스케일(S4.3)에서 고른다. 새 크기를 만들면 토큰 추가 + 결정 기록 |
| 사용 weight | **500, 700** 두 가지만 확인됨. 이 프로젝트는 **500 / 700** 두 개로 제한한다 | 확정 |
| 행간 | 원본은 `em`(1.3em/1.5em/1.8em) → 우리는 **단위 없는 숫자**(1.3 / 1.5 / 1.8)로 변환 | 확정 |
| 자간 | 원본 CSS에 `letter-spacing` 선언 없음 → `normal` | 확정 |
| 텍스트 정렬 | 슬로건·섹션 제목·브랜딩·카드 정보: **중앙**. 소개 본문(KO/EN)은 **PC에서 좌측, Tablet·Mobile에서 중앙** (원본: PC `.txts{text-align:left}`, 그 외 `.txtWrap{text-align:center}`) | 확정 |

### S4.4 구현 규칙 `[확정]`

- **MUST** KO/EN 병기 블록은 **언어를 속성으로 구분**한다. 스크린리더 발음과 줄바꿈 규칙이 달라지기 때문이다.

```html
<div class="part-box part-box--wrap">
  <div class="part-box__item--half"><p lang="ko">…한국어 본문…</p></div>
  <div class="part-box__item--half"><p lang="en">…English text…</p></div>
</div>
```

- **MUST** 한글 블록: `word-break: keep-all; overflow-wrap: break-word;`
- **MUST** 영문 블록: `word-break: normal; overflow-wrap: break-word; hyphens: auto;`
- **MUST** KO/EN 블록은 같은 `font-size` 토큰을 쓰되, 서체는 `:lang(ko)` / `:lang(en)`으로 분기한다. 폰트 스택 하나에 두 언어를 섞어 쓰는 경우 한글 폴백을 반드시 포함한다.
- **MUST** 본문 줄 길이는 Part A4의 규칙을 따른다. (`ch` 단위 상한 또는 파티션 폭으로 제한)
- **MUST** 해시태그는 `#`를 포함해 텍스트로 쓴다. 장식 이미지로 대체하지 않는다.
- **MUST** 메인 타이틀의 3줄 줄바꿈은 `<br>`가 아니라 **블록 요소 또는 `<span class="line">`** 으로 처리한다. (스크린리더가 하나의 문장으로 읽도록 `aria-label`을 병행)
- **MUST NOT** 텍스트를 이미지로 만들어 넣지 않는다. 타겟 사이트의 `whatif.png` 같은 타이틀 이미지는 **SVG 텍스트 또는 실제 텍스트**로 대체하거나, 이미지일 경우 `alt`에 전문을 쓴다.

### S4.5 반응형 글자 규칙 `[확정]`
- 원본의 `vw` 단독 글자 크기(`1.6vw`, `3.5vw`, `3.4vw`, `6vw`)는 확대 접근성을 해치므로 **반드시 `clamp(rem, vw, rem)`** 로 감싼다. 위 표의 `clamp()`는 이 변환의 결과다.
- 원본의 PC 미세 조정(≤1700 / ≤1650 / ≤1560px에서 KO 23→20px, EN 17→14px 등)은 **미디어쿼리로 복제하지 않는다.** PC 구간(1400~1700px)은 `clamp()` 보간으로 처리하며, 끝점은 다음과 같다.

| 토큰 | 1400px 부근 | 1700px 이상 |
|---|---|---|
| `--fs-body-ko` (PC) | `1.25rem`(20) | `1.4375rem`(23) |
| `--fs-body-en` (PC) | `0.875rem`(14) | `1.0625rem`(17) |
| `--fs-brand-en` (PC) | `1.0625rem`(17) | `1.1875rem`(19) |

- 원본은 **Tablet의 글자가 PC(≤1650px)보다 크다**(예: EN 19px vs 14px). 이는 의도로 보이므로 표의 값을 그대로 따른다. 임의로 단조 증가하도록 보정하지 않는다.
- **EN 본문(14~19px)의 원본 색은 대비가 부족하다** (S5.2). 표의 `--color-text-en`은 **접근성 보정값**(`#787981`)이다.

## S5. 색상 관련 규칙

### S5.1 방향 `[확정]`
- **다크 전용 사이트**다. 모든 섹션 배경은 검정 계열이다. 라이트 테마·`prefers-color-scheme` 분기는 **만들지 않는다.** (`:root { color-scheme: dark; }`) → Part A3.2의 다크 모드 규칙은 이 프로젝트에 적용하지 않는다.
- 시각 정체성은 **검정 바탕 + 영상/이미지 + 청회색 계열 텍스트 + 한 가지 파란색(카드 호버) + 붉은 주황색(상호작용 포인트)** 이다.
- 텍스트가 영상/이미지 위에 놓이는 구간(히어로, 소개 배경)이 있으므로 S5.3의 스크림 규칙을 따른다.

### S5.2 컬러 토큰 `[확정]` (index_*.css 추출값)

**Primitive**

| 이름 | HEX | 원본 사용처 |
|---|---|---|
| `--color-black-0` | `#000000` | `#contents`, `.sec1`, `.sec2`, `.sec4` 배경 |
| `--color-black-1` | `#080808` | `.sec3` 배경 |
| `--color-black-2` | `#202020` | `Enter` 버튼 배경 |
| `--color-white` | `#FFFFFF` | 제목·히어로 텍스트 |
| `--color-steel-200` | `#C3CDDD` | KO 본문·슬로건 |
| `--color-gray-400` | `#808187` | 날짜·`Preview`/`Click Enter` 등 메타 |
| `--color-gray-600` | `#5C5D64` | EN 본문 (**대비 미달**, 아래 참고) |
| `--color-blue-500` | `#0F52BD` (`rgb(15 82 189)`) | 카드 호버 막 |
| `--color-blue-600` | `#005ADA` | 버튼 호버 2차 채움 |
| `--color-red-500` | `#DE3B29` | 버튼 호버 1차 채움 |
| `--color-orange-500` | `#FA4616` | `Enter`(히어로) 호버 색 |

**Semantic (컴포넌트는 이것만 참조)**

| 토큰 | 값 | 용도 | 흰/검 대비 |
|---|---|---|---|
| `--color-bg` | `--color-black-0` | 기본 배경 | — |
| `--color-bg-alt` | `--color-black-1` | 브랜딩 섹션 배경 | — |
| `--color-surface-btn` | `--color-black-2` | 버튼 기본 배경 | 흰 글자 16.29:1 ✓ |
| `--color-text` | `--color-white` | 제목, 히어로, 카드 텍스트 | 검정 위 21:1 ✓ |
| `--color-text-body` | `--color-steel-200` | KO 본문 | 검정 위 13.10:1 ✓ |
| `--color-text-meta` | `--color-gray-400` | 날짜, 보조 라벨 | 검정 위 5.41:1 ✓ |
| `--color-text-en` | **`#787981`** (접근성 보정값) | EN 본문 | 검정 위 4.85:1 ✓ / `#080808` 위 4.63:1 ✓ |
| `--color-text-en-original` | `--color-gray-600` | 원본 값 보관용. **본문에 사용 금지** | 검정 위 **3.20:1 ✕** / `#080808` 위 3.06:1 ✕ |
| `--color-accent` | `--color-orange-500` | 링크·CTA 호버 | 검정 위 5.95:1 ✓ |
| `--color-card-overlay` | `--color-blue-500` | 카드 호버 막 | 흰 글자 7.09:1 ✓ |
| `--color-btn-sweep-1` | `--color-red-500` | 버튼 호버 1차 | 흰 글자 4.41:1 (큰 글자 ≥24px는 ✓, 18px 모바일은 ✕) |
| `--color-btn-sweep-2` | `--color-blue-600` | 버튼 호버 2차(최종 상태) | 흰 글자 6.04:1 ✓ |
| `--color-focus` | `--color-white` (또는 `--color-accent`) | 포커스 링 | 검정 위 21:1 ✓ |
| `--color-scrim` | `rgba(0 0 0 / .45)` | 영상·이미지 위 텍스트용 오버레이 | `[기본값]`, 시각 검증 후 조정 |

**그라디언트(카드 호버 막)** `[확정]`
```css
--gradient-card-overlay: linear-gradient(
  to top,
  rgb(15 82 189 / 1) 10%,
  rgb(15 82 189 / .7) 50%,
  rgb(15 82 189 / .5),
  rgb(15 82 189 / 0)
);
```
> 원본에서 이 그라디언트는 **정보 전달 장치**(텍스트 가독성용 배경)이므로 장식 그라디언트 금지 규칙(Part A3.2)의 예외다.

### S5.3 구현 규칙 `[확정]`
- **MUST** `--color-text-en-original`(`#5C5D64`)을 본문에 쓰지 않는다. 오너가 원본 색 유지를 **명시**하면 그때만 쓰고, 보고서에 "대비 3.2:1 — AA 미달"을 적는다.
- **MUST** 버튼 라벨이 `18px`(모바일)일 때는 호버 1차 색(`#DE3B29`) 위 흰 글자 대비가 4.5:1에 못 미친다. 모바일 호버 채움은 **적용하지 않거나**(터치 기기엔 호버 없음) 2차 색만 사용한다.
- **MUST** 영상·이미지 위 텍스트는 `--color-scrim`으로 가독성을 확보하고 가장 밝은 프레임 기준으로 대비를 확인한다.
- **MUST** 영상 로딩 전·실패 시를 위해 히어로 겉박스에 `--color-bg`와 `poster`(또는 모바일 정지 이미지)를 지정한다.
- **MUST** 새 색을 추가하지 않는다. 팔레트에 없는 색이 필요하면 오너에게 요청한다.
- **MUST NOT** Part A2.1의 "기본값" 조합(크림+테라코타 등)으로 대체하지 않는다.
- **MUST** 포커스 링은 검정 배경에서 보이는 밝은 색(`--color-focus`)으로 **반드시 표시**한다. (원본에는 포커스 스타일이 확인되지 않음)

## S6. 사이트 컴포넌트 구현 규칙

### S6.1 컴포넌트와 박스 매핑

| 컴포넌트 | 겉박스 | 파티션 구성 (flex) | 비고 |
|---|---|---|---|
| 헤더 | `header.site-header` | `로고` · `GNB(ul)` · `도구(검색 버튼, 메뉴 버튼)` | GNB 5개, 현재 위치 `aria-current="page"`. 모바일은 현재 페이지명(`.mobileTitle`) 표시. **헤더 수치는 `[추출 필요]`** |
| 검색 패널 | 헤더 내 패널 | `form(입력+제출)` · `태그 목록(.part-box--wrap, 28개)` | 버튼은 `<button aria-expanded>`. 제출 버튼 `aria-label="검색"` |
| 전체 메뉴 | 오버레이 패널(`dialog` 권장) | 메뉴 그룹별 | Projects 하위 5개 포함. 포커스 트랩·`Esc` |
| 히어로 | `section.site-section.site-section--hero` | `2025.`(좌) · `Enter`(우) 를 세로 중앙에 `space-between` / 하단 좌측 `Scroll down` | 비디오 배경. `h1`은 히어로 타이틀. 모바일에서는 `2025.` + 3줄 타이틀을 좌측 중앙에 배치 |
| 소개 | `section.site-section` | `슬로건`(중앙) → `[제목 25% : 본문 75%]` | KO 묶음 → EN 묶음 순서. 모바일/태블릿은 세로 적층 |
| 전시 | `section.site-section` | `날짜1`(좌) · `h2`(중) · `날짜2`(우) → 영상(100dvh) | 모바일은 제목 아래 `날짜 - 날짜` 한 줄 중앙 |
| 브랜딩 | `section.site-section` | `h3`(중앙) → `h4` → KO → EN | **원본에서 비노출(`display:none`)**. 포함 여부 오너 확인 |
| 프로젝트 프리뷰 | `section.site-section` | `Preview`(좌) · `h2`(중) · `Click Enter`(우) → `카드 목록` → `Enter 버튼` | 카드 목록은 `.part-box--wrap` 또는 `.part-box--scroll`(아래) |
| 푸터 | `footer.site-footer` | ① `타이틀 이미지 + (점, EN 행사명, KO 행사명)` ② `푸터 메뉴(4)` · `연락처 dl×3` · `SNS(2)` | `dl/dt/dd`로 마크업 |

### S6.2 섹션 3요소 제목 줄 (전시 · 프로젝트 공통)

원본은 `h3`를 중앙에, 보조 텍스트 2개를 `position:absolute`로 좌·우 36px에 둔다. **우리는 파티션 flex 3분할로 대체**한다.

```html
<div class="part-box part-box--title-row">
  <p class="part-box__item--side title-row__left"><time datetime="2025-11-04">2025. 11. 04</time></p>
  <h2 class="part-box__item--center">Offline Exhibition</h2>
  <p class="part-box__item--side title-row__right"><time datetime="2025-11-08">2025. 11. 08</time></p>
</div>
```
```css
.part-box--title-row { align-items: center; justify-content: space-between; }
.part-box--title-row > .part-box__item--side   { flex: 1 1 0; }
.part-box--title-row > .part-box__item--center { flex: 0 1 auto; text-align: center; }
.part-box--title-row > .title-row__right { text-align: end; }
/* 모바일(기본): 세로 적층, 날짜 2개는 제목 아래 한 줄 중앙 */
.part-box--title-row { flex-direction: column; align-items: center; }
@media (min-width: 813px) { .part-box--title-row { flex-direction: row; } }
```
> 기본은 Mobile First다. 위처럼 `min-width: 813px`에서 가로 3분할로 전환한다.

### S6.3 프로젝트 카드 `[확정]`

- 카드: 정사각(`aspect-ratio: 1/1`), `flex: 0 0 var(--card-size)`, 간격 `--part-gap`(20px).
- 호버 막: 아래에서 위로 `translateY(100% → 0)`, `0.4s`. 막 안 정보는 **`info` +0.3s 지연, `name` +0.4s 지연**으로 순차 등장.
- 카드 목록의 배치 방식 (둘 중 오너가 선택, 기본은 wrap)

| 방식 | 클래스 | 설명 |
|---|---|---|
| 줄바꿈 | `.part-box--wrap` | 카드가 폭에 맞춰 여러 줄로 쌓임 (기본) |
| 가로 스크롤 | `.part-box--scroll` | `flex-wrap: nowrap; overflow-x: auto; scroll-snap-type: x proximity;` — 원본의 한 줄 나열에 가까움. 스크롤 영역은 `tabindex="0"`, `role="region"`, `aria-label` 필수 |

- **MUST** 정보 표시를 호버에만 맡기지 않는다.
  - 포인터 기기(`@media (hover: hover)`): 호버 시 막과 정보 표시.
  - 키보드: `:focus-visible` / `:focus-within`에서도 **동일하게 표시**.
  - 터치 기기(`@media (hover: none)`): 프로젝트명·작가명을 **항상 보이게**(막 없이 하단 캡션) 한다.
- **MUST** 카드는 하나의 `<a>`로 감싸고, 링크 텍스트에 프로젝트명이 포함되도록 한다. 썸네일 `alt`는 `prjName`과 `prjExp`로 쓰거나, 링크 텍스트와 중복되면 `alt=""`로 한다(중복 낭독 방지).
- 프로젝트 데이터(`prjName`, `prjExp`, `name`)는 `data/*.json`·서버 렌더 등 **마크업과 분리된 소스**에서 온다. 하드코딩하지 않는다.

### S6.4 Enter 버튼 `[확정]`
- 알약형(`--radius-pill`), 기본 `--color-surface-btn`, 라벨 `Enter`.
- 호버(PC, `hover: hover`): `--color-btn-sweep-1`이 좌→우로 채워지고 이어서 `--color-btn-sweep-2`가 0.15s 지연으로 덮는다. (`transform: scaleX`, `transform-origin: left`, `0.4s`) → **`transform`만 애니메이션**.
- 모바일/터치에서는 호버 채움을 생략하고 `:active`에 `--color-btn-sweep-2`를 적용한다.

### S6.5 모션 규칙 `[확정]`

| 토큰 | 값 | 원본 근거 |
|---|---|---|
| `--duration-hover` | `400ms` | 카드·버튼·Enter 호버 |
| `--delay-stagger-1` / `-2` | `300ms` / `400ms` | 카드 `info` / `name` 지연 |
| `--duration-scroll-hint` | `1000ms` | 스크롤 화살표 왕복 |
| `--enter-offset` | `2.5rem`(40px) | 텍스트 등장 시작 위치 |

- **스크롤 힌트**(`translateY 0→5px`, `infinite alternate`)는 **`prefers-reduced-motion: reduce`에서 정지**한다. (Part A7)
- **텍스트 등장 연출**(소개·브랜딩): 시작 상태 `opacity:0` + 이동은 **`.js` 클래스가 `<html>`에 있고 `prefers-reduced-motion: no-preference`일 때만** 적용한다. JS가 실패해도 본문이 보여야 한다.

```css
.js .reveal { opacity: 0; transform: translateY(var(--enter-offset)); }
.js .reveal.is-in { opacity: 1; transform: none;
  transition: opacity var(--duration-hover) var(--ease-enter), transform var(--duration-hover) var(--ease-enter); }
@media (prefers-reduced-motion: reduce) { .js .reveal { opacity: 1; transform: none; } }
```
- 트리거는 `IntersectionObserver`. **애니메이션 라이브러리를 추가하지 않는다.** (GSAP 필요 시 오너 승인)
- **커버 리빌**(히어로 위로 다음 섹션이 올라오는 효과)은 `position: fixed + padding-top:100vh` 해킹 대신 **히어로를 `position: sticky; top: 0`** 로 두고 이후 섹션에 `position: relative; z-index`로 덮는 방식을 기본으로 한다. 오너가 원본과 동일한 fixed 방식을 요구하면 따른다.
- **커스텀 커서**(`.cursor`)는 원본에 존재하나 스타일이 `common.css`에 있어 내용을 알 수 없다. 오너가 요구할 때만 구현하며, **포인터 기기 한정 + 기본 커서 숨김 금지(시스템 커서 유지)** 로 한다.

### S6.6 히어로 · 영상 `[확정]`
- 히어로 영상: `autoplay muted playsinline`, `object-fit: cover`, 컨테이너 `100%×100dvh`.
- **모바일은 영상을 로드하지 않고** 정지 이미지로 대체한다. (`<video>`를 숨기는 것이 아니라 **소스를 지연 로드**하여 데이터 낭비를 막는다)
- 전시 영상(sec2): `autoplay muted loop playsinline`, `100%×100dvh`, `object-fit: cover`.
- **MUST** 자동재생 영상 **일시정지 컨트롤**을 제공한다 (WCAG 2.2.2, 5초 초과 자동 재생). `prefers-reduced-motion: reduce`이면 **정지 이미지**를 보여준다.
- 영상에는 `poster`를 지정하고, `preload="metadata"`.

## S7. common.css 대응 항목 (측정 선택 · 개발 우선)

> **v3 오너 결정**: `common.css`는 제공되지 않으며, 해당 내용은 **`main.css`에서 개발하고 공통 사항을 나중에 `common.css`로 옮긴다.** (S9)
> 따라서 아래 항목은 **측정을 기다리지 않고** S9 절차로 개발한다. 아래 측정 스크립트는 원본과 **시각을 맞추고 싶을 때의 선택 도구**다. 오너가 `common.css` 원본을 나중에 제공하면 그 값이 S9 결정보다 우선한다.

`index_*.css`로 본문 영역은 확정되었다. **아래만 미확정**이다. `common.css`가 비어 있었기 때문이다.

### S7.1 남은 `[추출 필요]` 목록
| 영역 | 항목 |
|---|---|
| 전역 | `font-family`(KO/EN), `body` 기본 글자 크기·행간·색, 링크 기본/호버/포커스 스타일, `.blind`(스킵 링크) 스타일, 리셋 |
| 헤더 | 높이(PC/Tablet/Mobile), 배경(투명/불투명/블러), `sticky/fixed` 여부, 로고 크기·표시 방식(`h1` 안의 텍스트 vs 이미지), GNB 글자 크기·간격·`.on` 상태 스타일, 모바일 `.mobileTitle` 스타일, 검색 버튼·메뉴 버튼(햄버거 두 줄) 크기·애니메이션 |
| 검색 패널 | 입력창 크기·테두리·플레이스홀더 색, 태그 목록의 글자·간격·줄바꿈 |
| 전체 메뉴 | 패널 배경·전개 방식, 항목 글자·하위 메뉴 들여쓰기 |
| 푸터 | 배경색, 상·하 패딩, `.whatif` 이미지 크기, `.dot` 크기·색, 행사명 글자, 푸터 메뉴·연락처·SNS 글자 크기·간격 |
| 커서 | `.cursor` 크기·색·반응 |

### S7.2 절차
브라우저 도구가 있으면 구현 **전에** 수행한다. 없으면 오너에게 **`common.css` 원본**(또는 아래 스크립트 결과 JSON)을 요청한다. `common.css`를 받는 쪽이 가장 정확하다.

1. https://hongik-id-degreeshow2025.com/ 을 **1920 / 1400 / 1399 / 813 / 812 / 390px** 폭에서 연다. (경계값 양쪽을 반드시 측정)
2. 폭마다 Console에서 아래 스크립트를 실행한다. (결과가 클립보드에 JSON으로 복사됨)
3. `docs/site-measurements-{폭}.json`으로 저장하고, 값을 `tokens.css`와 이 문서의 `[추출 필요]` 표에 반영한 뒤 등급을 `[확정]`으로 바꾼다.

```js
(() => {
  const props = [
    'font-family','font-size','font-weight','line-height','letter-spacing','text-transform',
    'color','background-color','background-image','padding','margin','width','max-width',
    'height','min-height','gap','display','position','flex-direction','flex-wrap',
    'align-items','justify-content','border','border-radius','box-shadow','transition','z-index'
  ];
  const selectors = [
    'body','a','a:hover',
    '#header','#header .head','#header .head h1','#header .head h1 a','.mobileTitle',
    '.gnb ul','.gnb ul li','.gnb ul li a','.gnb ul li.on a','.btnSearch','.btnSearch a','.btnMenu','.btnMenu div',
    '.fixSearch','.searchText input','.searchText button','.searchKeyword ul','.searchKeyword li a',
    '.allMenu','.allMenu > div > ul > li > a','.allMenu ul ul li a',
    '#footer','#footer .foot','.conWrap','.conWrap .whatif img','.textarea','.textarea .dot','.textarea > div',
    '.conBtmWrap','.fm','.fm li a','.info dl','.info dt','.info dd','.link li a','.cursor'
  ];
  const out = {};
  selectors.forEach(sel => {
    const clean = sel.replace(':hover','');
    const el = document.querySelector(clean);
    if (!el) { out[sel] = 'NOT FOUND'; return; }
    const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    out[sel] = {
      ...Object.fromEntries(props.map(p => [p, cs.getPropertyValue(p)])),
      __rect: { w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x), y: Math.round(r.y + scrollY) }
    };
  });
  out.__fonts = [...new Set([...document.querySelectorAll('*')].map(e => getComputedStyle(e).fontFamily))];
  out.__viewport = { w: innerWidth, h: innerHeight, dpr: devicePixelRatio };
  copy(JSON.stringify(out, null, 2));
})();
```
> 호버/포커스/`.on` 상태는 스크립트로 얻을 수 없으므로 DevTools의 **Force state**(`:hover`, `:focus-visible`)로 수동 확인한다.

### S7.3 함께 확인할 것
- 웹폰트 파일 출처와 **라이선스** (Network → Font)
- 헤더가 스크롤 중 고정되는지, 배경이 변하는지
- 전체 메뉴·검색 패널이 열리는 방식(슬라이드/페이드)과 닫힘 조건
- 모바일에서 헤더 `.mobileTitle`(현재 페이지명)과 로고가 동시에 보이는지

## S8. Part S 전용 완료 정의 (DoD 추가)

**구조**
- [ ] 모든 페이지가 `header + main > section + footer` 구조이고, 최상위에 다른 박스가 없다.
- [ ] 모든 `header`/`section`/`footer`가 `.inner-box`를 **정확히 1개** 가진다. 중첩 없음.
- [ ] `.inner-box` 외에 같은 역할의 다른 클래스(`.container`/`.wrapper` 등)가 없다.
- [ ] `.inner-box`는 `max-inline-size: var(--inner-max)`(1920px) + `margin-inline: auto` + `padding-inline: var(--inner-pad-x)`를 가진다.
- [ ] 모든 파티션박스가 `display: flex`이고, 줄바꿈이 필요한 곳엔 `flex-wrap: wrap`이 있다.
- [ ] 파티션박스에 `display: grid`가 쓰인 곳이 **0건**이다.
- [ ] 배경은 겉박스, 가로 패딩은 속박스, 간격은 파티션 `gap`에 있다.
- [ ] `position: absolute`로 레이아웃을 잡은 곳이 없다. (장식·오버레이 제외)

**값**
- [ ] `main.css`의 모든 코드가 `[COMMON]` 또는 `[PAGE:이름]` 존에 속하고, COMMON 존이 PAGE 존에 의존하지 않는다. (S9)
- [ ] `[main.css 개발]` 항목을 정할 때 제안 → 승인 → `docs/decisions.md` 기록을 마쳤다.
- [ ] 박스 수치·글자 크기·색이 S3/S4/S5의 토큰으로만 선언되었다. (raw 값 없음)
- [ ] 브레이크포인트가 **813px / 1400px** 두 개뿐이다. (1700/1650/1560 미디어쿼리 없음)
- [ ] `vw` 글자 크기는 모두 `clamp(rem, vw, rem)`이다.
- [ ] `--color-text-en`(접근성 보정값)을 쓰고, `#5C5D64`가 본문에 쓰이지 않았다.
- [ ] 남은 `[추출 필요]` 항목이 있다면 보고서에 명시했다.

**접근성 · 동작**
- [ ] 정보가 호버에서만 나타나는 곳이 없다. (`:focus-visible`, 터치 기기 대응)
- [ ] 검색·메뉴 컨트롤이 `<button>`이며 `aria-expanded`/`aria-controls`가 동기화된다.
- [ ] JS를 끄고도 모든 텍스트가 보인다. (`.js` 접두 규칙)
- [ ] `prefers-reduced-motion`에서 스크롤 힌트·등장 연출·자동재생 영상이 정지/생략된다.
- [ ] 글자가 들어간 이미지에 의미 있는 `alt`가 있거나 실제 텍스트/SVG로 대체했다.
- [ ] KO/EN 병기 블록에 `lang` 속성이 있다.
- [ ] 제목 레벨이 `h1 → h2 → h3` 순서이며 `h1`은 페이지당 1개다.
- [ ] 이미지/영상 위 텍스트의 대비를 검증했다.

**의존성**
- [ ] jQuery, jQuery UI, GSAP, Swiper를 추가하지 않았다. (오너 승인 시 예외)


## S9. common.css 대응 영역 — main.css 개발 후 이전 `[확정·오너 결정]`

`common.css`(서체·리셋·본문 기본값·헤더·푸터·검색 패널·전체 메뉴·커서)는 제공되지 않았다. 오너는 이를 **`main.css`에서 개발하고, 공통 사항을 나중에 `common.css`로 옮기기로** 했다.

### S9.1 개발 단계의 파일 규칙 (Part B2 "1파일 1책임"의 **임시 예외**)
- `css/main.css`가 개발 단계의 **단일 작업 스타일시트**다. 파일 길이 상한(300줄)을 적용하지 않는다.
- `css/base/tokens.css`는 **분리 유지**한다. (토큰은 이전 대상이 아니다. `main.css`보다 먼저 로드)
- 로드 순서: `tokens.css` → `main.css`.
- 에이전트는 **임의로 `common.css`를 만들지 않는다.** 오너가 이전을 요청할 때만 만든다.

### S9.2 존(Zone) 규칙 — 나중에 옮기기 쉽게 하는 장치 (MUST)

`main.css`의 **모든 코드는 아래 두 종류의 존 중 하나**에 속한다. 존은 구분 주석으로 시작한다.

```css
/* ==========================================================
   [COMMON] reset                       → 이후 common.css로 이전
   ========================================================== */
@layer reset { … }

/* [COMMON] base — body, 링크, 포커스, 스킵 링크, .sr-only */
/* [COMMON] box — .site-header/.site-section/.site-footer, .inner-box, .part-box */
/* [COMMON] header — GNB, 검색 패널, 전체 메뉴 */
/* [COMMON] footer */
/* [COMMON] button — .btn(Enter 버튼 등 2개 이상 페이지에서 쓰는 것) */

/* ==========================================================
   [PAGE:home] hero                     → 페이지 CSS에 남김
   ========================================================== */
```

| 구분 | 넣는 것 | 넣지 않는 것 |
|---|---|---|
| `[COMMON]` | 둘 이상의 페이지에서 쓰이거나 쓰일 것이 확실한 규칙: 리셋, 본문 기본값, 서체, 링크, 스킵 링크, `.sr-only`, 박스 3단 구조, 헤더, 푸터, 검색·전체 메뉴, 공용 버튼, (요구 시) 커서 | 특정 페이지 섹션 전용 클래스(`.hero`, `.intro`, 카드 목록 등) |
| `[PAGE:이름]` | 해당 페이지에서만 쓰는 섹션·컴포넌트 | 헤더/푸터/리셋 |

- **MUST** 분류가 모호하면 `[PAGE:이름]`에 둔다. (`[COMMON]`은 확실할 때만)
- **MUST** `[COMMON]` 존은 **`[PAGE]` 존의 선택자·클래스에 의존하지 않는다.** (의존하면 이전 시 깨진다)
- **MUST** `[COMMON]` 존은 `tokens.css`의 토큰만 참조한다. 값을 직접 쓰지 않는다.
- **MUST** 파일 내 순서는 **`[COMMON]` 먼저 → `[PAGE]` 나중**. `@layer` 선언 순서를 지킨다. (`reset, tokens, base, layout, components, utilities, pages`)
- **MUST** 반응형 미디어쿼리도 **해당 존 안**에 둔다. 파일 끝에 쿼리를 몰아 쓰지 않는다.
- **MUST** 존 하나는 한 번만 선언한다. 같은 존을 파일 여러 곳에 흩뿌리지 않는다.
- **SHOULD** 존 이름은 위 표기를 그대로 쓴다. (`grep "\[COMMON\]"`로 이전 대상이 한 번에 찾아져야 한다)

### S9.3 `[main.css 개발]` 항목을 정하는 절차 (MUST)

원본 값이 없는 항목(서체, 헤더 높이, 푸터 패딩 등)을 에이전트가 **임의로 확정하지 않는다.**

1. **제안**: 원본의 시각 언어(다크, 흰 글자, 500/700, 청회색 계열, 36px 좌우 여백, 알약 버튼)와 **일치하는 값**을 제안한다. 근거를 한 줄 적는다.
2. **재사용 우선**: 기존 토큰에서 고른다. **새 색은 만들지 않는다.** (S5.3) 새 크기·간격이 필요하면 토큰으로 추가한다.
3. **승인**: 오너가 승인하기 전에는 `/* TODO(owner): … */` 주석을 단 임시값으로 구현한다.
4. **기록**: 확정된 값은 `docs/decisions.md`에 한 줄씩 남긴다. (항목 / 값 / 근거 / 날짜)
5. 이 문서의 해당 `[main.css 개발]` 표시를 `[확정]`으로 바꾸는 것은 **오너 승인 후**에만 한다.

```
docs/decisions.md 예
| 항목 | 값 | 근거 | 날짜 |
| --header-h (PC) | 5rem | 원본 GNB 글자/36px 여백과 균형, 로고·GNB 한 줄 수용 | 2026-11-03 |
```

### S9.4 common.css로 이전하는 절차 (오너 요청 시)
1. `main.css`에서 `[COMMON]` 존을 **존 단위로 잘라** `css/common.css`로 옮긴다. 순서와 `@layer`를 유지한다.
2. 각 HTML의 로드 순서를 `tokens.css` → `common.css` → `main.css`(또는 페이지 CSS)로 바꾼다.
3. **시각 변화 0**이어야 한다. 이전 전후 스크린샷(320 / 813 / 1400px)을 비교한다.
4. 이동한 규칙이 `main.css`에 **중복으로 남지 않게** 제거한다.
5. 이전 후 `main.css`는 `[PAGE:*]` 존만 남는다. 필요하면 `css/pages/{page}.css`로 분리한다. (오너 지시 시)
6. `spec-kit/Agents.md`의 S9.1 상태를 갱신하고 변경 이력(S10)에 기록한다.

---

## S10. Part S 변경 이력
| 버전 | 내용 |
|---|---|
| 1 | 오너 레이아웃 규칙(3단 박스) 반영. 수치는 전부 `[추출 필요]` |
| 2 | `index` HTML, `index_pc/tablet/mobile.css` 분석 반영. 박스 수치·글자 크기·색상·모션 확정. 브레이크포인트 813/1400 확정. EN 본문색 대비 미달 발견 → 보정 토큰 추가. **`common.css`가 0바이트라 헤더·푸터·서체는 계속 미확정** |
| 3 | 오너 결정 반영: `common.css`는 제공하지 않고 **`main.css`에서 개발 후 공통을 이전**. `[main.css 개발]` 등급, 존 규칙, 결정 기록 절차, 이전 절차(S9) 추가 |

---

# 부록

## 부록 A. 완료 정의 (Definition of Done)

작업을 "완료"라고 보고하기 전, 아래를 **모두** 확인한다.

**디자인**
- [ ] 브리프(제품/대상/핵심 임무)에 부합한다.
- [ ] 토큰 외 임의 값이 없다.
- [ ] 위계가 명확하고 시선이 처음 닿는 곳이 하나다.
- [ ] 카피가 실제 콘텐츠이며 톤이 일관된다.

**개발**
- [ ] 시맨틱 HTML, 접근성(키보드·스크린리더·대비) 검증 완료
- [ ] 반응형(320/768/1280px 이상) 확인
- [ ] 콘솔 에러 0, 린트/포맷 통과
- [ ] 성능 예산 충족, 이미지/폰트 최적화
- [ ] 보안 규칙(XSS, 링크, 시크릿) 준수
- [ ] 문서/주석/커밋 메시지 정리

**프로젝트 전용** — PART S8 체크리스트를 **모두** 확인한다.

**보고 형식** — 완료 보고에는 다음을 **짧게** 포함한다.
1. 무엇을 만들었는지 (1~2문장)
2. 가정한 사항
3. 규약 예외와 그 이유 (있을 경우)
4. 알려진 한계 / 후속 제안

## 부록 B. 금지 사항 요약 (Never List)

| 영역 | 금지 |
|---|---|
| 일반 | Lorem ipsum, 요청 외 대규모 리팩터링, 승인 없는 의존성 추가 |
| 디자인 | 토큰 밖 임의 색/간격, 의미 없는 장식·그라디언트, 포커스 표시 제거, 색에만 의존한 상태 표현, 동일 카드 반복으로 위계 파괴 |
| HTML | div/span 버튼, 레이아웃용 table, 제목 레벨 건너뛰기, 양수 tabindex, 확대 차단 meta |
| CSS | `!important`, ID 선택자, 인라인 스타일, `z-index: 9999`, `100vh` 단독 사용, `float` 레이아웃, 중첩 4단계 이상 |
| JS | `var`, 전역 변수, `eval`, `document.write`, 인라인 핸들러, 입력값 `innerHTML`, 정리되지 않은 리스너/타이머, 에러 삼키기 |
| 보안 | 시크릿 커밋, SRI 없는 외부 스크립트, `target="_blank"` + `rel` 누락 |
| 성능 | LCP 이미지에 `lazy`, 렌더 차단 스크립트, 레이아웃 속성 애니메이션 |
| 박스 구조(PART S) | `.inner-box` 외의 동의어 클래스(`.container`/`.wrapper` 등), `.inner-box` 중첩, 파티션박스에 `display: grid`, `main > div`, 겉박스·파티션에 좌우 패딩, 박스 단계 추가, `[추출 필요]` 값 임의 기입 |

## 부록 C. 용어

- **토큰(Design Token)**: 디자인 결정을 이름 붙은 변수로 만든 것 (CSS Custom Property)
- **DoD**: Definition of Done, 완료 정의
- **CLS / LCP / INP**: Core Web Vitals 지표 (누적 레이아웃 이동 / 최대 콘텐츠풀 페인트 / 상호작용 응답성)
- **BEM**: Block__Element--Modifier 네이밍 규칙
- **SRI**: Subresource Integrity, 외부 리소스 무결성 검증

---

*이 문서는 프로젝트의 최상위 규약이다. 변경이 필요하면 변경 사유와 함께 이 파일을 먼저 수정하고, 코드는 그 뒤에 따른다.*
