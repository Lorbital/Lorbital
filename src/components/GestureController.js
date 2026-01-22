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
    
    // #region agent log
    // Debug: 跟踪上次回调时间
    this.lastCallbackTime = 0;
    // #endregion
    
    // 平滑处理：用于快速移动时的平滑
    this.lastRotationDeltaX = 0;
    this.lastRotationDeltaY = 0;
    this.rotationSmoothingFactor = 0.6; // 平滑因子，提高响应速度（从0.3提高到0.6）
    this.minSmoothingFactor = 0.4; // 快速移动时的最小平滑因子
    this.maxSmoothingFactor = 0.8; // 慢速移动时的最大平滑因子
    
    /**
     * 速度历史和平滑：用于平滑速度变化，避免从快速到慢速时的突变
     * 
     * 优化经验：
     * 1. 直接根据当前速度切换平滑因子会导致从快速到慢速时出现突变
     * 2. 解决方案：使用三层平滑机制
     *    - 第一层：平滑速度值本身（smoothedSpeed），避免速度突然跳跃
     *    - 第二层：根据平滑后的速度计算目标平滑因子（mapSpeedToSmoothingFactor）
     *    - 第三层：平滑过渡平滑因子（currentSmoothingFactor），避免平滑因子突然变化
     * 3. 这样即使手势从快速突然变慢，也能平滑过渡，不会出现卡顿
     */
    this.smoothedSpeed = 0; // 平滑后的速度值（使用EMA平滑）
    this.currentSmoothingFactor = 0.6; // 当前使用的平滑因子（会平滑过渡，避免突变）
    this.speedSmoothingFactor = 0.3; // 速度平滑因子（用于平滑速度变化）
    this.smoothingFactorTransitionRate = 0.2; // 平滑因子过渡速率（用于平滑平滑因子的变化）
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
        // 开始新的拖拽时立即重置平滑状态，避免从旧状态继承
        this.lastRotationDeltaX = 0;
        this.lastRotationDeltaY = 0;
        this.lastCallbackTime = 0; // 重置回调时间，避免时间归一化错误
        // 重置速度和平滑因子相关状态
        this.smoothedSpeed = 0;
        this.currentSmoothingFactor = this.rotationSmoothingFactor;
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
        
        // #region agent log
        const callbackTime = Date.now();
        const timeSinceLastCallback = this.lastCallbackTime > 0 ? callbackTime - this.lastCallbackTime : 0;
        this.lastCallbackTime = callbackTime;
        fetch('http://127.0.0.1:7242/ingest/850e76a1-caf4-489c-9914-1d5532476236',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'GestureController.js:180',message:'Gesture delta calculated',data:{deltaX,deltaY,deltaXpx,deltaYpx,deadZonePx,timeSinceLastCallback,absDeltaXpx:Math.abs(deltaXpx),absDeltaYpx:Math.abs(deltaYpx)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        
        if (Math.abs(deltaXpx) < deadZonePx && Math.abs(deltaYpx) < deadZonePx) {
          // 小幅移动不触发旋转，但更新基准位置，避免累积位移
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/850e76a1-caf4-489c-9914-1d5532476236',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'GestureController.js:186',message:'Dead zone filtered',data:{deltaXpx,deltaYpx,deadZonePx},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
          // #endregion
          this.lastHandPos = { x: effectiveGesture.data.palm.x, y: effectiveGesture.data.palm.y };
          return;
        }
        
        /**
         * 优化：基于时间的速度归一化，解决MediaPipe回调频率不固定导致的卡顿
         * 
         * 问题背景：
         * - MediaPipe的回调频率不稳定，可能导致相同的手势移动在不同时间间隔下产生不同的delta值
         * - 如果不进行归一化，快速移动时可能出现卡顿或跳跃
         * 
         * 解决方案：
         * 1. 只在合理的时间间隔范围内（8ms-100ms）进行归一化
         * 2. 限制归一化比例在0.5-2.0之间，避免极端放大或缩小
         * 3. 如果时间间隔过大（>100ms），可能是检测中断，使用原始值但限制最大值
         * 
         * 标准帧时间（假设60fps，约16.67ms）
         */
        const STANDARD_FRAME_TIME = 16.67;
        // 合理的时间间隔范围（8ms-100ms，对应120fps到10fps）
        const MIN_FRAME_TIME = 8;
        const MAX_FRAME_TIME = 100;
        
        let normalizedDeltaXpx = deltaXpx;
        let normalizedDeltaYpx = deltaYpx;
        
        // 只在合理的时间间隔范围内进行归一化，避免异常值导致的问题
        if (timeSinceLastCallback > 0 && timeSinceLastCallback >= MIN_FRAME_TIME && timeSinceLastCallback <= MAX_FRAME_TIME) {
          // 时间间隔在合理范围内，进行归一化
          const timeRatio = STANDARD_FRAME_TIME / timeSinceLastCallback;
          // 限制归一化比例，避免极端放大或缩小
          const clampedTimeRatio = Math.max(0.5, Math.min(2.0, timeRatio));
          normalizedDeltaXpx = deltaXpx * clampedTimeRatio;
          normalizedDeltaYpx = deltaYpx * clampedTimeRatio;
        } else if (timeSinceLastCallback > MAX_FRAME_TIME) {
          // 如果时间间隔过大，可能是检测中断，不进行归一化，直接使用原始值
          // 但限制最大值，避免突然跳跃
          normalizedDeltaXpx = Math.max(-100, Math.min(100, deltaXpx));
          normalizedDeltaYpx = Math.max(-100, Math.min(100, deltaYpx));
        }
        
        // 提高单次delta的最大值，允许更快的响应（从50提高到100）
        const MAX_DELTA_PX = 100;
        normalizedDeltaXpx = Math.max(-MAX_DELTA_PX, Math.min(MAX_DELTA_PX, normalizedDeltaXpx));
        normalizedDeltaYpx = Math.max(-MAX_DELTA_PX, Math.min(MAX_DELTA_PX, normalizedDeltaYpx));
        
        /**
         * 动态平滑处理：使用三层平滑机制，平滑地从快速过渡到慢速
         * 
         * 优化经验总结：
         * 1. 问题：直接根据当前速度切换平滑因子会导致从快速到慢速时出现突变和卡顿
         * 2. 解决方案：使用三层平滑机制
         *    a) 第一层：平滑速度值本身（smoothedSpeed）
         *       - 使用EMA（指数移动平均）平滑当前速度
         *       - 避免速度突然跳跃，提供稳定的速度历史
         *    b) 第二层：根据平滑后的速度计算目标平滑因子
         *       - 使用mapSpeedToSmoothingFactor()函数
         *       - 使用平滑曲线（三次贝塞尔曲线近似）进行映射
         *    c) 第三层：平滑过渡平滑因子（currentSmoothingFactor）
         *       - 使用EMA平滑目标平滑因子
         *       - 避免平滑因子突然变化导致的不流畅
         * 3. 效果：即使手势从快速突然变慢，也能平滑过渡，不会出现卡顿
         * 
         * 参数调优经验：
         * - speedSmoothingFactor = 0.3：速度平滑因子，控制速度变化的响应速度
         * - smoothingFactorTransitionRate = 0.2：平滑因子过渡速率，控制平滑因子变化的响应速度
         * - 这两个参数需要平衡：太小会导致响应延迟，太大会导致抖动
         */
        const currentSpeed = Math.hypot(normalizedDeltaXpx, normalizedDeltaYpx);
        
        // 第一层：平滑速度值，避免突然的速度跳跃
        this.smoothedSpeed = this.smoothedSpeed * (1 - this.speedSmoothingFactor) + currentSpeed * this.speedSmoothingFactor;
        
        // 第二层：根据平滑后的速度计算目标平滑因子
        const targetSmoothingFactor = this.mapSpeedToSmoothingFactor(this.smoothedSpeed);
        
        // 第三层：平滑过渡平滑因子，避免平滑因子突然变化导致的不流畅
        this.currentSmoothingFactor = this.currentSmoothingFactor * (1 - this.smoothingFactorTransitionRate) + 
                                      targetSmoothingFactor * this.smoothingFactorTransitionRate;
        
        // 使用平滑后的平滑因子进行最终的平滑处理
        const smoothedDeltaXpx = this.lastRotationDeltaX * (1 - this.currentSmoothingFactor) + normalizedDeltaXpx * this.currentSmoothingFactor;
        const smoothedDeltaYpx = this.lastRotationDeltaY * (1 - this.currentSmoothingFactor) + normalizedDeltaYpx * this.currentSmoothingFactor;
        this.lastRotationDeltaX = smoothedDeltaXpx;
        this.lastRotationDeltaY = smoothedDeltaYpx;
        
        // 向右移动（deltaX > 0）→ 绕Y轴逆时针旋转
        // 向上移动（deltaY > 0）→ 绕X轴顺时针旋转（需要取反）
        // 完全模仿鼠标控制的旋转逻辑
        const rotationDeltaX = -smoothedDeltaXpx * ROTATION_SENSITIVITY;
        const rotationDeltaY = (this.invertRotationY ? smoothedDeltaYpx : -smoothedDeltaYpx) * ROTATION_SENSITIVITY;

        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/850e76a1-caf4-489c-9914-1d5532476236',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'GestureController.js:195',message:'Rotation delta before apply',data:{rotationDeltaX,rotationDeltaY,deltaXpx,deltaYpx,normalizedDeltaXpx,normalizedDeltaYpx,smoothedDeltaXpx,smoothedDeltaYpx,timeSinceLastCallback},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
        // #endregion

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
   * 速度到平滑因子的映射函数
   * 
   * 使用平滑的曲线映射，避免突然的切换
   * 
   * 优化经验：
   * 1. 使用三次贝塞尔曲线近似（3t² - 2t³）进行插值，提供更平滑的过渡
   * 2. 速度阈值设计：
   *    - 快速（≥40px/帧）：使用最小平滑因子0.4，提高响应速度
   *    - 慢速（≤15px/帧）：使用最大平滑因子0.8，减少抖动
   *    - 中等速度：使用平滑曲线插值，避免突变
   * 3. 这个映射函数配合速度平滑和平滑因子过渡，确保从快速到慢速的平滑过渡
   * 
   * @param {number} speed - 平滑后的速度值（像素/帧）
   * @returns {number} 目标平滑因子（0.4-0.8之间）
   */
  mapSpeedToSmoothingFactor(speed) {
    // 速度阈值配置
    const fastSpeedThreshold = 40; // 快速移动阈值
    const slowSpeedThreshold = 15; // 慢速移动阈值
    
    if (speed >= fastSpeedThreshold) {
      // 快速移动：使用最小平滑因子，提高响应速度
      return this.minSmoothingFactor;
    } else if (speed <= slowSpeedThreshold) {
      // 慢速移动：使用最大平滑因子，减少抖动
      return this.maxSmoothingFactor;
    } else {
      // 中等速度：使用平滑的曲线插值（使用sigmoid-like曲线，更平滑的过渡）
      // 将速度范围 [slowSpeedThreshold, fastSpeedThreshold] 映射到 [0, 1]
      const normalizedSpeed = (speed - slowSpeedThreshold) / (fastSpeedThreshold - slowSpeedThreshold);
      // 使用平滑的曲线函数（ease-in-out效果）
      // 使用三次贝塞尔曲线近似：3t² - 2t³，提供更平滑的过渡
      const t = normalizedSpeed;
      const smoothT = t * t * (3 - 2 * t);
      // 在最小和最大平滑因子之间插值
      return this.minSmoothingFactor + (this.maxSmoothingFactor - this.minSmoothingFactor) * (1 - smoothT);
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
      // 重置平滑状态和回调时间
      this.lastRotationDeltaX = 0;
      this.lastRotationDeltaY = 0;
      this.lastCallbackTime = 0;
      // 重置速度和平滑因子相关状态
      this.smoothedSpeed = 0;
      this.currentSmoothingFactor = this.rotationSmoothingFactor;
    }
    
    // 从任何状态切换到双手，重置距离（确保从头开始）
    // 首次进入双手状态时会跳过第一次计算，避免突然缩放
    if (newState === GestureState.TWO_HAND_PINCH) {
      this.lastTwoHandDist = 0;
      this.isDragging = false;
      this.lastHandPos = null;
      // 重置平滑状态和回调时间
      this.lastRotationDeltaX = 0;
      this.lastRotationDeltaY = 0;
      this.lastCallbackTime = 0;
      // 重置速度和平滑因子相关状态
      this.smoothedSpeed = 0;
      this.currentSmoothingFactor = this.rotationSmoothingFactor;
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
    // 重置平滑状态
    this.lastRotationDeltaX = 0;
    this.lastRotationDeltaY = 0;
    this.lastCallbackTime = 0;
    // 重置速度和平滑因子相关状态
    this.smoothedSpeed = 0;
    this.currentSmoothingFactor = this.rotationSmoothingFactor;
    
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
