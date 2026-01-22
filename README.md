# Lorbital — Quantum Electron Orbital Glass Sculpture System

**量子电子云玻璃内雕系统**

> 将量子力学中电子轨道的概率分布，通过数值模拟 → 点云建模 → 玻璃内雕实体化 → Web 端交互展示

---

## 项目本质

这是一个跨学科项目，融合了：

- **物理**：量子力学、氢原子轨道
- **数值计算**：蒙特卡洛采样
- **三维建模**：点云生成
- **制造工艺**：玻璃内雕
- **WebGL / Three.js**：交互式3D可视化
- **AI 手势交互**：Google MediaPipe Hands

---

## 项目最终形态

### 1. 实体产品
- 玻璃内雕电子云模型
- 涵盖 s / p / d / f / g 轨道
- 具备严格几何比例与美学设计

### 2. 数字展示系统
- 官网展示品牌故事与产品
- Web 端可交互 3D 电子云模型
- 智能分类导航界面（按轨道类型分层展示）
- 支持鼠标 / 手势控制
- **完全使用PLY文件中的原始颜色**（不应用默认颜色）
- 知识卡片功能，展示轨道详细信息

### 3. 教育 / 展览价值
- 面向非专业人群
- 强调"直观理解"，而非推导过程

---

## 技术栈

### 前端
- **Three.js** (v0.160.0): 3D 渲染引擎
- **MediaPipe Hands**: 手势识别与控制
- **原生 ES6 模块**: 无需构建工具
- **纯 HTML/CSS/JS**: 轻量、高性能

### 后端（生成层，Python）
- **PyTorch**: GPU 加速计算
- **NumPy / SciPy**: 数值计算
- **蒙特卡洛采样**: 电子云点云生成

### 数据格式
- **PLY**: 点云几何数据（用于渲染与制造）
- **JSON**: 元数据（轨道类型、量子数、推荐参数、颜色、透明度）

### 后续调整备注
- **坐标轴**：探测器中的坐标轴重设计需在 Python 点云生成程序 `models/model.py` 内完成（如将坐标轴作为点云的一部分导出，或调整坐标系方向/尺度），与 Web 端 Three.js AxesHelper 解耦，可单独迭代。

---

## 快速开始

### 开发环境

1. **克隆项目**
```bash
git clone <repository-url>
cd Lorbital
```

2. **启动本地服务器**
```bash
# 使用 Python（推荐）
python -m http.server 8000

# 或使用 Node.js
npx serve

# 或使用 VS Code Live Server
```

3. **访问应用**
在浏览器中打开：
- **主页**: `http://localhost:8000/index.html`
- **3D 探测器**: `http://localhost:8000/explorer.html`
- **知识库**: `http://localhost:8000/knowledge.html`
- **我们的故事**: `http://localhost:8000/story.html`

### 浏览器要求

- 支持 ES6 模块的现代浏览器
- WebGL 支持
- 推荐: Chrome 90+, Firefox 88+, Safari 14+
- 手势控制需要摄像头权限（可选）

---

## 项目结构（整理后）

```
Lorbital/
├── index.html              # 主页
├── explorer.html           # 3D 探测器
├── knowledge.html          # 知识库
├── story.html              # 我们的故事
│
├── css/
│   └── shared.css          # 全局样式
│
├── src/                    # 源代码
│   ├── explorer.js         # 探测器主逻辑（入口脚本）
│   ├── components/         # UI 组件（OrbitalViewer, GestureController, ModelSelector）
│   ├── three/              # Three.js（setupScene, loadPly, renderer）
│   ├── gesture/            # 手势控制（handTracker, gestureMapping, smoothing）
│   ├── data/               # 数据层（modelRegistry, orbitalKnowledge）
│   └── utils/              # 工具函数（constants）
│
├── models/
│   ├── model.py            # Python 生成脚本
│   └── model++/            # PLY 模型数据（按 s/p/d/f/g 分类）
│       ├── s/{orbitalId}/{orbitalId}.ply
│       ├── p/, d/, f/, g/  # 同上，可选 meta.json 同目录
│
├── public/
│   └── images/story/       # 故事页图片
│
├── docs/                   # AGENTS, CODING_STANDARDS, DATA_FORMAT, ORBITALS
├── ARCHITECTURE.md
├── CONTRIBUTING.md
└── README.md
```

详细架构与数据路径说明请参考 [ARCHITECTURE.md](ARCHITECTURE.md)、[docs/DATA_FORMAT.md](docs/DATA_FORMAT.md)。

---

## 核心架构原则

### ⚠️ 重要约束

1. **Web 端不进行实时电子云数值计算**
   - 所有点云在 Python 层离线生成
   - Web 端仅负责加载、渲染、交互
   - 原因：性能与稳定性考虑

2. **数据层严格分离**
   - **PLY**: 几何信息（点坐标）
   - **JSON (meta.json)**: 语义信息（轨道类型、量子数、颜色、透明度、推荐缩放等）
   - 职责清晰，互不干扰

3. **模型目录结构**
   - 模型文件存储在 `models/model++/` 目录下
   - 按照轨道类型分类：`models/model++/{type}/{orbitalId}/`
   - 每个轨道文件夹包含：`{orbitalId}.ply`（点云文件，必需）；`meta.json`（元数据，可选，缺省时使用默认值）
   - 颜色优先使用 PLY 顶点颜色；PLY 无颜色时才使用 meta.json 的 color
   - 文件夹结构：
     ```
     models/model++/
     ├── s/
     │   ├── 1s/
     │   │   ├── 1s.ply
     │   │   └── meta.json
     │   └── ...
     ├── p/
     │   ├── 2px/
     │   │   ├── 2px.ply
     │   │   └── meta.json
     │   └── ...
     ├── d/
     │   ├── 3d_dz2/
     │   │   ├── 3d_dz2.ply
     │   │   └── meta.json
     │   └── ...
     ├── f/
     │   └── ...
     └── g/
         └── ...
     ```

4. **物理真实性**
   - 模型尺寸是绝对参数（mm）
   - 不是视觉缩放，而是真实物理比例
   - meta.json 中的 `recommendedScale` 提供最佳观察视角

详细架构说明请参考 [ARCHITECTURE.md](ARCHITECTURE.md)

---

## 数据格式

### 模型目录结构

模型文件存储在 `models/model++/` 目录下，按轨道类型分类：

```
models/model++/
├── s/                  # S轨道
│   ├── 1s/
│   │   ├── 1s.ply      # PLY 点云文件（必需）
│   │   └── meta.json   # 元数据（可选）
│   ├── 2s/
│   │   ├── 2s.ply
│   │   └── meta.json   # 可选
│   └── ...
├── p/                  # P轨道
│   ├── 2px/
│   │   ├── 2px.ply
│   │   └── meta.json
│   ├── 2py/
│   ├── 2pz/
│   └── ...
├── d/                  # D轨道
│   ├── 3d_dz2/
│   │   ├── 3d_dz2.ply
│   │   └── meta.json
│   ├── 3d_dx2-y2/
│   └── ...
├── f/                  # F轨道
│   └── ...
└── g/                  # G轨道
    └── ...
```

**路径规则**：
- PLY 文件（必需）：`models/model++/{type}/{orbitalId}/{orbitalId}.ply`
- meta.json（可选）：`models/model++/{type}/{orbitalId}/meta.json`
- 示例：`models/model++/s/1s/1s.ply`、`models/model++/p/2px/2px.ply`、`models/model++/d/3d_dz2/3d_dz2.ply`

### meta.json 格式

```json
{
  "id": "1s",
  "n": 1,
  "l": 0,
  "type": "s",
  "displayName": "1s",
  "description": "基态氢原子轨道，球对称",
  "pointCount": 500000,
  "physicalDiameter": 0.529,
  "recommendedScale": 1.0,
  "color": "#00ffff",
  "opacity": 0.8
}
```

**字段说明**：
- `id`: 轨道唯一标识符
- `n`, `l`: 主量子数和角量子数
- `type`: 轨道类型（s, p, d, f, g）
- `color`: 十六进制颜色代码（可选，系统优先使用PLY文件中的原始颜色）
- `opacity`: 透明度（0.0 - 1.0）
- `recommendedScale`: 推荐初始缩放比例

**注意**：
- 如果 meta.json 文件不存在，系统会使用默认值继续运行
- 颜色信息优先从PLY文件中读取（如果PLY文件包含颜色信息）
- 只有在PLY文件不包含颜色信息时，才会使用 meta.json 中的颜色设置

### 模型注册表

轨道模型在 `src/data/modelRegistry.js` 中按类型注册：

```javascript
export const MODEL_REGISTRY = {
  's': ['1s', '2s', '3s', '4s', '5s', '6s', '7s'],
  'p': ['2p', '3p', '4p', '5p', '6p'],
  'd': ['3d_dz2', '3d_dx2-y2', ...],
  'f': ['4f_fz3', '4f_fxz2', ...],
  'g': ['5g_gz4', '5g_gxz3', ...]
};
```

### 模型读取机制

系统会自动根据轨道ID确定文件路径：

1. **确定轨道类型**：从轨道ID提取类型（s, p, d, f, g）
   - 例如：`1s` → `s`，`2px` → `p`，`3d_dz2` → `d`

2. **构建文件路径**：
   - PLY文件：`models/model++/{type}/{orbitalId}/{orbitalId}.ply`
   - meta.json：`models/model++/{type}/{orbitalId}/meta.json`

3. **示例**：
   - `1s` → `models/model++/s/1s/1s.ply`
   - `2px` → `models/model++/p/2px/2px.ply`
   - `3d_dz2` → `models/model++/d/3d_dz2/3d_dz2.ply`

详细数据格式说明请参考 [docs/DATA_FORMAT.md](docs/DATA_FORMAT.md)

---

## 常见问题与故障排除

### 模型文件无法加载

**症状**：所有模型都无法显示，浏览器控制台报错找不到文件（404错误）。

**原因**：ES6 模块中的相对路径是基于模块文件位置的，而不是 HTML 文件位置。`src/data/modelRegistry.js` 通过 `getBasePath()` 与 `buildModelUrl()` 使用相对于网站根目录的路径（如 `/models/model++/...`），以规避基于模块或 HTML 位置的解析差异。

**解决方案**：
1. **使用绝对路径（推荐）**：直接使用相对于网站根目录的绝对路径
   ```javascript
   // ✅ 正确：使用绝对路径
   function buildModelUrl(relativePath) {
     const absolutePath = `/models/model++/${relativePath}`;
     return `${window.location.origin}${absolutePath}`;
   }
   ```

2. **使用 `new URL()` 构建路径**（备选方案）：
   ```javascript
   // 使用 new URL() 和 window.location.href 来构建相对于 HTML 文件的正确路径
   const url = new URL(`${basePath}${relativePath}`, window.location.href).href;
   ```

**代码位置**：`src/data/modelRegistry.js` 中的 `buildModelUrl()`, `getPlyUrl()`, `getMetadataUrl()` 函数

**验证方法**：
```javascript
// 在浏览器控制台测试路径（需在 explorer 页执行，或使用 importmap 等）
import { getPlyUrl } from './src/data/modelRegistry.js';
console.log(getPlyUrl('1s')); 
// 应输出类似：http://localhost:8000/models/model++/s/1s/1s.ply
```

### 模型显示为二维图片，无法交互

**症状**：模型加载后显示为静态的二维图片，鼠标拖拽、滚轮缩放、自动旋转都不工作。

**原因**：
1. 相机位置或模型位置不正确
2. 渲染循环没有正常工作
3. 事件监听器没有正确绑定
4. `currentView` 状态不正确

**解决方案**：
1. **重置相机和模型位置**：
   ```javascript
   // 在模型加载完成后重置
   camera.position.set(0, 0, 15);
   camera.lookAt(0, 0, 0);
   orbitalGroup.rotation.set(0, 0, 0);
   orbitalGroup.position.set(0, 0, 0);
   ```

2. **确保渲染循环正常工作**：
   ```javascript
   function animate() {
     requestAnimationFrame(animate);
     if (currentView === 'viewer') {
       // 更新模型旋转和缩放
       if (orbitalGroup && orbitalGroup.children.length > 0) {
         orbitalGroup.rotation.y = THREE.MathUtils.lerp(orbitalGroup.rotation.y, targetRotY, 0.12);
         // ...
       }
     }
     // 始终渲染场景
     if (renderer && scene && camera) {
       renderer.render(scene, camera);
     }
   }
   ```

3. **正确绑定事件监听器**：
   ```javascript
   // 将事件绑定到容器元素，而不是 window
   const container = document.getElementById('container');
   container.addEventListener('mousedown', (e) => {
     if (currentView !== 'viewer') return;
     isMouseDown = true;
     // ...
   });
   ```

4. **确保 `currentView` 状态正确**：
   ```javascript
   function showViewer() {
     currentView = 'viewer'; // 确保状态更新
     // ...
   }
   ```

**代码位置**：`src/explorer.js` 中的 `loadOrbital()`, `showViewer()`, `animate()`, `initMouseEvents()` 函数

### 加载提示一直显示

**症状**：模型加载完成后，"量子态同步中..." 提示仍然显示在屏幕上。

**原因**：加载提示的隐藏逻辑没有正确执行，或者进度回调中设置的文本没有被清除。

**解决方案**：
1. **在成功回调中清除提示**：
   ```javascript
   loader.load(plyUrl, (geometry) => {
     // ... 加载成功处理
     loadingEl.textContent = ''; // 清除文本
     loadingEl.classList.add('hidden'); // 隐藏元素
   });
   ```

2. **在 `showViewer()` 中再次确保隐藏**：
   ```javascript
   function showViewer() {
     const loadingEl = document.getElementById('loading');
     if (loadingEl) {
       loadingEl.textContent = '';
       loadingEl.classList.add('hidden');
     }
   }
   ```

**代码位置**：`src/explorer.js` 中的 `loadOrbital()` 和 `showViewer()` 函数

### meta.json 文件缺失

**症状**：浏览器控制台显示 meta.json 的 404 错误，模型可以加载但使用默认参数。

**原因**：某些模型目录中可能没有 `meta.json` 文件。

**解决方案**：
- 系统已支持优雅降级：如果 `meta.json` 不存在，会自动使用默认值
- 默认值包括：透明度 0.8、推荐缩放 1.0、从轨道 ID 自动提取量子数等
- 可以手动创建 `meta.json` 文件来覆盖默认值
- **注意**：这些 404 错误是正常的，不影响功能，可以忽略

**代码位置**：`src/data/modelRegistry.js` 中的 `loadMetadata()`（缺省时使用内部默认值）

### GUI 控制台显示 empty

**症状**：实验控制台显示为 empty，没有控件。

**可能原因**：
1. GUI 库（lil-gui）没有正确加载
2. GUI 元素没有正确添加到 DOM
3. 控件添加时机不对

**排查步骤**：
1. 检查控制台是否有 GUI 相关的错误
2. 检查 `window.gui` 是否存在
3. 检查 GUI 元素的子元素数量：
   ```javascript
   console.log('GUI children count:', window.gui.domElement.children.length);
   ```

**解决方案**：
```javascript
function initGUI() {
  gui = new GUI({ title: '⚛️ 实验控制台' });
  // 确保GUI元素被添加到DOM
  if (!gui.domElement.parentElement) {
    document.body.appendChild(gui.domElement);
  }
  // 添加控件...
  window.gui = gui;
}
```

### 路径解析经验总结

**核心原则**：
1. **ES6 模块的路径陷阱**：`import` 语句中的相对路径是相对于模块文件的，不是 HTML 文件
2. **使用绝对路径**：最可靠的方法是使用相对于网站根目录的绝对路径（以 `/` 开头）
3. **使用 `window.location.origin`**：直接构建完整 URL，避免相对路径解析问题
4. **路径判断逻辑**：如果必须使用相对路径，根据 `window.location.pathname` 中包含的路径段来判断基础路径深度

**最佳实践**：
```javascript
// ❌ 错误：基于模块文件的相对路径
const url = './models/model++/s/1s/1s.ply';

// ✅ 正确：使用绝对路径（推荐）
function buildModelUrl(relativePath) {
  const absolutePath = `/models/model++/${relativePath}`;
  return `${window.location.origin}${absolutePath}`;
}

// ✅ 备选：使用 new URL() 构建相对路径
function buildModelUrl(relativePath) {
  const basePath = './models/model++/';
  return new URL(`${basePath}${relativePath}`, window.location.href).href;
}
```

### 调试技巧

**使用浏览器控制台**：
1. 打开开发者工具（F12）
2. 查看 Console 标签页的错误信息
3. 查看 Network 标签页，检查文件请求状态
4. 使用以下代码测试路径（在 explorer 页控制台）：
   ```javascript
   import { getPlyUrl } from './src/data/modelRegistry.js';
   console.log(getPlyUrl('1s'));
   ```

**添加调试日志**：
```javascript
console.log('Loading PLY from URL:', plyUrl);
console.log('Geometry loaded:', geometry.attributes.position.count, 'vertices');
console.log('Current view:', currentView);
console.log('Settings:', settings);
```

**调试技巧**：
- 使用浏览器开发者工具检查网络请求和错误
- 添加详细的 `console.log` 来跟踪执行流程
- 可以检查路径构建、文件存在性、PLY 解析等

---

## 开发经验总结

### 关键经验教训

#### 1. ES6 模块路径解析陷阱

**问题**：在 ES6 模块中使用相对路径时，路径是相对于模块文件位置的，而不是 HTML 文件位置。

**教训**：
- 永远不要假设相对路径基于 HTML 文件
- 使用绝对路径（以 `/` 开头）是最可靠的方法
- 如果必须使用相对路径，使用 `new URL()` 和 `window.location.href` 来构建

**正确做法**：
```javascript
// ✅ 推荐：使用绝对路径
const url = `${window.location.origin}/models/model++/s/1s/1s.ply`;

// ✅ 备选：使用 new URL() 构建相对路径
const url = new URL('./models/model++/s/1s/1s.ply', window.location.href).href;
```

#### 2. Three.js 渲染循环的重要性

**问题**：模型加载后显示为静态图片，无法交互。

**教训**：
- 确保 `requestAnimationFrame` 循环持续运行
- 在 `animate()` 函数中始终调用 `renderer.render()`
- 检查 `currentView` 状态，确保只在正确模式下更新模型

**正确做法**：
```javascript
function animate() {
    requestAnimationFrame(animate);
    
    if (currentView === 'viewer') {
        // 更新模型状态
        if (orbitalGroup && orbitalGroup.children.length > 0) {
            orbitalGroup.rotation.y = THREE.MathUtils.lerp(...);
        }
    }
    
    // 始终渲染（即使不在viewer模式）
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}
```

#### 3. 事件监听器的绑定位置

**问题**：鼠标事件不工作，因为事件绑定到了错误的目标。

**教训**：
- 将鼠标事件绑定到容器元素（`container`），而不是 `window`
- 检查事件目标，确保在正确的元素上触发
- 使用 `preventDefault()` 防止默认行为

**正确做法**：
```javascript
const container = document.getElementById('container');
container.addEventListener('mousedown', (e) => {
    if (currentView !== 'viewer') return;
    isMouseDown = true;
    e.preventDefault();
});
```

#### 4. 状态管理的重要性

**问题**：交互功能不工作，因为 `currentView` 状态不正确。

**教训**：
- 使用明确的状态变量（如 `currentView`）来跟踪界面状态
- 在状态改变时确保所有相关元素同步更新
- 在关键函数中检查状态，避免在错误状态下执行操作

**正确做法**：
```javascript
let currentView = 'category'; // 'category', 'orbital', 'viewer'

function showViewer() {
    currentView = 'viewer'; // 明确更新状态
    // 更新所有相关UI元素
    document.getElementById('container').style.display = 'block';
    // ...
}
```

#### 5. 调试和诊断工具

**经验**：
- 使用浏览器开发者工具检查网络请求和错误
- 添加详细的 `console.log` 来跟踪执行流程
- 在开发时可以创建临时诊断页面来快速定位问题

**诊断页面应包含**：
- 路径构建测试
- 文件存在性检查
- 实际加载和解析测试
- 详细的日志输出

#### 6. 错误处理和优雅降级

**经验**：
- 对于可选资源（如 `meta.json`），使用 try-catch 和默认值
- 不要因为可选资源失败而阻止主要功能
- 在控制台记录警告，但不要抛出错误

**正确做法**：
```javascript
async function loadMetadata(orbitalId) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            return getDefaultMetadata(orbitalId); // 优雅降级
        }
        return await response.json();
    } catch (error) {
        console.warn(`Metadata not found for ${orbitalId}, using defaults`);
        return getDefaultMetadata(orbitalId);
    }
}
```

#### 7. 文件结构一致性

**经验**：
- 确保代码中的路径与实际文件结构一致
- 如果文件结构改变，必须同步更新所有路径构建逻辑
- 使用统一的路径构建函数，避免硬编码路径

**当前文件结构**：
```
models/model++/
├── s/{orbitalId}/{orbitalId}.ply
├── p/{orbitalId}/{orbitalId}.ply
├── d/{orbitalId}/{orbitalId}.ply
├── f/{orbitalId}/{orbitalId}.ply
└── g/{orbitalId}/{orbitalId}.ply
```

#### 8. 手势控制优化：解决从快速到慢速的卡顿问题

**问题**：单手控制模型旋转时，特别是上下控制时，当手势从快速移动到慢速移动时会出现卡顿。

**根本原因**：
1. **时间归一化问题**：MediaPipe回调频率不稳定，导致相同手势在不同时间间隔下产生不同的delta值
2. **平滑因子突变**：直接根据当前速度切换平滑因子，导致从快速到慢速时平滑因子突然变化
3. **死区过滤过严**：死区阈值过高，过滤掉了一些有效的上下移动
4. **单次delta限制过小**：限制了快速移动时的响应速度

**解决方案**：

1. **优化时间归一化逻辑**：
   - 只在合理的时间间隔范围内（8ms-100ms）进行归一化
   - 限制归一化比例在0.5-2.0之间，避免极端放大或缩小
   - 时间间隔过大时使用原始值但限制最大值，避免突然跳跃

2. **三层平滑机制**（核心优化）：
   ```javascript
   // 第一层：平滑速度值本身
   smoothedSpeed = smoothedSpeed * (1 - speedSmoothingFactor) + currentSpeed * speedSmoothingFactor;
   
   // 第二层：根据平滑后的速度计算目标平滑因子
   targetSmoothingFactor = mapSpeedToSmoothingFactor(smoothedSpeed);
   
   // 第三层：平滑过渡平滑因子
   currentSmoothingFactor = currentSmoothingFactor * (1 - transitionRate) + 
                            targetSmoothingFactor * transitionRate;
   ```
   
   **为什么需要三层平滑**：
   - 直接根据当前速度切换平滑因子会导致突变
   - 第一层平滑速度值，提供稳定的速度历史
   - 第二层使用平滑曲线映射（三次贝塞尔曲线近似），避免硬切换
   - 第三层平滑过渡平滑因子，确保平滑因子变化也是平滑的

3. **速度到平滑因子的映射函数**：
   - 使用平滑曲线（三次贝塞尔曲线近似：`3t² - 2t³`）进行插值
   - 速度阈值：
     - 快速（≥40px/帧）：使用最小平滑因子0.4，提高响应速度
     - 慢速（≤15px/帧）：使用最大平滑因子0.8，减少抖动
     - 中等速度：平滑曲线插值

4. **参数调优**：
   - `speedSmoothingFactor = 0.3`：速度平滑因子，控制速度变化的响应速度
   - `smoothingFactorTransitionRate = 0.2`：平滑因子过渡速率
   - `ROTATION_DEAD_ZONE = 0.002`：降低死区阈值，提高响应性
   - `MAX_DELTA_PX = 100`：提高单次delta限制，允许更快响应

**关键经验**：
- 不要直接根据当前值切换参数，要使用平滑过渡
- 多层平滑机制可以解决单层平滑无法解决的问题
- 参数调优需要平衡响应速度和稳定性
- 使用平滑曲线（如三次贝塞尔曲线）比线性插值更自然

**代码位置**：`src/components/GestureController.js` 中的 `onGestureDetected()` 和 `mapSpeedToSmoothingFactor()` 方法

### 开发检查清单

在开发新功能或修复问题时，请检查：

- [ ] 路径是否正确（使用绝对路径或正确的相对路径）
- [ ] 渲染循环是否正常运行
- [ ] 事件监听器是否绑定到正确的元素
- [ ] 状态变量是否正确更新
- [ ] 错误处理是否完善（try-catch、默认值）
- [ ] 控制台是否有错误或警告
- [ ] 网络请求是否成功（检查 Network 标签页）
- [ ] 模型是否正确添加到场景中（检查 `orbitalGroup.children.length`）

### 快速诊断命令

在浏览器控制台中运行以下命令来诊断问题：

```javascript
// 检查路径
import { getPlyUrl } from './src/data/modelRegistry.js';
console.log('PLY URL:', getPlyUrl('1s'));

// 检查场景状态
console.log('Current view:', currentView);
console.log('OrbitalGroup children:', orbitalGroup.children.length);
console.log('Settings:', settings);

// 检查GUI
console.log('GUI exists:', !!window.gui);
if (window.gui) {
    console.log('GUI children:', window.gui.domElement.children.length);
}
```

---

## 知识卡片功能

每个轨道都配备了知识卡片，包含以下信息：

### 基本信息
- **量子数**：主量子数(n)、角量子数(l)、磁量子数(m)
- **轨道类型**：s、p、d、f、g及其描述
- **描述**：轨道的物理和化学意义

### 形状特征
- **形状**：轨道的空间形状描述
- **对称性**：轨道的对称性质
- **节点数**：径向节点和角节点的数量

**使用方法**：在轨道列表界面，点击任意轨道项右侧的ℹ️图标，即可在右侧面板查看该轨道的详细知识信息。

---

## 最新更新记录

### v2.3 - 完整修复和文档完善 (2024-01-17)

#### 📚 文档完善
- ✅ 完善"常见问题与故障排除"章节，包含所有已解决的问题
- ✅ 新增"开发经验总结"章节，记录关键经验教训
- ✅ 添加开发检查清单和快速诊断命令
- ✅ 详细记录路径解析、渲染循环、事件绑定等关键问题

#### 🔧 已修复的问题
- ✅ 模型文件无法加载（路径解析问题）
- ✅ 模型显示为二维图片（渲染和相机问题）
- ✅ 交互功能不工作（事件绑定和渲染循环问题）
- ✅ 加载提示一直显示（UI状态管理问题）

#### 📝 经验总结
本次修复过程中发现并解决的关键问题：
1. **ES6 模块路径陷阱**：相对路径基于模块文件位置，不是HTML文件位置
2. **Three.js 渲染循环**：必须持续运行，确保模型正确显示和交互
3. **事件监听器绑定**：需要绑定到正确的元素，检查状态
4. **状态管理**：使用明确的状态变量，确保UI同步更新
5. **错误处理**：优雅降级，不影响主要功能

详细说明请参考 [常见问题与故障排除](#常见问题与故障排除) 和 [开发经验总结](#开发经验总结) 章节

---

### v2.2 - 模型加载和交互修复 (2024-01-17)

#### 🔧 关键修复
- ✅ **修复模型文件无法加载问题**
  - 问题：ES6 模块中的相对路径基于模块文件位置，导致模型文件路径解析错误
  - 解决方案：使用绝对路径（相对于网站根目录）`/models/model++/...`
  - 修改文件：`src/data/modelRegistry.js`
  
- ✅ **修复模型显示问题**
  - 问题：模型加载后显示为二维图片，无法交互
  - 解决方案：修复相机位置、模型位置重置、强制渲染
  - 修改文件：`src/explorer.js`
  
- ✅ **修复交互功能**
  - 问题：鼠标拖拽、滚轮缩放、自动旋转不工作
  - 解决方案：修复事件绑定、确保渲染循环正常工作
  - 修改文件：`src/explorer.js`
  
- ✅ **修复GUI控制台显示**
  - 问题：GUI控制台显示为empty
  - 解决方案：确保GUI元素正确添加到DOM，添加调试日志
  - 修改文件：`src/explorer.js`

#### 📚 文档更新
- ✅ 在 README 中新增"常见问题与故障排除"章节
- ✅ 记录路径解析的最佳实践和常见陷阱
- ✅ 提供路径问题的验证方法

**详细说明**：请参考 [常见问题与故障排除](#常见问题与故障排除) 章节

---

### v2.1 - 路径修复 (2024-01-17)

#### 🔧 关键修复
- ✅ **修复模型文件无法加载问题**
  - 问题：ES6 模块中的相对路径基于模块文件位置，导致模型文件路径解析错误
  - 解决方案：使用 `new URL()` 和 `window.location.href` 构建相对于 HTML 文件的正确路径
  - 修改文件：`src/data/modelRegistry.js`
  - 新增 `getBasePath()` 函数，自动判断路径深度（根目录与子路径，如 GitHub Pages `/Lorbital/`）

#### 📚 文档更新
- ✅ 在 README 中新增"常见问题与故障排除"章节
- ✅ 记录路径解析的最佳实践和常见陷阱
- ✅ 提供路径问题的验证方法

**详细说明**：请参考 [常见问题与故障排除](#常见问题与故障排除) 章节

---

### v2.0 - 界面骨架重构

#### 界面优化
- ✅ 修复SPDFG字母被导航栏遮挡问题（调整标题位置）
- ✅ 优化轨道列表布局，按类型智能排列：
  - S轨道：2行布局（第一行1-3s，第二行4-7s）
  - P轨道：5行3列（每层包含px, py, pz三个方向）
  - D轨道：4行5列（每层包含5种变体）
  - F轨道：2行7列（每层包含7种变体）
  - G轨道：3行3列
- ✅ 缩小返回按钮尺寸20%，界面更加精致
- ✅ 选项方框向下移动，避免挡住SPDFG字母
- ✅ 实验控制台在选择界面隐藏，只在查看器界面显示

#### 功能增强
- ✅ 添加知识卡片功能，每个轨道可查看详细信息（基本信息和形状特征）
- ✅ 完整的P轨道方向支持（px, py, pz）
- ✅ 完整的D轨道变体支持（dxz, dyz等）
- ✅ 完整的F轨道变体支持（7种变体）

#### 模型系统重构
- ✅ 重组model++文件夹结构，按SPDFG分类组织：
  ```
  models/model++/
  ├── s/{orbitalId}/{orbitalId}.ply
  ├── p/{orbitalId}/{orbitalId}.ply
  ├── d/{orbitalId}/{orbitalId}.ply
  ├── f/{orbitalId}/{orbitalId}.ply
  └── g/{orbitalId}/{orbitalId}.ply
  ```
- ✅ 修改模型读取机制，自动识别轨道类型并构建正确路径
- ✅ 完全使用PLY文件中的原始颜色，不设置默认颜色
- ✅ 支持无meta.json运行，使用智能默认值

#### 技术改进
- ✅ 优化模型注册表，支持所有轨道变体
- ✅ 改进文件路径解析逻辑，自动处理轨道类型映射
- ✅ 增强错误处理，缺失文件时优雅降级

---

## 界面交互

### 3D 探测器 (Explorer)

探测器采用三级界面结构：

1. **分类选择界面**
   - 进入时显示 5 个大类卡片：s, p, d, f, g
   - 每个卡片显示轨道类型字母和中文描述
   - 每个卡片具有发光效果和hover动画
   - 点击卡片进入该类型的轨道列表

2. **轨道列表界面**
   - 显示该类型下的所有轨道，采用智能网格布局
   - **布局规则**：
     - **S轨道**：2行布局，第一行1-3s（3个），第二行4-7s（4个）
     - **P轨道**：5行3列布局（2p, 3p, 4p, 5p, 6p × px, py, pz）
     - **D轨道**：4行5列布局（3d, 4d, 5d, 6d × dxz, dyz, dz², dx²-y², dxy）
     - **F轨道**：2行7列布局（4f, 5f × 7种变体）
     - **G轨道**：3行3列布局（9种变体）
   - 每个轨道项右侧有知识卡片图标（ℹ️），点击可查看轨道详细信息
   - 点击轨道项加载 3D 模型
   - 左上角提供"返回"按钮（已缩小20%）返回分类选择
   - 界面标题（SPDFG字母）位于导航栏下方，不会被遮挡
   - 实验控制台在选择界面隐藏，只在查看器界面显示

3. **3D 查看器界面**
   - 加载并渲染选定的轨道模型
   - **完全使用PLY文件中的原始颜色**，不应用任何默认颜色
   - 如果PLY文件包含颜色信息，自动使用顶点颜色（vertexColors）
   - 支持鼠标拖拽旋转、滚轮缩放
   - 支持手势控制（需摄像头权限）
   - 按 ESC 键或使用返回按钮可返回上级界面
   - 右侧显示实验控制台（可调整粒子大小、显示坐标、旋转速度等）

### 交互控制

- **鼠标操作**
  - 左键拖拽：旋转模型
  - 滚轮：缩放模型
  
- **手势操作**（需要摄像头）
  - 单手捏合 + 移动：旋转模型
  - 双手捏合：缩放模型

- **键盘**
  - ESC：返回上级界面

---

## 已支持的轨道类型

系统采用分层导航界面，按轨道类型分为五大类：

### S 轨道 (l = 0) - 球对称
- 1s, 2s, 3s, 4s, 5s, 6s, 7s (共7个)

### P 轨道 (l = 1) - 哑铃形
- **完整的px, py, pz方向支持**：
  - 2px, 2py, 2pz
  - 3px, 3py, 3pz
  - 4px, 4py, 4pz
  - 5px, 5py, 5pz
  - 6px, 6py, 6pz
- 总计：15个P轨道（5层 × 3个方向）

### D 轨道 (l = 2) - 瓣状分布
- **完整的5种变体支持**：
  - 3d, 4d, 5d, 6d (每层包含：dxz, dyz, dz², dx²-y², dxy)
- 总计：20个D轨道（4层 × 5种变体）

### F 轨道 (l = 3) - 高阶对称
- **完整的7种变体支持**：
  - 4f, 5f (每层包含7种变体：fz³, fxz², fyz², fxyz, fx(x²-3y²), fy(x²-z²), fz(x²-y²))
- 总计：14个F轨道（2层 × 7种变体）

### G 轨道 (l = 4) - 超高阶
- 5g (9种变体: gz⁴, gxz³, gyz³, gz²(x²-y²), gxyz², gxz(x²-3y²), gyz(y²-3x²), gx⁴+y⁴, gxy(x²-y²))
- 总计：9个G轨道

**总计**: 65+ 个轨道模型

完整列表请参考 [docs/ORBITALS.md](docs/ORBITALS.md)

---

## 贡献指南

本项目欢迎贡献！请先阅读：

- [CONTRIBUTING.md](CONTRIBUTING.md) - 贡献流程与规范
- [docs/CODING_STANDARDS.md](docs/CODING_STANDARDS.md) - 代码规范
- [docs/AGENTS.md](docs/AGENTS.md) - AI Agent 指令模板（如使用 Cursor）

---

## 许可证

内部项目，暂不公开

---

## 联系方式

项目维护者：Ether Liang

---

---

## 更新记录

### v2.0 - 界面骨架重构 (当前版本)

本次更新对探测器界面进行了全面重构，优化了用户体验，并重构了模型文件组织结构。

#### 🎨 界面优化

1. **修复导航栏遮挡问题**
   - 将SPDFG字母标题位置从 `top: 30px` 调整为 `top: 90px`
   - 确保标题显示在导航栏下方，不会被遮挡

2. **优化轨道列表布局**
   - 实现智能网格布局系统，根据轨道类型自动调整布局：
     - **S轨道**：2行布局，第一行1-3s（3个），第二行4-7s（4个）
     - **P轨道**：5行3列布局（2p, 3p, 4p, 5p, 6p × px, py, pz）
     - **D轨道**：4行5列布局（3d, 4d, 5d, 6d × dxz, dyz, dz², dx²-y², dxy）
     - **F轨道**：2行7列布局（4f, 5f × 7种变体）
     - **G轨道**：3行3列布局（9种变体）
   - 选项方框向下移动（`margin-top: 40px`），避免挡住SPDFG字母
   - 保持所有发光效果和hover动画

3. **界面元素调整**
   - 返回按钮缩小20%（`padding: 12px 24px`, `font-size: 13px`）
   - 实验控制台在选择界面隐藏，只在查看器界面显示
   - 优化了界面间距和布局

#### ✨ 功能增强

1. **知识卡片功能**
   - 每个轨道项右侧添加知识卡片图标（ℹ️）
   - 点击图标在右侧面板显示轨道详细信息
   - 知识卡片包含：
     - **基本信息**：量子数(n, l, m)、轨道类型、描述
     - **形状特征**：轨道形状、对称性、节点数
   - 知识卡片使用半透明玻璃态设计，与整体UI风格一致

2. **完整的轨道支持**
   - **P轨道**：支持完整的px, py, pz三个方向（移除"即将推出"标识）
   - **D轨道**：支持完整的5种变体（dxz, dyz, dz², dx²-y², dxy）
   - **F轨道**：支持完整的7种变体
   - **总计**：65+个轨道模型（从原来的43+个扩展到65+个）

3. **颜色系统优化**
   - **完全使用PLY文件中的原始颜色**
   - 移除所有默认青色设置
   - 如果PLY文件包含颜色信息，自动使用顶点颜色（vertexColors）
   - 只有在PLY文件不包含颜色信息时才使用后备颜色

#### 🗂️ 模型系统重构

1. **文件夹结构重组**
   - 从 `models/model++/n1/s/1s.ply` 结构重组为 `models/model++/s/1s/1s.ply`
   - 按SPDFG分类组织，便于管理和查找：
     ```
     models/model++/
     ├── s/{orbitalId}/{orbitalId}.ply
     ├── p/{orbitalId}/{orbitalId}.ply
     ├── d/{orbitalId}/{orbitalId}.ply
     ├── f/{orbitalId}/{orbitalId}.ply
     └── g/{orbitalId}/{orbitalId}.ply
     ```
   - 提供了 `reorganize_models.py` 脚本用于自动重组

2. **模型读取机制改进**
   - 自动识别轨道类型（s, p, d, f, g）
   - 自动构建正确的文件路径：`models/model++/{type}/{orbitalId}/{orbitalId}.ply`
   - 支持无meta.json运行（使用智能默认值）
   - 优化了错误处理和路径解析逻辑

3. **元数据系统**
   - 如果meta.json不存在，自动使用默认值
   - 默认值包括：透明度0.8、推荐缩放1.0等
   - 从轨道ID自动提取量子数等信息

#### 🔧 技术改进

1. **代码优化**
   - 重构了模型注册表，支持所有轨道变体
   - 优化了文件路径解析逻辑
   - 改进了错误处理机制
   - 增强了代码的可维护性

2. **性能优化**
   - 优化了界面渲染性能
   - 改进了文件加载逻辑
   - 减少了不必要的文件请求

#### 📝 文档更新

1. 更新了README，包含：
   - 新的文件夹结构说明
   - 模型读取机制详细说明
   - 知识卡片功能说明
   - 界面布局规则说明
   - 更新记录章节

#### ⚠️ 重要变更

- **模型文件路径已更改**：从 `public/models/` 改为 `models/model++/`
- **文件命名规则**：从 `cloud.ply` 改为 `{orbitalId}.ply`
- **颜色系统**：不再使用默认青色，完全使用PLY文件中的原始颜色
- **meta.json**：现在是可选的，系统可以在没有meta.json的情况下运行

---

## 致谢

灵感来源：剑桥大学 Peter Wothers 教授的化学课堂

*"让不可见，变得可见。"*
