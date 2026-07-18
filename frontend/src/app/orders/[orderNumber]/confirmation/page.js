'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getOrderByNumber } from '@/services/order.service';
import styles from './page.module.css';

export default function OrderConfirmationPage({ params }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await getOrderByNumber(params.orderNumber);
        setOrder(response.data);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [params.orderNumber]);

  if (loading) {
    return <div className={`container ${styles.page}`}><p>Loading order details...</p></div>;
  }

  if (!order) {
    return (
      <div className={`container ${styles.page}`}>
        <p>Order not found.</p>
        <Link href="/">Go Home</Link>
      </div>
    );
  }

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.success}>
        <div className={styles.checkmark}>✓</div>
        <h1>Order Confirmed!</h1>
        <p className={styles.orderNumber}>Order #{order.orderNumber}</p>
        <p className={styles.thankYou}>
          Thank you for your purchase. We&apos;ll send you a confirmation email shortly.
        </p>
      </div>

      <div className={styles.details}>
        <div className={styles.section}>
          <h3>Items Ordered</h3>
          {order.items.map((item, i) => (
            <div key={i} className={styles.item}>
              <img src={item.image || '/placeholder.jpg'} alt={item.title} className={styles.itemImg} />
              <div className={styles.itemInfo}>
                <span className={styles.itemTitle}>{item.title}</span>
                <span className={styles.itemMeta}>{item.size} &middot; Qty: {item.quantity}</span>
              </div>
              <span className={styles.itemPrice}>
                {order.currency === 'INR' ? '₹' : '$'}{item.price.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <div className={styles.section}>
          <h3>Shipping Address</h3>
          <p>
            {order.shippingAddress.fullName}<br />
            {order.shippingAddress.addressLine1}<br />
            {order.shippingAddress.addressLine2 && <>{order.shippingAddress.addressLine2}<br /></>}
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
            {order.shippingAddress.country}
          </p>
        </div>

        <div className={styles.section}>
          <h3>Payment</h3>
          <p>Method: {order.paymentMethod === 'razorpay' ? 'Razorpay' : 'Stripe'}</p>
          <p>Total: {order.currency === 'INR' ? '₹' : '$'}{order.totalAmount.toLocaleString()}</p>
          <p>Status: <strong style={{ color: 'var(--success)' }}>Paid</strong></p>
        </div>
      </div>

      <div className={styles.actions}>
        <Link href="/orders" className={styles.ordersBtn}>View All Orders</Link>
        <Link href="/products" className={styles.shopBtn}>Continue Shopping</Link>
      </div>
    </div>
  );
}
