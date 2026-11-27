/**
 * Cờ caro (gomoku) rules shared by the realtime server (online games) and the web's vs-computer
 * mode. Pure logic: no timers, no I/O.
 *
 * Board: CARO_SIZE × CARO_SIZE cells (20 × 20) in a flat array (index = row * SIZE + col), 0 = empty, 1 = X, 2 = O.
 * X always moves first. Five in a row (horizontal, vertical or diagonal) wins. With the
 * "chặn hai đầu" rule, a line of exactly five that is blocked by the opponent on both ends does
 * not count; six or more in a row always counts.
 */

export const CARO_SIZE = 20;
export type Cell = 0 | 1 | 2;
export type Stone = 1 | 2;
export const otherStone = (s: Stone): Stone => (s === 1 ? 2 : 1);

const DIRS: [number, number][] = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
];

export const emptyBoard = (): Cell[] => Array(CARO_SIZE * CARO_SIZE).fill(0);
const inside = (r: number, c: number) => r >= 0 && c >= 0 && r < CARO_SIZE && c < CARO_SIZE;

/** Winning cells if the stone just placed at `idx` completes a line, otherwise null */
export function winningLine(board: readonly Cell[], idx: number, blockedRule: boolean): number[] | null {
  const s = board[idx];
  if (!s) return null;
  const r0 = Math.floor(idx / CARO_SIZE);
  const c0 = idx % CARO_SIZE;
  for (const [dr, dc] of DIRS) {
    const line = [idx];
    let r = r0 + dr;
    let c = c0 + dc;
    while (inside(r, c) && board[r * CARO_SIZE + c] === s) {
      line.push(r * CARO_SIZE + c);
      r += dr;
      c += dc;
    }
    const endA = inside(r, c) ? board[r * CARO_SIZE + c] : -1;
    r = r0 - dr;
    c = c0 - dc;
    while (inside(r, c) && board[r * CARO_SIZE + c] === s) {
      line.unshift(r * CARO_SIZE + c);
      r -= dr;
      c -= dc;
    }
    const endB = inside(r, c) ? board[r * CARO_SIZE + c] : -1;
    if (line.length < 5) continue;
    // Blocked = opponent stone on the end (the board edge does not block)
    const opp = otherStone(s);
    if (blockedRule && line.length === 5 && endA === opp && endB === opp) continue;
    return line;
  }
  return null;
}

export type MoveResult = { ok: false } | { ok: true; win: number[] | null; draw: boolean };

/** Place a stone; the caller checks whose turn it is */
export function placeStone(board: Cell[], idx: number, s: Stone, blockedRule: boolean): MoveResult {
  if (!Number.isInteger(idx) || idx < 0 || idx >= board.length || board[idx] !== 0) return { ok: false };
  board[idx] = s;
  const win = winningLine(board, idx, blockedRule);
  return { ok: true, win, draw: !win && board.every((c) => c !== 0) };
}

// ------------------------------------------------------------ computer player

export type CaroLevel = "easy" | "hard";

/** Score of the lines through an empty cell if stone `s` were placed there */
function lineScore(board: readonly Cell[], idx: number, s: Stone, blockedRule: boolean) {
  const r0 = Math.floor(idx / CARO_SIZE);
  const c0 = idx % CARO_SIZE;
  let total = 0;
  for (const [dr, dc] of DIRS) {
    let count = 1;
    let open = 0;
    for (const sign of [1, -1]) {
      let r = r0 + dr * sign;
      let c = c0 + dc * sign;
      while (inside(r, c) && board[r * CARO_SIZE + c] === s) {
        count++;
        r += dr * sign;
        c += dc * sign;
      }
      if (inside(r, c) && board[r * CARO_SIZE + c] === 0) open++;
    }
    if (count >= 5) total += 1_000_000;
    else if (count === 4) total += open === 2 ? 120_000 : open === 1 ? 12_000 : 0;
    else if (count === 3) total += open === 2 ? 8_000 : open === 1 ? 600 : 0;
    else if (count === 2) total += open === 2 ? 400 : open === 1 ? 60 : 0;
    else total += open === 2 ? 20 : open === 1 ? 4 : 0;
  }
  return total;
}

/** Empty cells within two steps of a stone (or the center on an empty board) */
function candidates(board: readonly Cell[]) {
  const out: number[] = [];
  let any = false;
  for (let i = 0; i < board.length; i++) {
    if (board[i] !== 0) {
      any = true;
      continue;
    }
    const r = Math.floor(i / CARO_SIZE);
    const c = i % CARO_SIZE;
    let near = false;
    for (let dr = -2; dr <= 2 && !near; dr++)
      for (let dc = -2; dc <= 2 && !near; dc++) if (inside(r + dr, c + dc) && board[(r + dr) * CARO_SIZE + c + dc] !== 0) near = true;
    if (near) out.push(i);
  }
  if (!any) return [Math.floor(CARO_SIZE / 2) * CARO_SIZE + Math.floor(CARO_SIZE / 2)];
  return out;
}

/**
 * Computer move for stone `s`.
 * - hard: always takes a win, blocks the player's wins and strong threats, builds its own.
 * - easy: weaker defence and some randomness, so a careful player can beat it.
 */
export function caroBotMove(board: readonly Cell[], s: Stone, level: CaroLevel, blockedRule: boolean, rng: () => number): number {
  const opp = otherStone(s);
  const defence = level === "hard" ? 0.9 : 0.55;
  const scored = candidates(board).map((i) => {
    const attack = lineScore(board, i, s, blockedRule);
    const block = lineScore(board, i, opp, blockedRule);
    // Winning now always beats blocking; blocking a win beats everything else
    const score = attack >= 1_000_000 ? 1e9 : block >= 1_000_000 ? 5e8 : attack + block * defence;
    return [i, score * (level === "easy" ? 0.7 + rng() * 0.6 : 1 + rng() * 0.05)] as const;
  });
  scored.sort((a, b) => b[1] - a[1]);
  // Easy sometimes misses the best move (never a win or a must-block)
  if (level === "easy" && scored.length > 2 && scored[0][1] < 4e8 && rng() < 0.25) return scored[1 + Math.floor(rng() * Math.min(3, scored.length - 1))][0];
  return scored[0][0];
}
