const PlayerDAO = require('../PlayerDAO')
const TokenDAO = require('../TokenDAO')

const webserver = require('../informWebServer')

const ROUND_DURATION = 500

let moveQueue = []

exports.startGame = function() {
  setInterval(gameTick, ROUND_DURATION);
}

exports.addMoveToQueue = function(id, x, y) {
  moveQueue.push({ id, x, y })
}

function gameTick() {
  console.log('GameTick');
  let players = PlayerDAO.getAllPlayers()
  for (let i = 0; i < players.length; i++) {
    let p = players[i];
    p.balance += 1;
  }

  // generate a new token every round
  const newToken = TokenDAO.createToken(Math.random(), Math.random());
  webserver.sendNewToken(newToken);

  executeMoves()
}

function executeMoves() {
  console.log('executeMoves')
  let ids = [];
  let allowedMoves = [];
  for (let k = 0; k < moveQueue.length; k++) {
    let move = moveQueue[k];
    if (!(ids.includes(move.id)))
      allowedMoves.push(move);
  }

  // TODO: filter conflicting moves
  for (let k = 0; k < allowedMoves.length; k++) {
    let move = allowedMoves[k]
    console.log('Sending move ' + JSON.stringify(move) + ' to the server')
    PlayerDAO.updatePlayerPos(move.id, move.x, move.y);
    webserver.sendPlayerMoved(move);
  }
  moveQueue = []
}