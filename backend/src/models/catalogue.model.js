const mongoose = require('mongoose');

const catalogueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String },
    coverImage: { type: String },
    pages: [{ type: String }], // Array of image URLs (each page is an image)
    isActive: { type: Boolean, default: true },
    sentTo: [{ email: String, sentAt: Date }], // Track who received it
  },
  { timestamps: true }
);

const Catalogue = mongoose.model('Catalogue', catalogueSchema);

module.exports = Catalogue;
