Items = require("./Items");

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
			if ( !player.spectate ) {
        player.action(v, b);
        if (b == 1) {
          if (Items[player.inv[5]] != undefined)
            Items[player.inv[5]](player, v, b);
          else
            Items[undefined](player, v, b);
        } else if (b == 3) {
          if (Items[player.inv[6]] != undefined)
            Items[player.inv[6]](player, v, b);
          else
            Items[undefined](player, v, b);
        }
      }
		});

		socket.on('key', function(key, v) {
			player.pressKey(key, v);
		});

		socket.on('disconnect', function() {
			player.disconnect();
		});

		socket.on('move-item', function(from, to) {
      if ( to == from || to == -1
      || to < 0 || to >= player.invSize + 5
      || from < 0 || to >= player.invSite + 5
      || player.inv[from] == undefined ) {
        console.log("Inventory glitch occured");        
        return; // Yes, hacking won't be punished
      }

      if ( from == 4 )
        player.craft();

			var aux = player.inv[to]
			player.inv[to] = player.inv[from];
			player.inv[from] = aux;

      if ( to < 5 || from < 5 )
        player.updateCrafting();
      player.updateInventory();
		});
	});
}
