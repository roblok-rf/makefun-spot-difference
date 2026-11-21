// input.js — mouse and keyboard, and nothing else.
// A click on the canvas is translated into panel coordinates (which panel,
// where inside it) and handed to the world; keys drive start, hint, pause,
// mute and restart. The game never reads the pointer anywhere else.
import { LEFT_PANEL_X, RIGHT_PANEL_X, PANEL_Y, PANEL_WIDTH, PANEL_HEIGHT } from './config.js';
import { SCREEN_TITLE, SCREEN_PLAY, SCREEN_LEVEL_CLEAR, SCREEN_GAME_OVER, SCREEN_WIN } from './world.js';

/** Which panel a canvas point is in (0 left, 1 right), or null outside both. */
export function panelAt(x, y) {
  if (y < PANEL_Y || y > PANEL_Y + PANEL_HEIGHT) return null;
  if (x >= LEFT_PANEL_X && x <= LEFT_PANEL_X + PANEL_WIDTH) {
    return { panel: 0, x: x - LEFT_PANEL_X, y: y - PANEL_Y };
  }
  if (x >= RIGHT_PANEL_X && x <= RIGHT_PANEL_X + PANEL_WIDTH) {
    return { panel: 1, x: x - RIGHT_PANEL_X, y: y - PANEL_Y };
  }
  return null;
}

export class Input {
  constructor(canvas, world, sounds, onAdvance) {
    this.canvas = canvas;
    this.world = world;
    this.sounds = sounds;
    this.onAdvance = onAdvance;
    canvas.addEventListener('pointerdown', (event) => this.onPointerDown(event));
    window.addEventListener('keydown', (event) => this.onKeyDown(event));
  }

  /** Canvas pixels from a pointer event, whatever the page's scale. */
  canvasPoint(event) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * this.canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * this.canvas.height,
    };
  }

  onPointerDown(event) {
    this.sounds.ensure();
    const world = this.world;
    const now = performance.now();
    if (world.screen === SCREEN_TITLE) {
      this.sounds.click();
      this.onAdvance('start');
      return;
    }
    if (world.screen === SCREEN_LEVEL_CLEAR) {
      this.sounds.click();
      this.onAdvance('next');
      return;
    }
    if (world.screen === SCREEN_GAME_OVER || world.screen === SCREEN_WIN) {
      this.sounds.click();
      this.onAdvance('restart');
      return;
    }
    if (world.screen !== SCREEN_PLAY) return;
    const point = this.canvasPoint(event);
    const hit = panelAt(point.x, point.y);
    if (hit === null) return;
    const result = world.click(hit.panel, hit.x, hit.y, now);
    if (result === 'found') this.sounds.find();
    if (result === 'miss') this.sounds.miss();
  }

  onKeyDown(event) {
    const world = this.world;
    const key = event.key.toLowerCase();
    if (key === 'enter' || key === ' ') {
      event.preventDefault();
      this.sounds.ensure();
      if (world.screen === SCREEN_TITLE) this.onAdvance('start');
      else if (world.screen === SCREEN_LEVEL_CLEAR) this.onAdvance('next');
      else if (world.screen === SCREEN_GAME_OVER || world.screen === SCREEN_WIN) this.onAdvance('restart');
      return;
    }
    if (key === 'h') {
      const result = world.useHint(performance.now());
      if (result === 'hint') this.sounds.hint();
      return;
    }
    if (key === 'p') {
      if (world.screen === SCREEN_PLAY) world.paused = !world.paused;
      return;
    }
    if (key === 'm') {
      this.sounds.setMuted(!this.sounds.muted);
      world.muted = this.sounds.muted;
      return;
    }
    if (key === 'r') {
      if (world.screen === SCREEN_PLAY) {
        world.startGame();
        this.sounds.click();
      }
    }
  }
}
