// controllers/countries.js

const mongo = require('../helpers/mongo');

const { handleErrors } = require('../helpers/errors');

function getCountries(req, res) {
  return mongo.getDb
    .then(db => db.collection('countries').find({}).toArray())
    .then((countries) => {
      res.writeHead(200, {
        'Content-Type': 'application/json',
      });
      return res.end(JSON.stringify(countries));
    })
    .catch(error => handleErrors(res, error));
}

module.exports = {
  getCountries,
};
