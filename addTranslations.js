import { fetchTranslation } from "./fetchTranslation.js";

export const addTranslations = async (post) => {
  const res = await fetchTranslation(post.data.body, post.data.lang);
  post.data.translations = res;
  return res;
};
