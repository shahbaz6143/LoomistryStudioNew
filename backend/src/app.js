const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const rateLimit = require('express-rate-limit');

const { configurePassport } = require('./config/passport');
const healthRoutes = require('./routes/health.routes');
const productRoutes = require('./routes/product.routes');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const cartRoutes = require('./routes/cart.routes');
const wishlistRoutes = require('./routes/wishlist.routes');
const geoRoutes = require('./routes/geo.routes');
const paymentRoutes = require('./routes/payment.routes');
const orderRoutes = require('./routes/order.routes');
const couponRoutes = require('./routes/coupon.routes');
const reviewRoutes = require('./routes/review.routes');
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per 15 min
  message: { status: 'error', message: 'Too many requests. Please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 auth attempts per 15 min
  message: { status: 'error', message: 'Too many authentication attempts.' },
});

app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);
app.use('/api/payments/', authLimiter);

// Passport initialization
configurePassport();
app.use(passport.initialize());

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/geo', geoRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
