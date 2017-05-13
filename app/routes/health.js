// app/routes/health.js

const express = require('express');

const router = express.Router();

const { getHealth } = require('../controllers/health.js');

router.get('/health', getHealth);

module.exports = router;
