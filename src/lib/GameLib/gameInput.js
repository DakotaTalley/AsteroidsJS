class GameInput {
  constructor(type) {
    this.inputType = type;
    switch (type) {
      // Keyboard
      case "keyboard":
        this.keys = [];
    }
  }

  setUp() {
    switch (this.inputType) {
      case "keyboard":
        // If keyUp, input is not active
        window.onkeyup = (e) => {
          this.keys[e.code] = false;
        };

        // If keyDown, input is active
        window.onkeydown = (e) => {
          this.keys[e.code] = true;
          // PreventDefault to prevent page scrolling, etc.
          e.preventDefault();
        };
    }
  }
}

export default GameInput;
