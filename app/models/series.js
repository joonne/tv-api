// series model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var SeriesSchema = new Schema({
	name: String,
	description: String,
	season: String,
	episode: String,
	start: String,
	end: String,
	seriesid: String
});

module.exports = mongoose.model('Series', SeriesSchema);