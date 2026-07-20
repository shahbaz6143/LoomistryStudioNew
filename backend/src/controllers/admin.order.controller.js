const Order = require('../models/order.model');

/**
 * Get all orders (admin) with filters and pagination
 * GET /api/admin/orders
 */
const getAllOrders = async (req, res) => {
  try {
    const { status, paymentMethod, page = 1, limit = 20, search } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (paymentMethod) filter.paymentMethod = paymentMethod;
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('userId', 'name email'),
      Order.countDocuments(filter),
    ]);

    res.status(200).json({
      status: 'success',
      data: orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Get single order detail (admin)
 * GET /api/admin/orders/:id
 */
const getOrderDetail = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId', 'name email avatar');

    if (!order) {
      return res.status(404).json({ status: 'error', message: 'Order not found' });
    }

    res.status(200).json({ status: 'success', data: order });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Update order status
 * PUT /api/admin/orders/:id/status
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ status: 'error', message: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ status: 'error', message: 'Order not found' });
    }

    order.status = status;

    // Auto-set timestamps
    if (status === 'shipped' && !order.tracking.shippedAt) {
      order.tracking.shippedAt = new Date();
    }
    if (status === 'delivered' && !order.tracking.deliveredAt) {
      order.tracking.deliveredAt = new Date();
    }

    await order.save();

    res.status(200).json({
      status: 'success',
      message: `Order status updated to "${status}"`,
      data: order,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Update tracking info
 * PUT /api/admin/orders/:id/tracking
 */
const updateTracking = async (req, res) => {
  try {
    const { courierName, trackingNumber, trackingUrl } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ status: 'error', message: 'Order not found' });
    }

    if (courierName) order.tracking.courierName = courierName;
    if (trackingNumber) order.tracking.trackingNumber = trackingNumber;
    if (trackingUrl) order.tracking.trackingUrl = trackingUrl;

    await order.save();

    res.status(200).json({
      status: 'success',
      message: 'Tracking info updated',
      data: order,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Get order stats (admin dashboard)
 * GET /api/admin/orders/stats
 */
const getOrderStats = async (req, res) => {
  try {
    const [total, confirmed, processing, shipped, delivered, cancelled] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'confirmed' }),
      Order.countDocuments({ status: 'processing' }),
      Order.countDocuments({ status: 'shipped' }),
      Order.countDocuments({ status: 'delivered' }),
      Order.countDocuments({ status: 'cancelled' }),
    ]);

    const revenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        total,
        confirmed,
        processing,
        shipped,
        delivered,
        cancelled,
        revenue: revenue[0]?.total || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { getAllOrders, getOrderDetail, updateOrderStatus, updateTracking, getOrderStats };
