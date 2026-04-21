# 分子轨道模型资源规范

小分子与多面体分子统一在 Web 端以 **预生成 PLY 点云** 展示，不在浏览器内做量子计算。

## 目录布局

- **新小分子**（`mol_small_*`）：`models/model++/molecule/<orbitalId>/`
  - `meta.json`
  - `<orbitalId>_density.ply` — 总电子密度
  - `<orbitalId>_homo.ply` — HOMO（与现有多面体命名中 homo 层对应）

- **现有多面体**（保留路径）：`dodec/`、`icosa/` 下原有文件名不变。

## meta.json

与现有多面体条目一致，建议包含：

- `id`、`type`、`displayName`、`description`
- `recommendedScale`、`opacity`、`pointCount`（可选）
- `layers`：至少两层
  - `id: "density"`，`path` 指向 density PLY
  - `id: "homo"`，`path` 指向 homo PLY

缺省时 `src/data/modelRegistry.js` 中 `getDefaultMetadata` 对小分子 `mol_small_*` 已给出默认层文件名约定。

## 前端注册

1. 在 `src/data/modelRegistry.js` 的 `MODEL_REGISTRY.molecule` 中加入 `orbitalId`。
2. PLY 就绪后，将 ID 加入 `EXISTING_ORBITALS`。
3. 在 `src/data/molecularRegistry.js` 的 `MOLECULAR_MODELS` 中加入卡片条目与 i18n key。
4. 在 `src/data/orbitalKnowledge.js` 中补充 `kind: "molecular"` 知识条目。

## 离线计算流程（与现有多面体一致）

1. 构建初始几何 → 几何优化（如需要）
2. DFT 计算 → 导出总电子密度与 HOMO 的 Cube
3. Cube → PLY（采样与阈值与现有管道一致）
4. 写入 `meta.json` 并放入上述目录
