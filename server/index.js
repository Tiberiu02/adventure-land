var GameServer = require('./GameServer');
//var Commands = require('./modules/CommandList');

var express = require('express');
var compress = require('compression');
var chalk = require('chalk');
var fs = require('fs');
var path = require('path');
var LZString = require('lz-string');

var app = new express();

var http = require('http').Server(app);

var io = require('socket.io')(http);

app.use(compress());
app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile('/index.html', {
    'root': '' + __dirname + '/../client'
  });
})

app.get('/:file', function(req, res) {
  var file = req.params.file;
  var filePath = path.join(__dirname, "..", "client", file);

  if (fs.existsSync(filePath))
    res.sendFile(filePath);
  else
    res.end("Can't locate '/" + file + "'");
})

app.get('/:dir/:file', function(req, res) {
  var file = req.params.dir + "/" + req.params.file;
  var filePath = path.join(__dirname, "..", "client", file);

  if (fs.existsSync(filePath))
    res.sendFile(filePath);
  else
    res.end("Can't locate '/" + file + "'");
})

var server = http.listen(80, function() {
  console.log("Game is running at " + chalk.green("http://localhost"));
})

io.on('connection', function(socket) {
  var player = gameServer.newPlayer(socket);
  player.spectate = true;

  socket.on('play', function(name) {
      if ( player.spectate == true )
        player.play( name );

      socket.emit('play');
  });

  socket.on('fire', function(b, v) {
    if ( !player.spectate )
      player.setFireStatus(b, v);
  });

  socket.on('mouse', function(x, y) {
    if ( !player.spectate )
      player.updateMouse(x, y);
  });

  socket.on('click', function(b, v) {
    if ( !player.spectate )
      player.setFireStatus(b, v);
  });

  socket.on('key', function(key, v) {
    player.pressKey(key, v);
  });

  socket.on('disconnect', function() {
    player.disconnect();
  });

  socket.on('move-item', function(from, to) {
    var aux = player.inv[to]
    player.inv[to] = player.inv[from];
    player.inv[from] = aux;
  });
});

var gameServer = new GameServer();
gameServer.start();
