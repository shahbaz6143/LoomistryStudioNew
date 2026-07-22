const express = require('express');
const { getBranding } = require('../controllers/settings.controller');

const router = express.Router();

// Public
router.get('/branding', getBranding);

module.exports = router;
