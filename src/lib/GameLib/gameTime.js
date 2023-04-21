const GameTime = () => {
    // Timing Variables
    this.deltaTime = 0.01;
    this.accumulator = 0;
    this.lastTick = performance.now();

  // updateTiming() updates timing variables to track tick calc times
  updateTiming() {
    // Calculate time since last tick
    const currentTime = performance.now();
    const elapsedTime = currentTime - this.lastTick;

    // Make this tick the last tick
    this.lastTick = currentTime;

    // Track accumulated time for physics calculations
    this.accumulator += elapsedTime;
  }
}

export default GameTime;
