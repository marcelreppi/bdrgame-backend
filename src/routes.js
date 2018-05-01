const express = require('express')
const router = express.Router()

const playerController = require('./controllers/playerController')
const tokenController = require('./controllers/tokenController')

router.get('/tokens', tokenController.getAllTokens)
router.post('/tokens/connect', tokenController.connectConnector)
router.get('/tokens/:tokenId', tokenController.getTokenById)
router.get('/tokens/:tokenId/connectors', tokenController.getAllConnectorsByToken)
router.get('/tokens/:tokenId/connectors/connectorId', tokenController.getConnectorByToken)

router.get('/players', playerController.getAllPlayers)
router.post('/players', playerController.createPlayer)
router.get('/players/:playerId', playerController.getPlayerById)
router.put('/players/:playerId/balance', playerController.updatePlayerBalance)
router.put('/players/:playerId/move', playerController.movePlayer)

module.exports = router