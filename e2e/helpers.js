// Shared helpers for driving the game via the window.__gameState test hook
// (see src/index.js) rather than reading the canvas, which isn't
// DOM-queryable. See .ai/project-rules.md for the rules these encode.

export const getState = (page) => page.evaluate(() => window.__gameState());

export const waitForState = (page, predicate, options) =>
  page.waitForFunction(predicate, undefined, options);

// requestAnimationFrame-aligned pause, for interactions (like the difficulty
// selector) that use a "press-once" latch consumed once per game tick.
// keyboard.press() completes the down+up cycle faster than a single rAF, so
// the game loop can miss the held-key state entirely — hold the key across
// an explicit frame boundary instead.
export const tapAcrossFrame = async (page, key) => {
  await page.keyboard.down(key);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(r)));
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(r)));
  await page.keyboard.up(key);
};

export const startGame = async (page) => {
  await page.keyboard.press("Enter");
  await waitForState(page, () => window.__gameState().newGame === false);
};
