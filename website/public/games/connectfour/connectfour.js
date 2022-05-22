var elements = [[]];
var isRedTurn = true;

function init() {
    let tr = '<tr class="wrapper">';
    let td = '<td class="wrapper"';
    let trEnd = '</tr>';
    let tdEnd = '</td>';
    let counter = 0;
    for (var i = 0; i < 6; i++) {
        elements.push(new Array());
        let item = tr;
        for (var j = 0; j < 7; j++) {
            item+=td+ ' id="box-' + counter + '">' + tdEnd;
            elements[i].push(parseInt(counter));
            counter++;
        }
        item+=trEnd;
        $('table').append(item);
    }
    elements.pop(6);
    for (var k = 0; k < 7; k++) {
        let loop = k;
        document.getElementById('box-' + loop).addEventListener('click', function() {
            placeChip(loop);
        });
    }
}

function placeChip(item) {
    let column = [];
    for (var i = 0; i < elements.length; i++) {
        column.push(elements[i][item]);
    }
    let allFilled = true;
    for (var i = column.length - 1; i >= 0; i--) {
        if (!isFilled(column[i])) {
            let color = isRedTurn ? 'red' : 'yellow';
            document.getElementById('box-' + column[i]).style.backgroundColor = color;
            allFilled = false;
            break;
        } 
    }
    if (allFilled) {
        document.getElementById('reference').textContent = 'You can\'t place that here!';
        setTimeout(function() {document.getElementById('reference').textContent = 'Click on the top row to place.'}, 2000);
    }
    if (checkWin()) {
        disableClicking();
        let winningPlayer = isRedTurn ? 'Red' : 'Yellow';
        document.getElementById('reference').textContent = winningPlayer + ' has won the game! Restarting in 2 seconds...';
        setTimeout(function() {window.location.reload()}, 2000);
    }
    if (everythingFilled()) {
        document.getElementById('reference').textContent = 'Draw! Refresh to continue.';
    }
    isRedTurn = !isRedTurn;
    let color = isRedTurn ? 'red' : 'yellow';
    let textColor = isRedTurn ? 'white' : 'black';
    document.getElementById('player').style.backgroundColor =  color;
    document.getElementById('player').style.color = textColor;
}

function isFilled(item) {
    return document.getElementById('box-' + item).style.backgroundColor === 'yellow' || document.getElementById('box-' + item).style.backgroundColor === 'red';
}

function everythingFilled() {
    let counter = 0;
    elements.forEach(array => {
        array.forEach(box => {
            if (isFilled(box)) {
                counter++;
            }
        });
    });
    return counter == 42;
}

function checkWin() {
    let counter = 0;
    let colors = [[]];
    for (var i = 0; i < elements.length; i++) {
        colors.push(new Array());
        for (var j = 0; j < elements[i].length; j++) {
            colors[i].push(document.getElementById('box-' + counter).style.backgroundColor);
            counter++;
        }
    }
    colors.pop(6);
    //check columns
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < elements[i].length; j++) {
            let arr = [];
            arr.push(colors[i][j]);
            arr.push(colors[i+1][j]);
            arr.push(colors[i+2][j]);
            arr.push(colors[i+3][j]);
            //console.log(arr);
            if (isSameColor(arr)) return true;
        }
    }
    //check rows
    for (var i = 0; i < elements.length; i++) {
        for (var j = 0; j < 3; j++) {
            let arr = [];
            arr.push(colors[i][j]);
            arr.push(colors[i][j+1]);
            arr.push(colors[i][j+2]);
            arr.push(colors[i][j+3]);
            if (isSameColor(arr)) return true;
        }
    }
    //check diags
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            let arr = [];
            arr.push(colors[i][j]);
            arr.push(colors[i+1][j+1]);
            arr.push(colors[i+2][j+2]);
            arr.push(colors[i+3][j+3]);
            if (isSameColor(arr)) return true;
            arr = [];
            arr.push(colors[i][j+3]);
            arr.push(colors[i+1][j+2]);
            arr.push(colors[i+2][j+1]);
            arr.push(colors[i+3][j]);
            if (isSameColor(arr)) return true;
        }
    }
    return false;
}

function isSameColor(arr) {
    var redCount = 0, yellowCount = 0;
    arr.forEach(item => {
        if (item === 'yellow') {
            yellowCount++;
        } else if (item === 'red') {
            redCount++;
        }
    });
    return yellowCount == 4 || redCount == 4;
}

function disableClicking() {
    for (var i = 0; i < 7; i++) {
        let loop = i;
        $("#box-" + loop).off()
    }
}

