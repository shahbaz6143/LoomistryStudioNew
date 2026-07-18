const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { validateCoupon } = require('../controllers/coupon.controller');

const router = express.Router();

// Public route for buyers to validate a coupon
router.post('/validate', authenticate, validateCoupon);

module.exports = router;
