// config.js — every tunable number of Spot the Difference: Five Little Worlds.
// One place for the canvas size, the panel geometry, the levels and the scoring,
// so a balance change never means hunting through the game logic.
export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 800;

// The two picture panels, side by side, with the HUD above and a message bar below.
export const PANEL_WIDTH = 600;
export const PANEL_HEIGHT = 560;
export const PANEL_Y = 120;
export const LEFT_PANEL_X = 20;
export const RIGHT_PANEL_X = 660;
export const PANEL_GAP = 40;

// How close a click must land to a difference to count (pixels, panel space).
export const CLICK_TOLERANCE = 14;
// How long a wrong-click X stays on screen (milliseconds).
export const MISS_MARK_MS = 600;
// How long a hint ring pulses around an unfound difference (milliseconds).
export const HINT_MS = 2600;

// The five levels: scene, case brief, time limit and the score a perfect run earns.
export const LEVELS = [
  {
    scene: 'cottage',
    title: 'Case 1 — The Cottage Kitchen',
    brief: 'Tea is on and the cat is asleep. Seven things changed while you blinked.',
    seconds: 120,
    differences: 7,
  },
  {
    scene: 'harbour',
    title: 'Case 2 — Harbour at Sunset',
    brief: 'The boats came in at dusk. Something on the quay is not as it was.',
    seconds: 100,
    differences: 7,
  },
  {
    scene: 'camp',
    title: 'Case 3 — The Forest Camp',
    brief: 'The fire is lit and the tents are up. The woods moved things around.',
    seconds: 90,
    differences: 7,
  },
  {
    scene: 'moonbase',
    title: 'Case 4 — Moon Base Lab',
    brief: 'All systems nominal — or so the computer claims. Check its work.',
    seconds: 75,
    differences: 7,
  },
  {
    scene: 'library',
    title: 'Case 5 — The Grand Library',
    brief: 'Thirty thousand books, and seven of them are lying. Find the lies.',
    seconds: 60,
    differences: 7,
  },
];

// Scoring: a find is worth FIND_POINTS times the combo (1 + streak * COMBO_STEP,
// capped at COMBO_MAX). A miss costs MISS_POINTS and breaks the streak. A hint
// costs HINT_POINTS. Finishing a level pays TIME_BONUS_PER_SECOND per second left.
export const FIND_POINTS = 100;
export const COMBO_STEP = 0.25;
export const COMBO_MAX = 2.5;
export const MISS_POINTS = 25;
export const HINTS_PER_LEVEL = 3;
export const HINT_POINTS = 50;
export const TIME_BONUS_PER_SECOND = 10;
export const LEVEL_CLEAR_BONUS = 250;

// The localStorage key the best score is saved under.
export const BEST_SCORE_KEY = 'spot-five-worlds-best';

// Colours of the UI chrome (the scenes carry their own palettes).
export const UI = {
  background: '#20242e',
  hudBackground: '#2b3040',
  panelBorder: '#f2e8d5',
  text: '#f5efe0',
  mutedText: '#b8b2a2',
  accent: '#ffb347',
  good: '#7ddc8a',
  bad: '#ff6b6b',
  timerLow: '#ff5d5d',
  marker: '#ff4757',
  markerGlow: 'rgba(255, 71, 87, 0.35)',
  hint: '#ffd32a',
};
