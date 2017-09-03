function Animal(gameServer) {
    this.gameServer = gameServer;

    var Animals = [{
        subType: "pig",
        speed: 2,
        Width: 40,
        Height: 65,
        MaxHP: 50,
        priority: 1.1,
        Prize: 30,
        drop: [
            ["raw-pork", 0.75],
            ["raw-pork", 0.25]
        ]
    }, {
        subType: "sheep",
        speed: 1.6,
        Width: 49,
        Height: 91,
        MaxHP: 85,
        priority: 1.2,
        Prize: 40,
        drop: [
            ["wool", 0.85],
            ["wool", 0.35],
            ["raw-mutton", 0.65],
            ["raw-mutton", 0.20]
        ]
    }, {
        subType: "chicken",
        speed: 2.5,
        Width: 25,
        Height: 40,
        MaxHP: 25,
        priority: 1,
        Prize: 20,
        drop: [
            ["raw-chicken", 0.9],
            ["egg", 0.85],
            ["egg", 0.25]
        ]
    }, {
        subType: "cow",
        speed: 1,
        Width: 56,
        Height: 120,
        MaxHP: 100,
        priority: 1.3,
        Prize: 50,
        drop: [
            ["raw-beef", 0.85],
            ["raw-beef", 0.35],
            ["leather", 0.75]
        ]
    }];

    var randAnimal = Animals[Math.floor(Math.random() * Animals.length)];
    for (var k in randAnimal) this[k] = randAnimal[k];

    this.type = "animal"
    this.maxGrowth = 1 + 2 - Math.sqrt(Math.random() * 4);
    this.growth = Math.sqrt(this.maxGrowth) / 2;

    this.maxHP = this.MaxHP * this.growth;
    this.hp = this.maxHP * this.growth;
    this.width = this.Width * this.growth;
    this.height = this.Height * this.growth;
    this.prize = this.Prize * this.growth;

    this.img = this.subType;

    this.x = 0;
    this.y = 0;

    this.angle = Math.random() * Math.PI * 2 - Math.PI;

    this.tick = Math.floor(Math.random() * (60 * 5));
}

module.exports = Animal;

Animal.prototype.regen = function() {
    this.hp = Math.min(this.hp + 0.1, this.maxHP);
}

Animal.prototype.grow = function() {
    this.growth = Math.min(this.growth + 0.00001, this.maxGrowth);

    this.width = this.Width * this.growth;
    this.height = this.Height * this.growth;
    this.maxHP = this.MaxHP * this.growth;
    this.prize = Math.floor(this.Prize * this.growth);
}

Animal.prototype.update = function() {
    this.grow();
    this.regen();

    if (this.tick <= this.boostTick) {
        this.x += this.speed * Math.sin(this.angle) * 2;
        this.y -= this.speed * Math.cos(this.angle) * 2;
    } else if (this.tick % (60 * 5) == 0)
        this.angle = Math.random() * Math.PI * 2 - Math.PI;
    else if (this.tick % (60 * 5) <= 60 * 4) {
        this.x += this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);
    }

    this.tick++;
}

Animal.prototype.getAngle = function() {
    return this.angle;
}

Animal.prototype.destroy = function() {
    this.x = this.y = 0;
    this.tick = 0;
    this.hp = 100;
}

Animal.prototype.damage = function(damage, attacker) {
    this.hp -= damage;
    if (this.hp <= 0) {
        attacker.getMoney(this.prize);
        for (var i = 0; i < this.drop.length; i++)
            if (this.drop[i][1] >= Math.random())
                attacker.getItem(this.drop[i][0]);
        this.destroy();
    } else
        this.boostTick = this.tick + 100;
}
