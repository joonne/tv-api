// app/routes/index.js

const express = require('express');

const router = express.Router();

const { getChannels } = require('../controllers/channels');
const { getProgramsByChannel } = require('../controllers/programs');
const { getHealth } = require('../controllers/health.js');

router.get('/api/channels', getChannels);
router.get('/api/channels/:channel/programs', getProgramsByChannel);
router.get('/health', getHealth);

module.exports = router;
