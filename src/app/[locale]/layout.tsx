import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { AppContextProvider } from "@/contexts/app";
import { Metadata } from "next";
import { NextAuthSessionProvider } from "@/auth/session";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@/providers/theme";

// 详细注释：generateMetadata 和组件 props 的参数类型应为 { params: Promise<{ locale: string }> } 在 Next.js 15 中。
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  return {
    title: {
      template: `%s`,
      default: t("metadata.title") || "",
    },
    description: t("metadata.description") || "",
    keywords: t("metadata.keywords") || "",
  };
}

export default async function LocaleLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();
  
  // Check if authentication is enabled
  const isAuthEnabled = process.env.NEXT_PUBLIC_AUTH_ENABLED === "true";
  
  return (
    <NextIntlClientProvider messages={messages}>
      {isAuthEnabled ? (
        <NextAuthSessionProvider>
          <AppContextProvider>
            <ThemeProvider attribute="class" disableTransitionOnChange>
              {children}
            </ThemeProvider>
          </AppContextProvider>
        </NextAuthSessionProvider>
      ) : (
        <AppContextProvider>
          <ThemeProvider attribute="class" disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </AppContextProvider>
      )}
    </NextIntlClientProvider>
  );
}
