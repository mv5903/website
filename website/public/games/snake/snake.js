var elements = [[]];
var buttonClicked = false;
var length = 5;
var direction;
var previousDirection;
var catColor = 'green';
var xVelocity, yVelocity;
var headOfCat = [];
var apple = [];
var timeoutTime = 300;
var interval;

function init() {
    let str = '';
    let directions = ['up', 'down', 'left', 'right'];
    direction = directions[Math.floor(Math.random() * directions.length)];
    document.getElementById('board').style.gridTemplateColumns = str;
    let tr = '<tr class="chessboard">';
    let td = '<td class="chessboard"';
    let trEnd = '</tr>';
    let tdEnd = '</td>';
    let counter = 0;
    for (let i = 0; i < 20; i++) {
        elements.push(new Array());
        let item = tr;
        for (let j = 0; j < 30; j++) {
            item+=td+ ' id="box-' + counter + '">' + tdEnd;
            elements[i].push(counter);
            counter++;
        }
        item+=trEnd;
        $("table").append(item);
    }
    xVelocity = 0;
    yVelocity = 1;
    placeApple();
    spawnCatepillar();
}

function restart() {
    window.location.reload();
    document.getElementById('start').textContent = 'Restart';
    document.getElementById('guide').textContent = 'Control the snake with arrow keys or WASD. Restart game with Shift.';
    resetColors(false);
    placeApple();
    interval = setInterval(gameIteration, timeoutTime);
}

function getID(i, j) {
    return 'box-' + elements[i][j];
}

function placeApple() {
    apple = [];
    apple.push(Math.floor(Math.random() * 20));
    apple.push(Math.floor(Math.random() * 30));
    document.getElementById(getID(apple[0], apple[1])).style.background = 'rgb(128, 0, 0)';
}

function spawnCatepillar() {
    headOfCat = [10, 15];
    console.log(getID(headOfCat[0], headOfCat[1]));
    document.getElementById(getID(headOfCat[0], headOfCat[1])).style.background = catColor;
    gameIteration();
    interval = setInterval(gameIteration, timeoutTime);
}

function resetColors(includeRed) {
    let isGrey = true;
    let tempCounter = 0;
    let counter = 0;
    for (let i = 0; i < elements.length; i++) {
        tempCounter = isGrey ? 0 : 1;
        for (let j = 0; j < elements[i].length; j++) {
            if (includeRed && document.getElementById(getID(i, j)).style.background === "rgb(128, 0, 0)") {
            } else if (tempCounter % 2 == 0) {
                document.getElementById(getID(i, j)).style.background = "#999";
            } else {
                document.getElementById(getID(i, j)).style.background = "white";
            }
            tempCounter++;
            counter++;
        }
        isGrey = !isGrey;
    }
}

function gameIteration() {

    headOfCat[0]+=xVelocity;
    headOfCat[1]+=yVelocity;

    //collisions go here
    if (headOfCat[0] <= -1 || headOfCat[1] <= -1 || headOfCat[0] == 20 || headOfCat[1] == 30) {
        endGame();
        return;
    }

    if (headOfCat[0] == apple[0] && headOfCat[1] == apple[1]) {
        incrementScore();
        placeApple();
    }

    console.log(headOfCat);
    console.log('Timeout: ' + timeoutTime);
    resetColors(true);
    document.getElementById(getID(headOfCat[0], headOfCat[1])).style.background = catColor;
}

function incrementScore() {
    let scoreText = document.getElementById('score').textContent;
    let integerScore = parseInt(scoreText.substring(scoreText.indexOf(' ') + 1));
    integerScore++;
    if (integerScore % 5 == 0) {
        timeoutTime = (Math.floor(.9 * timeoutTime));
        clearInterval(interval);
        interval = setInterval(gameIteration, timeoutTime);
    }
    document.getElementById('score').textContent = 'Score: ' + integerScore;
}

function endGame() {
    document.getElementById('guide').textContent = 'Game Over!';
    document.getElementById('start').textContent = 'Restart';
    return;
}

document.addEventListener('keydown', function (event) {
    console.log(event.key);
    if (event.shiftKey) {
        restart();
        return;
    } else if (event.keyCode == 87 || event.keyCode == 38) { //up
        xVelocity = -1;
        yVelocity = 0;
    } else if (event.keyCode == 65 || event.keyCode == 37) { //left
        xVelocity = 0;
        yVelocity = -1;
    } else if (event.keyCode == 83 || event.keyCode == 40) { //down
        xVelocity = 1;
        yVelocity = -0;
    } else if (event.keyCode == 68 || event.keyCode == 39) { //right
        xVelocity = 0;
        yVelocity = 1;
    }
});
