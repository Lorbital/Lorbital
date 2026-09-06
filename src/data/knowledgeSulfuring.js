/**
 * 化学之美：Sulfuring Chemistry Club
 * 文稿摘自桌面资料夹中的 Word（Preface / Luminol / Quantum Dots / Golden Rain / Gold Mirror / eBook / Epilogue）。
 * 独立页面 beauty.html，与知识库并列；不并入知识库章节目录。
 */
(function () {

  var P = "public/images/knowledge/sulfuring/";

  function fig(src, alt, caption, extraClass) {
    var cls = extraClass ? "kb-figure " + extraClass : "kb-figure";
    return (
      '<div class="' + cls + '">' +
        '<img src="' + P + src + '" alt="' + alt + '" loading="lazy">' +
        '<div class="kb-caption">' + caption + "</div>" +
      "</div>"
    );
  }

  function row(htmls) {
    return '<div class="kb-figure-row">' + htmls.join("") + "</div>";
  }

  function vid(src, caption) {
    return (
      '<div class="kb-figure">' +
        '<video controls playsinline preload="metadata" src="' + P + src + '"></video>' +
        '<div class="kb-caption">' + caption + "</div>" +
      "</div>"
    );
  }

  function ebook(href, title, note, openLabel) {
    return (
      '<div class="kb-ebook">' +
        '<div class="kb-ebook-bar">' +
          '<a href="' + href + '" target="_blank" rel="noopener noreferrer" download="Jason-Ye-ebook.pdf">' + openLabel + "</a>" +
          '<span class="kb-ebook-note">' + note + "</span>" +
        "</div>" +
        '<iframe src="' + href + '#toolbar=1&navpanes=0" title="' + title + '" loading="lazy"></iframe>' +
      "</div>"
    );
  }

  function quote(text) {
    return '<div class="kb-quote">' + text + "</div>";
  }

  var chapter = {
    id: "sulfuring-chemistry-club",
    title: { zh: "化学之美", en: "The Beauty of Chemistry" },
    children: [
      {
        id: "scc-preface",
        title: { zh: "前言", en: "Preface" },
        content: [
          { zh: "致本站读者：你好。", en: "To readers of this site: Hello there." },
          { zh: "化学常被称作物质的科学，但对我而言，它也是关于惊奇的科学。每一次色彩斑斓的反应背后，都有一段等待被发现的故事。鲁米诺被发现之初，很少有人能想到，它有朝一日会帮助法医在现场揭示被掩盖的证据。这样的发现提醒我们：今天的好奇心，可以成为明天的创新。", en: "Chemistry is often described as the science of matter, but to me, it is also a science of wonder. Behind every colorful reaction lies a story waiting to be uncovered. When luminol was first discovered, few could have imagined that it would one day help forensic scientists uncover hidden evidence at crime scenes. Discoveries like this remind us that curiosity today can become innovation in the future." },
          { zh: "本页正是为了分享这样的故事而设立。通过一系列实验与教育资源，我希望呈现课堂之外的化学之美，并鼓励读者去探寻所见反应背后的原理。无论你正迈出化学的第一步，还是单纯为分子世界着迷，都欢迎潜入其中，发现分子所讲述的故事。", en: "This page was created to share that story. Through a collection of experiments and educational resources, I hope to reveal the beauty of chemistry beyond the classroom and encourage others to explore the ideas behind the reactions they see. Whether you are taking your first steps into chemistry or are simply fascinated by the molecular world, I invite you to dive in and discover the stories that molecules tell." },
          {
            zh: row([
              fig("1-1.jpg", "Chroma Chem 活动合影", "图 1-1　Jason 作为主理人组织的 Chroma Chem: Colorful Chemistry Expo"),
              fig("1-4.jpg", "化学周活动合影", "图 1-4　学校 Chemistry Week 活动现场")
            ]),
            en: row([
              fig("1-1.jpg", "Chroma Chem group photo", "Fig. 1-1　Jason as lead organizer of Chroma Chem: Colorful Chemistry Expo"),
              fig("1-4.jpg", "Chemistry Week group photo", "Fig. 1-4　Chemistry Week at his school")
            ])
          },
          { zh: "**本页作者**", en: "**About the author of this page**" },
          { zh: "我是叶嘉诚（Jiacheng / Jason Ye），上海星河湾双语学校（Shanghai Starriver Bilingual School）高三学生。作为学生社团 We're Sulfuring Chemistry Club（200 余名成员）的创始人，我希望通过实验让化学变得可及、可感。社团每年大约组织 14 场互动演示。我的兴趣方向以微流控为主，也包括普通化学与生物化学。除学业之外，我也做过单簧管演奏、致力于提升毒品认知的社会行动，以及宣传总监等角色。", en: "I am Jiacheng (Jason) Ye, a G12 high school student at Shanghai Starriver Bilingual School. As the founder of We're Sulfuring Chemistry Club, a student organization with over 200 members, I strive to make chemistry accessible and inspiring through experimentation. Each year, our club organizes approximately 14 interactive demonstrations. Specializing in microfluidics, my interests also include general chemistry and biochemistry. Apart from achieving my academic best, I also explored a variety of roles: a clarinet performer, a social activist dedicated to raising drug awareness, and a publicity director (just to name a few!)." },
          {
            zh: row([
              fig("1-2.jpg", "国际单簧管节演出", "图 1-2　国际单簧管节演出"),
              fig("1-3.jpg", "作者照片", "图 1-3　作者")
            ]),
            en: row([
              fig("1-2.jpg", "International Clarinet Festival performance", "Fig. 1-2　Intl. Clarinet Festival performance"),
              fig("1-3.jpg", "Portrait of the author", "Fig. 1-3　The author")
            ])
          },
          { zh: "本章依次包含：前言、鲁米诺反应、碳与氧化锌量子点、黄金雨、金镜实验、Asian Drug Crisis 电子书，以及结语。", en: "Chapters: Preface, Luminol reactions, Carbon & Zinc Oxide quantum dots, Golden Rain, Gold mirror, Asian Drug Crisis eBook, and epilogue." },
          {
            zh: vid("Sulfuring_promo.mp4", "Sulfuring 社团宣传视频"),
            en: vid("Sulfuring_promo.mp4", "Sulfuring club promo video")
          },
          { zh: "希望你喜欢阅读这一页。本页照片均拍摄于 Sulfuring 社团活动现场。", en: "We hope you enjoy reading this webpage. All photos were captured during Sulfuring's club activities." }
        ]
      },
      {
        id: "scc-luminol",
        title: { zh: "鲁米诺反应", en: "Luminol Reactions" },
        content: [
          { zh: quote("有时，最重要的证据，恰恰是我们看不见的证据。"), en: quote("Sometimes, the most important evidence is the evidence we cannot see.") },
          { zh: "想象你走进一间全黑的房间。乍看之下，一切都很平常。接着，法医把一种看不见的溶液喷在地面上。几秒后，明亮的蓝光铺开，揭示出本已被仔细擦去的足迹与血迹。它几乎像魔术。", en: "Imagine walking into a completely dark room. At first glance, everything appears ordinary. Then, a forensic investigator sprays an invisible solution across the floor. Seconds later, brilliant blue light spreads across the room, revealing footprints and bloodstains that had been carefully cleaned away. It almost looks like magic." },
          { zh: "但它不是魔术。它是化学。", en: "It isn't. It is chemistry." },
          {
            zh: fig("2-1.jpg", "黑暗中发出蓝光的鲁米诺溶液", "图 2-1　黑暗中发光的鲁米诺"),
            en: fig("2-1.jpg", "Luminol glowing blue in the dark", "Fig. 2-1　Luminol glowing in the dark")
          },
          { zh: "**什么是鲁米诺？**", en: "**What is Luminol?**" },
          { zh: "鲁米诺（\\(\\mathrm{C_8H_7N_3O_2}\\)）是一种有机化合物，以化学发光著称：把化学能直接转化为光。与需要紫外灯等外光源的荧光不同，化学发光由反应本身产生光子。反应物一旦混合，便不再需要额外照明。", en: "Luminol (\\(\\mathrm{C_8H_7N_3O_2}\\)) is an organic compound best known for its ability to produce an intense blue glow through chemiluminescence, which is the direct conversion of chemical energy into light. Unlike fluorescence, which requires an external light source such as ultraviolet radiation, chemiluminescence generates light directly from a chemical reaction. Once the reactants are mixed, no additional illumination is needed." },
          {
            zh: fig("2-2.svg", "鲁米诺分子结构", "图 2-2　鲁米诺的结构", "kb-structure"),
            en: fig("2-2.svg", "Molecular structure of luminol", "Fig. 2-2　Structure of luminol", "kb-structure")
          },
          { zh: "**鲁米诺为什么会发光？**", en: "**Why does Luminol glow?**" },
          { zh: "鲁米诺反应需要鲁米诺、过氧化氢、强碱溶液，以及催化剂——通常是血红蛋白中的铁离子。", en: "The luminol reaction requires luminol, hydrogen peroxide, a strong alkaline solution, and a catalyst, usually the iron ions found in hemoglobin." },
          { zh: "这些组分相遇时，铁催化过氧化氢分解为活性氧物种，进而把鲁米诺氧化为激发态的 3-氨基邻苯二甲酸盐（3-aminophthalate）。激发态分子不稳定。当它回到基态时，多余能量以可见蓝光放出，波长约 425 nm。", en: "When these components come together, iron catalyzes the decomposition of hydrogen peroxide into reactive oxygen species. These oxidize luminol into an excited-state molecule known as 3-aminophthalate. Excited molecules are unstable. As 3-aminophthalate returns to its ground state, it releases its excess energy as visible blue light with a wavelength of approximately 425 nm." },
          { zh: "反应的能量很大一部分不以热的形式耗散，而是以光子发射，于是在黑暗中出现那道蓝光。", en: "Instead of producing heat, much of the reaction's energy is emitted as photons, creating the blue glow observed in dark environments." },
          {
            zh: fig("2-3.jpg", "讲解鲁米诺发光机理的课堂演示", "图 2-3　社团活动中讲解鲁米诺为何发光"),
            en: fig("2-3.jpg", "Lecture slide explaining why luminol glows", "Fig. 2-3　Explaining why luminol glows during a club session")
          },
          { zh: "<div class=\"formula-box\">$$ \\text{luminol} \\xrightarrow{\\mathrm{H_2O_2,\\ OH^-,\\ Fe}} \\text{3-aminophthalate}^* \\rightarrow h\\nu\\ (\\approx 425\\,\\mathrm{nm}) $$</div>", en: "<div class=\"formula-box\">$$ \\text{luminol} \\xrightarrow{\\mathrm{H_2O_2,\\ OH^-,\\ Fe}} \\text{3-aminophthalate}^* \\rightarrow h\\nu\\ (\\approx 425\\,\\mathrm{nm}) $$</div>" },
          { zh: "**我们的演示**", en: "**Our demonstration**" },
          { zh: "在 Sulfuring 的社团活动里，鲁米诺反应几乎总是观众最喜欢的演示之一。对许多同学而言，这次实验把化学从记忆科目，变成了发现的工具。", en: "During Sulfuring's club activities, the luminol reaction is consistently one of the audience's favorite demonstrations. For many students, this experiment transforms chemistry from a subject of memorization into a tool for discovery." },
          {
            zh: row([
              fig("2-4.jpg", "社团成员演示鲁米诺", "图 2-4　社团成员进行演示"),
              fig("2-5.jpg", "社团成员演示鲁米诺", "图 2-5　社团成员进行演示")
            ]),
            en: row([
              fig("2-4.jpg", "Club members performing the luminol demonstration", "Fig. 2-4　Club members performing the demonstration"),
              fig("2-5.jpg", "Club members performing the luminol demonstration", "Fig. 2-5　Club members performing the demonstration")
            ])
          },
          { zh: "**鲁米诺之美**", en: "**Beauty of Luminol**" },
          {
            zh: row([
              fig("2-6.jpg", "鲁米诺发光特写", "图 2-6　鲁米诺之美"),
              fig("2-7.jpg", "鲁米诺实验现场", "图 2-7　鲁米诺之美")
            ]),
            en: row([
              fig("2-6.jpg", "Close-up of luminol luminescence", "Fig. 2-6　Beauty of luminol"),
              fig("2-7.jpg", "Luminol demonstration in the lab", "Fig. 2-7　Beauty of luminol")
            ])
          },
          { zh: quote("好奇心，往往从看不见的地方开始。"), en: quote("Curiosity begins where visibility ends.") }
        ]
      },
      {
        id: "scc-qdots",
        title: { zh: "碳与氧化锌量子点", en: "Carbon & Zinc Oxide Quantum Dots" },
        content: [
          { zh: quote("在纳米尺度上，改变一颗粒子的大小，就可以改变光本身的颜色。"), en: quote("At the nanoscale, changing the size of a particle can change the color of light itself.") },
          { zh: "实验台上静静放着两支几乎难以分辨的试管。但一旦用紫外手电照上去，它们便化作蓝、绿、黄、白等明亮色泽，像一片星空。", en: "Two test tubes sit quietly on a laboratory bench, appearing almost indistinguishable. Yet the moment they are illuminated with an ultraviolet light torch, they transform into brilliant shades of blue, green, yellow, and white, like the starry sky." },
          {
            zh: fig("3-1.jpg", "碳量子点发出的蓝光", "图 3-1　碳量子点"),
            en: fig("3-1.jpg", "Blue emission from carbon quantum dots", "Fig. 3-1　Carbon quantum dots")
          },
          { zh: "这些发光溶液里装的是量子点：小到不再按普通材料行事的纳米粒子。它们服从量子力学，尺寸本身决定物质如何与光相互作用。看似简单的变色，其实是现代化学最迷人的前沿之一。", en: "These glowing solutions contain quantum dots, which are nanoparticles so small that they no longer behave like ordinary materials. Instead, they obey the laws of quantum mechanics, where size itself determines how matter interacts with light. What appears to be a simple color change is, in fact, a glimpse into what I think is one of the most fascinating frontiers of modern chemistry." },
          { zh: "**碳量子点**", en: "**Carbon Quantum Dots**" },
          { zh: "碳量子点（CQDs）是以碳为主的荧光纳米粒子，通常更环境友好，毒性也相对较低。我尝试过尿素、柠檬酸、抗坏血酸等多种含碳原料，最终发现 1 g 柠檬酸 + 1 g 抗坏血酸效果最好。", en: "Carbon quantum dots (CQDs) are fluorescent nanoparticles composed primarily of carbon. They are generally considered more environmentally friendly and exhibit relatively low toxicity. I tried experimenting with various carbon containing compounds, including urea, citric acid, and ascorbic acid before finding 1 g citric acid + 1 g ascorbic acid works best." },
          {
            zh: row([
              fig("3-2.jpg", "紫外灯下的碳量子点", "图 3-2　紫外灯下的碳量子点"),
              fig("3-3.jpg", "紫外灯下的碳量子点", "图 3-3　紫外灯下的碳量子点")
            ]),
            en: row([
              fig("3-2.jpg", "Carbon quantum dots under UV light", "Fig. 3-2　Carbon quantum dots under UV light"),
              fig("3-3.jpg", "Carbon quantum dots under UV light", "Fig. 3-3　Carbon quantum dots under UV light")
            ])
          },
          { zh: "**氧化锌量子点**", en: "**Zinc Oxide Quantum Dots**" },
          { zh: "ZnO 量子点具有强烈的紫外吸收与可见荧光，可用于光催化、紫外传感器和抗菌材料。实验中，紫外照射显示出合成 ZnO 量子点独特的荧光。随着氧化锌溶液被加热，颜色在黄、青绿与乳白之间变化，说明纳米尺度的调控可以根本改变一种熟悉化合物的光学行为。", en: "ZnO quantum dots exhibit intense ultraviolet absorption and visible fluorescence, making them useful in photocatalysis, ultraviolet sensors, and antimicrobial materials. In our experiment, ultraviolet illumination revealed the unique fluorescence of the synthesized ZnO quantum dots. It showed a wide range of colors as the Zinc Oxide solution was heated (yellow, lime, and milk white), demonstrating how nanoscale engineering can fundamentally alter the optical behavior of a familiar compound." },
          {
            zh: row([
              fig("3-4.jpg", "紫外照射下的氧化锌量子点", "图 3-4　紫外照射下的氧化锌量子点"),
              fig("3-5.jpg", "紫外照射下的氧化锌量子点", "图 3-5　紫外照射下的氧化锌量子点")
            ]),
            en: row([
              fig("3-4.jpg", "Zinc oxide quantum dots under UV illumination", "Fig. 3-4　Zinc oxide quantum dots under UV illumination"),
              fig("3-5.jpg", "Zinc oxide quantum dots under UV illumination", "Fig. 3-5　Zinc oxide quantum dots under UV illumination")
            ])
          },
          { zh: "**我们的演示**", en: "**Our demonstration**" },
          { zh: "对许多参与者来说，合成量子点是他们第一次真正接触纳米技术。", en: "For many participants, synthesizing QDs was their first encounter with nanotechnology." },
          {
            zh: fig("3-6.jpg", "社团成员在室内光与紫外光下观察碳量子点", "图 3-6　社团成员在室内光与紫外光下观察 CQDs"),
            en: fig("3-6.jpg", "Club members observing CQDs under room light and UV light", "Fig. 3-6　Club members observing CQDs under room light and UV light")
          },
          { zh: "**量子点为什么重要？**", en: "**Why Do Quantum Dots Matter?**" },
          { zh: "尽管肉眼看不见，量子点已经进入日常生活。它们被用于新一代电视显示，以更低能耗呈现更饱和的颜色。科学家也在探索其在靶向给药、太阳能电池与量子技术中的应用。", en: "Although they are invisible to the naked eye, quantum dots have already become part of everyday life. They are used in next-generation television displays to produce vivid and saturated colors while consuming less energy. Scientists are also exploring their applications in targeted drug delivery, solar cells, and quantum technologies." },
          { zh: quote("有时，把一件事做得更小，反而能让我们想象得更大。"), en: quote("Sometimes, making something smaller allows us to imagine something much bigger.") }
        ]
      },
      {
        id: "scc-golden-rain",
        title: { zh: "黄金雨反应", en: "The Golden Rain Reaction" },
        content: [
          { zh: quote("有时，化学并不发生在一瞬间。有时，它一颗晶体、一颗晶体地展开。"), en: quote("Sometimes, chemistry doesn't happen in an instant. Sometimes, it unfolds one crystal at a time.") },
          { zh: "把清澈溶液轻轻加热，直到晶体全部消失。起初并无特别之处。随后，溶液缓缓冷却，闪亮的金色薄片开始出现。它们一片接一片地在液体中漂落，像叶子一样——化学家长久以来称之为黄金雨反应。", en: "A clear solution is gently heated until every crystal disappears. At first, nothing seems remarkable. Then, as the solution slowly cools, shimmering golden plates begin to appear. One by one, they drift through the liquid like leaves, creating what chemists have long called the Golden Rain Reaction." },
          {
            zh: row([
              fig("4-1.jpg", "黄金雨实验", "图 4-1　黄金雨"),
              fig("4-2.jpg", "排成 SC 字母的黄色样品瓶", "图 4-2　黄金雨")
            ]),
            en: row([
              fig("4-1.jpg", "Golden Rain experiment", "Fig. 4-1　Golden Rain"),
              fig("4-2.jpg", "Yellow vials arranged as the letters S and C", "Fig. 4-2　Golden Rain")
            ])
          },
          { zh: "实验并不含金，却漂亮地展示了化学中最基本的观念之一：溶解度、温度与晶体生长之间的关系。", en: "Although no gold is involved, the experiment beautifully demonstrates one of chemistry's most fundamental ideas: the relationship between solubility, temperature, and crystal formation." },
          { zh: "**什么是黄金雨反应？**", en: "**What Is the Golden Rain Reaction?**" },
          { zh: "黄金雨是产生碘化铅（\\(\\mathrm{PbI_2}\\)）金色晶体的沉淀实验。它从混合两种无色水溶液开始：硝酸铅 \\(\\mathrm{Pb(NO_3)_2(aq)}\\) 与碘化钾 \\(\\mathrm{KI(aq)}\\)。", en: "The Golden Rain Reaction is a precipitation experiment that produces golden crystals of lead(II) iodide (\\(\\mathrm{PbI_2}\\)). It begins by mixing two colorless aqueous solutions: lead(II) nitrate, \\(\\mathrm{Pb(NO_3)_2(aq)}\\), and potassium iodide, \\(\\mathrm{KI(aq)}\\)." },
          { zh: "<div class=\"formula-box\">$$ \\mathrm{Pb(NO_3)_2(aq) + 2KI(aq) \\rightarrow PbI_2(s) + 2KNO_3(aq)} $$</div>", en: "<div class=\"formula-box\">$$ \\mathrm{Pb(NO_3)_2(aq) + 2KI(aq) \\rightarrow PbI_2(s) + 2KNO_3(aq)} $$</div>" },
          {
            zh: vid("4-3.mp4", "图 4-3　黄色沉淀的生成"),
            en: vid("4-3.mp4", "Fig. 4-3　Formation of the yellow precipitate")
          },
          { zh: "**“雨”为什么会出现？**", en: "**Why Does the \"Rain\" Appear?**" },
          { zh: "碘化铅在热水中的溶解度远高于冷水。加热时，许多黄色晶体完全溶解，溶液近乎透明。冷却后溶解度下降，溶解的离子无法再留在溶液中，开始重新排列成高度有序的晶格。", en: "Lead(II) iodide is much more soluble in hot water than in cold water. When the mixture is heated, many of the yellow crystals dissolve completely, producing a nearly transparent solution. As the solution cools, its solubility decreases. The dissolved ions can no longer remain in solution and begin to reorganize into highly ordered crystal lattices." },
          { zh: "晶体并不随意堆叠，而是逐渐长成薄的六角片。重力把这些晶体缓缓下拉，于是出现“黄金雨”。实验把离子如何自行组装成有序结构，变成可以直接看见的过程。", en: "Instead of forming randomly, the crystals grow gradually into thin, hexagonal plates. Gravity slowly pulls these crystals downward, producing the \"golden rain\" effect. The experiment offers a visualization of how ions assemble themselves into beautifully ordered structures." },
          {
            zh: fig("4-4.jpg", "黄金雨实验操作特写", "图 4-4　实验操作"),
            en: fig("4-4.jpg", "Hands-on Golden Rain experiment", "Fig. 4-4　The experiment in progress")
          },
          { zh: "**我们的演示**", en: "**Our Demonstration**" },
          { zh: "在社团所有演示中，黄金雨是最安静、也最能抓住人的实验之一。许多同学离开时都会惊讶：两瓶完全无色的溶液，竟能长出如此优雅的景象。", en: "Among all our club's demonstrations, the Golden Rain Reaction is one of the quietest and captivating experiments. Many students leave the demonstration surprised that such an elegant display can emerge from two completely colorless solutions." },
          {
            zh: row([
              fig("4-5.jpg", "社团成员演示黄金雨与风暴瓶", "图 4-5　社团成员演示黄金雨以及“风暴瓶”实验"),
              fig("4-6.jpg", "黄金雨活动现场", "图 4-6　社团活动现场")
            ]),
            en: row([
              fig("4-5.jpg", "Club members demonstrating Golden Rain and the storm bottle", "Fig. 4-5　Club members demonstrating golden rain as well as the \"storm bottle\" experiment"),
              fig("4-6.jpg", "Golden Rain club activity", "Fig. 4-6　Club activity")
            ])
          },
          { zh: "**看向晶体之外**", en: "**Looking Beyond the Crystals**" },
          { zh: "黄金雨常因美丽被记住，但它真正的功课在于：自然能从简单中创造出秩序。数百万随机运动的溶解离子，只需遵循热力学定律，就能逐渐组织成晶体。", en: "The Golden Rain Reaction is often remembered for its beauty, but its lesson lies in the ability of nature to create order from simplicity. Millions of dissolved ions, moving randomly, gradually organize themselves into crystals simply by following the laws of thermodynamics." },
          { zh: "化学因此提醒我们：即便最精致的图案，也可以从简单规则中生长出来。", en: "Chemistry therefore reminds us that even the most intricate patterns can emerge from simple rules." },
          { zh: quote("每一颗晶体，都始于一个离子找到自己的位置。"), en: quote("Every crystal begins with a single ion finding its place.") }
        ]
      },
      {
        id: "scc-gold-mirror",
        title: { zh: "金镜实验", en: "The Gold Mirror Experiment" },
        content: [
          { zh: quote("人们常因黄金的美丽而赞美它，但化学揭示：它更动人的美，在于它如何被转化。"), en: quote("Gold is often admired for its beauty, but chemistry reveals that its greatest beauty lies in how it is transformed.") },
          { zh: "多数人想到金，会想到首饰或宝藏。在实验室里，金讲述的是另一个故事。", en: "When most people think of gold, they imagine jewelry or treasures. In the laboratory, however, gold tells a very different story." },
          { zh: "黄色溶液与还原剂轻轻混合，在洁净的玻璃瓶中旋动。液体慢慢褪色，一层明亮的金属膜开始出现。几分钟内，原本透明的玻璃覆上一薄层纯金，普通烧瓶变成闪耀的金镜。", en: "A yellow solution is gently mixed with a reducing agent and swirled inside a clean glass flask. Slowly, the liquid loses its color as a brilliant metallic film begins to appear. Within minutes, the once-transparent glass is coated with a thin layer of pure gold, transforming an ordinary flask into a gleaming golden mirror." },
          {
            zh: row([
              fig("5-1.jpg", "金镜实验中的黄色金溶液", "图 5-1　金镜"),
              fig("5-2.jpg", "金镜实验产物", "图 5-2　金镜")
            ]),
            en: row([
              fig("5-1.jpg", "Yellow gold solution in the Gold Mirror experiment", "Fig. 5-1　Gold Mirror"),
              fig("5-2.jpg", "Product of the Gold Mirror experiment", "Fig. 5-2　Gold Mirror")
            ])
          },
          { zh: "**什么是金镜实验？**", en: "**What Is the Gold Mirror Experiment?**" },
          { zh: "金镜实验是氧化还原化学的演示：溶解的金离子被化学还原为单质金。反应从氯金酸（\\(\\mathrm{HAuCl_4}\\)）开始，其中金处于 +3 氧化态。溶液虽呈浅黄，金却只以溶解离子存在，并非可见金属。", en: "The Gold Mirror Experiment is a demonstration of redox chemistry, in which dissolved gold ions are chemically reduced into gold. The reaction begins with chloroauric acid (\\(\\mathrm{HAuCl_4}\\)), a compound containing gold in the +3 oxidation state. Although the solution appears light yellow, the gold exists only as dissolved ions rather than visible metal." },
          { zh: "加入适当还原剂后，金离子得到电子，转变为金属金。新生成的原子并不悬浮在溶液中，而是逐渐沉积在瓶内壁，形成连续的反射镀层。结果是一层极薄的金做成的镜子。", en: "When an appropriate reducing agent is introduced, the gold ions gain electrons and are converted into metallic gold. Instead of remaining suspended in solution, the newly formed atoms gradually deposit onto the inner surface of the bottles, forming a continuous reflective coating. The result is a mirror made entirely from a thin layer of gold." },
          { zh: "<div class=\"formula-box\">$$ \\mathrm{Au^{3+} + 3e^- \\rightarrow Au(s)} $$</div>", en: "<div class=\"formula-box\">$$ \\mathrm{Au^{3+} + 3e^- \\rightarrow Au(s)} $$</div>" },
          {
            zh: fig("5-3.jpg", "氯金酸样品", "图 5-3　氯金酸"),
            en: fig("5-3.jpg", "Chloroauric acid samples", "Fig. 5-3　Chloroauric acid")
          },
          {
            zh: vid("5-4.mp4", "图 5-4　金镜如何形成"),
            en: vid("5-4.mp4", "Fig. 5-4　How gold mirrors form")
          },
          { zh: "**我们的演示**", en: "**Our Demonstration**" },
          { zh: "这或许是我们迄今最昂贵的实验：1 g 氯金酸约 700 元（约 100 美元）。衷心感谢赞助人 aya 提供的 5 g 氯金酸，没有这份支持，实验无法进行。", en: "This is perhaps the most expensive experiment we have done so far, as 1 g of chloroauric acid costs 700 yuan (roughly $100). Genuine thanks to our sponsor aya for 5 g of chloroauric acid, as your support made this experiment possible." },
          { zh: "**科普视频**", en: "**Science communication video**" },
          { zh: "Sulfuring 与 SSBS 电视台合作，制作了这一主题的科普视频，含中英两个版本。", en: "Sulfuring, in collaboration with SSBS TV station, created a science communication video about this topic. It includes both English and Chinese versions." },
          {
            zh: vid("GoldMirror_cn.mp4", "金镜实验科普视频（中文版）"),
            en: vid("GoldMirror_eng.mp4", "Gold Mirror science video (English)")
          },
          {
            zh: vid("GoldMirror_eng.mp4", "金镜实验科普视频（英文版）"),
            en: vid("GoldMirror_cn.mp4", "Gold Mirror science video (Chinese)")
          },
          { zh: "再次特别感谢本次实验的赞助人 aya。", en: "Again, special thanks to the sponsor of this experiment, aya." }
        ]
      },
      {
        id: "scc-ebook",
        title: { zh: "Asian Drug Crisis 电子书", en: "Asian Drug Crisis eBook" },
        content: [
          { zh: "这是我撰写的电子书，旨在提升亚洲地区的毒品认知。它考察多个亚洲国家的相关问题，并倡导音乐与运动疗法。目前该书已分发至 30 余个国家、2000 余位读者，以及国际学校、图书馆和医院。", en: "This is an eBook I wrote dedicated to raise drug awareness in Asia. It investigates various Asian countries whilst examining their drug issues and promotes music & sports therapy. Currently, this eBook has been distributed to 30+ countries with 2000+ readers, as well as international schools, libraries, and hospitals." },
          {
            zh: ebook(
              "public/files/knowledge/sulfuring/Jason-Ye-ebook.pdf",
              "Asian Drug Crisis eBook",
              "PDF · 约 28 MB",
              "在线阅读 / 下载电子书"
            ),
            en: ebook(
              "public/files/knowledge/sulfuring/Jason-Ye-ebook.pdf",
              "Asian Drug Crisis eBook",
              "PDF · about 28 MB",
              "Read online / download eBook"
            )
          },
          { zh: "希望你喜欢。", en: "Hope you enjoy it!" }
        ]
      },
      {
        id: "scc-epilogue",
        title: { zh: "结语", en: "Epilogue" },
        content: [
          { zh: quote("最有意义的实验，不是以一次成功的反应结束的那些，而是让我们带着更好的问题离开的那些。"), en: quote("The most meaningful experiments are not the ones that end with a successful reaction, but the ones that leave us with a better question.") },
          { zh: "创办 We're Sulfuring Chemistry Club 时，我以为目标是教化学。回望时才发现，我从希望启发的人身上，学到了同样多的东西。", en: "When I founded We're Sulfuring Chemistry Club, I thought my goal was to teach chemistry. Looking back, I realize that I have learned just as much from the people I hoped to inspire." },
          {
            zh: fig("6-1.jpg", "锥形瓶中的蓝色溶液", "图 6-1"),
            en: fig("6-1.jpg", "Blue solution in an Erlenmeyer flask", "Fig. 6-1")
          },
          { zh: "若这个网站曾让你在发光的溶液前、在生长的晶体前、或在一次看似平常的反应前停下来，问一句“为什么”，那么它就已经完成了我所希望的事。", en: "If this website has encouraged you to pause before a glowing solution, a growing crystal, or a seemingly ordinary reaction and wonder why, then it has accomplished exactly what I hoped." },
          { zh: "感谢阅读，感谢探索，也感谢与我们一同分享化学之美。", en: "Thank you for reading, for exploring, and for sharing in the beauty of chemistry." },
          {
            zh: fig("6-2.jpg", "Sulfuring 社团活动合影", "图 6-2"),
            en: fig("6-2.jpg", "Sulfuring club group photo", "Fig. 6-2")
          },
          { zh: quote("好奇心，最好被分享。"), en: quote("Curiosity is best when shared.") }
        ]
      }
    ]
  };

  window.CHEMISTRY_BEAUTY = chapter;
})();
