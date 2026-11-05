import { esc } from '../utils/format.js';

function open(html, onOpen) {
  return new Promise((resolve) => {
    const dlg = document.createElement('dialog');
    dlg.className = 'notice-dialog';
    dlg.innerHTML = html;
    document.body.append(dlg);
    const done = (v) => { dlg.close(); dlg.remove(); resolve(v); };
    dlg.addEventListener('cancel', (e) => { e.preventDefault(); done(null); });
    dlg.addEventListener('click', (e) => { if (e.target === dlg) done(null); });
    onOpen(dlg, done);
    dlg.showModal();
  });
}

/** 확인 창 → Promise<boolean> */
export const confirmDialog = ({ message, confirmText = '확인', danger = false }) =>
  open(
    `<form method="dialog" class="notice-dialog__box">
       <p class="notice-dialog__msg">${esc(message)}</p>
       <div class="notice-dialog__actions">
         <button type="button" class="notice-btn notice-btn--ghost" data-no>취소</button>
         <button type="button" class="notice-btn ${danger ? 'notice-btn--danger' : 'notice-btn--primary'}" data-yes>${esc(confirmText)}</button>
       </div></form>`,
    (dlg, done) => {
      dlg.querySelector('[data-no]').onclick = () => done(false);
      dlg.querySelector('[data-yes]').onclick = () => done(true);
      dlg.querySelector('[data-yes]').focus();
    },
  ).then(Boolean);

/** 입력 창 (링크 URL 등) → Promise<string|null> */
export const promptDialog = ({ message, placeholder = '', confirmText = '확인' }) =>
  open(
    `<form class="notice-dialog__box">
       <label class="notice-dialog__msg" for="notice-prompt">${esc(message)}</label>
       <input id="notice-prompt" class="notice-input" type="url" placeholder="${esc(placeholder)}" required>
       <div class="notice-dialog__actions">
         <button type="button" class="notice-btn notice-btn--ghost" data-no>취소</button>
         <button type="submit" class="notice-btn notice-btn--primary">${esc(confirmText)}</button>
       </div></form>`,
    (dlg, done) => {
      const input = dlg.querySelector('input');
      dlg.querySelector('[data-no]').onclick = () => done(null);
      dlg.querySelector('form').onsubmit = (e) => { e.preventDefault(); done(input.value.trim()); };
      input.focus();
    },
  );
