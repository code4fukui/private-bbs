import { CSV } from "https://js.sabae.cc/CSV.js";
import { getLanguage } from "https://code4fukui.github.io/i18n/getLanguage.js"; // query lang

let flginit = false;
let data = null;

const initTranslation = async () => {
	if (flginit) return;
	flginit = true;
  // ja,mn,en
	data = await CSV.fetchJSON("translation.csv");
	
	const txts = document.querySelectorAll(".text");
	txts.forEach(i => {
		i.flgplaceholder = !!i.placeholder;
		const ja = i.textContent || i.placeholder;
		if (!ja) return;
		const item = data.find(i => i.ja == ja);
		if (item) {
			i.translations = item;
		}
	});
};

export const translate = (ja, lang) => {
	const item = data.find(i => i.ja == ja);
	if (!item || !item[lang]) return ja;
	return item[lang];
};

export const changeLanguage = async (lang = null) => {
	if (!flginit) {
		await initTranslation();
	}
  if (!lang) {
    lang = getLanguage();
  }
	const txts = document.querySelectorAll(".text");
	txts.forEach(i => {
		if (!i.translations) return;
		const txt = i.translations[lang];
		if (!txt) return;
		if (i.flgplaceholder) {
			i.placeholder = txt;
		} else {
			i.textContent = txt;
		}
	});
};
