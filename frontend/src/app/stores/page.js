'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';
import { api } from '@/lib/api';
import styles from './page.module.css';

// AMap must be client-side only
const AMapContainer = dynamic(() => import('@/components/store/AMapContainer'), { ssr: false });

export default function StoresPage() {
  const [stores, setStores]           = useState([]);
  const [selected, setSelected]       = useState(null);
  const [showVideo, setShowVideo]     = useState(false);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    api.getStores().then(res => {
      const list = res.items ?? res;
      setStores(list);
      if (list.length) setSelected(list[0]);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <TopBar title="周边酒行" showBack />
      <div className="page-content">
        <div className="container">

          {/* Map */}
          <section className={styles.mapSection}>
            <AMapContainer stores={stores} onStoreSelect={s => { setSelected(s); setShowVideo(false); }} />
          </section>

          {/* Selected store card */}
          {selected && (
            <div className={styles.storeCard}>
              <div className={styles.storeHeader}>
                <div>
                  <h2 className={styles.storeName}>{selected.name}</h2>
                  <p className={styles.storeAddress}>📍 {selected.address}</p>
                </div>
                <div className={styles.storeStatus}>
                  <span className={selected.is_open ? styles.open : styles.closed}>
                    {selected.is_open ? '营业中' : '休息中'}
                  </span>
                  <span className={styles.distance}>{selected.distance}</span>
                </div>
              </div>

              <div className={styles.storeMeta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}>📞</span>
                  <span>{selected.phone}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}>⏱️</span>
                  <span>{selected.hours}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}>⭐</span>
                  <span>{selected.rating} 分</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}>🏪</span>
                  <span>{selected.type}</span>
                </div>
              </div>

              <div className={styles.tags}>
                {selected.tags?.map(t => <span key={t} className="badge badge-gold">{t}</span>)}
              </div>

              <div className={styles.actions}>
                <a href={`tel:${selected.phone}`} className="btn-ghost">📞 致电</a>
                <button onClick={() => setShowVideo(!showVideo)} className="btn-gold">
                  {showVideo ? '⬇ 收起' : '▶️ 微短剧'}
                </button>
                <button className="btn-ghost">💬 连麦</button>
              </div>

              {/* Micro Short Video */}
              {showVideo && (
                <div className={styles.videoWrap}>
                  <div className={styles.videoLabel}>
                    <span className="live-badge">PROMO</span>
                    <span className={styles.videoTitle}>{selected.video_title}</span>
                  </div>
                  <video
                    src={selected.video_url}
                    controls
                    autoPlay
                    muted
                    playsInline
                    className={styles.video}
                  />
                </div>
              )}
            </div>
          )}

          {/* Nearby list */}
          <section className={styles.nearbySection}>
            <h2 className="section-title">🏪 全部门店</h2>
            <div className={styles.storeList}>
              {loading ? (
                [1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 12, marginBottom: 12 }} />)
              ) : stores.map(store => (
                <button
                  key={store.id}
                  onClick={() => { setSelected(store); setShowVideo(false); window.scrollTo({ top: 200, behavior: 'smooth' }); }}
                  className={`${styles.storeListItem} ${selected?.id === store.id ? styles.storeListItemActive : ''}`}
                >
                  <div className={styles.storeListLeft}>
                    <span className={styles.storeListName}>{store.name}</span>
                    <span className={styles.storeListAddr}>{store.address}</span>
                    <div className={styles.storeListTags}>
                      {store.tags?.slice(0, 2).map(t => <span key={t} className="badge badge-gold">{t}</span>)}
                    </div>
                  </div>
                  <div className={styles.storeListRight}>
                    <span className={styles.storeListDist}>{store.distance}</span>
                    <span className={store.is_open ? styles.open : styles.closed}>
                      {store.is_open ? '营业中' : '休息'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
