// models/channel.js

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ChannelSchema = new Schema({
  name: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Channel', ChannelSchema);
