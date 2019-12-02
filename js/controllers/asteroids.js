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

    // Check for Collisions
    // Asteroids and Bullets
    if (asteroids.length > 0) {
        for (i = 0; i < asteroids.length; i++) {
            for (j = 0; j < entities.length; j++) {
                var isCollide = checkCollision(asteroids[i], entities[j]);
                console.log(isCollide);
                if (isCollide) {
                    asteroids.splice(i, 1);
                    entities.splice(j, 1);
                }
            }
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

function checkCollision(obj1, obj2) {
    var shp1 = {x: obj1.x, y: obj1.y};
    var shp2 = {x: obj2.x, y: obj2.y};

    if (obj1 instanceof(Asteroid)) {
        shp1.w, shp1.h = obj1.r * 2;
    } else {
        shp1.h = obj1.h;
        shp1.w = obj1.w;
    }

    if (obj2 instanceof(Asteroid)) {
        shp1.w, shp1.h = obj1.r * 2;
    } else {
        shp2.h = obj2.h;
        shp2.w = obj2.w;
    }

    return ((((shp1.y + shp1.h / 2) < (shp2.y)) ||
    (shp1.y > (shp2.y + shp2.h / 2))) &&
    (((shp1.x + shp1.w / 2) < shp2.x) ||
    (shp1.x > shp2.x + shp2.w / 2)))
    
}

var GAME_FPS = 60;

var msBetweenFrames = 1000 / GAME_FPS;


startGame();