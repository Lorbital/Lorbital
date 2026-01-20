# model.py 命名与坐标轴修改规划

> 依据 README、DATA_FORMAT 与「坐标轴在 Python 点云内完成、与 Web 端 AxesHelper 解耦」。

---

## 一、新命名规则（消除 dd / ff / gg）

**问题**：原 `3d_dz2`、`4f_fz3`、`5g_gz4` 中 d、f、g 各出现两次。

**规则**：

| 类型 | 旧 ID 示例 | 新 ID 示例 | 规则 |
|------|------------|------------|------|
| s | 1s, 2s | 1s, 2s | 不变：`{n}s` |
| p | 2px, 3pz | 2px, 3pz | 不变：`{n}{px\|py\|pz}` |
| d | 3d_dz2, 4d_dx2-y2 | **3d_z2**, **4d_x2-y2** | `{n}d_{suffix}`，suffix=orb_name 去首字母 d |
| f | 4f_fz3, 5f_fx(x2-3y2) | **4f_z3**, **5f_x(x2-3y2)** | `{n}f_{suffix}`，suffix=去首字母 f；fxx2-3y2→x(x2-3y2)、fyy2-3x2→y(x2-z2) |
| g | 5g_gz4, 5g_gx4+y4 | **5g_z4**, **5g_x4+y4** | `{n}g_{suffix}`，suffix=orb_name 去首字母 g |

- **类型解析** `getOrbitalType(orbitalId)`：  
  `^\d+s$`→s，`^\d+p[xyz]$`→p，`^\d+d_`→d，`^\d+f_`→f，`^\d+g_`→g。

---

## 二、model.py 修改项

### 1. BASE_URL 与目录结构

- **BASE_URL**：改为项目内 `models/model++`  
  `os.path.join(os.path.dirname(os.path.abspath(__file__)), "model++")`
- **目录**：`{root}/{type}/{orbitalId}/`，与 README 一致  
  - 例：`model++/d/3d_z2/3d_z2.ply`、`model++/f/4f_z3/4f_z3.ply`

### 2. full_name（orbitalId）生成

- `l==0`：`full_name = f"{n}s"`
- `l==1`：`full_name = f"{n}{orb_name}"`（orb_name = px/py/pz）
- `l>=2`（d,f,g）：`suffix`=orb_name 去首字母（f 先做 fxx2-3y2→x(x2-3y2)、fyy2-3x2→y(x2-z2)），`full_name = f"{n}{l_char}_{suffix}"`，如 `3d_z2`、`4f_z3`。

### 3. f 轨道 orb_name 映射（仅在做 full_name 时）

- `get_angular_data` 的 orb_name 保持 `fxx2-3y2`、`fyy2-3x2`；在 `sample_and_save` 得到 orb_name 后、算 suffix 前：`fxx2-3y2`→`x(x2-3y2)`，`fyy2-3x2`→`y(x2-z2)`，再对其余去首字母 f。

### 4. PLY 内嵌坐标轴（标出 +X、+Y、+Z 正方向）

- **方式**：在电子云点之后，向同一 PLY 追加三组坐标轴点。
- **尺度**：`L = max(r_limit * 1.2, 1.0)`（Å）。
- **取样**：每轴 **N=80** 点，步长 `step = L/80`，从 `(step,0,0)` 到 `(L,0,0)`（+X），+Y、+Z 同理；在 `(L,0,0)`、`(0,L,0)`、`(0,0,L)` 各追加 **2** 点强调端点。
- **颜色**：+X 红 `[255,0,0]`，+Y 绿 `[0,255,0]`，+Z 蓝 `[0,0,255]`。

---

## 三、前端需同步的修改

- **modelRegistry.js**：`getOrbitalType` 保持 `^\d+d_`、`^\d+f_`、`^\d+g_`（可匹配 3d_z2、4f_z3、5g_z4）；`EXISTING_ORBITALS`、`MODEL_REGISTRY` 中 d/f/g 全部改为新 ID。
- **orbitalKnowledge.js**：所有 d/f/g 条目的键改为新 ID（如 `3d_dz2`→`3d_z2`），display 用 `formatOrbitalName` 或 title 体现「3d (z²)」等。
- **explorer.js `formatOrbitalName`**：新 ID `{n}d|f|g_{suffix}` →「nd (sub)」「nf (sub)」「ng (sub)」，如 `3d_z2`→「3d (z²)」，`4f_x(x2-3y2)`→「4f (x(x²-3y²))」。

---

## 四、文档

- **DATA_FORMAT.md**、**ORBITALS.md**：示例改为 `3d_z2`、`4f_z3`、`5g_z4` 等，并注明坐标轴已内嵌（L=max(r_limit×1.2,1.0)，每轴 80 点，端点+2）。

---

## 五、与 README 的对应

- **路径**：README 的 `models/model++/{type}/{orbitalId}/{orbitalId}.ply`，model.py 输出与之一致。
- **坐标轴**：README 要求「坐标轴在 `models/model.py` 点云内完成，与 Web 端 AxesHelper 解耦」；本方案在 PLY 内追加 +X/+Y/+Z 轴点，满足该条。

## 六、迁移与重新生成

- 现有 `models/model++/` 下若为旧命名（如 `3d_dz2`、`n4/f/`），需重新生成。
- 在项目根执行：`python models/model.py`，将按新命名与 `{type}/{orbitalId}/` 目录写入 PLY（含坐标轴点）。
