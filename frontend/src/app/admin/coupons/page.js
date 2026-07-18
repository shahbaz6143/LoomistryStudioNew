'use client';

import { useEffect, useState } from 'react';
import { getAdminCoupons, createCoupon, deleteCoupon, toggleCoupon } from '@/services/admin.service';
import styles from './page.module.css';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minOrderAmount: '',
    maxDiscount: '',
    expiresAt: '',
    usageLimit: '',
  });

  const fetchCoupons = async () => {
    try {
      const response = await getAdminCoupons();
      setCoupons(response.data || []);
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createCoupon({
        code: form.code,
        type: form.type,
        value: Number(form.value),
        minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : 0,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
        expiresAt: form.expiresAt,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
      });
      setShowForm(false);
      setForm({ code: '', type: 'percentage', value: '', minOrderAmount: '', maxDiscount: '', expiresAt: '', usageLimit: '' });
      fetchCoupons();
    } catch (error) {
      alert('Failed: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this coupon?')) return;
    await deleteCoupon(id);
    setCoupons(coupons.filter(c => c._id !== id));
  };

  const handleToggle = async (id) => {
    const response = await toggleCoupon(id);
    setCoupons(coupons.map(c => c._id === id ? response.data : c));
  };

  if (loading) return <p>Loading coupons...</p>;

  return (
    <div>
      <div className={styles.header}>
        <h1>Coupons ({coupons.length})</h1>
        <button onClick={() => setShowForm(!showForm)} className={styles.addBtn}>
          {showForm ? 'Cancel' : '+ Create Coupon'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className={styles.form}>
          <div className={styles.row}>
            <input placeholder="Code (e.g., WELCOME20)" value={form.code} onChange={e => setForm({...form, code: e.target.value})} required />
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
              <option value="percentage">Percentage (%)</option>
              <option value="flat">Flat (₹)</option>
            </select>
            <input type="number" placeholder="Value" value={form.value} onChange={e => setForm({...form, value: e.target.value})} required />
          </div>
          <div className={styles.row}>
            <input type="number" placeholder="Min Order ₹ (optional)" value={form.minOrderAmount} onChange={e => setForm({...form, minOrderAmount: e.target.value})} />
            <input type="number" placeholder="Max Discount ₹ (optional)" value={form.maxDiscount} onChange={e => setForm({...form, maxDiscount: e.target.value})} />
            <input type="number" placeholder="Usage Limit (optional)" value={form.usageLimit} onChange={e => setForm({...form, usageLimit: e.target.value})} />
          </div>
          <div className={styles.row}>
            <input type="date" value={form.expiresAt} onChange={e => setForm({...form, expiresAt: e.target.value})} required />
            <button type="submit" className={styles.submitBtn}>Create Coupon</button>
          </div>
        </form>
      )}

      {coupons.length === 0 ? (
        <p className={styles.empty}>No coupons yet. Create your first one!</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Code</th>
                <th>Type</th>
                <th>Value</th>
                <th>Min Order</th>
                <th>Expires</th>
                <th>Used</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(coupon => (
                <tr key={coupon._id}>
                  <td><strong>{coupon.code}</strong></td>
                  <td>{coupon.type}</td>
                  <td>{coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}{coupon.maxDiscount ? ` (max ₹${coupon.maxDiscount})` : ''}</td>
                  <td>{coupon.minOrderAmount ? `₹${coupon.minOrderAmount.toLocaleString()}` : '—'}</td>
                  <td>{new Date(coupon.expiresAt).toLocaleDateString()}</td>
                  <td>{coupon.usedCount}{coupon.usageLimit ? `/${coupon.usageLimit}` : ''}</td>
                  <td>
                    <button onClick={() => handleToggle(coupon._id)} className={`${styles.statusBadge} ${coupon.isActive ? styles.active : styles.inactive}`}>
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(coupon._id)} className={styles.deleteBtn}>Delete</button>
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
