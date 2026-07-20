'use client';

import { useEffect, useState } from 'react';
import fetchAPI from '@/services/api';
import styles from './page.module.css';

export default function AdminClientsPage() {
  const [clients, setClients] = useState([]);
  const [catalogues, setCatalogues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [selected, setSelected] = useState([]);
  const [sending, setSending] = useState(false);
  const [sendForm, setSendForm] = useState({ catalogueId: '', subject: '' });
  const [form, setForm] = useState({ name: '', email: '', company: '', country: '', phone: '' });

  const fetchData = async () => {
    try {
      const [clientsRes, cataloguesRes] = await Promise.all([
        fetchAPI('/admin/clients'),
        fetchAPI('/admin/catalogues'),
      ]);
      setClients(clientsRes.data || []);
      setCatalogues(cataloguesRes.data || []);
    } catch (error) {
      console.error('Failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Selection
  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectAll = () => {
    if (selected.length === clients.length) {
      setSelected([]);
    } else {
      setSelected(clients.map(c => c._id));
    }
  };

  // Add client
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await fetchAPI('/admin/clients', { method: 'POST', body: JSON.stringify(form) });
      setShowForm(false);
      setForm({ name: '', email: '', company: '', country: '', phone: '' });
      fetchData();
    } catch (error) {
      alert(error.message);
    }
  };

  // Delete client
  const handleDelete = async (id) => {
    if (!confirm('Delete this client?')) return;
    await fetchAPI(`/admin/clients/${id}`, { method: 'DELETE' });
    setClients(clients.filter(c => c._id !== id));
    setSelected(selected.filter(x => x !== id));
  };

  // Send bulk email
  const handleSend = async () => {
    if (!sendForm.catalogueId || selected.length === 0) return;
    setSending(true);
    try {
      const response = await fetchAPI('/admin/clients/send-email', {
        method: 'POST',
        body: JSON.stringify({
          clientIds: selected,
          catalogueId: sendForm.catalogueId,
          subject: sendForm.subject,
        }),
      });
      alert(response.message);
      setShowSendModal(false);
      setSelected([]);
      fetchData();
    } catch (error) {
      alert('Failed: ' + error.message);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Clients ({clients.length})</h1>
        <div className={styles.headerActions}>
          {selected.length > 0 && (
            <button onClick={() => setShowSendModal(true)} className={styles.sendBtn}>
              Send Email ({selected.length})
            </button>
          )}
          <button onClick={() => setShowForm(!showForm)} className={styles.addBtn}>
            {showForm ? 'Cancel' : '+ Add Client'}
          </button>
        </div>
      </div>

      {/* Add Client Form */}
      {showForm && (
        <form onSubmit={handleAdd} className={styles.form}>
          <div className={styles.formRow}>
            <input placeholder="Name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            <input placeholder="Email *" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            <input placeholder="Company" value={form.company} onChange={e => setForm({...form, company: e.target.value})} />
          </div>
          <div className={styles.formRow}>
            <input placeholder="Country" value={form.country} onChange={e => setForm({...form, country: e.target.value})} />
            <input placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            <button type="submit" className={styles.formSubmit}>Add Client</button>
          </div>
        </form>
      )}

      {/* Selection bar */}
      {selected.length > 0 && (
        <div className={styles.selectionBar}>
          <strong>{selected.length}</strong> client{selected.length > 1 ? 's' : ''} selected
        </div>
      )}

      {/* Clients Table */}
      {clients.length === 0 ? (
        <div className={styles.empty}>No clients yet. Add your buyers and international contacts.</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th><input type="checkbox" className={styles.checkbox} checked={selected.length === clients.length && clients.length > 0} onChange={selectAll} /></th>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Country</th>
                <th>Emails Sent</th>
                <th>Last Emailed</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client._id}>
                  <td><input type="checkbox" className={styles.checkbox} checked={selected.includes(client._id)} onChange={() => toggleSelect(client._id)} /></td>
                  <td className={styles.name}>{client.name}</td>
                  <td className={styles.email}>{client.email}</td>
                  <td>{client.company || '—'}</td>
                  <td>{client.country || '—'}</td>
                  <td>{client.emailCount || 0}</td>
                  <td className={styles.lastMailed}>
                    {client.lastEmailed ? new Date(client.lastEmailed).toLocaleDateString() : 'Never'}
                  </td>
                  <td><button onClick={() => handleDelete(client._id)} className={styles.deleteBtn}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Send Email Modal */}
      {showSendModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Send Catalogue Email</h3>
            <p>Send to <strong>{selected.length}</strong> selected client{selected.length > 1 ? 's' : ''}. Each will receive a personalized email with their name.</p>

            <div className={styles.modalField}>
              <label>Select Catalogue *</label>
              <select value={sendForm.catalogueId} onChange={e => setSendForm({...sendForm, catalogueId: e.target.value})}>
                <option value="">Choose a catalogue...</option>
                {catalogues.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.title} ({cat.pages?.length} pages)</option>
                ))}
              </select>
            </div>

            <div className={styles.modalField}>
              <label>Email Subject (optional — defaults to catalogue title)</label>
              <input
                value={sendForm.subject}
                onChange={e => setSendForm({...sendForm, subject: e.target.value})}
                placeholder="e.g., A Cuddle of Comfort — New Collection"
              />
            </div>

            <div className={styles.modalActions}>
              <button onClick={() => setShowSendModal(false)} className={styles.cancelBtn}>Cancel</button>
              <button onClick={handleSend} disabled={!sendForm.catalogueId || sending} className={styles.confirmBtn}>
                {sending ? 'Sending...' : `Send to ${selected.length} Client${selected.length > 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
