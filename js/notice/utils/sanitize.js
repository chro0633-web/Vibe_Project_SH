/** 리치텍스트 HTML 허용 목록 기반 sanitizer (Firebase 전환 후에도 그대로 사용) */
const ALLOWED = {
  P: [], BR: [], DIV: [], SPAN: [], B: [], STRONG: [], I: [], EM: [], U: [],
  UL: [], OL: [], LI: [], A: ["href", "target", "rel"], IMG: ["data-file-id", "alt", "src"],
};
const SAFE_HREF = /^(https?:|mailto:|tel:)/i;

export function sanitizeHtml(html = "") {
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, "text/html");
  const walk = (node) => {
    [...node.children].forEach((el) => {
      const allow = ALLOWED[el.tagName];
      if (!allow) {
        if (["SCRIPT", "STYLE", "IFRAME", "OBJECT", "EMBED"].includes(el.tagName)) el.remove();
        else { walk(el); el.replaceWith(...el.childNodes); }
        return;
      }
      [...el.attributes].forEach((a) => { if (!allow.includes(a.name)) el.removeAttribute(a.name); });
      if (el.tagName === "A") {
        if (!SAFE_HREF.test(el.getAttribute("href") || "")) el.removeAttribute("href");
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener noreferrer");
      }
      if (el.tagName === "IMG") {
        if (!el.dataset.fileId) { el.remove(); return; }   // 파일 ID 없는 외부 이미지 차단
        const src = el.getAttribute("src") || "";
        if (!src.startsWith("data:image/") && !src.startsWith("https://")) el.removeAttribute("src");
      }
      walk(el);
    });
  };
  walk(doc.body);
  return doc.body.innerHTML;
}

/** 저장용 변환: 이미지 src 제거(파일 데이터는 별도 보관) + 이미지 ID 추출 */
export function serializeContent(html) {
  const clean = sanitizeHtml(html);
  const doc = new DOMParser().parseFromString(`<body>${clean}</body>`, "text/html");
  const imageIds = [];
  doc.querySelectorAll("img[data-file-id]").forEach((img) => {
    imageIds.push(img.dataset.fileId);
    img.removeAttribute("src");
  });
  return { content: doc.body.innerHTML, imageIds: [...new Set(imageIds)] };
}

export const isEmptyContent = (html) => {
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, "text/html");
  return !doc.body.textContent.trim() && !doc.body.querySelector("img");
};
