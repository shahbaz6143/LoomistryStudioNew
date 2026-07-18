'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProducts } from '@/services/product.service';
import ProductCard from '@/components/product/ProductCard';
import styles from './BestSellers.module.css';

export default function BestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBestSellers() {
      try {
        const response = await getProducts({ collection: 'bestsellers', limit: 4 });
        setProducts(response.data || []);
      } catch (error) {
        console.error('Failed to fetch bestsellers:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBestSellers();
  }, []);

  if (loading) {
    return (
      <section className={styles.section}>
        <div className="container">
          <h2 className="section-title">Our Bestsellers</h2>
          <p className="section-subtitle">The most loved pieces from our collection</p>
          <div className={styles.grid}>
            {[1, 2, 3, 4].map((i) => <div key={i} className={styles.skeleton} />)}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className="section-title">Our Bestsellers</h2>
        <p className="section-subtitle">The most loved pieces from our collection</p>
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        <div className={styles.viewAll}>
          <Link href="/products?collection=bestsellers" className={styles.viewAllLink}>
            View All Bestsellers
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
