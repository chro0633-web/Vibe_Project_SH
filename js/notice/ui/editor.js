import { icons } from './icons.js';
import { promptDialog } from './dialog.js';
import { toast } from './toast.js';
import { fileService } from '../services/fileService.js';
import { compressImage } from '../utils/image.js';
import { sanitizeHtml } from '../utils/sanitize.js';
import { hydrateImages } from './images.js';
import { esc } from '../utils/format.js';

/**
 * 리치텍스트 에디터 (contenteditable + execCommand)
 * @param {HTMLElement} host
 * @param {{ fullscreen?: boolean, onImageUploaded?: (meta)=>void, onChange?: ()=>void, id?: string }} opts
 */
export function createEditor(host, { fullscreen = false, onImageUploaded, onChange, id = 'notice-editor' } = {}) {
  const btn = (cmd, label, icon, text) =>
    `<button type="button" class="notice-editor__btn" data-cmd="${cmd}" aria-label="${label}" title="${label}">${icon || text}</button>`;
  host.classList.add('notice-editor');
  host.innerHTML = `
    <div class="notice-editor__toolbar" role="toolbar" aria-label="서식 도구">
      ${btn('bold', '굵게', '', '<b>B</b>')}${btn('italic', '기울임', '', '<i>I</i>')}${btn('underline', '밑줄', '', '<u>U</u>')}
      <span class="notice-editor__sep"></span>
      ${btn('insertUnorderedList', '글머리 기호 목록', icons.ul)}${btn('insertOrderedList', '번호 목록', icons.ol)}
      <span class="notice-editor__sep"></span>
      ${btn('link', '링크', icons.link)}${btn('image', '이미지', icons.image)}
      ${fullscreen ? `<span class="notice-editor__sep"></span>${btn('fullscreen', '전체화면', icons.expand)}` : ''}
    </div>
    <div class="notice-editor__area" id="${esc(id)}" contenteditable="true" role="textbox" aria-multiline="true"
         aria-label="내용" data-placeholder="내용을 입력해주세요."></div>
    <input type="file" accept="image/*" hidden data-image-input>`;

  const area = host.querySelector('.notice-editor__area');
  const imgInput = host.querySelector('[data-image-input]');
  let savedRange = null;

  const saveRange = () => {
    const s = getSelection();
    if (s.rangeCount && area.contains(s.anchorNode)) savedRange = s.getRangeAt(0).cloneRange();
  };
  const restoreRange = () => {
    area.focus();
    if (savedRange) { const s = getSelection(); s.removeAllRanges(); s.addRange(savedRange); }
  };
  document.addEventListener('selectionchange', saveRange);

  const normalize = () => { // 비어 있으면 placeholder가 보이도록 정리
    if (!area.textContent.trim() && !area.querySelector('img,ul,ol')) area.innerHTML = '';
    onChange?.();
  };
  area.addEventListener('input', normalize);
  area.addEventListener('paste', (e) => { // 서식 없는 텍스트로만 붙여넣기
    e.preventDefault();
    document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
  });

  const updateState = () =>
    host.querySelectorAll('[data-cmd]').forEach((b) => {
      if (['bold', 'italic', 'underline', 'insertUnorderedList', 'insertOrderedList'].includes(b.dataset.cmd))
        b.classList.toggle('is-on', document.queryCommandState(b.dataset.cmd));
    });
  area.addEventListener('keyup', updateState);
  area.addEventListener('mouseup', updateState);

  const setFullscreen = (on) => {
    host.classList.toggle('is-fullscreen', on);
    document.body.classList.toggle('has-editor-fullscreen', on);
    const b = host.querySelector('[data-cmd="fullscreen"]');
    if (b) { b.innerHTML = on ? icons.collapse : icons.expand; b.setAttribute('aria-label', on ? '전체화면 닫기' : '전체화면'); }
  };
  const onKey = (e) => { if (e.key === 'Escape' && host.classList.contains('is-fullscreen')) setFullscreen(false); };
  document.addEventListener('keydown', onKey);

  host.querySelector('.notice-editor__toolbar').addEventListener('mousedown', (e) => e.preventDefault()); // 포커스 유지
  host.querySelector('.notice-editor__toolbar').addEventListener('click', async (e) => {
    const b = e.target.closest('[data-cmd]');
    if (!b) return;
    const cmd = b.dataset.cmd;
    if (cmd === 'fullscreen') return setFullscreen(!host.classList.contains('is-fullscreen'));
    if (cmd === 'image') { saveRange(); return imgInput.click(); }
    if (cmd === 'link') {
      saveRange();
      const selected = String(getSelection());
      const url = await promptDialog({ message: '연결할 주소(URL)를 입력해주세요.', placeholder: 'https://' });
      if (!url || !/^(https?:|mailto:)/i.test(url)) { if (url) toast('http(s):// 로 시작하는 주소만 사용할 수 있습니다.', 'error'); return; }
      restoreRange();
      if (selected) document.execCommand('createLink', false, url);
      else document.execCommand('insertHTML', false, `<a href="${esc(url)}">${esc(url)}</a>`);
      return normalize();
    }
    area.focus();
    document.execCommand(cmd);
    updateState(); normalize();
  });

  imgInput.addEventListener('change', async () => {
    const file = imgInput.files[0];
    imgInput.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) return toast('이미지 파일만 삽입할 수 있습니다.', 'error');
    try {
      const meta = await fileService.upload(await compressImage(file));
      const url = await fileService.getUrl(meta.id);
      onImageUploaded?.(meta);
      restoreRange();
      document.execCommand('insertHTML', false, `<img data-file-id="${meta.id}" src="${url}" alt="${esc(file.name)}">`);
      normalize();
    } catch (err) {
      toast(err.message || '이미지를 업로드하지 못했습니다.', 'error');
    }
  });

  return {
    area,
    getHtml: () => area.innerHTML,
    async setHtml(html) { area.innerHTML = sanitizeHtml(html); await hydrateImages(area); },
    focus: () => area.focus(),
    destroy() {
      document.removeEventListener('selectionchange', saveRange);
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('has-editor-fullscreen');
    },
  };
}
