'use client';

import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <>
      {/* Newsletter */}
      <section className={styles.newsletter}>
        <h3>Stay in the Loop</h3>
        <p>Get updates on new collections, exclusive offers, and styling tips.</p>
        <form className={styles.newsletterForm} onSubmit={async (e) => {
          e.preventDefault();
          const email = e.target.email.value;
          if (!email) return;
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/newsletter/subscribe`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }),
            });
            const data = await res.json();
            e.target.email.value = '';
            alert(data.message);
          } catch (err) { alert('Something went wrong. Please try again.'); }
        }}>
          <input type="email" name="email" placeholder="Your email address" required />
          <button type="submit">Subscribe</button>
        </form>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          {/* Links Grid */}
          <div className={styles.grid}>
            <div className={styles.brand}>
              <h3>LoomistryStudio</h3>
              <p>
                Premium handmade rugs and carpets crafted by master artisans in India.
                Bringing warmth, character, and lasting comfort into modern homes.
              </p>
            </div>

            <div className={styles.links}>
              <h4>Shop</h4>
              <Link href="/products">All Rugs</Link>
              <Link href="/products?collection=new-arrivals">New Arrivals</Link>
              <Link href="/products?collection=bestsellers">Bestsellers</Link>
              <Link href="/products?category=hand-knotted">Hand Knotted</Link>
              <Link href="/products?category=persian">Persian</Link>
            </div>

            <div className={styles.links}>
              <h4>Help</h4>
              <Link href="/shipping">Shipping & Delivery</Link>
              <Link href="/returns">Returns & Exchange</Link>
              <Link href="/care-guide">Rug Care Guide</Link>
              <Link href="/contact">Contact Us</Link>
              <Link href="/orders">Track Your Order</Link>
            </div>

            <div className={styles.contact}>
              <h4>Contact</h4>
              <a href="tel:+917428917452">+91 7428917452</a>
              <a href="mailto:info@loomistrystudio.com">info@loomistrystudio.com</a>
              <p>Bhadohi, Uttar Pradesh, India</p>
            </div>
          </div>

          {/* Large brand name */}
          <div className={styles.brandLarge}>
            <h2>LoomistryStudio</h2>
          </div>

          {/* Social Icons — Large like Cocoon */}
          <div className={styles.social}>
            <a href="https://www.instagram.com/loomistrystudio/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram">
              <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="https://www.facebook.com/profile.php?id=61588571769641" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook">
              <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://in.pinterest.com/loomistrystudio/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Pinterest">
              <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg>
            </a>
            <a href="https://www.etsy.com/shop/theloomistrystudio/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Etsy">
              <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24"><path d="M9.16 4.945c0-.63.168-.68 1.31-.68h1.96c2.18 0 2.52.462 3.08 2.94l.42 1.68h.84L16.6 2.965c-1.68.168-4.2.252-6.72.252-2.52 0-5.04-.084-6.72-.252v.84c1.68.126 1.89.42 1.89 3.36v9.66c0 2.94-.21 3.234-1.89 3.36v.84c1.68-.168 3.528-.252 5.376-.252 2.1 0 4.62.084 6.72.252l.42-5.88h-.84c-.42 2.94-1.26 4.62-4.2 4.62h-2.52c-1.26 0-1.26-.168-1.26-.84V12.5h1.68c2.1 0 2.52.672 2.94 2.52h.84V8.085h-.84c-.42 1.848-.84 2.52-2.94 2.52H9.16V4.945z"/></svg>
            </a>
            <a href="https://wa.me/917428917452" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="WhatsApp">
              <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
          </div>

          {/* Copyright */}
          <div className={styles.bottom}>
            <p>&copy; {new Date().getFullYear()} LoomistryStudio. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
