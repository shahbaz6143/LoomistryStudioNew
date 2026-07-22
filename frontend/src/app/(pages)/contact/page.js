import styles from '../pages.module.css';

export const metadata = { title: 'Contact Us' };

export default function ContactPage() {
  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>Contact Us</h1>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>Get In Touch</h2>
          <p>We'd love to hear from you. Whether you have a question about our rugs, need help with an order, or want to discuss a custom design — reach out anytime.</p>
        </section>

        <section className={styles.section}>
          <h2>Contact Details</h2>
          <ul>
            <li><strong>Phone:</strong> <a href="tel:+917428917452">+91 7428917452</a></li>
            <li><strong>WhatsApp:</strong> <a href="https://wa.me/917428917452">Chat with us</a></li>
            <li><strong>Email:</strong> <a href="mailto:info@loomistrystudio.com">info@loomistrystudio.com</a></li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Business Address</h2>
          <p>
            LoomistryStudio<br />
            Bhadohi, Uttar Pradesh, India<br />
            (The Carpet Capital of India)
          </p>
        </section>

        <section className={styles.section}>
          <h2>Business Hours</h2>
          <ul>
            <li><strong>Monday – Saturday:</strong> 10:00 AM – 7:00 PM (IST)</li>
            <li><strong>Sunday:</strong> Closed</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>For Wholesale & B2B Inquiries</h2>
          <p>If you're a retailer, interior designer, or hotel looking for bulk orders, contact us at <a href="mailto:info@loomistrystudio.com">info@loomistrystudio.com</a> with your requirements.</p>
        </section>
      </div>
    </div>
  );
}
