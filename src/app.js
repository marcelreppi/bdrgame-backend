"use strict";
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const routes = require('./routes')
const PORT = process.env.PORT || 8080;

const PlayerDAO = require('./PlayerDAO')
const TokenDAO = require('./TokenDAO')

app.use(bodyParser.json());

app.use('/', routes)

app.listen(PORT, () => console.log('Started'));

// Test Data
for (let i = 0; i < 10; i++) {
  TokenDAO.createToken(Math.random(), Math.random())
}

PlayerDAO.createPlayer(Math.random(), Math.random())
PlayerDAO.createPlayer(Math.random(), Math.random())

let moveQueue = [{id: 0, x: 0.5, y: 0.5}]

exports.moves = moveQueue;
// move this to another file
function gameTick() {
  console.log('GameTick');
  let players = PlayerDAO.getAllPlayers()
  for (let i = 0; i < players.length; i++) {
    let p = players[i];
    p.balance += 1;
  }

  TokenDAO.createToken(Math.random(), Math.random());


  executeMoves(moveQueue)
}

function executeMoves(moves) {
  console.log('executeMoves')
  let ids = [];
  let allowedMoves = [];
  for (let k = 0; k < moves.length; k++) {
    let move = moves[k];
    if (!(ids.includes(move.id)))
      allowedMoves.push(move);
  }

  // TODO: filter conflicting moves

  for (let k = 0; k < allowedMoves; k++) {
    let move = allowedMoves[k]
    console.log('Sending ' + move + ' to the server')
    PlayerDAO.updatePlayerPos(move.id, move.x, move.y);
    webserver.sendPlayerMoved({
      playerId: id,
      x: x,
      y: y
    });
  }
  moveQueue = []
}

setInterval(gameTick, 5000);
