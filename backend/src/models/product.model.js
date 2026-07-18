const mongoose = require('mongoose');

const fixedSizeSchema = new mongoose.Schema({
  label: { type: String, required: true },       // e.g., "3x5 ft"
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  priceINR: { type: Number, required: true },
  priceUSD: { type: Number, required: true },
  stock: { type: Number, default: 0 },
});

const customSizePriceSchema = new mongoose.Schema({
  pricePerSqFtINR: { type: Number, required: true },
  pricePerSqFtUSD: { type: Number, required: true },
  minWidth: { type: Number, default: 2 },
  maxWidth: { type: Number, default: 15 },
  minHeight: { type: Number, default: 2 },
  maxHeight: { type: Number, default: 20 },
});

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    video: { type: String },
    category: { type: String, required: true },
    collections: [{ type: String }],
    fixedSizes: [fixedSizeSchema],
    customSizePrice: customSizePriceSchema,
    colors: [{ type: String }],
    variations: [{ type: String }],
    material: { type: String, required: true },
    shape: { type: String, default: 'rectangle' },
    stock: { type: Number, default: 0 },
    avgRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Text index for search
productSchema.index({ title: 'text', description: 'text', category: 'text', material: 'text' });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
