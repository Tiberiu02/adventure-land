var Bullet = require("./Bullet");

function Player(gameServer, socket, name) {
  this.gameServer = gameServer;

  this.priority = 2;
  
  this.money = 0;

  this.type = "player";

  this.img = "player_0";
  this.imgTick = 0;
  this.imgTicks = 16;

  this.width = 100;
  this.height = 100;

  if (name == undefined)
    name = "";
  if (name.length < 15)
    this.name = name;
  this.socket = socket;
  
  this.key = [];
  this.oldKey = [];
  
  this.hp = 100;
  this.energy = 100;
  this.maxHP = 100;
  this.maxEnergy = 100;

  this.speed = 3;
  
  this.x = 0;
  this.y = 0;
  
  this.velX = 0;
  this.velY = 0;
  this.velDecay = 0.99;
  
  this.isFiringLasers = 0;
  this.isFiringRockets = 0;
  
  this.angle = 0;
  
  this.lastFire = 0;
  this.fireCooldown = 200;

  this.spectate = false;

  this.inv = [];
  this.invSize = 40;
}

module.exports = Player;

Player.prototype.update = function() {
  if ( !this.spectate && !this.key["W"] && !this.key["A"] && !this.key["S"] && !this.key["D"] && ( Math.floor(this.imgTick) != 4 && Math.floor(this.imgTick) != 12 ) )
    key = this.oldKey;
  else
    key = this.key;

  if (key["D"])
    this.x += this.speed / (key["S"] || key["W"] ? Math.sqrt(2) : 1);
  else if (key["A"])
    this.x -= this.speed / (key["S"] || key["W"] ? Math.sqrt(2) : 1);

  if (key["S"])
    this.y += this.speed / (key["D"] || key["A"] ? Math.sqrt(2) : 1);
  else if (key["W"])
    this.y -= this.speed / (key["D"] || key["A"] ? Math.sqrt(2) : 1);

  if (this.boostStatus() && ( key["W"] || key["A"] || key["S"] || key["D"] )) {
    if (key["D"])
      this.x += this.speed / (key["S"] || key["W"] ? Math.sqrt(2) : 1);
    else if (key["A"])
      this.x -= this.speed / (key["S"] || key["W"] ? Math.sqrt(2) : 1);

    if (key["S"])
      this.y += this.speed / (key["D"] || key["A"] ? Math.sqrt(2) : 1);
    else if (key["W"])
      this.y -= this.speed / (key["D"] || key["A"] ? Math.sqrt(2) : 1);

    if ( !this.spectate )
      this.energy -= 1;
  }

  if ( !this.spectate ) {
    if ( key["W"] || key["A"] || key["S"] || key["D"] ) {
      this.imgTick = ( this.imgTick + 0.17 ) % this.imgTicks;
    } else {
      this.imgTick = 13 - 0.17;
    }
    this.img = "player_" + Math.floor(this.imgTick);

    this.regen();
    
    if (this.canFire())
      this.fire();
  }
    
  this.updateClient();
}

Player.prototype.play = function( name ) {
  if ( this.spectate == false )
    return;

  this.prize = 100;
  
  this.hp = 100;
  this.energy = 100;

  this.speed = 3;
  
  this.x = 0;
  this.y = 0;
  
  this.velX = 0;
  this.velY = 0;
  this.velDecay = 0.99;
  
  this.isFiringLasers = 0;
  this.isFiringRockets = 0;
  
  this.angle = 0;
  
  this.lastFire = 0;
  this.fireCooldown = 200;

  this.spectate = false;

  this.name = name;

  this.getItem( "bow" );
}

Player.prototype.destroy = function() {
  this.socket.emit('died');

  for ( var i = 0; i < this.invSize; i ++ ) {
    this.inv[i] = undefined;
    this.socket.emit( 'slot', i, undefined );
  }

  this.spectate = true;
}

Player.prototype.getItem = function(item) {
  for ( var i = 0; i < this.invSize; i ++ ) {
    if ( this.inv[i] == undefined ) {
      this.inv[i] = item;
      this.socket.emit('slot', i, item);
      return;
    }
  }
}

Player.prototype.disconnect = function() {
  this.gameServer.entity.splice( this.gameServer.entity.indexOf( this ), 1 );
}

Player.prototype.regen = function() {
   this.hp = Math.min(this.hp + 0.1, this.maxHP);
   this.energy = Math.min(this.energy + 0.1, this.maxEnergy);
}

Player.prototype.setAngle = function(angle) {
  this.angle = angle;
}

Player.prototype.canFire = function(){
  if (!this.isFiringLasers && !this.isFiringRockets)
    return false;
    
  return true;
}

Player.prototype.fire = function() {
  if (this.isFiringLasers && this.lastFire + 100 < Date.now() && this.energy > 2) {
    this.lastFire = Date.now();
      
    this.energy -= 2;
    
    var bullet = new Bullet(this.gameServer, this);
    
    bullet.owner = this;

    bullet.type = "bullet";
    bullet.img = "arrow";

    bullet.damage = 10;
    bullet.speed = 25;
    
    bullet.x = this.x;
    bullet.y = this.y;
    bullet.angle = this.angle;
    
    this.gameServer.entity.push(bullet);
  } else if (this.isFiringRockets && this.lastFire + 500 < Date.now() && this.energy > 10) {
    this.lastFire = Date.now();
       
    this.energy -= 10;
    
    var bullet = new Bullet(this.gameServer, this);

    bullet.type = "bullet";
    bullet.img = "rocket";
    
    bullet.owner = this;
    bullet.damage = 100;
    bullet.speed = 25;
    
    bullet.x = this.x;
    bullet.y = this.y;
    bullet.angle = this.angle;
    
    this.gameServer.entity.push(bullet);
  }
  
  this.gameServer.entity.sort(function( a, b ){ return a.priority - b.priority; });
}

Player.prototype.boostStatus = function() {
  return (this.key[' '] == true && this.energy > 2);
}

Player.prototype.getAngle = function() {
  if ( !this.key["W"] && !this.key["A"] && !this.key["S"] && !this.key["D"] && ( Math.floor(this.imgTick) != 4 && Math.floor(this.imgTick) != 12 ) ) {
    var W = this.oldKey['W'];
    var A = this.oldKey['A'];
    var S = this.oldKey['S'];
    var D = this.oldKey['D'];
  } else {
    var W = this.key['W'];
    var A = this.key['A'];
    var S = this.key['S'];
    var D = this.key['D'];
  }

  var PI = Math.PI;

  if ( !A && !S && !D && !W )
    return this.angle;
  if ( S && !A && !D )
    return PI;
  else if ( S && D )
    return PI / 4 * 3;
  else if ( D && !W )
    return PI / 2;
  else if ( D && W )
    return PI / 4;
  else if ( W && !A )
    return 0;
  else if ( S && A )
    return -PI / 4 * 3;
  else if ( W && A )
    return -PI / 4;
  else
    return -PI / 2;
}

Player.prototype.pressKey = function(key, v) {
  if ( this.key[key] == v )
    return;

  //this.oldKey = this.key;
  for (var attr in this.key)
      this.oldKey[attr] = this.key[attr];
  this.key[key] = v;
}

Player.prototype.setFireStatus = function(b, v) {
  if (b == 1)
    this.isFiringLasers = v;
  else if (b == 3)
    this.isFiringRockets = v;
}

Player.prototype.updateClient = function(){
  var entity = [];
  var myIndex;
  
  /*for (var i = 0; i < this.gameServer.entity.length; i ++) {
    var e = this.gameServer.entity[i];

    if ( e.type == "player" )
      continue;
    entity.push({x: e.x, y: e.y, angle: e.angle, img: e.img, width: e.width, height: e.height});
  }*/

  for (var i = 0; i < this.gameServer.entity.length; i ++) {
    var e = this.gameServer.entity[i];

    if ( e.spectate )
      continue;
    entity.push({x: e.x, y: e.y, angle: e.getAngle(), img: e.img, name: e.name, width: e.width, height: e.height, hp: e.hp / e.maxHP, energy: e.energy / e.maxEnergy, priority: e.priority });
  }
  
  this.socket.emit('entity', entity, {x: this.x, y: this.y, angle: this.getAngle(), img: this.img, name: e.name, width: this.width, height: this.height, hp: this.hp / this.maxHP, energy: this.energy / this.maxEnergy, priority: this.priority });
}

Player.prototype.updateMouse = function(x, y) {
  var deltaX = x - this.x;
  var deltaY = y - this.y;
  
  this.angle = Math.atan2(deltaX, -deltaY);
}

Player.prototype.getMoney = function( amount ) {
  this.money += amount;
  this.socket.emit( 'money', this.money );
}

Player.prototype.damage = function( damage, attacker ) {
  this.hp -= damage;
  if ( this.hp <= 0 ) {
    attacker.getMoney( this.prize );
    this.destroy();
  }
}
