import { DUCK_H, GROUND, H, PLAYER_X, STAND_H, playerBox, type GameState, type Obstacle } from "./engine";

const INK = "#1d1a2e";
const BRAND = "#6b3cf5";
const DEADLINE = "#e5484d";

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

/** Draws one frame in logical coordinates (the caller has already scaled the context). */
export function render(ctx: CanvasRenderingContext2D, s: GameState, time: number, font: string, showPlayer: boolean) {
  const W = s.W;
  const [wallTop, wallBottom] = s.scenario.wall;

  // --- wall
  const wall = ctx.createLinearGradient(0, 0, 0, GROUND);
  wall.addColorStop(0, wallTop);
  wall.addColorStop(1, wallBottom);
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, W, GROUND);

  // --- parallax: windows (slow), posters & plants (medium)
  const far = (s.dist * 0.25) % 260;
  for (let x = -far; x < W + 260; x += 260) {
    ctx.fillStyle = "#ffffff";
    roundRect(ctx, x + 40, 46, 120, 86, 8);
    ctx.fill();
    const sky = ctx.createLinearGradient(0, 52, 0, 126);
    sky.addColorStop(0, "#bfe3ff");
    sky.addColorStop(1, "#e9f5ff");
    ctx.fillStyle = sky;
    ctx.fillRect(x + 46, 52, 108, 74);
    ctx.fillStyle = "#9db8d6";
    for (let b = 0; b < 5; b++) ctx.fillRect(x + 50 + b * 21, 126 - (18 + ((b * 37) % 30)), 16, 18 + ((b * 37) % 30));
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 99, 52, 2, 74);
  }
  const mid = (s.dist * 0.55) % 380;
  for (let x = -mid; x < W + 380; x += 380) {
    // poster
    ctx.fillStyle = "#ffffff";
    roundRect(ctx, x + 210, 150, 54, 66, 4);
    ctx.fill();
    ctx.fillStyle = BRAND;
    ctx.fillRect(x + 218, 160, 38, 6);
    ctx.fillStyle = "#c9c2e0";
    for (let l = 0; l < 4; l++) ctx.fillRect(x + 218, 174 + l * 9, 30 - l * 4, 4);
    // plant
    ctx.fillStyle = "#3fae6a";
    for (let l = 0; l < 5; l++) {
      ctx.beginPath();
      ctx.ellipse(x + 330 + (l - 2) * 7, 206 - Math.abs(l - 2) * 4, 7, 20, (l - 2) * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#c2703d";
    ctx.fillRect(x + 318, 222, 26, GROUND - 222);
  }

  // --- floor
  ctx.fillStyle = "#e3dcf2";
  ctx.fillRect(0, GROUND, W, H - GROUND);
  ctx.fillStyle = "#cfc6e6";
  ctx.fillRect(0, GROUND, W, 3);
  const tile = s.dist % 64;
  ctx.fillStyle = "#d6cdea";
  for (let x = -tile; x < W; x += 64) ctx.fillRect(x, GROUND + 3, 2, H - GROUND);

  // --- coffees
  for (const c of s.coffees) {
    if (c.taken) continue;
    const bob = Math.sin(time * 5 + c.x * 0.05) * 3;
    drawCoffee(ctx, c.x, c.y + bob, time);
  }

  // --- obstacles
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const o of s.obstacles) {
    if (o.smashed && o.kind !== "bubble") continue;
    if (o.smashed) ctx.globalAlpha = 0.25;
    drawObstacle(ctx, o, font, time);
    ctx.globalAlpha = 1;
  }

  // --- player
  if (showPlayer && !s.over) {
    if (s.turbo > 0) {
      for (let i = 3; i >= 1; i--) {
        ctx.globalAlpha = 0.12 * i;
        drawPlayer(ctx, s, PLAYER_X - i * 16, time, true);
      }
      ctx.globalAlpha = 1;
    }
    const blink = s.invuln > 0 && Math.floor(time * 14) % 2 === 0;
    if (!blink) drawPlayer(ctx, s, PLAYER_X, time, s.turbo > 0);
  }

  // --- particles (paper scraps)
  for (const p of s.particles) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life / p.max);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.fillRect(-5, -3.5, 10, 7);
    ctx.restore();
  }
  ctx.globalAlpha = 1;

  // --- the deadline wall
  drawDeadline(ctx, s, time, font);
}

function drawCoffee(ctx: CanvasRenderingContext2D, x: number, y: number, time: number) {
  ctx.strokeStyle = "rgba(120,90,60,0.45)";
  ctx.lineWidth = 2;
  for (let i = -1; i <= 1; i += 2) {
    ctx.beginPath();
    const sx = x + i * 4;
    ctx.moveTo(sx, y - 14);
    ctx.quadraticCurveTo(sx + Math.sin(time * 6 + i) * 4, y - 20, sx, y - 26);
    ctx.stroke();
  }
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, x - 10, y - 12, 20, 5, 2);
  ctx.fill();
  ctx.fillStyle = "#8b5a2b";
  ctx.beginPath();
  ctx.moveTo(x - 9, y - 7);
  ctx.lineTo(x + 9, y - 7);
  ctx.lineTo(x + 7, y + 12);
  ctx.lineTo(x - 7, y + 12);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#f5e6d3";
  ctx.fillRect(x - 8, y, 16, 5);
}

function drawObstacle(ctx: CanvasRenderingContext2D, o: Obstacle, font: string, time: number) {
  switch (o.kind) {
    case "box": {
      ctx.fillStyle = "#d9a066";
      roundRect(ctx, o.x, o.y, o.w, o.h, 3);
      ctx.fill();
      ctx.fillStyle = "#c48850";
      ctx.fillRect(o.x, o.y, o.w, 6);
      ctx.fillStyle = "#f1d3a8";
      ctx.fillRect(o.x + o.w / 2 - 4, o.y, 8, o.h);
      // label tag above
      tag(ctx, o.x + o.w / 2, o.y - 14, o.label, font, "#5b3b1c", "#fff6ea");
      break;
    }
    case "meeting": {
      // table + two chairs
      ctx.fillStyle = "#7c5cd6";
      roundRect(ctx, o.x, o.y + 6, o.w, 10, 3);
      ctx.fill();
      ctx.fillStyle = "#5b40a8";
      ctx.fillRect(o.x + 8, o.y + 16, 6, o.h - 16);
      ctx.fillRect(o.x + o.w - 14, o.y + 16, 6, o.h - 16);
      ctx.fillStyle = "#3a3156";
      roundRect(ctx, o.x + 26, o.y + 18, 18, o.h - 18, 3);
      ctx.fill();
      roundRect(ctx, o.x + o.w - 44, o.y + 18, 18, o.h - 18, 3);
      ctx.fill();
      tag(ctx, o.x + o.w / 2, o.y - 12, o.label, font, "#ffffff", DEADLINE);
      break;
    }
    case "vacuum": {
      ctx.fillStyle = "#2b2840";
      ctx.beginPath();
      ctx.ellipse(o.x + o.w / 2, o.y + o.h / 2 + 2, o.w / 2, o.h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = Math.floor(time * 6) % 2 ? "#5fd0ff" : "#1a9fe8";
      ctx.fillRect(o.x + o.w / 2 - 3, o.y + 3, 6, 3);
      break;
    }
    case "bubble": {
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = BRAND;
      ctx.lineWidth = 2.5;
      roundRect(ctx, o.x, o.y, o.w, o.h, 14);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(o.x + 18, o.y + o.h - 1);
      ctx.lineTo(o.x + 10, o.y + o.h + 10);
      ctx.lineTo(o.x + 30, o.y + o.h - 1);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(o.x + 18, o.y + o.h);
      ctx.lineTo(o.x + 10, o.y + o.h + 10);
      ctx.lineTo(o.x + 30, o.y + o.h);
      ctx.stroke();
      ctx.fillStyle = INK;
      ctx.font = `700 14px ${font}`;
      ctx.fillText(o.label, o.x + o.w / 2, o.y + o.h / 2 + 1);
      break;
    }
  }
}

function tag(ctx: CanvasRenderingContext2D, cx: number, cy: number, text: string, font: string, color: string, bg: string) {
  ctx.font = `700 11px ${font}`;
  const w = ctx.measureText(text).width + 12;
  ctx.fillStyle = bg;
  roundRect(ctx, cx - w / 2, cy - 9, w, 18, 9);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.fillText(text, cx, cy + 1);
}

function drawPlayer(ctx: CanvasRenderingContext2D, s: GameState, x: number, time: number, turbo: boolean) {
  const box = playerBox(s);
  const feet = s.py;
  const shirt = turbo ? "#ff6a3d" : BRAND;

  if (s.ducking) {
    // slide: body low and long, legs forward
    const y = feet - DUCK_H;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x - 4, feet - 8);
    ctx.lineTo(x + 18, feet - 3);
    ctx.stroke();
    ctx.fillStyle = shirt;
    roundRect(ctx, box.x, y + 6, box.w - 8, 18, 8);
    ctx.fill();
    ctx.fillStyle = "#f1c7a0";
    ctx.beginPath();
    ctx.arc(box.x + box.w - 6, y + 10, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = INK;
    ctx.beginPath();
    ctx.arc(box.x + box.w - 6, y + 7, 9, Math.PI, Math.PI * 2);
    ctx.fill();
    return;
  }

  const top = feet - STAND_H;
  const swing = s.onGround ? Math.sin(s.runAnim) * 9 : 6;

  // legs
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x, feet - 20);
  ctx.lineTo(x + swing, feet);
  ctx.moveTo(x, feet - 20);
  ctx.lineTo(x - swing, feet - (s.onGround ? 0 : 6));
  ctx.stroke();

  // body
  ctx.fillStyle = shirt;
  roundRect(ctx, x - 11, top + 18, 22, 24, 7);
  ctx.fill();
  // tie
  ctx.fillStyle = "#ffb547";
  ctx.beginPath();
  ctx.moveTo(x + 1, top + 20);
  ctx.lineTo(x + 4, top + 32);
  ctx.lineTo(x + 1, top + 36);
  ctx.lineTo(x - 2, top + 32);
  ctx.closePath();
  ctx.fill();
  // arm with folder
  ctx.strokeStyle = shirt;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x - 6, top + 24);
  ctx.lineTo(x - 6 - swing * 0.8, top + 38);
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x + 6, top + 26, 10, 13);
  ctx.fillStyle = "#c9c2e0";
  ctx.fillRect(x + 8, top + 29, 6, 2);

  // head
  ctx.fillStyle = "#f1c7a0";
  ctx.beginPath();
  ctx.arc(x + 1, top + 9, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.arc(x + 1, top + 6, 10, Math.PI * 1.05, Math.PI * 1.95);
  ctx.fill();
  ctx.fillRect(x + 6, top + 8, 2.5, 2.5);

  // sweat drop when the deadline is close
  if (s.lead < 45) {
    ctx.fillStyle = "#5fd0ff";
    const d = (time * 2) % 1;
    ctx.beginPath();
    ctx.arc(x - 9, top + 4 + d * 10, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawDeadline(ctx: CanvasRenderingContext2D, s: GameState, time: number, font: string) {
  // lead 100 → wall hidden off the left edge; lead 0 → wall reaches the player
  const edge = PLAYER_X - 18 - (s.lead / 100) * 150;
  if (edge < -40) return;
  const shake = s.lead < 30 && !s.over ? Math.sin(time * 40) * 2 : 0;
  const right = edge + shake;

  const g = ctx.createLinearGradient(right - 80, 0, right, 0);
  g.addColorStop(0, "rgba(229,72,77,0.95)");
  g.addColorStop(1, "rgba(229,72,77,0.55)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(-10, 0);
  for (let y = 0; y <= H; y += 20) ctx.lineTo(right - ((y / 20) % 2 ? 10 : 0), y);
  ctx.lineTo(-10, H);
  ctx.closePath();
  ctx.fill();

  // clock face
  const cx = right - 34;
  const cy = 120;
  if (cx > -20) {
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = DEADLINE;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(time * 4) * 12, cy + Math.sin(time * 4) * 12);
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx, cy - 9);
    ctx.stroke();

    ctx.save();
    ctx.translate(cx, cy + 70);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = "#ffffff";
    ctx.font = `800 15px ${font}`;
    ctx.textAlign = "center";
    ctx.fillText("DEADLINE", 0, 5);
    ctx.restore();
  }
}
