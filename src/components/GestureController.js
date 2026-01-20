/**
 * 手势控制器组件
 * 
 * 集成 MediaPipe 手势识别，控制轨道查看器
 * 
 * @module components/GestureController
 */

import { HandTracker } from '../gesture/handTracker.js';
import { GestureState } from '../gesture/gestureMapping.js';
import { ZOOM_SENSITIVITY_MULTIPLIER, MIN_SCALE, MAX_SCALE, GESTURE_TIMEOUT, ROTATION_DEAD_ZONE, ROTATION_SENSITIVITY, TWO_HAND_STABLE_FRAMES } from '../utils/constants.js';
import * as THREE from 'three';

/**
 * 手势控制器
 */
export class GestureController {
  /**
   * @param {HTMLVideoElement} videoElement - 视频元素
   * @param {OrbitalViewer} viewer - 轨道查看器实例
   * @param {Object} options - 配置选项
   */
  constructor(videoElement, viewer, options = {}) {
    this.videoElement = videoElement;
    this.viewer = viewer;
    this.options = options;
    this.enabled = options.enabled !== false;
    this.invertRotationY = options.invertRotationY === true;

    // 手势跟踪器
    this.handTracker = null;

    // 手势状态
    this.pinchState = GestureState.NONE;
    this.lastHandPos = null;
    this.lastTwoHandDist = 0;
    this.twoHandStableCount = 0;
    
    // 单手拖拽状态（完全模仿鼠标控制）
    this.isDragging = false;
    
    // 超时检测
    this.lastGestureTime = 0;
    this.timeoutTimer = null;
  }

  /**
   * 初始化手势控制器
   */
  async init() {
    if (!this.enabled) {
      return;
    }

    this.handTracker = new HandTracker(
      this.videoElement,
      (gesture, results) => this.onGestureDetected(gesture, results)
    );

    await this.handTracker.init();
  }

  /**
   * 启动手势跟踪
   */
  start() {
    if (this.handTracker && this.enabled) {
      this.handTracker.start();
    }
  }

  /**
   * 停止手势跟踪
   */
  stop() {
    if (this.handTracker) {
      this.handTracker.stop();
    }
    const renderController = this.viewer?.getRenderController();
    this.resetState(renderController);
  }

  /**
   * 手势检测回调
   * 
   * 改进：
   * 1. 添加状态超时检测，防止失控
   * 2. 改进状态切换逻辑，确保状态正确重置
   * 3. 添加状态切换时的清理逻辑
   * 
   * @param {Object} gesture - 手势信息
   * @param {Object} results - MediaPipe 结果
   */
  onGestureDetected(gesture, results) {
    if (!this.enabled || !this.viewer) {
      return;
    }

    const renderController = this.viewer.getRenderController();
    if (!renderController) {
      return;
    }

    const now = Date.now();
    
    // 无手势
    if (gesture.state === GestureState.NONE) {
      this.twoHandStableCount = 0;
      // 视为 mouseup：立即结束拖拽，避免下次捏合产生跳变
      if (this.isDragging) {
        this.isDragging = false;
        this.lastHandPos = null;
        if (renderController) {
          renderController.targetQuaternion.copy(renderController.currentQuaternion);
          renderController.targetScale = renderController.currentScale;
          renderController.setInteracting(false);
        }
      }
      // 如果之前有手势状态
      if (this.pinchState !== GestureState.NONE) {
        // 设置延迟重置（避免快速切换时的抖动）
        if (this.timeoutTimer) {
          clearTimeout(this.timeoutTimer);
        }
        this.timeoutTimer = setTimeout(() => {
          this.resetState(renderController);
        }, 200); // 200ms延迟重置，避免快速切换时抖动
      }
      return;
    }

    // 有手势，更新时间戳
    this.lastGestureTime = now;
    
    // 清除超时定时器
    if (this.timeoutTimer) {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;
    }
    
    // 设置新的超时定时器
    this.timeoutTimer = setTimeout(() => {
      this.resetState(renderController);
    }, GESTURE_TIMEOUT);

    // 双手捏合去抖：需要连续稳定帧才进入双手状态
    let effectiveGesture = gesture;
    if (gesture.state === GestureState.TWO_HAND_PINCH) {
      this.twoHandStableCount += 1;
      if (this.twoHandStableCount < TWO_HAND_STABLE_FRAMES) {
        effectiveGesture = this.getFallbackSingleHandGesture(gesture);
      }
    } else {
      this.twoHandStableCount = 0;
    }

    // 状态切换：如果新状态与旧状态不同，需要重置相关变量
    if (effectiveGesture.state !== this.pinchState) {
      this.handleStateChange(this.pinchState, effectiveGesture.state);
      this.pinchState = effectiveGesture.state;
    }

    // 单手捏合：旋转（完全模仿鼠标控制的逻辑）
    if (effectiveGesture.state === GestureState.SINGLE_HAND_PINCH) {
      // 开始拖拽（相当于鼠标按下）
      if (!this.isDragging) {
        this.isDragging = true;
        // 记录初始位置（相当于 mousedown 时记录 lastMouseX, lastMouseY）
        // 每次开始新的拖拽时，都从当前位置开始计算（完全模仿鼠标控制）
        // 这样每次重新捏合时，会从新的位置开始，但模型的旋转状态会保持（因为 renderController 保持状态）
        this.lastHandPos = { x: effectiveGesture.data.palm.x, y: effectiveGesture.data.palm.y };
        renderController.setInteracting(true);
      } else {
        // 拖拽中（相当于 mousemove）
        // 计算手掌位置变化（完全模仿鼠标的 deltaX, deltaY 计算）
        if (!this.lastHandPos) {
          this.lastHandPos = { x: effectiveGesture.data.palm.x, y: effectiveGesture.data.palm.y };
          return;
        }
        const deltaX = effectiveGesture.data.palm.x - this.lastHandPos.x;
        const deltaY = effectiveGesture.data.palm.y - this.lastHandPos.y;
        const { width, height } = this.getInteractionBounds(renderController);
        const deltaXpx = deltaX * width;
        const deltaYpx = deltaY * height;
        const deadZonePx = ROTATION_DEAD_ZONE * Math.min(width, height);
        if (Math.abs(deltaXpx) < deadZonePx && Math.abs(deltaYpx) < deadZonePx) {
          // 小幅移动不触发旋转，但更新基准位置，避免累积位移
          this.lastHandPos = { x: effectiveGesture.data.palm.x, y: effectiveGesture.data.palm.y };
          return;
        }
        
        // 向右移动（deltaX > 0）→ 绕Y轴逆时针旋转
        // 向上移动（deltaY > 0）→ 绕X轴顺时针旋转（需要取反）
        // 完全模仿鼠标控制的旋转逻辑
        const rotationDeltaX = -deltaXpx * ROTATION_SENSITIVITY;
        const rotationDeltaY = (this.invertRotationY ? deltaYpx : -deltaYpx) * ROTATION_SENSITIVITY;

        if (renderController) {
          renderController.setTargetRotation(rotationDeltaX, rotationDeltaY);
        }

        // 更新上次手掌位置（完全模仿鼠标控制的 lastMouseX, lastMouseY 更新）
        this.lastHandPos = { x: effectiveGesture.data.palm.x, y: effectiveGesture.data.palm.y };
      }
    } else if (effectiveGesture.state === GestureState.TWO_HAND_PINCH) {
      // 双手捏合：缩放
      const currentDist = effectiveGesture.data.distance;

      // 如果 lastTwoHandDist 未初始化，初始化它（跳过第一次计算，避免突然缩放）
      if (this.lastTwoHandDist === 0 || this.lastTwoHandDist < 0.001) {
        // 首次进入，初始化距离（但不计算缩放，避免突然跳跃）
        this.lastTwoHandDist = currentDist;
      } else {
        // 计算并应用缩放
        // 使用更稳定的计算方式，避免突变
        const ratio = currentDist / this.lastTwoHandDist;
        
        // 限制比例变化范围，避免突然的缩放
        const clampedRatio = THREE.MathUtils.clamp(ratio, 0.5, 2.0);
        
        const scaleFactor = 1 + (clampedRatio - 1) * ZOOM_SENSITIVITY_MULTIPLIER;
        
        const currentScale = renderController.targetScale;
        const newScale = currentScale * scaleFactor;
        const clampedScale = THREE.MathUtils.clamp(newScale, MIN_SCALE, MAX_SCALE);
        
        renderController.setTargetScale(clampedScale);
        // 更新基准距离
        this.lastTwoHandDist = currentDist;
      }
    } else {
      // 手势结束（相当于 mouseup）
      if (this.isDragging) {
        this.isDragging = false;
        // 结束单手捏合时重置基准位置，确保下次捏合从当前位置开始
        this.lastHandPos = null;
        if (renderController) {
          // 结束交互后锁定当前姿态，避免插值继续造成漂移
          renderController.targetQuaternion.copy(renderController.currentQuaternion);
          renderController.targetScale = renderController.currentScale;
          renderController.setInteracting(false);
        }
      }
    }
  }

  /**
   * 根据渲染器尺寸获取交互边界
   *
   * @param {Object} renderController - 渲染控制器
   * @returns {{width:number, height:number}}
   */
  getInteractionBounds(renderController) {
    const domElement = renderController?.renderer?.domElement;
    if (domElement && domElement.getBoundingClientRect) {
      const rect = domElement.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        return { width: rect.width, height: rect.height };
      }
    }
    return { width: window.innerWidth || 1, height: window.innerHeight || 1 };
  }

  /**
   * 双手检测去抖期间，将双手手势映射为单手手势
   *
   * @param {Object} gesture - 原始手势
   * @returns {Object} 单手手势
   */
  getFallbackSingleHandGesture(gesture) {
    if (!gesture || gesture.state !== GestureState.TWO_HAND_PINCH || !gesture.data) {
      return gesture;
    }
    const { hand1Palm, hand2Palm, pinch1, pinch2 } = gesture.data;
    let chosenPalm = hand1Palm;
    if (this.lastHandPos && hand1Palm && hand2Palm) {
      const dist1 = Math.hypot(hand1Palm.x - this.lastHandPos.x, hand1Palm.y - this.lastHandPos.y);
      const dist2 = Math.hypot(hand2Palm.x - this.lastHandPos.x, hand2Palm.y - this.lastHandPos.y);
      chosenPalm = dist1 <= dist2 ? hand1Palm : hand2Palm;
    } else if (!hand1Palm && hand2Palm) {
      chosenPalm = hand2Palm;
    }

    const pinchDist = Math.min(pinch1 ?? Number.POSITIVE_INFINITY, pinch2 ?? Number.POSITIVE_INFINITY);
    return {
      state: GestureState.SINGLE_HAND_PINCH,
      data: {
        palm: chosenPalm,
        pinchDist
      }
    };
  }

  /**
   * 处理状态切换
   * 
   * 改进：更平滑的状态切换，避免突变
   * 确保状态切换时相关变量正确重置，避免从旧状态继承值导致的突变
   * 
   * @param {number} oldState - 旧状态
   * @param {number} newState - 新状态
   */
  handleStateChange(oldState, newState) {
    // 进入单手状态前先清理拖拽状态与基准位置
    if (newState === GestureState.SINGLE_HAND_PINCH) {
      this.isDragging = false;
      this.lastHandPos = null;
    }
    
    // 从任何状态切换到双手，重置距离（确保从头开始）
    // 首次进入双手状态时会跳过第一次计算，避免突然缩放
    if (newState === GestureState.TWO_HAND_PINCH) {
      this.lastTwoHandDist = 0;
      this.isDragging = false;
      this.lastHandPos = null;
    }
  }

  /**
   * 重置状态
   * 
   * @param {Object} renderController - 渲染控制器
   */
  resetState(renderController) {
    this.pinchState = GestureState.NONE;
    this.isDragging = false;
    // 重置基准位置，确保下次捏合从当前位置开始
    this.lastHandPos = null;
    this.lastTwoHandDist = 0;
    this.twoHandStableCount = 0;
    this.lastGestureTime = 0;
    
    if (this.timeoutTimer) {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;
    }
    
    if (renderController) {
      renderController.setInteracting(false);
    }
  }

  /**
   * 启用/禁用手势控制
   * 
   * @param {boolean} enabled - 是否启用
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    if (!enabled) {
      // 禁用时停止手势跟踪
      this.stop();
    }
    // 启用时不会自动启动，需要用户手动点击"启动手势"按钮
  }

  /**
   * 销毁控制器
   */
  destroy() {
    this.stop();
    if (this.timeoutTimer) {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;
    }
    if (this.handTracker) {
      this.handTracker.destroy();
      this.handTracker = null;
    }
  }
}
