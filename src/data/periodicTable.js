/**
 * Element periodic table layout + representative occupied subshell → orbital model id.
 * @module data/periodicTable
 */

import { hasOrbitalModel } from './modelRegistry.js';

/** @typedef {'available'|'previewOnly'|'disabled'} CellStatus */

/**
 * Raw rows: [z, symbol, period, group, gridRow, gridCol]
 * gridRow 8 = Lanthanides, gridRow 9 = Actinides
 */
export const PERIODIC_RAW = [
  [1, 'H', 1, 1, 1, 1],
  [2, 'He', 1, 18, 1, 18],
  [3, 'Li', 2, 1, 2, 1],
  [4, 'Be', 2, 2, 2, 2],
  [5, 'B', 2, 13, 2, 13],
  [6, 'C', 2, 14, 2, 14],
  [7, 'N', 2, 15, 2, 15],
  [8, 'O', 2, 16, 2, 16],
  [9, 'F', 2, 17, 2, 17],
  [10, 'Ne', 2, 18, 2, 18],
  [11, 'Na', 3, 1, 3, 1],
  [12, 'Mg', 3, 2, 3, 2],
  [13, 'Al', 3, 13, 3, 13],
  [14, 'Si', 3, 14, 3, 14],
  [15, 'P', 3, 15, 3, 15],
  [16, 'S', 3, 16, 3, 16],
  [17, 'Cl', 3, 17, 3, 17],
  [18, 'Ar', 3, 18, 3, 18],
  [19, 'K', 4, 1, 4, 1],
  [20, 'Ca', 4, 2, 4, 2],
  [21, 'Sc', 4, 3, 4, 3],
  [22, 'Ti', 4, 4, 4, 4],
  [23, 'V', 4, 5, 4, 5],
  [24, 'Cr', 4, 6, 4, 6],
  [25, 'Mn', 4, 7, 4, 7],
  [26, 'Fe', 4, 8, 4, 8],
  [27, 'Co', 4, 9, 4, 9],
  [28, 'Ni', 4, 10, 4, 10],
  [29, 'Cu', 4, 11, 4, 11],
  [30, 'Zn', 4, 12, 4, 12],
  [31, 'Ga', 4, 13, 4, 13],
  [32, 'Ge', 4, 14, 4, 14],
  [33, 'As', 4, 15, 4, 15],
  [34, 'Se', 4, 16, 4, 16],
  [35, 'Br', 4, 17, 4, 17],
  [36, 'Kr', 4, 18, 4, 18],
  [37, 'Rb', 5, 1, 5, 1],
  [38, 'Sr', 5, 2, 5, 2],
  [39, 'Y', 5, 3, 5, 3],
  [40, 'Zr', 5, 4, 5, 4],
  [41, 'Nb', 5, 5, 5, 5],
  [42, 'Mo', 5, 6, 5, 6],
  [43, 'Tc', 5, 7, 5, 7],
  [44, 'Ru', 5, 8, 5, 8],
  [45, 'Rh', 5, 9, 5, 9],
  [46, 'Pd', 5, 10, 5, 10],
  [47, 'Ag', 5, 11, 5, 11],
  [48, 'Cd', 5, 12, 5, 12],
  [49, 'In', 5, 13, 5, 13],
  [50, 'Sn', 5, 14, 5, 14],
  [51, 'Sb', 5, 15, 5, 15],
  [52, 'Te', 5, 16, 5, 16],
  [53, 'I', 5, 17, 5, 17],
  [54, 'Xe', 5, 18, 5, 18],
  [55, 'Cs', 6, 1, 6, 1],
  [56, 'Ba', 6, 2, 6, 2],
  [57, 'La', 6, 3, 6, 3],
  [58, 'Ce', 6, 4, 8, 4],
  [59, 'Pr', 6, 5, 8, 5],
  [60, 'Nd', 6, 6, 8, 6],
  [61, 'Pm', 6, 7, 8, 7],
  [62, 'Sm', 6, 8, 8, 8],
  [63, 'Eu', 6, 9, 8, 9],
  [64, 'Gd', 6, 10, 8, 10],
  [65, 'Tb', 6, 11, 8, 11],
  [66, 'Dy', 6, 12, 8, 12],
  [67, 'Ho', 6, 13, 8, 13],
  [68, 'Er', 6, 14, 8, 14],
  [69, 'Tm', 6, 15, 8, 15],
  [70, 'Yb', 6, 16, 8, 16],
  [71, 'Lu', 6, 3, 8, 17],
  [72, 'Hf', 6, 4, 6, 4],
  [73, 'Ta', 6, 5, 6, 5],
  [74, 'W', 6, 6, 6, 6],
  [75, 'Re', 6, 7, 6, 7],
  [76, 'Os', 6, 8, 6, 8],
  [77, 'Ir', 6, 9, 6, 9],
  [78, 'Pt', 6, 10, 6, 10],
  [79, 'Au', 6, 11, 6, 11],
  [80, 'Hg', 6, 12, 6, 12],
  [81, 'Tl', 6, 13, 6, 13],
  [82, 'Pb', 6, 14, 6, 14],
  [83, 'Bi', 6, 15, 6, 15],
  [84, 'Po', 6, 16, 6, 16],
  [85, 'At', 6, 17, 6, 17],
  [86, 'Rn', 6, 18, 6, 18],
  [87, 'Fr', 7, 1, 7, 1],
  [88, 'Ra', 7, 2, 7, 2],
  [89, 'Ac', 7, 3, 7, 3],
  [90, 'Th', 7, 4, 9, 4],
  [91, 'Pa', 7, 5, 9, 5],
  [92, 'U', 7, 6, 9, 6],
  [93, 'Np', 7, 7, 9, 7],
  [94, 'Pu', 7, 8, 9, 8],
  [95, 'Am', 7, 9, 9, 9],
  [96, 'Cm', 7, 10, 9, 10],
  [97, 'Bk', 7, 11, 9, 11],
  [98, 'Cf', 7, 12, 9, 12],
  [99, 'Es', 7, 13, 9, 13],
  [100, 'Fm', 7, 14, 9, 14],
  [101, 'Md', 7, 15, 9, 15],
  [102, 'No', 7, 16, 9, 16],
  [103, 'Lr', 7, 17, 9, 17],
  [104, 'Rf', 7, 4, 7, 4],
  [105, 'Db', 7, 5, 7, 5],
  [106, 'Sg', 7, 6, 7, 6],
  [107, 'Bh', 7, 7, 7, 7],
  [108, 'Hs', 7, 8, 7, 8],
  [109, 'Mt', 7, 9, 7, 9],
  [110, 'Ds', 7, 10, 7, 10],
  [111, 'Rg', 7, 11, 7, 11],
  [112, 'Cn', 7, 12, 7, 12],
  [113, 'Nh', 7, 13, 7, 13],
  [114, 'Fl', 7, 14, 7, 14],
  [115, 'Mc', 7, 15, 7, 15],
  [116, 'Lv', 7, 16, 7, 16],
  [117, 'Ts', 7, 17, 7, 17],
  [118, 'Og', 7, 18, 7, 18]
];

/**
 * 五个实 d 轨道按八面体场中能量从低到高（与配体相互作用时常见分裂）：
 * t₂g：d_xy、d_xz、d_yz，然后 e_g：d_z²、d_x²−y²。
 * 氢原子中单电子时五者简并；此处顺序用于周期表展示与配位化学惯例一致。
 * @see Crystal field theory (O_h): t2g lower than eg
 */
const D_REAL_SUFFIXES_ENERGY_ORDER = ['xy', 'xz', 'yz', 'z2', 'x2-y2'];

/**
 * 主表 d 区（族 3–12）从左到右在周期内下标 0–9；前 5 个元素用轨道 0–4，后 5 个再用 0–4。
 * @param {number} group
 * @returns {number} 0..9
 */
function dBlockSlotIndex(group) {
  return group - 3;
}

/**
 * @param {number} n d 主量子数（如 3d → n=3）
 * @param {number} slotIndex 0..9 周期内 d 区位置
 */
function dOrbitalIdForSlot(n, slotIndex) {
  const suffix = D_REAL_SUFFIXES_ENERGY_ORDER[slotIndex % 5];
  return `${n}d_${suffix}`;
}

/**
 * p 区每周期 6 个元素，三个实 p 轨道各出现两次：按 px、py、pz 轮换（氢样下简并，次序取轴字母序）。
 */
const P_AXIS_ORDER = ['px', 'py', 'pz'];

/**
 * @param {number} n 主量子数（如 2p → n=2）
 * @param {number} slotIndex 周期内 p 区位置 0..5（族 13→0 … 18→5）
 */
function pOrbitalIdForSlot(n, slotIndex) {
  const axis = P_AXIS_ORDER[slotIndex % 3];
  return `${n}${axis}`;
}

/**
 * 七个实 f 轨道：氢样单电子下简并；次序与 `MODEL_REGISTRY` 中 f 族列表一致（便于与模型 id 对齐）。
 */
const F_REAL_SUFFIXES_ORDER = [
  'z3',
  'xz2',
  'yz2',
  'zx2-y2',
  'xyz',
  'x(x2-3y2)',
  'y(x2-z2)'
];

/**
 * 镧系 / 锕系行：列 4–17 共 14 个元素，7 个轨道各用两次。
 * @param {number} gridCol
 * @returns {number} 0..13
 */
function fBlockSlotIndex(gridCol) {
  return gridCol - 4;
}

/**
 * @param {number} n f 主量子数（镧系 4f → 4，锕系 5f → 5）
 * @param {number} slotIndex 0..13
 */
function fOrbitalIdForSlot(n, slotIndex) {
  const suffix = F_REAL_SUFFIXES_ORDER[slotIndex % 7];
  return `${n}f_${suffix}`;
}

/**
 * Representative subshell model: one concrete hydrogen-like orbital id per rule set.
 * @param {object} p
 * @param {number} p.z
 * @param {string} p.symbol
 * @param {number} p.period
 * @param {number} p.group
 * @param {number} p.gridRow
 * @param {number} p.gridCol
 * @returns {{ orbitalId: string, label: string }}
 */
export function getRepresentativeOrbitalForElement(p) {
  const { period, group, gridRow, gridCol } = p;
  if (gridRow === 8) {
    const slot = fBlockSlotIndex(gridCol);
    const id = fOrbitalIdForSlot(4, slot);
    return { orbitalId: id, label: '4f' };
  }
  if (gridRow === 9) {
    const slot = fBlockSlotIndex(gridCol);
    const id = fOrbitalIdForSlot(5, slot);
    return { orbitalId: id, label: '5f' };
  }
  if (p.z === 1 || p.z === 2) {
    return { orbitalId: '1s', label: '1s' };
  }
  if (group >= 1 && group <= 2) {
    return { orbitalId: `${period}s`, label: `${period}s` };
  }
  if (group >= 13 && group <= 18) {
    const slot = group - 13;
    if (period >= 7) {
      const axis = P_AXIS_ORDER[slot % 3];
      return { orbitalId: `6${axis}`, label: '7p*' };
    }
    const id = pOrbitalIdForSlot(period, slot);
    return { orbitalId: id, label: `${period}p` };
  }
  if (group >= 3 && group <= 12) {
    const n = period - 1;
    const slot = dBlockSlotIndex(group);
    const id = dOrbitalIdForSlot(n, slot);
    return { orbitalId: id, label: `${n}d` };
  }
  return { orbitalId: '1s', label: '1s' };
}

function cellStatusFor(orbitalId) {
  if (hasOrbitalModel(orbitalId)) return /** @type {CellStatus} */ ('available');
  return /** @type {CellStatus} */ ('previewOnly');
}

/**
 * @typedef {object} PeriodicElement
 * @property {number} z
 * @property {string} symbol
 * @property {number} period
 * @property {number} group
 * @property {number} gridRow
 * @property {number} gridCol
 * @property {string} representativeOrbitalId
 * @property {string} representativeLabel
 * @property {CellStatus} cellStatus
 */

/** @type {PeriodicElement[]} */
export const PERIODIC_ELEMENTS = PERIODIC_RAW.map((row) => {
  const [z, symbol, period, group, gridRow, gridCol] = row;
  const { orbitalId, label } = getRepresentativeOrbitalForElement({
    z,
    symbol,
    period,
    group,
    gridRow,
    gridCol
  });
  return {
    z,
    symbol,
    period,
    group,
    gridRow,
    gridCol,
    representativeOrbitalId: orbitalId,
    representativeLabel: label,
    cellStatus: cellStatusFor(orbitalId)
  };
});

/**
 * @param {number} z
 * @returns {PeriodicElement | undefined}
 */
export function getElementByZ(z) {
  return PERIODIC_ELEMENTS.find((e) => e.z === z);
}
