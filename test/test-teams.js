

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const config = require('../config');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');
const {
    createTestUser, tearDownDb, seedPlayerData, getPlayers,
} = require('./test-functions');


const expect = chai.expect;

chai.use(chaiHttp);


describe('Team endpoints', () => {
    let testUser;
    let newTeam;

    before(() => runServer(TEST_DATABASE_URL));

    beforeEach((done) => {
        createTestUser()
            .then((user) => {
                testUser = user;
            })
            .then(() => done())
            .catch(err => console.log(err));
    });

    beforeEach(() => seedPlayerData());

    beforeEach(() => getPlayers().then(data => newTeam = data));


    afterEach(() => tearDownDb());

    after(() => closeServer());

    describe('/api/players', () => {
        it('should get players', () => chai.request(app)
            .get('/api/players')
            .then((_res) => {
                expect(_res).to.have.status(200);
                expect(_res).to.be.json;
            }));
    });

    describe('/api/TEAMS', () => {
        it('should create a new team', () => {
            const tokenPayload = { _id: testUser._id, username: testUser.username };
            const token = jwt.sign(tokenPayload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRY });
            return chai.request(app)
                .post('/api/teams')
                .set('Authorization', `Bearer ${token}`)
                .send(newTeam)
                .then((res) => {
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body.message).to.equal('Team Created!');
                });
        });
    });
});
