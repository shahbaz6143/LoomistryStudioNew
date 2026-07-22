import styles from '../pages.module.css';

export const metadata = { title: 'About Us' };

export default function AboutPage() {
  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>About LoomistryStudio</h1>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>Our Story</h2>
          <p>LoomistryStudio was born from a deep appreciation for India's rich carpet-weaving heritage. Based in Bhadohi — the Carpet Capital of India — we work directly with master artisans to bring you handcrafted rugs of exceptional quality.</p>
          <p>Every rug we create is a bridge between centuries-old tradition and contemporary design. Our artisans pour their skill, patience, and artistry into every single knot.</p>
        </section>

        <section className={styles.section}>
          <h2>Our Mission</h2>
          <p>To make premium handmade rugs accessible to homes around the world while supporting the artisan communities that create them. We believe a rug is more than decor — it's a foundation for everyday living.</p>
        </section>

        <section className={styles.section}>
          <h2>What Makes Us Different</h2>
          <ul>
            <li><strong>Direct from artisans</strong> — No middlemen, fair prices for makers and buyers</li>
            <li><strong>Handmade with care</strong> — Each rug takes weeks to months to complete</li>
            <li><strong>Natural materials</strong> — Premium wool, silk, cotton, and jute</li>
            <li><strong>Custom orders</strong> — Design a rug tailored to your exact vision</li>
            <li><strong>Global shipping</strong> — We deliver worldwide with care</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Our Craft</h2>
          <p>We specialize in:</p>
          <ul>
            <li><strong>Hand-Knotted Rugs</strong> — The finest craftsmanship, 100+ knots per square inch</li>
            <li><strong>Hand-Tufted Rugs</strong> — Luxurious textures at accessible prices</li>
            <li><strong>Flatweave / Kilim</strong> — Lightweight, reversible, and versatile</li>
            <li><strong>Custom Designs</strong> — Your imagination, our skilled hands</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Sustainability</h2>
          <p>We're committed to responsible practices — from using natural vegetable dyes to ensuring fair wages for our artisan partners. Each rug is a testament to sustainable luxury.</p>
        </section>

        <section className={styles.section}>
          <h2>Visit or Connect</h2>
          <p>
            <strong>Location:</strong> Bhadohi, Uttar Pradesh, India<br />
            <strong>Email:</strong> <a href="mailto:info@loomistrystudio.com">info@loomistrystudio.com</a><br />
            <strong>WhatsApp:</strong> <a href="https://wa.me/917428917452">+91 7428917452</a>
          </p>
        </section>
      </div>
    </div>
  );
}
