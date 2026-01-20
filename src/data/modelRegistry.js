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
export const EXISTING_ORBITALS = new Set([
  // S轨道
  '1s', '2s', '3s', '4s', '5s', '6s', '7s',
  // P轨道（当前只有pz）
  '2p', '3p', '4p', '5p', '6p', // 这些实际是pz方向
  // D轨道
  '3d_dz2', '3d_dx2-y2', '3d_dxy',
  '4d_dz2', '4d_dx2-y2', '4d_dxy',
  '5d_dz2', '5d_dx2-y2', '5d_dxy',
  '6d_dz2', '6d_dx2-y2', '6d_dxy',
  // F轨道
  '4f_fz3', '4f_fxz2', '4f_fxyz', '4f_fx(x2-3y2)', '4f_fy(x2-z2)',
  '5f_fz3', '5f_fxz2', '5f_fxyz', '5f_fx(x2-3y2)', '5f_fy(x2-z2)',
  // G轨道
  '5g_gz4', '5g_gxz3', '5g_gyz3', '5g_gz2x2-y2', '5g_gxyz2',
  '5g_gxzx2-3y2', '5g_gyzy2-3x2', '5g_gx4+y4', '5g_gxyx2-y2'
]);

export const MODEL_REGISTRY = {
  's': [
    '1s', '2s', '3s', '4s', '5s', '6s', '7s'
  ],
  'p': [
    // 2p层：px, py, pz
    '2px', '2py', '2pz',
    // 3p层：px, py, pz
    '3px', '3py', '3pz',
    // 4p层：px, py, pz
    '4px', '4py', '4pz',
    // 5p层：px, py, pz
    '5px', '5py', '5pz',
    // 6p层：px, py, pz
    '6px', '6py', '6pz'
  ],
  'd': [
    // 3d层：dxz, dyz, dz2, dx2-y2, dxy
    '3d_dxz', '3d_dyz', '3d_dz2', '3d_dx2-y2', '3d_dxy',
    // 4d层：dxz, dyz, dz2, dx2-y2, dxy
    '4d_dxz', '4d_dyz', '4d_dz2', '4d_dx2-y2', '4d_dxy',
    // 5d层：dxz, dyz, dz2, dx2-y2, dxy
    '5d_dxz', '5d_dyz', '5d_dz2', '5d_dx2-y2', '5d_dxy',
    // 6d层：dxz, dyz, dz2, dx2-y2, dxy
    '6d_dxz', '6d_dyz', '6d_dz2', '6d_dx2-y2', '6d_dxy'
  ],
  'f': [
    // 4f层：7种变体
    '4f_fz3', '4f_fxz2', '4f_fyz2', '4f_fxyz', '4f_fx(x2-3y2)', '4f_fy(x2-z2)', '4f_fzx2-y2',
    // 5f层：7种变体
    '5f_fz3', '5f_fxz2', '5f_fyz2', '5f_fxyz', '5f_fx(x2-3y2)', '5f_fy(x2-z2)', '5f_fzx2-y2'
  ],
  'g': [
    '5g_gz4', '5g_gxz3', '5g_gyz3', '5g_gz2x2-y2', '5g_gxyz2',
    '5g_gxzx2-3y2', '5g_gyzy2-3x2', '5g_gx4+y4', '5g_gxyx2-y2'
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
    if (type === 'p') return /^\d+p$/.test(id);
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
export function getOrbitalType(orbitalId) {
  if (orbitalId.startsWith('1s') || orbitalId.match(/^\d+s$/)) return 's';
  if (orbitalId.match(/^\d+p[xyz]?$/)) return 'p';
  if (orbitalId.match(/^\d+d_/)) return 'd';
  if (orbitalId.match(/^\d+f_/)) return 'f';
  if (orbitalId.match(/^\d+g_/)) return 'g';
  return 's'; // 默认
}

/**
 * 构建完整的 URL 路径
 * 使用绝对路径（相对于网站根目录），避免相对路径解析问题
 */
function buildModelUrl(relativePath) {
  // 确保路径以 / 开头，这是相对于网站根目录的绝对路径
  // 例如：/models/model++/s/1s/1s.ply
  const absolutePath = `/models/model++/${relativePath}`;
  
  // 直接构建完整的 URL，使用 origin 确保路径正确
  return `${window.location.origin}${absolutePath}`;
}

/**
 * 获取轨道的元数据 URL
 * 
 * @param {string} orbitalId - 轨道 ID
 * @returns {string} meta.json 文件 URL
 */
export function getMetadataUrl(orbitalId) {
  // 从 models/model++/{type}/{orbitalId}/meta.json 读取
  const orbitalType = getOrbitalType(orbitalId);
  const relativePath = `${orbitalType}/${orbitalId}/meta.json`;
  return buildModelUrl(relativePath);
}

/**
 * 获取轨道的 PLY 文件 URL
 * 
 * @param {string} orbitalId - 轨道 ID
 * @returns {string} PLY 文件 URL
 */
export function getPlyUrl(orbitalId) {
  // 从 models/model++/{type}/{orbitalId}/{orbitalId}.ply 读取
  const orbitalType = getOrbitalType(orbitalId);
  const relativePath = `${orbitalType}/${orbitalId}/${orbitalId}.ply`;
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
      // 如果文件不存在，返回默认值
      return getDefaultMetadata(orbitalId);
    }
    return await response.json();
  } catch (error) {
    // 如果加载失败，返回默认值
    console.warn(`Metadata not found for ${orbitalId}, using defaults`);
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
