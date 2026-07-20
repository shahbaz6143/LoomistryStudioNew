'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import fetchAPI from '@/services/api';
import styles from './page.module.css';

const STATUSES = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrderDetailPage({ params }) {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [tracking, setTracking] = useState({ courierName: '', trackingNumber: '', trackingUrl: '' });

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await fetchAPI(`/admin/orders/${params.id}`);
        setOrder(response.data);
        if (response.data.tracking) {
          setTracking({
            courierName: response.data.tracking.courierName || '',
            trackingNumber: response.data.tracking.trackingNumber || '',
            trackingUrl: response.data.tracking.trackingUrl || '',
          });
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [params.id]);

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      const response = await fetchAPI(`/admin/orders/${params.id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      setOrder(response.data);
    } catch (error) {
      alert('Failed: ' + error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleTrackingUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetchAPI(`/admin/orders/${params.id}/tracking`, {
        method: 'PUT',
        body: JSON.stringify(tracking),
      });
      setOrder(response.data);
      alert('Tracking info updated!');
    } catch (error) {
      alert('Failed: ' + error.message);
    }
  };

  if (loading) return <p>Loading order...</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <div>
      <button onClick={() => router.push('/admin/orders')} className={styles.backBtn}>&larr; All Orders</button>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Order #{order.orderNumber}</h1>
          <p className={styles.date}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <span className={`${styles.statusBadge} ${styles[order.status]}`}>{order.status}</span>
      </div>

      <div className={styles.grid}>
        {/* Left Column */}
        <div>
          {/* Items */}
          <div className={styles.section}>
            <h2>Items ({order.items.length})</h2>
            {order.items.map((item, i) => (
              <div key={i} className={styles.item}>
                <img src={item.image || '/placeholder.jpg'} alt={item.title} className={styles.itemImg} />
                <div className={styles.itemInfo}>
                  <strong>{item.title}</strong>
                  <span>{item.size} {item.color && `• ${item.color}`} • Qty: {item.quantity}</span>
                </div>
                <span className={styles.itemPrice}>{order.currency === 'INR' ? '₹' : '$'}{item.price.toLocaleString()}</span>
              </div>
            ))}
            <div className={styles.totals}>
              <div><span>Subtotal</span><span>{order.currency === 'INR' ? '₹' : '$'}{order.subtotal.toLocaleString()}</span></div>
              {order.discount > 0 && <div className={styles.discount}><span>Discount</span><span>-{order.currency === 'INR' ? '₹' : '$'}{order.discount.toLocaleString()}</span></div>}
              <div className={styles.totalRow}><span>Total</span><span>{order.currency === 'INR' ? '₹' : '$'}{order.totalAmount.toLocaleString()}</span></div>
            </div>
          </div>

          {/* Tracking */}
          <div className={styles.section}>
            <h2>Tracking Info</h2>
            <form onSubmit={handleTrackingUpdate} className={styles.trackingForm}>
              <input placeholder="Courier Name (e.g., Delhivery, FedEx)" value={tracking.courierName} onChange={e => setTracking({...tracking, courierName: e.target.value})} />
              <input placeholder="Tracking Number" value={tracking.trackingNumber} onChange={e => setTracking({...tracking, trackingNumber: e.target.value})} />
              <input placeholder="Tracking URL (optional)" value={tracking.trackingUrl} onChange={e => setTracking({...tracking, trackingUrl: e.target.value})} />
              <button type="submit" className={styles.saveBtn}>Save Tracking</button>
            </form>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Status Update */}
          <div className={styles.section}>
            <h2>Update Status</h2>
            <div className={styles.statusButtons}>
              {STATUSES.map((s) => (
                <button
                  key={s}
                  className={`${styles.statusBtn} ${order.status === s ? styles.statusBtnActive : ''}`}
                  onClick={() => handleStatusUpdate(s)}
                  disabled={updating || order.status === s}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Customer */}
          <div className={styles.section}>
            <h2>Customer</h2>
            <p className={styles.customerName}>{order.userId?.name || order.shippingAddress.fullName}</p>
            <p className={styles.customerDetail}>{order.userId?.email}</p>
            <p className={styles.customerDetail}>{order.shippingAddress.phone}</p>
          </div>

          {/* Shipping Address */}
          <div className={styles.section}>
            <h2>Shipping Address</h2>
            <p className={styles.address}>
              {order.shippingAddress.fullName}<br />
              {order.shippingAddress.addressLine1}<br />
              {order.shippingAddress.addressLine2 && <>{order.shippingAddress.addressLine2}<br /></>}
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
              {order.shippingAddress.country}
            </p>
          </div>

          {/* Payment */}
          <div className={styles.section}>
            <h2>Payment</h2>
            <p><strong>Method:</strong> {order.paymentMethod}</p>
            <p><strong>Status:</strong> {order.paymentStatus}</p>
            {order.paymentId && <p><strong>ID:</strong> <code>{order.paymentId}</code></p>}
          </div>
        </div>
      </div>
    </div>
  );
}
