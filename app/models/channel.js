// models/channel.js

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ChannelSchema = new Schema({
  name: String,
  orderNumber: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Channel', ChannelSchema);
