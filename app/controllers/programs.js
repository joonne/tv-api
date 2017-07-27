// app/controllers/program.js

const mongo = require('../helpers/mongo');

function getProgramsByChannel(req, res, next) {
  // const _channelId = mongo.getMongoId(req.params.channel);
  const _channelId = req.params.channel;

  return mongo.getDb
    .then(db => db.collection('programs').find({ _channelId }).sort({ 'data.start': 1 }).toArray())
    .then(programs => res.status(200).json(programs))
    .catch(err => next(err));
}

module.exports = {
  getProgramsByChannel,
};
