const express = require('express');
const passport = require('passport');
const { handleOAuthCallback, getMe, refreshAccessToken, logout } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

// ─── Google OAuth ────────────────────────────────────────────────────────────

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/api/auth/failure' }),
  handleOAuthCallback
);

// ─── Facebook OAuth ──────────────────────────────────────────────────────────

router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: '/api/auth/failure' }),
  handleOAuthCallback
);

// ─── Twitter OAuth ───────────────────────────────────────────────────────────

router.get(
  '/twitter',
  passport.authenticate('twitter')
);

router.get(
  '/twitter/callback',
  passport.authenticate('twitter', { session: false, failureRedirect: '/api/auth/failure' }),
  handleOAuthCallback
);

// ─── Token & Session Routes ──────────────────────────────────────────────────

// Get current user (protected)
router.get('/me', authenticate, getMe);

// Refresh access token
router.post('/refresh', refreshAccessToken);

// Logout (protected)
router.post('/logout', authenticate, logout);

// Auth failure redirect
router.get('/failure', (req, res) => {
  res.status(401).json({
    status: 'error',
    message: 'Authentication failed. Please try again.',
  });
});

module.exports = router;
