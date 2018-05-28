var canvas = new Canvas("game-canvas");
var spaceship = new Spaceship();

var shpSize = randomNumber(1, 3);
var astLoc = genOutsideWin(shpSize);

var asteroid = new Asteroid(astLoc[0], astLoc[1], 0, 0, shpSize);

var keys = [];
window.onkeyup = function(e) { keys[e.keyCode] = false; }
window.onkeydown = function(e) { keys[e.keyCode] = true; }

var entities = [];

function gameTick() {
    
    // HANDLE ROTATION
    if(keys[37]) {
        spaceship.rotateLeft();
    }

    if(keys[39]) {
        spaceship.rotateRight();
    }

    // Acceleration / Deceleration
    if(keys[38]) {
        spaceship.accelerate();
    }

    if(keys[40]) {
        spaceship.decelerate();
    }

    if (keys[32]) {
        spaceship.shoot();
    }

    spaceship.updatePosition();

    redrawCanvas();

    setTimeout(gameTick, msBetweenFrames);
}

function startGame() {
    queueTick();
}

function queueTick() {
    setTimeout(gameTick, msBetweenFrames);
}

function redrawCanvas() {
    canvas.setBackground("#000000");
    canvas.drawSpaceship("#FFFFFF", spaceship.x, spaceship.y, spaceship.orientation);
    canvas.drawAsteroid(asteroid.points, asteroid.x, asteroid.y);
    //canvas.drawAsteroid(500, 100, 0, 0, 2);
}

// Return array of x and y outside of the window for spawning
function genOutsideWin(shpSize){
    var arr = [];
    var canvasX = canvas.width;
    var canvasY = canvas.height;
    // Left or Right from 0
    arr[0] = Math.round(Math.random()) * 2 - 1;
    // Up or Down from 0
    arr[1] = Math.round(Math.random()) * 2 - 1;
    // If both are negative, set one lower than screen size
    if(arr[0] < 1 && arr[1] < 1){
        Math.random() > 0.5 ? arr[0] = canvasX - shpSize : arr[1] = canvasY - shpSize;
        return arr;      
    }
    //if both are positive, randomize, then pick one and make it larger than screen size
    if(arr[0] > 1 && arr[0] > 1){
        arr[0] = Math.random() * canvasX;
        arr[1] = Math.random() * canvasY;
        Math.random() > 0.5 ? arr[0] = canvasX + shpSize : arr[1] = canvasY + shpSize;
        return arr;
    }

    arr[0] = Math.random() * canvasX;
    arr[1] = Math.random() * canvasY;
    arr[0] < 1 ? arr[0] = canvasX - shpSize : arr[1] = canvasY - shpSize;
    return arr;
}

var GAME_FPS = 60;

var msBetweenFrames = 1000 / GAME_FPS;


startGame();