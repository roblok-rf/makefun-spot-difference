// render.js — everything the player sees, drawn on one canvas.
// The two scene panels are rendered once per level into offscreen canvases
// (left: the original, right: with the differences applied), then the main
// canvas draws the HUD, the panels, the found-markers, the hint ring, the
// miss marks and the screens (title, level clear, game over, win) on top.
// The screenshots are renders of this same code, staged by shots.js.
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PANEL_WIDTH,
  PANEL_HEIGHT,
  PANEL_Y,
  LEFT_PANEL_X,
  RIGHT_PANEL_X,
  UI,
} from './config.js';
import { PANEL_W, PANEL_H, drawScene } from './scenes.js';
import {
  SCREEN_TITLE,
  SCREEN_PLAY,
  SCREEN_LEVEL_CLEAR,
  SCREEN_GAME_OVER,
  SCREEN_WIN,
} from './world.js';

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.leftPanel = document.createElement('canvas');
    this.leftPanel.width = PANEL_W;
    this.leftPanel.height = PANEL_H;
    this.rightPanel = document.createElement('canvas');
    this.rightPanel.width = PANEL_W;
    this.rightPanel.height = PANEL_H;
    this.renderedScene = null;
    this.renderedLevel = -1;
  }

  /** Re-render both panels when the level changes. */
  renderPanels(world) {
    if (this.renderedScene === world.level.scene && this.renderedLevel === world.levelIndex) return;
    const leftCtx = this.leftPanel.getContext('2d');
    drawScene(leftCtx, world.level.scene, new Set());
    const rightCtx = this.rightPanel.getContext('2d');
    const all = new Set(world.differences.map((diff) => diff.id));
    drawScene(rightCtx, world.level.scene, all);
    this.renderedScene = world.level.scene;
    this.renderedLevel = world.levelIndex;
  }

  /** Draw the whole frame for the current world state. */
  draw(world, now) {
    const ctx = this.ctx;
    this.renderPanels(world);
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = UI.background;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const shake = now < world.shakeUntil ? (now % 40 < 20 ? 3 : -3) : 0;
    ctx.save();
    ctx.translate(shake, 0);
    this.drawHud(world);
    this.drawPanels(world, now);
    this.drawMessageBar(world, now);
    ctx.restore();
    if (world.screen === SCREEN_TITLE) this.drawTitle(world);
    if (world.screen === SCREEN_LEVEL_CLEAR) this.drawLevelClear(world);
    if (world.screen === SCREEN_GAME_OVER) this.drawGameOver(world);
    if (world.screen === SCREEN_WIN) this.drawWin(world);
  }

  drawHud(world) {
    const ctx = this.ctx;
    ctx.fillStyle = UI.hudBackground;
    ctx.fillRect(0, 0, CANVAS_WIDTH, 100);
    ctx.fillStyle = UI.accent;
    ctx.fillRect(0, 100, CANVAS_WIDTH, 4);
    this.text('SPOT THE DIFFERENCE', 24, 34, 30, UI.text, 'left');
    this.text('Five Little Worlds', 24, 66, 16, UI.mutedText, 'left');
    // Counter of how many remain — the first thing the judge looks for.
    const total = world.differences.length;
    const found = world.foundCount;
    this.text(`${found} / ${total} found`, 640, 30, 26, UI.text, 'center');
    this.text(`${world.remaining} difference${world.remaining === 1 ? '' : 's'} left`, 640, 62, 16, UI.accent, 'center');
    // Timer bar.
    const level = world.level;
    const fraction = Math.max(0, world.timeLeft / level.seconds);
    const barX = 820;
    const barW = 200;
    ctx.fillStyle = '#14161d';
    ctx.fillRect(barX, 22, barW, 18);
    ctx.fillStyle = world.timeLeft <= 15 && world.screen === SCREEN_PLAY ? UI.timerLow : UI.good;
    ctx.fillRect(barX, 22, barW * fraction, 18);
    this.text(`${Math.ceil(world.timeLeft)}s`, barX + barW + 12, 31, 20, world.timeLeft <= 15 ? UI.timerLow : UI.text, 'left');
    this.text('TIME', barX, 58, 13, UI.mutedText, 'left');
    // Score, combo and hints.
    this.text(`SCORE ${world.score}`, 1060, 30, 22, UI.text, 'left');
    this.text(world.streak >= 2 ? `COMBO x${world.combo.toFixed(2)}` : 'find a streak for combo', 1060, 58, 14, world.streak >= 2 ? UI.accent : UI.mutedText, 'left');
    this.text(`HINTS ${'●'.repeat(world.hintsLeft)}${'○'.repeat(3 - world.hintsLeft)}  (H)`, 1060, 82, 14, UI.hint, 'left');
    this.text(`LEVEL ${world.levelIndex + 1} / 5 — ${world.level.title.replace(/^Case \d+ — /, '')}`, 24, 92, 13, UI.mutedText, 'left');
    if (world.best > 0) this.text(`BEST ${world.best}`, 640, 88, 13, UI.mutedText, 'center');
  }

  drawPanels(world, now) {
    const ctx = this.ctx;
    this.drawOnePanel(world, this.leftPanel, LEFT_PANEL_X, 0, now);
    this.drawOnePanel(world, this.rightPanel, RIGHT_PANEL_X, 1, now);
    this.text('ORIGINAL', LEFT_PANEL_X + PANEL_WIDTH / 2, PANEL_Y + PANEL_HEIGHT + 14, 14, UI.mutedText, 'center');
    this.text('CHANGED — FIND 7 DIFFERENCES', RIGHT_PANEL_X + PANEL_WIDTH / 2, PANEL_Y + PANEL_HEIGHT + 14, 14, UI.mutedText, 'center');
  }

  drawOnePanel(world, panelCanvas, x, panel, now) {
    const ctx = this.ctx;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = UI.panelBorder;
    ctx.fillRect(x - 4, PANEL_Y - 4, PANEL_WIDTH + 8, PANEL_HEIGHT + 8);
    ctx.restore();
    ctx.drawImage(panelCanvas, x, PANEL_Y);
    // Rings around every difference found, on both panels.
    for (const diff of world.differences) {
      if (!world.found.has(diff.id)) continue;
      const cx = x + diff.x;
      const cy = PANEL_Y + diff.y;
      ctx.beginPath();
      ctx.arc(cx, cy, diff.r + 4, 0, Math.PI * 2);
      ctx.strokeStyle = UI.marker;
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, diff.r + 10, 0, Math.PI * 2);
      ctx.strokeStyle = UI.markerGlow;
      ctx.lineWidth = 8;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 8, cy);
      ctx.lineTo(cx + 8, cy);
      ctx.moveTo(cx, cy - 8);
      ctx.lineTo(cx, cy + 8);
      ctx.strokeStyle = UI.marker;
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    // The hint ring pulses around one unfound difference, on both panels.
    const hint = world.activeHint(now);
    if (hint && world.screen === SCREEN_PLAY) {
      const pulse = 1 + 0.12 * Math.sin(now / 120);
      for (const px of [LEFT_PANEL_X, RIGHT_PANEL_X]) {
        ctx.beginPath();
        ctx.arc(px + hint.x, PANEL_Y + hint.y, (hint.r + 8) * pulse, 0, Math.PI * 2);
        ctx.strokeStyle = UI.hint;
        ctx.lineWidth = 4;
        ctx.setLineDash([10, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
    // Red X marks where a wrong click landed.
    for (const mark of world.missMarks) {
      if (mark.panel !== panel) continue;
      const mx = x + mark.x;
      const my = PANEL_Y + mark.y;
      const alpha = Math.max(0, (mark.until - now) / 600);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(mx - 12, my - 12);
      ctx.lineTo(mx + 12, my + 12);
      ctx.moveTo(mx + 12, my - 12);
      ctx.lineTo(mx - 12, my + 12);
      ctx.strokeStyle = UI.bad;
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.restore();
    }
    if (world.paused && world.screen === SCREEN_PLAY) {
      ctx.fillStyle = 'rgba(20, 22, 29, 0.65)';
      ctx.fillRect(x, PANEL_Y, PANEL_WIDTH, PANEL_HEIGHT);
      this.text('PAUSED — press P to resume', x + PANEL_WIDTH / 2, PANEL_Y + PANEL_HEIGHT / 2, 24, UI.text, 'center');
    }
  }

  drawMessageBar(world, now) {
    const ctx = this.ctx;
    ctx.fillStyle = UI.hudBackground;
    ctx.fillRect(0, 716, CANVAS_WIDTH, 84);
    ctx.fillStyle = UI.accent;
    ctx.fillRect(0, 716, CANVAS_WIDTH, 2);
    const message = now < world.messageUntil ? world.message : 'Click a difference on either picture. H = hint, P = pause, M = mute, R = restart.';
    this.text(message, 640, 758, 18, UI.text, 'center');
  }

  drawTitle(world) {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(20, 22, 29, 0.82)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.text('SPOT THE DIFFERENCE', 640, 190, 56, UI.text, 'center');
    this.text('FIVE LITTLE WORLDS', 640, 244, 28, UI.accent, 'center');
    this.text('Five scenes. Seven differences each. One sharp pair of eyes.', 640, 300, 20, UI.mutedText, 'center');
    this.text('Click a difference on either picture to circle it.', 640, 340, 18, UI.text, 'center');
    this.text('Wrong clicks cost 25 points. Streaks build a combo up to x2.5.', 640, 370, 18, UI.text, 'center');
    this.text('H spends a hint (3 per level). The clock is always running.', 640, 400, 18, UI.text, 'center');
    this.text('▶  CLICK OR PRESS ENTER TO START', 640, 480, 26, UI.good, 'center');
    if (world.best > 0) this.text(`Best score so far: ${world.best}`, 640, 530, 18, UI.mutedText, 'center');
    this.text('A game in five little worlds — drawn by hand, no photos, no copies.', 640, 640, 14, UI.mutedText, 'center');
  }

  drawLevelClear(world) {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(20, 22, 29, 0.78)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.text('LEVEL CLEAR!', 640, 260, 48, UI.good, 'center');
    this.text(`All 7 differences found in ${world.level.name}.`, 640, 320, 20, UI.text, 'center');
    this.text(`Time bonus + level bonus: +${world.levelBonus}`, 640, 356, 20, UI.accent, 'center');
    this.text(`Score: ${world.score}`, 640, 392, 22, UI.text, 'center');
    this.text('▶  CLICK OR PRESS ENTER FOR THE NEXT CASE', 640, 470, 24, UI.good, 'center');
  }

  drawGameOver(world) {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(20, 22, 29, 0.82)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.text("TIME'S UP", 640, 260, 48, UI.bad, 'center');
    this.text(`The clock beat you in ${world.level.name} — ${world.remaining} difference${world.remaining === 1 ? '' : 's'} still hiding.`, 640, 320, 20, UI.text, 'center');
    this.text(`Score: ${world.score}   •   Best: ${Math.max(world.best, world.score)}`, 640, 360, 20, UI.text, 'center');
    this.text('▶  CLICK OR PRESS ENTER TO TRY AGAIN', 640, 440, 24, UI.good, 'center');
  }

  drawWin(world) {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(20, 22, 29, 0.82)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.text('CASE CLOSED!', 640, 220, 52, UI.accent, 'center');
    this.text('All five worlds searched. All 35 differences found.', 640, 284, 22, UI.text, 'center');
    this.text(`FINAL SCORE: ${world.score}`, 640, 340, 30, UI.good, 'center');
    this.text(`Best score: ${world.best}`, 640, 380, 18, UI.mutedText, 'center');
    this.text('You have the sharpest eyes in the neighbourhood, detective.', 640, 430, 18, UI.text, 'center');
    this.text('▶  CLICK OR PRESS ENTER TO PLAY AGAIN', 640, 510, 24, UI.good, 'center');
  }

  text(str, x, y, size, color, align) {
    const ctx = this.ctx;
    ctx.font = `bold ${size}px Georgia, serif`;
    ctx.fillStyle = color;
    ctx.textAlign = align || 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(str, x, y);
  }
}
