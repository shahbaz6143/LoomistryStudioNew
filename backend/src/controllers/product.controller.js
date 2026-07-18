const Product = require('../models/product.model');
const { dummyProducts } = require('../data/dummy-products');

/**
 * Get all products with optional filters
 * GET /api/products
 */
const getProducts = async (req, res) => {
  try {
    const { category, collection, color, material, shape, sort, minPrice, maxPrice, page = 1, limit = 12 } = req.query;

    // If DB is connected, fetch from MongoDB
    if (require('mongoose').connection.readyState === 1) {
      const filter = { isActive: true };
      if (category) filter.category = category;
      if (collection) filter.collections = collection;
      if (color) filter.colors = color;
      if (material) filter.material = material;
      if (shape) filter.shape = shape;
      if (minPrice || maxPrice) {
        filter['fixedSizes.priceINR'] = {};
        if (minPrice) filter['fixedSizes.priceINR'].$gte = Number(minPrice);
        if (maxPrice) filter['fixedSizes.priceINR'].$lte = Number(maxPrice);
      }

      let sortOption = { createdAt: -1 };
      if (sort === 'price_asc') sortOption = { 'fixedSizes.0.priceINR': 1 };
      if (sort === 'price_desc') sortOption = { 'fixedSizes.0.priceINR': -1 };
      if (sort === 'rating') sortOption = { avgRating: -1 };
      if (sort === 'newest') sortOption = { createdAt: -1 };
      if (sort === 'popular') sortOption = { reviewCount: -1 };

      const skip = (Number(page) - 1) * Number(limit);
      const products = await Product.find(filter).sort(sortOption).skip(skip).limit(Number(limit));
      const total = await Product.countDocuments(filter);

      return res.status(200).json({
        status: 'success',
        data: products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    }

    // Fallback: return dummy data when DB is not available
    let filtered = [...dummyProducts];
    if (category) filtered = filtered.filter(p => p.category === category);
    if (collection) filtered = filtered.filter(p => p.collections.includes(collection));
    if (color) filtered = filtered.filter(p => p.colors.includes(color));
    if (material) filtered = filtered.filter(p => p.material === material);
    if (minPrice) filtered = filtered.filter(p => p.fixedSizes?.[0]?.priceINR >= Number(minPrice));
    if (maxPrice) filtered = filtered.filter(p => p.fixedSizes?.[0]?.priceINR <= Number(maxPrice));

    res.status(200).json({
      status: 'success',
      data: filtered,
      pagination: {
        page: 1,
        limit: filtered.length,
        total: filtered.length,
        totalPages: 1,
      },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Get single product by slug
 * GET /api/products/:slug
 */
const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (require('mongoose').connection.readyState === 1) {
      const product = await Product.findOne({ slug, isActive: true });
      if (!product) {
        return res.status(404).json({ status: 'error', message: 'Product not found' });
      }
      return res.status(200).json({ status: 'success', data: product });
    }

    // Fallback: dummy data
    const product = dummyProducts.find(p => p.slug === slug);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }
    res.status(200).json({ status: 'success', data: product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Get product categories
 * GET /api/products/categories
 */
const getCategories = async (req, res) => {
  try {
    const categories = [
      { slug: 'hand-knotted', name: 'Hand Knotted', image: '/images/categories/hand-knotted.jpg' },
      { slug: 'hand-tufted', name: 'Hand Tufted', image: '/images/categories/hand-tufted.jpg' },
      { slug: 'flatweave', name: 'Flatweave', image: '/images/categories/flatweave.jpg' },
      { slug: 'persian', name: 'Persian', image: '/images/categories/persian.jpg' },
      { slug: 'abstract', name: 'Abstract', image: '/images/categories/abstract.jpg' },
      { slug: 'traditional', name: 'Traditional', image: '/images/categories/traditional.jpg' },
      { slug: 'modern', name: 'Modern', image: '/images/categories/modern.jpg' },
    ];

    res.status(200).json({ status: 'success', data: categories });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Get product collections
 * GET /api/products/collections
 */
const getCollections = async (req, res) => {
  try {
    const collections = [
      { slug: 'bestsellers', name: 'Bestsellers' },
      { slug: 'new-arrivals', name: 'New Arrivals' },
      { slug: 'living-room', name: 'Living Room' },
      { slug: 'bedroom', name: 'Bedroom' },
      { slug: 'dining-room', name: 'Dining Room' },
      { slug: 'deal-of-the-week', name: 'Deal of the Week' },
    ];

    res.status(200).json({ status: 'success', data: collections });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Search products with autocomplete
 * GET /api/products/search?q=blue+persian&limit=5
 */
const searchProducts = async (req, res) => {
  try {
    const { q, limit = 5 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(200).json({ status: 'success', data: [] });
    }

    if (require('mongoose').connection.readyState === 1) {
      const regex = new RegExp(q.trim(), 'i');
      const products = await Product.find({
        isActive: true,
        $or: [
          { title: regex },
          { category: regex },
          { material: regex },
          { colors: regex },
        ],
      })
        .select('title slug images category fixedSizes')
        .limit(Number(limit));

      return res.status(200).json({ status: 'success', data: products });
    }

    // Fallback: dummy data search
    const regex = new RegExp(q.trim(), 'i');
    const results = dummyProducts
      .filter(p => regex.test(p.title) || regex.test(p.category) || regex.test(p.material))
      .slice(0, Number(limit))
      .map(p => ({ _id: p._id, title: p.title, slug: p.slug, images: p.images, category: p.category, fixedSizes: p.fixedSizes }));

    res.status(200).json({ status: 'success', data: results });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { getProducts, getProductBySlug, getCategories, getCollections, searchProducts };
