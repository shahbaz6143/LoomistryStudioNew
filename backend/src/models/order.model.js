const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title: { type: String, required: true },
  image: { type: String },
  size: { type: String, required: true },
  color: { type: String, default: '' },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  isCustomSize: { type: Boolean, default: false },
  customDimensions: {
    width: { type: Number },
    height: { type: Number },
  },
});

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderNumber: { type: String, unique: true },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    currency: { type: String, enum: ['INR', 'USD'], default: 'INR' },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    couponCode: { type: String },
    paymentMethod: { type: String, enum: ['razorpay', 'stripe'], required: true },
    paymentId: { type: String },
    paymentOrderId: { type: String },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    status: {
      type: String,
      enum: ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'confirmed',
    },
    tracking: {
      courierName: { type: String },
      trackingNumber: { type: String },
      trackingUrl: { type: String },
      shippedAt: { type: Date },
      deliveredAt: { type: Date },
    },
  },
  { timestamps: true }
);

// Generate order number before validation
orderSchema.pre('validate', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = 'LS' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
