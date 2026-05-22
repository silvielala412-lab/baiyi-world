'use client';
import { useState, useEffect, useRef } from 'react';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';
import AdBanner from '@/components/home/AdBanner';
import CategoryCarousel from '@/components/home/CategoryCarousel';
import ProductCard from '@/components/product/ProductCard';
import { api } from '@/lib/api';
import styles from './page.module.css';
import Link from 'next/link';

const FLASH_ITEMS = [
  { id: 'f1', icon: '🏺', name: '年份茅台 500ml', price: 1880, original: 2288, category: 'maotai' },
  { id: 'f2', icon: '🍾', name: '轩尼诗 XO 700ml', price: 1560, original: 2100, category: 'cognac' },
  { id: 'f3', icon: '🥃', name: '麦卡伦18年',  price: 3280, original: 4200, category: 'whisky' },
  { id: 'f4', icon: '🍷', name: '拉菲珍宝',     price: 680,  original: 888,  category: 'red-wine' },
  { id: 'f5', icon: '🍶', name: '郎酒红花郎',   price: 328,  original: 428,  category: 'baijiu-sauce' },
];

const QUICK_ACTIONS = [
  { icon: '🗺️', label: '周边酒行', sublabel: '附近门店', href: '/stores', color: '#27AE60' },
  { icon: '💳', label: '购物卡',   sublabel: '查余额',   href: '/card',   color: '#3498DB' },
  { icon: '🔴', label: 'AI直播',   sublabel: '品酒大师', href: '/live',   color: '#E91E1E' },
  { icon: '📊', label: '后台管理', sublabel: '数据中心', href: '/admin',  color: '#9B59B6' },
];

function useCountdown(targetTime) {
  const [time, setTime] = useState({ h: '00', m: '00', s: '00' });
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, targetTime - now);
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTime({
        h: String(h).padStart(2, '0'),
        m: String(m).padStart(2, '0'),
        s: String(s).padStart(2, '0'),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetTime]);
  return time;
}

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [ads, setAds]               = useState([]);
  const [hotProducts, setHotProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading]       = useState(true);

  // countdown: next midnight
  const endTime = useRef(
    (() => {
      const d = new Date();
      d.setHours(24, 0, 0, 0);
      return d.getTime();
    })()
  );
  const countdown = useCountdown(endTime.current);

  useEffect(() => {
    Promise.all([
      api.getCategories().catch(() => []),
      api.getAds().catch(() => []),
      api.getProducts({ is_hot: true, limit: 4 }).catch(() => ({ items: [] })),
      api.getProducts({ is_new: true, limit: 4 }).catch(() => ({ items: [] })),
    ]).then(([cats, adsData, hot, newP]) => {
      setCategories(cats);
      setAds(adsData);
      setHotProducts(hot.items ?? []);
      setNewProducts(newP.items ?? []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <TopBar />
      <div className="page-content" style={{ paddingTop: '120px' }}>

        {/* ── Hero Banner ── */}
        <div className={styles.heroSection}>
          <AdBanner ads={ads} />
        </div>

        {/* ── Category Carousel ── */}
        <CategoryCarousel categories={categories} />

        <div className={styles.sectionDivider} />

        {/* ── Flash Sale ── */}
        <div style={{ padding: '20px var(--space-4) 0' }}>
          <div className={styles.sectionHeader} style={{ marginBottom: 12 }}>
            <div className={styles.sectionTitle}>
              <span>⚡</span> 限时闪购
            </div>
          </div>
        </div>
        <div style={{ padding: '0 var(--space-4) 20px' }}>
          <div className={styles.flashSale}>
            <div className={styles.flashHeader}>
              <div className={styles.flashTitle}>
                <div className={styles.flashIcon}>⚡</div>
                <span className={styles.flashTitleText}>限时闪购</span>
              </div>
              <div className={styles.flashCountdown}>
                <span className={styles.countdownLabel}>距结束</span>
                <span className={styles.countdownNum}>{countdown.h}</span>
                <span className={styles.countdownSep}>:</span>
                <span className={styles.countdownNum}>{countdown.m}</span>
                <span className={styles.countdownSep}>:</span>
                <span className={styles.countdownNum}>{countdown.s}</span>
              </div>
            </div>
            <div className={styles.flashScroll}>
              {FLASH_ITEMS.map(item => (
                <div key={item.id} className={styles.flashItem}>
                  <span className={styles.flashItemIcon}>{item.icon}</span>
                  <p className={styles.flashItemName}>{item.name}</p>
                  <p className={styles.flashItemPrice}>¥{item.price.toLocaleString()}</p>
                  <p className={styles.flashItemOriginal}>¥{item.original.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.sectionDivider} />

        {/* ── Hot Products ── */}
        <section className={styles.section}>
          <div className={`${styles.sectionHeader} ${styles.sectionInner}`}>
            <h2 className={styles.sectionTitle}>🔥 热销精选</h2>
            <Link href="/category/all?sort=hot" className={styles.sectionMore}>查看更多 ›</Link>
          </div>
          <div className={styles.sectionInner}>
            {loading ? (
              <div className={styles.grid}>
                {[1,2,3,4].map(i => <div key={i} className={`skeleton ${styles.skeletonCard}`} />)}
              </div>
            ) : (
              <div className={styles.grid}>
                {hotProducts.map((p, idx) => (
                  <div key={p.id} style={{ animationDelay: `${idx * 0.08}s` }}>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className={styles.sectionDivider} />

        {/* ── New Arrivals ── */}
        <section className={styles.section}>
          <div className={`${styles.sectionHeader} ${styles.sectionInner}`}>
            <h2 className={styles.sectionTitle}>✨ 新品上市</h2>
            <Link href="/category/all?sort=new" className={styles.sectionMore}>查看更多 ›</Link>
          </div>
          <div className={styles.sectionInner}>
            {loading ? (
              <div className={styles.grid}>
                {[1,2].map(i => <div key={i} className={`skeleton ${styles.skeletonCard}`} />)}
              </div>
            ) : (
              <div className={styles.grid}>
                {newProducts.map((p, idx) => (
                  <div key={p.id} style={{ animationDelay: `${idx * 0.1}s` }}>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className={styles.sectionDivider} />

        {/* ── Quick Actions ── */}
        <section className={styles.section}>
          <div className={`${styles.sectionHeader} ${styles.sectionInner}`}>
            <h2 className={styles.sectionTitle}>🛠️ 快捷入口</h2>
          </div>
          <div className={styles.sectionInner}>
            <div className={styles.quickActions}>
              {QUICK_ACTIONS.map(item => (
                <Link key={item.label} href={item.href} className={styles.quickItem}>
                  <div className={styles.quickIcon} style={{ '--q-color': item.color }}>
                    {item.icon}
                  </div>
                  <span className={styles.quickLabel}>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <div className={styles.sectionDivider} />

        {/* ── Brand Footer ── */}
        <div className={styles.brandStrip}>
          <div className={styles.brandLogo}>邑</div>
          <span className={styles.brandName}>百邑酒世界</span>
          <span className={styles.brandTagline}>品味非凡 · 匠心之选</span>
          <div className={styles.brandBadges}>
            <span className={styles.brandBadge}>正品保障</span>
            <span className={styles.brandBadge}>极速配送</span>
            <span className={styles.brandBadge}>链上存证</span>
          </div>
        </div>

      </div>
      <BottomNav />
    </main>
  );
}
