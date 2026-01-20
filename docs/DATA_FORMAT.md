# 数据格式规范

本文档定义 Lorbital 项目使用的数据格式。

---

## PLY 格式

### 概述

**PLY (Polygon File Format)** 用于存储点云几何数据。

### 文件位置

```
public/models/{orbital_id}/cloud.ply
```

例如：
- `public/models/1s/cloud.ply`
- `public/models/2p/cloud.ply`
- `public/models/3d_dz2/cloud.ply`

### 格式说明

#### ASCII 格式（推荐用于调试）

```ply
ply
format ascii 1.0
element vertex 500000
property float x
property float y
property float z
end_header
0.0 0.0 0.0
0.1 0.0 0.0
...
```

#### 二进制格式（推荐用于生产）

- 更小的文件大小
- 更快的加载速度
- Three.js PLYLoader 自动支持

### 内容要求

1. **只包含几何信息**
   - x, y, z 坐标（必需）
   - 可选：颜色信息（r, g, b）

2. **不包含元数据**
   - 轨道类型、量子数等信息在 `meta.json` 中
   - PLY 文件只负责几何数据

### 生成规范（Python 层）

- **点密度**：10⁵ ~ 10⁶ 点
- **坐标单位**：Å（埃，1 Å = 10⁻¹⁰ m）
- **空间分布**：基于 |ψ|² 概率密度
- **点间距过滤**：使用 cKDTree，确保最小点间距（避免内雕爆点）

### 加载方式（Web 层）

```javascript
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';

const loader = new PLYLoader();
loader.load('./public/models/1s/cloud.ply', (geometry) => {
  geometry.center();  // 几何体居中
  // 使用 geometry 创建 Points
});
```

---

## meta.json 格式

### 概述

**meta.json** 用于存储轨道的语义信息，不参与渲染，只用于逻辑与 UI。

### 文件位置

```
public/models/{orbital_id}/meta.json
```

### 完整格式

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

### 字段说明

| 字段 | 类型 | 必需 | 说明 | 示例 |
|------|------|------|------|------|
| `id` | string | 是 | 轨道唯一标识符 | `"1s"`, `"2p"`, `"3d_dz2"` |
| `n` | number | 是 | 主量子数 | `1`, `2`, `3` |
| `l` | number | 是 | 角量子数 | `0` (s), `1` (p), `2` (d), `3` (f) |
| `type` | string | 是 | 轨道类型字符串 | `"s"`, `"p"`, `"d"`, `"f"` |
| `displayName` | string | 是 | 显示名称 | `"1s"`, `"2p"`, `"3d (dz²)"` |
| `description` | string | 是 | 描述文本 | `"基态氢原子轨道，球对称"` |
| `pointCount` | number | 是 | 点云点数 | `500000` |
| `physicalDiameter` | number | 是 | 物理直径（Å） | `0.529` |
| `recommendedScale` | number | 是 | 推荐初始缩放比例 | `1.0` |
| `color` | string | 否 | 推荐颜色（HEX） | `"#00ffff"` |
| `opacity` | number | 否 | 推荐透明度 (0-1) | `0.8` |

### 字段详细说明

#### `id`

- 唯一标识符，用于文件路径与注册表
- 格式：`{n}{type}` 或 `{n}{type}_{variant}`
- 示例：
  - `"1s"` - 1s 轨道
  - `"2p"` - 2p 轨道
  - `"3d_dz2"` - 3d dz² 轨道
  - `"4f_fz3"` - 4f fz³ 轨道

#### `n` (主量子数)

- 决定轨道能量和大小
- 范围：1, 2, 3, ...

#### `l` (角量子数)

- 决定轨道形状
- 值对应关系：
  - `0` → s 轨道（球对称）
  - `1` → p 轨道（哑铃形）
  - `2` → d 轨道（瓣状分布）
  - `3` → f 轨道（高阶对称）

#### `physicalDiameter`

- 物理直径，单位：Å（埃）
- 1 Å = 10⁻¹⁰ m = 0.1 nm
- 这是**绝对物理参数**，不是视觉缩放
- 示例：
  - 1s 轨道：约 0.529 Å（玻尔半径）

#### `recommendedScale`

- 推荐初始缩放比例（视觉缩放）
- 用于 Web 展示时的初始视角
- 范围：通常 0.1 ~ 10.0

#### `color` 和 `opacity`

- 推荐值，可在 UI 中修改
- 默认值：
  - `color`: `"#00ffff"` (青色)
  - `opacity`: `0.8`

### 加载方式（Web 层）

```javascript
async function loadMetadata(orbitalId) {
  const response = await fetch(`./public/models/${orbitalId}/meta.json`);
  if (!response.ok) {
    throw new Error(`Failed to load metadata for ${orbitalId}`);
  }
  return await response.json();
}
```

---

## 轨道命名规范

### 基本格式

```
{n}{type}[_{variant}]
```

### S 轨道

- 格式：`{n}s`
- 示例：`1s`, `2s`, `3s`, `4s`, `5s`, `6s`, `7s`
- 特点：球对称，无变体

### P 轨道

- 格式：`{n}p`
- 示例：`2p`, `3p`, `4p`, `5p`, `6p`
- 特点：以 pz 为代表

### D 轨道

- 格式：`{n}d_{variant}`
- 变体：
  - `dz2` - dz² 轨道
  - `dx2-y2` - dx²-y² 轨道
  - `dxy` - dxy 轨道
- 示例：
  - `3d_dz2`
  - `3d_dx2-y2`
  - `3d_dxy`
  - `4d_dz2`, `5d_dz2`, `6d_dz2`

### F 轨道

- 格式：`{n}f_{variant}`
- 变体：
  - `fz3` - fz³ 轨道
  - `fxz2` - fxz² 轨道
  - `fxyz` - fxyz 轨道
  - `fx(x2-3y2)` - fx(x²-3y²) 轨道
  - `fy(x2-z2)` - fy(x²-z²) 轨道
- 示例：
  - `4f_fz3`
  - `4f_fxyz`
  - `5f_fx(x2-3y2)`

**注意**：文件名中不能使用括号，使用 `()` 替代 `()`：
- 文件名：`4f_fx(x2-3y2).ply`
- JSON 中：`"4f_fx(x2-3y2)"`

---

## 目录结构示例

```
public/models/
├── 1s/
│   ├── cloud.ply
│   └── meta.json
├── 2s/
│   ├── cloud.ply
│   └── meta.json
├── 2p/
│   ├── cloud.ply
│   └── meta.json
├── 3d_dz2/
│   ├── cloud.ply
│   └── meta.json
└── 4f_fz3/
    ├── cloud.ply
    └── meta.json
```

---

## 数据完整性检查

### 必需检查

1. **文件存在性**
   - 每个 `{orbital_id}` 目录必须包含 `cloud.ply` 和 `meta.json`

2. **ID 一致性**
   - `meta.json` 中的 `id` 必须与目录名一致

3. **点数量一致性**
   - `meta.json` 中的 `pointCount` 应该与 PLY 文件中的点数一致（可选，用于验证）

### 验证脚本示例

```javascript
// 验证所有模型文件的完整性
async function validateModels() {
  const orbitalIds = ['1s', '2s', '2p', ...];  // 从 registry 获取
  
  for (const id of orbitalIds) {
    // 检查文件是否存在
    const plyExists = await checkFileExists(`./public/models/${id}/cloud.ply`);
    const jsonExists = await checkFileExists(`./public/models/${id}/meta.json`);
    
    if (!plyExists || !jsonExists) {
      console.error(`Missing files for ${id}`);
      continue;
    }
    
    // 检查 JSON 内容
    const meta = await loadMetadata(id);
    if (meta.id !== id) {
      console.error(`ID mismatch for ${id}: ${meta.id}`);
    }
  }
}
```

---

## 版本历史

- v1.0 (2024-XX-XX): 初始规范

---

## 参考资源

- [PLY Format Specification](https://en.wikipedia.org/wiki/PLY_(file_format))
- [Three.js PLYLoader Documentation](https://threejs.org/docs/#examples/en/loaders/PLYLoader)
