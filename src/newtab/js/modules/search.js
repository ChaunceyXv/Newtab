/**
 * Search Module
 * 负责：搜索查询处理、搜索引擎配置、URL 构造
 *
 * 设计原则：
 *   - 纯函数，不直接操作 DOM
 *   - 通过 engines 配置表扩展搜索引擎
 *   - 支持网址识别：如果输入是完整 URL，直接跳转而不搜索
 */

const engines = {
  google: {
    name: 'Google',
    url: 'https://www.google.com/search',
    param: 'q',
  },
  bing: {
    name: 'Bing',
    url: 'https://www.bing.com/search',
    param: 'q',
  },
  baidu: {
    name: '百度',
    url: 'https://www.baidu.com/s',
    param: 'wd',
  },
  duckduckgo: {
    name: 'DuckDuckGo',
    url: 'https://duckduckgo.com/',
    param: 'q',
  },
};

const URL_PROTOCOL_PATTERN = /^(https?:|ftp:|file:|chrome:|about:)/i;
const DOMAIN_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9-]*(\.[a-zA-Z0-9-]+)+/;

function getEngines() {
  return { ...engines };
}

function hasEngine(engineKey) {
  return Object.prototype.hasOwnProperty.call(engines, engineKey);
}

function normalizeQuery(raw) {
  return String(raw || '').trim();
}

function looksLikeUrl(query) {
  if (!query) return false;
  if (URL_PROTOCOL_PATTERN.test(query)) return true;
  const firstToken = query.split(/\s+/)[0];
  if (DOMAIN_PATTERN.test(firstToken)) return true;
  return false;
}

function buildSearchUrl(engineKey, query) {
  const trimmed = normalizeQuery(query);
  if (!trimmed) return null;
  if (!hasEngine(engineKey)) return null;

  const engine = engines[engineKey];
  const url = new URL(engine.url);
  url.searchParams.set(engine.param, trimmed);
  return url.toString();
}

function resolveUrl(rawQuery, engineKey) {
  const query = normalizeQuery(rawQuery);
  if (!query) return null;

  if (URL_PROTOCOL_PATTERN.test(query)) {
    return query;
  }

  if (looksLikeUrl(query)) {
    return 'https://' + query;
  }

  return buildSearchUrl(engineKey, query);
}

export { getEngines, hasEngine, buildSearchUrl, resolveUrl, looksLikeUrl };
