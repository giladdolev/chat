const http = require('http');
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const socketio = require('socket.io');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const { addUser, removeUser, getUser, getUsers, usersInRoom } = require('./users');

const router = require('./router');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
// when working with server only use:
// MongoClient.connect('mongodb://localhost:27017/chatDb', function (error, db) {
  //for docker only
MongoClient.connect('mongodb://mongo:27017/chatDb', function (error, db) {
  if (error) {
    throw error;
  }
  console.log('mongodb connected');
  let dbo = db.db("mydb");

  //create chat collection if  not exist 
  dbo.listCollections().toArray(function (err, items) {
    if (!items || !items[0].name || items[0].name !== 'chat') {
      dbo.createCollection("chat", function (err, res) {
        if (err) throw err;
        console.log("--------------Collection created!");
        db.close();
      });
    }
  });


  app.use(cors());
  app.use(router);
  io.on('connect', (socket) => {

    // addUser
    let room = socket.on('join', ({ name, room }, callback) => {
      if (!name || !room)
        return { error: 'Username and room are required.' };
      name = name.trim().toLowerCase();
      room = room.trim().toLowerCase();
      let dbo = db.db("mydb");
      let query = { name: name, room: room };

      dbo.collection("chat").find(query).toArray(function (err, result) {
        if (err) {
          
          return callback({ error: err })
        }
        if (result && result.length > 0) {
          
          return callback({ error: 'Username is taken.' })
        }
        let user = [
          { id: socket.id, name: name, room: room }
        ];
        dbo.collection("chat").insertMany(user, function (err, res) {
          if (err) {
            
            return callback({ error: err })
          }
          let { id, room, name } = user[0];
          socket.join(room);
          socket.emit('message', { user: 'admin', text: `${name}, welcome to room ${room}.` });
          socket.broadcast.to(room).emit('message', { user: 'admin', text: `${name} has joined!` });

          var query = { room: room };
          dbo.collection("chat").find(query).toArray(function (err, result) {
            if (err)
              return { error: err };

            io.to(room).emit('roomData', { room: room, users: result });

          })
          
          callback();
        });
      });
    });

    // /getUser
    socket.on('sendMessage', (message, callback) => {
      let dbo = db.db("mydb");
      let query = { id: socket.id };
      dbo.collection("chat").find(query).toArray(function (err, result) {
        if (err) {
          
          return callback({ error: err });
        }
        if (!result || !result[0])
          return callback({ error: 'Error' });
        let { id, room, name } = result[0];
        let query = { room: room };
        
        dbo.collection("chat").find(query).toArray(function (err, result) {
          if (err) {
            
            return callback({ error: err });
          }

          if (result.length > 1) {
            io.to(room).emit('message', { user: name, text: message, seen: true });
          } else
            io.to(room).emit('message', { user: name, text: message });
        });
        
      });
      callback();
    });

 
    //remove user
    socket.on('disconnect', () => {
      let query = { id: socket.id };

      dbo.collection("chat").find(query).toArray(function (err, result) {
        if (err) {
          return 'Error'  ;
        }
        if (!result || !result[0])
        return 'Error'  ;
        if (!result || !result[0])
        return 'Error'  ;
        let { id, room, name } = result[0];
        io.to(room).emit('message', { user: 'Admin', text: `${name} has left.` });

        dbo.collection("chat").deleteOne(query, function (err, result) {
          if (err) {
            
            return 'Error'  ;
          }
          
          dbo.collection("chat").find().toArray(function (err, result) {
            if (err) {
              
              return 'Error'  ;
            }
            if (!result || !result[0])
            return 'Error'  ;
            let { id, room, name } = result[0];

       
              // io.to(room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
              io.to(room).emit('roomData', { room: room, users: getUsers(result) });
      
            
          })
        });
      })
    })
  });
})
server.listen(PORT, () => console.log(`Server  listening at port ${PORT}`));