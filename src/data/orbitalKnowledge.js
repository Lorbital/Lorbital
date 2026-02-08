/**
 * 轨道知识数据 (bilingual: zh / en)
 * 
 * 包含每个轨道的基本信息和形状特征
 * String fields that need translation use { zh, en } objects.
 * 
 * @module data/orbitalKnowledge
 */

export const ORBITAL_KNOWLEDGE = {
  // S轨道
  '1s': {
    title: { zh: '1s轨道', en: '1s Orbital' },
    basicInfo: {
      quantumNumbers: { n: 1, l: 0, m: 0 },
      description: { zh: '基态氢原子轨道，具有最小能量', en: 'Ground-state hydrogen orbital with the lowest energy' },
      orbitalType: { zh: 's轨道（球对称轨道）', en: 's orbital (spherically symmetric)' }
    },
    shapeFeatures: {
      shape: { zh: '球对称，无方向性', en: 'Spherically symmetric, non-directional' },
      symmetry: { zh: '完全球对称', en: 'Full spherical symmetry' },
      nodes: { zh: '径向节点数：0', en: 'Radial nodes: 0' }
    }
  },
  '2s': {
    title: { zh: '2s轨道', en: '2s Orbital' },
    basicInfo: {
      quantumNumbers: { n: 2, l: 0, m: 0 },
      description: { zh: '第二主壳层s轨道', en: '2nd shell s orbital' },
      orbitalType: { zh: 's轨道（球对称轨道）', en: 's orbital (spherically symmetric)' }
    },
    shapeFeatures: {
      shape: { zh: '球对称，带有一个径向节点', en: 'Spherically symmetric with one radial node' },
      symmetry: { zh: '完全球对称', en: 'Full spherical symmetry' },
      nodes: { zh: '径向节点数：1', en: 'Radial nodes: 1' }
    }
  },
  '3s': {
    title: { zh: '3s轨道', en: '3s Orbital' },
    basicInfo: {
      quantumNumbers: { n: 3, l: 0, m: 0 },
      description: { zh: '第三主壳层s轨道', en: '3rd shell s orbital' },
      orbitalType: { zh: 's轨道（球对称轨道）', en: 's orbital (spherically symmetric)' }
    },
    shapeFeatures: {
      shape: { zh: '球对称，带有两个径向节点', en: 'Spherically symmetric with two radial nodes' },
      symmetry: { zh: '完全球对称', en: 'Full spherical symmetry' },
      nodes: { zh: '径向节点数：2', en: 'Radial nodes: 2' }
    }
  },
  '4s': {
    title: { zh: '4s轨道', en: '4s Orbital' },
    basicInfo: {
      quantumNumbers: { n: 4, l: 0, m: 0 },
      description: { zh: '第四主壳层s轨道', en: '4th shell s orbital' },
      orbitalType: { zh: 's轨道（球对称轨道）', en: 's orbital (spherically symmetric)' }
    },
    shapeFeatures: {
      shape: { zh: '球对称，带有三个径向节点', en: 'Spherically symmetric with three radial nodes' },
      symmetry: { zh: '完全球对称', en: 'Full spherical symmetry' },
      nodes: { zh: '径向节点数：3', en: 'Radial nodes: 3' }
    }
  },
  '5s': {
    title: { zh: '5s轨道', en: '5s Orbital' },
    basicInfo: {
      quantumNumbers: { n: 5, l: 0, m: 0 },
      description: { zh: '第五主壳层s轨道', en: '5th shell s orbital' },
      orbitalType: { zh: 's轨道（球对称轨道）', en: 's orbital (spherically symmetric)' }
    },
    shapeFeatures: {
      shape: { zh: '球对称，带有四个径向节点', en: 'Spherically symmetric with four radial nodes' },
      symmetry: { zh: '完全球对称', en: 'Full spherical symmetry' },
      nodes: { zh: '径向节点数：4', en: 'Radial nodes: 4' }
    }
  },
  '6s': {
    title: { zh: '6s轨道', en: '6s Orbital' },
    basicInfo: {
      quantumNumbers: { n: 6, l: 0, m: 0 },
      description: { zh: '第六主壳层s轨道', en: '6th shell s orbital' },
      orbitalType: { zh: 's轨道（球对称轨道）', en: 's orbital (spherically symmetric)' }
    },
    shapeFeatures: {
      shape: { zh: '球对称，带有五个径向节点', en: 'Spherically symmetric with five radial nodes' },
      symmetry: { zh: '完全球对称', en: 'Full spherical symmetry' },
      nodes: { zh: '径向节点数：5', en: 'Radial nodes: 5' }
    }
  },
  '7s': {
    title: { zh: '7s轨道', en: '7s Orbital' },
    basicInfo: {
      quantumNumbers: { n: 7, l: 0, m: 0 },
      description: { zh: '第七主壳层s轨道', en: '7th shell s orbital' },
      orbitalType: { zh: 's轨道（球对称轨道）', en: 's orbital (spherically symmetric)' }
    },
    shapeFeatures: {
      shape: { zh: '球对称，带有六个径向节点', en: 'Spherically symmetric with six radial nodes' },
      symmetry: { zh: '完全球对称', en: 'Full spherical symmetry' },
      nodes: { zh: '径向节点数：6', en: 'Radial nodes: 6' }
    }
  },
  
  // P轨道 — helper to reduce repetition
  '2px': { title: { zh: '2p<sub>x</sub>轨道', en: '2p<sub>x</sub> Orbital' }, basicInfo: { quantumNumbers: { n: 2, l: 1, m: 1 }, description: { zh: '第二主壳层p轨道，沿x轴方向', en: '2nd shell p orbital, along x-axis' }, orbitalType: { zh: 'p轨道（哑铃形轨道）', en: 'p orbital (dumbbell-shaped)' } }, shapeFeatures: { shape: { zh: '哑铃形，沿x轴延伸', en: 'Dumbbell-shaped, along x-axis' }, symmetry: { zh: '关于yz平面对称', en: 'Symmetric about the yz-plane' }, nodes: { zh: '径向节点数：0，角节点数：1（通过原点）', en: 'Radial nodes: 0, angular nodes: 1 (through origin)' } } },
  '2py': { title: { zh: '2p<sub>y</sub>轨道', en: '2p<sub>y</sub> Orbital' }, basicInfo: { quantumNumbers: { n: 2, l: 1, m: -1 }, description: { zh: '第二主壳层p轨道，沿y轴方向', en: '2nd shell p orbital, along y-axis' }, orbitalType: { zh: 'p轨道（哑铃形轨道）', en: 'p orbital (dumbbell-shaped)' } }, shapeFeatures: { shape: { zh: '哑铃形，沿y轴延伸', en: 'Dumbbell-shaped, along y-axis' }, symmetry: { zh: '关于xz平面对称', en: 'Symmetric about the xz-plane' }, nodes: { zh: '径向节点数：0，角节点数：1（通过原点）', en: 'Radial nodes: 0, angular nodes: 1 (through origin)' } } },
  '2pz': { title: { zh: '2p<sub>z</sub>轨道', en: '2p<sub>z</sub> Orbital' }, basicInfo: { quantumNumbers: { n: 2, l: 1, m: 0 }, description: { zh: '第二主壳层p轨道，沿z轴方向', en: '2nd shell p orbital, along z-axis' }, orbitalType: { zh: 'p轨道（哑铃形轨道）', en: 'p orbital (dumbbell-shaped)' } }, shapeFeatures: { shape: { zh: '哑铃形，沿z轴延伸', en: 'Dumbbell-shaped, along z-axis' }, symmetry: { zh: '关于xy平面对称', en: 'Symmetric about the xy-plane' }, nodes: { zh: '径向节点数：0，角节点数：1（通过原点）', en: 'Radial nodes: 0, angular nodes: 1 (through origin)' } } },
  '3px': { title: { zh: '3px轨道', en: '3px Orbital' }, basicInfo: { quantumNumbers: { n: 3, l: 1, m: 1 }, description: { zh: '第三主壳层p轨道，沿x轴方向', en: '3rd shell p orbital, along x-axis' }, orbitalType: { zh: 'p轨道（哑铃形轨道）', en: 'p orbital (dumbbell-shaped)' } }, shapeFeatures: { shape: { zh: '哑铃形，沿x轴延伸，带有一个径向节点', en: 'Dumbbell-shaped along x-axis with one radial node' }, symmetry: { zh: '关于yz平面对称', en: 'Symmetric about the yz-plane' }, nodes: { zh: '径向节点数：1，角节点数：1', en: 'Radial nodes: 1, angular nodes: 1' } } },
  '3py': { title: { zh: '3py轨道', en: '3py Orbital' }, basicInfo: { quantumNumbers: { n: 3, l: 1, m: -1 }, description: { zh: '第三主壳层p轨道，沿y轴方向', en: '3rd shell p orbital, along y-axis' }, orbitalType: { zh: 'p轨道（哑铃形轨道）', en: 'p orbital (dumbbell-shaped)' } }, shapeFeatures: { shape: { zh: '哑铃形，沿y轴延伸，带有一个径向节点', en: 'Dumbbell-shaped along y-axis with one radial node' }, symmetry: { zh: '关于xz平面对称', en: 'Symmetric about the xz-plane' }, nodes: { zh: '径向节点数：1，角节点数：1', en: 'Radial nodes: 1, angular nodes: 1' } } },
  '3pz': { title: { zh: '3pz轨道', en: '3pz Orbital' }, basicInfo: { quantumNumbers: { n: 3, l: 1, m: 0 }, description: { zh: '第三主壳层p轨道，沿z轴方向', en: '3rd shell p orbital, along z-axis' }, orbitalType: { zh: 'p轨道（哑铃形轨道）', en: 'p orbital (dumbbell-shaped)' } }, shapeFeatures: { shape: { zh: '哑铃形，沿z轴延伸，带有一个径向节点', en: 'Dumbbell-shaped along z-axis with one radial node' }, symmetry: { zh: '关于xy平面对称', en: 'Symmetric about the xy-plane' }, nodes: { zh: '径向节点数：1，角节点数：1', en: 'Radial nodes: 1, angular nodes: 1' } } },
  '4px': { title: { zh: '4px轨道', en: '4px Orbital' }, basicInfo: { quantumNumbers: { n: 4, l: 1, m: 1 }, description: { zh: '第四主壳层p轨道，沿x轴方向', en: '4th shell p orbital, along x-axis' }, orbitalType: { zh: 'p轨道（哑铃形轨道）', en: 'p orbital (dumbbell-shaped)' } }, shapeFeatures: { shape: { zh: '哑铃形，沿x轴延伸，带有两个径向节点', en: 'Dumbbell-shaped along x-axis with two radial nodes' }, symmetry: { zh: '关于yz平面对称', en: 'Symmetric about the yz-plane' }, nodes: { zh: '径向节点数：2，角节点数：1', en: 'Radial nodes: 2, angular nodes: 1' } } },
  '4py': { title: { zh: '4py轨道', en: '4py Orbital' }, basicInfo: { quantumNumbers: { n: 4, l: 1, m: -1 }, description: { zh: '第四主壳层p轨道，沿y轴方向', en: '4th shell p orbital, along y-axis' }, orbitalType: { zh: 'p轨道（哑铃形轨道）', en: 'p orbital (dumbbell-shaped)' } }, shapeFeatures: { shape: { zh: '哑铃形，沿y轴延伸，带有两个径向节点', en: 'Dumbbell-shaped along y-axis with two radial nodes' }, symmetry: { zh: '关于xz平面对称', en: 'Symmetric about the xz-plane' }, nodes: { zh: '径向节点数：2，角节点数：1', en: 'Radial nodes: 2, angular nodes: 1' } } },
  '4pz': { title: { zh: '4pz轨道', en: '4pz Orbital' }, basicInfo: { quantumNumbers: { n: 4, l: 1, m: 0 }, description: { zh: '第四主壳层p轨道，沿z轴方向', en: '4th shell p orbital, along z-axis' }, orbitalType: { zh: 'p轨道（哑铃形轨道）', en: 'p orbital (dumbbell-shaped)' } }, shapeFeatures: { shape: { zh: '哑铃形，沿z轴延伸，带有两个径向节点', en: 'Dumbbell-shaped along z-axis with two radial nodes' }, symmetry: { zh: '关于xy平面对称', en: 'Symmetric about the xy-plane' }, nodes: { zh: '径向节点数：2，角节点数：1', en: 'Radial nodes: 2, angular nodes: 1' } } },
  '5px': { title: { zh: '5px轨道', en: '5px Orbital' }, basicInfo: { quantumNumbers: { n: 5, l: 1, m: 1 }, description: { zh: '第五主壳层p轨道，沿x轴方向', en: '5th shell p orbital, along x-axis' }, orbitalType: { zh: 'p轨道（哑铃形轨道）', en: 'p orbital (dumbbell-shaped)' } }, shapeFeatures: { shape: { zh: '哑铃形，沿x轴延伸，带有三个径向节点', en: 'Dumbbell-shaped along x-axis with three radial nodes' }, symmetry: { zh: '关于yz平面对称', en: 'Symmetric about the yz-plane' }, nodes: { zh: '径向节点数：3，角节点数：1', en: 'Radial nodes: 3, angular nodes: 1' } } },
  '5py': { title: { zh: '5py轨道', en: '5py Orbital' }, basicInfo: { quantumNumbers: { n: 5, l: 1, m: -1 }, description: { zh: '第五主壳层p轨道，沿y轴方向', en: '5th shell p orbital, along y-axis' }, orbitalType: { zh: 'p轨道（哑铃形轨道）', en: 'p orbital (dumbbell-shaped)' } }, shapeFeatures: { shape: { zh: '哑铃形，沿y轴延伸，带有三个径向节点', en: 'Dumbbell-shaped along y-axis with three radial nodes' }, symmetry: { zh: '关于xz平面对称', en: 'Symmetric about the xz-plane' }, nodes: { zh: '径向节点数：3，角节点数：1', en: 'Radial nodes: 3, angular nodes: 1' } } },
  '5pz': { title: { zh: '5pz轨道', en: '5pz Orbital' }, basicInfo: { quantumNumbers: { n: 5, l: 1, m: 0 }, description: { zh: '第五主壳层p轨道，沿z轴方向', en: '5th shell p orbital, along z-axis' }, orbitalType: { zh: 'p轨道（哑铃形轨道）', en: 'p orbital (dumbbell-shaped)' } }, shapeFeatures: { shape: { zh: '哑铃形，沿z轴延伸，带有三个径向节点', en: 'Dumbbell-shaped along z-axis with three radial nodes' }, symmetry: { zh: '关于xy平面对称', en: 'Symmetric about the xy-plane' }, nodes: { zh: '径向节点数：3，角节点数：1', en: 'Radial nodes: 3, angular nodes: 1' } } },
  '6px': { title: { zh: '6px轨道', en: '6px Orbital' }, basicInfo: { quantumNumbers: { n: 6, l: 1, m: 1 }, description: { zh: '第六主壳层p轨道，沿x轴方向', en: '6th shell p orbital, along x-axis' }, orbitalType: { zh: 'p轨道（哑铃形轨道）', en: 'p orbital (dumbbell-shaped)' } }, shapeFeatures: { shape: { zh: '哑铃形，沿x轴延伸，带有四个径向节点', en: 'Dumbbell-shaped along x-axis with four radial nodes' }, symmetry: { zh: '关于yz平面对称', en: 'Symmetric about the yz-plane' }, nodes: { zh: '径向节点数：4，角节点数：1', en: 'Radial nodes: 4, angular nodes: 1' } } },
  '6py': { title: { zh: '6py轨道', en: '6py Orbital' }, basicInfo: { quantumNumbers: { n: 6, l: 1, m: -1 }, description: { zh: '第六主壳层p轨道，沿y轴方向', en: '6th shell p orbital, along y-axis' }, orbitalType: { zh: 'p轨道（哑铃形轨道）', en: 'p orbital (dumbbell-shaped)' } }, shapeFeatures: { shape: { zh: '哑铃形，沿y轴延伸，带有四个径向节点', en: 'Dumbbell-shaped along y-axis with four radial nodes' }, symmetry: { zh: '关于xz平面对称', en: 'Symmetric about the xz-plane' }, nodes: { zh: '径向节点数：4，角节点数：1', en: 'Radial nodes: 4, angular nodes: 1' } } },
  '6pz': { title: { zh: '6pz轨道', en: '6pz Orbital' }, basicInfo: { quantumNumbers: { n: 6, l: 1, m: 0 }, description: { zh: '第六主壳层p轨道，沿z轴方向', en: '6th shell p orbital, along z-axis' }, orbitalType: { zh: 'p轨道（哑铃形轨道）', en: 'p orbital (dumbbell-shaped)' } }, shapeFeatures: { shape: { zh: '哑铃形，沿z轴延伸，带有四个径向节点', en: 'Dumbbell-shaped along z-axis with four radial nodes' }, symmetry: { zh: '关于xy平面对称', en: 'Symmetric about the xy-plane' }, nodes: { zh: '径向节点数：4，角节点数：1', en: 'Radial nodes: 4, angular nodes: 1' } } },
  
  // D轨道
  '3d_xz': { title: { zh: '3d<sub>xz</sub>轨道', en: '3d<sub>xz</sub> Orbital' }, basicInfo: { quantumNumbers: { n: 3, l: 2, m: 1 }, description: { zh: '第三主壳层d轨道，xz平面对称', en: '3rd shell d orbital, xz-plane symmetric' }, orbitalType: { zh: 'd轨道（瓣状分布轨道）', en: 'd orbital (clover-shaped)' } }, shapeFeatures: { shape: { zh: '四个瓣，位于xz平面，关于y轴对称', en: 'Four lobes in the xz-plane, symmetric about the y-axis' }, symmetry: { zh: '关于y轴对称', en: 'Symmetric about the y-axis' }, nodes: { zh: '径向节点数：0，角节点数：2', en: 'Radial nodes: 0, angular nodes: 2' } } },
  '3d_yz': { title: { zh: '3d<sub>yz</sub>轨道', en: '3d<sub>yz</sub> Orbital' }, basicInfo: { quantumNumbers: { n: 3, l: 2, m: -1 }, description: { zh: '第三主壳层d轨道，yz平面对称', en: '3rd shell d orbital, yz-plane symmetric' }, orbitalType: { zh: 'd轨道（瓣状分布轨道）', en: 'd orbital (clover-shaped)' } }, shapeFeatures: { shape: { zh: '四个瓣，位于yz平面，关于x轴对称', en: 'Four lobes in the yz-plane, symmetric about the x-axis' }, symmetry: { zh: '关于x轴对称', en: 'Symmetric about the x-axis' }, nodes: { zh: '径向节点数：0，角节点数：2', en: 'Radial nodes: 0, angular nodes: 2' } } },
  '3d_z2': { title: { zh: '3d<sub>z²</sub>轨道', en: '3d<sub>z²</sub> Orbital' }, basicInfo: { quantumNumbers: { n: 3, l: 2, m: 0 }, description: { zh: '第三主壳层d轨道，沿z轴对称', en: '3rd shell d orbital, z-axis symmetric' }, orbitalType: { zh: 'd轨道（瓣状分布轨道）', en: 'd orbital (clover-shaped)' } }, shapeFeatures: { shape: { zh: '双瓣形，沿z轴延伸，带有环形瓣', en: 'Two lobes along z-axis with a toroidal ring' }, symmetry: { zh: '关于z轴对称', en: 'Symmetric about the z-axis' }, nodes: { zh: '径向节点数：0，角节点数：2', en: 'Radial nodes: 0, angular nodes: 2' } } },
  '3d_x2-y2': { title: { zh: '3d<sub>x²-y²</sub>轨道', en: '3d<sub>x²-y²</sub> Orbital' }, basicInfo: { quantumNumbers: { n: 3, l: 2, m: 2 }, description: { zh: '第三主壳层d轨道，沿x和y轴对称', en: '3rd shell d orbital, x- and y-axis symmetric' }, orbitalType: { zh: 'd轨道（瓣状分布轨道）', en: 'd orbital (clover-shaped)' } }, shapeFeatures: { shape: { zh: '四个瓣，位于xy平面，沿x和y轴方向', en: 'Four lobes in the xy-plane along x and y axes' }, symmetry: { zh: '关于x、y轴对称', en: 'Symmetric about x and y axes' }, nodes: { zh: '径向节点数：0，角节点数：2', en: 'Radial nodes: 0, angular nodes: 2' } } },
  '3d_xy': { title: { zh: '3d<sub>xy</sub>轨道', en: '3d<sub>xy</sub> Orbital' }, basicInfo: { quantumNumbers: { n: 3, l: 2, m: -2 }, description: { zh: '第三主壳层d轨道，xy平面对称', en: '3rd shell d orbital, xy-plane symmetric' }, orbitalType: { zh: 'd轨道（瓣状分布轨道）', en: 'd orbital (clover-shaped)' } }, shapeFeatures: { shape: { zh: '四个瓣，位于xy平面，在x和y轴之间', en: 'Four lobes in the xy-plane between x and y axes' }, symmetry: { zh: '关于x、y轴对称', en: 'Symmetric about x and y axes' }, nodes: { zh: '径向节点数：0，角节点数：2', en: 'Radial nodes: 0, angular nodes: 2' } } },
  
  // 4d
  '4d_xz': { title: { zh: '4d<sub>xz</sub>轨道', en: '4d<sub>xz</sub> Orbital' }, basicInfo: { quantumNumbers: { n: 4, l: 2, m: 1 }, description: { zh: '第四主壳层d轨道，xz平面对称', en: '4th shell d orbital, xz-plane symmetric' }, orbitalType: { zh: 'd轨道（瓣状分布轨道）', en: 'd orbital (clover-shaped)' } }, shapeFeatures: { shape: { zh: '四个瓣，位于xz平面，带有一个径向节点', en: 'Four lobes in xz-plane with one radial node' }, symmetry: { zh: '关于y轴对称', en: 'Symmetric about the y-axis' }, nodes: { zh: '径向节点数：1，角节点数：2', en: 'Radial nodes: 1, angular nodes: 2' } } },
  '4d_yz': { title: { zh: '4d<sub>yz</sub>轨道', en: '4d<sub>yz</sub> Orbital' }, basicInfo: { quantumNumbers: { n: 4, l: 2, m: -1 }, description: { zh: '第四主壳层d轨道，yz平面对称', en: '4th shell d orbital, yz-plane symmetric' }, orbitalType: { zh: 'd轨道（瓣状分布轨道）', en: 'd orbital (clover-shaped)' } }, shapeFeatures: { shape: { zh: '四个瓣，位于yz平面，带有一个径向节点', en: 'Four lobes in yz-plane with one radial node' }, symmetry: { zh: '关于x轴对称', en: 'Symmetric about the x-axis' }, nodes: { zh: '径向节点数：1，角节点数：2', en: 'Radial nodes: 1, angular nodes: 2' } } },
  '4d_z2': { title: { zh: '4d<sub>z²</sub>轨道', en: '4d<sub>z²</sub> Orbital' }, basicInfo: { quantumNumbers: { n: 4, l: 2, m: 0 }, description: { zh: '第四主壳层d轨道，沿z轴对称', en: '4th shell d orbital, z-axis symmetric' }, orbitalType: { zh: 'd轨道（瓣状分布轨道）', en: 'd orbital (clover-shaped)' } }, shapeFeatures: { shape: { zh: '双瓣形，沿z轴延伸，带有一个径向节点', en: 'Two lobes along z-axis with one radial node' }, symmetry: { zh: '关于z轴对称', en: 'Symmetric about the z-axis' }, nodes: { zh: '径向节点数：1，角节点数：2', en: 'Radial nodes: 1, angular nodes: 2' } } },
  '4d_x2-y2': { title: { zh: '4d<sub>x²-y²</sub>轨道', en: '4d<sub>x²-y²</sub> Orbital' }, basicInfo: { quantumNumbers: { n: 4, l: 2, m: 2 }, description: { zh: '第四主壳层d轨道，沿x和y轴对称', en: '4th shell d orbital, x- and y-axis symmetric' }, orbitalType: { zh: 'd轨道（瓣状分布轨道）', en: 'd orbital (clover-shaped)' } }, shapeFeatures: { shape: { zh: '四个瓣，位于xy平面，带有一个径向节点', en: 'Four lobes in xy-plane with one radial node' }, symmetry: { zh: '关于x、y轴对称', en: 'Symmetric about x and y axes' }, nodes: { zh: '径向节点数：1，角节点数：2', en: 'Radial nodes: 1, angular nodes: 2' } } },
  '4d_xy': { title: { zh: '4d<sub>xy</sub>轨道', en: '4d<sub>xy</sub> Orbital' }, basicInfo: { quantumNumbers: { n: 4, l: 2, m: -2 }, description: { zh: '第四主壳层d轨道，xy平面对称', en: '4th shell d orbital, xy-plane symmetric' }, orbitalType: { zh: 'd轨道（瓣状分布轨道）', en: 'd orbital (clover-shaped)' } }, shapeFeatures: { shape: { zh: '四个瓣，位于xy平面，带有一个径向节点', en: 'Four lobes in xy-plane with one radial node' }, symmetry: { zh: '关于x、y轴对称', en: 'Symmetric about x and y axes' }, nodes: { zh: '径向节点数：1，角节点数：2', en: 'Radial nodes: 1, angular nodes: 2' } } },
  
  // 5d
  '5d_xz': { title: { zh: '5d<sub>xz</sub>轨道', en: '5d<sub>xz</sub> Orbital' }, basicInfo: { quantumNumbers: { n: 5, l: 2, m: 1 }, description: { zh: '第五主壳层d轨道，xz平面对称', en: '5th shell d orbital, xz-plane symmetric' }, orbitalType: { zh: 'd轨道（瓣状分布轨道）', en: 'd orbital (clover-shaped)' } }, shapeFeatures: { shape: { zh: '四个瓣，位于xz平面，带有两个径向节点', en: 'Four lobes in xz-plane with two radial nodes' }, symmetry: { zh: '关于y轴对称', en: 'Symmetric about the y-axis' }, nodes: { zh: '径向节点数：2，角节点数：2', en: 'Radial nodes: 2, angular nodes: 2' } } },
  '5d_yz': { title: { zh: '5d<sub>yz</sub>轨道', en: '5d<sub>yz</sub> Orbital' }, basicInfo: { quantumNumbers: { n: 5, l: 2, m: -1 }, description: { zh: '第五主壳层d轨道，yz平面对称', en: '5th shell d orbital, yz-plane symmetric' }, orbitalType: { zh: 'd轨道（瓣状分布轨道）', en: 'd orbital (clover-shaped)' } }, shapeFeatures: { shape: { zh: '四个瓣，位于yz平面，带有两个径向节点', en: 'Four lobes in yz-plane with two radial nodes' }, symmetry: { zh: '关于x轴对称', en: 'Symmetric about the x-axis' }, nodes: { zh: '径向节点数：2，角节点数：2', en: 'Radial nodes: 2, angular nodes: 2' } } },
  '5d_z2': { title: { zh: '5d<sub>z²</sub>轨道', en: '5d<sub>z²</sub> Orbital' }, basicInfo: { quantumNumbers: { n: 5, l: 2, m: 0 }, description: { zh: '第五主壳层d轨道，沿z轴对称', en: '5th shell d orbital, z-axis symmetric' }, orbitalType: { zh: 'd轨道（瓣状分布轨道）', en: 'd orbital (clover-shaped)' } }, shapeFeatures: { shape: { zh: '双瓣形，沿z轴延伸，带有两个径向节点', en: 'Two lobes along z-axis with two radial nodes' }, symmetry: { zh: '关于z轴对称', en: 'Symmetric about the z-axis' }, nodes: { zh: '径向节点数：2，角节点数：2', en: 'Radial nodes: 2, angular nodes: 2' } } },
  '5d_x2-y2': { title: { zh: '5d<sub>x²-y²</sub>轨道', en: '5d<sub>x²-y²</sub> Orbital' }, basicInfo: { quantumNumbers: { n: 5, l: 2, m: 2 }, description: { zh: '第五主壳层d轨道，沿x和y轴对称', en: '5th shell d orbital, x- and y-axis symmetric' }, orbitalType: { zh: 'd轨道（瓣状分布轨道）', en: 'd orbital (clover-shaped)' } }, shapeFeatures: { shape: { zh: '四个瓣，位于xy平面，带有两个径向节点', en: 'Four lobes in xy-plane with two radial nodes' }, symmetry: { zh: '关于x、y轴对称', en: 'Symmetric about x and y axes' }, nodes: { zh: '径向节点数：2，角节点数：2', en: 'Radial nodes: 2, angular nodes: 2' } } },
  '5d_xy': { title: { zh: '5d<sub>xy</sub>轨道', en: '5d<sub>xy</sub> Orbital' }, basicInfo: { quantumNumbers: { n: 5, l: 2, m: -2 }, description: { zh: '第五主壳层d轨道，xy平面对称', en: '5th shell d orbital, xy-plane symmetric' }, orbitalType: { zh: 'd轨道（瓣状分布轨道）', en: 'd orbital (clover-shaped)' } }, shapeFeatures: { shape: { zh: '四个瓣，位于xy平面，带有两个径向节点', en: 'Four lobes in xy-plane with two radial nodes' }, symmetry: { zh: '关于x、y轴对称', en: 'Symmetric about x and y axes' }, nodes: { zh: '径向节点数：2，角节点数：2', en: 'Radial nodes: 2, angular nodes: 2' } } },
  
  // 6d
  '6d_xz': { title: { zh: '6d<sub>xz</sub>轨道', en: '6d<sub>xz</sub> Orbital' }, basicInfo: { quantumNumbers: { n: 6, l: 2, m: 1 }, description: { zh: '第六主壳层d轨道，xz平面对称', en: '6th shell d orbital, xz-plane symmetric' }, orbitalType: { zh: 'd轨道（瓣状分布轨道）', en: 'd orbital (clover-shaped)' } }, shapeFeatures: { shape: { zh: '四个瓣，位于xz平面，带有三个径向节点', en: 'Four lobes in xz-plane with three radial nodes' }, symmetry: { zh: '关于y轴对称', en: 'Symmetric about the y-axis' }, nodes: { zh: '径向节点数：3，角节点数：2', en: 'Radial nodes: 3, angular nodes: 2' } } },
  '6d_yz': { title: { zh: '6d<sub>yz</sub>轨道', en: '6d<sub>yz</sub> Orbital' }, basicInfo: { quantumNumbers: { n: 6, l: 2, m: -1 }, description: { zh: '第六主壳层d轨道，yz平面对称', en: '6th shell d orbital, yz-plane symmetric' }, orbitalType: { zh: 'd轨道（瓣状分布轨道）', en: 'd orbital (clover-shaped)' } }, shapeFeatures: { shape: { zh: '四个瓣，位于yz平面，带有三个径向节点', en: 'Four lobes in yz-plane with three radial nodes' }, symmetry: { zh: '关于x轴对称', en: 'Symmetric about the x-axis' }, nodes: { zh: '径向节点数：3，角节点数：2', en: 'Radial nodes: 3, angular nodes: 2' } } },
  '6d_z2': { title: { zh: '6d<sub>z²</sub>轨道', en: '6d<sub>z²</sub> Orbital' }, basicInfo: { quantumNumbers: { n: 6, l: 2, m: 0 }, description: { zh: '第六主壳层d轨道，沿z轴对称', en: '6th shell d orbital, z-axis symmetric' }, orbitalType: { zh: 'd轨道（瓣状分布轨道）', en: 'd orbital (clover-shaped)' } }, shapeFeatures: { shape: { zh: '双瓣形，沿z轴延伸，带有三个径向节点', en: 'Two lobes along z-axis with three radial nodes' }, symmetry: { zh: '关于z轴对称', en: 'Symmetric about the z-axis' }, nodes: { zh: '径向节点数：3，角节点数：2', en: 'Radial nodes: 3, angular nodes: 2' } } },
  '6d_x2-y2': { title: { zh: '6d<sub>x²-y²</sub>轨道', en: '6d<sub>x²-y²</sub> Orbital' }, basicInfo: { quantumNumbers: { n: 6, l: 2, m: 2 }, description: { zh: '第六主壳层d轨道，沿x和y轴对称', en: '6th shell d orbital, x- and y-axis symmetric' }, orbitalType: { zh: 'd轨道（瓣状分布轨道）', en: 'd orbital (clover-shaped)' } }, shapeFeatures: { shape: { zh: '四个瓣，位于xy平面，带有三个径向节点', en: 'Four lobes in xy-plane with three radial nodes' }, symmetry: { zh: '关于x、y轴对称', en: 'Symmetric about x and y axes' }, nodes: { zh: '径向节点数：3，角节点数：2', en: 'Radial nodes: 3, angular nodes: 2' } } },
  '6d_xy': { title: { zh: '6d<sub>xy</sub>轨道', en: '6d<sub>xy</sub> Orbital' }, basicInfo: { quantumNumbers: { n: 6, l: 2, m: -2 }, description: { zh: '第六主壳层d轨道，xy平面对称', en: '6th shell d orbital, xy-plane symmetric' }, orbitalType: { zh: 'd轨道（瓣状分布轨道）', en: 'd orbital (clover-shaped)' } }, shapeFeatures: { shape: { zh: '四个瓣，位于xy平面，带有三个径向节点', en: 'Four lobes in xy-plane with three radial nodes' }, symmetry: { zh: '关于x、y轴对称', en: 'Symmetric about x and y axes' }, nodes: { zh: '径向节点数：3，角节点数：2', en: 'Radial nodes: 3, angular nodes: 2' } } },
  
  // F轨道
  '4f_z3': { title: { zh: '4f<sub>z³</sub>轨道', en: '4f<sub>z³</sub> Orbital' }, basicInfo: { quantumNumbers: { n: 4, l: 3, m: 0 }, description: { zh: '第四主壳层f轨道，沿z轴高阶对称', en: '4th shell f orbital, higher-order z-axis symmetry' }, orbitalType: { zh: 'f轨道（高阶对称轨道）', en: 'f orbital (higher-order)' } }, shapeFeatures: { shape: { zh: '复杂的瓣状分布，沿z轴对称', en: 'Complex lobe distribution, z-axis symmetric' }, symmetry: { zh: '关于z轴对称', en: 'Symmetric about the z-axis' }, nodes: { zh: '径向节点数：0，角节点数：3', en: 'Radial nodes: 0, angular nodes: 3' } } },
  '4f_xz2': { title: { zh: '4f<sub>xz²</sub>轨道', en: '4f<sub>xz²</sub> Orbital' }, basicInfo: { quantumNumbers: { n: 4, l: 3, m: 1 }, description: { zh: '第四主壳层f轨道，xz平面对称', en: '4th shell f orbital, xz-plane symmetric' }, orbitalType: { zh: 'f轨道（高阶对称轨道）', en: 'f orbital (higher-order)' } }, shapeFeatures: { shape: { zh: '六个瓣，xz平面对称', en: 'Six lobes, xz-plane symmetric' }, symmetry: { zh: '关于y轴对称', en: 'Symmetric about the y-axis' }, nodes: { zh: '径向节点数：0，角节点数：3', en: 'Radial nodes: 0, angular nodes: 3' } } },
  '4f_yz2': { title: { zh: '4f<sub>yz²</sub>轨道', en: '4f<sub>yz²</sub> Orbital' }, basicInfo: { quantumNumbers: { n: 4, l: 3, m: -1 }, description: { zh: '第四主壳层f轨道，yz平面对称', en: '4th shell f orbital, yz-plane symmetric' }, orbitalType: { zh: 'f轨道（高阶对称轨道）', en: 'f orbital (higher-order)' } }, shapeFeatures: { shape: { zh: '六个瓣，yz平面对称', en: 'Six lobes, yz-plane symmetric' }, symmetry: { zh: '关于x轴对称', en: 'Symmetric about the x-axis' }, nodes: { zh: '径向节点数：0，角节点数：3', en: 'Radial nodes: 0, angular nodes: 3' } } },
  '4f_xyz': { title: { zh: '4f (fxyz)轨道', en: '4f (fxyz) Orbital' }, basicInfo: { quantumNumbers: { n: 4, l: 3, m: 2 }, description: { zh: '第四主壳层f轨道，xyz空间对称', en: '4th shell f orbital, xyz-space symmetric' }, orbitalType: { zh: 'f轨道（高阶对称轨道）', en: 'f orbital (higher-order)' } }, shapeFeatures: { shape: { zh: '八个瓣，空间对称分布', en: 'Eight lobes, spatially symmetric' }, symmetry: { zh: '关于三个坐标轴对称', en: 'Symmetric about all three axes' }, nodes: { zh: '径向节点数：0，角节点数：3', en: 'Radial nodes: 0, angular nodes: 3' } } },
  '4f_x(x2-3y2)': { title: { zh: '4f (fx(x²-3y²))轨道', en: '4f (fx(x²-3y²)) Orbital' }, basicInfo: { quantumNumbers: { n: 4, l: 3, m: 3 }, description: { zh: '第四主壳层f轨道，复杂对称形态', en: '4th shell f orbital, complex symmetry' }, orbitalType: { zh: 'f轨道（高阶对称轨道）', en: 'f orbital (higher-order)' } }, shapeFeatures: { shape: { zh: '八个瓣，复杂对称分布', en: 'Eight lobes, complex symmetric distribution' }, symmetry: { zh: '关于x轴对称', en: 'Symmetric about the x-axis' }, nodes: { zh: '径向节点数：0，角节点数：3', en: 'Radial nodes: 0, angular nodes: 3' } } },
  '4f_y(x2-z2)': { title: { zh: '4f (fy(x²-z²))轨道', en: '4f (fy(x²-z²)) Orbital' }, basicInfo: { quantumNumbers: { n: 4, l: 3, m: -3 }, description: { zh: '第四主壳层f轨道，复杂对称形态', en: '4th shell f orbital, complex symmetry' }, orbitalType: { zh: 'f轨道（高阶对称轨道）', en: 'f orbital (higher-order)' } }, shapeFeatures: { shape: { zh: '八个瓣，复杂对称分布', en: 'Eight lobes, complex symmetric distribution' }, symmetry: { zh: '关于y轴对称', en: 'Symmetric about the y-axis' }, nodes: { zh: '径向节点数：0，角节点数：3', en: 'Radial nodes: 0, angular nodes: 3' } } },
  '4f_zx2-y2': { title: { zh: '4f (fz(x²-y²))轨道', en: '4f (fz(x²-y²)) Orbital' }, basicInfo: { quantumNumbers: { n: 4, l: 3, m: -2 }, description: { zh: '第四主壳层f轨道，复杂对称形态', en: '4th shell f orbital, complex symmetry' }, orbitalType: { zh: 'f轨道（高阶对称轨道）', en: 'f orbital (higher-order)' } }, shapeFeatures: { shape: { zh: '八个瓣，复杂对称分布', en: 'Eight lobes, complex symmetric distribution' }, symmetry: { zh: '关于z轴对称', en: 'Symmetric about the z-axis' }, nodes: { zh: '径向节点数：0，角节点数：3', en: 'Radial nodes: 0, angular nodes: 3' } } },
  
  // 5f
  '5f_z3': { title: { zh: '5f (fz³)轨道', en: '5f (fz³) Orbital' }, basicInfo: { quantumNumbers: { n: 5, l: 3, m: 0 }, description: { zh: '第五主壳层f轨道，沿z轴高阶对称', en: '5th shell f orbital, higher-order z-axis symmetry' }, orbitalType: { zh: 'f轨道（高阶对称轨道）', en: 'f orbital (higher-order)' } }, shapeFeatures: { shape: { zh: '复杂的瓣状分布，沿z轴对称，带有一个径向节点', en: 'Complex lobe distribution, z-axis symmetric, with one radial node' }, symmetry: { zh: '关于z轴对称', en: 'Symmetric about the z-axis' }, nodes: { zh: '径向节点数：1，角节点数：3', en: 'Radial nodes: 1, angular nodes: 3' } } },
  '5f_xz2': { title: { zh: '5f (fxz²)轨道', en: '5f (fxz²) Orbital' }, basicInfo: { quantumNumbers: { n: 5, l: 3, m: 1 }, description: { zh: '第五主壳层f轨道，xz平面对称', en: '5th shell f orbital, xz-plane symmetric' }, orbitalType: { zh: 'f轨道（高阶对称轨道）', en: 'f orbital (higher-order)' } }, shapeFeatures: { shape: { zh: '六个瓣，xz平面对称，带有一个径向节点', en: 'Six lobes, xz-plane symmetric, with one radial node' }, symmetry: { zh: '关于y轴对称', en: 'Symmetric about the y-axis' }, nodes: { zh: '径向节点数：1，角节点数：3', en: 'Radial nodes: 1, angular nodes: 3' } } },
  '5f_yz2': { title: { zh: '5f (fyz²)轨道', en: '5f (fyz²) Orbital' }, basicInfo: { quantumNumbers: { n: 5, l: 3, m: -1 }, description: { zh: '第五主壳层f轨道，yz平面对称', en: '5th shell f orbital, yz-plane symmetric' }, orbitalType: { zh: 'f轨道（高阶对称轨道）', en: 'f orbital (higher-order)' } }, shapeFeatures: { shape: { zh: '六个瓣，yz平面对称，带有一个径向节点', en: 'Six lobes, yz-plane symmetric, with one radial node' }, symmetry: { zh: '关于x轴对称', en: 'Symmetric about the x-axis' }, nodes: { zh: '径向节点数：1，角节点数：3', en: 'Radial nodes: 1, angular nodes: 3' } } },
  '5f_xyz': { title: { zh: '5f (fxyz)轨道', en: '5f (fxyz) Orbital' }, basicInfo: { quantumNumbers: { n: 5, l: 3, m: 2 }, description: { zh: '第五主壳层f轨道，xyz空间对称', en: '5th shell f orbital, xyz-space symmetric' }, orbitalType: { zh: 'f轨道（高阶对称轨道）', en: 'f orbital (higher-order)' } }, shapeFeatures: { shape: { zh: '八个瓣，空间对称分布，带有一个径向节点', en: 'Eight lobes, spatially symmetric, with one radial node' }, symmetry: { zh: '关于三个坐标轴对称', en: 'Symmetric about all three axes' }, nodes: { zh: '径向节点数：1，角节点数：3', en: 'Radial nodes: 1, angular nodes: 3' } } },
  '5f_x(x2-3y2)': { title: { zh: '5f (fx(x²-3y²))轨道', en: '5f (fx(x²-3y²)) Orbital' }, basicInfo: { quantumNumbers: { n: 5, l: 3, m: 3 }, description: { zh: '第五主壳层f轨道，复杂对称形态', en: '5th shell f orbital, complex symmetry' }, orbitalType: { zh: 'f轨道（高阶对称轨道）', en: 'f orbital (higher-order)' } }, shapeFeatures: { shape: { zh: '八个瓣，复杂对称分布，带有一个径向节点', en: 'Eight lobes, complex distribution, with one radial node' }, symmetry: { zh: '关于x轴对称', en: 'Symmetric about the x-axis' }, nodes: { zh: '径向节点数：1，角节点数：3', en: 'Radial nodes: 1, angular nodes: 3' } } },
  '5f_y(x2-z2)': { title: { zh: '5f (fy(x²-z²))轨道', en: '5f (fy(x²-z²)) Orbital' }, basicInfo: { quantumNumbers: { n: 5, l: 3, m: -3 }, description: { zh: '第五主壳层f轨道，复杂对称形态', en: '5th shell f orbital, complex symmetry' }, orbitalType: { zh: 'f轨道（高阶对称轨道）', en: 'f orbital (higher-order)' } }, shapeFeatures: { shape: { zh: '八个瓣，复杂对称分布，带有一个径向节点', en: 'Eight lobes, complex distribution, with one radial node' }, symmetry: { zh: '关于y轴对称', en: 'Symmetric about the y-axis' }, nodes: { zh: '径向节点数：1，角节点数：3', en: 'Radial nodes: 1, angular nodes: 3' } } },
  '5f_zx2-y2': { title: { zh: '5f (fz(x²-y²))轨道', en: '5f (fz(x²-y²)) Orbital' }, basicInfo: { quantumNumbers: { n: 5, l: 3, m: -2 }, description: { zh: '第五主壳层f轨道，复杂对称形态', en: '5th shell f orbital, complex symmetry' }, orbitalType: { zh: 'f轨道（高阶对称轨道）', en: 'f orbital (higher-order)' } }, shapeFeatures: { shape: { zh: '八个瓣，复杂对称分布，带有一个径向节点', en: 'Eight lobes, complex distribution, with one radial node' }, symmetry: { zh: '关于z轴对称', en: 'Symmetric about the z-axis' }, nodes: { zh: '径向节点数：1，角节点数：3', en: 'Radial nodes: 1, angular nodes: 3' } } },
  
  // G轨道
  '5g_z4': { title: { zh: '5g (gz⁴)轨道', en: '5g (gz⁴) Orbital' }, basicInfo: { quantumNumbers: { n: 5, l: 4, m: 0 }, description: { zh: '第五主壳层g轨道，沿z轴超高阶对称', en: '5th shell g orbital, ultra-high-order z-axis symmetry' }, orbitalType: { zh: 'g轨道（超高阶轨道）', en: 'g orbital (ultra-high-order)' } }, shapeFeatures: { shape: { zh: '非常复杂的瓣状分布，沿z轴对称', en: 'Very complex lobe distribution, z-axis symmetric' }, symmetry: { zh: '关于z轴对称', en: 'Symmetric about the z-axis' }, nodes: { zh: '径向节点数：0，角节点数：4', en: 'Radial nodes: 0, angular nodes: 4' } } },
  '5g_xz3': { title: { zh: '5g (gxz³)轨道', en: '5g (gxz³) Orbital' }, basicInfo: { quantumNumbers: { n: 5, l: 4, m: 1 }, description: { zh: '第五主壳层g轨道，xz平面对称', en: '5th shell g orbital, xz-plane symmetric' }, orbitalType: { zh: 'g轨道（超高阶轨道）', en: 'g orbital (ultra-high-order)' } }, shapeFeatures: { shape: { zh: '十个瓣，xz平面对称', en: 'Ten lobes, xz-plane symmetric' }, symmetry: { zh: '关于y轴对称', en: 'Symmetric about the y-axis' }, nodes: { zh: '径向节点数：0，角节点数：4', en: 'Radial nodes: 0, angular nodes: 4' } } },
  '5g_yz3': { title: { zh: '5g (gyz³)轨道', en: '5g (gyz³) Orbital' }, basicInfo: { quantumNumbers: { n: 5, l: 4, m: -1 }, description: { zh: '第五主壳层g轨道，yz平面对称', en: '5th shell g orbital, yz-plane symmetric' }, orbitalType: { zh: 'g轨道（超高阶轨道）', en: 'g orbital (ultra-high-order)' } }, shapeFeatures: { shape: { zh: '十个瓣，yz平面对称', en: 'Ten lobes, yz-plane symmetric' }, symmetry: { zh: '关于x轴对称', en: 'Symmetric about the x-axis' }, nodes: { zh: '径向节点数：0，角节点数：4', en: 'Radial nodes: 0, angular nodes: 4' } } },
  '5g_z2x2-y2': { title: { zh: '5g (gz²(x²-y²))轨道', en: '5g (gz²(x²-y²)) Orbital' }, basicInfo: { quantumNumbers: { n: 5, l: 4, m: 2 }, description: { zh: '第五主壳层g轨道，复杂对称形态', en: '5th shell g orbital, complex symmetry' }, orbitalType: { zh: 'g轨道（超高阶轨道）', en: 'g orbital (ultra-high-order)' } }, shapeFeatures: { shape: { zh: '十二个瓣，复杂对称分布', en: 'Twelve lobes, complex symmetric distribution' }, symmetry: { zh: '关于z轴对称', en: 'Symmetric about the z-axis' }, nodes: { zh: '径向节点数：0，角节点数：4', en: 'Radial nodes: 0, angular nodes: 4' } } },
  '5g_xyz2': { title: { zh: '5g (gxyz²)轨道', en: '5g (gxyz²) Orbital' }, basicInfo: { quantumNumbers: { n: 5, l: 4, m: -2 }, description: { zh: '第五主壳层g轨道，xyz空间对称', en: '5th shell g orbital, xyz-space symmetric' }, orbitalType: { zh: 'g轨道（超高阶轨道）', en: 'g orbital (ultra-high-order)' } }, shapeFeatures: { shape: { zh: '十二个瓣，空间对称分布', en: 'Twelve lobes, spatially symmetric' }, symmetry: { zh: '关于三个坐标轴对称', en: 'Symmetric about all three axes' }, nodes: { zh: '径向节点数：0，角节点数：4', en: 'Radial nodes: 0, angular nodes: 4' } } },
  '5g_xzx2-3y2': { title: { zh: '5g (gxz(x²-3y²))轨道', en: '5g (gxz(x²-3y²)) Orbital' }, basicInfo: { quantumNumbers: { n: 5, l: 4, m: 3 }, description: { zh: '第五主壳层g轨道，复杂对称形态', en: '5th shell g orbital, complex symmetry' }, orbitalType: { zh: 'g轨道（超高阶轨道）', en: 'g orbital (ultra-high-order)' } }, shapeFeatures: { shape: { zh: '十二个瓣，复杂对称分布', en: 'Twelve lobes, complex symmetric distribution' }, symmetry: { zh: '关于y轴对称', en: 'Symmetric about the y-axis' }, nodes: { zh: '径向节点数：0，角节点数：4', en: 'Radial nodes: 0, angular nodes: 4' } } },
  '5g_yzy2-3x2': { title: { zh: '5g (gyz(y²-3x²))轨道', en: '5g (gyz(y²-3x²)) Orbital' }, basicInfo: { quantumNumbers: { n: 5, l: 4, m: -3 }, description: { zh: '第五主壳层g轨道，复杂对称形态', en: '5th shell g orbital, complex symmetry' }, orbitalType: { zh: 'g轨道（超高阶轨道）', en: 'g orbital (ultra-high-order)' } }, shapeFeatures: { shape: { zh: '十二个瓣，复杂对称分布', en: 'Twelve lobes, complex symmetric distribution' }, symmetry: { zh: '关于x轴对称', en: 'Symmetric about the x-axis' }, nodes: { zh: '径向节点数：0，角节点数：4', en: 'Radial nodes: 0, angular nodes: 4' } } },
  '5g_x4+y4': { title: { zh: '5g (gx⁴+y⁴)轨道', en: '5g (gx⁴+y⁴) Orbital' }, basicInfo: { quantumNumbers: { n: 5, l: 4, m: 4 }, description: { zh: '第五主壳层g轨道，复杂对称形态', en: '5th shell g orbital, complex symmetry' }, orbitalType: { zh: 'g轨道（超高阶轨道）', en: 'g orbital (ultra-high-order)' } }, shapeFeatures: { shape: { zh: '十六个瓣，xy平面对称', en: 'Sixteen lobes, xy-plane symmetric' }, symmetry: { zh: '关于x、y轴对称', en: 'Symmetric about x and y axes' }, nodes: { zh: '径向节点数：0，角节点数：4', en: 'Radial nodes: 0, angular nodes: 4' } } },
  '5g_xyx2-y2': { title: { zh: '5g (gxy(x²-y²))轨道', en: '5g (gxy(x²-y²)) Orbital' }, basicInfo: { quantumNumbers: { n: 5, l: 4, m: -4 }, description: { zh: '第五主壳层g轨道，xy平面对称', en: '5th shell g orbital, xy-plane symmetric' }, orbitalType: { zh: 'g轨道（超高阶轨道）', en: 'g orbital (ultra-high-order)' } }, shapeFeatures: { shape: { zh: '十六个瓣，xy平面对称', en: 'Sixteen lobes, xy-plane symmetric' }, symmetry: { zh: '关于x、y轴对称', en: 'Symmetric about x and y axes' }, nodes: { zh: '径向节点数：0，角节点数：4', en: 'Radial nodes: 0, angular nodes: 4' } } }
};

/**
 * 获取轨道知识数据
 * 
 * @param {string} orbitalId - 轨道 ID
 * @returns {Object|null} 知识数据对象
 */
export function getOrbitalKnowledge(orbitalId) {
  return ORBITAL_KNOWLEDGE[orbitalId] || null;
}
