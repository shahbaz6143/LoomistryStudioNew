'use client';

import Link from 'next/link';
import styles from './NewCollections.module.css';

const COLLECTIONS = [
  {
    name: 'Hand Knotted',
    slug: 'hand-knotted',
    image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=900&h=1000&fit=crop',
  },
  {
    name: 'Bohemian',
    slug: 'flatweave',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=500&fit=crop',
  },
  {
    name: 'Persian Heritage',
    slug: 'persian',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&h=500&fit=crop',
  },
];

export default function NewCollections() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {/* Large left card */}
        <Link href={`/products?category=${COLLECTIONS[0].slug}`} className={styles.cardLarge}>
          <div className={styles.imageWrap}>
            <img src={COLLECTIONS[0].image} alt={COLLECTIONS[0].name} className={styles.image} />
          </div>
          <div className={styles.cardLabel}>
            <span className={styles.cardName}>{COLLECTIONS[0].name}</span>
            <span className={styles.cardArrow}>
              <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </span>
          </div>
        </Link>

        {/* Right column: dark header + 2 small cards */}
        <div className={styles.rightCol}>
          <div className={styles.headerCard}>
            <span className={styles.headerLabel}>New</span>
            <h2 className={styles.headerTitle}>COLLECTIONS</h2>
          </div>

          <div className={styles.bottomRow}>
            {COLLECTIONS.slice(1).map((col) => (
              <Link key={col.slug} href={`/products?category=${col.slug}`} className={styles.cardSmall}>
                <div className={styles.imageWrap}>
                  <img src={col.image} alt={col.name} className={styles.image} />
                </div>
                <div className={styles.cardLabel}>
                  <span className={styles.cardName}>{col.name}</span>
                  <span className={styles.cardArrow}>
                    <svg width="12" height="12" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
