function Bullet(gameServer, owner) {
  this.gameServer = gameServer;

  this.priority = 0;
  
  this.type = "bullet";
  
  this.expire = Date.now() + 1000 * 5;
  
  this.owner = owner;

  this.width = 20;
  this.height = 50;
  this.radius = 50;

  this.targets = ["bullet"];
}

module.exports = Bullet;

Bullet.prototype.getAngle = function() {
  return this.angle;
}

Bullet.prototype.update = function(){
    if (this.expire < Date.now()) {
      this.destroy();
      return;
    }

    this.x += this.speed * Math.sin(this.angle);
    this.y -= this.speed * Math.cos(this.angle);
    
    for (var i = 0; i < this.gameServer.entity.length; i ++) {
        var e = this.gameServer.entity[i];
        if ( e.type != "bullet" && e != this.owner && e.spectate != true
        && Math.abs(this.x - e.x) < this.radius && Math.abs(this.y - e.y) < this.radius ) {
            if (this.targets.indexOf(e.type) != -1)
              e.damage( this.damage, this.owner );
            this.destroy();

            return;
        }
    }
}

Bullet.prototype.boostStatus = function(){
  return false;
}

Bullet.prototype.destroy = function(){
  var index = this.gameServer.entity.indexOf(this);
  this.gameServer.entity.splice(index, 1);
}
