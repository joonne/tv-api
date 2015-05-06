// models/article.js

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: String,
  text: String,
  timeStamp: String
});

mongoose.model('Article', ArticleSchema);

