var GameServer = require('./GameServer');
var express = require('express');
var compress = require('compression');
var chalk = require('chalk');
var fs = require('fs');
var path = require('path');
var LZString = require('lz-string');

module.exports = function(app) {
	app.get('/', function(req, res) {
		res.sendFile('/index.html', {
			'root': '' + __dirname + '/../client'
		});
	});

	app.get('/:file', function(req, res) {
		var file = req.params.file;
		var filePath = path.join(__dirname, "..", "client", file);

		if (fs.existsSync(filePath))
			res.sendFile(filePath);
		else
			res.end("Can't locate '/" + file + "'");
	});

	app.get('/:dir/:file', function(req, res) {
		var file = req.params.dir + "/" + req.params.file;
		var filePath = path.join(__dirname, "..", "client", file);

		if (fs.existsSync(filePath))
			res.sendFile(filePath);
		else
			res.end("Can't locate '/" + file + "'");
	});
}