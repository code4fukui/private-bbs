import { splitLinks } from "./splitLinks.js";
import { escapeHTML } from "./escapeHTML.js";

export const makeTextWithLink = (text) => {
  const ss = splitLinks(text);
  const res = ss.map(i => {
    if (i.startsWith("https://") || i.startsWith("http://")) {
      return `<a href="${i}" rel="noreferrer">${i}</a>`;
    } else {
      return escapeHTML(i);
    }
  });
  return res.join("");
};
