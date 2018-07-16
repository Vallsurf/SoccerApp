
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
        const {
            username, password, firstName = '', lastName = '',
        } = req.body;
        console.log({ username });
        return User.find({ username })
            .count()
            .then((count) => {
                console.log(count);
                if (count > 0) {
                    // There is an existing user with the same username
                    return Promise.reject({
                        code: 422,
                        reason: 'ValidationError',
                        message: 'Username already taken',
                        location: 'username',
                    });
                }
                return User.hashPassword(password);
            })
            .then(hash => User.create({
                username: req.body.username,
                password: hash,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
            }))
            .then(user => res.status(201).json({

                message: `User ${user.username} created!`,
            }))

            .catch((err) => {
                if (err.reason === 'ValidationError') { return res.status(err.code).json(err); } res.status(400).json(errorsParser.generateErrorResponse(err));
            });
    })


    .get(jwttoken, (req, res) => {
        res.status(200).send(req.user);
    });


module.exports = { router };
