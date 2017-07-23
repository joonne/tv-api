// app/routes/index.js

const express = require('express');
const createError = require('http-errors');

const router = express.Router();

const {
  getProgramsByChannel,
} = require('../controllers/programs');

const {
  getChannels,
  createChannel,
  deleteChannel,
} = require('../controllers/channels');

const { getHealth } = require('../controllers/health.js');

const ensureBodyParams = (req, res, next) => {
  if (!req.body.name) next(new createError.BadRequest('Missing body parameter: name'));
  return next();
};

router.get('/api/channels', getChannels);
router.post('/api/channels', ensureBodyParams, createChannel);
router.delete('/api/channels/:name', deleteChannel);
router.get('/api/channels/:channel/programs', getProgramsByChannel);
router.get('/health', getHealth);

module.exports = router;
