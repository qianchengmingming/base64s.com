// next.config.mjs - Next.js 配置文件
// 本文件用于配置Next.js项目的构建、插件、页面扩展、图片远程加载等功能
// 详细中文注释已添加，便于理解每个配置项的作用

import bundleAnalyzer from "@next/bundle-analyzer"; // 引入Next.js打包分析插件
import createNextIntlPlugin from "next-intl/plugin"; // 引入国际化插件
import mdx from "@next/mdx"; // 引入MDX支持插件

// 配置打包分析插件，仅当环境变量ANALYZE为true时启用
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true", // 通过环境变量控制是否启用分析
});

// 配置国际化插件，支持多语言
const withNextIntl = createNextIntlPlugin();

// 配置MDX插件，支持在Next.js中直接使用MDX文件
const withMDX = mdx({
  options: {
    remarkPlugins: [], // 可扩展remark插件
    rehypePlugins: [], // 可扩展rehype插件
  },
});

/**
 * nextConfig为Next.js的主配置对象
 * output: standalone 独立部署模式，便于Docker等环境部署
 * reactStrictMode: 是否启用React严格模式
 * pageExtensions: 支持的页面文件扩展名
 * images: 配置远程图片加载规则
 * redirects: 配置页面重定向（此处返回空数组，暂无重定向）
 */
const nextConfig = {
  output: "standalone", // 独立部署模式
  reactStrictMode: false, // 关闭React严格模式（可根据需要开启）
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"], // 支持的页面扩展名
  images: {
    remotePatterns: [
      {
        protocol: "https", // 允许https协议的远程图片
        hostname: "*", // 允许任意主机名
      },
    ],
  },
  async redirects() {
    return []; // 当前无页面重定向
  },
};

// 启用MDX实验特性
const configWithMDX = {
  ...nextConfig,
  experimental: {
    mdxRs: true, // 启用MDX的实验性支持
  },
};

// 组合所有插件并导出最终配置
export default withBundleAnalyzer(withNextIntl(withMDX(configWithMDX)));
