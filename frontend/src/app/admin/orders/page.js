'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import fetchAPI from '@/services/api';
import styles from './page.module.css';

const STATUS_OPTIONS = ['', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  const fetchOrders = async (status = '') => {
    setLoading(true);
    try {
      const query = status ? `?status=${status}` : '';
      const response = await fetchAPI(`/admin/orders${query}`);
      setOrders(response.data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetchAPI('/admin/orders/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, []);

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    fetchOrders(status);
  };

  return (
    <div>
      <h1 className={styles.title}>Orders</h1>

      {/* Stats Cards */}
      {stats && (
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{stats.total}</span>
            <span className={styles.statLabel}>Total Orders</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{stats.confirmed}</span>
            <span className={styles.statLabel}>Confirmed</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{stats.processing}</span>
            <span className={styles.statLabel}>Processing</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{stats.shipped}</span>
            <span className={styles.statLabel}>Shipped</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{stats.delivered}</span>
            <span className={styles.statLabel}>Delivered</span>
          </div>
          <div className={`${styles.statCard} ${styles.revenue}`}>
            <span className={styles.statValue}>₹{(stats.revenue || 0).toLocaleString()}</span>
            <span className={styles.statLabel}>Revenue</span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className={styles.filters}>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            className={`${styles.filterBtn} ${filterStatus === s ? styles.filterActive : ''}`}
            onClick={() => handleFilterChange(s)}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      {loading ? (
        <p className={styles.loading}>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className={styles.empty}>No orders found.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td><strong>{order.orderNumber}</strong></td>
                  <td>
                    <span className={styles.customerName}>{order.shippingAddress?.fullName}</span>
                    <br />
                    <span className={styles.customerEmail}>{order.userId?.email}</span>
                  </td>
                  <td>{order.items?.length} items</td>
                  <td><strong>{order.currency === 'INR' ? '₹' : '$'}{order.totalAmount?.toLocaleString()}</strong></td>
                  <td><span className={styles.payBadge}>{order.paymentMethod}</span></td>
                  <td><span className={`${styles.statusBadge} ${styles[order.status]}`}>{order.status}</span></td>
                  <td>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                  <td>
                    <Link href={`/admin/orders/${order._id}`} className={styles.viewBtn}>Manage</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
