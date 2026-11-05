/**
 * ★ 데이터 소스 전환 지점 (파일/이미지 저장소) ★
 * [현재] LocalStorage(Base64) Mock  →  [전환] Firebase Storage
 *
 * 인터페이스
 *   upload(file: File)        → Promise<FileMeta>
 *   getUrl(fileId: string)    → Promise<string | null>   // 표시/다운로드용 URL
 *   remove(fileId: string)    → Promise<void>
 *   removeMany(ids: string[]) → Promise<void>
 */
export { fileMockService as fileService } from './mock/fileMockService.js';

// export { fileFirebaseService as fileService } from './firebase/fileFirebaseService.js';
