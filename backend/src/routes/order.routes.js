const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { getOrders, getOrderById, getOrderByNumber } = require('../controllers/order.controller');

const router = express.Router();

router.use(authenticate);

router.get('/', getOrders);
router.get('/number/:orderNumber', getOrderByNumber);
router.get('/:id', getOrderById);

module.exports = router;
