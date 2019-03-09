var canvas = new Canvas("game-canvas");
var spaceship = new Spaceship();
var width = canvas.width;
var height = canvas.height;

var shpSize = 1;
var frame = 1;

var keys = [];
window.onkeyup = function(e) { keys[e.keyCode] = false; }
window.onkeydown = function(e) { keys[e.keyCode] = true; }

var asteroids = [];
var entities = [];

function gameTick() {
    // Frame Counter
    if (frame <= GAME_FPS) {
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

    // Shooting
    if (keys[32]) {
        if (entities.length < 10 && frame % 15 == 0) {
            entities.push(spaceship.shoot());
        };
    }

    // Asteroid Spawning
    if (asteroids.length < 1 && frame % 30 == 0) {
        asteroids.push(new Asteroid(0, 0, 0, 2, shpSize, 6));
    }


    // Update Positions
    spaceship.updatePosition(width, height);

    if(entities.length > 0) {
        for (item in entities) {
            entities[item].updatePosition(width, height);
        }
    }

    if(asteroids.length > 0) {
        for (item in asteroids) {
            asteroids[item].updatePosition(width, height);
        }
    }

    //asteroid.rotate(5);

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
    canvas.drawAsteroids(asteroids);
    canvas.drawEntities(entities);
}

var GAME_FPS = 60;

var msBetweenFrames = 1000 / GAME_FPS;


startGame();