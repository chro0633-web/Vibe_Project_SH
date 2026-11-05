/**
 * 데이터 모델 정의 (JSDoc). TypeScript 전환 시 interface로 그대로 옮기면 된다.
 * - 모든 ID는 문자열 (crypto.randomUUID / Firestore doc.id)
 * - 모든 날짜는 ISO 8601 문자열
 * - 파일 "메타데이터"는 Post 문서에 임베딩, 파일 "데이터"는 fileService가 별도 보관
 *
 * @typedef {Object} FileMeta            // Firestore: Post.attachments[] 에 임베딩
 * @property {string} id                 // Storage 경로: notice/{id}
 * @property {string} name               // 원본 파일명
 * @property {number} size               // bytes
 * @property {string} mimeType
 * @property {string} createdAt          // ISO 8601
 *
 * @typedef {Object} Post                // Firestore: notices/{id}
 * @property {string} id
 * @property {string} title
 * @property {string} category           // CATEGORIES 중 하나
 * @property {string} content            // sanitize된 HTML. 이미지는 <img data-file-id="..."> (src 미저장)
 * @property {string[]} imageIds         // content 내 이미지 파일 ID (정리/삭제용)
 * @property {FileMeta[]} attachments
 * @property {{id:string, name:string}} author   // 비정규화
 * @property {boolean} isPublic          // 노출 여부
 * @property {number} viewCount
 * @property {string} createdAt
 * @property {string} updatedAt
 *
 * @typedef {Omit<Post,"id"|"viewCount"|"createdAt"|"updatedAt">} CreatePostDto
 * @typedef {Partial<CreatePostDto>} UpdatePostDto
 *
 * @typedef {Object} ListResult
 * @property {Post[]} items @property {number} total @property {number} page @property {number} pageSize
 */
export {};
