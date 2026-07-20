'use client';

import { useEffect, useState } from 'react';
import fetchAPI from '@/services/api';
import { uploadImages } from '@/services/admin.service';
import styles from './page.module.css';

export default function AdminCataloguesPage() {
  const [catalogues, setCatalogues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sendModal, setSendModal] = useState(null);
  const [emailList, setEmailList] = useState('');
  const [form, setForm] = useState({ title: '', description: '', pages: [] });

  const fetchCatalogues = async () => {
    try {
      const response = await fetchAPI('/admin/catalogues');
      setCatalogues(response.data || []);
    } catch (error) {
      console.error('Failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCatalogues(); }, []);

  const handleUploadPages = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const response = await uploadImages(files);
      setForm((prev) => ({ ...prev, pages: [...prev.pages, ...response.data] }));
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const removePage = (index) => {
    setForm((prev) => ({ ...prev, pages: prev.pages.filter((_, i) => i !== index) }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || form.pages.length === 0) {
      alert('Title and at least one page image are required');
      return;
    }
    try {
      await fetchAPI('/admin/catalogues', {
        method: 'POST',
        body: JSON.stringify({ title: form.title, description: form.description, pages: form.pages, coverImage: form.pages[0] }),
      });
      setShowForm(false);
      setForm({ title: '', description: '', pages: [] });
      fetchCatalogues();
    } catch (error) {
      alert('Failed: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this catalogue?')) return;
    await fetchAPI(`/admin/catalogues/${id}`, { method: 'DELETE' });
    setCatalogues(catalogues.filter(c => c._id !== id));
  };

  const handleSend = async () => {
    if (!emailList.trim()) return;
    const emails = emailList.split(',').map(e => e.trim()).filter(Boolean);
    try {
      const response = await fetchAPI(`/admin/catalogues/${sendModal._id}/send`, {
        method: 'POST',
        body: JSON.stringify({ emails }),
      });
      alert(response.message);
      setSendModal(null);
      setEmailList('');
      fetchCatalogues();
    } catch (error) {
      alert('Failed: ' + error.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Catalogues</h1>
        <button onClick={() => setShowForm(!showForm)} className={styles.addBtn}>
          {showForm ? 'Cancel' : '+ New Catalogue'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleCreate} className={styles.form}>
          <div className={styles.field}>
            <label>Catalogue Title *</label>
            <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="e.g., A Cuddle of Comfort" required />
          </div>
          <div className={styles.field}>
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="Brief description for the email..." rows={2} />
          </div>
          <div className={styles.field}>
            <label>Upload Pages (images — each image = one page)</label>
            <input type="file" accept="image/*" multiple onChange={handleUploadPages} disabled={uploading} />
            {uploading && <p className={styles.hint}>Uploading pages...</p>}
          </div>
          {form.pages.length > 0 && (
            <div className={styles.pagesPreview}>
              {form.pages.map((url, i) => (
                <div key={i} className={styles.pageThumb}>
                  <img src={url} alt={`Page ${i + 1}`} />
                  <span className={styles.pageNum}>P{i + 1}</span>
                  <button type="button" onClick={() => removePage(i)} className={styles.removeBtn}>&times;</button>
                </div>
              ))}
            </div>
          )}
          <button type="submit" className={styles.submitBtn}>Create Catalogue ({form.pages.length} pages)</button>
        </form>
      )}

      {/* Catalogues List */}
      {catalogues.length === 0 ? (
        <p className={styles.empty}>No catalogues yet. Create one to share with clients.</p>
      ) : (
        <div className={styles.list}>
          {catalogues.map((cat) => (
            <div key={cat._id} className={styles.card}>
              <div className={styles.cardImg}>
                <img src={cat.coverImage || cat.pages?.[0]} alt={cat.title} />
              </div>
              <div className={styles.cardInfo}>
                <h3>{cat.title}</h3>
                <p>{cat.pages?.length} pages &middot; Sent to {cat.sentTo?.length || 0} clients</p>
                <p className={styles.slug}>loomistrystudio.com/catalogue/{cat.slug}</p>
              </div>
              <div className={styles.cardActions}>
                <a href={`/catalogue/${cat.slug}`} target="_blank" className={styles.viewBtn}>View</a>
                <button onClick={() => { setSendModal(cat); setEmailList(''); }} className={styles.sendBtn}>Send to Client</button>
                <button onClick={() => handleDelete(cat._id)} className={styles.deleteBtn}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Send Modal */}
      {sendModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Send &ldquo;{sendModal.title}&rdquo; to Clients</h3>
            <p>Enter email addresses separated by commas:</p>
            <textarea
              value={emailList}
              onChange={(e) => setEmailList(e.target.value)}
              placeholder="client1@example.com, client2@company.com"
              rows={3}
            />
            <div className={styles.modalActions}>
              <button onClick={() => setSendModal(null)} className={styles.cancelBtn}>Cancel</button>
              <button onClick={handleSend} className={styles.confirmBtn}>Send Email</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
