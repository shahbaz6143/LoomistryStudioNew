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
        <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="Your email address" />
          <button type="submit">Subscribe</button>
        </form>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.brand}>
              <h3>LoomistryStudio</h3>
              <p>
                Premium handmade rugs and carpets crafted by master artisans in India.
                Bringing warmth, character, and lasting comfort into modern homes.
              </p>
              <div className={styles.social}>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Pinterest">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg>
                </a>
              </div>
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
              <Link href="/faq">FAQ</Link>
            </div>

            <div className={styles.links}>
              <h4>Company</h4>
              <Link href="/about">Our Story</Link>
              <Link href="/artisans">Our Artisans</Link>
              <Link href="/sustainability">Sustainability</Link>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
            </div>
          </div>

          {/* Trust Badges */}
          <div className={styles.trust}>
            <div className={styles.trustItem}>
              <strong>Free Shipping</strong>
              <span>Orders above ₹10,000</span>
            </div>
            <div className={styles.trustItem}>
              <strong>30-Day Returns</strong>
              <span>Hassle-free returns</span>
            </div>
            <div className={styles.trustItem}>
              <strong>Secure Payment</strong>
              <span>Razorpay & Stripe</span>
            </div>
            <div className={styles.trustItem}>
              <strong>Made in India</strong>
              <span>Artisan crafted</span>
            </div>
          </div>

          {/* Bottom */}
          <div className={styles.bottom}>
            <p>&copy; {new Date().getFullYear()} LoomistryStudio. All rights reserved.</p>
            <div className={styles.payments}>
              <span>Visa</span>
              <span>Mastercard</span>
              <span>UPI</span>
              <span>Razorpay</span>
              <span>Stripe</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
