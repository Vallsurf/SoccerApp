
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

// The user provides a username and password to login
router.post('/login', requiredFields('username', 'password'), (req, res) => {
    let user;
    User.findOne({ username: req.body.username })
        .then((foundResult) => {
            if (!foundResult) {
                return Promise.reject({
                    code: 401,
                    reason: 'LoginError',
                    message: 'Username or password is incorrect',
                });
            }
            user = foundResult;
            return foundResult.comparePassword(req.body.password);
        })

        .then((foundUser) => {
            if (!foundUser) {
                // return res.status(401).json({
                //     generalMessage: 'Email or password is incorrect',
                // });
                return Promise.reject({
                    code: 401,
                    reason: 'LoginError',
                    message: 'Username or password is incorrect',
                });
            }

            const user_id = user._id;

            const tokenPayload = { _id: user_id, username: user.username };
            const token = jwt.sign(tokenPayload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRY });

            return res.status(200).json({ token });
        })

        .catch((report) => {
            if (report.reason === 'LoginError') {
                return res.status(report.code).json(report);
            }
            return res.status(400).json(errorsParser.generateErrorResponse(report));
        });
});


module.exports = { router };
