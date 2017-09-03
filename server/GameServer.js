var Player = require("./entity/Player");
var Bullet = require("./entity/Bullet");
var Animal = require("./entity/Animal");
var Tree = require("./entity/Tree");

var Geometry = require("./Geometry");

function GameServer() {
    this.entity = [];
}

module.exports = GameServer;

GameServer.prototype.start = function() {
    // Geometry test
    var p1 = new Geometry.Point(0, 0);
    var p2 = new Geometry.Point(0, 2);
    //console.log( Geometry.dist(p1, p2) );

    // A very-very lately added comment:
    // before abandoning the project I tried adding a collision system,
    // you can see this above and in the geometry file
    // I stopped because of realising that the game has no potential

    setInterval(this.mainLoop.bind(this), 1000 / 60);

    for (var i = 0; i < 30; i++)
        this.entity.push(new Animal(this));
    for (var i = 0; i < 100; i++)
        this.entity.push(new Tree(this));
}

GameServer.prototype.mainLoop = function() {
    this.entity.sort(function(a, b) {
        return a.priority - b.priority;
    });

    for (var i = 0; i < this.entity.length; i++)
        this.entity[i].update();
}

GameServer.prototype.newPlayer = function(socket, name) {
    var player = new Player(this, socket, name);
    this.entity.push(player);
    return player;
}
