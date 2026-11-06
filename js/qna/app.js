import { authService } from '../notice/services/authService.js';
import { qnaService } from './qnaService.js';
import { icons } from '../notice/ui/icons.js';

const root = document.getElementById('qna-view');
const titleEl = document.getElementById('qna-title');
const subtitleEl = document.getElementById('qna-subtitle');
const CATEGORIES = ['일반', '디자인', '바이브 코딩', '기타'];
const PAGE_SIZE = 10;

let session = { user: null, profile: null, isAdmin: false };
let authReady = false;
let cleanup = null;
let listHref = '#/';

const esc = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));
const date = (value) => value ? new Intl.DateTimeFormat('ko-KR').format(new Date(value)) : '-';
const navigate = (hash) => {
  if (location.hash === hash) route();
  else location.hash = hash;
};
const login = (hash) => {
  location.href = `login.html?return=${encodeURIComponent(`qna.html${hash}`)}`;
};

function renderAuth() {
  const message = document.querySelector('[data-qna-auth-message]');
  const loginLink = document.querySelector('[data-qna-login]');
  const logoutButton = document.querySelector('[data-qna-logout]');
  if (!message || !loginLink || !logoutButton) return;
  message.textContent = session.user
    ? `${session.profile?.name || session.user.displayName || '사용자'}님 환영합니다`
    : '로그인 후 질문을 작성할 수 있습니다.';
  loginLink.hidden = Boolean(session.user);
  logoutButton.hidden = !session.user;
}

function state(message) {
  root.innerHTML = `<p class="notice-state">${esc(message)}</p>`;
}

function route() {
  cleanup?.();
  cleanup = null;
  if (!authReady) return state('로그인 상태를 확인하고 있습니다...');

  const [view, id] = location.hash.slice(1).split('?')[0].split('/').filter(Boolean);
  const params = new URLSearchParams(location.hash.split('?')[1] || '');
  const isEdit = view === 'edit';
  if ((view === 'write' || isEdit) && !session.user) {
    return login(isEdit && id ? `#/edit/${encodeURIComponent(id)}` : '#/write');
  }
  titleEl.textContent = isEdit ? 'Edit Q&A' : 'Q&A';
  subtitleEl.textContent = isEdit ? '질문을 수정합니다.' : '궁금한 점을 질문하고 답변을 확인하세요.';
  document.title = `${titleEl.textContent} | What If`;
  root.dataset.view = view || 'list';

  const context = { session, navigate, listHref };
  if (view === 'post' && id) cleanup = mountDetail(root, { ...context, id });
  else if (view === 'write') cleanup = mountForm(root, { ...context, mode: 'write' });
  else if (isEdit && id) cleanup = mountForm(root, { ...context, mode: 'edit', id });
  else {
    listHref = location.hash || '#/';
    cleanup = mountList(root, { ...context, params });
  }
  scrollTo({ top: 0 });
}

function mountList(target, { params, session: currentSession, navigate: go }) {
  let disposed = false;
  const page = Math.max(1, Number(params.get('page')) || 1);
  const keyword = params.get('q') || '';
  const href = (nextPage) => `#/?${new URLSearchParams({ ...(keyword && { q: keyword }), page: nextPage })}`;
  target.innerHTML = `
    <div class="notice-toolbar">
      <p class="notice-total" data-total>질문 <span>-</span></p>
      <div class="notice-toolbar__right">
        <form class="notice-search" role="search" data-search>
          <label class="visually-hidden" for="qna-q">질문 검색</label>
          <input id="qna-q" class="notice-search__input" type="search" placeholder="검색어를 입력하세요." value="${esc(keyword)}">
          <button class="notice-search__btn" type="submit" aria-label="검색">${icons.search}</button>
        </form>
        ${currentSession.user
          ? '<a class="notice-btn notice-btn--primary notice-btn--sm" href="#/write">질문하기</a>'
          : '<a class="notice-btn notice-btn--primary notice-btn--sm" href="login.html?return=qna.html%23%2Fwrite">질문하기</a>'}
      </div>
    </div>
    <table class="notice-table qna-table">
      <caption class="visually-hidden">Q&amp;A 질문 목록</caption>
      <thead><tr><th scope="col" class="col-no">번호</th><th scope="col">제목</th><th scope="col" class="qna-category">유형</th><th scope="col" class="col-author">작성자</th><th scope="col" class="col-date">작성일</th></tr></thead>
      <tbody data-rows><tr><td colspan="5" class="notice-table__state">불러오는 중...</td></tr></tbody>
    </table>
    <nav class="notice-pagination" aria-label="페이지 이동" data-pagination></nav>`;

  target.querySelector('[data-search]').addEventListener('submit', (event) => {
    event.preventDefault();
    const q = event.currentTarget.querySelector('input').value.trim();
    go(`#/?${new URLSearchParams({ ...(q && { q }), page: 1 })}`);
  });

  (async () => {
    try {
      const all = await qnaService.list();
      const normalized = keyword.trim().toLocaleLowerCase();
      const filtered = all.filter((item) => !normalized
        || `${item.title} ${item.category}`.toLocaleLowerCase().includes(normalized));
      if (disposed) return;
      const last = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
      if (page > last) return go(href(last));
      const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
      target.querySelector('[data-total] span').textContent = filtered.length;
      target.querySelector('[data-rows]').innerHTML = items.length
        ? items.map((item, index) => `
          <tr>
            <td class="col-no" data-label="번호">${filtered.length - (page - 1) * PAGE_SIZE - index}</td>
            <td class="col-title">
              <a href="#/post/${esc(item.id)}">${item.isAnswered ? '<span class="qna-answered">답변 완료</span>' : ''}${esc(item.title)}</a>
              ${item.isPublic ? '' : '<span class="notice-private">비공개</span>'}
            </td>
            <td class="qna-category" data-label="유형">${esc(item.category)}</td>
            <td class="col-author" data-label="작성자">${esc(item.author.name)}</td>
            <td class="col-date" data-label="작성일">${date(item.createdAt)}</td>
          </tr>`).join('')
        : '<tr><td colspan="5" class="notice-table__state">등록된 질문이 없습니다.</td></tr>';

      target.querySelector('[data-pagination]').innerHTML = Array.from({ length: last }, (_, index) => index + 1)
        .map((number) => `<a class="notice-page ${number === page ? 'is-current' : ''}" href="${href(number)}" ${number === page ? 'aria-current="page"' : ''}>${number}</a>`).join('');
    } catch (error) {
      console.error('Q&A 목록을 불러오지 못했습니다.', error);
      if (!disposed) target.querySelector('[data-rows]').innerHTML = '<tr><td colspan="5" class="notice-table__state">목록을 불러오지 못했습니다.</td></tr>';
    }
  })();
  return () => { disposed = true; };
}

function mountForm(target, { mode, id, session: currentSession, navigate: go, listHref: backToList }) {
  const isEdit = mode === 'edit';
  let original;
  let disposed = false;

  async function render() {
    if (isEdit) {
      try {
        original = await qnaService.getById(id);
      } catch (error) {
        console.error('Q&A 질문을 불러오지 못했습니다.', error);
        state('질문을 불러오지 못했습니다. 비공개 글은 작성자만 확인할 수 있습니다.');
        return;
      }
      if (disposed) return;
      if (!original || original.author.id !== currentSession.user?.uid) {
        state('수정할 권한이 없는 질문입니다.');
        return;
      }
    }

    target.innerHTML = `
      <form class="notice-form qna-form">
        <h2 class="notice-form__heading">${isEdit ? '질문 수정' : '질문 작성'}</h2>
        <div class="notice-form__row">
          <label class="notice-form__label" for="qna-category">질문 유형</label>
          <div class="notice-form__field"><select id="qna-category" class="notice-input">${CATEGORIES.map((category) => `<option value="${category}" ${original?.category === category ? 'selected' : ''}>${category}</option>`).join('')}</select></div>
        </div>
        <div class="notice-form__row">
          <label class="notice-form__label" for="qna-title-input">제목 <span class="req">*</span></label>
          <div class="notice-form__field"><input id="qna-title-input" class="notice-input" maxlength="100" required value="${esc(original?.title || '')}" placeholder="제목을 입력해주세요."></div>
        </div>
        <div class="notice-form__row notice-form__row--top">
          <label class="notice-form__label" for="qna-content-input">내용 <span class="req">*</span></label>
          <div class="notice-form__field"><textarea id="qna-content-input" class="notice-input qna-textarea" maxlength="10000" required placeholder="질문 내용을 입력해주세요.">${esc(original?.content || '')}</textarea></div>
        </div>
        <div class="notice-form__row">
          <span class="notice-form__label">공개 설정</span>
          <div class="notice-form__field notice-radio-group">
            <label class="notice-radio"><input type="radio" name="qna-public" value="true" ${original?.isPublic !== false ? 'checked' : ''}><span>공개</span></label>
            <label class="notice-radio"><input type="radio" name="qna-public" value="false" ${original?.isPublic === false ? 'checked' : ''}><span>비공개 (작성자와 관리자만 열람)</span></label>
          </div>
        </div>
        <div class="notice-form__footer">
          <button type="button" class="notice-btn notice-btn--ghost" data-cancel>취소</button>
          <button type="submit" class="notice-btn notice-btn--primary" data-submit>${isEdit ? '수정 완료' : '등록하기'}</button>
        </div>
      </form>`;

    target.querySelector('[data-cancel]').addEventListener('click', () => go(isEdit ? `#/post/${id}` : backToList));
    target.querySelector('form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const button = target.querySelector('[data-submit]');
      const title = target.querySelector('#qna-title-input').value.trim();
      const content = target.querySelector('#qna-content-input').value.trim();
      if (!title || !content) return;
      button.disabled = true;
      button.textContent = '저장 중...';
      try {
        const values = {
          title,
          content,
          category: target.querySelector('#qna-category').value,
          isPublic: target.querySelector('[name="qna-public"]:checked').value === 'true',
        };
        const question = isEdit
          ? await qnaService.update(id, values)
          : await qnaService.create({
              ...values,
              author: {
                id: currentSession.user.uid,
                name: currentSession.profile?.name || currentSession.user.displayName || '사용자',
              },
            });
        go(`#/post/${question.id}`);
      } catch (error) {
        console.error('Q&A 질문을 저장하지 못했습니다.', error);
        window.alert('질문을 저장하지 못했습니다. 잠시 후 다시 시도해주세요.');
        button.disabled = false;
        button.textContent = isEdit ? '수정 완료' : '등록하기';
      }
    });
  }
  render();
  return () => { disposed = true; };
}

function mountDetail(target, { id, session: currentSession, navigate: go, listHref: backToList }) {
  let disposed = false;
  target.innerHTML = `<a class="notice-back" href="${backToList}">‹ <span>목록으로 돌아가기</span></a><p class="notice-state">불러오는 중...</p>`;
  (async () => {
    try {
      const question = await qnaService.getById(id);
      if (disposed) return;
      if (!question) return state('존재하지 않거나 삭제된 질문입니다.');
      const isOwner = currentSession.user?.uid === question.author.id;
      const canView = question.isPublic || isOwner || currentSession.isAdmin;
      if (!canView) return state('비공개 질문입니다. 작성자와 관리자만 확인할 수 있습니다.');
      await qnaService.increaseViewCount(id);
      question.viewCount = (question.viewCount || 0) + 1;
      if (disposed) return;
      render(question, isOwner);
    } catch (error) {
      console.error('Q&A 질문을 불러오지 못했습니다.', error);
      if (!disposed) state('질문을 불러오지 못했습니다.');
    }
  })();

  function render(question, isOwner) {
    target.innerHTML = `
      <a class="notice-back" href="${backToList}">‹ <span>목록으로 돌아가기</span></a>
      <article class="notice-detail">
        <header class="notice-detail__head">
          <div>
            <p class="qna-detail__category">${esc(question.category)}${question.answer ? '<span class="qna-answered">답변 완료</span>' : '<span class="qna-waiting">답변 대기</span>'}${question.isPublic ? '' : '<span class="notice-private">비공개</span>'}</p>
            <h2 class="notice-detail__title">${esc(question.title)}</h2>
            <p class="notice-detail__meta"><span>작성자 <b>${esc(question.author.name)}</b></span><span>작성일 <b>${date(question.createdAt)}</b></span><span>조회수 <b>${question.viewCount}</b></span></p>
          </div>
        </header>
        <div class="notice-detail__body qna-content">${esc(question.content)}</div>
        ${isOwner ? `<div class="notice-detail__actions">
          <a class="notice-btn notice-btn--ghost notice-btn--sm" href="#/edit/${esc(question.id)}">수정</a>
          <button type="button" class="notice-btn notice-btn--danger-ghost notice-btn--sm" data-delete>삭제</button>
        </div>` : ''}
        ${question.answer ? `<section class="qna-answer" aria-labelledby="qna-answer-title">
          <h3 id="qna-answer-title">관리자 답변</h3>
          <p class="notice-detail__meta"><span>답변자 <b>${esc(question.answer.authorName)}</b></span><span>답변일 <b>${date(question.answer.createdAt)}</b></span></p>
          <div class="qna-content">${esc(question.answer.content)}</div>
        </section>` : ''}
        ${currentSession.isAdmin ? `<form class="qna-answer-form">
          <label for="qna-answer-input">${question.answer ? '답변 수정' : '답변 작성'}</label>
          <textarea id="qna-answer-input" class="notice-input qna-textarea" maxlength="10000" required placeholder="답변을 입력해주세요.">${esc(question.answer?.content || '')}</textarea>
          <button class="notice-btn notice-btn--primary notice-btn--sm" type="submit">답변 등록</button>
        </form>` : ''}
      </article>`;

    target.querySelector('[data-delete]')?.addEventListener('click', async () => {
      if (!window.confirm('질문을 삭제하시겠습니까?')) return;
      try {
        await qnaService.delete(question.id);
        go(backToList);
      } catch (error) {
        console.error('Q&A 질문을 삭제하지 못했습니다.', error);
        window.alert('질문을 삭제하지 못했습니다.');
      }
    });
    target.querySelector('.qna-answer-form')?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const button = event.currentTarget.querySelector('button');
      const content = event.currentTarget.querySelector('textarea').value.trim();
      if (!content) return;
      button.disabled = true;
      try {
        await qnaService.answer(question.id, {
          content,
          author: {
            id: currentSession.user.uid,
            name: currentSession.profile?.name || currentSession.user.displayName || '관리자',
          },
        });
        go(`#/post/${question.id}`);
      } catch (error) {
        console.error('Q&A 답변을 저장하지 못했습니다.', error);
        window.alert('답변을 저장하지 못했습니다.');
        button.disabled = false;
      }
    });
  }
  return () => { disposed = true; };
}

document.querySelector('[data-qna-logout]')?.addEventListener('click', async () => {
  try {
    await authService.signOut();
    navigate('#/');
  } catch (error) {
    console.error('로그아웃하지 못했습니다.', error);
    window.alert('로그아웃하지 못했습니다.');
  }
});
window.addEventListener('hashchange', route);
route();
authService.subscribe((nextSession) => {
  session = nextSession;
  authReady = true;
  renderAuth();
  route();
}, (error) => {
  console.error('인증 상태를 확인하지 못했습니다.', error);
  authReady = true;
  renderAuth();
  route();
});
