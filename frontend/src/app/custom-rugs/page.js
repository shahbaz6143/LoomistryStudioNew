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
            <label>Upload Inspiration (optional)</label>
            <div className={styles.uploadArea} onClick={() => document.getElementById('fileInput').click()}>
              <div className={styles.uploadIcon}>
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
              </div>
              <p>Click to upload images of patterns, rooms, or mood boards</p>
              <input id="fileInput" type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={(e) => setForm({...form, inspiration: e.target.files})} />
            </div>
          </div>

          <div className={styles.field}>
            <label>Additional Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({...form, notes: e.target.value})}
              placeholder="Tell us about your vision — pattern style, room context, budget range, timeline, etc."
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Request Quote via WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
}
