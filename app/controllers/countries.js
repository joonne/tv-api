// controllers/countries.js

const mongo = require('../helpers/mongo');

const { handleErrors } = require('../helpers/errors');

const blacklist = ['com', 'org', 'net'];
const filter = countries => countries.filter(country => !blacklist.includes(country));

function getCountries(req, res) {
  return mongo.getDb
    .then(db => db.collection('channels').distinct('country'))
    .then(filter)
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
