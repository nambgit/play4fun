"use client";

import { CARO_SECONDS_OPTIONS, CARO_TARGET_OPTIONS, type CaroSettings, type CaroView } from "@play4fun/party";
import { CARO_SIZE, caroBotMove, emptyBoard, placeStone, type CaroLevel, type Cell, type Stone } from "@play4fun/party/caro";
import { ArrowLeft, Bot, Flag, RotateCcw, Trophy } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Choice, PartyRoom, nameOf, type GameProps, type SettingsProps } from "@/components/party/party-room";
import { gameEnd, gameStart } from "@/lib/analytics";
import { getGame } from "@/lib/games";
import { useCountdown } from "@/lib/party-client";

const accent = getGame("co-caro")!.cover;
const X_COLOR = "text-[#e5484d]";
const O_COLOR = "text-[#1a9fe8]";

const RULES = (
  <ol className="list-decimal space-y-1 pl-4">
    <li>Bàn cờ 20×20. Hai người lần lượt đặt quân X và O, X đi trước.</li>
    <li>
      Ai có <b>5 quân liền nhau</b> theo hàng ngang, dọc hoặc chéo trước là thắng ván.
    </li>
    <li>
      Luật <b>chặn hai đầu</b> (tùy chọn): 5 quân bị đối thủ chặn cả hai đầu thì không tính thắng.
    </li>
    <li>Hết giờ hoặc đầu hàng là thua ván. Người cầm X đổi luân phiên sau mỗi ván.</li>
  </ol>
);

export default function Play() {
  const [mode, setMode] = useState<"online" | "bot">("online");
  if (mode === "bot") return <BotCaro onExit={() => setMode("online")} />;
  return (
    <PartyRoom
      slug="co-caro"
      title="Cờ caro"
      emoji="⭕"
      accent={accent}
      Settings={CaroSettingsPanel}
      Game={OnlineCaro}
      rules={RULES}
      offline={{ label: "Chơi với máy", onStart: () => setMode("bot") }}
    />
  );
}

function CaroSettingsPanel({ value, onChange, disabled }: SettingsProps<CaroSettings>) {
  return (
    <>
      <Choice label="Thể thức" value={value.target} options={CARO_TARGET_OPTIONS} format={(v) => (v === 1 ? "1 ván" : `Chạm ${v} ván`)} onChange={(target) => onChange({ ...value, target })} disabled={disabled} />
      <Choice label="Mỗi nước" value={value.seconds} options={CARO_SECONDS_OPTIONS} format={(v) => `${v} giây`} onChange={(seconds) => onChange({ ...value, seconds })} disabled={disabled} />
      <Choice
        label="Chặn hai đầu"
        value={value.blocked ? 1 : 0}
        options={[0, 1]}
        format={(v) => (v ? "Có" : "Không")}
        onChange={(v) => onChange({ ...value, blocked: v === 1 })}
        disabled={disabled}
      />
    </>
  );
}

// ------------------------------------------------------------ online

function OnlineCaro({ view, api, me, players }: GameProps<CaroView>) {
  const opp = view.seats.find((id) => id !== me) ?? view.seats[1];
  const secs = useCountdown(view.phase === "play" ? view.endsAt : undefined, api.now);
  const nextIn = useCountdown(view.phase === "roundEnd" ? view.nextAt : undefined, api.now);
  const iWant = view.rematch.includes(me);
  const oppWants = view.rematch.includes(opp);

  return (
    <CaroBoard
      meName={nameOf(players, me)}
      oppName={nameOf(players, opp)}
      oppNote={players.get(opp)?.connected ? null : "mất kết nối…"}
      myStone={view.x === me ? 1 : 2}
      myTurn={view.turn === me}
      phase={view.phase}
      board={view.board as Cell[]}
      lastMove={view.lastMove}
      winLine={view.winLine}
      secs={secs}
      wins={[view.wins[me] ?? 0, view.wins[opp] ?? 0]}
      target={view.target}
      gameNo={view.gameNo}
      blocked={view.blocked}
      result={view.phase === "play" ? null : { mine: view.gameWinner === null ? null : view.gameWinner === me, reason: view.reason }}
      onMove={(cell) => api.act({ type: "caro:move", cell })}
      onResign={() => api.act({ type: "caro:resign" })}
      roundEndNote={view.phase === "roundEnd" ? `Ván tiếp theo sau ${nextIn}s…` : null}
      overActions={
        <>
          <button type="button" onClick={() => api.act({ type: "caro:rematch" })} disabled={iWant} className="btn-primary px-8 disabled:opacity-60">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            {iWant ? "Chờ đối thủ đồng ý…" : oppWants ? "Đối thủ muốn đấu lại: Chơi lại!" : "Chơi lại"}
          </button>
          <button type="button" onClick={api.leave} className="btn-ghost px-6">
            Rời phòng
          </button>
        </>
      }
    />
  );
}

// ------------------------------------------------------------ vs computer (runs in the browser)

const BOT_TARGET = 2;

type BotGame = {
  board: Cell[];
  /** Stone the player holds this game (player is X in odd games) */
  me: Stone;
  toMove: Stone;
  lastMove: number | null;
  winLine: number[] | null;
  wins: [number, number];
  gameNo: number;
  phase: "play" | "roundEnd" | "over";
  result: { mine: boolean | null; reason: CaroView["reason"] } | null;
};

function BotCaro({ onExit }: { onExit: () => void }) {
  const [level, setLevel] = useState<CaroLevel | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [g, setG] = useState<BotGame | null>(null);
  const nextTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const newGame = useCallback((prev: BotGame | null): BotGame => {
    const gameNo = (prev?.gameNo ?? 0) + 1;
    return {
      board: emptyBoard(),
      me: gameNo % 2 === 1 ? 1 : 2,
      toMove: 1,
      lastMove: null,
      winLine: null,
      wins: prev?.wins ?? [0, 0],
      gameNo,
      phase: "play",
      result: null,
    };
  }, []);

  /** Apply a move for `stone` and return the next state */
  const move = useCallback(
    (cur: BotGame, cell: number, stone: Stone): BotGame | null => {
      const board = [...cur.board];
      const r = placeStone(board, cell, stone, blocked);
      if (!r.ok) return null;
      const next: BotGame = { ...cur, board, lastMove: cell, toMove: stone === 1 ? 2 : 1 };
      if (r.win || r.draw) {
        const mine = r.win ? stone === cur.me : null;
        const wins: [number, number] = [...cur.wins];
        if (mine === true) wins[0]++;
        if (mine === false) wins[1]++;
        const over = wins[0] >= BOT_TARGET || wins[1] >= BOT_TARGET;
        return { ...next, winLine: r.win, wins, phase: over ? "over" : "roundEnd", result: { mine, reason: r.win ? "five" : "draw" } };
      }
      return next;
    },
    [blocked],
  );

  // Computer's turn
  useEffect(() => {
    if (!g || !level || g.phase !== "play" || g.toMove === g.me) return;
    const id = setTimeout(
      () => {
        setG((cur) => {
          if (!cur || cur.phase !== "play" || cur.toMove === cur.me) return cur;
          const cell = caroBotMove(cur.board, cur.toMove, level, blocked, Math.random);
          return move(cur, cell, cur.toMove) ?? cur;
        });
      },
      g.lastMove === null ? 500 : 350 + Math.random() * 450,
    );
    return () => clearTimeout(id);
  }, [g, level, blocked, move]);

  // Vs-computer matches count as plays of the game (online games are counted by "party-start")
  const isNewMatch = g ? g.wins[0] + g.wins[1] === 0 && g.gameNo === 1 : false;
  useEffect(() => {
    if (isNewMatch) gameStart("co-caro");
  }, [isNewMatch]);
  useEffect(() => {
    if (g?.phase === "over") gameEnd("co-caro", { score: g.wins[0] });
  }, [g?.phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // Break between games
  useEffect(() => {
    if (g?.phase !== "roundEnd") return;
    nextTimer.current = setTimeout(() => setG((cur) => (cur ? newGame(cur) : cur)), 3500);
    return () => clearTimeout(nextTimer.current!);
  }, [g?.phase, newGame]);

  if (!level || !g) {
    return (
      <div className="mx-auto w-full max-w-[860px]">
        <div className="grid min-h-[520px] place-items-center rounded-2xl bg-bg p-5">
          <div className="w-full max-w-sm text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl text-white shadow-lift" style={{ backgroundImage: `linear-gradient(135deg, ${accent[0]}, ${accent[1]})` }}>
              <Bot className="h-8 w-8" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight">Cờ caro với máy</h2>
            <p className="mt-1 text-sm text-muted">Chạm {BOT_TARGET} ván. Bạn cầm X (đi trước) ở ván 1, sau đó đổi luân phiên.</p>
            <label className="mt-4 inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={blocked} onChange={(e) => setBlocked(e.target.checked)} className="h-4 w-4 accent-[var(--brand)]" />
              Luật chặn hai đầu
            </label>
            <div className="mt-4 grid gap-3">
              <button
                type="button"
                onClick={() => {
                  setLevel("easy");
                  setG(newGame(null));
                }}
                className="btn-primary h-12"
              >
                Dễ: máy hay sơ hở
              </button>
              <button
                type="button"
                onClick={() => {
                  setLevel("hard");
                  setG(newGame(null));
                }}
                className="btn-ghost h-12"
              >
                Khó: máy công thủ chắc chắn
              </button>
            </div>
            <button type="button" onClick={onExit} className="mt-4 inline-flex items-center gap-1 text-sm text-muted underline hover:text-fg">
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Quay lại chơi online
            </button>
            <div className="mt-6 rounded-2xl border border-line bg-surface p-4 text-left text-sm leading-relaxed text-muted [&_b]:text-fg">{RULES}</div>
          </div>
        </div>
      </div>
    );
  }

  const endGame = (mine: boolean, reason: CaroView["reason"]) =>
    setG((cur) => {
      if (!cur || cur.phase !== "play") return cur;
      const wins: [number, number] = [...cur.wins];
      wins[mine ? 0 : 1]++;
      const over = wins[0] >= BOT_TARGET || wins[1] >= BOT_TARGET;
      return { ...cur, wins, phase: over ? "over" : "roundEnd", result: { mine, reason } };
    });

  return (
    <div className="mx-auto w-full max-w-[860px]">
      <div className="min-h-[520px] rounded-2xl bg-bg p-3 sm:p-5">
        <CaroBoard
          meName="Bạn"
          oppName={level === "hard" ? "Máy (khó)" : "Máy (dễ)"}
          oppNote={g.phase === "play" && g.toMove !== g.me ? "đang nghĩ…" : null}
          myStone={g.me}
          myTurn={g.toMove === g.me}
          phase={g.phase}
          board={g.board}
          lastMove={g.lastMove}
          winLine={g.winLine}
          secs={null}
          wins={g.wins}
          target={BOT_TARGET}
          gameNo={g.gameNo}
          blocked={blocked}
          result={g.result}
          onMove={(cell) => setG((cur) => (cur && cur.phase === "play" && cur.toMove === cur.me ? (move(cur, cell, cur.me) ?? cur) : cur))}
          onResign={() => endGame(false, "resign")}
          roundEndNote={g.phase === "roundEnd" ? "Ván tiếp theo sắp bắt đầu…" : null}
          overActions={
            <>
              <button
                type="button"
                onClick={() => setG(newGame(null))}
                className="btn-primary px-8"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Đấu lại
              </button>
              <button
                type="button"
                onClick={() => {
                  setLevel(null);
                  setG(null);
                }}
                className="btn-ghost px-6"
              >
                Đổi độ khó
              </button>
              <button type="button" onClick={onExit} className="btn-ghost px-6">
                Chơi online
              </button>
            </>
          }
        />
      </div>
    </div>
  );
}

// ------------------------------------------------------------ board (shared by both modes)

type BoardProps = {
  meName: string;
  oppName: string;
  oppNote: string | null;
  myStone: Stone;
  myTurn: boolean;
  phase: "play" | "roundEnd" | "over";
  board: Cell[];
  lastMove: number | null;
  winLine: number[] | null;
  /** Seconds left for the current move (null = no clock) */
  secs: number | null;
  wins: [number, number];
  target: number;
  gameNo: number;
  blocked: boolean;
  /** After a game: mine = null for a draw */
  result: { mine: boolean | null; reason: CaroView["reason"] } | null;
  onMove: (cell: number) => void;
  onResign: () => void;
  roundEndNote: string | null;
  overActions: ReactNode;
};

const Mark = ({ stone, className = "" }: { stone: Stone; className?: string }) => (
  <span className={`font-black ${stone === 1 ? X_COLOR : O_COLOR} ${className}`}>{stone === 1 ? "X" : "O"}</span>
);

/** Smallest cell size on narrow screens (px); the board scrolls instead of shrinking further */
const MIN_CELL = 26;

function CaroBoard(p: BoardProps) {
  const oppStone: Stone = p.myStone === 1 ? 2 : 1;
  const scroller = useRef<HTMLDivElement>(null);

  // When the board is wider than the screen: start centred, then keep the last move in view
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
    el.scrollTop = (el.scrollHeight - el.clientHeight) / 2;
  }, [p.gameNo]);
  useEffect(() => {
    const el = scroller.current;
    if (!el || p.lastMove === null) return;
    const cell = el.querySelector<HTMLElement>(`[data-cell="${p.lastMove}"]`);
    if (!cell) return;
    const pad = cell.offsetWidth * 2;
    const { offsetLeft: x, offsetTop: y, offsetWidth: w, offsetHeight: h } = cell;
    if (x - pad < el.scrollLeft) el.scrollLeft = x - pad;
    else if (x + w + pad > el.scrollLeft + el.clientWidth) el.scrollLeft = x + w + pad - el.clientWidth;
    if (y - pad < el.scrollTop) el.scrollTop = y - pad;
    else if (y + h + pad > el.scrollTop + el.clientHeight) el.scrollTop = y + h + pad - el.clientHeight;
  }, [p.lastMove]);
  const canMove = p.phase === "play" && p.myTurn;
  const win = new Set(p.winLine ?? []);
  const matchWon = p.wins[0] >= p.target;

  const resultText = !p.result
    ? null
    : p.result.mine === null
      ? "Hòa: bàn cờ đã kín"
      : p.result.mine
        ? p.result.reason === "five"
          ? "Bạn thắng ván này!"
          : `${p.oppName} ${p.result.reason === "timeout" ? "hết giờ" : "đầu hàng"}, bạn thắng ván`
        : p.result.reason === "five"
          ? `${p.oppName} thắng ván này`
          : `Bạn ${p.result.reason === "timeout" ? "hết giờ" : "đầu hàng"}, ${p.oppName} thắng ván`;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Score */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-2xl p-3 text-white shadow-lift" style={{ backgroundImage: `linear-gradient(135deg, ${accent[0]}, ${accent[1]})` }}>
        <div className={`min-w-0 rounded-xl px-2 py-1.5 ${p.phase === "play" && p.myTurn ? "bg-white/25" : ""}`}>
          <p className="truncate text-sm font-semibold">
            {p.meName} <span className="rounded bg-white px-1 text-xs">{<Mark stone={p.myStone} />}</span>
          </p>
          <p className="text-xs text-white/80">bạn</p>
        </div>
        <div className="text-center">
          <p className="font-mono text-3xl font-extrabold tabular-nums">
            {p.wins[0]} : {p.wins[1]}
          </p>
          <p className="text-[11px] text-white/80">
            Ván {p.gameNo} · chạm {p.target}
            {p.blocked ? " · chặn 2 đầu" : ""}
          </p>
        </div>
        <div className={`min-w-0 rounded-xl px-2 py-1.5 text-right ${p.phase === "play" && !p.myTurn ? "bg-white/25" : ""}`}>
          <p className="truncate text-sm font-semibold">
            <span className="rounded bg-white px-1 text-xs">{<Mark stone={oppStone} />}</span> {p.oppName}
          </p>
          <p className="truncate text-xs text-white/80">{p.oppNote ?? "đối thủ"}</p>
        </div>
      </div>

      {p.phase === "play" && (
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="font-semibold">{p.myTurn ? "Lượt của bạn" : `Lượt của ${p.oppName}`}</span>
          {p.secs !== null && <span className={`font-mono font-bold tabular-nums ${p.myTurn && p.secs <= 5 ? "text-[#e5484d]" : "text-muted"}`}>{p.secs}s</span>}
        </div>
      )}

      {/* Board: rows and columns have fixed sizes, so placing a stone never changes the layout.
          On narrow screens cells stay at least MIN_CELL px and the board scrolls. */}
      <div ref={scroller} className="mt-2 max-h-[78vh] overflow-auto rounded-xl border border-line bg-[#f6efe1] [scrollbar-width:thin] dark:bg-[#2a2620]">
        <div
          className="@container mx-auto grid aspect-square"
          style={{
            width: `max(100%, ${CARO_SIZE * MIN_CELL}px)`,
            gridTemplateColumns: `repeat(${CARO_SIZE}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${CARO_SIZE}, minmax(0, 1fr))`,
          }}
          role="group"
          aria-label={`Bàn cờ caro ${CARO_SIZE}×${CARO_SIZE}`}
        >
          {p.board.map((c, i) => {
            const r = Math.floor(i / CARO_SIZE) + 1;
            const col = (i % CARO_SIZE) + 1;
            return (
              <button
                key={i}
                data-cell={i}
                type="button"
                disabled={!canMove || c !== 0}
                onClick={() => p.onMove(i)}
                aria-label={c ? `Hàng ${r} cột ${col}: ${c === 1 ? "X" : "O"}` : `Hàng ${r} cột ${col}: trống`}
                className={`relative min-h-0 min-w-0 overflow-hidden border-[0.5px] border-[#d9c9a8] p-0 dark:border-[#4a4236] ${
                  win.has(i) ? "bg-[#f5c400]/60" : p.lastMove === i ? "bg-[#1a9fe8]/15" : canMove && c === 0 ? "hover:bg-black/5 dark:hover:bg-white/10" : ""
                }`}
              >
                {c !== 0 && (
                  <span className="absolute inset-0 grid place-items-center text-[3.4cqi] leading-none">
                    <Mark stone={c as Stone} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {p.phase === "play" && (
        <p className="mt-2 text-right">
          <button type="button" onClick={p.onResign} className="inline-flex items-center gap-1 text-xs text-muted underline hover:text-fg">
            <Flag className="h-3.5 w-3.5" aria-hidden="true" />
            Đầu hàng ván này
          </button>
        </p>
      )}

      {p.phase !== "play" && resultText && (
        <div className="mt-4 text-center">
          <p className={`text-lg font-bold ${p.result?.mine ? "text-party" : "text-fg"}`}>{resultText}</p>
          {p.roundEndNote && <p className="mt-1 text-sm text-muted">{p.roundEndNote}</p>}
        </div>
      )}

      {p.phase === "over" && (
        <div className="mt-4 text-center">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <Trophy className={`mx-auto h-8 w-8 ${matchWon ? "text-[#f5a400]" : "text-muted"}`} aria-hidden="true" />
            <p className="mt-2 text-2xl font-extrabold">{matchWon ? "Bạn thắng trận!" : `${p.oppName} thắng trận`}</p>
            <p className="mt-1 text-sm text-muted">
              Tỉ số {p.wins[0]} : {p.wins[1]}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">{p.overActions}</div>
        </div>
      )}
    </div>
  );
}
