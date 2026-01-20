# 轨道类型与命名规范

本文档列出 Lorbital 项目已支持的轨道类型及其命名规范。

---

## 轨道分类

### 量子数说明

- **n (主量子数)**: 决定轨道能量和大小 (1, 2, 3, ...)
- **l (角量子数)**: 决定轨道形状
  - `l = 0` → s 轨道（球对称）
  - `l = 1` → p 轨道（哑铃形）
  - `l = 2` → d 轨道（瓣状分布）
  - `l = 3` → f 轨道（高阶对称）
- **m_l (磁量子数)**: 决定空间取向（本项目使用实轨道组合）

---

## S 轨道 (l = 0)

**特点**：球对称，无方向性

| ID | n | l | 显示名称 | 描述 |
|----|---|---|---------|------|
| `1s` | 1 | 0 | 1s | 基态氢原子轨道，最小能量 |
| `2s` | 2 | 0 | 2s | 第二主壳层，有一个节点 |
| `3s` | 3 | 0 | 3s | 第三主壳层，有两个节点 |
| `4s` | 4 | 0 | 4s | 第四主壳层 |
| `5s` | 5 | 0 | 5s | 第五主壳层 |
| `6s` | 6 | 0 | 6s | 第六主壳层 |
| `7s` | 7 | 0 | 7s | 第七主壳层 |

**文件命名**：`{n}s.ply` → `public/models/{n}s/cloud.ply`

---

## P 轨道 (l = 1)

**特点**：哑铃形，有方向性（本项目以 pz 为代表）

| ID | n | l | 显示名称 | 描述 |
|----|---|---|---------|------|
| `2p` | 2 | 1 | 2p | 第一主壳层 p 轨道 |
| `3p` | 3 | 1 | 3p | 第二主壳层 p 轨道 |
| `4p` | 4 | 1 | 4p | 第三主壳层 p 轨道 |
| `5p` | 5 | 1 | 5p | 第四主壳层 p 轨道 |
| `6p` | 6 | 1 | 6p | 第五主壳层 p 轨道 |

**文件命名**：`{n}p.ply` → `public/models/{n}p/cloud.ply`

**注意**：P 轨道有三个方向（px, py, pz），本项目以 pz 为代表。

---

## D 轨道 (l = 2)

**特点**：瓣状分布，有多种对称形态

### D 轨道变体

| 变体 | 符号 | 描述 |
|------|------|------|
| `dz2` | dz² | 沿 z 轴对称，双瓣形 |
| `dx2-y2` | dx²-y² | 沿 x, y 轴对称，四瓣形 |
| `dxy` | dxy | xy 平面四瓣形 |

### 支持的 D 轨道（新 ID：`{n}_{variant}`，消除 dd）

| ID | n | l | 变体 | 显示名称 | 描述 |
|----|---|---|------|---------|------|
| `3d_z2` | 3 | 2 | dz² | 3d (z²) | 第一主壳层 d 轨道 (dz²) |
| `3d_x2-y2` | 3 | 2 | dx²-y² | 3d (x²-y²) | 第一主壳层 d 轨道 (dx²-y²) |
| `3d_xy` | 3 | 2 | dxy | 3d (xy) | 第一主壳层 d 轨道 (dxy) |
| `4d_z2` | 4 | 2 | dz² | 4d (z²) | 第二主壳层 d 轨道 (dz²) |
| `4d_x2-y2` | 4 | 2 | dx²-y² | 4d (x²-y²) | 第二主壳层 d 轨道 (dx²-y²) |
| `4d_xy` | 4 | 2 | dxy | 4d (xy) | 第二主壳层 d 轨道 (dxy) |
| … | … | … | … | … | … |
| `6d_z2`, `6d_x2-y2`, `6d_xy` | 6 | 2 | … | 6d (…) | 第四主壳层 d 轨道 |

**文件命名**：`models/model++/d/{n}_{variant}/{n}_{variant}.ply`（含 dxz、dyz 等共 5 变体×4 层）

---

## F 轨道 (l = 3)

**特点**：高阶对称，复杂的空间分布

### F 轨道变体

| 变体 | 符号 | 描述 |
|------|------|------|
| `fz3` | fz³ | 沿 z 轴高阶对称 |
| `fxz2` | fxz² | xz 平面对称 |
| `fxyz` | fxyz | xyz 空间对称 |
| `fx(x2-3y2)` | fx(x²-3y²) | 复杂对称形态 |
| `fy(x2-z2)` | fy(x²-z²) | 复杂对称形态 |

### 支持的 F 轨道（新 ID：`{n}_{variant}`，消除 ff）

| ID | n | l | 变体 | 显示名称 | 描述 |
|----|---|---|------|---------|------|
| `4f_z3` | 4 | 3 | fz³ | 4f (z³) | 第一主壳层 f 轨道 (fz³) |
| `4f_xz2` | 4 | 3 | fxz² | 4f (xz²) | 第一主壳层 f 轨道 (fxz²) |
| `4f_xyz` | 4 | 3 | fxyz | 4f (xyz) | 第一主壳层 f 轨道 (fxyz) |
| `4f_x(x2-3y2)` | 4 | 3 | fx(x²-3y²) | 4f (x(x²-3y²)) | 第一主壳层 f 轨道 |
| `4f_y(x2-z2)` | 4 | 3 | fy(x²-z²) | 4f (y(x²-z²)) | 第一主壳层 f 轨道 |
| `5f_z3` … `5f_y(x2-z2)` | 5 | 3 | … | 5f (…) | 第二主壳层 f 轨道（7 变体） |

**文件命名**：`models/model++/f/{n}_{variant}/{n}_{variant}.ply`

**注意**：括号在文件名与 JSON 中为 `()`，如 `4f_x(x2-3y2).ply`。

---

## 完整列表（65+ 个轨道）

### S 轨道 (7 个)
1s, 2s, 3s, 4s, 5s, 6s, 7s

### P 轨道 (15 个，px/py/pz)
2px,2py,2pz, 3px,3py,3pz, 4px,4py,4pz, 5px,5py,5pz, 6px,6py,6pz

### D 轨道（新 ID：`{n}d_{suffix}`，20 个）
3d_z2, 3d_xz, 3d_yz, 3d_x2-y2, 3d_xy；4、5、6 层各 5 变体

### F 轨道（新 ID：`{n}f_{suffix}`，14 个）
4f_z3, 4f_xz2, 4f_yz2, 4f_zx2-y2, 4f_xyz, 4f_x(x2-3y2), 4f_y(x2-z2)；5f_* 同理

### G 轨道（新 ID：`{n}g_{suffix}`，9 个）
5g_z4, 5g_xz3, 5g_yz3, 5g_z2x2-y2, 5g_xyz2, 5g_xzx2-3y2, 5g_yzy2-3x2, 5g_x4+y4, 5g_xyx2-y2

**总计：65+ 个轨道**

---

## 注册表格式

在 `src/data/modelRegistry.js` 中按 `s/p/d/f/g` 分 key；d/f/g 使用新 ID `{n}d|f|g_{suffix}`（suffix 去首字母，消除 dd/ff/gg）：

```javascript
export const MODEL_REGISTRY = {
  's': ['1s', '2s', '3s', '4s', '5s', '6s', '7s'],
  'p': ['2px','2py','2pz', '3px','3py','3pz', … '6px','6py','6pz'],
  'd': ['3d_xz','3d_yz','3d_z2','3d_x2-y2','3d_xy', … '6d_x2-y2','6d_xy'],
  'f': ['4f_z3','4f_xz2','4f_yz2','4f_zx2-y2','4f_xyz','4f_x(x2-3y2)','4f_y(x2-z2)', …],
  'g': ['5g_z4','5g_xz3','5g_yz3','5g_z2x2-y2','5g_xyz2','5g_xzx2-3y2','5g_yzy2-3x2','5g_x4+y4','5g_xyx2-y2']
};
```

---

## 添加新轨道

### 步骤

1. **在 Python 层生成点云**
   - 使用蒙特卡洛采样生成 PLY 文件
   - 确保符合物理准确性

2. **创建目录结构**
   ```bash
   mkdir -p public/models/{orbital_id}
   ```

3. **放置文件**
   ```bash
   cp generated.ply public/models/{orbital_id}/cloud.ply
   ```

4. **创建 meta.json**
   - 参考 `docs/DATA_FORMAT.md` 中的格式
   - 确保所有必需字段都填写

5. **更新注册表**
   - 在 `src/data/modelRegistry.js` 中添加新轨道
   - 按类型分类

6. **测试**
   - 确保模型可以加载
   - 确保 UI 中可以选择
   - 确保渲染正常

---

## 参考资源

- [量子力学轨道基础](https://en.wikipedia.org/wiki/Atomic_orbital)
- [球谐函数](https://en.wikipedia.org/wiki/Spherical_harmonics)
- [实轨道与复轨道](https://en.wikipedia.org/wiki/Atomic_orbital#Real_orbitals)
