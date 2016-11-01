// controllers/channels.js

const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');

const router = express.Router(); // eslint-disable-line
const Channel = mongoose.model('Channel');

const createError = (status, message) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

const ensureBodyParams = (req, res, next) => {
    if (req.body.name) return next();
    return next(createError(400, 'Missing body parameter: name'));
};

module.exports = (app) => {
    app.use('/', router);
};

router.get('/api/channels', (req, res, next) => {
    Channel.find().select({ name: 1, _id: 0 })
        .then(channels => res.status(200).json(channels.map(channel => channel.name)))
        .catch(err => next(err));
});

router.post('/api/channels', ensureBodyParams, (req, res, next) => {
    const name = req.body.name;

    Channel.findOne({ name })
        .then((channel) => {
            if (!channel) {
                return new Channel({ name }).save();
            }
            throw createError(409, 'Channel already exists');
        })
        .then(() => res.status(201).json({ message: 'Created' }))
        .catch(error => next(error));
});

router.delete('/api/channels/:name', (req, res, next) => {
    const name = req.params.name;

    Channel.remove({ name })
        .then((result) => {
            // TODO: find out better way to detect when actually removed
            if (_.get(result, 'result.n') === 1) {
                return res.json({ message: 'Deleted' });
            }
            return next(createError(404, 'Not Found'));
        })
        .catch(err => next(err));
});
