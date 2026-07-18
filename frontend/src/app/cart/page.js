'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import styles from './page.module.css';

export default function CartPage() {
  const { user } = useAuth();
  const { cart, updateItem, removeItem, clearAll } = useCart();

  if (!user) {
    return (
      <div className={`container ${styles.empty}`}>
        <h1>Shopping Cart</h1>
        <p>Please sign in to view your cart.</p>
        <Link href="/auth/login?redirect=/cart" className={styles.btn}>Sign In</Link>
      </div>
    );
  }

  const items = cart.items || [];

  if (items.length === 0) {
    return (
      <div className={`container ${styles.empty}`}>
        <h1>Shopping Cart</h1>
        <p>Your cart is empty.</p>
        <Link href="/products" className={styles.btn}>Continue Shopping</Link>
      </div>
    );
  }

  // Calculate total
  const getItemPrice = (item) => {
    if (!item.productId?.fixedSizes) return 0;
    const sizeObj = item.productId.fixedSizes.find((s) => s.label === item.size);
    if (sizeObj) return sizeObj.priceINR;
    // Custom size
    if (item.isCustomSize && item.customDimensions && item.productId.customSizePrice) {
      return item.customDimensions.width * item.customDimensions.height * item.productId.customSizePrice.pricePerSqFtINR;
    }
    return 0;
  };

  const subtotal = items.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);

  return (
    <div className="container section">
      <div className={styles.header}>
        <h1>Shopping Cart ({items.length} items)</h1>
        <button onClick={clearAll} className={styles.clearBtn}>Clear Cart</button>
      </div>

      <div className={styles.layout}>
        <div className={styles.items}>
          {items.map((item) => (
            <div key={item._id} className={styles.cartItem}>
              <img
                src={item.productId?.images?.[0] || '/placeholder.jpg'}
                alt={item.productId?.title}
                className={styles.itemImg}
              />
              <div className={styles.itemInfo}>
                <Link href={`/products/${item.productId?.slug}`} className={styles.itemTitle}>
                  {item.productId?.title}
                </Link>
                <p className={styles.itemMeta}>
                  Size: {item.size} {item.color && `• Color: ${item.color}`}
                </p>
                <p className={styles.itemPrice}>₹{getItemPrice(item).toLocaleString()}</p>
              </div>
              <div className={styles.itemActions}>
                <div className={styles.quantity}>
                  <button onClick={() => updateItem(item._id, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateItem(item._id, item.quantity + 1)}>+</button>
                </div>
                <button onClick={() => removeItem(item._id)} className={styles.removeBtn}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.summary}>
          <h2>Order Summary</h2>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.total}`}>
            <span>Total</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>
          <button className={styles.checkoutBtn}>Proceed to Checkout</button>
          <Link href="/products" className={styles.continueLink}>Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
