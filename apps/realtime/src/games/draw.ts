/**
 * Vẽ & đoán — one player draws, the others type guesses.
 *
 * Each round every player draws once. The drawer picks 1 of 3 words (easy / medium / hard),
 * strokes are relayed live, and guessers get letter hints over time. Faster correct guesses
 * score more; the drawer scores for every correct guesser. Guesses ignore accents and spaces.
 * Messages that could leak the answer (near-misses, chat from players who already guessed)
 * are only shown to the people who may see them.
 */
import {
  CHAT_MAX,
  DRAW_COLORS,
  DRAW_ROUND_OPTIONS,
  DRAW_SIZES,
  DRAW_TIME_OPTIONS,
  answerKey,
  type ChatMsg,
  type DrawOp,
  type DrawPhase,
  type DrawSettings,
  type DrawView,
  type Stroke,
} from "@play4fun/party";
import { DRAW_WORDS } from "./content/draw-words";
import { clampOption, pickFresh, shuffle, type Ctx, type GameModule } from "./types";

const CHOOSE_MS = 15_000;
const TURN_END_MS = 5_000;
const MAX_STROKES = 600;
const MAX_POINTS_PER_STROKE = 4_000;
const CHAT_KEEP = 40;

type StoredMsg = ChatMsg & { to: string[] | null };

type State = {
  rounds: number;
  drawMs: number;
  round: number;
  /** Drawing order for the whole game (shuffled at start, late joiners appended) */
  baseOrder: string[];
  /** Drawers for the current round (late joiners are appended) */
  roundOrder: string[];
  turnIdx: number;
  phase: DrawPhase;
  drawerId: string;
  choices: string[];
  word: string;
  revealed: Set<number>;
  drawStart: number;
  endsAt: number;
  guessed: string[];
  scores: Map<string, number>;
  turnGains: Map<string, number>;
  strokes: Stroke[];
  chat: StoredMsg[];
  chatSeq: number;
};

// ------------------------------------------------------------ helpers

function say(ctx: Ctx, s: State, msg: Omit<ChatMsg, "id">, to: string[] | null = null) {
  const full: StoredMsg = { ...msg, id: ++s.chatSeq, to };
  s.chat.push(full);
  if (s.chat.length > CHAT_KEEP) s.chat.shift();
  const { to: _drop, ...wire } = full;
  ctx.emit("chat:msg", wire, to ?? undefined);
}

const isLetter = (ch: string) => /[\p{L}\p{N}]/u.test(ch);

function mask(s: State) {
  return [...s.word].map((ch, i) => (!isLetter(ch) ? ch : s.revealed.has(i) ? ch : "_")).join("");
}

function revealHint(s: State) {
  const hidden = [...s.word].map((ch, i) => (isLetter(ch) && !s.revealed.has(i) ? i : -1)).filter((i) => i >= 0);
  // Keep at least two letters hidden so the hint never gives the word away
  if (hidden.length <= 2) return;
  s.revealed.add(hidden[Math.floor(Math.random() * hidden.length)]);
}

function guessers(ctx: Ctx, s: State) {
  return ctx.connected().filter((id) => id !== s.drawerId);
}

function addGain(s: State, id: string, pts: number) {
  s.scores.set(id, (s.scores.get(id) ?? 0) + pts);
  s.turnGains.set(id, (s.turnGains.get(id) ?? 0) + pts);
}

/** Levenshtein distance ≤ 1 (for "Gần đúng rồi!") */
function nearMiss(a: string, b: string) {
  if (a === b || Math.abs(a.length - b.length) > 1 || b.length < 4) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (a.length < b.length) j++;
    else {
      i++;
      j++;
    }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

// ------------------------------------------------------------ flow

function startRound(ctx: Ctx, s: State) {
  s.round++;
  s.roundOrder = s.baseOrder.filter((id) => ctx.room.players.has(id));
  s.turnIdx = -1;
  nextTurn(ctx, s);
}

function nextTurn(ctx: Ctx, s: State) {
  ctx.clearTimer("hint1");
  ctx.clearTimer("hint2");
  // Next drawer still in the room this round
  do s.turnIdx++;
  while (s.turnIdx < s.roundOrder.length && !ctx.room.players.has(s.roundOrder[s.turnIdx]));

  if (s.turnIdx >= s.roundOrder.length) {
    if (s.round >= s.rounds) return finish(ctx, s);
    return startRound(ctx, s);
  }

  s.drawerId = s.roundOrder[s.turnIdx];
  const used = ctx.room.used;
  s.choices = (["easy", "medium", "hard"] as const).map((lv) => pickFresh(DRAW_WORDS[lv], (w) => `draw:${w}`, used, 1)[0]);
  s.word = "";
  s.revealed = new Set();
  s.guessed = [];
  s.turnGains = new Map();
  s.strokes = [];
  ctx.emit("draw:op", { op: "clear" });
  s.phase = "choosing";
  s.endsAt = ctx.now() + CHOOSE_MS;
  ctx.timer("phase", CHOOSE_MS, () => {
    choose(ctx, s, Math.floor(Math.random() * s.choices.length));
    ctx.push();
  });
}

function choose(ctx: Ctx, s: State, index: number) {
  if (s.phase !== "choosing") return;
  s.word = s.choices[index] ?? s.choices[0];
  s.phase = "drawing";
  s.drawStart = ctx.now();
  s.endsAt = s.drawStart + s.drawMs;
  say(ctx, s, { kind: "system", text: `${ctx.name(s.drawerId)} bắt đầu vẽ!` });
  ctx.timer("hint1", s.drawMs * 0.5, () => {
    revealHint(s);
    ctx.push();
  });
  ctx.timer("hint2", s.drawMs * 0.75, () => {
    revealHint(s);
    ctx.push();
  });
  ctx.timer("phase", s.drawMs, () => {
    endTurn(ctx, s);
    ctx.push();
  });
}

function endTurn(ctx: Ctx, s: State) {
  if (s.phase !== "drawing" && s.phase !== "choosing") return;
  ctx.clearTimer("hint1");
  ctx.clearTimer("hint2");
  if (!s.word) s.word = s.choices[0];
  s.phase = "turnEnd";
  s.endsAt = ctx.now() + TURN_END_MS;
  say(ctx, s, { kind: "system", text: `Đáp án là: ${s.word}` });
  ctx.timer("phase", TURN_END_MS, () => {
    nextTurn(ctx, s);
    ctx.push();
  });
}

function finish(ctx: Ctx, s: State) {
  ctx.clearTimer("phase");
  s.phase = "over";
  s.endsAt = ctx.now();
}

function maybeAllGuessed(ctx: Ctx, s: State) {
  if (s.phase !== "drawing") return;
  const g = guessers(ctx, s);
  if (g.length > 0 && g.every((id) => s.guessed.includes(id))) endTurn(ctx, s);
}

function guess(ctx: Ctx, s: State, pid: string, raw: string) {
  const text = raw.normalize("NFC").trim().replace(/\s+/g, " ").slice(0, CHAT_MAX);
  if (!text) return;
  const name = ctx.name(pid);

  if (s.phase !== "drawing") {
    say(ctx, s, { kind: "chat", name, text });
    return;
  }
  // The drawer must not type the answer
  if (pid === s.drawerId) return;

  // Already guessed: chat only with the drawer and the others who guessed
  if (s.guessed.includes(pid)) {
    say(ctx, s, { kind: "chat", name, text }, [s.drawerId, ...s.guessed]);
    return;
  }

  const key = answerKey(text);
  const target = answerKey(s.word);
  if (key && key === target) {
    const left = Math.max(0, s.endsAt - ctx.now()) / s.drawMs;
    const first = s.guessed.length === 0;
    addGain(s, pid, Math.round(50 + 250 * left) + (first ? 50 : 0));
    addGain(s, s.drawerId, 50);
    s.guessed.push(pid);
    say(ctx, s, { kind: "correct", name, text: `${name} đã đoán đúng!` });
    maybeAllGuessed(ctx, s);
    return;
  }
  if (nearMiss(key, target)) {
    say(ctx, s, { kind: "close", text: `“${text}” gần đúng rồi!` }, [pid]);
    return;
  }
  say(ctx, s, { kind: "chat", name, text });
}

function validOp(s: State, op: DrawOp): boolean {
  const inRange = (n: unknown) => typeof n === "number" && Number.isInteger(n) && n >= 0 && n <= 1000;
  switch (op?.op) {
    case "begin":
      return (
        typeof op.id === "string" &&
        op.id.length > 0 &&
        op.id.length <= 16 &&
        DRAW_COLORS.includes(op.color) &&
        DRAW_SIZES.includes(op.size) &&
        inRange(op.x) &&
        inRange(op.y) &&
        s.strokes.length < MAX_STROKES
      );
    case "points": {
      const st = s.strokes.at(-1);
      return (
        !!st &&
        st.id === op.id &&
        Array.isArray(op.pts) &&
        op.pts.length % 2 === 0 &&
        op.pts.length <= 200 &&
        st.pts.length + op.pts.length <= MAX_POINTS_PER_STROKE &&
        op.pts.every(inRange)
      );
    }
    case "undo":
    case "clear":
      return true;
    default:
      return false;
  }
}

// ------------------------------------------------------------ module

export const draw: GameModule<State, DrawSettings> = {
  normalizeSettings(raw) {
    const r = (raw ?? {}) as Partial<DrawSettings>;
    return { rounds: clampOption(r.rounds, DRAW_ROUND_OPTIONS, 2), drawTime: clampOption(r.drawTime, DRAW_TIME_OPTIONS, 80) };
  },

  start(ctx, settings) {
    const s: State = {
      rounds: settings.rounds,
      drawMs: settings.drawTime * 1000,
      round: 0,
      baseOrder: [],
      roundOrder: [],
      turnIdx: -1,
      phase: "choosing",
      drawerId: "",
      choices: [],
      word: "",
      revealed: new Set(),
      drawStart: 0,
      endsAt: 0,
      guessed: [],
      scores: new Map(ctx.connected().map((id) => [id, 0])),
      turnGains: new Map(),
      strokes: [],
      chat: [],
      chatSeq: 0,
    };
    // Random drawing order for the whole game
    const order = shuffle(ctx.connected());
    s.round = 1;
    s.baseOrder = order;
    s.roundOrder = [...order];
    nextTurn(ctx, s);
    return s;
  },

  action(ctx, s, pid, a) {
    switch (a.type) {
      case "draw:choose":
        if (pid !== s.drawerId || typeof a.index !== "number") return;
        choose(ctx, s, Math.max(0, Math.min(s.choices.length - 1, Math.floor(a.index))));
        break;
      case "draw:guess":
        if (typeof a.text !== "string") return;
        guess(ctx, s, pid, a.text);
        break;
      case "draw:skip":
        // Drawer gives up, or host skips an AFK drawer
        if (pid !== s.drawerId && !ctx.isHost(pid)) return;
        endTurn(ctx, s);
        break;
      default:
        return;
    }
    ctx.push();
  },

  op(ctx, s, pid, op) {
    if (pid !== s.drawerId || s.phase !== "drawing" || !validOp(s, op)) return;
    switch (op.op) {
      case "begin":
        s.strokes.push({ id: op.id, color: op.color, size: op.size, pts: [op.x, op.y] });
        break;
      case "points":
        s.strokes.at(-1)!.pts.push(...op.pts);
        break;
      case "undo":
        s.strokes.pop();
        break;
      case "clear":
        s.strokes = [];
        break;
    }
    ctx.emit(
      "draw:op",
      op,
      ctx.connected().filter((id) => id !== pid),
    );
  },

  sync(_ctx, s, pid) {
    return {
      strokes: s.strokes,
      chat: s.chat.filter((m) => !m.to || m.to.includes(pid)).map(({ to: _drop, ...m }) => m),
    };
  },

  view(_ctx, s, pid): DrawView {
    const isDrawer = pid === s.drawerId;
    const showWord = s.phase === "turnEnd" || s.phase === "over" || (isDrawer && s.phase === "drawing") || s.guessed.includes(pid);
    return {
      kind: "draw",
      phase: s.phase,
      round: s.round,
      rounds: s.rounds,
      turn: s.turnIdx + 1,
      totalTurns: s.roundOrder.length,
      drawerId: s.drawerId,
      choices: isDrawer && s.phase === "choosing" ? s.choices : null,
      word: showWord ? s.word : null,
      mask: s.phase === "drawing" && !showWord ? mask(s) : null,
      endsAt: s.endsAt,
      guessed: s.guessed,
      scores: Object.fromEntries(s.scores),
      turnGains: s.phase === "turnEnd" || s.phase === "over" ? Object.fromEntries(s.turnGains) : null,
    };
  },

  resume(ctx, s, paused) {
    s.endsAt += paused;
    s.drawStart += paused;
    const now = ctx.now();
    const left = Math.max(0, s.endsAt - now);
    if (s.phase === "choosing") {
      ctx.timer("phase", left, () => {
        choose(ctx, s, Math.floor(Math.random() * s.choices.length));
        ctx.push();
      });
    } else if (s.phase === "drawing") {
      for (const [key, frac] of [["hint1", 0.5], ["hint2", 0.75]] as const) {
        const at = s.drawStart + s.drawMs * frac;
        if (at > now)
          ctx.timer(key, at - now, () => {
            revealHint(s);
            ctx.push();
          });
      }
      ctx.timer("phase", left, () => {
        endTurn(ctx, s);
        ctx.push();
      });
    } else if (s.phase === "turnEnd") {
      ctx.timer("phase", left, () => {
        nextTurn(ctx, s);
        ctx.push();
      });
    }
  },

  onJoin(_ctx, s, pid) {
    if (!s.scores.has(pid)) s.scores.set(pid, 0);
    if (!s.baseOrder.includes(pid)) s.baseOrder.push(pid);
    // Late joiners still get a turn this round if it is not over yet
    if (!s.roundOrder.includes(pid) && s.phase !== "over") s.roundOrder.push(pid);
  },

  onConnectionChange(ctx, s) {
    maybeAllGuessed(ctx, s);
  },

  onRemove(ctx, s, pid) {
    if (pid === s.drawerId && (s.phase === "choosing" || s.phase === "drawing")) {
      say(ctx, s, { kind: "system", text: `${ctx.name(pid)} đã rời phòng, chuyển lượt.` });
      endTurn(ctx, s);
    } else {
      maybeAllGuessed(ctx, s);
    }
  },
};
