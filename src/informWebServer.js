let axios = require('axios')
const WEB_SERVER_ADDRESS = 'http://bdrgame.herokuapp.com'
// const WEB_SERVER_ADDRESS = 'http://localhost:8000'

// Sends: [ { playerId, tokenId, connectorId, oppositeTokenId, oppositeConnectorId } ]
exports.sendNewConnections = function (connections) {
  axios.post(WEB_SERVER_ADDRESS + '/tokens/connect', connections)
    .catch((err) => {
      console.log(err.code + ' - Cannot send new token information to webserver');
    });
}

// Sends: [ { playerId, x, y } ]
exports.sendPlayerMoves = function (moves) {
  axios.post(WEB_SERVER_ADDRESS + '/players/move', moves)
    .catch((err) => {
      console.log(err.code + ' - Cannot send playermove information to webserver');
    });
}

// Sends: [ { id, nextConnectorId, x, y, connectors: [...] } ]
// Check backend TokenDAO for data model
exports.sendNewTokens = function (newTokens) {
  axios.post(WEB_SERVER_ADDRESS + '/tokens', newTokens)
    .catch((err) => {
      console.log(err.code + ' - Cannot send new token information to webserver');
    });
}

// Sends: [ { id, nextConnectorId, x, y, connectors: [...] } ]
// Check backend TokenDAO for data model
exports.sendUpdatedTokens = function (updatedTokens) {
  axios.put(WEB_SERVER_ADDRESS + '/tokens', updatedTokens)
    .catch((err) => {
      console.log(err.code + ' - Cannot send updated token information to webserver');
    });
}

// Sends: [ { id, x, y, balance, isSelected } ]
// Check backend PlayerDAO for data model
exports.sendUpdatedPlayers = function (players) {
  axios.put(WEB_SERVER_ADDRESS + '/players', players)
    .catch((err) => {
      console.log(err.code + ' - Cannot send updated players information to webserver');
    });
}

exports.notifyNewRound = function () {
  axios.post(WEB_SERVER_ADDRESS + '/rounds')
    .catch((err) => {
      console.log(err.code + ' - Cannot notify webserver');
    });
}
