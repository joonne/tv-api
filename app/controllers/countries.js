// controllers/countries.js

const mongo = require('../helpers/mongo');

const { handleErrors } = require('../helpers/errors');

async function getCountries(req, res) {
  try {
    const db = await mongo.db;
    const countries = await db.collection('countries').find({}).toArray();

    res.writeHead(200, {
      'Content-Type': 'application/json',
    });

    return res.end(JSON.stringify(countries));
  } catch (error) {
    return handleErrors(res, error);
  }
}

module.exports = {
  getCountries,
};
