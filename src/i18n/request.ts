import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  if (["zh-CN"].includes(locale)) {
    locale = "zh";
  }

  if (!routing.locales.includes(locale as any)) {
    locale = "en";
  }

  try {
    const messages = (await import(`./messages/${locale.toLowerCase()}.json`)).default;
    // 加载 home 页面语言包
    let homeMessages = {};
    try {
      homeMessages = (await import(`./pages/home/${locale.toLowerCase()}.json`)).default;
    } catch (e) {}
    // 合并 home 到 messages
    return {
      locale: locale,
      messages: {
        ...messages,
        home: homeMessages
      }
    };
  } catch (e) {
    return {
      locale: "en",
      messages: (await import(`./messages/en.json`)).default,
    };
  }
});
