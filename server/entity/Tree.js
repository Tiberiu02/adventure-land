function Tree(gameServer) {
    this.gameServer = gameServer;

    this.priority = 3;

    this.type = "tree";
    this.img = "tree_" + Math.floor(Math.random() * 3 + 1);

    this.maxHP = this.hp = this.size = 100 + Math.random() * 400;
    this.maxSize = 2000;

    this.angle = Math.PI * 2 * Math.random() - Math.PI;

    this.width = this.height = 100;

    this.x = Math.random() * 10000 - 5000;
    this.y = Math.random() * 10000 - 5000;

    this.prize = Math.floor(this.size / 10);
}

module.exports = Tree;

Tree.prototype.regen = function() {
    this.hp = Math.min(this.hp + 0.02, this.maxHP);
}

Tree.prototype.grow = function() {
    this.width = this.height = this.size = this.maxHP = Math.min(this.size + 0.001, this.maxSize);
    this.prize = Math.floor(this.size / 10);
    this.priority = 3 + this.size / 10000;
}

Tree.prototype.update = function() {
    this.grow();
    this.regen();
}

Tree.prototype.getAngle = function() {
    return this.angle;
}

Tree.prototype.destroy = function() {
    this.x = Math.random() * 10000 - 5000;
    this.y = Math.random() * 10000 - 5000;

    this.size = this.hp = 100;
}

Tree.prototype.damage = function(damage, attacker) {
    this.hp -= damage;
    if (this.hp <= 0) {
        attacker.getMoney(this.prize);
        for (var i = 0; i < Math.sqrt(this.size / 100); i++)
            attacker.getItem("wood-log");
        this.destroy();
    }
}
