var dragEl = null;

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  dragEl = ev.target;
}

function isEmpty(cell) {
  return (cell.innerHTML == "");
}

function clearCell(cell) {
  return cell.innerHTML = "";
}

function getCell(id) {
  return Array.prototype.slice.call(document.getElementsByClassName("inv-cell"), 0)[id];
}

function getBarCell(id) {
  return Array.prototype.slice.call(document.getElementsByClassName("bar-cell"), 0)[id];
}

function updateBarCell(id) {
  if ( id >= 8 )
    return;
  getBarCell(id).innerHTML = getCell(id).innerHTML;
}

function getIndex(cell) {
  return Array.prototype.slice.call(document.getElementsByClassName("inv-cell"), 0).indexOf(cell);
}

function drop(ev) {
  ev.preventDefault();
  var data = dragEl;
  var tg = ev.target;

  if ( getIndex(tg) == -1 ) {
    if ( getIndex(tg.parentNode) != -1 )
      tg = tg.parentNode;
    else
      return;
  }

  var a = getIndex(data.parentNode);
  var b = getIndex(tg);

  socket.emit('move-item', a, b);

  if(!isEmpty(tg)) {
    var aux = tg.innerHTML;
    tg.innerHTML = "";
    tg.appendChild(data);
    getCell(a).innerHTML = aux;
    console.log("hey");
  } else 
    tg.appendChild(data);

  updateBarCell(a);
  updateBarCell(b);
}

function setItem( imgSrc, cell ) {
  if ( imgSrc == undefined )
    cell.innerHTML = "";
  else
    cell.innerHTML = "<img class=\"item\" src=\"item/" + imgSrc + ".png\" draggable=\"true\" ondragstart=\"drag(event)\">";
  updateBarCell(getIndex(cell));
}
