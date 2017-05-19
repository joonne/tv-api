process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');

const should = chai.should(); // eslint-disable-line

chai.use(chaiHttp);

describe('openshift health check', () => {
  it('should GET 200 via /health', (done) => {
    chai.request(server)
            .get('/health')
            .end((err, res) => {
              res.should.have.status(200);
              done();
            });
  });
});
