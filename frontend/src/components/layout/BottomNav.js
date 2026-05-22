'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './BottomNav.module.css';

const NAV_ITEMS = [
  { href: '/',       icon: '🏠', label: '首页' },
  { href: '/stores', icon: '📍', label: '门店' },
  // Center slot = live (rendered separately)
  { href: '/cart',    icon: '🛒', label: '购物车' },
  { href: '/profile', icon: '👤', label: '我的' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      {/* Left 2 items */}
      {NAV_ITEMS.slice(0, 2).map((item) => {
        const active = pathname === item.href;
        return (
          <Link key={item.href} href={item.href} className={`${styles.item} ${active ? styles.active : ''}`}>
            {active && <span className={styles.activeBar} />}
            <div className={styles.iconWrap}>
              <span className={styles.icon}>{item.icon}</span>
            </div>
            <span className={styles.label}>{item.label}</span>
          </Link>
        );
      })}

      {/* Center LIVE button */}
      <Link href="/live" className={styles.centerItem}>
        <div className={styles.centerBtn}>🔴</div>
        <span className={styles.centerLabel}>直播</span>
      </Link>

      {/* Right 2 items */}
      {NAV_ITEMS.slice(2).map((item) => {
        const active = pathname === item.href;
        return (
          <Link key={item.href} href={item.href} className={`${styles.item} ${active ? styles.active : ''}`}>
            {active && <span className={styles.activeBar} />}
            <div className={styles.iconWrap}>
              <span className={styles.icon}>{item.icon}</span>
            </div>
            <span className={styles.label}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
