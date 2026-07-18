const { verifyToken } = require('../utils/jwt');

/**
 * Verify JWT access token from cookies
 * Attaches user payload to req.user
 */
const authenticate = (req, res, next) => {
  // Check cookie first, then Authorization header (Bearer token)
  let token = req.cookies?.accessToken;

  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication required. Please log in.',
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token. Please log in again.',
    });
  }

  req.user = decoded;
  next();
};

/**
 * Optional authentication — doesn't fail if no token,
 * but attaches user if token is valid (for guest + user flows)
 */
const optionalAuth = (req, res, next) => {
  let token = req.cookies?.accessToken;

  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
    }
  }

  next();
};

/**
 * Role-based access control
 * Usage: requireRole('admin') or requireRole('admin', 'editor')
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Insufficient permissions.',
      });
    }

    next();
  };
};

module.exports = { authenticate, optionalAuth, requireRole };
