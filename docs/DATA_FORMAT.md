# 数据格式规范

本文档定义 Lorbital 项目使用的数据格式。

---

## PLY 格式

### 概述

**PLY (Polygon File Format)** 用于存储点云几何数据。

### 文件位置

```
models/model++/{type}/{orbital_id}/{orbital_id}.ply
```

其中 `{type}` 为轨道类型（s, p, d, f, g），由 `orbital_id` 推导。

例如：
- `models/model++/s/1s/1s.ply`
- `models/model++/p/2px/2px.ply`
- `models/model++/d/3d_z2/3d_z2.ply`（d/f/g 为新 ID：`{n}d|f|g_{suffix}`，suffix 去首字母，消除 dd/ff/gg）

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

1. **几何信息**
   - x, y, z 坐标（必需）
   - 可选：颜色信息（r, g, b）

2. **坐标轴（内嵌点云）**
   - 由 `models/model.py` 在导出时追加，与 Web 端 AxesHelper 解耦
   - +X 红、+Y 绿、+Z 蓝；L=max(r_limit×1.2, 1.0)，每轴 80 点，端点各 +2 强调

3. **元数据**
   - 轨道类型、量子数等在 `meta.json` 中；PLY 只负责几何与坐标轴点

### 生成规范（Python 层）

- **点密度**：10⁵ ~ 10⁶ 点
- **坐标单位**：Å（埃，1 Å = 10⁻¹⁰ m）
- **空间分布**：基于 |ψ|² 概率密度
- **点间距过滤**：使用 cKDTree，确保最小点间距（避免内雕爆点）

### 加载方式（Web 层）

推荐使用 `modelRegistry.getPlyUrl(orbitalId)` 获取 URL；或直接拼接路径：

```javascript
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';
import { getPlyUrl } from './data/modelRegistry.js';

const loader = new PLYLoader();
loader.load(getPlyUrl('1s'), (geometry) => {
  geometry.center();  // 几何体居中
  // 使用 geometry 创建 Points
});
// 或直接使用路径：'./models/model++/s/1s/1s.ply'
```

---

## meta.json 格式

### 概述

**meta.json** 用于存储轨道的语义信息，不参与渲染，只用于逻辑与 UI。

### 文件位置

```
models/model++/{type}/{orbital_id}/meta.json
```

**可选**：若不存在 meta.json，`modelRegistry.loadMetadata` 会返回基于 `orbital_id` 的默认值，系统可正常运行。

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
| `id` | string | 是 | 轨道唯一标识符 | `"1s"`, `"2px"`, `"3d_z2"` |
| `n` | number | 是 | 主量子数 | `1`, `2`, `3` |
| `l` | number | 是 | 角量子数 | `0` (s), `1` (p), `2` (d), `3` (f) |
| `type` | string | 是 | 轨道类型字符串 | `"s"`, `"p"`, `"d"`, `"f"` |
| `displayName` | string | 是 | 显示名称 | `"1s"`, `"2px"`, `"3d (z²)"` |
| `description` | string | 是 | 描述文本 | `"基态氢原子轨道，球对称"` |
| `pointCount` | number | 是 | 点云点数 | `500000` |
| `physicalDiameter` | number | 是 | 物理直径（Å） | `0.529` |
| `recommendedScale` | number | 是 | 推荐初始缩放比例 | `1.0` |
| `color` | string | 否 | 推荐颜色（HEX） | `"#00ffff"` |
| `opacity` | number | 否 | 推荐透明度 (0-1) | `0.8` |

### 字段详细说明

#### `id`

- 唯一标识符，用于文件路径与注册表
- 格式：`{n}s`、`{n}p[xyz]` 或 `{n}d|f|g_{suffix}`（d/f/g 的 suffix=去首字母，消除 dd/ff/gg）
- 示例：`"1s"`、`"2px"`、`"3d_z2"`、`"4f_z3"`、`"5g_z4"`

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

推荐使用 `modelRegistry.loadMetadata(orbitalId)`（已处理路径与 meta.json 缺省）；或自行 fetch `getMetadataUrl(orbitalId)`，响应非 200 时回退到默认值。

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

### D 轨道（新 ID：`{n}d_{suffix}`，suffix 去首字母 d）

- 变体：`z2`, `xz`, `yz`, `x2-y2`, `xy`（来自 dz2、dxz、dyz、dx2-y2、dxy）
- 示例：`3d_z2`, `3d_x2-y2`, `4d_xz`, `6d_x2-y2`

### F 轨道（新 ID：`{n}f_{suffix}`，suffix 去首字母 f；fxx2-3y2→x(x2-3y2)、fyy2-3x2→y(x2-z2)）

- 变体：`z3`, `xz2`, `yz2`, `zx2-y2`, `xyz`, `x(x2-3y2)`, `y(x2-z2)`
- 示例：`4f_z3`, `4f_xyz`, `5f_x(x2-3y2)`

**注意**：括号在文件名与 JSON 中为 `()`，如 `4f_x(x2-3y2).ply`。

### G 轨道（新 ID：`{n}g_{suffix}`，suffix 去首字母 g）

- 示例：`5g_z4`, `5g_x4+y4`

---

## 目录结构示例

```
models/model++/
├── s/
│   ├── 1s/
│   │   ├── 1s.ply
│   │   └── meta.json    # 可选
│   ├── 2s/
│   │   └── 2s.ply
│   └── ...
├── p/
│   ├── 2px/
│   │   ├── 2px.ply
│   │   └── meta.json    # 可选
│   └── ...
├── d/
│   ├── 3d_z2/
│   │   └── 3d_z2.ply
│   └── ...
├── f/
│   └── 4f_z3/4f_z3.ply
└── g/
    └── ...
```

---

## 数据完整性检查

### 必需检查

1. **文件存在性**
   - 每个 `{orbital_id}` 目录必须包含 `{orbital_id}.ply`（路径：`models/model++/{type}/{orbital_id}/{orbital_id}.ply`）
   - `meta.json` 为可选；缺失时 `loadMetadata` 返回基于 orbital_id 的默认值

2. **ID 一致性**
   - 若存在 `meta.json`，其中的 `id` 应与目录名（orbital_id）一致

3. **点数量一致性**
   - `meta.json` 中的 `pointCount` 可与 PLY 点数对比做校验（可选）

### 验证脚本示例

```javascript
import { getPlyUrl, getMetadataUrl, getOrbitalType, getAllOrbitalIds } from './data/modelRegistry.js';

async function validateModels() {
  const orbitalIds = getAllOrbitalIds();
  for (const id of orbitalIds) {
    const type = getOrbitalType(id);
    const plyPath = `models/model++/${type}/${id}/${id}.ply`;
    const jsonPath = `models/model++/${type}/${id}/meta.json`;
    const plyExists = await checkFileExists(getPlyUrl(id));
    const jsonExists = await checkFileExists(getMetadataUrl(id)).then(r => r.ok).catch(() => false);
    if (!plyExists) console.error(`Missing PLY: ${plyPath}`);
    // meta.json 可选，仅在有时检查 id 一致性
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
