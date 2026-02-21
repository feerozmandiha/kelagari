/**
 * کلاگری (Kelageri) - فایل اصلی جاوااسکریپت
 * نویسنده: تیم توسعه کلاگری
 * نسخه: 1.0.0
 */


// ========== منتظر بارگذاری کامل DOM ==========
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initScrollEffects();
    initNewsletterForm();
    initSmoothScroll();
    initLazyLoading();
    initHeaderScroll();
});

// ========== منوی موبایل ==========
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!menuToggle || !mobileMenu) return;
    
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileMenu.classList.toggle('active');
        
        // تغییر آیکون منو
        const icon = menuToggle.querySelector('i');
        if (mobileMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // بستن منو با کلیک روی لینک‌ها
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
    
    // بستن منو با کلیک بیرون
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
}

// ========== افکت اسکرول روی هدر ==========
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ========== اسکرول نرم ==========
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ========== فرم خبرنامه ==========
function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (!isValidEmail(email)) {
            showNotification('ایمیل معتبر وارد کنید', 'error');
            return;
        }
        
        // نمایش حالت در حال ارسال
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '...در حال ارسال';
        submitBtn.disabled = true;
        
        try {
            // شبیه‌سازی ارسال به سرور
            await fakeApiCall(email);
            
            showNotification('عضویت شما با موفقیت ثبت شد', 'success');
            emailInput.value = '';
        } catch (error) {
            showNotification('خطا در ثبت‌نام. دوباره تلاش کنید', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ========== اعتبارسنجی ایمیل ==========
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ========== شبیه‌سازی API ==========
function fakeApiCall(email) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Email submitted:', email);
            resolve({ success: true });
        }, 1000);
    });
}

// ========== نمایش نوتیفیکیشن ==========
function showNotification(message, type = 'info') {
    // بررسی وجود نوتیفیکیشن قبلی
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        padding: 12px 24px;
        border-radius: 50px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        direction: rtl;
        font-family: var(--font-primary);
        animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ========== Lazy Loading برای تصاویر ==========
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ========== افکت‌های اسکرول ==========
function initScrollEffects() {
    const sections = document.querySelectorAll('section');
    
    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, { threshold: 0.1 });
        
        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }
}

// ========== مدیریت خطاهای سراسری ==========
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // گزارش خطا به سرور (در نسخه نهایی)
});

// ========== مدیریت وضعیت آنلاین/آفلاین ==========
window.addEventListener('online', () => {
    showNotification('اتصال اینترنت برقرار شد', 'success');
});

window.addEventListener('offline', () => {
    showNotification('اتصال اینترنت قطع شد', 'error');
});

// ========== بهینه‌سازی عملکرد ==========
// Debounce برای رویدادهای پرفرکانس
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

// ذخیره موقعیت اسکرول برای بازگشت
let scrollPositions = {};

function saveScrollPosition(key) {
    scrollPositions[key] = window.scrollY;
}

function restoreScrollPosition(key) {
    if (scrollPositions[key]) {
        window.scrollTo(0, scrollPositions[key]);
    }
}