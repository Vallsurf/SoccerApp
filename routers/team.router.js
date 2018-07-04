  'use strict';
  const express = require('express');
  const bodyParser = require('body-parser');

  const {Team} = require('../models/team.model');

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

  router.route('/roster/:id')
    .patch((req, res) => {
    if (!(req.params.id === req.body.id)) {
      res.status(400).json({
        error: 'Request path id and request body id values must match'
      });
    }
    
    const newobj = {}

    Object.keys(req.body).forEach(key => {
      if ( key == 'formation'){
        Object.keys(req.body.formation).forEach(formationkey => {
          console.log(key)
          newobj[key + '.' + formationkey] = req.body[key][formationkey]
        })
      }
     if ( key !== 'formation'){
     newobj[key] = req.body[key]; 
   }
    })

    console.log(newobj)

    const updated = { 'formation.Forward1' : 'newplayer' , 'formation.Forward2' : 'newplayer'};
   

    Team
    .findByIdAndUpdate(req.params.id, { $set: newobj } , { new: true })
    .then(updatedPost => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong' }));
  });


  module.exports = {router};
