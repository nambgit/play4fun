import { BULLET_COLOR, H, W, type GameState } from "./engine";

const BG = "#07060d";
const GRID = "#110f1e";
const PLAYER = "#7ee2ff";
const WARN = "#ffb547";
const SHIELD = "#16b364";

/** Draws one frame at logical resolution; the canvas is CSS-scaled with `image-rendering: pixelated`. */
export function render(ctx: CanvasRenderingContext2D, s: GameState, time: number, showPlayer: boolean) {
  ctx.globalAlpha = 1;
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = GRID;
  for (let x = 0; x < W; x += 16) ctx.fillRect(x, 0, 1, H);
  for (let y = 0; y < H; y += 16) ctx.fillRect(0, y, W, 1);

  const blink = Math.floor(time * 12) % 2 === 0;

  // Telegraphs
  for (const w of s.warns) {
    const progress = 1 - w.t / w.total;
    ctx.globalAlpha = blink ? 0.95 : 0.45;
    ctx.fillStyle = WARN;
    if (w.type === "point") {
      const h = Math.round(10 - progress * 6);
      const x = Math.round(w.x);
      const y = Math.round(w.y);
      ctx.fillRect(x - h, y - h, h * 2, 1);
      ctx.fillRect(x - h, y + h, h * 2 + 1, 1);
      ctx.fillRect(x - h, y - h, 1, h * 2);
      ctx.fillRect(x + h, y - h, 1, h * 2);
      ctx.fillRect(x - 1, y - 1, 2, 2);
    } else {
      for (let i = 0; i < (w.side % 2 === 0 ? W : H); i += 6) {
        if (w.side === 0) ctx.fillRect(i, 1, 3, 2);
        else if (w.side === 1) ctx.fillRect(W - 3, i, 2, 3);
        else if (w.side === 2) ctx.fillRect(i, H - 3, 3, 2);
        else ctx.fillRect(1, i, 2, 3);
      }
    }
  }
  ctx.globalAlpha = 1;

  // Shield pickups
  for (const pk of s.pickups) {
    if (pk.life < 2 && blink) continue;
    const x = Math.round(pk.x);
    const y = Math.round(pk.y) + Math.round(Math.sin(time * 4) * 1.5);
    ctx.fillStyle = SHIELD;
    ctx.fillRect(x - 3, y - 4, 7, 1);
    ctx.fillRect(x - 4, y - 3, 1, 5);
    ctx.fillRect(x + 4, y - 3, 1, 5);
    ctx.fillRect(x - 3, y + 2, 1, 1);
    ctx.fillRect(x + 3, y + 2, 1, 1);
    ctx.fillRect(x - 2, y + 3, 5, 1);
    ctx.fillStyle = "#b8f5d0";
    ctx.fillRect(x - 1, y - 2, 3, 3);
  }

  // Bullets
  for (const b of s.bullets) {
    const size = b.r * 2;
    const x = Math.round(b.x - b.r);
    const y = Math.round(b.y - b.r);
    ctx.fillStyle = BULLET_COLOR[b.kind];
    ctx.fillRect(x, y, size, size);
    if (b.r >= 3) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x + 2, y + 2, size - 4, size - 4);
    }
  }

  // Player
  if (showPlayer && !s.over) {
    const n = s.trail.length;
    ctx.fillStyle = PLAYER;
    for (let i = 0; i < n - 1; i++) {
      ctx.globalAlpha = (i / n) * 0.35;
      ctx.fillRect(Math.round(s.trail[i].x) - 1, Math.round(s.trail[i].y) - 1, 3, 3);
    }
    ctx.globalAlpha = 1;

    const invulnBlink = s.invuln > 0 && Math.floor(time * 16) % 2 === 0;
    if (!invulnBlink) {
      const x = Math.round(s.player.x);
      const y = Math.round(s.player.y);
      ctx.fillStyle = PLAYER;
      ctx.fillRect(x - 3, y - 2, 7, 5);
      ctx.fillRect(x - 2, y - 3, 5, 7);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x - 1, y - 1, 3, 3);

      if (s.shield) {
        ctx.strokeStyle = SHIELD;
        ctx.globalAlpha = 0.6 + Math.sin(time * 6) * 0.3;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x + 0.5, y + 0.5, 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }

  // Particles
  for (const p of s.particles) {
    ctx.globalAlpha = Math.max(0, p.life / p.max);
    ctx.fillStyle = p.color;
    ctx.fillRect(Math.round(p.x), Math.round(p.y), 2, 2);
  }
  ctx.globalAlpha = 1;
}
