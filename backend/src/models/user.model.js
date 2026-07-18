const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    avatar: { type: String },
    authProvider: {
      type: String,
      enum: ['google', 'facebook', 'twitter'],
      required: true,
    },
    providerId: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'editor', 'buyer'],
      default: 'buyer',
    },
    addresses: [addressSchema],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    refreshToken: { type: String },
  },
  { timestamps: true }
);

// Compound index to ensure unique provider + providerId
userSchema.index({ authProvider: 1, providerId: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
