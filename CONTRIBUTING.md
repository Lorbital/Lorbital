# 贡献指南

欢迎为 Lorbital 项目做出贡献！本文档将指导你如何参与项目开发。

---

## 开发环境设置

### 前置要求

1. **现代浏览器**（Chrome 90+, Firefox 88+, Safari 14+）
2. **本地 HTTP 服务器**（不能直接用 `file://` 协议）
3. **代码编辑器**（推荐 VS Code）

### 快速开始

```bash
# 1. 克隆仓库
git clone <repository-url>
cd QuantumProject

# 2. 启动本地服务器（任选其一）
python -m http.server 8000
# 或
npx serve
# 或使用 VS Code Live Server 插件

# 3. 访问应用
open http://localhost:8000/src/pages/index.html
```

---

## 代码规范

### 基本规范

1. **使用 ES6 模块**
   ```javascript
   // ✅ 正确
   import * as THREE from 'three';
   export function loadModel() { ... }

   // ❌ 错误
   var THREE = require('three');
   ```

2. **避免全局变量**
   ```javascript
   // ✅ 正确
   export class OrbitalViewer { ... }

   // ❌ 错误
   window.OrbitalViewer = class { ... }
   ```

3. **命名规范**
   - 类名：PascalCase (`OrbitalViewer`)
   - 函数/变量：camelCase (`loadModel`)
   - 常量：UPPER_SNAKE_CASE (`MAX_SCALE`)
   - 文件名：PascalCase for classes, camelCase for utils

4. **注释要求**
   - 关键算法必须注释（如手势平滑、缩放跳变抑制）
   - 复杂逻辑需要解释
   - 使用 JSDoc 格式

详细规范请参考 [docs/CODING_STANDARDS.md](docs/CODING_STANDARDS.md)

---

## 开发流程

### 1. 创建分支

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

### 2. 编写代码

遵循项目架构：
- **Three.js 相关** → `src/three/`
- **手势控制** → `src/gesture/`
- **UI 组件** → `src/components/`
- **数据层** → `src/data/`

### 3. 测试

确保以下功能正常：
- [ ] 3D 模型加载与渲染
- [ ] 模型切换
- [ ] 鼠标交互（旋转、缩放）
- [ ] 手势控制（如果涉及）
- [ ] 页面导航
- [ ] 响应式布局

### 4. 提交代码

```bash
git add .
git commit -m "feat: 添加新功能描述"
# 或
git commit -m "fix: 修复问题描述"
```

**提交信息格式**：
- `feat:` 新功能
- `fix:` 修复
- `docs:` 文档
- `refactor:` 重构
- `style:` 格式调整

### 5. 提交 Pull Request

在 GitHub 上创建 PR，说明：
- 改动内容
- 测试情况
- 相关 issue（如有）

---

## 架构约束（必须遵守）

### ❌ 绝对禁止

1. **禁止在浏览器端进行实时量子模拟**
   - 所有点云必须在 Python 层离线生成
   - Web 端只负责加载、渲染、交互

2. **禁止在 PLY 中嵌入元数据**
   - PLY 只存储几何信息
   - 元数据必须在 JSON 中

3. **禁止随意修改模型尺寸**
   - 尺寸是物理参数（mm），不是视觉缩放

### ✅ 必须遵守

1. **模块职责清晰**：每个模块只做一件事
2. **数据层与展示层分离**：JSON 不参与渲染
3. **物理真实性**：模型必须忠于物理

---

## 使用 AI Agent（如 Cursor）

本项目提供了 AI Agent 指令模板，帮助 AI 理解项目架构与约束。

### Agent 角色

1. **项目架构总工程师** - 维护架构一致性
2. **量子电子云模拟工程师** - Python 层开发
3. **Web / Three.js 工程师** - 前端开发
4. **Web 设计与叙事体验** - UI/UX 设计

### 使用方法

1. 在 Cursor 中创建新 Agent
2. 复制对应的 System Prompt（见下方或 [docs/AGENTS.md](docs/AGENTS.md)）
3. 粘贴到 Agent 配置中

### Agent 1: 项目架构总工程师

```
You are the chief architect of the Lorbital project.
Your responsibility is to maintain architectural consistency across
Python simulation, data formats, and Web frontend.

Never suggest real-time quantum simulation in the browser.
Always respect the separation:
Offline generation → Data assets → Web rendering.

Prioritize stability, clarity, and long-term scalability.
```

### Agent 2: 量子电子云模拟工程师（Python）

```
You are responsible for offline numerical simulation of hydrogen
electron orbitals for glass inner engraving.

You must:
- Use Monte Carlo accept-reject sampling
- Ensure physical correctness of |ψ|² distributions
- Optimize for point uniformity and manufacturability
- Output DXF for fabrication and PLY for web visualization

Never write browser-side code.
Never simplify physics for performance unless explicitly instructed.
```

### Agent 3: Web / Three.js 工程师

```
You build the interactive Web visualization system for Lorbital.

Constraints:
- No real-time orbital computation
- Load PLY point clouds only
- Use Three.js efficiently for large point sets
- Implement smooth interaction (mouse + optional gesture)

Assume models are physically accurate and must not be distorted.
Focus on rendering, performance, and interaction clarity.
```

### Agent 4: Web 设计与叙事体验

```
You design the visual and narrative experience of the Lorbital website.

Your goal:
- Make quantum mechanics intuitively understandable
- Emphasize elegance and scientific credibility
- Avoid excessive decoration
- Treat the site as a digital exhibition, not a blog

Always assume the audience is non-expert but curious.
```

完整指令模板请参考 [docs/AGENTS.md](docs/AGENTS.md)

---

## 报告问题

### Bug 报告

请包含：
1. **环境信息**：浏览器、操作系统
2. **复现步骤**：详细步骤
3. **预期行为**：应该发生什么
4. **实际行为**：实际发生了什么
5. **截图/日志**：如有

### 功能建议

请说明：
1. **需求背景**：为什么需要这个功能
2. **使用场景**：谁会用到
3. **预期效果**：希望达到什么效果

---

## 代码审查标准

提交的代码将被审查以下方面：

1. **架构合规性**：是否符合三层架构
2. **代码质量**：是否遵循规范
3. **性能影响**：是否影响渲染性能
4. **兼容性**：是否兼容主流浏览器
5. **文档完整性**：是否更新相关文档

---

## 获取帮助

- 查看 [ARCHITECTURE.md](ARCHITECTURE.md) 了解架构
- 查看 [docs/](docs/) 目录下的技术文档
- 提交 Issue 询问问题

---

感谢你的贡献！🎉
