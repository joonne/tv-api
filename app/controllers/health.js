// controllers/about.js

const express = require('express');

const router = express.Router(); // eslint-disable-line

module.exports = (app) => {
    app.use('/', router);
};

router.get('/health', (req, res) => res.sendStatus(200));
