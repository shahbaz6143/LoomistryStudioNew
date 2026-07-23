const express = require('express');
const Subscriber = require('../models/subscriber.model');

const router = express.Router();

// POST /api/newsletter/subscribe
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ status: 'error', message: 'Email is required' });

    const existing = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (!existing.isActive) {
        existing.isActive = true;
        await existing.save();
        return res.status(200).json({ status: 'success', message: 'Welcome back! You have been re-subscribed.' });
      }
      return res.status(200).json({ status: 'success', message: 'You are already subscribed!' });
    }

    await Subscriber.create({ email });
    res.status(201).json({ status: 'success', message: 'Thank you for subscribing!' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
