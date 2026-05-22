'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';
import FilterBar from '@/components/product/FilterBar';
import ProductCard from '@/components/product/ProductCard';
import { api } from '@/lib/api';
import styles from './page.module.css';

const CATEGORY_NAMES = {
  maotai: '年份个性化茅台', 'baijiu-sauce': '酱香型白酒', 'baijiu-strong': '浓香型白酒',
  cognac: '干邑白兰地', whisky: '威士忌', 'red-wine': '红葡萄酒',
  vodka: '伏特加', 'health-wine': '保健酒', sake: '清酒',
  cocktail: '鸡尾酒/果酒', liqueur: '利口酒', 'beer-import': '进口啤酒',
  'beer-domestic': '国产啤酒', tea: '茗茶+精品茶具', cigar: '精品雪茄',
  gift: '饼礼/手信伴手礼', food: '高端土特产下酒菜', flower: '鲜花定制',
  'flash-sale': '特价促销', 'new-arrivals': '新品上市', all: '全部品类',
};

const BRAND_ADS = {
  maotai:      { brand: '贵州茅台酒股份有限公司', slogan: '酿造高品位的生活', color: '#C8A96E' },
  'baijiu-sauce': { brand: '郎酒集团', slogan: '红花郎 — 中国酱香，郎中之郎', color: '#D4784A' },
  cognac:      { brand: 'LVMH Moët Hennessy', slogan: 'Never stop. Never settle.', color: '#722F37' },
  whisky:      { brand: 'The Macallan Distillery', slogan: 'In pursuit of the perfect dram', color: '#8B4513' },
  'red-wine':  { brand: 'Domaines Barons de Rothschild', slogan: 'Château Lafite — Excellence since 1868', color: '#722F37' },
};

export default function CategoryClient() {
  const params = useParams();
  const slug = params?.slug ?? 'all';
  const categoryName = CATEGORY_NAMES[slug] ?? slug;

  const [products, setProducts] = useState([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [filters, setFilters]   = useState({});

  const brandAd = BRAND_ADS[slug];

  const loadProducts = (newFilters = {}) => {
    setLoading(true);
    const p = { ...(slug !== 'all' ? { category: slug } : {}), ...newFilters, limit: 20 };
    api.getProducts(p)
      .then(res => { setProducts(res.items ?? []); setTotal(res.total ?? 0); })
      .catch(() => { setProducts([]); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadProducts(); }, [slug]);

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    loadProducts(newFilters);
  };

  return (
    <main>
      <TopBar title={categoryName} showBack />
      <div className="page-content">
        {brandAd && (
          <div className={styles.brandAd} style={{ '--brand-color': brandAd.color }}>
            <span className={styles.brandName}>{brandAd.brand}</span>
            <p className={styles.brandSlogan}>{brandAd.slogan}</p>
          </div>
        )}

        <FilterBar onFilterChange={handleFilter} category={slug} />

        <div className="container">
          <div className={styles.resultMeta}>
            <span>共 {total} 款</span>
          </div>

          {loading ? (
            <div className={styles.grid}>
              {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{ height: 260, borderRadius: 18 }} />)}
            </div>
          ) : products.length === 0 ? (
            <div className={styles.empty}>
              <span>🍾</span>
              <p>暂无相关商品</p>
              <small>请尝试调整筛选条件</small>
            </div>
          ) : (
            <div className={styles.grid}>
              {products.map((p, i) => (
                <div key={p.id} style={{ animationDelay: `${i * 0.05}s` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
