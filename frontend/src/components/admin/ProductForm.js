'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct, updateProduct, getAdminProduct } from '@/services/admin.service';
import styles from './ProductForm.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const CATEGORIES = [
  'hand-knotted', 'hand-tufted', 'flatweave', 'persian',
  'abstract', 'traditional', 'modern', 'runner',
];

const COLLECTIONS = [
  'bestsellers', 'new-arrivals', 'living-room',
  'bedroom', 'dining-room', 'kids-room', 'deal-of-the-week',
];

const SHAPES = ['rectangle', 'round', 'square', 'runner', 'oval'];
const PATTERNS = ['solid', 'geometric', 'floral', 'abstract', 'striped', 'medallion', 'bohemian', 'moroccan', 'paisley', 'chevron'];
const MATERIALS = ['Wool', 'Silk', 'Cotton', 'Jute', 'Viscose', 'Wool & Viscose', 'Silk & Wool', 'Polyester', 'Bamboo Silk'];

const EMPTY_SIZE = { label: '', width: '', height: '', priceINR: '', priceUSD: '', stock: '' };
const MAX_IMAGES = 20;
const MAX_VIDEO_DURATION = 60; // seconds

export default function ProductForm({ mode = 'create', productId = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [errors, setErrors] = useState({});
  const videoInputRef = useRef(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    images: [],
    thumbnail: 0,
    video: '',
    category: '',
    collections: [],
    fixedSizes: [{ ...EMPTY_SIZE }],
    customSizePrice: { pricePerSqFtINR: '', pricePerSqFtUSD: '', minWidth: 2, maxWidth: 15, minHeight: 2, maxHeight: 20 },
    hasCustomSize: false,
    colors: '',
    designs: '',
    material: '',
    pattern: '',
    shape: 'rectangle',
    stock: 0,
    isActive: true,
  });

  // Load product for edit mode
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
            thumbnail: 0,
            video: p.video || '',
            category: p.category || '',
            collections: p.collections || [],
            fixedSizes: p.fixedSizes?.length > 0 ? p.fixedSizes : [{ ...EMPTY_SIZE }],
            customSizePrice: p.customSizePrice || { pricePerSqFtINR: '', pricePerSqFtUSD: '', minWidth: 2, maxWidth: 15, minHeight: 2, maxHeight: 20 },
            hasCustomSize: !!p.customSizePrice,
            colors: (p.colors || []).join(', '),
            designs: (p.variations || []).join(', '),
            material: p.material || '',
            pattern: p.pattern || '',
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
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleCollectionToggle = (slug) => {
    setForm((prev) => ({
      ...prev,
      collections: prev.collections.includes(slug)
        ? prev.collections.filter((c) => c !== slug)
        : [...prev.collections, slug],
    }));
  };

  // ─── Image Upload with Progress ───────────────────────────────────────────
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validation: max 20 images total
    if (form.images.length + files.length > MAX_IMAGES) {
      setErrors((prev) => ({ ...prev, images: `Maximum ${MAX_IMAGES} images allowed. You can add ${MAX_IMAGES - form.images.length} more.` }));
      return;
    }

    // Validate each file (max 10MB, image type)
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, images: 'Only image files are allowed.' }));
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, images: 'Each image must be under 10MB.' }));
        return;
      }
    }

    setUploadingImages(true);
    setImageProgress(0);
    setErrors((prev) => ({ ...prev, images: null }));

    try {
      const formData = new FormData();
      for (const file of files) formData.append('images', file);

      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const xhr = new XMLHttpRequest();

      const result = await new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) setImageProgress(Math.round((e.loaded / e.total) * 100));
        });
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(JSON.parse(xhr.responseText).message || 'Upload failed'));
          }
        });
        xhr.addEventListener('error', () => reject(new Error('Upload failed')));
        xhr.open('POST', `${API_URL}/admin/upload/images`);
        if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
      });

      setForm((prev) => ({ ...prev, images: [...prev.images, ...result.data] }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, images: error.message }));
    } finally {
      setUploadingImages(false);
      setImageProgress(0);
    }
  };

  const removeImage = (index) => {
    setForm((prev) => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return { ...prev, images: newImages, thumbnail: prev.thumbnail >= newImages.length ? 0 : prev.thumbnail };
    });
  };

  const setThumbnail = (index) => {
    setForm((prev) => ({ ...prev, thumbnail: index }));
  };

  // ─── Video Upload with Progress + Duration Validation ─────────────────────
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('video/')) {
      setErrors((prev) => ({ ...prev, video: 'Only video files are allowed.' }));
      return;
    }

    // Validate size (100MB)
    if (file.size > 100 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, video: 'Video must be under 100MB.' }));
      return;
    }

    // Validate duration (max 1 min)
    const duration = await getVideoDuration(file);
    if (duration > MAX_VIDEO_DURATION) {
      setErrors((prev) => ({ ...prev, video: `Video must be 1 minute or less. Your video is ${Math.round(duration)}s.` }));
      if (videoInputRef.current) videoInputRef.current.value = '';
      return;
    }

    setUploadingVideo(true);
    setVideoProgress(0);
    setErrors((prev) => ({ ...prev, video: null }));

    try {
      const formData = new FormData();
      formData.append('video', file);

      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const xhr = new XMLHttpRequest();

      const result = await new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) setVideoProgress(Math.round((e.loaded / e.total) * 100));
        });
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(JSON.parse(xhr.responseText).message || 'Upload failed'));
          }
        });
        xhr.addEventListener('error', () => reject(new Error('Upload failed')));
        xhr.open('POST', `${API_URL}/admin/upload/video`);
        if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
      });

      setForm((prev) => ({ ...prev, video: result.data }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, video: error.message }));
    } finally {
      setUploadingVideo(false);
      setVideoProgress(0);
    }
  };

  const getVideoDuration = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      video.src = URL.createObjectURL(file);
    });
  };

  // ─── Sizes ────────────────────────────────────────────────────────────────
  const handleSizeChange = (index, field, value) => {
    const updated = [...form.fixedSizes];
    updated[index] = { ...updated[index], [field]: value };
    setForm((prev) => ({ ...prev, fixedSizes: updated }));
  };

  const addSize = () => setForm((prev) => ({ ...prev, fixedSizes: [...prev.fixedSizes, { ...EMPTY_SIZE }] }));
  const removeSize = (index) => setForm((prev) => ({ ...prev, fixedSizes: prev.fixedSizes.filter((_, i) => i !== index) }));

  const handleCustomPriceChange = (field, value) => {
    setForm((prev) => ({ ...prev, customSizePrice: { ...prev.customSizePrice, [field]: value } }));
  };

  // ─── Submit ───────────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.category) errs.category = 'Category is required';
    if (!form.material) errs.material = 'Material is required';
    if (form.images.length === 0) errs.images = 'At least 1 product image is required';
    if (!form.video) errs.video = 'Product video is required (max 1 min)';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      // Reorder images: thumbnail first
      const orderedImages = [...form.images];
      if (form.thumbnail > 0 && form.thumbnail < orderedImages.length) {
        const [thumb] = orderedImages.splice(form.thumbnail, 1);
        orderedImages.unshift(thumb);
      }

      const payload = {
        title: form.title,
        description: form.description,
        images: orderedImages,
        video: form.video || null,
        category: form.category,
        collections: form.collections,
        fixedSizes: form.fixedSizes
          .filter((s) => s.label && s.priceINR)
          .map((s) => ({ label: s.label, width: Number(s.width), height: Number(s.height), priceINR: Number(s.priceINR), priceUSD: Number(s.priceUSD), stock: Number(s.stock) || 0 })),
        customSizePrice: form.hasCustomSize
          ? { pricePerSqFtINR: Number(form.customSizePrice.pricePerSqFtINR), pricePerSqFtUSD: Number(form.customSizePrice.pricePerSqFtUSD), minWidth: Number(form.customSizePrice.minWidth), maxWidth: Number(form.customSizePrice.maxWidth), minHeight: Number(form.customSizePrice.minHeight), maxHeight: Number(form.customSizePrice.maxHeight) }
          : null,
        colors: form.colors.split(',').map((c) => c.trim()).filter(Boolean),
        variations: form.designs.split(',').map((v) => v.trim()).filter(Boolean),
        material: form.material,
        pattern: form.pattern,
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
      <h1 className={styles.pageTitle}>{mode === 'edit' ? 'Edit Product' : 'Add New Product'}</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Basic Info */}
        <section className={styles.section}>
          <h2>Basic Information</h2>
          <div className={styles.field}>
            <label>Product Title *</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="e.g., Royal Persian Heritage Rug" />
            {errors.title && <span className={styles.error}>{errors.title}</span>}
          </div>
          <div className={styles.field}>
            <label>Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Describe the product in detail..." />
            {errors.description && <span className={styles.error}>{errors.description}</span>}
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange}>
                <option value="">Select category</option>
                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat.replace(/-/g, ' ')}</option>)}
              </select>
              {errors.category && <span className={styles.error}>{errors.category}</span>}
            </div>
            <div className={styles.field}>
              <label>Material *</label>
              <select name="material" value={form.material} onChange={handleChange}>
                <option value="">Select material</option>
                {MATERIALS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              {errors.material && <span className={styles.error}>{errors.material}</span>}
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Pattern</label>
              <select name="pattern" value={form.pattern} onChange={handleChange}>
                <option value="">Select pattern</option>
                {PATTERNS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label>Shape</label>
              <select name="shape" value={form.shape} onChange={handleChange}>
                {SHAPES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.field}>
            <label>Collections</label>
            <div className={styles.checkboxGroup}>
              {COLLECTIONS.map((col) => (
                <button
                  key={col}
                  type="button"
                  className={`${styles.chip} ${form.collections.includes(col) ? styles.chipActive : ''}`}
                  onClick={() => handleCollectionToggle(col)}
                >
                  {form.collections.includes(col) && <span className={styles.chipCheck}>✓</span>}
                  {col.replace(/-/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Variations */}
        <section className={styles.section}>
          <h2>Variations</h2>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Colors (comma-separated)</label>
              <input type="text" name="colors" value={form.colors} onChange={handleChange} placeholder="Red, Navy Blue, Ivory" />
            </div>
            <div className={styles.field}>
              <label>Designs / Variations (comma-separated)</label>
              <input type="text" name="designs" value={form.designs} onChange={handleChange} placeholder="With Fringe, Without Fringe, Antique Wash" />
            </div>
          </div>
        </section>

        {/* Media — Images */}
        <section className={styles.section}>
          <h2>Media</h2>

          <div className={styles.field}>
            <label>Product Images * (up to {MAX_IMAGES} photos, click to set thumbnail)</label>
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploadingImages} />
            {uploadingImages && (
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${imageProgress}%` }} />
                <span className={styles.progressText}>{imageProgress}%</span>
              </div>
            )}
            {errors.images && <span className={styles.error}>{errors.images}</span>}
            <p className={styles.hint}>{form.images.length}/{MAX_IMAGES} uploaded &middot; Click an image to set as thumbnail</p>
          </div>

          {form.images.length > 0 && (
            <div className={styles.imageGrid}>
              {form.images.map((url, i) => (
                <div key={i} className={`${styles.imageItem} ${form.thumbnail === i ? styles.thumbnailActive : ''}`} onClick={() => setThumbnail(i)}>
                  <img src={url} alt={`Product ${i + 1}`} />
                  {form.thumbnail === i && <span className={styles.thumbBadge}>THUMB</span>}
                  <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(i); }} className={styles.removeImg}>&times;</button>
                </div>
              ))}
            </div>
          )}

          {/* Video */}
          <div className={styles.field} style={{ marginTop: '1.5rem' }}>
            <label>Product Video * (max 1 minute, MP4/MOV/WebM)</label>
            <input ref={videoInputRef} type="file" accept="video/mp4,video/mov,video/webm" onChange={handleVideoUpload} disabled={uploadingVideo} />
            {uploadingVideo && (
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${videoProgress}%` }} />
                <span className={styles.progressText}>{videoProgress}%</span>
              </div>
            )}
            {errors.video && <span className={styles.error}>{errors.video}</span>}
            {form.video && (
              <div className={styles.videoPreview}>
                <video src={form.video} controls width="200" />
                <button type="button" onClick={() => { setForm((prev) => ({ ...prev, video: '' })); if (videoInputRef.current) videoInputRef.current.value = ''; }} className={styles.removeVideo}>&times;</button>
              </div>
            )}
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
              <div className={styles.field}><label>₹ per sq ft (INR)</label><input type="number" value={form.customSizePrice.pricePerSqFtINR} onChange={(e) => handleCustomPriceChange('pricePerSqFtINR', e.target.value)} /></div>
              <div className={styles.field}><label>$ per sq ft (USD)</label><input type="number" value={form.customSizePrice.pricePerSqFtUSD} onChange={(e) => handleCustomPriceChange('pricePerSqFtUSD', e.target.value)} /></div>
              <div className={styles.field}><label>Min Width</label><input type="number" value={form.customSizePrice.minWidth} onChange={(e) => handleCustomPriceChange('minWidth', e.target.value)} /></div>
              <div className={styles.field}><label>Max Width</label><input type="number" value={form.customSizePrice.maxWidth} onChange={(e) => handleCustomPriceChange('maxWidth', e.target.value)} /></div>
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
          <button type="button" onClick={() => router.push('/admin/products')} className={styles.cancelBtn}>Cancel</button>
          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Saving...' : mode === 'edit' ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
