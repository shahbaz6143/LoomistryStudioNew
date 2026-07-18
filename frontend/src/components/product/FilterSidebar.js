'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import styles from './FilterSidebar.module.css';

const CATEGORIES = [
  { slug: 'hand-knotted', name: 'Hand Knotted' },
  { slug: 'hand-tufted', name: 'Hand Tufted' },
  { slug: 'flatweave', name: 'Flatweave' },
  { slug: 'persian', name: 'Persian' },
  { slug: 'abstract', name: 'Abstract' },
  { slug: 'traditional', name: 'Traditional' },
  { slug: 'modern', name: 'Modern' },
];

const COLORS = ['Red', 'Blue', 'Grey', 'Ivory', 'Green', 'Gold', 'Black', 'Multicolor'];

const MATERIALS = ['Wool', 'Silk', 'Cotton', 'Jute', 'Wool & Viscose', 'Silk & Wool'];

const SHAPES = [
  { slug: 'rectangle', name: 'Rectangle' },
  { slug: 'round', name: 'Round' },
  { slug: 'runner', name: 'Runner' },
  { slug: 'oval', name: 'Oval' },
];

const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
];

export default function FilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get('category') || '';
  const activeColor = searchParams.get('color') || '';
  const activeMaterial = searchParams.get('material') || '';
  const activeShape = searchParams.get('shape') || '';
  const activeSort = searchParams.get('sort') || '';
  const activeMinPrice = searchParams.get('minPrice') || '';
  const activeMaxPrice = searchParams.get('maxPrice') || '';

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAll = () => {
    router.push(pathname);
  };

  const hasFilters = activeCategory || activeColor || activeMaterial || activeShape || activeMinPrice || activeMaxPrice;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h3>Filters</h3>
        {hasFilters && (
          <button onClick={clearAll} className={styles.clearBtn}>Clear All</button>
        )}
      </div>

      {/* Sort */}
      <div className={styles.group}>
        <h4>Sort By</h4>
        <select
          value={activeSort}
          onChange={(e) => updateFilter('sort', e.target.value)}
          className={styles.select}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div className={styles.group}>
        <h4>Category</h4>
        <div className={styles.options}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              className={`${styles.filterBtn} ${activeCategory === cat.slug ? styles.active : ''}`}
              onClick={() => updateFilter('category', activeCategory === cat.slug ? '' : cat.slug)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div className={styles.group}>
        <h4>Color</h4>
        <div className={styles.options}>
          {COLORS.map((color) => (
            <button
              key={color}
              className={`${styles.filterBtn} ${activeColor === color ? styles.active : ''}`}
              onClick={() => updateFilter('color', activeColor === color ? '' : color)}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Material */}
      <div className={styles.group}>
        <h4>Material</h4>
        <div className={styles.options}>
          {MATERIALS.map((mat) => (
            <button
              key={mat}
              className={`${styles.filterBtn} ${activeMaterial === mat ? styles.active : ''}`}
              onClick={() => updateFilter('material', activeMaterial === mat ? '' : mat)}
            >
              {mat}
            </button>
          ))}
        </div>
      </div>

      {/* Shape */}
      <div className={styles.group}>
        <h4>Shape</h4>
        <div className={styles.options}>
          {SHAPES.map((shape) => (
            <button
              key={shape.slug}
              className={`${styles.filterBtn} ${activeShape === shape.slug ? styles.active : ''}`}
              onClick={() => updateFilter('shape', activeShape === shape.slug ? '' : shape.slug)}
            >
              {shape.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className={styles.group}>
        <h4>Price Range (INR)</h4>
        <div className={styles.priceRow}>
          <input
            type="number"
            placeholder="Min"
            value={activeMinPrice}
            onChange={(e) => updateFilter('minPrice', e.target.value)}
            className={styles.priceInput}
          />
          <span>to</span>
          <input
            type="number"
            placeholder="Max"
            value={activeMaxPrice}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
            className={styles.priceInput}
          />
        </div>
      </div>
    </aside>
  );
}
