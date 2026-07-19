# Phase 6: Developer Tooling & Testing

Part of [Repo Modernization](../repo-modernization.md).

## Context

There is no linter of any kind. `prettier` runs entirely on implicit
defaults (no committed `.prettierrc`). `npm test` is a stub
(`echo "Error: no test specified" && exit 1"`) that always fails and isn't
wired into anything. There is zero automated test coverage — including for
the pure-logic model classes (`Entity`, `Asteroid`, `Bullet`, `Difficulty`,
`Spaceship`), which have no DOM/canvas dependency and are cheap to unit test
directly.

## Critical Files

- [package.json](../../package.json) — scripts, new devDependencies
- [src/models/entity.js](../../src/models/entity.js)
- [src/models/asteroid.js](../../src/models/asteroid.js)
- [src/models/bullet.js](../../src/models/bullet.js)
- [src/models/difficulty.js](../../src/models/difficulty.js)
- [src/models/spaceship.js](../../src/models/spaceship.js)

## Approach

- [x] Add ESLint (flat config, `eslint.config.js`) targeting a browser +
      ES2022 environment; add `eslint-config-prettier` so lint and format
      rules don't conflict.
- [x] Add a committed `.prettierrc` capturing the project's actual
      formatting choices — currently implicit defaults — so the prettier 3
      upgrade in [Phase 1](phase-1-dependency-toolchain.md) doesn't silently
      shift style expectations for contributors with no record of the
      decision.
- [x] Add `.editorconfig` for basic cross-editor consistency (indent
      style/size, final newline, charset).
- [x] Add `"lint": "eslint ."` and `"format": "prettier --check ."` scripts
      to `package.json`.
- [x] Introduce a real test runner — Vitest is the natural fit here (no
      other test-framework opinion exists in the repo, and post-[Phase
      1](phase-1-dependency-toolchain.md) it shares config with Vite
      directly, needing no extra setup for this ESM project) — and replace
      the always-failing `npm test` stub.
- [x] Write unit tests:
  - [x] `entity.js`: `updatePosition` screen-wraparound at each edge,
        `accelerate`/`decelerate` max-speed clamping in all four directions,
        `checkCollision` true/false cases.
  - [x] `asteroid.js`: `genBounds` point count matches `numSides`, `split()`
        returns `0` at size 1 and a two-asteroid array otherwise.
  - [x] `bullet.js`: `checkDistance` frame-based expiry timing.
  - [x] `difficulty.js`: `increaseDiff`/`decreaseDiff` clamp at both ends of
        the range.
  - [x] `spaceship.js`: `shoot()` velocity direction math, `getBounds()`
        shape.
- [x] Wire `npm run lint`, `npm run format -- --check`, and `npm test` into
      the CI workflow added in [Phase 4](phase-4-build-security-hygiene.md).

## Open Questions

- None — this phase adds infrastructure the project lacks outright, with no
  design ambiguity.
