const Coupon = require('../models/coupon.model');

// ─── Admin CRUD ──────────────────────────────────────────────────────────────

/**
 * Get all coupons (admin)
 * GET /api/admin/coupons
 */
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', data: coupons });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Create coupon (admin)
 * POST /api/admin/coupons
 */
const createCoupon = async (req, res) => {
  try {
    const { code, type, value, minOrderAmount, maxDiscount, expiresAt, usageLimit, applicableCategories, isActive } = req.body;

    if (!code || !type || !value || !expiresAt) {
      return res.status(400).json({ status: 'error', message: 'code, type, value, and expiresAt are required' });
    }

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ status: 'error', message: 'Coupon code already exists' });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      type,
      value,
      minOrderAmount: minOrderAmount || 0,
      maxDiscount: maxDiscount || null,
      expiresAt,
      usageLimit: usageLimit || null,
      applicableCategories: applicableCategories || [],
      isActive: isActive !== false,
    });

    res.status(201).json({ status: 'success', message: 'Coupon created', data: coupon });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Update coupon (admin)
 * PUT /api/admin/coupons/:id
 */
const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!coupon) {
      return res.status(404).json({ status: 'error', message: 'Coupon not found' });
    }
    res.status(200).json({ status: 'success', message: 'Coupon updated', data: coupon });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Delete coupon (admin)
 * DELETE /api/admin/coupons/:id
 */
const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: 'success', message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Toggle coupon active/inactive (admin)
 * PATCH /api/admin/coupons/:id/toggle
 */
const toggleCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ status: 'error', message: 'Coupon not found' });
    }
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    res.status(200).json({ status: 'success', data: coupon });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// ─── Buyer: Validate & Apply ─────────────────────────────────────────────────

/**
 * Validate and calculate discount for a coupon code
 * POST /api/coupons/validate
 */
const validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;

    if (!code || !orderAmount) {
      return res.status(400).json({ status: 'error', message: 'code and orderAmount are required' });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
      return res.status(404).json({ status: 'error', message: 'Invalid coupon code' });
    }

    // Check expiry
    if (new Date() > new Date(coupon.expiresAt)) {
      return res.status(400).json({ status: 'error', message: 'Coupon has expired' });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ status: 'error', message: 'Coupon usage limit reached' });
    }

    // Check minimum order
    if (orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        status: 'error',
        message: `Minimum order amount is ₹${coupon.minOrderAmount.toLocaleString()}`,
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (orderAmount * coupon.value) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      // flat
      discount = coupon.value;
      if (discount > orderAmount) {
        discount = orderAmount;
      }
    }

    res.status(200).json({
      status: 'success',
      message: 'Coupon applied!',
      data: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discount: Math.round(discount),
        maxDiscount: coupon.maxDiscount,
      },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { getAllCoupons, createCoupon, updateCoupon, deleteCoupon, toggleCoupon, validateCoupon };
