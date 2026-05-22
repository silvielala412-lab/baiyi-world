'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';
import ProductCard from '@/components/product/ProductCard';
import { api } from '@/lib/api';
import styles from './page.module.css';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef(null);

  // 热门搜索标签
  const HOT_TAGS = ['茅台', '威士忌', '拉菲', '雪茄', '干邑', '麦卡伦', '低度', '礼盒'];

  useEffect(() => {
    inputRef.current?.focus();
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      doSearch(q);
    }
  }, []);

  const doSearch = async (q) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await api.getProducts({ q: q.trim(), limit: 30 });
      setResults(res.items ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    doSearch(query.trim());
  };

  const handleTag = (tag) => {
    setQuery(tag);
    router.push(`/search?q=${encodeURIComponent(tag)}`);
    doSearch(tag);
  };

  return (
    <main>
      <TopBar showBack title="搜索" />
      <div className="page-content" style={{ paddingTop: 56 }}>

        {/* 搜索框 */}
        <form onSubmit={handleSubmit} className={styles.searchForm}>
          <div className={styles.searchInputWrap}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="搜索酒款、品牌、年份…"
              className={styles.searchInput}
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={() => { setQuery(''); setResults([]); setSearched(false); }}
              >
                ✕
              </button>
            )}
          </div>
          <button type="submit" className={styles.searchBtn}>搜索</button>
        </form>

        {/* 热门搜索 */}
        {!searched && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>🔥 热门搜索</h3>
            <div className={styles.tagWrap}>
              {HOT_TAGS.map(t => (
                <button key={t} onClick={() => handleTag(t)} className={styles.hotTag}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 搜索结果 */}
        {searched && (
          <div className={styles.section}>
            {loading ? (
              <div className={styles.grid}>
                {[1,2,3,4].map(i => (
                  <div key={i} className="skeleton" style={{ height: 260, borderRadius: 18 }} />
                ))}
              </div>
            ) : results.length === 0 ? (
              <div className={styles.empty}>
                <span>🍾</span>
                <p>没有找到「{query}」相关商品</p>
                <small>试试其他关键词，例如品牌名或年份</small>
              </div>
            ) : (
              <>
                <p className={styles.resultMeta}>找到 <b>{results.length}</b> 款商品</p>
                <div className={styles.grid}>
                  {results.map((p, i) => (
                    <div key={p.id} style={{ animationDelay: `${i * 0.05}s` }}>
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{paddingTop:100,textAlign:'center',color:'#888'}}>加载中…</div>}>
      <SearchContent />
    </Suspense>
  );
}
