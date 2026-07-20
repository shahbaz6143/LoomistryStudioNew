/**
 * Seed test reviews for development
 * Run: node src/scripts/seed-reviews.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Review = require('../models/review.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/loomistry-studio';

async function seedReviews() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const user = await User.findOne({ email: 'loomistrystudio@gmail.com' });
    const products = await Product.find().limit(4);

    if (!user || products.length === 0) {
      console.error('❌ Need at least 1 user and products. Run seed.js first and sign in.');
      process.exit(1);
    }

    // Clear existing reviews
    await Review.deleteMany({});
    console.log('🗑️  Cleared existing reviews');

    // Create a dummy buyer user for varied reviews
    let buyer = await User.findOne({ email: 'buyer@test.com' });
    if (!buyer) {
      buyer = await User.create({
        name: 'Priya Sharma',
        email: 'buyer@test.com',
        authProvider: 'google',
        providerId: 'test-buyer-001',
        role: 'buyer',
      });
    }

    let buyer2 = await User.findOne({ email: 'buyer2@test.com' });
    if (!buyer2) {
      buyer2 = await User.create({
        name: 'Rahul Patel',
        email: 'buyer2@test.com',
        authProvider: 'google',
        providerId: 'test-buyer-002',
        role: 'buyer',
      });
    }

    const reviews = [
      {
        userId: buyer._id,
        productId: products[0]._id,
        rating: 5,
        comment: 'Absolutely stunning rug! The craftsmanship is incredible and the colors are even more vibrant in person. It transformed our living room completely.',
        verified: true,
        isApproved: true,
      },
      {
        userId: buyer2._id,
        productId: products[0]._id,
        rating: 4,
        comment: 'Beautiful quality and the wool feels premium. Took about 2 weeks to deliver but well worth the wait. Would buy again.',
        verified: true,
        isApproved: true,
      },
      {
        userId: user._id,
        productId: products[0]._id,
        rating: 5,
        comment: 'The finest rug I have ever owned. The hand-knotted detail is exceptional and it gets compliments from every guest.',
        verified: false,
        isApproved: true,
      },
      {
        userId: buyer._id,
        productId: products[1]._id,
        rating: 4,
        comment: 'Great modern design that fits perfectly in our minimalist apartment. Soft underfoot and easy to clean. Very happy with this purchase.',
        verified: true,
        isApproved: true,
      },
      {
        userId: buyer2._id,
        productId: products[1]._id,
        rating: 5,
        comment: 'Ordered the 5x7 size and it is perfect for our bedroom. The grey tones are exactly as shown in the photos. Excellent quality.',
        verified: false,
        isApproved: true,
      },
      {
        userId: buyer._id,
        productId: products[2]._id,
        rating: 3,
        comment: 'Nice runner but a bit thinner than expected. Colors are lovely and it looks great in our hallway. Decent value for the price.',
        verified: true,
        isApproved: true,
      },
      {
        userId: buyer2._id,
        productId: products[3]._id,
        rating: 5,
        comment: 'This is a work of art, not just a rug. The geometric pattern is mesmerizing and the wool quality is top-notch. Worth every rupee!',
        verified: true,
        isApproved: true,
      },
    ];

    for (const reviewData of reviews) {
      const review = new Review(reviewData);
      await review.save();
    }
    console.log(`✅ Inserted ${reviews.length} test reviews`);

    // Update product ratings
    for (const product of products) {
      const stats = await Review.aggregate([
        { $match: { productId: product._id, isApproved: true } },
        { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
      ]);
      if (stats.length > 0) {
        product.avgRating = Math.round(stats[0].avgRating * 10) / 10;
        product.reviewCount = stats[0].count;
        await product.save();
        console.log(`   📦 ${product.title}: ${product.avgRating}★ (${product.reviewCount} reviews)`);
      }
    }

    console.log('\n📋 How to test:');
    console.log('   1. Open any product detail page (e.g., http://localhost:3000/products/royal-persian-heritage-rug)');
    console.log('   2. Scroll down to see "Customer Reviews" section with ratings + comments');
    console.log('   3. Log in as a buyer → click "Write a Review" to add your own');
    console.log('   4. Go to http://localhost:3000/admin/reviews to moderate reviews (Hide/Approve/Delete)');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedReviews();
