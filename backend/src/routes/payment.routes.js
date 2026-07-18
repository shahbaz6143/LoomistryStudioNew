const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { createRazorpayOrder, verifyRazorpayPayment, createStripeIntent, confirmStripePayment } = require('../controllers/payment.controller');

const router = express.Router();

router.use(authenticate);

// Razorpay
router.post('/razorpay/create', createRazorpayOrder);
router.post('/razorpay/verify', verifyRazorpayPayment);

// Stripe
router.post('/stripe/create-intent', createStripeIntent);
router.post('/stripe/confirm', confirmStripePayment);

module.exports = router;
