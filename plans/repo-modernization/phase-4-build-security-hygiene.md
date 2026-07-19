# Phase 4: Security & Repo Hygiene

Part of [Repo Modernization](../repo-modernization.md).

## Context

[Phase 1](phase-1-dependency-toolchain.md) migrates the build tool from
webpack to Vite, and as part of that migration relocates `dist/index.html`,
`dist/style/Asteroids.css`, and `dist/assets/*.wav` out of `dist/` (they were
previously hand-authored and committed alongside generated bundle output —
`npm run build` didn't actually reproduce them) into a root `index.html` +
`public/` that Vite builds from directly. `dist/` is also untracked and
gitignored as part of that phase, since Vite fully regenerates it.

This phase picks up once that's done: it's the security-hardening and CI
work that's independent of which bundler is in use.

Separately: no CI exists to catch any of this (no `.github/workflows/`), and
there's no CSP or other baseline web hardening on the served page, which
loads a cross-origin Google Fonts stylesheet.

Also separate from the gh-pages deploy (which always serves whatever's
current on `master`): a tag-triggered release workflow that packages `dist/`
as a downloadable, versioned artifact attached to a GitHub Release. There's
one existing tag (`v1.0`) but no process behind it — this only pays off once
versioning/changelog discipline exists (see Open Questions).

## Critical Files

- [index.html](../../index.html) — root entry template (post-Phase-1); CSP
  meta tag goes here
- [package.json](../../package.json) — `deploy` script assumes `dist/` is
  freshly built (already true post-Phase-1); `"version"` needs to start
  tracking actual releases for the release workflow below
- `CHANGELOG.md` — doesn't exist yet; add alongside the release workflow
- `.github/workflows/ci.yml` / `.github/workflows/release.yml` — new

## Approach

- [x] Confirm [Phase 1](phase-1-dependency-toolchain.md) has landed —
      `index.html` and `public/` should already exist at the repo root
      before starting this phase.
- [x] Self-host the Turret Road font instead of the Google Fonts CDN
      `<link>` — removes a third-party render-blocking request and stops
      leaking visitor IPs to Google on every page load. Done ahead of this
      phase directly on the current hand-authored files: the latin-subset
      `.woff2` lives at `dist/assets/fonts/TurretRoad-Regular.woff2`,
      referenced via `@font-face` in `dist/style/Asteroids.css`, and the
      `<link href="https://fonts.googleapis.com/...">` tag is removed from
      `dist/index.html`. [Phase 1](phase-1-dependency-toolchain.md)'s
      relocation of these files into root `index.html` + `public/` should
      carry `assets/fonts/` along unchanged.
- [x] Add a `Content-Security-Policy` meta tag to `index.html`, scoped to
      `self` — no external font origin is needed now that the font is
      self-hosted. Landed as `default-src 'self'`; verified via
      `vite preview` that every resource the page references (stylesheet,
      JS bundle, self-hosted font, both `.wav` sound effects) is
      same-origin and resolves under that policy.
- [x] Add a GitHub Actions workflow (`.github/workflows/ci.yml`) that runs
      `npm ci` and `npm run build` on every push/PR; extend it with
      lint/test once [Phase 6](phase-6-tooling-testing.md) lands.
- [x] Add a release job to the same workflow (or a separate
      `.github/workflows/release.yml`), triggered on `v*` tag push: run
      `npm ci && npm run build`, zip `dist/`, and attach it to a GitHub
      Release (e.g. via `softprops/action-gh-release`). This is additive to
      the existing gh-pages deploy, not a replacement — gh-pages continues to
      publish "current `master`"; this publishes an addressable, downloadable
      snapshot per tag.
      - Before wiring this up, `package.json`'s `"version"` (currently frozen
        at `1.0.0` since the `v1.0` tag) needs to actually track releases,
        and a `CHANGELOG.md` needs to exist so each Release's notes have
        something to draw from — bump the version and update the changelog
        as part of the same commit that gets tagged, not after the fact.
        Neither exists yet; add both before or alongside this step rather
        than shipping the workflow with nothing to reference.
        Resolved: version bumped to `1.1.0` and `CHANGELOG.md` added
        (Keep a Changelog format) with a `[1.1.0]` entry covering
        Phases 1–4.

## Open Questions

- ~~Versioning/changelog process (semver bump + `CHANGELOG.md` entry per
  release) doesn't exist yet and isn't otherwise in scope for this phase —
  needs a decision on where that discipline gets introduced (this phase vs.
  a prerequisite step) before the release workflow above is wired up.~~
  Resolved: introduced in this phase, alongside the release workflow —
  see the checklist item above.
