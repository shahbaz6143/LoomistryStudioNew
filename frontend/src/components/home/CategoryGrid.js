'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCategories } from '@/services/product.service';
import styles from './CategoryGrid.module.css';

export default function CategoryGrid() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await getCategories();
        setCategories(response.data || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    }

    fetchCategories();
  }, []);

  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className="section-title">Shop by Categories</h2>
        <div className={styles.grid}>
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/products?category=${category.slug}`}
              className={styles.card}
            >
              <div className={styles.cardInner}>
                <span className={styles.name}>{category.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
