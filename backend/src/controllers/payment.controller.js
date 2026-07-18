const Razorpay = require('razorpay');
const crypto = require('crypto');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/order.model');
const Cart = require('../models/cart.model');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create Razorpay order
 * POST /api/payments/razorpay/create
 */
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', orderId } = req.body;

    if (!amount) {
      return res.status(400).json({ status: 'error', message: 'Amount is required' });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects paise
      currency,
      receipt: orderId || `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(200).json({
      status: 'success',
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to create payment order' });
  }
};

/**
 * Verify Razorpay payment signature
 * POST /api/payments/razorpay/verify
 */
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ status: 'error', message: 'Payment verification failed' });
    }

    // Create the order
    const order = new Order({
      userId: req.user.id,
      items: orderData.items,
      shippingAddress: orderData.shippingAddress,
      currency: orderData.currency || 'INR',
      subtotal: orderData.subtotal,
      discount: orderData.discount || 0,
      shippingCost: orderData.shippingCost || 0,
      totalAmount: orderData.totalAmount,
      couponCode: orderData.couponCode || null,
      paymentMethod: 'razorpay',
      paymentId: razorpay_payment_id,
      paymentOrderId: razorpay_order_id,
      paymentStatus: 'paid',
      status: 'confirmed',
    });

    await order.save();

    // Clear cart after successful order
    await Cart.findOneAndDelete({ userId: req.user.id });

    res.status(200).json({
      status: 'success',
      message: 'Payment verified and order placed',
      data: order,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Create Stripe PaymentIntent
 * POST /api/payments/stripe/create-intent
 */
const createStripeIntent = async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    if (!amount) {
      return res.status(400).json({ status: 'error', message: 'Amount is required' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects cents
      currency: currency.toLowerCase(),
      metadata: {
        userId: req.user.id,
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
    });
  } catch (error) {
    console.error('Stripe intent error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to create payment intent' });
  }
};

/**
 * Confirm Stripe payment and create order
 * POST /api/payments/stripe/confirm
 */
const confirmStripePayment = async (req, res) => {
  try {
    const { paymentIntentId, orderData } = req.body;

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ status: 'error', message: 'Payment not completed' });
    }

    // Create the order
    const order = new Order({
      userId: req.user.id,
      items: orderData.items,
      shippingAddress: orderData.shippingAddress,
      currency: orderData.currency || 'USD',
      subtotal: orderData.subtotal,
      discount: orderData.discount || 0,
      shippingCost: orderData.shippingCost || 0,
      totalAmount: orderData.totalAmount,
      couponCode: orderData.couponCode || null,
      paymentMethod: 'stripe',
      paymentId: paymentIntentId,
      paymentStatus: 'paid',
      status: 'confirmed',
    });

    await order.save();

    // Clear cart
    await Cart.findOneAndDelete({ userId: req.user.id });

    res.status(200).json({
      status: 'success',
      message: 'Payment confirmed and order placed',
      data: order,
    });
  } catch (error) {
    console.error('Stripe confirm error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { createRazorpayOrder, verifyRazorpayPayment, createStripeIntent, confirmStripePayment };
