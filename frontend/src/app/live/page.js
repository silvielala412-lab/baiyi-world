'use client';
import { useState, useEffect, useRef } from 'react';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';
import { createLivestreamWS } from '@/lib/api';
import styles from './page.module.css';

const AI_HOST = { name: 'AI品酒师·云麒', avatar: '🤖' };
const PRODUCTS_SPOTLIGHT = [
  { id: 'mt-2021-53', name: '贵州茅台 2021年 飞天', price: 1499 },
  { id: 'hennessy-xo', name: '轩尼斯 XO 干邑白兰地', price: 1199 },
  { id: 'macallan-18', name: '麦卡伦 18年 雪莉桶', price: 3899 },
];

export default function LivePage() {
  const [barrages, setBarrages]     = useState([]);
  const [spotlight, setSpotlight]   = useState(PRODUCTS_SPOTLIGHT[0]);
  const [purchases, setPurchases]   = useState([]);
  const [viewers, setViewers]       = useState(3847);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef                       = useRef(null);
  const barrageRef                  = useRef(null);

  useEffect(() => {
    // Simulate viewer count fluctuation
    const iv = setInterval(() => setViewers(v => v + Math.floor(Math.random() * 5) - 2), 3000);

    try {
      const ws = createLivestreamWS((msg) => {
        if (msg.type === 'barrage') {
          setBarrages(prev => [...prev.slice(-30), { ...msg.data, id: Date.now() }]);
        } else if (msg.type === 'product') {
          setSpotlight(msg.data);
        } else if (msg.type === 'purchase') {
          setPurchases(prev => [...prev.slice(-5), { ...msg.data, id: Date.now() }]);
        }
      });
      ws.onopen = () => setIsConnected(true);
      ws.onerror = () => setIsConnected(false);
      wsRef.current = ws;
    } catch {
      // Backend not running yet - use mock data
      const mockInterval = setInterval(() => {
        const mocks = [
          { type: 'barrage', data: { user: '品酒爱好者', message: '这款茅台赞！', color: 'hsl(45,70%,70%)' } },
          { type: 'barrage', data: { user: '威士忌达人', message: '麦卡伦18年真不错', color: 'hsl(210,70%,70%)' } },
          { type: 'purchase', data: { user: '消费者A', product: '贵州茅台 2021年', price: 1499 } },
        ];
        const m = mocks[Math.floor(Math.random() * mocks.length)];
        if (m.type === 'barrage') setBarrages(prev => [...prev.slice(-30), { ...m.data, id: Date.now() }]);
        if (m.type === 'purchase') setPurchases(prev => [...prev.slice(-5), { ...m.data, id: Date.now() }]);
      }, 2000);
      return () => clearInterval(mockInterval);
    }

    return () => {
      clearInterval(iv);
      wsRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (barrageRef.current) {
      barrageRef.current.scrollTop = barrageRef.current.scrollHeight;
    }
  }, [barrages]);

  return (
    <main>
      <TopBar title="AI 直播间" showBack />
      <div className="page-content">

        {/* Live stage */}
        <div className={styles.stage}>
          {/* Host avatar */}
          <div className={styles.hostArea}>
            <div className={styles.hostAvatar}>
              <span>{AI_HOST.avatar}</span>
              <div className={styles.hostRing} />
            </div>
            <div className={styles.hostInfo}>
              <span className="live-badge">LIVE</span>
              <span className={styles.hostName}>{AI_HOST.name}</span>
            </div>
          </div>

          {/* Viewer count */}
          <div className={styles.viewerCount}>
            👁 {viewers.toLocaleString()} 人正在观看
          </div>

          {/* AI talking visualization */}
          <div className={styles.aiVisual}>
            <div className={styles.waveform}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className={styles.waveBar} style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
            <p className={styles.aiSpeech}>
              &ldquo;今天为大家推荐的是 <strong>{spotlight?.name}</strong>，
              现在特惠价 ¥{spotlight?.price}，比市场价便宜不少哦！&rdquo;
            </p>
          </div>

          {/* Product spotlight */}
          {spotlight && (
            <div className={styles.spotlightCard}>
              <div className={styles.spotlightIcon}>🍾</div>
              <div className={styles.spotlightInfo}>
                <div className={styles.spotlightName}>{spotlight.name}</div>
                <div className={styles.spotlightPrice}>¥{spotlight.price?.toLocaleString()} <span className={styles.spotlightTag}>直播价</span></div>
              </div>
              <button className="btn-gold" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                抢购
              </button>
            </div>
          )}
        </div>

        {/* Purchase notifications */}
        <div className={styles.purchaseStrip}>
          {purchases.slice(-2).map(p => (
            <div key={p.id} className={styles.purchaseItem}>
              🛍️ <strong>{p.user}</strong> 刚购买了 {p.product}
            </div>
          ))}
        </div>

        {/* Barrage / Comments */}
        <div className={styles.barrageSection}>
          <div className={styles.barrageConnStatus}>
            <span className={isConnected ? styles.connDot : styles.connDotOff} />
            {isConnected ? '已连接直播服务器' : '模拟直播模式'}
          </div>
          <div className={styles.barrageList} ref={barrageRef}>
            {barrages.map(b => (
              <div key={b.id} className={styles.barrageItem}>
                <span className={styles.barrageUser} style={{ color: b.color }}>{b.user}</span>
                <span className={styles.barrageMsg}>{b.message}</span>
              </div>
            ))}
            {barrages.length === 0 && (
              <div className={styles.barrageEmpty}>直播间互动消息将在这里显示…</div>
            )}
          </div>
        </div>

        {/* Bottom product shelf */}
        <div className={styles.shelf}>
          {PRODUCTS_SPOTLIGHT.map(p => (
            <button
              key={p.id}
              onClick={() => setSpotlight(p)}
              className={`${styles.shelfItem} ${spotlight?.id === p.id ? styles.shelfActive : ''}`}
            >
              <span className={styles.shelfIcon}>🍾</span>
              <div className={styles.shelfName}>{p.name.split(' ')[0]}</div>
              <div className={styles.shelfPrice}>¥{p.price}</div>
            </button>
          ))}
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
