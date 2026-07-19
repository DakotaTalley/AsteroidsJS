# Phase 5: Performance

Part of [Repo Modernization](../repo-modernization.md).

## Context

This phase covers two parts: concrete, low-risk performance wins found
during this modernization review, and a scoped research question (WASM)
that's tracked here rather than in a separate plan document.

Two real issues found:

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
  `drawMessage`; also the actual game loop for WASM investigation purposes
  ([Phase 2](phase-2-dead-code-removal.md) confirms `src/index.js` is the
  only live entry point — `src/controllers/asteroids.js` is dead code and
  should not be used as the reference for game-loop structure)
- [src/lib/canvas.js](../../src/lib/canvas.js) — `Canvas` constructor,
  all `draw*` methods; Canvas2D draw calls, useful for confirming render
  time is not the actual bottleneck
- [src/models/entity.js](../../src/models/entity.js) — shared movement
  (`updatePosition`, `accelerate`, `decelerate`) and `checkCollision` logic
  used by every entity type
- [src/models/asteroid.js](../../src/models/asteroid.js) — `genBounds`
  polygon generation, called per-asteroid on spawn/split

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

## WASM Investigation (research only — no module ships from this phase)

Whether compiling performance-critical parts of the game to WebAssembly
would meaningfully help. This is evaluation only; a future migration would
be a separate, later effort gated on the findings below.

**Current state**: fixed-timestep loop driven by `requestAnimationFrame` in
`src/index.js` (game tick → input → physics/collision → render). Physics /
collision is simple point-in-AABB checking in `entity.js`
(`checkCollision`); the physics step runs an O(bullets × asteroids) nested
loop every frame for bullet/asteroid hits, plus an O(asteroids) loop for
ship/asteroid hits. Entity counts are intentionally small — asteroid spawn
is capped by `asteroids.length < Math.log(score)`, so the simulation holds
on the order of tens of entities even at a high score, not hundreds. **No
existing performance problem is documented** — no profiling data, no
frame-drop reports, no perf issues on file; this is forward-looking, not a
fix for a known regression.

- [ ] Capture a performance baseline: Chrome DevTools Performance traces
      during normal play (steady state, and a "worst case" with max
      asteroids/bullets on screen at highest difficulty) — note frame time,
      scripting time, GC pauses.
- [ ] Identify and rank candidate hot paths from the trace plus code
      reading: the collision nested loop, `Asteroid.genBounds` polygon
      math, `Entity.updatePosition`/`accelerate`/`decelerate` trig calls.
      Note which are actually script-bound vs. already GPU/compositor-bound
      (Canvas2D draw calls themselves won't benefit from WASM — only the
      JS-side math feeding them would).
- [ ] Research WASM toolchain options for this Vite + vanilla JS project
      (see [Phase 1](phase-1-dependency-toolchain.md)) with no existing
      TypeScript/Rust tooling: AssemblyScript (TS-like syntax, cheap
      interop, smaller learning curve) vs. Rust + `wasm-bindgen`/`wasm-pack`
      (better codegen, steeper toolchain/CI cost) vs. hand-written WAT (not
      realistic at this project size). Vite has native `.wasm` import
      support via `?init`, or `vite-plugin-wasm` for more involved cases.
- [ ] Build a throwaway micro-benchmark comparing JS vs. a WASM
      implementation for the single highest-ranked hot path (most likely
      the bullet/asteroid collision loop or bounds generation), at
      realistic entity counts (tens) and an exaggerated stress count
      (hundreds/thousands) to see where any crossover point is. Measure
      with `performance.now()` across many iterations, not a single call.
- [ ] Evaluate non-performance costs observed while prototyping: JS↔WASM
      call overhead for small/frequent calls (a known WASM weak point at
      this scale), data marshaling cost for entity arrays, added bundle
      size, added build complexity, debuggability/DX regression vs. plain
      JS.
- [ ] Write up findings as a recommendation appended to this section:
      whether WASM is worth adopting now, what numeric threshold (entity
      count, frame budget) would justify it, which hot path(s) would be the
      first candidate if revisited, and which toolchain to prefer if/when
      that happens.
- [ ] Delete or clearly mark any prototype/benchmark code as scratch so it
      doesn't get mistaken for shipped functionality.

## Open Questions

- The two concrete fixes above (localStorage caching, devicePixelRatio) are
  small, low-risk, and independently justified regardless of the WASM
  question.
- Is there an actual observed performance problem today, or is the WASM
  question purely forward-looking? No profiling data currently exists — the
  baseline capture step above should answer this before further investment.
- What future feature would actually push entity/compute counts up enough
  to matter (denser asteroid fields, particle effects, larger canvas,
  multiplayer/netcode prediction)? Without one of these, WASM adoption is
  likely premature for a game of this scope.
- Given the small, frequent calls this codebase would make into WASM
  (per-entity, per-frame), does the JS↔WASM boundary overhead outweigh the
  raw compute savings at realistic entity counts? This needs to come out of
  the micro-benchmark rather than being assumed either way.
- If adopted, does WASM change how the JS-side game loop is structured
  (e.g., moving the whole entity array into WASM-managed linear memory
  instead of calling in/out per entity)? That's a much larger architectural
  change than "port one function" and should be scoped separately if the
  recommendation leans that direction.
