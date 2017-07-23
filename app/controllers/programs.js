// app/controllers/program.js

const mongoose = require('mongoose');

const Program = mongoose.model('Program');
const ObjectId = mongoose.Types.ObjectId;

function getProgramsByChannel(req, res, next) {
  const _channelId = new ObjectId(req.params.channel);

  return Program
    .find({
      _channelId,
    })
    .sort({
      'data.start': 1,
    })
    .select({
      _id: 0,
      _channelId: 1,
      data: 1,
    })
    .then(programs => res.status(200).json(programs))
    .catch(err => next(err));
}

module.exports = {
  getProgramsByChannel,
};
