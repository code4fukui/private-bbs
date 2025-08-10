const langs = ["ja", "mn", "en"];

export const detectLanguage = (text) => {
  // デフォルトはブラウザ設定
  let defaultLang = navigator.language || navigator.userLanguage || "en";
  defaultLang = defaultLang.split('-')[0]; // "ja-JP" → "ja"
  if (!langs.includes(defaultLang)) {
    defaultLang = "en"; // 対応言語以外のときは英語
  }

  const cleanText = text.trim();
  if (!cleanText) return defaultLang;

  // モンゴル語（キリル文字範囲: \u0400-\u04FF）
  const mongolianMatch = cleanText.match(/[\u0400-\u04FF]/g);
  // 日本語（ひらがな \u3040-\u309F, カタカナ \u30A0-\u30FF, 漢字 \u4E00-\u9FFF）
  const japaneseMatch = cleanText.match(/[\u3040-\u30FF\u4E00-\u9FFF]/g);
  // 英語（A-Z / a-z）
  const englishMatch = cleanText.match(/[A-Za-z]/g);

  // 数で比較
  const counts = {
    mn: mongolianMatch ? mongolianMatch.length : 0,
    ja: japaneseMatch ? japaneseMatch.length : 0,
    en: englishMatch ? englishMatch.length : 0
  };

  const maxCount = Math.max(counts.mn, counts.ja, counts.en);

  if (maxCount === 0) {
    return defaultLang; // 判定できない場合はデフォルト
  } else if (maxCount === counts.mn) {
    return "mn";
  } else if (maxCount === counts.ja) {
    return "ja";
  } else {
    return "en";
  }
};

if (import.meta.main) {
  // 使用例
  console.log(detectLanguage("こんにちは")); // "ja"
  console.log(detectLanguage("Сайн байна уу")); // "mn"
  console.log(detectLanguage("Hello world")); // "en"
} 
