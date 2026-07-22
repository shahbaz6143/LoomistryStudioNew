const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { getAddresses, addAddress, updateAddress, deleteAddress } = require('../controllers/address.controller');
const { getCards, addCard, deleteCard } = require('../controllers/savedCard.controller');

const router = express.Router();

router.use(authenticate);

// Addresses
router.get('/addresses', getAddresses);
router.post('/addresses', addAddress);
router.put('/addresses/:addressId', updateAddress);
router.delete('/addresses/:addressId', deleteAddress);

// Saved Cards
router.get('/cards', getCards);
router.post('/cards', addCard);
router.delete('/cards/:id', deleteCard);

module.exports = router;
