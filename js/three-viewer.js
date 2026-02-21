/**
 * کلاگری (Kelageri) - نمایشگر سه‌بعدی با Three.js
 * نویسنده: تیم توسعه کلاگری
 * نسخه: 1.0.1
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class Kelageri3DViewer {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Container not found:', containerId);
            return;
        }
        
        this.options = {
            backgroundColor: options.backgroundColor || '#faf7f2',
            autoRotate: options.autoRotate || true,
            showGrid: options.showGrid || true,
            showAxes: options.showAxes || false,
            rotateX: options.rotateX || 0,
            rotateY: options.rotateY || 0,
            rotateZ: options.rotateZ || 0,
            ...options
        };
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.model = null;
        this.animationId = null;
        this.placeholder = document.getElementById('hero3dPlaceholder');
        
        this.init();
        this.setupLights();
        this.setupHelpers();
        this.animate();
        
        // هندل ریسایز
        window.addEventListener('resize', () => this.handleResize());
    }
    
    init() {
        // صحنه
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.options.backgroundColor);
        
        // دوربین
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);
        
        // تنظیمات ویژه برای موبایل
        if (window.innerWidth < 768) {
            this.camera.position.set(3, 3, 3);
        }
        
        // رندرر
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        this.container.appendChild(this.renderer.domElement);
        
        // کنترل‌ها
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.autoRotate = this.options.autoRotate;
        this.controls.autoRotateSpeed = 2.0;
        this.controls.enableZoom = true;
        this.controls.enablePan = true;
        this.controls.maxPolarAngle = Math.PI / 2; // محدودیت چرخش
    }
    
    setupLights() {
        // نور محیط
        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);
        
        // نور اصلی (خورشید)
        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(2, 5, 3);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 1024;
        mainLight.shadow.mapSize.height = 1024;
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 10;
        mainLight.shadow.camera.left = -5;
        mainLight.shadow.camera.right = 5;
        mainLight.shadow.camera.top = 5;
        mainLight.shadow.camera.bottom = -5;
        this.scene.add(mainLight);
        
        // نور پرکننده (از پشت)
        const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
        backLight.position.set(-2, 1, -3);
        this.scene.add(backLight);
        
        // نورهای جانبی
        const fillLight1 = new THREE.PointLight(0xffaa88, 0.5);
        fillLight1.position.set(2, 1, 2);
        this.scene.add(fillLight1);
        
        const fillLight2 = new THREE.PointLight(0x88aaff, 0.5);
        fillLight2.position.set(-2, 1, 2);
        this.scene.add(fillLight2);
    }
    
    setupHelpers() {
        if (this.options.showGrid) {
            // گرید زمین
            const gridHelper = new THREE.GridHelper(10, 20, 0x4b251a, 0xc46b4a);
            gridHelper.position.y = -0.5;
            this.scene.add(gridHelper);
            
            // صفحه شفاف برای دریافت سایه
            const planeGeometry = new THREE.PlaneGeometry(10, 10);
            const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
            const plane = new THREE.Mesh(planeGeometry, planeMaterial);
            plane.rotation.x = -Math.PI / 2;
            plane.position.y = -0.5;
            plane.receiveShadow = true;
            this.scene.add(plane);
        }
        
        if (this.options.showAxes) {
            const axesHelper = new THREE.AxesHelper(5);
            this.scene.add(axesHelper);
        }
    }
    
    // تابع نمایش پیشرفت بارگذاری
    showLoadingProgress(percent) {
        if (this.placeholder) {
            if (percent < 100) {
                this.placeholder.style.display = 'flex';
                this.placeholder.innerHTML = `
                    <i class="fas fa-spinner fa-spin"></i>
                    <span>در حال بارگذاری... ${Math.round(percent)}%</span>
                `;
            } else {
                this.placeholder.style.display = 'none';
            }
        }
    }
    
    loadModel(url, format = 'stl') {
        // پاک کردن مدل قبلی
        if (this.model) {
            this.scene.remove(this.model);
        }
        
        // نمایش placeholder و شروع بارگذاری
        this.showLoadingProgress(0);
        
        const loader = format === 'stl' ? new STLLoader() : new GLTFLoader();
        
        if (format === 'stl') {
            loader.load(url, 
                // تابع موفقیت
                (geometry) => {
                    // محاسبه ابعاد برای مرکز کردن
                    geometry.computeBoundingBox();
                    const box = geometry.boundingBox;
                    const center = new THREE.Vector3();
                    box.getCenter(center);
                    
                    // ایجاد متریال
                    const material = new THREE.MeshStandardMaterial({
                        color: 0xfda170,
                        roughness: 0.3,
                        metalness: 0.1,
                        emissive: 0x000000,
                        emissiveIntensity: 0,
                        flatShading: false
                    });
                    
                    // ایجاد مش
                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.castShadow = true;
                    mesh.receiveShadow = true;
                    
                    // مرکز کردن مدل
                    mesh.position.sub(center);
                    
                    // اعمال چرخش‌های تنظیم شده
                    if (this.options.rotateX) mesh.rotation.x = this.options.rotateX;
                    if (this.options.rotateY) mesh.rotation.y = this.options.rotateY;
                    if (this.options.rotateZ) mesh.rotation.z = this.options.rotateZ;
                    
                    // مقیاس‌بندی خودکار
                    const size = new THREE.Vector3();
                    box.getSize(size);
                    const maxDim = Math.max(size.x, size.y, size.z);
                    if (maxDim > 2) {
                        mesh.scale.set(2/maxDim, 2/maxDim, 2/maxDim);
                    }
                    
                    this.model = mesh;
                    this.scene.add(mesh);
                    
                    // تنظیم دوربین مناسب برای مدل
                    this.fitCameraToObject(mesh);
                    
                    // بارگذاری کامل شد
                    this.showLoadingProgress(100);
                    this.onModelLoaded();
                },
                // تابع پیشرفت
                (progress) => {
                    const percent = (progress.loaded / progress.total) * 100;
                    this.showLoadingProgress(percent);
                },
                // تابع خطا
                (error) => {
                    console.error('خطا در بارگذاری مدل:', error);
                    this.onError(error);
                    
                    // نمایش خطا در placeholder
                    if (this.placeholder) {
                        this.placeholder.style.display = 'flex';
                        this.placeholder.innerHTML = `
                            <i class="fas fa-exclamation-triangle" style="color: #f44336;"></i>
                            <span>خطا در بارگذاری مدل</span>
                        `;
                    }
                }
            );
        } else if (format === 'gltf') {
            loader.load(url, 
                (gltf) => {
                    this.model = gltf.scene;
                    this.scene.add(gltf.scene);
                    
                    // اعمال چرخش‌ها
                    if (this.options.rotateX) this.model.rotation.x = this.options.rotateX;
                    if (this.options.rotateY) this.model.rotation.y = this.options.rotateY;
                    if (this.options.rotateZ) this.model.rotation.z = this.options.rotateZ;
                    
                    this.fitCameraToObject(gltf.scene);
                    this.showLoadingProgress(100);
                    this.onModelLoaded();
                },
                (progress) => {
                    const percent = (progress.loaded / progress.total) * 100;
                    this.showLoadingProgress(percent);
                },
                (error) => {
                    console.error('خطا در بارگذاری مدل:', error);
                    this.onError(error);
                }
            );
        }
    }
    
    fitCameraToObject(object) {
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        const maxSize = Math.max(size.x, size.y, size.z);
        const distance = maxSize * 1.5;
        
        this.camera.position.set(center.x + distance, center.y + distance, center.z + distance);
        this.controls.target.copy(center);
        this.controls.update();
    }
    
    setModelColor(color) {
        if (!this.model) return;
        
        this.model.traverse((child) => {
            if (child.isMesh) {
                child.material.color.setHex(color);
            }
        });
    }
    
    setBackgroundColor(color) {
        this.scene.background = new THREE.Color(color);
    }
    
    toggleAutoRotate(enable) {
        this.controls.autoRotate = enable;
    }
    
    resetCamera() {
        if (this.model) {
            this.fitCameraToObject(this.model);
        }
    }
    
    takeScreenshot() {
        this.renderer.render(this.scene, this.camera);
        const dataURL = this.renderer.domElement.toDataURL('image/png');
        return dataURL;
    }
    
    handleResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        if (this.controls) {
            this.controls.update();
        }
        
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    // رویدادها
    onModelLoaded() {
        console.log('✅ مدل با موفقیت بارگذاری شد');
        const event = new CustomEvent('modelLoaded', { detail: { success: true } });
        window.dispatchEvent(event);
    }
    
    onProgress(percent) {
        console.log(`در حال بارگذاری: ${percent}%`);
    }
    
    onError(error) {
        console.error('❌ خطا:', error);
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
            this.container.removeChild(this.renderer.domElement);
        }
        
        window.removeEventListener('resize', this.handleResize);
    }
}

// ========== نمونه‌سازی برای صفحه اصلی ==========
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('hero3dContainer');
    if (!container) return;
    
    // حذف placeholder موقت (ولی اگر نمایشگر کار کند، خودش مدیریت می‌کند)
    const placeholder = document.getElementById('hero3dPlaceholder');
    
    // ایجاد نمایشگر سه‌بعدی با تنظیمات سفارشی
    const viewer = new Kelageri3DViewer('hero3dContainer', {
        backgroundColor: '#faf7f2',
        autoRotate: true,
        showGrid: true,
        rotateX: -Math.PI / 2,  // چرخش ۹۰ درجه برای مدل شما
        rotateY: 0,
        rotateZ: 0
    });
    
    // بارگذاری مدل خودتان
    viewer.loadModel('http://farl.ir/kelagari/models/Steampunk+Style+Chess.stl', 'stl');
    
    // ذخیره در پنجره برای دسترسی
    window.kelageriViewer = viewer;
});

// ========== صادرات کلاس ==========
export default Kelageri3DViewer;