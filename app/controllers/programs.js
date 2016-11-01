// controllrs/program.js

const express = require('express');
const mongoose = require('mongoose');

const router = express.Router(); // eslint-disable-line
const Program = mongoose.model('Program');

module.exports = (app) => {
    app.use('/', router);
};

router.get('/api/programs/:channel', (req, res, next) => {
    const channel = req.params.channel;

    Program.find({
        channelName: channel,
    })
    .sort({
        'data.start': 1,
    })
    .select({
        _id: 0,
        channelName: 1,
        data: 1,
    })
    .then(programs => res.status(200).json(programs))
    .catch(err => next(err));
});

router.get('/api/programs', (req, res, next) => {
    Program.find()
        .then(programs => res.status(200).json(programs))
        .catch(err => next(err));
});
