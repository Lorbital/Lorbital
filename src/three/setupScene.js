/**
 * Three.js 场景初始化
 * 
 * @module three/setupScene
 */

import * as THREE from 'three';
import { CAMERA_CONFIG } from '../utils/constants.js';

/**
 * 创建 Three.js 场景、相机和渲染器
 * 
 * @param {HTMLElement} container - 渲染容器 DOM 元素
 * @returns {Object} { scene, camera, renderer }
 */
export function setupScene(container) {
  // 创建场景
  const scene = new THREE.Scene();

  // 创建相机
  const camera = new THREE.PerspectiveCamera(
    CAMERA_CONFIG.fov,
    window.innerWidth / window.innerHeight,
    CAMERA_CONFIG.near,
    CAMERA_CONFIG.far
  );
  camera.position.z = CAMERA_CONFIG.initialZ;

  // 创建渲染器
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  container.appendChild(renderer.domElement);

  // 创建坐标轴辅助线
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  return { scene, camera, renderer, axesHelper };
}

/**
 * 处理窗口大小变化
 * 
 * @param {THREE.PerspectiveCamera} camera - 相机对象
 * @param {THREE.WebGLRenderer} renderer - 渲染器对象
 */
export function handleResize(camera, renderer) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
