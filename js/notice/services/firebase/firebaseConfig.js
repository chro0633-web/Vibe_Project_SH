// 번들러 없이 Firebase CDN ESM을 사용한다.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';

const firebaseConfig = {
  apiKey: 'AIzaSyAzgHNnNhw5UyDNZy7dWDfcVz6iaHG_K7Y',
  authDomain: 'sh-web-project.firebaseapp.com',
  projectId: 'sh-web-project',
  storageBucket: 'sh-web-project.firebasestorage.app',
  messagingSenderId: '624989086698',
  appId: '1:624989086698:web:6e6c446df61a274a7a4893',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
