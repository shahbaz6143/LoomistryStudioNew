const express = require('express');
const {
  getProducts,
  getProductBySlug,
  getCategories,
  getCollections,
  searchProducts,
} = require('../controllers/product.controller');

const router = express.Router();

// GET /api/products/categories — must come before /:slug
router.get('/categories', getCategories);

// GET /api/products/collections
router.get('/collections', getCollections);

// GET /api/products/search?q=
router.get('/search', searchProducts);

// GET /api/products
router.get('/', getProducts);

// GET /api/products/:slug
router.get('/:slug', getProductBySlug);

module.exports = router;
