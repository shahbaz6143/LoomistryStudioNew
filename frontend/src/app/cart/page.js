'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import EmptyState from '@/components/ui/EmptyState';
import styles from './page.module.css';

export default function CartPage() {
  const { user } = useAuth();
  const { cart, updateItem, removeItem, clearAll } = useCart();

  if (!user) {
    return (
      <div className="container">
        <EmptyState type="cart" title="Shopping Bag" message="Please sign in to view your shopping bag." actionLabel="Sign In" actionHref="/auth/login?redirect=/cart" />
      </div>
    );
  }

  const items = cart.items || [];

  if (items.length === 0) {
    return (
      <div className="container">
        <EmptyState type="cart" title="Your Bag is Empty" message="Looks like you haven't added anything yet. Explore our collection to find your perfect rug." actionLabel="Start Shopping" actionHref="/products" />
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
            <span>{subtotal >= 10000 ? 'Free' : '₹499'}</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.total}`}>
            <span>Total</span>
            <span>₹{(subtotal >= 10000 ? subtotal : subtotal + 499).toLocaleString()}</span>
          </div>
          <div className={styles.delivery}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            <span>Estimated Delivery: <strong>{(() => { const d = new Date(); d.setDate(d.getDate() + 10); return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }); })()} – {(() => { const d = new Date(); d.setDate(d.getDate() + 14); return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); })()}</strong></span>
          </div>
          <Link href="/checkout" className={styles.checkoutBtn}>Proceed to Checkout</Link>
          <Link href="/products" className={styles.continueLink}>Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
