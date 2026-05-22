import {
  MOCK_CATEGORIES,
  MOCK_ADS,
  MOCK_PRODUCTS,
  MOCK_STORES,
  MOCK_CARDS,
  MOCK_INVENTORY_STATS,
} from './mockData';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

// 延迟模拟（让 UI 有短暂加载感）
const delay = (ms = 180) => new Promise(r => setTimeout(r, ms));

async function fetchAPI(path, options = {}) {
  // 如果没有配置后端地址，直接走 mock
  if (!API_BASE || API_BASE === 'https://your-backend.railway.app') {
    throw new Error('no backend');
  }
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

// ─── Mock 数据过滤工具 ───────────────────────────────────────────
function filterProducts(params = {}) {
  let list = [...MOCK_PRODUCTS];

  // 分类筛选
  if (params.category) list = list.filter(p => p.category === params.category);
  if (params.is_hot)   list = list.filter(p => p.is_hot);
  if (params.is_new)   list = list.filter(p => p.is_new);

  // 关键词搜索（名称、品牌、品鉴笔记）
  if (params.q || params.keyword) {
    const kw = (params.q || params.keyword).toLowerCase();
    list = list.filter(p =>
      p.name?.toLowerCase().includes(kw) ||
      p.brand?.toLowerCase().includes(kw) ||
      p.tasting_notes?.toLowerCase().includes(kw) ||
      (p.tags ?? []).some(t => t.toLowerCase().includes(kw))
    );
  }

  // 年份筛选（支持 year_min/year_max 和旧版 year）
  if (params.year)     list = list.filter(p => p.year === Number(params.year));
  if (params.year_min) list = list.filter(p => p.year >= Number(params.year_min));
  if (params.year_max) list = list.filter(p => p.year <= Number(params.year_max));

  // 度数筛选（支持 degree_min/degree_max 和旧版 degree）
  if (params.degree)      list = list.filter(p => p.degree === Number(params.degree));
  if (params.degree_min !== undefined && params.degree_min !== '')
    list = list.filter(p => p.degree >= Number(params.degree_min));
  if (params.degree_max !== undefined && params.degree_max !== '')
    list = list.filter(p => p.degree <= Number(params.degree_max));

  // 价格筛选（支持 price_min/price_max 和旧版 min_price/max_price）
  const priceMin = params.price_min ?? params.min_price;
  const priceMax = params.price_max ?? params.max_price;
  if (priceMin !== undefined && priceMin !== '') list = list.filter(p => p.price >= Number(priceMin));
  if (priceMax !== undefined && priceMax !== '') list = list.filter(p => p.price <= Number(priceMax));

  // 排序
  if (params.sort === 'price_asc')  list.sort((a, b) => a.price - b.price);
  if (params.sort === 'price_desc') list.sort((a, b) => b.price - a.price);
  if (params.sort === 'rating')     list.sort((a, b) => b.rating - a.rating);
  if (params.sort === 'hot')        list.sort((a, b) => (b.sold_count ?? 0) - (a.sold_count ?? 0));
  if (params.sort === 'new')        list.sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0));

  const total = list.length;
  const limit  = params.limit  ? Number(params.limit)  : list.length;
  const offset = params.offset ? Number(params.offset) : 0;
  return { items: list.slice(offset, offset + limit), total };
}
// ────────────────────────────────────────────────────────────────

export const api = {
  getCategories: async () => {
    try { return await fetchAPI('/api/categories'); } catch {
      await delay();
      return MOCK_CATEGORIES;
    }
  },

  getAds: async () => {
    try { return await fetchAPI('/api/ads'); } catch {
      await delay();
      return MOCK_ADS;
    }
  },

  getProducts: async (params = {}) => {
    try {
      const q = new URLSearchParams(params).toString();
      return await fetchAPI(`/api/products${q ? '?' + q : ''}`);
    } catch {
      await delay();
      return filterProducts(params);
    }
  },

  getProduct: async (id) => {
    try { return await fetchAPI(`/api/products/${id}`); } catch {
      await delay();
      return MOCK_PRODUCTS.find(p => p.id === id) ?? null;
    }
  },

  getStores: async (params = {}) => {
    try {
      const q = new URLSearchParams(params).toString();
      return await fetchAPI(`/api/stores${q ? '?' + q : ''}`);
    } catch {
      await delay();
      return { items: MOCK_STORES, total: MOCK_STORES.length };
    }
  },

  getStore: async (id) => {
    try { return await fetchAPI(`/api/stores/${id}`); } catch {
      await delay();
      return MOCK_STORES.find(s => s.id === id) ?? null;
    }
  },

  getCardBalance: async (cardId) => {
    try { return await fetchAPI(`/api/card/${cardId}/balance`); } catch {
      await delay(400);
      const card = MOCK_CARDS[cardId];
      if (!card) throw new Error('卡号不存在');
      return card;
    }
  },

  getInventoryStats: async () => {
    try { return await fetchAPI('/api/inventory/stats'); } catch {
      await delay();
      return MOCK_INVENTORY_STATS;
    }
  },

  scanInventory: async (data) => {
    try {
      return await fetchAPI('/api/inventory/scan', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      await delay(300);
      return { success: true, message: '(模拟) 扫码记录已保存', data };
    }
  },
};

export function createLivestreamWS(onMessage) {
  if (!API_BASE || API_BASE === 'https://your-backend.railway.app') {
    throw new Error('no backend');
  }
  const wsUrl = API_BASE.replace(/^http/, 'ws') + '/ws/livestream';
  const ws = new WebSocket(wsUrl);
  ws.onmessage = (e) => {
    try { onMessage(JSON.parse(e.data)); } catch {}
  };
  return ws;
}
