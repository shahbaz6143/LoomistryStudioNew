/**
 * Test email sending
 * Run: node src/scripts/test-email.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const { sendOrderConfirmation, getTransporter } = require('../services/email.service');
const Order = require('../models/order.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/loomistry-studio';

async function testEmail() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Initialize email transporter
    await getTransporter();

    const order = await Order.findOne();
    if (!order) {
      console.log('❌ No orders found. Run seed-orders.js first.');
      process.exit(1);
    }

    console.log(`\n📧 Sending test email for Order #${order.orderNumber}...`);
    const result = await sendOrderConfirmation(order, 'loomistrystudio@gmail.com');

    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log(`   Message ID: ${result.messageId}`);
      if (result.previewUrl) {
        console.log(`   🔗 Preview: ${result.previewUrl}`);
        console.log('   (Open this URL in browser to see the email)');
      }
    } else {
      console.log('❌ Failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

testEmail();
