'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getOrders } from '@/services/order.service';
import styles from './page.module.css';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      try {
        const response = await getOrders();
        setOrders(response.data || []);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className={`container ${styles.empty}`}>
        <h1>My Orders</h1>
        <p>Please sign in to view your orders.</p>
        <Link href="/auth/login?redirect=/orders" className={styles.btn}>Sign In</Link>
      </div>
    );
  }

  if (loading) {
    return <div className="container section"><p>Loading orders...</p></div>;
  }

  if (orders.length === 0) {
    return (
      <div className={`container ${styles.empty}`}>
        <h1>My Orders</h1>
        <p>You haven&apos;t placed any orders yet.</p>
        <Link href="/products" className={styles.btn}>Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container section">
      <h1 className="section-title">My Orders ({orders.length})</h1>
      <div className={styles.orders}>
        {orders.map((order) => (
          <div key={order._id} className={styles.orderCard}>
            <div className={styles.orderHeader}>
              <div>
                <span className={styles.orderNum}>#{order.orderNumber}</span>
                <span className={styles.orderDate}>
                  {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <span className={`${styles.status} ${styles[order.status]}`}>
                {order.status}
              </span>
            </div>
            <div className={styles.orderItems}>
              {order.items.slice(0, 2).map((item, i) => (
                <div key={i} className={styles.orderItem}>
                  <img src={item.image || '/placeholder.jpg'} alt={item.title} />
                  <div>
                    <span>{item.title}</span>
                    <span className={styles.itemDetail}>{item.size} × {item.quantity}</span>
                  </div>
                </div>
              ))}
              {order.items.length > 2 && (
                <p className={styles.moreItems}>+{order.items.length - 2} more items</p>
              )}
            </div>
            <div className={styles.orderFooter}>
              <span className={styles.total}>
                {order.currency === 'INR' ? '₹' : '$'}{order.totalAmount.toLocaleString()}
              </span>
              {order.tracking?.trackingNumber && (
                <span className={styles.tracking}>Tracking: {order.tracking.trackingNumber}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
