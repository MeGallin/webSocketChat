// link to tut https://www.youtube.com/watch?v=tHbCkikFfDE
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || 8000);
console.log('server is running ...');
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Open websocket connetion
io.sockets.on('connection', socket => {
  connections.push(socket);
  console.log('connected %s sockets connected ' + connections.length);

  // disconnect
  socket.on('disconnect', data => {
    // if (!socket.username) return;
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();
    connections.splice(connections.indexOf(socket), 1);
    console.log('disconnected, %s sockets connected ', connections.length);
  });

  // send message
  socket.on('send message', data => {
    console.log(data);
    io.sockets.emit('new message', { msg: data, user: socket.username });
  });

  //new user
  socket.on('new user', (data, cb) => {
    cb(true);
    socket.username = data;
    users.push(socket.username);
    updateUsernames();
  });
  let updateUsernames = () => {
    io.sockets.emit('get users', users);
  };
});
