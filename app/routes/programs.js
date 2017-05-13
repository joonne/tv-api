// app/routes/programs.js

const express = require('express');

const router = express.Router();

const {
  getPrograms,
  getProgramsByChannel,
} = require('../controllers/programs');

router.get('/api/programs', getPrograms);
router.get('/api/programs/:channel', getProgramsByChannel);

module.exports = router;
