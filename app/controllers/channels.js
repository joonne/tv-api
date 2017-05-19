// controllers/channels.js

const mongoose = require('mongoose');
const createError = require('http-errors');

const Channel = mongoose.model('Channel');

function getChannels(req, res, next) {
  return Channel
    .find()
    .select({ name: 1, _id: 0 })
    .sort()
    .then(channels => res.status(200).json(channels.map(channel => channel.name)))
    .catch(err => next(err));
}

function createChannel(req, res, next) {
  const name = req.body.name;

  return Channel
    .findOne({ name })
    .then((channel) => {
      if (channel) {
        throw new createError.Conflict('Channel already exists');
      }
      return new Channel({ name }).save();
    })
    .then(() => res.status(201).json({ message: 'Created' }))
    .catch(error => next(error));
}

function deleteChannel(req, res, next) {
  const name = req.params.name;

  return Channel
    .remove({ name })
    .then((result) => {
      if (!result.result.n) {
        throw new createError.NotFound('Not Found');
      }
      return { message: 'Deleted' };
    })
    .then(result => res.json(result))
    .catch(err => next(err));
}

module.exports = {
  getChannels,
  createChannel,
  deleteChannel,
};
