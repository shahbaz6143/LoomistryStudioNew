import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <h3>LoomistryStudio</h3>
            <p>Premium handmade rugs and carpets crafted by artisans. Bringing warmth and artistry to your home.</p>
          </div>

          <div className={styles.links}>
            <h4>Shop</h4>
            <Link href="/products">All Rugs</Link>
            <Link href="/products?collection=new-arrivals">New Arrivals</Link>
            <Link href="/products?collection=bestsellers">Bestsellers</Link>
            <Link href="/products?category=hand-knotted">Hand Knotted</Link>
          </div>

          <div className={styles.links}>
            <h4>Help</h4>
            <Link href="/shipping">Shipping Info</Link>
            <Link href="/returns">Returns</Link>
            <Link href="/care-guide">Rug Care Guide</Link>
            <Link href="/contact">Contact Us</Link>
          </div>

          <div className={styles.links}>
            <h4>Connect</h4>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">Pinterest</a>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} LoomistryStudio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
