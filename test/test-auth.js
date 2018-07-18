

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer } = require('../server');
const { User } = require('../models/users.model');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Auth endpoints', () => {
    const username = 'exampleUser';
    const password = 'examplePass';
    const firstname = 'Example';
    const lastname = 'User';

    before(() => runServer(TEST_DATABASE_URL));

    after(() => closeServer());

    beforeEach(() => User.hashPassword(password).then(password => User.create({
        username,
        password,
        firstname,
        lastname,
    })));

    afterEach(() => User.remove({}));

    describe('/api/auth/login', () => {
        it('Should reject login requests with no credentials', () => chai
            .request(app)
            .post('/api/auth/login')
            .then(() => expect.fail(null, null, 'Request should not succeed'))
            .catch((err) => {
                if (err instanceof chai.AssertionError) {
                    throw err;
                }

                const res = err.response;
                expect(res).to.have.status(400);
            }));

        it('Should reject login requests with incorrect usernames', () => chai
            .request(app)
            .post('/api/auth/login')
            .send({ username: 'wrongUsername', password })
            .then(() => expect.fail(null, null, 'Request should not succeed'))
            .catch((err) => {
                if (err instanceof chai.AssertionError) {
                    throw err;
                }

                const res = err.response;
                expect(res).to.have.status(401);
            }));

        it('Should reject login requests with incorrect passwords', () => chai
            .request(app)
            .post('/api/auth/login')
            .send({ username, password: 'wrongPassword' })
            .then(() => expect.fail(null, null, 'Request should not succeed'))
            .catch((err) => {
                if (err instanceof chai.AssertionError) {
                    throw err;
                }

                const res = err.response;
                expect(res).to.have.status(401);
            }));
        it('Should return a valid auth token', () => chai
            .request(app)
            .post('/api/auth/login')
            .send({ username, password })
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                const token = res.body.token;
                expect(token).to.be.a('string');
                const payload = jwt.verify(token, JWT_SECRET, {
                    algorithm: ['HS256'],
                });
                
                expect(payload.username).to.deep.equal(username);
            }));
    });
});
