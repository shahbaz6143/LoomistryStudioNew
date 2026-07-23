'use client';

import Link from 'next/link';
import { useRecentlyViewed } from '@/context/RecentlyViewedContext';
import { useCurrency } from '@/context/CurrencyContext';
import styles from './RecentlyViewed.module.css';

export default function RecentlyViewed({ excludeSlug }) {
  const { items } = useRecentlyViewed();
  const { getPrice, formatPrice } = useCurrency();

  const filtered = items.filter((p) => p.slug !== excludeSlug);
  if (filtered.length === 0) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Recently Viewed</h2>
      <div className={styles.grid}>
        {filtered.map((product) => (
          <Link key={product._id} href={`/products/${product.slug}`} className={styles.card}>
            <div className={styles.imageWrap}>
              <img src={product.images?.[0] || '/placeholder.jpg'} alt={product.title} className={styles.image} />
            </div>
            <div className={styles.info}>
              <p className={styles.category}>{product.category?.replace('-', ' ')}</p>
              <h4 className={styles.name}>{product.title}</h4>
              {product.fixedSizes?.[0] && (
                <span className={styles.price}>{formatPrice(getPrice(product.fixedSizes[0]))}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
