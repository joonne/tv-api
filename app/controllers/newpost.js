var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article'),
  moment = require('moment');

//moment.locale('fi');
var time = moment().format('MMMM Do YYYY, h:mm:ss a');

module.exports = function (app, io) {
  app.use('/', router);

  io.on('connection', function(socket) {
    socket.on('data', function(formData) {
      addPost(formData);
    });
  });

};

router.get('/newpost', function (req, res, next) {
  res.render('newpost');
});

function addPost(formData) {

  var title = formData.title;
  var text = formData.text;
  var timeStamp = time;

  console.log(title);
  console.log(text);

  var article = new Article({title: title, text: text, timeStamp: timeStamp});
  article.save(function (err, article) {
    if(err) return console.error(err);
  });
}

router.get('/removearticles', function (req, res, next) {
  Article.remove().exec();
  res.send("articles removed");
});