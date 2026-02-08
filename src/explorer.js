/**
 * Quantum Orbital Explorer - v10.0
 * 新特性：分类选择界面、meta.json颜色支持、新模型目录结构
 */

import * as THREE from 'three';
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { MODEL_REGISTRY, getPlyUrl, loadMetadata, hasOrbitalModel, getActualModelId } from './data/modelRegistry.js';
import { getOrbitalKnowledge } from './data/orbitalKnowledge.js';
import { RenderController } from './three/renderer.js';
import { GestureController } from './components/GestureController.js';
import { HandTracker } from './gesture/handTracker.js';
import { GestureState } from './gesture/gestureMapping.js';
import { ROTATION_SENSITIVITY, ZOOM_SENSITIVITY, MIN_SCALE, MAX_SCALE } from './utils/constants.js';

let scene, camera, renderer, orbitalPoints, renderController, axesHelper, css2DRenderer;
const orbitalGroup = new THREE.Group();
const loader = new PLYLoader();

// 界面状态
let currentView = 'category'; // 'category', 'orbital', 'viewer'
let currentCategory = null;
let currentMetadata = null;
let currentOrbitalId = null; // 当前查看的轨道 id，用于同分类切换与信息按钮
let lastErrorOrbitalId = null;
let lastErrorOpts = null;
let cameraVisible = true; // 摄像头显示状态

// --- 手势控制器 ---
let gestureController = null;
// --- 教程手势跟踪器 ---
let tutorialHandTracker = null;
let tutorialDemoCircle = null;
let tutorialLastPalmPos = null;
let tutorialRotationY = 0;
let tutorialRotationX = 0;

// 动画循环 id，用于 visibility 暂停与页面卸载时取消
let animateId = null;

// 页面卸载时是否已执行清理，避免重复
let pageUnloadCleaned = false;

// 鼠标状态
let isMouseDown = false;
let lastMousePos = { x: 0, y: 0 };

const settings = {
    autoRotate: true,
    showAxes: true,
    particleSize: 0.0275,
    rotationSpeed: 0.0105
    // 不使用默认颜色，完全使用PLY文件中的原始颜色
};
const invertRotationY = true;

// --- 手势教程功能常量 ---
const TUTORIAL_STORAGE_KEY = 'lorbital_tutorial_shown';
const TUTORIAL_TOTAL_STEPS = 3;

init();

function init() {
    // 每次页面加载时清除教程标记，确保刷新后能再次显示教程
    sessionStorage.removeItem(TUTORIAL_STORAGE_KEY);
    
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

    css2DRenderer = new CSS2DRenderer();
    css2DRenderer.setSize(window.innerWidth, window.innerHeight);
    css2DRenderer.domElement.style.pointerEvents = 'none';
    css2DRenderer.domElement.style.position = 'absolute';
    css2DRenderer.domElement.style.left = '0';
    css2DRenderer.domElement.style.top = '0';
    container.appendChild(css2DRenderer.domElement);

    scene.add(orbitalGroup);

    renderController = new RenderController(scene, camera, renderer, orbitalGroup, settings, { css2DRenderer });
    renderController.start();

    initMouseEvents();
    initTouchEvents();
    initExperimentConsole();
    initGestureController();
    animate();

    window.addEventListener('resize', onWindowResize);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            pauseBackgroundWork();
        } else {
            resumeBackgroundWork();
        }
    });

    window.addEventListener('pagehide', onPageUnload);
    window.addEventListener('beforeunload', onPageUnload);

    if (document.hidden) pauseBackgroundWork();

    // i18n: re-apply translations when language changes
    if (window.I18N && window.I18N.onLangChange) {
        window.I18N.onLangChange(() => {
            window.I18N.applyI18n();
            // Re-render orbital list if visible
            if (currentView === 'orbital' && currentCategory) {
                showOrbitalList(currentCategory);
            }
            // Re-render knowledge card if visible
            if (currentView === 'viewer' && currentOrbitalId) {
                const knowledgeCard = document.getElementById('knowledge-card');
                if (knowledgeCard && !knowledgeCard.classList.contains('hidden')) {
                    showKnowledgeCard(currentOrbitalId);
                }
            }
            // Update tutorial button text if visible
            const nextBtn = document.getElementById('gesture-tutorial-next');
            if (nextBtn) {
                nextBtn.textContent = tutorialCurrentStep === TUTORIAL_TOTAL_STEPS ? t('explorer.tutorialDone') : t('explorer.tutorialNext');
            }
        });
    }
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

    // 摄像头关闭/开启按钮
    const videoCloseBtn = document.getElementById('video-close-btn');
    if (videoCloseBtn) {
        videoCloseBtn.addEventListener('click', () => toggleCamera(false));
    }
    const cameraToggleCard = document.getElementById('camera-toggle-card');
    if (cameraToggleCard) {
        cameraToggleCard.addEventListener('click', () => toggleCamera(true));
    }

    // 加载遮罩：重试、返回
    const retryBtn = document.getElementById('loading-retry');
    const backBtn = document.getElementById('loading-back');
    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            if (lastErrorOrbitalId != null) loadOrbital(lastErrorOrbitalId, lastErrorOpts || {});
        });
    }
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            hideLoadingOverlay();
            if (currentCategory) showOrbitalList(currentCategory);
            else showCategorySelector();
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
    const cameraCard = document.getElementById('camera-toggle-card');
    if (cameraCard) cameraCard.classList.add('hidden');
    const consoleEl = document.getElementById('experiment-console');
    if (consoleEl) consoleEl.classList.add('hidden');
    
    // 隐藏 viewer 页面信息按钮和知识卡片
    const viewerKnowledgeButton = document.getElementById('viewer-knowledge-button');
    if (viewerKnowledgeButton) {
        viewerKnowledgeButton.classList.add('hidden');
    }
    const knowledgeCard = document.getElementById('knowledge-card');
    if (knowledgeCard) {
        knowledgeCard.classList.add('hidden');
    }
    
    if (gestureController) gestureController.stop();
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
    
    const consoleEl = document.getElementById('experiment-console');
    if (consoleEl) consoleEl.classList.add('hidden');
    
    if (gestureController) gestureController.stop();
    
    // 获取该分类下的所有轨道
    const orbitals = MODEL_REGISTRY[categoryType] || [];
    const orbitalList = document.getElementById('orbital-list');
    orbitalList.innerHTML = '';
    
    if (orbitals.length === 0) {
        orbitalList.innerHTML = '<div style="color: rgba(255,255,255,0.5); text-align: center; padding: 40px;">' + t('explorer.noModels') + '</div>';
        return;
    }
    
    // 设置网格布局
    setupGridLayout(categoryType, orbitalList);
    
    // 隐藏 viewer 页面信息按钮和知识卡片
    const viewerKnowledgeButton = document.getElementById('viewer-knowledge-button');
    if (viewerKnowledgeButton) {
        viewerKnowledgeButton.classList.add('hidden');
    }
    const knowledgeCard = document.getElementById('knowledge-card');
    if (knowledgeCard) {
        knowledgeCard.classList.add('hidden');
    }
    
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
                <div style="font-size: 12px; color: rgba(255,255,255,0.3); margin-top: 8px;">${t('explorer.comingSoon')}</div>
            `;
            item.style.cursor = 'not-allowed';
            item.style.opacity = '0.5';
        } else {
            // 实际存在的轨道：可点击
            item.className = 'orbital-item';
            item.innerHTML = `
                <div class="orbital-item-name">${formatOrbitalName(orbitalId)}</div>
            `;
            item.addEventListener('click', () => {
                loadOrbital(actualModelId || orbitalId);
            });
        }
        
        orbitalList.appendChild(item);
    });
}

// 格式化轨道名称显示。新 ID：d/f/g 为 {n}d|f|g_{suffix}，如 3d_z2 → 3d<sub>z²</sub>
function formatOrbitalName(orbitalId, asHtml = true) {
    function toSub(s) { return s.replace(/2/g, '²').replace(/3/g, '³').replace(/4/g, '⁴'); }
    
    // 处理 d/f/g 轨道: {n}{type}_{suffix}
    const m = orbitalId.match(/^(\d+)([dfg])_(.+)$/);
    if (m) {
        const n = m[1];
        const type = m[2];
        const suffix = toSub(m[3]);
        if (asHtml) return `${n}${type}<sub>${suffix}</sub>`;
        // 对于非 HTML 环境（如 <select> 选项），移除括号以使其看起来更紧凑，并使用 Unicode 上标
        return `${n}${type}${suffix}`;
    }
    
    // 处理 p 轨道: {n}p{x|y|z}
    const pMatch = orbitalId.match(/^(\d+p)([xyz])$/);
    if (pMatch) {
        if (asHtml) return `${pMatch[1]}<sub>${pMatch[2]}</sub>`;
        return `${pMatch[1]}${pMatch[2]}`;
    }
    
    // 处理 s 轨道或其他
    return orbitalId;
}

// 与 orbital-list 可点击项、loadOrbital 参数一致，用于查看器内上一/下一轨道
function getNavigableOrbitalIds(category) {
    const raw = MODEL_REGISTRY[category] || [];
    return raw.filter(id => {
        if (!hasOrbitalModel(id)) return false;
        const a = getActualModelId(id);
        return a != null || /^\d+p[xyz]$/.test(id);
    }).map(id => getActualModelId(id) || id);
}

// --- 加载遮罩 overlay 辅助 ---
function hideLoadingOverlay() {
    document.getElementById('loading-overlay').classList.add('hidden');
}
function showLoadingOverlay(orbitalId) {
    const o = document.getElementById('loading-overlay');
    const txt = document.getElementById('loading-text');
    const name = document.getElementById('loading-orbital-name');
    const bar = document.getElementById('loading-progress-bar');
    const pct = document.getElementById('loading-percent');
    const err = document.getElementById('loading-error');
    const act = document.getElementById('loading-actions');
    const wrap = document.getElementById('loading-progress-wrap');
    txt.textContent = t('explorer.loadingSync');
    name.innerHTML = formatOrbitalName(orbitalId);
    name.style.display = '';
    bar.classList.add('indeterminate');
    bar.style.width = '';
    pct.classList.add('hidden');
    pct.textContent = '';
    err.classList.add('hidden');
    act.classList.add('hidden');
    wrap.style.display = '';
    o.classList.remove('hidden');
}
function updateLoadingProgress(progress) {
    const bar = document.getElementById('loading-progress-bar');
    const pct = document.getElementById('loading-percent');
    if (progress && progress.total > 0) {
        bar.classList.remove('indeterminate');
        const ratio = Math.min(1, progress.loaded / progress.total);
        bar.style.width = (ratio * 100) + '%';
        pct.textContent = Math.round(ratio * 100) + '%';
        pct.classList.remove('hidden');
    }
}
function showLoadingError(msg, orbitalId, opts) {
    lastErrorOrbitalId = orbitalId;
    lastErrorOpts = opts || {};
    const txt = document.getElementById('loading-text');
    const name = document.getElementById('loading-orbital-name');
    const wrap = document.getElementById('loading-progress-wrap');
    const pct = document.getElementById('loading-percent');
    const err = document.getElementById('loading-error');
    const act = document.getElementById('loading-actions');
    const bar = document.getElementById('loading-progress-bar');
    txt.textContent = t('explorer.loadFailed');
    name.innerHTML = formatOrbitalName(orbitalId);
    name.style.display = '';
    bar.classList.remove('indeterminate');
    wrap.style.display = 'none';
    pct.classList.add('hidden');
    err.textContent = msg;
    err.classList.remove('hidden');
    act.classList.remove('hidden');
    document.getElementById('loading-overlay').classList.remove('hidden');
}

// 加载轨道模型；opts.isSwitch 为同分类切换，不显示全屏 loading、不重复 showViewer
async function loadOrbital(orbitalId, opts = {}) {
    try {
        if (!opts.isSwitch) showLoadingOverlay(orbitalId);

        // 获取实际模型ID（处理P轨道映射等）
        const actualModelId = getActualModelId(orbitalId) || orbitalId;
        
        // 加载元数据（包含颜色信息）
        currentMetadata = await loadMetadata(actualModelId);
        
        // 更新轨道名称显示（使用科学命名法）
        const nameEl = document.getElementById('orbital-name');
        if (nameEl) {
            // 使用格式化函数，保持科学命名法的正确大小写
            nameEl.innerHTML = formatOrbitalName(orbitalId);
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
                showLoadingError(t('explorer.modelFormatError'), orbitalId, opts);
                return;
            }
            
            console.log(`Geometry loaded: ${geometry.attributes.position.count} vertices`);

            // 更新加载文本，提示正在处理模型
            if (!opts.isSwitch) {
                const txt = document.getElementById('loading-text');
                if (txt) txt.textContent = t('explorer.loadingProcess');
                const bar = document.getElementById('loading-progress-bar');
                const pct = document.getElementById('loading-percent');
                if (bar) {
                    bar.classList.remove('indeterminate');
                    bar.style.width = '100%';
                }
                if (pct) {
                    pct.textContent = '100%';
                    pct.classList.remove('hidden');
                }
            }

            // 使用 requestAnimationFrame 分帧处理，避免阻塞UI
            requestAnimationFrame(() => {
                try {
                    // 清理旧模型
                    orbitalGroup.children.slice().forEach((child) => {
                        if (child.isPoints && child.geometry) { child.geometry.dispose(); }
                        if (child.isPoints && child.material) child.material.dispose();
                        if (child.userData?.isAxesHelper) disposeAxesGroup(child);
                    });
                    orbitalGroup.clear();

                    // 分帧执行耗时操作：几何处理
                    requestAnimationFrame(() => {
                        try {
                            geometry.center();
                            geometry.computeBoundingSphere();
                            const L = Math.max(geometry.boundingSphere.radius * 1.2, 0.5);

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
                                    blending: THREE.NormalBlending, 
                                    depthWrite: false 
                                });
                                material.userData.baseOpacity = currentMetadata?.opacity || 0.8;
                            } else {
                                // 如果PLY文件没有颜色信息（应该不会发生，因为模型都有颜色）
                                // 使用白色作为后备，但这种情况不应该出现
                                const opacity = currentMetadata?.opacity || 0.8;
                                material = new THREE.PointsMaterial({ 
                                    size: settings.particleSize, 
                                    color: 0xffffff, // 白色作为后备（不应该用到）
                                    transparent: true, 
                                    opacity: opacity, 
                                    blending: THREE.NormalBlending, 
                                    depthWrite: false 
                                });
                                material.userData.baseOpacity = opacity;
                                console.warn(`PLY file for ${orbitalId} has no color information`);
                            }
                            
                            // 再分一帧创建和添加模型
                            requestAnimationFrame(() => {
                                try {
                                    orbitalPoints = new THREE.Points(geometry, material);
                                    orbitalGroup.add(orbitalPoints);
                                    axesHelper = createAxesHelper(L);
                                    axesHelper.visible = settings.showAxes;
                                    setAxesLabelsVisibility(settings.showAxes);
                                    orbitalGroup.add(axesHelper);
                                    console.log('OrbitalPoints created and added to scene');

                                    // 应用推荐缩放
                                    if (currentMetadata?.recommendedScale) {
                                        if (renderController) {
                                            renderController.targetScale = currentMetadata.recommendedScale;
                                            renderController.currentScale = currentMetadata.recommendedScale;
                                        }
                                        orbitalGroup.scale.setScalar(currentMetadata.recommendedScale);
                                    }
                                    
                                    currentOrbitalId = orbitalId;
                                    
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
                                    requestAnimationFrame(() => {
                                        if (renderer && scene && camera) {
                                            renderer.render(scene, camera);
                                            console.log('Forced render after model load');
                                        }
                                        
                                        // 所有处理完成，隐藏加载遮罩并显示查看器
                                        if (!opts.isSwitch) {
                                            hideLoadingOverlay();
                                            showViewer(opts);
                                        }
                                        const orbitalSelect = document.getElementById('experiment-console-orbital-select');
                                        if (orbitalSelect) orbitalSelect.value = currentOrbitalId;
                                    });
                                } catch (renderError) {
                                    console.error('Error creating or rendering orbital points:', renderError);
                                    showLoadingError(`${t('explorer.renderFailed')}: ${renderError.message}`, orbitalId, opts);
                                }
                            });
                        } catch (processError) {
                            console.error('Error processing geometry:', processError);
                            showLoadingError(`${t('explorer.processFailed')}: ${processError.message}`, orbitalId, opts);
                        }
                    });
                } catch (cleanupError) {
                    console.error('Error cleaning up old model:', cleanupError);
                    showLoadingError(`${t('explorer.cleanupFailed')}: ${cleanupError.message}`, orbitalId, opts);
                }
            });
        }, (progress) => {
            if (!opts.isSwitch) updateLoadingProgress(progress);
            if (progress && progress.total > 0) {
                console.log(`Loading progress: ${Math.round((progress.loaded / progress.total) * 100)}% (${progress.loaded}/${progress.total} bytes)`);
            }
        }, (error) => {
            console.error('Failed to load model:', error);
            console.error('Failed URL:', plyUrl);
            console.error('Error details:', error.message || error);
            showLoadingError(error?.message || t('explorer.checkModel'), orbitalId, opts);
        });
        
    } catch (error) {
        console.error('Failed to load orbital:', error);
        showLoadingError(error.message, orbitalId, opts);
    }
}

function createAxesHelper(L) {
    const group = new THREE.Group();
    group.userData.isAxesHelper = true;

    const r = 0.028 * L;  // 缩小30%: 0.04 * 0.7
    const h = 0.07 * L;    // 缩小30%: 0.1 * 0.7

    // 三条粗线：Line2 + LineGeometry + LineMaterial
    const geomX = new LineGeometry().setPositions([0, 0, 0, L, 0, 0]);
    const matX = new LineMaterial({ color: 0xff0000, linewidth: 2 });
    matX.resolution.set(renderer.domElement.width, renderer.domElement.height);
    const lineX = new Line2(geomX, matX);
    lineX.renderOrder = 1;
    lineX.onBeforeRender = () => { matX.resolution.set(renderer.domElement.width, renderer.domElement.height); };
    group.add(lineX);

    const geomY = new LineGeometry().setPositions([0, 0, 0, 0, L, 0]);
    const matY = new LineMaterial({ color: 0x00ff00, linewidth: 2 });
    matY.resolution.set(renderer.domElement.width, renderer.domElement.height);
    const lineY = new Line2(geomY, matY);
    lineY.renderOrder = 1;
    lineY.onBeforeRender = () => { matY.resolution.set(renderer.domElement.width, renderer.domElement.height); };
    group.add(lineY);

    const geomZ = new LineGeometry().setPositions([0, 0, 0, 0, 0, L]);
    const matZ = new LineMaterial({ color: 0x0000ff, linewidth: 2 });
    matZ.resolution.set(renderer.domElement.width, renderer.domElement.height);
    const lineZ = new Line2(geomZ, matZ);
    lineZ.renderOrder = 1;
    lineZ.onBeforeRender = () => { matZ.resolution.set(renderer.domElement.width, renderer.domElement.height); };
    group.add(lineZ);

    // 三个箭头：锥尖在轴端点，锥体向原点
    const coneX = new THREE.Mesh(new THREE.ConeGeometry(r, h, 8), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    coneX.position.set(L - h / 2, 0, 0);
    coneX.rotation.set(0, 0, -Math.PI / 2);
    group.add(coneX);

    const coneY = new THREE.Mesh(new THREE.ConeGeometry(r, h, 8), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
    coneY.position.set(0, L - h / 2, 0);
    group.add(coneY);

    const coneZ = new THREE.Mesh(new THREE.ConeGeometry(r, h, 8), new THREE.MeshBasicMaterial({ color: 0x0000ff }));
    coneZ.position.set(0, 0, L - h / 2);
    coneZ.rotation.set(Math.PI / 2, 0, 0);  // 锥尖默认 +Y，绕 X 转 +90° 指向 +Z
    group.add(coneZ);

    // 三个标签 X / Y / Z
    const divX = document.createElement('div');
    divX.textContent = 'X';
    divX.style.color = '#ff0000';
    divX.style.fontSize = '18px';
    divX.style.fontWeight = 'bold';
    divX.style.pointerEvents = 'none';
    const labelX = new CSS2DObject(divX);
    labelX.position.set(L * 1.15, 0, 0);
    group.add(labelX);

    const divY = document.createElement('div');
    divY.textContent = 'Y';
    divY.style.color = '#00ff00';
    divY.style.fontSize = '18px';
    divY.style.fontWeight = 'bold';
    divY.style.pointerEvents = 'none';
    const labelY = new CSS2DObject(divY);
    labelY.position.set(0, L * 1.15, 0);
    group.add(labelY);

    const divZ = document.createElement('div');
    divZ.textContent = 'Z';
    divZ.style.color = '#0000ff';
    divZ.style.fontSize = '18px';
    divZ.style.fontWeight = 'bold';
    divZ.style.pointerEvents = 'none';
    const labelZ = new CSS2DObject(divZ);
    labelZ.position.set(0, 0, L * 1.15);
    group.add(labelZ);

    return group;
}

function disposeAxesGroup(axesGroup) {
    axesGroup.children.forEach((c) => {
        if (c.geometry) c.geometry.dispose();
        if (c.material) c.material.dispose();
        // CSS2DObject 的 div 需从 DOM 移除，否则换模型后旧标签会残留
        if (c.element && c.element.parentNode) c.element.parentNode.removeChild(c.element);
    });
}

/** 同步坐标轴 X/Y/Z 标签（CSS2DObject）的显隐；关闭坐标轴时 CSS2DRenderer 仍可能渲染标签，需显式设 display */
function setAxesLabelsVisibility(visible) {
    if (!axesHelper) return;
    axesHelper.traverse((c) => {
        if (c.element) c.element.style.display = visible ? '' : 'none';
    });
}

function refreshExperimentConsoleBlockSelect() {
    const select = document.getElementById('experiment-console-orbital-select');
    if (!select) return;
    const ids = getNavigableOrbitalIds(currentCategory);
    select.innerHTML = '';
    ids.forEach(id => {
        const opt = document.createElement('option');
        opt.value = id;
        opt.textContent = formatOrbitalName(id, false);
        select.appendChild(opt);
    });
    select.value = currentOrbitalId || ids[0] || '';
}

function syncExperimentConsoleControls() {
    const autoRotate = document.getElementById('experiment-console-auto-rotate');
    const rotationSpeed = document.getElementById('experiment-console-rotation-speed');
    const showAxes = document.getElementById('experiment-console-show-axes');
    const particleSize = document.getElementById('experiment-console-particle-size');
    if (autoRotate) autoRotate.checked = settings.autoRotate;
    if (rotationSpeed) rotationSpeed.value = String(settings.rotationSpeed);
    if (showAxes) showAxes.checked = settings.showAxes;
    if (particleSize) particleSize.value = String(settings.particleSize);
}

function initExperimentConsole() {
    const root = document.getElementById('experiment-console');
    const header = document.getElementById('experiment-console-header');
    const autoRotate = document.getElementById('experiment-console-auto-rotate');
    const rotationSpeed = document.getElementById('experiment-console-rotation-speed');
    const showAxes = document.getElementById('experiment-console-show-axes');
    const orbitalSelect = document.getElementById('experiment-console-orbital-select');
    if (!root || !header) return;

    header.addEventListener('click', () => root.classList.toggle('is-open'));
    if (autoRotate) {
        autoRotate.addEventListener('change', () => { settings.autoRotate = autoRotate.checked; });
    }
    if (rotationSpeed) {
        rotationSpeed.addEventListener('input', () => { settings.rotationSpeed = parseFloat(rotationSpeed.value); });
    }
    if (showAxes) {
        showAxes.addEventListener('change', () => {
            settings.showAxes = showAxes.checked;
            if (axesHelper) {
                axesHelper.visible = showAxes.checked;
                setAxesLabelsVisibility(showAxes.checked);
            }
        });
    }
    const particleSize = document.getElementById('experiment-console-particle-size');
    if (particleSize) {
        particleSize.addEventListener('input', () => {
            settings.particleSize = parseFloat(particleSize.value);
            if (orbitalPoints && orbitalPoints.material) {
                orbitalPoints.material.size = settings.particleSize;
            }
        });
    }
    if (orbitalSelect) {
        orbitalSelect.addEventListener('change', () => {
            const id = orbitalSelect.value;
            if (id) loadOrbital(id, { isSwitch: true });
        });
    }
}

// 显示查看器界面
function showViewer(opts = {}) {
    currentView = 'viewer';
    document.getElementById('category-selector').classList.add('hidden');
    document.getElementById('orbital-selector').classList.add('hidden');
    
    const container = document.getElementById('container');
    container.style.display = 'block';
    container.style.visibility = 'visible';
    container.style.opacity = '1';
    
    document.getElementById('instructions').classList.remove('hidden');
    document.getElementById('orbital-tag').classList.remove('hidden');
    // 根据摄像头状态显示视频容器或折叠卡片
    if (cameraVisible) {
        document.getElementById('video-container').classList.remove('hidden');
        document.getElementById('camera-toggle-card').classList.add('hidden');
    } else {
        document.getElementById('video-container').classList.add('hidden');
        document.getElementById('camera-toggle-card').classList.remove('hidden');
    }
    document.getElementById('viewer-back-button').classList.remove('hidden');
    const consoleEl = document.getElementById('experiment-console');
    if (consoleEl) consoleEl.classList.remove('hidden');
    
    // 显示并绑定 viewer 页面信息按钮
    const viewerKnowledgeButton = document.getElementById('viewer-knowledge-button');
    if (viewerKnowledgeButton) {
        viewerKnowledgeButton.classList.remove('hidden');
        // 使用 onclick 确保只有一个事件监听器
        viewerKnowledgeButton.onclick = () => {
            if (currentOrbitalId) {
                showKnowledgeCard(currentOrbitalId);
            }
        };
    }
    
    // 确保知识卡片在viewer页面默认隐藏（只有点击按钮时才显示）
    const knowledgeCard = document.getElementById('knowledge-card');
    if (knowledgeCard) {
        knowledgeCard.classList.add('hidden');
    }
    refreshExperimentConsoleBlockSelect();
    syncExperimentConsoleControls();
    
    // 确保加载遮罩隐藏（通常已在 loadOrbital onLoad 中 hideLoadingOverlay）
    hideLoadingOverlay();
    
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

    if (cameraVisible && gestureController && gestureController.enabled) gestureController.start();
    
    // 检查是否需要显示教程（首次打开模型时）
    if (!opts?.isSwitch) {
        checkAndShowTutorial();
    } else {
    }
}

// --- 手势教程功能 ---
let tutorialCurrentStep = 1;

function checkAndShowTutorial() {
    const tutorialShown = sessionStorage.getItem(TUTORIAL_STORAGE_KEY);
    if (!tutorialShown) {
        // 延迟显示，确保模型已加载完成
        setTimeout(() => {
            showTutorial();
        }, 500);
    }
}

// 提供全局函数用于测试：在控制台输入 resetTutorial() 可以重置教程
window.resetTutorial = function() {
    sessionStorage.removeItem(TUTORIAL_STORAGE_KEY);
    console.log('Tutorial reset. Reload the page and open a model to see the tutorial.');
};

function showTutorial() {
    const overlay = document.getElementById('gesture-tutorial-overlay');
    if (!overlay) {
        console.warn('Tutorial overlay not found');
        return;
    }
    
    overlay.classList.remove('hidden');
    
    // 显示视频容器以便手势跟踪
    const videoContainer = document.getElementById('video-container');
    if (videoContainer) {
        videoContainer.classList.remove('hidden');
    }
    
    tutorialCurrentStep = 1;
    updateTutorialStep();
    initTutorialEvents();
    console.log('Tutorial shown');
}

function hideTutorial() {
    const overlay = document.getElementById('gesture-tutorial-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
    stopTutorialGestureTracking();
    sessionStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
}

function updateTutorialStep() {
    // 更新步骤显示
    const steps = document.querySelectorAll('.gesture-tutorial-step');
    steps.forEach((step, index) => {
        if (index + 1 === tutorialCurrentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    // 更新导航按钮状态
    const prevBtn = document.getElementById('gesture-tutorial-prev');
    const nextBtn = document.getElementById('gesture-tutorial-next');
    if (prevBtn) {
        prevBtn.disabled = tutorialCurrentStep === 1;
    }
    if (nextBtn) {
        nextBtn.textContent = tutorialCurrentStep === TUTORIAL_TOTAL_STEPS ? t('explorer.tutorialDone') : t('explorer.tutorialNext');
    }
    
    // 更新指示点
    const dots = document.querySelectorAll('.gesture-tutorial-dot');
    dots.forEach((dot, index) => {
        if (index + 1 === tutorialCurrentStep) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    
    // 步骤2时不需要真实手势跟踪，圆圈跟随emoji动画
    // 移除真实手势跟踪，让圆圈只跟随emoji图案动画
    stopTutorialGestureTracking();
}

function nextTutorialStep() {
    if (tutorialCurrentStep < TUTORIAL_TOTAL_STEPS) {
        tutorialCurrentStep++;
        updateTutorialStep();
    } else {
        // 完成教程
        hideTutorial();
    }
}

function prevTutorialStep() {
    if (tutorialCurrentStep > 1) {
        tutorialCurrentStep--;
        updateTutorialStep();
    }
}

function initTutorialEvents() {
    // 关闭按钮
    const closeBtn = document.getElementById('gesture-tutorial-close');
    if (closeBtn) {
        closeBtn.onclick = () => {
            hideTutorial();
        };
    }
    
    // 跳过按钮
    const skipBtn = document.getElementById('gesture-tutorial-skip');
    if (skipBtn) {
        skipBtn.onclick = () => {
            hideTutorial();
        };
    }
    
    // 上一步按钮
    const prevBtn = document.getElementById('gesture-tutorial-prev');
    if (prevBtn) {
        prevBtn.onclick = () => {
            prevTutorialStep();
        };
    }
    
    // 下一步按钮
    const nextBtn = document.getElementById('gesture-tutorial-next');
    if (nextBtn) {
        nextBtn.onclick = () => {
            nextTutorialStep();
        };
    }
    
    // 指示点点击
    const dots = document.querySelectorAll('.gesture-tutorial-dot');
    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            const step = parseInt(dot.dataset.step);
            if (step >= 1 && step <= TUTORIAL_TOTAL_STEPS) {
                tutorialCurrentStep = step;
                updateTutorialStep();
            }
        });
    });
    
    // ESC 键关闭教程
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            const overlay = document.getElementById('gesture-tutorial-overlay');
            if (overlay && !overlay.classList.contains('hidden')) {
                hideTutorial();
                window.removeEventListener('keydown', escHandler);
            }
        }
    };
    window.addEventListener('keydown', escHandler);
}

/**
 * 初始化教程手势跟踪（用于步骤2的圆圈演示）
 */
async function initTutorialGestureTracking() {
    // 如果已经初始化，先停止
    if (tutorialHandTracker) {
        stopTutorialGestureTracking();
    }
    
    // 获取圆圈元素
    tutorialDemoCircle = document.querySelector('.model-demo-rotate');
    if (!tutorialDemoCircle) {
        return;
    }
    
    // 重置旋转状态
    tutorialRotationY = 0;
    tutorialRotationX = 0;
    tutorialLastPalmPos = null;
    updateTutorialDemoCircle();
    
    // 获取视频元素
    const videoElement = document.getElementById('input_video');
    if (!videoElement) {
        return;
    }
    
    try {
        // 创建手势跟踪器
        tutorialHandTracker = new HandTracker(videoElement, (gesture, results) => {
            handleTutorialGesture(gesture);
        });
        
        await tutorialHandTracker.init();
        tutorialHandTracker.start();
    } catch (error) {
        console.warn('Failed to init tutorial gesture tracking:', error);
    }
}

/**
 * 停止教程手势跟踪
 */
function stopTutorialGestureTracking() {
    if (tutorialHandTracker) {
        tutorialHandTracker.stop();
        tutorialHandTracker.destroy();
        tutorialHandTracker = null;
    }
    tutorialLastPalmPos = null;
}

/**
 * 处理教程手势
 */
function handleTutorialGesture(gesture) {
    if (!tutorialDemoCircle || tutorialCurrentStep !== 2) {
        return;
    }
    
    // 只处理单手指合手势 - 严格检查：必须是 SINGLE_HAND_PINCH 状态
    // 拒绝所有其他手势状态（TWO_HAND_PINCH, NONE 等）
    const isSingleHandPinch = gesture.state === GestureState.SINGLE_HAND_PINCH;
    const hasValidData = gesture.data && gesture.data.palm;
    
    
    // 如果不是单手捏合，立即重置并返回（不处理任何其他手势）
    if (!isSingleHandPinch) {
        if (tutorialLastPalmPos) {
            tutorialLastPalmPos = null;
        }
        return;
    }
    
    // 只有单手捏合手势才继续处理
    if (hasValidData) {
        const palm = gesture.data.palm;
        
        if (!tutorialLastPalmPos) {
            tutorialLastPalmPos = { x: palm.x, y: palm.y };
            return;
        }
        
        // 计算手掌移动
        const deltaX = palm.x - tutorialLastPalmPos.x;
        const deltaY = palm.y - tutorialLastPalmPos.y;
        
        // 更新旋转角度
        // 向右移动（deltaX > 0）→ 绕Y轴逆时针旋转（从上方看，rotateY为负）
        // 向上移动（deltaY < 0，屏幕Y向下为正）→ 绕X轴逆时针旋转（从右侧看，模型前面向上，rotateX为负）
        // 向下移动（deltaY > 0）→ 绕X轴顺时针旋转（从右侧看，模型前面向下，rotateX为正）
        const sensitivity = 200; // 旋转灵敏度
        const oldRotationY = tutorialRotationY;
        const oldRotationX = tutorialRotationX;
        tutorialRotationY -= deltaX * sensitivity;
        tutorialRotationX += (invertRotationY ? deltaY : -deltaY) * sensitivity;
        
        // 限制旋转角度范围
        tutorialRotationX = Math.max(-90, Math.min(90, tutorialRotationX));
        
        
        // 更新圆圈
        updateTutorialDemoCircle();
        
        // 更新上次位置
        tutorialLastPalmPos = { x: palm.x, y: palm.y };
    } else {
        // 手势结束，重置上次位置
        tutorialLastPalmPos = null;
    }
}

/**
 * 更新教程演示圆圈旋转
 */
function updateTutorialDemoCircle() {
    if (!tutorialDemoCircle) {
        return;
    }
    
    const transformValue = `rotateY(${tutorialRotationY}deg) rotateX(${tutorialRotationX}deg)`;
    tutorialDemoCircle.style.transform = transformValue;
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
    
    // ESC键返回分类选择，i键放大50%
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (currentView === 'viewer') {
                showCategorySelector();
            } else if (currentView === 'orbital') {
                showCategorySelector();
            }
        } else if (e.key === 'i' || e.key === 'I') {
            // i键放大50%
            if (currentView === 'viewer' && renderController) {
                const currentScale = renderController.targetScale;
                const newScale = currentScale * 1.5; // 放大50%
                const clampedScale = THREE.MathUtils.clamp(newScale, MIN_SCALE, MAX_SCALE);
                renderController.setTargetScale(clampedScale);
                renderController.setInteracting(true);
                setTimeout(() => {
                    renderController.setInteracting(false);
                }, 100);
                console.log('I key pressed, scale increased by 50%, new scale:', clampedScale);
            }
        }
    });
}

// --- 触屏交互 ---
function initTouchEvents() {
    const container = document.getElementById('container');
    let touchStartPos = null;
    let lastTouchPos = null;
    let initialDistance = null;

    container.addEventListener('touchstart', (e) => {
        if (currentView !== 'viewer' || !renderController) return;
        
        // 单指触摸 - 旋转
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            touchStartPos = { x: touch.clientX, y: touch.clientY };
            lastTouchPos = { x: touch.clientX, y: touch.clientY };
            renderController.setInteracting(true);
            e.preventDefault();
        }
        // 双指触摸 - 缩放
        else if (e.touches.length === 2) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            initialDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            renderController.setInteracting(true);
            e.preventDefault();
        }
    }, { passive: false });

    container.addEventListener('touchmove', (e) => {
        if (currentView !== 'viewer' || !renderController) return;
        
        // 单指拖动 - 旋转
        if (e.touches.length === 1 && lastTouchPos) {
            const touch = e.touches[0];
            const deltaX = touch.clientX - lastTouchPos.x;
            const deltaY = touch.clientY - lastTouchPos.y;
            const rotationDeltaX = deltaX * ROTATION_SENSITIVITY;
            const rotationDeltaY = (invertRotationY ? deltaY : -deltaY) * ROTATION_SENSITIVITY;
            
            renderController.setTargetRotation(rotationDeltaX, rotationDeltaY);
            lastTouchPos = { x: touch.clientX, y: touch.clientY };
            e.preventDefault();
        }
        // 双指缩放
        else if (e.touches.length === 2 && initialDistance) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const currentDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            
            const scaleFactor = currentDistance / initialDistance;
            const currentScale = renderController.targetScale;
            const newScale = currentScale * scaleFactor;
            const clampedScale = THREE.MathUtils.clamp(newScale, MIN_SCALE, MAX_SCALE);
            
            renderController.setTargetScale(clampedScale);
            initialDistance = currentDistance; // 更新初始距离，实现连续缩放
            e.preventDefault();
        }
    }, { passive: false });

    container.addEventListener('touchend', (e) => {
        if (currentView !== 'viewer' || !renderController) return;
        
        if (e.touches.length === 0) {
            // 所有手指都抬起
            touchStartPos = null;
            lastTouchPos = null;
            initialDistance = null;
            renderController.setInteracting(false);
        } else if (e.touches.length === 1) {
            // 从双指变为单指，重置单指状态
            const touch = e.touches[0];
            lastTouchPos = { x: touch.clientX, y: touch.clientY };
            initialDistance = null;
        }
        e.preventDefault();
    }, { passive: false });

    container.addEventListener('touchcancel', (e) => {
        if (currentView !== 'viewer' || !renderController) return;
        
        touchStartPos = null;
        lastTouchPos = null;
        initialDistance = null;
        renderController.setInteracting(false);
        e.preventDefault();
    }, { passive: false });
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
}

function animate() {
    animateId = requestAnimationFrame(animate);

    // 始终渲染，但只在viewer模式下更新模型
    if (currentView === 'viewer') {
        // 自动旋转：排除鼠标拖拽（isMouseDown）和手势交互（isInteracting）
        // 当单手或双手捏合时，isInteracting 为 true，自动旋转停止
        // 当松开时，isInteracting 为 false，自动旋转恢复
        if (renderController && !isMouseDown && !renderController.isInteracting && settings.autoRotate) {
            renderController.setTargetRotation(settings.rotationSpeed, 0, true);
        }
    }
}

/**
 * 标签页隐藏时暂停：停止 RenderController、explorer.animate、GestureController，降低后台占用。
 */
function pauseBackgroundWork() {
    if (renderController) renderController.stop();
    if (animateId != null) {
        cancelAnimationFrame(animateId);
        animateId = null;
    }
    if (gestureController) gestureController.stop();
}

/**
 * 标签页重新可见时恢复：启动 RenderController、explorer.animate；
 * 仅当处于查看器界面时恢复 GestureController（摄像头）。
 */
function resumeBackgroundWork() {
    if (renderController) renderController.start();
    animate();
    if (currentView === 'viewer' && cameraVisible && gestureController?.enabled) gestureController.start();
}

/**
 * 页面卸载时完整清理：停止渲染与手势、释放 WebGL、移除监听，避免后台残留。
 */
function onPageUnload() {
    if (pageUnloadCleaned) return;
    pageUnloadCleaned = true;

    if (renderController) renderController.stop();
    if (animateId != null) {
        cancelAnimationFrame(animateId);
        animateId = null;
    }
    if (gestureController) gestureController.destroy();
    if (renderer) renderer.dispose();
    window.removeEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (css2DRenderer) css2DRenderer.setSize(window.innerWidth, window.innerHeight);
}

// 摄像头显示/隐藏切换
function toggleCamera(show) {
    cameraVisible = show;
    const videoContainer = document.getElementById('video-container');
    const cameraCard = document.getElementById('camera-toggle-card');
    if (show) {
        if (videoContainer) videoContainer.classList.remove('hidden');
        if (cameraCard) cameraCard.classList.add('hidden');
        if (gestureController && gestureController.enabled) gestureController.start();
    } else {
        if (videoContainer) videoContainer.classList.add('hidden');
        if (cameraCard) cameraCard.classList.remove('hidden');
        if (gestureController) gestureController.stop();
    }
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
    const lang = (window.I18N && window.I18N.getLang) ? window.I18N.getLang() : 'zh';
    const kTitle = (typeof knowledge.title === 'object') ? (knowledge.title[lang] || knowledge.title.zh) : knowledge.title;
    const kOrbitalType = (typeof knowledge.basicInfo.orbitalType === 'object') ? (knowledge.basicInfo.orbitalType[lang] || knowledge.basicInfo.orbitalType.zh) : knowledge.basicInfo.orbitalType;
    const kDescription = (typeof knowledge.basicInfo.description === 'object') ? (knowledge.basicInfo.description[lang] || knowledge.basicInfo.description.zh) : knowledge.basicInfo.description;
    const kShape = (typeof knowledge.shapeFeatures.shape === 'object') ? (knowledge.shapeFeatures.shape[lang] || knowledge.shapeFeatures.shape.zh) : knowledge.shapeFeatures.shape;
    const kSymmetry = (typeof knowledge.shapeFeatures.symmetry === 'object') ? (knowledge.shapeFeatures.symmetry[lang] || knowledge.shapeFeatures.symmetry.zh) : knowledge.shapeFeatures.symmetry;
    const kNodes = (typeof knowledge.shapeFeatures.nodes === 'object') ? (knowledge.shapeFeatures.nodes[lang] || knowledge.shapeFeatures.nodes.zh) : knowledge.shapeFeatures.nodes;
    
    let html = `<div class="knowledge-title">${kTitle}</div>`;
    
    // 基本信息部分
    html += '<div class="knowledge-section">';
    html += `<div class="knowledge-section-title">${t('explorer.basicInfo')}</div>`;
    html += `<div class="knowledge-item">
        <div class="knowledge-item-label">${t('explorer.quantumNumbers')}</div>
        <div class="knowledge-item-value">
            n = <strong>${knowledge.basicInfo.quantumNumbers.n}</strong>, 
            l = <strong>${knowledge.basicInfo.quantumNumbers.l}</strong>, 
            m = <strong>${knowledge.basicInfo.quantumNumbers.m}</strong>
        </div>
    </div>`;
    html += `<div class="knowledge-item">
        <div class="knowledge-item-label">${t('explorer.orbitalType')}</div>
        <div class="knowledge-item-value">${kOrbitalType}</div>
    </div>`;
    html += `<div class="knowledge-item">
        <div class="knowledge-item-label">${t('explorer.description')}</div>
        <div class="knowledge-item-value">${kDescription}</div>
    </div>`;
    html += '</div>';
    
    // 形状特征部分
    html += '<div class="knowledge-section">';
    html += `<div class="knowledge-section-title">${t('explorer.shapeFeatures')}</div>`;
    html += `<div class="knowledge-item">
        <div class="knowledge-item-label">${t('explorer.shape')}</div>
        <div class="knowledge-item-value">${kShape}</div>
    </div>`;
    html += `<div class="knowledge-item">
        <div class="knowledge-item-label">${t('explorer.symmetry')}</div>
        <div class="knowledge-item-value">${kSymmetry}</div>
    </div>`;
    html += `<div class="knowledge-item">
        <div class="knowledge-item-label">${t('explorer.nodes')}</div>
        <div class="knowledge-item-value">${kNodes}</div>
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
