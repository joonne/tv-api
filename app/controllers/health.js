// controllers/about.js

const express = require('express'),
  router = express.Router();

module.exports = (app) => {
    app.use('/', router);
};

router.get('/health', (req, res, next) => {
  res.sendStatus(200);
});
