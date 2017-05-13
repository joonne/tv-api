// app/routes/channels.js

const express = require('express');
const createError = require('http-errors');

const router = express.Router();
const {
  getChannels,
  createChannel,
  deleteChannel,
} = require('../controllers/channels');

const ensureBodyParams = (req, res, next) => {
  if (!req.body.name) next(new createError.BadRequest('Missing body parameter: name'));
  return next();
};

router.get('/api/channels', getChannels);
router.post('/api/channels', ensureBodyParams, createChannel);
router.delete('/api/channels/:name', deleteChannel);

module.exports = router;
