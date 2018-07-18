

const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');
const { User } = require('../models/users.model');
const { TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('/api/users', () => {
    const username = 'exampleUser';
    const password = 'examplePass';
    const firstname = 'Example';
    const lastname = 'User';
    const usernameB = 'exampleUserB';
    const passwordB = 'examplePassB';
    const firstNameB = 'ExampleB';
    const lastNameB = 'UserB';

    before(() => runServer(TEST_DATABASE_URL));

    after(() => closeServer());

    beforeEach(() => { });

    afterEach(() => User.remove({}));

    describe('/api/users', () => {
        describe('POST', () => {
            it('Should reject creating users with missing username', () => chai
                .request(app)
                .post('/api/users')
                .send({
                    password,
                    firstname,
                    lastname,
                })
                .then(() => expect.fail(null, null, 'Request should not succeed'))
                .catch((err) => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(400);
                    expect(res).to.be.json;
                    expect(res.body.messages[0]).to.equal('There is missing username in your request body');
                }));

            it('Should reject creating users with missing password', () => chai
                .request(app)
                .post('/api/users')
                .send({
                    username,
                    firstname,
                    lastname,
                })
                .then(() => expect.fail(null, null, 'Request should not succeed'))
                .catch((err) => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(400);
                    expect(res.body.messages[0]).to.equal('There is missing password in your request body');
                }));

            it('Should reject creating users with empty username', () => chai
                .request(app)
                .post('/api/users')
                .send({
                    username: '',
                    password,
                    firstname,
                    lastname,
                })
                .then(() => expect.fail(null, null, 'Request should not succeed'))
                .catch((err) => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(400);
                    expect(res.body.messages[0]).to.equal('Path `username` is required.');
                }));

            it('Should reject creating users with duplicate username', () => User.create({
                username,
                password,
                firstname,
                lastname,
            })
                .then(() => chai.request(app).post('/api/users').send({
                    username,
                    password,
                    firstname,
                    lastname,
                }))
                .then(() => expect.fail(null, null, 'Request should not succeed'))
                .catch((err) => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal(
                        'Username already taken',
                    );
                    expect(res.body.location).to.equal('username');
                }));

            it('Should create a new user', () => chai
                .request(app)
                .post('/api/users')
                .send({
                    username,
                    password,
                    firstname,
                    lastname,
                })
                .then((res) => {
                    expect(res).to.have.status(201);
                    expect(res.body.message).to.equal(
                        `User ${username} created!`,
                    );
                    return User.findOne({
                        username,
                    });
                })
                .then((user) => {
                    expect(user).to.not.be.null;
                    expect(user.firstname).to.equal(firstname);
                    expect(user.lastname).to.equal(lastname);
                    return user.validatePassword(password);
                })
                .then((passwordIsCorrect) => {
                    expect(passwordIsCorrect).to.be.true;
                }));
        });
    });
});
