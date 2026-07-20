/**
 * Seed test orders for development
 * Run: node src/scripts/seed-orders.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('../models/order.model');
const User = require('../models/user.model');
const Product = require('../models/product.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/loomistry-studio';

async function seedOrders() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find admin user and some products
    const user = await User.findOne({ email: 'loomistrystudio@gmail.com' });
    const products = await Product.find().limit(3);

    if (!user) {
      console.error('❌ No user found. Sign in first.');
      process.exit(1);
    }

    if (products.length === 0) {
      console.error('❌ No products found. Run seed.js first.');
      process.exit(1);
    }

    // Clear existing test orders
    await Order.deleteMany({});
    console.log('🗑️  Cleared existing orders');

    const orders = [
      {
        userId: user._id,
        items: [
          {
            productId: products[0]._id,
            title: products[0].title,
            image: products[0].images?.[0] || '',
            size: products[0].fixedSizes[0]?.label || '5x7 ft',
            color: products[0].colors?.[0] || 'Red',
            quantity: 1,
            price: products[0].fixedSizes[0]?.priceINR || 12999,
          },
        ],
        shippingAddress: {
          fullName: 'Rahul Sharma',
          phone: '+91 9876543210',
          addressLine1: '42, MG Road',
          addressLine2: 'Near Metro Station',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
          country: 'India',
        },
        currency: 'INR',
        subtotal: products[0].fixedSizes[0]?.priceINR || 12999,
        discount: 0,
        shippingCost: 0,
        totalAmount: products[0].fixedSizes[0]?.priceINR || 12999,
        paymentMethod: 'razorpay',
        paymentId: 'pay_test_' + Date.now(),
        paymentStatus: 'paid',
        status: 'confirmed',
      },
      {
        userId: user._id,
        items: [
          {
            productId: products[1]._id,
            title: products[1].title,
            image: products[1].images?.[0] || '',
            size: products[1].fixedSizes[1]?.label || '5x7 ft',
            color: products[1].colors?.[0] || 'Grey',
            quantity: 2,
            price: products[1].fixedSizes[1]?.priceINR || 14999,
          },
          {
            productId: products[2]._id,
            title: products[2].title,
            image: products[2].images?.[0] || '',
            size: products[2].fixedSizes[0]?.label || '4x6 ft',
            color: products[2].colors?.[0] || 'Multi',
            quantity: 1,
            price: products[2].fixedSizes[0]?.priceINR || 5999,
          },
        ],
        shippingAddress: {
          fullName: 'Priya Patel',
          phone: '+91 8765432109',
          addressLine1: '15, Jubilee Hills',
          city: 'Hyderabad',
          state: 'Telangana',
          postalCode: '500033',
          country: 'India',
        },
        currency: 'INR',
        subtotal: 35997,
        discount: 2000,
        shippingCost: 0,
        totalAmount: 33997,
        couponCode: 'WELCOME20',
        paymentMethod: 'razorpay',
        paymentId: 'pay_test_' + (Date.now() + 1),
        paymentStatus: 'paid',
        status: 'processing',
      },
      {
        userId: user._id,
        items: [
          {
            productId: products[0]._id,
            title: products[0].title,
            image: products[0].images?.[0] || '',
            size: products[0].fixedSizes[2]?.label || '8x10 ft',
            color: products[0].colors?.[1] || 'Navy Blue',
            quantity: 1,
            price: products[0].fixedSizes[2]?.priceINR || 44999,
          },
        ],
        shippingAddress: {
          fullName: 'Amit Kumar',
          phone: '+91 7654321098',
          addressLine1: '28, Sector 15',
          addressLine2: 'DLF Phase 3',
          city: 'Gurgaon',
          state: 'Haryana',
          postalCode: '122001',
          country: 'India',
        },
        currency: 'INR',
        subtotal: 44999,
        discount: 0,
        shippingCost: 0,
        totalAmount: 44999,
        paymentMethod: 'razorpay',
        paymentId: 'pay_test_' + (Date.now() + 2),
        paymentStatus: 'paid',
        status: 'shipped',
        tracking: {
          courierName: 'Delhivery',
          trackingNumber: 'DL9876543210',
          trackingUrl: 'https://www.delhivery.com/track/DL9876543210',
          shippedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
      },
    ];

    const inserted = [];
    for (const orderData of orders) {
      const order = new Order(orderData);
      await order.save();
      inserted.push(order);
    }
    console.log(`✅ Inserted ${inserted.length} test orders\n`);

    inserted.forEach((o, i) => {
      console.log(`   ${i + 1}. #${o.orderNumber} — ${o.status} — ₹${o.totalAmount.toLocaleString()}`);
    });

    console.log('\n📋 How to test:');
    console.log('   1. Go to http://localhost:3000/admin/orders (as admin)');
    console.log('   2. See 3 orders with different statuses');
    console.log('   3. Click "Manage" on any order to update status/tracking');
    console.log('   4. Go to http://localhost:3000/orders (as buyer) to see your orders');
    console.log(`   5. Click an order to see the status timeline + tracking info`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedOrders();
