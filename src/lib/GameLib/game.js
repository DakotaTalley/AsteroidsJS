import GameTime from "./gameTime";
import GameInput from "./gameInput";

class Game {
  constructor() {
    // Set up Timing
    this.gameTime = new GameTime();

    // Set up Inputs
    this.keyboardInput = new GameInput("keyboard");
    keyboardInput.setUp();

    // Game Variables
    this.isPaused = true;
    this.#SPAWNS = ["TOP", "RIGHT", "BOTTOM", "LEFT"];
    this.difficulty = "EASY";
  }

  // startGame() initailizes game variables and starts the Game Loop
  startGame() {
    queueTick();
  }

  // queueTick() queues the next tick
  queueTick() {
    window.requestAnimationFrame(gameTick);
  }

  // gameTick() completes all actions for each tick and queues next tick
  gameTick() {
    if (!isPaused) {
      // Update timing variables
      this.gameTime.updateTiming();

      // Update Game Variables
      updateGame();

      // Checks for User input and makes changes
      checkInput();

      // Based on timing complete physics calculations
      while (this.gameTime.accumulator >= this.gameTime.deltaTime) {
        updatePhysics();
        this.gameTime.accumulator -= this.gameTime.deltaTime;
      }

      // Render graphics on screen
      renderGraphics();
    }

    // Queue next tick
    queueTick();
  }

  // updateGame() updates Game Variables
  updateGame() {
    // Can add score, lives, etc.
    // By default there are no items here
  }

  // checkInput() checks for inputs
  checkInput() {
    // Can add logic based on input here
    // By default there are no items here
  }

  // updatePhysics() handles physics logic
  updatePhysics() {
    // Can add physics logic here
    // By default there are no items here
  }

  // renderGraphics() renders scene to canvas
  renderGraphics() {
    // Can add rendering here
    // By default there are no items here
  }
}

export default Game;
