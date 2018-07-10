

const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();
const { Player } = require('../models/players.model');

require('../auth/strategies')(passport);

const jwttoken = passport.authenticate('jwt', { session: false });

const router = express.Router();
router.use(jsonParser);

// Post to create a new team
router.route('/')
    .get((req, res) => {
        Player.find()
            .then(players => res.json(players))
            .catch(err => res.status(500).json({ message: 'Internal server error' }));
    });

router.route('/:id')
    .get((req, res) => {
        Player
            .findById(req.params.id)
            .then(player => res.json(player))
            .catch(err => res.status(500).json({ message: 'Internal server error' }));
    });

module.exports = { router };
