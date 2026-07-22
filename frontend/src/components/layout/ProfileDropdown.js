'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import styles from './ProfileDropdown.module.css';

export default function ProfileDropdown() {
  const { user, logout } = useAuth();
  const { confirm } = useToast();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    confirm({
      title: 'Logout',
      message: 'Are you sure you want to log out of your account?',
      confirmText: 'Yes, Logout',
      cancelText: 'Cancel',
      onConfirm: logout,
    });
  };

  if (!user) return null;

  return (
    <div className={styles.wrapper} ref={ref}>
      <button className={styles.trigger} onClick={() => setOpen(!open)}>
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className={styles.avatar} />
        ) : (
          <span className={styles.avatarFallback}>{user.name?.charAt(0).toUpperCase()}</span>
        )}
        <span className={styles.name}>{user.name?.split(' ')[0]}</span>
        <svg className={`${styles.arrow} ${open ? styles.arrowOpen : ''}`} width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className={styles.dropdown}>
          {/* User info */}
          <div className={styles.userInfo}>
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className={styles.dropAvatar} />
            ) : (
              <span className={styles.dropAvatarFallback}>{user.name?.charAt(0).toUpperCase()}</span>
            )}
            <div>
              <p className={styles.dropName}>{user.name}</p>
              <p className={styles.dropEmail}>{user.email}</p>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Menu Items */}
          <Link href="/orders" className={styles.item} onClick={() => setOpen(false)}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20 12V5.74a2 2 0 0 0-1.02-1.74l-7-4a2 2 0 0 0-1.96 0l-7 4A2 2 0 0 0 2 5.74V12m18 0v6.26a2 2 0 0 1-1.02 1.74l-7 4a2 2 0 0 1-1.96 0l-7-4A2 2 0 0 1 2 18.26V12m18 0l-7.98 4.56a2 2 0 0 1-2.04 0L2 12"/></svg>
            My Orders
          </Link>
          <Link href="/wishlist" className={styles.item} onClick={() => setOpen(false)}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            Wishlist
          </Link>
          <Link href="/cart" className={styles.item} onClick={() => setOpen(false)}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            Shopping Bag
          </Link>

          <div className={styles.divider} />

          <Link href="/shipping" className={styles.item} onClick={() => setOpen(false)}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            Shipping Info
          </Link>
          <Link href="/contact" className={styles.item} onClick={() => setOpen(false)}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.81.37 1.61.7 2.36a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.75.33 1.55.57 2.36.7A2 2 0 0 1 22 16.92z"/></svg>
            Contact Support
          </Link>

          <div className={styles.divider} />

          <button className={styles.logoutItem} onClick={handleLogout}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
