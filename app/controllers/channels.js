// controllers/channels.js

const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');

const router = express.Router(); // eslint-disable-line
const Channel = mongoose.model('Channel');

module.exports = (app) => {
    app.use('/', router);
};

router.get('/api/channels', (req, res, next) => {
    Channel.find({}, { name: 1, _id: 0 }, (err, channels) => {
        if (err) return next(err);
        return res.status(200).json(channels.map(channel => channel.name));
    });
});

router.post('/api/channels', (req, res, next) => {
    const name = req.body.name;

    Channel.findOne({ name }, (err, channel) => {
        if (err) next(err);
        if (!channel) {
            const newChannel = new Channel({ name });
            return newChannel.save()
                .then(() => res.status(201).json({ message: 'Created' }))
                .catch(error => next(error));
        }
        return res.status(409).json({ message: `Channel "${name}" already exists` });
    });
});

router.delete('/api/channels/:name', (req, res, next) => {
    const name = req.params.name;

    Channel.remove({ name }, (err, result) => {
        if (err) next(err);
        // TODO: find out better way to detect when actually removed
        if (_.get(result, 'result.n') === 1) {
            return res.json({ message: 'Deleted' });
        }
        return res.status(404).json({ message: 'Not Found' });
    });
});
