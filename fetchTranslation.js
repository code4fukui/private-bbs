import { fetchConversation } from "https://code4fukui.github.io/ai_chat/fetchConversation.js";

const langmap = {
  "ja": "日本語",
  "en": "英語",
  "mn": "モンゴル語",
};

export const fetchTranslation = async (from, fromlang, tolangs = null) => { // "はろー", "ja", ["mn", "en"]
  if (!tolangs) {
    tolangs = Object.keys(langmap).filter(i => i != fromlang);
  }
  const sfromlang = langmap[fromlang];
  const stolangs = tolangs.map(i => langmap[i]);
  if (Object.values(stolangs).includes(undefined)) throw new Error("対応言語 " + Object.keys(langmap) + " 以外がありました");
  const stolangs2 = tolangs.map(i => `${i} には自然な${langmap[i]}`);
  const tolangs2 = tolangs.map(i => `${i}: "…"`);
  // mn には発音のカタカナは含めず、キリル文字だけで記載してください。
  const messages = [
    { "role": "system", "content": `あなたは${sfromlang}→${stolangs.join("・")}の翻訳者です。
入力として与えられた${sfromlang}の文字列をもとに、${stolangs2.join("、")}を正確に翻訳して埋めてください。
出力形式は { ${tolangs2.join(", ")} } のJSONのみとし、余分な説明や改行は加えないでください。`
    },
    { "role": "user", "content": from },
  ];
  console.log(messages);
  const model = "gpt-5";
  const res = await fetchConversation({ messages, model });
  try {
    return JSON.parse(res);
  } catch (e) {
    console.log(e, res);
    return null;
  }
};

if (import.meta.main) {
  //const res = await fetchTranslation("ありがとう", "ja", ["mn", "en"]);
  const res = await fetchTranslation("どういたしまして", "ja"); // default other langs
  //const res2 = await fetchTranslation("はろー", "ja", ["mn", "en", "fr"]); // err
  console.log(res);
}
