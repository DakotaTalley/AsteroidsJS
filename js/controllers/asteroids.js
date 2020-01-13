// Set up scene
var canvas = new Canvas("game-canvas");
var width = canvas.width;
var height = canvas.height;

// Set up entities
var spaceship = new Spaceship(width/2, height/2);
var asteroids = [];
var bullets = [];

// Set up sounds
var sPew = new Sound("assets/Laser_Shoot.wav");
var sBoom = new Sound("assets/Explosion.wav");

// Set up input
var keys = [];
window.onkeyup = function(e) { keys[e.keyCode] = false; }
window.onkeydown = function(e) { keys[e.keyCode] = true; }

// Set up game variables
var frame = 1;
var score = 0;
var GAME_FPS = 60;
var msBetweenFrames = 1000 / GAME_FPS;

// Start Game
startGame();

// Game Loop
function gameTick() {
    // Frame Counter
    if (frame <= GAME_FPS) {
        frame += 1;
    } else {
        frame = 1;
    }
    
    // Per second score
    if (frame == 60) {
        score++;
    }

    // Check for input
    // Rotation
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
            sPew.play();
        };
    }

    // Update Scene
    // Asteroid Spawning
    if (asteroids.length < 1 && frame % 30 == 0) {
        //asteroids.push(new Asteroid(width/2+50, height/2+50, 0, 2, 1, 6));
        var spawnx = Math.random() * width;
        var spawny = Math.random() * height;
        var spawndx = Math.random() * 3;
        var spawndy = Math.random() * 3;
        var spawndx = Math.random() * 3; // 2 or 3
        spawndx *= Math.floor(Math.random()*2) == 1 ? 1 : -1; // negative 50% of the time
        var spawndy = Math.random() * 3; //2 or 3
        spawndy *= Math.floor(Math.random()*2) == 1 ? 1 : -1; // negative 50% of the time
        var newAsteroid = new Asteroid(spawnx, spawny, spawndx, spawndy, 1, 6);
        asteroids.push(newAsteroid);
        console.log("New Asteroid", asteroids);
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
    for (item in asteroids) {
        if (spaceship.checkCollision(asteroids[item])) {
            sBoom.play();
            newGame();
            console.log("DEATH!!");
        }
    }

    // Asteroids and Bullets
    for (i in bullets) {
        for (j in asteroids) {
            if (bullets[i].checkCollision(asteroids[j])) {
                bullets.splice(i, 1);
                asteroids.splice(j, 1);
                score += 5;
                sBoom.play();
                break;
            }
        }
    }

    // Draw Scene
    redrawCanvas();

    // Wait for next frame
    queueTick();
}

// Run Game
function startGame() {
    queueTick();
}
// Wait for next frame
function queueTick() {
    setTimeout(gameTick, msBetweenFrames);
}

// Draw Scene
function redrawCanvas() {
    canvas.setBackground("#000000");

    // Draw the spaceship
    canvas.drawSpaceship(spaceship);

    // Draw the asteroids
    for (i = 0; i < asteroids.length; i ++) {
        canvas.drawAsteroids(asteroids[i], asteroids[i].getBounds());
    }

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

function newGame() {
    spaceship.reset(width, height);
    score = 0;
    frame = 1;
}