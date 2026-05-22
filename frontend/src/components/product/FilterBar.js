'use client';
import { useState, useCallback } from 'react';
import styles from './FilterBar.module.css';

const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
const DEGREES = [
  { label: '低度 ≤38°', min: 0,  max: 38 },
  { label: '40-43°',    min: 40, max: 43 },
  { label: '53°',       min: 53, max: 53 },
  { label: '61°+',      min: 61, max: 99 },
];
const PRICES = [
  { label: '￥200以下',  min: 0,    max: 199 },
  { label: '￥200-500',  min: 200,  max: 500 },
  { label: '￥500-1500', min: 500,  max: 1500 },
  { label: '￥1500以上', min: 1500, max: 999999 },
];
const SORTS = [
  { value: '',           label: '综合' },
  { value: 'price_asc',  label: '价格↑' },
  { value: 'price_desc', label: '价格↓' },
  { value: 'rating',     label: '评分' },
];

export default function FilterBar({ onFilterChange, category }) {
  const [selectedYear,   setSelectedYear]   = useState(null);
  const [selectedDegree, setSelectedDegree] = useState(null);
  const [selectedPrice,  setSelectedPrice]  = useState(null);
  const [sortBy,         setSortBy]         = useState('');

  // 统一派发过滤器，接收最新值避免闭包陈旧问题
  const dispatch = useCallback((year, degree, price, sort) => {
    const degreeObj = DEGREES.find(d => d.label === degree);
    const priceObj  = PRICES.find(p => p.label === price);

    const filters = {};
    if (year !== null)  { filters.year_min = year;  filters.year_max = year; }
    if (degreeObj)      { filters.degree_min = degreeObj.min; filters.degree_max = degreeObj.max; }
    if (priceObj)       { filters.price_min = priceObj.min;   filters.price_max  = priceObj.max; }
    if (sort)             filters.sort = sort;

    onFilterChange?.(filters);
  }, [onFilterChange]);

  const toggleYear = (y) => {
    const next = selectedYear === y ? null : y;
    setSelectedYear(next);
    dispatch(next, selectedDegree, selectedPrice, sortBy);
  };

  const toggleDegree = (d) => {
    const next = selectedDegree === d ? null : d;
    setSelectedDegree(next);
    dispatch(selectedYear, next, selectedPrice, sortBy);
  };

  const togglePrice = (p) => {
    const next = selectedPrice === p ? null : p;
    setSelectedPrice(next);
    dispatch(selectedYear, selectedDegree, next, sortBy);
  };

  const changeSort = (s) => {
    setSortBy(s);
    dispatch(selectedYear, selectedDegree, selectedPrice, s);
  };

  const reset = () => {
    setSelectedYear(null);
    setSelectedDegree(null);
    setSelectedPrice(null);
    setSortBy('');
    onFilterChange?.({});
  };

  const hasFilter = selectedYear || selectedDegree || selectedPrice || sortBy;
  const showYearDegree = !category || ['maotai','baijiu-sauce','baijiu-strong','whisky','cognac','red-wine','sake','vodka'].includes(category);

  return (
    <div className={styles.wrapper}>
      {/* 排序行 */}
      <div className={styles.scrollRow}>
        {SORTS.map(s => (
          <button
            key={s.value}
            onClick={() => changeSort(s.value)}
            className={`${styles.chip} ${sortBy === s.value ? styles.active : ''}`}
          >
            {s.label}
          </button>
        ))}
        {hasFilter && (
          <button onClick={reset} className={`${styles.chip} ${styles.reset}`}>
            ✕ 重置
          </button>
        )}
      </div>

      {/* 年份筛选 */}
      {showYearDegree && (
        <div className={styles.filterGroup}>
          <span className={styles.label}>年份</span>
          <div className={styles.scrollRow}>
            {YEARS.map(y => (
              <button
                key={y}
                onClick={() => toggleYear(y)}
                className={`${styles.chip} ${selectedYear === y ? styles.active : ''}`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 度数筛选 */}
      {showYearDegree && (
        <div className={styles.filterGroup}>
          <span className={styles.label}>度数</span>
          <div className={styles.scrollRow}>
            {DEGREES.map(d => (
              <button
                key={d.label}
                onClick={() => toggleDegree(d.label)}
                className={`${styles.chip} ${selectedDegree === d.label ? styles.active : ''}`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 价格筛选 */}
      <div className={styles.filterGroup}>
        <span className={styles.label}>价格</span>
        <div className={styles.scrollRow}>
          {PRICES.map(p => (
            <button
              key={p.label}
              onClick={() => togglePrice(p.label)}
              className={`${styles.chip} ${selectedPrice === p.label ? styles.active : ''}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
