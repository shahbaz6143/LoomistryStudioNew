import styles from '../pages.module.css';

export const metadata = { title: 'Returns & Exchange' };

export default function ReturnsPage() {
  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>Returns & Exchange</h1>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>30-Day Return Policy</h2>
          <p>We want you to love your rug. If you're not completely satisfied, we offer a hassle-free return policy:</p>
          <ul>
            <li>Returns accepted within <strong>30 days</strong> of delivery</li>
            <li>Rug must be in original, unused condition (no stains, odors, or damage)</li>
            <li>Original packaging should be retained if possible</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>How to Initiate a Return</h2>
          <ol>
            <li>Email us at <a href="mailto:info@loomistrystudio.com">info@loomistrystudio.com</a> with your order number</li>
            <li>Our team will respond within 24 hours with return instructions</li>
            <li>Ship the rug back to our warehouse (return shipping may apply)</li>
            <li>Refund processed within 5–7 business days after inspection</li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2>Exchange Policy</h2>
          <ul>
            <li>Exchanges are available for a different size, color, or design</li>
            <li>Subject to availability</li>
            <li>Price difference (if any) will be charged or refunded</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Non-Returnable Items</h2>
          <ul>
            <li>Custom-made or personalized rugs</li>
            <li>Rugs marked as "Final Sale"</li>
            <li>Items damaged due to misuse or improper care</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Damaged or Defective Items</h2>
          <p>If your rug arrives damaged or defective, contact us within 48 hours of delivery with photos. We'll arrange a free replacement or full refund.</p>
        </section>
      </div>
    </div>
  );
}
