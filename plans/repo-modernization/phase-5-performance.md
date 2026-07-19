# Phase 5: Performance

Part of [Repo Modernization](../repo-modernization.md).

## Context

Two real issues found during this modernization review:

- `updateGame()` and `renderGraphics()`/`drawMessage()` in `src/index.js`
  each call `localStorage.getItem("high")` — a synchronous, string-based
  read — up to twice per frame at 60fps, purely to compare against or
  display a value that only actually changes when a new high score is set.
- `.frameworks/canvas/rules.md` rule `DEV-002` requires scaling the canvas
  backing buffer by `devicePixelRatio`; `src/lib/canvas.js` currently sizes
  the canvas only via the static `width`/`height` HTML attributes
  (800×600), so the game renders blurry on high-DPI/Retina displays.

## Critical Files

- [src/index.js](../../src/index.js) — `updateGame`, `renderGraphics`,
  `drawMessage` (`src/index.js` is the only live entry point — see
  [Phase 2](phase-2-dead-code-removal.md))
- [src/lib/canvas.js](../../src/lib/canvas.js) — `Canvas` constructor,
  all `draw*` methods

## Approach

- [x] Cache the high score in a JS variable instead of calling
      `localStorage.getItem("high")` on every frame in both `updateGame` and
      `renderGraphics`/`drawMessage`. Read it once at startup; write to
      `localStorage` (and update the cached value) only when a new high
      score is actually set.
- [x] Apply canvas rule `DEV-002`: scale the canvas backing buffer by
      `window.devicePixelRatio`, scale the 2D context to match, and keep the
      CSS-visible size at the intended layout size, so rendering is sharp on
      high-DPI displays. `Canvas`'s draw methods reset the 2D transform to
      identity after each entity draw (`setTransform(1, 0, 0, 1, 0, 0)`) to
      undo a per-draw `translate`/`rotate` — a naive one-time
      `context.scale(dpr, dpr)` at construction would get wiped out by the
      first such reset. Fixed by making the dpr scale the *baseline*: every
      reset now targets `setTransform(dpr, 0, 0, dpr, 0, 0)` instead of
      identity, and `this.width`/`this.height` stay in logical (CSS) pixels
      since all game logic and draw math is expressed in those units.
- [x] After [Phase 3](phase-3-bug-fixes.md)'s array-mutation fixes land,
      spot-check that the bullet-expiry and collision loops aren't doing any
      redundant re-checks as a side effect of the old splice bugs. Both loops
      (`updatePhysics`'s bullet/asteroid collision loop and
      `renderGraphics`'s bullet-expiry loop) iterate backwards and `splice`
      without re-visiting shifted elements — confirmed no redundant
      re-checks; nothing to change here.

Verified via a headless Playwright smoke test against `vite`'s dev server
(no `chromium-cli`/project `run` skill available — see [Phase
6](phase-6-tooling-testing.md)) with `deviceScaleFactor: 2`: canvas backing
buffer came out `1600x1200` against a `800x600` CSS/layout size (exactly 2x,
matching the forced DPR), ship/asteroids/score/high-score/lives all
rendered correctly positioned with no distortion, no console errors, and
the high score persisted to `localStorage` correctly after scoring.

## Open Questions

- None — both concrete fixes above are small, low-risk, and shipped. The
  WASM feasibility question originally scoped as a research sub-section of
  this phase has moved to
  [2.0 Features](../2.0-features.md#wasm-feasibility-investigation), since
  it's forward-looking research gated on a future feature that doesn't
  exist yet, not part of this modernization pass.
