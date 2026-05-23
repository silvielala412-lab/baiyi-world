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
  'baijiu-other': '其它白酒', cognac: '干邑白兰地', whisky: '威士忌', 'red-wine': '红葡萄酒',
  vodka: '伏特加', 'health-wine': '保健酒', sake: '清酒', huangjiu: '黄酒',
  beer: '啤酒', cocktail: '鸡尾酒', liqueur: '利口酒', 'beer-import': '进口啤酒',
  'beer-domestic': '国产啤酒', 'craft-beer': '精酿啤酒', tea: '茗茶 · 精品茶具',
  cigar: '精品雪茄', gift: '手信 · 伴手礼', food: '高端土特产下酒菜', flower: '鲜花定制',
  supplement: '滋补养生', snack: '下酒零食', drinks: '饮品配酒', poker: '扑克娱乐',
  'fruit-wine': '果酒', 'gift-card': '礼品卡 · 购物卡',
  'flash-sale': '特价促销', 'new-arrivals': '新品上市', all: '全部品类',
};

const BRAND_ADS = {
  maotai:         { brand: '贵州茅台酒股份有限公司', slogan: '酿造高品位的生活 · 中国白酒之魂', color: '#C8A96E' },
  'baijiu-sauce': { brand: '郎酒集团 · 国家级非遗工艺', slogan: '红花郎 — 中国酱香，郎中之郎', color: '#D4784A' },
  'baijiu-strong':{ brand: '宜宾五粮液集团', slogan: '五粮酿造 · 浓香天下，传承百年', color: '#8B6914' },
  cognac:         { brand: '酩悦轩尼诗 · 法国干邑', slogan: '百年传承 · 馥郁花香，臻于至善', color: '#722F37' },
  whisky:         { brand: '麦卡伦威士忌酒庄', slogan: '苏格兰斯佩塞 · 雪莉桶精酿，追求极致', color: '#8B4513' },
  'red-wine':     { brand: '罗斯柴尔德男爵庄园', slogan: '拉菲古堡 · 卓越传承，始于1868年', color: '#722F37' },
  vodka:          { brand: '顶级蒸馏工坊 · 全球甄选', slogan: '纯粮蒸馏 · 晶莹剔透，清爽纯净', color: '#5C6BC0' },
  sake:           { brand: '日本清酒酿造协会认定酒庄', slogan: '米之精华 · 大吟酿之道，匠心天成', color: '#C8AD7F' },
  tea:            { brand: '武夷山 · 百邑茶叶', slogan: '岩骨花香 · 大红袍传世，兰香持久', color: '#27AE60' },
  cigar:          { brand: '古巴国宝 · 高希霸至尊系列', slogan: '奶油坚果雪松 · 世纪级品鉴体验', color: '#795548' },
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
      <div className="page-content" style={{ paddingTop: 64, paddingBottom: 80 }}>
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
