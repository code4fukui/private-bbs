import { Posts } from "./Posts.js";

const posts = await Posts.create();

const latest = await posts.getLatest();
console.log(latest);
