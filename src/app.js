"use strict";
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const routes = require('./routes')
const PORT = 8080;

const PlayerDAO = require('./PlayerDAO')
const TokenDAO = require('./TokenDAO')

app.use(bodyParser.json());

app.use('/', routes)

app.listen(PORT, () => console.log('Started'));

// Test Data
for (let i = 0; i < 50; i++) {
  TokenDAO.createToken(Math.random(), Math.random())
}

PlayerDAO.createPlayer(Math.random(), Math.random())
PlayerDAO.createPlayer(Math.random(), Math.random())



function gameTick() {
  console.log('GameTick');
  let players = PlayerDAO.getAllPlayer()
  for (let i = 0; i < players.length; i++) {
    let p = players[i];
    p.balance += 1;
  }
  let tokens = TokenDAO.getAllToken();

  let newToken = new Token(Math.random(), Math.random());

  tokens.push(newToken);
}

//setInterval(gameTick, 5000);
