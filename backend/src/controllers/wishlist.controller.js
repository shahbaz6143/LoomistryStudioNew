const User = require('../models/user.model');
const Product = require('../models/product.model');

/**
 * Get user's wishlist
 * GET /api/wishlist
 */
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'wishlist',
      select: 'title slug images category fixedSizes material avgRating',
    });

    res.status(200).json({
      status: 'success',
      data: user.wishlist || [],
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Add product to wishlist
 * POST /api/wishlist/add
 */
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ status: 'error', message: 'productId is required' });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    const user = await User.findById(req.user.id);

    // Check if already in wishlist
    if (user.wishlist.includes(productId)) {
      return res.status(200).json({ status: 'success', message: 'Already in wishlist', data: user.wishlist });
    }

    user.wishlist.push(productId);
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Added to wishlist',
      data: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Remove product from wishlist
 * DELETE /api/wishlist/:productId
 */
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.id);
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Removed from wishlist',
      data: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
