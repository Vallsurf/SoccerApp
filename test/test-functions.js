const faker = require('faker');
const mongoose = require('mongoose');

const { User } = require('../models/users.model');
const { Team } = require('../models/team.model');
const { Player } = require('../models/players.model');

// function sendAllDataToDb() {
//   console.info('Sending data to database...');
//   const testData = [];
//   for (let i=1; i<=2; i++) {
//     testData.push(createTestUserAndPost());
//   }
//   return Post.insertMany(testData);
// }

function generatePlayerData() {
    console.log('Generating post data...');
    return {
        name: faker.name.firstName(),
        position: generatePosition(),

    };
}

function generatePosition() {
  const position = [
    'Forward', 'Defender', 'Goalkeeper', 'Midfielder'];
  return position[Math.floor(Math.random() * position.length)];
}

function seedPlayerData () {
  const seedData = [];

  for (let i=1; i<=10; i++) {
    seedData.push(generatePlayerData());
  }

  console.log(seedData); 
  // this will return a promise
  return Player.insertMany(seedData);

}

function createTestUser() {
    return User.create(generateUserData());
}

function getPlayers() {
    var x = Player.find()
    .then(result => { console.log(result)
        Promise.done()
    });
    return x
}

function generateUserData() {
    console.log('Generating user data...');

    return {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
    };
}

function createTestUser() {
    return User.create(generateUserData());
}


function tearDownDb() {
    return new Promise((resolve, reject) => {
        console.warn('Deleting database');
        mongoose.connection.dropDatabase()
            .then(result => resolve(result))
            .catch(err => reject(err));
    });
}

module.exports = {
    generatePlayerData, generateUserData, createTestUser, tearDownDb, seedPlayerData, getPlayers
};
