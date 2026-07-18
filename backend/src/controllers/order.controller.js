const Order = require('../models/order.model');

/**
 * Get user's orders
 * GET /api/orders
 */
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select('-__v');

    res.status(200).json({ status: 'success', data: orders });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Get single order by ID
 * GET /api/orders/:id
 */
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });

    if (!order) {
      return res.status(404).json({ status: 'error', message: 'Order not found' });
    }

    res.status(200).json({ status: 'success', data: order });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Get order by order number (for confirmation page)
 * GET /api/orders/number/:orderNumber
 */
const getOrderByNumber = async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber, userId: req.user.id });

    if (!order) {
      return res.status(404).json({ status: 'error', message: 'Order not found' });
    }

    res.status(200).json({ status: 'success', data: order });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { getOrders, getOrderById, getOrderByNumber };
