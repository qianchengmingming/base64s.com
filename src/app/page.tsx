"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const LOCALE_KEY = "preferred_locale";
const SUPPORTED_LOCALES = ["en", "zh"];

export default function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      let locale = localStorage.getItem(LOCALE_KEY);
      if (!locale) {
        const lang = navigator.language || (navigator.languages && navigator.languages[0]) || "en";
        if (lang.startsWith("zh")) {
          locale = "zh";
        } else {
          locale = "en";
        }
        localStorage.setItem(LOCALE_KEY, locale);
      }
      // 兜底：如果缓存/检测到的 locale 不在支持列表，默认 en
      if (!SUPPORTED_LOCALES.includes(locale)) {
        locale = "en";
        localStorage.setItem(LOCALE_KEY, locale);
      }
      router.replace(`/${locale}/home`);
    }
  }, [router]);

  return null;
} 