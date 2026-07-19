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

- [x] Fix the bullet/asteroid collision loop in `updatePhysics`
      (`src/index.js`): `bullets.splice(i, 1)` runs mid-`for` loop without
      adjusting `i` or breaking the outer loop, so the element that shifts
      into index `i` after the splice is never checked — a bullet can pass
      through an asteroid it should have hit. Iterate backwards, or collect
      indices to remove and splice after the loop completes.
- [x] Fix the bullet-expiry loop in `renderGraphics` (`src/index.js`):
      `bullets.forEach((bullet, index) => { ...; bullets.splice(index, 1) })`
      mutates the array mid-`forEach`, which skips the element that shifts
      into the removed slot — an expired bullet can survive (and get drawn)
      one extra frame, or a live one can get skipped. Switch to iterating
      backwards with a plain `for` loop, or rebuild via `filter`.
- [x] Fix the rapid-fire laser sound bug: `Sound.play()`
      (`src/models/sound.js`) calls `.play()` on an `<audio>` element that
      may already be mid-playback, which resumes rather than restarts —
      firing faster than the clip's length silently drops replays. Set
      `this.sound.currentTime = 0` before `play()`, or pool a few `Audio`
      instances / use the Web Audio API for overlapping playback.
- [x] Replace the `keys = []` array used as a keyed lookup (`src/index.js`)
      with a plain object (`{}`) — it's a map keyed by `KeyboardEvent.code`
      strings, not an ordered list; using an array is misleading and wastes
      the sparse-array's implicit length tracking for no reason.
- [x] Replace `window.onkeyup = ...` / `window.onkeydown = ...` property
      assignment (`src/index.js`) with
      `window.addEventListener("keyup"/"keydown", ...)` so a future second
      listener doesn't silently clobber this one.
- [x] Fix the missed-keypress bug in pause/confirm handling (`src/index.js`):
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
- [x] Guard the `Math.log(score)` asteroid-spawn threshold in `updatePhysics`
      (`src/index.js`) against `score === 0` (`Math.log(0) === -Infinity`).
      It happens to work today (the comparison is just always false, so
      spawning stays gated off until score grows), but it's not obviously
      correct on read — use `Math.log(score + 1)` or an explicit small
      lookup/ramp function instead.
- [x] Add a confirmation step (e.g. `confirm(...)`) to the "Reset High
      Score" button handler (`src/index.js`) before it clears `localStorage`
      — it's currently a single accidental click away from being destructive.
- [x] Smoke-test: play a session firing continuously into a dense asteroid
      cluster (the scenario that exercises both splice bugs) and confirm no
      bullets or asteroids are missed, and every shot is audible. Driven
      headlessly via Playwright against `vite`'s dev server (no project
      `run` skill or test harness exists yet — see [Phase
      6](phase-6-tooling-testing.md)): held Space+W for ~10s of continuous
      fire, hooked `HTMLMediaElement.prototype.play` to confirm all 38 laser
      plays fired at the intended ~250ms cooldown with `currentTime` reset
      to `0` on every call (no dropped replays), got 3 explosion plays
      (asteroid and ship collisions both registered), and confirmed a
      fast keydown+keyup on `Enter` (faster than a frame) still toggled
      pause exactly once — no drop, no double-fire.

## Open Questions

- None of the listed bugs were speculative — all confirmed and fixed as
  described above.

## Follow-up fixes (found during this phase's verification)

- `Sound.play()` (`src/models/sound.js`): the `currentTime = 0` fix above
  can abort a still-pending prior `play()` call under rapid fire, which
  rejects that call's promise with `AbortError`. Chained `.catch(() => {})`
  onto `play()` so this doesn't surface as an unhandled promise rejection.
- `pauseGame(bool)` (`src/index.js`): always toggled `paused` via
  `!paused` regardless of its `bool` argument — the parameter only gated
  whether `message` got set to `"Paused"`, not whether the toggle
  happened, and every call site passed the *pre-toggle* `paused` value, so
  the branch that actually paused the game (via `checkInput`) never set
  the message and the branch that unpaused it did. The paused overlay
  could show stale/contradictory text (observed: pausing via
  `checkInput` left the difficulty-menu text on screen instead of
  "Paused"). Fixed by dropping the parameter and setting `message` based
  on the *resulting* `paused` state after the toggle.
