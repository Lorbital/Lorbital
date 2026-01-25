/**
 * 轨道知识数据
 * 
 * 包含每个轨道的基本信息和形状特征
 * 
 * @module data/orbitalKnowledge
 */

export const ORBITAL_KNOWLEDGE = {
  // S轨道
  '1s': {
    title: '1s轨道',
    basicInfo: {
      quantumNumbers: { n: 1, l: 0, m: 0 },
      description: '基态氢原子轨道，具有最小能量',
      orbitalType: 's轨道（球对称轨道）'
    },
    shapeFeatures: {
      shape: '球对称，无方向性',
      symmetry: '完全球对称',
      nodes: '径向节点数：0'
    }
  },
  '2s': {
    title: '2s轨道',
    basicInfo: {
      quantumNumbers: { n: 2, l: 0, m: 0 },
      description: '第二主壳层s轨道',
      orbitalType: 's轨道（球对称轨道）'
    },
    shapeFeatures: {
      shape: '球对称，带有一个径向节点',
      symmetry: '完全球对称',
      nodes: '径向节点数：1'
    }
  },
  '3s': {
    title: '3s轨道',
    basicInfo: {
      quantumNumbers: { n: 3, l: 0, m: 0 },
      description: '第三主壳层s轨道',
      orbitalType: 's轨道（球对称轨道）'
    },
    shapeFeatures: {
      shape: '球对称，带有两个径向节点',
      symmetry: '完全球对称',
      nodes: '径向节点数：2'
    }
  },
  '4s': {
    title: '4s轨道',
    basicInfo: {
      quantumNumbers: { n: 4, l: 0, m: 0 },
      description: '第四主壳层s轨道',
      orbitalType: 's轨道（球对称轨道）'
    },
    shapeFeatures: {
      shape: '球对称，带有三个径向节点',
      symmetry: '完全球对称',
      nodes: '径向节点数：3'
    }
  },
  '5s': {
    title: '5s轨道',
    basicInfo: {
      quantumNumbers: { n: 5, l: 0, m: 0 },
      description: '第五主壳层s轨道',
      orbitalType: 's轨道（球对称轨道）'
    },
    shapeFeatures: {
      shape: '球对称，带有四个径向节点',
      symmetry: '完全球对称',
      nodes: '径向节点数：4'
    }
  },
  '6s': {
    title: '6s轨道',
    basicInfo: {
      quantumNumbers: { n: 6, l: 0, m: 0 },
      description: '第六主壳层s轨道',
      orbitalType: 's轨道（球对称轨道）'
    },
    shapeFeatures: {
      shape: '球对称，带有五个径向节点',
      symmetry: '完全球对称',
      nodes: '径向节点数：5'
    }
  },
  '7s': {
    title: '7s轨道',
    basicInfo: {
      quantumNumbers: { n: 7, l: 0, m: 0 },
      description: '第七主壳层s轨道',
      orbitalType: 's轨道（球对称轨道）'
    },
    shapeFeatures: {
      shape: '球对称，带有六个径向节点',
      symmetry: '完全球对称',
      nodes: '径向节点数：6'
    }
  },
  
  // P轨道
  '2px': {
    title: '2p<sub>x</sub>轨道',
    basicInfo: {
      quantumNumbers: { n: 2, l: 1, m: 1 },
      description: '第二主壳层p轨道，沿x轴方向',
      orbitalType: 'p轨道（哑铃形轨道）'
    },
    shapeFeatures: {
      shape: '哑铃形，沿x轴延伸',
      symmetry: '关于yz平面对称',
      nodes: '径向节点数：0，角节点数：1（通过原点）'
    }
  },
  '2py': {
    title: '2p<sub>y</sub>轨道',
    basicInfo: {
      quantumNumbers: { n: 2, l: 1, m: -1 },
      description: '第二主壳层p轨道，沿y轴方向',
      orbitalType: 'p轨道（哑铃形轨道）'
    },
    shapeFeatures: {
      shape: '哑铃形，沿y轴延伸',
      symmetry: '关于xz平面对称',
      nodes: '径向节点数：0，角节点数：1（通过原点）'
    }
  },
  '2pz': {
    title: '2p<sub>z</sub>轨道',
    basicInfo: {
      quantumNumbers: { n: 2, l: 1, m: 0 },
      description: '第二主壳层p轨道，沿z轴方向',
      orbitalType: 'p轨道（哑铃形轨道）'
    },
    shapeFeatures: {
      shape: '哑铃形，沿z轴延伸',
      symmetry: '关于xy平面对称',
      nodes: '径向节点数：0，角节点数：1（通过原点）'
    }
  },
  '3px': {
    title: '3px轨道',
    basicInfo: {
      quantumNumbers: { n: 3, l: 1, m: 1 },
      description: '第三主壳层p轨道，沿x轴方向',
      orbitalType: 'p轨道（哑铃形轨道）'
    },
    shapeFeatures: {
      shape: '哑铃形，沿x轴延伸，带有一个径向节点',
      symmetry: '关于yz平面对称',
      nodes: '径向节点数：1，角节点数：1'
    }
  },
  '3py': {
    title: '3py轨道',
    basicInfo: {
      quantumNumbers: { n: 3, l: 1, m: -1 },
      description: '第三主壳层p轨道，沿y轴方向',
      orbitalType: 'p轨道（哑铃形轨道）'
    },
    shapeFeatures: {
      shape: '哑铃形，沿y轴延伸，带有一个径向节点',
      symmetry: '关于xz平面对称',
      nodes: '径向节点数：1，角节点数：1'
    }
  },
  '3pz': {
    title: '3pz轨道',
    basicInfo: {
      quantumNumbers: { n: 3, l: 1, m: 0 },
      description: '第三主壳层p轨道，沿z轴方向',
      orbitalType: 'p轨道（哑铃形轨道）'
    },
    shapeFeatures: {
      shape: '哑铃形，沿z轴延伸，带有一个径向节点',
      symmetry: '关于xy平面对称',
      nodes: '径向节点数：1，角节点数：1'
    }
  },
  '4px': {
    title: '4px轨道',
    basicInfo: {
      quantumNumbers: { n: 4, l: 1, m: 1 },
      description: '第四主壳层p轨道，沿x轴方向',
      orbitalType: 'p轨道（哑铃形轨道）'
    },
    shapeFeatures: {
      shape: '哑铃形，沿x轴延伸，带有两个径向节点',
      symmetry: '关于yz平面对称',
      nodes: '径向节点数：2，角节点数：1'
    }
  },
  '4py': {
    title: '4py轨道',
    basicInfo: {
      quantumNumbers: { n: 4, l: 1, m: -1 },
      description: '第四主壳层p轨道，沿y轴方向',
      orbitalType: 'p轨道（哑铃形轨道）'
    },
    shapeFeatures: {
      shape: '哑铃形，沿y轴延伸，带有两个径向节点',
      symmetry: '关于xz平面对称',
      nodes: '径向节点数：2，角节点数：1'
    }
  },
  '4pz': {
    title: '4pz轨道',
    basicInfo: {
      quantumNumbers: { n: 4, l: 1, m: 0 },
      description: '第四主壳层p轨道，沿z轴方向',
      orbitalType: 'p轨道（哑铃形轨道）'
    },
    shapeFeatures: {
      shape: '哑铃形，沿z轴延伸，带有两个径向节点',
      symmetry: '关于xy平面对称',
      nodes: '径向节点数：2，角节点数：1'
    }
  },
  '5px': {
    title: '5px轨道',
    basicInfo: {
      quantumNumbers: { n: 5, l: 1, m: 1 },
      description: '第五主壳层p轨道，沿x轴方向',
      orbitalType: 'p轨道（哑铃形轨道）'
    },
    shapeFeatures: {
      shape: '哑铃形，沿x轴延伸，带有三个径向节点',
      symmetry: '关于yz平面对称',
      nodes: '径向节点数：3，角节点数：1'
    }
  },
  '5py': {
    title: '5py轨道',
    basicInfo: {
      quantumNumbers: { n: 5, l: 1, m: -1 },
      description: '第五主壳层p轨道，沿y轴方向',
      orbitalType: 'p轨道（哑铃形轨道）'
    },
    shapeFeatures: {
      shape: '哑铃形，沿y轴延伸，带有三个径向节点',
      symmetry: '关于xz平面对称',
      nodes: '径向节点数：3，角节点数：1'
    }
  },
  '5pz': {
    title: '5pz轨道',
    basicInfo: {
      quantumNumbers: { n: 5, l: 1, m: 0 },
      description: '第五主壳层p轨道，沿z轴方向',
      orbitalType: 'p轨道（哑铃形轨道）'
    },
    shapeFeatures: {
      shape: '哑铃形，沿z轴延伸，带有三个径向节点',
      symmetry: '关于xy平面对称',
      nodes: '径向节点数：3，角节点数：1'
    }
  },
  '6px': {
    title: '6px轨道',
    basicInfo: {
      quantumNumbers: { n: 6, l: 1, m: 1 },
      description: '第六主壳层p轨道，沿x轴方向',
      orbitalType: 'p轨道（哑铃形轨道）'
    },
    shapeFeatures: {
      shape: '哑铃形，沿x轴延伸，带有四个径向节点',
      symmetry: '关于yz平面对称',
      nodes: '径向节点数：4，角节点数：1'
    }
  },
  '6py': {
    title: '6py轨道',
    basicInfo: {
      quantumNumbers: { n: 6, l: 1, m: -1 },
      description: '第六主壳层p轨道，沿y轴方向',
      orbitalType: 'p轨道（哑铃形轨道）'
    },
    shapeFeatures: {
      shape: '哑铃形，沿y轴延伸，带有四个径向节点',
      symmetry: '关于xz平面对称',
      nodes: '径向节点数：4，角节点数：1'
    }
  },
  '6pz': {
    title: '6pz轨道',
    basicInfo: {
      quantumNumbers: { n: 6, l: 1, m: 0 },
      description: '第六主壳层p轨道，沿z轴方向',
      orbitalType: 'p轨道（哑铃形轨道）'
    },
    shapeFeatures: {
      shape: '哑铃形，沿z轴延伸，带有四个径向节点',
      symmetry: '关于xy平面对称',
      nodes: '径向节点数：4，角节点数：1'
    }
  },
  
  // D轨道（新 ID：{n}d_{suffix}，suffix 去首字母 d）
  '3d_xz': {
    title: '3d<sub>xz</sub>轨道',
    basicInfo: {
      quantumNumbers: { n: 3, l: 2, m: 1 },
      description: '第三主壳层d轨道，xz平面对称',
      orbitalType: 'd轨道（瓣状分布轨道）'
    },
    shapeFeatures: {
      shape: '四个瓣，位于xz平面，关于y轴对称',
      symmetry: '关于y轴对称',
      nodes: '径向节点数：0，角节点数：2'
    }
  },
  '3d_yz': {
    title: '3d<sub>yz</sub>轨道',
    basicInfo: {
      quantumNumbers: { n: 3, l: 2, m: -1 },
      description: '第三主壳层d轨道，yz平面对称',
      orbitalType: 'd轨道（瓣状分布轨道）'
    },
    shapeFeatures: {
      shape: '四个瓣，位于yz平面，关于x轴对称',
      symmetry: '关于x轴对称',
      nodes: '径向节点数：0，角节点数：2'
    }
  },
  '3d_z2': {
    title: '3d<sub>z²</sub>轨道',
    basicInfo: {
      quantumNumbers: { n: 3, l: 2, m: 0 },
      description: '第三主壳层d轨道，沿z轴对称',
      orbitalType: 'd轨道（瓣状分布轨道）'
    },
    shapeFeatures: {
      shape: '双瓣形，沿z轴延伸，带有环形瓣',
      symmetry: '关于z轴对称',
      nodes: '径向节点数：0，角节点数：2'
    }
  },
  '3d_x2-y2': {
    title: '3d<sub>x²-y²</sub>轨道',
    basicInfo: {
      quantumNumbers: { n: 3, l: 2, m: 2 },
      description: '第三主壳层d轨道，沿x和y轴对称',
      orbitalType: 'd轨道（瓣状分布轨道）'
    },
    shapeFeatures: {
      shape: '四个瓣，位于xy平面，沿x和y轴方向',
      symmetry: '关于x、y轴对称',
      nodes: '径向节点数：0，角节点数：2'
    }
  },
  '3d_xy': {
    title: '3d<sub>xy</sub>轨道',
    basicInfo: {
      quantumNumbers: { n: 3, l: 2, m: -2 },
      description: '第三主壳层d轨道，xy平面对称',
      orbitalType: 'd轨道（瓣状分布轨道）'
    },
    shapeFeatures: {
      shape: '四个瓣，位于xy平面，在x和y轴之间',
      symmetry: '关于x、y轴对称',
      nodes: '径向节点数：0，角节点数：2'
    }
  },
  
  // 为4d、5d、6d轨道添加数据（使用相同的形状特征，但描述不同）
  '4d_xz': { title: '4d<sub>xz</sub>轨道', basicInfo: { quantumNumbers: { n: 4, l: 2, m: 1 }, description: '第四主壳层d轨道，xz平面对称', orbitalType: 'd轨道（瓣状分布轨道）' }, shapeFeatures: { shape: '四个瓣，位于xz平面，带有一个径向节点', symmetry: '关于y轴对称', nodes: '径向节点数：1，角节点数：2' } },
  '4d_yz': { title: '4d<sub>yz</sub>轨道', basicInfo: { quantumNumbers: { n: 4, l: 2, m: -1 }, description: '第四主壳层d轨道，yz平面对称', orbitalType: 'd轨道（瓣状分布轨道）' }, shapeFeatures: { shape: '四个瓣，位于yz平面，带有一个径向节点', symmetry: '关于x轴对称', nodes: '径向节点数：1，角节点数：2' } },
  '4d_z2': { title: '4d<sub>z²</sub>轨道', basicInfo: { quantumNumbers: { n: 4, l: 2, m: 0 }, description: '第四主壳层d轨道，沿z轴对称', orbitalType: 'd轨道（瓣状分布轨道）' }, shapeFeatures: { shape: '双瓣形，沿z轴延伸，带有一个径向节点', symmetry: '关于z轴对称', nodes: '径向节点数：1，角节点数：2' } },
  '4d_x2-y2': { title: '4d<sub>x²-y²</sub>轨道', basicInfo: { quantumNumbers: { n: 4, l: 2, m: 2 }, description: '第四主壳层d轨道，沿x和y轴对称', orbitalType: 'd轨道（瓣状分布轨道）' }, shapeFeatures: { shape: '四个瓣，位于xy平面，带有一个径向节点', symmetry: '关于x、y轴对称', nodes: '径向节点数：1，角节点数：2' } },
  '4d_xy': { title: '4d<sub>xy</sub>轨道', basicInfo: { quantumNumbers: { n: 4, l: 2, m: -2 }, description: '第四主壳层d轨道，xy平面对称', orbitalType: 'd轨道（瓣状分布轨道）' }, shapeFeatures: { shape: '四个瓣，位于xy平面，带有一个径向节点', symmetry: '关于x、y轴对称', nodes: '径向节点数：1，角节点数：2' } },
  
  '5d_xz': { title: '5d<sub>xz</sub>轨道', basicInfo: { quantumNumbers: { n: 5, l: 2, m: 1 }, description: '第五主壳层d轨道，xz平面对称', orbitalType: 'd轨道（瓣状分布轨道）' }, shapeFeatures: { shape: '四个瓣，位于xz平面，带有两个径向节点', symmetry: '关于y轴对称', nodes: '径向节点数：2，角节点数：2' } },
  '5d_yz': { title: '5d<sub>yz</sub>轨道', basicInfo: { quantumNumbers: { n: 5, l: 2, m: -1 }, description: '第五主壳层d轨道，yz平面对称', orbitalType: 'd轨道（瓣状分布轨道）' }, shapeFeatures: { shape: '四个瓣，位于yz平面，带有两个径向节点', symmetry: '关于x轴对称', nodes: '径向节点数：2，角节点数：2' } },
  '5d_z2': { title: '5d<sub>z²</sub>轨道', basicInfo: { quantumNumbers: { n: 5, l: 2, m: 0 }, description: '第五主壳层d轨道，沿z轴对称', orbitalType: 'd轨道（瓣状分布轨道）' }, shapeFeatures: { shape: '双瓣形，沿z轴延伸，带有两个径向节点', symmetry: '关于z轴对称', nodes: '径向节点数：2，角节点数：2' } },
  '5d_x2-y2': { title: '5d<sub>x²-y²</sub>轨道', basicInfo: { quantumNumbers: { n: 5, l: 2, m: 2 }, description: '第五主壳层d轨道，沿x和y轴对称', orbitalType: 'd轨道（瓣状分布轨道）' }, shapeFeatures: { shape: '四个瓣，位于xy平面，带有两个径向节点', symmetry: '关于x、y轴对称', nodes: '径向节点数：2，角节点数：2' } },
  '5d_xy': { title: '5d<sub>xy</sub>轨道', basicInfo: { quantumNumbers: { n: 5, l: 2, m: -2 }, description: '第五主壳层d轨道，xy平面对称', orbitalType: 'd轨道（瓣状分布轨道）' }, shapeFeatures: { shape: '四个瓣，位于xy平面，带有两个径向节点', symmetry: '关于x、y轴对称', nodes: '径向节点数：2，角节点数：2' } },
  
  '6d_xz': { title: '6d<sub>xz</sub>轨道', basicInfo: { quantumNumbers: { n: 6, l: 2, m: 1 }, description: '第六主壳层d轨道，xz平面对称', orbitalType: 'd轨道（瓣状分布轨道）' }, shapeFeatures: { shape: '四个瓣，位于xz平面，带有三个径向节点', symmetry: '关于y轴对称', nodes: '径向节点数：3，角节点数：2' } },
  '6d_yz': { title: '6d<sub>yz</sub>轨道', basicInfo: { quantumNumbers: { n: 6, l: 2, m: -1 }, description: '第六主壳层d轨道，yz平面对称', orbitalType: 'd轨道（瓣状分布轨道）' }, shapeFeatures: { shape: '四个瓣，位于yz平面，带有三个径向节点', symmetry: '关于x轴对称', nodes: '径向节点数：3，角节点数：2' } },
  '6d_z2': { title: '6d<sub>z²</sub>轨道', basicInfo: { quantumNumbers: { n: 6, l: 2, m: 0 }, description: '第六主壳层d轨道，沿z轴对称', orbitalType: 'd轨道（瓣状分布轨道）' }, shapeFeatures: { shape: '双瓣形，沿z轴延伸，带有三个径向节点', symmetry: '关于z轴对称', nodes: '径向节点数：3，角节点数：2' } },
  '6d_x2-y2': { title: '6d<sub>x²-y²</sub>轨道', basicInfo: { quantumNumbers: { n: 6, l: 2, m: 2 }, description: '第六主壳层d轨道，沿x和y轴对称', orbitalType: 'd轨道（瓣状分布轨道）' }, shapeFeatures: { shape: '四个瓣，位于xy平面，带有三个径向节点', symmetry: '关于x、y轴对称', nodes: '径向节点数：3，角节点数：2' } },
  '6d_xy': { title: '6d<sub>xy</sub>轨道', basicInfo: { quantumNumbers: { n: 6, l: 2, m: -2 }, description: '第六主壳层d轨道，xy平面对称', orbitalType: 'd轨道（瓣状分布轨道）' }, shapeFeatures: { shape: '四个瓣，位于xy平面，带有三个径向节点', symmetry: '关于x、y轴对称', nodes: '径向节点数：3，角节点数：2' } },
  
  // F轨道（新 ID：{n}f_{suffix}，suffix 去首字母 f，fxx2-3y2→x(x2-3y2)、fyy2-3x2→y(x2-z2)）
  '4f_z3': { title: '4f<sub>z³</sub>轨道', basicInfo: { quantumNumbers: { n: 4, l: 3, m: 0 }, description: '第四主壳层f轨道，沿z轴高阶对称', orbitalType: 'f轨道（高阶对称轨道）' }, shapeFeatures: { shape: '复杂的瓣状分布，沿z轴对称', symmetry: '关于z轴对称', nodes: '径向节点数：0，角节点数：3' } },
  '4f_xz2': { title: '4f<sub>xz²</sub>轨道', basicInfo: { quantumNumbers: { n: 4, l: 3, m: 1 }, description: '第四主壳层f轨道，xz平面对称', orbitalType: 'f轨道（高阶对称轨道）' }, shapeFeatures: { shape: '六个瓣，xz平面对称', symmetry: '关于y轴对称', nodes: '径向节点数：0，角节点数：3' } },
  '4f_yz2': { title: '4f<sub>yz²</sub>轨道', basicInfo: { quantumNumbers: { n: 4, l: 3, m: -1 }, description: '第四主壳层f轨道，yz平面对称', orbitalType: 'f轨道（高阶对称轨道）' }, shapeFeatures: { shape: '六个瓣，yz平面对称', symmetry: '关于x轴对称', nodes: '径向节点数：0，角节点数：3' } },
  '4f_xyz': { title: '4f (fxyz)轨道', basicInfo: { quantumNumbers: { n: 4, l: 3, m: 2 }, description: '第四主壳层f轨道，xyz空间对称', orbitalType: 'f轨道（高阶对称轨道）' }, shapeFeatures: { shape: '八个瓣，空间对称分布', symmetry: '关于三个坐标轴对称', nodes: '径向节点数：0，角节点数：3' } },
  '4f_x(x2-3y2)': { title: '4f (fx(x²-3y²))轨道', basicInfo: { quantumNumbers: { n: 4, l: 3, m: 3 }, description: '第四主壳层f轨道，复杂对称形态', orbitalType: 'f轨道（高阶对称轨道）' }, shapeFeatures: { shape: '八个瓣，复杂对称分布', symmetry: '关于x轴对称', nodes: '径向节点数：0，角节点数：3' } },
  '4f_y(x2-z2)': { title: '4f (fy(x²-z²))轨道', basicInfo: { quantumNumbers: { n: 4, l: 3, m: -3 }, description: '第四主壳层f轨道，复杂对称形态', orbitalType: 'f轨道（高阶对称轨道）' }, shapeFeatures: { shape: '八个瓣，复杂对称分布', symmetry: '关于y轴对称', nodes: '径向节点数：0，角节点数：3' } },
  '4f_zx2-y2': { title: '4f (fz(x²-y²))轨道', basicInfo: { quantumNumbers: { n: 4, l: 3, m: -2 }, description: '第四主壳层f轨道，复杂对称形态', orbitalType: 'f轨道（高阶对称轨道）' }, shapeFeatures: { shape: '八个瓣，复杂对称分布', symmetry: '关于z轴对称', nodes: '径向节点数：0，角节点数：3' } },
  
  // 5f轨道（使用类似4f的描述，但增加径向节点）
  '5f_z3': { title: '5f (fz³)轨道', basicInfo: { quantumNumbers: { n: 5, l: 3, m: 0 }, description: '第五主壳层f轨道，沿z轴高阶对称', orbitalType: 'f轨道（高阶对称轨道）' }, shapeFeatures: { shape: '复杂的瓣状分布，沿z轴对称，带有一个径向节点', symmetry: '关于z轴对称', nodes: '径向节点数：1，角节点数：3' } },
  '5f_xz2': { title: '5f (fxz²)轨道', basicInfo: { quantumNumbers: { n: 5, l: 3, m: 1 }, description: '第五主壳层f轨道，xz平面对称', orbitalType: 'f轨道（高阶对称轨道）' }, shapeFeatures: { shape: '六个瓣，xz平面对称，带有一个径向节点', symmetry: '关于y轴对称', nodes: '径向节点数：1，角节点数：3' } },
  '5f_yz2': { title: '5f (fyz²)轨道', basicInfo: { quantumNumbers: { n: 5, l: 3, m: -1 }, description: '第五主壳层f轨道，yz平面对称', orbitalType: 'f轨道（高阶对称轨道）' }, shapeFeatures: { shape: '六个瓣，yz平面对称，带有一个径向节点', symmetry: '关于x轴对称', nodes: '径向节点数：1，角节点数：3' } },
  '5f_xyz': { title: '5f (fxyz)轨道', basicInfo: { quantumNumbers: { n: 5, l: 3, m: 2 }, description: '第五主壳层f轨道，xyz空间对称', orbitalType: 'f轨道（高阶对称轨道）' }, shapeFeatures: { shape: '八个瓣，空间对称分布，带有一个径向节点', symmetry: '关于三个坐标轴对称', nodes: '径向节点数：1，角节点数：3' } },
  '5f_x(x2-3y2)': { title: '5f (fx(x²-3y²))轨道', basicInfo: { quantumNumbers: { n: 5, l: 3, m: 3 }, description: '第五主壳层f轨道，复杂对称形态', orbitalType: 'f轨道（高阶对称轨道）' }, shapeFeatures: { shape: '八个瓣，复杂对称分布，带有一个径向节点', symmetry: '关于x轴对称', nodes: '径向节点数：1，角节点数：3' } },
  '5f_y(x2-z2)': { title: '5f (fy(x²-z²))轨道', basicInfo: { quantumNumbers: { n: 5, l: 3, m: -3 }, description: '第五主壳层f轨道，复杂对称形态', orbitalType: 'f轨道（高阶对称轨道）' }, shapeFeatures: { shape: '八个瓣，复杂对称分布，带有一个径向节点', symmetry: '关于y轴对称', nodes: '径向节点数：1，角节点数：3' } },
  '5f_zx2-y2': { title: '5f (fz(x²-y²))轨道', basicInfo: { quantumNumbers: { n: 5, l: 3, m: -2 }, description: '第五主壳层f轨道，复杂对称形态', orbitalType: 'f轨道（高阶对称轨道）' }, shapeFeatures: { shape: '八个瓣，复杂对称分布，带有一个径向节点', symmetry: '关于z轴对称', nodes: '径向节点数：1，角节点数：3' } },
  
  // G轨道（新 ID：{n}g_{suffix}，suffix 去首字母 g）
  '5g_z4': { title: '5g (gz⁴)轨道', basicInfo: { quantumNumbers: { n: 5, l: 4, m: 0 }, description: '第五主壳层g轨道，沿z轴超高阶对称', orbitalType: 'g轨道（超高阶轨道）' }, shapeFeatures: { shape: '非常复杂的瓣状分布，沿z轴对称', symmetry: '关于z轴对称', nodes: '径向节点数：0，角节点数：4' } },
  '5g_xz3': { title: '5g (gxz³)轨道', basicInfo: { quantumNumbers: { n: 5, l: 4, m: 1 }, description: '第五主壳层g轨道，xz平面对称', orbitalType: 'g轨道（超高阶轨道）' }, shapeFeatures: { shape: '十个瓣，xz平面对称', symmetry: '关于y轴对称', nodes: '径向节点数：0，角节点数：4' } },
  '5g_yz3': { title: '5g (gyz³)轨道', basicInfo: { quantumNumbers: { n: 5, l: 4, m: -1 }, description: '第五主壳层g轨道，yz平面对称', orbitalType: 'g轨道（超高阶轨道）' }, shapeFeatures: { shape: '十个瓣，yz平面对称', symmetry: '关于x轴对称', nodes: '径向节点数：0，角节点数：4' } },
  '5g_z2x2-y2': { title: '5g (gz²(x²-y²))轨道', basicInfo: { quantumNumbers: { n: 5, l: 4, m: 2 }, description: '第五主壳层g轨道，复杂对称形态', orbitalType: 'g轨道（超高阶轨道）' }, shapeFeatures: { shape: '十二个瓣，复杂对称分布', symmetry: '关于z轴对称', nodes: '径向节点数：0，角节点数：4' } },
  '5g_xyz2': { title: '5g (gxyz²)轨道', basicInfo: { quantumNumbers: { n: 5, l: 4, m: -2 }, description: '第五主壳层g轨道，xyz空间对称', orbitalType: 'g轨道（超高阶轨道）' }, shapeFeatures: { shape: '十二个瓣，空间对称分布', symmetry: '关于三个坐标轴对称', nodes: '径向节点数：0，角节点数：4' } },
  '5g_xzx2-3y2': { title: '5g (gxz(x²-3y²))轨道', basicInfo: { quantumNumbers: { n: 5, l: 4, m: 3 }, description: '第五主壳层g轨道，复杂对称形态', orbitalType: 'g轨道（超高阶轨道）' }, shapeFeatures: { shape: '十二个瓣，复杂对称分布', symmetry: '关于y轴对称', nodes: '径向节点数：0，角节点数：4' } },
  '5g_yzy2-3x2': { title: '5g (gyz(y²-3x²))轨道', basicInfo: { quantumNumbers: { n: 5, l: 4, m: -3 }, description: '第五主壳层g轨道，复杂对称形态', orbitalType: 'g轨道（超高阶轨道）' }, shapeFeatures: { shape: '十二个瓣，复杂对称分布', symmetry: '关于x轴对称', nodes: '径向节点数：0，角节点数：4' } },
  '5g_x4+y4': { title: '5g (gx⁴+y⁴)轨道', basicInfo: { quantumNumbers: { n: 5, l: 4, m: 4 }, description: '第五主壳层g轨道，复杂对称形态', orbitalType: 'g轨道（超高阶轨道）' }, shapeFeatures: { shape: '十六个瓣，xy平面对称', symmetry: '关于x、y轴对称', nodes: '径向节点数：0，角节点数：4' } },
  '5g_xyx2-y2': { title: '5g (gxy(x²-y²))轨道', basicInfo: { quantumNumbers: { n: 5, l: 4, m: -4 }, description: '第五主壳层g轨道，xy平面对称', orbitalType: 'g轨道（超高阶轨道）' }, shapeFeatures: { shape: '十六个瓣，xy平面对称', symmetry: '关于x、y轴对称', nodes: '径向节点数：0，角节点数：4' } }
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
