/**
 * 常量定义
 * 
 * @module utils/constants
 */

// 渲染常量
export const DEFAULT_PARTICLE_SIZE = 0.012;
export const DEFAULT_COLOR = '#00ffff';
export const DEFAULT_OPACITY = 0.8;

// 交互常量
export const ROTATION_SENSITIVITY = 0.008;
export const ZOOM_SENSITIVITY = 0.0015;
export const MIN_SCALE = 0.005;
export const MAX_SCALE = 50.0;
export const LERP_FACTOR = 0.25; // 提高响应速度（从0.12增加到0.25）

// 手势常量
export const PINCH_THRESHOLD = 0.06; // 降低单手捏合阈值，减少误触发
export const TWO_HAND_PINCH_THRESHOLD = 0.05;
export const TWO_HAND_STABLE_FRAMES = 3; // 双手捏合需要稳定的连续帧数
export const GESTURE_SENSITIVITY = 15; // 提高灵敏度
export const ZOOM_SENSITIVITY_MULTIPLIER = 2.0; // 提高缩放灵敏度
export const GESTURE_TIMEOUT = 500; // 手势超时时间（毫秒），超过此时间无手势则重置状态
export const ROTATION_DEAD_ZONE = 0.003; // 旋转死区阈值，避免抖动

// MediaPipe 配置
export const MEDIAPIPE_CONFIG = {
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.7, // 降低检测置信度阈值，更容易识别（从0.8降低到0.7）
  minTrackingConfidence: 0.7 // 降低跟踪置信度阈值，更容易识别（从0.8降低到0.7）
};

// 相机配置
export const CAMERA_CONFIG = {
  fov: 45,
  near: 0.1,
  far: 2000,
  initialZ: 15
};
