'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './layout.module.css';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
    return (
      <div className={styles.denied}>
        <h1>Access Denied</h1>
        <p>You need admin or editor privileges to access the CMS.</p>
        <Link href="/auth/login">Sign In</Link>
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/products', label: 'Products', icon: '📦' },
    { href: '/admin/products/new', label: 'Add Product', icon: '➕' },
    { href: '/admin/orders', label: 'Orders', icon: '🛒' },
    { href: '/admin/catalogues', label: 'Catalogues', icon: '📖' },
    { href: '/admin/clients', label: 'Clients', icon: '👥' },
    { href: '/admin/coupons', label: 'Coupons', icon: '🎟️' },
    { href: '/admin/reviews', label: 'Reviews', icon: '⭐' },
    { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>CMS Panel</h2>
          <span className={styles.role}>{user.role}</span>
        </div>
        <nav className={styles.sidebarNav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${pathname === item.href ? styles.navItemActive : ''}`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.backLink}>&larr; Back to Store</Link>
        </div>
      </aside>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
