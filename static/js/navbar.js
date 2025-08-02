/**
 * 导航栏管理器
 * 负责动态加载导航栏和管理激活状态
 */

window.NavbarManager = {
    // 当前页面类型
    currentPage: null,
    
    // 页面类型映射
    pageMapping: {
        'index.html': 'text',
        'image2base64.html': 'image',
        'file2base64.html': 'file',
        'webpage2base64.html': 'web',
        'prevent-password-cracking.html': 'faq',
        'how-to-use-website.html': 'faq',
        'what-is-base64.html': 'faq',
        'privacy-policy.html': 'faq',
        '/': 'text',
        '': 'text'
    },
    
    // 初始化导航栏
    async init() {

        
        // 检测当前页面类型
        this.detectCurrentPage();
        
        // 加载导航栏
        await this.loadNavbar();
        
        // 设置激活状态
        this.setActiveNavItem();
        

    },
    
    // 检测当前页面类型
    detectCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        
        // 特殊路径检测
        if (path.includes('/html/about/')) {
            this.currentPage = 'about';
        } else if (path.includes('/html/faq/')) {
            this.currentPage = 'faq';
        } else {
            // 从映射中获取页面类型
            this.currentPage = this.pageMapping[filename] || 'text';
        }
        
        // 也可以从URL参数中获取
        const urlParams = new URLSearchParams(window.location.search);
        const pageParam = urlParams.get('page');
        if (pageParam) {
            this.currentPage = pageParam;
        }
        

    },
    
    // 动态加载导航栏
    async loadNavbar() {
        try {
            // 智能路径检测
            const navbarPath = this.getNavbarPath();
    
            
            const response = await fetch(navbarPath);
            if (!response.ok) {
                throw new Error(`导航栏加载失败: ${response.status}`);
            }
            
            const navbarHTML = await response.text();
            
            // 查找导航栏容器
            const navbarContainer = document.getElementById('navbar-container');
            if (navbarContainer) {
                navbarContainer.innerHTML = navbarHTML;
            } else {
                // 如果没有容器，插入到body开始位置
                document.body.insertAdjacentHTML('afterbegin', navbarHTML);
            }
            
            
        } catch (error) {
            console.error('导航栏加载失败:', error);
            // 降级处理：显示错误信息或使用默认导航栏
        }
    },
    
    // 获取导航栏路径（使用绝对路径）
    getNavbarPath() {
        const currentPath = window.location.pathname;

        
        // 统一使用绝对路径，从网站根目录开始
        return '/static/components/navbar.html';
    },
    
    // 设置激活状态
    setActiveNavItem() {
        // 移除所有激活状态
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // 设置当前页面对应的导航项为激活状态
        let targetNavLink = null;
        
        // 首先尝试通过data-page属性匹配
        targetNavLink = document.querySelector(`[data-page="${this.currentPage}"]`);
        
        // 如果没找到，尝试通过data-nav属性匹配
        if (!targetNavLink) {
            targetNavLink = document.querySelector(`[data-nav="${this.currentPage}"]`);
        }
        
        // 特殊处理：对于FAQ页面，激活FAQ下拉菜单
        if (this.currentPage === 'faq') {
            targetNavLink = document.querySelector('[data-nav="faq"]');
        }
        
        if (targetNavLink) {
            targetNavLink.classList.add('active');
    
        } else {

        }
    },
    
    // 更新激活状态（用于页面跳转时）
    updateActiveState(pageType) {
        this.currentPage = pageType;
        this.setActiveNavItem();
    },
    
    // 获取当前页面类型
    getCurrentPage() {
        return this.currentPage;
    }
};

// 页面加载完成后初始化导航栏
document.addEventListener('DOMContentLoaded', async () => {
    await window.NavbarManager.init();
    
});

// 导出导航栏管理器以供其他脚本使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.NavbarManager;
}