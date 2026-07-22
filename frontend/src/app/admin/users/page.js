'use client';

import { useEffect, useState } from 'react';
import fetchAPI from '@/services/api';
import styles from './page.module.css';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetchAPI('/admin/users');
        setUsers(res.data || []);
      } catch (error) {
        console.error('Failed:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;

  const buyers = users.filter(u => u.role === 'buyer');
  const admins = users.filter(u => u.role !== 'buyer');

  return (
    <div>
      <h1 className={styles.title}>Users & Buyers ({users.length})</h1>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{users.length}</span>
          <span className={styles.statLabel}>Total Users</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{buyers.length}</span>
          <span className={styles.statLabel}>Buyers</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{admins.length}</span>
          <span className={styles.statLabel}>Admin / Editor</span>
        </div>
      </div>

      {/* Users Table */}
      {users.length === 0 ? (
        <p className={styles.empty}>No users yet.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Provider</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className={styles.userCell}>
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className={styles.avatar} />
                      ) : (
                        <span className={styles.avatarFallback}>{user.name?.charAt(0).toUpperCase()}</span>
                      )}
                      <span className={styles.name}>{user.name}</span>
                    </div>
                  </td>
                  <td className={styles.email}>{user.email}</td>
                  <td><span className={styles.provider}>{user.authProvider}</span></td>
                  <td><span className={`${styles.role} ${styles[user.role]}`}>{user.role}</span></td>
                  <td className={styles.date}>{new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
