'use client';

import { useEffect, useState } from 'react';
import fetchAPI from '@/services/api';
import { uploadImages } from '@/services/admin.service';
import styles from './page.module.css';

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    brand_name: '',
    brand_logo: '',
    brand_logo_dark: '',
    brand_tagline: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function fetch() {
      try {
        const res = await fetchAPI('/admin/settings');
        const data = res.data || {};
        setForm({
          brand_name: data.brand_name || 'LoomistryStudio',
          brand_logo: data.brand_logo || '/logo.png',
          brand_logo_dark: data.brand_logo_dark || '/logo.png',
          brand_tagline: data.brand_tagline || 'Premium Handmade Rugs & Carpets',
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  const handleLogoUpload = async (e, field) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const res = await uploadImages(files);
      setForm((prev) => ({ ...prev, [field]: res.data[0] }));
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetchAPI('/admin/settings/branding', {
        method: 'PUT',
        body: JSON.stringify({
          name: form.brand_name,
          logo: form.brand_logo,
          logoDark: form.brand_logo_dark,
          tagline: form.brand_tagline,
        }),
      });
      alert('Branding saved! Refresh the site to see changes.');
    } catch (err) {
      alert('Failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading settings...</p>;

  return (
    <div>
      <h1 className={styles.title}>Settings — Branding</h1>
      <p className={styles.subtitle}>Change your brand name and logo here. Changes apply site-wide.</p>

      <div className={styles.card}>
        <div className={styles.field}>
          <label>Brand Name</label>
          <input value={form.brand_name} onChange={(e) => setForm({ ...form, brand_name: e.target.value })} placeholder="LoomistryStudio" />
        </div>

        <div className={styles.field}>
          <label>Tagline</label>
          <input value={form.brand_tagline} onChange={(e) => setForm({ ...form, brand_tagline: e.target.value })} placeholder="Premium Handmade Rugs & Carpets" />
        </div>

        <div className={styles.field}>
          <label>Logo (Light Background)</label>
          <div className={styles.logoRow}>
            {form.brand_logo && <img src={form.brand_logo} alt="Logo" className={styles.logoPreview} />}
            <input type="file" accept="image/*" onChange={(e) => handleLogoUpload(e, 'brand_logo')} disabled={uploading} />
          </div>
        </div>

        <div className={styles.field}>
          <label>Logo (Dark Background)</label>
          <div className={styles.logoRow}>
            {form.brand_logo_dark && <img src={form.brand_logo_dark} alt="Logo Dark" className={styles.logoPreviewDark} />}
            <input type="file" accept="image/*" onChange={(e) => handleLogoUpload(e, 'brand_logo_dark')} disabled={uploading} />
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className={styles.saveBtn}>
          {saving ? 'Saving...' : 'Save Branding'}
        </button>
      </div>
    </div>
  );
}
