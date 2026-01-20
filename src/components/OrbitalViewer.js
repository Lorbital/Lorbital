/**
 * 核心 3D 轨道查看器组件
 * 
 * @module components/OrbitalViewer
 */

import * as THREE from 'three';
import { setupScene, handleResize } from '../three/setupScene.js';
import { loadPly } from '../three/loadPly.js';
import { RenderController } from '../three/renderer.js';
import { getPlyUrl, loadMetadata } from '../data/modelRegistry.js';
import { 
  DEFAULT_PARTICLE_SIZE, 
  DEFAULT_COLOR, 
  DEFAULT_OPACITY,
  MIN_SCALE,
  MAX_SCALE,
  ROTATION_SENSITIVITY,
  ZOOM_SENSITIVITY
} from '../utils/constants.js';

/**
 * 轨道查看器类
 */
export class OrbitalViewer {
  /**
   * @param {HTMLElement} container - 容器元素
   * @param {Object} options - 配置选项
   */
  constructor(container, options = {}) {
    this.container = container;
    this.options = options;

    // Three.js 对象
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.axesHelper = null;
    this.orbitalGroup = null;
    this.orbitalPoints = null;

    // 渲染控制器
    this.renderController = null;

    // 当前轨道信息
    this.currentOrbitalId = null;
    this.metadata = null;

    // 设置
    this.settings = {
      autoRotate: options.autoRotate === true, // 默认禁用自动旋转
      showAxes: options.showAxes !== false,
      particleSize: options.particleSize || DEFAULT_PARTICLE_SIZE,
      rotationSpeed: options.rotationSpeed || 0.0025,
      orbitalColor: options.orbitalColor || DEFAULT_COLOR
    };

    // 鼠标交互状态
    this.isMouseDown = false;
    this.lastMousePos = { x: 0, y: 0 };
  }

  /**
   * 初始化查看器
   */
  async init() {
    // 设置 Three.js 场景
    const { scene, camera, renderer, axesHelper } = setupScene(this.container);
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.axesHelper = axesHelper;

    // 创建轨道对象组
    this.orbitalGroup = new THREE.Group();
    this.scene.add(this.orbitalGroup);

    // 创建渲染控制器
    this.renderController = new RenderController(
      this.scene,
      this.camera,
      this.renderer,
      this.orbitalGroup,
      this.settings
    );

    // 初始化鼠标交互
    this.initMouseEvents();

    // 窗口大小变化处理
    window.addEventListener('resize', () => {
      handleResize(this.camera, this.renderer);
    });

    // 启动渲染循环
    this.renderController.start();

    // 设置坐标轴可见性
    this.axesHelper.visible = this.settings.showAxes;
  }

  /**
   * 初始化鼠标交互
   */
  initMouseEvents() {
    this.container.addEventListener('mousedown', (e) => {
      if (e.target.tagName !== 'CANVAS') return;
      this.isMouseDown = true;
      this.lastMousePos = { x: e.clientX, y: e.clientY };
      this.renderController.setInteracting(true);
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isMouseDown) return;
      // 屏幕坐标系：X向右增加，Y向下增加
      // 模型前面跟随鼠标：
      // - 鼠标向右 (e.clientX增加) -> deltaX正 -> 模型前面向右旋转
      // - 鼠标向上 (e.clientY减少) -> deltaY正 -> 模型前面向上旋转
      const deltaX = (e.clientX - this.lastMousePos.x) * ROTATION_SENSITIVITY;
      const deltaY = -(e.clientY - this.lastMousePos.y) * ROTATION_SENSITIVITY;
      
      this.renderController.setTargetRotation(deltaX, deltaY);
      this.lastMousePos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isMouseDown = false;
      this.renderController.setInteracting(false);
    });

    window.addEventListener('wheel', (e) => {
      e.preventDefault();
      const currentScale = this.renderController.targetScale;
      const newScale = currentScale * Math.pow(0.999, e.deltaY * ZOOM_SENSITIVITY);
      const clampedScale = THREE.MathUtils.clamp(newScale, MIN_SCALE, MAX_SCALE);
      this.renderController.setTargetScale(clampedScale);
      this.renderController.setInteracting(true);
      setTimeout(() => {
        this.renderController.setInteracting(false);
      }, 100);
    }, { passive: false });
  }

  /**
   * 加载轨道模型
   * 
   * @param {string} orbitalId - 轨道 ID
   * @param {Function} onProgress - 进度回调
   */
  async loadModel(orbitalId, onProgress) {
    try {
      // 显示加载状态
      if (onProgress) onProgress({ loading: true, orbitalId });

      // 加载元数据
      this.metadata = await loadMetadata(orbitalId);
      this.currentOrbitalId = orbitalId;

      // 加载 PLY 文件
      const plyUrl = getPlyUrl(orbitalId);
      const geometry = await loadPly(plyUrl);

      // 清除旧模型
      this.orbitalGroup.clear();

      // 若 PLY 含顶点颜色（红/蓝表示波函数正负），则使用顶点颜色；否则用 metadata/设置中的颜色
      const hasVertexColors = !!(geometry.attributes && geometry.attributes.color);

      const material = new THREE.PointsMaterial({
        size: this.settings.particleSize,
        color: hasVertexColors
          ? new THREE.Color(0xffffff)
          : new THREE.Color(this.metadata.color || this.settings.orbitalColor),
        vertexColors: hasVertexColors,
        transparent: true,
        opacity: this.metadata.opacity || DEFAULT_OPACITY,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      material.userData.baseOpacity = this.metadata?.opacity ?? DEFAULT_OPACITY;

      // 创建点云
      this.orbitalPoints = new THREE.Points(geometry, material);
      this.orbitalGroup.add(this.orbitalPoints);

      // 应用推荐缩放
      if (this.metadata.recommendedScale) {
        this.renderController.targetScale = this.metadata.recommendedScale;
        this.renderController.currentScale = this.metadata.recommendedScale;
      }

      // 完成加载
      if (onProgress) onProgress({ loading: false, orbitalId, metadata: this.metadata });

    } catch (error) {
      console.error(`Failed to load model ${orbitalId}:`, error);
      if (onProgress) onProgress({ loading: false, error: error.message });
      throw error;
    }
  }

  /**
   * 设置粒子大小
   * 
   * @param {number} size - 粒子大小
   */
  setParticleSize(size) {
    this.settings.particleSize = size;
    if (this.orbitalPoints) {
      this.orbitalPoints.material.size = size;
    }
  }

  /**
   * 设置轨道颜色
   * 
   * @param {string} color - 颜色（HEX）
   */
  setColor(color) {
    this.settings.orbitalColor = color;
    if (this.orbitalPoints) {
      this.orbitalPoints.material.color.set(color);
    }
  }

  /**
   * 设置坐标轴可见性
   * 
   * @param {boolean} visible - 是否可见
   */
  setAxesVisible(visible) {
    this.settings.showAxes = visible;
    if (this.axesHelper) {
      this.axesHelper.visible = visible;
    }
  }

  /**
   * 设置自动旋转
   * 
   * @param {boolean} autoRotate - 是否自动旋转
   */
  setAutoRotate(autoRotate) {
    this.settings.autoRotate = autoRotate;
  }

  /**
   * 设置旋转速度
   * 
   * @param {number} speed - 旋转速度
   */
  setRotationSpeed(speed) {
    this.settings.rotationSpeed = speed;
  }

  /**
   * 获取当前轨道 ID
   * 
   * @returns {string|null} 当前轨道 ID
   */
  getCurrentOrbitalId() {
    return this.currentOrbitalId;
  }

  /**
   * 获取当前元数据
   * 
   * @returns {Object|null} 当前元数据
   */
  getMetadata() {
    return this.metadata;
  }

  /**
   * 获取渲染控制器（用于手势控制等外部控制）
   * 
   * @returns {RenderController} 渲染控制器
   */
  getRenderController() {
    return this.renderController;
  }

  /**
   * 销毁查看器
   */
  destroy() {
    if (this.renderController) {
      this.renderController.stop();
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
    window.removeEventListener('resize', handleResize);
  }
}
