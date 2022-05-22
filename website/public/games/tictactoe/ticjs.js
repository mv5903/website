let isX = true;
try {
    setInterval(checkWin, 50);
} catch (e) {
    console.error(e);
}

function checkWin() {
    let items = [[]];
    let counter = 0;
    for (let i = 0; i < 3; i++) {
        items.push(new Array());
        for (let j = 0; j < 3; j++) {
            items[i][j] = document.getElementById('item-' + counter).textContent === '&nbsp;' ? ' ' : (document.getElementById('item-' + counter).textContent);
            counter++;
        }
    }
    //check rows and cols
    for (let i = 0; i < 3; i++) {
        //rows
        if (items[i][0] === items[i][1] && items[i][1] === items[i][2] && (items[i][0] === 'X' || items[i][0] === 'O')) {
            if (items[i][0] === 'X') {
                winner(0);
            } else {
                winner(1);
            }
        }
        //cols
        if (items[0][i] === items[1][i] && items[1][i] === items[2][i] && (items[0][i] === 'X' || items[0][i] === 'O')) {
            if (items[0][i] === 'X') {
                winner(0);
            } else {
                winner(1);
            }
        }
    }
    //check diags
    if (items[0][0] === items[1][1] && items[1][1] === items[2][2] && (items[0][0] === 'X' || items[0][0] === 'O')) {
        if (items[0][0] === 'X') {
            winner(0);
        } else {
            winner(1);
        }
    }
    if (items[0][2] === items[1][1] && items[1][1] === items[2][0] && (items[1][1] === 'X' || items[1][1] === 'O')) {
        if (items[0][2] === 'X') {
            winner(0);
        } else {
            winner(1);
        }
    }
    //if draw
    let counterLetters = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (items[i][j] === 'X' || items[i][j] === 'O') counterLetters++;
        }
    }
    if (counterLetters == 9) {
        winner(-1);
    }
}

function winner(winner) {
    console.log('winner');
    isX = true;
    if (winner != -1) {
        let text = document.getElementById('score-' + winner).textContent.toString();
        let currentScore = text.charAt(text.indexOf(':') + 2);
        currentScore = parseInt(currentScore) + 1;
        document.getElementById('score-' + winner).textContent = 'Player ' + (winner+1) + ': ' + currentScore + ' Points';
    }
    for (var i = 0; i < 9; i++) {
        document.getElementById('item-' + i).textContent = String.fromCharCode(160);
    }
}

function itemClicked(item) {
    let itemContent = document.getElementById("item-" + item).textContent;
    if (itemContent.toString() === 'X' || itemContent.toString() === 'O') return;
    document.getElementById('item-' + item).textContent = isX ? 'X' : 'O';
    isX = !isX;
}