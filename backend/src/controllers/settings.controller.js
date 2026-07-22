const Settings = require('../models/settings.model');

/**
 * Get branding settings (public)
 * GET /api/settings/branding
 */
const getBranding = async (req, res) => {
  try {
    const name = await Settings.get('brand_name', 'LoomistryStudio');
    const logo = await Settings.get('brand_logo', '/logo.png');
    const logoDark = await Settings.get('brand_logo_dark', '/logo.png');
    const favicon = await Settings.get('brand_favicon', '/favicon.ico');
    const tagline = await Settings.get('brand_tagline', 'Premium Handmade Rugs & Carpets');

    res.status(200).json({
      status: 'success',
      data: { name, logo, logoDark, favicon, tagline },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Update branding settings (admin)
 * PUT /api/admin/settings/branding
 */
const updateBranding = async (req, res) => {
  try {
    const { name, logo, logoDark, favicon, tagline } = req.body;

    if (name !== undefined) await Settings.set('brand_name', name);
    if (logo !== undefined) await Settings.set('brand_logo', logo);
    if (logoDark !== undefined) await Settings.set('brand_logo_dark', logoDark);
    if (favicon !== undefined) await Settings.set('brand_favicon', favicon);
    if (tagline !== undefined) await Settings.set('brand_tagline', tagline);

    res.status(200).json({ status: 'success', message: 'Branding updated' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Get all settings (admin)
 * GET /api/admin/settings
 */
const getAllSettings = async (req, res) => {
  try {
    const settings = await Settings.find();
    const obj = {};
    settings.forEach((s) => { obj[s.key] = s.value; });
    res.status(200).json({ status: 'success', data: obj });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { getBranding, updateBranding, getAllSettings };
