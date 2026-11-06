import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { doc, getDoc, runTransaction } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { auth, db } from './firebase/firebaseConfig.js';

const usernameRef = (username) => doc(db, 'usernames', username.toLowerCase());

async function getSession(user) {
  if (!user) return { user: null, profile: null, isAdmin: false };

  const profileSnapshot = await getDoc(doc(db, 'users', user.uid));
  const profile = profileSnapshot.exists()
    ? profileSnapshot.data()
    : { name: user.displayName || '사용자', role: 'user' };

  return {
    user,
    profile,
    isAdmin: profile.role === 'admin',
  };
}

export const authService = {
  getSession: (user = auth.currentUser) => getSession(user),

  isUsernameAvailable: async (username) => {
    const normalized = username.trim().toLowerCase();
    if (!normalized || normalized === 'admin') return false;
    return !(await getDoc(usernameRef(normalized))).exists();
  },

  async register({ name, username, email, password }) {
    const normalized = username.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();
    if (normalized === 'admin') {
      const error = new Error('관리자 아이디는 가입할 수 없습니다.');
      error.code = 'auth/username-reserved';
      throw error;
    }

    const credential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
    try {
      await updateProfile(credential.user, { displayName: name.trim() });
      await runTransaction(db, async (transaction) => {
        const indexRef = usernameRef(normalized);
        const indexSnapshot = await transaction.get(indexRef);
        if (indexSnapshot.exists()) {
          const error = new Error('이미 사용 중인 아이디입니다.');
          error.code = 'auth/username-already-in-use';
          throw error;
        }

        transaction.set(indexRef, { uid: credential.user.uid });
        transaction.set(doc(db, 'users', credential.user.uid), {
          name: name.trim(),
          username: normalized,
          email: normalizedEmail,
          createdAt: new Date().toISOString(),
          role: 'user',
        });
      });
      return credential.user;
    } catch (error) {
      await deleteUser(credential.user).catch(() => {});
      throw error;
    }
  },

  signIn: (email, password) => signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password),
  signOut: () => signOut(auth),
  subscribe(onChange, onError) {
    return onAuthStateChanged(auth, async (user) => {
      try {
        onChange(await getSession(user));
      } catch (error) {
        onError?.(error);
        onChange({ user, profile: { name: user?.displayName || '사용자', role: 'user' }, isAdmin: false });
      }
    }, onError);
  },
};