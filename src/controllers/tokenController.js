const TokenDAO = require('../TokenDAO')
const gameController = require('./gameController')

exports.getAllTokens = (req, res) => {
  res.json(TokenDAO.getAllTokens())
}

exports.getAllConnections = (req, res) => {
  res.json(TokenDAO.getAllConnections())
}

exports.getTokenById = (req, res) => {
  // TODO: Validation
  const id = req.params.tokenId
  const token = TokenDAO.getTokenById(id)
  if (token) {
    res.status(200).json(token)
  } else {
    res.status(404).end()
  }
}

exports.getAllConnectorsByToken = (req, res) => {
  // TODO: Validation
  const id = req.params.tokenId
  const connectors = TokenDAO.getAllConnectorsByTokenId(id)
  if (connectors) {
    res.status(200).json(connectors)
  } else {
    res.status(404).end()
  }
}

exports.getConnectorByToken = (req, res) => {
  // TODO: Validation
  const { tokenId, connectorId } = req.params
  const connector = TokenDAO.getConnectorByTokenId(tokenId, connectorId)
  if (connector) {
    res.status(200).json(connector)
  } else {
    res.status(404).end()
  }
}

exports.connectConnector = (req, res) => {
  const { playerId, tokenId, connectorId, oppositeTokenId, oppositeConnectorId } = req.body;
  if (playerId === undefined || tokenId === undefined || connectorId === undefined || oppositeTokenId === undefined || oppositeConnectorId === undefined) {
    res.status(400).end('One Parameter is empty');
    return
  }

  if (tokenId === oppositeTokenId) {
    res.status(400).end('Can not connect connectors within one token')
    return
  }

  const c1 = TokenDAO.getConnectorByTokenId(tokenId, connectorId)
  const c2 = TokenDAO.getConnectorByTokenId(oppositeTokenId, oppositeConnectorId)

  if (c1.isConnected || c2.isConnected) {
    res.status(400).end('One of connectors is already connected')
    return
  }

  // TODO: Maybe check other things
  
  const connection = TokenDAO.createConnection(playerId, tokenId, connectorId, oppositeTokenId, oppositeConnectorId)
  gameController.addConnectionToQueue(connection)
  res.end();
}
