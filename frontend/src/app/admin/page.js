'use client';
import { useState, useEffect } from 'react';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';
import { api } from '@/lib/api';
import styles from './page.module.css';

export default function AdminPage() {
  const [stats, setStats]       = useState(null);
  const [qrInput, setQrInput]   = useState('');
  const [action, setAction]     = useState('out');
  const [operator, setOperator] = useState('店员A');
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError]   = useState('');
  const [loading, setLoading]   = useState(false);

  const loadStats = () => {
    api.getInventoryStats().then(setStats).catch(() => {});
  };

  useEffect(() => {
    loadStats();
    const iv = setInterval(loadStats, 5000); // auto-refresh every 5s
    return () => clearInterval(iv);
  }, []);

  const doScan = async () => {
    if (!qrInput.trim()) return;
    setLoading(true);
    setScanResult(null);
    setScanError('');
    try {
      const res = await api.scanInventory({
        qr_code: qrInput.trim(),
        action,
        product_id: qrInput.split('-')[0]?.toLowerCase() ?? 'unknown',
        operator,
      });
      setScanResult(res.event);
      setQrInput('');
      loadStats();
    } catch (e) {
      setScanError(e.message ?? '扫码失败');
    } finally {
      setLoading(false);
    }
  };

  const totalStock = stats?.total_skus ?? 0;

  return (
    <main>
      <TopBar title="后台动销看板" showBack />
      <div className="page-content">
        <div className="container">

          {/* Stats overview */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>📦</span>
              <span className={styles.statValue}>{totalStock}</span>
              <span className={styles.statLabel}>商品SKU数</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>🟡</span>
              <span className={styles.statValue}>{stats?.low_stock_count ?? '--'}</span>
              <span className={styles.statLabel}>低库预警</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>💰</span>
              <span className={styles.statValue}>¥{stats?.today_revenue?.toLocaleString() ?? '--'}</span>
              <span className={styles.statLabel}>今日流水</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>📋</span>
              <span className={styles.statValue}>{stats?.today_sales ?? '--'}</span>
              <span className={styles.statLabel}>今日销售</span>
            </div>
          </div>

          {/* Scan station */}
          <div className={styles.scanBox}>
            <h2 className={styles.sectionTitle}>🔍 扫码出入库</h2>

            <div className={styles.actionToggle}>
              <button onClick={() => setAction('in')} className={`${styles.toggleBtn} ${action === 'in' ? styles.in : ''}`}>
                ⬆️ 入库
              </button>
              <button onClick={() => setAction('out')} className={`${styles.toggleBtn} ${action === 'out' ? styles.out : ''}`}>
                ⬇️ 出库
              </button>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>操作员</label>
              <select className={styles.select} value={operator} onChange={e => setOperator(e.target.value)}>
                <option>店员A</option><option>店员B</option><option>仓管员</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>QR 码（扫码或手动输入）</label>
              <div className={styles.scanRow}>
                <input
                  className={styles.input}
                  value={qrInput}
                  onChange={e => setQrInput(e.target.value)}
                  placeholder="MT2021530001"
                  onKeyDown={e => e.key === 'Enter' && doScan()}
                />
                <button className="btn-gold" onClick={doScan} disabled={loading}>
                  {loading ? '…' : '确认'}
                </button>
              </div>
            </div>

            {/* Demo QR buttons */}
            <div className={styles.demoQRs}>
              {['MT2021530001', 'LZXO22001', 'MC1806001'].map(q => (
                <button key={q} onClick={() => setQrInput(q)} className={styles.demoChip}>{q}</button>
              ))}
            </div>

            {scanResult && (
              <div className={styles.scanSuccess}>
                <span>✅</span>
                <div>
                  <div className={styles.scanResultId}>{scanResult.id}</div>
                  <div className={styles.scanResultDetail}>
                    {scanResult.action_label} · {scanResult.qr_code} · {scanResult.operator}
                  </div>
                  <div className={styles.scanResultTime}>{new Date(scanResult.timestamp).toLocaleTimeString()}</div>
                </div>
              </div>
            )}

            {scanError && (
              <div className={styles.scanError}>⚠️ {scanError}</div>
            )}
          </div>

          {/* Recent scan log */}
          <div className={styles.logBox}>
            <h2 className={styles.sectionTitle}>📜 最近扫码记录 <span className={styles.liveTag}>自动刷新</span></h2>
            <div className={styles.logList}>
              {(stats?.recent_scans ?? []).map((evt, i) => (
                <div key={i} className={styles.logItem}>
                  <span className={evt.action === 'IN' ? styles.logIn : styles.logOut}>
                    {evt.action === 'IN' ? '⬆️入' : '⬇️出'}
                  </span>
                  <span className={styles.logQr}>{evt.name}</span>
                  <span className={styles.logOp}>{evt.sku}</span>
                  <span className={styles.logTime}>{evt.time}</span>
                </div>
              ))}
              {!stats?.recent_scans?.length && (
                <div className={styles.logEmpty}>暂无扫码记录，请开始扫码</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
