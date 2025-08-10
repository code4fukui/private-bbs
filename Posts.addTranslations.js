import { Posts } from "./Posts.js";
import { addTranslations } from "./addTranslations.js";

const posts = await Posts.create();

const latest = await posts.getLatest();
for (const item of latest) {
  if (item.data.translations) continue;
  await addTranslations(item);
  console.log(item);
  await posts.savePost(item);
}
//console.log(latest);
