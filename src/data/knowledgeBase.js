/**
 * 知识库数据：五大模块，列表式小标题与内容 (bilingual zh / en)
 * 供 knowledge.html 循环渲染；与 orbitalKnowledge.js 分工：此为通识，彼为单轨道详情。
 * 使用 window.KNOWLEDGE_BASE 以便经普通 <script src> 加载，避免 ES 模块在 file:// 下不可用。
 *
 * Every `title` and `content[]` string is now a { zh, en } object.
 * The `formula` field is language-neutral.
 */
window.KNOWLEDGE_BASE = [
  {
    id: 'model-origin',
    title: { zh: '1 轨道模型基础', en: '1 Orbital Model Fundamentals' },
    children: [
      {
        id: 'm0-1',
        title: { zh: '1.1 薛定谔方程解', en: '1.1 Solutions to the Schrödinger Equation' },
        content: [
          { zh: '探测器里每一个轨道都是**氢原子定态薛定谔方程**的解。方程在球坐标下分离变量得到 ψ(r,θ,φ)=R(r)·Y(θ,φ)，R 由主量子数 n、角量子数 l 决定（拉盖尔多项式），Y 由 l、m 决定（球谐/实轨道）。',
            en: 'Every orbital in the Explorer is a solution to the **stationary Schrödinger equation for hydrogen**. Separating variables in spherical coordinates gives ψ(r,θ,φ)=R(r)·Y(θ,φ), where R is determined by principal quantum number n and angular quantum number l (Laguerre polynomials), and Y by l and m (spherical harmonics / real orbitals).' },
          { zh: '我们只取**定态**，即不随时间变化的概率分布，所以看到的形状是「某一能量本征态」在空间的分布。',
            en: 'We only show **stationary states** — probability distributions that do not change with time — so the shapes you see represent a particular energy eigenstate\'s spatial distribution.' }
        ],
        formula: '\\psi_{nlm}(r,\\theta,\\phi) = R_{nl}(r) \\, Y_l^m(\\theta,\\phi)'
      },
      {
        id: 'm0-2',
        title: { zh: '1.2 波函数正负相位', en: '1.2 Positive / Negative Phase of the Wave Function' },
        content: [
          { zh: '波函数 ψ 是**可正可负**的实数（在实轨道表象下）。我们规定：**ψ > 0 的点标成红/粉色，ψ < 0 的标成蓝色**。正负不代表电荷，只代表波函数的**相位/符号**；在节点（ψ=0）两侧往往会一边正一边负。',
            en: 'In the real-orbital representation the wave function ψ is a **real number that can be positive or negative**. By convention, **points where ψ > 0 are coloured red/pink, and ψ < 0 blue**. Positive and negative do NOT mean charge — they indicate the **phase/sign** of ψ; on opposite sides of a node (ψ = 0) the sign usually flips.' },
          { zh: '点云文件（PLY）里已按此规则存了每个顶点的颜色；若探测器界面暂时用统一颜色显示，可后续改为读取顶点颜色以还原红蓝。',
            en: 'The point-cloud files (PLY) already store the colour for each vertex following this rule. If the Explorer temporarily uses a uniform colour, it can later be switched to read vertex colours for the red–blue rendering.' }
        ]
      },
      {
        id: 'm0-3',
        title: { zh: '1.3 概率密度分布', en: '1.3 Probability Density Distribution' },
        content: [
          { zh: '点的分布不是均匀的，而是按 **|ψ|²（概率密度）** 来生成的：**概率密度大的区域，点更密；概率密度小的区域，点更疏**。',
            en: 'The points are NOT evenly distributed; they are generated according to **|ψ|² (probability density)**: **regions of higher probability density have denser points; lower probability density regions are sparser**.' },
          { zh: '技术上，我们用**蒙特卡洛拒绝采样**：在空间里随机撒点，按 |ψ|² 决定接受还是拒绝，接受的才画出来。所以「点越密 = 电子在该处出现的概率越大」；节点面上 |ψ|²=0，几乎没有点。',
            en: 'Technically we use **Monte Carlo rejection sampling**: points are scattered randomly in space and accepted or rejected based on |ψ|². Only accepted points are drawn. So "denser points = higher probability of finding the electron there"; on nodal surfaces |ψ|² = 0, so there are virtually no points.' }
        ]
      }
    ]
  },
  {
    id: 'electron-atom',
    title: { zh: '2 电子与原子', en: '2 Electrons and Atoms' },
    children: [
      {
        id: 'm1-1',
        title: { zh: '2.1 电子的基本性质', en: '2.1 Basic Properties of the Electron' },
        content: [
          { zh: '电子是带**负电**的**基本粒子**，质量约为 9.1×10⁻³¹ kg，在原子中绕原子核运动。电子的个数与核内质子数相等时，原子呈电中性。',
            en: 'The electron is a **fundamental particle** carrying a **negative charge**, with a mass of approximately 9.1×10⁻³¹ kg. It moves around the atomic nucleus; when the number of electrons equals the number of protons, the atom is electrically neutral.' }
        ]
      },
      {
        id: 'm1-2',
        title: { zh: '2.2 波粒二象性', en: '2.2 Wave–Particle Duality' },
        content: [
          { zh: '电子既有**粒子性**（有质量、动量、电荷，可打出光点），也有**波动性**。德布罗意关系 λ=h/p：动量越大，波长越短。',
            en: 'Electrons exhibit both **particle properties** (mass, momentum, charge, producing spots of light) and **wave properties**. The de Broglie relation λ = h/p: the greater the momentum, the shorter the wavelength.' },
          { zh: '这种二象性是量子力学的核心，也是「轨道」不再是经典意义上的轨道、而是概率云的原因。',
            en: 'This duality is at the heart of quantum mechanics and is why "orbitals" are no longer classical orbits but probability clouds.' }
        ],
        formula: '\\lambda = \\frac{h}{p}'
      },
      {
        id: 'm1-3',
        title: { zh: '2.3 原子结构', en: '2.3 Atomic Structure' },
        content: [
          { zh: '原子由**原子核**（质子+中子）和**核外电子**组成。原子核集中了几乎全部质量和正电荷，电子在核外；元素的化学性质主要由**质子数（原子序数）**和**核外电子排布**决定。',
            en: 'An atom consists of a **nucleus** (protons + neutrons) and **extra-nuclear electrons**. The nucleus contains nearly all the mass and positive charge; the chemical properties of an element are mainly determined by the **number of protons (atomic number)** and the **electron configuration**.' }
        ]
      },
      {
        id: 'm1-4',
        title: { zh: '2.4 量子轨道概念', en: '2.4 The Quantum Orbital Concept' },
        content: [
          { zh: '经典图像中电子像行星绕日；量子图像中，**轨道（orbital）** 指波函数在空间的分布，即**电子出现概率**的几何形状。s、p、d、f、g 等名字来源于波函数角度部分的形态，不是一条条「实线轨迹」。',
            en: 'In the classical picture electrons orbit the nucleus like planets around the sun. In the quantum picture, an **orbital** describes the spatial distribution of the wave function — the geometric shape of the **electron probability**. Labels s, p, d, f, g come from the angular part of the wave function, not from actual trajectories.' }
        ]
      }
    ]
  },
  {
    id: 'atom-history',
    title: { zh: '3 原子模型发展史', en: '3 History of Atomic Models' },
    children: [
      {
        id: 'm2-1',
        title: { zh: '3.1 古希腊原子论', en: '3.1 Ancient Greek Atomism' },
        content: [
          { zh: '留基伯、德谟克利特等提出万物由不可再分的 **atomos** 构成，不同物质对应不同形状/大小的原子。思辨性、无实验，但是「原子」概念的萌芽。',
            en: 'Leucippus, Democritus and others proposed that everything is made of indivisible **atomos**, with different substances corresponding to atoms of different shapes and sizes. Purely speculative with no experiments, but the seed of the "atom" concept.' }
        ]
      },
      {
        id: 'm2-2',
        title: { zh: '3.2 道尔顿原子模型', en: '3.2 Dalton\'s Atomic Model' },
        content: [
          { zh: '道尔顿用原子解释质量守恒、定比、倍比等定律：原子不可分、同种原子相同、化合是原子的结合。原子被视为**实心小球**，无内部结构。',
            en: 'Dalton used atoms to explain the laws of conservation of mass, definite proportions and multiple proportions: atoms are indivisible, identical atoms of the same element are alike, and chemical combination is the union of atoms. Atoms were viewed as **solid spheres** with no internal structure.' }
        ]
      },
      {
        id: 'm2-3',
        title: { zh: '3.3 汤姆逊模型', en: '3.3 Thomson\'s Model' },
        content: [
          { zh: '发现电子后，汤姆逊提出原子是**均匀正电球体**，电子像葡萄干嵌在其中。能解释电中性，但无法解释 α 粒子大角度散射。',
            en: 'After the discovery of the electron, Thomson proposed that the atom is a **uniform sphere of positive charge** with electrons embedded like raisins in a pudding. It explained electrical neutrality but could not explain large-angle α-particle scattering.' }
        ]
      },
      {
        id: 'm2-4',
        title: { zh: '3.4 卢瑟福核模型', en: '3.4 Rutherford\'s Nuclear Model' },
        content: [
          { zh: '卢瑟福（盖革、马斯登）的 α 散射实验表明：正电荷和绝大部分质量集中在**极小的原子核**，原子大部分是**空**的，电子在核外。但经典电磁学下，绕转的电子会辐射并塌缩到核，无法解释原子稳定性。',
            en: 'Rutherford\'s (Geiger & Marsden) α-scattering experiment showed that positive charge and nearly all mass are concentrated in a **tiny nucleus**; most of the atom is **empty space** with electrons outside. However, classical electrodynamics predicts that orbiting electrons would radiate and spiral into the nucleus, failing to explain atomic stability.' }
        ]
      },
      {
        id: 'm2-5',
        title: { zh: '3.5 玻尔量子模型', en: '3.5 Bohr\'s Quantum Model' },
        content: [
          { zh: '玻尔假定**定态轨道**和**量子化跃迁**：只有某些半径/能量是允许的，电子在定态不辐射；跃迁时吸收/发射光子，E_n=−13.6/n² eV。成功解释氢光谱，但无法处理多电子、精细结构、化学键等。',
            en: 'Bohr postulated **stationary orbits** and **quantised transitions**: only certain radii / energies are allowed; electrons do not radiate in stationary states. Transitions absorb / emit photons with E_n = −13.6/n² eV. Successfully explains the hydrogen spectrum but cannot handle multi-electron atoms, fine structure, or chemical bonds.' }
        ],
        formula: 'E_n = -\\frac{13.6\\,\\text{eV}}{n^2}'
      },
      {
        id: 'm2-6',
        title: { zh: '3.6 德布罗意物质波', en: '3.6 De Broglie\'s Matter Waves' },
        content: [
          { zh: '德布罗意赋予电子波长 λ=h/p，用**驻波**解释玻尔轨道的量子化：周长=波长整数倍。为「电子是波」提供概念基础。',
            en: 'De Broglie assigned a wavelength λ = h/p to the electron and used **standing waves** to explain Bohr orbit quantisation: circumference = integer multiple of wavelength. This provided the conceptual basis for "electrons are waves."' }
        ]
      },
      {
        id: 'm2-7',
        title: { zh: '3.7 量子力学的诞生', en: '3.7 Birth of Quantum Mechanics' },
        content: [
          { zh: '海森堡等人的**矩阵力学**用算符、本征值描述可观测量；薛定谔的**波动力学**用波函数 ψ 和薛定谔方程，二者数学等价。',
            en: 'Heisenberg\'s **matrix mechanics** uses operators and eigenvalues to describe observables; Schrödinger\'s **wave mechanics** uses the wave function ψ and the Schrödinger equation. The two formulations are mathematically equivalent.' }
        ]
      },
      {
        id: 'm2-8',
        title: { zh: '3.8 概率诠释', en: '3.8 The Probabilistic Interpretation' },
        content: [
          { zh: '薛定谔方程给出 ψ 的演化；玻恩提出 **|ψ|² 为概率密度**，电子不再有确定轨迹，只有概率分布。这奠定了现代「轨道=概率云」的图像。',
            en: 'The Schrödinger equation governs the evolution of ψ. Born proposed that **|ψ|² is the probability density**: electrons no longer have definite trajectories, only probability distributions. This established the modern picture of "orbitals = probability clouds."' }
        ]
      },
      {
        id: 'm2-9',
        title: { zh: '3.9 现代原子模型', en: '3.9 The Modern Atomic Model' },
        content: [
          { zh: '查德威克发现**中子**，原子核由质子+中子组成得以确认；现代图像：核 + 电子云，电子由波函数/轨道描述。',
            en: 'Chadwick discovered the **neutron**, confirming the nucleus is composed of protons and neutrons. The modern picture: nucleus + electron cloud, with electrons described by wave functions / orbitals.' }
        ]
      }
    ]
  },
  {
    id: 'wave-schrodinger',
    title: { zh: '4 波函数与薛定谔方程', en: '4 Wave Functions and the Schrödinger Equation' },
    children: [
      {
        id: 'm3-1',
        title: { zh: '4.1 波函数定义', en: '4.1 Definition of the Wave Function' },
        content: [
          { zh: 'ψ(r,t) 是描述量子态的**复数函数**，本身不直接可观；**玻恩诠释**：|ψ|² 表示在该处找到粒子的**概率密度**。',
            en: 'ψ(r, t) is a **complex function** describing the quantum state; it is not directly observable. **Born\'s interpretation**: |ψ|² gives the **probability density** of finding the particle at that location.' }
        ]
      },
      {
        id: 'm3-2',
        title: { zh: '4.2 含时薛定谔方程', en: '4.2 Time-Dependent Schrödinger Equation' },
        content: [
          { zh: '若哈密顿算符 Ĥ 不显含时间 t，可分离变量得到定态。',
            en: 'If the Hamiltonian Ĥ does not explicitly depend on time t, separation of variables yields stationary states.' }
        ],
        formula: '\\hat{H}\\Psi(\\mathbf{r}, t) = i\\hbar \\frac{\\partial}{\\partial t}\\Psi(\\mathbf{r}, t)'
      },
      {
        id: 'm3-3',
        title: { zh: '4.3 定态方程', en: '4.3 Stationary-State Equation' },
        content: [
          { zh: '定态波函数 Ψ = ψ(r) e^{-iEt/ℏ}，概率密度 |Ψ|² 与时间无关，故我们画的 3D 是**定态**的形状。',
            en: 'The stationary-state wave function is Ψ = ψ(r) e^{−iEt/ℏ}. The probability density |Ψ|² is time-independent, so the 3D shapes we render are **stationary-state** shapes.' }
        ],
        formula: '\\hat{H}\\psi = E\\psi'
      },
      {
        id: 'm3-4',
        title: { zh: '4.4 氢原子哈密顿量', en: '4.4 The Hydrogen Atom Hamiltonian' },
        content: [
          { zh: '球坐标下分离变量：ψ_{nlm}=R_{nl}(r) Y_l^m(θ,φ)。其中 Z=1 为氢原子。',
            en: 'Separating variables in spherical coordinates: ψ_{nlm} = R_{nl}(r) Y_l^m(θ, φ). Z = 1 for hydrogen.' }
        ],
        formula: '\\hat{H} = -\\frac{\\hbar^2}{2\\mu}\\nabla^2 - \\frac{Ze^2}{4\\pi\\varepsilon_0 r}'
      },
      {
        id: 'm3-5',
        title: { zh: '4.5 径向波函数', en: '4.5 Radial Wave Function' },
        content: [
          { zh: 'R_{nl} 含 ρ^l e^{-ρ/2} L_{n−l−1}^{2l+1}(ρ)，ρ=2r/(na_0)。拉盖尔多项式带来**径向节点**。',
            en: 'R_{nl} contains ρ^l e^{−ρ/2} L_{n−l−1}^{2l+1}(ρ), where ρ = 2r/(na₀). The associated Laguerre polynomials give rise to **radial nodes**.' }
        ],
        formula: 'R_{nl}(r) \\propto \\rho^l e^{-\\rho/2} L_{n-l-1}^{2l+1}(\\rho), \\quad \\rho = \\frac{2r}{n a_0}'
      },
      {
        id: 'm3-6',
        title: { zh: '4.6 角向波函数', en: '4.6 Angular Wave Function' },
        content: [
          { zh: 'Y_l^m 或其实线性组合（实轨道）决定 s、p、d、f、g 的形状和**角节点**。',
            en: 'Y_l^m or its real linear combinations (real orbitals) determine the shapes and **angular nodes** of s, p, d, f, g orbitals.' }
        ]
      }
    ]
  },
  {
    id: 'wave-detail',
    title: { zh: '5 波函数详解', en: '5 Wave Function In-depth' },
    children: [
      {
        id: 'm4-1',
        title: { zh: '5.1 概率密度', en: '5.1 Probability Density' },
        content: [
          { zh: '在 (r,θ,φ) 处 dτ 内找到粒子的概率为 |ψ|² dτ。定态下 |ψ|² 不含 t。我们点云的**密度**正比于 |ψ|²。',
            en: 'The probability of finding the particle within dτ at (r, θ, φ) is |ψ|² dτ. In a stationary state |ψ|² is time-independent. The **density** of our point cloud is proportional to |ψ|².' }
        ]
      },
      {
        id: 'm4-2',
        title: { zh: '5.2 波函数归一化', en: '5.2 Normalisation of the Wave Function' },
        content: [
          { zh: '表示粒子必在空间某处。氢原子解有标准化归一化系数。',
            en: 'This states that the particle must be somewhere in space. The hydrogen atom solutions come with standard normalisation coefficients.' }
        ],
        formula: '\\int |\\psi|^2 \\, d\\tau = 1'
      },
      {
        id: 'm4-3',
        title: { zh: '5.3 相位与符号', en: '5.3 Phase and Sign' },
        content: [
          { zh: '实轨道下 ψ 可正可负；正负代表**相位**，不是电荷。乘以 e^{iθ} 不改变 |ψ|²；我们用**红/蓝**区分正负以便看出节面两侧。',
            en: 'In the real-orbital form ψ can be positive or negative; this sign represents **phase**, not charge. Multiplying by e^{iθ} does not change |ψ|²; we use **red / blue** to distinguish positive and negative so the nodal surface is clearly visible.' }
        ]
      },
      {
        id: 'm4-4',
        title: { zh: '5.4 节点结构', en: '5.4 Nodal Structure' },
        content: [
          { zh: '**节点**：ψ=0 的面或线，|ψ|²=0，几乎无点。**径向节点数** = n−l−1（球壳状）；**角节点数** = l（平面或锥面等）。**总节点数** = n−1。s: 仅径向；p: 1 个角节点（一平面）；d: 2 个角节点；f、g 类推。',
            en: '**Nodes** are surfaces or lines where ψ = 0 (hence |ψ|² = 0, virtually no points). **Radial nodes** = n − l − 1 (spherical shells). **Angular nodes** = l (planes, cones, etc.). **Total nodes** = n − 1. s: radial only; p: 1 angular node (a plane); d: 2 angular nodes; f and g follow the same pattern.' }
        ]
      },
      {
        id: 'm4-5',
        title: { zh: '5.5 量子数', en: '5.5 Quantum Numbers' },
        content: [
          { zh: '**n**：主量子数，能量与尺度，E∝−1/n²；**l**：角量子数，形状（s/p/d/f/g），l=0,…,n−1；**m**：磁量子数，空间取向，m=−l,…,+l。我们的实轨道是复 Y_l^m 的线性组合，名称如 px、py、pz、dxy、dz² 等。各轨道的 n、l、m 见探测器中的说明。',
            en: '**n**: principal quantum number — energy and size, E ∝ −1/n². **l**: angular (azimuthal) quantum number — shape (s/p/d/f/g), l = 0, …, n−1. **m**: magnetic quantum number — spatial orientation, m = −l, …, +l. Our real orbitals are real linear combinations of complex Y_l^m, named px, py, pz, dxy, dz², etc. See the Explorer for each orbital\'s n, l, m.' }
        ]
      },
      {
        id: 'm4-6',
        title: { zh: '5.6 实轨道与复轨道', en: '5.6 Real Orbitals vs Complex Orbitals' },
        content: [
          { zh: '复轨道 Y_l^m 含 e^{imφ}；化学中常用**实轨道**（如 px, py, pz; dxy, dyz, dxz, dx²−y², dz²），由 Y_l^m 的实线性组合得到，便于可视化与成键讨论。model.py 中的角向部分即实轨道。',
            en: 'Complex orbitals Y_l^m contain e^{imφ}. Chemistry commonly uses **real orbitals** (e.g. px, py, pz; dxy, dyz, dxz, dx²−y², dz²), obtained as real linear combinations of Y_l^m, convenient for visualisation and bonding discussions. The angular part in model.py uses real orbitals.' }
        ]
      }
    ]
  }
];
