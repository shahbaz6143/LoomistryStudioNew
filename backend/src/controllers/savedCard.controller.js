const SavedCard = require('../models/savedCard.model');

/**
 * Get saved cards
 * GET /api/account/cards
 */
const getCards = async (req, res) => {
  try {
    const cards = await SavedCard.find({ userId: req.user.id }).sort({ isDefault: -1, createdAt: -1 });
    res.status(200).json({ status: 'success', data: cards });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Add card
 * POST /api/account/cards
 */
const addCard = async (req, res) => {
  try {
    const { last4, brand, expiryMonth, expiryYear, cardholderName, isDefault } = req.body;
    if (!last4 || !brand || !expiryMonth || !expiryYear || !cardholderName) {
      return res.status(400).json({ status: 'error', message: 'All fields are required' });
    }

    if (isDefault) {
      await SavedCard.updateMany({ userId: req.user.id }, { isDefault: false });
    }

    const card = await SavedCard.create({
      userId: req.user.id,
      last4,
      brand,
      expiryMonth,
      expiryYear,
      cardholderName,
      isDefault: isDefault || (await SavedCard.countDocuments({ userId: req.user.id })) === 0,
    });

    res.status(201).json({ status: 'success', message: 'Card saved', data: card });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Delete card
 * DELETE /api/account/cards/:id
 */
const deleteCard = async (req, res) => {
  try {
    await SavedCard.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.status(200).json({ status: 'success', message: 'Card removed' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { getCards, addCard, deleteCard };
