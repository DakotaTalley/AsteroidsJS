var canvas = new Canvas("game-canvas");
var spaceship = new Spaceship();

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
    if (asteroids.length < 5 && frame % 30 == 0) {
        asteroids.push(new Asteroid(0, 100, 0, -1, shpSize));
    }


    // Update Positions
    spaceship.updatePosition();

    if (spaceship.x < -400 || spaceship.x > 400) {
        spaceship.setX(-spaceship.x);
    }

    if (spaceship.y < -300 || spaceship.y > 300) {
        spaceship.setY(-spaceship.y);
    }

    if(entities.length > 0) {
        for (item in entities) {
            entities[item].updatePosition();
        }
    }

    if(asteroids.length > 0) {
        for (item in asteroids) {
            asteroids[item].updatePosition();
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
    canvas.drawAsteroid(asteroids);
    canvas.drawEntities(entities);
}

var GAME_FPS = 60;

var msBetweenFrames = 1000 / GAME_FPS;


startGame();