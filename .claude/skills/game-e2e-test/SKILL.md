---
name: game-e2e-test
description: Write or run Playwright browser-integration tests for AsteroidsJS (score, pause, input, difficulty, high score, dialogs). Use when adding e2e coverage in e2e/, verifying a gameplay change works end-to-end, or before running `npm run test:e2e`.
---

1. Read [`.ai/project-rules.md`](../../../.ai/project-rules.md) `PROJ-001` through `PROJ-006` first — they encode the non-obvious gotchas of this specific game (canvas isn't DOM-queryable, a one-tick lag between `score` and its persisted reflections, key-latch timing, the reset-high-score dialog stealing focus). Re-deriving these from scratch each session is exactly what this skill exists to avoid.
2. Never assert on canvas pixels or screenshots for game state. Read `window.__gameState()` instead (exposed dev-only in `src/index.js`): `{ score, highScore, lives, paused, newGame, difficulty, asteroids, bullets }`.
3. Reuse [`e2e/helpers.js`](../../../e2e/helpers.js) — `getState`, `waitForState`, `startGame`, `tapAcrossFrame` — rather than re-implementing polling or key-hold timing per test file.
4. Before writing a new test, decide where it belongs (`PROJ-005`):
   - Pure model math (collision, split geometry, difficulty scaling) → Vitest, `src/models/*.test.js`. Don't add it to `e2e/`.
   - Browser/DOM integration (keyboard wiring, focus/blur, the `<dialog>`, `localStorage` persistence, game-loop timing) → Playwright, `e2e/*.spec.js`.
5. Run the suite with `npm run test:e2e` (wraps `playwright test`). `playwright.config.js` boots the Vite dev server itself under its configured `base` path — don't hand-start `npm run start` first.
6. For any new behavior driven by a press-once latch (menus, selectors), hold the key across a frame via `tapAcrossFrame`, not `page.keyboard.press()` (`PROJ-004`).
7. Apply `DEV-002`: run `npm run test:e2e` and `npm run test` (Vitest) yourself and confirm both pass before reporting the work done.
