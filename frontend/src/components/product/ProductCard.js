'use client';
import Link from 'next/link';
import styles from './ProductCard.module.css';

export default function ProductCard({ product, compact = false }) {
  if (!product) return null;

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;

  const soldPct = product.sold_count && product.stock
    ? Math.min(100, Math.round((product.sold_count / (product.sold_count + product.stock)) * 100))
    : 0;

  const rating = Math.floor(product.rating ?? 4);

  return (
    <Link href={`/product/${product.id}`} className={`${styles.card} ${compact ? styles.compact : ''}`}>
      {/* ── Image Area ── */}
      <div className={styles.imageWrap}>
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.name}
            className={styles.productImg}
            onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
          />
        ) : null}
        <div className={styles.imagePlaceholder} style={product.thumbnail ? {display:'none'} : {}}>
          <span className={styles.categoryIcon}>
            {getCategoryIcon(product.category)}
          </span>
        </div>

        {/* Badge */}
        <div className={styles.badgeTop}>
          {product.is_hot && (
            <span className="badge badge-hot">🔥 热销</span>
          )}
          {product.is_new && !product.is_hot && (
            <span className="badge badge-new">✨ 新品</span>
          )}
        </div>

        {/* Discount tag */}
        {discount > 0 && (
          <span className={styles.discountTag}>省{discount}%</span>
        )}
      </div>

      {/* ── Info Area ── */}
      <div className={styles.info}>
        <h3 className={styles.name}>{product.name}</h3>

        {/* Meta tags */}
        {(product.year > 0 || product.degree > 0 || product.brand) && (
          <div className={styles.meta}>
            {product.year > 0 && <span className={styles.tag}>{product.year}年</span>}
            {product.degree > 0 && <span className={styles.tag}>{product.degree}°</span>}
            {product.brand && <span className={styles.tag}>{product.brand}</span>}
          </div>
        )}

        {/* Tasting notes */}
        {product.tasting_notes && !compact && (
          <p className={styles.notes}>{product.tasting_notes}</p>
        )}

        {/* Rating */}
        <div className={styles.ratingRow}>
          <div className={styles.stars}>
            {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
          </div>
          <span className={styles.reviewCount}>
            {product.reviews?.toLocaleString() ?? 0}评
          </span>
        </div>

        {/* Price row */}
        <div className={styles.priceRow}>
          <span>
            <span className={styles.priceUnit}>¥</span>
            <span className={styles.priceAmount}>
              {product.price?.toLocaleString()}
            </span>
          </span>
          {discount > 0 && (
            <span className={styles.priceOriginal}>
              ¥{product.original_price?.toLocaleString()}
            </span>
          )}
          <button
            className={styles.addBtn}
            aria-label="加入购物车"
            onClick={(e) => { e.preventDefault(); }}
          >
            +
          </button>
        </div>

        {/* Sold progress bar (only if data exists) */}
        {soldPct > 0 && !compact && (
          <div className={styles.soldRow}>
            <div className={styles.soldBar}>
              <div className={styles.soldFill} style={{ width: `${soldPct}%` }} />
            </div>
            <span className={styles.soldText}>已售{soldPct}%</span>
          </div>
        )}
      </div>
    </Link>
  );
}

function getCategoryIcon(category) {
  const map = {
    maotai:         '🏺',
    'baijiu-sauce': '🍶',
    'baijiu-strong':'🫙',
    cognac:         '🍾',
    whisky:         '🥃',
    'red-wine':     '🍷',
    vodka:          '🥂',
    'health-wine':  '💚',
    sake:           '🫙',
    cocktail:       '🍹',
    liqueur:        '🫗',
    'beer-import':  '🍺',
    'beer-domestic':'🍻',
    tea:            '🫖',
    cigar:          '🚬',
    gift:           '🎁',
    food:           '🥩',
    flower:         '🌹',
  };
  return map[category] ?? '🍶';
}
