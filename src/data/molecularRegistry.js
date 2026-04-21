/**
 * 分子轨道 UI 注册表（业务层）
 * 底层路径与 PLY 仍由 modelRegistry 解析；此处仅描述展示与分类。
 *
 * @module data/molecularRegistry
 */

/**
 * @typedef {Object} MolecularModelEntry
 * @property {string} orbitalId - 与 modelRegistry / loadOrbital 一致的 ID
 * @property {'polyhedral'|'small'} family
 * @property {string} titleKey - i18n key，卡片标题
 * @property {string} descKey - i18n key，卡片副标题
 * @property {string} [symmetryKey] - i18n key，对称性/几何一行（可选）
 */

/** 展示顺序：现有多面体 + 首批小分子 */
export const MOLECULAR_MODELS = /** @type {MolecularModelEntry[]} */ ([
  {
    orbitalId: 'dodec_C20H20',
    family: 'polyhedral',
    titleKey: 'explorer.molCardDodecTitle',
    descKey: 'explorer.molCardDodecDesc',
    symmetryKey: 'explorer.molCardDodecSym'
  },
  {
    orbitalId: 'icosa_B12H12',
    family: 'polyhedral',
    titleKey: 'explorer.molCardIcosaTitle',
    descKey: 'explorer.molCardIcosaDesc',
    symmetryKey: 'explorer.molCardIcosaSym'
  },
  {
    orbitalId: 'mol_small_CH4',
    family: 'small',
    titleKey: 'explorer.molCardCH4Title',
    descKey: 'explorer.molCardCH4Desc',
    symmetryKey: 'explorer.molCardCH4Sym'
  },
  {
    orbitalId: 'mol_small_NH3',
    family: 'small',
    titleKey: 'explorer.molCardNH3Title',
    descKey: 'explorer.molCardNH3Desc',
    symmetryKey: 'explorer.molCardNH3Sym'
  },
  {
    orbitalId: 'mol_small_H2O',
    family: 'small',
    titleKey: 'explorer.molCardH2OTitle',
    descKey: 'explorer.molCardH2ODesc',
    symmetryKey: 'explorer.molCardH2OSym'
  },
  {
    orbitalId: 'mol_small_C2H4',
    family: 'small',
    titleKey: 'explorer.molCardC2H4Title',
    descKey: 'explorer.molCardC2H4Desc',
    symmetryKey: 'explorer.molCardC2H4Sym'
  },
  {
    orbitalId: 'mol_small_C6H6',
    family: 'small',
    titleKey: 'explorer.molCardC6H6Title',
    descKey: 'explorer.molCardC6H6Desc',
    symmetryKey: 'explorer.molCardC6H6Sym'
  }
]);

/**
 * 所有分子轨道 ID 列表（顺序与 MOLECULAR_MODELS 一致）
 * @returns {string[]}
 */
export function getAllMolecularOrbitalIds() {
  return MOLECULAR_MODELS.map((e) => e.orbitalId);
}
