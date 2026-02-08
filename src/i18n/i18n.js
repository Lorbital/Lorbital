/**
 * Lightweight i18n system for Lorbital
 * Supports Chinese (zh) and English (en) via localStorage persistence.
 * Loaded as a plain <script> (not ES module) so it works on file://.
 *
 * Usage:
 *   t('nav.home')           → returns translated string
 *   I18N.setLang('en')      → switch language & re-render
 *   I18N.getLang()           → 'zh' | 'en'
 *   I18N.onLangChange(fn)   → register callback
 *   I18N.applyI18n()        → patch all [data-i18n] / [data-i18n-html] in DOM
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'lorbital_lang';
  var DEFAULT_LANG = 'zh';

  // Will be populated by zh.js / en.js
  var dictionaries = {};
  var currentLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  var listeners = [];

  /** Deep-get a nested key like 'nav.home' from an object */
  function deepGet(obj, path) {
    var parts = path.split('.');
    var cur = obj;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null) return undefined;
      cur = cur[parts[i]];
    }
    return cur;
  }

  /** Get translation for key in current language, fallback to zh, then key itself */
  function t(key) {
    var dict = dictionaries[currentLang];
    var val = dict ? deepGet(dict, key) : undefined;
    if (val !== undefined) return val;
    // fallback to Chinese
    var zhDict = dictionaries['zh'];
    val = zhDict ? deepGet(zhDict, key) : undefined;
    if (val !== undefined) return val;
    return key; // last resort
  }

  /** Scan DOM for [data-i18n] and [data-i18n-html] and patch text */
  function applyI18n() {
    // data-i18n → textContent
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
      var key = els[i].getAttribute('data-i18n');
      if (key) els[i].textContent = t(key);
    }
    // data-i18n-html → innerHTML
    var htmlEls = document.querySelectorAll('[data-i18n-html]');
    for (var j = 0; j < htmlEls.length; j++) {
      var hkey = htmlEls[j].getAttribute('data-i18n-html');
      if (hkey) htmlEls[j].innerHTML = t(hkey);
    }
    // Update toggle button label
    var btn = document.getElementById('lang-toggle');
    if (btn) {
      btn.textContent = currentLang === 'zh' ? 'EN' : '中文';
    }
    // Update <html lang>
    document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
  }

  function setLang(lang) {
    if (lang !== 'zh' && lang !== 'en') return;
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    applyI18n();
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](lang); } catch (e) { console.error('i18n listener error', e); }
    }
  }

  function getLang() {
    return currentLang;
  }

  function onLangChange(fn) {
    if (typeof fn === 'function') listeners.push(fn);
  }

  function registerDict(lang, dict) {
    dictionaries[lang] = dict;
  }

  function toggleLang() {
    setLang(currentLang === 'zh' ? 'en' : 'zh');
  }

  /** Initialize: bind toggle button, apply translations after DOM ready */
  function init() {
    function bind() {
      var btn = document.getElementById('lang-toggle');
      if (btn) {
        btn.addEventListener('click', function () {
          toggleLang();
        });
      }
      applyI18n();
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bind);
    } else {
      bind();
    }
  }

  // Expose globally
  window.I18N = {
    t: t,
    setLang: setLang,
    getLang: getLang,
    onLangChange: onLangChange,
    applyI18n: applyI18n,
    registerDict: registerDict,
    toggleLang: toggleLang,
    init: init
  };

  // Convenience global shortcut
  window.t = t;
})();
