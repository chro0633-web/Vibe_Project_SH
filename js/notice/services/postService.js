/**
 * 게시글은 Firestore에 저장하고 첨부파일 데이터는 fileService의 LocalStorage를 사용한다.
 */
export { postFirebaseService as postService } from './firebase/postFirebaseService.js';
