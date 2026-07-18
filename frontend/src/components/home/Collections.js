'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCollections } from '@/services/product.service';
import styles from './Collections.module.css';

export default function Collections() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    async function fetchCollections() {
      try {
        const response = await getCollections();
        setCollections(response.data || []);
      } catch (error) {
        console.error('Failed to fetch collections:', error);
      }
    }

    fetchCollections();
  }, []);

  return (
    <section className="container section">
      <h2 className="section-title">Shop by Collection</h2>
      <div className={styles.grid}>
        {collections.map((collection) => (
          <Link
            key={collection.slug}
            href={`/products?collection=${collection.slug}`}
            className={styles.card}
          >
            <span className={styles.name}>{collection.name}</span>
            <span className={styles.arrow}>&rarr;</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
