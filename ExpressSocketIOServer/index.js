const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io")
const io = require("socket.io")(server, {
  cors: {
    origin: "*"
  }
});
const cors = require('cors')


app.use(cors())

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

var players_data = {}
var players_lastResponseTime = {}

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('player_update', (data) => {
    console.log(data)
    players_data[data.playerID] = data
    players_lastResponseTime[data.playerID] = Date.now()
    io.emit('all_players_update', players_data);
  })
});

setInterval(() => {
  var responseTimeKeys = Object.keys(players_lastResponseTime)

  responseTimeKeys.forEach(k => {
    console.log(Date.now() - players_lastResponseTime[k])
    if (Date.now() - players_lastResponseTime[k] > 15000) {
      delete players_data[k]
      delete players_lastResponseTime[k]
      console.log("removing idle player")
    }
  })

}, 3000)

server.listen(3000, () => {
  console.log('listening on *:3000');
});
