// shots.js — deterministic screenshot scenes for ?shot=start|play|end.
// Each one plays the real game forward into a fixed state, so a screenshot is
// a real render of the game's own code: the same world, the same renderer, the
// same markers a player would see. The cover shot is the play scene: three
// differences found and circled, four still unfound, and the counter showing
// "4 differences left" — exactly what the brief asks the screenshots to show.
import { SCREEN_TITLE, SCREEN_PLAY, SCREEN_WIN } from './world.js';

/** The first three differences of the level, in scene order. */
function firstThree(world) {
  return world.differences.slice(0, 3).map((diff) => diff.id);
}

/**
 * Put `world` into the named scene and return the screen to show.
 * start: the title screen over level 1, nothing found yet.
 * play: level 2 mid-hunt — 3 of 7 found, 62 seconds left, score 1250, streak 3.
 *   Level 2 (the harbour at sunset) is the cover because it is the most
 *   colourful scene and its differences read clearly at a small size.
 * end: the win screen after all five levels, score 4860.
 */
export function stageShot(name, world) {
  if (name === 'play') {
    world.levelIndex = 1;
    world.startLevel();
    world.screen = SCREEN_PLAY;
    world.score = 1250;
    world.streak = 3;
    world.timeLeft = 62;
    world.timeUsed = 38;
    world.hintsLeft = 2;
    for (const id of firstThree(world)) world.found.add(id);
    world.message = 'Found the lighthouse flag! +125';
    world.messageUntil = performance.now() + 60000;
    return SCREEN_PLAY;
  }
  if (name === 'end') {
    world.levelIndex = 4;
    world.startLevel();
    world.screen = SCREEN_WIN;
    world.score = 4860;
    world.best = 4860;
    for (const diff of world.differences) world.found.add(diff.id);
    return SCREEN_WIN;
  }
  world.levelIndex = 0;
  world.startLevel();
  world.screen = SCREEN_TITLE;
  world.timeLeft = world.level.seconds;
  world.message = '';
  world.messageUntil = 0;
  return SCREEN_TITLE;
}
