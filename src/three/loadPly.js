/**
 * PLY 文件加载器
 * 
 * @module three/loadPly
 */

import { PLYLoader as ThreePLYLoader } from 'three/addons/loaders/PLYLoader.js';

const loader = new ThreePLYLoader();

/**
 * 加载 PLY 点云文件
 * 
 * @param {string} url - PLY 文件 URL
 * @returns {Promise<THREE.BufferGeometry>} 几何体对象（已居中）
 */
export async function loadPly(url) {
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (geometry) => {
        geometry.center();  // 几何体居中
        resolve(geometry);
      },
      undefined,
      (error) => {
        console.error(`Failed to load PLY from ${url}:`, error);
        reject(new Error(`PLY loading failed: ${url}`));
      }
    );
  });
}
