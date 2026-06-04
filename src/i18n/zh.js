/**
 * Chinese (zh) translation dictionary
 */
(function () {
  'use strict';

  var zh = {
    // --- Navigation ---
    nav: {
      home: '首页',
      story: '我们的故事',
      knowledge: '知识库',
      explorer: '探测器'
    },

    // --- index.html ---
    index: {
      title: 'Lorbital电子轨道',
      poem1: '如今',
      poem2: '电子轨道以最精确的形态呈现于眼前',
      poem3: '等待你赋予它独特的意义',
      cta: '启动量子实验室'
    },

    // --- story.html ---
    story: {
      loader: '加载中...',
      mainTitle: '我们的故事',
      subtitle: '这是半年来，两个高中生试图让电子"看得见"的故事：',
      origin: '缘起',
      p1: '在剑桥，<br>教授展示了他的<b>收藏</b>。',
      caption1: '轨道墙图片，摄于剑桥St Catherine学院',
      p2: '电子被<b>"装进了"</b>玻璃里，<br>原本<b>抽象枯燥</b>的概念，忽然拥有了精确且精美的形状。',
      p3: '那一刻，<br>我们第一次感受到科学的美，<br>在于它能让那些抽象的规律变得清晰、可感。<br>对于大多数同学，电子轨道依然停留在课本上的二维图片。',
      p4: '那为什么，这样的体验只属于少部分人呢？<br>于是....',
      action: '行动',
      p5: '我们从<b>一切本源</b>的理论出发：<b>波函数、薛定谔方程</b>，<br>经过反复地调试与打磨，<br>最终，<b>遵循量子规律</b>的电子云模型，呈现在我们眼前。',
      p6: '<b>但，这还不够。</b>',
      p7: '为了让"看见"更<b>无界，更身临其境</b>，<br>我们搭建了这个网站。<br>在这里，<b>单一角度</b>的平面图被投放于<b>三维世界</b>，<br><b>指尖轻移</b>，便可<b>探索</b>每一片电子云。',
      vision: '愿景',
      p8: '<b>我们相信，理解世界的工具，本身就应该是一种美。<br>而我们，正从让电子"被看见"开始。</b>',
      p9: '未来，我们希望这里能成为一个<b>共同</b>的<b>"科学之家"</b>----<br>一个不止于讨论，更能让<b>灵魂碰撞</b>，让<b>好奇生根</b>的地方。',
      p10: '推开这扇门，加入<b>探索者</b>的行列：<br>Lorbital_official（微信号）',
      p11: '将<b>科学之美</b>留在身边：<br><a href="https://e.tb.cn/h.iQu6LtZAW4Xi0O6?tk=gyg4520vEF8" target="_blank" rel="noopener noreferrer" style="color: var(--accent); text-decoration: underline;">【淘宝】Lorbital 电子轨道模型</a><br>点击链接直接打开 或者 淘宝搜索直接打开',
      p12: '<b>我们期待与你一起，从"看见"电子，到理解万物，直至真正热爱上科学本身。</b>'
    },

    // --- knowledge.html ---
    knowledge: {
      loader: '正在校准量子公式...',
      loadError: '知识库数据加载失败，请刷新页面重试。',
      tocLabel: '知识库目录'
    },

    // --- explorer.html ---
    explorer: {
      // Category selector
      introTitle: '量子轨道探测器',
      introText: '本页提供两条主线：原子轨道（氢样 s–g 点云）与分子轨道（DFT 总电子密度与 HOMO 等多层点云）。请选择下方入口。',
      homeAtomicTitle: '原子轨道',
      homeAtomicDesc: '元素周期表与 g 轨道',
      homeMolecularTitle: '分子轨道',
      homeMolecularDesc: '多面体笼与基础小分子',
      atomicHomeTitle: '原子轨道',
      atomicHomeIntro: '通过元素周期表浏览代表性氢样轨道，或打开 g 轨道完整列表。',
      molecularHomeTitle: '分子轨道',
      molecularHomeIntro: '几何优化后的 DFT 电子密度与 HOMO 点云；多面体笼与基础小分子统一由此进入。',
      homeSfTitle: '原子轨道（周期表）',
      homeSfDesc: '按元素浏览代表性占据亚层，悬停可预览',
      homeGTitle: 'g 轨道',
      homeGDesc: '超高阶氢样轨道列表',
      homeDodecTitle: '正十二面体',
      homeDodecDesc: 'C₂₀H₂₀ 笼模型',
      homeIcosaTitle: '正二十面体',
      homeIcosaDesc: 'B₁₂H₁₂²⁻ 笼模型',
      molCardDodecTitle: '正十二面体烷',
      molCardDodecDesc: 'C₂₀H₂₀ 笼烷：总电子密度与 HOMO 叠加',
      molCardDodecSym: '近似 Ih（优化后）',
      molCardIcosaTitle: 'closo-硼烷',
      molCardIcosaDesc: 'B₁₂H₁₂²⁻ 二十面体笼',
      molCardIcosaSym: '近似 Ih（优化后）',
      molCardCH4Title: '甲烷',
      molCardCH4Desc: '四面体小分子，前线轨道入门示例',
      molCardCH4Sym: 'Td',
      molCardNH3Title: '氨',
      molCardNH3Desc: '三角锥与孤对电子',
      molCardNH3Sym: 'C₃v',
      molCardH2OTitle: '水',
      molCardH2ODesc: '弯曲构型与非线性电子分布',
      molCardH2OSym: 'C₂v',
      molCardC2H4Title: '乙烯',
      molCardC2H4Desc: 'π 键与平面构型',
      molCardC2H4Sym: 'D₂h',
      molCardC6H6Title: '苯',
      molCardC6H6Desc: '共轭 π 体系与离域',
      molCardC6H6Sym: 'D₆h',
      periodicIntro: '格子内为各元素的「代表性占据亚层」示意，并非完整电子排布。悬停显示静态预览图（若已提供），点击进入三维查看器。',
      periodicLanth: '镧系 58–71',
      periodicAct: '锕系 90–103',
      previewClickHint: '点击格子进入完整 3D 模型',
      previewNoPoster: '暂无预览图',
      catS: '球对称轨道',
      catP: '哑铃形轨道',
      catD: '瓣状分布轨道',
      catF: '高阶对称轨道',
      catG: '超高阶轨道',
      catDodec: '正十二面体',
      catIcosa: '正二十面体',
      catTitleS: 'S',
      catTitleP: 'P',
      catTitleD: 'D',
      catTitleF: 'F',
      catTitleG: 'G',
      catTitleDodec: '正十二面体',
      catTitleIcosa: '正二十面体',

      // Orbital list
      backBtn: '← 返回',
      comingSoon: '即将推出',
      noModels: '该分类下暂无可用模型',

      // Loading overlay
      loadingSync: '量子态同步中...',
      loadingProcess: '处理模型数据...',
      loadFailed: '加载失败',
      modelFormatError: '模型文件格式错误',
      renderFailed: '渲染失败',
      processFailed: '处理失败',
      cleanupFailed: '清理失败',
      checkModel: '请检查模型文件',
      retryBtn: '重试',
      backToList: '返回列表',

      // Viewer instructions
      instructionsTitle: '手势控制方法',
      instrRotateTitle: '单手控制旋转',
      instrRotateDesc: '单手捏紧食指和拇指（OK的手势），\n通过手的移动控制模型旋转',
      instrZoomTitle: '双手控制缩放',
      instrZoomDesc: '双手分别捏紧食指和拇指，\n通过双手之间的距离控制模型缩放',
      instrNote: '注意画面中其他的手会影响识别\n也可使用鼠标或触控板控制',
      instructionsHtml: '<b style="color:var(--accent)">手势控制方法</b><br><br><b>单手控制旋转</b>：<br>单手捏紧食指和拇指（OK的手势），<br>通过手的移动控制模型旋转<br><br><b>双手控制缩放</b>：<br>双手分别捏紧食指和拇指，<br>通过双手之间的距离控制模型缩放<br><br>注意画面中其他的手会影响识别<br>也可使用鼠标或触控板控制',

      // Experiment console
      consoleTitle: '实验控制台',
      autoRotate: '自动旋转',
      rotateSpeed: '旋转速度',
      showAxes: '显示坐标轴',
      particleSize: '粒子大小',
      showElectronDensity: '显示电子密度',
      showOrbitalPhase: '显示 HOMO 轨道',
      currentOrbital: '当前 block 轨道',
      currentModel: '当前模型',
      viewOrbitalInfo: '查看轨道信息',
      clearScreen: '清屏模式',
      clearScreenExit: '退出清屏',

      // Knowledge card
      basicInfo: '基本信息',
      quantumNumbers: '量子数',
      molecule: '分子',
      orbitalType: '轨道类型',
      symmetryLabel: '点群对称性',
      displayTarget: '展示对象',
      method: '理论方法',
      basis: '基组 / 模型',
      chargeMultiplicity: '电荷与多重度',
      description: '描述',
      scientificNote: '科学说明',
      shapeFeatures: '形状特征',
      shape: '形状',
      symmetry: '对称性',
      nodes: '节点数',

      // Tutorial
      tutorialClose: '关闭',
      tutorialSkip: '跳过教程',
      tutorialPrev: '上一步',
      tutorialNext: '下一步',
      tutorialDone: '完成',
      tutorialStep1Title: '捏合手势',
      tutorialStep1Desc: '将拇指和食指捏合，形成 OK 手势（👌）。这是所有手势操作的基础。<br>停止捏合即可退出手势控制模式。',
      tutorialStep2Title: '单手平移控制旋转',
      tutorialStep2Desc: '单手捏合后，移动手掌来控制模型的旋转。模型会跟随你的手势方向旋转。<br>停止捏合即可退出手势控制模式。',
      tutorialStep3Title: '双手距离控制缩放',
      tutorialStep3Desc: '双手分别捏合，通过改变双手之间的距离来控制模型的缩放。双手靠近时缩小，双手远离时放大。<br>停止捏合即可退出手势控制模式。',

      // Camera toggle
      cameraOff: '摄像头已关闭'
    }
  };

  if (window.I18N && window.I18N.registerDict) {
    window.I18N.registerDict('zh', zh);
  }
})();
