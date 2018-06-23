let nextId = 0
function Token(x, y, connectors = []){
  this.id = nextId++
  this.nextConnectorId = connectors.length
  this.x = x
  this.y = y
  this.connectors = connectors
}

function Connector(id, regex, payoff) {
  this.id = id
  this.regex = regex
  this.payoff = payoff
  this.payoffIsDisbursed = false
  this.isConnected = false,
  this.oppositeTokenId = undefined,
  this.oppositeConnectorId = undefined,
  this.connectingPlayerId = undefined
}

function Connection(playerId, tokenId, connectorId, oppositeTokenId, oppositeConnectorId) {
  this.playerId = playerId
  this.tokenId = tokenId
  this.connectorId = connectorId
  this.oppositeTokenId = oppositeTokenId
  this.oppositeConnectorId = oppositeConnectorId
}

let tokens = [];
let connections = []

exports.getAllTokens = () => {
  return tokens;
}

exports.wipeTokens = () => {
  tokens = []
}

exports.createToken = (x, y, connectors) => {
  connectors = []
  for (let i = 0; i < 6; i++) {
    connectors.push(new Connector(i, 'regex', (Math.random()*15)))
  }
  const newToken = new Token(x, y, connectors)
  tokens.push(newToken)

  return newToken
}

exports.getTokenById = (id) => {
  for (let i = 0; i < tokens.length; i++) {
    let t = tokens[i];
    if (t.id === id)
      return t;
  }
  return undefined;
}

exports.getAllConnectorsByTokenId = (id) => {
  for (let i = 0; i < tokens.length; i++) {
    let t = tokens[i];
    if (t.id === id)
      return t.connectors;
  }
  return undefined;
}

exports.getConnectorByTokenId = (tokenId, connectorId) => {
  for (let i = 0; i < tokens.length; i++) {
    let t = tokens[i];
    if (t.id === tokenId) {
      for (let j = 0; j < t.connectors.length; j++) {
        const c = t.connectors[j]
        if (c.id === connectorId) {
          return c
        }
      }
    }
  }
  return undefined;
}

exports.getAllConnections = () => {
  return connections
}

exports.createConnection = (playerId, tokenId, connectorId, oppositeTokenId, oppositeConnectorId) => {
  return new Connection(playerId, tokenId, connectorId, oppositeTokenId, oppositeConnectorId)
}

exports.addConnection = (connection) => {
  const { playerId, tokenId, connectorId, oppositeTokenId, oppositeConnectorId } = connection
  const c1 = this.getConnectorByTokenId(tokenId, connectorId)
  const c2 = this.getConnectorByTokenId(oppositeTokenId, oppositeConnectorId)

  c1.isConnected = true;
  c2.isConnected = true;
  c1.oppositeTokenId = oppositeTokenId;
  c2.oppositeTokenId = tokenId;
  c1.oppositeConnectorId = oppositeConnectorId;
  c2.oppositeConnectorId = connectorId;
  c1.connectingPlayerId = playerId;
  c2.connectingPlayerId = playerId;

  connections.push(connection)
}
