import { makeFetch } from "https://code4fukui.github.io/PubkeyUser/serverutil.js";
import { TAI64N } from "https://code4fukui.github.io/TAI64N-es/TAI64N.js";
import { Posts } from "./Posts.js";

const posts = await Posts.create();

const api = async (path, param, pubkey) => {
  console.log("api", path, path == "add", param, pubkey)
  if (!pubkey) return "no pubkey";
  if (path == "add") {
    console.log("add", path)
    const post = param;
    const res = await posts.add(post);
    console.log("res", res);
    return res;
  } else if (path == "get") {
    const p2 = await posts.get(id);
    return p2;
  } else if (path == "getLatest") {
    const lastdt = param;
    console.log(lastdt);
    const latest = await posts.getLatest(lastdt);
    return latest;
  } else {
    console.log("path", path)
    return "not found";
  }
};

export default { fetch: makeFetch(api) };
