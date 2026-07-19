# Phase 2: Dead Code Removal & Consolidation

Part of [Repo Modernization](../repo-modernization.md).

## Context

The project has exactly one entry point: `src/index.js`, loaded via a
`<script type="module">` tag in `index.html` (see [Phase
1](phase-1-dependency-toolchain.md), which moves this from webpack's
`entry` config to Vite's `index.html`-driven entry). Two other trees exist
in `src/` that are never imported by it, or by anything else in the repo:

- **`src/controllers/asteroids.js`** — a near-exact duplicate of
  `src/index.js` predating its refactor into the current entry point (visible
  in git history around commit `0c35fe2`, "Started to pull out game logic
  into own class"). It references `Spaceship`, `Sound`, `Difficulty`,
  `Asteroid` without importing any of them, uses `for (item in bullets)`
  (for-in over an array) and an unassigned `newA`, and would throw
  `ReferenceError`s immediately if it were ever actually loaded.
- **`src/lib/GameLib/`** (`game.js`, `gameInput.js`, `gamePhysics.js`,
  `gameTime.js`) — an incomplete, separate OOP scaffold attempt.
  `gamePhysics.js` is empty. `gameTime.js` defines `updateTiming() { ... }`
  as a bare statement inside a plain arrow function body — that's not valid
  class/object method syntax there, and arrow functions aren't constructible
  in the first place, so `new GameTime()` throws a `TypeError`. `game.js`
  references undefined bindings (`keyboardInput`, `isPaused`) and calls loop
  methods without `this.` (`updateGame()` instead of `this.updateGame()`),
  which would throw `ReferenceError`s the moment `gameTick()` ran.

Neither tree is reachable from `src/index.js`, `index.html`, or anywhere
else — this is confirmed dead code, not an alternate code path that happens
to be unused today. It roughly doubles the amount of game-loop logic
a reader has to reconcile when trying to understand "how the game actually
works," and its own bugs make it actively misleading (someone debugging
could easily start reading the broken copy instead of the real one).

## Critical Files

- [src/controllers/asteroids.js](../../src/controllers/asteroids.js) — delete
- [src/lib/GameLib/game.js](../../src/lib/GameLib/game.js) — delete
- [src/lib/GameLib/gameInput.js](../../src/lib/GameLib/gameInput.js) — delete
- [src/lib/GameLib/gamePhysics.js](../../src/lib/GameLib/gamePhysics.js) — delete
- [src/lib/GameLib/gameTime.js](../../src/lib/GameLib/gameTime.js) — delete
- [src/index.js](../../src/index.js) — the real, only entry point; unaffected

## Approach

- [ ] Grep the full repo (source and any committed build output) to
      reconfirm zero references to `src/controllers/asteroids.js` or
      `src/lib/GameLib/*` outside those files themselves.
- [ ] Delete `src/controllers/asteroids.js` and the (now-empty)
      `src/controllers/` directory.
- [ ] Delete `src/lib/GameLib/` in full.
- [ ] Run `npm run build` and manually play the game in a browser to confirm
      no behavior change — this removal should be a pure deletion of
      unreachable code with zero observable effect.
- [ ] Note in the commit message that this was dead code identified during
      the modernization review (not a design change), so it doesn't read as
      an unexplained feature removal later.

## Open Questions

- None — this tree is unreachable by construction (single entry point), so
  there's no design decision here, just cleanup.
