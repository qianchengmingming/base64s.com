// postcss.config.mjs - PostCSS 配置文件
// 本文件用于配置PostCSS插件，主要用于处理CSS相关功能
// 详细中文注释已添加，便于理解每个配置项的作用

/**
 * @type {import('postcss-load-config').Config}
 * 这是PostCSS的配置类型声明，便于类型检查
 */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // 启用Tailwind CSS的PostCSS插件，支持Tailwind的指令和功能
  },
};

export default config; // 导出配置对象，供构建工具使用
