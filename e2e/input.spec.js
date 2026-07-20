import { test, expect } from "@playwright/test";
import { getState, waitForState, startGame, tapAcrossFrame } from "./helpers.js";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await waitForState(page, () => typeof window.__gameState === "function");
});

test("Space fires a bullet while playing", async ({ page }) => {
  await startGame(page);
  expect((await getState(page)).bullets).toBe(0);

  await page.keyboard.down("Space");
  await waitForState(page, () => window.__gameState().bullets === 1);
  await page.keyboard.up("Space");
});

test("ArrowRight held across a frame increases difficulty on the selection screen", async ({
  page,
}) => {
  expect((await getState(page)).difficulty).toBe(1);

  await tapAcrossFrame(page, "ArrowRight");
  await waitForState(page, () => window.__gameState().difficulty === 2);

  await tapAcrossFrame(page, "ArrowRight");
  await waitForState(page, () => window.__gameState().difficulty === 3);

  // Already at max (HARD) — one more tap must not overshoot.
  await tapAcrossFrame(page, "ArrowRight");
  await expect
    .poll(() => getState(page).then((s) => s.difficulty))
    .toBe(3);
});

test("ArrowLeft held across a frame decreases difficulty", async ({
  page,
}) => {
  await tapAcrossFrame(page, "ArrowRight");
  await waitForState(page, () => window.__gameState().difficulty === 2);

  await tapAcrossFrame(page, "ArrowLeft");
  await waitForState(page, () => window.__gameState().difficulty === 1);
});
