/**
 * 知识库页面：左侧目录 + 中间内容
 * 点击左侧大标题，中间显示该模块的知识点。
 * 依赖：先加载 src/data/knowledgeBase.js（写入 window.KNOWLEDGE_BASE），避免 ES 模块在 file:// 下不可用。
 */

const KNOWLEDGE_BASE = window.KNOWLEDGE_BASE || [];
// #region agent log
fetch('http://127.0.0.1:7242/ingest/1b9ad90f-ed47-4eb6-817b-33982b8d2edb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'knowledgePage.js:init',message:'KNOWLEDGE_BASE',data:{baseLen:KNOWLEDGE_BASE.length,hasWindow:typeof window.KNOWLEDGE_BASE},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1'})}).catch(function(){});
// #endregion

/** 将 **text** 转为 <strong>text</strong> */
function bold(html) {
  return String(html).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

const toc = document.getElementById('knowledge-toc');
const contentEl = document.getElementById('knowledge-content');
// #region agent log
fetch('http://127.0.0.1:7242/ingest/1b9ad90f-ed47-4eb6-817b-33982b8d2edb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'knowledgePage.js:dom',message:'toc contentEl',data:{toc:!!toc,contentEl:!!contentEl,willReturn:!(toc&&contentEl)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H3'})}).catch(function(){});
// #endregion
if (!toc || !contentEl) return;

/** 渲染某一模块到中间区域 */
function renderSection(sec) {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/1b9ad90f-ed47-4eb6-817b-33982b8d2edb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'knowledgePage.js:renderSection',message:'entry',data:{secId:sec&&sec.id},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H4'})}).catch(function(){});
  // #endregion
  const panel = document.createElement('section');
  panel.className = 'glass-panel';
  panel.id = sec.id;

  const h2 = document.createElement('h2');
  h2.textContent = sec.title;
  panel.appendChild(h2);

  for (const ch of sec.children || []) {
    const h3 = document.createElement('h3');
    h3.id = ch.id;
    h3.textContent = ch.title;
    panel.appendChild(h3);

    for (const text of ch.content || []) {
      const p = document.createElement('p');
      p.innerHTML = bold(text);
      panel.appendChild(p);
    }

    if (ch.formula) {
      const box = document.createElement('div');
      box.className = 'formula-box';
      box.innerHTML = `$$ ${ch.formula} $$`;
      panel.appendChild(box);
    }
  }

  contentEl.innerHTML = '';
  contentEl.appendChild(panel);

  if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
    window.MathJax.typesetPromise([panel]).catch(() => {});
  }
}

/** 设置当前选中的目录项 */
function setActive(id) {
  toc.querySelectorAll('a').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('data-id') === id);
  });
}

/** 根据 id 找模块 */
function getSectionById(id) {
  return KNOWLEDGE_BASE.find((s) => s.id === id) || KNOWLEDGE_BASE[0];
}

// 左侧目录
for (const sec of KNOWLEDGE_BASE) {
  const a = document.createElement('a');
  a.href = '#' + sec.id;
  a.setAttribute('data-id', sec.id);
  a.textContent = sec.title;
  a.addEventListener('click', (e) => {
    e.preventDefault();
    setActive(sec.id);
    renderSection(sec);
    history.replaceState(null, '', '#' + sec.id);
  });
  toc.appendChild(a);
}
// #region agent log
fetch('http://127.0.0.1:7242/ingest/1b9ad90f-ed47-4eb6-817b-33982b8d2edb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'knowledgePage.js:afterFor',message:'links appended',data:{linksCount:toc?toc.querySelectorAll('a').length:0},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H4'})}).catch(function(){});
// #endregion

// 初始：优先用 URL hash，否则第一个模块；hash 无效时修正为第一模块
const hashId = location.hash.slice(1);
const initial = getSectionById(hashId);
setActive(initial.id);
renderSection(initial);
if (hashId && hashId !== initial.id) history.replaceState(null, '', '#' + initial.id);

// 浏览器前进/后退或手动改 hash 时同步
window.addEventListener('hashchange', () => {
  const id = location.hash.slice(1);
  const sec = getSectionById(id);
  setActive(sec.id);
  renderSection(sec);
});
