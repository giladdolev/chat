/////////////this  file is working corectly in the servermemory without DataBase but with user.js

const http = require('http');
const express = require('express');
const mongo = require('mongodb').MongoClient;
const socketio = require('socket.io');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const { addUser, removeUser, getUser, getUsers, usersInRoom } = require('./users');

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

io.on('connect', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.join(user.room);
    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.` });
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

    io.to(user.room).emit('roomData', { room: user.room, users: getUsers(user.room) });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);
    //if more then 1 user in room then message has been seen
    if (usersInRoom(user.room) > 1) {
      //  socket.emit('message', { user: 'seenmessage', text: `seen`});
      io.to(user.room).emit('message', { user: user.name, text: message, seen: true });
    } else
      io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsers(user.room) });
    }
  })
});

server.listen(PORT, () => console.log(`Server  listening at port ${PORT}`));