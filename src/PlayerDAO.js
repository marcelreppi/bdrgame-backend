let nextId = 0
function Player(x, y) {
  this.id = nextId++,
  this.x = x,
  this.y = y,
  this.balance = 0
}

let players = [];

exports.updatePlayerPos = (playerID, x, y) => {
  for (let i = 0; i < players.length; i++) {
    let p = players[i];
    if (p.id === playerID)
      p.x = x;
      p.y = y;
      return true;
  }
  return false;
}

exports.setBalance = (playerID, newBalance) => {
  for (let i = 0; i < players.length; i++) {
    let p = players[i];
    if (p.id === playerID)
      p.balance = newBalance;
      return true;
  }
  return false;
}

exports.createPlayer = (x, y) => {
  const newPlayer = new Player(x, y)
  players.push(newPlayer)
  return newPlayer
}

exports.getPlayerById = (id) => {
  for (let i = 0; i < players.length; i++) {
    let p = players[i];
    if (p.id === id)
      return p;
  }
  return undefined;
}

exports.getAllPlayers = () => {
  return players;
}
