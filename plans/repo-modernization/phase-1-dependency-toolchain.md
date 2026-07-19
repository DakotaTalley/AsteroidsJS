# Phase 1: Build Tooling Migration (webpack → Vite)

Part of [Repo Modernization](../repo-modernization.md).

## Context

All six `devDependencies` are behind by at least one major version, and
`npm audit` against the committed lockfile reports **31 vulnerabilities (2
critical, 14 high, 10 moderate, 5 low)**, entirely in transitive
`devDependencies` pulled in by `webpack-dev-server` 4.x (`express` /
`body-parser` / `ws` / `ajv` / `brace-expansion` chain).

Rather than bump webpack in place, this phase replaces it with **Vite**:

- `src/` is already clean ESM (`import`/`export default` throughout) with a
  single entry point (`src/index.js`) — there's no framework, TypeScript, or
  exotic asset pipeline here that would need webpack's plugin ecosystem.
- Vite's dev server needs no `express`/`ws`/`ajv` chain, so the vulnerability
  surface `npm audit` is flagging goes away rather than getting patched.
- Vite requires an `index.html` at the project root as its entry and copies
  a `public/` folder verbatim into `dist/` — which is exactly the
  `HtmlWebpackPlugin` + `copy-webpack-plugin` setup [Phase
  4](phase-4-build-security-hygiene.md) was going to hand-add to fix
  `dist/index.html`/CSS/audio being hand-maintained instead of generated
  (see that file's original context for the full problem description). This
  phase absorbs that relocation work since it comes for free with the
  migration — Phase 4 no longer needs to touch the bundler.
- Vite has first-class library mode (`build.lib`), which is a better fit
  than webpack if `src/lib/GameLib` is ever pulled out into its own
  engine repo, per the original generalization intent that was never
  completed.

There is also no `engines` field or `.nvmrc` pinning a supported Node
version.

## Critical Files

- [package.json](../../package.json) — replace webpack deps with `vite`
- [package-lock.json](../../package-lock.json)
- [webpack.common.js](../../webpack.common.js) / [webpack.dev.js](../../webpack.dev.js) / [webpack.prod.js](../../webpack.prod.js) — delete
- [dist/index.html](../../dist/index.html) — hand-authored; move to project
  root as Vite's entry template
- [dist/style/Asteroids.css](../../dist/style/Asteroids.css) — move to `public/style/`
- [dist/assets/](../../dist/assets/) — `.wav` files; move to `public/assets/`
- [.gitignore](../../.gitignore) — currently doesn't exclude `dist/`
- [src/models/sound.js](../../src/models/sound.js) — loads `assets/*.wav` by
  relative path; confirm paths still resolve once assets move to `public/`

## Approach

- [ ] Move `dist/index.html` to the project root, replace its two
      `<script src="./*.bundle.js">` tags with a single
      `<script type="module" src="/src/index.js"></script>`.
- [ ] Move `dist/style/Asteroids.css` → `public/style/Asteroids.css` and
      `dist/assets/*.wav` → `public/assets/`; confirm the paths
      `src/models/sound.js` and the moved `index.html` reference still match.
- [ ] Add `vite.config.js` with `base: '/AsteroidsJS/'` (required — this
      deploys to `jdtalley.github.io/AsteroidsJS/`, a subpath, not a domain
      root). No other config should be needed.
- [ ] Delete `webpack.common.js`, `webpack.dev.js`, `webpack.prod.js`.
- [ ] Update `package.json`:
  - Remove `webpack`, `webpack-cli`, `webpack-dev-server`, `webpack-merge`.
  - Add `vite` (latest).
  - Bump `gh-pages` 5 → 6, `prettier` 2.8.7 → 3.x (run
    `npx prettier --write .` once after upgrading and commit the reformat
    separately from any logic changes in other phases).
  - Scripts: `"start": "vite"`, `"build": "vite build"`, `"deploy": "npm run
    build && gh-pages -d dist"`. Drop `watch` (Vite's dev server replaces it).
- [ ] Add `dist/` to `.gitignore` and `git rm -r --cached dist` — Vite fully
      regenerates `dist/` from `src/`/`public/`/root `index.html` on every
      build, so it no longer needs to be committed. `npm run deploy`
      (`gh-pages -d dist`) remains the actual publish path and already
      builds fresh before pushing to the `gh-pages` branch.
- [ ] Run `npm run start` and confirm the dev server serves a working game
      (movement, shooting, sound, collisions, pause).
- [ ] Run `rm -rf dist && npm run build`, then serve `dist/` and confirm the
      production build is fully reproduced from source with no missing
      HTML/CSS/audio.
- [ ] Re-run `npm audit` and confirm 0 critical/high remain. Document any
      remaining moderate/low findings that have no fix available yet rather
      than silently ignoring them.
- [ ] Add an `"engines"` field to `package.json` pinning the supported Node
      range, and add a matching `.nvmrc`.
- [ ] Regenerate `package-lock.json` cleanly (`npm install`) and commit it
      alongside the dependency changes.
- [ ] Update the README's build/dev/deploy instructions to match the new
      scripts if they reference webpack by name.

## Open Questions

- None — Vite needs no particular Node floor beyond what a current LTS
  already provides, so there's no equivalent to the old "does
  webpack-dev-server 6.x need a higher Node floor" risk this phase used to
  carry.
