import { Gmailer } from "https://code4fukui.github.io/Gmailer/Gmailer.js";
import "https://deno.land/std@0.224.0/dotenv/load.ts"; // ?

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

const mail = Deno.args[0];
if (!mail) {
  throw new Error("no mail arg");
}
await sendmail({ mail, name: "test", uuid: "test" });
