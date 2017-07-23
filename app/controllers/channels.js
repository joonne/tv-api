// controllers/channels.js

const mongoose = require('mongoose');

const Channel = mongoose.model('Channel');

function getChannels(req, res, next) {
  return Channel
    .find()
    .select({ name: 1, telsuId: 1, xmltvId: 1, _id: 1 })
    .sort({ orderNumber: 1 })
    .then(channels => res.status(200).json(channels))
    .catch(err => next(err));
}

module.exports = {
  getChannels,
};
