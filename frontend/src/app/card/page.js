'use client';
import { useState } from 'react';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';
import { api } from '@/lib/api';
import styles from './page.module.css';

const DEMO_CARDS = [
  'BY-2024-001',
  'BY-DEMO-888',
  'BY-2024-002',
];

export default function CardPage() {
  const [cardId, setCardId]   = useState('');
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const query = async () => {
    if (!cardId.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await api.getCardBalance(cardId.trim());
      setResult(data);
    } catch {
      setError('卡号不存在或查询失败，请检查后重试');
    } finally {
      setLoading(false);
    }
  };

  const STATUS_MAP = {
    active:   { label: '✅ 有效', color: '#27AE60' },
    redeemed: { label: '🔒 已全额兑换', color: '#E67E22' },
    burned:   { label: '🔥 已销毁', color: '#E74C3C' },
  };

  return (
    <main>
      <TopBar title="区块链购物卡" showBack />
      <div className="page-content">
        <div className="container">

          {/* Intro */}
          <div className={styles.introCard}>
            <div className={styles.chainIcon}>⛓️</div>
            <h2 className={styles.introTitle}>百邑 · 区块链购物卡</h2>
            <p className={styles.introDesc}>
              去中心化 · 不记名 · 安全防伪<br />
              兑完即毁，链上可查兑换门店
            </p>
            <div className={styles.features}>
              {[
                { icon: '🔐', text: '区块链加持' },
                { icon: '🫥', text: '完全匿名' },
                { icon: '💰', text: '余额可查' },
                { icon: '🔥', text: '兑完即毁' },
              ].map(f => (
                <div key={f.text} className={styles.feature}>
                  <span>{f.icon}</span>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Query */}
          <div className={styles.queryBox}>
            <label className={styles.queryLabel}>输入卡号查询余额</label>
            <div className={styles.inputRow}>
              <input
                className={styles.input}
                value={cardId}
                onChange={e => setCardId(e.target.value)}
                placeholder="BAIY-YYYY-XXXXXX"
                onKeyDown={e => e.key === 'Enter' && query()}
              />
              <button className="btn-gold" onClick={query} disabled={loading}>
                {loading ? '查询中…' : '查询'}
              </button>
            </div>

            {/* Demo pill */}
            <div className={styles.demos}>
              <span className={styles.demoLabel}>快速演示：</span>
              {DEMO_CARDS.map(c => (
                <button key={c} onClick={() => { setCardId(c); }} className={styles.demoChip}>
                  {c.slice(-6)}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && <div className={styles.errorMsg}>{error}</div>}

          {/* Result */}
          {result && (
            <div className={styles.resultCard}>
              <div className={styles.cardFace}>
                <div className={styles.cardTop}>
                  <span className={styles.cardBrand}>百邑酒世界</span>
                  <span style={{ fontSize: '0.75rem', color: STATUS_MAP[result.status]?.color }}>
                    {STATUS_MAP[result.status]?.label ?? result.status}
                  </span>
                </div>
                <div className={styles.cardBalance}>
                  <span className={styles.balanceLabel}>可用余额</span>
                  <span className={styles.balanceValue}>¥{result.balance?.toLocaleString()}</span>
                </div>
                <div className={styles.cardBottom}>
                  <span>{cardId}</span>
                  <span>到期 {result.expire}</span>
                </div>
                <div className={styles.cardChip}>💳</div>
              </div>

              {/* Detail */}
              <div className={styles.detail}>
                <div className={styles.detailRow}>
                  <span>面值</span>
                  <span>¥{result.face_value?.toLocaleString()}</span>
                </div>
                <div className={styles.detailRow}>
                  <span>状态</span>
                  <span style={{ color: STATUS_MAP[result.status]?.color }}>{STATUS_MAP[result.status]?.label}</span>
                </div>
                {result.tx_hash && (
                  <div className={styles.detailRow}>
                    <span>链上哈希</span>
                    <span className={styles.hash}>{result.tx_hash?.slice(0, 20)}…</span>
                  </div>
                )}
                {result.redeem_store && (
                  <div className={styles.detailRow}>
                    <span>兑换门店</span>
                    <span>{result.redeem_store}</span>
                  </div>
                )}
              </div>

              {/* Transactions */}
              {result.transactions?.length > 0 && (
                <div className={styles.txSection}>
                  <h3 className={styles.txTitle}>消费记录</h3>
                  {result.transactions.map((tx, i) => (
                    <div key={i} className={styles.txRow}>
                      <div>
                        <div className={styles.txItem}>{tx.item}</div>
                        <div className={styles.txStore}>{tx.store}</div>
                        <div className={styles.txDate}>{tx.date}</div>
                      </div>
                      <div className={styles.txAmount} style={{ color: tx.amount < 0 ? '#E74C3C' : '#27AE60' }}>
                        {tx.amount < 0 ? '' : '+'}{tx.amount}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
