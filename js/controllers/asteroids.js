var canvas = new Canvas("game-canvas");
var spaceship = new Spaceship();

var shpSize = 1;
var frame = 1;
//var astLoc = genOutsideWin(shpSize);

var asteroid = new Asteroid(0, 100, 0, -1, shpSize);

var keys = [];
window.onkeyup = function(e) { keys[e.keyCode] = false; }
window.onkeydown = function(e) { keys[e.keyCode] = true; }

var asteroids = [];
var entities = [];

function gameTick() {
    if (frame < 61) {
        frame += 1;
    } else {
        frame = 1;
    }
    // HANDLE ROTATION
    if(keys[37]) {
        spaceship.rotate(-5);
    }

    if(keys[39]) {
        spaceship.rotate(5);
    }

    // Acceleration / Deceleration
    if(keys[38]) {
        spaceship.accelerate();
    }

    if(keys[40]) {
        spaceship.decelerate();
    }

    if (keys[32]) {
        if(entities.length < 7 && frame == 30) {
            entities.push(spaceship.shoot());
        };
    }

    // Begin Asteroid Spawn Logic //
    if (entities.includes(0)) {
        entity = entities.indexOf(0)
        shpSize = 1;
        entities[entity] = new Asteroid(0, 100, 0, -1, shpSize);
    }

    //asteroid.rotate(5);

    spaceship.updatePosition();

    asteroid.updatePosition();

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
    canvas.drawAsteroid(asteroid.points, asteroid.x, asteroid.y, asteroid.orientation);
    canvas.drawEntities(entities);
    //canvas.drawAsteroid(500, 100, 0, 0, 2);
}

var GAME_FPS = 60;

var msBetweenFrames = 1000 / GAME_FPS;


startGame();