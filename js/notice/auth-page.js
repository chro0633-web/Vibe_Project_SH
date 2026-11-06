import { authService } from './services/authService.js';

const usernamePattern = /^[a-zA-Z0-9._-]{3,20}$/;

function errorMessage(error) {
  const messages = {
    'auth/email-already-in-use': '이미 가입된 이메일입니다.',
    'auth/invalid-email': '이메일 주소를 확인해주세요.',
    'auth/invalid-credential': '이메일 또는 비밀번호가 올바르지 않습니다.',
    'auth/weak-password': '비밀번호는 6자 이상 입력해주세요.',
    'auth/username-already-in-use': '이미 사용 중인 아이디입니다.',
    'auth/username-reserved': '관리자 아이디는 가입할 수 없습니다.',
    'permission-denied': 'Firebase 보안 규칙을 확인해주세요.',
    'auth/network-request-failed': '네트워크 연결을 확인해주세요.',
    'auth/too-many-requests': '요청이 많습니다. 잠시 후 다시 시도해주세요.',
  };
  return messages[error.code] || '요청을 처리하지 못했습니다. 입력값과 Firebase 설정을 확인해주세요.';
}

function bindLoginForm() {
  const form = document.querySelector('[data-login-form]');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const button = form.querySelector('[type="submit"]');
    const errorEl = form.querySelector('[data-form-error]');
    button.disabled = true;
    errorEl.hidden = true;
    try {
      const data = new FormData(form);
      const credential = await authService.signIn(data.get('email'), data.get('password'));
      const session = await authService.getSession(credential.user);
      const requestedReturn = new URLSearchParams(location.search).get('return') || '';
      const isWriteRoute = /^#\/(write|edit\/[^/?#]+)$/.test(requestedReturn);
      const qnaDestination = /^qna\.html#\/(write|edit\/[^/?#]+)$/.test(requestedReturn);
      const destination = qnaDestination
        ? `qna.html${requestedReturn.slice('qna.html'.length)}`
        : `notice.html${session.isAdmin && isWriteRoute ? requestedReturn : '#/'}`;
      location.href = destination;
    } catch (error) {
      errorEl.textContent = errorMessage(error);
      errorEl.hidden = false;
    } finally {
      button.disabled = false;
    }
  });
}

function bindSignupForm() {
  const form = document.querySelector('[data-signup-form]');
  const usernameInput = form.elements.username;
  const usernameStatus = form.querySelector('[data-username-status]');
  const checkButton = form.querySelector('[data-check-username]');
  let checkedUsername = '';

  usernameInput.addEventListener('input', () => {
    checkedUsername = '';
    usernameStatus.textContent = '';
    delete usernameStatus.dataset.available;
  });

  checkButton.addEventListener('click', async () => {
    const username = usernameInput.value.trim().toLowerCase();
    if (!usernamePattern.test(username)) {
      usernameInput.setCustomValidity('아이디 형식을 확인해주세요.');
      usernameInput.reportValidity();
      usernameInput.setCustomValidity('');
      return;
    }

    checkButton.disabled = true;
    try {
      const available = await authService.isUsernameAvailable(username);
      if (usernameInput.value.trim().toLowerCase() !== username) return;
      checkedUsername = available ? username : '';
      usernameStatus.textContent = available ? '사용할 수 있는 아이디입니다.' : '이미 사용 중이거나 사용할 수 없는 아이디입니다.';
      usernameStatus.dataset.available = String(available);
    } catch (error) {
      usernameStatus.textContent = errorMessage(error);
      usernameStatus.dataset.available = 'false';
    } finally {
      checkButton.disabled = false;
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const username = usernameInput.value.trim().toLowerCase();
    if (checkedUsername !== username) {
      usernameStatus.textContent = '가입 전에 아이디 중복 확인을 해주세요.';
      usernameStatus.dataset.available = 'false';
      checkButton.focus();
      return;
    }

    const button = form.querySelector('[type="submit"]');
    const errorEl = form.querySelector('[data-form-error]');
    button.disabled = true;
    errorEl.hidden = true;
    try {
      const data = new FormData(form);
      await authService.register({
        name: data.get('name'),
        username,
        password: data.get('password'),
        email: data.get('email'),
      });
      location.href = 'notice.html#/';
    } catch (error) {
      errorEl.textContent = errorMessage(error);
      errorEl.hidden = false;
      button.disabled = false;
    }
  });
}

if (document.body.dataset.authPage === 'signup') bindSignupForm();
else bindLoginForm();