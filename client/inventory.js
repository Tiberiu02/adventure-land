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
    id -= 5;
    if (id >= 8 || id < 0)
        return;
    getBarCell(id).innerHTML = getCell(id + 5).innerHTML;
}

function getIndex(cell) {
    return Array.prototype.slice.call(document.getElementsByClassName("inv-cell"), 0).indexOf(cell);
}

function drop(ev) {
    ev.preventDefault();
    var data = dragEl;
    var tg = ev.target;

    if (getIndex(tg) == -1) {
        if (getIndex(tg.parentNode) != -1)
            tg = tg.parentNode;
        else
            return;
    }

    if (getIndex(tg) == 4)
        return; // Can't drop in this cell :P

    var a = getIndex(data.parentNode);
    var b = getIndex(tg);

    console.log(data);
    console.log([dragEl]);

    if (a == b)
        return;
    if (!isEmpty(getCell(b)) && a == 4)
        return;

    socket.emit('move-item', a, b);

    if (!isEmpty(tg)) {
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

function setItem(imgSrc, cell) {
    cell.innerHTML = "";
    if (imgSrc != undefined) {
        var item = document.createElement('IMG');
        item.setAttribute("class", "item");
        item.setAttribute("src", "item/" + imgSrc + ".png");
        item.setAttribute("draggable", "true");
        item.setAttribute("ondragstart", "drag(event)");
        cell.innerHTML = "<img class=\"item\" src=\"item/" + imgSrc + ".png\" draggable=\"true\" ondragstart=\"drag(event)\">";
        //cell.appendChild(item);
    }
    updateBarCell(getIndex(cell));
}
