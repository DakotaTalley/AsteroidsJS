import { test, expect } from "@playwright/test";
import { getState, waitForState, startGame } from "./helpers.js";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await waitForState(page, () => typeof window.__gameState === "function");
});

test("score ticks up once per second while playing", async ({ page }) => {
  await startGame(page);
  await waitForState(page, () => window.__gameState().score >= 2, {
    timeout: 5000,
  });
});

test("high score persists across a reload via localStorage", async ({
  page,
}) => {
  await startGame(page);
  // highScore/localStorage are written a tick after `score` crosses the
  // threshold (see updateGame() in src/index.js), so wait on highScore
  // itself rather than treating `score` as an interchangeable proxy for it.
  await waitForState(page, () => window.__gameState().highScore >= 2, {
    timeout: 5000,
  });
  const scoreBeforeReload = (await getState(page)).highScore;

  await page.reload();
  await waitForState(page, () => typeof window.__gameState === "function");

  const stored = await page.evaluate(() => localStorage.getItem("high"));
  expect(Number(stored)).toBeGreaterThanOrEqual(scoreBeforeReload);
  expect((await getState(page)).highScore).toBe(Number(stored));
});

test("reset-high-score dialog: confirm zeroes the high score", async ({
  page,
}) => {
  await page.evaluate(() => localStorage.setItem("high", "42"));
  await page.reload();
  await waitForState(page, () => typeof window.__gameState === "function");
  expect((await getState(page)).highScore).toBe(42);

  await page.click("#reset-high");
  await expect(page.locator("#reset-high-dialog")).toBeVisible();

  await page.click("#reset-high-confirm");
  await expect(page.locator("#reset-high-dialog")).toBeHidden();

  expect((await getState(page)).highScore).toBe(0);
  expect(await page.evaluate(() => localStorage.getItem("high"))).toBe("0");
});

test("reset-high-score dialog: cancel leaves the high score untouched", async ({
  page,
}) => {
  await page.evaluate(() => localStorage.setItem("high", "42"));
  await page.reload();
  await waitForState(page, () => typeof window.__gameState === "function");

  await page.click("#reset-high");
  await expect(page.locator("#reset-high-dialog")).toBeVisible();

  await page.click("#reset-high-cancel");
  await expect(page.locator("#reset-high-dialog")).toBeHidden();

  expect((await getState(page)).highScore).toBe(42);
});
