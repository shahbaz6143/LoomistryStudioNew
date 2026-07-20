const Review = require('../models/review.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');

/**
 * Get reviews for a product (public)
 * GET /api/reviews/:productId
 */
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { sort = 'newest', page = 1, limit = 10 } = req.query;

    let sortOption = { createdAt: -1 };
    if (sort === 'highest') sortOption = { rating: -1 };
    if (sort === 'lowest') sortOption = { rating: 1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total] = await Promise.all([
      Review.find({ productId, isApproved: true })
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit))
        .populate('userId', 'name avatar'),
      Review.countDocuments({ productId, isApproved: true }),
    ]);

    // Rating breakdown
    const breakdown = await Review.aggregate([
      { $match: { productId: require('mongoose').Types.ObjectId.createFromHexString(productId), isApproved: true } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
    ]);

    res.status(200).json({
      status: 'success',
      data: reviews,
      breakdown,
      pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Create a review (authenticated buyer)
 * POST /api/reviews
 */
const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({ status: 'error', message: 'productId, rating, and comment are required' });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    // Check if user already reviewed
    const existing = await Review.findOne({ userId: req.user.id, productId });
    if (existing) {
      return res.status(400).json({ status: 'error', message: 'You have already reviewed this product' });
    }

    // Check if user purchased this product (verified review)
    const hasPurchased = await Order.findOne({
      userId: req.user.id,
      'items.productId': productId,
      paymentStatus: 'paid',
    });

    const review = await Review.create({
      userId: req.user.id,
      productId,
      rating: Number(rating),
      comment,
      verified: !!hasPurchased,
    });

    // Update product average rating
    const stats = await Review.aggregate([
      { $match: { productId: product._id, isApproved: true } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    if (stats.length > 0) {
      product.avgRating = Math.round(stats[0].avgRating * 10) / 10;
      product.reviewCount = stats[0].count;
      await product.save();
    }

    await review.populate('userId', 'name avatar');

    res.status(201).json({
      status: 'success',
      message: 'Review submitted!',
      data: review,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ status: 'error', message: 'You have already reviewed this product' });
    }
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Get all reviews (admin - moderation)
 * GET /api/admin/reviews
 */
const getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20, isApproved } = req.query;

    const filter = {};
    if (isApproved !== undefined) filter.isApproved = isApproved === 'true';

    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('userId', 'name email avatar')
        .populate('productId', 'title slug'),
      Review.countDocuments(filter),
    ]);

    res.status(200).json({
      status: 'success',
      data: reviews,
      pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Moderate review (approve/hide)
 * PUT /api/admin/reviews/:id
 */
const moderateReview = async (req, res) => {
  try {
    const { isApproved } = req.body;
    const review = await Review.findByIdAndUpdate(req.params.id, { isApproved }, { new: true })
      .populate('userId', 'name email')
      .populate('productId', 'title slug');

    if (!review) {
      return res.status(404).json({ status: 'error', message: 'Review not found' });
    }

    // Recalculate product rating
    const stats = await Review.aggregate([
      { $match: { productId: review.productId._id, isApproved: true } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    await Product.findByIdAndUpdate(review.productId._id, {
      avgRating: stats.length > 0 ? Math.round(stats[0].avgRating * 10) / 10 : 0,
      reviewCount: stats.length > 0 ? stats[0].count : 0,
    });

    res.status(200).json({ status: 'success', message: isApproved ? 'Review approved' : 'Review hidden', data: review });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Delete review (admin)
 * DELETE /api/admin/reviews/:id
 */
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ status: 'error', message: 'Review not found' });
    }

    // Recalculate product rating
    const stats = await Review.aggregate([
      { $match: { productId: review.productId, isApproved: true } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    await Product.findByIdAndUpdate(review.productId, {
      avgRating: stats.length > 0 ? Math.round(stats[0].avgRating * 10) / 10 : 0,
      reviewCount: stats.length > 0 ? stats[0].count : 0,
    });

    res.status(200).json({ status: 'success', message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { getProductReviews, createReview, getAllReviews, moderateReview, deleteReview };
