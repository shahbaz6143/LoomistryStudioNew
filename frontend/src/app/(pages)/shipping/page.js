import styles from '../pages.module.css';

export const metadata = { title: 'Shipping & Delivery' };

export default function ShippingPage() {
  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>Shipping & Delivery</h1>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>Domestic Shipping (India)</h2>
          <ul>
            <li><strong>Free shipping</strong> on all orders above ₹10,000</li>
            <li>Orders below ₹10,000 — flat ₹499 shipping fee</li>
            <li>Delivery within <strong>7–14 business days</strong> depending on location</li>
            <li>Shipped via Delhivery / BlueDart / DTDC</li>
            <li>Tracking number provided via email once shipped</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>International Shipping</h2>
          <ul>
            <li><strong>Free worldwide shipping</strong> on orders above $500</li>
            <li>Orders below $500 — shipping calculated at checkout based on destination</li>
            <li>Delivery within <strong>14–21 business days</strong></li>
            <li>Shipped via DHL / FedEx / India Post EMS</li>
            <li>All duties and taxes are the responsibility of the buyer</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Order Processing</h2>
          <ul>
            <li>Orders are processed within <strong>1–3 business days</strong></li>
            <li>Custom orders may take <strong>4–8 weeks</strong> for production</li>
            <li>You will receive an email confirmation with tracking details once shipped</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Packaging</h2>
          <p>All rugs are carefully rolled (never folded), wrapped in protective layers, and packed in sturdy tubes or cartons to ensure they arrive in perfect condition.</p>
        </section>

        <section className={styles.section}>
          <h2>Questions?</h2>
          <p>Contact us at <a href="mailto:info@loomistrystudio.com">info@loomistrystudio.com</a> or WhatsApp <a href="https://wa.me/917428917452">+91 7428917452</a></p>
        </section>
      </div>
    </div>
  );
}
