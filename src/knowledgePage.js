/**
 * 知识库页面：左侧目录 + 中间内容
 * 点击左侧大标题，中间显示该模块的知识点。
 * 依赖：先加载 src/data/knowledgeBase.js（写入 window.KNOWLEDGE_BASE），避免 ES 模块在 file:// 下不可用。
 */

/** 将 **text** 转为 <strong>text</strong> */
function bold(html) {
  return String(html).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

// 等待 DOM 加载完成后再执行
document.addEventListener('DOMContentLoaded', () => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/850e76a1-caf4-489c-9914-1d5532476236',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'knowledgePage.js:13',message:'DOMContentLoaded fired',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  
  const KNOWLEDGE_BASE = window.KNOWLEDGE_BASE || [];
  
  // 数据验证：检查知识库数据是否加载
  if (!KNOWLEDGE_BASE || KNOWLEDGE_BASE.length === 0) {
    const contentEl = document.getElementById('knowledge-content');
    if (contentEl) {
      contentEl.innerHTML = '<div class="glass-panel"><p style="color: rgba(255, 255, 255, 0.7);">知识库数据加载失败，请刷新页面重试。</p></div>';
    }
    console.error('知识库数据未加载：KNOWLEDGE_BASE 为空或未定义');
    return;
  }

  const toc = document.getElementById('knowledge-toc');
  const contentEl = document.getElementById('knowledge-content');
  
  // DOM 元素验证
  if (!toc || !contentEl) {
    console.error('知识库页面 DOM 元素未找到：toc 或 contentEl 不存在');
    return;
  }

  // #region agent log
  const layoutEl = document.querySelector('.knowledge-layout');
  const sidebarEl = document.querySelector('.knowledge-sidebar');
  if (layoutEl && sidebarEl) {
    const layoutStyle = window.getComputedStyle(layoutEl);
    const sidebarStyle = window.getComputedStyle(sidebarEl);
    const layoutRect = layoutEl.getBoundingClientRect();
    const sidebarRect = sidebarEl.getBoundingClientRect();
    fetch('http://127.0.0.1:7242/ingest/850e76a1-caf4-489c-9914-1d5532476236',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'knowledgePage.js:35',message:'Layout computed styles and positions',data:{flexDirection:layoutStyle.flexDirection,display:layoutStyle.display,sidebarPosition:sidebarStyle.position,sidebarLeft:sidebarStyle.left,sidebarRight:sidebarStyle.right,sidebarWidth:sidebarStyle.width,layoutLeft:layoutRect.left,layoutRight:layoutRect.right,sidebarLeftPos:sidebarRect.left,sidebarRightPos:sidebarRect.right,windowWidth:window.innerWidth},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C'})}).catch(()=>{});
  }
  // #endregion

  /** 渲染某一模块到中间区域 */
  function renderSection(sec) {
    if (!sec) {
      console.error('renderSection: sec 参数无效');
      return;
    }
    
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

    // 渲染 MathJax 公式
    if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
      window.MathJax.typesetPromise([panel]).catch(() => {});
    }
  }

  /** 渲染单个子标题内容到中间区域 */
  function renderChild(sec, child) {
    if (!sec || !child) {
      console.error('renderChild: sec 或 child 参数无效');
      return;
    }
    
    const panel = document.createElement('section');
    panel.className = 'glass-panel';
    panel.id = child.id;

    const h2 = document.createElement('h2');
    h2.textContent = sec.title;
    panel.appendChild(h2);

    const h3 = document.createElement('h3');
    h3.id = child.id;
    h3.textContent = child.title;
    panel.appendChild(h3);

    for (const text of child.content || []) {
      const p = document.createElement('p');
      p.innerHTML = bold(text);
      panel.appendChild(p);
    }

    if (child.formula) {
      const box = document.createElement('div');
      box.className = 'formula-box';
      box.innerHTML = `$$ ${child.formula} $$`;
      panel.appendChild(box);
    }

    contentEl.innerHTML = '';
    contentEl.appendChild(panel);

    // 渲染 MathJax 公式
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
    if (!id) return KNOWLEDGE_BASE[0];
    return KNOWLEDGE_BASE.find((s) => s.id === id) || KNOWLEDGE_BASE[0];
  }

  /** 根据 id 找子标题 */
  function getChildById(childId) {
    for (const sec of KNOWLEDGE_BASE) {
      const child = sec.children?.find((ch) => ch.id === childId);
      if (child) return { section: sec, child };
    }
    return null;
  }

  // 构建左侧目录列表（包含大模块和子标题）
  for (const sec of KNOWLEDGE_BASE) {
    // 大模块标题
    const sectionItem = document.createElement('div');
    sectionItem.className = 'knowledge-section-item';
    
    const a = document.createElement('a');
    a.href = '#' + sec.id;
    a.setAttribute('data-id', sec.id);
    a.className = 'knowledge-section-title';
    a.textContent = sec.title;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      setActive(sec.id);
      renderSection(sec);
      history.replaceState(null, '', '#' + sec.id);
    });
    sectionItem.appendChild(a);

    // 子标题列表
    if (sec.children && sec.children.length > 0) {
      const childrenList = document.createElement('div');
      childrenList.className = 'knowledge-children-list';
      
      for (const ch of sec.children) {
        const childLink = document.createElement('a');
        childLink.href = '#' + ch.id;
        childLink.setAttribute('data-id', ch.id);
        childLink.className = 'knowledge-child-item';
        childLink.textContent = ch.title;
        childLink.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          setActive(ch.id);
          renderChild(sec, ch);
          history.replaceState(null, '', '#' + ch.id);
        });
        childrenList.appendChild(childLink);
      }
      
      sectionItem.appendChild(childrenList);
    }
    
    toc.appendChild(sectionItem);
    
    // #region agent log
    const sidebarCheck = document.querySelector('.knowledge-sidebar');
    const tocCheck = document.getElementById('knowledge-toc');
    if (sidebarCheck && tocCheck && sectionItem.parentElement) {
      const sidebarRect = sidebarCheck.getBoundingClientRect();
      const tocRect = tocCheck.getBoundingClientRect();
      const itemRect = sectionItem.getBoundingClientRect();
      fetch('http://127.0.0.1:7242/ingest/850e76a1-caf4-489c-9914-1d5532476236',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'knowledgePage.js:197',message:'After appending sectionItem - check parent hierarchy',data:{sectionTitle:sec.title,itemParentClass:sectionItem.parentElement.className,itemParentId:sectionItem.parentElement.id,sidebarContainsToc:sidebarCheck.contains(tocCheck),tocContainsItem:tocCheck.contains(sectionItem),sidebarLeft:sidebarRect.left,sidebarRight:sidebarRect.right,itemLeft:itemRect.left,itemRight:itemRect.right},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    }
    // #endregion
  }

  // #region agent log
  setTimeout(() => {
    const layoutEl = document.querySelector('.knowledge-layout');
    const sidebarEl = document.querySelector('.knowledge-sidebar');
    const mainEl = document.querySelector('.knowledge-main');
    const navEl = document.querySelector('nav');
    if (layoutEl && sidebarEl && mainEl) {
      const layoutStyle = window.getComputedStyle(layoutEl);
      const sidebarStyle = window.getComputedStyle(sidebarEl);
      const layoutRect = layoutEl.getBoundingClientRect();
      const sidebarRect = sidebarEl.getBoundingClientRect();
      const mainRect = mainEl.getBoundingClientRect();
      const navRect = navEl ? navEl.getBoundingClientRect() : null;
      const domOrder = Array.from(layoutEl.children).map(el => el.className);
      
      // 检查滚动位置
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollX = window.scrollX || window.pageXOffset;
      
      // 检查侧边栏内的所有按钮/链接
      const sidebarLinks = sidebarEl.querySelectorAll('a');
      const linkPositions = Array.from(sidebarLinks).slice(0, 5).map((link, idx) => {
        const rect = link.getBoundingClientRect();
        const style = window.getComputedStyle(link);
        const isVisible = rect.top >= 0 && rect.top < window.innerHeight && rect.left >= 0 && rect.left < window.innerWidth;
        return {
          index: idx,
          text: link.textContent.substring(0, 20),
          top: rect.top,
          left: rect.left,
          right: rect.right,
          bottom: rect.bottom,
          position: style.position,
          display: style.display,
          isVisible: isVisible,
          isAboveViewport: rect.top < 0,
          isBelowNav: navRect ? rect.top < navRect.bottom : false
        };
      });
      
      // 检查是否有其他位置的按钮
      const allButtons = document.querySelectorAll('a.knowledge-section-title, a.knowledge-child-item');
      const allButtonPositions = Array.from(allButtons).map((btn, idx) => {
        const rect = btn.getBoundingClientRect();
        const isInSidebar = sidebarEl.contains(btn);
        const isVisible = rect.top >= 0 && rect.top < window.innerHeight && rect.left >= 0 && rect.left < window.innerWidth;
        return {
          index: idx,
          text: btn.textContent.substring(0, 20),
          top: rect.top,
          left: rect.left,
          right: rect.right,
          className: btn.className,
          parentClass: btn.parentElement ? btn.parentElement.className : 'none',
          isInSidebar: isInSidebar,
          isVisible: isVisible
        };
      });
      
      fetch('http://127.0.0.1:7242/ingest/850e76a1-caf4-489c-9914-1d5532476236',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'knowledgePage.js:188',message:'After DOM construction - detailed button positions with visibility',data:{scrollY:scrollY,scrollX:scrollX,flexDirection:layoutStyle.flexDirection,display:layoutStyle.display,justifyContent:layoutStyle.justifyContent,sidebarPosition:sidebarStyle.position,sidebarLeft:sidebarStyle.left,sidebarRight:sidebarStyle.right,sidebarWidth:sidebarStyle.width,sidebarTop:sidebarRect.top,sidebarLeftPos:sidebarRect.left,sidebarRightPos:sidebarRect.right,mainLeftPos:mainRect.left,mainRightPos:mainRect.right,navHeight:navRect?navRect.height:0,navBottom:navRect?navRect.bottom:0,windowHeight:window.innerHeight,domOrder:domOrder,windowWidth:window.innerWidth,linkPositions:linkPositions,allButtonPositions:allButtonPositions},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A,B,C,D,E'})}).catch(()=>{});
    }
  }, 100);
  // #endregion

  // #region agent log
  // 确保页面滚动到顶部，避免初始滚动位置导致按钮位置错误
  if (window.scrollY > 0 || window.pageYOffset > 0) {
    window.scrollTo(0, 0);
    fetch('http://127.0.0.1:7242/ingest/850e76a1-caf4-489c-9914-1d5532476236',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'knowledgePage.js:190',message:'Reset scroll position to top',data:{initialScrollY:window.scrollY,initialPageYOffset:window.pageYOffset},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'G'})}).catch(()=>{});
  }
  // #endregion

  // 初始渲染：优先用 URL hash，否则第一个模块；hash 无效时修正为第一模块
  const hashId = location.hash.slice(1);
  if (hashId) {
    // 先尝试找子标题
    const childResult = getChildById(hashId);
    if (childResult) {
      setActive(childResult.child.id);
      renderChild(childResult.section, childResult.child);
    } else {
      // 再尝试找大模块
      const initial = getSectionById(hashId);
      if (initial) {
        setActive(initial.id);
        renderSection(initial);
      } else {
        // hash 无效，使用第一个模块
        const first = KNOWLEDGE_BASE[0];
        setActive(first.id);
        renderSection(first);
        history.replaceState(null, '', '#' + first.id);
      }
    }
  } else {
    // 没有 hash，显示第一个模块
    const first = KNOWLEDGE_BASE[0];
    setActive(first.id);
    renderSection(first);
  }

  // 浏览器前进/后退或手动改 hash 时同步
  window.addEventListener('hashchange', () => {
    const id = location.hash.slice(1);
    if (!id) return;
    
    // 先尝试找子标题
    const childResult = getChildById(id);
    if (childResult) {
      setActive(childResult.child.id);
      renderChild(childResult.section, childResult.child);
    } else {
      // 再尝试找大模块
      const sec = getSectionById(id);
      if (sec) {
        setActive(sec.id);
        renderSection(sec);
      }
    }
  });
});
