'use client';
import styles from './TopBar.module.css';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

const SUB_TABS = [
  { label: '推荐',   href: '/' },
  { label: '白酒',   href: '/category/baijiu-sauce' },
  { label: '洋酒',   href: '/category/cognac' },
  { label: '葡萄酒', href: '/category/red-wine' },
  { label: '威士忌', href: '/category/whisky' },
  { label: '直播',   href: '/live' },
];

const HOT_CITIES = [
  '北京', '上海', '广州', '深圳', '杭州',
  '成都', '重庆', '武汉', '西安', '南京',
  '苏州', '天津', '长沙', '郑州', '青岛',
  '贵阳', '茅台镇', '宜宾', '泸州', '绍兴',
];

export default function TopBar({ title, showBack = false, rightElement }) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeIdx, setActiveIdx] = useState(() => {
    const found = SUB_TABS.findIndex(t => t.href !== '/' && pathname.startsWith(t.href));
    return found >= 0 ? found : (pathname === '/' ? 0 : -1);
  });

  const [city, setCity] = useState('上海');
  const [showCityPanel, setShowCityPanel] = useState(false);
  const [locating, setLocating] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!showCityPanel) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowCityPanel(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showCityPanel]);

  const handleLocate = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=zh`
          );
          const data = await res.json();
          const addr = data.address;
          const detected = addr.city || addr.county || addr.state || '当前城市';
          setCity(detected.replace(/市$/, '').slice(0, 4));
        } catch {
          setCity('定位城市');
        }
        setLocating(false);
        setShowCityPanel(false);
      },
      () => { setLocating(false); }
    );
  };

  /* ── Back variant ── */
  if (showBack) {
    return (
      <header className={styles.bar}>
        <div className={styles.backRow}>
          <button onClick={() => router.back()} className={styles.backBtn}>
            <span className={styles.backArrow}>←</span>
            返回
          </button>
          {title && <h1 className={styles.titleCenter}>{title}</h1>}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            {rightElement}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={styles.bar}>

      {/* ── Row 1: Logo + City + Right icons ── */}
      <div className={styles.brandRow}>

        {/* Logo */}
        <div className={styles.logoBlock}>
          <div className={styles.logoMark}>邑</div>
          <div className={styles.logoTextGroup}>
            <span className={styles.logoText}>百邑</span>
            <span className={styles.logoSub}>酒世界</span>
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* City selector */}
        <div className={styles.cityBlock} ref={panelRef}>
          <button
            className={styles.cityBtn}
            onClick={() => setShowCityPanel(v => !v)}
            aria-label="切换城市"
          >
            <span className={styles.cityIcon}>📍</span>
            <span className={styles.cityName}>{city}</span>
            <span className={`${styles.cityArrow} ${showCityPanel ? styles.cityArrowOpen : ''}`}>›</span>
          </button>

          {/* City dropdown */}
          {showCityPanel && (
            <div className={styles.cityPanel}>
              <div className={styles.cityPanelHeader}>
                <span>选择城市</span>
                <button
                  className={styles.locateBtn}
                  onClick={handleLocate}
                  disabled={locating}
                >
                  {locating ? '定位中…' : '📡 GPS定位'}
                </button>
              </div>
              <div className={styles.cityGrid}>
                {HOT_CITIES.map(c => (
                  <button
                    key={c}
                    className={`${styles.cityItem} ${city === c ? styles.cityItemActive : ''}`}
                    onClick={() => { setCity(c); setShowCityPanel(false); }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notification */}
        <button className={styles.iconBtn} aria-label="消息">
          🔔
          <span className={styles.notifDot} />
        </button>

        {/* Live badge */}
        <Link href="/live" className={styles.liveBtn}>
          <span className={styles.liveDot} />
          直播
        </Link>
      </div>

      {/* ── Row 2: Full-width search bar (独立一行) ── */}
      <div className={styles.searchRow}>
        <Link href="/search" className={styles.searchBar} id="home-search-bar">
          <span className={styles.searchIcon}>🔍</span>
          <span className={styles.searchPlaceholder}>搜索酒款、品牌、年份…</span>
          <span className={styles.searchScanIcon}>📷</span>
        </Link>
      </div>

      {/* ── Row 3: Sub-category tabs ── */}
      <div className={styles.subTabs}>
        {SUB_TABS.map((tab, i) => (
          <button
            key={tab.label}
            className={`${styles.subTab} ${activeIdx === i ? styles.subTabActive : ''}`}
            onClick={() => {
              setActiveIdx(i);
              router.push(tab.href);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

    </header>
  );
}
