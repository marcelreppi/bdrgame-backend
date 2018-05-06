const PlayerDAO = require('../PlayerDAO')
const TokenDAO = require('../TokenDAO')

const webserver = require('../informWebServer')

const ROUND_DURATION = 5000

let moveQueue = []

exports.startGame = function() {
  setInterval(gameTick, ROUND_DURATION);
}

exports.addMoveToQueue = function(id, x, y) {
  moveQueue.push({ id, x, y })
}

function gameTick() {
  // Execute moves from previous rounds
  executeMoves()

  console.log('GameTick');
  let players = PlayerDAO.getAllPlayers()
  for (let i = 0; i < players.length; i++) {
    let p = players[i];
    p.balance += 1;
  }

  // Pre-round actions
  // 1. Pay payoff
  // TODO

  // 2. Generate tokens
  const k = 1 // base number of generated tokens
  const s = PlayerDAO.getAllPlayers().length // total amount of players
  const x = 0.95 // base probability
  const beta = 0.2 // curve parameter
  const probability = Math.pow(1 - Math.pow(x, s), beta)

  const r = Math.random()
  if (r <= probability) {
    const newTokens = []
    for (let i = 0; i < k*s; i++) {
      const newToken = TokenDAO.createToken(Math.random(), Math.random());
      newTokens.push(newToken)
    }
    webserver.sendNewTokens(newTokens);
  }

  // 3. Add players to the game   

  
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