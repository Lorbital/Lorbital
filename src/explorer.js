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
import { MODEL_REGISTRY, getPlyUrl, getModelAssetUrl, loadMetadata, hasOrbitalModel, getActualModelId, getOrbitalType } from './data/modelRegistry.js';
import { MOLECULAR_MODELS, getAllMolecularOrbitalIds } from './data/molecularRegistry.js';
import { PERIODIC_ELEMENTS } from './data/periodicTable.js';
import { getOrbitalPosterUrls } from './data/previewRegistry.js';
import { getOrbitalKnowledge } from './data/orbitalKnowledge.js';
import { RenderController } from './three/renderer.js';
import { GestureController } from './components/GestureController.js';
import { HandTracker } from './gesture/handTracker.js';
import { GestureState } from './gesture/gestureMapping.js';
import { ROTATION_SENSITIVITY, ZOOM_SENSITIVITY, MIN_SCALE, MAX_SCALE } from './utils/constants.js';

let scene, camera, renderer, orbitalPoints, renderController, axesHelper, css2DRenderer;
let orbitalLayerObjects = [];
const orbitalGroup = new THREE.Group();
const loader = new PLYLoader();

// 界面状态
let currentView = 'home'; // 'home'|'atomic-home'|'molecular-home'|'periodic'|'orbital'|'viewer'
/** @type {{ type: string, category?: string, parent?: string }} */
let viewerReturnContext = { type: 'home' };
/** g 等轨道列表从何处进入：'atomic-home' | 'home' */
let orbitalListParent = 'atomic-home';
let currentCategory = null;
let currentMetadata = null;
let currentOrbitalId = null; // 当前查看的轨道 id，用于同分类切换与信息按钮
let orbitalLayerVisibility = { density: true, homo: false, main: true };
let lastErrorOrbitalId = null;
let lastErrorOpts = null;
let cameraVisible = true; // 摄像头显示状态
let clearScreenMode = false;

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
    particleSize: 0.05,
    rotationSpeed: 0.0105
    // 不使用默认颜色，完全使用PLY文件中的原始颜色
};
const invertRotationY = true;

const CATEGORY_TITLE_KEYS = {
    s: 'explorer.catTitleS',
    p: 'explorer.catTitleP',
    d: 'explorer.catTitleD',
    f: 'explorer.catTitleF',
    g: 'explorer.catTitleG',
    dodec: 'explorer.catTitleDodec',
    icosa: 'explorer.catTitleIcosa'
};

// --- 手势教程功能常量 ---
const TUTORIAL_STORAGE_KEY = 'lorbital_tutorial_shown';
const TUTORIAL_TOTAL_STEPS = 3;

// --- 进入查看器时的初始化缩放动画（教程结束后触发）---
const INTRO_SCALE_START = 0.01;
const INTRO_SCALE_END = 0.8;
const INTRO_SCALE_HOLD_MS = 200;
const INTRO_SCALE_DURATION_MS = 4000;

let introAnimationActive = false;
let introAnimationPending = false;
let introAnimationStartTime = 0;
let introAnimationBaseScale = 1.0;

function easeOutBack(t) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function resetIntroAnimation() {
    introAnimationActive = false;
    introAnimationPending = false;
    introAnimationStartTime = 0;
}

function prepareIntroAnimation(baseScale) {
    introAnimationBaseScale = baseScale;
    introAnimationPending = true;
    introAnimationActive = false;
    const startScale = baseScale * INTRO_SCALE_START;
    if (renderController) {
        renderController.currentScale = startScale;
        renderController.targetScale = startScale;
    }
    if (orbitalGroup) orbitalGroup.scale.setScalar(startScale);
}

function startIntroAnimation() {
    if (!renderController || !introAnimationPending) return;
    introAnimationPending = false;
    introAnimationActive = true;
    introAnimationStartTime = performance.now();
    const startScale = introAnimationBaseScale * INTRO_SCALE_START;
    renderController.currentScale = startScale;
    renderController.targetScale = startScale;
    orbitalGroup.scale.setScalar(startScale);
}

function updateIntroAnimation(now) {
    if (!introAnimationActive || !renderController) return false;
    const elapsed = now - introAnimationStartTime;
    const startScale = introAnimationBaseScale * INTRO_SCALE_START;
    const endScale = introAnimationBaseScale * INTRO_SCALE_END;

    if (elapsed < INTRO_SCALE_HOLD_MS) {
        renderController.currentScale = startScale;
        renderController.targetScale = startScale;
        return true;
    }

    const animElapsed = elapsed - INTRO_SCALE_HOLD_MS;
    const progress = Math.min(animElapsed / INTRO_SCALE_DURATION_MS, 1);
    const eased = easeOutBack(progress);
    const scale = startScale + (endScale - startScale) * eased;
    renderController.currentScale = scale;
    renderController.targetScale = scale;
    if (progress >= 1) {
        introAnimationActive = false;
        renderController.targetScale = endScale;
        renderController.currentScale = endScale;
    }
    return introAnimationActive;
}

function tryStartIntroAnimation() {
    if (currentView !== 'viewer') return;
    if (introAnimationPending) startIntroAnimation();
}

function isTutorialVisible() {
    const overlay = document.getElementById('gesture-tutorial-overlay');
    return overlay != null && !overlay.classList.contains('hidden');
}

/** @type {ReturnType<typeof setTimeout> | null} */
let previewHideTimer = null;

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

    showHomeView();

    // i18n: re-apply translations when language changes
    if (window.I18N && window.I18N.onLangChange) {
        window.I18N.onLangChange(() => {
            window.I18N.applyI18n();
            // Re-render orbital list if visible
            if (currentView === 'orbital' && currentCategory) {
                showOrbitalList(currentCategory, { parent: orbitalListParent });
            }
            if (currentView === 'periodic') {
                renderPeriodicTable();
            }
            if (currentView === 'molecular-home') {
                renderMolecularList();
            }
            // Re-render knowledge card if visible
            if (currentView === 'viewer' && currentOrbitalId) {
                const knowledgeCard = document.getElementById('knowledge-card');
                if (knowledgeCard && !knowledgeCard.classList.contains('hidden')) {
                    showKnowledgeCard(currentOrbitalId);
                }
            }
            if (currentView === 'viewer') {
                setClearScreenMode(clearScreenMode);
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
    document.querySelectorAll('#explorer-home .home-card').forEach((card) => {
        card.addEventListener('click', () => {
            const entry = card.dataset.entry;
            if (entry === 'atomic') showAtomicHome();
            else if (entry === 'molecular') showMolecularHome();
        });
    });

    document.querySelectorAll('#atomic-home .home-card').forEach((card) => {
        card.addEventListener('click', () => {
            const entry = card.dataset.entry;
            if (entry === 'sf') {
                viewerReturnContext = { type: 'atomic-home' };
                showPeriodicTable();
            } else if (entry === 'g') {
                showOrbitalList('g', { parent: 'atomic-home' });
            }
        });
    });

    const atomicBack = document.getElementById('atomic-back-button');
    if (atomicBack) {
        atomicBack.addEventListener('click', () => showHomeView());
    }

    const molecularBack = document.getElementById('molecular-back-button');
    if (molecularBack) {
        molecularBack.addEventListener('click', () => showHomeView());
    }

    const periodicBack = document.getElementById('periodic-back-button');
    if (periodicBack) {
        periodicBack.addEventListener('click', () => showAtomicHome());
    }

    const orbitalListBack = document.getElementById('orbital-list-back-button');
    if (orbitalListBack) {
        orbitalListBack.addEventListener('click', () => {
            if (orbitalListParent === 'atomic-home') showAtomicHome();
            else showHomeView();
        });
    }
    
    // 返回按钮（查看器界面）
    const viewerBackButton = document.getElementById('viewer-back-button');
    if (viewerBackButton) {
        viewerBackButton.addEventListener('click', () => {
            handleViewerBack();
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

    const viewerClearScreenButton = document.getElementById('viewer-clear-screen-button');
    if (viewerClearScreenButton) {
        viewerClearScreenButton.addEventListener('click', () => toggleClearScreenMode());
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
            if (viewerReturnContext.type === 'orbital' && viewerReturnContext.category) {
                showOrbitalList(viewerReturnContext.category, {
                    parent: viewerReturnContext.parent || orbitalListParent
                });
            } else if (viewerReturnContext.type === 'periodic') {
                showPeriodicTable();
            } else if (viewerReturnContext.type === 'molecular-home') {
                showMolecularHome();
            } else if (viewerReturnContext.type === 'atomic-home') {
                showAtomicHome();
            } else {
                showHomeView();
            }
        });
    }
}

function setClearScreenMode(on) {
    clearScreenMode = on;
    document.body.classList.toggle('viewer-clear-screen', on);
    const btn = document.getElementById('viewer-clear-screen-button');
    if (btn) {
        btn.classList.toggle('is-active', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        const titleKey = on ? 'explorer.clearScreenExit' : 'explorer.clearScreen';
        btn.title = typeof t === 'function' ? t(titleKey) : (on ? '退出清屏' : '清屏模式');
    }
}

function exitClearScreenMode() {
    if (clearScreenMode) setClearScreenMode(false);
}

function toggleClearScreenMode() {
    if (currentView !== 'viewer') return;
    setClearScreenMode(!clearScreenMode);
}

function hideViewerOverlayControls() {
    exitClearScreenMode();
    document.getElementById('viewer-clear-screen-button')?.classList.add('hidden');
    document.getElementById('viewer-knowledge-button')?.classList.add('hidden');
    document.getElementById('knowledge-card')?.classList.add('hidden');
}

function handleViewerBack() {
    resetIntroAnimation();
    hideElementPreviewCard();
    exitClearScreenMode();
    if (viewerReturnContext.type === 'periodic') {
        showPeriodicTable();
    } else if (viewerReturnContext.type === 'orbital' && viewerReturnContext.category) {
        showOrbitalList(viewerReturnContext.category, {
            parent: viewerReturnContext.parent || orbitalListParent
        });
    } else if (viewerReturnContext.type === 'molecular-home') {
        showMolecularHome();
    } else if (viewerReturnContext.type === 'atomic-home') {
        showAtomicHome();
    } else {
        showHomeView();
    }
}

// 显示首页（原子 / 分子两大入口）
function showHomeView() {
    currentView = 'home';
    hideElementPreviewCard();
    if (previewHideTimer) {
        clearTimeout(previewHideTimer);
        previewHideTimer = null;
    }
    const homeEl = document.getElementById('explorer-home');
    if (homeEl) homeEl.classList.remove('hidden');
    document.getElementById('atomic-home')?.classList.add('hidden');
    document.getElementById('molecular-home')?.classList.add('hidden');
    const periodicEl = document.getElementById('periodic-selector');
    if (periodicEl) periodicEl.classList.add('hidden');
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
    
    hideViewerOverlayControls();
    
    if (gestureController) gestureController.stop();
}

function showAtomicHome() {
    currentView = 'atomic-home';
    hideElementPreviewCard();
    if (previewHideTimer) {
        clearTimeout(previewHideTimer);
        previewHideTimer = null;
    }
    document.getElementById('explorer-home')?.classList.add('hidden');
    document.getElementById('molecular-home')?.classList.add('hidden');
    document.getElementById('atomic-home')?.classList.remove('hidden');
    document.getElementById('periodic-selector')?.classList.add('hidden');
    document.getElementById('orbital-selector').classList.add('hidden');
    document.getElementById('container').style.display = 'none';
    document.getElementById('instructions').classList.add('hidden');
    document.getElementById('orbital-tag').classList.add('hidden');
    document.getElementById('video-container').classList.add('hidden');
    document.getElementById('viewer-back-button').classList.add('hidden');
    const cameraCard = document.getElementById('camera-toggle-card');
    if (cameraCard) cameraCard.classList.add('hidden');
    document.getElementById('experiment-console')?.classList.add('hidden');
    hideViewerOverlayControls();
    if (gestureController) gestureController.stop();
}

function showMolecularHome() {
    currentView = 'molecular-home';
    hideElementPreviewCard();
    if (previewHideTimer) {
        clearTimeout(previewHideTimer);
        previewHideTimer = null;
    }
    document.getElementById('explorer-home')?.classList.add('hidden');
    document.getElementById('atomic-home')?.classList.add('hidden');
    document.getElementById('molecular-home')?.classList.remove('hidden');
    document.getElementById('periodic-selector')?.classList.add('hidden');
    document.getElementById('orbital-selector').classList.add('hidden');
    document.getElementById('container').style.display = 'none';
    document.getElementById('instructions').classList.add('hidden');
    document.getElementById('orbital-tag').classList.add('hidden');
    document.getElementById('video-container').classList.add('hidden');
    document.getElementById('viewer-back-button').classList.add('hidden');
    const cameraCard = document.getElementById('camera-toggle-card');
    if (cameraCard) cameraCard.classList.add('hidden');
    document.getElementById('experiment-console')?.classList.add('hidden');
    hideViewerOverlayControls();
    if (gestureController) gestureController.stop();
    renderMolecularList();
}

function renderMolecularList() {
    const container = document.getElementById('molecular-list');
    if (!container) return;
    container.innerHTML = '';
    MOLECULAR_MODELS.forEach((entry) => {
        const orbitalId = entry.orbitalId;
        const hasModel = hasOrbitalModel(orbitalId);
        const card = document.createElement('div');
        card.className = 'molecular-card' + (hasModel ? '' : ' molecular-card--disabled');
        card.innerHTML = `
            <div class="molecular-card-title">${t(entry.titleKey)}</div>
            <div class="molecular-card-formula">${formatOrbitalName(orbitalId)}</div>
            <div class="molecular-card-sym">${t(entry.symmetryKey)}</div>
            <div class="molecular-card-desc">${t(entry.descKey)}</div>
            ${hasModel ? '' : `<div class="molecular-card-soon">${t('explorer.comingSoon')}</div>`}
        `;
        if (hasModel) {
            card.addEventListener('click', () => {
                viewerReturnContext = { type: 'molecular-home' };
                loadOrbital(orbitalId);
            });
        }
        container.appendChild(card);
    });
}

function showPeriodicTable() {
    currentView = 'periodic';
    hideElementPreviewCard();
    const homeEl = document.getElementById('explorer-home');
    if (homeEl) homeEl.classList.add('hidden');
    document.getElementById('atomic-home')?.classList.add('hidden');
    document.getElementById('molecular-home')?.classList.add('hidden');
    const periodicEl = document.getElementById('periodic-selector');
    if (periodicEl) periodicEl.classList.remove('hidden');
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
    hideViewerOverlayControls();
    if (gestureController) gestureController.stop();
    renderPeriodicTable();
}

function renderPeriodicTable() {
    const grid = document.getElementById('periodic-grid');
    if (!grid) return;
    grid.querySelectorAll('.periodic-cell').forEach((node) => node.remove());
    PERIODIC_ELEMENTS.forEach((el) => {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'periodic-cell';
        cell.dataset.z = String(el.z);
        cell.style.gridRow = String(el.gridRow);
        cell.style.gridColumn = String(el.gridCol);
        if (el.cellStatus === 'available') {
            cell.classList.add('periodic-cell--available');
        } else {
            cell.classList.add('periodic-cell--previewonly');
        }
        cell.innerHTML = `
            <span class="periodic-cell-z">${el.z}</span>
            <span class="periodic-cell-symbol">${el.symbol}</span>
            <span class="periodic-cell-subshell">${el.representativeLabel}</span>
        `;
        cell.addEventListener('mouseenter', (ev) => {
            showElementPreviewCard(el, ev.clientX, ev.clientY);
        });
        cell.addEventListener('mousemove', (ev) => {
            if (document.getElementById('element-hover-preview')?.classList.contains('hidden')) return;
            positionElementPreviewCard(ev.clientX, ev.clientY);
        });
        cell.addEventListener('mouseleave', () => {
            scheduleHideElementPreviewCard();
        });
        cell.addEventListener('click', () => {
            if (el.cellStatus !== 'available') return;
            viewerReturnContext = { type: 'periodic' };
            loadOrbital(el.representativeOrbitalId);
        });
        grid.appendChild(cell);
    });
}

function showElementPreviewCard(el, clientX, clientY) {
    if (previewHideTimer) {
        clearTimeout(previewHideTimer);
        previewHideTimer = null;
    }
    const card = document.getElementById('element-hover-preview');
    if (!card) return;
    const title = document.getElementById('element-preview-title');
    const sub = document.getElementById('element-preview-subshell');
    const hint = document.getElementById('element-preview-hint');
    const img = document.getElementById('element-preview-img');
    const ph = document.getElementById('element-preview-placeholder');
    if (title) title.textContent = `${el.symbol} (${el.z})`;
    if (sub) sub.innerHTML = formatOrbitalName(el.representativeOrbitalId);
    if (hint) hint.textContent = t('explorer.previewClickHint');
    const urls = getOrbitalPosterUrls(el.representativeOrbitalId);
    if (img && ph) {
        delete img.dataset.fallbackTried;
        img.classList.add('hidden');
        ph.classList.remove('hidden');
        img.onload = () => {
            img.classList.remove('hidden');
            ph.classList.add('hidden');
        };
        img.onerror = () => {
            if (!img.dataset.fallbackTried) {
                img.dataset.fallbackTried = '1';
                img.src = urls.png;
                return;
            }
            img.classList.add('hidden');
            ph.classList.remove('hidden');
        };
        img.src = urls.webp;
        img.alt = el.representativeOrbitalId;
    }
    card.classList.remove('hidden');
    positionElementPreviewCard(clientX, clientY);
}

function positionElementPreviewCard(clientX, clientY) {
    const card = document.getElementById('element-hover-preview');
    if (!card) return;
    const margin = 12;
    const offset = 14;
    let x = clientX + offset;
    let y = clientY + offset;
    const w = card.offsetWidth || 392;
    const h = card.offsetHeight || 280;
    if (x + w + margin > window.innerWidth) x = clientX - w - offset;
    if (y + h + margin > window.innerHeight) y = clientY - h - offset;
    x = Math.max(margin, Math.min(x, window.innerWidth - w - margin));
    y = Math.max(margin, Math.min(y, window.innerHeight - h - margin));
    card.style.left = `${x}px`;
    card.style.top = `${y}px`;
}

function scheduleHideElementPreviewCard() {
    if (previewHideTimer) clearTimeout(previewHideTimer);
    previewHideTimer = setTimeout(() => {
        hideElementPreviewCard();
        previewHideTimer = null;
    }, 120);
}

function hideElementPreviewCard() {
    const card = document.getElementById('element-hover-preview');
    if (card) card.classList.add('hidden');
}

// 兼容旧名（若仍有引用）
function showCategorySelector() {
    showHomeView();
}

// 智能布局函数：根据轨道类型设置网格布局
function setupGridLayout(categoryType, orbitalList) {
    // 移除所有布局类
    orbitalList.classList.remove(
        'orbital-list-s',
        'orbital-list-p',
        'orbital-list-d',
        'orbital-list-f',
        'orbital-list-g',
        'orbital-list-dodec',
        'orbital-list-icosa'
    );
    
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
        case 'dodec':
            orbitalList.classList.add('orbital-list-dodec');
            orbitalList.style.gridTemplateColumns = 'minmax(260px, 420px)';
            orbitalList.style.gridTemplateRows = 'auto';
            break;
        case 'icosa':
            orbitalList.classList.add('orbital-list-icosa');
            orbitalList.style.gridTemplateColumns = 'minmax(260px, 420px)';
            orbitalList.style.gridTemplateRows = 'auto';
            break;
        default:
            // 默认布局
            orbitalList.style.gridTemplateColumns = 'repeat(auto-fill, minmax(150px, 1fr))';
            orbitalList.style.gridTemplateRows = 'auto';
    }
}

// 显示轨道列表
function showOrbitalList(categoryType, options = {}) {
    currentView = 'orbital';
    currentCategory = categoryType;
    if (options.parent) orbitalListParent = options.parent;
    viewerReturnContext = { type: 'orbital', category: categoryType, parent: orbitalListParent };
    hideElementPreviewCard();
    
    const homeEl = document.getElementById('explorer-home');
    if (homeEl) homeEl.classList.add('hidden');
    document.getElementById('atomic-home')?.classList.add('hidden');
    document.getElementById('molecular-home')?.classList.add('hidden');
    const periodicEl = document.getElementById('periodic-selector');
    if (periodicEl) periodicEl.classList.add('hidden');
    document.getElementById('orbital-selector').classList.remove('hidden');
    const titleKey = CATEGORY_TITLE_KEYS[categoryType];
    document.getElementById('current-category-title').textContent = titleKey ? t(titleKey) : categoryType.toUpperCase();
    
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
    
    hideViewerOverlayControls();
    
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
                viewerReturnContext = { type: 'orbital', category: categoryType, parent: orbitalListParent };
                loadOrbital(actualModelId || orbitalId);
            });
        }
        
        orbitalList.appendChild(item);
    });
}

// 格式化轨道名称显示。新 ID：d/f/g 为 {n}d|f|g_{suffix}，如 3d_z2 → 3d<sub>z²</sub>
function formatOrbitalName(orbitalId, asHtml = true) {
    function toSub(s) { return s.replace(/2/g, '²').replace(/3/g, '³').replace(/4/g, '⁴'); }

    if (orbitalId === 'dodec_C20H20') {
        return asHtml ? 'C<sub>20</sub>H<sub>20</sub>' : 'C20H20';
    }

    if (orbitalId === 'icosa_B12H12') {
        return asHtml ? 'B<sub>12</sub>H<sub>12</sub><sup>2-</sup>' : 'B12H12^2-';
    }

    const molFormula = {
        mol_small_CH4: { html: 'CH<sub>4</sub>', plain: 'CH4' },
        mol_small_NH3: { html: 'NH<sub>3</sub>', plain: 'NH3' },
        mol_small_H2O: { html: 'H<sub>2</sub>O', plain: 'H2O' },
        mol_small_C2H4: { html: 'C<sub>2</sub>H<sub>4</sub>', plain: 'C2H4' },
        mol_small_C6H6: { html: 'C<sub>6</sub>H<sub>6</sub>', plain: 'C6H6' }
    };
    if (molFormula[orbitalId]) {
        return asHtml ? molFormula[orbitalId].html : molFormula[orbitalId].plain;
    }
    
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

/** dodec / icosa / molecule 在控制台共用「分子列表」切换 */
function isMolecularFamilyOrbitalId(id) {
    if (!id) return false;
    const ty = getOrbitalType(id);
    return ty === 'dodec' || ty === 'icosa' || ty === 'molecule';
}

function getNavigableOrbitalIdsForConsole() {
    if (currentOrbitalId && isMolecularFamilyOrbitalId(currentOrbitalId)) {
        return getAllMolecularOrbitalIds().filter((id) => hasOrbitalModel(id));
    }
    return getNavigableOrbitalIds(currentCategory);
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

function loadPlyGeometry(url, onProgress) {
    return new Promise((resolve, reject) => {
        loader.load(url, resolve, onProgress, reject);
    });
}

function getRenderableLayers(orbitalId, metadata) {
    if (Array.isArray(metadata?.layers) && metadata.layers.length > 0) {
        return metadata.layers.map((layer, index) => ({
            id: layer.id || `layer-${index}`,
            label: layer.label || `Layer ${index + 1}`,
            path: layer.path,
            url: getModelAssetUrl(orbitalId, layer.path),
            opacity: layer.opacity ?? metadata?.opacity ?? 0.8,
            sizeScale: layer.sizeScale ?? 1,
            defaultVisible: layer.defaultVisible !== false,
        }));
    }
    return [{
        id: 'main',
        label: 'Main',
        path: null,
        url: getPlyUrl(orbitalId),
        opacity: metadata?.opacity ?? 0.8,
        sizeScale: 1,
        defaultVisible: true,
    }];
}

function disposePointLayer(points) {
    if (!points) return;
    if (points.geometry) points.geometry.dispose();
    if (points.material) points.material.dispose();
}

function clearPointLayers() {
    orbitalLayerObjects.forEach(disposePointLayer);
    orbitalLayerObjects = [];
    orbitalPoints = null;
}

function createPointMaterial(geometry, layer, orbitalId) {
    const opacity = layer.opacity ?? currentMetadata?.opacity ?? 0.8;
    const size = settings.particleSize * (layer.sizeScale ?? 1);
    const hasColors = geometry.attributes.color !== undefined;

    let material;
    if (hasColors) {
        material = new THREE.PointsMaterial({
            size,
            vertexColors: true,
            transparent: true,
            opacity,
            blending: THREE.NormalBlending,
            depthWrite: false,
        });
    } else {
        material = new THREE.PointsMaterial({
            size,
            color: 0xffffff,
            transparent: true,
            opacity,
            blending: THREE.NormalBlending,
            depthWrite: false,
        });
        console.warn(`PLY file for ${orbitalId} layer ${layer.id} has no color information`);
    }
    material.userData.baseOpacity = opacity;
    return material;
}

function applyPointLayerSettings() {
    orbitalLayerObjects.forEach((points) => {
        if (!points.material) return;
        const sizeScale = points.userData?.sizeScale ?? 1;
        const baseOpacity = points.userData?.baseOpacity ?? currentMetadata?.opacity ?? 0.8;
        const visible = points.userData?.layerVisible !== false;
        points.visible = visible;
        points.material.size = settings.particleSize * sizeScale;
        points.material.opacity = visible ? baseOpacity : 0;
    });
}

function setLayerVisibility(layerId, visible) {
    orbitalLayerVisibility[layerId] = visible;
    orbitalLayerObjects.forEach((points) => {
        if (points.userData?.layerId === layerId) {
            points.userData.layerVisible = visible;
        }
    });
    applyPointLayerSettings();
}

function syncLayerToggleRow(rowId, checkboxId, layerId) {
    const row = document.getElementById(rowId);
    const checkbox = document.getElementById(checkboxId);
    if (!row || !checkbox) return;
    const layerExists = orbitalLayerObjects.some((points) => points.userData?.layerId === layerId);
    row.style.display = layerExists ? 'flex' : 'none';
    if (layerExists) {
        checkbox.checked = orbitalLayerVisibility[layerId] !== false;
    }
}

function updateLayerToggleControls() {
    syncLayerToggleRow('experiment-console-density-row', 'experiment-console-show-density', 'density');
    syncLayerToggleRow('experiment-console-homo-row', 'experiment-console-show-homo', 'homo');
}

// 加载轨道模型；opts.isSwitch 为同分类切换，不显示全屏 loading、不重复 showViewer
async function loadOrbital(orbitalId, opts = {}) {
    try {
        if (!opts.isSwitch) showLoadingOverlay(orbitalId);

        const actualModelId = getActualModelId(orbitalId) || orbitalId;
        currentMetadata = await loadMetadata(actualModelId);

        const nameEl = document.getElementById('orbital-name');
        if (nameEl) {
            nameEl.innerHTML = formatOrbitalName(orbitalId);
        }

        const layers = getRenderableLayers(actualModelId, currentMetadata);
        const geometries = await Promise.all(layers.map((layer, index) => loadPlyGeometry(
            layer.url,
            (progress) => {
                if (!opts.isSwitch && index === layers.length - 1) updateLoadingProgress(progress);
            },
        )));

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

        requestAnimationFrame(() => {
            try {
                orbitalGroup.children.slice().forEach((child) => {
                    if (child.userData?.isPointLayer) disposePointLayer(child);
                    if (child.userData?.isAxesHelper) disposeAxesGroup(child);
                });
                orbitalGroup.clear();
                clearPointLayers();

                let maxRadius = 0.5;
                const geometryInfo = layers.map((layer, index) => {
                    const geometry = geometries[index];
                    if (!geometry) throw new Error(t('explorer.modelFormatError'));
                    geometry.computeBoundingBox();
                    geometry.computeBoundingSphere();
                    return {
                        layer,
                        geometry,
                        center: geometry.boundingBox
                            ? geometry.boundingBox.getCenter(new THREE.Vector3())
                            : new THREE.Vector3(),
                    };
                });
                const anchor = (geometryInfo.find((item) => item.layer.id === 'density') || geometryInfo[0]).center.clone();

                geometryInfo.forEach(({ layer, geometry }) => {
                    geometry.translate(-anchor.x, -anchor.y, -anchor.z);
                    geometry.computeBoundingSphere();
                    maxRadius = Math.max(maxRadius, geometry.boundingSphere?.radius || 0.5);

                    const visible = orbitalLayerVisibility[layer.id] ?? layer.defaultVisible;
                    const material = createPointMaterial(geometry, layer, orbitalId);
                    const points = new THREE.Points(geometry, material);
                    points.userData = {
                        isPointLayer: true,
                        layerId: layer.id,
                        sizeScale: layer.sizeScale ?? 1,
                        baseOpacity: layer.opacity ?? currentMetadata?.opacity ?? 0.8,
                        layerVisible: visible,
                    };
                    orbitalLayerObjects.push(points);
                    orbitalGroup.add(points);

                    if (layer.id === 'homo' || (!orbitalPoints && layer.id !== 'density')) {
                        orbitalPoints = points;
                    }
                });

                if (!orbitalPoints) orbitalPoints = orbitalLayerObjects[0] || null;
                applyPointLayerSettings();
                updateLayerToggleControls();

                const L = Math.max(maxRadius * 1.2, 0.5);
                axesHelper = createAxesHelper(L);
                axesHelper.visible = settings.showAxes;
                setAxesLabelsVisibility(settings.showAxes);
                orbitalGroup.add(axesHelper);

                currentOrbitalId = orbitalId;
                currentCategory = getOrbitalType(orbitalId);

                if (camera) {
                    camera.position.set(0, 0, 15);
                    camera.lookAt(0, 0, 0);
                }
                const initialScale = currentMetadata?.recommendedScale || 1.0;
                if (renderController) {
                    renderController.targetQuaternion.set(0, 0, 0, 1);
                    renderController.currentQuaternion.set(0, 0, 0, 1);
                }
                if (orbitalGroup) {
                    orbitalGroup.quaternion.set(0, 0, 0, 1);
                    orbitalGroup.position.set(0, 0, 0);
                }
                if (!opts.isSwitch) {
                    prepareIntroAnimation(initialScale);
                } else if (renderController) {
                    renderController.targetScale = initialScale;
                    renderController.currentScale = initialScale;
                    orbitalGroup.scale.setScalar(initialScale);
                }

                requestAnimationFrame(() => {
                    if (renderer && scene && camera) {
                        renderer.render(scene, camera);
                    }
                    if (!opts.isSwitch) {
                        hideLoadingOverlay();
                        showViewer(opts);
                    } else {
                        refreshExperimentConsoleBlockSelect();
                        syncExperimentConsoleControls();
                    }
                    const orbitalSelect = document.getElementById('experiment-console-orbital-select');
                    if (orbitalSelect) orbitalSelect.value = currentOrbitalId;
                });
            } catch (renderError) {
                console.error('Error creating or rendering orbital points:', renderError);
                showLoadingError(`${t('explorer.renderFailed')}: ${renderError.message}`, orbitalId, opts);
            }
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
    const ids = getNavigableOrbitalIdsForConsole();
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
    updateLayerToggleControls();
}

function initExperimentConsole() {
    const root = document.getElementById('experiment-console');
    const header = document.getElementById('experiment-console-header');
    const autoRotate = document.getElementById('experiment-console-auto-rotate');
    const rotationSpeed = document.getElementById('experiment-console-rotation-speed');
    const showAxes = document.getElementById('experiment-console-show-axes');
    const showDensity = document.getElementById('experiment-console-show-density');
    const showHomo = document.getElementById('experiment-console-show-homo');
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
            applyPointLayerSettings();
        });
    }
    if (showDensity) {
        showDensity.addEventListener('change', () => {
            setLayerVisibility('density', showDensity.checked);
        });
    }
    if (showHomo) {
        showHomo.addEventListener('change', () => {
            setLayerVisibility('homo', showHomo.checked);
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
    hideElementPreviewCard();
    const homeEl = document.getElementById('explorer-home');
    if (homeEl) homeEl.classList.add('hidden');
    document.getElementById('atomic-home')?.classList.add('hidden');
    document.getElementById('molecular-home')?.classList.add('hidden');
    const periodicEl = document.getElementById('periodic-selector');
    if (periodicEl) periodicEl.classList.add('hidden');
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

    const viewerClearScreenButton = document.getElementById('viewer-clear-screen-button');
    if (viewerClearScreenButton) {
        viewerClearScreenButton.classList.remove('hidden');
        setClearScreenMode(clearScreenMode);
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
    
    // 检查是否需要显示教程（首次打开模型时）；初始化缩放动画在教程结束后再播放
    if (!opts?.isSwitch) {
        checkAndShowTutorial();
        if (sessionStorage.getItem(TUTORIAL_STORAGE_KEY)) {
            tryStartIntroAnimation();
        }
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
        tryStartIntroAnimation();
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
    tryStartIntroAnimation();
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
    
    // ESC：viewer → 上一屏；orbital/periodic → 首页
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (currentView === 'viewer') {
                handleViewerBack();
            } else if (currentView === 'periodic') {
                showAtomicHome();
            } else if (currentView === 'orbital') {
                if (orbitalListParent === 'atomic-home') showAtomicHome();
                else showHomeView();
            } else if (currentView === 'atomic-home' || currentView === 'molecular-home') {
                showHomeView();
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
        const introRunning = updateIntroAnimation(performance.now());
        const blockAutoRotate = introRunning || introAnimationPending || isTutorialVisible();
        // 自动旋转：排除鼠标拖拽（isMouseDown）和手势交互（isInteracting）
        // 当单手或双手捏合时，isInteracting 为 true，自动旋转停止
        // 当松开时，isInteracting 为 false，自动旋转恢复
        // 教程或初始化缩放动画期间暂停自动旋转
        if (renderController && !blockAutoRotate && !isMouseDown && !renderController.isInteracting && settings.autoRotate) {
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
    const localize = (value) => {
        if (typeof value === 'object' && value !== null) {
            return value[lang] || value.zh || value.en || '';
        }
        return value ?? '';
    };
    const kTitle = localize(knowledge.title);
    const kOrbitalType = localize(knowledge.basicInfo.orbitalType);
    const kDescription = localize(knowledge.basicInfo.description);
    const kShape = localize(knowledge.shapeFeatures.shape);
    const kSymmetry = localize(knowledge.shapeFeatures.symmetry);
    const kNodes = localize(knowledge.shapeFeatures.nodes);
    
    let html = `<div class="knowledge-title">${kTitle}</div>`;
    
    // 基本信息部分
    html += '<div class="knowledge-section">';
    html += `<div class="knowledge-section-title">${t('explorer.basicInfo')}</div>`;

    if (knowledge.basicInfo.kind === 'molecular') {
        const molecularFields = [
            ['explorer.molecule', localize(knowledge.basicInfo.molecule)],
            ['explorer.orbitalType', kOrbitalType],
            ['explorer.symmetryLabel', localize(knowledge.basicInfo.symmetry)],
            ['explorer.displayTarget', localize(knowledge.basicInfo.displayTarget)],
            ['explorer.method', localize(knowledge.basicInfo.method)],
            ['explorer.basis', localize(knowledge.basicInfo.basis)],
            ['explorer.chargeMultiplicity', localize(knowledge.basicInfo.chargeMultiplicity)],
            ['explorer.description', kDescription],
            ['explorer.scientificNote', localize(knowledge.basicInfo.scientificNote)]
        ];

        molecularFields.forEach(([labelKey, value]) => {
            if (!value) return;
            html += `<div class="knowledge-item">
        <div class="knowledge-item-label">${t(labelKey)}</div>
        <div class="knowledge-item-value">${value}</div>
    </div>`;
        });
    } else {
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
    }
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
