/**
 * کلاگری (Kelageri) - کامپوننت‌های داینامیک
 * نویسنده: تیم توسعه کلاگری
 * نسخه: 1.0.0
 */


// ========== داده‌های نمونه (موقت) ==========
const sampleData = {
    categories: [
        { id: 1, name: 'صنعت', icon: 'fa-industry', count: 245, color: '#fda170' },
        { id: 2, name: 'هنر و دکور', icon: 'fa-paint-brush', count: 189, color: '#c46b4a' },
        { id: 3, name: 'ابزار و یراق', icon: 'fa-tools', count: 156, color: '#4b251a' },
        { id: 4, name: 'ماکت و فیگور', icon: 'fa-chess-queen', count: 312, color: '#2b150e' }
    ],
    
    products: [
        { 
            id: 1, 
            name: 'گلدان دکوراتیو', 
            designer: 'علی رضایی', 
            rating: 4.8, 
            reviews: 124, 
            price: 'رایگان',
            image: 'fa-leaf'
        },
        { 
            id: 2, 
            name: 'چرخ‌دنده صنعتی', 
            designer: 'مهندس کاظمی', 
            rating: 4.9, 
            reviews: 89, 
            price: '۲۵۰,۰۰۰ تومان',
            image: 'fa-cog'
        },
        { 
            id: 3, 
            name: 'مجسمه اسب', 
            designer: 'مریم احمدی', 
            rating: 4.7, 
            reviews: 56, 
            price: '۱۸۰,۰۰۰ تومان',
            image: 'fa-horse'
        },
        { 
            id: 4, 
            name: 'جا کلیدی شخصی', 
            designer: 'سارا محمدی', 
            rating: 4.5, 
            reviews: 32, 
            price: '۸۵,۰۰۰ تومان',
            image: 'fa-key'
        }
    ],
    
    designers: [
        { id: 1, name: 'علی رضایی', followers: 1234, avatar: 'ع', specialty: 'هنری' },
        { id: 2, name: 'سارا محمدی', followers: 987, avatar: 'س', specialty: 'صنعتی' },
        { id: 3, name: 'رضا کریمی', followers: 2567, avatar: 'ر', specialty: 'ماکت' },
        { id: 4, name: 'مینا احمدی', followers: 768, avatar: 'م', specialty: 'دکور' },
        { id: 5, name: 'کیان رستمی', followers: 1456, avatar: 'ک', specialty: 'هنری' },
        { id: 6, name: 'نازنین زارع', followers: 876, avatar: 'ن', specialty: 'صنعتی' }
    ]
};


// ========== رندر کامپوننت‌ها پس از بارگذاری صفحه ==========
document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    renderProducts();
    renderDesigners();
    initProductFilters();
    initSearch();
    initWishlist();
    loadWishlistFromStorage();

});

// ========== مقداردهی اولیه لیست علاقه‌مندی‌ها ==========
function initWishlist() {
    // بررسی وجود دکمه‌های علاقه‌مندی در صفحه
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    
    // به‌روزرسانی وضعیت قلب‌ها بر اساس localStorage
    wishlistBtns.forEach(btn => {
        const productId = btn.closest('.product-card')?.dataset.productId;
        if (productId && wishlist.includes(parseInt(productId))) {
            const icon = btn.querySelector('i');
            icon.classList.remove('far');
            icon.classList.add('fas');
        }
    });
    
    console.log('Wishlist initialized with', wishlist.length, 'items');
}

// ========== بازیابی لیست علاقه‌مندی‌ها از حافظه ==========
function loadWishlistFromStorage() {
    const savedWishlist = localStorage.getItem('kelageri_wishlist');
    if (savedWishlist) {
        wishlist = JSON.parse(savedWishlist);
    }
    return wishlist;
}


// ========== رندر دسته‌بندی‌ها ==========
function renderCategories() {
    const grid = document.getElementById('categoryGrid');
    if (!grid) return;
    
    grid.innerHTML = sampleData.categories.map(category => `
        <div class="category-card" data-category-id="${category.id}">
            <div class="category-icon" style="color: ${category.color}">
                <i class="fas ${category.icon}"></i>
            </div>
            <h3 class="category-title">${category.name}</h3>
            <p class="category-count">${category.count.toLocaleString('fa-IR')} مدل</p>
        </div>
    `).join('');
    
    // اضافه کردن event listener به کارت‌ها
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const categoryId = card.dataset.categoryId;
            window.location.href = `/library?category=${categoryId}`;
        });
        
        // افکت هاور
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// ========== رندر محصولات ==========
function renderProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    
    grid.innerHTML = sampleData.products.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <i class="fas ${product.image}"></i>
                <button class="wishlist-btn" onclick="toggleWishlist(${product.id}, event)">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-designer">طراح: ${product.designer}</p>
                <div class="product-rating">
                    <span class="stars">
                        ${generateStars(product.rating)}
                    </span>
                    <span class="rating-count">${product.reviews.toLocaleString('fa-IR')} نظر</span>
                </div>
                <div class="product-footer">
                    <span class="product-price ${product.price === 'رایگان' ? 'free' : ''}">
                        ${product.price}
                    </span>
                    <button class="btn btn-text" onclick="addToCart(${product.id}, event)">
                        <i class="fas fa-shopping-cart"></i>
                        <span>افزودن</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // اضافه کردن event listener به کارت‌ها
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // جلوگیری از اجرا وقتی روی دکمه کلیک شده
            if (e.target.closest('.btn') || e.target.closest('.wishlist-btn')) return;
            
            const productId = card.dataset.productId;
            window.location.href = `/product/${productId}`;
        });
    });
}

// ========== تولید ستاره‌های امتیاز ==========
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return `
        ${'<i class="fas fa-star" style="color: #fda170;"></i>'.repeat(fullStars)}
        ${hasHalfStar ? '<i class="fas fa-star-half-alt" style="color: #fda170;"></i>' : ''}
        ${'<i class="far fa-star" style="color: #fda170;"></i>'.repeat(emptyStars)}
    `;
}

// ========== رندر طراحان برتر ==========
function renderDesigners() {
    const scroll = document.getElementById('designerScroll');
    if (!scroll) return;
    
    scroll.innerHTML = sampleData.designers.map(designer => `
        <div class="designer-card" data-designer-id="${designer.id}">
            <div class="designer-avatar" style="background: linear-gradient(135deg, #fda170, #4b251a);">
                ${designer.avatar}
            </div>
            <h4 class="designer-name">${designer.name}</h4>
            <p class="designer-followers">${formatNumber(designer.followers)} دنبال‌کننده</p>
            <span class="designer-specialty">${designer.specialty}</span>
        </div>
    `).join('');
    
    // اضافه کردن event listener به کارت‌های طراحان
    document.querySelectorAll('.designer-card').forEach(card => {
        card.addEventListener('click', () => {
            const designerId = card.dataset.designerId;
            window.location.href = `/designer/${designerId}`;
        });
    });
}

// ========== فرمت‌سازی اعداد ==========
function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

// ========== مدیریت سبد خرید ==========
let cart = JSON.parse(localStorage.getItem('kelageri_cart')) || [];

function addToCart(productId, event) {
    event.stopPropagation();
    
    const product = sampleData.products.find(p => p.id === productId);
    if (!product) return;
    
    cart.push({
        id: productId,
        name: product.name,
        price: product.price,
        quantity: 1
    });
    
    localStorage.setItem('kelageri_cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('محصول به سبد خرید اضافه شد', 'success');
    
    // انیمیشن دکمه
    const btn = event.currentTarget;
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 200);
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = cart.length;
        cartCount.style.display = cart.length > 0 ? 'flex' : 'none';
    }
}

// ========== مدیریت لیست علاقه‌مندی‌ها ==========
let wishlist = JSON.parse(localStorage.getItem('kelageri_wishlist')) || [];

function toggleWishlist(productId, event) {
    event.stopPropagation();
    
    const index = wishlist.indexOf(productId);
    const btn = event.currentTarget;
    const icon = btn.querySelector('i');
    
    if (index === -1) {
        wishlist.push(productId);
        icon.classList.remove('far');
        icon.classList.add('fas');
        showNotification('به علاقه‌مندی‌ها اضافه شد', 'success');
    } else {
        wishlist.splice(index, 1);
        icon.classList.remove('fas');
        icon.classList.add('far');
        showNotification('از علاقه‌مندی‌ها حذف شد', 'info');
    }
    
    localStorage.setItem('kelageri_wishlist', JSON.stringify(wishlist));
    
    // انیمیشن
    btn.style.transform = 'scale(1.2)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 200);
}

// ========== فیلتر محصولات ==========
function initProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (!filterButtons.length) return;
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // حذف کلاس active از همه دکمه‌ها
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            filterProducts(filter);
        });
    });
}

function filterProducts(filter) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        switch(filter) {
            case 'all':
                product.style.display = 'block';
                break;
            case 'free':
                const price = product.querySelector('.product-price');
                if (price.textContent.includes('رایگان')) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
                break;
            case 'popular':
                // منطق محبوبیت
                product.style.display = 'block';
                break;
        }
    });
}

// ========== جستجوی زنده ==========
function initSearch() {
    const searchInput = document.getElementById('librarySearch'); // تغییر نام به librarySearch
    const searchBtn = document.getElementById('searchBtn');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput) return; // اگر در صفحه‌ای این المنت نبود، خطا نده
    
    let debounceTimer;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = this.value.trim();
            if (query.length > 2) {
                performSearch(query);
            } else {
                if (searchResults) {
                    searchResults.style.display = 'none';
                }
            }
        }, 300);
    });
    
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `/search?q=${encodeURIComponent(query)}`;
            }
        });
    }
}

function performSearch(query) {
    // شبیه‌سازی جستجو
    const results = sampleData.products.filter(p => 
        p.name.includes(query) || p.designer.includes(query)
    );
    
    displaySearchResults(results);
}

function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) return;
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="no-results">نتیجه‌ای یافت نشد</div>';
    } else {
        searchResults.innerHTML = results.map(r => `
            <div class="search-result-item" onclick="window.location.href='/product/${r.id}'">
                <i class="fas ${r.image}"></i>
                <div>
                    <div>${r.name}</div>
                    <small>${r.designer}</small>
                </div>
            </div>
        `).join('');
    }
    
    searchResults.style.display = 'block';
}

// ========== نمایش نوتیفیکیشن ==========
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // استایل نوتیفیکیشن
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '50px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: '9999',
        direction: 'rtl',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        animation: 'slideIn 0.3s ease',
        fontFamily: 'var(--font-primary)'
    });
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ========== اسکرول به بالا ==========
window.scrollToTop = function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

// ========== نمایش دکمه اسکرول به بالا ==========
window.addEventListener('scroll', () => {
    const scrollBtn = document.getElementById('scrollToTop');
    if (!scrollBtn) return;
    
    if (window.scrollY > 500) {
        scrollBtn.style.display = 'flex';
    } else {
        scrollBtn.style.display = 'none';
    }
});

// ========== اضافه کردن دکمه اسکرول به بالا ==========
function addScrollToTopButton() {
    const btn = document.createElement('button');
    btn.id = 'scrollToTop';
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.onclick = scrollToTop;
    
    Object.assign(btn.style, {
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--terracotta-light), var(--terracotta-medium))',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        display: 'none',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        boxShadow: 'var(--shadow-soft)',
        zIndex: '999',
        transition: 'all 0.3s ease'
    });
    
    document.body.appendChild(btn);
}

// اجرا پس از بارگذاری صفحه
document.addEventListener('DOMContentLoaded', () => {
    addScrollToTopButton();
    updateCartCount();
});