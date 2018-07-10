

const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();
const { Team } = require('../models/team.model');

require('../auth/strategies')(passport);

const jwttoken = passport.authenticate('jwt', { session: false });

const router = express.Router();
router.use(jsonParser);


router.route('/')
//  create a new team
    .post(jwttoken, jsonParser, (req, res) => {
        Team
            .create({
                name: req.body.name,
                formation: req.body.formation,
                owner: req.user._id,
            })
            .then(team => res.status(201).json({message: "Team Created!"}))
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: 'Something went wrong' });
            });
    })

//  get a new team by User
    .get(jwttoken, (req, res) => {
        Team.find({ owner: req.user._id })
            .populate('formation.Forward1 formation.Forward2 formation.Midfield1 formation.Midfield2 formation.Defense1 formation.Defense2 formation.Utility formation.Goalie')
            .exec()
            .then(teams => res.json(teams))
            .catch(err => res.status(500).json({ message: err }));
    });

//  Get team by teamID (debugging only)
router.route('/:id')
    .get((req, res) => {
        Team
            .findById(req.params.id)
            .populate('formation.Forward1 formation.Forward2 formation.Midfield1 formation.Midfield2 formation.Defense1 formation.Defense2 formation.Utility formation.Goalie')
            .then(team => res.json(team))
            .catch(err => res.status(500).json({ message: 'Internal server error' }));
    })

    .delete(jwttoken, (req, res) => {
        Team
            .findByIdAndRemove(req.params.id)
            .then(() => {
                res.status(204).json({ message: 'success' });
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: 'something went terribly wrong' });
            });
    });

// Updating a Team
router.route('/roster/:id')
    .patch((req, res) => {
        if (!(req.params.id === req.body.id)) {
            res.status(400).json({
                error: 'Request path id and request body id values must match',
            });
        }

        const newobj = {};

        Object.keys(req.body).forEach((key) => {
            if (key == 'formation') {
                Object.keys(req.body.formation).forEach((formationkey) => {
                    console.log(key);
                    newobj[`${key}.${formationkey}`] = req.body[key][formationkey];
                });
            }
            if (key !== 'formation') {
                newobj[key] = req.body[key];
            }
        });

        console.log(newobj);

        // const updated = { 'formation.Forward1': 'newplayer', 'formation.Forward2': 'newplayer' };


        Team
            .findByIdAndUpdate(req.params.id, { $set: newobj }, { new: true })
            .then(updatedPost => res.status(204).end())
            .catch(err => res.status(500).json({ message: 'Something went wrong' }));
    });


module.exports = { router };
