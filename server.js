import { makeFetch } from "https://code4fukui.github.io/PubkeyUser/serverutil.js";
import { Posts } from "./Posts.js";
import { JSONLWriter } from "https://code4fukui.github.io/JSONL/JSONLWriter.js";
import { DateTime, TimeZone } from "https://js.sabae.cc/DateTime.js";
import { subscribe, unsubscribe, pushAll } from "https://code4fukui.github.io/tsuchichat/webpushutil.js";

const settings = JSON.parse(await Deno.readTextFile("./static/settings.json"));
const title = settings.title;

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

const sendNotify = async (uuid, text) => {
  if (!uuid) return;
  const data = {
    title,
    body: text,
    //timeout: 5000, // 通知を消すまでの長さ msec （デフォルト0:消さない）
    //delay: 1000, // 表示するまでの時間 msec（デフォルト0）
  };
  await pushAll(uuid, data);
};

const api = async (path, param, pubkey, req, conn) => {
  //console.log("api", path, path == "add", param, pubkey)
  log(pubkey, path, param, req, conn);
  if (!pubkey) return "no pubkey";
  if (path == "add") {
    const post = param;
    const res = await posts.add(post);
    sendNotify(param.data.uuid, param.data.body);
    return res;
  } else if (path == "get") {
    const p2 = await posts.get(id);
    return p2;
  } else if (path == "getLatest") {
    const lastdt = param;
    const latest = await posts.getLatest(lastdt);
    return latest;
  } else if (path == "subscribe") {
    return subscribe(param);
  } else if (path == "unsubscribe") {
    return unsubscribe(param);
    /*
  } else if (path == "push") {
    const uuid = param.uuid;
    const data = param.data;
    return pushAll(uuid, data);
    */
  } else {
    console.log("path", path)
    return "not found";
  }
};

export default { fetch: makeFetch(api) };
