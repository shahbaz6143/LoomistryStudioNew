'use client';

import { useEffect, useState } from 'react';
import fetchAPI from '@/services/api';
import { useToast } from '@/components/ui/Toast';
import styles from './page.module.css';

export default function AdminTeamPage() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: '', role: 'editor' });
  const { showToast, confirm } = useToast();

  const fetchTeam = async () => {
    try {
      const res = await fetchAPI('/admin/users');
      setTeam((res.data || []).filter(u => u.role === 'admin' || u.role === 'editor'));
    } catch (error) {
      console.error('Failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTeam(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.email.trim()) return;

    try {
      await fetchAPI(`/admin/team/invite`, {
        method: 'POST',
        body: JSON.stringify({ email: form.email, role: form.role }),
      });
      showToast({ title: 'Team Member Added', message: `${form.email} has been given "${form.role}" access. They can now access the CMS after logging in.` });
      setShowForm(false);
      setForm({ email: '', role: 'editor' });
      fetchTeam();
    } catch (error) {
      showToast({ title: 'Error', message: error.message });
    }
  };

  const handleRemove = (member) => {
    confirm({
      title: 'Remove Team Member',
      message: `Remove "${member.name || member.email}" from the team? They will lose CMS access.`,
      confirmText: 'Remove',
      onConfirm: async () => {
        try {
          await fetchAPI(`/admin/users/${member._id}/role`, {
            method: 'PUT',
            body: JSON.stringify({ role: 'buyer' }),
          });
          showToast({ title: 'Removed', message: `${member.name || member.email} has been removed from the team.` });
          fetchTeam();
        } catch (error) {
          showToast({ title: 'Error', message: error.message });
        }
      },
    });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Team Management</h1>
          <p className={styles.subtitle}>Add admins or editors who can manage your CMS panel.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className={styles.addBtn}>
          {showForm ? 'Cancel' : '+ Add Team Member'}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleAdd} className={styles.form}>
          <h3>Add a Team Member</h3>
          <p className={styles.formHint}>Enter the email of the person you want to grant CMS access. They must have an account (signed up via Google/Facebook/Twitter).</p>
          <div className={styles.formRow}>
            <input
              type="email"
              placeholder="team@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className={styles.emailInput}
            />
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={styles.roleSelect}>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" className={styles.inviteBtn}>Add</button>
          </div>
          <div className={styles.roleInfo}>
            <div className={styles.roleCard}>
              <h4>Editor</h4>
              <p>Can add/edit products, manage media, view orders. Cannot delete products, manage team, or access settings.</p>
            </div>
            <div className={styles.roleCard}>
              <h4>Admin</h4>
              <p>Full access — manage products, orders, coupons, team, settings. Can delete anything.</p>
            </div>
          </div>
        </form>
      )}

      {/* Team List */}
      {team.length === 0 ? (
        <p className={styles.empty}>No team members yet. You are the only admin.</p>
      ) : (
        <div className={styles.list}>
          {team.map((member) => (
            <div key={member._id} className={styles.card}>
              <div className={styles.cardLeft}>
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} className={styles.avatar} />
                ) : (
                  <span className={styles.avatarFallback}>{(member.name || member.email).charAt(0).toUpperCase()}</span>
                )}
                <div className={styles.cardInfo}>
                  <h4>{member.name || 'Unnamed'}</h4>
                  <p>{member.email}</p>
                </div>
              </div>
              <div className={styles.cardRight}>
                <span className={`${styles.badge} ${styles[member.role]}`}>{member.role}</span>
                <button onClick={() => handleRemove(member)} className={styles.removeBtn}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
