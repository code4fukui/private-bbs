import { Posts } from "./Posts.js";
import { addTranslations } from "./addTranslations.js";

const posts = await Posts.create();

const latest = await posts.getLatest();
for (const item of latest) {
  if (item.data.lang == "en") {
    item.data.lang = "ja"; 
    console.log(item);
    await addTranslations(item);
    await posts.savePost(item);
  }
}
//console.log(latest);
