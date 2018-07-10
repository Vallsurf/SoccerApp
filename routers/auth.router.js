
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
    User.findOne({ username: req.body.username })
        .then((foundResult) => {
            if (!foundResult) {
                return res.status(400).json({
                    generalMessage: 'Username or password is incorrect',
                });
            }
            console.log(foundResult);
            return foundResult;
        })
        .then((foundUser) => {
            const user_id = foundUser._id;
            const tokenPayload = {
                _id: user_id,
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
