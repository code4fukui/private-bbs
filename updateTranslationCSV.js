import { CSV } from "https://js.sabae.cc/CSV.js";
import { fetchTranslation } from "./fetchTranslation.js";

const fn = "static/translation.csv";
const data = await CSV.fetchJSON(fn);
for (const item of data) {
  if (item.mn && item.en) continue;
  const res = await fetchTranslation(item.ja, "ja");
  item.mn = res.mn;
  item.en = res.en;
  console.log(item);
}
await Deno.writeTextFile(fn, CSV.stringify(data));
