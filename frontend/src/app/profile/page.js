'use client';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';
import Link from 'next/link';

const MENU_ITEMS = [
  { icon: '📦', label: '我的订单', href: '#' },
  { icon: '📍', label: '收货地址', href: '#' },
  { icon: '💳', label: '购物卡余额', href: '/card' },
  { icon: '📊', label: '后台管理', href: '/admin' },
  { icon: '⚙️', label: '设置', href: '#' },
];

export default function ProfilePage() {
  return (
    <main>
      <TopBar showBack title="我的" />
      <div className="page-content" style={{ paddingTop: '52px', paddingBottom: '80px' }}>
        {/* Avatar */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(200,169,110,0.15), rgba(14,11,8,0.9))',
          padding: '32px 16px 24px',
          display: 'flex', alignItems: 'center', gap: 16,
          borderBottom: '1px solid rgba(200,169,110,0.1)'
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'var(--gradient-gold)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', boxShadow: '0 4px 16px rgba(200,169,110,0.3)'
          }}>👤</div>
          <div>
            <p style={{ color: 'var(--cream-100)', fontWeight: 700, fontSize: '1.05rem' }}>点击登录/注册</p>
            <p style={{ color: 'var(--cream-400)', fontSize: '0.78rem', marginTop: 4 }}>登录后享受更多权益</p>
          </div>
        </div>
        {/* Menu */}
        <div style={{ padding: '8px 0' }}>
          {MENU_ITEMS.map(item => (
            <Link key={item.label} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              color: 'var(--cream-200)', textDecoration: 'none',
              fontSize: '0.9rem', fontWeight: 500
            }}>
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              <span style={{ color: 'var(--cream-500)', fontSize: '1rem' }}>›</span>
            </Link>
          ))}
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
