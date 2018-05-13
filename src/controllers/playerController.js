const PlayerDAO = require('../PlayerDAO')
const gameController = require('./gameController')

exports.getAllPlayers = (req, res) => {
  res.json(PlayerDAO.getAllPlayers())
}

exports.getPlayerById = (req, res) => {
  // TODO: Validation
  const id = req.params.playerId
  const player = PlayerDAO.getPlayerById(id)
  if (player) {
    res.status(200).json(player)
  } else {
    res.status(404).end()
  }
}

exports.createPlayer = (req, res) => {
  // TODO: Validate this
  // Maybe randomize starting position of new player
  const newPlayer = PlayerDAO.createPlayer(req.body.x, req.body.y);
  res.status(204).json(newPlayer)
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
