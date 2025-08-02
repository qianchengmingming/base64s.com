/**
 * Base64s.com 网站配置文件
 * 包含网站的基本信息、联系方式、社交媒体等配置
 */

window.SiteConfig = {
    // 网站基本信息
    site: {
        name: "Base64s.com",
        title: "Base64s.com - Professional Base64 Encoding & Decoding Platform",
        description: "专业的Base64编解码平台，支持文本、图片、文件、网页等多种格式的Base64转换",
        url: "https://base64s.com",
        version: "1.0.0",
        author: "Base64s.com Team",
        copyright: "© 2024 Base64s.com. All rights reserved."
    },
    
    // 联系方式
    contact: {
        email: "contact@base64s.com"
    },
    
    // 技术支持
    support: {
        documentation: "/html/faq/how-to-use-website.html",
        faq: "/html/faq/",
        privacy: "/html/faq/privacy-policy.html",
        terms: "/html/faq/terms-of-service.html"
    },
    
    // 功能模块配置
    modules: {
        textEncode: {
            path: "/index.html",
            name: "文本编码",
            description: "支持文本与Base64互转，具备安全字符串添加和多次编码功能"
        },
        imageEncode: {
            path: "/image2base64.html", 
            name: "图片编码",
            description: "将图片转换为Base64格式，支持多种图片格式"
        },
        fileEncode: {
            path: "/file2base64.html",
            name: "文件编码", 
            description: "将任何文件转换为Base64，支持多种输出格式"
        },
        webEncode: {
            path: "/webpage2base64.html",
            name: "网页编码",
            description: "从URL获取网页内容并转换为Base64格式"
        }
    },
    
    // SEO 配置
    seo: {
        keywords: "base64, encoding, decoding, 编码, 解码, 转换, conversion, online tool, 在线工具",
        robots: "index,follow",
        language: "zh-CN,en-US"
    },
    
    // 统计和分析
    analytics: {
        googleAnalytics: "", // GA tracking ID
        baiduAnalytics: "", // 百度统计 ID
        umami: "" // Umami 分析 ID
    },
    
    // API 配置
    api: {
        corsProxies: [
            "https://cors-anywhere.herokuapp.com/",
            "https://api.allorigins.win/raw?url=",
            "https://api.codetabs.com/v1/proxy?quest="
        ],
        maxFileSize: 10 * 1024 * 1024, // 10MB
        supportedImageFormats: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp'],
        maxEncodeRounds: 10
    },
    
    // 安全配置
    security: {
        maxStringLength: 100,
        rateLimit: {
            enabled: false,
            maxRequests: 100,
            timeWindow: 60000 // 1分钟
        }
    }
};

// 导出配置（兼容不同模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.SiteConfig;
}