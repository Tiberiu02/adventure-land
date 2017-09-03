CanvasRenderingContext2D.prototype.setZoom = function(zoom) {
    zoom = Math.max(0.3, Math.min(3, zoom));

    this.setTransform(zoom, 0, 0, zoom, 0, 0);
    this.zoom = zoom;
    ctx.setVortex(this.vortex.x, this.vortex.y);
}

CanvasRenderingContext2D.prototype.zoomIn = function() {
    var i, vel;
    vel = 0.01;
    for (i = 0; i < 60; i++) {
        setTimeout(function() {
            this.setZoom(this.zoom * (1 + vel));
            vel *= 0.9;
        }.bind(this), i * (1000 / 60));
    }
}

CanvasRenderingContext2D.prototype.zoomOut = function() {
    var i, vel;
    vel = 0.01;
    for (i = 0; i < 60; i++) {
        setTimeout(function() {
            this.setZoom(this.zoom * (1 - vel));
            vel *= 0.9;
        }.bind(this), i * (1000 / 60));
    }
}

CanvasRenderingContext2D.prototype.writeText = function(text, x, y, textSize = 32, absolute = false, borderColor = "#000", fillColor = "#FFF") {
    this.font = "bold " + textSize + "px Arial";
    this.textAlign = "center";
    this.strokeStyle = borderColor;
    this.fillStyle = fillColor;
    this.lineWidth = 1;

    if (absolute) {
        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);
    }

    this.fillText(text, x, y);
    this.strokeText(text, x, y);

    if (absolute)
        this.restore();
}

CanvasRenderingContext2D.prototype.drawAura = function(color, x, y, radius) {
    // Create gradient
    var grd = this.createRadialGradient(x, y, 0, x, y, radius);

    // Add colors
    grd.addColorStop(0, 'rgba(0, 0, 255, 1)');
    grd.addColorStop(1, 'rgba(0, 0, 0, 0)');

    // Fill with gradient
    this.fillStyle = grd;
    this.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}

CanvasRenderingContext2D.prototype.drawModel = function(model, x, y, angle) {
    this.save();
    this.translate(x, y);
    if (angle !== undefined)
        this.rotate(angle);
    var i, j;
    for (j = 0; j < model.length; j++) {
        this.beginPath();
        this.moveTo(model[j][1][0], model[j][1][1]);
        for (i = 2; i < model[j].length; i++)
            this.lineTo(model[j][i][0], model[j][i][1]);
        //this.fillStyle = model[j][0];
        //this.fill();
        this.strokeStyle = model[j][0];
        this.stroke();
        this.closePath();
    }
    this.restore();
}

CanvasRenderingContext2D.prototype.drawImage2 = function(src, x, y, width, height, angle) {
    if ((x + width) * this.zoom < -this.canvas.clientWidth / 2 ||
        (x - width) * this.zoom > this.canvas.clientWidth / 2 ||
        (y + height) * this.zoom < -this.canvas.clientHeight / 2 ||
        (y - height) * this.zoom > this.canvas.clientHeight / 2)
        return;

    this.save();
    this.translate(x, y);
    if (angle !== undefined)
        this.rotate(angle);
    var img;
    img = document.createElement("IMG");
    img.src = src;
    img.width = width;
    img.height = height;
    this.drawImage(img, -width / 2, -height / 2, width, height);
    this.restore();
}

CanvasRenderingContext2D.prototype.clear = function(color) {
    this.save();
    this.setTransform(1, 0, 0, 1, 0, 0);
    if (color === undefined)
        this.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
    else {
        this.fillStyle = color;
        this.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
    }
    this.restore();
}

CanvasRenderingContext2D.prototype.setVortex = function(x, y) {
    if (x == undefined || y == undefined)
        return;

    this.setTransform(this.zoom, 0, 0, this.zoom, 0, 0);
    this.translate(x * this.canvas.clientWidth / this.zoom, y * this.canvas.clientHeight / this.zoom);
    this.vortex = {
        x: x,
        y: y
    };
}

CanvasRenderingContext2D.prototype.drawLoadingBar = function(x, y, sx, sy, status, color, border) {
    status = Math.min(1, Math.max(0, status));

    if (color === undefined)
        color = "#FFF";
    if (border === undefined)
        border = 4;

    this.beginPath();
    this.rect(x + border / 2, y + border / 2, sx - border, sy - border);
    this.lineWidth = border;
    this.strokeStyle = color;
    this.stroke();

    this.fillStyle = color;
    this.fillRect(x + border * 1.5, y + border * 1.5, (sx - border * 3) * status, (sy - border * 3));
}

CanvasRenderingContext2D.prototype.drawHexagonalBackground = function(rx, ry) {
    rx = (rx + this.canvas.clientWidth / this.zoom / 2) % 96 - 96;
    ry = (ry + this.canvas.clientHeight / this.zoom / 2) % 48 - 48;

    this.save();
    this.setTransform(this.zoom, 0, 0, this.zoom, 0, 0);

    var width = this.canvas.clientWidth;
    var height = this.canvas.clientHeight;

    var hexagon = [
        ["#FFF", [0, 0],
            [16, 24],
            [0, 48]
        ],
        ["#FFF", [16, 24],
            [48, 24]
        ],
        ["#FFF", [96, 0],
            [64, 0],
            [48, 24],
            [64, 48],
            [96, 48]
        ]
    ];

    this.lineWidth = 1;

    var x, y;
    for (x = rx; x <= width / this.zoom; x += 96)
        for (y = ry; y <= height / this.zoom; y += 48)
            this.drawModel(hexagon, x, y);

    this.restore();
}

CanvasRenderingContext2D.prototype.generateStarrySkyModel = function() {
    var model = [];

    var hmTimes = this.canvas.clientWidth + this.canvas.clientHeight;

    for (var i = 0; i <= hmTimes; i++) {
        var randomX = Math.random();
        var randomY = Math.random();
        var randomSize = Math.floor((Math.random() * 15) + 5) * Math.round(Math.random());
        var randomOpacityOne = Math.floor((Math.random() * 9) + 1);
        var randomOpacityTwo = Math.floor((Math.random() * 9) + 1);
        var randomHue = Math.floor((Math.random() * 360) + 1);
        model.push({
            x: randomX,
            y: randomY,
            size: randomSize,
            opacityOne: randomOpacityOne,
            opacityTwo: randomOpacityTwo,
            hue: randomHue
        });
    }
    return model;
}

CanvasRenderingContext2D.prototype.drawStarrySky = function(model) {
    this.save();
    this.setTransform(this.zoom, 0, 0, this.zoom, 0, 0);
    for (var i = 0; i < model.length; i++) {
        if (model[i].size > 1) {
            this.shadowBlur = model[i].size;
            this.shadowColor = "white";
        }
        this.fillStyle = "hsla(" + model[i].hue + ", 30%, 80%, ." + model[i].opacityOne + model[i].opacityTwo + ")";
        this.fillRect(model[i].x * this.canvas.clientWidth, model[i].y * this.canvas.clientHeight, model[i].size, model[i].size);
    }
    this.restore();
}

CanvasRenderingContext2D.prototype.drawGrid = function(rx, ry, d, w, color) {
    var width = this.canvas.clientWidth;
    var height = this.canvas.clientHeight;
    rx = Math.floor(rx + width / this.zoom / 2);
    ry = Math.floor(ry + height / this.zoom / 2);
    d = Math.floor(d);
    w = Math.floor(w);

    this.save();
    this.setTransform(this.zoom, 0, 0, this.zoom, 0, 0);
    rx %= d;
    ry %= d;
    var x, y;
    this.beginPath();
    for (x = rx; x <= width / this.zoom; x += d) {
        this.moveTo(x, 0);
        this.lineTo(x, height / this.zoom);
    }
    for (y = ry; y <= height / this.zoom; y += d) {
        this.moveTo(0, y);
        this.lineTo(width / this.zoom, y);
    }
    this.strokeStyle = color;
    this.strokeWidth = w;
    this.stroke();
    this.restore();
}

function hash(x) {
    x += 1000000000;
    var y = 1;
    var a = 1000000093;
    var mod = 1000000097;
    while (x > 0) {
        if (x % 2 == 1)
            y = y * a % mod;
        a = a * a % mod;
        x = Math.floor(x / 2);
    }
    return y;
}

function Image(src, w, h) {
    var i = document.createElement("IMG");
    i.src = src;
    i.width = w;
    i.height = h;
    return i;
}

CanvasRenderingContext2D.prototype.drawFloor = function(x0, y0, d = 100, cells = ["#6aca45", "#43bd16"]) {
    var width = this.canvas.clientWidth;
    var height = this.canvas.clientHeight;
    rx = Math.floor(x0 + width / this.zoom / 2);
    ry = Math.floor(y0 + height / this.zoom / 2);
    d = Math.floor(d);

    this.save();
    this.setTransform(this.zoom, 0, 0, this.zoom, 0, 0);
    rx %= d;
    ry %= d;

    x0 = Math.floor((-x0 + rx) / d) - Math.floor(width / this.zoom / 2 / d);
    y0 = Math.floor((-y0 + ry) / d) - Math.floor(height / this.zoom / 2 / d);
    var x, y;

    var bgs = [Image("grass.jpg"), Image("grass1.png"), Image("grass2.png"), Image("grass3.png"), Image("grass4.png"), Image("grass5.png"), Image("grass6.png"), Image("grass7.png")];
    for (x = -1; x * d <= width / this.zoom + d; x += 1)
        for (y = -1; y * d <= height / this.zoom + d; y += 1) {
            var h = hash(hash(x + x0) + hash(y + y0)) % 1000;
            var img;
            if (h < 890) img = bgs[0];
            else if (h < 940) img = bgs[2];
            else if (h < 960) img = bgs[3];
            else if (h < 965) img = bgs[5];
            else if (h < 969) img = bgs[6];
            else if (h < 970) img = bgs[7];
            else if (h < 990) img = bgs[4];
            else img = bgs[1];
            var a = hash(hash(x + x0) + hash(y + y0) + 1) % 4;

            if (a == 0) {
                this.drawImage(img, x * d + rx, y * d + ry, d, d);
            } else if (a == 1) {
                this.save();
                this.translate(x * d + rx + d, y * d + ry + d);
                this.rotate(Math.PI);
                this.drawImage(img, 0, 0, d, d);
                this.restore();
            } else if (a == 2) {
                this.save();
                this.translate(x * d + rx + d, y * d + ry);
                this.rotate(Math.PI / 2);
                this.drawImage(img, 0, 0, d, d);
                this.restore();
            } else {
                this.save();
                this.translate(x * d + rx, y * d + ry + d);
                this.rotate(-Math.PI / 2);
                this.drawImage(img, 0, 0, d, d);
                this.restore();
            }

            continue;
            var l = 4;
            for (var x1 = 0; x1 < l; x1 += 1)
                for (var y1 = 0; y1 < l; y1 += 1) {
                    this.fillStyle = cells[hash(hash((x + x0) * l + x1) + hash((y + y0) * l + y1)) % cells.length];
                    this.fillRect(Math.floor(x * d + rx + x1 * (d / l)), Math.floor(y * d + ry + y1 * (d / l)), Math.floor(d / l), Math.floor(d / l));
                }
        }
    this.restore();
}
