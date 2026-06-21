/**
 * Main Entry Point
 * 负责：初始化各个模块、绑定 DOM 事件、协调模块间交互
 *
 * 架构说明：
 *   - main.js 只关心"胶水代码"：DOM 查询、事件绑定、模块调用
 *   - 纯业务逻辑放在 modules/ 下，保持独立可测试
 */

import { resolveUrl, hasEngine } from './modules/search.js';

const DEFAULT_ENGINE_KEY = 'google';
const STORAGE_KEY_ENGINE = 'newtab:engine';

function getStoredEngine() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_ENGINE);
    if (stored && hasEngine(stored)) return stored;
  } catch (_) {
  }
  return DEFAULT_ENGINE_KEY;
}

function setStoredEngine(engineKey) {
  try {
    localStorage.setItem(STORAGE_KEY_ENGINE, engineKey);
  } catch (_) {
  }
}

function getGreetingByHour(hour) {
  if (hour >= 5 && hour < 12) return '早上好';
  if (hour >= 12 && hour < 18) return '下午好';
  if (hour >= 18 && hour < 22) return '晚上好';
  return '夜深了';
}

function initGreeting() {
  const el = document.getElementById('greeting');
  if (!el) return;
  el.textContent = getGreetingByHour(new Date().getHours());
}

function initSearch() {
  const form = document.getElementById('searchForm');
  const input = document.getElementById('searchInput');
  const engineSelect = document.getElementById('engineSelect');

  if (!form || !input || !engineSelect) {
    console.warn('[newtab] 搜索组件未找到，跳过初始化');
    return;
  }

  engineSelect.value = getStoredEngine();

  engineSelect.addEventListener('change', () => {
    setStoredEngine(engineSelect.value);
    input.focus();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const targetUrl = resolveUrl(input.value, engineSelect.value);
    if (!targetUrl) return;
    window.location.href = targetUrl;
  });

  input.focus();
}

function init() {
  initGreeting();
  initSearch();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
