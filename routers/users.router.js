'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const {User} = require('../models/users.model');
const jwt = require('jsonwebtoken');
const jsonParser = bodyParser.json();
const disableWithToken = require('../middlewares/disableWithToken.middleware').disableWithToken;
const requiredFields = require('../middlewares/requiredFields.middleware');

const router = express.Router();


//create new user
router.route('/')
    .post(disableWithToken, requiredFields('username', 'password', 'firstname', 'lastname'), (req, res) => {
        User.create({
            username: req.body.username,
            password: req.body.password,
            firstname: req.body.firstname,
            lastname: req.body.lastname
        })
        .then(() => res.status(201).send())
        .catch(report => res.status(400).json(errorsParser.generateErrorResponse(report)));
    })
    
//get all users
    .get((req, res) =>{
      return User.find()
       .then(users => res.json(users.map(user => user.serialize())))
       .catch(err => res.status(500).json({message: 'Internal server error'}));

    });

module.exports = {router};
