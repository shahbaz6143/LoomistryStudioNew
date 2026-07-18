/**
 * Database Seed Script
 * Run: node src/scripts/seed.js
 * 
 * This inserts dummy product data into MongoDB.
 * Requires MONGODB_URI in .env or uses localhost default.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/product.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/loomistry-studio';

const products = [
  {
    title: 'Royal Persian Heritage Rug',
    slug: 'royal-persian-heritage-rug',
    description: 'A magnificent hand-knotted Persian rug featuring intricate floral medallion patterns. Crafted by master artisans using traditional techniques passed down through generations. Made with premium New Zealand wool for exceptional softness and durability.',
    images: [
      'https://images.unsplash.com/photo-1600166898405-da9535204843?w=800',
      'https://images.unsplash.com/photo-1600166898405-da9535204843?w=800',
    ],
    category: 'persian',
    collections: ['bestsellers', 'living-room'],
    fixedSizes: [
      { label: '3x5 ft', width: 3, height: 5, priceINR: 12999, priceUSD: 159, stock: 10 },
      { label: '5x7 ft', width: 5, height: 7, priceINR: 24999, priceUSD: 299, stock: 8 },
      { label: '8x10 ft', width: 8, height: 10, priceINR: 44999, priceUSD: 549, stock: 5 },
    ],
    customSizePrice: {
      pricePerSqFtINR: 900,
      pricePerSqFtUSD: 11,
      minWidth: 2,
      maxWidth: 15,
      minHeight: 2,
      maxHeight: 20,
    },
    colors: ['Red', 'Navy Blue', 'Ivory'],
    variations: ['With Fringe', 'Without Fringe'],
    material: 'Wool',
    shape: 'rectangle',
    stock: 23,
    avgRating: 4.8,
    reviewCount: 124,
    isActive: true,
  },
  {
    title: 'Abstract Grey Hand Tufted Carpet',
    slug: 'abstract-grey-hand-tufted-carpet',
    description: 'Contemporary hand-tufted carpet with abstract geometric patterns in shades of grey. Perfect for modern living spaces. Made with a blend of wool and viscose for a luxurious sheen and soft underfoot feel.',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800',
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800',
    ],
    category: 'hand-tufted',
    collections: ['bestsellers', 'new-arrivals', 'living-room'],
    fixedSizes: [
      { label: '4x6 ft', width: 4, height: 6, priceINR: 8999, priceUSD: 109, stock: 15 },
      { label: '5x7 ft', width: 5, height: 7, priceINR: 14999, priceUSD: 179, stock: 12 },
      { label: '8x10 ft', width: 8, height: 10, priceINR: 28999, priceUSD: 349, stock: 6 },
    ],
    customSizePrice: {
      pricePerSqFtINR: 650,
      pricePerSqFtUSD: 8,
      minWidth: 2,
      maxWidth: 12,
      minHeight: 2,
      maxHeight: 15,
    },
    colors: ['Grey', 'Charcoal', 'Silver'],
    variations: ['Standard', 'High Pile'],
    material: 'Wool & Viscose',
    shape: 'rectangle',
    stock: 33,
    avgRating: 4.6,
    reviewCount: 89,
    isActive: true,
  },
  {
    title: 'Bohemian Flatweave Kilim Runner',
    slug: 'bohemian-flatweave-kilim-runner',
    description: 'Handwoven flatweave kilim runner with vibrant bohemian patterns. Perfect for hallways, entryways, and kitchen areas. Made from 100% cotton for easy maintenance and a lightweight, reversible design.',
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    ],
    category: 'flatweave',
    collections: ['new-arrivals', 'deal-of-the-week'],
    fixedSizes: [
      { label: '2.5x8 ft', width: 2.5, height: 8, priceINR: 5999, priceUSD: 72, stock: 20 },
      { label: '2.5x10 ft', width: 2.5, height: 10, priceINR: 7499, priceUSD: 90, stock: 15 },
      { label: '3x12 ft', width: 3, height: 12, priceINR: 9999, priceUSD: 120, stock: 10 },
    ],
    colors: ['Multicolor', 'Earth Tones', 'Blue & Orange'],
    variations: ['Fringed Edges', 'Clean Edges'],
    material: 'Cotton',
    shape: 'runner',
    stock: 45,
    avgRating: 4.5,
    reviewCount: 67,
    isActive: true,
  },
  {
    title: 'Modern Geometric Wool Area Rug',
    slug: 'modern-geometric-wool-area-rug',
    description: 'Hand-knotted modern area rug with bold geometric patterns. Features a thick, plush pile that adds warmth and texture to any room. Crafted from premium hand-spun wool with natural vegetable dyes.',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
    ],
    category: 'modern',
    collections: ['new-arrivals', 'bedroom'],
    fixedSizes: [
      { label: '4x6 ft', width: 4, height: 6, priceINR: 18999, priceUSD: 229, stock: 7 },
      { label: '6x9 ft', width: 6, height: 9, priceINR: 34999, priceUSD: 419, stock: 4 },
      { label: '9x12 ft', width: 9, height: 12, priceINR: 59999, priceUSD: 719, stock: 3 },
    ],
    customSizePrice: {
      pricePerSqFtINR: 1100,
      pricePerSqFtUSD: 13,
      minWidth: 3,
      maxWidth: 14,
      minHeight: 3,
      maxHeight: 18,
    },
    colors: ['Teal & Gold', 'Black & White', 'Rust & Cream'],
    variations: ['Low Pile', 'Medium Pile'],
    material: 'Wool',
    shape: 'rectangle',
    stock: 14,
    avgRating: 4.9,
    reviewCount: 42,
    isActive: true,
  },
  {
    title: 'Traditional Floral Hand Knotted Rug',
    slug: 'traditional-floral-hand-knotted-rug',
    description: 'Exquisite hand-knotted rug with traditional floral motifs inspired by Mughal garden designs. Each piece takes 6-8 months to complete by skilled artisans. Features a dense knot count for incredible detail and longevity.',
    images: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800',
    ],
    category: 'traditional',
    collections: ['bestsellers', 'dining-room'],
    fixedSizes: [
      { label: '4x6 ft', width: 4, height: 6, priceINR: 22999, priceUSD: 279, stock: 6 },
      { label: '6x9 ft', width: 6, height: 9, priceINR: 42999, priceUSD: 519, stock: 4 },
      { label: '8x10 ft', width: 8, height: 10, priceINR: 64999, priceUSD: 779, stock: 2 },
    ],
    customSizePrice: {
      pricePerSqFtINR: 1300,
      pricePerSqFtUSD: 16,
      minWidth: 3,
      maxWidth: 12,
      minHeight: 3,
      maxHeight: 15,
    },
    colors: ['Ivory & Rose', 'Sage Green', 'Royal Blue'],
    variations: ['Standard', 'Antique Wash'],
    material: 'Silk & Wool',
    shape: 'rectangle',
    stock: 12,
    avgRating: 4.7,
    reviewCount: 56,
    isActive: true,
  },
  {
    title: 'Round Jute Natural Fiber Rug',
    slug: 'round-jute-natural-fiber-rug',
    description: 'Eco-friendly handwoven round jute rug with a natural braided pattern. Adds organic warmth and texture to any space. Durable, sustainable, and perfect for high-traffic areas.',
    images: [
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800',
    ],
    category: 'flatweave',
    collections: ['new-arrivals', 'living-room'],
    fixedSizes: [
      { label: '4 ft dia', width: 4, height: 4, priceINR: 4999, priceUSD: 59, stock: 25 },
      { label: '6 ft dia', width: 6, height: 6, priceINR: 8999, priceUSD: 109, stock: 18 },
      { label: '8 ft dia', width: 8, height: 8, priceINR: 14999, priceUSD: 179, stock: 10 },
    ],
    colors: ['Natural', 'Natural & White', 'Natural & Black'],
    variations: ['Standard', 'With Border'],
    material: 'Jute',
    shape: 'round',
    stock: 53,
    avgRating: 4.4,
    reviewCount: 93,
    isActive: true,
  },
  {
    title: 'Luxury Silk Kashan Carpet',
    slug: 'luxury-silk-kashan-carpet',
    description: 'Ultra-premium pure silk Kashan carpet with incredibly fine knotting. Features over 400 knots per square inch for stunning detail. A true collectors piece that becomes more valuable with age.',
    images: [
      'https://images.unsplash.com/photo-1600166898405-da9535204843?w=800',
      'https://images.unsplash.com/photo-1600166898405-da9535204843?w=800',
    ],
    category: 'persian',
    collections: ['bestsellers', 'living-room'],
    fixedSizes: [
      { label: '4x6 ft', width: 4, height: 6, priceINR: 89999, priceUSD: 1099, stock: 3 },
      { label: '6x9 ft', width: 6, height: 9, priceINR: 149999, priceUSD: 1799, stock: 2 },
      { label: '8x10 ft', width: 8, height: 10, priceINR: 249999, priceUSD: 2999, stock: 1 },
    ],
    customSizePrice: {
      pricePerSqFtINR: 3500,
      pricePerSqFtUSD: 42,
      minWidth: 3,
      maxWidth: 10,
      minHeight: 3,
      maxHeight: 12,
    },
    colors: ['Ivory & Gold', 'Midnight Blue', 'Ruby Red'],
    variations: ['Standard', 'Museum Quality'],
    material: 'Pure Silk',
    shape: 'rectangle',
    stock: 6,
    avgRating: 5.0,
    reviewCount: 18,
    isActive: true,
  },
  {
    title: 'Scandinavian Minimalist Wool Rug',
    slug: 'scandinavian-minimalist-wool-rug',
    description: 'Clean-lined Scandinavian-inspired hand-tufted rug with subtle texture. Features a neutral palette that complements any modern interior. Made with undyed natural wool for an organic, eco-conscious choice.',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800',
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800',
    ],
    category: 'modern',
    collections: ['new-arrivals', 'bedroom'],
    fixedSizes: [
      { label: '5x7 ft', width: 5, height: 7, priceINR: 16999, priceUSD: 209, stock: 10 },
      { label: '6x9 ft', width: 6, height: 9, priceINR: 27999, priceUSD: 339, stock: 7 },
      { label: '8x10 ft', width: 8, height: 10, priceINR: 39999, priceUSD: 479, stock: 5 },
    ],
    customSizePrice: {
      pricePerSqFtINR: 800,
      pricePerSqFtUSD: 10,
      minWidth: 3,
      maxWidth: 12,
      minHeight: 3,
      maxHeight: 14,
    },
    colors: ['Cream', 'Light Grey', 'Oatmeal'],
    variations: ['Flat Weave', 'Textured'],
    material: 'Wool',
    shape: 'rectangle',
    stock: 22,
    avgRating: 4.6,
    reviewCount: 34,
    isActive: true,
  },
];

async function seed() {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert seed data
    const inserted = await Product.insertMany(products);
    console.log(`✅ Inserted ${inserted.length} products into database`);

    // Verify
    const count = await Product.countDocuments();
    console.log(`📦 Total products in DB: ${count}`);

    console.log('\n📋 Products seeded:');
    inserted.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.title} (${p.category}) - ₹${p.fixedSizes[0].priceINR}`);
    });

    console.log('\n✅ Seed complete! Your frontend will now show data from MongoDB.');
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    console.log('\n💡 Make sure MongoDB is running. Options:');
    console.log('   1. Install MongoDB locally: brew install mongodb-community');
    console.log('   2. Use MongoDB Atlas (free): https://cloud.mongodb.com');
    console.log('   3. Set MONGODB_URI in backend/.env file');
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
