export const DIFFICULTY = {
  EASY: 1,
  NORMAL: 2,
  HARD: 3,
};

class Difficulty {
  constructor() {
    this.diff = DIFFICULTY.EASY;
  }

  increaseDiff() {
    if (this.diff == DIFFICULTY.HARD) {
      return;
    } else {
      this.diff++;
    }
  }

  decreaseDiff() {
    if (this.diff == DIFFICULTY.EASY) {
      return;
    } else {
      this.diff--;
    }
  }

  getDiff() {
    return this.diff;
  }
}

export default Difficulty;
