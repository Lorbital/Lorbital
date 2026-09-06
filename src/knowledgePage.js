/**
 * 知识库 / 化学之美页面：左侧目录 + 中间内容
 * 点击目录项，中间显示对应知识点。
 * 知识库：先加载 knowledgeBase.js（window.KNOWLEDGE_BASE）
 * 化学之美：先加载 knowledgeSulfuring.js，并设置 window.KNOWLEDGE_PAGE_SECTIONS
 */

/** 将 **text** 转为 <strong>text</strong> */
function bold(html) {
  return String(html).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

/** Extract current-language string from a bilingual {zh, en} object, or return as-is if plain string */
function L(val) {
  if (val && typeof val === 'object' && (val.zh || val.en)) {
    var lang = (window.I18N && window.I18N.getLang) ? window.I18N.getLang() : 'zh';
    return val[lang] || val.zh || val.en || '';
  }
  return val || '';
}

/** 将文字中的数学表达式包裹在 $...$ 中，以便 MathJax 渲染 */
function wrapMathExpressions(text) {
  // 如果已经包含 $，说明已经被处理过，直接返回
  if (text.includes('$')) {
    return text;
  }
  
  let result = text;
  
  // 收集所有需要包裹的数学表达式及其位置
  const mathExpressions = [];
  const processedRanges = [];
  
  // 辅助函数：检查位置是否已被处理
  function isProcessed(start, end) {
    return processedRanges.some(range => 
      start < range.end && end > range.start
    );
  }
  
  // 辅助函数：添加表达式到列表
  function addExpression(match) {
    if (!isProcessed(match.index, match.index + match[0].length)) {
      mathExpressions.push({
        text: match[0],
        start: match.index,
        end: match.index + match[0].length
      });
      processedRanges.push({ 
        start: match.index, 
        end: match.index + match[0].length 
      });
    }
  }
  
  // 模式1: 包含花括号的复杂表达式（如 ψ_{nlm}, R_{nl}(r), Y_l^m(θ,φ), e^{-ρ/2}, e^{-iEt/ℏ}, e^{imφ}, L_{n−l−1}^{2l+1}(ρ)）
  const complexPattern = /[α-ωΑ-Ωa-zA-Z][_^]?[^{}\s]*\{[^}]+\}[_^]?[^{}\s]*(?:\{[^}]+\})?\([^)]*\)?|[α-ωΑ-Ωa-zA-Z][_^][^{}\s]*\{[^}]+\}[_^]?[^{}\s]*\([^)]*\)?|[α-ωΑ-Ωa-zA-Z][_^][^{}\s]*\{[^}]+\}/g;
  let match;
  while ((match = complexPattern.exec(text)) !== null) {
    addExpression(match);
  }
  
  // 模式2: 包含等号的表达式（如 ψ_{nlm}=R_{nl}(r) Y_l^m(θ,φ), E_n=−13.6/n², λ=h/p, ψ=0, ρ=2r/(na_0)）
  const equationPattern = /[α-ωΑ-Ωa-zA-Z_^²³⁻¹⁻²{}\s]+\s*[=∝≤≥≠≈]\s*[−-]?[\d/α-ωΑ-Ωa-zA-Z²³⁻¹⁻²_^(){}·\s]+/g;
  while ((match = equationPattern.exec(text)) !== null) {
    addExpression(match);
  }
  
  // 模式3: 简单的下标/上标（如 Y_l^m, ρ^l, n², dz², dx²−y²）
  const subscriptPattern = /[α-ωΑ-Ωa-zA-Z][_^][\w\s²³⁻¹⁻²−]+|[α-ωΑ-Ωa-zA-Z][²³⁻¹⁻²]/g;
  while ((match = subscriptPattern.exec(text)) !== null) {
    addExpression(match);
  }
  
  // 模式4: 绝对值表达式（如 |ψ|²）
  const absPattern = /\|[α-ωΑ-Ωa-zA-Z]+\|[²³⁻¹⁻²]?/g;
  while ((match = absPattern.exec(text)) !== null) {
    addExpression(match);
  }
  
  // 模式5: 简单的数学表达式（如 n−l−1, n−1, l=0, m=−l）
  // 注意：不包含 …, 等标点符号
  const simpleMathPattern = /[α-ωΑ-Ωa-zA-Z][−=][\dα-ωΑ-Ωa-zA-Z−+]+/g;
  while ((match = simpleMathPattern.exec(text)) !== null) {
    // 检查后面是否有 …，如果有，不包含它
    const afterMatch = text.substring(match.index + match[0].length, match.index + match[0].length + 1);
    if (afterMatch !== '…') {
      addExpression(match);
    }
  }
  
  // 模式6: 科学计数法（如 9.1×10⁻³¹）
  const scientificPattern = /\d+\.?\d*\s*×\s*10[⁻¹²³⁴⁵⁶⁷⁸⁹⁰]+/g;
  while ((match = scientificPattern.exec(text)) !== null) {
    addExpression(match);
  }
  
  // 按位置从后往前排序，避免索引偏移
  mathExpressions.sort((a, b) => b.start - a.start);
  
  // 从后往前替换
  for (const expr of mathExpressions) {
    const before = result.substring(0, expr.start);
    const after = result.substring(expr.end);
    const mathText = expr.text.trim();
    
    // 检查前后字符，确保在合适的边界
    const beforeChar = before[before.length - 1] || ' ';
    const afterChar = after[0] || ' ';
    const isBoundary = /[\s，。、；：！？（）【】《》：，]/.test(beforeChar) || /[\s，。、；：！？（）【】《》，。]/.test(afterChar);
    
    // 如果不在 $ 内，则包裹
    if (isBoundary && !before.endsWith('$') && !after.startsWith('$')) {
      result = before + '$' + mathText + '$' + after;
    }
  }
  
  return result;
}

// 等待 DOM 加载完成后再执行
document.addEventListener('DOMContentLoaded', () => {
  const KNOWLEDGE_BASE = window.KNOWLEDGE_PAGE_SECTIONS || window.KNOWLEDGE_BASE || [];
  const pageI18n = window.KNOWLEDGE_PAGE_I18N || 'knowledge';
  
  // 数据验证：检查知识库数据是否加载
  if (!KNOWLEDGE_BASE || KNOWLEDGE_BASE.length === 0) {
    const contentEl = document.getElementById('knowledge-content');
    if (contentEl) {
      var errMsg = (window.I18N && window.I18N.t)
        ? window.I18N.t(pageI18n + '.loadError')
        : ((window.I18N && window.I18N.getLang() === 'en')
          ? 'Knowledge base failed to load. Please refresh the page.'
          : '知识库数据加载失败，请刷新页面重试。');
      contentEl.innerHTML = '<div class="glass-panel"><p style="color: rgba(255, 255, 255, 0.7);">' + errMsg + '</p></div>';
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

  // #region agent log - 全局调试函数
  // 创建全局调试函数，可以在 console 中调用
  window.debugSidebar = function() {
    const sidebar = toc.closest('.knowledge-sidebar');
    if (!sidebar || !toc) {
      console.error('找不到侧边栏或 nav 元素');
      return null;
    }
    
    const sidebarRect = sidebar.getBoundingClientRect();
    const tocRect = toc.getBoundingClientRect();
    const computedSidebar = window.getComputedStyle(sidebar);
    const computedToc = window.getComputedStyle(toc);
    const rootStyles = getComputedStyle(document.documentElement);
    
    const debugInfo = {
      version: 'v2.0-debug',
      timestamp: new Date().toISOString(),
      sidebar: {
        actualHeight: sidebarRect.height,
        computedHeight: computedSidebar.height,
        display: computedSidebar.display,
        flexDirection: computedSidebar.flexDirection,
        height: computedSidebar.height,
        maxHeight: computedSidebar.maxHeight,
        padding: computedSidebar.padding,
        boxSizing: computedSidebar.boxSizing
      },
      nav: {
        actualHeight: tocRect.height,
        computedHeight: computedToc.height,
        offsetHeight: toc.offsetHeight,
        clientHeight: toc.clientHeight,
        scrollHeight: toc.scrollHeight,
        flex: computedToc.flex,
        flexGrow: computedToc.flexGrow,
        flexShrink: computedToc.flexShrink,
        flexBasis: computedToc.flexBasis,
        minHeight: computedToc.minHeight,
        maxHeight: computedToc.maxHeight,
        height: computedToc.height,
        display: computedToc.display,
        alignSelf: computedToc.alignSelf,
        padding: computedToc.padding,
        boxSizing: computedToc.boxSizing
      },
      cssVars: {
        navHeight: rootStyles.getPropertyValue('--nav-height'),
        sidebarGap: rootStyles.getPropertyValue('--sidebar-gap'),
        sidebarWidth: rootStyles.getPropertyValue('--sidebar-width')
      },
      viewport: {
        height: window.innerHeight,
        width: window.innerWidth
      },
      calculated: {
        expectedSidebarHeight: `calc(100vh - ${rootStyles.getPropertyValue('--nav-height')} - ${rootStyles.getPropertyValue('--sidebar-gap')})`,
        expectedNavHeight: '应该等于 sidebar 高度（减去 padding）'
      }
    };
    
    console.log('=== 侧边栏调试信息 ===');
    console.log('版本:', debugInfo.version);
    console.log('侧边栏实际高度:', debugInfo.sidebar.actualHeight, 'px');
    console.log('Nav 实际高度:', debugInfo.nav.actualHeight, 'px');
    console.log('Nav 内容高度 (scrollHeight):', debugInfo.nav.scrollHeight, 'px');
    console.log('Nav flex 属性:', debugInfo.nav.flex);
    console.log('完整信息:', debugInfo);
    
    // 在页面上显示调试信息（已隐藏，仅保留 console 输出）
    // 如果需要显示调试面板，可以取消下面的注释
    /*
    let debugPanel = document.getElementById('debug-sidebar-panel');
    if (!debugPanel) {
      debugPanel = document.createElement('div');
      debugPanel.id = 'debug-sidebar-panel';
      debugPanel.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: rgba(0, 0, 0, 0.9);
        color: #00ffff;
        padding: 15px;
        border: 2px solid #00ffff;
        border-radius: 8px;
        font-family: monospace;
        font-size: 12px;
        z-index: 10000;
        max-width: 400px;
        max-height: 500px;
        overflow-y: auto;
      `;
      document.body.appendChild(debugPanel);
    }
    
    debugPanel.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 10px; color: #00ffff;">
        🔍 侧边栏调试信息 (${debugInfo.version})
      </div>
      <div style="margin-bottom: 5px;"><strong>侧边栏高度:</strong> ${debugInfo.sidebar.actualHeight}px</div>
      <div style="margin-bottom: 5px;"><strong>Nav 高度:</strong> ${debugInfo.nav.actualHeight}px</div>
      <div style="margin-bottom: 5px;"><strong>Nav 内容高度:</strong> ${debugInfo.nav.scrollHeight}px</div>
      <div style="margin-bottom: 5px;"><strong>Nav flex:</strong> ${debugInfo.nav.flex}</div>
      <div style="margin-bottom: 5px;"><strong>Nav flexGrow:</strong> ${debugInfo.nav.flexGrow}</div>
      <div style="margin-bottom: 5px;"><strong>Nav flexBasis:</strong> ${debugInfo.nav.flexBasis}</div>
      <div style="margin-bottom: 5px;"><strong>Nav minHeight:</strong> ${debugInfo.nav.minHeight}</div>
      <div style="margin-bottom: 5px;"><strong>Nav alignSelf:</strong> ${debugInfo.nav.alignSelf}</div>
      <div style="margin-bottom: 5px;"><strong>侧边栏 display:</strong> ${debugInfo.sidebar.display}</div>
      <div style="margin-bottom: 5px;"><strong>侧边栏 flexDirection:</strong> ${debugInfo.sidebar.flexDirection}</div>
      <div style="margin-top: 10px; font-size: 10px; color: #888;">
        在 console 输入 debugSidebar() 查看详细信息
      </div>
    `;
    */
    
    // 如果已存在调试面板，则隐藏它
    const existingPanel = document.getElementById('debug-sidebar-panel');
    if (existingPanel) {
      existingPanel.style.display = 'none';
    }
    
    return debugInfo;
  };
  
  // 自动运行一次调试函数
  setTimeout(() => {
    window.debugSidebar();
  }, 500);
  
  // #region agent log - 强制修复函数
  // 添加一个函数来强制修复 nav 高度
  window.fixSidebarNav = function() {
    const sidebar = toc.closest('.knowledge-sidebar');
    if (!sidebar || !toc) {
      console.error('找不到侧边栏或 nav 元素');
      return false;
    }
    
    const sidebarHeight = sidebar.getBoundingClientRect().height;
    // 直接让 nav 的高度等于 sidebar 的高度
    const targetHeight = sidebarHeight;
    
    console.log('尝试强制修复 nav 高度...');
    console.log('侧边栏高度:', sidebarHeight);
    console.log('目标 nav 高度:', targetHeight);
    
    // 方法1: 直接设置高度
    toc.style.height = targetHeight + 'px';
    toc.style.minHeight = targetHeight + 'px';
    toc.style.maxHeight = targetHeight + 'px';
    
    // 方法2: 确保 flex 属性
    toc.style.flex = '1 1 0%';
    toc.style.flexGrow = '1';
    toc.style.flexShrink = '1';
    toc.style.flexBasis = '0%';
    toc.style.alignSelf = 'stretch';
    
    // 等待一下再检查
    setTimeout(() => {
      const newHeight = toc.getBoundingClientRect().height;
      console.log('修复后 nav 高度:', newHeight);
      window.debugSidebar();
      
      if (Math.abs(newHeight - targetHeight) < 5) {
        console.log('✅ 修复成功！');
      } else {
        console.warn('⚠️ 修复可能未完全生效，当前高度:', newHeight, '期望:', targetHeight);
      }
    }, 100);
    
    return true;
  };
  
  // 添加版本标记到全局对象
  window.KNOWLEDGE_PAGE_VERSION = 'v2.0-debug-2025';
  console.log('📚 Knowledge Page 已加载，版本:', window.KNOWLEDGE_PAGE_VERSION);
  console.log('💡 调试命令:');
  console.log('  - debugSidebar() - 查看侧边栏调试信息');
  console.log('  - fixSidebarNav() - 强制修复 nav 高度');
  console.log('  - fixNavAlignment() - 强制修复 nav 内容对齐（新）');
  
  // #region agent log - 强制修复对齐函数
  // 创建一个专门修复内容对齐的函数
  window.fixNavAlignment = function() {
    const toc = document.getElementById('knowledge-toc');
    if (!toc) {
      console.error('找不到 knowledge-toc 元素');
      return false;
    }
    
    console.log('🔧 开始修复 nav 内容对齐...');
    
    // 先检查当前状态
    const tocRect = toc.getBoundingClientRect();
    const firstChild = toc.firstElementChild;
    const lastChild = toc.lastElementChild;
    
    console.log('修复前状态:', {
      tocHeight: tocRect.height,
      tocScrollHeight: toc.scrollHeight,
      tocScrollTop: toc.scrollTop,
      firstChildTop: firstChild ? firstChild.getBoundingClientRect().top - tocRect.top : 'N/A',
      lastChildBottom: lastChild ? lastChild.getBoundingClientRect().bottom - tocRect.top : 'N/A',
      computedJustifyContent: getComputedStyle(toc).justifyContent,
      computedAlignItems: getComputedStyle(toc).alignItems
    });
    
    // 强制设置所有相关样式（使用 !important 的方式）
    toc.style.setProperty('justify-content', 'flex-start', 'important');
    toc.style.setProperty('align-items', 'stretch', 'important');
    toc.style.setProperty('align-content', 'flex-start', 'important');
    toc.style.setProperty('display', 'flex', 'important');
    toc.style.setProperty('flex-direction', 'column', 'important');
    toc.style.setProperty('vertical-align', 'top', 'important');
    
    // 确保第一个子元素没有 margin-top 和 padding-top
    if (firstChild) {
      firstChild.style.setProperty('margin-top', '0', 'important');
      firstChild.style.setProperty('padding-top', '0', 'important');
      firstChild.style.setProperty('margin-bottom', '0.5rem', 'important');
    }
    
    // 强制滚动到顶部
    toc.scrollTop = 0;
    toc.scrollTo({ top: 0, behavior: 'instant' });
    
    // 检查并修复所有 section-item
    const sectionItems = toc.querySelectorAll('.knowledge-section-item');
    sectionItems.forEach((item, index) => {
      if (index === 0) {
        item.style.setProperty('margin-top', '0', 'important');
        item.style.setProperty('padding-top', '0', 'important');
      }
      item.style.setProperty('display', 'block', 'important');
      item.style.setProperty('width', '100%', 'important');
      item.style.setProperty('vertical-align', 'top', 'important');
    });
    
    // 等待一下再检查
    setTimeout(() => {
      const newTocRect = toc.getBoundingClientRect();
      const newFirstChild = toc.firstElementChild;
      console.log('修复后状态:', {
        tocHeight: newTocRect.height,
        tocScrollHeight: toc.scrollHeight,
        tocScrollTop: toc.scrollTop,
        firstChildTop: newFirstChild ? newFirstChild.getBoundingClientRect().top - newTocRect.top : 'N/A',
        computedJustifyContent: getComputedStyle(toc).justifyContent,
        computedAlignItems: getComputedStyle(toc).alignItems
      });
      
      // 如果第一个子元素距离顶部太远，尝试直接设置位置
      if (newFirstChild) {
        const firstChildTop = newFirstChild.getBoundingClientRect().top - newTocRect.top;
        if (firstChildTop > 10) {
          console.warn('⚠️ 第一个子元素距离顶部太远:', firstChildTop, 'px，尝试强制修复...');
          // 尝试使用 transform 强制移动到顶部
          const currentTop = firstChildTop;
          newFirstChild.style.setProperty('margin-top', `-${currentTop}px`, 'important');
        }
      }
    }, 100);
    
    console.log('✅ Nav 对齐修复完成');
    
    return true;
  };
  
  // 创建一个详细的诊断函数
  window.diagnoseNavAlignment = function() {
    const toc = document.getElementById('knowledge-toc');
    if (!toc) {
      console.error('找不到 knowledge-toc 元素');
      return null;
    }
    
    const tocRect = toc.getBoundingClientRect();
    const computed = getComputedStyle(toc);
    const firstChild = toc.firstElementChild;
    const lastChild = toc.lastElementChild;
    
    const diagnosis = {
      toc: {
        height: tocRect.height,
        scrollHeight: toc.scrollHeight,
        clientHeight: toc.clientHeight,
        scrollTop: toc.scrollTop,
        paddingTop: computed.paddingTop,
        paddingBottom: computed.paddingBottom,
        justifyContent: computed.justifyContent,
        alignItems: computed.alignItems,
        alignContent: computed.alignContent,
        display: computed.display,
        flexDirection: computed.flexDirection
      },
      firstChild: firstChild ? {
        element: firstChild.tagName + (firstChild.className ? '.' + firstChild.className : ''),
        top: firstChild.getBoundingClientRect().top - tocRect.top,
        marginTop: getComputedStyle(firstChild).marginTop,
        paddingTop: getComputedStyle(firstChild).paddingTop,
        height: firstChild.getBoundingClientRect().height
      } : null,
      lastChild: lastChild ? {
        element: lastChild.tagName + (lastChild.className ? '.' + lastChild.className : ''),
        bottom: lastChild.getBoundingClientRect().bottom - tocRect.top,
        marginBottom: getComputedStyle(lastChild).marginBottom,
        paddingBottom: getComputedStyle(lastChild).paddingBottom,
        height: lastChild.getBoundingClientRect().height
      } : null,
      contentGap: {
        top: firstChild ? firstChild.getBoundingClientRect().top - tocRect.top : 0,
        bottom: lastChild ? tocRect.bottom - lastChild.getBoundingClientRect().bottom : 0
      }
    };
    
    console.log('=== Nav 对齐诊断信息 ===');
    console.log('TOC 容器:', diagnosis.toc);
    console.log('第一个子元素:', diagnosis.firstChild);
    console.log('最后一个子元素:', diagnosis.lastChild);
    console.log('内容间隙:', diagnosis.contentGap);
    console.log('完整诊断:', diagnosis);
    
    return diagnosis;
  };
  
  // 创建一个综合修复函数
  window.fixSidebarComplete = function() {
    console.log('🔧 执行完整修复...');
    
    // 先诊断
    const diagnosis = window.diagnoseNavAlignment();
    
    // 先修复高度
    if (window.autoFixSidebarNav) {
      window.autoFixSidebarNav();
    }
    
    // 再修复对齐
    if (window.fixNavAlignment) {
      window.fixNavAlignment();
    }
    
    // 如果第一个子元素距离顶部太远，尝试更激进的修复
    setTimeout(() => {
      const toc = document.getElementById('knowledge-toc');
      if (toc && toc.firstElementChild) {
        const tocRect = toc.getBoundingClientRect();
        const firstChild = toc.firstElementChild;
        const firstChildTop = firstChild.getBoundingClientRect().top - tocRect.top;
        
        if (firstChildTop > 5) {
          console.log('⚠️ 检测到第一个子元素距离顶部:', firstChildTop, 'px，执行激进修复...');
          
          // 方法1: 使用负 margin
          const currentMarginTop = parseFloat(getComputedStyle(firstChild).marginTop) || 0;
          firstChild.style.setProperty('margin-top', `${currentMarginTop - firstChildTop}px`, 'important');
          
          // 方法2: 如果还不行，尝试设置 padding-top
          setTimeout(() => {
            const newFirstChildTop = firstChild.getBoundingClientRect().top - tocRect.top;
            if (newFirstChildTop > 5) {
              const paddingTop = parseFloat(getComputedStyle(toc).paddingTop) || 0;
              toc.style.setProperty('padding-top', `${Math.max(0, paddingTop - newFirstChildTop)}px`, 'important');
            }
          }, 50);
        }
      }
      
      // 最终诊断
      window.diagnoseNavAlignment();
    }, 200);
    
    return true;
  };
  
  console.log('💡 新增修复命令:');
  console.log('  - diagnoseNavAlignment() - 详细诊断对齐问题（先运行这个）');
  console.log('  - fixNavAlignment() - 修复内容对齐');
  console.log('  - fixSidebarComplete() - 完整修复（高度+对齐+激进修复）');
  console.log('  - reduceTopSpacing() - 减小顶部间距（新）');
  console.log('');
  console.log('📋 使用建议:');
  console.log('  1. 点击大标题后，先运行 diagnoseNavAlignment() 查看问题');
  console.log('  2. 然后运行 fixSidebarComplete() 尝试修复');
  console.log('  3. 如果顶部间距太大，运行 reduceTopSpacing()');
  console.log('  4. 如果还不行，告诉我诊断结果，我会进一步调整');
  
  // #region agent log - 减小顶部间距函数
  window.reduceTopSpacing = function() {
    const toc = document.getElementById('knowledge-toc');
    if (!toc) {
      console.error('找不到 knowledge-toc 元素');
      return false;
    }
    
    console.log('🔧 开始减小顶部间距...');
    
    // 检查当前的 padding
    const computed = getComputedStyle(toc);
    console.log('当前 nav padding:', {
      paddingTop: computed.paddingTop,
      paddingBottom: computed.paddingBottom,
      paddingLeft: computed.paddingLeft,
      paddingRight: computed.paddingRight
    });
    
    // 强制减小顶部 padding
    toc.style.setProperty('padding-top', '0', 'important');
    
    // 检查第一个 section-item
    const firstSectionItem = toc.querySelector('.knowledge-section-item:first-child');
    if (firstSectionItem) {
      const firstComputed = getComputedStyle(firstSectionItem);
      console.log('第一个 section-item 样式:', {
        marginTop: firstComputed.marginTop,
        paddingTop: firstComputed.paddingTop,
        marginBottom: firstComputed.marginBottom
      });
      
      // 确保第一个元素没有 margin-top 和 padding-top
      firstSectionItem.style.setProperty('margin-top', '0', 'important');
      firstSectionItem.style.setProperty('padding-top', '0', 'important');
      
      // 检查第一个 section-header
      const firstHeader = firstSectionItem.querySelector('.knowledge-section-header');
      if (firstHeader) {
        const headerComputed = getComputedStyle(firstHeader);
        console.log('第一个 section-header 样式:', {
          marginTop: headerComputed.marginTop,
          paddingTop: headerComputed.paddingTop
        });
        
        firstHeader.style.setProperty('margin-top', '0', 'important');
        firstHeader.style.setProperty('padding-top', '0', 'important');
      }
      
      // 检查第一个 section-title
      const firstTitle = firstSectionItem.querySelector('.knowledge-section-title');
      if (firstTitle) {
        const titleComputed = getComputedStyle(firstTitle);
        console.log('第一个 section-title 样式:', {
          marginTop: titleComputed.marginTop,
          paddingTop: titleComputed.paddingTop,
          padding: titleComputed.padding
        });
        
        // 减小 padding，但保留左右 padding
        const currentPadding = titleComputed.padding;
        const paddingValues = currentPadding.split(' ');
        if (paddingValues.length >= 2) {
          // 保持左右 padding，减小顶部 padding
          firstTitle.style.setProperty('padding', `0 ${paddingValues[1]} ${paddingValues[2] || paddingValues[1]} ${paddingValues[1]}`, 'important');
        }
      }
    }
    
    // 强制滚动到顶部
    toc.scrollTop = 0;
    
    console.log('✅ 顶部间距修复完成');
    
    // 等待一下再检查
    setTimeout(() => {
      const tocRect = toc.getBoundingClientRect();
      const firstChild = toc.firstElementChild;
      if (firstChild) {
        const firstChildTop = firstChild.getBoundingClientRect().top - tocRect.top;
        console.log('修复后第一个子元素距离顶部:', firstChildTop, 'px');
      }
    }, 100);
    
    return true;
  };
  // #endregion
  
  // #region agent log - 自动修复
  // 自动执行修复，确保 nav 高度正确
  window.autoFixSidebarNav = function() {
    const sidebar = toc.closest('.knowledge-sidebar');
    if (!sidebar || !toc) {
      return false;
    }
    
    const sidebarHeight = sidebar.getBoundingClientRect().height;
    const currentHeight = toc.getBoundingClientRect().height;
    
    // 直接让 nav 的高度等于 sidebar 的高度（因为 box-sizing: border-box，padding 会自动计算在内）
    const targetHeight = sidebarHeight;
    
    // 如果高度不正确，执行修复
    if (Math.abs(currentHeight - targetHeight) > 5) {
      console.log('🔧 自动修复 nav 高度:', currentHeight, '->', targetHeight);
      
      // 直接设置高度等于 sidebar 高度
      toc.style.height = targetHeight + 'px';
      toc.style.minHeight = targetHeight + 'px';
      toc.style.maxHeight = targetHeight + 'px';
      
      // 确保 flex 属性
      toc.style.flex = '1 1 0%';
      toc.style.flexGrow = '1';
      toc.style.flexShrink = '1';
      toc.style.flexBasis = '0%';
      toc.style.alignSelf = 'stretch';
      
      // 确保内容从顶部开始
      toc.style.justifyContent = 'flex-start';
      toc.style.alignItems = 'stretch';
      
      return true;
    }
    
    return false;
  }
  
  // 在多个时机尝试修复
  setTimeout(() => window.autoFixSidebarNav(), 100);
  setTimeout(() => window.autoFixSidebarNav(), 500);
  setTimeout(() => window.autoFixSidebarNav(), 1000);
  
  // 监听窗口大小变化，自动修复
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      window.autoFixSidebarNav();
    }, 100);
  });
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
    h2.textContent = L(sec.title);
    panel.appendChild(h2);

    for (const ch of sec.children || []) {
      const h3 = document.createElement('h3');
      h3.id = ch.id;
      h3.textContent = L(ch.title);
      panel.appendChild(h3);

      for (const text of ch.content || []) {
        const raw = L(text);
        const isBlock = /^\s*<(table|div)\b/i.test(raw);
        const el = document.createElement(isBlock ? 'div' : 'p');
        if (isBlock) {
          el.className = 'kb-content-html';
          el.innerHTML = bold(raw);
        } else {
          el.innerHTML = bold(wrapMathExpressions(raw));
        }
        panel.appendChild(el);
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

    // #region agent log - 修复 nav 高度和内容对齐（renderSection）
    // 在渲染完成后，确保 nav 高度正确且内容从顶部开始
    setTimeout(() => {
      if (window.autoFixSidebarNav) {
        window.autoFixSidebarNav();
      }
    }, 50);
    // #endregion
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
    h2.textContent = L(sec.title);
    panel.appendChild(h2);

    const h3 = document.createElement('h3');
    h3.id = child.id;
    h3.textContent = L(child.title);
    panel.appendChild(h3);

    for (const text of child.content || []) {
      const raw = L(text);
      const isBlock = /^\s*<(table|div)\b/i.test(raw);
      const el = document.createElement(isBlock ? 'div' : 'p');
      if (isBlock) {
        el.className = 'kb-content-html';
        el.innerHTML = bold(raw);
      } else {
        el.innerHTML = bold(wrapMathExpressions(raw));
      }
      panel.appendChild(el);
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

    // #region agent log - 修复 nav 高度和内容对齐（renderChild）
    // 在渲染完成后，确保 nav 高度正确且内容从顶部开始
    setTimeout(() => {
      if (window.autoFixSidebarNav) {
        window.autoFixSidebarNav();
      }
    }, 50);
    // #endregion
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

  const sectionItemById = new Map();

  function collapseOtherSections(activeItem) {
    toc.querySelectorAll('.knowledge-section-item.expanded').forEach((item) => {
      if (item !== activeItem) {
        item.classList.remove('expanded');
      }
    });
  }

  function expandSectionItemById(sectionId) {
    const sectionItem = sectionItemById.get(sectionId);
    if (!sectionItem) return;
    collapseOtherSections(sectionItem);
    sectionItem.classList.add('expanded');
    
    // 滚动到该章节的主标题位置，确保可见
    const scrollToSection = () => {
      const nav = toc; // nav 元素就是滚动容器
      const header = sectionItem.querySelector('.knowledge-section-header');
      if (nav && header) {
        const headerTop = header.offsetTop;
        const navScrollTop = nav.scrollTop;
        const navHeight = nav.clientHeight;
        const headerHeight = header.offsetHeight;
        
        // 如果标题不在可视区域内，滚动到它
        if (headerTop < navScrollTop || headerTop + headerHeight > navScrollTop + navHeight) {
          nav.scrollTo({
            top: Math.max(0, headerTop - 10), // 留10px顶部间距
            behavior: 'smooth'
          });
        }
      }
    };
    
    // 使用 requestAnimationFrame 确保 DOM 已更新
    requestAnimationFrame(() => {
      requestAnimationFrame(scrollToSection);
    });
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
    a.textContent = L(sec.title);
    
    // 如果有子标题，添加下拉箭头
    if (sec.children && sec.children.length > 0) {
      const toggle = document.createElement('span');
      toggle.className = 'knowledge-section-toggle';
      a.appendChild(toggle);
    }

    a.addEventListener('click', (e) => {
      e.preventDefault();
      
      // 检查当前 section 是否已经展开
      const isCurrentlyExpanded = sectionItem.classList.contains('expanded');
      const isCurrentlyActive = a.classList.contains('active');
      
      // 如果已经展开且是当前激活的 section，则收缩它
      if (isCurrentlyExpanded && isCurrentlyActive) {
        sectionItem.classList.remove('expanded');
        // 不改变 active 状态，也不重新渲染内容
        return;
      }
      
      // 否则，展开这个 section
      expandSectionItemById(sec.id);
      setActive(sec.id);
      renderSection(sec);
      history.replaceState(null, '', '#' + sec.id);
    });
    
    sectionHeader.appendChild(a);
    sectionItem.appendChild(sectionHeader);
    sectionItemById.set(sec.id, sectionItem);

    // 子标题列表
    if (sec.children && sec.children.length > 0) {
      const childrenList = document.createElement('div');
      childrenList.className = 'knowledge-children-list';
      
      for (const ch of sec.children) {
        const childLink = document.createElement('a');
        childLink.href = '#' + ch.id;
        childLink.setAttribute('data-id', ch.id);
        childLink.className = 'knowledge-child-item';
        childLink.textContent = L(ch.title);
        childLink.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          expandSectionItemById(sec.id);
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

  function activateById(id) {
    if (!id) return false;
    const childResult = getChildById(id);
    if (childResult) {
      expandSectionItemById(childResult.section.id);
      setActive(childResult.child.id);
      renderChild(childResult.section, childResult.child);
      return true;
    }

    const sec = KNOWLEDGE_BASE.find((s) => s.id === id);
    if (sec) {
      expandSectionItemById(sec.id);
      setActive(sec.id);
      renderSection(sec);
      return true;
    }

    return false;
  }


  // 初始渲染：优先用 URL hash，否则第一个模块；hash 无效时修正为第一模块
  const hashId = location.hash.slice(1);
  if (!activateById(hashId)) {
    const first = KNOWLEDGE_BASE[0];
    if (first) {
      expandSectionItemById(first.id);
      setActive(first.id);
      renderSection(first);
      history.replaceState(null, '', '#' + first.id);
    }
  }

  // ---- i18n: re-render TOC titles and current content on language change ----
  if (window.I18N && window.I18N.onLangChange) {
    window.I18N.onLangChange(function () {
      // 1. Update all TOC titles in the sidebar
      for (const sec of KNOWLEDGE_BASE) {
        const sectionItem = sectionItemById.get(sec.id);
        if (!sectionItem) continue;
        const titleEl = sectionItem.querySelector('.knowledge-section-title');
        if (titleEl) {
          // Preserve the toggle arrow span if present
          const toggle = titleEl.querySelector('.knowledge-section-toggle');
          titleEl.textContent = L(sec.title);
          if (toggle) titleEl.appendChild(toggle);
        }
        // Update child links
        const childLinks = sectionItem.querySelectorAll('.knowledge-child-item');
        if (sec.children) {
          sec.children.forEach(function (ch, idx) {
            if (childLinks[idx]) childLinks[idx].textContent = L(ch.title);
          });
        }
      }
      // 2. Re-render currently active content
      var activeLink = toc.querySelector('a.active');
      if (activeLink) {
        var activeId = activeLink.getAttribute('data-id');
        if (activeId) {
          // Check if it's a child or a section
          var childResult = getChildById(activeId);
          if (childResult) {
            renderChild(childResult.section, childResult.child);
          } else {
            var sec = getSectionById(activeId);
            if (sec) renderSection(sec);
          }
        }
      }
    });
  }

  // 浏览器前进/后退或手动改 hash 时同步
  window.addEventListener('hashchange', () => {
    const id = location.hash.slice(1);
    if (!id) return;
    activateById(id);
  });
});
