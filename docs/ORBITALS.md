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

### 支持的 D 轨道

| ID | n | l | 变体 | 显示名称 | 描述 |
|----|---|---|------|---------|------|
| `3d_dz2` | 3 | 2 | dz² | 3d (dz²) | 第一主壳层 d 轨道 (dz²) |
| `3d_dx2-y2` | 3 | 2 | dx²-y² | 3d (dx²-y²) | 第一主壳层 d 轨道 (dx²-y²) |
| `3d_dxy` | 3 | 2 | dxy | 3d (dxy) | 第一主壳层 d 轨道 (dxy) |
| `4d_dz2` | 4 | 2 | dz² | 4d (dz²) | 第二主壳层 d 轨道 (dz²) |
| `4d_dx2-y2` | 4 | 2 | dx²-y² | 4d (dx²-y²) | 第二主壳层 d 轨道 (dx²-y²) |
| `4d_dxy` | 4 | 2 | dxy | 4d (dxy) | 第二主壳层 d 轨道 (dxy) |
| `5d_dz2` | 5 | 2 | dz² | 5d (dz²) | 第三主壳层 d 轨道 (dz²) |
| `5d_dx2-y2` | 5 | 2 | dx²-y² | 5d (dx²-y²) | 第三主壳层 d 轨道 (dx²-y²) |
| `5d_dxy` | 5 | 2 | dxy | 5d (dxy) | 第三主壳层 d 轨道 (dxy) |
| `6d_dz2` | 6 | 2 | dz² | 6d (dz²) | 第四主壳层 d 轨道 (dz²) |
| `6d_dx2-y2` | 6 | 2 | dx²-y² | 6d (dx²-y²) | 第四主壳层 d 轨道 (dx²-y²) |
| `6d_dxy` | 6 | 2 | dxy | 6d (dxy) | 第四主壳层 d 轨道 (dxy) |

**文件命名**：`{n}d_{variant}.ply` → `public/models/{n}d_{variant}/cloud.ply`

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

### 支持的 F 轨道

| ID | n | l | 变体 | 显示名称 | 描述 |
|----|---|---|------|---------|------|
| `4f_fz3` | 4 | 3 | fz³ | 4f (fz³) | 第一主壳层 f 轨道 (fz³) |
| `4f_fxz2` | 4 | 3 | fxz² | 4f (fxz²) | 第一主壳层 f 轨道 (fxz²) |
| `4f_fxyz` | 4 | 3 | fxyz | 4f (fxyz) | 第一主壳层 f 轨道 (fxyz) |
| `4f_fx(x2-3y2)` | 4 | 3 | fx(x²-3y²) | 4f (fx(x²-3y²)) | 第一主壳层 f 轨道 (fx(x²-3y²)) |
| `4f_fy(x2-z2)` | 4 | 3 | fy(x²-z²) | 4f (fy(x²-z²)) | 第一主壳层 f 轨道 (fy(x²-z²)) |
| `5f_fz3` | 5 | 3 | fz³ | 5f (fz³) | 第二主壳层 f 轨道 (fz³) |
| `5f_fxz2` | 5 | 3 | fxz² | 5f (fxz²) | 第二主壳层 f 轨道 (fxz²) |
| `5f_fxyz` | 5 | 3 | fxyz | 5f (fxyz) | 第二主壳层 f 轨道 (fxyz) |
| `5f_fx(x2-3y2)` | 5 | 3 | fx(x²-3y²) | 5f (fx(x²-3y²)) | 第二主壳层 f 轨道 (fx(x²-3y²)) |
| `5f_fy(x2-z2)` | 5 | 3 | fy(x²-z²) | 5f (fy(x²-z²)) | 第二主壳层 f 轨道 (fy(x²-z²)) |

**文件命名**：
- 文件名：`{n}f_{variant}.ply`（括号替换为 `()`）
- 路径：`public/models/{n}f_{variant}/cloud.ply`

**注意**：文件名中括号必须转义，JSON 中使用原始符号。

---

## 完整列表（34 个轨道）

### S 轨道 (7 个)
1. 1s, 2s, 3s, 4s, 5s, 6s, 7s

### P 轨道 (5 个)
2. 2p, 3p, 4p, 5p, 6p

### D 轨道 (12 个)
3. 3d_dz2, 3d_dx2-y2, 3d_dxy
4. 4d_dz2, 4d_dx2-y2, 4d_dxy
5. 5d_dz2, 5d_dx2-y2, 5d_dxy
6. 6d_dz2, 6d_dx2-y2, 6d_dxy

### F 轨道 (10 个)
7. 4f_fz3, 4f_fxz2, 4f_fxyz, 4f_fx(x2-3y2), 4f_fy(x2-z2)
8. 5f_fz3, 5f_fxz2, 5f_fxyz, 5f_fx(x2-3y2), 5f_fy(x2-z2)

**总计：34 个轨道**

---

## 注册表格式

在 `src/data/modelRegistry.js` 中的组织方式：

```javascript
export const MODEL_REGISTRY = {
  'S Orbitals (球对称)': [
    '1s', '2s', '3s', '4s', '5s', '6s', '7s'
  ],
  'P Orbitals (哑铃形)': [
    '2p', '3p', '4p', '5p', '6p'
  ],
  'D Orbitals (瓣状分布)': [
    '3d_dz2', '3d_dx2-y2', '3d_dxy',
    '4d_dz2', '4d_dx2-y2', '4d_dxy',
    '5d_dz2', '5d_dx2-y2', '5d_dxy',
    '6d_dz2', '6d_dx2-y2', '6d_dxy'
  ],
  'F Orbitals (高阶对称)': [
    '4f_fz3', '4f_fxz2', '4f_fxyz', '4f_fx(x2-3y2)', '4f_fy(x2-z2)',
    '5f_fz3', '5f_fxz2', '5f_fxyz', '5f_fx(x2-3y2)', '5f_fy(x2-z2)'
  ]
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
