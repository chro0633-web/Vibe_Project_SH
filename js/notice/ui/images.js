import { fileService } from '../services/fileService.js';

/** <img data-file-id> 의 src를 파일 서비스에서 받아 채운다 (저장 시에는 src를 저장하지 않음) */
export async function hydrateImages(root) {
  await Promise.all(
    [...root.querySelectorAll('img[data-file-id]')].map(async (img) => {
      const url = await fileService.getUrl(img.dataset.fileId);
      if (url) img.src = url;
      else img.alt = img.alt || '이미지를 불러올 수 없습니다';
    }),
  );
}
