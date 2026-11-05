import { IMAGE_MAX_DIMENSION } from "../config.js";

/** 큰 이미지를 리사이즈해 저장 용량을 줄인다 (localStorage 한도 대응, Storage 이관 후에도 유효) */
export async function compressImage(file) {
  if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") return file;
  const bmp = await createImageBitmap(file);
  const ratio = Math.min(1, IMAGE_MAX_DIMENSION / Math.max(bmp.width, bmp.height));
  if (ratio === 1 && file.size < 500 * 1024) return file;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * ratio);
  canvas.height = Math.round(bmp.height * ratio);
  canvas.getContext("2d").drawImage(bmp, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.85));
  return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
}
