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
  '5g_xyx2-y2': { title: { zh: '5g (gxy(x²-y²))轨道', en: '5g (gxy(x²-y²)) Orbital' }, basicInfo: { quantumNumbers: { n: 5, l: 4, m: -4 }, description: { zh: '第五主壳层g轨道，xy平面对称', en: '5th shell g orbital, xy-plane symmetric' }, orbitalType: { zh: 'g轨道（超高阶轨道）', en: 'g orbital (ultra-high-order)' } }, shapeFeatures: { shape: { zh: '十六个瓣，xy平面对称', en: 'Sixteen lobes, xy-plane symmetric' }, symmetry: { zh: '关于x、y轴对称', en: 'Symmetric about x and y axes' }, nodes: { zh: '径向节点数：0，角节点数：4', en: 'Radial nodes: 0, angular nodes: 4' } } },

  'dodec_C20H20': {
    title: { zh: 'C20H20 正十二面体分子轨道', en: 'C20H20 Dodecahedral Molecular Orbital' },
    basicInfo: {
      kind: 'molecular',
      molecule: { zh: '正十二面体烷 C20H20', en: 'Dodecahedrane C20H20' },
      orbitalType: { zh: '几何优化后 DFT 分子轨道与电子密度', en: 'Geometry-optimized DFT orbital and electron density' },
      symmetry: { zh: '由理想 Ih 笼架出发优化得到', en: 'Optimized from an idealized Ih cage' },
      displayTarget: { zh: 'PySCF 计算得到的总电子密度与 HOMO 叠加点云', en: 'Layered total-electron-density and HOMO point clouds computed in PySCF' },
      method: { zh: 'PySCF RKS / PBE', en: 'PySCF RKS / PBE' },
      basis: { zh: '6-31G', en: '6-31G' },
      chargeMultiplicity: { zh: '0 / 单重态', en: '0 / singlet' },
      description: { zh: '该模型以理想化正十二面体碳骨架与径向 C-H 键长构造初始结构，先在 PySCF 中做几何优化，再把优化后结构的总电子密度与 HOMO Cube 网格转换为可叠加查看的点云。', en: 'This model starts from an idealized dodecahedral carbon cage with radial C-H bonds, performs a geometry optimization in PySCF, and then converts the optimized total-electron-density and HOMO cube grids into layered point clouds.' },
      scientificNote: { zh: '当前展示已包含几何优化，因此骨架形状比纯理想多面体更接近自洽场下的稳定结构；若需更高精度，仍可进一步加入更高阶基组、色散修正或文献实验坐标。', en: 'The current display already includes geometry optimization, so the cage shape is closer to a self-consistent stable structure than a purely ideal polyhedron; larger basis sets, dispersion corrections, or literature geometries could still be added for higher accuracy.' }
    },
    shapeFeatures: {
      shape: { zh: '浅金色层显示骨架总电子密度，双色层显示 HOMO 相位高值区域，因此既能看到成键骨架，也能看到前线轨道分布', en: 'The pale gold layer shows the total electron density of the cage, while the two-color layer highlights high-amplitude HOMO regions, so both the bonding scaffold and frontier-orbital pattern remain visible' },
      symmetry: { zh: '优化后仍保留接近正十二面体笼架的高对称特征，但会出现真实分子中允许的小幅键长与键角调整', en: 'After optimization, the structure still preserves near-dodecahedral high symmetry, while allowing the small bond-length and bond-angle relaxations expected in a real molecule' },
      nodes: { zh: '双色分区对应 HOMO 波函数正负相位；浅金色总电子密度不含相位信息，主要用于呈现优化后的分子骨架', en: 'The two-color partitioning tracks the positive and negative phases of the HOMO wavefunction; the pale gold total electron density carries no phase information and primarily shows the optimized molecular scaffold' }
    }
  },

  'icosa_B12H12': {
    title: { zh: 'B12H12²⁻ 正二十面体分子轨道', en: 'B12H12²⁻ Icosahedral Molecular Orbital' },
    basicInfo: {
      kind: 'molecular',
      molecule: { zh: 'closo-B12H12²⁻', en: 'closo-B12H12²⁻' },
      orbitalType: { zh: '几何优化后 DFT 分子轨道与电子密度', en: 'Geometry-optimized DFT orbital and electron density' },
      symmetry: { zh: '由理想 Ih 笼架出发优化得到', en: 'Optimized from an idealized Ih cage' },
      displayTarget: { zh: 'PySCF 计算得到的总电子密度与 HOMO 叠加点云', en: 'Layered total-electron-density and HOMO point clouds computed in PySCF' },
      method: { zh: 'PySCF RKS / PBE', en: 'PySCF RKS / PBE' },
      basis: { zh: 'def2-SVP', en: 'def2-SVP' },
      chargeMultiplicity: { zh: '-2 / 单重态', en: '-2 / singlet' },
      description: { zh: '该模型以理想化 closo-B12H12²⁻ 正二十面体硼笼为起点，先在 PySCF 中做几何优化，再把优化后结构的总电子密度与 HOMO Cube 网格转换为可交互叠加点云。', en: 'This model starts from an idealized icosahedral boron cage for closo-B12H12²⁻, performs a geometry optimization in PySCF, and then converts the optimized total-electron-density and HOMO cube grids into layered interactive point clouds.' },
      scientificNote: { zh: '当前结果已不再只是理想笼架上的单点轨道，而是包含优化后核坐标的自洽电子分布；如需进一步贴近实验，可继续引入更高阶泛函、溶剂效应或文献结构。', en: 'The current result is no longer just a single-point orbital on an ideal cage, but a self-consistent electronic distribution on optimized nuclear coordinates; higher-level functionals, solvent effects, or literature geometries could bring it even closer to experiment.' }
    },
    shapeFeatures: {
      shape: { zh: '浅金色层呈现 closo 硼笼与 B-H 骨架的总电子密度，双色层则突出 HOMO 的多中心离域分布', en: 'The pale gold layer shows the total electron density of the closo boron cage and B-H framework, while the two-color layer highlights the multicenter delocalized HOMO distribution' },
      symmetry: { zh: '优化后整体仍保持接近正二十面体 closo 笼的高对称性，但会比理想几何更符合自洽场平衡构型', en: 'After optimization, the structure still remains close to the high symmetry of an icosahedral closo cage, while better matching the self-consistent equilibrium geometry than the idealized starting shape' },
      nodes: { zh: '双色区分 HOMO 正负相位与节点；浅金色总电子密度则帮助直接识别优化后的笼架位置与成键区域', en: 'The two-color layer separates HOMO phases and nodes; the pale gold total electron density helps identify the optimized cage positions and bonding regions directly' }
    }
  },

  'mol_small_CH4': {
    title: { zh: '甲烷 CH4 分子轨道', en: 'Methane CH4 Molecular Orbitals' },
    basicInfo: {
      kind: 'molecular',
      molecule: { zh: '甲烷 CH4', en: 'Methane CH4' },
      orbitalType: { zh: '几何优化后 DFT 总电子密度与 HOMO', en: 'Geometry-optimized DFT density and HOMO' },
      symmetry: { zh: '四面体 Td', en: 'Tetrahedral Td' },
      displayTarget: { zh: '总电子密度与 HOMO 点云（PLY）', en: 'Total density and HOMO point clouds (PLY)' },
      method: { zh: 'DFT（与仓库管线一致，待生成 PLY）', en: 'DFT (same pipeline as repo; PLY pending)' },
      basis: { zh: '待定', en: 'TBD' },
      chargeMultiplicity: { zh: '0 / 单重态', en: '0 / singlet' },
      description: { zh: '甲烷是最简单的对称小分子之一，适合作为分子轨道可视化的入门样本。', en: 'Methane is one of the simplest symmetric small molecules, useful as an introductory molecular-orbital visualization.' },
      scientificNote: { zh: 'PLY 文件生成后，将自动从「即将推出」变为可点击；详见 docs/MOLECULAR_MODELS.md。', en: 'Once PLY assets are generated, the card will become clickable; see docs/MOLECULAR_MODELS.md.' }
    },
    shapeFeatures: {
      shape: { zh: '总电子密度呈近球形骨架；HOMO 反映四面体成键与前线分布', en: 'Total density outlines a nearly spherical scaffold; HOMO reflects bonding and frontier character' },
      symmetry: { zh: 'Td 近似', en: 'Approximate Td' },
      nodes: { zh: 'HOMO 层可含相位分区；密度层无相位', en: 'HOMO layer may show phase partitioning; density has no phase' }
    }
  },

  'mol_small_NH3': {
    title: { zh: '氨 NH3 分子轨道', en: 'Ammonia NH3 Molecular Orbitals' },
    basicInfo: {
      kind: 'molecular',
      molecule: { zh: '氨 NH3', en: 'Ammonia NH3' },
      orbitalType: { zh: '几何优化后 DFT 总电子密度与 HOMO', en: 'Geometry-optimized DFT density and HOMO' },
      symmetry: { zh: '三角锥 C3v', en: 'Trigonal pyramid C3v' },
      displayTarget: { zh: '总电子密度与 HOMO 点云（PLY）', en: 'Total density and HOMO point clouds (PLY)' },
      method: { zh: 'DFT（待生成 PLY）', en: 'DFT (PLY pending)' },
      basis: { zh: '待定', en: 'TBD' },
      chargeMultiplicity: { zh: '0 / 单重态', en: '0 / singlet' },
      description: { zh: '氨分子展示孤对电子与三角锥构型下的电子分布。', en: 'Ammonia illustrates lone-pair effects in a trigonal-pyramidal geometry.' },
      scientificNote: { zh: '资源就绪后接入 EXISTING_ORBITALS。', en: 'Will be enabled once assets are added to EXISTING_ORBITALS.' }
    },
    shapeFeatures: {
      shape: { zh: '密度与 HOMO 可体现非对称孤对区域', en: 'Density and HOMO can highlight asymmetric lone-pair regions' },
      symmetry: { zh: 'C3v 近似', en: 'Approximate C3v' },
      nodes: { zh: 'HOMO 相位分区依对称性而定', en: 'HOMO phase partitioning follows symmetry' }
    }
  },

  'mol_small_H2O': {
    title: { zh: '水 H2O 分子轨道', en: 'Water H2O Molecular Orbitals' },
    basicInfo: {
      kind: 'molecular',
      molecule: { zh: '水 H2O', en: 'Water H2O' },
      orbitalType: { zh: '几何优化后 DFT 总电子密度与 HOMO', en: 'Geometry-optimized DFT density and HOMO' },
      symmetry: { zh: '弯曲 C2v', en: 'Bent C2v' },
      displayTarget: { zh: '总电子密度与 HOMO 点云（PLY）', en: 'Total density and HOMO point clouds (PLY)' },
      method: { zh: 'DFT（待生成 PLY）', en: 'DFT (PLY pending)' },
      basis: { zh: '待定', en: 'TBD' },
      chargeMultiplicity: { zh: '0 / 单重态', en: '0 / singlet' },
      description: { zh: '水分子展示弯曲构型与两对孤对电子的典型特征。', en: 'Water shows bent geometry and lone-pair characteristics.' },
      scientificNote: { zh: '详见 docs/MOLECULAR_MODELS.md。', en: 'See docs/MOLECULAR_MODELS.md.' }
    },
    shapeFeatures: {
      shape: { zh: '非线性构型下电子密度与前线轨道形态直观', en: 'Electron density and frontier orbitals are intuitive in nonlinear geometry' },
      symmetry: { zh: 'C2v 近似', en: 'Approximate C2v' },
      nodes: { zh: 'HOMO 可含氧孤对相关高值区', en: 'HOMO may highlight oxygen lone-pair regions' }
    }
  },

  'mol_small_C2H4': {
    title: { zh: '乙烯 C2H4 分子轨道', en: 'Ethylene C2H4 Molecular Orbitals' },
    basicInfo: {
      kind: 'molecular',
      molecule: { zh: '乙烯 C2H4', en: 'Ethylene C2H4' },
      orbitalType: { zh: '几何优化后 DFT 总电子密度与 HOMO', en: 'Geometry-optimized DFT density and HOMO' },
      symmetry: { zh: '平面 D2h', en: 'Planar D2h' },
      displayTarget: { zh: '总电子密度与 HOMO 点云（PLY）', en: 'Total density and HOMO point clouds (PLY)' },
      method: { zh: 'DFT（待生成 PLY）', en: 'DFT (PLY pending)' },
      basis: { zh: '待定', en: 'TBD' },
      chargeMultiplicity: { zh: '0 / 单重态', en: '0 / singlet' },
      description: { zh: '乙烯适合展示 π 键与平面共轭骨架的前线轨道。', en: 'Ethylene is a classic example for π bonding and planar frontier orbitals.' },
      scientificNote: { zh: '详见 docs/MOLECULAR_MODELS.md。', en: 'See docs/MOLECULAR_MODELS.md.' }
    },
    shapeFeatures: {
      shape: { zh: 'HOMO 常体现 π 与骨架耦合特征', en: 'HOMO often reflects π character coupled to the framework' },
      symmetry: { zh: 'D2h 近似', en: 'Approximate D2h' },
      nodes: { zh: '相位与节点与分子对称面相关', en: 'Phases and nodes relate to molecular symmetry planes' }
    }
  },

  'mol_small_C6H6': {
    title: { zh: '苯 C6H6 分子轨道', en: 'Benzene C6H6 Molecular Orbitals' },
    basicInfo: {
      kind: 'molecular',
      molecule: { zh: '苯 C6H6', en: 'Benzene C6H6' },
      orbitalType: { zh: '几何优化后 DFT 总电子密度与 HOMO', en: 'Geometry-optimized DFT density and HOMO' },
      symmetry: { zh: '平面 D6h', en: 'Planar D6h' },
      displayTarget: { zh: '总电子密度与 HOMO 点云（PLY）', en: 'Total density and HOMO point clouds (PLY)' },
      method: { zh: 'DFT（待生成 PLY）', en: 'DFT (PLY pending)' },
      basis: { zh: '待定', en: 'TBD' },
      chargeMultiplicity: { zh: '0 / 单重态', en: '0 / singlet' },
      description: { zh: '苯是共轭 π 体系与离域电子分布的代表分子。', en: 'Benzene is a canonical example of conjugated π delocalization.' },
      scientificNote: { zh: '详见 docs/MOLECULAR_MODELS.md。', en: 'See docs/MOLECULAR_MODELS.md.' }
    },
    shapeFeatures: {
      shape: { zh: 'HOMO 常体现六重对称下的离域瓣分布', en: 'HOMO often shows sixfold symmetric delocalized lobes' },
      symmetry: { zh: 'D6h 近似', en: 'Approximate D6h' },
      nodes: { zh: '相位与节点与环对称轴相关', en: 'Phases and nodes relate to ring symmetry' }
    }
  }
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
