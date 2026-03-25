/**
 * 知识库：由中英 Word 稿解析；第 9 章为参考文献与整理说明（含 AI 辅助说明）；
 * 表格保留为 HTML；关键式以块级公式附于小节末。
 */
window.KNOWLEDGE_BASE = [
  {
    id: "orbital-quantum-foundation",
    title: { zh: "1 轨道与量子基础", en: "1 Orbitals and Quantum Foundations" },
    children: [
      {
        id: "m0-1",
        title: { zh: "1.1 量子化与原子光谱", en: "1.1 Quantization and Atomic Spectra" },
        content: [
          { zh: "在经典物理学中，加速运动的电荷应当连续辐射电磁波。然而，当科学家观察高温气体放电时，发现原子发出的并非连续光谱，而是具有特定波长的离散线状光谱（如氢原子的巴耳末系）。1900年，马克斯·普朗克（Max Planck）提出能量量子化假说（\\(E=h\\nu\\)），标志着量子理论的诞生。结合普朗克公式与经典力学，尼尔斯·玻尔（Niels Bohr）解释了氢原子的离散发射与吸收光谱，证明了电子只能在特定的“定态”轨道上运行，且轨道角动量是量子化的（\\(L=n\\hbar\\)）。这一模型成功推导出了里德伯公式（Rydberg formula）背后的物理常数，揭示了光谱线与能级跃迁（\\(\\Delta E=h\\nu\\)）之间的直接关联。", en: "In classical physics, accelerating charges should continuously radiate electromagnetic waves. However, when scientists observed high-temperature gas discharges, they found that atoms emitted discrete line spectra at specific wavelengths (such as the Balmer series for hydrogen) rather than continuous spectra. In 1900, Max Planck proposed the energy quantization hypothesis (\\(E=h\\nu\\)), marking the birth of quantum theory. Combining Planck's formula with classical mechanics, Niels Bohr explained the discrete emission and absorption spectra of the hydrogen atom, proving that electrons can only travel in specific \"stationary\" orbits, and that orbital angular momentum is quantized (\\(L=n\\hbar\\)). This model successfully derived the physical constants behind the Rydberg formula, revealing the direct correlation between spectral lines and energy level transitions (\\(\\Delta E=h\\nu\\))." },
          { zh: "<div class=\"formula-box\">$$ E = h\\nu,\\quad \\Delta E = \\frac{hc}{\\lambda} $$</div>", en: "<div class=\"formula-box\">$$ E = h\\nu,\\quad \\Delta E = \\frac{hc}{\\lambda} $$</div>" },
        ]
      },
      {
        id: "m0-2",
        title: { zh: "1.2 德布罗意关系与物质波", en: "1.2 de Broglie Relation and Matter Waves" },
        content: [
          { zh: "玻尔模型虽然在解释氢原子光谱上取得了成功，但其设定的固定轨道仍基于经典力学框架。1924年，路易·德布罗意（Louis de Broglie）从光子的波粒二象性中获得启发，提出了物质波假说，指出任何具有质量 \\(m\\) 和速度 \\(v\\) 的运动粒子都伴随着特定的波长 \\(\\lambda\\)，即德布罗意关系式为 \\(\\lambda=h/p\\)。这一假说随后被戴维森-革末（Davisson-Germer）的电子衍射实验证实，表明电子具有波的干涉与衍射特性。物质波概念否定了电子具有经典确定轨道的模型，为建立现代波动力学铺平了道路。", en: "Although the Bohr model succeeded in explaining the hydrogen spectrum, its fixed orbits were still rooted in the framework of classical mechanics. In 1924, Louis de Broglie, inspired by the wave-particle duality of photons, proposed the matter wave hypothesis, stating that any moving particle with mass \\(m\\) and velocity \\(v\\) is accompanied by wavelength \\(\\lambda\\), expressed by the de Broglie relation \\(\\lambda=h/p\\). This hypothesis was subsequently confirmed by the Davisson-Germer electron diffraction experiment, which demonstrated that electrons exhibit wave interference and diffraction properties. The concept of matter waves negated the possibility of electrons having classically defined orbits, paving the way for modern wave mechanics." },
          { zh: "<div class=\"formula-box\">$$ \\lambda = \\frac{h}{p} $$</div>", en: "<div class=\"formula-box\">$$ \\lambda = \\frac{h}{p} $$</div>" },
        ]
      },
      {
        id: "m0-3",
        title: { zh: "1.3 波函数与概率密度", en: "1.3 Wavefunctions and Probability Density" },
        content: [
          { zh: "如果电子表现出波动性，那么它应当遵循特定的波动方程。马克斯·玻恩（Max Born）提出了波函数统计诠释：波函数 \\(\\psi\\) 本身不具有直接的可观测物理量，但其模的平方 \\(|\\psi|^2\\)（或概率密度）代表了在空间某一体积元 \\(d\\tau\\) 处找到该粒子的概率密度。根据归一化条件，粒子在全空间内存在的总概率必须为1：", en: "If an electron exhibits wave properties, it must obey a specific wave equation. Max Born proposed the statistical interpretation of the wavefunction: the wavefunction \\(\\psi\\) itself does not represent a directly observable physical quantity, but its modulus squared \\(|\\psi|^2\\) represents the probability density of finding the particle at a specific volume element \\(d\\tau\\) in space. According to the normalization condition, the total probability of finding the particle within the entire space must equal 1:" },
          { zh: "这一概率诠释与维尔纳·海森堡（Werner Heisenberg）提出的不确定性原理（\\(\\Delta x\\,\\Delta p \\geq \\hbar/2\\)）在逻辑上相一致：由于波的弥散性质，无法同时精确测定电子的位置与动量。因此，原子中的电子不再被视为在特定轨道上运转的质点，而是被描述为分布在原子核周围的“电子云”。", en: "This probabilistic interpretation is logically consistent with Werner Heisenberg's uncertainty principle (\\(\\Delta x\\,\\Delta p \\geq \\hbar/2\\)): due to the dispersive nature of waves, it is impossible to simultaneously and precisely determine an electron's position and momentum. Therefore, electrons in an atom are no longer viewed as point masses rotating in specific orbits, but are instead described as \"electron clouds\" distributed around the nucleus." },
          { zh: "<div class=\"formula-box\">$$ \\int |\\psi|^2\\, d\\tau = 1 $$</div>", en: "<div class=\"formula-box\">$$ \\int |\\psi|^2\\, d\\tau = 1 $$</div>" },
        ]
      },
      {
        id: "m0-4",
        title: { zh: "1.4 薛定谔方程与定态", en: "1.4 Schrödinger Equation and Stationary States" },
        content: [
          { zh: "1926年，埃尔温·薛定谔（Erwin Schrödinger）提出了描述微观粒子物质波演化的偏微分方程。对于不随时间演化的定态系统，时间无关的薛定谔方程构成了一个本征值问题：", en: "In 1926, Erwin Schrödinger proposed a partial differential equation describing the evolution of matter waves for microscopic particles. For stationary systems that do not evolve with time, the time-independent Schrödinger equation poses an eigenvalue problem:" },
          { zh: "其中，\\(\\hat{H}\\) 为哈密顿算符（Hamiltonian operator），包含了体系的动能算符（\\(\\hat{T}\\)）与势能算符（\\(\\hat{V}\\)），\\(E\\) 则是体系的总能量本征值。求解该方程即寻找满足特定边界条件的波函数解。对于被限制在特定空间内（如一维势箱）的粒子，物理边界条件迫使其波函数只能采取特定的驻波形式，从而在数学上自然推导出了能量的量子化现象（离散能级）。", en: "Here, \\(\\hat{H}\\) is the Hamiltonian operator, including \\(\\hat{T}\\) and \\(\\hat{V}\\), while \\(E\\) is the total energy eigenvalue of the system. Solving this equation means finding a wavefunction that satisfies specific boundary conditions. For a particle confined within a specific space (like a 1D particle in a box), physical boundary conditions force its wavefunction to adopt specific standing wave forms, which mathematically derives the phenomenon of energy quantization (discrete \\(E_n\\))." },
          { zh: "<div class=\"formula-box\">$$ \\hat{H}\\Psi = i\\hbar\\frac{\\partial\\Psi}{\\partial t},\\quad \\hat{H}\\psi = E\\psi $$</div>", en: "<div class=\"formula-box\">$$ \\hat{H}\\Psi = i\\hbar\\frac{\\partial\\Psi}{\\partial t},\\quad \\hat{H}\\psi = E\\psi $$</div>" },
        ]
      },
      {
        id: "m0-5",
        title: { zh: "1.5 氢原子分离变量与量子数", en: "1.5 Hydrogen Atom Separation of Variables and Quantum Numbers" },
        content: [
          { zh: "对于氢原子或类氢离子（如 \\(\\mathrm{He}^+\\)、\\(\\mathrm{Li}^{2+}\\)），由于势能项 \\(V(r)=-Ze^2/(4\\pi\\varepsilon_0 r)\\) 具有球对称性，薛定谔方程可在球极坐标系 \\((r,\\theta,\\phi)\\) 中通过分离变量法精确求解。波函数 \\(\\psi_{nlm}\\) 被分解为径向波函数 \\(R_{nl}(r)\\) 和角向波函数 \\(Y_{l}^{m}(\\theta,\\phi)\\) 的乘积。 方程在满足边界条件时产生了三个描述原子轨道的量子数：", en: "For the hydrogen atom or hydrogen-like ions (e.g., He+, Li2+), since the potential \\(V(r)\\propto -1/r\\) possesses spherical symmetry, the Schrödinger equation can be solved precisely using the separation of variables method in spherical coordinates \\((r,\\theta,\\phi)\\). The wavefunction \\(\\psi_{nlm}\\) separates into radial \\(R_{nl}(r)\\) and angular \\(Y_l^{m}(\\theta,\\phi)\\). When satisfying boundary conditions, the equation generates three quantum numbers that describe atomic orbitals:" },
          { zh: "主量子数 \\(n\\)：决定能级与轨道主要尺度。", en: "Principal quantum number \\(n\\): sets the main energy scale and radial extent." },
          { zh: "角量子数 \\(l\\)：决定轨道形状（\\(s,p,d,f\\)），满足 \\(0\\le l\\le n-1\\)。", en: "Azimuthal quantum number \\(l\\): shapes \\(s,p,d,f\\); \\(0\\le l\\le n-1\\)." },
          { zh: "磁量子数 \\(m\\)：决定轨道取向；满足 \\(|m|\\le l\\)，取值 \\(m=-l,\\ldots,+l\\)。 类氢原子能量仅由主量子数 \\(n\\) 决定：\\(E_n=-R_\\infty Z^2/n^2\\)，呈现出与玻尔模型一致的能级公式，但摒弃了固定轨道的概念。", en: "Magnetic quantum number \\(m\\): orientation; \\(|m|\\le l\\). For hydrogen-like atoms, \\(E_n=-R_\\infty Z^2/n^2\\), presenting an energy level formula consistent with the Bohr model but completely discarding the concept of fixed orbits." },
          { zh: "<div class=\"formula-box\">$$ \\psi_{nlm}(r,\\theta,\\phi)=R_{nl}(r)Y_l^m(\\theta,\\phi) $$</div>", en: "<div class=\"formula-box\">$$ \\psi_{nlm}(r,\\theta,\\phi)=R_{nl}(r)Y_l^m(\\theta,\\phi) $$</div>" },
        ]
      },
      {
        id: "m0-6",
        title: { zh: "1.6 节点结构与波函数相位", en: "1.6 Nodal Structure and Wavefunction Phase" },
        content: [
          { zh: "原子轨道作为三维空间中的驻波，存在振幅为零的节点（Nodes）。节点总数 \\(n-1\\)，其中包含 \\(l\\) 个角向节点（表现为节面或节锥）和 \\(n-l-1\\) 个径向节点（表现为球面）。跨越任何一个节点时，波函数的数学相位（正负号）发生反转。波函数的相位在孤立原子中不影响电子的概率密度（因 \\(|\\psi|^2\\) 始终为非负值），但在分子成键过程中，不同原子轨道相位的匹配直接决定了重叠积分的正负，进而决定是形成建设性的成键作用还是破坏性的反键作用。", en: "As standing waves in 3D space, atomic orbitals possess nodes where the amplitude is zero. Node count is \\(n-1\\), with \\(l\\) angular nodes (manifested as nodal planes or cones) and \\(n-l-1\\) radial nodes (manifested as spherical nodes). Crossing any node causes the mathematical phase (positive or negative sign) of the wavefunction to reverse. In an isolated atom, the phase of the wavefunction does not affect the probability density of the electron (since \\(|\\psi|^2\\) is always non-negative). However, during molecular bond formation, the phase matching between different atomic orbitals directly dictates whether the overlap integral is positive or negative, which in turn determines whether the interaction is a constructive bonding interaction or a destructive antibonding interaction." },
        ]
      },
    ]
  },
  {
    id: "multi-electron-atoms",
    title: { zh: "2 多电子原子与电子排布", en: "2 Multi-Electron Atoms and Electron Configurations" },
    children: [
      {
        id: "m1-1",
        title: { zh: "2.1 屏蔽、穿透与有效核电荷", en: "2.1 Shielding, Penetration, and Effective Nuclear Charge" },
        content: [
          { zh: "多电子体系中引入了电子-电子之间的库仑斥力项（\\(e^2/(4\\pi\\varepsilon_0 r_{ij})\\)），导致薛定谔方程无法精确求解。在独立粒子模型近似下，研究引入了“有效核电荷（\\(Z_{\\mathrm{eff}}\\)）”的概念。 内层电子部分遮蔽了原子核对外部电子的吸引力，这种现象称为屏蔽效应。通过分析径向分布函数（Radial Distribution Function, RDF，即在距离核 \\(r\\) 处薄球壳内电子径向分布 \\(\\propto 4\\pi r^2|R_{nl}|^2\\)），可以观察到 \\(s\\) 轨道的电子云在靠近原子核的区域存在一定的概率峰。这种“穿透效应（Penetration）”使得 \\(s\\) 轨道电子能够部分避开内层电子的屏蔽，感受到比同层 \\(p\\) 轨道或 \\(d\\) 轨道更高的有效核电荷。这一物理机制打破了单电子原子中同一主量子数下的能级简并，导致多电子原子中 \\(E_{ns}<E_{np}\\) 等的能量顺序。", en: "In multi-electron systems, the introduction of the electron-electron Coulombic repulsion (\\(e^2/4\\pi\\varepsilon_0 r_{ij}\\)) makes the Schrödinger equation impossible to solve exactly. Under the Independent Particle Model approximation, the concept of \"effective nuclear charge \\(Z_{\\mathrm{eff}}\\)\" was introduced. Inner-shell electrons partially shield the attractive force of the nucleus on outer electrons; this phenomenon is called the shielding effect. By analyzing the Radial Distribution Function (RDF, which represents the probability of finding an electron in an infinitely thin shell proportional to \\(4\\pi r^2|R|^2\\) at radius \\(r\\). It can be observed that the \\(s\\)-orbital electron cloud has distinct probability peaks close to the nucleus. This \"penetration effect\" allows s-orbital electrons to partially evade the shielding of inner electrons, thus feeling a higher effective nuclear charge compared to p or d orbitals in the same shell. This physical mechanism breaks the energy degeneracy of orbitals with the same principal quantum number found in single-electron atoms, yielding \\(E_{ns}<E_{np}\\) type ordering in multi-electron atoms." },
          { zh: "<table class=\"kb-table\"><tr><th>元素</th><th>1s Zeff​</th><th>2s Zeff​</th><th>2p Zeff​</th></tr><tr><td>铍 (Be)</td><td>3.68</td><td>1.91</td><td>-</td></tr><tr><td>碳 (C)</td><td>5.67</td><td>3.22</td><td>3.14</td></tr><tr><td>氧 (O)</td><td>7.66</td><td>4.49</td><td>4.45</td></tr><tr><td>氖 (Ne)</td><td>9.64</td><td>5.76</td><td>5.76</td></tr></table>", en: "<table class=\"kb-table\"><tr><th>Element</th><th>1s Zeff</th><th>2s Zeff</th><th>2p Zeff</th></tr><tr><td>Beryllium (Be)</td><td>3.68</td><td>1.91</td><td>-</td></tr><tr><td>Carbon (C)</td><td>5.67</td><td>3.22</td><td>3.14</td></tr><tr><td>Oxygen (O)</td><td>7.66</td><td>4.49</td><td>4.45</td></tr><tr><td>Neon (Ne)</td><td>9.64</td><td>5.76</td><td>5.76</td></tr></table>" },
        ]
      },
      {
        id: "m1-2",
        title: { zh: "2.2 泡利、洪特与构造原理", en: "2.2 Pauli, Hund, and the Aufbau Principle" },
        content: [
          { zh: "决定多电子原子基态排布的逻辑体系由三大原则构成。构造原理（Aufbau principle）规定电子优先填入能量最低的可用轨道。泡利不相容原理（Pauli exclusion principle）要求同一原子内不能有两个电子具有完全相同的四个量子数，这意味着每一个轨道最多只能容纳两个自旋相反（\\(\\uparrow\\downarrow\\)）的电子。当电子进入能量简并的轨道（如三个 \\(p\\) 轨道）时，洪特规则（Hund's rule of maximum multiplicity）指出，电子倾向于以平行的自旋状态分占不同的轨道。平行自旋促使电子在空间上保持较远距离，从而降低了电子-电子之间的库仑排斥能，提升了体系的稳定性。", en: "The logical system dictating the ground-state electron configuration of multi-electron atoms consists of three major principles. The Aufbau principle dictates that electrons preferentially occupy the lowest energy available orbitals. The Pauli exclusion principle requires that no two electrons in the same atom can have the exact same set of four quantum numbers, implying that each orbital can hold a maximum of two electrons with opposite spins (\\(\\uparrow\\downarrow\\)). When electrons enter energy-degenerate orbitals (such as the three \\(p\\) orbitals), Hund's rule of maximum multiplicity states that electrons tend to occupy different orbitals singly with parallel spins. Parallel spins force electrons to stay further apart in space, thereby minimizing the electron-electron Coulombic repulsion energy and enhancing the overall stability of the system." },
        ]
      },
      {
        id: "m1-3",
        title: { zh: "2.3 4s/3d 顺序与离子化异常", en: "2.3 4s/3d Order and Ionization Anomalies" },
        content: [
          { zh: "在第四周期元素的电子排布中，\\(4s\\) 与 \\(3d\\) 轨道能量的相对高低是典型现象。对钾（K）、钙（Ca）而言，\\(4s\\) 穿透更强，能量通常低于 \\(3d\\)，故先占据 \\(4s\\)。进入过渡金属（如 Sc）后，随原子序数 \\(Z\\) 增大，\\(3d\\) 感受到的有效核电荷上升更明显而其能量可降至 \\(4s\\) 之下。尽管如此，Sc 的基态仍为 \\([\\mathrm{Ar}]\\,4s^2\\,3d^1\\)：\\(3d\\) 更紧凑，若价电子全部挤入 \\(3d\\) 会显著增大电子–电子排斥；部分电子保留在更弥散的 \\(4s\\) 有利于降低总能量。过渡金属电离时，排斥减弱且 \\(Z_{\\mathrm{eff}}\\) 增大，\\(3d\\) 常稳定低于 \\(4s\\)；故阳离子（如 \\(\\mathrm{Fe}^{2+}\\) \\([\\mathrm{Ar}]\\,3d^6\\)）往往优先失去外层更弥散的 \\(4s\\) 电子。", en: "In the electron configuration of Period 4 elements, the relative energy levels of the 4s and 3d orbitals present a classic scenario. For Potassium (K) and Calcium (Ca), due to the strong penetration effect of the 4s orbital, its energy is lower than the 3d orbital, so electrons occupy the 4s orbital first. Entering the transition metals (like Scandium, Sc), as the atomic number Z increases, the shielding provided by the inner core grows but gradually slows down. The 3d orbitals, which lack strong penetration capability, experience an increasingly higher effective nuclear charge, causing their energy to drop below that of the 4s orbital. Despite this, the ground-state electron configuration of Sc is [Ar]4s2 3d1. The reason lies in the fact that the 3d orbital is relatively compact in its spatial distribution. If all valence electrons were forced into 3d orbitals, it would induce high electron-electron repulsion energy. Keeping some electrons in the more diffuse 4s orbital minimizes the total energy of the system. When transition metals ionize, the loss of electrons weakens the overall electron repulsion, causing Zeff to increase. At this point, the energy of the 3d orbital falls stably below the 4s orbital. Therefore, transition metal cations (such as Fe2+, [Ar]3d6) always preferentially lose their outermost, more diffuse 4s electrons first." },
        ]
      },
      {
        id: "m1-4",
        title: { zh: "2.4 径向分布与轨道尺度", en: "2.4 Radial Distribution and Orbital Scale" },
        content: [
          { zh: "有效核电荷  和主量子数  共同决定了原子轨道的宏观尺度。由类氢近似可得 \\(r_{\\mathrm{mp}}\\propto n^2/Z_{\\mathrm{eff}}\\)。同一周期从左到右，\\(n\\) 不变而 \\(Z_{\\mathrm{eff}}\\) 增大，导致原子半径逐渐收缩。在同一族内从上至下，尽管 \\(Z_{\\mathrm{eff}}\\) 也略增，但 \\(n\\)（或 \\(n^2\\)）增大更占主导，导致原子轨道尺度膨胀。这种径向分布的系统性变化，解释了元素周期表中电离能、电子亲和能和电负性的递变规律。", en: "The effective nuclear charge Zeff and the principal quantum number n together determine the macroscopic scale of atomic orbitals. Based on approximations from the most probable radius formula of the hydrogen-like atom model, .1 Moving from left to right across the same period, n remains constant while Zeff steadily increases, leading to a gradual contraction of the atomic radius. Moving down the same group, although Zeff slightly increases, the dominant factor is the significant enlargement of the principal quantum number squared (), leading to a rapid expansion of the orbital scale. This systematic scaling of the radial distribution perfectly explains the periodic trends in ionization energy, electron affinity, and electronegativity." },
          { zh: "<div class=\"formula-box\">$$ r_{\\mathrm{mp}} \\propto n^2/Z_{\\mathrm{eff}} $$</div>", en: "<div class=\"formula-box\">$$ r_{\\mathrm{mp}} \\propto n^2/Z_{\\mathrm{eff}} $$</div>" },
        ]
      },
    ]
  },
  {
    id: "atom-model-history",
    title: { zh: "3 原子模型发展史", en: "3 History of Atomic Model Development" },
    children: [
      {
        id: "m2-1",
        title: { zh: "3.1 古典原子观与道尔顿", en: "3.1 Classical Atomic View and Dalton" },
        content: [
          { zh: "人类对物质本源的思考可追溯至古希腊的德谟克利特（Democritus），他提出了宇宙由不可分割的“原子”与虚空组成的哲学概念。这一哲学探讨在1803年由英国化学家约翰·道尔顿（John Dalton）发展为科学理论。基于定比定律和倍比定律，道尔顿提出了实心球原子模型，认为每种元素由特定质量的、不可分割的原子构成，原子的重新组合是化学反应的基础。", en: "Human contemplation regarding the origin of matter dates back to Democritus in Ancient Greece, who proposed the philosophical concept that the universe consists of indivisible \"atoms\" and the void. This purely philosophical speculation was translated into scientific theory in 1803 by the English chemist John Dalton. Based on the law of definite proportions and the law of multiple proportions, Dalton proposed the solid sphere model, positing that every element is made of specific, indivisible atoms, and that chemical reactions are fundamentally the rearrangements of these atoms." },
        ]
      },
      {
        id: "m2-2",
        title: { zh: "3.2 汤姆逊到卢瑟福", en: "3.2 From Thomson to Rutherford" },
        content: [
          { zh: "19世纪末，J.J. 汤姆逊（J.J. Thomson）在研究阴极射线时确认了带负电的电子的存在，表明原子具有内部结构。他随后提出了“枣糕模型（Plum pudding model）”，假设原子是一团带正电的均匀流体，电子镶嵌其中。 1911年，欧内斯特·卢瑟福（Ernest Rutherford）的金箔实验对这一模型提出了挑战。实验中用高能  粒子轰击极薄的金箔，绝大多数粒子径直穿过，但极少数粒子发生了大角度散射。卢瑟福指出这一现象出乎意料，犹如炮弹射击纸巾被反弹。基于此，他提出了核式结构模型：原子的正电荷与绝大部分质量集中在极其微小的原子核中，电子在原子核外围的广阔空间运动。", en: "In the late 19th century, J.J. Thomson's research on cathode rays confirmed the existence of the negatively charged electron, demonstrating that the atom possesses an internal structure. He subsequently proposed the \"Plum Pudding model,\" hypothesizing the atom as a uniform sphere of positively charged fluid with electrons embedded within it. In 1911, Ernest Rutherford's gold foil experiment challenged this model. By bombarding ultra-thin gold foil with high-energy alpha particles, he found that while most particles passed straight through, a very small fraction underwent large-angle scattering. Rutherford remarked that this phenomenon was as astonishing as \"firing a 15-inch shell at a piece of tissue paper and having it bounce back\".4 Based on this, he proposed the nuclear model: the positive charge and the vast majority of the mass of an atom are concentrated in an extremely tiny nucleus, with electrons moving in the vast empty space surrounding it." },
        ]
      },
      {
        id: "m2-3",
        title: { zh: "3.3 玻尔模型与氢光谱", en: "3.3 Bohr Model and Hydrogen Spectrum" },
        content: [
          { zh: "卢瑟福的行星模型面临着经典电磁学中电子绕核旋转会辐射能量导致体系坍缩的矛盾。1913年，尼尔斯·玻尔（Niels Bohr）引入量子化假设，提出电子只能在特定的、不辐射能量的稳定轨道上运行。玻尔模型定量预测了氢原子光谱的里德伯常数，是首次用量子规律定量描述微观结构的尝试。", en: "Rutherford's planetary model faced a contradiction with classical electromagnetism, which predicted that an orbiting electron would radiate energy and inevitably spiral into the nucleus, causing the system to collapse. In 1913, Niels Bohr introduced the quantization hypothesis, proposing that electrons can only travel in specific, stable orbits without radiating energy. The Bohr model quantitatively predicted the Rydberg constant of the hydrogen spectrum, marking the first successful attempt to describe microscopic structures quantitatively using quantum principles." },
          { zh: "<div class=\"formula-box\">$$ E_n = -\\frac{13.6\\,\\mathrm{eV}}{n^2} $$</div>", en: "<div class=\"formula-box\">$$ E_n = -\\frac{13.6\\,\\mathrm{eV}}{n^2} $$</div>" },
        ]
      },
      {
        id: "m2-4",
        title: { zh: "3.4 德布罗意、海森堡与薛定谔", en: "3.4 de Broglie, Heisenberg, and Schrödinger" },
        content: [
          { zh: "尽管玻尔模型对氢原子有效，但它无法解释较重元素的谱线，且将电子视为具有确定轨迹的粒子的观点在进一步的微观实验中暴露出局限性。德布罗意的物质波假说赋予了电子波动属性，海森堡的不确定性原理说明了微观粒子不具备经典的确定轨道。最终，薛定谔的波动方程将波动力学系统化，原子模型演化为以概率密度分布的“电子云”模型，为现代化学提供了物理基础。", en: "Although the Bohr model worked well for hydrogen, it failed to explain the spectral lines of heavier elements, and its view of electrons as particles with defined trajectories was proven inadequate by further microscopic experiments. de Broglie's matter wave hypothesis assigned wave properties to the electron, while Heisenberg's uncertainty principle clarified that microscopic particles do not have classically defined orbits. Ultimately, Schrödinger's wave equation systematized wave mechanics. The atomic model evolved into the \"electron cloud\" model based on probability density distributions, establishing the physical foundation of modern chemistry." },
        ]
      },
    ]
  },
  {
    id: "molecular-bonding-core",
    title: { zh: "4 分子成键理论", en: "4 Molecular Bonding Theories" },
    children: [
      {
        id: "m3-1",
        title: { zh: "4.1 共价、离子与配位键", en: "4.1 Covalent, Ionic, and Coordinate Bonds" },
        content: [
          { zh: "原子结合形成分子的基本驱动力是体系总能量的降低。基于元素电负性的差异，化学键表现为不同的形式：电负性差异极大时，电子发生明显转移形成离子键，依靠静电库仑力维持晶格结构（如 NaCl）1；电负性相近时，原子倾向于共享电子对形成共价键（如 \\(\\mathrm{He}^+\\)、\\(\\mathrm{Li}^{2+}\\)）。配位键（Coordinate bond）则是一种特殊的共价键，其中共享的电子对主要由作为 Lewis 碱的中心原子或配体单方面提供给具有空轨道的 Lewis 酸，如 \\(\\mathrm{H}_3\\mathrm{N}\\to\\mathrm{BF}_3\\) 体系以及过渡金属配合物。", en: "The fundamental driving force for atoms to combine into molecules is the minimization of total system energy. Based on the differences in element electronegativity, chemical bonds manifest in different forms: when the electronegativity difference is extremely large, significant electron transfer occurs, forming ionic bonds that rely on electrostatic Coulombic forces to maintain a crystal lattice (e.g., NaCl) 1; when electronegativity is similar, non-metal atoms tend to share electron pairs to form covalent bonds (e.g., H2, O2). A coordinate bond (dative bond) is a special type of covalent bond where the shared electron pair is unilaterally provided by a central atom or ligand acting as a Lewis base to a Lewis acid with an empty orbital, such as the H3N -> BF3 system and transition metal complexes." },
        ]
      },
      {
        id: "m3-2",
        title: { zh: "4.2 价键理论与重叠积分", en: "4.2 Valence Bond Theory and Overlap Integral" },
        content: [
          { zh: "海特勒（Heitler）与伦敦（London）将量子力学引入化学，发展了价键理论（Valence Bond Theory, VBT）。VBT 认为，当两个原子的半满轨道在空间中相互靠近并发生同相重叠时，由于电子的不可分辨性，产生量子力学中的交换能（Exchange energy），从而降低体系能量。轨道之间的重叠积分 \\(S=\\int \\psi_a\\psi_b\\,d\\tau\\)必须大于零，重叠积分的值越大，通常形成的共价键越强。", en: "Heitler and London introduced quantum mechanics into chemistry, developing Valence Bond Theory (VBT). VBT suggests that when two half-filled atomic orbitals approach each other in space and undergo in-phase overlap, the indistinguishability of electrons generates quantum mechanical exchange energy, which lowers the system's energy. The overlap integral \\(S\\) must be greater than zero, and generally, a larger overlap integral results in a stronger covalent bond." },
          { zh: "<div class=\"formula-box\">$$ S = \\int \\psi_a\\psi_b\\,d\\tau $$</div>", en: "<div class=\"formula-box\">$$ S = \\int \\psi_a\\psi_b\\,d\\tau $$</div>" },
        ]
      },
      {
        id: "m3-3",
        title: { zh: "4.3 杂化轨道与几何", en: "4.3 Hybrid Orbitals and Geometry" },
        content: [
          { zh: "为了解释自然界中多原子分子的空间构型（如甲烷的正四面体结构），莱纳斯·鲍林（Linus Pauling）提出了杂化轨道（Hybrid Orbital）的概念。通过将中心原子的一个 \\(s\\) 轨道与多个 \\(p\\) 轨道进行波函数的线性组合，可以重新分配电子云的空间指向。", en: "To explain the spatial geometries of polyatomic molecules found in nature (such as the perfect tetrahedral structure of methane), Linus Pauling proposed the concept of Hybrid Orbitals. By taking linear combinations of the wavefunctions of one \\(s\\) and multiple \\(p\\) orbitals on a central atom, the spatial directionality of the electron cloud is redistributed." },
          { zh: "\\(sp^3\\) 杂化：1个 \\(s\\) 与3个 \\(p\\) 轨道组合，生成4个夹角为 \\(109.5^\\circ\\) 的杂化轨道（如 \\(\\mathrm{CH}_4\\)）。", en: "\\(sp^3\\) hybridization: Combines 1 s and 3 p orbitals to generate 4 hybrid orbitals separated by an angle of 109.5 degrees (e.g., CH4)." },
          { zh: "\\(sp^2\\) 杂化：生成3个共平面的杂化轨道（夹角 \\(120^\\circ\\)），剩余一个未杂化的  轨道用于形成  键（如乙烯 ）。", en: "\\(sp^2\\) hybridization: Generates 3 coplanar hybrid orbitals (120 degree angle), leaving one unhybridized p orbital to form a pi bond (e.g., ethylene C2H4)." },
          { zh: "\\(sp\\) 杂化：生成2个直线型杂化轨道（夹角 \\(180^\\circ\\)），常用于三键或特定双键体系（如乙炔 ）。 杂化轨道主要通过轨道轴向重叠形成定域的 \\(\\sigma\\) 键，而未参与杂化的 \\(p\\) 轨道则通过侧向重叠形成 \\(\\pi\\) 键。", en: "\\(sp\\) hybridization: Generates 2 linear hybrid orbitals (180 degree angle), typically utilized in triple bonds or specific double bond systems (e.g., acetylene C2H2). Hybrid orbitals predominantly overlap head-on to form highly localized, strong sigma bonds, while unhybridized p orbitals overlap side-by-side to form pi bonds." },
        ]
      },
      {
        id: "m3-4",
        title: { zh: "4.4 分子轨道理论与键级", en: "4.4 Molecular Orbital Theory and Bond Order" },
        content: [
          { zh: "价键理论和杂化模型在描述有机分子局部成键时具有实用性，但在描述全局性质（如氧气的顺磁性、离域电子体系）时存在局限。分子轨道理论（Molecular Orbital Theory, MOT）提出，分子中的电子分布在覆盖整个分子的分子轨道中。通过原子轨道的线性组合（LCAO），\\(N\\) 个原子轨道重叠产生 \\(N\\) 个分子轨道。 同相组合导致核间电子概率密度增加，形成能量低于孤立原子的成键轨道（Bonding MO）；反相组合导致核间出现波函数节点，电子密度减少，形成能量高于孤立原子的反键轨道（Antibonding MO）。分子的稳定性可以通过键级 \\(\\mathrm{BO}=(N_b-N_a)/2\\) 来衡量。", en: "While Valence Bond Theory and the hybridization model are highly practical for describing local bonding in organic chemistry, they show limitations when describing global properties (such as the paramagnetism of oxygen gas or delocalized electron systems). Molecular Orbital Theory (MOT) proposes that electrons in a molecule are distributed in molecular orbitals that span the entire molecule. Through the Linear Combination of Atomic Orbitals (LCAO), the overlap of \\(N\\) AOs yields \\(N\\) MOs. In-phase combinations increase the electron probability density between the nuclei, forming bonding molecular orbitals (Bonding MO) that are lower in energy than the isolated atoms; out-of-phase combinations create wavefunction nodes between the nuclei, decreasing electron density and forming antibonding molecular orbitals (Antibonding MO) with energy higher than the isolated atoms. The stability of the molecule can be quantified by the Bond order \\(\\mathrm{BO}=(N_b-N_a)/2\\)." },
          { zh: "<div class=\"formula-box\">$$ \\mathrm{BO} = \\frac{N_b - N_a}{2} $$</div>", en: "<div class=\"formula-box\">$$ \\mathrm{BO} = \\frac{N_b - N_a}{2} $$</div>" },
        ]
      },
      {
        id: "m3-5",
        title: { zh: "4.5 VSEPR 与量子图像的衔接", en: "4.5 The Connection Between VSEPR and Quantum Imagery" },
        content: [
          { zh: "价层电子对互斥理论（VSEPR）是一个用于预测分子三维几何构型的工具。其核心原理是：围绕中心原子的价层电子对会由于静电斥力而尽可能远离彼此，形成直线、平面三角、四面体等基本构型。 VSEPR 提供了宏观的核坐标图像预测，而 VBT 的杂化轨道提供了局部成键向量的微观描述，MOT 则在能量层面上提供了解释该构型为何达到总能量极小值的量子力学基础。三者从不同的近似角度描述了分子的几何稳定性。", en: "The Valence Shell Electron Pair Repulsion (VSEPR) theory is a tool used to predict the 3D geometry of molecules. Its core principle assumes that valence electron pairs surrounding a central atom will maximize their distance from one another due to electrostatic repulsion, forming basic geometries like linear, trigonal planar, and tetrahedral. VSEPR provides a macroscopic prediction of nuclear coordinates; VBT's hybrid orbitals offer a microscopic description of local bonding vectors; and MOT provides the quantum mechanical foundation explaining why that particular geometry achieves the lowest total energy. The three theories describe molecular geometric stability from different approximate perspectives." },
        ]
      },
    ]
  },
  {
    id: "molecular-symmetry-mo",
    title: { zh: "5 分子对称性与 MO 进阶", en: "5 Molecular Symmetry and Advanced MO" },
    children: [
      {
        id: "m4-1",
        title: { zh: "5.1 点群与不可约表示", en: "5.1 Point Groups and Irreducible Representations" },
        content: [
          { zh: "在多原子分子体系中，分子轨道构建往往涉及较多原子轨道的耦合。群论（Group Theory）为分析对称性、判断哪些轨道可以混合提供了系统工具。分子中的对称操作——恒等 \\(E\\)、真旋转 \\(C_n\\)、镜面反射 \\(\\sigma\\)、反演 \\(i\\)、非真旋转（旋转–反射）\\(S_n\\)——在乘法下封闭，构成该分子的点群（Point Group）。例如水分子具有 \\(E,\\,C_2,\\,\\sigma_v(xz),\\,\\sigma_v'(yz)\\) 等操作，归属 \\(C_{2v}\\) 点群。特征标表列出各个不可约表示（如 \\(A_1,\\,B_1,\\,B_2\\) 等）在对称操作下的本征值。量子力学对称性选律指出：唯有属于**同一**不可约表示的原子轨道或 SALC（群轨道）之间，重叠积分才可能非零，从而能有效线性组合成真正的分子轨道。", en: "In polyatomic molecular systems, constructing molecular orbitals involves the interactions of many atomic orbitals. Group Theory provides the mathematical tools to analyze molecular symmetry and simplify the determination of orbital combinations. The symmetry operations present in a molecule (identity E, rotation Cn, reflection sigma, inversion i, improper rotation Sn) mathematically form a Point Group. For example, the water molecule possesses E, C2, sigma_v(xz), and sigma_v'(yz) operations, classifying it under the C2v point group. A Character Table lists the eigenvalue changes of basis functions under symmetry operations for that point group. These characters make up Irreducible Representations (e.g., A1, B2). The symmetry rules of quantum mechanics state: Only atomic orbitals or group orbitals belonging to the same irreducible representation have non-zero overlap integrals and can effectively combine to form molecular orbitals." },
        ]
      },
      {
        id: "m4-2",
        title: { zh: "5.2 SALC 与群轨道", en: "5.2 SALC and Group Orbitals" },
        content: [
          { zh: "对于中心原子周围的配位原子，需要将其轨道组合成“对称匹配线性组合（Symmetry Adapted Linear Combinations, SALC）”或群轨道。 使用投影算符（Projection Operator）可以系统地计算 SALC：", en: "For ligand atoms surrounding a central atom, their orbitals must first be combined into \"Symmetry Adapted Linear Combinations\" (SALC) or Group Orbitals. SALCs can be systematically calculated using a Projection Operator:" },
          { zh: "该算符将外围原子的轨道转化为具有特定不可约表示的群轨道。这在数学上降低了构建分子轨道图时哈密顿矩阵的维度。", en: "This operator converts the peripheral atoms' distributed orbitals into group orbitals possessing specific irreducible representations. This significantly reduces the dimensionality of the Hamiltonian matrix when constructing Molecular Orbital Diagrams." },
        ]
      },
      {
        id: "m4-3",
        title: { zh: "5.3 代表分子：H2O 与 NH3", en: "5.3 Representative Molecules: H2O and NH3" },
        content: [
          { zh: "水（\\(\\mathrm{H}_2\\mathrm{O}\\)，点群 \\(C_{2v}\\)）：氧的价层原子轨道可按 \\(C_{2v}\\) 不可约表示归类：\\(2s\\) 与 \\(2p_z\\) 属 \\(a_1\\)，\\(2p_x\\) 属 \\(b_1\\)，\\(2p_y\\) 属 \\(b_2\\)。两个氢原子的 \\(1s\\) 经 SALC 组合，得到同相的 \\(a_1\\) 与反相的 \\(b_2\\) 群轨道。在对称性匹配下，氧的 \\(a_1\\)、\\(b_2\\) 分量分别与相应的氢 \\(a_1\\)/\\(b_2\\) SALC 形成较强的 \\(\\sigma\\) 成键轨道；而 \\(b_1\\)（主要对应 \\(2p_x\\)）一侧没有对称性匹配的氢轨道，因而更接近**非键**特征，与孤对电子的图像一致。", en: "Water (H2O, C2v): The oxygen valence orbitals belong to the A1 (2s, 2pz), B1 (2px), and B2 (2py) irreducible representations. The two hydrogen 1s orbitals generate an in-phase A1 group orbital and an out-of-phase B2 group orbital through SALC. Based on symmetry matching, oxygen's A1 orbitals combine with hydrogen's A1 SALC to form deep sigma bonding orbitals; oxygen's B2 orbital interacts with hydrogen's B2 SALC. Oxygen's 2px (B1), lacking a symmetry-matched hydrogen orbital, remains a non-bonding orbital holding a lone pair." },
          { zh: "氨（\\(\\mathrm{NH}_3\\)，点群 \\(C_{3v}\\)）：氮的 \\(2s\\) 与 \\(2p_z\\) 属于 \\(a_1\\) 表示，\\(2p_x\\) 与 \\(2p_y\\) 简并，合称 \\(e\\)。三个氢的 \\(1s\\) 通过 SALC 形成一个 \\(a_1\\) 与两个简并的 \\(e\\) 群轨道。最高占据分子轨道（HOMO，常记为 \\(2a_1\\)）成键贡献较弱，电子密度仍显著定域在氮上，因而主要表现为**孤对电子**特征。", en: "Ammonia (NH3, C3v): Nitrogen's 2s and 2pz orbitals possess A1 symmetry, while 2px/2py are degenerate with E symmetry. The three hydrogen 1s orbitals form one A1 group orbital and two degenerate E group orbitals via SALC. The Highest Occupied Molecular Orbital (HOMO, which is 2a1) has weak bonding character but mainly behaves as a lone pair localized on the nitrogen atom." },
        ]
      },
      {
        id: "m4-4",
        title: { zh: "5.4 代表分子：CH4、CO2、HCN、XeF2", en: "5.4 Representative Molecules: CH4, CO2, HCN, XeF2" },
        content: [
          { zh: "以下表格展示了几种多原子分子的分子轨道构建及其与传统价键理论视角的比较：", en: "The following table compares the molecular orbital constructions of several polyatomic molecules against traditional valence bond theory perspectives:" },
          { zh: "<table class=\"kb-table\"><tr><th>分子</th><th>点群</th><th>轨道杂化论的描述</th><th>分子轨道(MO)结合SALC的描述</th><th>实验验证与理论意义</th></tr><tr><td>甲烷 (\\(\\mathrm{CH}_4\\))</td><td>\\(T_d\\)</td><td>假设碳采用 \\(sp^3\\) 杂化，形成4个能量等价的定域 \\(\\sigma\\) 键。</td><td>碳轨道分为 \\(a_1\\)（\\(2s\\)）与 \\(t_2\\)（\\(2p\\)）。四个氢原子生成 \\(a_1\\) 与 \\(t_2\\) SALCs。组合生成无节面的 \\(1a_1\\) 成键轨道与三个简并的 \\(1t_2\\) 成键轨道。</td><td>光电子能谱（PES）探测到甲烷价层有两个不同的电离能峰，证明成键电子具有两种不同的能级，这修正了简单杂化理论中的等价假设。</td></tr><tr><td>二氧化碳 (\\(\\mathrm{CO}_2\\))</td><td>\\(D_{\\infty h}\\)（或用 \\(D_{2h}\\)）</td><td>\\(sp\\) 杂化形成 \\(\\sigma\\) 键与定域 \\(\\pi\\) 键。</td><td>中心碳具有 \\(a_g,b_{1u},b_{2u},b_{3u}\\) 等成分轨道。两端氧原子组合出8个SALC。形成贯穿全分子的离域 \\(\\sigma\\) 与 \\(\\pi\\) 键，以及属于氧原子的离域非键轨道。</td><td>离域 \\(\\pi\\) 体系更准确地反映了分子的电子分布和光谱特征。</td></tr><tr><td>氢氰酸 (\\(\\mathrm{HCN}\\))</td><td>\\(C_{\\infty v}\\)</td><td>\\(sp\\) 杂化，三重键局域在 \\(\\mathrm{C{-}N}\\) 之间。</td><td>碳需同时与氢 \\(1s\\) 及氮的 \\(\\sigma\\)-SALC 进行匹配形成离域 \\(\\sigma\\) 骨架，其 \\(\\pi\\) 轨道进一步形成离域 \\(\\pi\\) 体系。</td><td>表明看似定域的三键，其电子云实际受到全分子势场的离域调控。</td></tr><tr><td>二氟化氙 (\\(\\mathrm{XeF}_2\\))</td><td>\\(D_{\\infty h}\\)</td><td>传统上依赖引入高能的 \\(5d\\) 轨道参与 \\(sp^3d\\) 杂化来解释超价现象。</td><td>形成三中心四电子键（3c-4e bond）。氟的 \\(p_z\\) 生成 \\(\\sigma_g\\) 与 \\(\\sigma_u\\) SALC。氙的 \\(5p_z\\)（\\(\\sigma_u\\)）与氟的 \\(\\sigma_u\\) 组合，生成 1个成键、1个非键、1个反键轨道。</td><td>4个电子填满成键与非键轨道，每侧 Xe-F 的局部键级约为 0.5。表明无需引入高能 \\(d\\) 轨道即可解释其稳定性，展示了分子轨道理论在处理超价分子时的严密性 。</td></tr></table>", en: "<table class=\"kb-table\"><tr><th>Molecule</th><th>Point Group</th><th>Orbital Hybridization View</th><th>MO & SALC Description</th><th>Experimental Verification & Theoretical Significance</th></tr><tr><td>Methane (\\(\\mathrm{CH}_4\\))</td><td>\\(T_d\\)</td><td>Assumes \\(sp^3\\) hybridization, forming 4 energetically equivalent localized \\(\\mathrm{C{-}H}\\) \\(\\sigma\\) bonds.</td><td>Carbon orbitals divide into \\(a_1\\) (\\(2s\\)) and \\(t_2\\) (\\(2p\\)). Four hydrogen atoms generate A1 and T2 SALCs. These combine to form a nodeless 1a1 bonding orbital and three degenerate 1t2 bonding orbitals.2</td><td>Photoelectron spectroscopy (PES) detects two distinct ionization energy peaks in the valence shell of methane, proving that bonding electrons occupy two different energy levels, which corrects the equivalence assumption of simple hybridization theory.1</td></tr><tr><td>Carbon dioxide (\\(\\mathrm{CO}_2\\))</td><td>\\(D_{\\infty h}\\) (or \\(D_{2h}\\))</td><td>Assumes sp hybridization forming sigma bonds and localized pi bonds.</td><td>The central carbon has Ag, B1u, B2u, B3u symmetry orbitals. The two terminal oxygen atoms generate 8 SALCs. This creates delocalized sigma and pi bonds across the molecule, along with delocalized non-bonding orbitals belonging to the oxygen atoms.10</td><td>The delocalized pi system more accurately reflects the electron distribution and spectral characteristics of the molecule.</td></tr><tr><td>Hydrogen cyanide (\\(\\mathrm{HCN}\\))</td><td>\\(C_{\\infty v}\\)</td><td>Assumes sp hybridization, with a triple bond localized between C and N.</td><td>Carbon must simultaneously match with the hydrogen 1s and the nitrogen sigma SALC to form a delocalized sigma skeleton. Its px and py orbitals further form a delocalized pi system.24</td><td>Indicates that the seemingly localized triple bond's electron cloud is actually subject to delocalized modulation by the entire molecular potential field.</td></tr><tr><td>Xenon difluoride (\\(\\mathrm{XeF}_2\\))</td><td>\\(D_{\\infty h}\\)</td><td>Traditionally relies on introducing high-energy 5d orbitals for sp3d hybridization to explain hypervalency.11</td><td>Forms a 3-center 4-electron (3c-4e) bond. Fluorine pz generates sigma_g and sigma_u SALCs. Xenon's 5pz (sigma_u) combines with the fluorine sigma_u to form 1 bonding, 1 non-bonding, and 1 antibonding orbital.11</td><td>4 electrons fill the bonding and non-bonding orbitals, resulting in a local bond order of roughly 0.5 for each Xe-F bond. This demonstrates that stability can be explained without invoking high-energy d orbitals, showcasing the rigor of MO theory in handling hypervalent molecules.</td></tr></table>" },
        ]
      },
    ]
  },
  {
    id: "reactivity-spectroscopy",
    title: { zh: "6 反应与光谱", en: "6 Reactions and Spectroscopy" },
    children: [
      {
        id: "m5-1",
        title: { zh: "6.1 前线轨道理论（HOMO/LUMO）", en: "6.1 Frontier Molecular Orbital Theory (HOMO/LUMO)" },
        content: [
          { zh: "分子轨道不仅用于描述静态结构，还提供了分析化学反应性的工具。福井谦一（Kenichi Fukui）提出的前线分子轨道理论（Frontier Molecular Orbital, FMO）指出，分子的化学反应性主要由最高占据分子轨道（HOMO）和最低未占分子轨道（LUMO）的相互作用决定。在反应过程中，两个分子的 HOMO 与 LUMO 发生空间重叠，电子从高能量的 HOMO 转移至 LUMO，从而降低体系总能量并促成新化学键的形成。", en: "Molecular orbitals are not only used to describe static structures but also provide tools for analyzing chemical reactivity. Kenichi Fukui's Frontier Molecular Orbital Theory (FMO) states that molecular reactivity is primarily determined by the interactions between the Highest Occupied Molecular Orbital (HOMO) and the Lowest Unoccupied Molecular Orbital (LUMO). During a reaction, the HOMO of one molecule overlaps with the LUMO of another in space, and electrons transfer from the high-energy HOMO to the LUMO, lowering the total energy of the system and facilitating the formation of new chemical bonds." },
        ]
      },
      {
        id: "m5-2",
        title: { zh: "6.2 Lewis 酸碱的 MO 视角", en: "6.2 MO Perspective of Lewis Acids and Bases" },
        content: [
          { zh: "前线轨道理论为 Lewis 酸碱概念提供了量子力学层面的解释。", en: "Frontier Orbital Theory offers a quantum mechanical explanation for the concept of Lewis acids and bases." },
          { zh: "Lewis 碱作为电子对供体，利用其富电子的 HOMO（如孤对电子或  轨道）参与反应。", en: "A Lewis Base acts as an electron pair donor, utilizing its electron-rich HOMO (such as a lone pair or pi orbital) to participate in the reaction." },
          { zh: "Lewis 酸作为电子对受体，提供其空置的 LUMO 接受电子。 例如，在氨（\\(\\mathrm{NH}_3\\)）与硼烷（\\(\\mathrm{BH}_3\\)）形成加合物的过程中， 的 HOMO（氮原子的非键轨道）向 \\(\\mathrm{BH}_3\\) 的 LUMO（空 \\(p\\) 轨道）提供电子，形成能量更低的成键轨道。类似地，在双分子亲核取代（\\(S_N2\\)）中，亲核试剂（如 ）的 HOMO 供电子至底物（如 ）的 LUMO（ 反键轨道），这一相互作用直接导致了旧碳氯键的断裂和新键的形成。在周环反应（如 Diels-Alder 环加成反应）中，二烯体的 HOMO 与亲双烯体的 LUMO 之间的相位匹配同样是反应发生的核心驱动力。", en: "A Lewis Acid acts as an electron pair acceptor, providing its vacant LUMO to receive electrons. For example, when ammonia (NH3) forms an adduct with borane (BH3), the HOMO of NH3 (the non-bonding orbital on the nitrogen atom) donates electrons to the LUMO of BH3 (the empty pz orbital), forming a lower-energy bonding orbital. Similarly, in a bimolecular nucleophilic substitution (SN2) reaction, the nucleophile (e.g., OH-) donates electrons from its HOMO to the LUMO (sigma* antibonding orbital) of the substrate (e.g., CH3Cl), leading directly to the cleavage of the old carbon-chlorine bond and the formation of a new bond. In pericyclic reactions (like the Diels-Alder cycloaddition), phase matching between the diene's HOMO and the dienophile's LUMO is likewise the core driving force." },
        ]
      },
      {
        id: "m5-3",
        title: { zh: "6.3 双键旋转与顺反异构", en: "6.3 Double Bond Rotation and Cis-Trans Isomerization" },
        content: [
          { zh: "在有机体系中，单键（ 键）沿着键轴具有圆柱对称性，旋转势垒低。而双键（如乙烯）的  键要求两个相邻的  轨道保持平行以实现最大的侧向重叠。若绕 \\(\\mathrm{C}=\\mathrm{C}\\) \\(\\pi\\) 键旋转 \\(90^\\circ\\)，两个  轨道将相互正交，导致 \\(\\pi\\) 重叠积分为零， 键被破坏。这一较高的旋转势垒（通常 ）导致了顺反异构体（cis-trans isomers）在室温下的稳定存在。 如果利用特定能量的光子照射，促使乙烯中的一个电子发生 \\(\\pi\\to\\pi^*\\) 跃迁进入激发态。此时反键轨道 \\(\\pi^*\\) 被占据，导致  \\(\\pi\\) 键级近似降为 \\(0\\)。在激发态势能面上，分子绕  键的旋转不再受到  键的刚性约束，从而能够在弛豫回基态时实现顺反异构体的相互转化 。", en: "In organic systems, single bonds (sigma bonds) have cylindrical symmetry along the bond axis, allowing for very low rotation barriers. Conversely, the pi bond in a double bond (like ethylene) requires adjacent p orbitals to remain parallel for maximum lateral overlap. If forced to rotate \\(90^\\circ\\) about \\(\\mathrm{C}=\\mathrm{C}\\), \\(\\pi\\) overlap  and the destruction of the pi bond. This high rotational barrier (typically > 60 kcal/mol) explains the stable existence of cis-trans isomers at room temperature. However, if irradiated with a photon of appropriate energy, an electron in ethylene can undergo a \\(\\pi\\to\\pi^*\\) transition. In this state, the \\(\\pi^*\\) is populated, \\(\\pi\\) bond order drops toward \\(0\\). On this excited-state potential energy surface, rotation about the C-C bond is \\(\\pi\\) constraint is lifted, allowing the molecule to overcome the barrier and undergo cis-trans interconversion upon relaxing back to the ground state." },
        ]
      },
      {
        id: "m5-4",
        title: { zh: "6.4 UV-Vis 吸收与电子跃迁", en: "6.4 UV-Vis Absorption and Electronic Transitions" },
        content: [
          { zh: "紫外-可见（UV-Vis）吸收光谱测量分子电子跃迁吸收的能量。当入射光子的能量  \\(h\\nu\\) 匹配分子特定占据轨道与未占轨道之间的能隙时，发生光子吸收。 常见的有机发色团涉及以下电子跃迁：", en: "Ultraviolet-Visible (UV-Vis) absorption spectroscopy measures the energy absorbed during molecular electronic transitions. When the photon energy \\(h\\nu\\) perfectly matches the energy gap between an occupied orbital and an unoccupied orbital, photon absorption occurs. Common electronic transitions in organic chromophores include:" },
          { zh: "\\(\\pi\\to\\pi^*\\) 跃迁：常见于含双键或芳香环的体系，能隙通常位于 UV 区，由于轨道空间重叠良好，跃迁概率大，吸收强度高。随共轭体系延长，HOMO-LUMO 能隙缩小，吸收峰发生红移。", en: "\\(\\pi\\to\\pi^*\\) transitions: Typically found in systems with double bonds or aromatic rings. The energy gap usually lies in the UV region, and due to excellent orbital spatial overlap, the transition probability is high, resulting in strong absorption. As the conjugated system extends, the HOMO-LUMO gap narrows, shifting the absorption peak to longer wavelengths (red shift)." },
          { zh: "\\(n\\to\\pi^*\\) 跃迁：杂原子（如氧、氮）上的孤对电子（\\(n\\) 轨道）向空置的 \\(\\pi^*\\) 轨道跃迁。此类跃迁能隙较小，但由于 \\(n\\) 轨道与 \\(\\pi^*\\) 轨道在空间上往往相互正交，重叠积分小，因此吸收强度（摩尔吸光系数 \\(\\varepsilon\\)）通常较弱。", en: "\\(n\\to\\pi^*\\) transitions: Involves a lone pair electron (n orbital) on a heteroatom (like oxygen or nitrogen) transitioning into an empty \\(\\pi^*\\) orbital. The energy gap for this transition is smaller, but because the \\(n\\) orbital and the \\(\\pi^*\\) orbital are usually orthogonal in space, the overlap integral is minimal. Thus, the absorption intensity (molar absorptivity \\(\\varepsilon\\)) is usually very weak." },
          { zh: "光谱信号受制于量子力学的选择定则（Selection Rules）：", en: "Spectral signals are strictly governed by the selection rules of quantum mechanics:" },
          { zh: "拉波特选择定则（Laporte, \\(g\\leftrightarrow u\\)）：对于具中心反演对称性的体系，电子仅允许在不同宇称（\\(g\\) 与 \\(u\\)）的轨道间跃迁。因此，理想八面体配合物中的 \\(d\\!-\\!d\\) 跃迁理论上是禁阻的。", en: "Laporte rule (\\(g\\leftrightarrow u\\)): For systems with a center of inversion symmetry, electrons are only permitted to transition between orbitals of different parity (\\(g,u\\)). Thus, \\(d\\!-\\!d\\) transitions in ideal octahedral complexes are theoretically forbidden." },
          { zh: "自旋选择定则：跃迁前后体系的自旋多重度必须保持不变。 实际观测到的微弱 \\(d\\!-\\!d\\) 吸收，通常是由于不对称的分子振动（振电耦合）破坏了中心对称性，或较重原子中的自旋-轨道耦合引起了选择定则的弛豫。", en: "Spin selection rule (\\(\\Delta S=0\\)): The spin multiplicity of the system must remain unchanged before and after the transition. Feeble \\(d\\!-\\!d\\) absorptions observed in reality are generally the result of asymmetric molecular vibrations (vibronic coupling) breaking the centrosymmetry, or spin-orbit coupling in heavier atoms inducing a relaxation of the selection rules." },
        ]
      },
      {
        id: "m5-5",
        title: { zh: "6.5 比尔-朗伯定律与定量分析", en: "6.5 Beer-Lambert Law and Quantitative Analysis" },
        content: [
          { zh: "宏观层面上溶液吸光度与浓度的关系遵循比尔-朗伯定律：", en: "At the macroscopic level, the relationship between solution absorbance and concentration is defined by the Beer–Lambert law \\(A=\\varepsilon c l\\):" },
          { zh: "其中 \\(A\\) 为吸光度，\\(c\\) 为浓度，\\(l\\) 为光程。摩尔吸光系数（\\(\\varepsilon\\)，单位 \\(\\mathrm{L\\,mol^{-1}\\,cm^{-1}}\\)）由该跃迁的量子力学偶极矩决定，反映了跃迁的固有概率。例如，允许的 \\(\\pi\\to\\pi^*\\) 跃迁 \\(\\varepsilon\\) 常在 \\(10^4\\!\\sim\\!10^5\\) 之间，而禁阻的 \\(d\\!-\\!d\\) 跃迁 \\(\\varepsilon\\) 通常仅为。", en: "Where \\(A=-\\log_{10}(I/I_0)\\), \\(c\\) is concentration, and \\(l\\) path length. The core parameter, the molar absorptivity \\(\\varepsilon\\), is a constant determined by the quantum mechanical dipole moment of the specific transition, reflecting the intrinsic probability of the transition. For example, allowed \\(\\pi\\to\\pi^*\\) transitions frequently exhibit \\(\\varepsilon\\) of 10,000 to 20,000, whereas forbidden \\(d\\!-\\!d\\) transitions generally display \\(\\varepsilon\\) of only 10 to 100.39" },
          { zh: "<div class=\"formula-box\">$$ A = \\varepsilon c l $$</div>", en: "<div class=\"formula-box\">$$ A = \\varepsilon c l $$</div>" },
        ]
      },
    ]
  },
  {
    id: "intermolecular-solids",
    title: { zh: "7 分子间作用与固体", en: "7 Intermolecular Forces and Solids" },
    children: [
      {
        id: "m6-1",
        title: { zh: "7.1 静电、诱导与色散作用", en: "7.1 Electrostatic, Induction, and Dispersion Forces" },
        content: [
          { zh: "分子间作用力（Intermolecular Forces, IMFs）是决定宏观物质相态（如熔沸点）的主要因素。其能量级通常低于化学键，但对凝聚态物质的性质至关重要。 分子间力本质上起源于电磁相互作用 49：", en: "Intermolecular Forces (IMFs) are the primary factors dictating the macroscopic physical state of matter (e.g., melting and boiling points). Their energy levels are typically much lower than chemical bonds, yet they are crucial for the properties of condensed matter. Intermolecular forces essentially originate from electromagnetic interactions 49:" },
          { zh: "偶极-偶极相互作用：存在于极性分子间，由永久偶极间的静电引力主导。", en: "Dipole-Dipole Interactions: Exist between polar molecules, governed by the electrostatic attraction between permanent dipoles." },
          { zh: "伦敦色散力（London Dispersion Forces）：广泛存在于所有分子间。源于电子云涨落产生的瞬时偶极及其在邻近分子中诱导出的响应偶极之间的吸引。", en: "London Dispersion Forces: Universally present between all molecules. They originate from the attraction between instantaneous dipoles created by the fluctuation of electron clouds and the corresponding induced dipoles in neighboring molecules." },
        ]
      },
      {
        id: "m6-2",
        title: { zh: "7.2 氢键的双重本质", en: "7.2 The Dual Nature of Hydrogen Bonds" },
        content: [
          { zh: "经典教学常将氢键视为一种强烈的偶极-偶极静电相互作用。然而，实验（如核磁共振、红外光谱中  伸缩振动的红移）和理论计算表明，氢键并非纯粹的静电作用。 现代研究确立了氢键具有静电与共价的双重本质（Dual Nature）。2011年，IUPAC 重新定义了氢键，强调其形成必须包含“成键的证据”。除了多极静电引力外，氢键的形成还涉及受体的孤对电子向供体 \\(\\sigma^*\\) 反键轨道的电荷转移（Charge Transfer）与量子力学离域。在作用力极强的对称氢键中，质子位于供受体正中，其共价成分显著提升，局部键级可达到 0.5，表现出化学键的特征。", en: "Classical education often treats the hydrogen bond as an exceptionally strong dipole-dipole electrostatic interaction. However, experiments (such as NMR and the red shift of X-H stretching vibrations in IR spectroscopy) and theoretical calculations show that hydrogen bonds are not purely electrostatic. Modern research has established the dual nature of the hydrogen bond, encompassing both electrostatic and covalent characteristics. In 2011, IUPAC redefined the hydrogen bond, emphasizing that its formation must include \"evidence of bond formation\".14 Beyond multipolar electrostatic attraction, hydrogen bond formation involves a charge transfer from the acceptor's lone pair to \\(\\sigma^*\\)'s antibonding orbital () and quantum mechanical delocalization. In exceptionally strong, symmetric hydrogen bonds, where the proton sits exactly in the middle of the donor and acceptor, the covalent character significantly increases, reaching a local bond order of 0.5 and exhibiting true chemical bond characteristics." },
        ]
      },
      {
        id: "m6-3",
        title: { zh: "7.3 固体类型与宏观性质", en: "7.3 Types of Solids and Macroscopic Properties" },
        content: [
          { zh: "根据构成微粒与成键方式，晶态固体可分为四大类，其宏观物理性质反映了底层的电子分布结构 8：", en: "Based on constituent particles and bonding types, crystalline solids are categorized into four main classes, with their macroscopic physical properties reflecting their underlying electron distribution 8:" },
          { zh: "<table class=\"kb-table\"><tr><th>固体类型</th><th>构成微粒</th><th>成键/作用力类型</th><th>宏观物理特性</th></tr><tr><td>离子晶体</td><td>正负离子</td><td>库仑静电吸引</td><td>熔沸点高，硬而脆，固态绝缘，熔融或水溶液导电。</td></tr><tr><td>分子晶体</td><td>分子或原子</td><td>范德华力、氢键</td><td>熔沸点较低，硬度小，电与热的绝缘体。</td></tr><tr><td>共价网络晶体</td><td>原子</td><td>三维共价键网络</td><td>熔点高，硬度大（如金刚石），通常为绝缘体或半导体。</td></tr><tr><td>金属晶体</td><td>金属阳离子</td><td>金属键（离域电子气与晶格作用）</td><td>具导电、导热性及延展性。</td></tr></table>", en: "<table class=\"kb-table\"><tr><th>Solid Type</th><th>Constituent Particles</th><th>Bonding/Interaction Type</th><th>Macroscopic Physical Properties</th></tr><tr><td>Ionic Crystals</td><td>Cations and anions</td><td>Coulombic electrostatic attraction</td><td>High melting/boiling points, hard and brittle, solid-state insulators, conduct electricity when molten or in aqueous solution.53</td></tr><tr><td>Molecular Crystals</td><td>Molecules or atoms</td><td>van der Waals forces, hydrogen bonds</td><td>Lower melting/boiling points, low hardness, thermal and electrical insulators.53</td></tr><tr><td>Covalent Network Crystals</td><td>Atoms</td><td>3D covalent bond network</td><td>High melting points, great hardness (e.g., diamond), typically insulators or semiconductors.53</td></tr><tr><td>Metallic Crystals</td><td>Metal cations</td><td>Metallic bonds (delocalized electron gas interacting with lattice)</td><td>Good electrical and thermal conductivity, high ductility and malleability.54</td></tr></table>" },
        ]
      },
      {
        id: "m6-4",
        title: { zh: "7.4 能带形成与费米能级", en: "7.4 Band Formation and Fermi Level" },
        content: [
          { zh: "金属与半导体的全局导电行为无法通过定域的价键模型充分解释。能带理论（Band Theory）将晶体视为包含 \\(N\\) 个原子的巨型体系（超分子）。 根据分子轨道理论，当 \\(N\\) 个原子轨道重叠时，会生成 \\(N\\) 个极度密集的分子轨道。在宏观晶体中，这些离散的能级间距趋近于零，形成连续的能带（Energy Band）。在周期性晶格势场中，电子的状态用布洛赫函数（Bloch functions）描述，其波函数受布洛赫波矢 \\(\\mathbf{k}\\) 的调制。 在绝对零度下，固体中电子占据的最高能量水平称为费米能级 \\(E_\\mathrm{F}\\)，在物理图像上对应于分子的 HOMO。费米能级下方被电子充满的能带称为价带（Valence Band），上方未被填满或完全空置的能带称为导带（Conduction Band），两者间的能量间隙称为带隙（Band Gap）。", en: "The global conductive behavior of metals and semiconductors cannot be adequately explained by localized valence bond models. Band Theory treats a crystal as a crystal as \\(N\\)-atom system. According to Molecular Orbital Theory, when N atomic orbitals overlap, they generate N densely packed molecular orbitals. In a macroscopic crystal, the energy gap between these discrete levels approaches zero, forming a continuous Energy Band. Within a periodic crystal potential field, electron states are described by Bloch functions, where the wavefunction is modulated by the wavevector \\(\\mathbf{k}\\). At absolute zero, the highest energy level occupied by electrons in a solid is termed the Fermi Level (), which physically corresponds to the HOMO of a molecule. The band completely filled with electrons below the Fermi level is the Valence Band, while the unfilled or entirely empty band above it is the Conduction Band. The energy gap between the two is known as the Band Gap." },
        ]
      },
      {
        id: "m6-5",
        title: { zh: "7.5 导体、半导体与绝缘体", en: "7.5 Conductors, Semiconductors, and Insulators" },
        content: [
          { zh: "带隙的宽度与费米能级的位置决定了材料的导电行为 59：", en: "The width of the band gap and the position of the Fermi level determine the material's conductive behavior 59:" },
          { zh: "绝缘体：价带被充满，带隙宽（通常 \\(>3\\!\\sim\\!4\\,\\mathrm{eV}\\)）。室温下的热激发不足以使电子跨越带隙，故不导电。", en: "Insulators: The valence band is full, and the band gap is wide (typically \\(>3\\!\\sim\\!4\\) eV). Thermal excitation at room temperature is insufficient for electrons to cross the band gap, resulting in non-conductivity." },
          { zh: "半导体：价带充满，但带隙较窄（通常 \\(<3\\,\\mathrm{eV}\\)）。室温下部分电子可通过热激发跃迁至导带，留下带正电的空穴，产生一定导电性。掺杂可向带隙中引入杂质能级，改变其导电性质。", en: "Semiconductors: The valence band is full, but the band narrow gap (\\(<3\\) eV). At room temperature, a fraction of electrons can be thermally excited into the conduction band, leaving behind positively charged holes, thereby generating some conductivity. Doping can introduce impurity energy levels within the band gap, significantly modifying conductivity." },
          { zh: "导体（金属）：费米能级位于能带内部（能带未满），或价带与导带在能量上发生重叠。电子仅需获取微小能量即可跃迁至空置的近邻能态，形成宏观电流。 此外，在特定的一维体系（如无限长聚乙炔链）中，结构可能会发生晶格畸变（键长交替变化），导致在费米能级处打开带隙，使体系能量降低并由金属态转变为半导体或绝缘体。这一现象在固体物理中称为佩尔斯畸变（Peierls Distortion），是单分子扬-泰勒效应在无限一维晶体中的表现。", en: "Conductors (Metals): The Fermi level resides within a band (the band is partially filled), or the valence and conduction bands overlap in energy. Electrons only require minimal energy to transition to adjacent empty states, generating macroscopic electrical current. Furthermore, in specific 1D systems (like an infinitely long polyacetylene chain), the structure may undergo lattice distortion (alternating bond lengths), which opens a band gap at the Fermi level, lowering the system's energy and transitioning the material from a metallic state to a semiconductor or insulator. This phenomenon is known in solid-state physics as Peierls Distortion, which is the manifestation of the single-molecule Jahn-Teller effect within infinite 1D crystals." },
        ]
      },
    ]
  },
  {
    id: "lorbital-application-layer",
    title: { zh: "8 面向 Lorbital 的应用层", en: "8 Application Layer for Lorbital" },
    children: [
      {
        id: "m7-1",
        title: { zh: "8.1 轨道可视化与化学解释联动", en: "8.1 Orbital Visualization and Chemical Explanation Synergy" },
        content: [
          { zh: "薛定谔方程求解得到的波函数通常呈现为多维的数学函数。Lorbital 等计算化学可视化工具，将这些数学表达转化为直观的三维等值面图像（Boundary surfaces）。这使得轨道的空间拓扑形态以及代表波函数相位的正负号得以立体呈现，为理解节点分布和重叠积分的物理意义提供了图像支撑 63，从而辅助说明“相位匹配是有效成键的基础”。", en: "The wavefunctions derived from solving the Schrödinger equation are typically multi-dimensional mathematical functions. Computational chemistry visualization tools, such as Lorbital, convert these mathematical expressions into intuitive 3D boundary surfaces. This allows the spatial topological shapes of orbitals and the positive/negative signs representing wavefunction phases to be displayed three-dimensionally. It provides visual support for understanding the physical significance of nodal distributions and overlap integrals 63, assisting in clarifying why \"phase matching is the foundation of effective bonding.\"" },
        ]
      },
      {
        id: "m7-2",
        title: { zh: "8.2 AO 到 MO 的学习路径", en: "8.2 Learning Path from AO to MO" },
        content: [
          { zh: "Lorbital 的知识架构旨在建立系统的理论认知路径：从孤立原子轨道（AO）的能级与形态出发，引入空间对称性原则（点群与特征标表），利用群论方法将配体轨道转化为对称性匹配的群轨道（SALC），最终构建定量的分子轨道（MO）模型。例如，通过对  分子三中心四电子键的分析，表明了无需借助高能  轨道杂化假设，利用基本分子轨道理论即能严谨地解释其电子结构与稳定性。", en: "The knowledge architecture of Lorbital is designed to establish a systematic theoretical cognitive path: starting from the energy levels and morphologies of isolated Atomic Orbitals (AO), introducing spatial symmetry principles (Point Groups and Character Tables), utilizing group theory methods to convert ligand orbitals into Symmetry Adapted Linear Combinations (SALC), and ultimately constructing quantitative Molecular Orbital (MO) models. For instance, the analysis of the 3-center 4-electron bond in the XeF2 molecule demonstrates that its electron structure and stability can be rigorously explained using basic MO theory without assuming high-energy d-orbital hybridization." },
        ]
      },
      {
        id: "m7-3",
        title: { zh: "8.3 MO 到能带的连续叙事", en: "8.3 Continuous Narrative from MO to Band Theory" },
        content: [
          { zh: "量子化学的理论框架在尺度上具有连续性。从双原子分子的离散能级图扩展至具有  个重复单元的寡聚物，分子轨道能级逐渐密集。当向宏观晶体延伸时，这些离散的轨道平滑过渡为固体物理中的能带（Bands）。在此连续体系中，分子的 HOMO 对应于固体的费米能级，而 HOMO-LUMO 能隙演变为半导体的带隙。这种跨尺度的理论一致性，为理解从微观分子到宏观材料性质的演变提供了物理基础。", en: "The theoretical framework of quantum chemistry exhibits continuity across scales. Progressing from the discrete energy level diagrams of diatomic molecules to oligomers with N repeating units, molecular orbital energy levels become increasingly dense. When extended to macroscopic crystals, these discrete orbitals smoothly transition into the bands of solid-state physics. In this continuous system, the molecule's HOMO corresponds to the solid's Fermi level, while the HOMO-LUMO gap evolves into the semiconductor's band gap. This cross-scale theoretical consistency provides the physical foundation for understanding the evolution from microscopic molecules to macroscopic material properties." },
        ]
      },
      {
        id: "m7-4",
        title: { zh: "8.4 实验导向的知识闭环", en: "8.4 Experiment-Oriented Knowledge Closed Loop" },
        content: [
          { zh: "理论模型需要通过实验数据的检验。在分子轨道与能带理论的框架下，光电子能谱（PES）数据印证了多原子分子中存在不同能级的价层成键电子 1；核磁共振（NMR）与红外光谱（IR）实验证实了氢键中电荷转移现象的存在 14；紫外-可见吸收光谱（UV-Vis）结合选择定则，定量反映了前线轨道间电子跃迁的概率。这些实验证据与量子力学和群论计算相吻合，构建了现代化学理论的基础框架。", en: "Theoretical models must be validated by experimental data. Within the frameworks of molecular orbital and band theories, Photoelectron Spectroscopy (PES) data confirms the presence of distinct energy levels for valence bonding electrons in polyatomic molecules 1; Nuclear Magnetic Resonance (NMR) and Infrared Spectroscopy (IR) experiments verify the existence of charge transfer phenomena in hydrogen bonds 14; and UV-Vis absorption spectroscopy, coupled with selection rules, quantitatively reflects the probability of electronic transitions between frontier orbitals. These experimental proofs align with calculations based on wave mechanics and group theory, formulating the foundational structure of modern chemistry theories." },
        ]
      },
    ]
  },
  {
    id: "kb-reference",
    title: { zh: "9 Reference（参考文献）", en: "9 Reference" },
    children: [
      {
        id: "m8-1",
        title: { zh: "9.1 参考文献", en: "9.1 References" },
        content: [
          { zh: "本知识库各章专题内容主要依据项目组提供的中英文原始文稿编写。更完整的引用格式、具体原典与版权信息请以原始 Word 稿件或作者提供的书目为准。重要公式与结论建议对照权威教材与原始研究论文复核。", en: "The chapters in this knowledge base are based primarily on the Chinese and English source manuscripts supplied for the project. For full citation details, primary sources, and rights information, please refer to the original Word files or the bibliography provided by the authors. Key formulas and claims should be checked against standard textbooks and peer-reviewed literature." },
        ]
      },
      {
        id: "m8-2",
        title: { zh: "9.2 知识库整理说明", en: "9.2 About this knowledge base" },
        content: [
          { zh: "各章节正文在从源稿自动抽取与排版后，**由人工智能辅助**完成分段润色、中英对齐、以及公式与表格的格式统一与局部补全。AI 参与整理可能引入疏漏或不严谨的表述，不构成正式学术引用依据；如发现错误欢迎反馈勘误。", en: "After extraction and initial typesetting from the source manuscripts, the text was **organized and edited with AI assistance** for paragraph polish, bilingual alignment, and consistent handling of formulas and tables. AI-assisted compilation may contain errors or oversimplifications and should not be treated as a formal academic citation; please report corrections if you find issues." },
        ]
      },
    ]
  },
];