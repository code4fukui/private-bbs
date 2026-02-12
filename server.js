import { makeFetch } from "https://code4fukui.github.io/PubkeyUser/serverutil.js";
import { Posts } from "./Posts.js";
import { FileStorage } from "https://code4fukui.github.io/FileStorage/FileStorage.js";
import { TID } from "https://code4fukui.github.io/TID/TID.js";
import { UUID } from "https://code4fukui.github.io/UUID/UUID.js";
import { isValidEmail} from "https://code4fukui.github.io/validator/isValidEmail.js";
import { Gmailer } from "https://code4fukui.github.io/Gmailer/Gmailer.js";
import "https://deno.land/std@0.224.0/dotenv/load.ts"; // ?
import { DateTime } from "https://js.sabae.cc/DateTime.js";
import { IDChecker } from "https://code4fukui.github.io/IDChecker/IDChecker.js";

const idchecker = new IDChecker(Deno.env.get("ALLOWED_MAILADDRESS").split(","));

const posts = await Posts.create();

const gmailc = Deno.env.get("GMAIL_ID_PASS").split("/");
const mailer = new Gmailer(gmailc[0], gmailc[1]);
const sendmail = async (param) => {
  //const url = "http://localhost:7001/?mail=" + param.mail + "&uuid=" + param.uuid;
  const url = "https://try.sabae.cc/?mail=" + param.mail + "&uuid=" + param.uuid;
  const body = `${param.name}さま

こんにちは、鯖江商工会議所です。
この度は企業の課題解決コンテストへご登録ありがとうございます。

こちらのURLからアクセスしてください。
${url}
※ このURLを他人に共有しないでください。
`;
  await mailer.mail(param.mail, "鯖江商工会議所 企業の課題解決コンテスト", body);
};

const fs = new FileStorage("./data");

const api = async (path, param, pubkey) => {
  //console.log("api", path, path == "add", param, pubkey)
  if (!pubkey) return "no pubkey";
  if (path == "add") {
    const o = await fs.loadJSON("sabae/pubkey/" + pubkey + ".json");
    if (!o) return "not user";
    //console.log("add", path)
    if (!param.parent && o.mail.indexOf("@fukui-nct") >= 0) {
      return "学生は困りごとを投稿できません";
    }
    const post = param;
    post.data.name = o.name;
    //console.log(post);
    const res = await posts.add(post);
    //console.log("res", res);
    return res ? "ok" : "ng"; // res;
  } else if (path == "get") {
    const o = await fs.loadJSON("sabae/pubkey/" + pubkey + ".json");
    if (!o) return "not user";
    const p2 = await posts.get(id);
    return p2;
  } else if (path == "getLatest") {
    const o = await fs.loadJSON("sabae/pubkey/" + pubkey + ".json");
    if (!o) return "not user";
    const lastdt = param;
    //console.log(lastdt);
    const latest = await posts.getLatest(lastdt);
    return latest;
  } else if (path == "regist") {
    const mail = param.mail;
    if (!isValidEmail(mail)) return;
    if (!idchecker.check(mail)) {
      return "福井高専メールアドレス以外ではご登録いただけません";
    }
    console.log("regist", param);
    param.tid = TID.create();
    param.uuid = UUID.create();
    param.dt = new DateTime().toString();
    await fs.saveJSON("sabae/user/" + param.mail + ".json", param);
    await sendmail(param);
    return "ok"; //param.tid;
  } else if (path == "login") {
    console.log("login", param, pubkey);
    const o = await fs.loadJSON("sabae/user/" + param.mail + ".json");
    if (o.uuid != param.uuid) return "wrong uuid";
    await fs.saveJSON("sabae/pubkey/" + pubkey + ".json", o);
    return true;
  } else {
    console.log("path", path)
    return "not found";
  }
};

export default { fetch: makeFetch(api) };
