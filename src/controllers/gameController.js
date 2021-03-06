const PlayerDAO = require('../PlayerDAO')
const TokenDAO = require('../TokenDAO')

const webserver = require('../informWebServer')

const ROUND_DURATION = 5000
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
  //let players = PlayerDAO.getAllPlayers()
  //for (let i = 0; i < players.length; i++) {
  //  let p = players[i];
  //  p.balance += 1;
  //}
  payPayoff()

  // Pre-round actions
  // 1. Pay payoff and notify webserver that player details have changed
  // send updated players as array as PUT to path /players
  // TODO

  // 2. Generate tokens
  const k = 1 // base number of generated tokens
  const s = PlayerDAO.getAllPlayers().filter(p => p.isSelected).length // total amount of players
  const x = 0.95 // base probability
  const beta = 0.2 // curve parameter
  const probability = Math.pow(1 - Math.pow(x, s), beta)
  const chi = 1
  const epsilon = 0.2
  const radius = chi*epsilon

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

      let allT = TokenDAO.getAllTokens()
      let rIndex = Math.floor(Math.random() * allT.length);
      let someRandomToken = allT[rIndex];
      let tx = someRandomToken.x;
      let ty = someRandomToken.y;
      let x = Math.random() * radius
      x = Math.random() > 0.5 ? -x : x;
      let yMax = Math.sqrt(radius*radius - x*x)
      let y = Math.random() * yMax
      y = Math.random() > 0.5 ? -y : y;

      const newToken = TokenDAO.createToken(tx+x, ty+y);
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

    if (!isValidRegExConnection(connection)) {
      continue;
    }

    TokenDAO.addConnection(connection)
    allowedConnections.push(connection)
    updatedTokens.push(TokenDAO.getTokenById(connection.tokenId))
    updatedTokens.push(TokenDAO.getTokenById(connection.oppositeTokenId))
  }

  if (allowedConnections.length === 0) {
    return
  }
  webserver.sendNewConnections(allowedConnections)
}
function payPayoff() {
  // payoff for connecting
  console.log("payPayOff");
  console.log("connectionQueue: " + connectionQueue);
  let players = [];
  for (let i = 0; i < connectionQueue.length; i++)  {
    let connection = connectionQueue[i];
    let player = PlayerDAO.getPlayerById(connection.playerId);
    players.push(player);
    let payOff1 = TokenDAO.getConnectorByTokenId(connection.tokenId, connection.connectorId).payoff;
    let payOff2 = TokenDAO.getConnectorByTokenId(connection.oppositeTokenId, connection.oppositeConnectorId).payoff;
    console.log("Paid" + player + " " + (payOff1 + payOff2))
    player.balance += payOff1 + payOff2;
  }
  if (players.length > 0)
    webserver.sendUpdatedPlayers(players);
  console.log('Resetting connectionQueue');
  connectionQueue = []
}

function sendUpdatedTokens() {
  if (updatedTokens.length === 0) {
    return
  }
  webserver.sendUpdatedTokens(updatedTokens)
  updatedTokens = []
}

function isValidRegExConnection(connection) {
  // stub
  return true;
}

exports.getRoundTime = (req, res) => {
  res.json({ roundTime, roundDuration: ROUND_DURATION })
}