const nodemailer = require('nodemailer');

/**
 * Email Service
 * Uses SendGrid SMTP or any SMTP provider.
 * Falls back to Ethereal (test email) if no credentials configured.
 */

let transporter = null;

const getTransporter = async () => {
  if (transporter) return transporter;

  if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'your-sendgrid-api-key') {
    // SendGrid SMTP
    transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    });
    console.log('✅ Email service: SendGrid');
  } else if (process.env.SMTP_HOST) {
    // Custom SMTP
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log('✅ Email service: Custom SMTP');
  } else {
    // Ethereal test account (emails viewable at ethereal.email)
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('⚠️  Email service: Ethereal (test mode) — view emails at https://ethereal.email');
    console.log(`   Ethereal user: ${testAccount.user}`);
  }

  return transporter;
};

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@loomistrystudio.com';
const SITE_NAME = 'LoomistryStudio';
const SITE_URL = process.env.CLIENT_URL || 'http://localhost:3000';

/**
 * Send an email
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    const transport = await getTransporter();
    const info = await transport.sendMail({
      from: `"${SITE_NAME}" <${FROM_EMAIL}>`,
      to,
      subject,
      html,
    });

    // Log preview URL for Ethereal test emails
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`📧 Email preview: ${previewUrl}`);
    }

    console.log(`📧 Email sent to: ${to} | Subject: ${subject}`);
    return { success: true, messageId: info.messageId, previewUrl };
  } catch (error) {
    console.error(`❌ Email send failed to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Order Confirmation Email
 */
const sendOrderConfirmation = async (order, userEmail) => {
  const sym = order.currency === 'INR' ? '₹' : '$';
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee;">${item.title}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;">${item.size}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;">${item.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;">${sym}${item.price.toLocaleString()}</td>
    </tr>
  `).join('');

  const html = `
    <div style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">
      <h1 style="color:#1a1a1a;font-size:24px;margin-bottom:8px;">Order Confirmed! ✓</h1>
      <p style="color:#555;margin-bottom:24px;">Thank you for your purchase. Your order has been confirmed.</p>
      
      <div style="background:#f9f7f4;border-radius:8px;padding:20px;margin-bottom:24px;">
        <p style="margin:0 0 4px;"><strong>Order Number:</strong> #${order.orderNumber}</p>
        <p style="margin:0 0 4px;"><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        <p style="margin:0;"><strong>Total:</strong> ${sym}${order.totalAmount.toLocaleString()}</p>
      </div>

      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <thead>
          <tr style="background:#f5f5f5;">
            <th style="padding:8px;text-align:left;font-size:12px;text-transform:uppercase;color:#888;">Item</th>
            <th style="padding:8px;text-align:left;font-size:12px;text-transform:uppercase;color:#888;">Size</th>
            <th style="padding:8px;text-align:left;font-size:12px;text-transform:uppercase;color:#888;">Qty</th>
            <th style="padding:8px;text-align:left;font-size:12px;text-transform:uppercase;color:#888;">Price</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <div style="margin-bottom:24px;">
        <h3 style="font-size:14px;color:#1a1a1a;margin-bottom:8px;">Shipping Address</h3>
        <p style="color:#555;line-height:1.6;margin:0;">
          ${order.shippingAddress.fullName}<br>
          ${order.shippingAddress.addressLine1}<br>
          ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}<br>
          ${order.shippingAddress.country}
        </p>
      </div>

      <a href="${SITE_URL}/orders/${order.orderNumber}" style="display:inline-block;background:#1a1a1a;color:white;padding:12px 24px;border-radius:4px;text-decoration:none;font-size:14px;">Track Your Order</a>
      
      <p style="color:#888;font-size:12px;margin-top:32px;border-top:1px solid #eee;padding-top:16px;">
        If you have any questions, reply to this email or contact us at support@loomistrystudio.com
      </p>
    </div>
  `;

  return sendEmail({ to: userEmail, subject: `Order Confirmed #${order.orderNumber} — ${SITE_NAME}`, html });
};

/**
 * Order Shipped Email
 */
const sendOrderShipped = async (order, userEmail) => {
  const html = `
    <div style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">
      <h1 style="color:#1a1a1a;font-size:24px;margin-bottom:8px;">Your Order Has Shipped! 🚚</h1>
      <p style="color:#555;margin-bottom:24px;">Great news — your order #${order.orderNumber} is on its way.</p>
      
      <div style="background:#d1fae5;border-radius:8px;padding:20px;margin-bottom:24px;">
        ${order.tracking.courierName ? `<p style="margin:0 0 4px;"><strong>Courier:</strong> ${order.tracking.courierName}</p>` : ''}
        ${order.tracking.trackingNumber ? `<p style="margin:0 0 4px;"><strong>Tracking Number:</strong> ${order.tracking.trackingNumber}</p>` : ''}
        ${order.tracking.trackingUrl ? `<p style="margin:0;"><a href="${order.tracking.trackingUrl}" style="color:#065f46;font-weight:bold;">Track Your Package →</a></p>` : ''}
      </div>

      <p style="color:#555;margin-bottom:24px;">You'll receive another email when your rug has been delivered.</p>

      <a href="${SITE_URL}/orders/${order.orderNumber}" style="display:inline-block;background:#1a1a1a;color:white;padding:12px 24px;border-radius:4px;text-decoration:none;font-size:14px;">View Order Details</a>
      
      <p style="color:#888;font-size:12px;margin-top:32px;border-top:1px solid #eee;padding-top:16px;">
        ${SITE_NAME} — Premium Handmade Rugs & Carpets
      </p>
    </div>
  `;

  return sendEmail({ to: userEmail, subject: `Your Order Has Shipped #${order.orderNumber} — ${SITE_NAME}`, html });
};

/**
 * Order Delivered Email (with review prompt)
 */
const sendOrderDelivered = async (order, userEmail) => {
  const firstItem = order.items[0];
  const html = `
    <div style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">
      <h1 style="color:#1a1a1a;font-size:24px;margin-bottom:8px;">Your Order Has Been Delivered! 🎉</h1>
      <p style="color:#555;margin-bottom:24px;">Your order #${order.orderNumber} has been delivered. We hope you love your new rug!</p>
      
      <div style="background:#f9f7f4;border-radius:8px;padding:20px;margin-bottom:24px;text-align:center;">
        <p style="font-size:18px;color:#1a1a1a;margin:0 0 12px;"><strong>How's your new rug?</strong></p>
        <p style="color:#555;margin:0 0 16px;">Your feedback helps other buyers and our artisans.</p>
        <a href="${SITE_URL}/products/${firstItem?.title ? firstItem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : ''}" style="display:inline-block;background:#b8860b;color:white;padding:12px 24px;border-radius:4px;text-decoration:none;font-size:14px;">Write a Review</a>
      </div>

      <p style="color:#888;font-size:12px;margin-top:32px;border-top:1px solid #eee;padding-top:16px;">
        Need help with your rug? Check our <a href="${SITE_URL}/care-guide" style="color:#b8860b;">Care Guide</a> or contact us.
      </p>
    </div>
  `;

  return sendEmail({ to: userEmail, subject: `Order Delivered! Share Your Experience — ${SITE_NAME}`, html });
};

/**
 * Abandoned Cart Email
 */
const sendAbandonedCartEmail = async (userEmail, userName, cartItems) => {
  const itemsHtml = cartItems.map(item => `
    <div style="display:flex;align-items:center;padding:12px 0;border-bottom:1px solid #eee;">
      <div>
        <p style="margin:0;font-weight:500;">${item.productId?.title || 'Product'}</p>
        <p style="margin:4px 0 0;color:#888;font-size:13px;">${item.size}</p>
      </div>
    </div>
  `).join('');

  const html = `
    <div style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">
      <h1 style="color:#1a1a1a;font-size:24px;margin-bottom:8px;">You Left Something Behind 🛒</h1>
      <p style="color:#555;margin-bottom:24px;">Hi ${userName || 'there'}, you have items waiting in your cart. Complete your purchase before they sell out!</p>
      
      <div style="background:#f9f7f4;border-radius:8px;padding:20px;margin-bottom:24px;">
        ${itemsHtml}
      </div>

      <a href="${SITE_URL}/cart" style="display:inline-block;background:#1a1a1a;color:white;padding:14px 32px;border-radius:4px;text-decoration:none;font-size:14px;font-weight:bold;">Complete Your Purchase</a>
      
      <p style="color:#888;font-size:12px;margin-top:32px;border-top:1px solid #eee;padding-top:16px;">
        ${SITE_NAME} — Each rug is handcrafted and unique. Don't miss out!
      </p>
    </div>
  `;

  return sendEmail({ to: userEmail, subject: `You left items in your cart — ${SITE_NAME}`, html });
};

module.exports = {
  sendEmail,
  sendOrderConfirmation,
  sendOrderShipped,
  sendOrderDelivered,
  sendAbandonedCartEmail,
  getTransporter,
};
