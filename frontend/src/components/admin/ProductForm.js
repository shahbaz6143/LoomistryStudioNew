'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct, updateProduct, getAdminProduct, uploadImages, uploadVideo } from '@/services/admin.service';
import styles from './ProductForm.module.css';

const CATEGORIES = [
  'hand-knotted', 'hand-tufted', 'flatweave', 'persian',
  'abstract', 'traditional', 'modern', 'runner',
];

const COLLECTIONS = [
  'bestsellers', 'new-arrivals', 'living-room',
  'bedroom', 'dining-room', 'deal-of-the-week',
];

const SHAPES = ['rectangle', 'round', 'square', 'runner', 'oval'];

const EMPTY_SIZE = { label: '', width: '', height: '', priceINR: '', priceUSD: '', stock: '' };

export default function ProductForm({ mode = 'create', productId = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    images: [],
    video: '',
    category: '',
    collections: [],
    fixedSizes: [{ ...EMPTY_SIZE }],
    customSizePrice: { pricePerSqFtINR: '', pricePerSqFtUSD: '', minWidth: 2, maxWidth: 15, minHeight: 2, maxHeight: 20 },
    hasCustomSize: false,
    colors: '',
    variations: '',
    material: '',
    shape: 'rectangle',
    stock: 0,
    isActive: true,
  });

  // Load product data for edit mode
  useEffect(() => {
    if (mode === 'edit' && productId) {
      async function loadProduct() {
        try {
          const response = await getAdminProduct(productId);
          const p = response.data;
          setForm({
            title: p.title || '',
            description: p.description || '',
            images: p.images || [],
            video: p.video || '',
            category: p.category || '',
            collections: p.collections || [],
            fixedSizes: p.fixedSizes?.length > 0 ? p.fixedSizes : [{ ...EMPTY_SIZE }],
            customSizePrice: p.customSizePrice || { pricePerSqFtINR: '', pricePerSqFtUSD: '', minWidth: 2, maxWidth: 15, minHeight: 2, maxHeight: 20 },
            hasCustomSize: !!p.customSizePrice,
            colors: (p.colors || []).join(', '),
            variations: (p.variations || []).join(', '),
            material: p.material || '',
            shape: p.shape || 'rectangle',
            stock: p.stock || 0,
            isActive: p.isActive !== false,
          });
        } catch (error) {
          alert('Failed to load product: ' + error.message);
        }
      }
      loadProduct();
    }
  }, [mode, productId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCollectionToggle = (slug) => {
    setForm((prev) => ({
      ...prev,
      collections: prev.collections.includes(slug)
        ? prev.collections.filter((c) => c !== slug)
        : [...prev.collections, slug],
    }));
  };

  // Fixed sizes management
  const handleSizeChange = (index, field, value) => {
    const updated = [...form.fixedSizes];
    updated[index] = { ...updated[index], [field]: value };
    setForm((prev) => ({ ...prev, fixedSizes: updated }));
  };

  const addSize = () => {
    setForm((prev) => ({ ...prev, fixedSizes: [...prev.fixedSizes, { ...EMPTY_SIZE }] }));
  };

  const removeSize = (index) => {
    setForm((prev) => ({ ...prev, fixedSizes: prev.fixedSizes.filter((_, i) => i !== index) }));
  };

  // Custom size pricing
  const handleCustomPriceChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      customSizePrice: { ...prev.customSizePrice, [field]: value },
    }));
  };

  // Image upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const response = await uploadImages(files);
      setForm((prev) => ({ ...prev, images: [...prev.images, ...response.data] }));
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  // Video upload
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await uploadVideo(file);
      setForm((prev) => ({ ...prev, video: response.data }));
    } catch (error) {
      alert('Video upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: form.title,
        description: form.description,
        images: form.images,
        video: form.video || null,
        category: form.category,
        collections: form.collections,
        fixedSizes: form.fixedSizes
          .filter((s) => s.label && s.priceINR)
          .map((s) => ({
            label: s.label,
            width: Number(s.width),
            height: Number(s.height),
            priceINR: Number(s.priceINR),
            priceUSD: Number(s.priceUSD),
            stock: Number(s.stock) || 0,
          })),
        customSizePrice: form.hasCustomSize
          ? {
              pricePerSqFtINR: Number(form.customSizePrice.pricePerSqFtINR),
              pricePerSqFtUSD: Number(form.customSizePrice.pricePerSqFtUSD),
              minWidth: Number(form.customSizePrice.minWidth),
              maxWidth: Number(form.customSizePrice.maxWidth),
              minHeight: Number(form.customSizePrice.minHeight),
              maxHeight: Number(form.customSizePrice.maxHeight),
            }
          : null,
        colors: form.colors.split(',').map((c) => c.trim()).filter(Boolean),
        variations: form.variations.split(',').map((v) => v.trim()).filter(Boolean),
        material: form.material,
        shape: form.shape,
        stock: Number(form.stock),
        isActive: form.isActive,
      };

      if (mode === 'edit') {
        await updateProduct(productId, payload);
      } else {
        await createProduct(payload);
      }

      router.push('/admin/products');
    } catch (error) {
      alert('Failed to save: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>
        {mode === 'edit' ? 'Edit Product' : 'Add New Product'}
      </h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Basic Info */}
        <section className={styles.section}>
          <h2>Basic Information</h2>
          <div className={styles.field}>
            <label>Product Title *</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} required placeholder="e.g., Royal Persian Heritage Rug" />
          </div>
          <div className={styles.field}>
            <label>Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={4} placeholder="Describe the product in detail..." />
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange} required>
                <option value="">Select category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat.replace('-', ' ')}</option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label>Material *</label>
              <input type="text" name="material" value={form.material} onChange={handleChange} required placeholder="e.g., Wool, Silk & Wool" />
            </div>
            <div className={styles.field}>
              <label>Shape</label>
              <select name="shape" value={form.shape} onChange={handleChange}>
                {SHAPES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.field}>
            <label>Collections</label>
            <div className={styles.checkboxGroup}>
              {COLLECTIONS.map((col) => (
                <label key={col} className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={form.collections.includes(col)}
                    onChange={() => handleCollectionToggle(col)}
                  />
                  {col.replace(/-/g, ' ')}
                </label>
              ))}
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Colors (comma-separated)</label>
              <input type="text" name="colors" value={form.colors} onChange={handleChange} placeholder="Red, Navy Blue, Ivory" />
            </div>
            <div className={styles.field}>
              <label>Variations (comma-separated)</label>
              <input type="text" name="variations" value={form.variations} onChange={handleChange} placeholder="With Fringe, Without Fringe" />
            </div>
          </div>
        </section>

        {/* Media */}
        <section className={styles.section}>
          <h2>Media</h2>
          <div className={styles.field}>
            <label>Product Images</label>
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} />
            {uploading && <p className={styles.hint}>Uploading...</p>}
            {form.images.length > 0 && (
              <div className={styles.imageGrid}>
                {form.images.map((url, i) => (
                  <div key={i} className={styles.imageItem}>
                    <img src={url} alt={`Product ${i + 1}`} />
                    <button type="button" onClick={() => removeImage(i)} className={styles.removeImg}>&times;</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={styles.field}>
            <label>Product Video (optional)</label>
            <input type="file" accept="video/*" onChange={handleVideoUpload} disabled={uploading} />
            {form.video && <p className={styles.hint}>Video uploaded: {form.video.split('/').pop()}</p>}
          </div>
        </section>

        {/* Pricing & Sizes */}
        <section className={styles.section}>
          <h2>Pricing &amp; Sizes</h2>
          <p className={styles.hint}>Add fixed sizes with individual INR and USD pricing.</p>

          {form.fixedSizes.map((size, index) => (
            <div key={index} className={styles.sizeRow}>
              <input type="text" placeholder="Label (e.g., 5x7 ft)" value={size.label} onChange={(e) => handleSizeChange(index, 'label', e.target.value)} />
              <input type="number" placeholder="Width" value={size.width} onChange={(e) => handleSizeChange(index, 'width', e.target.value)} />
              <input type="number" placeholder="Height" value={size.height} onChange={(e) => handleSizeChange(index, 'height', e.target.value)} />
              <input type="number" placeholder="₹ INR" value={size.priceINR} onChange={(e) => handleSizeChange(index, 'priceINR', e.target.value)} />
              <input type="number" placeholder="$ USD" value={size.priceUSD} onChange={(e) => handleSizeChange(index, 'priceUSD', e.target.value)} />
              <input type="number" placeholder="Stock" value={size.stock} onChange={(e) => handleSizeChange(index, 'stock', e.target.value)} />
              {form.fixedSizes.length > 1 && (
                <button type="button" onClick={() => removeSize(index)} className={styles.removeSizeBtn}>&times;</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addSize} className={styles.addSizeBtn}>+ Add Size</button>

          {/* Custom Size */}
          <div className={styles.field} style={{ marginTop: '1.5rem' }}>
            <label className={styles.checkbox}>
              <input type="checkbox" name="hasCustomSize" checked={form.hasCustomSize} onChange={handleChange} />
              Enable custom size pricing (per sq ft)
            </label>
          </div>
          {form.hasCustomSize && (
            <div className={styles.row}>
              <div className={styles.field}>
                <label>₹ per sq ft (INR)</label>
                <input type="number" value={form.customSizePrice.pricePerSqFtINR} onChange={(e) => handleCustomPriceChange('pricePerSqFtINR', e.target.value)} />
              </div>
              <div className={styles.field}>
                <label>$ per sq ft (USD)</label>
                <input type="number" value={form.customSizePrice.pricePerSqFtUSD} onChange={(e) => handleCustomPriceChange('pricePerSqFtUSD', e.target.value)} />
              </div>
              <div className={styles.field}>
                <label>Min Width (ft)</label>
                <input type="number" value={form.customSizePrice.minWidth} onChange={(e) => handleCustomPriceChange('minWidth', e.target.value)} />
              </div>
              <div className={styles.field}>
                <label>Max Width (ft)</label>
                <input type="number" value={form.customSizePrice.maxWidth} onChange={(e) => handleCustomPriceChange('maxWidth', e.target.value)} />
              </div>
            </div>
          )}
        </section>

        {/* Stock & Status */}
        <section className={styles.section}>
          <h2>Stock &amp; Status</h2>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Total Stock</label>
              <input type="number" name="stock" value={form.stock} onChange={handleChange} min="0" />
            </div>
            <div className={styles.field}>
              <label className={styles.checkbox}>
                <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
                Product is active (visible on storefront)
              </label>
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className={styles.submitRow}>
          <button type="button" onClick={() => router.push('/admin/products')} className={styles.cancelBtn}>
            Cancel
          </button>
          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Saving...' : mode === 'edit' ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
