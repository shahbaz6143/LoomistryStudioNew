'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getOrderByNumber } from '@/services/order.service';
import styles from './page.module.css';

const STATUS_FLOW = ['confirmed', 'processing', 'shipped', 'delivered'];

export default function BuyerOrderDetailPage({ params }) {
  const router = useRouter();
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

  if (loading) return <div className={styles.page}><p>Loading order...</p></div>;
  if (!order) return <div className={styles.page}><p>Order not found.</p></div>;

  const currentStepIndex = STATUS_FLOW.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';
  const sym = order.currency === 'INR' ? '₹' : '$';

  return (
    <div className={styles.page}>
      <button onClick={() => router.push('/orders')} className={styles.backBtn}>&larr; My Orders</button>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Order #{order.orderNumber}</h1>
          <p className={styles.date}>
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <span className={`${styles.statusBadge} ${styles[order.status]}`}>{order.status}</span>
      </div>

      {/* Status Timeline */}
      {!isCancelled && (
        <div className={styles.timeline}>
          {STATUS_FLOW.map((step, i) => (
            <div
              key={step}
              className={`${styles.step} ${i < currentStepIndex ? styles.stepActive : ''} ${i === currentStepIndex ? styles.stepCurrent : ''}`}
            >
              <div className={styles.stepDot}>
                {i <= currentStepIndex ? '✓' : ''}
              </div>
              <span className={styles.stepLabel}>{step}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tracking Info */}
      {order.tracking?.trackingNumber && (
        <div className={styles.section}>
          <h3>Tracking Information</h3>
          <div className={styles.trackingInfo}>
            {order.tracking.courierName && (
              <div>
                <span>Courier</span>
                <strong>{order.tracking.courierName}</strong>
              </div>
            )}
            <div>
              <span>Tracking Number</span>
              <strong>{order.tracking.trackingNumber}</strong>
            </div>
            {order.tracking.trackingUrl && (
              <div>
                <span>Track Package</span>
                <a href={order.tracking.trackingUrl} target="_blank" rel="noopener noreferrer" className={styles.trackingLink}>
                  Track here &rarr;
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Items */}
      <div className={styles.section}>
        <h3>Items Ordered</h3>
        {order.items.map((item, i) => (
          <div key={i} className={styles.item}>
            <img src={item.image || '/placeholder.jpg'} alt={item.title} className={styles.itemImg} />
            <div className={styles.itemInfo}>
              <strong>{item.title}</strong>
              <span>{item.size} {item.color && `• ${item.color}`} • Qty: {item.quantity}</span>
            </div>
            <span className={styles.itemPrice}>{sym}{item.price.toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* Shipping Address */}
      <div className={styles.section}>
        <h3>Shipping Address</h3>
        <p className={styles.address}>
          {order.shippingAddress.fullName}<br />
          {order.shippingAddress.addressLine1}<br />
          {order.shippingAddress.addressLine2 && <>{order.shippingAddress.addressLine2}<br /></>}
          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
          {order.shippingAddress.country}<br />
          Phone: {order.shippingAddress.phone}
        </p>
      </div>

      {/* Payment */}
      <div className={styles.section}>
        <h3>Payment Summary</h3>
        <div className={styles.trackingInfo}>
          <div><span>Method</span><strong style={{ textTransform: 'capitalize' }}>{order.paymentMethod}</strong></div>
          <div><span>Status</span><strong style={{ color: 'var(--success)' }}>{order.paymentStatus}</strong></div>
          <div><span>Total Paid</span><strong>{sym}{order.totalAmount.toLocaleString()}</strong></div>
        </div>
      </div>
    </div>
  );
}
