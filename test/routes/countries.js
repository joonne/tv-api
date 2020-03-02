process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../../src');
const mongo = require('../../src/helpers/mongo');

const should = chai.should();

chai.use(chaiHttp);

async function addCountry(_id, name, abbreviation) {
  const db = await mongo.db;
  await db.collection('countries').insertOne({ _id, name, abbreviation });
}

describe('countries controller', () => {
  before(async () => {
    const db = await mongo.db;
    await db.collection('countries').removeMany({});
  });

  after(async () => {
    const db = await mongo.db;
    await db.collection('channels').removeMany({});
  });

  it('should return empty array before adding countries via GET /api/countries', (done) => {
    chai.request(app)
      .get('/api/countries')
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.equal(0);
        done();
      });
  });

  it('should create and save a new country into db without error', async () => {
    await addCountry('id', 'Finland', 'fi');
  });

  it('should return one country "Finland" inside an array via GET /api/countries', (done) => {
    chai.request(app)
      .get('/api/countries')
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.equal(1);
        done();
      });
  });
});
