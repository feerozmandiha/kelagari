<div dir="rtl" align="right">

# معماری فنی پروژه کلاگری

[بازگشت به صفحه اصلی](../README.md)

## تکنولوژی‌های استفاده شده

### فرانت‌اند

| تکنولوژی     | نسخه    | کاربرد                        |
| :----------- | :------ | :---------------------------- |
| HTML5        | -       | ساختار صفحات                  |
| CSS3         | -       | استایل‌دهی با متغیرهای سفارشی |
| JavaScript   | ES6+    | منطق برنامه و تعاملات         |
| Three.js     | 0.174.0 | نمایشگر سه‌بعدی مدل‌ها        |
| Font Awesome | 6.5.1   | آیکون‌های گرافیکی             |

### کتابخانه‌های CDN

```html
<!-- فونت فارسی Vazirmatn -->
<link
  href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css"
  rel="stylesheet"
/>

<!-- فونت انگلیسی Inter -->
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
  rel="stylesheet"
/>

<!-- Font Awesome -->
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
/>

ساختار پروژه
```
kelagari/
│
├── index.html              # صفحه اصلی
├── about.html              # درباره ما
├── contact.html            # تماس با ما
├── library.html            # کتابخانه مدل‌ها
│
├── css/
│   ├── main.css            # استایل‌های پایه و متغیرها
│   ├── components.css      # استایل کامپوننت‌ها
│   └── responsive.css      # استایل واکنش‌گرا
│
├── js/
│   ├── main.js             # منطق اصلی و منوی موبایل
│   ├── components.js       # کامپوننت‌های داینامیک
│   └── three-viewer.js     # نمایشگر سه‌بعدی
│
├── models/                  # فایل‌های مدل سه‌بعدی
│   └── *.stl, *.glb         # مدل‌ها
│
└── docs/                    # مستندات پروژه
    ├── 00-project-brief.md
    ├── 01-decision-log.md
    ├── 02-timeline.md
    └── 03-architecture.md

    نمایشگر سه‌بعدی
فرمت‌های پشتیبانی: STL، GLTF/GLB

کنترل‌ها: چرخش با موس، زوم با اسکرول، جابجایی با راست‌کلیک

چرخش خودکار: فعال

نورپردازی: ترکیبی از نور محیط، جهت‌دار و نقطه‌ای

تنظیمات فعلی
const viewer = new Kelageri3DViewer('hero3dContainer', {
    backgroundColor: '#faf7f2',
    autoRotate: true,
    showGrid: true,
    rotateX: -Math.PI / 2  // برای مدل‌های STL
});

پالت رنگی
:root {
    --terracotta-light: #fbc4a0;
    --terracotta-medium: #e0a185;
    --terracotta-dark: #6b4a3a;
    --earth-cream: #fff9f2;
    --earth-sand: #faf0e8;
    --earth-clay: #f0ded3;
    --ether-white: rgba(255, 255, 255, 0.95);
    --ether-shadow: rgba(107, 74, 58, 0.06);
}

[بازگشت به صفحه اصلی](../README.md)

</div> ```