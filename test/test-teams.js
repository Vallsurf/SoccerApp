

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const config = require('../config');
const passport = require('passport');

const { app, runServer, closeServer } = require('../server');
const { User } = require('../models/users.model');
const { Team } = require('../models/team.model');
const { Player } = require('../models/players.model');
const { TEST_DATABASE_URL } = require('../config');
const { generatePlayerData, generateUserData, createTestUser, tearDownDb, seedPlayerData, getPlayers } = require('./test-functions')


const expect = chai.expect;

chai.use(chaiHttp);



describe('Team endpoints', () => {
    let testUser;

    before(() => runServer(TEST_DATABASE_URL));

  beforeEach(function(done) {
  		
    	
    	createTestUser()
      .then(user => {
        testUser = user;
      
      })
      .then(() => done())
      .catch(err => console.log(err))
  });

      afterEach(function() {
    return tearDownDb();
  });

    after(() => closeServer());

    describe('/api/players', () => {

    	it('should get players', () => {
    	seedPlayerData();
    	// getPlayers(); 

        const tokenPayload = { _id: testUser._id, username: testUser.username };
        const token = jwt.sign(tokenPayload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRY });    	
        
    	return chai.request(app)
    	.get('/api/players')
        // .set('Authorization', `Bearer ${token}`)
        // .send('baddata')
        .then(function(_res) {
			  expect(_res).to.have.status(200);
			  expect(_res).to.be.json;
        });
    	
    });	

    	 it('should create team', () => {
 

        const tokenPayload = { _id: testUser._id, username: testUser.username };
        const token = jwt.sign(tokenPayload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRY });    	
        
    	return chai.request(app)
    	.get('/api/players')
        // .set('Authorization', `Bearer ${token}`)
        // .send('baddata')
        .then(function(_res) {
			  expect(_res).to.have.status(200);
			  expect(_res).to.be.json;
        });
    	
    });	


    });
});
