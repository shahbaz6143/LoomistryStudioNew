const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    company: { type: String, trim: true },
    country: { type: String, trim: true },
    phone: { type: String, trim: true },
    tags: [{ type: String }], // e.g., 'wholesale', 'retail', 'vip'
    notes: { type: String },
    isActive: { type: Boolean, default: true },
    lastEmailed: { type: Date },
    emailCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
