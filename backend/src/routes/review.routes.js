const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { getProductReviews, createReview } = require('../controllers/review.controller');

const router = express.Router();

// Public - get reviews for a product
router.get('/:productId', getProductReviews);

// Authenticated - create a review
router.post('/', authenticate, createReview);

module.exports = router;
