import { postService } from '../services/postService.js';
import { fileService } from '../services/fileService.js';
import { icons } from '../ui/icons.js';
import { toast } from '../ui/toast.js';
import { confirmDialog } from '../ui/dialog.js';
import { hydrateImages } from '../ui/images.js';
import { sanitizeHtml } from '../utils/sanitize.js';
import { esc, formatDate, formatSize } from '../utils/format.js';

export function mountDetail(root, { id, navigate, listHref, session }) {
  let disposed = false;
  root.innerHTML = `<a class="notice-back" href="${listHref}">${icons.prev}<span>목록으로 돌아가기</span></a><p class="notice-state">불러오는 중...</p>`;

  (async () => {
    try {
      await postService.increaseViewCount(id); // 진입 시 조회수 +1
      const [post, adj, marked] = await Promise.all([postService.getById(id), postService.getAdjacent(id), postService.isBookmarked(id)]);
      if (disposed) return;
      if (!post) {
        root.innerHTML = `<a class="notice-back" href="${listHref}">${icons.prev}<span>목록으로 돌아가기</span></a><p class="notice-state">존재하지 않거나 삭제된 게시글입니다.</p>`;
        return;
      }
      render(post, adj, marked);
    } catch (err) {
      console.error(err);
      if (!disposed) root.innerHTML = `<a class="notice-back" href="${listHref}">${icons.prev}<span>목록으로 돌아가기</span></a><p class="notice-state">게시글을 불러오지 못했습니다.</p>`;
    }
  })();

  function render(post, { newer, older }, marked) {
    const pager = (p, dir) => p
      ? `<a class="notice-pager__item notice-pager__item--${dir}" href="#/post/${esc(p.id)}">${dir === 'prev'
          ? `<span class="notice-pager__btn">${icons.prev}이전글</span><span class="notice-pager__title">${esc(p.title)}</span>`
          : `<span class="notice-pager__title">${esc(p.title)}</span><span class="notice-pager__btn">다음글${icons.next}</span>`}</a>`
      : `<span class="notice-pager__item notice-pager__item--${dir} is-empty"><span class="notice-pager__btn is-disabled">${dir === 'prev' ? `${icons.prev}이전글` : `다음글${icons.next}`}</span></span>`;

    root.innerHTML = `
      <a class="notice-back" href="${listHref}">${icons.prev}<span>목록으로 돌아가기</span></a>
      <article class="notice-detail">
        <header class="notice-detail__head">
          <div>
            <h2 class="notice-detail__title">${esc(post.title)}${post.isPublic ? '' : `<span class="notice-private">${icons.lock}비공개</span>`}</h2>
            <p class="notice-detail__meta"><span>작성자 <b>${esc(post.author.name)}</b></span><span>작성일 <b>${formatDate(post.createdAt)}</b></span><span>조회수 <b>${post.viewCount}</b></span></p>
          </div>
          <div class="notice-detail__icons">
            <button type="button" class="notice-icon-btn" data-share aria-label="링크 복사">${icons.share}</button>
            ${session.user ? `<button type="button" class="notice-icon-btn ${marked ? 'is-on' : ''}" data-bookmark aria-pressed="${marked}" aria-label="북마크">${marked ? icons.bookmarkFilled : icons.bookmark}</button>` : ''}
          </div>
        </header>
        <div class="notice-detail__body" data-body></div>
        ${post.attachments.length ? `
          <section class="notice-files" aria-label="첨부파일"><h3>첨부파일</h3><ul>
            ${post.attachments.map((f) => `<li><a href="#" data-file="${esc(f.id)}" data-name="${esc(f.name)}">${icons.file}<span>${esc(f.name)}</span><em>(${formatSize(f.size)})</em></a></li>`).join('')}
          </ul></section>` : ''}
        ${session.isAdmin ? `<div class="notice-detail__actions">
          <a class="notice-btn notice-btn--ghost notice-btn--sm" href="#/edit/${esc(post.id)}">수정</a>
          <button type="button" class="notice-btn notice-btn--danger-ghost notice-btn--sm" data-delete>삭제</button>
        </div>` : ''}
        <nav class="notice-pager" aria-label="이전글 다음글">${pager(newer, 'prev')}<span class="notice-pager__divider"></span>${pager(older, 'next')}</nav>
      </article>`;

    const body = root.querySelector('[data-body]');
    body.innerHTML = sanitizeHtml(post.content);
    hydrateImages(body);

    root.querySelector('[data-share]').onclick = async () => {
      try { await navigator.clipboard.writeText(location.href); toast('링크가 복사되었습니다.'); }
      catch { toast('링크를 복사하지 못했습니다.', 'error'); }
    };
    const bm = root.querySelector('[data-bookmark]');
    bm?.addEventListener('click', async () => {
      try {
        const on = await postService.toggleBookmark(post.id);
        bm.classList.toggle('is-on', on); bm.setAttribute('aria-pressed', on); bm.innerHTML = on ? icons.bookmarkFilled : icons.bookmark;
        toast(on ? '북마크에 저장했습니다.' : '북마크를 해제했습니다.');
      } catch { toast('북마크를 변경하지 못했습니다.', 'error'); }
    });
    root.querySelector('[data-delete]')?.addEventListener('click', async () => {
      if (!await confirmDialog({ message: '이 게시글을 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.', confirmText: '삭제', danger: true })) return;
      try { await postService.delete(post.id); toast('삭제되었습니다.'); navigate(listHref); }
      catch { toast('삭제하지 못했습니다.', 'error'); }
    });
    root.querySelectorAll('[data-file]').forEach((a) => a.addEventListener('click', async (e) => {
      e.preventDefault();
      const url = await fileService.getUrl(a.dataset.file);
      if (!url) return toast('파일을 찾을 수 없습니다.', 'error');
      const dl = Object.assign(document.createElement('a'), { href: url, download: a.dataset.name });
      document.body.append(dl); dl.click(); dl.remove();
    }));
  }

  return () => { disposed = true; };
}
