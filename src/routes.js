const express = require('express')
const router = express.Router()

const playerController = require('./controllers/playerController')
const tokenController = require('./controllers/tokenController')
const gameController = require('./controllers/gameController')

router.get('/tokens', tokenController.getAllTokens)
router.post('/tokens/connect', tokenController.connectConnector)
router.get('/tokens/:tokenId', tokenController.getTokenById)
router.get('/tokens/:tokenId/connectors', tokenController.getAllConnectorsByToken)
router.get('/tokens/:tokenId/connectors/connectorId', tokenController.getConnectorByToken)

router.get('/connections', tokenController.getAllConnections)

router.get('/players', playerController.getAllPlayers)
router.post('/players', playerController.createPlayer)
router.get('/players/:playerId', playerController.getPlayerById)
router.post('/players/:playerId/select', playerController.selectPlayer)
router.post('/players/:playerId/unselect', playerController.unselectPlayer)
router.put('/players/:playerId/balance', playerController.updatePlayerBalance)
router.put('/players/:playerId/move', playerController.movePlayer)

router.get('/time', gameController.getRoundTime)

module.exports = router