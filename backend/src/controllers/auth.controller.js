const User = require('../models/user.model');
const { generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/jwt');

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

/**
 * Handle OAuth callback — generates tokens and redirects to frontend
 * Called after successful Passport authentication
 */
const handleOAuthCallback = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.redirect(`${CLIENT_URL}/auth/login?error=auth_failed`);
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();

    // Set tokens as httpOnly cookies (domain set to work across ports on localhost)
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    res.cookie('accessToken', accessToken, cookieOptions);
    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Redirect to frontend with token as query param (for cross-port dev)
    res.redirect(`${CLIENT_URL}/auth/callback?token=${accessToken}`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect(`${CLIENT_URL}/auth/login?error=server_error`);
  }
};

/**
 * Get current authenticated user
 * GET /api/auth/me
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-refreshToken -__v');

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Refresh access token using refresh token
 * POST /api/auth/refresh
 */
const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ status: 'error', message: 'No refresh token provided' });
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ status: 'error', message: 'Invalid refresh token' });
    }

    // Find user and verify stored refresh token matches
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ status: 'error', message: 'Invalid refresh token' });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user);

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token refreshed',
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Logout — clear cookies and invalidate refresh token
 * POST /api/auth/logout
 */
const logout = async (req, res) => {
  try {
    // Clear refresh token in DB if user is authenticated
    if (req.user?.id) {
      await User.findByIdAndUpdate(req.user.id, { refreshToken: null });
    }

    // Clear cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { handleOAuthCallback, getMe, refreshAccessToken, logout };
