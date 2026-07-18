'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import SearchModal from './SearchModal';
import styles from './Header.module.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const { itemCount: cartCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>
            LoomistryStudio
          </Link>

          <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
            <Link href="/" className={styles.navLink}>Home</Link>
            <Link href="/products" className={styles.navLink}>Shop</Link>
            <Link href="/products?collection=new-arrivals" className={styles.navLink}>New Arrivals</Link>
            <Link href="/products?collection=bestsellers" className={styles.navLink}>Bestsellers</Link>
          </nav>

          <div className={styles.actions}>
            <button className={styles.iconBtn} aria-label="Search" onClick={() => setSearchOpen(true)}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </button>

            <Link href="/wishlist" className={styles.iconBtn} aria-label="Wishlist">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlistCount > 0 && <span className={styles.badge}>{wishlistCount}</span>}
            </Link>

            <Link href="/cart" className={styles.iconBtn} aria-label="Cart">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
            </Link>

            {!loading && (
              <>
                {user ? (
                  <div className={styles.userMenu}>
                    {(user.role === 'admin' || user.role === 'editor') && (
                      <Link href="/admin" className={styles.adminLink}>CMS</Link>
                    )}
                    {user.avatar && (
                      <img src={user.avatar} alt={user.name} className={styles.avatar} />
                    )}
                    <span className={styles.userName}>{user.name?.split(' ')[0]}</span>
                    <button onClick={logout} className={styles.logoutBtn}>Logout</button>
                  </div>
                ) : (
                  <Link href="/auth/login" className={styles.loginBtn}>Sign In</Link>
                )}
              </>
            )}
          </div>

          <button
            className={styles.menuToggle}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {menuOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
