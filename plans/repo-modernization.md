# Repo Modernization

Multi-phase effort to modernize AsteroidsJS: eliminate dead/broken code, fix
live gameplay bugs, update the outdated build toolchain, close known
dependency vulnerabilities, and add the testing/lint/CI infrastructure the
project currently lacks entirely.

## Phases

- [x] [Build Tooling Migration (webpack → Vite)](repo-modernization/phase-1-dependency-toolchain.md) —
      replace webpack/webpack-cli/webpack-dev-server/webpack-merge with Vite,
      clearing the 31 known `npm audit` vulnerabilities (2 critical, 14 high) at
      the root rather than patching them, and along the way stop
      hand-maintaining `dist/index.html`/CSS/assets alongside generated bundles
      so `npm run build` fully reproduces the deployable site from source; also
      bumps `gh-pages`/`prettier` past their major-version gaps.
- [x] [Dead Code Removal & Consolidation](repo-modernization/phase-2-dead-code-removal.md) —
      delete the unused, broken `src/controllers/asteroids.js` duplicate and the
      never-wired, syntactically-broken `src/lib/GameLib/` scaffold;
      `src/index.js` is the only real entry point.
- [x] [Bug Fixes in Live Game Code](repo-modernization/phase-3-bug-fixes.md) —
      fix array-mutation-during-iteration bugs in the bullet/collision loops, the
      rapid-fire audio replay bug, and other correctness issues in the code that
      actually ships.
- [x] [Security & Repo Hygiene](repo-modernization/phase-4-build-security-hygiene.md) —
      add CI plus baseline web hardening (CSP, font hosting), building on the
      root `index.html`/`public/` layout Phase 1 already establishes.
- [x] [Performance](repo-modernization/phase-5-performance.md) — cache the
      per-frame `localStorage` high-score reads and apply the project's own
      canvas devicePixelRatio rule. (The WASM feasibility question originally
      scoped as a research sub-section of this phase moved to
      [2.0 Features](2.0-features.md#wasm-feasibility-investigation) —
      forward-looking research, not part of this modernization pass.)
- [ ] [Developer Tooling & Testing](repo-modernization/phase-6-tooling-testing.md) —
      add ESLint, replace the always-failing `npm test` stub with real unit
      tests for the pure-logic model classes, and wire lint/test into CI.

Phases 1–2 are prerequisites for everything after them (clean, deduplicated
code on current tooling). Phases 3–6 can proceed in any order, in parallel,
once those land.
