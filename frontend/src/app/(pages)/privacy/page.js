import styles from '../pages.module.css';

export const metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>Privacy Policy</h1>

      <div className={styles.content}>
        <section className={styles.section}>
          <p><strong>Last updated:</strong> July 2026</p>
          <p>LoomistryStudio ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you visit our website loomistrystudio.com or make a purchase.</p>
        </section>

        <section className={styles.section}>
          <h2>Information We Collect</h2>
          <p>We collect information you provide directly:</p>
          <ul>
            <li><strong>Account Information:</strong> Name, email, profile picture (via Google/Facebook/Twitter sign-in)</li>
            <li><strong>Order Information:</strong> Shipping address, phone number, payment details</li>
            <li><strong>Communication:</strong> Messages sent via WhatsApp, email, or contact form</li>
            <li><strong>Custom Orders:</strong> Size preferences, color choices, uploaded inspiration images</li>
          </ul>
          <p>We automatically collect:</p>
          <ul>
            <li>Browser type and device information</li>
            <li>IP address (used for regional pricing detection)</li>
            <li>Pages visited and products viewed</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>How We Use Your Information</h2>
          <ul>
            <li>Process and fulfill your orders</li>
            <li>Provide customer support</li>
            <li>Send order confirmations and shipping updates</li>
            <li>Detect your region for currency display (INR/USD)</li>
            <li>Improve our website and product offerings</li>
            <li>Send promotional emails (only with your consent)</li>
            <li>Prevent fraud and ensure security</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Payment Security</h2>
          <p>We do not store your full credit/debit card numbers. All payments are processed securely through:</p>
          <ul>
            <li><strong>Razorpay</strong> (for India) — PCI-DSS Level 1 certified</li>
            <li><strong>Stripe</strong> (for International) — PCI-DSS Level 1 certified</li>
          </ul>
          <p>Your payment information is encrypted and transmitted directly to the payment processor.</p>
        </section>

        <section className={styles.section}>
          <h2>Cookies</h2>
          <p>We use cookies to:</p>
          <ul>
            <li>Keep you signed in</li>
            <li>Remember your cart and wishlist</li>
            <li>Analyze site traffic (anonymous)</li>
            <li>Show you relevant products</li>
          </ul>
          <p>You can disable cookies in your browser settings, but some features may not work properly.</p>
        </section>

        <section className={styles.section}>
          <h2>Third-Party Services</h2>
          <p>We share limited data with trusted third parties:</p>
          <ul>
            <li><strong>Cloudinary:</strong> Image hosting</li>
            <li><strong>SendGrid:</strong> Transactional emails</li>
            <li><strong>Google OAuth / Facebook / Twitter:</strong> Authentication</li>
            <li><strong>Razorpay / Stripe:</strong> Payment processing</li>
            <li><strong>Shipping Partners:</strong> Delhivery, DHL, FedEx (for delivery)</li>
          </ul>
          <p>We never sell your personal information to third parties.</p>
        </section>

        <section className={styles.section}>
          <h2>Data Retention</h2>
          <p>We retain your data as long as your account is active or as needed to provide services. You can request deletion of your account and data by emailing <a href="mailto:info@loomistrystudio.com">info@loomistrystudio.com</a>.</p>
        </section>

        <section className={styles.section}>
          <h2>Your Rights</h2>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing emails</li>
            <li>Request data portability</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Contact Us</h2>
          <p>For privacy-related inquiries:</p>
          <ul>
            <li>Email: <a href="mailto:info@loomistrystudio.com">info@loomistrystudio.com</a></li>
            <li>WhatsApp: <a href="https://wa.me/917428917452">+91 7428917452</a></li>
            <li>Address: Bhadohi, Uttar Pradesh, India</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
