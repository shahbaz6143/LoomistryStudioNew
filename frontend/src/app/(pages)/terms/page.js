import styles from '../pages.module.css';

export const metadata = { title: 'Terms of Service' };

export default function TermsPage() {
  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>Terms of Service</h1>

      <div className={styles.content}>
        <section className={styles.section}>
          <p><strong>Last updated:</strong> July 2026</p>
          <p>By accessing and using loomistrystudio.com ("the Site"), you agree to these Terms of Service. Please read them carefully before making a purchase.</p>
        </section>

        <section className={styles.section}>
          <h2>1. Products</h2>
          <ul>
            <li>All rugs are handmade. Slight variations in color, texture, and dimensions (±5%) are natural characteristics, not defects.</li>
            <li>Product images are representative. Actual colors may vary slightly due to screen settings and photography lighting.</li>
            <li>Prices are subject to change without prior notice. The price at the time of order placement is final.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>2. Orders & Payment</h2>
          <ul>
            <li>Orders are confirmed only after successful payment.</li>
            <li>We reserve the right to cancel orders in case of pricing errors, fraud detection, or stock unavailability.</li>
            <li>Payment is processed securely via Razorpay (India) or Stripe (International).</li>
            <li>All prices are displayed in INR for Indian customers and USD for international customers.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. Shipping & Delivery</h2>
          <ul>
            <li>Delivery timelines are estimates and not guarantees.</li>
            <li>We are not responsible for delays caused by customs, weather, or courier issues beyond our control.</li>
            <li>Risk of loss transfers to the buyer upon handover to the shipping carrier.</li>
            <li>International buyers are responsible for all customs duties, taxes, and import fees.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. Returns & Refunds</h2>
          <ul>
            <li>Returns accepted within 30 days of delivery for unused items in original condition.</li>
            <li>Custom-made, personalized, and "Final Sale" items are non-returnable.</li>
            <li>Refunds are processed within 5-7 business days after inspection of the returned item.</li>
            <li>Return shipping costs may apply (unless the item is defective).</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>5. Custom Orders</h2>
          <ul>
            <li>Custom rugs are made-to-order and are non-returnable.</li>
            <li>Production timelines (4-8 weeks) are estimates and may vary.</li>
            <li>Final approval of design/color is required before production begins.</li>
            <li>A 50% advance payment may be required for custom orders.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>6. Intellectual Property</h2>
          <p>All content on this website — including text, images, logos, designs, and product photos — is the property of LoomistryStudio. Unauthorized reproduction, distribution, or use is prohibited.</p>
        </section>

        <section className={styles.section}>
          <h2>7. Account Responsibilities</h2>
          <ul>
            <li>You are responsible for maintaining the confidentiality of your account.</li>
            <li>You must provide accurate information during registration and checkout.</li>
            <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>8. Limitation of Liability</h2>
          <p>LoomistryStudio shall not be liable for indirect, incidental, or consequential damages arising from use of the website or purchase of products. Our total liability is limited to the amount paid for the product in question.</p>
        </section>

        <section className={styles.section}>
          <h2>9. Governing Law</h2>
          <p>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Varanasi, Uttar Pradesh, India.</p>
        </section>

        <section className={styles.section}>
          <h2>10. Contact</h2>
          <p>For questions about these terms:</p>
          <ul>
            <li>Email: <a href="mailto:info@loomistrystudio.com">info@loomistrystudio.com</a></li>
            <li>WhatsApp: <a href="https://wa.me/917428917452">+91 7428917452</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
}
