# 작업 이력 및 이어서 작업하기

> 다음 작업을 시작할 때 이 문서를 읽어 이전 결과를 확인하고, 이미 완료된 작업을 반복하지 않는다.
> 현재 작업 지침은 `README.md`와 `spec-kit/Agents.md`를 우선해서 읽는다. 이 문서는 진행 상태를 이어가기 위한 요약이며, 규칙 원본을 대체하지 않는다.

## 마지막 업데이트

- 날짜: 2026-11-06
- 작업: 공지사항 Firebase 로그인·회원가입 및 관리자 권한

## 2026-11-06 공지사항 로그인·회원가입 및 관리자 권한

- Firebase Authentication 이메일/비밀번호 로그인을 추가했다. 회원가입은 이름, 아이디, 비밀번호, 이메일을 받고 아이디 중복 확인을 필수로 한다. 로그인은 이메일과 비밀번호를 사용한다.
- Notice 상단에 로그인 상태와 사용자 이름 환영 문구를 표시하고, 로그인 후 로그아웃 버튼으로 전환한다. 로그인과 회원가입은 각각 `login.html`, `signup.html`로 분리하고 서로 이동 링크를 제공한다.
- 회원가입 프로필 및 아이디 인덱스는 Firestore에 저장한다. 사용자 첨부파일은 기존 LocalStorage 방식을 유지한다.
- 가입 프로필은 `name`, `username`, `email`, `createdAt`, `role` 필드로 저장하며 일반 회원의 역할은 `user`로 고정한다. 관리자는 수동 프로필에 `role: admin`을 설정한다.
- 게시글 작성·수정·삭제 UI와 라우트는 관리자만 허용한다. `firestore.rules`에서도 `users/{uid}.role == 'admin'`인지 검사한다. 조회수 증가와 개인별 북마크는 별도 규칙으로 유지한다.
- 관리자 계정은 Firebase Console에서 수동 생성해야 하며 `curr-task/007-파이어 베이스 전환/firebase-auth-setup.md` 절차를 따른다. 요청된 4자리 비밀번호는 Firebase Authentication의 최소 길이보다 짧아 6자 이상 비밀번호를 직접 지정해야 한다.
- 확인: 수정된 JavaScript의 `node --check` 통과. 브라우저에서 로그인/가입 UI, 모바일 가로 넘침 없음, 콘솔 오류 없음, 비로그인 직접 글쓰기 경로의 로그인 유도를 확인했다.
- 남은 설정: Firebase Console에서 이메일/비밀번호 공급자 활성화, `firestore.rules` 게시, 관리자 Auth 계정 및 Firestore 문서(`users/{uid}`, `usernames/admin`) 수동 등록.

## 2026-11-04 푸터(Footer) 구현

- `<footer class="site-footer">` 내에 3단 박스 구조(`겉박스 > .inner-box > .part-box`)를 준수하여 푸터 마크업 및 스타일링을 구현했다.
- 디자인 토큰 시스템 반영:
  - 배경색: 프로젝트 지정 기본 배경색 `var(--color-bg)` (`#f4f5fb`)
  - 텍스트색: 프로젝트 지정 기본 본문색 `var(--color-text)` (`#1b1b1c`)
  - 포인트 호버: `var(--color-accent)` (`#0a28ff`)
  - 토큰 추가: `--footer-pad-block`, `--footer-nav-gap`, `--footer-contact-gap`, `--footer-dt-min-w`, `--fs-footer`, `--footer-sns-size`
- 데스크톱 (PC: `min-width: 1400px`):
  1. 좌측 파티션: 푸터 메뉴 (`PROJECTS`, `EXHIBITION`, `INDEX`, `ARCHIVE`) 링크 목록
  2. 중앙 파티션: 요청된 연락처 정보 (`Tel. 010-8726-9670`, `E-mail. chro0633@gmail.com`)를 시맨틱 `<dl>`(`<dt>`, `<dd>`)로 구성하고 `tel:`, `mailto:` 링크 적용 및 라벨 기준 열 정렬
  3. 우측 파티션: 원형 테두리 내 인스타그램 SVG SNS 버튼 (우측 'hid' 로고는 요청에 따라 제외)
- 태블릿 및 모바일 (`max-width: 1399px`):
  - 시안 `004_m.png`에 맞춰 좌측 메뉴 및 SNS 버튼을 숨기고, 좌측 정렬된 연락처 2줄 정보만 깔끔하게 노출하도록 구현
- 웹 접근성 준수:
  - 시맨틱 마크업: `<nav aria-label="푸터 메뉴">`, `<dl>`, `<dt>`, `<dd>`, SVG `aria-hidden="true"`
  - SNS 새 창 링크: `target="_blank"`, `rel="noopener noreferrer"`, `aria-label="Instagram (새 창 열림)"`
  - 키보드 포커스 링(`:focus-visible`) 및 `prefers-reduced-motion` 모션 감쇠 대응

## 2026-11-04 세번째 파트 Projects 슬라이더 구현

- `#intro-section`의 형제 섹션으로 `<section class="site-section site-section--projects" id="projects-section" aria-labelledby="projects-title">`를 구현했다.
- 3단 박스 구조(`겉박스 > .inner-box > .part-box`)를 준수하여:
  1. 헤더 파티션: `Projects` 영문 타이틀 (`h2.projects__title`)
  2. 슬라이더 파티션: 무한 루프 캐러셀 트랙 및 6개 썸네일 카드(`images/thumb-01.png` ~ `thumb-06.png`)
  3. 하단 CTA 파티션: 규약 및 시안에 맞춘 알약형 `Enter` 버튼 (`a.projects__btn`)
- 슬라이더 기능 요구사항 반영 (`js/modules/projects-slider.js`):
  1. 중앙 활성 카드(`.is-active`)는 100% 크기(`scale(1)`) 및 100% 명도/불투명도(`brightness(1)`, `opacity: 1`), 은은한 그림자로 강조.
  2. 양 옆의 비활성 카드는 축소(`scale(0.85)`) 및 명도/불투명도 저하(`brightness(0.35)`, `opacity: 0.5`) 처리.
  3. 가운데 오는 카드는 3초간 멈춘 뒤 다음 카드로 부드럽게 자동 전환(무한 루프 순환).
  4. 클릭 시 해당 카드가 중앙으로 전환되며, 모바일 터치 스와이프 및 데스크톱 마우스 드래그 동작 지원.
  5. 마우스 호버 시 자동 슬라이드 일시정지, 키보드 좌우 화살표 탐색 지원.

## 2026-11-04 검색 패널 및 헤더 돋보기 다듬기

- 패널의 고정 높이를 없애고 위·아래 여백과 태그를 포함한 콘텐츠 높이에 맞춰 늘어나도록 조정했다. 입력 필드를 제거하고 `Search for project name`을 제목 텍스트로 표시한다.
- 첫째 줄 태그 8개는 `js/main.js`의 `searchTagNames` 배열에서 렌더링하도록 유지했다. 헤더 돋보기는 `images/search.svg`를 사용하고 회색(`#808187`), 40×40px로 표시한다.
- 모바일에서는 같은 SVG를 30×30px로 표시하고 흰색으로 반전한다.
- 다시 클릭하거나 Escape를 누르면 닫히며, `aria-expanded`, `aria-hidden`, `inert`와 포커스를 동기화한다.
- 1687px/1399px/390px 뷰포트에서 패널 크기와 가로 넘침을 확인했다. 태그를 추가하면 패널 높이가 증가한다. 입력 요소가 없고 Escape 닫기도 동작한다.

## 2026-11-04 태블릿 전환 시 메뉴 슬라이드 깜빡임 수정

- 메뉴 슬라이드 전환을 햄버거 메뉴를 처음 클릭한 뒤에만 활성화하고, 데스크톱/태블릿 경계가 바뀌면 전환 상태를 초기화해 닫힌 패널이 반응형 전환 때문에 애니메이션되지 않도록 했다.

## 2026-11-03 #intro-section 배경 이미지 가로 100% 채움 수정

- `.site-section--intro`의 `background-size`를 고정 상한(`min(100%, 1400px)`)에서 `var(--intro-bg-size, 100% auto)`로 변경하여, 화면 크기 변화에 따라 배경 이미지가 항상 가로 100%로 꽉 차도록 수정했다.
- PC 미디어쿼리(`min-width: 1400px`)의 `background-size: min(90%, 1400px) auto;` 오버라이드를 제거하여 전 해상도에서 가로 100%를 일관되게 유지하도록 했다.

## 2026-11-03 사이트 컨셉 소개 섹션 (Intro / What If) 구현

- `spec-kit/Agents.md` PART S5/A4 규약에 맞춰 Pretendard Variable 웹폰트 연동, 기본 배경 `#F4F5FB`, 기본 텍스트 `#1B1B1C`, 포인트 컬러 `#0A28FF` 토큰을 적용했다. Hero 및 헤더는 어두운 비주얼 영역 위 가독성을 위해 `--color-hero-text`로 보호했다.
- `index.html`의 `main` 내부에 두 번째 섹션으로 `<section class="site-section site-section--intro" id="intro-section" aria-labelledby="intro-title">`를 구성했다.
- 3단 박스 원칙(`겉박스 > .inner-box > .part-box`)을 준수하여:
  1. 워드마크 파티션: 대형 'What If' 타이틀 (`h2.intro__wordmark`)
  2. 슬로건 파티션: '쓸모없음의 쓸모, 무쓸모 디자인' / '만약에, What If' (`p.intro__slogan`)
  3. 2분할 콘텐츠 파티션: 데스크톱 1400px 이상에서는 '제목 25% : 본문 75%', 모바일/태블릿에서는 중앙 정렬 세로 적층 구조로 구성.
- 한국어 및 영문 본문 블록에 `lang="ko"`, `lang="en"`과 줄바꿈 규약(`keep-all`, `hyphens: auto`)을 적용했다.
- 배경에는 `images/sec1_bg1_light.png`를 배치하여 밝은 테마에 맞는 유기적 푸른 그래픽을 연출했다.

## 2026-11-03 모바일 전체 메뉴 인터랙션

- 모바일 메뉴를 왼쪽 폭 80vw, 높이 80vh의 밝은 패널로 구성하고, 버튼 클릭 시 위에서 아래로 이동하며 투명도와 함께 나타나도록 수정했다.
- 메뉴에 HOME, PROJECTS, MAGAZINE, EXHIBITION, INDEX, ARCHIVE를 표시하고, PROJECTS 하위 항목은 향후 편집용 HTML 주석으로 보관했다.
- 메뉴 닫힘 상태를 `aria-hidden`에 반영하고 기존 Escape/토글 제어를 유지했다. reduced-motion 설정에서는 전환 효과를 끈다.
- 브라우저에서 모바일 패널의 80vh 크기, 메뉴 항목, 하위 메뉴 비노출, 닫힘 상태의 접근성 속성을 확인했다. 현재 공유 브라우저가 비활성 탭으로 전환 시간을 진행하지 않아 실시간 애니메이션 프레임은 재생 검증하지 못했으며, CSS 전환의 시작/종료 상태와 선언은 확인했다.

## 2026-11-03 모바일 햄버거 X 정렬 수정

- 메뉴 막대의 30×3px 크기와 0.4rem 간격을 토큰으로 통일하고, 열림 상태에서 각 막대를 간격의 절반만큼 반대 방향으로 이동시켜 중심에서 교차하게 했다.
- 확인: 브라우저에서 두 막대 중심이 동일하고 회전각이 각각 45°/-45°인 것을 확인했다.

## 2026-11-03 Hero Section 구현 완료

- `index.html`과 `css/main.css`에 데스크톱·모바일 Hero 배경 및 오버레이 콘텐츠를 구현했다. 데스크톱은 `images/hero_bg.png`, 813px 이하에서는 `images/hero_bg_m.jpg`를 사용한다.
- 모바일 헤더는 좌측 햄버거, 중앙 워드마크, 우측 검색 아이콘으로 배치했다. 햄버거 토글은 `aria-expanded` 상태, Escape 닫기, 닫은 뒤 포커스 복귀를 지원한다. JS가 실행되지 않으면 메뉴 목록은 표시되고 토글은 숨겨진다.
- 모바일 Hero에는 연도와 학교 설명을 세로 배치하고 Enter는 숨긴다. 814~1399px는 기존 1400px 데스크톱 메뉴 기준과 813px 모바일 기준 사이에서 햄버거 메뉴를 사용한다.
- 확인: 브라우저에서 320, 813, 814, 1399, 1400, 1920px를 검사했다. Hero 높이와 이미지 전환이 적용되고 가로 넘침이 없었다. 모바일 메뉴 열기/닫기, Escape 및 포커스 복귀를 확인했고 브라우저 런타임 오류는 없었다.
- 참고: `spec-kit/reference/` 폴더는 제공되지 않아 첨부 레퍼런스와 `images/` 자산을 기준으로 구현했다. 메뉴 항목은 기존처럼 텍스트이며 각 항목의 목적지 페이지는 아직 없다. Node.js 실행 파일이 없어 별도 `node --check`는 하지 않았다.

## 이전 구현 완료 사항

- `index.html`에 한국어 문서 기본 구조, 메타 정보, 건너뛰기 링크, 헤더, 홈 히어로 섹션, 푸터 뼈대를 만들었다.
- 헤더에는 텍스트 기반 WHAT IF 워드마크, 학과 행사명, 데스크톱 GNB 5개, 장식용 검색 아이콘이 있다.
- 히어로에는 `2025.`와 `Enter`를 배치했다. 큰 배경 비주얼은 이미지로 만들거나 추가하지 않고 검정색 빈 영역으로 두었다.
- `css/base/tokens.css`와 `css/main.css`를 만들었다. `main.css`는 `[COMMON]`과 `[PAGE:home]` 구역으로 나누었다. `common.css`는 만들지 않았다.
- 화면을 직접 확인하고 390, 812, 813, 1399, 1400, 1920px 너비를 검사했다. 이전 지침 기준으로 가로 넘침이 없었고 1400px부터 GNB가 보이며 스킵 링크 포커스가 확인되었다.
- Python 실행 파일을 찾지 못해 HTTP 서버 검증은 하지 못했고 브라우저에서 `file://`로 확인했다. 린트/테스트 러너도 실행하지 않았다.

## 현재 구현에서 주의할 점

- GNB 항목은 현재 일반 텍스트 목록이라 실제 페이지 이동 링크가 아니다. 검색 아이콘은 장식용이며 검색 기능이 아니다.
- 푸터는 구조용 빈 파티션만 존재한다. 오프라인 전시·프로젝트 섹션 등 후속 섹션은 오너 지시에 따라 순차 구현한다.
- 헤더 수치·세부 스타일은 임시 토큰이며 일부 `TODO(owner)`가 남아 있다. 이를 확정값으로 취급하지 않는다.

## 이번에 확인한 지침 변경 사항

- Pretendard를 한국어·영어 공통 서체로 사용한다. 규약은 Pretendard Variable 웹폰트의 `@import` 경로를 명시한다.
- 다크 전용 제한이 해제되었다. 기본 배경 `#F4F5FB`, 기본 텍스트 `#1B1B1C`, 기본 포인트 `#0A28FF`를 적용하고, 기존 주황색 `#FA4616` 상호작용 색상은 유지한다.
- S5의 새 primitive/semantic 색상 토큰, 본문 대비 기준, 포커스 색 및 버튼 호버의 파랑 변경값을 따른다.
- S7의 미확정 항목 표는 축약되었지만, S3.6의 헤더 높이·간격 및 검색·메뉴·푸터 수치는 여전히 `[main.css 개발]` 항목이다. S9의 제안 → 오너 승인 → `docs/decisions.md` 기록 절차를 따른다.

### 지침 간 충돌

- `README.md`의 1장과 4장에는 "다크 전용" 요약이 남아 있으나, `spec-kit/Agents.md` PART S1/S5 및 사용자 명시 지침에 따라 밝은 테마 기본 배경(`#F4F5FB`) 및 텍스트(`#1B1B1C`) 규약을 최우선 적용했다.

## 다음 작업 시작 체크리스트

1. `README.md` 전체와 `spec-kit/Agents.md` 전체를 다시 읽고 최신 요구를 확인한다.
2. 이 파일과 현재 `index.html`, `css/base/tokens.css`, `css/main.css`를 대조한다.
3. 요청 범위와 승인 여부를 확인한 뒤 접근성 상태까지 설계한다. 추측으로 새 기능을 붙이지 않는다.
4. 완료 후 브라우저에서 확인 가능한 너비·키보드 포커스·가로 넘침을 검증하고, 이 파일에 결과와 남은 일을 갱신한다.
