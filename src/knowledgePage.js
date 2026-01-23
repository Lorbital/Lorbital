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
    
    const sectionHeader = document.createElement('div');
    sectionHeader.className = 'knowledge-section-header';
    
    const a = document.createElement('a');
    a.href = '#' + sec.id;
    a.setAttribute('data-id', sec.id);
    a.className = 'knowledge-section-title';
    a.textContent = sec.title;
    
    // 如果有子标题，添加下拉箭头
    if (sec.children && sec.children.length > 0) {
      const toggle = document.createElement('span');
      toggle.className = 'knowledge-section-toggle';
      a.appendChild(toggle);
      
      // 点击标题时切换展开/折叠，并显示该章节内容
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const wasExpanded = sectionItem.classList.contains('expanded');
        sectionItem.classList.toggle('expanded');
        
        // 如果展开或已经有内容，显示该章节
        if (!wasExpanded || !sectionItem.classList.contains('expanded')) {
          setActive(sec.id);
          renderSection(sec);
          history.replaceState(null, '', '#' + sec.id);
        }
      });
    } else {
      // 没有子标题时，点击直接跳转
      a.addEventListener('click', (e) => {
        e.preventDefault();
        setActive(sec.id);
        renderSection(sec);
        history.replaceState(null, '', '#' + sec.id);
      });
    }
    
    sectionHeader.appendChild(a);
    sectionItem.appendChild(sectionHeader);

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
    
  }

  // 确保页面滚动到顶部，避免初始滚动位置导致按钮位置错误
  if (window.scrollY > 0 || window.pageYOffset > 0) {
    window.scrollTo(0, 0);
  }
  
  // 确保侧边栏滚动到顶部，显示第一个选项
  setTimeout(() => {
    const sidebar = document.querySelector('.knowledge-sidebar');
    if (sidebar) {
      sidebar.scrollTop = 0;
      // 再次确保滚动位置正确（处理可能的延迟渲染）
      requestAnimationFrame(() => {
        sidebar.scrollTop = 0;
      });
    }
  }, 100);
  
  // 在 DOM 完全加载后再次确保滚动位置
  window.addEventListener('load', () => {
    const sidebar = document.querySelector('.knowledge-sidebar');
    if (sidebar) {
      sidebar.scrollTop = 0;
    }
  });

  /** 展开包含指定ID的章节 */
  function expandSectionForId(id) {
    const sectionItem = toc.querySelector(`.knowledge-section-item`);
    if (!sectionItem) return;
    
    // 找到包含该ID的章节项
    const allSectionItems = toc.querySelectorAll('.knowledge-section-item');
    for (const item of allSectionItems) {
      const sectionLink = item.querySelector('.knowledge-section-title');
      const childLinks = item.querySelectorAll('.knowledge-child-item');
      
      if (sectionLink && sectionLink.getAttribute('data-id') === id) {
        item.classList.add('expanded');
        break;
      }
      
      for (const childLink of childLinks) {
        if (childLink.getAttribute('data-id') === id) {
          item.classList.add('expanded');
          break;
        }
      }
    }
  }

  // 初始渲染：优先用 URL hash，否则第一个模块；hash 无效时修正为第一模块
  const hashId = location.hash.slice(1);
  if (hashId) {
    // 先尝试找子标题
    const childResult = getChildById(hashId);
    if (childResult) {
      expandSectionForId(hashId);
      setActive(childResult.child.id);
      renderChild(childResult.section, childResult.child);
    } else {
      // 再尝试找大模块
      const initial = getSectionById(hashId);
      if (initial) {
        expandSectionForId(hashId);
        setActive(initial.id);
        renderSection(initial);
      } else {
        // hash 无效，使用第一个模块
        const first = KNOWLEDGE_BASE[0];
        expandSectionForId(first.id);
        setActive(first.id);
        renderSection(first);
        history.replaceState(null, '', '#' + first.id);
      }
    }
  } else {
    // 没有 hash，显示第一个模块
    const first = KNOWLEDGE_BASE[0];
    expandSectionForId(first.id);
    setActive(first.id);
    renderSection(first);
  }

  // 浏览器前进/后退或手动改 hash 时同步
  window.addEventListener('hashchange', () => {
    const id = location.hash.slice(1);
    if (!id) return;
    
    expandSectionForId(id);
    
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
