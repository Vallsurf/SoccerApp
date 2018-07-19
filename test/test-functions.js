const faker = require('faker');
const mongoose = require('mongoose');
const { User } = require('../models/users.model');
const { Player } = require('../models/players.model');


function generatePosition() {
    const position = [
        'Forward', 'Defender', 'Goalkeeper', 'Midfielder'];
    return position[Math.floor(Math.random() * position.length)];
}

function generatePlayerData() {
    return {
        name: faker.name.firstName(),
        position: generatePosition(),

    };
}

function seedPlayerData() {
    return new Promise((resolve, reject) => {
        const seedData = [];
        for (let i = 1; i <= 8; i++) { seedData.push(generatePlayerData()); }
        Player.insertMany(seedData)
            .then(result => resolve(result))
            .catch(err => reject(err));
    });
}


function getPlayers() {
    return new Promise((resolve, reject) => {
        Player.find()
            .then((data) => {
                newobj = {
                    name: faker.company.companyName(),
                    formation: {
                        Player1: data[0]._id,
                        Player2: data[1]._id,
                        Player3: data[2]._id,
                        Player4: data[3]._id,
                        Player5: data[4]._id,
                        Player6: data[5]._id,
                        Player7: data[6]._id,
                        Player8: data[7]._id,

                    },
                };
                return newobj;
            })
            .then((result) => {
                resolve(result);
            })
            .catch(err => reject(err));
    });
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
    generatePlayerData, generateUserData, createTestUser, tearDownDb, seedPlayerData, getPlayers,
};
