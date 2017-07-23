// models/program.js

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProgramSchema = new Schema({
  _channelId: Schema.Types.ObjectId,
  createdAt: {
    type: Date,
    expires: 172800,
    default: Date.now,
  },
  data: {
    name: String,
    description: String,
    season: String,
    episode: String,
    start: String,
    end: String,
    seriesid: String,
  },
});

module.exports = mongoose.model('Program', ProgramSchema);
