process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../../app');
const mongo = require('../../app/helpers/mongo');

const should = chai.should();

chai.use(chaiHttp);

const defaultChannelId = 'mtv3.fi';

function addProgram(program) {
  return mongo.getDb
    .then(db => db.collection('programs').insertOne(program));
}

describe('program controller', () => {
  before((done) => {
    mongo.getDb
      .then(db => db.collection('programs').removeMany({}))
      .then(() => done());
  });

  it('should return an empty array before inserting any programs via GET /api/programs/:channel', (done) => {
    chai.request(app)
      .get(`/api/channels/${defaultChannelId}/programs`)
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.equal(0);
        done();
      });
  });

  it('should create and save a new program into db without error', (done) => {
    addProgram({
      _channelId: defaultChannelId,
      name: 'salkkarit',
      description: 'aki vauhdissa',
      season: 1,
      episode: 4,
      start: Date.now,
      end: Date.now,
    })
      .then(() => {
        done();
      });
  });

  it('should return one program from the default channel via GET /api/channels/:channel/programs', (done) => {
    chai.request(app)
      .get(`/api/channels/${defaultChannelId}/programs`)
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.equal(1);
        done();
      });
  });

  it('should return empty array for channel with no programs via GET /api/channels/:channel/programs', (done) => {
    chai.request(app)
      .get('/api/channels/asdasd/programs')
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.equal(0);
        done();
      });
  });

  it('should create multiple new programs and save into db', (done) => {
    Promise.all([
      addProgram({
        _channelId: defaultChannelId,
        data: {
          name: 'salkkarit',
          description: 'aki vauhdissa',
          season: 1,
          episode: 4,
          start: Date.now,
          end: Date.now,
        },
      }),
      addProgram({
        _channelId: defaultChannelId,
        data: {
          name: 'salkkarit',
          description: 'aki vauhdissa',
          season: 1,
          episode: 5,
          start: Date.now,
          end: Date.now,
        },
      }),
      addProgram({
        _channelId: defaultChannelId,
        data: {
          name: 'salkkarit',
          description: 'aki vauhdissa',
          season: 1,
          episode: 6,
          start: Date.now,
          end: Date.now,
        },
      }),
      addProgram({
        _channelId: defaultChannelId,
        data: {
          name: 'salkkarit',
          description: 'aki vauhdissa',
          season: 1,
          episode: 7,
          start: Date.now,
          end: Date.now,
        },
      }),
      addProgram({
        _channelId: defaultChannelId,
        data: {
          name: 'salkkarit',
          description: 'aki vauhdissa',
          season: 1,
          episode: 8,
          start: Date.now,
          end: Date.now,
        },
      }),
    ])
      .then(() => {
        done();
      });
  });

  it('should return 6 programs in an array for default channel via /api/channels/:channel/programs', (done) => {
    chai.request(app)
      .get(`/api/channels/${defaultChannelId}/programs`)
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.equal(6);
        done();
      });
  });
});
