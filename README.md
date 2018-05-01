GET /token

GET /connector

GET /player

POST /move

{
	"playerID": id
	"x": newX,
	"y": newY
}

POST /connect

{
	"playerID": id,
	"connectorID1": id1,
	"connectorID2": id2
}

POST /setbalance

{
	"playerID": id,
	"balance": newBalance
}