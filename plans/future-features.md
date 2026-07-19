# Future Features

Backlog of feature ideas not yet scheduled for implementation. Each entry
should get its own detailed plan (see the `plan-feature` skill) when work on
it actually starts.

## Instructions on Start Screen

Move the current static instructions text (in the `index.html` wrapper below
the canvas: controls for movement, shooting, pause) into the in-game start
screen shown by `drawMessage`/`canvas.drawPaused` (`src/index.js`,
`src/lib/canvas.js`) instead of, or in addition to, the page body. Add a way
to view them again without restarting:

- A button/key on the start (new-game/difficulty-select) screen.
- A button/key in the pause menu to re-open the instructions overlay.

Needs a way to distinguish "instructions" state from "paused" and
"choose difficulty" state in the existing `paused`/`newGame` flags, or a new
state variable, plus canvas rendering for the instructions text itself
(currently only in HTML/CSS, not drawn on canvas).

## Settings Menu (Sound Toggle, Volume, High Score Reset)

Add a settings menu/panel with:

- Sound on/off toggle, wired to the `Sound` model (`src/models/sound.js`) —
  likely a mute flag checked in `play()`, or setting `volume` to 0.
- Volume slider, replacing the hardcoded per-effect volumes currently passed
  into `new Sound(src, vol)` in `src/index.js` (e.g. `0.1` for
  `pewSound`, `0.25` for `boomSound`) with a shared, adjustable value.
- Relocate the "Reset High Score" button/dialog (`#reset-high`,
  `#reset-high-dialog` in `index.html`) here instead of the page body, so it
  lives alongside other game settings.

Likely reuses the `<dialog>` pattern established for the high-score reset
confirmation.
