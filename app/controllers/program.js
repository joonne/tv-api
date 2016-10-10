// controllrs/program.js

const express = require('express');
const mongoose = require('mongoose');

const router = express.Router(); // eslint-disable-line
const Program = mongoose.model('Program');

module.exports = (app) => {
    app.use('/', router);
};

router.get('/api/program/:seriesid', (req, res) => {
    const seriesid = req.params.seriesid;

    Program.findOne(({
        'data.seriesid': seriesid,
    }), (err, program) => {
        if (program) {
            return res.status(200).json({
                name: program.data.name,
                channelName: program.channelName,
                start: program.data.start,
            });
        }
        return res.status(404).json({
            error: 'seriesid not found',
        });
    });
});
