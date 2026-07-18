const express = require('express');
const { detectRegion } = require('../controllers/geo.controller');

const router = express.Router();

router.get('/detect', detectRegion);

module.exports = router;
