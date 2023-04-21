import Canvas from "./lib/canvas";
import Spaceship from "./models/spaceship";
import Asteroid from "./models/asteroid";
import Sound from "./models/sound";
import Difficulty from "./models/difficulty";

// Set up Game Objects
//// Game Timing
const GAME_FPS = 60;
let lastTick = performance.now();
let t = 0;
const dt = 0.01;
let accumulator = 0;
let timeLastPause = performance.now();
//// Input
let keys = [];

window.onkeyup = (e) => {
  keys[e.code] = false;
  pframe = true;
};

window.onkeydown = (e) => {
  keys[e.code] = true;
  e.preventDefault();
};
//// Game Variables
const SPAWNS = ["TOP", "RIGHT", "BOTTOM", "LEFT"];
let paused = true;
let newGame = true;
let pframe = true;
let message = "Choose your Difficulty.";
let difficulty = new Difficulty();
let frame;
let score = 0;
let lives;
//// High Score Tracking
if (!localStorage.getItem("high")) {
  localStorage.setItem("high", 0);
}

const rButton = document.getElementById("reset-high");
rButton.addEventListener("click", function (e) {
  localStorage.setItem("high", 0);
});

// Set up scene
const canvas = new Canvas("game-canvas");
const width = canvas.width;
const height = canvas.height;
//// Sounds
const pewSound = new Sound("assets/Laser_Shoot.wav", 0.1);
const boomSound = new Sound("assets/Explosion.wav", 0.25);
//// Entities
const spaceship = new Spaceship(width / 2, height / 2);
let asteroids = [];
let bullets = [];

// Run Game Function
const startGame = () => {
  queueTick();
};

// Reset Game Function
const reset = () => {
  frame = 1;
  lives = 2;
  paused = true;

  asteroids = [];
  bullets = [];

  spaceship.reset(width, height);
};

// Wait for next frame and call Game Loop
const queueTick = () => {
  window.requestAnimationFrame(gameTick);
};

// Game Loop
const gameTick = () => {
  // Check for Paused
  if (paused) {
    let now = performance.now();

    if (now - timeLastPause > 1000 && (keys["Enter"] || keys["KeyP"])) {
      pauseGame(paused);
    }

    if (!newGame) {
      drawMessage();
    }
  } else {
    // update timing
    updateTiming();

    // update game variables
    updateGame();

    // check input
    checkInput();

    // update physics
    while (accumulator >= dt) {
      updatePhysics();
      accumulator -= dt;
    }

    // render graphics
    renderGraphics();
  }

  // Check for New Game
  if (newGame) {
    drawMessage();

    chooseDiff();
  }

  // queue next gameTick
  queueTick();
};

const updateTiming = () => {
  let current = performance.now();
  let elapsed = current - lastTick;
  lastTick = current;
  accumulator += elapsed;
};

const updateGame = () => {
  // Update High Score
  if (localStorage.getItem("high") < score) {
    localStorage.setItem("high", score);
  }

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

  // New Life Check
  if (score % 50 == 0 && frame == 60) {
    lives++;
  }
};

const checkInput = () => {
  // Ship Rotation
  if (keys["KeyA"] || keys["ArrowLeft"]) {
    spaceship.rotate(-2);
  }
  if (keys["KeyD"] || keys["ArrowRight"]) {
    spaceship.rotate(2);
  }

  // Ship Acceleration / Deceleration
  if (keys["KeyW"] || keys["ArrowUp"]) {
    spaceship.accelerate(dt);
  }
  if (keys["KeyS"] || keys["ArrowDown"]) {
    spaceship.decelerate(dt);
  }

  // Pause
  if (keys["Enter"] || keys["KeyP"]) {
    let now = performance.now();

    if (now - timeLastPause > 2000) {
      pauseGame(paused);
    }
  }

  // Shooting
  if (keys["Space"]) {
    let now = performance.now();

    if (now - spaceship.timeLastShoot > 250) {
      bullets.push(spaceship.shoot(frame));
      spaceship.timeLastShoot = now;
      pewSound.play();
    }
  }
};

const updatePhysics = () => {
  // Update Scene
  // Asteroid Spawning
  if (asteroids.length < Math.log(score) && frame % 30 == 0) {
    spawnAsteroid();
  }

  // Update Positions
  spaceship.updatePosition(width, height, dt);

  if (bullets.length > 0) {
    bullets.forEach((bullet) => {
      bullet.updatePosition(width, height, dt);
    });
  }

  if (asteroids.length > 0) {
    asteroids.forEach((asteroid) => {
      asteroid.updatePosition(width, height, dt);
    });
  }

  // Check for Collisions
  // Aseteroids and Ship
  for (let i = 0; i < asteroids.length; i++) {
    if (spaceship.checkCollision(asteroids[i])) {
      boomSound.play();

      if (lives > 0) {
        newLife();
      } else {
        message = "Game Over. Choose your Difficulty for new game.";
        newGame = true;
        reset();
      }
    }
  }

  // Asteroids and Bullets
  for (let i = 0; i < bullets.length; i++) {
    for (let j = 0; j < asteroids.length; j++) {
      if (bullets[i].checkCollision(asteroids[j])) {
        bullets.splice(i, 1);
        const newAsteroid = asteroids[j].split();

        if (newAsteroid == 0) {
          asteroids.splice(j, 1);
          score += difficulty.getDiff();

          // New Life Check
          if (score % 150 <= difficulty.getDiff() - 1) {
            lives++;
          }
        } else {
          asteroids.push(newAsteroid[0]);
          asteroids.push(newAsteroid[1]);
          asteroids.splice(j, 1);
        }

        boomSound.play();

        break;
      }
    }
  }
};

const newLife = () => {
  spaceship.reset(width, height);
  lives--;
  asteroids = [];
  bullets = [];
};

const pauseGame = (bool) => {
  if (bool) {
    paused = !paused;
    message = "Paused";
    pframe = false;
  } else {
    paused = !paused;
    pframe = false;
  }
};

const spawnAsteroid = () => {
  const sIndex = Math.floor(Math.random() * 4);
  const aSize = Math.floor(Math.random() * 3 + 1);
  let spawnx = 0;
  let spawny = 0;
  let spawndx = 0;
  let spawndy = 0;
  let newAsteroid;

  switch (SPAWNS[sIndex]) {
    case "TOP":
      spawnx = Math.random() * width;
      spawndx = Math.random() * 0.2;
      spawndy = Math.random() * 0.2;

      spawndx *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

      newAsteroid = new Asteroid(spawnx, 0, spawndx, spawndy, aSize, 6);

      break;
    case "RIGHT":
      spawny = Math.random() * height;
      spawndx = Math.random() * -0.2;
      spawndy = Math.random() * 0.2;

      spawndy *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

      newAsteroid = new Asteroid(width, spawny, spawndx, spawndy, aSize, 6);

      break;
    case "BOTTOM":
      spawnx = Math.random() * width;
      spawndx = Math.random() * 0.2;
      spawndy = Math.random() * -0.2;

      spawndx *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

      newAsteroid = new Asteroid(spawnx, height, spawndx, spawndy, aSize, 6);

      break;
    case "LEFT":
      spawny = Math.random() * height;
      spawndx = Math.random() * 0.2;
      spawndy = Math.random() * 0.2;

      spawndy *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

      newAsteroid = new Asteroid(0, spawny, spawndx, spawndy, aSize, 6);

      break;
  }

  asteroids.push(newAsteroid);
};

// Draw Scene
const renderGraphics = () => {
  canvas.setBackground("#000000");

  // Draw the spaceship
  canvas.drawSpaceship(spaceship);

  // Draw the asteroids
  asteroids.forEach((asteroid) => {
    canvas.drawAsteroids(asteroid, asteroid.getBounds());
  });

  // Draw the bullets
  bullets.forEach((bullet, index) => {
    if (!bullet.checkDistance(frame)) {
      canvas.drawBullets(bullet);
    } else {
      bullets.splice(index, 1);
    }
  });

  // Draw the score
  canvas.drawScore(score);

  // Draw the High Score
  canvas.drawHigh(localStorage.getItem("high"));

  // Draw the lives
  canvas.drawLives(lives, spaceship);
};

const chooseDiff = () => {
  if ((pframe && keys["KeyD"]) || (pframe && keys["ArrowRight"])) {
    difficulty.increaseDiff();
    pframe = false;
  }

  if ((pframe && keys["KeyA"]) || (pframe && keys["ArrowLeft"])) {
    difficulty.decreaseDiff();
    pframe = false;
  }

  if (keys["Enter"] || keys["Space"]) {
    newGame = !newGame;
    score = 0;
    reset();
    pauseGame(false);
  }

  canvas.drawDiff(difficulty.getDiff());
};

// Draw Message
const drawMessage = () => {
  canvas.setBackground("#000000");
  canvas.drawScore(score);
  canvas.drawHigh(localStorage.getItem("high"));
  canvas.drawLives(lives, spaceship);

  canvas.drawPaused(message);
};

reset();
startGame();
