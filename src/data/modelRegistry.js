/**
 * 轨道模型注册表
 * 
 * 统一管理所有轨道模型的元数据信息
 * 
 * @module data/modelRegistry
 */

/**
 * 模型分类注册表
 * 
 * 按轨道类型组织，用于 UI 显示
 * 按类型分组：s, p, d, f, g
 */
/**
 * 实际存在的轨道模型（已生成PLY文件）
 * 用于验证轨道是否存在实际模型
 */
/** 已生成 PLY 的轨道（新 ID：d/f/g 为 {n}d|f|g_{suffix}，suffix 去首字母，消除 dd/ff/gg） */
export const EXISTING_ORBITALS = new Set([
  '1s', '2s', '3s', '4s', '5s', '6s', '7s',
  '2px', '2py', '2pz', '3px', '3py', '3pz', '4px', '4py', '4pz', '5px', '5py', '5pz', '6px', '6py', '6pz',
  '3d_z2', '3d_xz', '3d_yz', '3d_x2-y2', '3d_xy',
  '4d_z2', '4d_xz', '4d_yz', '4d_x2-y2', '4d_xy',
  '5d_z2', '5d_xz', '5d_yz', '5d_x2-y2', '5d_xy',
  '6d_z2', '6d_xz', '6d_yz', '6d_x2-y2', '6d_xy',
  '4f_z3', '4f_xz2', '4f_yz2', '4f_zx2-y2', '4f_xyz', '4f_x(x2-3y2)', '4f_y(x2-z2)',
  '5f_z3', '5f_xz2', '5f_yz2', '5f_zx2-y2', '5f_xyz', '5f_x(x2-3y2)', '5f_y(x2-z2)',
  '5g_z4', '5g_xz3', '5g_yz3', '5g_z2x2-y2', '5g_xyz2',
  '5g_xzx2-3y2', '5g_yzy2-3x2', '5g_x4+y4', '5g_xyx2-y2'
]);

/** 新 ID：d/f/g 为 {n}d|f|g_{suffix} */
export const MODEL_REGISTRY = {
  's': ['1s', '2s', '3s', '4s', '5s', '6s', '7s'],
  'p': ['2px', '2py', '2pz', '3px', '3py', '3pz', '4px', '4py', '4pz', '5px', '5py', '5pz', '6px', '6py', '6pz'],
  'd': [
    '3d_xz', '3d_yz', '3d_z2', '3d_x2-y2', '3d_xy',
    '4d_xz', '4d_yz', '4d_z2', '4d_x2-y2', '4d_xy',
    '5d_xz', '5d_yz', '5d_z2', '5d_x2-y2', '5d_xy',
    '6d_xz', '6d_yz', '6d_z2', '6d_x2-y2', '6d_xy'
  ],
  'f': [
    '4f_z3', '4f_xz2', '4f_yz2', '4f_zx2-y2', '4f_xyz', '4f_x(x2-3y2)', '4f_y(x2-z2)',
    '5f_z3', '5f_xz2', '5f_yz2', '5f_zx2-y2', '5f_xyz', '5f_x(x2-3y2)', '5f_y(x2-z2)'
  ],
  'g': [
    '5g_z4', '5g_xz3', '5g_yz3', '5g_z2x2-y2', '5g_xyz2',
    '5g_xzx2-3y2', '5g_yzy2-3x2', '5g_x4+y4', '5g_xyx2-y2'
  ]
};

/**
 * 获取所有轨道 ID
 * 
 * @returns {string[]} 所有轨道 ID 数组
 */
export function getAllOrbitalIds() {
  return Object.values(MODEL_REGISTRY).flat();
}

/**
 * 按类型获取轨道 ID
 * 
 * @param {string} type - 轨道类型 ('s', 'p', 'd', 'f', 'g')
 * @returns {string[]} 该类型的所有轨道 ID
 */
export function getOrbitalsByType(type) {
  if (MODEL_REGISTRY[type]) {
    return MODEL_REGISTRY[type];
  }
  return getAllOrbitalIds().filter(id => {
    if (type === 's') return /^\d+s$/.test(id);
    if (type === 'p') return /^\d+p[xyz]$/.test(id);
    if (type === 'd') return /^\d+d_/.test(id);
    if (type === 'f') return /^\d+f_/.test(id);
    if (type === 'g') return /^\d+g_/.test(id);
    return false;
  });
}

/**
 * 获取轨道的元数据 URL
 * 
 * @param {string} orbitalId - 轨道 ID
 * @returns {string} meta.json 文件 URL
 */
/**
 * 获取轨道类型
 * 
 * @param {string} orbitalId - 轨道 ID
 * @returns {string} 轨道类型 (s, p, d, f, g)
 */
/** 支持新 ID：d/f/g 为 {n}d|f|g_{suffix}，如 3d_z2、4f_z3、5g_z4；^\d+d_、^\d+f_、^\d+g_ 可匹配 */
export function getOrbitalType(orbitalId) {
  if (orbitalId.match(/^\d+s$/)) return 's';
  if (orbitalId.match(/^\d+p[xyz]$/)) return 'p';
  if (orbitalId.match(/^\d+d_/)) return 'd';
  if (orbitalId.match(/^\d+f_/)) return 'f';
  if (orbitalId.match(/^\d+g_/)) return 'g';
  return 's';
}

/**
 * 将 UI 的 orbitalId 转为磁盘上的文件夹/文件名
 * 磁盘仍为旧命名：d/f/g 的 suffix 前保留首字母，如 3d_dz2、4f_fz3、5g_gz4
 * 规则：{n}d_{suffix} → {n}d_d{suffix}，{n}f_{suffix} → {n}f_f{suffix}，{n}g_{suffix} → {n}g_g{suffix}
 * s、p 不变
 *
 * @param {string} orbitalId - 轨道 ID（UI 用）
 * @returns {string} 实际路径名（文件夹名与 .ply 文件名）
 */
function orbitalIdToPathName(orbitalId) {
  const m = orbitalId.match(/^(\d+)([dfg])_(.+)$/);
  if (m) {
    const n = m[1], type = m[2], suffix = m[3];
    return `${n}${type}_${type}${suffix}`;
  }
  return orbitalId;
}

/**
 * 获取当前页面的基础路径
 * 处理 GitHub Pages 子路径情况（如 /Lorbital/）
 * 
 * @returns {string} 基础路径，例如 ""（根路径）或 "/Lorbital"（子路径）
 */
function getBasePath() {
  const pathname = window.location.pathname;
  
  // 如果路径是根路径或 index.html，返回空字符串（表示根路径）
  if (pathname === '/' || pathname === '/index.html') {
    return '';
  }
  
  // 提取基础路径
  // 例如：从 /Lorbital/explorer.html 或 /Lorbital/explorer.html 提取 /Lorbital
  // 从 /Lorbital/index.html 提取 /Lorbital
  const pathParts = pathname.split('/').filter(p => p && !p.includes('.html'));
  
  // 如果第一个部分是仓库名（通常是字母数字组合），返回它作为基础路径
  if (pathParts.length > 0) {
    return `/${pathParts[0]}`;
  }
  
  return '';
}

/**
 * 构建完整的 URL 路径
 * 自动检测并支持 GitHub Pages 子路径环境
 * 
 * @param {string} relativePath - 相对于 models/model++/ 的路径
 * @returns {string} 完整的 URL
 */
function buildModelUrl(relativePath) {
  const basePath = getBasePath();
  // 构建相对于基础路径的完整路径
  // 例如：根路径 -> /models/model++/s/1s/1s.ply
  // 例如：子路径 -> /Lorbital/models/model++/s/1s/1s.ply
  const absolutePath = `${basePath}/models/model++/${relativePath}`;
  
  // 构建完整的 URL
  return `${window.location.origin}${absolutePath}`;
}

/**
 * 获取轨道的元数据 URL
 * 
 * @param {string} orbitalId - 轨道 ID
 * @returns {string} meta.json 文件 URL
 */
export function getMetadataUrl(orbitalId) {
  // 从 models/model++/{type}/{pathName}/meta.json 读取；pathName 与磁盘文件夹一致
  const orbitalType = getOrbitalType(orbitalId);
  const pathName = orbitalIdToPathName(orbitalId);
  const relativePath = `${orbitalType}/${pathName}/meta.json`;
  return buildModelUrl(relativePath);
}

/**
 * 获取轨道的 PLY 文件 URL
 * 
 * @param {string} orbitalId - 轨道 ID
 * @returns {string} PLY 文件 URL
 */
export function getPlyUrl(orbitalId) {
  // 从 models/model++/{type}/{pathName}/{pathName}.ply 读取；pathName 与磁盘文件夹/文件名一致
  const orbitalType = getOrbitalType(orbitalId);
  const pathName = orbitalIdToPathName(orbitalId);
  const relativePath = `${orbitalType}/${pathName}/${pathName}.ply`;
  return buildModelUrl(relativePath);
}

/**
 * 加载轨道的元数据
 * 如果meta.json不存在，返回默认值
 * 
 * @param {string} orbitalId - 轨道 ID
 * @returns {Promise<Object>} 元数据对象
 */
export async function loadMetadata(orbitalId) {
  const url = getMetadataUrl(orbitalId);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      // 如果文件不存在（404），静默返回默认值
      // meta.json 是可选的，404 是预期行为，不需要警告
      return getDefaultMetadata(orbitalId);
    }
    return await response.json();
  } catch (error) {
    // 网络错误等其他异常，静默返回默认值
    // meta.json 是可选的，不需要输出警告
    return getDefaultMetadata(orbitalId);
  }
}

/**
 * 获取默认元数据
 * 
 * @param {string} orbitalId - 轨道 ID
 * @returns {Object} 默认元数据对象
 */
function getDefaultMetadata(orbitalId) {
  // 从轨道ID提取信息
  const nMatch = orbitalId.match(/^(\d+)/);
  const n = nMatch ? parseInt(nMatch[1]) : 1;
  
  // 确定轨道类型
  let l = 0;
  if (orbitalId.includes('p')) l = 1;
  else if (orbitalId.includes('d')) l = 2;
  else if (orbitalId.includes('f')) l = 3;
  else if (orbitalId.includes('g')) l = 4;
  
  // 确定轨道类型字符串
  const type = orbitalId.match(/[spdfg]/)?.[0] || 's';
  
  return {
    id: orbitalId,
    n: n,
    l: l,
    type: type,
    displayName: orbitalId,
    description: `${orbitalId}轨道`,
    pointCount: 500000,
    physicalDiameter: 0.529 * n * n,
    recommendedScale: 1.0,
    // 不设置默认颜色，使用PLY文件中的原始颜色
    opacity: 0.8
  };
}

/**
 * 验证轨道 ID 是否有效（在注册表中）
 * 
 * @param {string} orbitalId - 轨道 ID
 * @returns {boolean} 是否有效
 */
export function isValidOrbitalId(orbitalId) {
  return getAllOrbitalIds().includes(orbitalId);
}

/**
 * 检查轨道是否有实际模型文件
 * 
 * @param {string} orbitalId - 轨道 ID
 * @returns {boolean} 是否有实际模型
 */
export function hasOrbitalModel(orbitalId) {
  // 所有轨道都应该存在，因为model++中有所有文件
  // 如果orbitalId在注册表中，就认为存在
  return getAllOrbitalIds().includes(orbitalId);
}

/**
 * 获取轨道的实际模型ID（处理p轨道的映射）
 * 
 * @param {string} orbitalId - 轨道 ID
 * @returns {string|null} 实际模型 ID，如果不存在则返回null
 */
export function getActualModelId(orbitalId) {
  // 所有轨道都使用原始ID，因为model++中已经有所有文件
  // 不需要映射，直接返回原始ID
  return orbitalId;
}
