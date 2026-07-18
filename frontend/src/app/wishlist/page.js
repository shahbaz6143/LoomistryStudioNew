'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import styles from './page.module.css';

export default function WishlistPage() {
  const { user } = useAuth();
  const { wishlist, removeItem } = useWishlist();

  if (!user) {
    return (
      <div className={`container ${styles.empty}`}>
        <h1>My Wishlist</h1>
        <p>Please sign in to view your wishlist.</p>
        <Link href="/auth/login?redirect=/wishlist" className={styles.btn}>Sign In</Link>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className={`container ${styles.empty}`}>
        <h1>My Wishlist</h1>
        <p>Your wishlist is empty. Start adding rugs you love!</p>
        <Link href="/products" className={styles.btn}>Browse Products</Link>
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
