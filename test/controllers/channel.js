process.env.NODE_ENV = 'test';

const Program = require('../../app/models/program');

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');

const should = chai.should();

chai.use(chaiHttp);

describe('Channel', () => {
    // Before each test we empty the database
    beforeEach((done) => {
        Program.remove({}, () => {
            done();
        });
    });

    describe('GET programs', () => {
        it('should get an empty array before inserting any programs via /api/channel/:channelName', (done) => {
            chai.request(app)
                .get('/api/channel/asd')
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.equal(0);
                    done();
                });
        });

        it('should create and save a new program into db without error', (done) => {
            const program = new Program();
            const date = new Date();

            program.channelName = 'mtv3';
            program.data.name = 'Salatut Elämät';
            program.data.description = 'Aki on vauhdissa';
            program.data.season = '9';
            program.data.episode = '34';
            program.data.start = date;
            program.data.end = date;

            program.save(done);
        });

        xit('should get all programs via GET /api/channel/:channelName', (done) => {
            chai.request(app)
                .get('/api/channel/mtv3')
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.equal(1);
                    done();
                });
        });
    });
});
