'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useToast } from '@/components/ui/Toast';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const { addItem: addToCart } = useCart();
  const { addItem: addToWishlist, isInWishlist } = useWishlist();
  const { getPrice, formatPrice } = useCurrency();
  const { showToast } = useToast();
  const router = useRouter();
  const [addedToCart, setAddedToCart] = useState(false);

  const firstSize = product.fixedSizes?.[0];
  const wishlisted = product._id && isInWishlist(product._id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { router.push('/auth/login?redirect=/products'); return; }
    if (!firstSize) return;
    const success = await addToCart({ productId: product._id, size: firstSize.label, color: product.colors?.[0] || '' });
    if (success) {
      setAddedToCart(true);
      showToast({ title: 'Added to Bag', message: `${product.title} (${firstSize.label}) has been added to your shopping bag.` });
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { router.push('/auth/login?redirect=/products'); return; }
    addToWishlist(product._id);
    showToast({ title: 'Added to Wishlist', message: `${product.title} has been saved to your wishlist.` });
  };

  return (
    <div className={styles.card}>
      <Link href={`/products/${product.slug}`} className={styles.imageWrapper}>
        <img
          src={product.images?.[0] || '/placeholder.jpg'}
          alt={product.title}
          className={styles.image}
        />
        {product.avgRating >= 4.5 && (
          <span className={styles.badge}>Bestseller</span>
        )}

        {/* Quick actions on hover (only for buyers) */}
        {(!user || user.role === 'buyer') && (
          <div className={styles.quickActions}>
            <button className={`${styles.addToCart} ${addedToCart ? styles.addedToCart : ''}`} onClick={handleAddToCart}>
              {addedToCart ? '✓ In Bag' : 'Add to Bag'}
            </button>
            <button className={`${styles.wishlist} ${wishlisted ? styles.wishlisted : ''}`} onClick={handleWishlist} aria-label="Wishlist">
              <svg width="16" height="16" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
        )}
      </Link>

      <div className={styles.info}>
        <p className={styles.category}>{product.category?.replace('-', ' ')}</p>
        <Link href={`/products/${product.slug}`}>
          <h3 className={styles.title}>{product.title}</h3>
        </Link>
        <p className={styles.material}>{product.material}</p>
        <div className={styles.pricing}>
          {firstSize && (
            <>
              <span className={styles.price}>{formatPrice(getPrice(firstSize))}</span>
              <span className={styles.size}>({firstSize.label})</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
