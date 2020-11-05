const { MongoClient, ObjectId } = require('mongodb');

const { db } = require('../../config');

let connection = null;

module.exports = {
  connect() {
    return new Promise((resolve, reject) => {
      MongoClient.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }, (err, client) => {
        if (err) {
          return reject(err);
        }
        connection = client.db();
        return resolve(connection);
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
