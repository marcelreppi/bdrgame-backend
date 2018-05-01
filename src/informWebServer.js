let axios = require('axios')
const WEB_SERVER_ADDRESS = 'http://bdrgame.herokuapp.com'

/*
sendNewEdges({
  playerId: playerId,
  tokenId1: tokenId1,
  tokenId2: tokenId2,
  connectorId1: connectorId1,
  connectorId2: connectorId2
});
*/


exports.sendNewEdges = function (edge) {
  // define web server address
  axios.post(require('./app').WEB_SERVER_ADDRESS + '/edges', edge).
    then((response) => {
      //console.log(response)
      console.log('got a response')
    }).catch((err) => {
      console.log(err.code + ' - Cannot send new token information to webserver');
    });
}

/*
sendNewEdges({
  playerID: playerID,
  x: x,
  y: y,
});
*/
exports.sendPlayerMoved = function (playerPos) {
  // define web server address
  axios.post(require('./app').WEB_SERVER_ADDRESS + '/players', playerPos
  ).then((response) => {
      //console.log(response)
      console.log('got a response')
    }).catch((err) => {
      console.log(err.code + ' - Cannot send playermove information to webserver');
    });
}

exports.sendNewToken = function (newToken) {
  // define web server address
  axios.post(require('./app').WEB_SERVER_ADDRESS + '/tokens', newToken).
    then((response) => {
      //console.log(response)
      console.log('got a response')
    }).catch((err) => {
      console.log(err.code + ' - Cannot send new token information to webserver');
    });
}
