const Cart = require('../models/cart.model');
const User = require('../models/user.model');
const { sendAbandonedCartEmail } = require('./email.service');

/**
 * Check for abandoned carts (not updated in 24 hours)
 * and send reminder emails.
 * 
 * Run this as a cron job or call it periodically.
 */
const checkAbandonedCarts = async () => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Find carts with items that haven't been updated in 24+ hours
    const abandonedCarts = await Cart.find({
      updatedAt: { $lt: twentyFourHoursAgo },
      'items.0': { $exists: true }, // has at least one item
    }).populate({
      path: 'items.productId',
      select: 'title slug images fixedSizes',
    });

    console.log(`🛒 Found ${abandonedCarts.length} abandoned carts`);

    for (const cart of abandonedCarts) {
      const user = await User.findById(cart.userId);
      if (!user || !user.email) continue;

      // Send abandoned cart email
      const result = await sendAbandonedCartEmail(user.email, user.name, cart.items);
      if (result.success) {
        console.log(`📧 Abandoned cart email sent to: ${user.email}`);
      }
    }

    return { processed: abandonedCarts.length };
  } catch (error) {
    console.error('Abandoned cart check failed:', error.message);
    return { error: error.message };
  }
};

module.exports = { checkAbandonedCarts };
