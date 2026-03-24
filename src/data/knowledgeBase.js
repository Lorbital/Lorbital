/**
 * 扩展知识库数据：面向“原子轨道 -> 分子成键 -> 光谱反应 -> 固体能带”的双语主线。
 * 供 knowledge.html 循环渲染；保留 window.KNOWLEDGE_BASE 以兼容 file:// 脚本加载。
 *
 * Schema:
 * - title/content 使用 { zh, en }
 * - formula 为可选、语言无关字段
 */
window.KNOWLEDGE_BASE = [
  {
    id: 'orbital-quantum-foundation',
    title: { zh: '1 轨道与量子基础', en: '1 Orbitals and Quantum Foundations' },
    children: [
      {
        id: 'm0-1',
        title: { zh: '1.1 量子化与原子光谱', en: '1.1 Quantization and Atomic Spectra' },
        content: [
          { zh: '黑体辐射和光电效应推动了量子理论建立，能量交换呈离散化特征。', en: 'Blackbody radiation and the photoelectric effect drove the development of quantum theory, showing energy exchange is discrete.' },
          { zh: '原子发射/吸收线谱说明电子能级是分立的，跃迁满足能量守恒。', en: 'Atomic emission and absorption lines show discrete electron levels, with transitions obeying energy conservation.' }
        ],
        formula: 'E = h\\nu,\\quad \\Delta E = h\\nu = \\frac{hc}{\\lambda}'
      },
      {
        id: 'm0-2',
        title: { zh: '1.2 德布罗意关系与物质波', en: '1.2 de Broglie Relation and Matter Waves' },
        content: [
          { zh: '电子既有粒子性也有波动性，电子衍射实验直接支持物质波观点。', en: 'Electrons exhibit both particle and wave behavior, and electron diffraction directly supports matter waves.' },
          { zh: '德布罗意关系把动量与波长联系起来，是定态与轨道量子化的重要直觉基础。', en: 'The de Broglie relation links momentum and wavelength, providing intuition for stationary states and orbital quantization.' }
        ],
        formula: '\\lambda = \\frac{h}{p}'
      },
      {
        id: 'm0-3',
        title: { zh: '1.3 波函数与概率密度', en: '1.3 Wavefunction and Probability Density' },
        content: [
          { zh: '波函数 \\(\\psi\\) 描述量子态，\\(|\\psi|^2\\) 给出在空间某处找到粒子的概率密度。', en: 'The wavefunction \\(\\psi\\) describes a quantum state, while \\(|\\psi|^2\\) gives spatial probability density.' },
          { zh: '轨道可视化本质上是在可见化定态的概率分布而不是经典轨迹。', en: 'Orbital visualization is fundamentally a display of stationary-state probability distributions, not classical trajectories.' }
        ],
        formula: '\\int |\\psi|^2\\, d\\tau = 1'
      },
      {
        id: 'm0-4',
        title: { zh: '1.4 薛定谔方程与定态', en: '1.4 Schrödinger Equation and Stationary States' },
        content: [
          { zh: '含时薛定谔方程描述量子态随时间演化，定态方程给出允许能量本征值。', en: 'The time-dependent Schrödinger equation governs time evolution, while the stationary equation yields allowed eigenenergies.' },
          { zh: '在探测器里展示的 3D 轨道形状，通常对应定态空间分布。', en: 'The 3D orbital shapes shown in the Explorer generally represent stationary spatial distributions.' }
        ],
        formula: '\\hat{H}\\Psi = i\\hbar\\frac{\\partial\\Psi}{\\partial t},\\quad \\hat{H}\\psi = E\\psi'
      },
      {
        id: 'm0-5',
        title: { zh: '1.5 氢原子分离变量与量子数', en: '1.5 Separation of Variables and Quantum Numbers in Hydrogen' },
        content: [
          { zh: '氢原子库仑势问题可分离为径向函数与角向函数，得到量子数 \\(n,l,m\\)。', en: 'The hydrogenic Coulomb problem separates into radial and angular parts, yielding quantum numbers \\(n,l,m\\).' },
          { zh: '量子数分别决定轨道尺度、形状和取向，形成 s/p/d/f/g 轨道族。', en: 'These quantum numbers determine orbital scale, shape, and orientation, leading to s/p/d/f/g families.' }
        ],
        formula: '\\psi_{nlm}(r,\\theta,\\phi)=R_{nl}(r)Y_l^m(\\theta,\\phi)'
      },
      {
        id: 'm0-6',
        title: { zh: '1.6 节点结构与波函数相位', en: '1.6 Nodal Structure and Wavefunction Phase' },
        content: [
          { zh: '节点是 \\(\\psi=0\\) 的区域，对应概率密度为零。节点越多，轨道结构越复杂。', en: 'Nodes are regions where \\(\\psi=0\\), so probability density vanishes there; more nodes imply more complex orbitals.' },
          { zh: '波函数正负只代表相位，不代表电荷；可用于区分轨道瓣的符号。', en: 'Positive/negative wavefunction signs represent phase, not charge, and distinguish orbital lobes.' }
        ]
      }
    ]
  },
  {
    id: 'multi-electron-atoms',
    title: { zh: '2 多电子原子与电子排布', en: '2 Multi-Electron Atoms and Electronic Structure' },
    children: [
      {
        id: 'm1-1',
        title: { zh: '2.1 屏蔽、穿透与有效核电荷', en: '2.1 Shielding, Penetration, and Effective Nuclear Charge' },
        content: [
          { zh: '多电子体系中电子-电子排斥会屏蔽核吸引，使外层电子感受到较小的有效核电荷。', en: 'Electron-electron repulsion in many-electron atoms screens nuclear attraction, reducing effective nuclear charge felt by outer electrons.' },
          { zh: '轨道穿透能力决定亚层能量差异，是解释 2s/2p、4s/3d 顺序的重要基础。', en: 'Orbital penetration controls subshell energy differences and is central to understanding 2s/2p and 4s/3d ordering.' }
        ],
        formula: 'Z_{\\mathrm{eff}} \\approx Z - \\sigma'
      },
      {
        id: 'm1-2',
        title: { zh: '2.2 泡利、洪特与构造原理', en: '2.2 Pauli, Hund, and Aufbau Principles' },
        content: [
          { zh: '泡利不相容原理限制同一轨道最多容纳两电子且自旋相反。', en: 'Pauli exclusion limits each orbital to two electrons with opposite spins.' },
          { zh: '洪特规则强调简并轨道先单占并自旋平行，构造原理给出近似填充顺序。', en: 'Hund\'s rule favors singly occupied degenerate orbitals with parallel spins before pairing, while aufbau gives an approximate filling order.' }
        ]
      },
      {
        id: 'm1-3',
        title: { zh: '2.3 4s/3d 顺序与离子化异常', en: '2.3 4s/3d Ordering and Ionization Anomalies' },
        content: [
          { zh: '中性原子常见 4s 先填，但形成过渡金属阳离子时常先失去 4s 电子。', en: 'Neutral atoms often fill 4s first, but transition-metal cations commonly lose 4s electrons first.' },
          { zh: '这一现象反映了屏蔽、交换能与相关效应共同决定的真实能级重排。', en: 'This reflects realistic level reordering driven by shielding, exchange stabilization, and correlation effects.' }
        ]
      },
      {
        id: 'm1-4',
        title: { zh: '2.4 径向分布与轨道尺度', en: '2.4 Radial Distribution and Orbital Scale' },
        content: [
          { zh: '径向分布函数展示电子在不同核距出现的概率，常用于解释原子半径与电离能趋势。', en: 'Radial distributions show probability versus nuclear distance and help explain atomic radius and ionization trends.' },
          { zh: '轨道大小是统计意义上的概率包络，而非具有硬边界的几何实体。', en: 'Orbital size is a probabilistic envelope, not a hard geometric boundary.' }
        ]
      }
    ]
  },
  {
    id: 'atom-model-history',
    title: { zh: '3 原子模型发展史', en: '3 History of Atomic Models' },
    children: [
      {
        id: 'm2-1',
        title: { zh: '3.1 古典原子观与道尔顿', en: '3.1 Classical Atomism and Dalton' },
        content: [
          { zh: '古希腊原子论提出“不可再分”思想，道尔顿把原子概念引入定量化学定律。', en: 'Greek atomism introduced indivisibility, while Dalton integrated atoms into quantitative chemical laws.' }
        ]
      },
      {
        id: 'm2-2',
        title: { zh: '3.2 汤姆逊到卢瑟福', en: '3.2 Thomson to Rutherford' },
        content: [
          { zh: '汤姆逊模型解释了电中性，但卢瑟福散射实验揭示了高密度原子核。', en: 'Thomson\'s model addressed neutrality, but Rutherford scattering revealed a dense nucleus.' },
          { zh: '“核外电子 + 核内正电”结构成为现代原子图景的起点。', en: 'The nucleus-plus-extra-nuclear-electrons picture became the basis of modern atomic structure.' }
        ]
      },
      {
        id: 'm2-3',
        title: { zh: '3.3 玻尔模型与氢光谱', en: '3.3 Bohr Model and Hydrogen Spectra' },
        content: [
          { zh: '玻尔模型用离散轨道与量子跃迁解释了氢原子谱线。', en: 'The Bohr model explained hydrogen spectra with discrete orbits and quantized transitions.' },
          { zh: '其局限在于难以推广到多电子原子、精细结构和复杂化学键。', en: 'Its limitation is poor transferability to multi-electron atoms, fine structure, and complex bonding.' }
        ],
        formula: 'E_n = -\\frac{13.6\\,\\mathrm{eV}}{n^2}'
      },
      {
        id: 'm2-4',
        title: { zh: '3.4 德布罗意、海森堡与薛定谔', en: '3.4 de Broglie, Heisenberg, and Schrödinger' },
        content: [
          { zh: '物质波假说、矩阵力学与波动力学共同推动了量子力学诞生。', en: 'Matter-wave ideas, matrix mechanics, and wave mechanics jointly established quantum mechanics.' },
          { zh: '玻恩概率诠释确立了“电子云”而非经典轨道的现代图像。', en: 'Born\'s interpretation established the electron-cloud picture over classical trajectories.' }
        ]
      }
    ]
  },
  {
    id: 'molecular-bonding-core',
    title: { zh: '4 分子成键理论', en: '4 Molecular Bonding Theories' },
    children: [
      {
        id: 'm3-1',
        title: { zh: '4.1 共价、离子与配位键', en: '4.1 Covalent, Ionic, and Coordinate Bonds' },
        content: [
          { zh: '化学键可看作电子共享与电子转移之间的连续谱，而非绝对二分。', en: 'Chemical bonding is a continuum between electron sharing and transfer rather than a strict dichotomy.' },
          { zh: '电负性差、环境和溶剂共同决定键的极性与离子性。', en: 'Electronegativity differences, environment, and solvent jointly determine bond polarity and ionicity.' }
        ]
      },
      {
        id: 'm3-2',
        title: { zh: '4.2 价键理论与重叠积分', en: '4.2 Valence Bond Theory and Overlap Integral' },
        content: [
          { zh: '价键理论强调定域轨道重叠和电子交换导致的稳定化。', en: 'Valence bond theory emphasizes localized overlap and exchange stabilization.' },
          { zh: '有效重叠越强，共价键通常越短越强。', en: 'Stronger effective overlap generally gives shorter and stronger covalent bonds.' }
        ],
        formula: 'S = \\int \\psi_a\\psi_b\\,d\\tau'
      },
      {
        id: 'm3-3',
        title: { zh: '4.3 杂化轨道与几何', en: '4.3 Hybrid Orbitals and Geometry' },
        content: [
          { zh: 'sp、sp2、sp3 分别对应线形、平面三角、四面体方向性。', en: 'sp, sp2, and sp3 correspond to linear, trigonal planar, and tetrahedral directionality.' },
          { zh: '扩展八隅体分子在教学中常用 sp3d / sp3d2 作为近似几何描述。', en: 'Expanded-octet geometries are often approximated using sp3d/sp3d2 in teaching contexts.' }
        ]
      },
      {
        id: 'm3-4',
        title: { zh: '4.4 分子轨道理论与键级', en: '4.4 Molecular Orbital Theory and Bond Order' },
        content: [
          { zh: '分子轨道由原子轨道线性组合形成，分为成键、反键与非键轨道。', en: 'Molecular orbitals arise from linear combinations of atomic orbitals into bonding, antibonding, and nonbonding levels.' },
          { zh: '键级可由成键与反键电子数差近似估算。', en: 'Bond order can be approximated from bonding-antibonding electron differences.' }
        ],
        formula: '\\mathrm{BO} = \\frac{N_b - N_a}{2}'
      },
      {
        id: 'm3-5',
        title: { zh: '4.5 VSEPR 与量子图像的衔接', en: '4.5 Bridging VSEPR and Quantum Pictures' },
        content: [
          { zh: 'VSEPR 可快速预测构型，MO/VB 则解释几何背后的电子能量起因。', en: 'VSEPR rapidly predicts geometry, while MO/VB explains the electronic-energy origin behind it.' },
          { zh: '教学上先用 VSEPR 建立直观，再用轨道理论深化理解最稳几何。', en: 'Pedagogically, VSEPR builds intuition first, then orbital theory refines why a geometry is most stable.' }
        ]
      }
    ]
  },
  {
    id: 'molecular-symmetry-mo',
    title: { zh: '5 分子对称性与 MO 进阶', en: '5 Symmetry and Advanced MO Analysis' },
    children: [
      {
        id: 'm4-1',
        title: { zh: '5.1 点群与不可约表示', en: '5.1 Point Groups and Irreducible Representations' },
        content: [
          { zh: '分子对称操作定义点群，轨道按不可约表示分类。', en: 'Molecular symmetry operations define point groups, and orbitals are classified by irreducible representations.' },
          { zh: '同对称性匹配是轨道混合与能级耦合的关键筛选规则。', en: 'Symmetry matching is the key selection rule for orbital mixing and level coupling.' }
        ]
      },
      {
        id: 'm4-2',
        title: { zh: '5.2 SALC 与群轨道', en: '5.2 SALCs and Group Orbitals' },
        content: [
          { zh: '等价配体轨道可组合为对称适配线性组合（SALC），再与中心原子轨道耦合。', en: 'Equivalent ligand orbitals form symmetry-adapted linear combinations (SALCs), which then couple with central-atom orbitals.' },
          { zh: '该方法是构建多原子 MO 图和解释简并的标准流程。', en: 'This is the standard workflow for building polyatomic MO diagrams and explaining degeneracies.' }
        ]
      },
      {
        id: 'm4-3',
        title: { zh: '5.3 代表分子：H2O 与 NH3', en: '5.3 Representative Molecules: H2O and NH3' },
        content: [
          { zh: '水分子弯曲结构可由 MO 能级降低解释，不只是“孤对排斥”结论。', en: 'Water\'s bent structure can be explained by MO energy lowering, not only lone-pair repulsion.' },
          { zh: '氨分子体现了孤对电子与对称性共同决定几何和反应性的机制。', en: 'Ammonia shows how lone pairs and symmetry jointly determine geometry and reactivity.' }
        ]
      },
      {
        id: 'm4-4',
        title: { zh: '5.4 代表分子：CH4、CO2、HCN、XeF2', en: '5.4 Representative Molecules: CH4, CO2, HCN, XeF2' },
        content: [
          { zh: 'CH4 展示高对称性与等价键；CO2/HCN 展示线性分子中 sigma/pi 轨道耦合。', en: 'CH4 shows high symmetry and equivalent bonds; CO2/HCN show sigma/pi coupling in linear molecules.' },
          { zh: 'XeF2 的存在可通过 MO 解释，无需依赖过度简化的“强行 d 轨道扩展”叙事。', en: 'MO theory explains the existence of XeF2 without relying on oversimplified forced d-orbital expansion stories.' }
        ]
      }
    ]
  },
  {
    id: 'reactivity-spectroscopy',
    title: { zh: '6 反应与光谱', en: '6 Reactivity and Spectroscopy' },
    children: [
      {
        id: 'm5-1',
        title: { zh: '6.1 前线轨道理论（HOMO/LUMO）', en: '6.1 Frontier Orbital Theory (HOMO/LUMO)' },
        content: [
          { zh: '许多反应可由给体 HOMO 与受体 LUMO 的能量匹配和重叠程度预测。', en: 'Many reactions can be predicted from donor HOMO and acceptor LUMO energy matching and overlap.' },
          { zh: '该框架统一解释 Lewis 酸碱反应、环加成与部分氧化还原路径。', en: 'This framework unifies Lewis acid-base, cycloaddition, and many redox pathways.' }
        ]
      },
      {
        id: 'm5-2',
        title: { zh: '6.2 双键旋转与顺反异构', en: '6.2 Double-Bond Rotation and Cis-Trans Isomerism' },
        content: [
          { zh: '双键旋转要破坏 pi 重叠，势垒远高于单键内旋转。', en: 'Double-bond rotation disrupts pi overlap and has a much higher barrier than single-bond torsion.' },
          { zh: '光激发可改变占据状态，从而触发顺反异构化。', en: 'Photoexcitation can alter orbital occupancy and trigger cis-trans isomerization.' }
        ]
      },
      {
        id: 'm5-3',
        title: { zh: '6.3 Lewis 酸碱的 MO 视角', en: '6.3 MO View of Lewis Acids and Bases' },
        content: [
          { zh: 'Lewis 碱是电子对给体，通常由较高能 HOMO 提供电子。', en: 'A Lewis base donates an electron pair, usually from a relatively high-energy HOMO.' },
          { zh: 'Lewis 酸是电子对受体，通常由较低能 LUMO 接受电子密度。', en: 'A Lewis acid accepts an electron pair, usually into a relatively low-energy LUMO.' }
        ]
      },
      {
        id: 'm5-4',
        title: { zh: '6.4 UV-Vis 吸收与电子跃迁', en: '6.4 UV-Vis Absorption and Electronic Transitions' },
        content: [
          { zh: '紫外-可见吸收来自占据轨道到未占据轨道的电子跃迁，如 n->pi*、pi->pi*。', en: 'UV-Vis absorption arises from electronic excitation from occupied to unoccupied orbitals, such as n->pi* and pi->pi*.' },
          { zh: '共轭增强通常使跃迁能降低，导致吸收波长红移。', en: 'Stronger conjugation usually lowers transition energy, causing red-shifted absorption.' }
        ]
      },
      {
        id: 'm5-5',
        title: { zh: '6.5 比尔-朗伯定律与定量分析', en: '6.5 Beer-Lambert Law and Quantitative Analysis' },
        content: [
          { zh: '吸光度与浓度、光程在稀溶液条件下近似线性。', en: 'Absorbance is approximately linear with concentration and path length in dilute solutions.' },
          { zh: '该关系是 UV-Vis 定量分析的核心，但高吸光度区域会偏离线性。', en: 'This relation is central to UV-Vis quantification, but high absorbance often deviates from linearity.' }
        ],
        formula: 'A = \\varepsilon c l'
      }
    ]
  },
  {
    id: 'intermolecular-solids',
    title: { zh: '7 分子间作用与固体', en: '7 Intermolecular Forces and Solids' },
    children: [
      {
        id: 'm6-1',
        title: { zh: '7.1 静电、诱导与色散作用', en: '7.1 Electrostatic, Induction, and Dispersion Interactions' },
        content: [
          { zh: '分子间作用可分为静电相互作用、诱导作用和伦敦色散作用。', en: 'Intermolecular interactions are commonly grouped into electrostatic, induction, and London dispersion terms.' },
          { zh: '色散作用普遍存在，并随分子可极化性和体积增大而增强。', en: 'Dispersion is universal and strengthens with molecular size and polarizability.' }
        ]
      },
      {
        id: 'm6-2',
        title: { zh: '7.2 氢键的双重本质', en: '7.2 Dual Nature of Hydrogen Bonding' },
        content: [
          { zh: '氢键兼具方向性静电吸引和弱轨道相互作用特征。', en: 'Hydrogen bonding combines directional electrostatic attraction with weak orbital interaction.' },
          { zh: '它显著影响水、分子晶体、生物大分子与溶液结构。', en: 'It strongly influences water, molecular crystals, biomolecules, and solution structure.' }
        ]
      },
      {
        id: 'm6-3',
        title: { zh: '7.3 固体类型与宏观性质', en: '7.3 Solid Types and Macroscopic Properties' },
        content: [
          { zh: '固体可按主导成键分为离子晶体、分子晶体、金属晶体和共价网络。', en: 'Solids can be grouped by dominant bonding into ionic, molecular, metallic, and covalent-network solids.' },
          { zh: '熔点、硬度、导电性等性质直接反映微观成键差异。', en: 'Melting point, hardness, and conductivity directly reflect microscopic bonding differences.' }
        ]
      },
      {
        id: 'm6-4',
        title: { zh: '7.4 能带形成与费米能级', en: '7.4 Band Formation and Fermi Level' },
        content: [
          { zh: '大量原子轨道耦合会形成近连续能带，价带与导带之间可能存在带隙。', en: 'Coupling many atomic orbitals forms quasi-continuous bands, with a possible band gap between valence and conduction bands.' },
          { zh: '费米能级描述电子填充边界，是判断导电行为的重要指标。', en: 'The Fermi level marks the electron filling boundary and is key to conductivity classification.' }
        ]
      },
      {
        id: 'm6-5',
        title: { zh: '7.5 导体、半导体与绝缘体', en: '7.5 Conductors, Semiconductors, and Insulators' },
        content: [
          { zh: '金属通常无有效带隙或能带重叠；绝缘体带隙大；半导体带隙中等。', en: 'Metals typically have no effective gap or overlapping bands; insulators have large gaps; semiconductors have moderate gaps.' },
          { zh: '石墨与金刚石说明同一元素可因成键拓扑不同而呈现截然不同导电性。', en: 'Graphite and diamond show how one element can exhibit drastically different conductivity through different bonding topology.' }
        ]
      }
    ]
  },
  {
    id: 'lorbital-application-layer',
    title: { zh: '8 面向 Lorbital 的应用层', en: '8 Lorbital Application Layer' },
    children: [
      {
        id: 'm7-1',
        title: { zh: '8.1 轨道可视化与化学解释联动', en: '8.1 Linking Visualization with Chemical Meaning' },
        content: [
          { zh: '把点云密度映射到概率密度，把颜色相位映射到轨道瓣符号，有助于从“看见形状”过渡到“理解成键”。', en: 'Mapping point-cloud density to probability and color phase to orbital-sign information helps move from seeing shapes to understanding bonding.' },
          { zh: '节点位置可直接关联反应方向性、重叠效率与跃迁选择。', en: 'Node placement can be directly linked to reaction directionality, overlap efficiency, and transition behavior.' }
        ]
      },
      {
        id: 'm7-2',
        title: { zh: '8.2 AO 到 MO 的学习路径', en: '8.2 Learning Path from AO to MO' },
        content: [
          { zh: '建议按“原子轨道 -> 对称组合 -> 分子轨道 -> 反应与光谱”顺序组织学习。', en: 'A recommended sequence is atomic orbitals -> symmetry combinations -> molecular orbitals -> reactivity and spectroscopy.' },
          { zh: '该路径可减少章节跳跃，提高从单原子到多原子体系的迁移效率。', en: 'This path reduces conceptual jumps and improves transfer from atomic to molecular systems.' }
        ]
      },
      {
        id: 'm7-3',
        title: { zh: '8.3 MO 到能带的连续叙事', en: '8.3 Continuous Story from MO to Bands' },
        content: [
          { zh: '当离域范围从分子扩展到晶体，离散能级逐步演化为能带。', en: 'As delocalization extends from molecules to crystals, discrete levels evolve into energy bands.' },
          { zh: '这一叙事可将分子化学与材料电子结构自然连接。', en: 'This narrative naturally connects molecular chemistry with materials electronic structure.' }
        ]
      },
      {
        id: 'm7-4',
        title: { zh: '8.4 实验导向的知识闭环', en: '8.4 Experiment-Oriented Knowledge Loop' },
        content: [
          { zh: '每个主题建议配套“可视化现象 + 代表实验 + 公式解释”，形成可迁移学习模板。', en: 'For each topic, pair visualization, representative experiments, and formula-based interpretation to build a transferable learning template.' },
          { zh: '例如：轨道形状对应成键方向，光谱峰位对应轨道能级差，导电性对应带隙大小。', en: 'For example: orbital shape maps to bonding direction, spectral peak position maps to level differences, and conductivity maps to band-gap size.' }
        ]
      }
    ]
  }
];
