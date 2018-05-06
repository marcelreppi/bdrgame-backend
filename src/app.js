"use strict";
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const PlayerDAO = require('./PlayerDAO')
const TokenDAO = require('./TokenDAO')
const gameController = require('./controllers/gameController')
const routes = require('./routes')

app.use(bodyParser.json());

app.use('/', routes)

// Test Data
for (let i = 0; i < 10; i++) {
  TokenDAO.createToken(Math.random(), Math.random())
}

PlayerDAO.createPlayer(Math.random(), Math.random())
PlayerDAO.createPlayer(Math.random(), Math.random())

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('Server started listing on port ' + PORT));

gameController.startGame()


