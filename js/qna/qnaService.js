import {
  collection, doc, getDoc, getDocs, updateDoc, writeBatch, increment,
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { db } from '../notice/services/firebase/firebaseConfig.js';

const COLLECTION = 'qna';
const CONTENTS = 'qnaContents';
const CATEGORIES = ['일반', '디자인', '바이브 코딩', '기타'];
const toQuestion = (snapshot) => ({ id: snapshot.id, ...snapshot.data() });

export const qnaService = {
  async list() {
    const snapshot = await getDocs(collection(db, COLLECTION));
    return snapshot.docs.map(toQuestion).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async getById(id) {
    const questionRef = doc(db, COLLECTION, id);
    const [questionSnapshot, contentSnapshot] = await Promise.all([
      getDoc(questionRef),
      getDoc(doc(db, CONTENTS, id)),
    ]);
    if (!questionSnapshot.exists()) return null;
    if (!contentSnapshot.exists()) throw new Error('질문 내용을 찾을 수 없습니다.');
    return { ...toQuestion(questionSnapshot), ...contentSnapshot.data() };
  },

  async create({ title, content, category, isPublic, author }) {
    if (!CATEGORIES.includes(category)) throw new Error('질문 유형을 선택해주세요.');
    const questionRef = doc(collection(db, COLLECTION));
    const contentRef = doc(db, CONTENTS, questionRef.id);
    const now = new Date().toISOString();
    const question = {
      title, category, isPublic, author, isAnswered: false, answeredAt: null, viewCount: 0,
      createdAt: now, updatedAt: now,
    };
    const batch = writeBatch(db);
    batch.set(questionRef, question);
    batch.set(contentRef, { content, answer: null });
    await batch.commit();
    return { id: questionRef.id, ...question, content, answer: null };
  },

  async update(id, { title, content, category, isPublic }) {
    if (!CATEGORIES.includes(category)) throw new Error('질문 유형을 선택해주세요.');
    const batch = writeBatch(db);
    batch.update(doc(db, COLLECTION, id), {
      title, category, isPublic, updatedAt: new Date().toISOString(),
    });
    batch.update(doc(db, CONTENTS, id), { content });
    await batch.commit();
    return this.getById(id);
  },

  async delete(id) {
    const batch = writeBatch(db);
    batch.delete(doc(db, COLLECTION, id));
    batch.delete(doc(db, CONTENTS, id));
    await batch.commit();
  },

  async answer(id, { content, author }) {
    const now = new Date().toISOString();
    const batch = writeBatch(db);
    batch.update(doc(db, COLLECTION, id), { isAnswered: true, answeredAt: now });
    batch.update(doc(db, CONTENTS, id), {
      answer: { content, authorId: author.id, authorName: author.name, createdAt: now },
    });
    await batch.commit();
  },

  async increaseViewCount(id) {
    await updateDoc(doc(db, COLLECTION, id), { viewCount: increment(1) });
  },
};
