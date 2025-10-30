import { makeFetch } from "https://code4fukui.github.io/PubkeyUser/serverutil.js";
import { Posts } from "./Posts.js";
import { JSONLWriter } from "https://code4fukui.github.io/JSONL/JSONLWriter.js";
import { DateTime, TimeZone } from "https://js.sabae.cc/DateTime.js";
import { subscribe, unsubscribe, pushAll } from "https://code4fukui.github.io/tsuchichat/webpushutil.js";
import { UserManager } from "https://code4fukui.github.io/UserManager/UserManager.js";

const uman = await UserManager.create();

const settings = JSON.parse(await Deno.readTextFile("./static/settings.json"));
const title = settings.title;
const icon = settings.icon;
const url = settings.url;

const server_settings = JSON.parse(await Deno.readTextFile("./server_settings.json"));
const admin_pubkey = server_settings.admin_pubkey;

const posts = await Posts.create();

const logdir = "log";
await Deno.mkdir(logdir, { recursive: true });

const log = async (pubkey, path, param, req, conn) => {
  const ua = req?.headers.get("user-agent") || "";
  const dt = new DateTime();
  const ymd = dt.toLocal(TimeZone.JST).day.toStringYMD();
  const w = new JSONLWriter(logdir + "/" + ymd + ".jsonl", true);
  await w.writeRecord({ pubkey, path, param, ua });
  w.close();
};

const sendNotify = async (uuid, text, room) => {
  if (!uuid) return;
  const data = {
    title: room ? room + " - " + title : title,
    body: text,
    icon,
    data: { url: url + "#" + encodeURIComponent(room) },
    //timeout: 5000, // 通知を消すまでの長さ msec （デフォルト0:消さない）
    //delay: 1000, // 表示するまでの時間 msec（デフォルト0）
  };
  await pushAll(uuid, data);
};

const api = async (path, param, pubkey, req, conn) => {
  //console.log("api", path, path == "add", param, pubkey)
  log(pubkey, path, param, req, conn);
  if (!pubkey) return "no pubkey";
  
  // UserManager admin
  console.log(pubkey)
  if (pubkey == admin_pubkey) {
    if (path == "user_requestusers") {
      return await uman.getRequestUsers();
    } else if (path == "user_allowedusers") {
      return await uman.getAllowedUsers();
    } else {
      try {
        if (path == "user_allow") {
          await uman.allow(param.pubkey);
          return { result: "ok" };
        } else if (path == "user_reject") {
          await uman.reject(param.pubkey);
          return { result: "ok" };
        } else if (path == "user_remove") {
          await uman.remove(param.pubkey);
          return { result: "ok" };
        }
      } catch (e) {
        console.log(e)
        return { result: e.toString() };
      }
    }
  }

  // UserManager
  if (!await uman.isAllowed(pubkey)) {
    console.log("not allowed")
    if (path == "user_add") {
      if (!param.name || !param.secret) {
        return { error: "no name or secret" };
      }
      console.log(param);
      await uman.add(pubkey, param.name, param.secret);
      return { result: "ok" };
    }
    return { error: "not allowed" };
  }
  console.log("allowed");

  if (path == "add") {
    const post = param;
    const res = await posts.add(post);
    if (param.data.action != "remove" && param.data.action != "like") {
      sendNotify(param.data.uuid, param.data.body, param.data.room);
    }
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
