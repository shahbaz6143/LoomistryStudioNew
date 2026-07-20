const Catalogue = require('../models/catalogue.model');
const { sendCatalogueEmail } = require('../services/catalogue-email.service');
const { generateSlug } = require('../utils/helpers');

/**
 * Get all catalogues (admin)
 * GET /api/admin/catalogues
 */
const getAllCatalogues = async (req, res) => {
  try {
    const catalogues = await Catalogue.find().sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', data: catalogues });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Create catalogue (admin)
 * POST /api/admin/catalogues
 */
const createCatalogue = async (req, res) => {
  try {
    const { title, description, coverImage, pages } = req.body;

    if (!title || !pages || pages.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Title and at least one page are required' });
    }

    let slug = generateSlug(title);
    const existing = await Catalogue.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;

    const catalogue = await Catalogue.create({
      title,
      slug,
      description,
      coverImage: coverImage || pages[0],
      pages,
    });

    res.status(201).json({ status: 'success', message: 'Catalogue created', data: catalogue });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Update catalogue (admin)
 * PUT /api/admin/catalogues/:id
 */
const updateCatalogue = async (req, res) => {
  try {
    const catalogue = await Catalogue.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!catalogue) return res.status(404).json({ status: 'error', message: 'Catalogue not found' });
    res.status(200).json({ status: 'success', data: catalogue });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Delete catalogue (admin)
 * DELETE /api/admin/catalogues/:id
 */
const deleteCatalogue = async (req, res) => {
  try {
    await Catalogue.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: 'success', message: 'Catalogue deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Send catalogue email to client(s)
 * POST /api/admin/catalogues/:id/send
 */
const sendCatalogueToClients = async (req, res) => {
  try {
    const { emails } = req.body; // Array of email addresses

    if (!emails || emails.length === 0) {
      return res.status(400).json({ status: 'error', message: 'At least one email is required' });
    }

    const catalogue = await Catalogue.findById(req.params.id);
    if (!catalogue) {
      return res.status(404).json({ status: 'error', message: 'Catalogue not found' });
    }

    const results = [];
    for (const email of emails) {
      const result = await sendCatalogueEmail({
        to: email,
        campaignName: catalogue.title,
        catalogueSlug: catalogue.slug,
        coverImage: catalogue.coverImage,
      });
      results.push({ email, success: result.success });

      // Track sent
      catalogue.sentTo.push({ email, sentAt: new Date() });
    }

    await catalogue.save();

    res.status(200).json({
      status: 'success',
      message: `Catalogue sent to ${results.filter(r => r.success).length}/${emails.length} clients`,
      data: results,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Get catalogue by slug (public — for flipbook viewer)
 * GET /api/catalogues/:slug
 */
const getCatalogueBySlug = async (req, res) => {
  try {
    const catalogue = await Catalogue.findOne({ slug: req.params.slug, isActive: true });
    if (!catalogue) {
      return res.status(404).json({ status: 'error', message: 'Catalogue not found' });
    }
    res.status(200).json({ status: 'success', data: catalogue });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { getAllCatalogues, createCatalogue, updateCatalogue, deleteCatalogue, sendCatalogueToClients, getCatalogueBySlug };
