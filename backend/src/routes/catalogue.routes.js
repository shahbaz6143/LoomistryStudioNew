const express = require('express');
const { getCatalogueBySlug } = require('../controllers/catalogue.controller');

const router = express.Router();

// Public — get catalogue for flipbook viewer
router.get('/:slug', getCatalogueBySlug);

module.exports = router;
