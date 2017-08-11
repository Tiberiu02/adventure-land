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

require('./routes.js')(app);

var server = http.listen(8080, function() {
  console.log("Game is running at " + chalk.green("http://localhost:8080"));
})

var gameServer = new GameServer();
gameServer.start();
require('./io.js')(io, gameServer);