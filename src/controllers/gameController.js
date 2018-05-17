const PlayerDAO = require('../PlayerDAO')
const TokenDAO = require('../TokenDAO')

const webserver = require('../informWebServer')

const ROUND_DURATION = 15000
let roundTime = ROUND_DURATION / 1000

let moveQueue = []
let connectionQueue = []
let updatedTokens = []

exports.startGame = function() {
  gameTick()
  setInterval(gameTick, ROUND_DURATION);
  setInterval(() => {
    if (roundTime > 0) {
      roundTime -= 1
    }
  }, 1000)
}

exports.addUpdatedToken = (token) => {
  updatedTokens.push(token)
}

exports.addMoveToQueue = function(playerId, x, y) {
  moveQueue.push({ playerId, x, y })
}

exports.addConnectionToQueue = function(connection) {
  connectionQueue.push(connection)
}

let tickCounter = 0
function gameTick() {
  // Execute moves from previous rounds
  executeMoves()
  executeConnections()
  sendUpdatedTokens()

  console.log('GameTick ' + tickCounter);
  tickCounter++
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

  // REMOVE LATER
  // ONLY FOR DEVELOPMENT
  // PREVENT TOO MANY TOKENS WHILE CONSTANTLY RUNNING
  if (TokenDAO.getAllTokens().length > 1000) {
    TokenDAO.wipeTokens()
  }

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

  // Start new round
  webserver.notifyNewRound()
  roundTime = (ROUND_DURATION / 1000) + 1
}

function executeMoves() {
  console.log('executeMoves')
  let ids = [];
  let allowedMoves = [];
  for (let k = 0; k < moveQueue.length; k++) {
    let move = moveQueue[k];
    if (!(ids.includes(move.playerId)))
      allowedMoves.push(move);
  }

  moveQueue = []
  if (allowedMoves.length === 0) {
    return
  }

  // TODO: filter conflicting moves
  for (let k = 0; k < allowedMoves.length; k++) {
    let move = allowedMoves[k]
    PlayerDAO.updatePlayerPos(move.playerId, move.x, move.y);
  }
  webserver.sendPlayerMoves(allowedMoves);
}

function executeConnections() {
  console.log('executeConnections')
  // TODO add logic
  const allowedConnections = []
  for( let i = 0; i < connectionQueue.length; i++ ) {
    const connection = connectionQueue[i]
    // TODO add logic
    TokenDAO.addConnection(connection)
    allowedConnections.push(connection)
    updatedTokens.push(TokenDAO.getTokenById(connection.tokenId))
    updatedTokens.push(TokenDAO.getTokenById(connection.oppositeTokenId))
  }

  connectionQueue = []
  if (allowedConnections.length === 0) {
    return
  }
  webserver.sendNewConnections(allowedConnections)
}

function sendUpdatedTokens() {
  if (updatedTokens.length === 0) {
    return
  }
  webserver.sendUpdatedTokens(updatedTokens)
  updatedTokens = []
}


exports.getRoundTime = (req, res) => {
  res.json({ roundTime, roundDuration: ROUND_DURATION })
}