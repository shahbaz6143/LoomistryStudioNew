const mongoose = require('mongoose');

const savedCardSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    last4: { type: String, required: true },
    brand: { type: String, required: true }, // visa, mastercard, amex, rupay
    expiryMonth: { type: Number, required: true },
    expiryYear: { type: Number, required: true },
    cardholderName: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    // Never store full card number — only display info
    tokenId: { type: String }, // Payment gateway token if applicable
  },
  { timestamps: true }
);

const SavedCard = mongoose.model('SavedCard', savedCardSchema);

module.exports = SavedCard;
