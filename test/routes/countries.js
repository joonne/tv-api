process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../../app');
const mongo = require('../../app/helpers/mongo');

const should = chai.should();

chai.use(chaiHttp);

function addCountry(_id, name, abbreviation) {
  return mongo.getDb
    .then(db => db.collection('countries').insertOne({ _id, name, abbreviation }));
}

describe('countries controller', () => {
  before((done) => {
    mongo.getDb
      .then(db => db.collection('countries').removeMany({}))
      .then(() => done());
  });

  after((done) => {
    mongo.getDb
      .then(db => db.collection('channels').removeMany({}))
      .then(() => done());
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

  it('should create and save a new country into db without error', (done) => {
    addCountry('id', 'Finland', 'fi')
      .then(() => {
        done();
      });
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
