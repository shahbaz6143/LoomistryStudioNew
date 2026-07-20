const Client = require('../models/client.model');
const { sendCatalogueEmail } = require('../services/catalogue-email.service');
const Catalogue = require('../models/catalogue.model');

/**
 * Get all clients
 * GET /api/admin/clients
 */
const getAllClients = async (req, res) => {
  try {
    const { search, tag } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }
    if (tag) filter.tags = tag;

    const clients = await Client.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', data: clients });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Add a client
 * POST /api/admin/clients
 */
const addClient = async (req, res) => {
  try {
    const { name, email, company, country, phone, tags, notes } = req.body;
    if (!name || !email) {
      return res.status(400).json({ status: 'error', message: 'Name and email are required' });
    }

    const existing = await Client.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ status: 'error', message: 'Client with this email already exists' });
    }

    const client = await Client.create({ name, email, company, country, phone, tags: tags || [], notes });
    res.status(201).json({ status: 'success', message: 'Client added', data: client });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Add multiple clients (bulk import)
 * POST /api/admin/clients/bulk
 */
const addBulkClients = async (req, res) => {
  try {
    const { clients } = req.body; // Array of { name, email, company, country }
    if (!clients || clients.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Clients array is required' });
    }

    let added = 0;
    let skipped = 0;
    for (const c of clients) {
      try {
        await Client.create({ name: c.name, email: c.email, company: c.company, country: c.country });
        added++;
      } catch (e) {
        skipped++; // duplicate or validation error
      }
    }

    res.status(200).json({ status: 'success', message: `Added ${added}, Skipped ${skipped} (duplicates)` });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Update a client
 * PUT /api/admin/clients/:id
 */
const updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!client) return res.status(404).json({ status: 'error', message: 'Client not found' });
    res.status(200).json({ status: 'success', data: client });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Delete a client
 * DELETE /api/admin/clients/:id
 */
const deleteClient = async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: 'success', message: 'Client deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Send bulk email to selected clients
 * POST /api/admin/clients/send-email
 */
const sendBulkEmail = async (req, res) => {
  try {
    const { clientIds, catalogueId, subject } = req.body;

    if (!clientIds || clientIds.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Select at least one client' });
    }
    if (!catalogueId) {
      return res.status(400).json({ status: 'error', message: 'Catalogue is required' });
    }

    const catalogue = await Catalogue.findById(catalogueId);
    if (!catalogue) {
      return res.status(404).json({ status: 'error', message: 'Catalogue not found' });
    }

    const clients = await Client.find({ _id: { $in: clientIds } });

    let sent = 0;
    let failed = 0;
    const results = [];

    for (const client of clients) {
      const result = await sendCatalogueEmail({
        to: client.email,
        clientName: client.name,
        subject: subject || `${catalogue.title} — LoomistryStudio`,
        campaignName: catalogue.title,
        catalogueSlug: catalogue.slug,
        coverImage: catalogue.coverImage,
      });

      if (result.success) {
        sent++;
        client.lastEmailed = new Date();
        client.emailCount = (client.emailCount || 0) + 1;
        await client.save();

        // Track in catalogue
        catalogue.sentTo.push({ email: client.email, sentAt: new Date() });
      } else {
        failed++;
      }

      results.push({ email: client.email, name: client.name, success: result.success });
    }

    await catalogue.save();

    res.status(200).json({
      status: 'success',
      message: `Sent to ${sent}/${clients.length} clients. ${failed} failed.`,
      data: results,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { getAllClients, addClient, addBulkClients, updateClient, deleteClient, sendBulkEmail };
