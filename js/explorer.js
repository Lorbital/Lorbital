/**
 * Quantum Orbital Explorer - v10.0
 * 新特性：分类选择界面、meta.json颜色支持、新模型目录结构
 */

import * as THREE from 'three';
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MODEL_REGISTRY, getPlyUrl, loadMetadata, hasOrbitalModel, getActualModelId } from '../src/data/modelRegistry.js';
import { getOrbitalKnowledge } from '../src/data/orbitalKnowledge.js';
import { RenderController } from '../src/three/renderer.js';
import { GestureController } from '../src/components/GestureController.js';
import { ROTATION_SENSITIVITY, ZOOM_SENSITIVITY, MIN_SCALE, MAX_SCALE } from '../src/utils/constants.js';

let scene, camera, renderer, orbitalPoints, axesHelper, renderController;
const orbitalGroup = new THREE.Group();
const loader = new PLYLoader();

// 界面状态
let currentView = 'category'; // 'category', 'orbital', 'viewer'
let currentCategory = null;
let currentMetadata = null;

// --- 手势控制器 ---
let gestureController = null;

// 鼠标状态
let isMouseDown = false;
let lastMousePos = { x: 0, y: 0 };

const settings = {
    autoRotate: true,
    showAxes: true,
    particleSize: 0.012,
    rotationSpeed: 0.0025
    // 不使用默认颜色，完全使用PLY文件中的原始颜色
};
const invertRotationY = true;

init();

function init() {
    // 初始化界面
    initUI();
    
    // 初始化Three.js场景（但先隐藏）
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 15;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const container = document.getElementById('container');
    container.appendChild(renderer.domElement);
    container.style.display = 'none'; // 初始隐藏

    axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    scene.add(orbitalGroup);

    renderController = new RenderController(scene, camera, renderer, orbitalGroup, settings);
    renderController.start();

    initMouseEvents();
    initGUI();
    initGestureController();
    animate();

    window.addEventListener('resize', onWindowResize);
}

// 初始化UI界面
function initUI() {
    // 分类选择界面
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const type = card.dataset.type;
            showOrbitalList(type);
        });
    });

    // 返回按钮（轨道列表界面）
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', () => {
            showCategorySelector();
        });
    }
    
    // 返回按钮（查看器界面）
    const viewerBackButton = document.getElementById('viewer-back-button');
    if (viewerBackButton) {
        viewerBackButton.addEventListener('click', () => {
            if (currentCategory) {
                showOrbitalList(currentCategory);
            } else {
                showCategorySelector();
            }
        });
    }
}

// 显示分类选择界面
function showCategorySelector() {
    currentView = 'category';
    document.getElementById('category-selector').classList.remove('hidden');
    document.getElementById('orbital-selector').classList.add('hidden');
    document.getElementById('container').style.display = 'none';
    document.getElementById('instructions').classList.add('hidden');
    document.getElementById('orbital-tag').classList.add('hidden');
    document.getElementById('video-container').classList.add('hidden');
    document.getElementById('viewer-back-button').classList.add('hidden');
    
    // 隐藏GUI
    if (window.gui) {
        window.gui.hide();
    }
}

// 智能布局函数：根据轨道类型设置网格布局
function setupGridLayout(categoryType, orbitalList) {
    // 移除所有布局类
    orbitalList.classList.remove('orbital-list-s', 'orbital-list-p', 'orbital-list-d', 'orbital-list-f', 'orbital-list-g');
    
    // 根据类型添加对应的布局类
    switch(categoryType) {
        case 's':
            orbitalList.classList.add('orbital-list-s');
            orbitalList.style.gridTemplateColumns = 'repeat(4, 1fr)';
            orbitalList.style.gridTemplateRows = 'auto auto';
            break;
        case 'p':
            orbitalList.classList.add('orbital-list-p');
            orbitalList.style.gridTemplateColumns = 'repeat(3, 1fr)';
            orbitalList.style.gridTemplateRows = 'repeat(5, auto)';
            break;
        case 'd':
            orbitalList.classList.add('orbital-list-d');
            orbitalList.style.gridTemplateColumns = 'repeat(5, 1fr)';
            orbitalList.style.gridTemplateRows = 'repeat(4, auto)';
            break;
        case 'f':
            orbitalList.classList.add('orbital-list-f');
            orbitalList.style.gridTemplateColumns = 'repeat(7, 1fr)';
            orbitalList.style.gridTemplateRows = 'repeat(2, auto)';
            break;
        case 'g':
            orbitalList.classList.add('orbital-list-g');
            orbitalList.style.gridTemplateColumns = 'repeat(3, 1fr)';
            orbitalList.style.gridTemplateRows = 'repeat(3, auto)';
            break;
        default:
            // 默认布局
            orbitalList.style.gridTemplateColumns = 'repeat(auto-fill, minmax(150px, 1fr))';
            orbitalList.style.gridTemplateRows = 'auto';
    }
}

// 显示轨道列表
function showOrbitalList(categoryType) {
    currentView = 'orbital';
    currentCategory = categoryType;
    
    document.getElementById('category-selector').classList.add('hidden');
    document.getElementById('orbital-selector').classList.remove('hidden');
    document.getElementById('current-category-title').textContent = categoryType.toUpperCase();
    
    // 隐藏GUI
    if (window.gui) {
        window.gui.hide();
    }
    
    // 获取该分类下的所有轨道
    const orbitals = MODEL_REGISTRY[categoryType] || [];
    const orbitalList = document.getElementById('orbital-list');
    orbitalList.innerHTML = '';
    
    if (orbitals.length === 0) {
        orbitalList.innerHTML = '<div style="color: rgba(255,255,255,0.5); text-align: center; padding: 40px;">该分类下暂无可用模型</div>';
        return;
    }
    
    // 设置网格布局
    setupGridLayout(categoryType, orbitalList);
    
    orbitals.forEach(orbitalId => {
        const item = document.createElement('div');
        const hasModel = hasOrbitalModel(orbitalId);
        const actualModelId = getActualModelId(orbitalId);
        
        // P轨道的px/py已经有模型文件，不需要显示占位符
        const isPOrbital = /^\d+p[xyz]$/.test(orbitalId);
        
        if (!hasModel || (actualModelId === null && !isPOrbital)) {
            // 占位符轨道：不可点击，显示"即将推出"（P轨道除外）
            item.className = 'orbital-item orbital-item-placeholder';
            item.innerHTML = `
                <div class="orbital-item-name" style="opacity: 0.5;">${formatOrbitalName(orbitalId)}</div>
                <div style="font-size: 12px; color: rgba(255,255,255,0.3); margin-top: 8px;">即将推出</div>
            `;
            item.style.cursor = 'not-allowed';
            item.style.opacity = '0.5';
        } else {
            // 实际存在的轨道：可点击
            item.className = 'orbital-item';
            item.innerHTML = `
                <div class="orbital-item-name">${formatOrbitalName(orbitalId)}</div>
                <button class="knowledge-button" data-orbital-id="${orbitalId}" title="查看知识卡片">
                    <span style="font-size: 16px;">ℹ️</span>
                </button>
            `;
            item.addEventListener('click', (e) => {
                // 如果点击的是知识按钮，不加载轨道
                if (e.target.closest('.knowledge-button')) {
                    e.stopPropagation();
                    showKnowledgeCard(orbitalId);
                    return;
                }
                loadOrbital(actualModelId || orbitalId);
            });
            
            // 知识按钮事件
            const knowledgeBtn = item.querySelector('.knowledge-button');
            if (knowledgeBtn) {
                knowledgeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showKnowledgeCard(orbitalId);
                });
            }
        }
        
        orbitalList.appendChild(item);
    });
}

// 格式化轨道名称显示（区分大小写，使用科学命名法）
function formatOrbitalName(orbitalId) {
    let formatted = orbitalId;
    
    // 先处理特殊字符
    formatted = formatted.replace(/\+/g, '+');
    formatted = formatted.replace(/\(/g, '(');
    formatted = formatted.replace(/\)/g, ')');
    
    // 科学命名法替换（按顺序，从具体到一般）
    // G轨道
    formatted = formatted.replace(/5g_gz4/g, '5g (gz⁴)');
    formatted = formatted.replace(/5g_gxz3/g, '5g (gxz³)');
    formatted = formatted.replace(/5g_gyz3/g, '5g (gyz³)');
    formatted = formatted.replace(/5g_gz2x2-y2/g, '5g (gz²(x²-y²))');
    formatted = formatted.replace(/5g_gxyz2/g, '5g (gxyz²)');
    formatted = formatted.replace(/5g_gxzx2-3y2/g, '5g (gxz(x²-3y²))');
    formatted = formatted.replace(/5g_gyzy2-3x2/g, '5g (gyz(y²-3x²))');
    formatted = formatted.replace(/5g_gx4\+y4/g, '5g (gx⁴+y⁴)');
    formatted = formatted.replace(/5g_gxyx2-y2/g, '5g (gxy(x²-y²))');
    
    // F轨道
    formatted = formatted.replace(/4f_fz3/g, '4f (fz³)');
    formatted = formatted.replace(/5f_fz3/g, '5f (fz³)');
    formatted = formatted.replace(/4f_fxz2/g, '4f (fxz²)');
    formatted = formatted.replace(/5f_fxz2/g, '5f (fxz²)');
    formatted = formatted.replace(/4f_fyz2/g, '4f (fyz²)');
    formatted = formatted.replace(/5f_fyz2/g, '5f (fyz²)');
    formatted = formatted.replace(/4f_fxyz/g, '4f (fxyz)');
    formatted = formatted.replace(/5f_fxyz/g, '5f (fxyz)');
    formatted = formatted.replace(/4f_fx\(x2-3y2\)/g, '4f (fx(x²-3y²))');
    formatted = formatted.replace(/5f_fx\(x2-3y2\)/g, '5f (fx(x²-3y²))');
    formatted = formatted.replace(/4f_fy\(x2-z2\)/g, '4f (fy(x²-z²))');
    formatted = formatted.replace(/5f_fy\(x2-z2\)/g, '5f (fy(x²-z²))');
    formatted = formatted.replace(/4f_fzx2-y2/g, '4f (fz(x²-y²))');
    formatted = formatted.replace(/5f_fzx2-y2/g, '5f (fz(x²-y²))');
    
    // D轨道
    formatted = formatted.replace(/(\d+)d_dxz/g, '$1d (dxz)');
    formatted = formatted.replace(/(\d+)d_dyz/g, '$1d (dyz)');
    formatted = formatted.replace(/(\d+)d_dz2/g, '$1d (dz²)');
    formatted = formatted.replace(/(\d+)d_dx2-y2/g, '$1d (dx²-y²)');
    formatted = formatted.replace(/(\d+)d_dxy/g, '$1d (dxy)');
    
    // P轨道
    formatted = formatted.replace(/(\d+)px/g, '$1px');
    formatted = formatted.replace(/(\d+)py/g, '$1py');
    formatted = formatted.replace(/(\d+)pz/g, '$1pz');
    
    // 将下划线替换为空格（对于未处理的格式）
    formatted = formatted.replace(/_/g, ' ');
    
    return formatted;
}

// 加载轨道模型
async function loadOrbital(orbitalId) {
    try {
        // 显示加载状态
        const loadingEl = document.getElementById('loading');
        loadingEl.classList.remove('hidden');
        loadingEl.textContent = '量子态同步中...';

        // 获取实际模型ID（处理P轨道映射等）
        const actualModelId = getActualModelId(orbitalId) || orbitalId;
        
        // 加载元数据（包含颜色信息）
        currentMetadata = await loadMetadata(actualModelId);
        
        // 更新轨道名称显示（使用科学命名法）
        const nameEl = document.getElementById('orbital-name');
        if (nameEl) {
            // 使用格式化函数，保持科学命名法的正确大小写
            nameEl.textContent = formatOrbitalName(orbitalId);
        }

        // 加载PLY文件
        const plyUrl = getPlyUrl(actualModelId);
        console.log('Loading PLY from URL:', plyUrl);
        console.log('Orbital ID:', orbitalId, 'Actual Model ID:', actualModelId);
        
        console.log('Starting PLYLoader.load() with URL:', plyUrl);
        loader.load(plyUrl, (geometry) => {
            console.log('PLY file loaded successfully!', geometry);
            console.log('Success callback executed!');
            // 确保geometry存在
            if (!geometry) {
                console.error('Geometry is null or undefined');
                loadingEl.textContent = '加载失败：模型文件格式错误';
                loadingEl.classList.remove('hidden');
                return;
            }
            
            console.log(`Geometry loaded: ${geometry.attributes.position.count} vertices`);
            
            orbitalGroup.clear();
            geometry.center();
            
            // 检查PLY文件是否包含颜色信息
            const hasColors = geometry.attributes.color !== undefined;
            
            let material;
            if (hasColors) {
                // 使用PLY文件中的原始颜色（vertexColors会自动使用PLY文件中的颜色）
                material = new THREE.PointsMaterial({ 
                    size: settings.particleSize, 
                    vertexColors: true, // 使用顶点颜色，这是关键
                    transparent: true, 
                    opacity: currentMetadata?.opacity || 0.8, 
                    blending: THREE.AdditiveBlending, 
                    depthWrite: false 
                });
            } else {
                // 如果PLY文件没有颜色信息（应该不会发生，因为模型都有颜色）
                // 使用白色作为后备，但这种情况不应该出现
                const opacity = currentMetadata?.opacity || 0.8;
                material = new THREE.PointsMaterial({ 
                    size: settings.particleSize, 
                    color: 0xffffff, // 白色作为后备（不应该用到）
                    transparent: true, 
                    opacity: opacity, 
                    blending: THREE.AdditiveBlending, 
                    depthWrite: false 
                });
                console.warn(`PLY file for ${orbitalId} has no color information`);
            }
            
            try {
                orbitalPoints = new THREE.Points(geometry, material);
                orbitalGroup.add(orbitalPoints);
                console.log('OrbitalPoints created and added to scene');
                
                // 应用推荐缩放
                if (currentMetadata?.recommendedScale) {
                    if (renderController) {
                        renderController.targetScale = currentMetadata.recommendedScale;
                        renderController.currentScale = currentMetadata.recommendedScale;
                    }
                    orbitalGroup.scale.setScalar(currentMetadata.recommendedScale);
                }
                
                console.log('Model loaded successfully, hiding loading indicator');
                console.log('OrbitalPoints in scene:', orbitalGroup.children.length);
                
                // 确保加载提示完全清除
                loadingEl.textContent = '';
                loadingEl.classList.add('hidden');
                
                // 显示查看器界面
                console.log('Calling showViewer()');
                showViewer();
                
                // 重置相机位置和旋转
                if (camera) {
                    camera.position.set(0, 0, 15);
                    camera.lookAt(0, 0, 0);
                }
                const initialScale = currentMetadata?.recommendedScale || 1.0;
                if (renderController) {
                    renderController.targetQuaternion.set(0, 0, 0, 1);
                    renderController.currentQuaternion.set(0, 0, 0, 1);
                    renderController.targetScale = initialScale;
                    renderController.currentScale = initialScale;
                }
                if (orbitalGroup) {
                    orbitalGroup.quaternion.set(0, 0, 0, 1);
                    orbitalGroup.scale.setScalar(initialScale);
                    orbitalGroup.position.set(0, 0, 0);
                }
                
                // 强制渲染一次，确保模型显示
                setTimeout(() => {
                    if (renderer && scene && camera) {
                        renderer.render(scene, camera);
                        console.log('Forced render after model load');
                        console.log('Camera position:', camera.position);
                        console.log('OrbitalGroup position:', orbitalGroup.position);
                        console.log('OrbitalGroup scale:', orbitalGroup.scale);
                    }
                }, 100);
            } catch (renderError) {
                console.error('Error creating or rendering orbital points:', renderError);
                loadingEl.textContent = `渲染失败: ${renderError.message}`;
                loadingEl.classList.remove('hidden');
            }
        }, (progress) => {
            // 加载进度回调
            if (progress && progress.total > 0) {
                const percent = Math.round((progress.loaded / progress.total) * 100);
                console.log(`Loading progress: ${percent}% (${progress.loaded}/${progress.total} bytes)`);
                loadingEl.textContent = `量子态同步中... ${percent}%`;
                loadingEl.classList.remove('hidden');
            }
        }, (error) => {
            console.error('Failed to load model:', error);
            console.error('Failed URL:', plyUrl);
            console.error('Error details:', error.message || error);
            loadingEl.textContent = `加载失败: ${error.message || '请检查模型文件'}`;
            loadingEl.classList.remove('hidden');
        });
        
    } catch (error) {
        console.error('Failed to load orbital:', error);
        const loadingEl = document.getElementById('loading');
        loadingEl.textContent = '加载失败: ' + error.message;
    }
}

// 显示查看器界面
function showViewer() {
    currentView = 'viewer';
    document.getElementById('category-selector').classList.add('hidden');
    document.getElementById('orbital-selector').classList.add('hidden');
    
    const container = document.getElementById('container');
    container.style.display = 'block';
    container.style.visibility = 'visible';
    container.style.opacity = '1';
    
    document.getElementById('instructions').classList.remove('hidden');
    document.getElementById('orbital-tag').classList.remove('hidden');
    document.getElementById('video-container').classList.remove('hidden');
    document.getElementById('viewer-back-button').classList.remove('hidden');
    
    // 确保加载提示完全隐藏
    const loadingEl = document.getElementById('loading');
    if (loadingEl) {
        loadingEl.textContent = '';
        loadingEl.classList.add('hidden');
    }
    
    // 显示GUI（如果存在）
    if (window.gui) {
        console.log('Showing GUI...');
        // 确保GUI元素在DOM中
        if (!window.gui.domElement.parentElement) {
            document.body.appendChild(window.gui.domElement);
            console.log('GUI element appended to body in showViewer');
        }
        window.gui.show();
        console.log('GUI shown, element:', window.gui.domElement);
        console.log('GUI visible:', window.gui.domElement.style.display !== 'none');
        console.log('GUI children count:', window.gui.domElement.children.length);
        // 强制更新GUI显示
        if (window.gui.domElement.children.length === 0) {
            console.warn('GUI has no children, may need to reinitialize');
        }
        console.log('GUI children count:', window.gui.domElement.children.length);
    } else {
        console.error('GUI not found! window.gui is:', window.gui);
    }
    
    // 确保渲染器大小正确
    if (renderer) {
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // 更新相机宽高比
    if (camera) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
    
    console.log('Viewer shown, currentView:', currentView);
    console.log('Container display:', container.style.display);
    console.log('Settings autoRotate:', settings.autoRotate);
    console.log('OrbitalGroup exists:', !!orbitalGroup);
    console.log('OrbitalGroup children:', orbitalGroup ? orbitalGroup.children.length : 0);
}

// --- 鼠标交互 ---
function initMouseEvents() {
    const container = document.getElementById('container');
    
    container.addEventListener('mousedown', (e) => {
        if (currentView !== 'viewer' || !renderController) return;
        // 允许在任何容器内点击，不限制为CANVAS
        isMouseDown = true;
        lastMousePos = { x: e.clientX, y: e.clientY };
        renderController.setInteracting(true);
        console.log('Mouse down, starting drag');
        e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
        if (currentView !== 'viewer' || !renderController) return;
        if (!isMouseDown) return;
        const deltaX = e.clientX - lastMousePos.x;
        const deltaY = e.clientY - lastMousePos.y;
        const rotationDeltaX = deltaX * ROTATION_SENSITIVITY;
        const rotationDeltaY = (invertRotationY ? deltaY : -deltaY) * ROTATION_SENSITIVITY;
        renderController.setTargetRotation(rotationDeltaX, rotationDeltaY);
        lastMousePos = { x: e.clientX, y: e.clientY };
        e.preventDefault();
    });

    window.addEventListener('mouseup', () => {
        if (isMouseDown) {
            console.log('Mouse up, ending drag');
        }
        isMouseDown = false;
        if (renderController) {
            renderController.setInteracting(false);
        }
    });

    window.addEventListener('wheel', (e) => {
        if (currentView !== 'viewer' || !renderController) return;
        e.preventDefault();
        const zoomDelta = -e.deltaY * ZOOM_SENSITIVITY;
        const currentScale = renderController.targetScale;
        const newScale = currentScale + zoomDelta;
        const clampedScale = THREE.MathUtils.clamp(newScale, MIN_SCALE, MAX_SCALE);
        renderController.setTargetScale(clampedScale);
        renderController.setInteracting(true);
        setTimeout(() => {
            renderController.setInteracting(false);
        }, 100);
        console.log('Wheel zoom, new scale:', clampedScale);
    }, { passive: false });
    
    // ESC键返回分类选择
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (currentView === 'viewer') {
                showCategorySelector();
            } else if (currentView === 'orbital') {
                showCategorySelector();
            }
        }
    });
}

// --- 手势交互 ---
async function initGestureController() {
    const videoElement = document.getElementById('input_video');
    if (!videoElement) {
        console.warn('Gesture video element not found');
        return;
    }

    const viewerAdapter = {
        getRenderController: () => (currentView === 'viewer' ? renderController : null)
    };

    gestureController = new GestureController(videoElement, viewerAdapter, { enabled: true, invertRotationY });
    await gestureController.init();
    gestureController.start();
}

function animate() {
    requestAnimationFrame(animate);
    
    // 始终渲染，但只在viewer模式下更新模型
    if (currentView === 'viewer') {
        // 自动旋转
        if (renderController && !renderController.isInteracting && !isMouseDown && settings.autoRotate) {
            renderController.setTargetRotation(settings.rotationSpeed, 0);
        }

        if (axesHelper) {
            axesHelper.visible = settings.showAxes;
        }
    }
}

let gui = null;

function initGUI() {
    try {
        console.log('Initializing GUI...');
        gui = new GUI({ title: '⚛️ 实验控制台' });
        gui.domElement.style.zIndex = '1000';
        gui.domElement.style.position = 'fixed';
        gui.domElement.style.top = '70px'; // 贴在导航栏下方
        gui.domElement.style.right = '10px';
        
        // 初始隐藏GUI
        gui.hide();
        
        // 存储到全局，方便控制显示/隐藏
        window.gui = gui;
        
        console.log('GUI created, adding controls...');
        
        const visualFolder = gui.addFolder('渲染设置');
        visualFolder.open();
        // 移除颜色选项，使用PLY文件原始颜色
        visualFolder.add(settings, 'particleSize', 0.005, 0.05).name('粒子粒径').onChange(v => {
            console.log('Particle size changed to:', v);
            if (orbitalPoints && orbitalPoints.material) {
                orbitalPoints.material.size = v;
            }
        });
        visualFolder.add(settings, 'showAxes').name('显示坐标').onChange(v => {
            console.log('Show axes changed to:', v);
            if (axesHelper) {
                axesHelper.visible = v;
            }
        });

        const motionFolder = gui.addFolder('运动动力学');
        motionFolder.open();
        motionFolder.add(settings, 'autoRotate').name('自转巡航').onChange(v => {
            console.log('AutoRotate changed to:', v);
            settings.autoRotate = v;
        });
        motionFolder.add(settings, 'rotationSpeed', 0.001, 0.01).name('旋转速度').onChange(v => {
            console.log('RotationSpeed changed to:', v);
            settings.rotationSpeed = v;
        });
        
        console.log('GUI initialized successfully');
        console.log('GUI element:', gui.domElement);
        console.log('GUI children:', gui.domElement.children.length);
        console.log('Settings object:', settings);
        
        // 确保GUI元素被添加到页面
        if (!gui.domElement.parentElement) {
            document.body.appendChild(gui.domElement);
            console.log('GUI element appended to body');
        }
    } catch (error) {
        console.error('Failed to initialize GUI:', error);
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// 显示知识卡片
function showKnowledgeCard(orbitalId) {
    const knowledge = getOrbitalKnowledge(orbitalId);
    const card = document.getElementById('knowledge-card');
    const content = document.getElementById('knowledge-content');
    const closeBtn = document.getElementById('knowledge-close');
    
    if (!knowledge) {
        console.warn(`No knowledge data for orbital: ${orbitalId}`);
        return;
    }
    
    // 构建知识卡片内容
    let html = `<div class="knowledge-title">${knowledge.title}</div>`;
    
    // 基本信息部分
    html += '<div class="knowledge-section">';
    html += '<div class="knowledge-section-title">基本信息</div>';
    html += `<div class="knowledge-item">
        <div class="knowledge-item-label">量子数</div>
        <div class="knowledge-item-value">
            n = <strong>${knowledge.basicInfo.quantumNumbers.n}</strong>, 
            l = <strong>${knowledge.basicInfo.quantumNumbers.l}</strong>, 
            m = <strong>${knowledge.basicInfo.quantumNumbers.m}</strong>
        </div>
    </div>`;
    html += `<div class="knowledge-item">
        <div class="knowledge-item-label">轨道类型</div>
        <div class="knowledge-item-value">${knowledge.basicInfo.orbitalType}</div>
    </div>`;
    html += `<div class="knowledge-item">
        <div class="knowledge-item-label">描述</div>
        <div class="knowledge-item-value">${knowledge.basicInfo.description}</div>
    </div>`;
    html += '</div>';
    
    // 形状特征部分
    html += '<div class="knowledge-section">';
    html += '<div class="knowledge-section-title">形状特征</div>';
    html += `<div class="knowledge-item">
        <div class="knowledge-item-label">形状</div>
        <div class="knowledge-item-value">${knowledge.shapeFeatures.shape}</div>
    </div>`;
    html += `<div class="knowledge-item">
        <div class="knowledge-item-label">对称性</div>
        <div class="knowledge-item-value">${knowledge.shapeFeatures.symmetry}</div>
    </div>`;
    html += `<div class="knowledge-item">
        <div class="knowledge-item-label">节点数</div>
        <div class="knowledge-item-value">${knowledge.shapeFeatures.nodes}</div>
    </div>`;
    html += '</div>';
    
    content.innerHTML = html;
    card.classList.remove('hidden');
    
    // 关闭按钮事件
    closeBtn.onclick = () => {
        card.classList.add('hidden');
    };
    
    // 点击外部区域关闭（可选）
    card.onclick = (e) => {
        if (e.target === card) {
            card.classList.add('hidden');
        }
    };
}
