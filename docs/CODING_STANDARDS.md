# 代码规范

本文档定义 Lorbital 项目的代码编写标准。

---

## 基本规范

### 1. 模块系统

**必须使用 ES6 模块**

```javascript
// ✅ 正确
import * as THREE from 'three';
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';
export function loadModel() { ... }
export class OrbitalViewer { ... }

// ❌ 错误
var THREE = require('three');
window.OrbitalViewer = class { ... };
```

### 2. 避免全局变量

**使用模块导出，避免污染全局命名空间**

```javascript
// ✅ 正确
// utils/constants.js
export const MAX_SCALE = 50.0;
export const DEFAULT_COLOR = '#00ffff';

// ❌ 错误
window.MAX_SCALE = 50.0;
```

### 3. 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 类名 | PascalCase | `OrbitalViewer`, `GestureController` |
| 函数名 | camelCase | `loadModel`, `initScene` |
| 变量名 | camelCase | `orbitalPoints`, `targetScale` |
| 常量 | UPPER_SNAKE_CASE | `MAX_SCALE`, `DEFAULT_COLOR` |
| 文件名（类） | PascalCase | `OrbitalViewer.js` |
| 文件名（工具） | camelCase | `loadPly.js`, `setupScene.js` |
| 私有成员 | 前缀下划线 | `_privateMethod`, `_internalState` |

### 4. 文件组织

**每个文件应该只导出一个主要概念**

```javascript
// ✅ 正确
// components/OrbitalViewer.js
export class OrbitalViewer {
  // ...
}

// ❌ 错误
// components/viewer.js
export class OrbitalViewer { ... }
export class GestureController { ... }  // 应该在单独文件中
export function helper() { ... }  // 应该在 utils/ 中
```

---

## 注释规范

### 1. JSDoc 格式

**类和公开函数必须使用 JSDoc**

```javascript
/**
 * 核心 3D 轨道查看器组件
 * 
 * @class OrbitalViewer
 */
export class OrbitalViewer {
  /**
   * 加载轨道模型
   * 
   * @param {string} orbitalId - 轨道标识符（如 '1s', '2p'）
   * @returns {Promise<THREE.Points>} 返回点云对象
   * @throws {Error} 加载失败时抛出错误
   */
  async loadModel(orbitalId) {
    // ...
  }
}
```

### 2. 关键算法注释

**复杂逻辑必须注释**

```javascript
// ✅ 正确
// 双手缩放：消除跳变的核心逻辑
// 状态切换瞬间：仅记录距离，不更新 targetScale，从而防止"跳变"
if (pinchState !== 2) {
  pinchState = 2;
  lastTwoHandDist = currentDist;
} else {
  // 灵敏度增强：对缩放比例进行系数放大
  const zoomSensitivity = 1.5;
  const ratio = currentDist / lastTwoHandDist;
  const scaleFactor = 1 + (ratio - 1) * zoomSensitivity;
  targetScale *= scaleFactor;
}

// ❌ 错误（没有注释）
if (pinchState !== 2) {
  pinchState = 2;
  lastTwoHandDist = currentDist;
} else {
  const zoomSensitivity = 1.5;
  const ratio = currentDist / lastTwoHandDist;
  targetScale *= 1 + (ratio - 1) * zoomSensitivity;
}
```

### 3. TODO 注释

**临时代码或待优化处使用 TODO**

```javascript
// TODO: 优化大点云的渲染性能（考虑 LOD）
// TODO: 添加错误边界处理
// TODO: 支持模型预加载
```

---

## 代码风格

### 1. 缩进与空格

- **使用 2 个空格缩进**（不使用 Tab）
- **行尾不留空格**
- **文件末尾留一个空行**

### 2. 括号与引号

```javascript
// ✅ 正确
if (condition) {
  // ...
}

const str = 'single quotes for strings';
const obj = { key: 'value' };

// ❌ 错误
if(condition){ ... }
const str = "double quotes";
```

### 3. 分号

**语句末尾使用分号**

```javascript
// ✅ 正确
const x = 1;
function foo() {
  return x;
}

// ❌ 错误（依赖 ASI）
const x = 1
function foo() {
  return x
}
```

### 4. 函数声明

**优先使用箭头函数（回调）和函数声明（顶层）**

```javascript
// ✅ 正确
function initScene() {
  // ...
}

const handlers = {
  onClick: (e) => {
    // ...
  }
};

// ❌ 错误
const initScene = () => { ... };  // 顶层函数应该用 function 声明
```

---

## 错误处理

### 1. Promise 错误处理

```javascript
// ✅ 正确
async function loadModel(id) {
  try {
    const geometry = await loader.load(url);
    return geometry;
  } catch (error) {
    console.error(`Failed to load model ${id}:`, error);
    throw new Error(`Model loading failed: ${id}`);
  }
}

// ❌ 错误
async function loadModel(id) {
  const geometry = await loader.load(url);  // 没有错误处理
  return geometry;
}
```

### 2. 用户友好的错误提示

```javascript
// ✅ 正确
catch (error) {
  const message = `无法加载轨道模型 ${orbitalId}，请检查网络连接。`;
  showErrorToast(message);
  throw error;
}
```

---

## 性能规范

### 1. 避免不必要的计算

```javascript
// ✅ 正确（缓存结果）
const geometry = await loadGeometry(id);
const material = createMaterial(settings);
const points = new THREE.Points(geometry, material);

// ❌ 错误（重复计算）
function render() {
  const points = new THREE.Points(loadGeometry(id), createMaterial(settings));
  // 每帧都重新创建
}
```

### 2. 使用 requestAnimationFrame

```javascript
// ✅ 正确
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// ❌ 错误
setInterval(() => {
  renderer.render(scene, camera);
}, 16);
```

### 3. 限制像素比

```javascript
// ✅ 正确
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// ❌ 错误（可能过高的像素比）
renderer.setPixelRatio(window.devicePixelRatio);
```

---

## 依赖管理

### 1. 外部依赖

**使用 CDN 或明确版本**

```javascript
// ✅ 正确
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

// ❌ 错误（无版本号）
import * as THREE from 'https://unpkg.com/three/build/three.module.js';
```

### 2. 内部依赖

**使用相对路径，清晰明确**

```javascript
// ✅ 正确
import { loadPly } from '../three/loadPly.js';
import { MODEL_REGISTRY } from '../data/modelRegistry.js';

// ❌ 错误（过于复杂）
import { loadPly } from '../../../three/loadPly.js';
```

---

## 测试要求

### 1. 功能测试清单

提交代码前，确保以下功能正常：

- [ ] 3D 模型加载与渲染
- [ ] 模型切换
- [ ] 鼠标交互（旋转、缩放）
- [ ] 手势控制（如果涉及）
- [ ] 页面导航
- [ ] 响应式布局
- [ ] 错误处理（网络失败、文件不存在）

### 2. 浏览器兼容性

确保在以下浏览器中测试：

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 代码审查检查清单

提交 PR 前，自检以下项目：

- [ ] 遵循命名规范
- [ ] 使用 ES6 模块
- [ ] 避免全局变量
- [ ] 关键算法有注释
- [ ] 错误处理完善
- [ ] 性能考虑（避免不必要的计算）
- [ ] 符合架构约束（不进行浏览器端实时计算）
- [ ] 更新相关文档（如有）

---

## 示例：良好的代码

```javascript
/**
 * PLY 文件加载器
 * 
 * @module three/loadPly
 */

import { PLYLoader as ThreePLYLoader } from 'three/addons/loaders/PLYLoader.js';

const loader = new ThreePLYLoader();

/**
 * 加载 PLY 点云文件
 * 
 * @param {string} url - PLY 文件 URL
 * @returns {Promise<THREE.BufferGeometry>} 几何体对象
 * @throws {Error} 加载失败时抛出错误
 */
export async function loadPly(url) {
  try {
    const geometry = await new Promise((resolve, reject) => {
      loader.load(
        url,
        (geo) => {
          geo.center();  // 几何体居中
          resolve(geo);
        },
        undefined,
        (error) => reject(error)
      );
    });
    return geometry;
  } catch (error) {
    console.error(`Failed to load PLY from ${url}:`, error);
    throw new Error(`PLY loading failed: ${url}`);
  }
}
```

---

## 参考资源

- [MDN: JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)
- [Three.js Documentation](https://threejs.org/docs/)
