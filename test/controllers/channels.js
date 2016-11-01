process.env.NODE_ENV = 'test';

const Channel = require('../../app/models/channel');

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');

const should = chai.should();

chai.use(chaiHttp);

function addChannel(channelName) {
    return new Channel({ channelName }).save();
}

describe('channel controller', () => {
    before((done) => {
        Channel.remove({}, () => {
            done();
        });
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

    it('should create a new channel into db via POST /api/channels', (done) => {
        chai.request(app)
            .post('/api/channels')
            .send({
                name: 'subtv',
            })
            .end((err, res) => {
                should.not.exist(err);
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.eql('Created');
                done();
            });
    });

    it('should not create a duplicate channel into db via POST /api/channels', (done) => {
        chai.request(app)
            .post('/api/channels')
            .send({
                name: 'subtv',
            })
            .end((err, res) => {
                should.exist(err);
                res.should.have.status(409);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.eql('Channel already exists');
                done();
            });
    });

    it('should return 400 Bad Request for missing body parameter "name" via POST /api/channels', (done) => {
        chai.request(app)
            .post('/api/channels')
            .send({})
            .end((err, res) => {
                should.exist(err);
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.eql('Missing body parameter: name');
                done();
            });
    });

    it('should delete a channel from db via DELETE /api/channels/:name', (done) => {
        chai.request(app)
            .delete('/api/channels/subtv')
            .end((err, res) => {
                should.not.exist(err);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.eql('Deleted');
                done();
            });
    });

    it('should not delete a non existing channel from db via DELETE /api/channels/:name', (done) => {
        chai.request(app)
            .delete('/api/channels/subtv')
            .end((err, res) => {
                should.exist(err);
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.eql('Not Found');
                done();
            });
    });
});
