var Bullet = require("./entity/Bullet");

Items = {
  undefined : function(player, v) {
    if (v == true && player.spectate == false) {
      var punch_e_cost = 1;
      if (player.lastFire + player.fireCooldown < Date.now() && player.energy >= punch_e_cost) {
        player.lastFire = Date.now();
          
        player.energy -= punch_e_cost;
        
        var bullet = new Bullet(player.gameServer, player);

        bullet.img = "";
        bullet.damage = 5;
        bullet.speed = 0;
        bullet.radius = 100;        

        bullet.x = player.x + Math.sin(player.angle) * 50;
        bullet.y = player.y - Math.cos(player.angle) * 50;
        bullet.angle = player.angle;
        bullet.expire = Date.now() + 500;

        bullet.targets.push("player", "animal", "tree");
        
        player.gameServer.entity.push(bullet);
      }
    }
  },

  "bow" : function(player, v) {
    if (v == true && player.spectate == false) {
      var arrow_e_cost = 3;
      if (player.lastFire + player.fireCooldown < Date.now() && player.energy >= arrow_e_cost) {
        player.lastFire = Date.now();
          
        player.energy -= arrow_e_cost;
        
        var bullet = new Bullet(player.gameServer, player);

        bullet.img = "arrow";
        bullet.damage = 20;
        bullet.speed = 45;
        
        bullet.x = player.x;
        bullet.y = player.y;
        bullet.angle = player.angle;

        bullet.targets.push("player", "animal");
        
        player.gameServer.entity.push(bullet);
      }
    }
  }
};

module.exports = Items;
