process.env.NODE_ENV = 'test';

const Channel = require('../../app/models/channel');

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');

const should = chai.should();

chai.use(chaiHttp);

function addChannel(name) {
  return new Channel({
    name,
  }).save();
}

describe('channel controller', () => {
  before((done) => {
    Channel.remove().then(() => done());
  });

  after((done) => {
    Channel.remove().then(() => done());
  });

  it('should return an empty array before inserting any channels via GET /api/channels', (done) => {
    chai.request(app)
      .get('/api/channels')
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.equal(0);
        done();
      });
  });

  it('should create and save a new channel into db without error', (done) => {
    addChannel('mtv3')
      .then(() => {
        done();
      });
  });

  it('should return one channel "mtv3" inside an array via GET /api/channels', (done) => {
    chai.request(app)
      .get('/api/channels')
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.equal(1);
        done();
      });
  });

  it('should create multiple new channels and save into db', (done) => {
    Promise.all([
      addChannel('yle1'),
      addChannel('yle2'),
      addChannel('nelonen'),
    ])
      .then(() => {
        done();
      });
  });

  it('should return 4 channels in an array via /api/channels', (done) => {
    chai.request(app)
      .get('/api/channels')
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.equal(4);
        done();
      });
  });
});
