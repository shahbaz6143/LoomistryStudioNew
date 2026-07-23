const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    isActive: { type: Boolean, default: true },
    source: { type: String, default: 'footer' }, // footer, popup, checkout
  },
  { timestamps: true }
);

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = Subscriber;
