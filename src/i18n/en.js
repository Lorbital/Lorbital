/**
 * English (en) translation dictionary
 */
(function () {
  'use strict';

  var en = {
    // --- Navigation ---
    nav: {
      home: 'Home',
      story: 'Our Story',
      knowledge: 'Knowledge',
      explorer: 'Explorer'
    },

    // --- index.html ---
    index: {
      title: 'Lorbital Electron Orbitals',
      poem1: 'Now',
      poem2: 'Electron orbitals are presented in their most precise form',
      poem3: 'Awaiting you to give them unique meaning',
      cta: 'Launch Quantum Lab'
    },

    // --- story.html ---
    story: {
      loader: 'Loading...',
      mainTitle: 'Our Story',
      subtitle: 'Over the past six months, two high school students attempted to make electrons "visible".',
      origin: 'Here is our story:',
      p1: 'At Cambridge,<br>The professor displayed his <b>collection</b>.',
      caption1: 'Orbital wall, photographed at St Catherine\'s College, Cambridge',
      p2: 'Electrons were <b>"encased"</b> in glass.<br>What was once an <b>abstract and dull</b> concept suddenly took on a precise and exquisite form.',
      p3: 'At that moment,<br>we experienced the beauty of science for the first time<br>\u2014seeing how it could make abstract principles clear and tangible.<br>Yet for most students, electron orbitals remain mere two-dimensional diagrams in textbooks.',
      p4: 'Why, then, is such an experience reserved for only a select few?<br>Afterwards...',
      action: 'Action',
      p5: 'So, we started from the <b>fundamental</b> theories: the <b>Wavefunction and the Schr\u00f6dinger equation</b>.<br>Through countless rounds of coding and refining,<br>an electron orbital model, <b>adhering to quantum principles</b>, finally emerged before our eyes.',
      p6: '<b>But that wasn\'t enough.</b>',
      p7: 'To make this visualization <b>truly immersive and accessible</b>,<br>we built this website.<br>Here, <b>static 2D</b> diagrams are transformed into a <b>3D world</b>.<br>With <b>a simple swipe</b>, you can <b>explore</b> every "electron cloud" at your fingertips.',
      vision: 'Vision',
      p8: '<b>We believe that the tools we use to understand the world should themselves be beautiful.<br>Therefore, we are starting by making electrons "visible".</b>',
      p9: 'In the future, we hope this space will become a <b>shared</b> <b>"Home of Science"</b>\u2014<br>A space not just for discussion, but where <b>minds collide</b> and <b>curiosity takes root</b>.',
      p10: 'Open this door, join the ranks of <b>explorers</b>:<br>Lorbital_official (Wechat number)',
      p11: 'Keep the <b>beauty of science</b> close to you:<br><a href="https://e.tb.cn/h.iQu6LtZAW4Xi0O6?tk=gyg4520vEF8" target="_blank" rel="noopener noreferrer" style="color: var(--accent); text-decoration: underline;">Taobao: Lorbital electron orbital model</a><br>Open the link (Taobao app recommended) or search for the product on Taobao.',
      p12: '<b>We look forward to journeying with you\u2014<br>from visualizing electrons to comprehending the universe,<br>and ultimately falling in love with science itself.</b>'
    },

    // --- knowledge.html ---
    knowledge: {
      loader: 'Calibrating quantum formulas...',
      loadError: 'Failed to load knowledge base. Please refresh and try again.',
      tocLabel: 'Knowledge Base'
    },

    // --- explorer.html ---
    explorer: {
      // Category selector
      introTitle: 'Quantum Orbital Explorer',
      introText: 'Two tracks: atomic orbitals (hydrogen-like s–g point clouds) and molecular orbitals (layered DFT total density and HOMO). Choose an entry below.',
      homeAtomicTitle: 'Atomic orbitals',
      homeAtomicDesc: 'Periodic table and g orbitals',
      homeMolecularTitle: 'Molecular orbitals',
      homeMolecularDesc: 'Polyhedral cages and small molecules',
      atomicHomeTitle: 'Atomic orbitals',
      atomicHomeIntro: 'Browse hydrogen-like orbitals from the periodic table, or open the full g-orbital list.',
      molecularHomeTitle: 'Molecular orbitals',
      molecularHomeIntro: 'Geometry-optimized DFT total electron density and HOMO point clouds; cages and small molecules are listed here.',
      homeSfTitle: 'Atomic orbitals (periodic table)',
      homeSfDesc: 'Browse representative occupied subshells by element; hover for a poster preview',
      homeGTitle: 'g orbitals',
      homeGDesc: 'Ultra-high-order hydrogen-like orbitals',
      homeDodecTitle: 'Dodecahedral',
      homeDodecDesc: 'C\u2082\u2080H\u2082\u2080 cage model',
      homeIcosaTitle: 'Icosahedral',
      homeIcosaDesc: 'B\u2081\u2082H\u2081\u2082\u00b2\u207b cage model',
      molCardDodecTitle: 'Dodecahedrane',
      molCardDodecDesc: 'C\u2082\u2080H\u2082\u2080 cage: total density + HOMO',
      molCardDodecSym: '~Ih (optimized)',
      molCardIcosaTitle: 'closo-Borane',
      molCardIcosaDesc: 'B\u2081\u2082H\u2081\u2082\u00b2\u207b icosahedral cage',
      molCardIcosaSym: '~Ih (optimized)',
      molCardCH4Title: 'Methane',
      molCardCH4Desc: 'Tetrahedral small molecule, frontier-orbital demo',
      molCardCH4Sym: 'Td',
      molCardNH3Title: 'Ammonia',
      molCardNH3Desc: 'Trigonal pyramid and lone pair',
      molCardNH3Sym: 'C\u2083v',
      molCardH2OTitle: 'Water',
      molCardH2ODesc: 'Bent geometry and nonlinear density',
      molCardH2OSym: 'C\u2082v',
      molCardC2H4Title: 'Ethylene',
      molCardC2H4Desc: '\u03c0 bonding and planar framework',
      molCardC2H4Sym: 'D\u2082h',
      molCardC6H6Title: 'Benzene',
      molCardC6H6Desc: 'Conjugated \u03c0 system and delocalization',
      molCardC6H6Sym: 'D\u2086h',
      periodicIntro: 'Each cell shows a representative occupied subshell (not a full electron configuration). Hover shows a static poster if available; click to open the 3D viewer.',
      periodicLanth: 'Lanthanides 58\u201371',
      periodicAct: 'Actinides 90\u2013103',
      previewClickHint: 'Click a cell to open the full 3D model',
      previewNoPoster: 'No poster yet',
      catS: 'Spherical Orbital',
      catP: 'Dumbbell Orbital',
      catD: 'Clover Orbital',
      catF: 'Higher-order Orbital',
      catG: 'Ultra-high-order Orbital',
      catDodec: 'Dodecahedral',
      catIcosa: 'Icosahedral',
      catTitleS: 'S',
      catTitleP: 'P',
      catTitleD: 'D',
      catTitleF: 'F',
      catTitleG: 'G',
      catTitleDodec: 'Dodecahedral',
      catTitleIcosa: 'Icosahedral',

      // Orbital list
      backBtn: '\u2190 Back',
      comingSoon: 'Coming soon',
      noModels: 'No models available in this category',

      // Loading overlay
      loadingSync: 'Syncing quantum state...',
      loadingProcess: 'Processing model data...',
      loadFailed: 'Loading failed',
      modelFormatError: 'Invalid model file format',
      renderFailed: 'Render failed',
      processFailed: 'Processing failed',
      cleanupFailed: 'Cleanup failed',
      checkModel: 'Please check the model file',
      retryBtn: 'Retry',
      backToList: 'Back to list',

      // Viewer instructions
      instructionsTitle: 'Gesture Controls',
      instrRotateTitle: 'Single-hand Rotation',
      instrRotateDesc: 'Pinch your thumb and index finger (OK gesture),\nthen move your hand to rotate the model',
      instrZoomTitle: 'Two-hand Zoom',
      instrZoomDesc: 'Pinch with both hands,\nthen change the distance between them to zoom',
      instrNote: 'Other hands in view may affect recognition\nYou can also use a mouse or trackpad',
      instructionsHtml: '<b style="color:var(--accent)">Gesture Controls</b><br><br><b>Single-hand Rotation</b>:<br>Pinch your thumb and index finger (OK gesture),<br>then move your hand to rotate the model<br><br><b>Two-hand Zoom</b>:<br>Pinch with both hands,<br>change the distance between them to zoom<br><br>Other hands in view may affect recognition<br>You can also use a mouse or trackpad',

      // Experiment console
      consoleTitle: 'Experiment Console',
      autoRotate: 'Auto Rotate',
      rotateSpeed: 'Rotation Speed',
      showAxes: 'Show Axes',
      particleSize: 'Particle Size',
      showElectronDensity: 'Show Electron Density',
      showOrbitalPhase: 'Show HOMO',
      currentOrbital: 'Current Block Orbital',
      currentModel: 'Current model',
      viewOrbitalInfo: 'View orbital info',
      clearScreen: 'Clear screen',
      clearScreenExit: 'Exit clear screen',

      // Knowledge card
      basicInfo: 'Basic Info',
      quantumNumbers: 'Quantum Numbers',
      molecule: 'Molecule',
      orbitalType: 'Orbital Type',
      symmetryLabel: 'Point-group symmetry',
      displayTarget: 'Display Target',
      method: 'Method',
      basis: 'Basis / Model',
      chargeMultiplicity: 'Charge / Multiplicity',
      description: 'Description',
      scientificNote: 'Scientific Note',
      shapeFeatures: 'Shape Features',
      shape: 'Shape',
      symmetry: 'Symmetry',
      nodes: 'Nodes',

      // Tutorial
      tutorialClose: 'Close',
      tutorialSkip: 'Skip Tutorial',
      tutorialPrev: 'Previous',
      tutorialNext: 'Next',
      tutorialDone: 'Done',
      tutorialStep1Title: 'Pinch Gesture',
      tutorialStep1Desc: 'Pinch your thumb and index finger together to form the OK gesture (\ud83d\udc4c). This is the foundation of all gesture controls.<br>Release the pinch to exit gesture control mode.',
      tutorialStep2Title: 'Single-hand Rotation',
      tutorialStep2Desc: 'After pinching, move your hand to control the model\'s rotation. The model will follow the direction of your gesture.<br>Release the pinch to exit gesture control mode.',
      tutorialStep3Title: 'Two-hand Zoom',
      tutorialStep3Desc: 'Pinch with both hands, then change the distance between your hands to control zoom. Move hands closer to zoom out, further apart to zoom in.<br>Release the pinch to exit gesture control mode.',

      // Camera toggle
      cameraOff: 'Camera Off'
    }
  };

  if (window.I18N && window.I18N.registerDict) {
    window.I18N.registerDict('en', en);
  }
})();
