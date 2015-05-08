// models/article.js

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: String,
  text: String,
  author: String,
  createdAt: { type: String, default: Date.now }
});

mongoose.model('Article', ArticleSchema);

