import { storageHelper } from './storageHelper.js';

const SEED_IMG_ID = 'seed-banner';
const SEED_PDF_ID = 'seed-guide-pdf';

const bannerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="240" viewBox="0 0 1200 240">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e9ecf7"/><stop offset="1" stop-color="#b9c9f2"/></linearGradient></defs>
<rect width="1200" height="240" fill="url(#g)"/><rect x="820" y="30" width="110" height="180" rx="8" fill="#005ada" opacity=".25"/>
<text x="90" y="125" font-family="Pretendard,Arial,sans-serif" font-size="64" font-weight="600" fill="#1b1b1c">What If</text>
<text x="92" y="165" font-family="Arial,sans-serif" font-size="18" fill="#1b1b1c">Hongik University Industrial Design Degree Show</text></svg>`;

// 시드용 최소 PDF (실제 열리는 더미 파일)
const PDF_B64 = 'JVBERi0xLjEKMSAwIG9iajw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+ZW5kb2JqCjIgMCBvYmo8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PmVuZG9iagozIDAgb2JqPDwvVHlwZS9QYWdlL1BhcmVudCAyIDAgUi9NZWRpYUJveFswIDAgMzAwIDEwMF0+PmVuZG9iagp0cmFpbGVyPDwvUm9vdCAxIDAgUj4+CiUlRU9G';

const AUTHOR = { id: 'admin', name: 'What If' };
const body = (t) => `<p>안녕하세요, What If 운영사무국입니다.</p><p>${t}</p><p>많은 관심 부탁드립니다. 감사합니다.</p>`;

const rows = [
  ['What If 2026 전시 일정 안내', '2026-09-20', 362, '전시', '2026 홍익대학교 산업디자인과 졸업전시 <What If>의 전시 일정을 안내드립니다.'],
  ['공식 SNS 채널 오픈 안내', '2026-09-28', 395, '운영', 'What If 공식 인스타그램 채널이 오픈되었습니다. 전시 소식을 가장 먼저 만나보세요.'],
  ['운영 시간 변경 안내', '2026-10-05', 267, '운영', '전시 기간 중 운영 시간이 일부 변경되어 안내드립니다.'],
  ['전시 관련 FAQ 안내', '2026-10-10', 298, '전시', '관람객 여러분이 자주 문의하시는 내용을 FAQ로 정리했습니다.'],
  ['프로젝트 아카이브 업데이트 안내', '2026-10-15', 376, '아카이브', '프로젝트 아카이브에 새로운 작품이 추가되었습니다.'],
  ['홈페이지 리뉴얼 작업 안내', '2026-10-20', 421, '운영', '더 나은 서비스를 위해 홈페이지 리뉴얼 작업을 진행합니다.'],
];

/** 최초 1회만 실행: 스크린샷과 동일한 7건의 샘플 데이터 */
export async function seedIfEmpty(postKey, fileKey) {
  if (await storageHelper.has(postKey)) return;
  await storageHelper.set(fileKey(SEED_IMG_ID), 'data:image/svg+xml;utf8,' + encodeURIComponent(bannerSvg));
  await storageHelper.set(fileKey(SEED_PDF_ID), 'data:application/pdf;base64,' + PDF_B64);

  const make = (n, [title, date, viewCount, category, text], extra = {}) => ({
    id: `seed-post-${n}`, title, category, content: body(text), imageIds: [], attachments: [],
    author: AUTHOR, isPublic: true, viewCount,
    createdAt: `${date}T09:00:00.000Z`, updatedAt: `${date}T09:00:00.000Z`, ...extra,
  });

  const posts = rows.map((r, i) => make(i + 1, r));
  posts.push(make(7, ['What If 2026 전시 안내 및 운영 일정 안내', '2026-10-27', 324, '전시', ''], {
    content:
      `<p>안녕하세요, What If 운영사무국입니다.</p><p><img data-file-id="${SEED_IMG_ID}" alt="What If 전시장"></p>` +
      `<p>2026 홍익대학교 산업디자인과 졸업전시 &lt;What If&gt;가 오는 11월 12일(목)부터 15일(일)까지 개최됩니다.<br>` +
      `이번 전시는 '만약, What If'라는 질문을 통해 디자인이 만드는 새로운 가능성을 탐구합니다.</p>` +
      `<p>전시 관람은 사전 예약 없이 자유롭게 가능하며, 운영 시간은 오전 10시부터 오후 6시까지입니다.<br>많은 관심과 방문 부탁드립니다. 감사합니다.</p>`,
    imageIds: [SEED_IMG_ID],
    attachments: [{ id: SEED_PDF_ID, name: '전시안내문.pdf', size: 1024, mimeType: 'application/pdf', createdAt: '2026-10-27T09:00:00.000Z' }],
  }));
  await storageHelper.set(postKey, posts.reverse()); // 최신순 저장
}
