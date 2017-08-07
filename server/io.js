module.exports = function(io, gameServer) {
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
}