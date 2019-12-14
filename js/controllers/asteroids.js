var canvas = new Canvas("game-canvas");
var width = canvas.width;
var height = canvas.height;

var spaceship = new Spaceship(width/2, height/2);

var frame = 1;

var keys = [];
window.onkeyup = function(e) { keys[e.keyCode] = false; }
window.onkeydown = function(e) { keys[e.keyCode] = true; }

var asteroids = [];
var bullets = [];

var score = 0;

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
        if (frame % 15 == 0) {
            bullets.push(spaceship.shoot(frame));
        };
    }

    // Asteroid Spawning
    if (asteroids.length < 1 && frame % 30 == 0) {
        asteroids.push(new Asteroid(width/2+50, height/2+50, 0, 2, 1, 6));
    }


    // Update Positions
    spaceship.updatePosition(width, height);

    if(bullets.length > 0) {
        for (item in bullets) {
            bullets[item].updatePosition(width, height);
        }
    }

    if(asteroids.length > 0) {
        for (item in asteroids) {
            asteroids[item].updatePosition(width, height);
        }
    }

    // Check for Collisions
    // Aseteroids and Ship
/*     if (asteroids.length > 0) {
        for (i = 0; i < asteroids.length; i++) {
            
        }
    } */

    // Asteroids and Bullets
/*     if (asteroids.length > 0) {
        for (i = 0; i < asteroids.length; i++) {
            for (j = 0; j < entities.length; j++) {
                var isCollide = checkCollision(asteroids[i], entities[j]);
                console.log(isCollide);
                if (isCollide) {
                    asteroids.splice(i, 1);
                    entities.splice(j, 1);
                    score++;
                }
            }
        }
    } */

    // Per second updates
    if (frame == 60) {
        score++;
    }

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

    // Draw the spaceship
    canvas.drawSpaceship(spaceship);

    // Draw the asteroids
    for (i = 0; i < asteroids.length; i ++) {
        canvas.drawAsteroids(asteroids[i], asteroids[i].getBounds());
    }
    //canvas.drawAsteroids(asteroids);

    // Draw the bullets
    for (i = 0; i < bullets.length; i++) {
        if (!bullets[i].checkDistance(frame)) {
            canvas.drawBullets(bullets[i]);
        } else {
            bullets.splice(i, 1);
        }
    }

    // Draw the score
    canvas.drawScore(score);
}

var GAME_FPS = 60;

var msBetweenFrames = 1000 / GAME_FPS;


startGame();