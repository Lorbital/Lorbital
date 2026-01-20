/**
 * 手势平滑处理
 * 
 * 提供死区、限速、插值等平滑滤波功能
 * 
 * @module gesture/smoothing
 */

/**
 * 平滑滤波器
 * 
 * 用于平滑手势输入，避免抖动和突变
 */
export class SmoothingFilter {
  constructor(options = {}) {
    this.deadZone = options.deadZone || 0.01;
    this.maxSpeed = options.maxSpeed || 0.5;
    this.lerpFactor = options.lerpFactor || 0.2;
    this.lastValue = 0;
    this.currentValue = 0;
  }

  /**
   * 应用平滑滤波
   * 
   * @param {number} input - 输入值
   * @returns {number} 平滑后的值
   */
  filter(input) {
    // 死区处理
    if (Math.abs(input) < this.deadZone) {
      input = 0;
    }

    // 限速处理
    const delta = input - this.lastValue;
    const clampedDelta = Math.max(
      -this.maxSpeed,
      Math.min(this.maxSpeed, delta)
    );
    const limitedInput = this.lastValue + clampedDelta;

    // 插值平滑
    this.currentValue = this.lastValue + 
      (limitedInput - this.lastValue) * this.lerpFactor;

    this.lastValue = this.currentValue;
    return this.currentValue;
  }

  /**
   * 重置滤波器状态
   */
  reset() {
    this.lastValue = 0;
    this.currentValue = 0;
  }
}

/**
 * 创建平滑滤波器
 * 
 * @param {Object} options - 配置选项
 * @returns {SmoothingFilter} 平滑滤波器实例
 */
export function createSmoothingFilter(options) {
  return new SmoothingFilter(options);
}
