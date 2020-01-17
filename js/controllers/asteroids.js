// Set up scene
var canvas = new Canvas("game-canvas");
var width = canvas.width;
var height = canvas.height;

// Set up entities
var spaceship = new Spaceship(width/2, height/2);

// Set up sounds
var sPew = new Sound("assets/Laser_Shoot.wav");
var sBoom = new Sound("assets/Explosion.wav");

// Set up input
var keys = [];
window.onkeyup = function(e) { keys[e.code] = false; pframe = true;}
window.onkeydown = function(e) { keys[e.code] = true; }

// Set up game variables
const SPAWNS = ["TOP", "RIGHT", "BOTTOM", "LEFT"];
var paused = true;
var pframe = true;
var message = "Press Enter to start";
var difficulty;
var frame;
var score;
var lives;

var GAME_FPS = 60;
var msBetweenFrames = 1000 / GAME_FPS;

// Start Game
newGame();
startGame();

// Game Loop
function gameTick() {
    console.log(pframe);
    if (!paused) {
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
        if(keys["KeyA"] || keys["ArrowLeft"]) {
            spaceship.rotate(-5);
        }
        if(keys["KeyD"] || keys["ArrowRight"]) {
            spaceship.rotate(5);
        }

        // Acceleration / Deceleration
        if(keys["KeyW"] || keys["ArrowUp"]) {
            spaceship.accelerate();
        }
        if(keys["KeyS"] || keys["ArrowDown"]) {
            spaceship.decelerate();
        }

        // Pause
        if(pframe && (keys["Enter"] || keys["KeyP"])) {
            pauseGame(true);
        }

        // Shooting
        if (keys["Space"]) {
            if (frame % 15 == 0) {
                bullets.push(spaceship.shoot(frame));
                sPew.play();
            };
        }

        // Update Scene
        // Asteroid Spawning
        if (asteroids.length < 3 * difficulty && frame % 30 == 0) {
            spawnAsteroid();
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
        for (let i = 0; i < asteroids.length; i++) {
            if (spaceship.checkCollision(asteroids[i])) {
                sBoom.play();
                if (lives > 0) {
                    newLife();
                } else {
                    message = "Game Over. Press Enter for new game.";
                    newGame();
                }
                console.log("DEATH!!");
            }
        }

        // Asteroids and Bullets
        for (let i = 0; i < bullets.length; i++) {
            for (let j = 0; j < asteroids.length; j++) {
                if (bullets[i].checkCollision(asteroids[j])) {
                    bullets.splice(i, 1);
                    newA = asteroids[j].split()
                    if (newA == 0) {
                        asteroids.splice(j, 1);
                    } else {
                        asteroids.push(newA[0]);
                        asteroids.push(newA[1]);
                        asteroids.splice(j, 1);
                    }
                    score += 5 * difficulty;
                    sBoom.play();
                    break;
                }
            }
        }

        // Draw Scene
        redrawCanvas();

        // Wait for next frame
        queueTick();

    } else {
        if (pframe && (keys["Enter"] || keys["KeyP"])) {
            pauseGame(false);
        }

        drawMessage();

        // Wait for next frame
        queueTick();
    }
}

// Run Game
function startGame() {
    queueTick();
}
// Wait for next frame
function queueTick() {
    //setTimeout(gameTick, msBetweenFrames);
    requestAnimationFrame(gameTick);
}

function newGame() {
    frame = 1;
    score = 0;
    lives = 3;
    difficulty = 2;
    paused = true;

    asteroids = [];
    bullets = [];

    spaceship.reset(width, height);
}

function newLife() {
    spaceship.reset(width, height);
    lives--;
    asteroids = [];
    bullets = [];
}

function pauseGame(bool) {
    if (bool) {
        paused = !paused;
        pframe = false;
    } else {
        paused = !paused;
        message = "Paused";
        pframe = false;
    }
}

function spawnAsteroid() {
    var sIndex = Math.floor(Math.random() * 4);
    var aSize = Math.floor(Math.random() * 3 + 1);
    switch (SPAWNS[sIndex]) {
        case "TOP":
            var spawnx = Math.random() * width;
            var spawndx = Math.random() * 3;
            var spawndy = Math.random() * 3;
            spawndx *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
            var newAsteroid = new Asteroid(spawnx, 0, spawndx, spawndy, aSize, 6);
            break;
        case "RIGHT":
            var spawny = Math.random() * height;
            var spawndx = Math.random() * -3;
            var spawndy = Math.random() * 3;
            spawndy *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
            var newAsteroid = new Asteroid(width, spawny, spawndx, spawndy, aSize, 6);
            break;
        case "BOTTOM":
            var spawnx = Math.random() * width;
            var spawndx = Math.random() * 3;
            var spawndy = Math.random() * -3;
            spawndx *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
            var newAsteroid = new Asteroid(spawnx, height, spawndx, spawndy, aSize, 6);
            break;
        case "LEFT":
            var spawny = Math.random() * height;
            var spawndx = Math.random() * 3;
            var spawndy = Math.random() * 3;
            spawndy *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
            var newAsteroid = new Asteroid(0, spawny, spawndx, spawndy, aSize, 6);
            break;
    }
    asteroids.push(newAsteroid);
    console.log("New Asteroid", asteroids);
}

function randASize() {
    
}

// Draw Scene
function redrawCanvas() {
    canvas.setBackground("#000000");

    // Draw the spaceship
    canvas.drawSpaceship(spaceship);

    // Draw the asteroids
    for (let i = 0; i < asteroids.length; i++) {
        canvas.drawAsteroids(asteroids[i], asteroids[i].getBounds());
    }

    // Draw the bullets
    for (let i = 0; i < bullets.length; i++) {
        if (!bullets[i].checkDistance(frame)) {
            canvas.drawBullets(bullets[i]);
        } else {
            bullets.splice(i, 1);
        }
    }

    // Draw the score
    canvas.drawScore(score);

    // Draw the lives
    canvas.drawLives(lives, spaceship);
}

// Draw Message
function drawMessage() {
    canvas.setBackground("#000000");
    canvas.drawScore(score);
    canvas.drawLives(lives, spaceship);

    canvas.drawPaused(message);
}