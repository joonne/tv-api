// controllers/channels.js

const mongo = require('../helpers/mongo');

function getChannels(req, res, next) {
  return mongo.getDb
    .then(db => db.collection('channels').find({}).sort({ orderNumber: 1 }).toArray())
    .then(channels => res.status(200).json(channels))
    .catch(err => next(err));
}

module.exports = {
  getChannels,
};
