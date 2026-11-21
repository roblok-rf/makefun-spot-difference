// main.js — the bootstrap: build the world, the renderer, the sounds and the
// input, then run the frame loop. A ?shot=start|play|end query stages a
// deterministic screenshot scene instead of starting live play; ?seed is
// accepted and ignored by the scenes (they are seeded internally).
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './config.js';
import { World, SCREEN_PLAY, SCREEN_LEVEL_CLEAR, SCREEN_WIN } from './world.js';
import { Renderer } from './render.js';
import { SoundBank } from './audio.js';
import { Input } from './input.js';
import { stageShot } from './shots.js';

const canvas = document.getElementById('game');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const world = new World();
const renderer = new Renderer(canvas);
const sounds = new SoundBank();

/** What a click or Enter does on a non-play screen. */
function advance(action) {
  if (action === 'start') {
    world.startGame();
    sounds.click();
  } else if (action === 'next') {
    world.nextLevel();
    sounds.click();
  } else if (action === 'restart') {
    world.startGame();
    sounds.click();
  }
}

new Input(canvas, world, sounds, advance);

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
if (shot) {
  stageShot(shot, world);
  renderer.draw(world, performance.now());
} else {
  let last = performance.now();
  let lastTickSecond = -1;
  let previousScreen = world.screen;
  function frame(now) {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    const event = world.tick(dt);
    if (event === 'time-up') sounds.miss();
    // Play each screen-change jingle exactly once, on the transition into it.
    if (world.screen !== previousScreen) {
      if (world.screen === SCREEN_LEVEL_CLEAR) sounds.levelClear();
      if (world.screen === SCREEN_WIN) sounds.win();
      previousScreen = world.screen;
    }
    const second = Math.ceil(world.timeLeft);
    if (world.screen === SCREEN_PLAY && world.timeLeft <= 15 && second !== lastTickSecond) {
      lastTickSecond = second;
      sounds.tick();
    }
    world.pruneMarks(now);
    renderer.draw(world, now);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
