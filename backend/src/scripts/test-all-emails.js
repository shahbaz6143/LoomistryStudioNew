/**
 * Test all email templates
 * Run: SENDGRID_API_KEY="" node src/scripts/test-all-emails.js
 */
require('dotenv').config();
// Override SendGrid to use Ethereal for testing
if (!process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY === 'your-sendgrid-api-key') {
  delete process.env.SENDGRID_API_KEY;
}

const mongoose = require('mongoose');
const {
  sendOrderConfirmation,
  sendOrderShipped,
  sendOrderDelivered,
  sendAbandonedCartEmail,
  getTransporter,
} = require('../services/email.service');
const Order = require('../models/order.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/loomistry-studio';

async function testAllEmails() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    await getTransporter();

    const orders = await Order.find().limit(3);
    if (orders.length === 0) {
      console.log('❌ No orders. Run: node src/scripts/seed-orders.js');
      process.exit(1);
    }

    console.log('─────────────────────────────────────');
    console.log('1️⃣  ORDER CONFIRMATION EMAIL');
    console.log('─────────────────────────────────────');
    const r1 = await sendOrderConfirmation(orders[0], 'test@example.com');
    console.log(`   ✅ Sent! Preview: ${r1.previewUrl}\n`);

    console.log('─────────────────────────────────────');
    console.log('2️⃣  ORDER SHIPPED EMAIL');
    console.log('─────────────────────────────────────');
    // Use the shipped order
    const shippedOrder = orders.find(o => o.status === 'shipped') || orders[2];
    const r2 = await sendOrderShipped(shippedOrder, 'test@example.com');
    console.log(`   ✅ Sent! Preview: ${r2.previewUrl}\n`);

    console.log('─────────────────────────────────────');
    console.log('3️⃣  ORDER DELIVERED EMAIL');
    console.log('─────────────────────────────────────');
    const r3 = await sendOrderDelivered(orders[0], 'test@example.com');
    console.log(`   ✅ Sent! Preview: ${r3.previewUrl}\n`);

    console.log('─────────────────────────────────────');
    console.log('4️⃣  ABANDONED CART EMAIL');
    console.log('─────────────────────────────────────');
    const mockCartItems = [
      { productId: { title: 'Royal Persian Heritage Rug' }, size: '5x7 ft' },
      { productId: { title: 'Abstract Grey Hand Tufted Carpet' }, size: '8x10 ft' },
    ];
    const r4 = await sendAbandonedCartEmail('test@example.com', 'Priya', mockCartItems);
    console.log(`   ✅ Sent! Preview: ${r4.previewUrl}\n`);

    console.log('═══════════════════════════════════');
    console.log('All 4 emails sent! Open the preview URLs above in your browser.');
    console.log('═══════════════════════════════════');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

testAllEmails();
