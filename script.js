/**
 * Google DevFest Workshop 日记本网站交互脚本
 * 作者: 赵景南
 * 功能: 阅读进度、返回顶部、主题切换、工具提示等
 */

class DevFestDiary {
  constructor() {
    this.init();
  }

  /**
   * 初始化所有功能
   */
  init() {
    this.createProgressBar();
    this.createBackToTopButton();
    this.createThemeToggle();
    this.initScrollProgress();
    this.initBackToTop();
    this.initThemeToggle();
    this.initTooltips();
    this.initPageAnimations();
    this.initActiveNavigation();
    this.initMobileMenu();
  }

  /**
   * 创建阅读进度条
   */
  createProgressBar() {
    if (!document.querySelector('.progress-bar')) {
      const progressBar = document.createElement('div');
      progressBar.className = 'progress-bar';
      document.body.appendChild(progressBar);
    }
  }

  /**
   * 创建返回顶部按钮
   */
  createBackToTopButton() {
    if (!document.querySelector('.back-to-top')) {
      const backToTopBtn = document.createElement('button');
      backToTopBtn.className = 'back-to-top';
      backToTopBtn.innerHTML = '↑';
      backToTopBtn.title = '返回顶部';
      document.body.appendChild(backToTopBtn);
    }
  }

  /**
   * 创建主题切换按钮
   */
  createThemeToggle() {
    if (!document.querySelector('.theme-toggle')) {
      const themeToggle = document.createElement('button');
      themeToggle.className = 'theme-toggle';
      themeToggle.innerHTML = '🌙';
      themeToggle.title = '切换夜间模式';
      document.body.appendChild(themeToggle);
    }
  }

  /**
   * 初始化滚动进度功能
   */
  initScrollProgress() {
    const progressBar = document.querySelector('.progress-bar');
    if (!progressBar) return;

    const updateProgress = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      progressBar.style.width = `${Math.min(progress, 100)}%`;
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress(); // 初始化
  }

  /**
   * 初始化返回顶部功能
   */
  initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;

    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    };

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

    window.addEventListener('scroll', toggleVisibility);
    backToTopBtn.addEventListener('click', scrollToTop);
    toggleVisibility(); // 初始化
  }

  /**
   * 初始化主题切换功能
   */
  initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;

    // 从localStorage读取保存的主题
    const savedTheme = localStorage.getItem('devfest-theme') || 'light';
    this.setTheme(savedTheme);

    const toggleTheme = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      this.setTheme(newTheme);
      localStorage.setItem('devfest-theme', newTheme);
    };

    themeToggle.addEventListener('click', toggleTheme);
  }

  /**
   * 设置主题
   * @param {string} theme - 主题名称 ('light' 或 'dark')
   */
  setTheme(theme) {
    const themeToggle = document.querySelector('.theme-toggle');
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeToggle) themeToggle.innerHTML = '☀️';
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeToggle) themeToggle.innerHTML = '🌙';
    }
  }

  /**
   * 初始化工具提示功能
   */
  initTooltips() {
    // 为所有带有data-tooltip属性的元素添加tooltip
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
      if (!element.classList.contains('tooltip')) {
        element.classList.add('tooltip');
        
        const tooltipText = document.createElement('span');
        tooltipText.className = 'tooltiptext';
        tooltipText.textContent = element.getAttribute('data-tooltip');
        element.appendChild(tooltipText);
      }
    });

    // 为高亮文本添加默认tooltip
    const highlights = document.querySelectorAll('.highlight:not([data-tooltip])');
    highlights.forEach(highlight => {
      if (!highlight.classList.contains('tooltip')) {
        highlight.classList.add('tooltip');
        highlight.setAttribute('data-tooltip', '这是一个重要的关键词');
        
        const tooltipText = document.createElement('span');
        tooltipText.className = 'tooltiptext';
        tooltipText.textContent = '这是一个重要的关键词';
        highlight.appendChild(tooltipText);
      }
    });
  }

  /**
   * 初始化页面动画
   */
  initPageAnimations() {
    // 页面加载动画
    const animateElements = document.querySelectorAll('.article, .page-wrapper');
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        }
      });
    }, observerOptions);

    animateElements.forEach(element => {
      observer.observe(element);
    });
  }

  /**
   * 初始化导航高亮功能
   */
  initActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
      const linkPage = link.getAttribute('href');
      if (linkPage === currentPage || 
          (currentPage === '' && linkPage === 'index.html') ||
          (currentPage === 'index.html' && linkPage === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /**
   * 初始化移动端菜单功能
   */
  initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!mobileMenuToggle || !navMenu) return;

    // 切换菜单显示/隐藏
    mobileMenuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('active');
      
      if (isOpen) {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.style.overflow = '';
      } else {
        navMenu.classList.add('active');
        mobileMenuToggle.classList.add('active');
        document.body.style.overflow = 'hidden'; // 防止背景滚动
      }
    });

    // 点击菜单项后关闭菜单
    const menuItems = navMenu.querySelectorAll('a');
    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // 点击菜单外部区域关闭菜单
    document.addEventListener('click', (e) => {
      if (!mobileMenuToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // 窗口大小改变时重置菜单状态
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  /**
   * 添加打字机效果
   * @param {HTMLElement} element - 目标元素
   * @param {string} text - 要显示的文本
   * @param {number} speed - 打字速度(毫秒)
   */
  typeWriter(element, text, speed = 50) {
    element.innerHTML = '';
    let i = 0;
    
    const type = () => {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    };
    
    type();
  }

  /**
   * 平滑滚动到指定元素
   * @param {string} selector - 目标元素选择器
   */
  scrollToElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  /**
   * 显示通知消息
   * @param {string} message - 消息内容
   * @param {string} type - 消息类型 ('success', 'error', 'info')
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--google-blue);
      color: white;
      padding: 12px 24px;
      border-radius: 25px;
      z-index: 1001;
      opacity: 0;
      transition: opacity 0.3s ease;
      box-shadow: 0 4px 12px var(--shadow-color);
    `;

    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
      notification.style.opacity = '1';
    }, 100);

    // 自动隐藏
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
}

/**
 * 工具函数：防抖
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间
 * @returns {Function} 防抖后的函数
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 工具函数：节流
 * @param {Function} func - 要节流的函数
 * @param {number} limit - 时间限制
 * @returns {Function} 节流后的函数
 */
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  // 创建全局实例
  window.devFestDiary = new DevFestDiary();
  
  // 添加页面加载完成的通知
  setTimeout(() => {
    window.devFestDiary.showNotification('欢迎来到我的DevFest日记！', 'success');
  }, 1000);
});

// 页面卸载前保存状态
window.addEventListener('beforeunload', () => {
  const scrollPosition = window.pageYOffset;
  sessionStorage.setItem('scrollPosition', scrollPosition);
});

// 页面加载后恢复滚动位置
window.addEventListener('load', () => {
  const scrollPosition = sessionStorage.getItem('scrollPosition');
  if (scrollPosition) {
    window.scrollTo(0, parseInt(scrollPosition));
    sessionStorage.removeItem('scrollPosition');
  }
});