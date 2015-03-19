var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article');

module.exports = function (app) {
  app.use('/', router);
  app.use('/addpost', router);
  app.post('/addpost', response);
};

router.get('/', function (req, res, next) {
  Article.find(function (err, articles) {
    if (err) return next(err);
    res.render('index', {
      title: 'Generator-Express MVC',
      articles: articles
    });
  });
});

router.post('/addpost', function (req, res, next) {

  console.log("route is working!");
  console.log(req.body);

});

function response() {
  console.log("route working");
}