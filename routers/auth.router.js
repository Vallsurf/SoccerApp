
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('../config');

const router = express.Router();
const errorsParser = require('../errorsParser.js');
const { User } = require('../models/users.model');
const disableWithToken = require('../middlewares/disableWithToken.middleware').disableWithToken;
const requiredFields = require('../middlewares/requiredFields.middleware');

require('../auth/strategies')(passport);

const createAuthToken = function (user) {
    return jwt.sign({ user }, config.JWT_SECRET, {
        subject: user.username,
        expiresIn: config.JWT_EXPIRY,
        algorithm: 'HS256',
    });
};

const localAuth = passport.authenticate('local', { session: false });
router.use(bodyParser.json());

const jwtAuth = passport.authenticate('jwt', { session: false });

// The user provides a username and password to login
router.post('/login', requiredFields('username', 'password'), (req, res) => {
    User.find({ username: req.body.username }, { password: req.body.password })
        .then((foundResult) => {
    	console.log(foundResult);
            if (!foundResult) {
                return res.status(400).json({
                    generalMessage: 'Username or password is incorrect',
                });
            }
            return foundResult;
        })
        .then((foundUser) => {
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


// The user exchanges a valid JWT for a new one with a later expiration
router.post('/refresh', jwtAuth, (req, res) => {
    const authToken = createAuthToken(req.user);
    res.json({ authToken });
});

module.exports = { router };
