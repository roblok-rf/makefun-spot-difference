[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/roblok-rf/makefun-spot-difference/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/roblok-rf/makefun-spot-difference/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

# Spot the Difference — Five Little Worlds

A complete, original spot-the-difference game for the make.fun bounty
**best-spot-the-difference-game-20261121-0451**. It plays offline in a desktop
browser from its own static files: no network request, no library, no build step.

## How to play

Open `game/index.html` (or serve `game/` with `node serve.ts` and open
http://localhost:8080). Two near-identical pictures sit side by side. Click a
difference on either picture to circle it in red.

- **5 levels, 7 differences each** — a cottage kitchen, a harbour at sunset, a
  forest camp, a moon-base lab and a grand library. 35 differences in all.
- **The clock is always running** — 120s, 100s, 90s, 75s, then 60s. Run out of
  time and the level ends.
- **Score** — +100 per find, multiplied by a combo (up to ×2.5) for streaks;
  wrong clicks cost 25 points and break the combo; finishing a level pays a
  time bonus plus 250.
- **Hints** — H spends one of 3 hints per level (50 points) and pulses a ring
  around one unfound difference.
- **Keys** — H hint · P pause · M mute · R restart · Enter start / next.
- **Sound** — every sound is synthesised with WebAudio: chimes, buzzes and
  arpeggios. No audio files.

## The art

Every scene is original vector art drawn in canvas code (`game/src/scenes.js`).
The left panel is drawn with no differences applied; the right panel is the
same drawing with exactly the level's 7 differences applied — missing objects,
moved hands, changed colours, a lit lamp gone dark. Fair by construction: the
two pictures can only differ where the difference list says they do.

## Files

| File | Job |
| --- | --- |
| `main.ts` | Entrypoint: copies `game/` + `screenshots/` to `/output`, writes `dossier.json` |
| `serve.ts` | Tiny static server for local play |
| `vendor/makefun-game.ts` | The kit's dossier library, unchanged |
| `game/index.html` | The page shell |
| `game/style.css` | Page chrome around the canvas |
| `game/src/config.js` | Levels, scoring, geometry, colours |
| `game/src/random.js` | Seeded RNG |
| `game/src/scenes.js` | The five scenes and their differences |
| `game/src/world.js` | Game state and rules |
| `game/src/render.js` | Canvas drawing: HUD, panels, markers, screens |
| `game/src/input.js` | Mouse and keyboard |
| `game/src/audio.js` | Synthesised WebAudio sounds |
| `game/src/shots.js` | Deterministic screenshot scenes (`?shot=start\|play\|end`) |
| `game/src/main.js` | Bootstrap and frame loop |
| `screenshots/` | Real renders of the game's own code in headless Chrome |
| `MODELS.md` | The 15 game concepts studied; model 11 is this game |

## Screenshots

`1-play.jpg` is the cover: level 2 mid-hunt, three differences circled, four
still unfound, "4 differences left" in the counter. `2-start.jpg` is the title
screen; `3-end.jpg` is the win screen. All three are staged by the game's own
code (`?shot=play|start|end`) and must be rendered in a real browser at
1280×800 — see TRANSCRIPT.md "Screenshot blocker" for the pending step.
To retake them: `node serve.ts`, then screenshot
`http://localhost:8080/index.html?shot=play&seed=1` (and `start`, `end`) at
1280×800 and save as JPEG under 256 KiB.

## Playtest

The game logic was smoke-tested in Node with a mock 2D context (`/tmp/smoke-test.mjs`,
not part of the entry): all five scenes draw, left and right panels differ by
exactly their 7 differences, and found / miss / already-found / hint clicks
behave as specified.

## License

MIT — see `LICENSE`.
