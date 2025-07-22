import { NextRequest, NextResponse } from 'next/server';

const SUPPORTED_LOCALES = ['en', 'zh'];
const DEFAULT_LOCALE = 'en';
const LOCALE_KEY = 'preferred_locale';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 只处理根路径 /
  if (pathname === '/') {
    // 1. 优先 cookie
    const cookieLocale = request.cookies.get(LOCALE_KEY)?.value;
    if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
      return NextResponse.redirect(new URL(`/${cookieLocale}/home`, request.url));
    }
    // 2. 检查 localStorage（通过自定义 header 传递，客户端可配合 fetch 预请求设置 header）
    const localStorageLocale = request.headers.get('x-preferred-locale');
    if (localStorageLocale && SUPPORTED_LOCALES.includes(localStorageLocale)) {
      return NextResponse.redirect(new URL(`/${localStorageLocale}/home`, request.url));
    }
    // 3. 读取 Accept-Language
    const acceptLang = request.headers.get('accept-language') || '';
    let detectedLocale = DEFAULT_LOCALE;
    if (acceptLang.startsWith('zh')) {
      detectedLocale = 'zh';
    } else if (acceptLang.startsWith('en')) {
      detectedLocale = 'en';
    }
    return NextResponse.redirect(new URL(`/${detectedLocale}/home`, request.url));
  }
  // 其他路径不处理
  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
