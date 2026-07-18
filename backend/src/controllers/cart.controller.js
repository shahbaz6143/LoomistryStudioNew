const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

/**
 * Get user's cart with populated product details
 * GET /api/cart
 */
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id }).populate({
      path: 'items.productId',
      select: 'title slug images fixedSizes customSizePrice material',
    });

    if (!cart) {
      cart = { items: [] };
    }

    res.status(200).json({
      status: 'success',
      data: cart,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Add item to cart
 * POST /api/cart/add
 */
const addToCart = async (req, res) => {
  try {
    const { productId, size, color, quantity = 1, isCustomSize = false, customDimensions } = req.body;

    if (!productId || !size) {
      return res.status(400).json({ status: 'error', message: 'productId and size are required' });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    // Check if same product + size + color already in cart
    const existingIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId && item.size === size && item.color === (color || '')
    );

    if (existingIndex > -1) {
      // Update quantity
      cart.items[existingIndex].quantity += Number(quantity);
    } else {
      // Add new item
      cart.items.push({
        productId,
        size,
        color: color || '',
        quantity: Number(quantity),
        isCustomSize,
        customDimensions: isCustomSize ? customDimensions : undefined,
      });
    }

    await cart.save();

    // Return populated cart
    cart = await Cart.findById(cart._id).populate({
      path: 'items.productId',
      select: 'title slug images fixedSizes customSizePrice material',
    });

    res.status(200).json({
      status: 'success',
      message: 'Added to cart',
      data: cart,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Update item quantity in cart
 * PUT /api/cart/update
 */
const updateCartItem = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;

    if (!itemId || !quantity) {
      return res.status(400).json({ status: 'error', message: 'itemId and quantity are required' });
    }

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ status: 'error', message: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      cart.items.pull(itemId);
    } else {
      item.quantity = Number(quantity);
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.productId',
      select: 'title slug images fixedSizes customSizePrice material',
    });

    res.status(200).json({
      status: 'success',
      message: 'Cart updated',
      data: updatedCart,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Remove item from cart
 * DELETE /api/cart/:itemId
 */
const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Cart not found' });
    }

    cart.items.pull(itemId);
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.productId',
      select: 'title slug images fixedSizes customSizePrice material',
    });

    res.status(200).json({
      status: 'success',
      message: 'Item removed from cart',
      data: updatedCart,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Clear entire cart
 * DELETE /api/cart
 */
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user.id });
    res.status(200).json({ status: 'success', message: 'Cart cleared', data: { items: [] } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
