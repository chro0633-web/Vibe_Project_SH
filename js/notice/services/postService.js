/**
 * ★ 데이터 소스 전환 지점 (마이그레이션 시 이 파일만 수정) ★
 * UI는 오직 이 파일의 postService만 import 한다.
 *
 * [현재] LocalStorage Mock
 */
export { postMockService as postService } from './mock/postMockService.js';

// [Firebase Firestore 전환 시]
// export { postFirebaseService as postService } from './firebase/postFirebaseService.js';
