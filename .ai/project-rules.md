# Project-Specific Rules

Rules this project has added that aren't part of the constitution's categories, layered on top of [`.ai/constitution.md`](constitution.md). Same rule format and tags — see the constitution for field/tag definitions.

- **ID format:** plain `PROJ-NNN` (sequential, no category segment) — unique within this file. Table membership is what makes these visibly distinct from template-sourced rules, not the ID.

## Rules

| ID | Title | Description | Mutability | Enforcement |
|---|---|---|---|---|
| `PROJ-001` | Canvas State Isn't DOM-Queryable — Use `window.__gameState` | Score, lives, pause state, difficulty, and entity counts are drawn to `<canvas>`, not the DOM, so Playwright locators can't read them. `src/index.js` exposes a dev-only `window.__gameState()` accessor (gated on `import.meta.env.DEV`, dead-code-eliminated from production builds) returning `{ score, highScore, lives, paused, newGame, difficulty, asteroids, bullets }` — e2e tests must read state through this hook, not by parsing canvas pixels or screenshots. | `mutable` | `warning` |
| `PROJ-002` | Poll Real Elapsed Time, Not rAF Frame Counts, for Game-Loop Timing | The game loop is driven by `requestAnimationFrame` but paced by a fixed-step accumulator keyed off `performance.now()` (see `dt`, `SCORE_INTERVAL_MS`, `SPAWN_CHECK_INTERVAL_MS` in `src/index.js`). Playwright can't observe frame counts directly, so timing-dependent e2e assertions (e.g. score ticking up) must `page.waitForTimeout`/poll on wall-clock delays long enough to cross the relevant interval, not try to count frames. | `mutable` | `info` |
| `PROJ-003` | `score` and Its Persisted Reflections Lag by One Game Tick | `updateGame()` checks `highScore < score` (and writes `localStorage["high"]`) *before* that tick's `addScore()` call, so `highScore`/`localStorage` catch up to a new `score` value one tick later, not the same tick. An e2e test asserting on persisted/derived high-score state must wait on `highScore` itself (or poll again after the value stabilizes), not treat `score` as an interchangeable proxy for "has been persisted yet." | `mutable` | `warning` |
| `PROJ-004` | Hold Discrete-Press Keys Across a Frame Boundary, Not `keyboard.press()` | The difficulty selector (`chooseDiff()` in `src/index.js`) uses a `pframe` press-once latch consumed at most once per game tick. `page.keyboard.press(key)` completes the down+up cycle fast enough that the game loop's next `requestAnimationFrame` tick can see the key already released, silently dropping the input. For latch-driven UI (difficulty selection, menu confirm), use `keyboard.down(key)` → wait one or two `requestAnimationFrame`s (see `tapAcrossFrame` in `e2e/helpers.js`) → `keyboard.up(key)` instead. | `mutable` | `warning` |
| `PROJ-005` | Vitest Owns Model Math; Playwright Owns Browser Integration | `src/models/*.test.js` (Vitest) already covers entity/asteroid/bullet/spaceship/difficulty math in isolation. `e2e/*.spec.js` (Playwright) exists to cover what unit tests can't: real keyboard/focus/blur event wiring, the reset-high-score `<dialog>`, `localStorage` persistence across reloads, and game-loop timing integration. Don't duplicate model-level assertions (e.g. collision math, split geometry) in e2e — drive the DOM/browser surface instead and leave the math to Vitest. | `mutable` | `info` |
| `PROJ-006` | The Reset-High-Score `<dialog>` Steals Keyboard Focus | While `#reset-high-dialog` is open, `src/index.js`'s `keydown` handler returns early (dialog owns Enter/Space) and `gameTick` freezes the simulation outright (see the comment at the `resetHighDialog.open` check). An e2e test that opens this dialog must close it (confirm or cancel) before asserting on any further key-driven game behavior — key presses sent while it's open are silently swallowed by the game, not queued. | `mutable` | `warning` |

## Retired Rule IDs

_none yet_
