import { nanoid } from 'nanoid';
import { Server } from 'socket.io';
import express from 'express';
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://tic-tac-toe-client-five.vercel.app',
  },
});

const port = process.env.PORT || 3001;

io.on('connection', (socket) => {
  console.log('a user connected: ', socket.id);

  socket.on('create-room', () => {
    const roomId = nanoid();
    socket.join(roomId);
  });

  socket.on('join', (roomId) => {
    const clients = io.sockets.adapter.rooms.get(roomId);

    if (!clients) {
      socket.emit('room-closed');
      return;
    }
    if (clients.size === 2) {
      socket.emit('room-full');
      return;
    }
    socket.join(roomId);
  });

  socket.on('leave', (roomId) => {
    socket.leave(roomId);
  });

  socket.on('game-play-update', (params) => {
    io.to(params.id).emit('game-play-update-server', params.data);
  });

  socket.on('restart', ({ roomId, socketId }) => {
    io.to(roomId).emit('restart-ready', socketId);
  });
});

io.of('/').adapter.on('join-room', (room, id) => {
  console.log('==============join-room============');
  console.log('room: ', room);
  console.log('id: ', id);
  io.to(room).emit('join-room', { room, id });
});

io.of('/').adapter.on('leave-room', (room, id) => {
  io.to(room).emit('leave-room', id);
});

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
