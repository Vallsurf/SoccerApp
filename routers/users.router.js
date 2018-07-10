
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();
const { User } = require('../models/users.model');
const jwt = require('jsonwebtoken');
const config = require('../config');
require('../auth/strategies')(passport);

const jwttoken = passport.authenticate('jwt', { session: false });


const disableWithToken = require('../middlewares/disableWithToken.middleware').disableWithToken;
const requiredFields = require('../middlewares/requiredFields.middleware');
const errorsParser = require('../errorsParser.js');


const router = express.Router();


// create new user
router.route('/')
    .post(disableWithToken, requiredFields('username', 'password', 'firstname', 'lastname'), (req, res) => {
        User.create({
            username: req.body.username,
            password: req.body.password,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
        })
            .then(() => res.status(201).send())
            .catch(report => res.status(400).json(errorsParser.generateErrorResponse(report)));
    })

// get all users
    // .get((req, res) => User.find()
    //     .then(users => res.json(users.map(user => user.serialize())))
    //     .catch(err => res.status(500).json({ message: 'Internal server error' })));

    .get(jwttoken, (req, res) => {
        res.status(200).send(req.user);
    });

// Login
router.post('/login', disableWithToken, requiredFields('username', 'password'), (req, res) => {
    User.findOne({ username: req.body.username })
        .then((foundUser) => {
            if (!foundResult) {
                return res.status(400).json({
                    generalMessage: 'Username is incorrect',
                });
            }
            return foundResult;

            const tokenPayload = {
                _id: foundUser._id,
                username: foundUser.username,
            };
            const token = jwt.sign(tokenPayload, config.JWT_SECRET, {
                expiresIn: config.JWT_EXPIRY,
            });
            return res.json({ token });
        })

        .catch(report => res.status(400).json(errorsParser.generateErrorResponse(report)));
});

module.exports = { router };
