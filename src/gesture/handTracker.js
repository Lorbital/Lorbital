/**
 * MediaPipe Hands 封装
 * 
 * @module gesture/handTracker
 */

import { MEDIAPIPE_CONFIG } from '../utils/constants.js';
import { detectGesture } from './gestureMapping.js';

/**
 * 手势跟踪器
 * 
 * 封装 MediaPipe Hands，提供手势识别功能
 */
export class HandTracker {
  /**
   * @param {HTMLVideoElement} videoElement - 视频元素
   * @param {Function} onGestureDetected - 手势检测回调函数
   */
  constructor(videoElement, onGestureDetected) {
    this.videoElement = videoElement;
    this.onGestureDetected = onGestureDetected;
    this.hands = null;
    this.camera = null;
    this.isRunning = false;
  }

  /**
   * 初始化 MediaPipe Hands
   */
  async init() {
    if (typeof Hands === 'undefined') {
      throw new Error('MediaPipe Hands library not loaded');
    }

    this.hands = new Hands({
      locateFile: (file) => 
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    this.hands.setOptions({
      maxNumHands: MEDIAPIPE_CONFIG.maxNumHands,
      modelComplexity: MEDIAPIPE_CONFIG.modelComplexity,
      minDetectionConfidence: MEDIAPIPE_CONFIG.minDetectionConfidence,
      minTrackingConfidence: MEDIAPIPE_CONFIG.minTrackingConfidence
    });

    // 设置结果回调
    this.hands.onResults((results) => {
      const gesture = detectGesture(results.multiHandLandmarks);
      if (this.onGestureDetected) {
        this.onGestureDetected(gesture, results);
      }
    });

    // 初始化摄像头
    if (typeof Camera === 'undefined') {
      throw new Error('MediaPipe Camera library not loaded');
    }

    this.camera = new Camera(this.videoElement, {
      onFrame: async () => {
        if (this.hands && this.isRunning) {
          await this.hands.send({ image: this.videoElement });
        }
      },
      width: 640,
      height: 480
    });
  }

  /**
   * 启动手势跟踪
   */
  start() {
    if (!this.camera) {
      throw new Error('HandTracker not initialized. Call init() first.');
    }
    this.isRunning = true;
    this.camera.start();
  }

  /**
   * 停止手势跟踪
   */
  stop() {
    this.isRunning = false;
    if (this.camera) {
      this.camera.stop();
    }
  }

  /**
   * 销毁资源
   */
  destroy() {
    this.stop();
    this.hands = null;
    this.camera = null;
  }
}
