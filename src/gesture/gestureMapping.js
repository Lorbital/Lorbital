/**
 * 手势映射
 * 
 * 将 MediaPipe 手势识别结果转换为控制指令
 * 
 * @module gesture/gestureMapping
 */

import { PINCH_THRESHOLD, TWO_HAND_PINCH_THRESHOLD, GESTURE_SENSITIVITY } from '../utils/constants.js';

/**
 * 手势状态
 */
export const GestureState = {
  NONE: 0,
  SINGLE_HAND_PINCH: 1,
  TWO_HAND_PINCH: 2
};

/**
 * 检测手势状态
 * 
 * 改进：双手检测优先，只有当两只手不都在捏合时，才检测单手
 * - 优先检查两只手是否都在捏合（使用稍微宽松的阈值，确保双手操作优先）
 * - 如果两只手不都在捏合，才检查是否有单只手在捏合
 * - 使用更宽松的双手阈值，确保双手操作更容易被识别
 * 
 * @param {Array} landmarks - MediaPipe 关键点数组
 * @returns {Object} { state, data }
 */
export function detectGesture(landmarks) {
  if (!landmarks || landmarks.length === 0) {
    return { state: GestureState.NONE, data: null, handCount: 0 };
  }

  // 优先检测双手捏合：当检测到两只手时，优先检查是否都在捏合
  if (landmarks.length === 2) {
    const hand1 = landmarks[0];
    const hand2 = landmarks[1];
    
    const pinch1 = Math.hypot(
      hand1[4].x - hand1[8].x,
      hand1[4].y - hand1[8].y
    );
    const pinch2 = Math.hypot(
      hand2[4].x - hand2[8].x,
      hand2[4].y - hand2[8].y
    );

    // 使用更宽松的阈值判断双手捏合（确保双手操作优先识别）
    // 当两只手都基本捏合时（使用PINCH_THRESHOLD，和单手相同的阈值），优先识别为双手
    const twoHandThreshold = PINCH_THRESHOLD;
    
    if (pinch1 < twoHandThreshold && pinch2 < twoHandThreshold) {
      // 两只手都在捏合，优先返回双手状态
      const dist = Math.hypot(
        hand1[8].x - hand2[8].x,
        hand1[8].y - hand2[8].y
      );

      return {
        state: GestureState.TWO_HAND_PINCH,
        handCount: landmarks.length,
        data: {
          hand1Palm: hand1[8],
          hand2Palm: hand2[8],
          distance: dist,
          pinch1,
          pinch2
        }
      };
    }
    
    // 如果两只手不都在捏合，检查是否只有一只手在捏合（作为单手操作）
    // 注意：只有当两只手不都在捏合时，才考虑单手操作
    if ((pinch1 < PINCH_THRESHOLD && pinch2 >= PINCH_THRESHOLD) || 
        (pinch1 >= PINCH_THRESHOLD && pinch2 < PINCH_THRESHOLD)) {
      // 只有一只手在捏合
      if (pinch1 < PINCH_THRESHOLD) {
        return {
          state: GestureState.SINGLE_HAND_PINCH,
          handCount: landmarks.length,
          data: {
            palm: hand1[8],
            pinchDist: pinch1
          }
        };
      } else {
        return {
          state: GestureState.SINGLE_HAND_PINCH,
          handCount: landmarks.length,
          data: {
            palm: hand2[8],
            pinchDist: pinch2
          }
        };
      }
    }
    
    // 两只手都不在捏合
    return { state: GestureState.NONE, data: null, handCount: landmarks.length };
  }

  // 单手捏合：旋转（只在确实只有一只手时检测）
  if (landmarks.length === 1) {
    const hand = landmarks[0];
    const pinchDist = Math.hypot(
      hand[4].x - hand[8].x,
      hand[4].y - hand[8].y
    );

    // 使用相同的阈值（或稍微宽松一点，因为单手更容易误触）
    if (pinchDist < PINCH_THRESHOLD) {
      return {
        state: GestureState.SINGLE_HAND_PINCH,
        handCount: landmarks.length,
        data: {
          palm: hand[8],  // 食指指尖位置
          pinchDist
        }
      };
    }
  }

  return { state: GestureState.NONE, data: null, handCount: landmarks.length };
}

/**
 * 将手势转换为旋转控制指令
 * 
 * 支持斜向移动：分别计算deltaX和deltaY，当手势斜着移动时，
 * 模型的前面会跟随手势的斜向移动方向旋转（地球仪式旋转）。
 * 
 * @param {Object} gestureData - 手势数据（单手指合）
 * @param {Object} lastPalmPos - 上次掌心位置
 * @returns {Object} { deltaX, deltaY }
 */
export function gestureToRotation(gestureData, lastPalmPos) {
  if (!gestureData || !lastPalmPos) {
    return { deltaX: 0, deltaY: 0 };
  }

  // 地球仪式旋转：
  // - 手向右移动 → 模型前面向右移动 → 从上方看逆时针旋转 (rotation.y 增加)
  // - 手向上移动 → 模型前面向上移动 → 从右侧看顺时针旋转 (rotation.x 增加)
  // 斜向移动时，deltaX和deltaY会同时有值，模型会沿斜向方向旋转
  const deltaX = (gestureData.palm.x - lastPalmPos.x) * GESTURE_SENSITIVITY;
  const deltaY = -(gestureData.palm.y - lastPalmPos.y) * GESTURE_SENSITIVITY;

  return { deltaX, deltaY };
}

