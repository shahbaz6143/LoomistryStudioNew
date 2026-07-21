'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import SearchModal from './SearchModal';
import styles from './Header.module.css';

const ANNOUNCEMENTS = [
  '✨ SUMMER SALE • UP TO 60% OFF SITEWIDE • FREE WORLDWIDE SHIPPING',
  '🧶 Handmade Luxury Rugs • Save Up to 60% • Limited Stock',
  '🚚 Free Shipping on All Orders Above ₹10,000 • Handcrafted in India',
];

const SHOP_LINKS = [
  { label: 'Living Room Rugs', href: '/products?collection=living-room' },
  { label: 'Bedroom Rugs', href: '/products?collection=bedroom' },
  { label: 'Dining Rugs', href: '/products?collection=dining-room' },
  { label: 'Hallway Runners', href: '/products?category=runner' },
  { label: 'Round Rugs', href: '/products?shape=round' },
  { label: 'Oval Rugs', href: '/products?shape=oval' },
  { label: 'Kids Rugs', href: '/products?collection=kids-room' },
  { label: 'Custom Rugs', href: '/products' },
];

const COLLECTION_LINKS = [
  { label: 'Abstract Rugs', href: '/products?category=abstract' },
  { label: 'Organic Collection', href: '/products?material=Jute' },
  { label: 'Botanical Collection', href: '/products?category=traditional' },
  { label: 'Geometric Collection', href: '/products?category=modern' },
  { label: 'Wave Collection', href: '/products?collection=new-arrivals' },
  { label: 'Scandinavian', href: '/products?category=flatweave' },
  { label: 'Luxury Collection', href: '/products?category=persian' },
  { label: 'Kids Collection', href: '/products?collection=kids-room' },
  { label: 'Animal Collection', href: '/products?collection=bestsellers' },
  { label: 'Statement Rugs', href: '/products?category=hand-knotted' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [shopDropdown, setShopDropdown] = useState(false);
  const [collectionsDropdown, setCollectionsDropdown] = useState(false);
  const { user, loading, logout } = useAuth();
  const { itemCount: cartCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();

  // Rotate announcements
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Announcement Bar — Rotating */}
      <div className={styles.announcement}>
        <span key={announcementIndex} className={styles.announcementText}>
          {ANNOUNCEMENTS[announcementIndex]}
        </span>
      </div>

      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>
            <img src="/logo.png" alt="LoomistryStudio" className={styles.logoImg} />
          </Link>

          <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
            {/* Shop Dropdown */}
            <div
              className={styles.navItem}
              onMouseEnter={() => setShopDropdown(true)}
              onMouseLeave={() => setShopDropdown(false)}
            >
              <Link href="/products" className={styles.navLink}>Shop</Link>
              {shopDropdown && (
                <div className={styles.dropdown}>
                  {SHOP_LINKS.map((item) => (
                    <Link key={item.href} href={item.href} className={styles.dropdownLink} onClick={() => setMenuOpen(false)}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Collections Dropdown */}
            <div
              className={styles.navItem}
              onMouseEnter={() => setCollectionsDropdown(true)}
              onMouseLeave={() => setCollectionsDropdown(false)}
            >
              <Link href="/products?collection=new-arrivals" className={styles.navLink}>Collections</Link>
              {collectionsDropdown && (
                <div className={styles.dropdown}>
                  {COLLECTION_LINKS.map((item) => (
                    <Link key={item.href} href={item.href} className={styles.dropdownLink} onClick={() => setMenuOpen(false)}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/custom-rugs" className={styles.navLink} onClick={() => setMenuOpen(false)}>Custom Rugs</Link>
            <Link href="/products?collection=new-arrivals" className={styles.navLink} onClick={() => setMenuOpen(false)}>New Arrivals</Link>
            <Link href="/products?collection=bestsellers" className={styles.navLink} onClick={() => setMenuOpen(false)}>Bestsellers</Link>
            <Link href="/about" className={styles.navLink} onClick={() => setMenuOpen(false)}>About</Link>
          </nav>

          <div className={styles.actions}>
            <button className={styles.iconBtn} aria-label="Search" onClick={() => setSearchOpen(true)}>
              <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </button>

            {(!user || user.role === 'buyer') && (
              <>
                <Link href="/wishlist" className={styles.iconBtn} aria-label="Wishlist">
                  <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  {wishlistCount > 0 && <span className={styles.badge}>{wishlistCount}</span>}
                </Link>

                <Link href="/cart" className={styles.iconBtn} aria-label="Cart">
                  <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
                </Link>
              </>
            )}

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
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
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
