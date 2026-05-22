'use client';
import Link from 'next/link';
import styles from './CategoryCarousel.module.css';

/* ── 20 categories: 4 rows × 5 items ── */
const CATEGORIES = [
  // Row 1 · 国产白酒
  { id: 'maotai',       name: '茅台',    slug: 'maotai',       color: '#C8102E', hot: true,
    svg: (
      <svg viewBox="0 0 36 52" width="28" height="40" xmlns="http://www.w3.org/2000/svg">
        <rect x="13" y="0" width="10" height="6" rx="2" fill="#C8102E"/>
        <rect x="14" y="6" width="8" height="8" rx="1" fill="#B00020"/>
        <path d="M11,14 Q9,18 9,22 L27,22 Q27,18 25,14 Z" fill="#C8102E"/>
        <rect x="9" y="22" width="18" height="20" rx="3" fill="#C8102E"/>
        <rect x="11" y="25" width="14" height="10" rx="2" fill="rgba(255,220,100,0.25)"/>
        <text x="18" y="32" textAnchor="middle" fontSize="5" fill="#FFD700" fontFamily="sans-serif" fontWeight="bold">茅台</text>
        <rect x="10" y="40" width="16" height="4" rx="2" fill="#8B0000"/>
        <rect x="11" y="18" width="3" height="18" rx="1.5" fill="rgba(255,255,255,0.18)"/>
      </svg>
    )},
  { id: 'jiangxiang',   name: '酱香酒',  slug: 'jiangxiang',   color: '#D4784A',
    svg: (
      <svg viewBox="0 0 36 52" width="28" height="40" xmlns="http://www.w3.org/2000/svg">
        <rect x="14" y="0" width="8" height="5" rx="2" fill="#D4784A"/>
        <rect x="15" y="5" width="6" height="9" rx="1" fill="#C0623A"/>
        <path d="M12,14 Q10,18 10,22 L26,22 Q26,18 24,14 Z" fill="#D4784A"/>
        <rect x="10" y="22" width="16" height="20" rx="3" fill="#D4784A"/>
        <rect x="12" y="25" width="12" height="9" rx="2" fill="rgba(255,255,255,0.2)"/>
        <rect x="11" y="40" width="14" height="4" rx="2" fill="#A0522D"/>
        <rect x="12" y="18" width="3" height="18" rx="1.5" fill="rgba(255,255,255,0.15)"/>
      </svg>
    )},
  { id: 'nongxiang',    name: '浓香型',  slug: 'nongxiang',    color: '#E8A030',
    svg: (
      <svg viewBox="0 0 36 52" width="28" height="40" xmlns="http://www.w3.org/2000/svg">
        <rect x="15" y="0" width="6" height="5" rx="2" fill="#F5C542"/>
        <rect x="15.5" y="5" width="5" height="10" rx="1" fill="#E8A030"/>
        <path d="M13,15 Q11,18 11,22 L25,22 Q25,18 23,15 Z" fill="#E8A030"/>
        <rect x="11" y="22" width="14" height="22" rx="3" fill="#E8A030"/>
        <rect x="13" y="25" width="10" height="9" rx="2" fill="rgba(255,255,255,0.25)"/>
        <rect x="12" y="42" width="12" height="3" rx="1.5" fill="#B8780A"/>
        <rect x="13" y="19" width="2.5" height="19" rx="1.25" fill="rgba(255,255,255,0.18)"/>
      </svg>
    )},
  { id: 'qingxiang',    name: '清香型',  slug: 'qingxiang',    color: '#4DB6AC',
    svg: (
      <svg viewBox="0 0 36 52" width="28" height="40" xmlns="http://www.w3.org/2000/svg">
        <rect x="15" y="0" width="6" height="5" rx="2" fill="#80CBC4"/>
        <rect x="15.5" y="5" width="5" height="10" rx="1" fill="#4DB6AC"/>
        <path d="M12,15 Q10,19 10,23 L26,23 Q26,19 24,15 Z" fill="#4DB6AC" opacity="0.85"/>
        <rect x="10" y="23" width="16" height="20" rx="3" fill="#4DB6AC" opacity="0.8"/>
        <rect x="12" y="26" width="12" height="9" rx="2" fill="rgba(255,255,255,0.3)"/>
        <rect x="11" y="41" width="14" height="3" rx="1.5" fill="#00796B"/>
        <rect x="12" y="19" width="3" height="18" rx="1.5" fill="rgba(255,255,255,0.25)"/>
      </svg>
    )},
  { id: 'other-baijiu', name: '其它白酒', slug: 'other-baijiu', color: '#90A4AE',
    svg: (
      <svg viewBox="0 0 36 52" width="28" height="40" xmlns="http://www.w3.org/2000/svg">
        <rect x="14" y="0" width="8" height="5" rx="2" fill="#B0BEC5"/>
        <rect x="15" y="5" width="6" height="9" rx="1" fill="#90A4AE"/>
        <path d="M12,14 Q10,18 10,22 L26,22 Q26,18 24,14 Z" fill="#90A4AE"/>
        <rect x="10" y="22" width="16" height="20" rx="3" fill="#90A4AE"/>
        <rect x="12" y="25" width="12" height="9" rx="2" fill="rgba(255,255,255,0.3)"/>
        <rect x="11" y="40" width="14" height="4" rx="2" fill="#607D8B"/>
        <rect x="12" y="19" width="3" height="17" rx="1.5" fill="rgba(255,255,255,0.2)"/>
      </svg>
    )},

  // Row 2 · 洋酒
  { id: 'whisky',       name: '威士忌',  slug: 'whisky',       color: '#8B4513', hot: true,
    svg: (
      <svg viewBox="0 0 40 48" width="32" height="38" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="0" width="20" height="5" rx="2" fill="#A0522D"/>
        <path d="M8,5 Q6,12 6,20 L34,20 Q34,12 32,5 Z" fill="#8B4513"/>
        <rect x="6" y="20" width="28" height="20" rx="4" fill="#8B4513"/>
        <rect x="9" y="23" width="22" height="12" rx="3" fill="rgba(255,220,100,0.2)"/>
        <text x="20" y="31" textAnchor="middle" fontSize="5" fill="#FFD700" fontFamily="sans-serif">威士忌</text>
        <rect x="7" y="38" width="26" height="4" rx="2" fill="#5D2E0C"/>
        <rect x="8" y="15" width="4" height="20" rx="2" fill="rgba(255,255,255,0.12)"/>
      </svg>
    )},
  { id: 'brandy',       name: '白兰地',  slug: 'brandy',       color: '#9C2935',
    svg: (
      <svg viewBox="0 0 40 52" width="32" height="42" xmlns="http://www.w3.org/2000/svg">
        <rect x="16" y="0" width="8" height="5" rx="2" fill="#C62828"/>
        <rect x="17" y="5" width="6" height="8" rx="1" fill="#9C2935"/>
        <path d="M10,13 Q6,20 6,28 L34,28 Q34,20 30,13 Z" fill="#9C2935"/>
        <rect x="6" y="28" width="28" height="16" rx="4" fill="#9C2935"/>
        <rect x="9" y="30" width="22" height="10" rx="2" fill="rgba(255,200,120,0.22)"/>
        <rect x="7" y="42" width="26" height="4" rx="2" fill="#6A1520"/>
        <rect x="8" y="20" width="4" height="20" rx="2" fill="rgba(255,255,255,0.12)"/>
      </svg>
    )},
  { id: 'vodka',        name: '伏特加',  slug: 'vodka',        color: '#5C6BC0',
    svg: (
      <svg viewBox="0 0 36 54" width="28" height="44" xmlns="http://www.w3.org/2000/svg">
        <rect x="15" y="0" width="6" height="5" rx="2" fill="#9FA8DA"/>
        <rect x="15.5" y="5" width="5" height="10" rx="1" fill="#7986CB"/>
        <path d="M13,15 Q11,19 11,23 L25,23 Q25,19 23,15 Z" fill="#5C6BC0" opacity="0.7"/>
        <rect x="11" y="23" width="14" height="22" rx="3" fill="#5C6BC0" opacity="0.65"/>
        <rect x="13" y="26" width="10" height="10" rx="2" fill="rgba(255,255,255,0.35)"/>
        <rect x="12" y="43" width="12" height="4" rx="2" fill="#3949AB"/>
        <rect x="13" y="20" width="3" height="20" rx="1.5" fill="rgba(255,255,255,0.3)"/>
      </svg>
    )},
  { id: 'health-wine',  name: '保健酒',  slug: 'health-wine',  color: '#388E3C',
    svg: (
      <svg viewBox="0 0 36 50" width="28" height="40" xmlns="http://www.w3.org/2000/svg">
        <rect x="14" y="0" width="8" height="5" rx="2" fill="#66BB6A"/>
        <rect x="15" y="5" width="6" height="8" rx="1" fill="#43A047"/>
        <rect x="11" y="13" width="14" height="28" rx="4" fill="#388E3C"/>
        <rect x="13" y="17" width="10" height="14" rx="2" fill="rgba(255,255,255,0.2)"/>
        <text x="18" y="26" textAnchor="middle" fontSize="7" fill="#A5D6A7">🌿</text>
        <rect x="12" y="39" width="12" height="4" rx="2" fill="#1B5E20"/>
        <rect x="13" y="14" width="3" height="20" rx="1.5" fill="rgba(255,255,255,0.2)"/>
      </svg>
    )},
  { id: 'huangjiu',     name: '黄酒',    slug: 'huangjiu',     color: '#F9A825',
    svg: (
      <svg viewBox="0 0 40 48" width="32" height="38" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="20" cy="10" rx="10" ry="6" fill="#F9A825"/>
        <path d="M10,10 Q8,20 8,30 L32,30 Q32,20 30,10 Z" fill="#F9A825"/>
        <rect x="8" y="30" width="24" height="12" rx="3" fill="#EF8C00"/>
        <rect x="11" y="13" width="5" height="22" rx="2.5" fill="rgba(255,255,255,0.18)"/>
        <rect x="9" y="40" width="22" height="3" rx="1.5" fill="#B36B00"/>
        <ellipse cx="20" cy="10" rx="8" ry="4" fill="#FFD54F" opacity="0.5"/>
      </svg>
    )},

  // Row 3 · 其他酒类
  { id: 'beer',         name: '啤酒',    slug: 'beer',         color: '#F57F17',
    svg: (
      <svg viewBox="0 0 40 50" width="32" height="40" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="12" width="24" height="30" rx="5" fill="#F57F17"/>
        <rect x="8" y="8" width="24" height="8" rx="4" fill="white" opacity="0.85"/>
        <rect x="32" y="18" width="6" height="12" rx="3" fill="#E65100"/>
        <rect x="10" y="16" width="20" height="18" rx="3" fill="rgba(255,220,50,0.25)"/>
        <rect x="10" y="40" width="20" height="4" rx="2" fill="#BF360C"/>
        <rect x="11" y="18" width="4" height="16" rx="2" fill="rgba(255,255,255,0.2)"/>
      </svg>
    )},
  { id: 'cocktail',     name: '鸡尾酒',  slug: 'cocktail',     color: '#E91E8C',
    svg: (
      <svg viewBox="0 0 40 50" width="32" height="40" xmlns="http://www.w3.org/2000/svg">
        <path d="M8,4 L32,4 L22,28 L18,28 Z" fill="#E91E8C" opacity="0.9"/>
        <rect x="18" y="28" width="4" height="12" rx="2" fill="#C2185B"/>
        <rect x="12" y="40" width="16" height="4" rx="2" fill="#880E4F"/>
        <circle cx="28" cy="8" r="5" fill="#FF4081" opacity="0.8"/>
        <rect x="26" y="3" width="2" height="12" rx="1" fill="#FF80AB"/>
        <path d="M10,4 L30,4 L22,22 L18,22 Z" fill="rgba(255,255,255,0.15)"/>
      </svg>
    )},
  { id: 'sake',         name: '清酒',    slug: 'sake',         color: '#C8AD7F',
    svg: (
      <svg viewBox="0 0 36 52" width="28" height="42" xmlns="http://www.w3.org/2000/svg">
        <rect x="14" y="0" width="8" height="5" rx="2" fill="#D7C49E"/>
        <rect x="15" y="5" width="6" height="9" rx="1" fill="#C8AD7F"/>
        <path d="M12,14 Q10,18 10,22 L26,22 Q26,18 24,14 Z" fill="#C8AD7F"/>
        <rect x="10" y="22" width="16" height="20" rx="3" fill="#C8AD7F"/>
        <rect x="12" y="25" width="12" height="9" rx="2" fill="rgba(255,255,255,0.35)"/>
        <text x="18" y="33" textAnchor="middle" fontSize="5" fill="#7B5E3A" fontFamily="sans-serif">清酒</text>
        <rect x="11" y="40" width="14" height="4" rx="2" fill="#8B6914"/>
        <rect x="12" y="19" width="3" height="17" rx="1.5" fill="rgba(255,255,255,0.3)"/>
      </svg>
    )},
  { id: 'red-wine',     name: '红酒',    slug: 'red-wine',     color: '#8B0000',
    svg: (
      <svg viewBox="0 0 36 54" width="28" height="44" xmlns="http://www.w3.org/2000/svg">
        <rect x="16" y="0" width="4" height="6" rx="2" fill="#C62828"/>
        <rect x="15.5" y="6" width="5" height="12" rx="1" fill="#8B0000"/>
        <path d="M12,18 Q10,24 10,30 L26,30 Q26,24 24,18 Z" fill="#8B0000"/>
        <rect x="10" y="30" width="16" height="16" rx="4" fill="#8B0000"/>
        <rect x="12" y="33" width="12" height="8" rx="2" fill="rgba(255,150,150,0.2)"/>
        <rect x="11" y="44" width="14" height="4" rx="2" fill="#4A0000"/>
        <rect x="12" y="22" width="3" height="20" rx="1.5" fill="rgba(255,255,255,0.1)"/>
      </svg>
    )},
  { id: 'fruit-wine',   name: '果酒',    slug: 'fruit-wine',   color: '#AD1457',
    svg: (
      <svg viewBox="0 0 40 50" width="32" height="40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="10" r="8" fill="#E91E8C" opacity="0.85"/>
        <circle cx="28" cy="10" r="5" fill="#F06292" opacity="0.6"/>
        <rect x="27" y="2" width="2" height="5" rx="1" fill="#388E3C"/>
        <rect x="13" y="2" width="5" height="5" rx="2" fill="#F48FB1"/>
        <rect x="14" y="7" width="3" height="9" rx="1" fill="#AD1457"/>
        <path d="M11,16 Q9,20 9,24 L23,24 Q23,20 21,16 Z" fill="#AD1457"/>
        <rect x="9" y="24" width="14" height="18" rx="3" fill="#AD1457"/>
        <rect x="10" y="40" width="12" height="4" rx="2" fill="#6A0F35"/>
        <rect x="10" y="20" width="3" height="16" rx="1.5" fill="rgba(255,255,255,0.18)"/>
      </svg>
    )},

  // Row 4 · 礼品食品
  { id: 'supplement',   name: '补品',    slug: 'supplement',   color: '#00897B',
    svg: (
      <svg viewBox="0 0 36 46" width="28" height="36" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="0" width="16" height="8" rx="3" fill="#4DB6AC"/>
        <rect x="9" y="8" width="18" height="30" rx="4" fill="#00897B"/>
        <rect x="11" y="12" width="14" height="16" rx="3" fill="rgba(255,255,255,0.22)"/>
        <text x="18" y="23" textAnchor="middle" fontSize="8" fill="#B2DFDB" fontFamily="sans-serif">补</text>
        <rect x="10" y="36" width="16" height="4" rx="2" fill="#00574B"/>
        <rect x="11" y="10" width="3" height="22" rx="1.5" fill="rgba(255,255,255,0.2)"/>
      </svg>
    )},
  { id: 'gift',         name: '手信',    slug: 'gift',         color: '#D81B60',
    svg: (
      <svg viewBox="0 0 40 44" width="32" height="36" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="14" width="28" height="6" rx="3" fill="#F06292"/>
        <rect x="8" y="20" width="24" height="20" rx="3" fill="#D81B60"/>
        <rect x="8" y="20" width="24" height="8" rx="0" fill="#E91E8C"/>
        <rect x="18" y="14" width="4" height="26" fill="#FF80AB"/>
        <ellipse cx="15" cy="14" rx="6" ry="4" fill="none" stroke="#FF80AB" strokeWidth="2" transform="rotate(-20,15,14)"/>
        <ellipse cx="25" cy="14" rx="6" ry="4" fill="none" stroke="#FF80AB" strokeWidth="2" transform="rotate(20,25,14)"/>
        <rect x="9" y="30" width="22" height="2" rx="1" fill="rgba(255,255,255,0.2)"/>
      </svg>
    )},
  { id: 'snack',        name: '零食',    slug: 'snack',        color: '#FB8C00',
    svg: (
      <svg viewBox="0 0 38 50" width="30" height="40" xmlns="http://www.w3.org/2000/svg">
        <path d="M10,8 Q9,4 19,4 Q29,4 28,8 L30,38 Q30,42 19,42 Q8,42 8,38 Z" fill="#FB8C00"/>
        <path d="M10,8 Q9,4 19,4 Q29,4 28,8 L14,8 Z" fill="#FFA726"/>
        <rect x="9" y="14" width="20" height="2" rx="1" fill="rgba(255,255,255,0.3)"/>
        <rect x="9" y="20" width="20" height="2" rx="1" fill="rgba(255,255,255,0.2)"/>
        <rect x="9" y="26" width="20" height="2" rx="1" fill="rgba(255,255,255,0.15)"/>
        <text x="19" y="36" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.7)" fontFamily="sans-serif">零食</text>
      </svg>
    )},
  { id: 'drinks',       name: '饮品',    slug: 'drinks',       color: '#039BE5',
    svg: (
      <svg viewBox="0 0 36 50" width="28" height="40" xmlns="http://www.w3.org/2000/svg">
        <path d="M10,10 L14,42 L22,42 L26,10 Z" fill="#039BE5"/>
        <rect x="10" y="7" width="16" height="6" rx="3" fill="#29B6F6"/>
        <rect x="21" y="4" width="2" height="12" rx="1" fill="#E91E8C"/>
        <rect x="12" y="16" width="10" height="6" rx="2" fill="rgba(255,255,255,0.25)"/>
        <rect x="14" y="42" width="8" height="4" rx="2" fill="#01579B"/>
        <rect x="12" y="14" width="2.5" height="20" rx="1.25" fill="rgba(255,255,255,0.2)"/>
      </svg>
    )},
  { id: 'poker',        name: '扑克',    slug: 'poker',        color: '#E53935',
    svg: (
      <svg viewBox="0 0 40 50" width="32" height="40" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="4" width="28" height="38" rx="5" fill="white"/>
        <rect x="6" y="4" width="28" height="38" rx="5" fill="none" stroke="#E53935" strokeWidth="1.5"/>
        <text x="13" y="16" fontSize="10" fill="#E53935" fontFamily="serif" fontWeight="bold">A</text>
        <text x="20" y="30" textAnchor="middle" fontSize="14" fill="#E53935" fontFamily="serif">♠</text>
        <text x="27" y="40" fontSize="10" fill="#E53935" fontFamily="serif" fontWeight="bold" transform="rotate(180,27,37)">A</text>
      </svg>
    )},
];

// Group into rows of 5
const ROWS = [];
for (let i = 0; i < CATEGORIES.length; i += 5) {
  ROWS.push(CATEGORIES.slice(i, i + 5));
}

export default function CategoryCarousel({ categories: _unused }) {
  return (
    <section className={styles.section}>
      {ROWS.map((row, ri) => (
        <div key={ri} className={`${styles.row} ${ri < ROWS.length - 1 ? styles.rowDivider : ''}`}>
          {row.map((cat) => (
            <Link key={cat.id} href={`/category/${cat.slug}`} className={styles.item}>
              <div
                className={styles.iconWrap}
                style={{ '--cat-color': cat.color ?? '#C8A96E' }}
              >
                {cat.svg}
                {cat.hot && <span className={styles.hotBadge}>热</span>}
              </div>
              <span className={styles.name}>{cat.name}</span>
            </Link>
          ))}
        </div>
      ))}
    </section>
  );
}
