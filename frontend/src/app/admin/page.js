'use client';

import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className={styles.title}>Welcome, {user?.name?.split(' ')[0]}</h1>
      <p className={styles.subtitle}>Manage your products, orders, and more from here.</p>

      <div className={styles.cards}>
        <div className={styles.card}>
          <h3>Products</h3>
          <p>Create, edit, and manage your rug collection</p>
        </div>
        <div className={styles.card}>
          <h3>Orders</h3>
          <p>View and fulfill customer orders</p>
        </div>
        <div className={styles.card}>
          <h3>Media</h3>
          <p>Upload and manage product images and videos</p>
        </div>
      </div>
    </div>
  );
}
