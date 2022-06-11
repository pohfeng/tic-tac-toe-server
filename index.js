const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

app.get('/', (req, res) => {
  res.send('<h1>Hello!</h1>');
});

io.on('connection', (socket) => {
  console.log('a user connected: ', socket.id);
  socket.on('join', (roomId) => {
    console.log('socket id: ', socket.id);
    console.log('rooomId: ', roomId);
    socket.join(roomId);
  });
  socket.on('game-play-update', (params) => {
    console.log('update params: ', params);
  });
});

io.of('/').adapter.on('join-room', (room, id) => {
  console.log(`socket ${id} has joined room ${room}`);
});

server.listen(3001, () => {
  console.log('listening on port 3001');
});
