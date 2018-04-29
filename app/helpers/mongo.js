const { MongoClient, ObjectId } = require('mongodb');

const config = require('../../config/config');

let connection = null;

module.exports = {
  connect() {
    return new Promise((resolve, reject) => {
      MongoClient.connect(config.db, (err, db) => {
        if (err) {
          return reject(err);
        }
        connection = db;
        return resolve(db);
      });
    });
  },
  getMongoId(id) {
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      throw new Error('Not a valid id');
    }
    return objectId;
  },
  get db() {
    if (connection) {
      return Promise.resolve(connection);
    }

    return this.connect();
  },
};
