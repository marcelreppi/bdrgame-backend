const TokenDAO = require('../TokenDAO')

exports.getAllTokens = (req, res) => {
  res.json(TokenDAO.getAllTokens())
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
  const { playerId, tokenId1, connectorId1, tokenId2, connectorId2 } = req.body;
  if (playerId === undefined || connectorId1 === undefined || id2 === undefined || tokenId2 === undefined || tokenId1 === undefined) {
    res.status(400).end('One Parameter is empty');
    return
  }

  if (tokenId1 === tokenId2) {
    res.status(400).end('Can not connect connectors within one token')
    return
  }

  const c1 = TokenDAO.getConnectorByTokenId(tokenId1, connectorId1)
  const c2 = TokenDAO.getConnectorByTokenId(tokenId2, connectorId2)

  if (c1.isConnected || c2.isConnected) {
    res.status(400).end('One of connectors is already connected')
    return
  }

  // TODO: Maybe check other things

  c1.isConnected = true;
  c2.isConnected = true;
  c1.oppositeTokenId = tokenId2;
  c2.oppositeTokenId = tokenId1;
  c1.oppositeConnectorId = connectorId2;
  c2.oppositeConnectorId = connectorId1;
  c1.connectingPlayerId = playerId;
  c1.connectingPlayerId = playerId;

  res.end('Connected');
}