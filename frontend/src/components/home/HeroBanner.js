import Link from 'next/link';
import styles from './HeroBanner.module.css';

export default function HeroBanner() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}>
        <div className={styles.content}>
          <p className={styles.subtitle}>Handcrafted in India</p>
          <h1 className={styles.title}>Artisan Rugs for Timeless Living</h1>
          <p className={styles.description}>
            Premium handmade carpets woven by master artisans. Each piece tells a story of
            tradition, craftsmanship, and enduring beauty.
          </p>
          <Link href="/products" className={styles.cta}>
            Explore Collection
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
      <div className={styles.scroll}>
        <span>Scroll</span>
        <div className={styles.scrollLine} />
      </div>
    </section>
  );
}
