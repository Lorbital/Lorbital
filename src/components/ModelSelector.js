/**
 * 模型选择器组件（GUI）
 * 
 * 使用 lil-gui 创建模型选择界面
 * 
 * @module components/ModelSelector
 */

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MODEL_REGISTRY } from '../data/modelRegistry.js';

/**
 * 模型选择器
 */
export class ModelSelector {
  /**
   * @param {OrbitalViewer} viewer - 轨道查看器实例
   * @param {Object} settings - 设置对象（可双向绑定）
   */
  constructor(viewer, settings) {
    this.viewer = viewer;
    this.settings = settings;
    this.gui = null;
    this.onModelChange = null;
  }

  /**
   * 初始化 GUI
   */
  init() {
    this.gui = new GUI({ title: '⚛️ 实验控制台' });

    // 渲染设置
    const visualFolder = this.gui.addFolder('渲染设置');
    visualFolder.addColor(this.settings, 'orbitalColor')
      .name('轨道色彩')
      .onChange((v) => {
        if (this.viewer) this.viewer.setColor(v);
      });

    visualFolder.add(this.settings, 'particleSize', 0.005, 0.05)
      .name('粒子粒径')
      .onChange((v) => {
        if (this.viewer) this.viewer.setParticleSize(v);
      });

    visualFolder.add(this.settings, 'showAxes')
      .name('显示坐标')
      .onChange((v) => {
        if (this.viewer) this.viewer.setAxesVisible(v);
      });
    visualFolder.open();

    // 运动动力学
    const motionFolder = this.gui.addFolder('运动动力学');
    motionFolder.add(this.settings, 'autoRotate')
      .name('自转巡航')
      .onChange((v) => {
        if (this.viewer) this.viewer.setAutoRotate(v);
      });

    motionFolder.add(this.settings, 'rotationSpeed', 0.001, 0.02)
      .name('旋转速度')
      .onChange((v) => {
        if (this.viewer) this.viewer.setRotationSpeed(v);
      });

    // 模型选择
    for (const category in MODEL_REGISTRY) {
      const folder = this.gui.addFolder(category);
      MODEL_REGISTRY[category].forEach((orbitalId) => {
        const displayName = orbitalId.toUpperCase().replace(/_/g, ' ');
        folder.add(
          { load: () => this.loadModel(orbitalId) },
          'load'
        ).name(displayName);
      });
      folder.close();
    }
  }

  /**
   * 加载模型
   * 
   * @param {string} orbitalId - 轨道 ID
   */
  async loadModel(orbitalId) {
    if (this.onModelChange) {
      this.onModelChange({ loading: true, orbitalId });
    }

    try {
      await this.viewer.loadModel(orbitalId, (progress) => {
        if (this.onModelChange) {
          this.onModelChange(progress);
        }
      });
    } catch (error) {
      console.error('Failed to load model:', error);
      if (this.onModelChange) {
        this.onModelChange({ loading: false, error: error.message });
      }
    }
  }

  /**
   * 设置模型变更回调
   * 
   * @param {Function} callback - 回调函数
   */
  onModelChangeCallback(callback) {
    this.onModelChange = callback;
  }

  /**
   * 销毁 GUI
   */
  destroy() {
    if (this.gui) {
      this.gui.destroy();
      this.gui = null;
    }
  }
}
