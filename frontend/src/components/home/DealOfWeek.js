'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProducts } from '@/services/product.service';
import styles from './DealOfWeek.module.css';

export default function DealOfWeek() {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function fetchDeal() {
      try {
        const response = await getProducts({ collection: 'deal-of-the-week', limit: 1 });
        if (response.data?.length > 0) {
          setProduct(response.data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch deal:', error);
      }
    }
    fetchDeal();
  }, []);

  if (!product) return null;

  const firstSize = product.fixedSizes?.[0];

  return (
    <section className={styles.section}>
      <div className={`container ${styles.container}`}>
        <div className={styles.imageCol}>
          <img src={product.images?.[0] || '/placeholder.jpg'} alt={product.title} />
        </div>
        <div className={styles.infoCol}>
          <span className={styles.tag}>Deal of the Week</span>
          <h2 className={styles.title}>{product.title}</h2>
          <p className={styles.description}>{product.description?.slice(0, 150)}...</p>
          {firstSize && (
            <div className={styles.pricing}>
              <span className={styles.price}>&#8377;{firstSize.priceINR.toLocaleString()}</span>
              <span className={styles.size}>Starting from ({firstSize.label})</span>
            </div>
          )}
          <Link href={`/products/${product.slug}`} className={styles.cta}>
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}
