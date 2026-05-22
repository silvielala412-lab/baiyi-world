'use client';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';

export default function CartPage() {
  return (
    <main>
      <TopBar showBack title="购物车" />
      <div className="page-content" style={{ paddingTop: '52px', padding: '72px 16px 80px', textAlign: 'center', color: 'var(--cream-400)' }}>
        <div style={{ fontSize: '4rem', marginTop: 60 }}>🛒</div>
        <p style={{ marginTop: 12, fontSize: '1rem', fontWeight: 600 }}>购物车</p>
        <p style={{ marginTop: 6, fontSize: '0.85rem', opacity: 0.6 }}>暂无商品，去选购吧</p>
      </div>
      <BottomNav />
    </main>
  );
}
