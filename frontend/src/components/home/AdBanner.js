'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './AdBanner.module.css';
import Link from 'next/link';

const FALLBACK_ADS = [
  {
    id: 1,
    title: '年份个性化茅台',
    subtitle: '传世珍品，酱香典范，匠心酿造五十年',
    eyebrow: '镇店之宝',
    cta: '立即抢购',
    link: '/category/maotai',
    bg: 'linear-gradient(135deg, #1a0e00 0%, #3d2200 50%, #1a0e00 100%)',
    accentColor: 'rgba(200,169,110,0.45)',
  },
  {
    id: 2,
    title: '轩尼诗 XO 限时直降',
    subtitle: '法兰西顶级干邑，馥郁花香，丝滑绵长',
    eyebrow: '限时特惠',
    cta: '查看详情',
    link: '/category/cognac',
    bg: 'linear-gradient(135deg, #1a0505 0%, #4a0505 50%, #1a0505 100%)',
    accentColor: 'rgba(180,30,30,0.5)',
  },
  {
    id: 3,
    title: '百邑购物卡·区块链护航',
    subtitle: '零风险礼赠，链上存证，兑完即毁不留痕',
    eyebrow: '安全无忧',
    cta: '购卡查余额',
    link: '/card',
    bg: 'linear-gradient(135deg, #050520 0%, #0d1545 50%, #050520 100%)',
    accentColor: 'rgba(30,100,229,0.5)',
  },
  {
    id: 4,
    title: 'AI 直播间·品酒大师',
    subtitle: '每晚 20:00 准时开播，独家折扣实时抢购',
    eyebrow: '正在直播',
    cta: '进入直播间',
    link: '/live',
    bg: 'linear-gradient(135deg, #1a0530 0%, #35085a 50%, #1a0530 100%)',
    accentColor: 'rgba(142,36,170,0.55)',
  },
  {
    id: 5,
    title: '大闸蟹·阳澄湖时令尊享',
    subtitle: '湖区直供，鲜活配送，搭酒更享折扣',
    eyebrow: '当季限定',
    cta: '限时预订',
    link: '/category/food',
    bg: 'linear-gradient(135deg, #2a0800 0%, #5a2000 50%, #2a0800 100%)',
    accentColor: 'rgba(251,140,0,0.5)',
  },
];

export default function AdBanner({ ads }) {
  const items = ads?.length ? ads : FALLBACK_ADS;
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const trackRef = useRef(null);

  const go = useCallback((idx) => {
    setCurrent(idx);
  }, []);

  const next = useCallback(() => {
    setCurrent(prev => (prev + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    timerRef.current = setInterval(next, 4500);
    return () => clearInterval(timerRef.current);
  }, [next]);

  const ad = items[current];

  return (
    <div className={styles.wrapper}>
      {/* Slide track */}
      <div
        ref={trackRef}
        className={styles.track}
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {items.map((item, i) => (
          <div
            key={item.id}
            className={styles.slide}
          >
            <div className={styles.slideBg} style={{ background: item.bg }} />
            <div className={styles.deco1} />
            <div className={styles.deco2} />
            <div className={styles.deco3} style={{ '--accent-color': item.accentColor }} />

            {/* Ad label */}
            <div className={styles.adLabel}>广告</div>

            {/* Content */}
            <div className={styles.content}>
              <p className={styles.eyebrow}>
                <span className={styles.eyebrowDot} />
                {item.eyebrow}
              </p>
              <h2 className={styles.title}>{item.title}</h2>
              <p className={styles.subtitle}>{item.subtitle}</p>
              <div className={styles.footer}>
                  <Link href={item.link} className={styles.cta}>
                  {item.cta}
                  <svg className={styles.ctaArrow} viewBox="0 0 16 16" width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <span className={styles.counter}>{i + 1}/{items.length}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className={styles.dotsWrap}>
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
            aria-label={`切换至第${i + 1}张`}
          />
        ))}
      </div>

      {/* Bottom fade */}
      <div className={styles.bottomFade} />
    </div>
  );
}
