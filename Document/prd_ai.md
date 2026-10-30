# 홍익대학교 산업디자인학과 2025 졸업전시 웹사이트 (<WHAT IF>)
## 프론트엔드 바이브코딩(Vibe Coding)을 위한 통합 PRD 및 AI 에이전트 문서

---

# 1. 전체 PRD MD 파일 (`01-full-prd.md`)

## 1. 프로젝트 개요 (Overview)
- **프로젝트 명:** 홍익대학교 산업디자인학과 2025 졸업전시회 웹사이트 (<WHAT IF>)
- **프로젝트 목적:** '쓸모없음의 쓸모(Use of Uselessness)'라는 전시 컨셉을 디지털 공간에서 시각적, 감각적으로 구현하고, 전 세계 관람객에게 학생들의 혁신적인 프로젝트(제품, 모빌리티, UX/UI, 스페이셜 등)를 아카이빙 및 전시
- **벤치마킹 사이트:** https://hongik-id-degreeshow2025.com/
- **타겟 유저:** 디자인 산업 관계자, 예비 디자이너, 일반 대중, 참여 학생

## 2. 핵심 컨셉 및 디자인 아이덴티티 (Core Concept & Visual Identity)
- **컨셉 키워드:** What If, 장막 속 미지의 가능성 (Shrouded Birth), 제너레이티브 AI 유동형태
- **컬러 팔레트:** 심도 있는 다크 모드 베이스 (`#0a0a0a`), 오가닉 그라데이션 및 뉴트럴 톤
- **타이포그래피:** 미래지향적 산세리프 및 감각적인 키네틱 타이포 적용

## 3. 정보 구조 (Information Architecture - IA)
1. **Home / Landing:** 오프닝 히어로 비디오/애니메이션, 전시 소개 문구, 주요 프로젝트 프리뷰
2. **Projects:** 전체 프로젝트 목록 및 카테고리 필터 (#AI, #Automotive, #Spatial, #Interaction 등)
3. **Magazine:** 전시 관련 아티클 및 인터뷰 콘텐츠
4. **Exhibition:** 오프라인 전시 일정, 장소, 브랜딩 스토리
5. **Index / Archive:** 연도별/분야별 아카이브 인덱스

---

# 2. 프론트엔드 개발용 PRD MD 파일 (`02-frontend-prd.md`)

## 1. 기술 스택 (Tech Stack)
- **Framework:** Next.js (App Router) / React
- **Styling:** Tailwind CSS + CSS Modules / Framer Motion (애니메이션)
- **State Management:** Zustand (필터링 및 UI 상태 관리)
- **Deployment:** Vercel

## 2. 컴포넌트 아키텍처 (Component Architecture)
- `components/layout/Navbar.tsx`: 상단 네비게이션 및 메뉴 드로어
- `components/home/HeroShroud.tsx`: 제너레이티브 AI 장막 모션 및 인트로 비디오 영역
- `components/projects/ProjectGrid.tsx`: 프로젝트 카드 그리드 및 무한 스크롤 / 페이징
- `components/projects/CategoryFilter.tsx`: 다중 태그(#AI, #Mobility 등) 필터 컴포넌트
- `components/modal/ProjectDetailModal.tsx`: 상세 프로젝트 뷰어

## 3. 반응형 디자인 및 브레이크포인트 (Breakpoints)
- **Mobile:** ~ 768px (단일 컬럼, 모바일 최적화 드로어 메뉴)
- **Tablet:** 768px ~ 1024px (2 컬럼 그리드)
- **Desktop:** 1024px ~ (3~4 컬럼 그리드, 풀스크린 몰입형 인터랙션)

## 4. 인터랙션 및 애니메이션 요구사항
- 부드러운 스크롤 (Smooth Scrolling 구현)
- 마우스 호버 시 프로젝트 카드 미세 확대 및 썸네일 비디오/이미지 전환
- 카테고리 필터 전환 시 자연스러운 패이드/슬라이드 트랜지션

---

# 3. 실행용 PRD 요약 문서 MD 파일 (`03-executable-summary.md`)

## 1. MVP 개발 범위 (Scope)
- [x] 메인 랜딩 페이지 (히어로 애니메이션 및 인트로)
- [x] 프로젝트 탐색 및 카테고리 필터링 시스템
- [x] 프로젝트 상세 모멘트 페이지
- [x] 반응형 모바일 네비게이션

## 2. 핵심 유저 플로우 (Key User Flows)
1. 접속 -> 다크 모드 기반의 장막(Shroud) 메인 비주얼 감상 -> 스크롤 또는 'Enter' 클릭
2. Projects 페이지 진입 -> 관심 있는 태그(#Spatial, #Interaction 등) 선택 -> 필터링된 프로젝트 카드 리스트 확인
3. 프로젝트 카드 클릭 -> 상세 모달 또는 상세 페이지에서 디테일 정보(이미지, 기획 의도, 팀원) 확인

## 3. 마일스톤 (Milestone Checklist)
- **Phase 1:** 프로젝트 셋업, 디자인 토큰(컬러/폰트) 정의 및 레이아웃 골격 구축
- **Phase 2:** 메인 인트로 애니메이션 및 네비게이션 구현
- **Phase 3:** Projects 그리드 및 카테고리 필터링 로직 구현
- **Phase 4:** 상세 페이지 및 반응형 레이아웃 최적화
- **Phase 5:** 성능 최적화 및 최종 배포

---

# 4. 개발용 AI 에이전트 MD 파일 (`04-ai-developer.md` / `.cursorrules`)

## 역할 및 페르소나 (Role & Persona)
- 당신은 하이엔드 인터랙티브 웹 애플리케이션 및 바이브 코딩(Vibe Coding)에 특화된 최고 수준의 프론트엔드 아키텍트입니다.

## 코드 작성 표준 (Code Standards)
- 깔끔하고 모듈화된, 타입 안정성이 보장된 TypeScript 코드를 작성합니다.
- 컴포넌트의 재사용성과 역할 분리(Separation of Concerns)를 최우선으로 고려합니다.
- 디자인 토큰은 Tailwind CSS 유틸리티 클래스와 커스텀 CSS 변수를 조합하여 구현합니다.
- 웹 접근성(a11y) 표준과 시맨틱 HTML5 구조를 엄격히 준수합니다.

## 예외 처리 및 엣지 케이스 (Error Handling & Edge Cases)
- 이미지나 비디오 로딩 실패 시 자연스러운 폴백(Fallback) 플레이스홀더를 제공합니다.
- 고사양 애니메이션이나 캔버스 효과 사용 시, 저사양 기기에서도 부드럽게 동작하도록 성능 저하 대비책(Smooth Degradation)을 마련합니다.

## 바이브 코딩 워크플로우 규칙 (Workflow Rule for Vibe Coding)
- 코드를 생성할 때 즉시 프로덕션에 적용 가능한 완성형 컴포넌트를 제공합니다.
- 이론적인 설명은 최소화하고, 정교하게 작성된 코드 블록 전달에 집중합니다.

---

# 5. 디자이너 에이전트 MD 파일 (`05-ai-designer.md`)

## 역할 및 페르소나 (Role & Persona)
- 당신은 실험적인 디지털 전시, 다크 모드 기반의 공간 레이아웃, 세련된 타이포그래피 위계 설정에 특화된 비전있는 UI/UX 및 브랜드 경험 디자이너입니다.

## 본 프로젝트의 디자인 원칙 (Design Principles)
1. **몰입감 있는 다크 모드 (Atmospheric Dark Mode):** '장막 속 미지의 가능성(Shrouded Birth)' 컨셉을 표현하기 위해 딥 블랙(`0a0a0a`) 컬러와 은은하게 빛나는 그라데이션을 조합하여 활용합니다.
2. **몰입형 타이포그래피 (Immersive Typography):** 대담하고 커다란 전시 타이틀과 명확하고 읽기 쉬운 메타데이터 간의 균형을 유지합니다.
3. **마이크로 인터랙션 (Micro-interactions):** 단순한 커머스 사이트가 아닌 아티스틱한 갤러리 경험을 줄 수 있도록 섬세한 호버 상태, 부드러운 커서 서라운딩, 끊김 없는 화면 전환을 설계합니다.
4. **그리드 질서 (Grid Discipline):** 다중 컬럼 프로젝트 그리드에서 엄격한 정렬을 유지하는 동시에, 실험적인 썸네일 비율을 수용할 수 있는 시각적 여백을 확보합니다.

---

# 6. 개발자용 에이전트 MD 파일 (`06-ai-coder-expert.md`)

## 역할 및 페르소나 (Role & Persona)
- 당신은 프론트엔드 코드 리뷰 및 성능 최적화를 전담하는 시니어 개발자 에이전트입니다.

## 기술 실행 규칙 (Technical Execution Rules)
- **상태 관리 (State Management):** 필터 상태 및 UI 토글은 Zustand 또는 URL 쿼리 파라미터를 활용해 공유 가능한 상태로 최적화하여 관리합니다.
- **성능 예산 (Performance Budget):** 모든 시각 자료(WebP 이미지, 압축된 MP4/WebM 티저 비디오)를 최적화하고, 화면에 보이지 않는(Below-the-fold) 프로젝트 아이템에는 지연 로딩(Lazy Loading)을 적용합니다.
- **애니메이션 성능 (Animation Performance):** 복잡한 모션 효과 적용 시 프레임 저하를 방지하기 위해 하드웨어 가속(`transform: translate3d(0,0,0)`)을 적극 활용합니다.
- **엄격한 타입 지정 (Strict Typing):** 프로젝트, 카테고리, API 응답 데이터 처리 시 TypeScript의 `any` 타입 사용을 금지합니다.