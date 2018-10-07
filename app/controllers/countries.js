// controllers/countries.js

const mongo = require('../helpers/mongo');

const { handleErrors } = require('../helpers/errors');

async function getCountries(req, res) {
  try {
    const db = await mongo.db;
    const countries = await db.collection('countries').find({}).toArray();

    return res.status(200).json(countries);
  } catch (error) {
    return handleErrors(res, error);
  }
}

module.exports = {
  getCountries,
};
