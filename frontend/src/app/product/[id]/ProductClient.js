'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';
import { api } from '@/lib/api';
import styles from './page.module.css';

function getCategoryIcon(category) {
  const map = {
    maotai: '🏺', 'baijiu-sauce': '🍶', 'baijiu-strong': '🫙',
    cognac: '🍾', whisky: '🥃', 'red-wine': '🍷', vodka: '🥂',
    'health-wine': '💚', sake: '🫙', cocktail: '🍹', liqueur: '🫗',
    'beer-import': '🍺', 'beer-domestic': '🍻', tea: '🫖', cigar: '🚬',
    gift: '🎁', food: '🥩', flower: '🌹',
    supplement: '💊', snack: '🍿', drinks: '🧃', poker: '🃏',
  };
  return map[category] ?? '🍶';
}

const AI_TIPS = {
  maotai: '茅台酒最佳饮用温度为室温，建议搭配清淡粤菜，勿空腹饮用。',
  cognac: '干邑白兰地建议16-18°C饮用，可加少许冰块，搭配黑巧克力风味最佳。',
  whisky: '威士忌建议纯饮或加少量矿泉水，以27°C饮用可释放最丰富的香气。',
  'red-wine': '红葡萄酒最佳饮用温度16-18°C，开瓶后醒酒30分钟，搭配红肉和熟成奶酪。',
  'baijiu-sauce': '酱香白酒应室温饮用，适量为宜，建议搭配川贵风味菜肴。',
  'baijiu-strong': '浓香型白酒口感绵甜，适合搭配川菜，温热饮用口感更佳。',
  default: '适量饮酒，珍爱健康。选择优质酒款，享受每一次品鉴时刻。',
};

const MOCK_REVIEWS = [
  {
    id: 1, user: '酒仙王大爷', avatar: '🧓', rating: 5,
    date: '2024-12-08',
    text: '真的非常好，酱香突出，入口绵柔，空杯留香超过一小时，是我喝过最好的一批。包装也很精美，适合送礼！',
    tags: ['正品保障', '包装精美', '值得回购'],
  },
  {
    id: 2, user: '威士忌小姐', avatar: '👩', rating: 5,
    date: '2024-11-25',
    text: '香气层次非常丰富，配合这款酒喝了一顿烛光晚餐，氛围感拉满。值得回购！',
    tags: ['香气迷人', '适合送礼'],
  },
  {
    id: 3, user: '品酒师Leo', avatar: '👨‍💼', rating: 4,
    date: '2024-10-14',
    text: '性价比很高，在这个价位段算得上是同类中的佼佼者。配合清淡菜肴效果极佳，朋友一致好评。',
    tags: ['高性价比', '朋友聚餐'],
  },
];

export default function ProductClient() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('detail');
  const [count, setCount] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getProduct(id)
      .then(p => setProduct(p))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <main>
        <TopBar showBack title="商品详情" />
        <div className="page-content" style={{ paddingTop: 64 }}>
          <div className={styles.skeletonHero} />
          <div style={{ padding: '24px 16px' }}>
            <div className="skeleton" style={{ height: 28, borderRadius: 8, marginBottom: 12 }} />
            <div className="skeleton" style={{ height: 20, borderRadius: 8, width: '60%', marginBottom: 20 }} />
            <div className="skeleton" style={{ height: 80, borderRadius: 12 }} />
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main>
        <TopBar showBack title="商品详情" />
        <div className="page-content" style={{ paddingTop: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
          <span style={{ fontSize: 64 }}>🍾</span>
          <h2 style={{ color: 'var(--text-primary)', fontSize: 20 }}>商品不存在</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>该商品可能已下架或链接有误</p>
          <Link href="/" className={styles.backHomeBtn}>返回首页</Link>
        </div>
        <BottomNav />
      </main>
    );
  }

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;
  const rating = Math.floor(product.rating ?? 4);
  const aiTip = AI_TIPS[product.category] ?? AI_TIPS.default;

  return (
    <main>
      <TopBar showBack title="商品详情" />
      <div className="page-content" style={{ paddingTop: 64, paddingBottom: 90 }}>

        {/* ── Hero Image ── */}
        <div className={styles.heroWrap}>
          <div className={styles.heroBg} style={{ '--cat-color': getCategoryColor(product.category) }}>
            <span className={styles.heroIcon}>{getCategoryIcon(product.category)}</span>
          </div>
          {product.is_hot && <span className={styles.heroBadgeHot}>🔥 热销</span>}
          {product.is_new && !product.is_hot && <span className={styles.heroBadgeNew}>✨ 新品</span>}
          {discount > 0 && <span className={styles.heroDiscount}>省{discount}%</span>}
        </div>

        {/* ── Price Block ── */}
        <div className={styles.priceBlock}>
          <div className={styles.priceRow}>
            <span className={styles.priceUnit}>¥</span>
            <span className={styles.priceMain}>{product.price?.toLocaleString()}</span>
            {discount > 0 && (
              <span className={styles.priceOriginal}>
                ¥{product.original_price?.toLocaleString()}
              </span>
            )}
          </div>
          <div className={styles.metaTags}>
            {product.year > 0 && <span className={styles.metaTag}>📅 {product.year}年</span>}
            {product.degree > 0 && <span className={styles.metaTag}>🌡️ {product.degree}°</span>}
            {product.brand && <span className={styles.metaTag}>🏷️ {product.brand}</span>}
            {product.unit && <span className={styles.metaTag}>📦 {product.unit}</span>}
          </div>
        </div>

        {/* ── Name & Ratings ── */}
        <div className={styles.nameBlock}>
          <h1 className={styles.productName}>{product.name}</h1>
          <div className={styles.ratingRow}>
            <span className={styles.stars}>{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
            <span className={styles.ratingNum}>{product.rating?.toFixed(1)}</span>
            <span className={styles.reviewCount}>{product.reviews?.toLocaleString()}条评价</span>
            <span className={styles.soldCount}>已售{product.sold_count?.toLocaleString() ?? product.stock}件</span>
          </div>
          {(product.tags ?? []).length > 0 && (
            <div className={styles.tagRow}>
              {product.tags.map(t => (
                <span key={t} className={styles.tag}>{t}</span>
              ))}
            </div>
          )}
        </div>

        {/* ── Stock Bar ── */}
        {product.stock !== undefined && product.stock < 50 && (
          <div className={styles.stockWrap}>
            <span className={styles.stockLabel}>仅剩 <b>{product.stock}</b> 瓶</span>
            <div className={styles.stockBar}>
              <div className={styles.stockFill} style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }} />
            </div>
          </div>
        )}

        {/* ── Tab Switcher ── */}
        <div className={styles.tabs}>
          {['detail', 'pairing', 'reviews'].map(tab => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {{ detail: '商品详情', pairing: '品鉴搭配', reviews: '用户评价' }[tab]}
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        <div className={styles.tabContent}>
          {activeTab === 'detail' && (
            <div className={styles.detailSection}>
              {product.tasting_notes && (
                <div className={styles.card}>
                  <h3 className={styles.cardTitle}>🍷 品鉴笔记</h3>
                  <p className={styles.cardText}>{product.tasting_notes}</p>
                </div>
              )}
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>📋 商品规格</h3>
                <table className={styles.specTable}>
                  <tbody>
                    {product.brand && <tr><td>品牌</td><td>{product.brand}</td></tr>}
                    {product.year > 0 && <tr><td>年份</td><td>{product.year}年</td></tr>}
                    {product.degree > 0 && <tr><td>度数</td><td>{product.degree}°</td></tr>}
                    {product.unit && <tr><td>规格</td><td>{product.unit}</td></tr>}
                    {product.qr_prefix && <tr><td>溯源码前缀</td><td>{product.qr_prefix}</td></tr>}
                    <tr><td>库存</td><td>{product.stock ?? '充足'}</td></tr>
                  </tbody>
                </table>
              </div>
              <div className={styles.card} style={{ background: 'linear-gradient(135deg, #0d1545, #1a2a7a)' }}>
                <h3 className={styles.cardTitle}>🤖 AI 品酒师建议</h3>
                <p className={styles.cardText}>{aiTip}</p>
              </div>
            </div>
          )}

          {activeTab === 'pairing' && (
            <div className={styles.detailSection}>
              {product.ai_pairing && product.ai_pairing.length > 0 && (
                <div className={styles.card}>
                  <h3 className={styles.cardTitle}>🍽️ AI 推荐搭配</h3>
                  <div className={styles.pairingGrid}>
                    {product.ai_pairing.map((item, i) => (
                      <div key={i} className={styles.pairingItem}>
                        <span className={styles.pairingIcon}>
                          {['🥢', '🍖', '🥗', '🧀', '🍫', '🦪'][i % 6]}
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>🌡️ 最佳饮用指南</h3>
                <p className={styles.cardText}>{aiTip}</p>
                <div className={styles.tipList}>
                  <div className={styles.tipItem}><span>🕐</span><span>醒酒时间：{product.category === 'red-wine' ? '30-60分钟' : '无需醒酒'}</span></div>
                  <div className={styles.tipItem}><span>🌡️</span><span>最佳温度：{product.category === 'red-wine' ? '16-18°C' : product.category === 'cognac' ? '16-20°C' : '室温'}</span></div>
                  <div className={styles.tipItem}><span>🥃</span><span>杯型：{product.category === 'whisky' ? '高球杯 / 古典杯' : product.category === 'red-wine' ? '大肚波尔多杯' : '白酒专用杯'}</span></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className={styles.detailSection}>
              <div className={styles.reviewSummary}>
                <span className={styles.reviewBigScore}>{product.rating?.toFixed(1) ?? '4.9'}</span>
                <div>
                  <div className={styles.stars} style={{ fontSize: 20 }}>{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</div>
                  <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{product.reviews?.toLocaleString()}条评价</span>
                </div>
              </div>
              {MOCK_REVIEWS.map(r => (
                <div key={r.id} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <span className={styles.reviewAvatar}>{r.avatar}</span>
                    <div>
                      <span className={styles.reviewUser}>{r.user}</span>
                      <span className={styles.reviewStars}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                    </div>
                    <span className={styles.reviewDate}>{r.date}</span>
                  </div>
                  <p className={styles.reviewText}>{r.text}</p>
                  {r.tags && (
                    <div className={styles.reviewTags}>
                      {r.tags.map(t => <span key={t} className={styles.reviewTag}>{t}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom Action Bar ── */}
      <div className={styles.actionBar}>
        <div className={styles.qtyControl}>
          <button onClick={() => setCount(c => Math.max(1, c - 1))} className={styles.qtyBtn}>−</button>
          <span className={styles.qtyNum}>{count}</span>
          <button onClick={() => setCount(c => c + 1)} className={styles.qtyBtn}>+</button>
        </div>
        <button className={`${styles.cartBtn} ${addedToCart ? styles.cartBtnSuccess : ''}`} onClick={handleAddCart}>
          {addedToCart ? '✓ 已加入购物车' : '🛒 加入购物车'}
        </button>
        <button className={styles.buyBtn}>立即购买</button>
      </div>

      <BottomNav />
    </main>
  );
}

function getCategoryColor(category) {
  const map = {
    maotai: '#C8A96E', 'baijiu-sauce': '#D4784A', 'baijiu-strong': '#8B6914',
    cognac: '#722F37', whisky: '#8B4513', 'red-wine': '#722F37',
    vodka: '#4A90D9', sake: '#C8AD7F', tea: '#27AE60', cigar: '#795548',
    gift: '#E91E8C', food: '#FF5722', 'beer-import': '#F39C12',
    supplement: '#00897B', snack: '#FB8C00', drinks: '#039BE5', poker: '#E53935',
  };
  return map[category] ?? '#C8A96E';
}
