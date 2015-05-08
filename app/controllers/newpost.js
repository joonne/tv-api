// controllers/newpost.js

var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article')

module.exports = function (app,passport) {
  app.use('/', router);

  app.post('/addpost', function (req, res, next) {

    var title = req.body.title;
    var text = req.body.content;

    var article = new Article({title: title, text: text, author: req.user.username});
    article.save(function (err, article) {
      if(err) return console.error(err);
    });

    console.log(article);

    res.redirect('/');

  });
};

router.get('/newpost', isLoggedIn, function (req, res, next) {
  res.render('newpost', { user: req.user });
});

router.get('/removearticles', function (req, res, next) {
  Article.remove().exec();
  res.send("articles removed");
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the login page
    res.redirect('/login');
}