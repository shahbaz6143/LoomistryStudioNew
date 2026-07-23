import Link from 'next/link';
import styles from './EmptyState.module.css';

const ILLUSTRATIONS = {
  cart: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="55" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4"/>
      <path d="M35 40h5l4 25h32l5-18H44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="50" cy="72" r="3" stroke="currentColor" strokeWidth="2"/>
      <circle cx="72" cy="72" r="3" stroke="currentColor" strokeWidth="2"/>
      <path d="M55 52h10M60 47v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
    </svg>
  ),
  wishlist: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="55" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4"/>
      <path d="M60 85s-24-15-24-30c0-8 6-14 14-14 5 0 8 2 10 5 2-3 5-5 10-5 8 0 14 6 14 14 0 15-24 30-24 30z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  orders: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="55" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4"/>
      <rect x="40" y="35" width="40" height="50" rx="3" stroke="currentColor" strokeWidth="2"/>
      <path d="M50 50h20M50 58h20M50 66h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      <path d="M40 42l10-7 10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  search: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="55" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4"/>
      <circle cx="55" cy="55" r="16" stroke="currentColor" strokeWidth="2"/>
      <path d="M67 67l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M48 55h14M55 48v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
    </svg>
  ),
};

export default function EmptyState({ type = 'cart', title, message, actionLabel, actionHref }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.illustration}>
        {ILLUSTRATIONS[type] || ILLUSTRATIONS.cart}
      </div>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.message}>{message}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className={styles.action}>
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
