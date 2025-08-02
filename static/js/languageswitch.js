/**
 * 多语言切换系统
 * 支持动态语言切换，本地存储用户语言偏好
 */

// 全局语言管理对象
window.LanguageManager = {
    // 当前语言
    currentLanguage: 'en',
    
    // 支持的语言列表
    supportedLanguages: ['en', 'zh'],
    
    // 语言数据缓存
    languageData: {},
    
    // 初始化语言系统
    async init() {
        console.log('正在初始化多语言系统...');
        
        // 从本地存储获取用户语言偏好
        const savedLanguage = localStorage.getItem('selectedLanguage');
        
        // 确定初始语言（优先级：本地存储 > 浏览器语言 > 默认英语）
        let initialLanguage = 'en';
        if (savedLanguage && this.supportedLanguages.includes(savedLanguage)) {
            initialLanguage = savedLanguage;
        } else {
            // 检测浏览器语言
            const browserLang = navigator.language || navigator.userLanguage;
            if (browserLang.startsWith('zh')) {
                initialLanguage = 'zh';
            }
        }
        
        // 预加载语言文件
        await this.preloadLanguages();
        
        // 设置初始语言
        await this.setLanguage(initialLanguage);
        
        // 设置语言切换事件监听器
        this.setupLanguageSwitcher();
        
        console.log(`多语言系统初始化完成，当前语言: ${initialLanguage}`);
    },
    
    // 预加载所有语言文件
    async preloadLanguages() {
        const promises = this.supportedLanguages.map(lang => this.loadLanguageData(lang));
        await Promise.all(promises);
        console.log('所有语言文件加载完成');
    },
    
    // 加载语言数据
    async loadLanguageData(language) {
        if (this.languageData[language]) {
            return this.languageData[language];
        }
        
        try {
            const response = await fetch(`./static/language/${language}.json`);
            if (!response.ok) {
                throw new Error(`加载语言文件失败: ${language}`);
            }
            
            const data = await response.json();
            this.languageData[language] = data;
            console.log(`语言文件加载成功: ${language}`);
            return data;
        } catch (error) {
            console.error(`加载语言文件失败: ${language}`, error);
            
            // 如果加载失败且不是英语，尝试加载英语作为备用
            if (language !== 'en' && !this.languageData['en']) {
                console.log('尝试加载英语作为备用语言...');
                return await this.loadLanguageData('en');
            }
            
            throw error;
        }
    },
    
    // 设置语言
    async setLanguage(language) {
        if (!this.supportedLanguages.includes(language)) {
            console.warn(`不支持的语言: ${language}，使用默认语言: en`);
            language = 'en';
        }
        
        try {
            // 确保语言数据已加载
            await this.loadLanguageData(language);
            
            this.currentLanguage = language;
            
            // 更新页面内容
            this.updatePageContent();
            
            // 更新语言选择器显示
            this.updateLanguageSelector();
            
            // 保存到本地存储
            localStorage.setItem('selectedLanguage', language);
            
            console.log(`语言切换成功: ${language}`);
        } catch (error) {
            console.error(`语言设置失败: ${language}`, error);
        }
    },
    
    // 更新页面内容
    updatePageContent() {
        const data = this.languageData[this.currentLanguage];
        if (!data) {
            console.error(`语言数据不存在: ${this.currentLanguage}`);
            return;
        }
        
        // 更新页面标题和meta信息
        document.title = data.meta.title;
        const keywordsMetaTag = document.querySelector('meta[name="keywords"]');
        if (keywordsMetaTag) {
            keywordsMetaTag.setAttribute('content', data.meta.keywords);
        }
        
        // 更新导航栏
        this.updateNavbar(data.navbar);
        
        // 更新主要内容区
        this.updateMainContent(data.main);
        
        // 更新常用操作区域
        this.updateCommonOperations(data.commonOperations);
        
        // 更新设置弹框
        this.updateSettings(data.settings);
        
        // 更新所有带有data-i18n属性的元素
        this.updateDataI18nElements(data);
    },
    
    // 更新导航栏
    updateNavbar(navbarData) {
        const elements = {
            '[data-nav="textEncode"]': navbarData.textEncode,
            '[data-nav="imageEncode"]': navbarData.imageEncode,
            '[data-nav="fileEncode"]': navbarData.fileEncode,
            '[data-nav="webEncode"]': navbarData.webEncode,
            '[data-nav="faq"]': navbarData.faq,
            '[data-nav="faqItem1"]': navbarData.faqItem1,
            '[data-nav="faqItem2"]': navbarData.faqItem2,
            '[data-nav="faqItem3"]': navbarData.faqItem3,
            '[data-nav="about"]': navbarData.about,
            '[data-nav="settings"]': navbarData.settings
        };
        
        Object.entries(elements).forEach(([selector, text]) => {
            const element = document.querySelector(selector);
            if (element) {
                element.textContent = text;
            }
        });
    },
    
    // 更新主要内容区
    updateMainContent(mainData) {
        const elements = {
            '[data-main="inputLabel"]': mainData.inputLabel,
            '[data-main="outputLabel"]': mainData.outputLabel,
            '[data-main="encodeBtn"]': mainData.encodeBtn,
            '[data-main="decodeBtn"]': mainData.decodeBtn,
            '[data-main="swapBtn"]': mainData.swapBtn
        };
        
        Object.entries(elements).forEach(([selector, text]) => {
            const element = document.querySelector(selector);
            if (element) {
                element.textContent = text;
            }
        });
        
        // 更新placeholder
        const inputTextarea = document.getElementById('inputText');
        const outputTextarea = document.getElementById('outputText');
        if (inputTextarea) {
            inputTextarea.setAttribute('placeholder', mainData.inputPlaceholder);
        }
        if (outputTextarea) {
            outputTextarea.setAttribute('placeholder', mainData.outputPlaceholder);
        }
    },
    
    // 更新常用操作区域
    updateCommonOperations(operationsData) {
        const elements = {
            '[data-ops="autoAddString"]': operationsData.autoAddString,
            '[data-ops="encodeCount"]': operationsData.encodeCount,
            '[data-ops="autoCopyResult"]': operationsData.autoCopyResult,
            '[data-ops="autoDetectSwitch"]': operationsData.autoDetectSwitch
        };
        
        Object.entries(elements).forEach(([selector, text]) => {
            const element = document.querySelector(selector);
            if (element) {
                element.textContent = text;
            }
        });
        
        // 更新下拉菜单选项
        const positionOptions = document.querySelectorAll('.position-option');
        const positionTexts = [
            operationsData.positionRandom,
            operationsData.positionStart,
            operationsData.positionEnd,
            operationsData.positionRandomEdge
        ];
        
        positionOptions.forEach((option, index) => {
            if (positionTexts[index]) {
                option.textContent = positionTexts[index];
            }
        });
        
        // 更新tooltip
        this.updateTooltips(operationsData);
    },
    
    // 更新设置弹框
    updateSettings(settingsData) {
        const elements = {
            '[data-settings="title"]': settingsData.title,
            '[data-settings="autoAddStringLabel"]': settingsData.autoAddStringLabel,
            '[data-settings="encodeCountLabel"]': settingsData.encodeCountLabel,
            '[data-settings="autoCopyResultLabel"]': settingsData.autoCopyResultLabel,
            '[data-settings="autoDetectSwitchLabel"]': settingsData.autoDetectSwitchLabel,
            '[data-settings="cancel"]': settingsData.cancel,
            '[data-settings="save"]': settingsData.save
        };
        
        Object.entries(elements).forEach(([selector, text]) => {
            const element = document.querySelector(selector);
            if (element) {
                element.textContent = text;
            }
        });
    },
    
    // 更新tooltip提示
    updateTooltips(operationsData) {
        const tooltipElements = [
            { selector: '#autoAddString', text: operationsData.autoAddStringTooltip },
            { selector: '#positionDropdown', text: operationsData.positionTooltip },
            { selector: '#encodeCount', text: operationsData.encodeCountTooltip },
            { selector: '#autoCopyResult', text: operationsData.autoCopyResultTooltip },
            { selector: '#autoDetectSwitch', text: operationsData.autoDetectSwitchTooltip }
        ];
        
        tooltipElements.forEach(({ selector, text }) => {
            const element = document.querySelector(selector);
            if (element) {
                element.setAttribute('title', text);
                element.setAttribute('data-bs-original-title', text);
            }
        });
    },
    
    // 更新所有带有data-i18n属性的元素
    updateDataI18nElements(data) {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const text = this.getNestedValue(data, key);
            if (text) {
                element.textContent = text;
            }
        });
    },
    
    // 获取嵌套对象的值
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current && current[key], obj);
    },
    
    // 更新语言选择器显示
    updateLanguageSelector() {
        const data = this.languageData[this.currentLanguage];
        if (!data || !data.languages) return;
        
        const languageButton = document.querySelector('.language-toggle');
        const currentLangText = data.languages[this.currentLanguage];
        
        if (languageButton && currentLangText) {
            languageButton.innerHTML = currentLangText;
        }
        
        // 更新下拉菜单中的语言选项
        const languageItems = document.querySelectorAll('.language-item');
        languageItems.forEach(item => {
            const langCode = item.getAttribute('data-lang');
            if (langCode && data.languages[langCode]) {
                item.innerHTML = data.languages[langCode];
            }
        });
    },
    
    // 设置语言切换事件监听器
    setupLanguageSwitcher() {
        // 为语言切换按钮添加事件监听器
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('language-item')) {
                e.preventDefault();
                const language = e.target.getAttribute('data-lang');
                if (language) {
                    this.setLanguage(language);
                }
            }
        });
    },
    
    // 获取当前语言的文本
    getText(key) {
        const data = this.languageData[this.currentLanguage];
        return this.getNestedValue(data, key) || key;
    },
    
    // 格式化消息（支持变量替换）
    formatMessage(key, variables = {}) {
        let message = this.getText(key);
        
        // 替换变量
        Object.entries(variables).forEach(([variable, value]) => {
            message = message.replace(`{${variable}}`, value);
        });
        
        return message;
    }
};

// 页面加载完成后初始化语言系统
document.addEventListener('DOMContentLoaded', () => {
    window.LanguageManager.init().catch(error => {
        console.error('语言系统初始化失败:', error);
    });
});

// 导出语言管理器以供其他脚本使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.LanguageManager;
}