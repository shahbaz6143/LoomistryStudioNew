import Link from 'next/link';
import styles from './HeroBanner.module.css';

export default function HeroBanner() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}>
        <div className={styles.content}>
          <h1 className={styles.title}>Handcrafted Rugs for Timeless Homes</h1>
          <p className={styles.subtitle}>
            Premium handmade carpets designed to elevate your living space.
            Crafted by master artisans with love.
          </p>
          <Link href="/products" className={styles.cta}>
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}
