// app/controllers/program.js

const mongoose = require('mongoose');

const Program = mongoose.model('Program');

function getProgramsByChannel(req, res, next) {
  const channel = req.params.channel;

  return Program
    .find({
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
}

module.exports = {
  getProgramsByChannel,
};
