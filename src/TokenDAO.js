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

let tokens = [];

exports.getAllTokens = () => {
  return tokens;
}

exports.createToken = (x, y, connectors) => {
  connectors = []
  for (let i = 0; i < 6; i++) {
    connectors.push(new Connector(i, 'bla', Math.random()*15))
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
        } else {
          return undefined
        }
      }
    }
  }
  return undefined;
}
