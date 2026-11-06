import { postService } from '../services/postService.js';
import { icons } from '../ui/icons.js';
import { toast } from '../ui/toast.js';
import { esc, formatDate } from '../utils/format.js';
import { PAGE_SIZE, NEW_BADGE_DAYS } from '../config.js';

const isNew = (iso) => Date.now() - new Date(iso).getTime() < NEW_BADGE_DAYS * 86400000;

const pageWindow = (page, last) => {
  const size = 5;
  const start = Math.max(1, Math.min(page - 2, last - size + 1));
  return Array.from({ length: Math.min(size, last) }, (_, i) => start + i);
};

export function mountList(root, { params, navigate, session }) {
  let disposed = false;
  const page = Math.max(1, Number(params.get('page')) || 1);
  const keyword = params.get('q') || '';
  const href = (p) => `#/?${new URLSearchParams({ ...(keyword && { q: keyword }), page: p })}`;

  root.innerHTML = `
    <div class="notice-toolbar">
      <p class="notice-total" data-total>Total <span>-</span></p>
      <div class="notice-toolbar__right">
        <form class="notice-search" role="search" data-search>
          <label class="visually-hidden" for="notice-q">공지사항 검색</label>
          <input id="notice-q" class="notice-search__input" type="search" placeholder="검색어를 입력하세요." value="${esc(keyword)}">
          <button class="notice-search__btn" type="submit" aria-label="검색">${icons.search}</button>
        </form>
        ${session.isAdmin ? '<a class="notice-btn notice-btn--primary notice-btn--sm" href="#/write">글쓰기</a>' : ''}
      </div>
    </div>
    <table class="notice-table">
      <caption class="visually-hidden">공지사항 목록</caption>
      <thead><tr><th scope="col" class="col-no">번호</th><th scope="col">제목</th><th scope="col" class="col-author">작성자</th><th scope="col" class="col-date">작성일</th><th scope="col" class="col-views">조회수</th></tr></thead>
      <tbody data-rows><tr><td colspan="5" class="notice-table__state">불러오는 중...</td></tr></tbody>
    </table>
    <nav class="notice-pagination" aria-label="페이지 이동" data-pagination></nav>`;

  root.querySelector('[data-search]').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = e.target.querySelector('input').value.trim();
    navigate(`#/?${new URLSearchParams({ ...(q && { q }), page: 1 })}`);
  });

  (async () => {
    try {
      const { items, total } = await postService.list({ keyword, page, pageSize: PAGE_SIZE });
      if (disposed) return;
      const last = Math.max(1, Math.ceil(total / PAGE_SIZE));
      if (page > last) return navigate(href(last));

      root.querySelector('[data-total] span').textContent = total;
      root.querySelector('[data-rows]').innerHTML = items.length
        ? items.map((p, i) => `
          <tr>
            <td class="col-no" data-label="번호">${total - (page - 1) * PAGE_SIZE - i}</td>
            <td class="col-title"><a href="#/post/${esc(p.id)}">${esc(p.title)}</a>
              ${isNew(p.createdAt) ? '<span class="notice-badge" title="최근 작성된 글">N<span class="visually-hidden"> 새 글</span></span>' : ''}
              ${p.isPublic ? '' : `<span class="notice-private">${icons.lock}비공개</span>`}</td>
            <td class="col-author">${esc(p.author.name)}</td>
            <td class="col-date">${formatDate(p.createdAt)}</td>
            <td class="col-views">${p.viewCount}</td>
          </tr>`).join('')
        : `<tr><td colspan="5" class="notice-table__state">${keyword ? '검색 결과가 없습니다.' : '등록된 게시글이 없습니다.'}</td></tr>`;

      root.querySelector('[data-pagination]').innerHTML = `
        ${page > 1 ? `<a class="notice-page notice-page--arrow" href="${href(page - 1)}" aria-label="이전 페이지">${icons.prev}</a>` : `<span class="notice-page notice-page--arrow is-disabled" aria-hidden="true">${icons.prev}</span>`}
        ${pageWindow(page, last).map((n) => `<a class="notice-page ${n === page ? 'is-current' : ''}" href="${href(n)}" ${n === page ? 'aria-current="page"' : ''}>${n}</a>`).join('')}
        ${page < last ? `<a class="notice-page notice-page--arrow" href="${href(page + 1)}" aria-label="다음 페이지">${icons.next}</a>` : `<span class="notice-page notice-page--arrow is-disabled" aria-hidden="true">${icons.next}</span>`}`;
    } catch (err) {
      console.error(err);
      if (!disposed) root.querySelector('[data-rows]').innerHTML = '<tr><td colspan="5" class="notice-table__state">목록을 불러오지 못했습니다.</td></tr>';
      toast('목록을 불러오지 못했습니다.', 'error');
    }
  })();

  return () => { disposed = true; };
}
