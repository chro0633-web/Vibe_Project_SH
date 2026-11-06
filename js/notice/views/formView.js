import { postService } from '../services/postService.js';
import { fileService } from '../services/fileService.js';
import { createEditor } from '../ui/editor.js';
import { icons } from '../ui/icons.js';
import { toast } from '../ui/toast.js';
import { confirmDialog } from '../ui/dialog.js';
import { serializeContent, isEmptyContent } from '../utils/sanitize.js';
import { esc, formatSize } from '../utils/format.js';
import { CATEGORIES, MAX_FILE_COUNT, MAX_FILE_SIZE } from '../config.js';

/** 글쓰기(mode='write') / 수정(mode='edit') 공용 폼 */
export function mountForm(root, { mode, id, navigate, listHref, session }) {
  const isEdit = mode === 'edit';
  let disposed = false, saved = false, dirty = false;
  let editor = null;
  let original = null;
  const uploadedImageIds = new Set(); // 이번 편집 중 업로드된 이미지 (취소 시 정리)
  let existing = [];                  // 기존 첨부 메타
  const removedExisting = [];         // 삭제 예약된 기존 첨부 (저장 시 실제 삭제)
  let pending = [];                   // 새로 선택한 File

  const back = () => navigate(isEdit ? `#/post/${id}` : listHref);

  const start = async () => {
    if (isEdit) {
      root.innerHTML = '<p class="notice-state">불러오는 중...</p>';
      try { original = await postService.getById(id); } catch { original = null; }
      if (disposed) return;
      if (!original) { root.innerHTML = `<p class="notice-state">존재하지 않는 게시글입니다.</p><p class="notice-state"><a href="${listHref}">목록으로</a></p>`; return; }
      existing = [...original.attachments];
    }
    render();
  };

  function render() {
    root.innerHTML = `
    <form class="notice-form" novalidate>
      ${isEdit ? '' : '<h2 class="notice-form__heading">글쓰기</h2>'}
      <div class="notice-form__row">
        <label class="notice-form__label" for="nf-title">제목 <span class="req" aria-hidden="true">*</span></label>
        <div class="notice-form__field">
          <input id="nf-title" class="notice-input" type="text" maxlength="100" placeholder="제목을 입력해주세요." aria-required="true" aria-describedby="nf-title-err" value="${esc(original?.title || '')}">
          <p class="notice-error" id="nf-title-err" role="alert" hidden></p>
        </div>
      </div>
      <div class="notice-form__row">
        <label class="notice-form__label" for="nf-category">카테고리</label>
        <div class="notice-form__field"><div class="notice-select">
          <select id="nf-category" class="notice-input">${CATEGORIES.map((c) => `<option ${original?.category === c ? 'selected' : ''}>${c}</option>`).join('')}</select>${icons.chevronDown}
        </div></div>
      </div>
      ${isEdit ? `
      <div class="notice-form__row">
        <span class="notice-form__label" id="nf-vis-label">노출 여부</span>
        <div class="notice-form__field notice-radio-group" role="radiogroup" aria-labelledby="nf-vis-label">
          <label class="notice-radio"><input type="radio" name="isPublic" value="true" ${original.isPublic ? 'checked' : ''}><span>공개</span></label>
          <label class="notice-radio"><input type="radio" name="isPublic" value="false" ${original.isPublic ? '' : 'checked'}><span>비공개</span></label>
        </div>
      </div>` : ''}
      <div class="notice-form__row notice-form__row--top">
        <label class="notice-form__label" for="notice-editor">내용 <span class="req" aria-hidden="true">*</span></label>
        <div class="notice-form__field">
          <div data-editor></div>
          <p class="notice-error" id="nf-content-err" role="alert" hidden></p>
        </div>
      </div>
      <div class="notice-form__row notice-form__row--top">
        <span class="notice-form__label">첨부파일</span>
        <div class="notice-form__field">
          <div class="notice-attach-bar">
            <button type="button" class="notice-btn notice-btn--ghost notice-btn--sm" data-pick>${icons.clip}<span>${isEdit ? '파일 선택하기' : '파일 첨부하기'}</span></button>
            <span class="notice-hint">(최대 10MB / 10개까지 가능)</span>
            <input type="file" multiple hidden data-file-input>
          </div>
          <ul class="notice-attach-list" data-attach-list></ul>
        </div>
      </div>
      <div class="notice-form__footer">
        <button type="button" class="notice-btn notice-btn--ghost" data-cancel>취소</button>
        <button type="submit" class="notice-btn notice-btn--primary" data-submit>${isEdit ? '수정 완료' : '등록하기'}</button>
      </div>
    </form>`;

    editor = createEditor(root.querySelector('[data-editor]'), {
      fullscreen: isEdit,
      onImageUploaded: (m) => uploadedImageIds.add(m.id),
      onChange: () => { dirty = true; },
    });
    if (original) editor.setHtml(original.content);

    const form = root.querySelector('form');
    form.addEventListener('input', () => { dirty = true; });
    root.querySelector('[data-pick]').onclick = () => root.querySelector('[data-file-input]').click();
    root.querySelector('[data-file-input]').addEventListener('change', (e) => { addFiles([...e.target.files]); e.target.value = ''; });
    root.querySelector('[data-cancel]').onclick = async () => {
      if (dirty && !await confirmDialog({ message: '작성 중인 내용이 저장되지 않습니다. 취소하시겠습니까?', confirmText: '나가기' })) return;
      back();
    };
    form.addEventListener('submit', (e) => { e.preventDefault(); submit(); });
    renderAttachments();
  }

  function addFiles(files) {
    for (const f of files) {
      if (existing.length + pending.length >= MAX_FILE_COUNT) { toast(`첨부파일은 최대 ${MAX_FILE_COUNT}개까지 가능합니다.`, 'error'); break; }
      if (f.size > MAX_FILE_SIZE) { toast(`'${f.name}' 파일이 10MB를 초과합니다.`, 'error'); continue; }
      if (pending.some((p) => p.name === f.name && p.size === f.size)) continue;
      pending.push(f);
    }
    dirty = true;
    renderAttachments();
  }

  function renderAttachments() {
    const list = root.querySelector('[data-attach-list]');
    const row = (name, size, kind, key) =>
      `<li class="notice-attach-item">${icons.file}<span class="name">${esc(name)} <em>(${formatSize(size)})</em></span>
       <button type="button" class="notice-icon-btn" data-remove-${kind}="${esc(key)}" aria-label="${esc(name)} 삭제">${icons.close}</button></li>`;
    list.innerHTML = existing.map((f) => row(f.name, f.size, 'existing', f.id)).join('') + pending.map((f, i) => row(f.name, f.size, 'pending', i)).join('');
    list.hidden = !list.innerHTML;
    list.querySelectorAll('[data-remove-pending]').forEach((b) => (b.onclick = () => { pending.splice(Number(b.dataset.removePending), 1); renderAttachments(); }));
    list.querySelectorAll('[data-remove-existing]').forEach((b) => (b.onclick = async () => {
      const f = existing.find((x) => x.id === b.dataset.removeExisting);
      if (!await confirmDialog({ message: `'${f.name}' 파일을 삭제하시겠습니까?`, confirmText: '삭제', danger: true })) return;
      existing = existing.filter((x) => x.id !== f.id); removedExisting.push(f); dirty = true; renderAttachments();
    }));
  }

  const showError = (field, msg) => {
    const el = root.querySelector(`#nf-${field}-err`);
    el.textContent = msg; el.hidden = !msg;
    if (field === 'title') root.querySelector('#nf-title').setAttribute('aria-invalid', String(!!msg));
  };

  async function submit() {
    const title = root.querySelector('#nf-title').value.trim();
    const html = editor.getHtml();
    showError('title', title ? '' : '제목을 입력해주세요.');
    showError('content', isEmptyContent(html) ? '내용을 입력해주세요.' : '');
    if (!title) return root.querySelector('#nf-title').focus();
    if (isEmptyContent(html)) return editor.focus();

    const btn = root.querySelector('[data-submit]');
    btn.disabled = true; btn.textContent = '저장 중...';
    const newMetas = [];
    try {
      for (const f of pending) newMetas.push(await fileService.upload(f)); // 파일 데이터는 별도 저장, 메타데이터만 문서에 포함
      const { content, imageIds } = serializeContent(html);
      const dto = {
        title, category: root.querySelector('#nf-category').value, content, imageIds,
        attachments: [...existing, ...newMetas],
        author: original?.author || { id: session.user.uid, name: session.profile?.name || session.user.displayName || '관리자' },
        isPublic: isEdit ? root.querySelector('[name="isPublic"]:checked').value === 'true' : true,
      };
      const post = isEdit ? await postService.update(id, dto) : await postService.create(dto);
      saved = true;
      // 저장 성공 후 불필요해진 파일 정리
      const staleImages = (original?.imageIds || []).concat([...uploadedImageIds]).filter((x) => !imageIds.includes(x));
      await fileService.removeMany([...new Set(staleImages)].concat(removedExisting.map((f) => f.id)));
      toast(isEdit ? '수정되었습니다.' : '등록되었습니다.');
      navigate(`#/post/${post.id}`);
    } catch (err) {
      console.error(err);
      await fileService.removeMany(newMetas.map((m) => m.id)).catch(() => {}); // 롤백
      toast(err.message || '저장하지 못했습니다. 잠시 후 다시 시도해주세요.', 'error');
      btn.disabled = false; btn.textContent = isEdit ? '수정 완료' : '등록하기';
    }
  }

  start();

  return () => {
    disposed = true;
    editor?.destroy();
    if (!saved && uploadedImageIds.size) { // 저장하지 않고 떠나면 이번에 올린 이미지 정리
      const keep = new Set(original?.imageIds || []);
      fileService.removeMany([...uploadedImageIds].filter((x) => !keep.has(x))).catch(() => {});
    }
  };
}
