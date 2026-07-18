'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const router = useRouter();
  const firstSize = product.fixedSizes?.[0];

  const handleAddToCart = () => {
    if (!user) {
      router.push('/auth/login?redirect=/products');
      return;
    }
    // TODO: Add to cart logic (Task 7)
    alert('Added to cart!');
  };

  const handleWishlist = () => {
    if (!user) {
      router.push('/auth/login?redirect=/products');
      return;
    }
    // TODO: Add to wishlist logic (Task 7)
    alert('Added to wishlist!');
  };

  return (
    <div className={styles.card}>
      <Link href={`/products/${product.slug}`} className={styles.imageWrapper}>
        <img
          src={product.images?.[0] || '/placeholder.jpg'}
          alt={product.title}
          className={styles.image}
        />
        {product.avgRating > 4.5 && (
          <span className={styles.badge}>Top Rated</span>
        )}
      </Link>

      <div className={styles.info}>
        <Link href={`/products/${product.slug}`}>
          <h3 className={styles.title}>{product.title}</h3>
        </Link>

        <p className={styles.material}>{product.material} &middot; {product.category}</p>

        <div className={styles.pricing}>
          {firstSize && (
            <>
              <span className={styles.price}>&#8377;{firstSize.priceINR.toLocaleString()}</span>
              <span className={styles.size}>({firstSize.label})</span>
            </>
          )}
        </div>

        <div className={styles.actions}>
          <button className={styles.addToCart} onClick={handleAddToCart}>Add to Cart</button>
          <button className={styles.wishlist} onClick={handleWishlist} aria-label="Add to wishlist">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
