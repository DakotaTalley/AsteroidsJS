# Phase 3: Bug Fixes in Live Game Code

Part of [Repo Modernization](../repo-modernization.md).

## Context

These are bugs in `src/index.js` and the model classes it actually uses —
the code that ships, not the dead trees removed in
[Phase 2](phase-2-dead-code-removal.md).

## Critical Files

- [src/index.js](../../src/index.js) — `updatePhysics`, `renderGraphics`,
  `checkInput`, input state, and the high-score reset handler
- [src/models/entity.js](../../src/models/entity.js) — shared movement math
- [src/models/sound.js](../../src/models/sound.js) — `play()`
- [src/models/bullet.js](../../src/models/bullet.js) — `checkDistance`

## Approach

- [ ] Fix the bullet/asteroid collision loop in `updatePhysics`
      (`src/index.js`): `bullets.splice(i, 1)` runs mid-`for` loop without
      adjusting `i` or breaking the outer loop, so the element that shifts
      into index `i` after the splice is never checked — a bullet can pass
      through an asteroid it should have hit. Iterate backwards, or collect
      indices to remove and splice after the loop completes.
- [ ] Fix the bullet-expiry loop in `renderGraphics` (`src/index.js`):
      `bullets.forEach((bullet, index) => { ...; bullets.splice(index, 1) })`
      mutates the array mid-`forEach`, which skips the element that shifts
      into the removed slot — an expired bullet can survive (and get drawn)
      one extra frame, or a live one can get skipped. Switch to iterating
      backwards with a plain `for` loop, or rebuild via `filter`.
- [ ] Fix the rapid-fire laser sound bug: `Sound.play()`
      (`src/models/sound.js`) calls `.play()` on an `<audio>` element that
      may already be mid-playback, which resumes rather than restarts —
      firing faster than the clip's length silently drops replays. Set
      `this.sound.currentTime = 0` before `play()`, or pool a few `Audio`
      instances / use the Web Audio API for overlapping playback.
- [ ] Replace the `keys = []` array used as a keyed lookup (`src/index.js`)
      with a plain object (`{}`) — it's a map keyed by `KeyboardEvent.code`
      strings, not an ordered list; using an array is misleading and wastes
      the sparse-array's implicit length tracking for no reason.
- [ ] Replace `window.onkeyup = ...` / `window.onkeydown = ...` property
      assignment (`src/index.js`) with
      `window.addEventListener("keyup"/"keydown", ...)` so a future second
      listener doesn't silently clobber this one.
- [ ] Fix the missed-keypress bug in pause/confirm handling (`src/index.js`):
      `checkInput`'s pause check (`keys["Enter"] || keys["KeyP"]`) and
      `chooseDiff`'s confirm check (`keys["Enter"] || keys["Space"]`) only see
      a key as pressed if it's still down the one time per animation frame
      `gameTick` happens to read `keys[...]` — a keydown+keyup pair completing
      faster than that frame (observed with Playwright's `.press()`, which
      fires both within the same tick, during [Phase
      1](phase-1-dependency-toolchain.md)'s post-migration smoke test) is
      silently dropped, so pause or the difficulty-confirm can fail to
      trigger with no feedback. Latch the transition on `keydown` (e.g. track
      a separate "pressed this frame" flag set in the `keydown` handler and
      cleared after `gameTick` consumes it) instead of sampling the raw
      held-state on every frame.
- [ ] Guard the `Math.log(score)` asteroid-spawn threshold in `updatePhysics`
      (`src/index.js`) against `score === 0` (`Math.log(0) === -Infinity`).
      It happens to work today (the comparison is just always false, so
      spawning stays gated off until score grows), but it's not obviously
      correct on read — use `Math.log(score + 1)` or an explicit small
      lookup/ramp function instead.
- [ ] Add a confirmation step (e.g. `confirm(...)`) to the "Reset High
      Score" button handler (`src/index.js`) before it clears `localStorage`
      — it's currently a single accidental click away from being destructive.
- [ ] Smoke-test: play a session firing continuously into a dense asteroid
      cluster (the scenario that exercises both splice bugs) and confirm no
      bullets or asteroids are missed, and every shot is audible.

## Open Questions

- None currently — all of the above are confirmed bugs from reading the
  live code path, not speculative hardening.
