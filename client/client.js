var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

var angle = 0;

var zoom = 1;

var energy = 1;
var hp = 0;

var socket;

var me = {x: 0, y: 0};
var entity = [];

var spectator = true;

var starrySkyModel;

var money = 0;

var model = [];
model["player"] = [["#FFF",[-8.3,8.3],[-9.6,5],[-10,1.6],[-5,-1.6],[-10,-1.6],[-6.6,-7.6],[-2.6,-8.3],[-5.6,-10],[0,-16.6],[5.6,-10],[2.6,-8.3],[6.6,-7.6],[10,-1.6],[5,-1.6],[10,1.6],[9.6,5],[8.3,8.3],[0,0],[5,3.3],[0,5],[-5,3.3],[-3.3,3.3]]];
model["laser"] = [["#F00", [0, -25], [0, 25]]];

function initInputHandler(){
  $(document).keyup(function(e) {
    if ( e.which != 27 )
      socket.emit('key', String.fromCharCode(e.keyCode), false);
  });
  $(document).keydown(function(e) {
    if ( e.which == 27 && !isModal("inventoryModal") ) {
      showModal("myModal");
      if ( spectator )
        ctx.zoomIn();
    } else if ( String.fromCharCode(e.keyCode) == 'E' && !isModal("myModal") && !spectator ) {
      if ( isModal("inventoryModal") )
        hideModal("inventoryModal");
      else
        showModal("inventoryModal");
    } else if ( document.getElementById('myModal').style.display == "none" )
      socket.emit('key', String.fromCharCode(e.keyCode), true);
      console.log("'" + String.fromCharCode(e.keyCode) + "'");
  });
}

function init(){
  initInputHandler();
  updateCanvasSize();
  
  starrySkyModel = ctx.generateStarrySkyModel();

  connectIo();
  showModal("myModal"); //play();
  requestAnimationFrame(render);
}

// Mouse wheel event
if (canvas.addEventListener) {
  canvas.addEventListener("mousewheel", MouseWheelHandler, false); // IE9, Chrome, Safari, Opera
  canvas.addEventListener("DOMMouseScroll", MouseWheelHandler, false); // Firefox
} else
  canvas.attachEvent("onmousewheel", MouseWheelHandler); // IE 6/7/8

// Mouse wheel hander
function MouseWheelHandler(e) {
  var e = window.event || e;
  var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
  if (delta == 1)
    ctx.zoomIn();
  else
    ctx.zoomOut();
}

function play() {
  socket.emit('play', $("#name").val() );
  hideModal("myModal");
  document.getElementsByClassName("inv-bar")[0].style.display = "block";
}

function spectate() {
  if ( !spectator )
    return;

  hideModal("myModal");
  ctx.zoomOut();
}

function updateCanvasSize() { // Is called when the window is resized
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  ctx.setVortex(0.5, 0.5);
  ctx.setZoom(zoom);

  ctx.imageSmoothingEnabled = false;
}

function updateMouse(event){
  var x = me.x + event.clientX - canvas.width / 2;
  var y = me.y + event.clientY - canvas.height / 2;
  
  //me.angle = Math.atan2(event.clientX - canvas.width / 2, -event.clientY + canvas.height / 2);

  socket.emit('mouse', x, y);
}

function dist(deltaX, deltaY) {
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

function render(){
  try {
    //ctx.drawGrid(-me.x, -me.y, 50, 2, "#FFF");
    if ( ctx.zoom > .15 ) {
      ctx.clear("#85e085");
      ctx.drawHexagonalBackground(-me.x, -me.y);
      //ctx.drawStarrySky( starrySkyModel );
    } else {
      ctx.clear("#8be08b");
    }
    
    if ( entity.length != 0 ) {
      for (var i = 0; i < entity.length; i ++) {
        var e = entity[i];

        if ( e.priority > me.priority && dist(e.x - me.x, e.y - me.y) < (e.width + me.width) / 2 )
          ctx.globalAlpha = 0.5;

        ctx.drawImage2("entity/" + e.img + ".png", e.x - me.x, e.y - me.y, e.width, e.height, e.angle);
        if ( e.hp )
          ctx.drawLoadingBar(e.x - me.x - 52, e.y - me.y - 83, 100, 15, e.hp, "#F44", 2);
        if ( e.energy )
          ctx.drawLoadingBar(e.x - me.x - 52, e.y - me.y + 25 - 90, 100, 15, e.energy, "#44F", 2);
        if ( e.name != undefined )
          ctx.writeText( e.name, e.x - me.x, e.y - me.y + 80 );

        if ( e.priority > me.priority && dist(e.x - me.x, e.y - me.y) < e.width + me.width )
          ctx.globalAlpha = 1;
      }
			if ( !spectator )
      	ctx.writeText( money, 0, -90, 25, false, "#bcb910", "#fffa00" );
    }
  } catch(e) {
  //  console.log( e );
  }
  
  requestAnimationFrame(render);
}

function clickStart(ev){
  socket.emit('click', ev.which, true);
}

function clickStop(ev){
  socket.emit('click', ev.which, false);
}

canvas.addEventListener('contextmenu', function(ev) {
  ev.preventDefault();
  return false;
}, false);

function connectIo() {
  // Open the socket
  socket = io();

  socket.on('died', function() {
    showModal("myModal");
    spectator = true;
    document.getElementsByClassName("inv-bar")[0].style.display = "none";
  });

  // Server's response to 'play'
  socket.on('play', function() {
    spectator = false;
  });

  // Data updates
  
  // Leaderboard
  /*
  socket.on('leaderboard', function(data) {
    var leaderboard = document.getElementById("leaderboard");
    leaderboard.innerHTML = "<h1>Leaderboard</h1>";
    for (var i = 0; i < data.length; i ++)
      leaderboard.innerHTML += (i + 1) + ". " + data[i] + "<br>";
  });
  */
  
  // Money
  socket.on('money', function(data) {
    money = data;
  });
  
  // Entity
  socket.on('entity', function(e, meE) {
    entity = e;
    me = meE;
  });

  socket.on('slot', function(slot, item) {
    setItem( item, getCell( slot ) );
  });
}
