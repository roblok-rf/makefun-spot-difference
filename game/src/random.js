// random.js — a tiny seeded random generator (mulberry32) plus helpers.
// The game is fully deterministic for a given seed, so the screenshot scenes
// (?shot=play and friends) always render the same frame, and a level's scene
// never changes under the player while they hunt. The library scenes use
// fixed seeds (camp: 42, moonbase: 7, library shelves: 11 and 23) so their
// stars and book spines are identical on every load.
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A random float in [min, max). */
export function range(rng, min, max) {
  return min + rng() * (max - min);
}

/** A random integer in [min, max]. */
export function rangeInt(rng, min, max) {
  return Math.floor(range(rng, min, max + 1));
}

/** One element of `items`, picked at random. */
export function pick(rng, items) {
  return items[Math.floor(rng() * items.length)];
}

/** A new array with `items` shuffled (Fisher–Yates). */
export function shuffle(rng, items) {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = out[i];
    out[i] = out[j];
    out[j] = tmp;
  }
  return out;
}
