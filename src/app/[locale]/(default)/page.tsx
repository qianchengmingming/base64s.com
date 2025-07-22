import Base64Code from "@/components/home/base64code";
import { useTranslations } from 'next-intl';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) : Promise<Metadata> {
  // 多语言SEO元信息
  const { locale } = await params;
  let title = 'Base64 Online Encode & Decode - Base64s.com';
  let description = 'Base64s.com is the best online tool for Base64 encoding and decoding. Supports password obfuscation, auto copy, and more.';
  let keywords = 'base64, encode, decode, online, tool, base64s, password, encryption, 解码, 编码, 在线, 工具';
  if (locale === 'zh') {
    title = 'Base64在线编码解码 - Base64s.com';
    description = 'Base64s.com是最好用的Base64在线编码解码工具，支持密码混淆、自动复制等功能。';
    keywords = 'base64, base64编码, base64解码, 在线, 工具, base64s, 密码, 加密, 解密';
  }
  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: 'https://base64s.com',
      siteName: 'Base64s.com',
      type: 'website',
      images: [
        {
          url: '/preview.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/preview.png'],
      site: '@base64s',
    },
    alternates: {
      canonical: locale === 'en' ? 'https://base64s.com/' : `https://base64s.com/${locale}/`,
    },
  };
}

export default function HomePage() {
    return (
        <div className="container flex items-center justify-center">
            <Base64Code />
        </div>
    );
}