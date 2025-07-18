import { Pathnames } from "next-intl/routing";

export const locales = [
  "en",    // 英语
  "zh",    // 简体中文
  // "ko",    // 韩语
  // "ja",    // 日语
  // "ru",    // 俄语
  // "fr",    // 法语
  // "de",    // 德语
  // "it",    // 意大利语
  // "pt",    // 葡萄牙语
  // "es",    // 西班牙语
  // "zh-Hant", // 繁体中文
  // "ar"     // 阿拉伯语
];

export const localeNames: any = {
  en: "English",
  zh: "简体中文",
  // ko: "한국어",
  // ja: "日本語",
  // ru: "Русский",
  // fr: "Français",
  // de: "Deutsch",
  // it: "Italiano",
  // pt: "Português",
  // es: "Español",
  // "zh-Hant": "繁體中文",
  // ar: "العربية"
};

export const defaultLocale = "en";

export const localePrefix = "as-needed";

export const localeDetection =
  process.env.NEXT_PUBLIC_LOCALE_DETECTION === "true";
