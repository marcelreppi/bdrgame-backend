const PlayerDAO = require('../PlayerDAO')
const gameController = require('./gameController')

exports.getAllPlayers = (req, res) => {
  res.json(PlayerDAO.getAllPlayers())
}

exports.getPlayerById = (req, res) => {
  // TODO: Validation
  const playerId = parseFloat(req.params.playerId)
  const player = PlayerDAO.getPlayerById(playerId)
  if (player) {
    res.status(200).json(player)
  } else {
    res.status(404).end()
  }
}

exports.createPlayer = (req, res) => {
  // TODO: Validate this
  // Maybe randomize starting position of new player -> NO check description -> players are placed like tokens

  const x = req.body.x || Math.random()
  const y = req.body.y || Math.random()
  const newPlayer = PlayerDAO.createPlayer(x, y);
  res.json(newPlayer)
}

exports.selectPlayer = (req, res) => {
  const playerId = parseFloat(req.params.playerId)
  const updatedPlayer = PlayerDAO.setSelectPlayer(playerId, true)
  if (!updatedPlayer) {
    res.status(400).end('Selection failed')
    return
  }
  res.json(updatedPlayer)
}

exports.unselectPlayer = (req, res) => {
  const playerId = parseFloat(req.params.playerId)
  const updatedPlayer = PlayerDAO.setSelectPlayer(playerId, false)
  if (!updatedPlayer) {
    res.status(400).end('Unselection failed')
    return
  }
  res.json(updatedPlayer)
}

exports.updatePlayerBalance = (req, res) => {
  // TODO:
  // Do we really need this????

  let id = parseFloat(req.params.playerId);;
  let balance = req.body.balance;

  if (id === undefined) {
    res.status(404).end('No Player with this id found');
    return
  }
  if (balance === undefined) {
    res.status(400).end('One Parameter is empty');
    return;
  }

  if (player.setBalance(id, balance)) {
    res.end('Balance updated');
    return;
  } else {
    res.status(400).end('Error')
  }
}

exports.movePlayer = (req, res) => {
  let playerId = parseFloat(req.params.playerId);
  let x = req.body.x;
  let y = req.body.y;

  if (playerId === undefined) {
    res.status(404).end('No Player with this id found');
    return
  }

  if (x === undefined || y === undefined) {
    res.status(400).end('One Parameter is empty');
    return;
  }
  gameController.addMoveToQueue(playerId, x, y)
  res.end('Request sucessful');
}
