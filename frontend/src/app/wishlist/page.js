'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import EmptyState from '@/components/ui/EmptyState';
import styles from './page.module.css';

export default function WishlistPage() {
  const { user } = useAuth();
  const { wishlist, removeItem } = useWishlist();

  if (!user) {
    return (
      <div className="container">
        <EmptyState type="wishlist" title="My Wishlist" message="Please sign in to view your saved favourites." actionLabel="Sign In" actionHref="/auth/login?redirect=/wishlist" />
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="container">
        <EmptyState type="wishlist" title="Your Wishlist is Empty" message="Save the rugs you love by clicking the heart icon. They'll appear here for easy access." actionLabel="Browse Products" actionHref="/products" />
      </div>
    );
  }

  return (
    <div className="container section">
      <h1 className="section-title">My Wishlist ({wishlist.length})</h1>
      <div className={styles.grid}>
        {wishlist.map((product) => (
          <div key={product._id} className={styles.card}>
            <Link href={`/products/${product.slug}`} className={styles.imageLink}>
              <img src={product.images?.[0] || '/placeholder.jpg'} alt={product.title} />
            </Link>
            <div className={styles.info}>
              <Link href={`/products/${product.slug}`}>
                <h3>{product.title}</h3>
              </Link>
              <p>{product.material} &middot; {product.category}</p>
              {product.fixedSizes?.[0] && (
                <span className={styles.price}>₹{product.fixedSizes[0].priceINR.toLocaleString()}</span>
              )}
              <div className={styles.actions}>
                <Link href={`/products/${product.slug}`} className={styles.viewBtn}>View Details</Link>
                <button onClick={() => removeItem(product._id)} className={styles.removeBtn}>Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
