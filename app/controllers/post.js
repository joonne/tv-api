// controllers/post.js

var express = require('express'),
router = express.Router(),
mongoose = require('mongoose'),
Article = mongoose.model('Article')

module.exports = function (app,passport) {
  app.use('/post', router);

  router.post('/add', function (req, res, next) {

    var title = req.body.title;
    var text = req.body.text;

    var article = new Article({title: title, text: text, author: req.user.username});
    article.save(function (err, article) {
      if(err) return console.error(err);
    });

    console.log(article);

    res.redirect('/');

  });

  router.post('/edit/:id', function (req, res, next) {

    var id = req.params['id'];
    var title = req.body.title;
    var text = req.body.text;

    Article.findOne({'_id': id}, function(err, article) {
      if(article) {
        article.title = title;
        article.text = text;
        article.save(function (err, article) {
          if(article) {
            res.redirect('/');
          }
        });
      }
    });
  });

  router.get('/:id', isLoggedIn, function (req, res, next) {

    var id = req.params['id'];
    Article.findOne({'_id': id}, function(err, article) {
      if(article) {
        res.render('editpost', {user: req.user, article: article});
      }
    });
  });

  router.get('/create/new', isLoggedIn, function (req, res, next) {
    res.render('newpost', { user: req.user });
  });

  router.get('/removearticles', function (req, res, next) {
    Article.remove().exec();
    res.send("articles removed");
  });

}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
  return next();

  // if they aren't redirect them to the login page
  res.redirect('/login');
}
