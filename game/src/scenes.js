// scenes.js — the five little worlds, drawn by hand in canvas code.
// Every scene is original vector art: no images, no files, nothing borrowed.
// Each scene function draws one picture of 600 by 560 pixels. It takes the set
// of differences to apply: the left panel is drawn with an empty set, the right
// panel with the differences of that level, so the two pictures are identical
// except for exactly the listed differences — fair by construction, and every
// difference is findable because its spot is recorded in the scene's list.
//
// A difference entry: { id, x, y, r, label } — the marker's centre and radius
// in panel pixels, and a plain name the game shows when it is found.
import { mulberry32 } from './random.js';

export const PANEL_W = 600;
export const PANEL_H = 560;

/** True when the difference `id` is applied on this panel. */
function diffOn(diffs, id) {
  return diffs.has(id);
}

function circle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function roundRect(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function line(ctx, x1, y1, x2, y2, color, width) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function triangle(ctx, x1, y1, x2, y2, x3, y3, fill) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

function text(ctx, str, x, y, size, color, align) {
  ctx.font = `bold ${size}px Georgia, serif`;
  ctx.fillStyle = color;
  ctx.textAlign = align || 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
}

/* ------------------------------------------------------------------ */
/* Scene 1 — The Cottage Kitchen                                       */
/* ------------------------------------------------------------------ */

const COTTAGE_DIFFS = [
  { id: 'sun', x: 118, y: 92, r: 28, label: 'the sun in the window' },
  { id: 'clock', x: 300, y: 88, r: 30, label: 'the clock hands' },
  { id: 'jar', x: 492, y: 148, r: 22, label: 'the jam jar on the shelf' },
  { id: 'curtain', x: 92, y: 190, r: 25, label: 'the curtain stripe' },
  { id: 'teapot', x: 252, y: 382, r: 35, label: 'the teapot colour' },
  { id: 'flower', x: 522, y: 428, r: 25, label: 'the flower in the pot' },
  { id: 'cat', x: 432, y: 472, r: 40, label: 'the sleeping cat' },
];

function drawCottage(ctx, diffs) {
  // Wall and floor.
  rect(ctx, 0, 0, 600, 380, '#f3e2c2');
  rect(ctx, 0, 380, 600, 180, '#b07a45');
  for (let i = 0; i < 6; i += 1) line(ctx, 0, 410 + i * 28, 600, 410 + i * 28, '#96642f', 2);
  // Framed picture of a hill.
  roundRect(ctx, 380, 60, 120, 80, 6, '#8b5e34');
  rect(ctx, 388, 68, 104, 64, '#a8d8a0');
  circle(ctx, 470, 84, 12, '#ffd94d');
  triangle(ctx, 388, 132, 420, 96, 452, 132, '#5b8c5a');
  triangle(ctx, 430, 132, 462, 100, 492, 132, '#4a7a4e');
  // Wall clock.
  circle(ctx, 300, 88, 34, '#fff8e7');
  ctx.beginPath();
  ctx.arc(300, 88, 34, 0, Math.PI * 2);
  ctx.strokeStyle = '#6b4a2b';
  ctx.lineWidth = 4;
  ctx.stroke();
  if (diffOn(diffs, 'clock')) {
    line(ctx, 300, 88, 300, 66, '#333', 3); // hands point to 12 and 6
    line(ctx, 300, 88, 300, 106, '#333', 3);
  } else {
    line(ctx, 300, 88, 314, 70, '#333', 3); // hands point to 2 and 10
    line(ctx, 300, 88, 284, 74, '#333', 3);
  }
  circle(ctx, 300, 88, 4, '#c0392b');
  // Window with curtains.
  roundRect(ctx, 60, 50, 140, 130, 8, '#7ec8e3');
  rect(ctx, 66, 56, 128, 118, '#bfe6f5');
  if (!diffOn(diffs, 'sun')) circle(ctx, 118, 92, 22, '#ffd94d');
  circle(ctx, 168, 80, 10, '#ffffff');
  circle(ctx, 150, 120, 14, '#ffffff');
  triangle(ctx, 66, 174, 110, 120, 150, 174, '#5b8c5a');
  triangle(ctx, 120, 174, 160, 128, 194, 174, '#4a7a4e');
  line(ctx, 130, 56, 130, 174, '#8b5e34', 4);
  line(ctx, 66, 115, 194, 115, '#8b5e34', 4);
  // Curtains: the stripe changes colour when the difference is on.
  rect(ctx, 44, 44, 26, 146, '#e74c3c');
  rect(ctx, 190, 44, 26, 146, '#e74c3c');
  rect(ctx, 52, 44, 10, 146, diffOn(diffs, 'curtain') ? '#27ae60' : '#f5efe0');
  rect(ctx, 198, 44, 10, 146, diffOn(diffs, 'curtain') ? '#27ae60' : '#f5efe0');
  // Shelf with jars.
  rect(ctx, 420, 170, 160, 12, '#8b5e34');
  roundRect(ctx, 432, 128, 30, 42, 6, '#d35400');
  roundRect(ctx, 468, 128, 30, 42, 6, '#e67e22');
  if (!diffOn(diffs, 'jar')) roundRect(ctx, 504, 128, 30, 42, 6, '#c0392b');
  roundRect(ctx, 540, 128, 30, 42, 6, '#8e44ad');
  // Table with a checked cloth.
  roundRect(ctx, 150, 360, 300, 26, 8, '#fff8e7');
  rect(ctx, 150, 386, 300, 90, '#e74c3c');
  for (let i = 0; i < 6; i += 1) {
    for (let j = 0; j < 3; j += 1) {
      if ((i + j) % 2 === 0) rect(ctx, 150 + i * 50, 386 + j * 30, 50, 30, '#f5efe0');
    }
  }
  // Teapot: blue on the left, red on the right.
  const pot = diffOn(diffs, 'teapot') ? '#c0392b' : '#2980b9';
  ellipse(ctx, 252, 382, 34, 24, pot);
  circle(ctx, 252, 352, 12, pot);
  triangle(ctx, 284, 372, 306, 362, 284, 388, pot);
  ctx.beginPath();
  ctx.arc(222, 378, 12, Math.PI * 0.5, Math.PI * 1.5);
  ctx.strokeStyle = pot;
  ctx.lineWidth = 6;
  ctx.stroke();
  circle(ctx, 252, 340, 5, '#f5efe0');
  // Two cups, one with steam.
  roundRect(ctx, 300, 372, 26, 20, 4, '#f5efe0');
  roundRect(ctx, 340, 372, 26, 20, 4, '#f5efe0');
  ctx.beginPath();
  ctx.moveTo(312, 366);
  ctx.quadraticCurveTo(308, 356, 314, 348);
  ctx.strokeStyle = '#b8b2a2';
  ctx.lineWidth = 3;
  ctx.stroke();
  // Potted plant on the sill: a flower only on the left.
  roundRect(ctx, 500, 430, 44, 36, 4, '#c0392b');
  triangle(ctx, 512, 430, 522, 396, 532, 430, '#27ae60');
  if (!diffOn(diffs, 'flower')) {
    circle(ctx, 522, 388, 10, '#ff7fbf');
    circle(ctx, 522, 388, 4, '#ffd94d');
  }
  // Rug and the sleeping cat.
  ellipse(ctx, 300, 512, 150, 34, '#9b59b6');
  ellipse(ctx, 300, 512, 110, 24, '#8e44ad');
  if (!diffOn(diffs, 'cat')) {
    ellipse(ctx, 432, 472, 42, 20, '#e67e22');
    circle(ctx, 466, 462, 14, '#e67e22');
    triangle(ctx, 458, 452, 462, 440, 468, 452, '#e67e22');
    triangle(ctx, 470, 452, 474, 440, 478, 452, '#e67e22');
    line(ctx, 398, 482, 372, 490, '#e67e22', 6);
  }
  // Hanging lamp.
  line(ctx, 300, 0, 300, 40, '#6b4a2b', 3);
  triangle(ctx, 270, 70, 330, 70, 300, 40, '#f39c12');
  circle(ctx, 300, 74, 8, '#fff3b0');
}

/* ------------------------------------------------------------------ */
/* Scene 2 — Harbour at Sunset                                         */
/* ------------------------------------------------------------------ */

const HARBOUR_DIFFS = [
  { id: 'cloud', x: 352, y: 68, r: 30, label: 'the cloud' },
  { id: 'gull', x: 198, y: 82, r: 22, label: 'the seagull' },
  { id: 'flag', x: 520, y: 160, r: 20, label: 'the lighthouse flag' },
  { id: 'lamp', x: 520, y: 191, r: 30, label: 'the lighthouse lamp' },
  { id: 'sail', x: 182, y: 330, r: 35, label: 'the sail colour' },
  { id: 'crate', x: 92, y: 432, r: 25, label: 'the crate on the pier' },
  { id: 'buoy', x: 420, y: 482, r: 20, label: 'the buoy' },
];

function drawHarbour(ctx, diffs) {
  // Sunset sky.
  const sky = ctx.createLinearGradient(0, 0, 0, 340);
  sky.addColorStop(0, '#ff9a56');
  sky.addColorStop(0.6, '#ff6b81');
  sky.addColorStop(1, '#7b5ea7');
  rect(ctx, 0, 0, 600, 340, '#ff9a56');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 600, 340);
  // Low sun and its reflection.
  circle(ctx, 300, 300, 46, '#ffd94d');
  rect(ctx, 280, 340, 40, 220, 'rgba(255, 217, 77, 0.25)');
  // Clouds.
  ellipse(ctx, 120, 60, 44, 16, '#ffe3d0');
  ellipse(ctx, 150, 52, 30, 12, '#ffe3d0');
  if (!diffOn(diffs, 'cloud')) {
    ellipse(ctx, 352, 68, 48, 16, '#ffe3d0');
    ellipse(ctx, 384, 58, 30, 12, '#ffe3d0');
  }
  // Seagulls.
  line(ctx, 180, 82, 192, 74, '#333', 3);
  line(ctx, 192, 74, 204, 82, '#333', 3);
  if (!diffOn(diffs, 'gull')) {
    line(ctx, 140, 110, 150, 103, '#333', 3);
    line(ctx, 150, 103, 160, 110, '#333', 3);
  }
  line(ctx, 430, 100, 442, 93, '#333', 3);
  line(ctx, 442, 93, 454, 100, '#333', 3);
  // Sea.
  rect(ctx, 0, 340, 600, 220, '#2c5f7c');
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    for (let x = 0; x <= 600; x += 20) {
      const y = 372 + i * 36 + Math.sin(x / 40 + i) * 5;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  // Lighthouse on the right cliff.
  rect(ctx, 480, 200, 80, 160, '#f5efe0');
  for (let i = 0; i < 3; i += 1) rect(ctx, 480, 224 + i * 48, 80, 24, '#e74c3c');
  rect(ctx, 470, 180, 100, 22, '#34495e');
  if (diffOn(diffs, 'lamp')) {
    circle(ctx, 520, 191, 11, '#7f8c8d');
    triangle(ctx, 520, 191, 600, 168, 600, 216, 'rgba(255, 240, 150, 0.08)');
  } else {
    circle(ctx, 520, 191, 11, '#ffd94d');
    triangle(ctx, 520, 191, 600, 168, 600, 216, 'rgba(255, 240, 150, 0.45)');
    circle(ctx, 520, 191, 18, 'rgba(255, 217, 77, 0.25)');
  }
  // Flag on the lighthouse: gone on the right.
  line(ctx, 520, 180, 520, 150, '#333', 3);
  if (!diffOn(diffs, 'flag')) triangle(ctx, 520, 150, 552, 158, 520, 166, '#c0392b');
  rect(ctx, 460, 360, 120, 40, '#6b4a2b');
  // Pier on the left.
  rect(ctx, 20, 400, 180, 16, '#8b5e34');
  rect(ctx, 30, 416, 12, 60, '#6b4a2b');
  rect(ctx, 170, 416, 12, 60, '#6b4a2b');
  if (!diffOn(diffs, 'crate')) {
    rect(ctx, 72, 402, 40, 30, '#c98a2e');
    line(ctx, 72, 417, 112, 417, '#8b5e34', 2);
  }
  rect(ctx, 118, 402, 40, 30, '#a06a1e');
  // Sailboat: its sail changes colour on the right.
  triangle(ctx, 182, 330, 182, 250, 238, 330, diffOn(diffs, 'sail') ? '#e74c3c' : '#f5efe0');
  triangle(ctx, 172, 330, 172, 268, 132, 330, diffOn(diffs, 'sail') ? '#c0392b' : '#e8e0cc');
  line(ctx, 182, 246, 182, 336, '#6b4a2b', 4);
  ellipse(ctx, 182, 336, 62, 12, '#8b5e34');
  // Rowboat.
  ellipse(ctx, 420, 430, 48, 12, '#7a4a21');
  circle(ctx, 396, 424, 8, '#e67e22');
  line(ctx, 396, 424, 380, 396, '#6b4a2b', 3);
  // Buoy bobbing in the water.
  if (!diffOn(diffs, 'buoy')) {
    circle(ctx, 420, 482, 12, '#e74c3c');
    triangle(ctx, 412, 472, 428, 472, 420, 452, '#e74c3c');
    line(ctx, 420, 452, 420, 442, '#333', 2);
  }
  // Distant headland.
  triangle(ctx, 0, 340, 90, 260, 190, 340, '#5b4a6b');
}

/* ------------------------------------------------------------------ */
/* Scene 3 — The Forest Camp                                           */
/* ------------------------------------------------------------------ */

const CAMP_DIFFS = [
  { id: 'moon', x: 108, y: 68, r: 28, label: 'the moon' },
  { id: 'owl', x: 482, y: 118, r: 28, label: 'the owl on the branch' },
  { id: 'lantern', x: 382, y: 202, r: 22, label: 'the lantern light' },
  { id: 'tent', x: 300, y: 330, r: 35, label: 'the tent door' },
  { id: 'log', x: 300, y: 432, r: 25, label: 'the log in the fire' },
  { id: 'pack', x: 452, y: 452, r: 28, label: 'the backpack' },
  { id: 'mushroom', x: 140, y: 482, r: 20, label: 'the red mushroom' },
];

function pine(ctx, x, y, size, color) {
  triangle(ctx, x - size * 0.5, y, x, y - size, x + size * 0.5, y, color);
  triangle(ctx, x - size * 0.42, y - size * 0.45, x, y - size * 1.35, x + size * 0.42, y - size * 0.45, color);
  rect(ctx, x - 5, y, 10, 22, '#6b4a2b');
}

function drawCamp(ctx, diffs) {
  // Dusk sky and stars.
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#2c2a4a');
  sky.addColorStop(1, '#7b5ea7');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 600, 300);
  const rng = mulberry32(42);
  for (let i = 0; i < 40; i += 1) {
    circle(ctx, 20 + rng() * 560, 12 + rng() * 150, 1.4, 'rgba(255,255,255,0.85)');
  }
  // The moon: full on the left, a crescent on the right.
  circle(ctx, 108, 68, 26, '#f5efe0');
  if (diffOn(diffs, 'moon')) circle(ctx, 120, 62, 22, '#2c2a4a');
  // Forest floor.
  rect(ctx, 0, 300, 600, 260, '#3d5a3a');
  rect(ctx, 0, 300, 600, 12, '#2f4a2e');
  // Pines.
  pine(ctx, 60, 330, 110, '#2f5d33');
  pine(ctx, 150, 350, 80, '#3a6b3d');
  pine(ctx, 540, 340, 120, '#2f5d33');
  pine(ctx, 500, 360, 70, '#3a6b3d');
  // Owl on a branch, top right: gone on the right.
  line(ctx, 430, 150, 540, 140, '#6b4a2b', 6);
  if (!diffOn(diffs, 'owl')) {
    ellipse(ctx, 482, 118, 20, 26, '#8d6e63');
    circle(ctx, 468, 110, 6, '#fff8e7');
    circle(ctx, 496, 110, 6, '#fff8e7');
    circle(ctx, 468, 110, 2.5, '#222');
    circle(ctx, 496, 110, 2.5, '#222');
    triangle(ctx, 478, 118, 486, 118, 482, 124, '#f39c12');
  }
  // Tent: door closed (orange) on the left, open (dark) on the right.
  triangle(ctx, 210, 420, 300, 300, 390, 420, '#e67e22');
  triangle(ctx, 270, 420, 300, 340, 330, 420, diffOn(diffs, 'tent') ? '#4a2c14' : '#c0392b');
  line(ctx, 300, 300, 300, 420, '#8b5e34', 2);
  // Lantern hanging from a post: lit on the left, dark on the right.
  line(ctx, 382, 160, 382, 186, '#6b4a2b', 4);
  roundRect(ctx, 368, 186, 28, 32, 6, '#34495e');
  if (diffOn(diffs, 'lantern')) {
    circle(ctx, 382, 202, 8, '#7f8c8d');
  } else {
    circle(ctx, 382, 202, 8, '#ffd94d');
    circle(ctx, 382, 202, 16, 'rgba(255, 217, 77, 0.3)');
  }
  line(ctx, 382, 160, 420, 160, '#6b4a2b', 4);
  line(ctx, 420, 160, 420, 420, '#6b4a2b', 4);
  // Campfire.
  ellipse(ctx, 300, 448, 70, 14, '#5b4636');
  if (!diffOn(diffs, 'log')) {
    line(ctx, 268, 436, 332, 452, '#8b5e34', 8);
    line(ctx, 332, 436, 268, 452, '#6b4a2b', 8);
  } else {
    line(ctx, 268, 436, 332, 452, '#8b5e34', 8);
  }
  triangle(ctx, 288, 440, 300, 398, 312, 440, '#ff8c42');
  triangle(ctx, 294, 440, 300, 414, 306, 440, '#ffd94d');
  circle(ctx, 300, 420, 26, 'rgba(255, 180, 80, 0.18)');
  // Logs to sit on.
  roundRect(ctx, 180, 470, 90, 24, 10, '#8b5e34');
  roundRect(ctx, 330, 470, 90, 24, 10, '#6b4a2b');
  // Backpack by the tent.
  if (!diffOn(diffs, 'pack')) {
    roundRect(ctx, 430, 430, 44, 48, 10, '#c0392b');
    roundRect(ctx, 440, 420, 24, 14, 6, '#e74c3c');
    line(ctx, 438, 448, 466, 448, '#8b5e34', 3);
  }
  // Red mushroom on the grass.
  if (!diffOn(diffs, 'mushroom')) {
    rect(ctx, 136, 482, 8, 16, '#f5efe0');
    ctx.beginPath();
    ctx.arc(140, 482, 16, Math.PI, 0);
    ctx.fillStyle = '#e74c3c';
    ctx.fill();
    circle(ctx, 134, 476, 2.5, '#fff');
    circle(ctx, 146, 472, 2.5, '#fff');
  }
  // Marshmallow stick leaning on a log.
  line(ctx, 360, 470, 396, 420, '#8b5e34', 3);
  circle(ctx, 396, 416, 7, '#fff8e7');
}

/* ------------------------------------------------------------------ */
/* Scene 4 — Moon Base Lab                                             */
/* ------------------------------------------------------------------ */

const MOONBASE_DIFFS = [
  { id: 'antenna', x: 82, y: 118, r: 25, label: 'the antenna dish' },
  { id: 'earth', x: 300, y: 112, r: 40, label: 'the Earth in the window' },
  { id: 'helmet', x: 542, y: 182, r: 25, label: 'the helmet on the hook' },
  { id: 'gauge', x: 432, y: 222, r: 25, label: 'the gauge needle' },
  { id: 'robot', x: 182, y: 300, r: 25, label: 'the robot eye' },
  { id: 'screen', x: 300, y: 300, r: 30, label: 'the console screen' },
  { id: 'plant', x: 502, y: 402, r: 25, label: 'the bubble plant' },
];

function drawMoonbase(ctx, diffs) {
  // Space-black wall and grey floor.
  rect(ctx, 0, 0, 600, 380, '#1b2333');
  rect(ctx, 0, 380, 600, 180, '#5a6270');
  for (let i = 0; i < 4; i += 1) line(ctx, 0, 420 + i * 40, 600, 420 + i * 40, '#4a5260', 2);
  const rng = mulberry32(7);
  for (let i = 0; i < 26; i += 1) {
    circle(ctx, 20 + rng() * 560, 12 + rng() * 120, 1.4, 'rgba(255,255,255,0.8)');
  }
  // Big round window with the Earth.
  circle(ctx, 300, 112, 64, '#0a1428');
  ctx.beginPath();
  ctx.arc(300, 112, 64, 0, Math.PI * 2);
  ctx.strokeStyle = '#8b98a8';
  ctx.lineWidth = 8;
  ctx.stroke();
  if (!diffOn(diffs, 'earth')) {
    circle(ctx, 300, 112, 30, '#2e86de');
    ellipse(ctx, 288, 104, 12, 7, '#27ae60');
    ellipse(ctx, 312, 122, 10, 6, '#27ae60');
    ellipse(ctx, 306, 100, 14, 5, 'rgba(255,255,255,0.7)');
  }
  // Antenna dish on the left wall: gone on the right.
  if (!diffOn(diffs, 'antenna')) {
    line(ctx, 60, 200, 82, 130, '#8b98a8', 4);
    ctx.beginPath();
    ctx.arc(82, 118, 22, Math.PI * 0.9, Math.PI * 2.1);
    ctx.strokeStyle = '#c0c8d4';
    ctx.lineWidth = 5;
    ctx.stroke();
    line(ctx, 82, 118, 82, 96, '#c0c8d4', 3);
    circle(ctx, 82, 94, 4, '#ff6b6b');
  }
  // Helmet on a hook, right wall.
  line(ctx, 542, 140, 542, 158, '#8b98a8', 4);
  if (!diffOn(diffs, 'helmet')) {
    circle(ctx, 542, 182, 24, '#f5efe0');
    roundRect(ctx, 522, 172, 40, 20, 8, '#7ec8e3');
    circle(ctx, 542, 182, 26, '#8b98a8');
    ctx.beginPath();
    ctx.arc(542, 182, 26, 0, Math.PI * 2);
    ctx.strokeStyle = '#8b98a8';
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  // Control console with two screens and a gauge.
  roundRect(ctx, 180, 260, 240, 110, 10, '#34495e');
  roundRect(ctx, 196, 274, 92, 56, 6, '#0a1428');
  ctx.beginPath();
  ctx.moveTo(204, 318);
  ctx.lineTo(224, 292);
  ctx.lineTo(244, 306);
  ctx.lineTo(264, 284);
  ctx.lineTo(280, 300);
  ctx.strokeStyle = '#7ddc8a';
  ctx.lineWidth = 2;
  ctx.stroke();
  roundRect(ctx, 296, 274, 92, 56, 6, '#0a1428');
  if (!diffOn(diffs, 'screen')) {
    ctx.beginPath();
    ctx.moveTo(304, 318);
    ctx.lineTo(322, 296);
    ctx.lineTo(340, 308);
    ctx.lineTo(358, 288);
    ctx.lineTo(380, 300);
    ctx.strokeStyle = '#ffd32a';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  circle(ctx, 432, 222, 22, '#f5efe0');
  ctx.beginPath();
  ctx.arc(432, 222, 22, 0, Math.PI * 2);
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 3;
  ctx.stroke();
  if (diffOn(diffs, 'gauge')) line(ctx, 432, 222, 448, 208, '#c0392b', 3);
  else line(ctx, 432, 222, 416, 208, '#c0392b', 3);
  circle(ctx, 432, 222, 3, '#333');
  // Blinking warning light above the console.
  circle(ctx, 300, 240, 8, '#ff6b6b');
  circle(ctx, 300, 240, 13, 'rgba(255, 107, 107, 0.3)');
  // Robot: its eye changes colour on the right.
  roundRect(ctx, 150, 380, 64, 90, 12, '#c0c8d4');
  circle(ctx, 182, 356, 24, '#c0c8d4');
  circle(ctx, 182, 356, 26, '#8b98a8');
  ctx.beginPath();
  ctx.arc(182, 356, 26, 0, Math.PI * 2);
  ctx.strokeStyle = '#8b98a8';
  ctx.lineWidth = 3;
  ctx.stroke();
  circle(ctx, 174, 352, 6, diffOn(diffs, 'robot') ? '#ff4757' : '#7ddc8a');
  circle(ctx, 190, 352, 6, diffOn(diffs, 'robot') ? '#ff4757' : '#7ddc8a');
  line(ctx, 182, 368, 182, 380, '#8b98a8', 3);
  rect(ctx, 150, 400, 64, 10, '#8b98a8');
  line(ctx, 162, 470, 162, 500, '#8b98a8', 6);
  line(ctx, 202, 470, 202, 500, '#8b98a8', 6);
  // Bubble plant on the right.
  if (!diffOn(diffs, 'plant')) {
    circle(ctx, 502, 402, 26, 'rgba(126, 200, 227, 0.35)');
    ctx.beginPath();
    ctx.arc(502, 402, 26, 0, Math.PI * 2);
    ctx.strokeStyle = '#7ec8e3';
    ctx.lineWidth = 2;
    ctx.stroke();
    triangle(ctx, 496, 414, 502, 392, 508, 414, '#27ae60');
    circle(ctx, 502, 388, 6, '#ff7fbf');
  }
  // Floor cables.
  ctx.beginPath();
  ctx.moveTo(240, 520);
  ctx.quadraticCurveTo(320, 480, 420, 520);
  ctx.strokeStyle = '#ffd32a';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(240, 540);
  ctx.quadraticCurveTo(330, 500, 430, 540);
  ctx.strokeStyle = '#ff6b6b';
  ctx.lineWidth = 4;
  ctx.stroke();
}

/* ------------------------------------------------------------------ */
/* Scene 5 — The Grand Library                                         */
/* ------------------------------------------------------------------ */

const LIBRARY_DIFFS = [
  { id: 'chandelier', x: 300, y: 82, r: 25, label: 'the chandelier candle' },
  { id: 'portrait', x: 122, y: 142, r: 30, label: 'the portrait' },
  { id: 'book', x: 254, y: 157, r: 20, label: 'the red book' },
  { id: 'lamp', x: 252, y: 352, r: 30, label: 'the desk lamp shade' },
  { id: 'candle', x: 332, y: 382, r: 20, label: 'the candle flame' },
  { id: 'globe', x: 432, y: 422, r: 30, label: 'the globe' },
  { id: 'rug', x: 300, y: 502, r: 35, label: 'the rug stripe' },
];

function bookshelf(ctx, x, y, w, h, seed, missingId, diffs) {
  roundRect(ctx, x, y, w, h, 4, '#6b4a2b');
  const rng = mulberry32(seed);
  const colors = ['#c0392b', '#2980b9', '#27ae60', '#8e44ad', '#e67e22', '#16a085', '#d35400'];
  for (let shelf = 0; shelf < 3; shelf += 1) {
    const sy = y + 14 + shelf * ((h - 28) / 3);
    const sh = (h - 28) / 3 - 12;
    rect(ctx, x + 8, sy, w - 16, 6, '#8b5e34');
    let bx = x + 12;
    let bi = 0;
    while (bx < x + w - 24) {
      const bw = 12 + rng() * 10;
      const bh = sh - 6 - rng() * 6;
      const color = colors[Math.floor(rng() * colors.length)];
      const isMissing = missingId !== null && bi === 3 && shelf === 1 && diffOn(diffs, missingId);
      if (!isMissing) rect(ctx, bx, sy - bh, bw, bh, color);
      bx += bw + 2;
      bi += 1;
    }
  }
}

function drawLibrary(ctx, diffs) {
  // Wood-panelled walls and floor.
  rect(ctx, 0, 0, 600, 380, '#7a5230');
  for (let i = 0; i < 8; i += 1) line(ctx, 60 + i * 70, 0, 60 + i * 70, 380, '#6b4a2b', 2);
  rect(ctx, 0, 380, 600, 180, '#5a3d24');
  for (let i = 0; i < 5; i += 1) line(ctx, 0, 416 + i * 36, 600, 416 + i * 36, '#4a2f1a', 2);
  // Chandelier: one candle unlit on the right.
  line(ctx, 300, 0, 300, 52, '#c98a2e', 3);
  ellipse(ctx, 300, 62, 70, 10, '#c98a2e');
  circle(ctx, 246, 56, 5, '#fff3b0');
  circle(ctx, 300, 52, 5, '#fff3b0');
  circle(ctx, 354, 56, 5, '#fff3b0');
  if (!diffOn(diffs, 'chandelier')) {
    circle(ctx, 300, 82, 7, '#ffcf3f');
    triangle(ctx, 295, 82, 305, 82, 300, 68, '#ff9a3d');
  } else {
    circle(ctx, 300, 82, 7, '#8b8b8b');
  }
  line(ctx, 300, 62, 300, 76, '#f5efe0', 3);
  // Portrait on the left wall: a face on the left, an empty frame on the right.
  roundRect(ctx, 96, 110, 56, 68, 4, '#c98a2e');
  if (!diffOn(diffs, 'portrait')) {
    rect(ctx, 102, 116, 44, 56, '#2c5f7c');
    circle(ctx, 124, 138, 12, '#f5cfa0');
    triangle(ctx, 106, 172, 124, 150, 142, 172, '#34495e');
    circle(ctx, 119, 136, 2, '#222');
    circle(ctx, 129, 136, 2, '#222');
  } else {
    rect(ctx, 102, 116, 44, 56, '#d8cfc0');
  }
  // Bookshelves, left and right.
  bookshelf(ctx, 180, 110, 150, 170, 11, 'book', diffs);
  bookshelf(ctx, 380, 110, 150, 170, 23, null, diffs);
  // Moonlit window on the right.
  roundRect(ctx, 470, 300, 90, 80, 6, '#1b2333');
  rect(ctx, 476, 306, 78, 68, '#2c3e5a');
  circle(ctx, 530, 326, 12, '#f5efe0');
  line(ctx, 515, 306, 515, 374, '#8b5e34', 3);
  // Desk with lamp, books, candle and globe.
  roundRect(ctx, 150, 400, 300, 18, 6, '#8b5e34');
  rect(ctx, 168, 418, 12, 60, '#6b4a2b');
  rect(ctx, 420, 418, 12, 60, '#6b4a2b');
  // Desk lamp: green shade on the left, red on the right.
  line(ctx, 252, 400, 252, 372, '#333', 3);
  triangle(ctx, 232, 372, 272, 372, 252, 348, diffOn(diffs, 'lamp') ? '#c0392b' : '#27ae60');
  circle(ctx, 252, 376, 6, '#fff3b0');
  // Stack of books on the desk.
  rect(ctx, 280, 388, 44, 12, '#2980b9');
  rect(ctx, 284, 376, 38, 12, '#c0392b');
  // Candle: flame only on the left.
  rect(ctx, 328, 382, 8, 18, '#f5efe0');
  if (!diffOn(diffs, 'candle')) {
    ellipse(ctx, 332, 376, 5, 8, '#ffcf3f');
    ellipse(ctx, 332, 378, 2.5, 4, '#ff9a3d');
  }
  // Globe on the desk: gone on the right.
  if (!diffOn(diffs, 'globe')) {
    circle(ctx, 432, 422, 24, '#2e86de');
    ellipse(ctx, 424, 414, 9, 6, '#27ae60');
    ellipse(ctx, 440, 430, 8, 5, '#27ae60');
    ctx.beginPath();
    ctx.arc(432, 422, 24, 0, Math.PI * 2);
    ctx.strokeStyle = '#c98a2e';
    ctx.lineWidth = 2;
    ctx.stroke();
    line(ctx, 432, 446, 432, 458, '#c98a2e', 4);
    ellipse(ctx, 432, 460, 16, 4, '#8b5e34');
  }
  // Rug: the middle stripe changes colour on the right.
  ellipse(ctx, 300, 508, 170, 36, '#9b59b6');
  ellipse(ctx, 300, 508, 130, 26, diffOn(diffs, 'rug') ? '#27ae60' : '#e74c3c');
  ellipse(ctx, 300, 508, 88, 16, '#f5efe0');
  // Ladder leaning on the right shelf.
  line(ctx, 520, 290, 560, 440, '#8b5e34', 5);
  line(ctx, 540, 290, 580, 440, '#8b5e34', 5);
  for (let i = 0; i < 4; i += 1) {
    line(ctx, 524 + i * 4, 320 + i * 34, 544 + i * 4, 320 + i * 34, '#6b4a2b', 4);
  }
}

/* ------------------------------------------------------------------ */
/* Registry                                                            */
/* ------------------------------------------------------------------ */

export const SCENES = {
  cottage: { draw: drawCottage, differences: COTTAGE_DIFFS, name: 'The Cottage Kitchen' },
  harbour: { draw: drawHarbour, differences: HARBOUR_DIFFS, name: 'Harbour at Sunset' },
  camp: { draw: drawCamp, differences: CAMP_DIFFS, name: 'The Forest Camp' },
  moonbase: { draw: drawMoonbase, differences: MOONBASE_DIFFS, name: 'Moon Base Lab' },
  library: { draw: drawLibrary, differences: LIBRARY_DIFFS, name: 'The Grand Library' },
};

/** Draw one scene into `ctx` (600 by 560), applying the differences in `diffs`. */
export function drawScene(ctx, sceneId, diffs) {
  const scene = SCENES[sceneId];
  if (!scene) throw new Error(`unknown scene: ${sceneId}`);
  scene.draw(ctx, diffs);
}
