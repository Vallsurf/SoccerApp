  'use strict';
  const express = require('express');
  const bodyParser = require('body-parser');

  const {Team} = require('./models');

  const router = express.Router();

  const jsonParser = bodyParser.json();

  router.use(jsonParser); 

  // Post to create a new team


  router.route('/') 

  .post(jsonParser, (req, res) => {
   Team
   .create({
    name: req.body.name,
    formation: req.body.formation
  })
   .then(team => res.status(201).json(team))
   .catch(err => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  });

 })

  .get((req, res) => {
    return Team.find()
    .then(teams => res.json(teams))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
  });

  router.route('/:id')

    .get( (req, res) => {
    Team
    .findById(req.params.id)
    .then(team => res.json(team))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
  })


    .put((req, res) => {
    if (!(req.params.id === req.body.id)) {
      res.status(400).json({
        error: 'Request path id and request body id values must match'
      });
    }

    const updated = {'players' : {'Forward1': 'newplayer'}};
    // const updateableFields = ['teamname', 'players'.'Forward1'];
    // updateableFields.forEach(field => {
    //   if (field in req.body) {
    //     updated[field] = req.body[field];
    //   }
    // });

    Team
    .findByIdAndUpdate(req.params.id, { $set: updated } , { new: true })
    .then(updatedPost => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong' }));
  });

  // Never expose all your users like below in a prod application
  // we're just doing this so we have a quick way to see
  // if we're creating users. keep in mind, you can also
  // verify this in the Mongo shell.
  // router.get('/', (req, res) => {
  //   return Team.find()
  //     .then(team => res.json(users.map(team => Team.serialize())))
  //     .catch(err => res.status(500).json({message: 'Internal server error'}));
  // });

  module.exports = {router};
