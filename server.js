import { makeFetch } from "https://code4fukui.github.io/PubkeyUser/serverutil.js";
import { Posts } from "./Posts.js";
import { JSONLWriter } from "https://code4fukui.github.io/JSONL/JSONLWriter.js";
import { DateTime, TimeZone } from "https://js.sabae.cc/DateTime.js";

const posts = await Posts.create();

const logdir = "log";

const log = async (pubkey, path, param, req, conn) => {
  const ua = req.headers.get("user-agent");
  const dt = new DateTime();
  const ymd = dt.toLocal(TimeZone.JST).day.toStringYMD();
  const w = new JSONLWriter(logdir + "/" + ymd + ".jsonl", true);
  await w.writeRecord({ pubkey, path, param, ua });
  w.close();
};

const api = async (path, param, pubkey, req, conn) => {
  //console.log("api", path, path == "add", param, pubkey)
  log(pubkey, path, param, req, conn);
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
