import Canvas from "./lib/canvas";
import Spaceship from "./models/spaceship";
import Asteroid from "./models/asteroid";
import Sound from "./lib/sound";
import Difficulty from "./models/difficulty";

// Set up Game Objects
//// Game Timing
let lastTick = performance.now();
// Physics step, in ms (accumulator is fed ms deltas from performance.now()).
const dt = 10;
// Spiral-of-death guard: cap how much elapsed time one frame can queue.
const MAX_FRAME_MS = 100;
let accumulator = 0;
// Real-time accounting for score-per-second and asteroid spawn gating, so
// both stay tied to elapsed time rather than requestAnimationFrame ticks
// (which vary with display refresh rate).
let scoreAccumulator = 0;
let spawnAccumulator = 0;
const SCORE_INTERVAL_MS = 1000;
const SPAWN_CHECK_INTERVAL_MS = 500;
// Steering/thrust rates, applied once per fixed physics step (see
// updatePhysics) so they scale with real time instead of refresh rate.
const ROTATION_DEG_PER_SEC = 120;
const ACCEL_PER_SEC = 0.6;
// One extra life is awarded each time total score crosses a multiple of
// this value, regardless of which scoring path crossed it.
const LIFE_SCORE_INTERVAL = 100;
//// Input
let keys = {};
// Latches a keydown edge for one gameTick, so a keydown+keyup pair that
// completes faster than the animation frame still registers as a press.
let pressed = {};

// Keys whose browser default (scrolling) would disrupt the game; everything
// else (Tab, F5, ...) keeps its native behavior.
const GAME_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"];

// Keyup is not gated on the dialog: a key released while the dialog is open
// must still clear its held state, or it would stick until re-pressed.
window.addEventListener("keyup", (e) => {
  keys[e.code] = false;
  pframe = true;
});

window.addEventListener("keydown", (e) => {
  // While the reset-high-score dialog is open, keys belong to the dialog —
  // its buttons need their native Enter/Space activation un-prevented.
  if (resetHighDialog.open) return;
  // preventDefault must run for auto-repeat events too, or held arrows/Space
  // scroll the page mid-game.
  if (GAME_KEYS.includes(e.code)) e.preventDefault();
  // Ignore OS key auto-repeat so held keys don't re-latch `pressed` every
  // frame (this was the source of the pause-toggle flicker on held Enter/P).
  if (e.repeat) return;
  keys[e.code] = true;
  pressed[e.code] = true;
});

// Focus loss swallows keyup events; treat every held key as released so the
// ship doesn't keep rotating/thrusting/shooting after an Alt-Tab. Also pause
// an active game outright — playing on with input silently discarded is
// more confusing than the game visibly stopping until refocus.
window.addEventListener("blur", () => {
  keys = {};
  if (!paused) {
    pauseGame();
  }
});
//// Game Variables
const SPAWNS = ["TOP", "RIGHT", "BOTTOM", "LEFT"];
// Floor on a spawned asteroid's into-screen speed component (px/ms).
const MIN_SPAWN_SPEED = 0.05;
let paused = true;
let newGame = true;
let pframe = true;
let message = "Choose your Difficulty.";
let difficulty = new Difficulty();
let score = 0;
let lives;
//// High Score Tracking
if (!localStorage.getItem("high")) {
  localStorage.setItem("high", 0);
}
let highScore = Number(localStorage.getItem("high"));

const rButton = document.getElementById("reset-high");
const resetHighDialog = document.getElementById("reset-high-dialog");
const resetHighConfirm = document.getElementById("reset-high-confirm");
const resetHighCancel = document.getElementById("reset-high-cancel");

rButton.addEventListener("click", () => {
  resetHighDialog.showModal();
});

resetHighConfirm.addEventListener("click", () => {
  highScore = 0;
  localStorage.setItem("high", 0);
  resetHighDialog.close();
});

resetHighCancel.addEventListener("click", () => {
  resetHighDialog.close();
});

// Closing the dialog restores focus to the opener button; drop it so the
// player's next Enter press pauses the game instead of natively
// re-activating the button and reopening the dialog. Fires for the Yes,
// Cancel, and Escape close paths alike.
resetHighDialog.addEventListener("close", () => {
  rButton.blur();
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
  // While the reset-high-score dialog has focus, freeze the game entirely.
  // This is more than just skipping input: the keydown that *activates* the
  // dialog's opener button (e.g. pressing Enter on a focused "Reset High
  // Score" button) fires and latches `pressed["Enter"]` *before* the dialog
  // is open, so the keydown listener's `resetHighDialog.open` check can't
  // catch it — the stray press would otherwise reach the pause toggle below
  // on this very next tick. Checking here, fresh at the top of every tick,
  // catches that case regardless of timing.
  if (resetHighDialog.open) {
    pressed = {};
    queueTick();
    return;
  }

  // Check for Paused
  if (paused) {
    // On the difficulty/game-over screens (`newGame`), input belongs to
    // chooseDiff alone — unpausing here would run a hidden simulation
    // behind the menu.
    if (!newGame) {
      if (pressed["Enter"] || pressed["KeyP"]) {
        pauseGame();
      }

      drawMessage();
    }
  } else {
    const now = performance.now();

    // update timing
    updateTiming(now);

    // update game variables
    updateGame();

    // check input
    checkInput(now);

    // Asteroid Spawning — decided against real elapsed time, not once per
    // physics sub-step or rAF tick (both vary with refresh rate/hangs).
    checkAsteroidSpawn();

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

  // Clear this frame's latched keydown presses
  pressed = {};

  // queue next gameTick
  queueTick();
};

const updateTiming = (current) => {
  let elapsed = Math.min(current - lastTick, MAX_FRAME_MS);
  lastTick = current;
  accumulator += elapsed;
  scoreAccumulator += elapsed;
  spawnAccumulator += elapsed;
};

// Awards an extra life each time total score crosses a multiple of
// LIFE_SCORE_INTERVAL, regardless of which scoring path (time tick or
// asteroid kill) crossed it. Call this instead of assigning `score`
// directly so the two paths can't disagree or double-award.
const addScore = (amount) => {
  const before = Math.floor(score / LIFE_SCORE_INTERVAL);
  score += amount;
  const after = Math.floor(score / LIFE_SCORE_INTERVAL);
  if (after > before) {
    lives += after - before;
  }
};

const updateGame = () => {
  // Update High Score
  if (highScore < score) {
    highScore = score;
    localStorage.setItem("high", score);
  }

  // Per-second score, accounted in real elapsed time rather than rAF ticks.
  while (scoreAccumulator >= SCORE_INTERVAL_MS) {
    scoreAccumulator -= SCORE_INTERVAL_MS;
    addScore(1);
  }
};

const checkInput = (now) => {
  // Pause
  if (pressed["Enter"] || pressed["KeyP"]) {
    pauseGame();
  }

  // Shooting
  if (keys["Space"]) {
    if (now - spaceship.timeLastShoot > 250) {
      bullets.push(spaceship.shoot());
      spaceship.timeLastShoot = now;
      pewSound.play();
    }
  }
};

const checkAsteroidSpawn = () => {
  while (spawnAccumulator >= SPAWN_CHECK_INTERVAL_MS) {
    spawnAccumulator -= SPAWN_CHECK_INTERVAL_MS;

    if (asteroids.length < Math.log(score + 1)) {
      spawnAsteroid();
    }
  }
};

const updatePhysics = () => {
  // Steering / thrust — driven by held keys, applied once per fixed physics
  // step so turn rate and acceleration are tied to real time rather than
  // the display's refresh rate.
  if (keys["KeyA"] || keys["ArrowLeft"]) {
    spaceship.rotate(-ROTATION_DEG_PER_SEC * (dt / 1000));
  }
  if (keys["KeyD"] || keys["ArrowRight"]) {
    spaceship.rotate(ROTATION_DEG_PER_SEC * (dt / 1000));
  }
  if (keys["KeyW"] || keys["ArrowUp"]) {
    spaceship.accelerate(ACCEL_PER_SEC * (dt / 1000));
  }
  if (keys["KeyS"] || keys["ArrowDown"]) {
    spaceship.decelerate(ACCEL_PER_SEC * (dt / 1000));
  }

  // Update Positions
  spaceship.updatePosition(width, height, dt);

  // Bullets don't wrap — remove them as soon as they leave the playfield.
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    bullet.updatePosition(width, height, dt);

    if (bullet.isOffScreen(width, height)) {
      bullets.splice(i, 1);
    }
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
  for (let i = bullets.length - 1; i >= 0; i--) {
    for (let j = 0; j < asteroids.length; j++) {
      if (bullets[i].checkCollision(asteroids[j])) {
        bullets.splice(i, 1);
        const newAsteroid = asteroids[j].split();

        if (newAsteroid == 0) {
          asteroids.splice(j, 1);
          addScore(difficulty.getDiff());
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

const pauseGame = () => {
  paused = !paused;
  if (paused) {
    message = "Paused";
  } else {
    // Resuming: discard time that passed while paused so the world doesn't
    // fast-forward through it on the next physics drain (and so score/spawn
    // gating don't fire a burst of ticks to "catch up").
    lastTick = performance.now();
    accumulator = 0;
    scoreAccumulator = 0;
    spawnAccumulator = 0;
  }
  pframe = false;
};

const spawnAsteroid = () => {
  const sIndex = Math.floor(Math.random() * 4);
  const aSize = Math.floor(Math.random() * 3 + 1);
  let spawnx;
  let spawny;
  let spawndx;
  let spawndy;
  let newAsteroid;

  // Into-screen speed is floored so an asteroid can't spawn nearly
  // stationary and hug its spawn edge indefinitely; the tangential
  // component may still be ~0.
  switch (SPAWNS[sIndex]) {
    case "TOP":
      spawnx = Math.random() * width;
      spawndx = Math.random() * 0.2;
      spawndy = MIN_SPAWN_SPEED + Math.random() * (0.2 - MIN_SPAWN_SPEED);

      spawndx *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

      newAsteroid = new Asteroid(spawnx, 0, spawndx, spawndy, aSize, 6);

      break;
    case "RIGHT":
      spawny = Math.random() * height;
      spawndx = -(MIN_SPAWN_SPEED + Math.random() * (0.2 - MIN_SPAWN_SPEED));
      spawndy = Math.random() * 0.2;

      spawndy *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

      newAsteroid = new Asteroid(width, spawny, spawndx, spawndy, aSize, 6);

      break;
    case "BOTTOM":
      spawnx = Math.random() * width;
      spawndx = Math.random() * 0.2;
      spawndy = -(MIN_SPAWN_SPEED + Math.random() * (0.2 - MIN_SPAWN_SPEED));

      spawndx *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

      newAsteroid = new Asteroid(spawnx, height, spawndx, spawndy, aSize, 6);

      break;
    case "LEFT":
      spawny = Math.random() * height;
      spawndx = MIN_SPAWN_SPEED + Math.random() * (0.2 - MIN_SPAWN_SPEED);
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
  canvas.drawEntity(spaceship);

  // Draw the asteroids
  asteroids.forEach((asteroid) => {
    canvas.drawEntity(asteroid);
  });

  // Draw the bullets
  bullets.forEach((bullet) => {
    canvas.drawEntity(bullet);
  });

  // Draw the score
  canvas.drawText(score, canvas.width / 2, 20, "center");

  // Draw the High Score
  canvas.drawText(highScore, canvas.width - 5, 20, "right");

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

  if (pressed["Enter"] || pressed["Space"]) {
    newGame = !newGame;
    score = 0;
    reset();
    pauseGame();
    // Space is also the fire key; the press that confirmed the menu must
    // not double as a held trigger on the first playing frame.
    keys["Space"] = false;
  }

  let xpos;
  let rectW;
  const diff = difficulty.getDiff();
  if (diff == 1) {
    xpos = canvas.width / 3;
    rectW = 60;
  } else if (diff == 2) {
    xpos = canvas.width / 2 - 10;
    rectW = 80;
  } else {
    xpos = (canvas.width * 2) / 3;
    rectW = 60;
  }

  canvas.drawSelector(xpos, rectW);
  canvas.drawText("Easy", canvas.width / 3, canvas.height / 2 + 30, "center");
  canvas.drawText("Normal", canvas.width / 2, canvas.height / 2 + 30, "center");
  canvas.drawText(
    "Hard",
    (canvas.width * 2) / 3,
    canvas.height / 2 + 30,
    "center",
  );
};

// Draw Message
const drawMessage = () => {
  canvas.setBackground("#000000");
  canvas.drawText(score, canvas.width / 2, 20, "center");
  canvas.drawText(highScore, canvas.width - 5, 20, "right");
  canvas.drawLives(lives, spaceship);

  canvas.drawText(message, canvas.width / 2, canvas.height / 2, "center");
};

reset();
startGame();
