# Spot the Difference — 15 Game Concepts (ATM)

Bounty: **best-spot-the-difference-game-20261121-0451** — "Make the best spot the
difference game", $50, deadline Sat 21 Nov 2026 23:51 +07. No entries existed when
this bounty opened, so there was no top 10 to study: these 15 concepts are designed
from the brief and the judge's five criteria instead.

Judge's criteria (most important first):
1. A complete spot-the-difference game, shown in screenshots: two near-identical
   pictures side by side, markers on the differences found, several still unfound,
   and a counter of how many remain.
2. Fun and depth: differences that are fair but not obvious, sets that raise the
   difficulty, and a hunt that stays fun after ten finds.
3. Feel and polish: a mark that satisfies on each find, a hint that behaves, and
   time pressure you can feel in the frame.
4. Look and originality: scenes worth studying, differences hidden by design, and
   a style that carries both panels.
5. Structure: the game's own source split into files with one clear job each,
   named for what they do.

## The 15 models

### Model 1 — Classic Photo Pair
Two static photographs side by side, 7 differences, click to circle. No timer, no
score. The genre's baseline: honest but flat. Fails criteria 2 and 3 outright.

### Model 2 — Timed Arcade Rush
One scene, 60 seconds, 10 differences, points per find, combo multiplier for
streaks, time bonus at the end. Strong time pressure (criterion 3) but a single
scene gets stale (criterion 2).

### Model 3 — Detective Case Files
A story wrapper: each level is a "case" (a burglary, a missing cat) with a short
briefing, and the differences are "clues". Finds are logged in an evidence list.
Great flavour (criterion 4) but story text can crowd the play frame.

### Model 4 — Cozy Cottage Scenes
Warm, hand-drawn-feel vector scenes (kitchen, garden, library) with soft palettes.
Differences hide in clutter: a missing spoon, a changed curtain stripe. High
"scenes worth studying" (criterion 4); needs careful fairness so clutter never
becomes noise.

### Model 5 — Spot It in the Wild (Nature)
Outdoor scenes (forest camp, harbour, mountain lake) with animals and weather.
Differences are natural: a bird that moved, a cloud that vanished. Pretty, but
natural scenes make "fair but not obvious" hard to tune.

### Model 6 — Sci-Fi Moon Base
A space-station lab with blinking panels, robots and portholes. Differences are
mechanical: a gauge needle, a missing bolt, a swapped wire colour. Distinctive
look (criterion 4); risks looking cold next to warmer scenes.

### Model 7 — Difficulty Ladder
Five levels, each harder: fewer seconds, subtler differences (a shade change, a
one-pixel shift), more differences per level. Directly answers criterion 2's
"sets that raise the difficulty".

### Model 8 — Hint Economy
Three hints per level; a hint pulses a ring around one unfound difference but
costs 50 points and breaks the combo. "A hint that behaves" (criterion 3):
limited, costly, never free, never automatic.

### Model 9 — Three-Strikes Lives
Three wrong clicks and the level ends. Makes every click deliberate and raises
tension, but punishes exploring players; better as a soft penalty (score loss)
than a hard fail.

### Model 10 — Zen Mode (No Timer)
No clock, no score, just the hunt with gentle music. Relaxing, but the judge's
criterion 3 explicitly wants "time pressure you can feel in the frame", so Zen
can only be a side mode, never the core.

### Model 11 — Combined Best (THE SUBMITTED GAME)
**"Spot the Difference: Five Little Worlds"** — the best of models 1–10 fused:
- Five original procedurally-drawn scenes (cottage kitchen, harbour at sunset,
  forest camp, moon-base lab, grand library), one per level, each with exactly
  7 fair, findable differences (model 4 + 5 + 6 art, model 1 honesty).
- Difficulty ladder (model 7): 120s → 100s → 90s → 75s → 60s; differences get
  subtler as levels progress; 35 finds in total, so the hunt stays fun after
  ten finds (criterion 2).
- Arcade scoring (model 2): +100 per find, combo multiplier up to ×5, time
  bonus, wrong click −25 and resets the combo (model 9, softened).
- Hint economy (model 8): 3 hints per level, pulsing ring, −50 points.
- Feel (criterion 3): satisfying ring-and-pop marker on every find, WebAudio
  chime/buzz/arpeggio (synthesised, no files), ticking clock, a timer bar that
  turns red under 15 seconds, pause, mute, keyboard shortcuts (H hint, M mute,
  P pause, R restart).
- Detective case-file framing (model 3, light): each level opens with a one-line
  case brief ("The harbour master's flag is missing — find what changed").
- Screenshots staged to show criterion 1 exactly: two panels side by side, 3
  differences circled, 4 still unfound, "4 differences left" counter visible.
- Source split into one-job files (criterion 5): config, random, scenes,
  world, render, input, audio, shots, main.

### Model 12 — Daily Challenge (Seeded)
A new scene every day from a seeded generator, with a shared leaderboard. Great
replay value, but a bounty entry is judged on one build, not a live service.

### Model 13 — Two-Player Race
Split screen, two players hunt the same pair; first to find all wins. Fun, but
needs two humans at one keyboard and doubles the input complexity.

### Model 14 — Magnifier Mode
A lens follows the mouse and zooms a patch of the picture. Helps with subtle
differences, but the judge's screenshots would show the lens, not the game.

### Model 15 — Sound Hunt
Differences are also audible: a ticking clock that stops, a bird that goes
silent. Original, but sound cannot be judged from screenshots, so it can only
support the visuals, never carry the game.

## Decision
Model 11 wins: it is the only concept that answers all five criteria at once,
and it is what this repository builds. Models 12–15 were rejected for this
bounty (live service, two humans, lens clutter, sound-only) but their best
ideas — seeded scenes, a hint that behaves, subtle-difference tuning — were
folded into model 11 where they fit. The cover screenshot is staged from
model 11 itself: level 2 mid-hunt, 3 differences circled, 4 still unfound,
"4 differences left" on the counter.
