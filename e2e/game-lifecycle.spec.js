import { test, expect } from "@playwright/test";
import { getState, waitForState, startGame } from "./helpers.js";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await waitForState(page, () => typeof window.__gameState === "function");
});

test("boots into the difficulty screen, paused, at default difficulty", async ({
  page,
}) => {
  const state = await getState(page);
  expect(state).toMatchObject({
    score: 0,
    lives: 2,
    paused: true,
    newGame: true,
    difficulty: 1,
  });
});

test("Enter starts the game and unpauses it", async ({ page }) => {
  await startGame(page);
  const state = await getState(page);
  expect(state.paused).toBe(false);
});

test("Enter pauses and resumes an in-progress game", async ({ page }) => {
  await startGame(page);

  await page.keyboard.press("Enter");
  await waitForState(page, () => window.__gameState().paused === true);

  await page.keyboard.press("Enter");
  await waitForState(page, () => window.__gameState().paused === false);
});

test("losing window focus pauses the game", async ({ page }) => {
  await startGame(page);
  expect((await getState(page)).paused).toBe(false);

  await page.evaluate(() => window.dispatchEvent(new Event("blur")));
  await waitForState(page, () => window.__gameState().paused === true);
});

test("score does not advance while paused", async ({ page }) => {
  await startGame(page);
  await page.keyboard.press("Enter"); // pause
  await waitForState(page, () => window.__gameState().paused === true);

  const before = (await getState(page)).score;
  await page.waitForTimeout(1200);
  const after = (await getState(page)).score;

  expect(after).toBe(before);
});
