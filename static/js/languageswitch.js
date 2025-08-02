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
        
        
    },
    
    // 预加载所有语言文件
    async preloadLanguages() {
        const promises = this.supportedLanguages.map(lang => this.loadLanguageData(lang));
        await Promise.all(promises);

    },
    
    // 加载语言数据
    async loadLanguageData(language) {
        if (this.languageData[language]) {
            return this.languageData[language];
        }
        
        try {
            // 智能路径检测
            const languagePath = this.getLanguagePath(language);
    
            
            const response = await fetch(languagePath);
            if (!response.ok) {
                throw new Error(`加载语言文件失败: ${language}`);
            }
            
            const data = await response.json();
            this.languageData[language] = data;
            
            return data;
        } catch (error) {
            console.error(`加载语言文件失败: ${language}`, error);
            
            // 如果加载失败且不是英语，尝试加载英语作为备用
            if (language !== 'en' && !this.languageData['en']) {

                return await this.loadLanguageData('en');
            }
            
            throw error;
        }
    },
    
    // 获取语言文件路径（使用绝对路径）
    getLanguagePath(language) {
        const currentPath = window.location.pathname;

        
        // 统一使用绝对路径，从网站根目录开始
        return `/static/language/${language}.json`;
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
        
        // 更新图片页面内容（如果存在）
        if (data.image) {
            this.updateImageContent(data.image);
        }
        
        // 更新文件页面内容（如果存在）
        if (data.file) {
            this.updateFileContent(data.file);
        }
        
        // 更新网页页面内容（如果存在）
        if (data.web) {
            this.updateWebContent(data.web);
        }
        
        // 更新常用操作区域
        if (data.commonOperations) {
            this.updateCommonOperations(data.commonOperations);
        }
        
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
            '[data-nav="faqItem4"]': navbarData.faqItem4,
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
    
    // 更新图片页面内容
    updateImageContent(imageData) {
        const elements = {
            '[data-image="title"]': imageData.title,
            '[data-image="uploadLabel"]': imageData.uploadLabel,
            '[data-image="base64Label"]': imageData.base64Label,
            '[data-image="uploadBtn"]': imageData.uploadBtn,
            '[data-image="previewLabel"]': imageData.previewLabel,
            '[data-image="resultLabel"]': imageData.resultLabel,
            '[data-image="downloadBtn"]': imageData.downloadBtn,
            '[data-image="copyBase64Btn"]': imageData.copyBase64Btn,
            '[data-image="clearAllBtn"]': imageData.clearAllBtn,
            '[data-image="dragDropText"]': imageData.dragDropText,
            '[data-image="supportedFormats"]': imageData.supportedFormats
        };
        
        Object.entries(elements).forEach(([selector, text]) => {
            const element = document.querySelector(selector);
            if (element) {
                element.textContent = text;
            }
        });
        
        // 更新placeholder
        const base64Input = document.getElementById('base64Input');
        if (base64Input) {
            base64Input.setAttribute('placeholder', imageData.base64Placeholder);
        }
    },
    
    // 更新文件页面内容
    updateFileContent(fileData) {
        const elements = {
            '[data-file="title"]': fileData.title,
            '[data-file="uploadLabel"]': fileData.uploadLabel,
            '[data-file="uploadBtn"]': fileData.uploadBtn,
            '[data-file="dragDropText"]': fileData.dragDropText,
            '[data-file="supportedFormats"]': fileData.supportedFormats,
            '[data-file="outputFormatLabel"]': fileData.outputFormatLabel,
            '[data-file="formatPlainText"]': fileData.formatPlainText,
            '[data-file="formatDataUri"]': fileData.formatDataUri,
            '[data-file="formatHtmlLink"]': fileData.formatHtmlLink,
            '[data-file="formatJson"]': fileData.formatJson,
            '[data-file="formatXml"]': fileData.formatXml,
            '[data-file="fileInfoLabel"]': fileData.fileInfoLabel,
            '[data-file="fileName"]': fileData.fileName,
            '[data-file="fileSize"]': fileData.fileSize,
            '[data-file="fileType"]': fileData.fileType,
            '[data-file="resultLabel"]': fileData.resultLabel,
            '[data-file="copyResultBtn"]': fileData.copyResultBtn,
            '[data-file="downloadResultBtn"]': fileData.downloadResultBtn,
            '[data-file="clearBtn"]': fileData.clearBtn,
            '[data-file="autoCopyLabel"]': fileData.autoCopyLabel
        };
        
        Object.entries(elements).forEach(([selector, text]) => {
            const element = document.querySelector(selector);
            if (element) {
                element.textContent = text;
            }
        });
        
        // 更新tooltip
        const autoCopyElement = document.querySelector('[data-file-tooltip="autoCopy"]');
        if (autoCopyElement) {
            autoCopyElement.setAttribute('title', fileData.autoCopyTooltip);
            autoCopyElement.setAttribute('data-bs-original-title', fileData.autoCopyTooltip);
        }
    },
    
    // 更新网页页面内容
    updateWebContent(webData) {
        const elements = {
            '[data-web="title"]': webData.title,
            '[data-web="urlToBase64Label"]': webData.urlToBase64Label,
            '[data-web="base64ToWebLabel"]': webData.base64ToWebLabel,
            '[data-web="encodeUrlBtn"]': webData.encodeUrlBtn,
            '[data-web="decodeBase64Btn"]': webData.decodeBase64Btn,
            '[data-web="clearUrlBtn"]': webData.clearUrlBtn,
            '[data-web="clearBase64Btn"]': webData.clearBase64Btn,
            '[data-web="previewLabel"]': webData.previewLabel,
            '[data-web="webInfoLabel"]': webData.webInfoLabel,
            '[data-web="webUrl"]': webData.webUrl,
            '[data-web="webTitle"]': webData.webTitle,
            '[data-web="webSize"]': webData.webSize,
            '[data-web="webType"]': webData.webType,
            '[data-web="resultLabel"]': webData.resultLabel,
            '[data-web="copyBase64Btn"]': webData.copyBase64Btn,
            '[data-web="downloadHtmlBtn"]': webData.downloadHtmlBtn,
            '[data-web="openPreviewBtn"]': webData.openPreviewBtn,
            '[data-web="outputFormatLabel"]': webData.outputFormatLabel,
            '[data-web="formatRawHtml"]': webData.formatRawHtml,
            '[data-web="formatBase64Only"]': webData.formatBase64Only,
            '[data-web="formatDataUri"]': webData.formatDataUri,
            '[data-web="formatJson"]': webData.formatJson,
            '[data-web="autoCopyLabel"]': webData.autoCopyLabel,
            '[data-web="corsNotice"]': webData.corsNotice,
            '[data-web="corsWarning"]': webData.corsWarning
        };
        
        Object.entries(elements).forEach(([selector, text]) => {
            const element = document.querySelector(selector);
            if (element) {
                element.textContent = text;
            }
        });
        
        // 更新placeholder
        const urlInput = document.getElementById('urlInput');
        const base64WebInput = document.getElementById('base64WebInput');
        if (urlInput) {
            urlInput.setAttribute('placeholder', webData.urlPlaceholder);
        }
        if (base64WebInput) {
            base64WebInput.setAttribute('placeholder', webData.base64Placeholder);
        }
        
        // 更新tooltip
        const urlTooltipElement = document.querySelector('[data-web-tooltip="url"]');
        if (urlTooltipElement) {
            urlTooltipElement.setAttribute('title', webData.urlTooltip);
            urlTooltipElement.setAttribute('data-bs-original-title', webData.urlTooltip);
        }
        
        const autoCopyElement = document.querySelector('[data-web-tooltip="autoCopy"]');
        if (autoCopyElement) {
            autoCopyElement.setAttribute('title', webData.autoCopyTooltip);
            autoCopyElement.setAttribute('data-bs-original-title', webData.autoCopyTooltip);
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
    // 如果导航栏管理器存在，等待导航栏加载完成后再初始化语言系统
    if (window.NavbarManager) {
        // 使用MutationObserver监听导航栏容器的变化
        const navbarContainer = document.getElementById('navbar-container');
        if (navbarContainer) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        // 导航栏已加载，初始化语言系统
                        setTimeout(() => {
                            window.LanguageManager.init().catch(error => {
                                console.error('语言系统初始化失败:', error);
                            });
                        }, 50);
                        observer.disconnect(); // 停止观察
                    }
                });
            });
            
            observer.observe(navbarContainer, { childList: true });
            
            // 设置超时保护，确保即使导航栏加载失败也能初始化语言系统
            setTimeout(() => {
                if (navbarContainer.children.length === 0) {
                    console.warn('导航栏加载超时，直接初始化语言系统');
                    window.LanguageManager.init().catch(error => {
                        console.error('语言系统初始化失败:', error);
                    });
                }
                observer.disconnect();
            }, 2000);
        } else {
            // 没有导航栏容器，直接初始化
            window.LanguageManager.init().catch(error => {
                console.error('语言系统初始化失败:', error);
            });
        }
    } else {
        // 没有导航栏管理器，直接初始化
        window.LanguageManager.init().catch(error => {
            console.error('语言系统初始化失败:', error);
        });
    }
});

// 导出语言管理器以供其他脚本使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.LanguageManager;
}