const User = require('../models/user.model');

/**
 * Get saved addresses
 * GET /api/account/addresses
 */
const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('addresses');
    res.status(200).json({ status: 'success', data: user.addresses || [] });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Add address
 * POST /api/account/addresses
 */
const addAddress = async (req, res) => {
  try {
    const { fullName, phone, addressLine1, addressLine2, city, state, postalCode, country, isDefault } = req.body;
    if (!fullName || !phone || !addressLine1 || !city || !state || !postalCode || !country) {
      return res.status(400).json({ status: 'error', message: 'All required fields must be filled' });
    }

    const user = await User.findById(req.user.id);

    // If setting as default, unset others
    if (isDefault) {
      user.addresses.forEach((a) => { a.isDefault = false; });
    }

    user.addresses.push({ fullName, phone, addressLine1, addressLine2, city, state, postalCode, country, isDefault: isDefault || user.addresses.length === 0 });
    await user.save();

    res.status(201).json({ status: 'success', message: 'Address added', data: user.addresses });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Update address
 * PUT /api/account/addresses/:addressId
 */
const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const address = user.addresses.id(req.params.addressId);
    if (!address) return res.status(404).json({ status: 'error', message: 'Address not found' });

    if (req.body.isDefault) {
      user.addresses.forEach((a) => { a.isDefault = false; });
    }

    Object.assign(address, req.body);
    await user.save();

    res.status(200).json({ status: 'success', message: 'Address updated', data: user.addresses });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Delete address
 * DELETE /api/account/addresses/:addressId
 */
const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.addresses.pull(req.params.addressId);
    await user.save();
    res.status(200).json({ status: 'success', message: 'Address deleted', data: user.addresses });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { getAddresses, addAddress, updateAddress, deleteAddress };
