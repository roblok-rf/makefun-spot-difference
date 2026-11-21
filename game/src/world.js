// world.js — the game's state and rules, with no drawing in it.
// A World holds which screen is showing, which level is being played, which
// differences are found, the score, the combo, the clock and the hints. It
// answers clicks with found / miss / already-found, and it knows when a level
// or the whole game is over.
import {
  LEVELS,
  FIND_POINTS,
  COMBO_STEP,
  COMBO_MAX,
  MISS_POINTS,
  HINTS_PER_LEVEL,
  HINT_POINTS,
  TIME_BONUS_PER_SECOND,
  LEVEL_CLEAR_BONUS,
  CLICK_TOLERANCE,
  HINT_MS,
  BEST_SCORE_KEY,
} from './config.js';
import { SCENES } from './scenes.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_LEVEL_CLEAR = 'level-clear';
export const SCREEN_GAME_OVER = 'game-over';
export const SCREEN_WIN = 'win';

/** A wrong-click marker: where it was, and when it fades (epoch ms). */
function missMark(x, y, panel, until) {
  return { x, y, panel, until };
}

export class World {
  constructor() {
    this.screen = SCREEN_TITLE;
    this.levelIndex = 0;
    this.found = new Set();
    this.score = 0;
    this.streak = 0;
    this.misses = 0;
    this.hintsLeft = HINTS_PER_LEVEL;
    this.timeLeft = LEVELS[0].seconds;
    this.timeUsed = 0;
    this.paused = false;
    this.muted = false;
    this.best = 0;
    this.message = '';
    this.messageUntil = 0;
    this.missMarks = [];
    this.hintTarget = null;
    this.hintUntil = 0;
    this.levelBonus = 0;
    this.lastFindLabel = '';
    this.shakeUntil = 0;
    try {
      this.best = Number(window.localStorage.getItem(BEST_SCORE_KEY) || 0) || 0;
    } catch {
      this.best = 0;
    }
  }

  get level() {
    return LEVELS[this.levelIndex];
  }

  get scene() {
    return SCENES[this.level.scene];
  }

  get differences() {
    return this.scene.differences;
  }

  get foundCount() {
    return this.found.size;
  }

  get remaining() {
    return this.differences.length - this.found.size;
  }

  /** The combo multiplier from the current streak, capped. */
  get combo() {
    return Math.min(COMBO_MAX, 1 + this.streak * COMBO_STEP);
  }

  /** Start a fresh game from level 1. */
  startGame() {
    this.score = 0;
    this.streak = 0;
    this.misses = 0;
    this.levelIndex = 0;
    this.startLevel();
    this.screen = SCREEN_PLAY;
  }

  /** Set up the current level: clear the finds, reset the clock and hints. */
  startLevel() {
    this.found = new Set();
    this.timeLeft = this.level.seconds;
    this.timeUsed = 0;
    this.hintsLeft = HINTS_PER_LEVEL;
    this.paused = false;
    this.missMarks = [];
    this.hintTarget = null;
    this.message = this.level.brief;
    this.messageUntil = performance.now() + 4000;
    this.levelBonus = 0;
    this.lastFindLabel = '';
  }

  /** Advance the clock by `dt` seconds; returns 'time-up' when the level ends. */
  tick(dt) {
    if (this.screen !== SCREEN_PLAY || this.paused) return null;
    this.timeLeft = Math.max(0, this.timeLeft - dt);
    this.timeUsed += dt;
    if (this.timeLeft <= 0) {
      this.screen = SCREEN_GAME_OVER;
      this.saveBest();
      return 'time-up';
    }
    return null;
  }

  /**
   * A click at panel coordinates (`panel` 0 left, 1 right; x, y in panel pixels).
   * Returns 'found', 'miss' or 'already' — a click on a found difference does
   * nothing and costs nothing.
   */
  click(panel, x, y, now) {
    if (this.screen !== SCREEN_PLAY || this.paused) return null;
    for (const diff of this.differences) {
      if (this.found.has(diff.id)) continue;
      const dx = x - diff.x;
      const dy = y - diff.y;
      if (dx * dx + dy * dy <= (diff.r + CLICK_TOLERANCE) * (diff.r + CLICK_TOLERANCE)) {
        this.found.add(diff.id);
        this.streak += 1;
        const points = Math.round(FIND_POINTS * this.combo);
        this.score += points;
        this.lastFindLabel = diff.label;
        this.message = `Found ${diff.label}! +${points}`;
        this.messageUntil = now + 2200;
        if (this.remaining === 0) this.clearLevel(now);
        return 'found';
      }
    }
    for (const diff of this.differences) {
      if (!this.found.has(diff.id)) continue;
      const dx = x - diff.x;
      const dy = y - diff.y;
      if (dx * dx + dy * dy <= (diff.r + CLICK_TOLERANCE) * (diff.r + CLICK_TOLERANCE)) {
        return 'already';
      }
    }
    this.misses += 1;
    this.streak = 0;
    this.score = Math.max(0, this.score - MISS_POINTS);
    this.missMarks.push(missMark(x, y, panel, now + 600));
    this.shakeUntil = now + 180;
    this.message = `Not there — -${MISS_POINTS} points`;
    this.messageUntil = now + 1800;
    return 'miss';
  }

  /** Called when the last difference of a level is found. */
  clearLevel(now) {
    const timeBonus = Math.round(this.timeLeft) * TIME_BONUS_PER_SECOND;
    this.levelBonus = timeBonus + LEVEL_CLEAR_BONUS;
    this.score += this.levelBonus;
    if (this.levelIndex === LEVELS.length - 1) {
      this.screen = SCREEN_WIN;
      this.saveBest();
    } else {
      this.screen = SCREEN_LEVEL_CLEAR;
    }
    this.message = '';
    void now;
  }

  /** Move to the next level after a clear. */
  nextLevel() {
    this.levelIndex += 1;
    this.startLevel();
    this.screen = SCREEN_PLAY;
  }

  /** Spend a hint: pulse a ring around one unfound difference. Costs points. */
  useHint(now) {
    if (this.screen !== SCREEN_PLAY || this.paused) return null;
    if (this.hintsLeft <= 0) {
      this.message = 'No hints left in this level';
      this.messageUntil = now + 1800;
      return 'none';
    }
    const unfound = this.differences.filter((diff) => !this.found.has(diff.id));
    if (unfound.length === 0) return null;
    this.hintsLeft -= 1;
    this.score = Math.max(0, this.score - HINT_POINTS);
    this.hintTarget = unfound[Math.floor(Math.random() * unfound.length)];
    this.hintUntil = now + HINT_MS;
    this.message = `Hint: look near the ${this.hintTarget.label} — -${HINT_POINTS} points`;
    this.messageUntil = now + 2200;
    return 'hint';
  }

  /** The difference the hint ring is currently pointing at, or null. */
  activeHint(now) {
    if (this.hintTarget === null || now > this.hintUntil) return null;
    return this.hintTarget;
  }

  /** Remember the best score across games, on this machine. */
  saveBest() {
    if (this.score > this.best) {
      this.best = this.score;
      try {
        window.localStorage.setItem(BEST_SCORE_KEY, String(this.best));
      } catch {
        // Private browsing or no storage: the best score just does not persist.
      }
    }
  }

  /** Drop expired miss marks. */
  pruneMarks(now) {
    this.missMarks = this.missMarks.filter((mark) => now < mark.until);
  }
}
