'use client';

import { useState } from 'react';
import styles from './page.module.css';

const COLORS = [
  { name: 'Ivory', hex: '#F5F0E8' },
  { name: 'Beige', hex: '#D4C5A9' },
  { name: 'Sand', hex: '#C2A87D' },
  { name: 'Rust', hex: '#A0522D' },
  { name: 'Terracotta', hex: '#CC5533' },
  { name: 'Navy', hex: '#1B2838' },
  { name: 'Teal', hex: '#2E6B62' },
  { name: 'Forest', hex: '#2D4A3E' },
  { name: 'Charcoal', hex: '#3D3D3D' },
  { name: 'Grey', hex: '#8A8A8A' },
  { name: 'Blush', hex: '#DBA5A5' },
  { name: 'Gold', hex: '#B8860B' },
];

export default function CustomRugsPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    width: '',
    height: '',
    unit: 'feet',
    shape: 'rectangle',
    material: '',
    colors: [],
    notes: '',
    inspiration: null,
    inspirationPreviews: [],
  });

  const toggleColor = (color) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = `Hi! I'd like a custom rug:\nSize: ${form.width}x${form.height} ${form.unit}\nShape: ${form.shape}\nMaterial: ${form.material}\nColors: ${form.colors.join(', ')}\nNotes: ${form.notes}`;
    window.open(`https://wa.me/917428917452?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className={`container ${styles.page}`}>
      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.subtitle}>Bespoke Service</p>
        <h1 className={styles.title}>Custom Rugs</h1>
        <p className={styles.description}>
          Your vision, our craft. Design a one-of-a-kind rug tailored to your exact specifications —
          size, colors, pattern, and material. Handcrafted by master artisans.
        </p>
      </div>

      {/* Steps */}
      <div className={styles.steps}>
        <div className={styles.step}>
          <span className={styles.stepNumber}>1</span>
          <h3>Choose Size</h3>
          <p>Select your exact dimensions or choose from standard sizes</p>
        </div>
        <div className={styles.step}>
          <span className={styles.stepNumber}>2</span>
          <h3>Choose Colors</h3>
          <p>Pick from our palette or provide your own color references</p>
        </div>
        <div className={styles.step}>
          <span className={styles.stepNumber}>3</span>
          <h3>Upload Inspiration</h3>
          <p>Share images of designs, patterns, or spaces you love</p>
        </div>
        <div className={styles.step}>
          <span className={styles.stepNumber}>4</span>
          <h3>Request Quote</h3>
          <p>Get a personalized quote within 24 hours</p>
        </div>
      </div>

      {/* Form */}
      <div className={styles.formSection}>
        <h2 className={styles.formTitle}>Design Your Rug</h2>
        <p className={styles.formSubtitle}>Fill in the details below and we'll get back to you with a quote</p>

        <form onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Full Name *</label>
              <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required placeholder="Your name" />
            </div>
            <div className={styles.field}>
              <label>Email *</label>
              <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required placeholder="you@email.com" />
            </div>
          </div>

          <div className={styles.field}>
            <label>Phone (WhatsApp preferred)</label>
            <input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} placeholder="+91 XXXXX XXXXX" />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Width *</label>
              <input type="number" value={form.width} onChange={(e) => setForm({...form, width: e.target.value})} required placeholder="e.g., 6" />
            </div>
            <div className={styles.field}>
              <label>Height *</label>
              <input type="number" value={form.height} onChange={(e) => setForm({...form, height: e.target.value})} required placeholder="e.g., 9" />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Unit</label>
              <select value={form.unit} onChange={(e) => setForm({...form, unit: e.target.value})}>
                <option value="feet">Feet</option>
                <option value="meters">Meters</option>
                <option value="cm">Centimeters</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Shape</label>
              <select value={form.shape} onChange={(e) => setForm({...form, shape: e.target.value})}>
                <option value="rectangle">Rectangle</option>
                <option value="round">Round</option>
                <option value="oval">Oval</option>
                <option value="runner">Runner</option>
                <option value="custom">Custom Shape</option>
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label>Material Preference</label>
            <select value={form.material} onChange={(e) => setForm({...form, material: e.target.value})}>
              <option value="">Select material...</option>
              <option value="wool">100% Wool</option>
              <option value="silk-wool">Silk & Wool Blend</option>
              <option value="pure-silk">Pure Silk</option>
              <option value="cotton">Cotton</option>
              <option value="jute">Jute / Natural Fiber</option>
              <option value="viscose">Viscose Blend</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Choose Colors (select multiple)</label>
            <div className={styles.colorOptions}>
              {COLORS.map((color) => (
                <div
                  key={color.name}
                  className={`${styles.colorChip} ${form.colors.includes(color.name) ? styles.colorChipActive : ''}`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => toggleColor(color.name)}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label>Upload Inspiration Images</label>
            <p className={styles.uploadHint}>Share images of patterns, rooms, or designs you love. This helps our artisans understand your vision.</p>
            <div className={styles.uploadArea} onClick={() => document.getElementById('fileInput').click()}>
              <div className={styles.uploadIcon}>
                <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
              </div>
              <p className={styles.uploadText}>Click or drag images here</p>
              <span className={styles.uploadFormats}>JPG, PNG, WEBP &middot; Max 5 images</span>
              <input id="fileInput" type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={(e) => {
                const newFiles = Array.from(e.target.files);
                const existingFiles = form.inspiration || [];
                const existingPreviews = form.inspirationPreviews || [];
                const combined = [...existingFiles, ...newFiles].slice(0, 5);
                const combinedPreviews = [...existingPreviews, ...newFiles.map(f => URL.createObjectURL(f))].slice(0, 5);
                setForm({...form, inspiration: combined, inspirationPreviews: combinedPreviews});
                e.target.value = '';
              }} />
            </div>
            {form.inspirationPreviews && form.inspirationPreviews.length > 0 && (
              <div className={styles.previewGrid}>
                {form.inspirationPreviews.map((url, i) => (
                  <div key={i} className={styles.previewItem}>
                    <img src={url} alt={`Inspiration ${i + 1}`} />
                    <button type="button" className={styles.previewRemove} onClick={() => {
                      const newPreviews = form.inspirationPreviews.filter((_, idx) => idx !== i);
                      const newFiles = Array.from(form.inspiration || []).filter((_, idx) => idx !== i);
                      setForm({...form, inspiration: newFiles, inspirationPreviews: newPreviews});
                    }}>&times;</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label>Additional Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({...form, notes: e.target.value})}
              placeholder="Tell us about your vision — pattern style, room context, budget range, timeline, etc."
            />
          </div>

          {/* Action Buttons */}
          <div className={styles.actionRow}>
            <button type="submit" className={styles.submitBtn}>
              <svg width="18" height="18" fill="white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Request Quote via WhatsApp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
