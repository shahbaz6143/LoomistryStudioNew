const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cart.controller');

const router = express.Router();

router.use(authenticate);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/clear', clearCart);
router.delete('/:itemId', removeFromCart);

module.exports = router;
