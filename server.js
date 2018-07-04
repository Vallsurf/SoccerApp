
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const { router: usersRouter } = require('./routers/users.router');
const { router: teamRouter } = require('./routers/team.router');
const { router: authRouter, localStrategy, jwtStrategy } = require('./routers/auth.router');


const app = express();

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');


app.use(bodyParser.json());

// Logging
app.use(morgan('common'));


// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});


// Routes
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/teams', teamRouter);


app.get('/status', (req, res) => {
  res.json({ processId: process.pid });
});

// Static files
app.use(express.static('./public'));


// Starting and Ending Scripts
let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, (err) => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', (err) => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close((err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  }));
}


if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
