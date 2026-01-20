/**
 * 渲染循环与动画逻辑
 * 
 * @module three/renderer
 */

import * as THREE from 'three';
import { LERP_FACTOR } from '../utils/constants.js';

/**
 * 渲染控制器
 * 
 * 管理渲染循环和平滑插值
 */
export class RenderController {
  /**
   * @param {THREE.Scene} scene - Three.js 场景
   * @param {THREE.PerspectiveCamera} camera - 相机
   * @param {THREE.WebGLRenderer} renderer - 渲染器
   * @param {THREE.Group} orbitalGroup - 轨道对象组
   * @param {Object} settings - 设置对象
   */
  constructor(scene, camera, renderer, orbitalGroup, settings) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.orbitalGroup = orbitalGroup;
    this.settings = settings;

    // 使用四元数避免万向锁问题
    // 使用四元数存储旋转，确保无论旋转到什么角度，左右移动都是沿着屏幕的垂直轴旋转
    this.targetQuaternion = new THREE.Quaternion();
    this.currentQuaternion = new THREE.Quaternion();
    this.orbitalGroup.quaternion.copy(this.currentQuaternion);

    // 缩放状态
    this.targetScale = 1.0;
    this.currentScale = 1.0;

    // 交互状态
    this.isInteracting = false;
    this.animationFrameId = null;
  }

  /**
   * 设置目标旋转（基于屏幕空间的旋转 - MeshLab 风格的轨道球旋转）
   * 
   * 关键：使用屏幕坐标系进行向量运算，确保旋转轴始终相对于屏幕，而不是模型坐标系。
   * 
   * 实现原理：
   * 1. 屏幕空间的增量（deltaX, deltaY）转换为绕屏幕坐标系轴的旋转
   * 2. 旋转轴始终是屏幕坐标系的固定轴（相机的上方向和右方向）
   * 3. 旋转在世界坐标系中应用，但旋转轴始终相对于屏幕
   * 
   * 数学原理：
   * - 向右移动（deltaX > 0）→ 绕屏幕的垂直轴（+Y轴）旋转
   * - 向上移动（deltaY > 0）→ 绕屏幕的水平轴（+X轴）旋转
   * - 旋转轴始终是屏幕坐标系的轴，不随模型旋转而改变
   * 
   * @param {number} deltaX - 屏幕X轴旋转增量（鼠标/手势向右为正）
   * @param {number} deltaY - 屏幕Y轴旋转增量（鼠标/手势向上为正）
   */
  setTargetRotation(deltaX, deltaY) {
    // 屏幕坐标系的固定轴（世界坐标系中的固定轴）
    // 这些轴始终相对于屏幕，不随模型旋转而改变
    // 相机默认朝向 -Z，上方向是 +Y，右方向是 +X
    const screenUp = new THREE.Vector3(0, 1, 0);    // 屏幕垂直轴（向上）
    const screenRight = new THREE.Vector3(1, 0, 0); // 屏幕水平轴（向右）
    
    // 创建基于屏幕坐标系的旋转增量
    // 关键：使用屏幕坐标系的固定轴，这些轴始终相对于屏幕
    // deltaX > 0（向右移动）→ 绕屏幕的垂直轴（+Y）旋转，让模型前端向右移动
    const quatUp = new THREE.Quaternion().setFromAxisAngle(screenUp, deltaX);
    // deltaY > 0（向上移动）→ 绕屏幕的水平轴（+X）旋转，让模型前端向上移动
    const quatRight = new THREE.Quaternion().setFromAxisAngle(screenRight, deltaY);
    
    // 关键修复：使用 premultiply 在世界坐标系中应用旋转
    // premultiply 意味着：this = rotation * this
    // 这样旋转是在世界坐标系中应用的，旋转轴始终是屏幕坐标系的轴
    // 旋转顺序：先应用水平旋转（绕屏幕右轴），再应用垂直旋转（绕屏幕上轴）
    // 注意：premultiply 的顺序是反的，所以先应用 quatUp，再应用 quatRight
    this.targetQuaternion.premultiply(quatRight);
    this.targetQuaternion.premultiply(quatUp);
    
    // 规范化四元数，避免数值误差
    this.targetQuaternion.normalize();
    
    this.isInteracting = true;
  }

  /**
   * 设置目标缩放
   * 
   * @param {number} scale - 缩放值
   */
  setTargetScale(scale) {
    this.targetScale = scale;
    this.isInteracting = true;
  }

  /**
   * 设置交互状态
   * 
   * @param {boolean} interacting - 是否正在交互
   */
  setInteracting(interacting) {
    this.isInteracting = interacting;
    
    // 交互结束时，规范化旋转角度，避免累积误差
    if (!interacting) {
      this.normalizeRotation();
    }
  }

  /**
   * 规范化旋转
   * 
   * 在每次交互结束后调用，确保四元数规范化，避免数值误差。
   */
  normalizeRotation() {
    // 规范化四元数，避免数值误差
    this.targetQuaternion.normalize();
    this.currentQuaternion.normalize();
  }

  /**
   * 启动渲染循环
   */
  start() {
    if (this.animationFrameId) return;
    this.animate();
  }

  /**
   * 停止渲染循环
   */
  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * 渲染循环
   */
  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    // 平滑插值：旋转（四元数）
    this.currentQuaternion.slerp(this.targetQuaternion, LERP_FACTOR);

    // 平滑插值：缩放
    this.currentScale = THREE.MathUtils.lerp(
      this.currentScale,
      this.targetScale,
      LERP_FACTOR
    );

    // 应用变换
    this.orbitalGroup.quaternion.copy(this.currentQuaternion);
    this.orbitalGroup.scale.setScalar(this.currentScale);

    // 渲染
    this.renderer.render(this.scene, this.camera);
  }
}
