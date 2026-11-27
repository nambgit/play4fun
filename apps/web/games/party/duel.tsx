"use client";

import { DUEL_SECONDS_OPTIONS, DUEL_TARGET_OPTIONS, PARTY_GAMES, type DuelSettings, type DuelView } from "@play4fun/party";
import { PLAY_ERROR_TEXT, botPick, hints, lastSyllable, loseTurn, openRound, playWord, type BotLevel, type DuelRound, type EndReason } from "@play4fun/party/noi-tu";
import { ArrowLeft, Bot, Flag, RotateCcw, Send, Trophy } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Choice, PartyRoom, nameOf, type GameProps, type SettingsProps } from "@/components/party/party-room";
import { gameEnd, gameStart } from "@/lib/analytics";
import { getGame } from "@/lib/games";
import { useCountdown } from "@/lib/party-client";

const accent = getGame("noi-tu")!.cover;
const TITLE = "Nối từ";
const MAX = PARTY_GAMES["noi-tu"].maxPlayers;

const RULES = (
  <ol className="list-decimal space-y-1 pl-4">
    <li>
      Lần lượt nối từ: từ sau bắt đầu bằng tiếng cuối của từ trước, ví dụ <b>“học sinh” → “sinh viên”</b>. Bạn chỉ cần gõ tiếng thứ hai.
    </li>
    <li>Mỗi từ chỉ dùng một lần trong một hiệp. Gõ sai không mất lượt, cứ thử lại khi còn giờ.</li>
    <li>
      Hết giờ hoặc bỏ cuộc là <b>bị loại khỏi hiệp</b>. Nói được từ khiến người kế tiếp <b>hết đường nối</b> thì người đó bị loại!
    </li>
    <li>Người trụ lại cuối cùng thắng hiệp. Ai thắng đủ số hiệp trước là thắng trận. Chơi được 2 đến {MAX} người.</li>
  </ol>
);

const OUT_TEXT: Record<EndReason, string> = { stuck: "bí từ", timeout: "hết giờ", skip: "bỏ cuộc", left: "rời phòng" };

export default function Play() {
  const [mode, setMode] = useState<"online" | "bot">("online");
  if (mode === "bot") return <BotDuel onExit={() => setMode("online")} />;
  return (
    <PartyRoom
      slug="noi-tu"
      title={TITLE}
      emoji="🔗"
      accent={accent}
      Settings={DuelSettingsPanel}
      Game={OnlineDuel}
      rules={RULES}
      offline={{ label: "Chơi với máy", onStart: () => setMode("bot") }}
    />
  );
}

function DuelSettingsPanel({ value, onChange, disabled }: SettingsProps<DuelSettings>) {
  return (
    <>
      <Choice label="Thể thức" value={value.target} options={DUEL_TARGET_OPTIONS} format={(v) => (v === 1 ? "1 hiệp" : `Chạm ${v} hiệp`)} onChange={(target) => onChange({ ...value, target })} disabled={disabled} />
      <Choice label="Mỗi lượt" value={value.seconds} options={DUEL_SECONDS_OPTIONS} format={(v) => `${v} giây`} onChange={(seconds) => onChange({ ...value, seconds })} disabled={disabled} />
      <p className="mt-1 text-xs text-muted">Phòng chơi từ 2 đến {MAX} người. Mỗi hiệp là đấu loại: người trụ lại cuối cùng thắng.</p>
    </>
  );
}

// ------------------------------------------------------------ online

function OnlineDuel({ view, api, me, players }: GameProps<DuelView>) {
  const secs = useCountdown(view.phase === "play" ? view.endsAt : undefined, api.now);
  const nextIn = useCountdown(view.phase === "roundEnd" ? view.nextAt : undefined, api.now);
  const name = (id: string) => nameOf(players, id);
  const present = view.seats.filter((id) => players.get(id)?.connected);
  const iWant = view.rematch.includes(me);

  return (
    <DuelBoard
      me={me}
      players={view.seats.map((id) => ({
        id,
        name: id === me ? `${name(id)} (bạn)` : name(id),
        wins: view.wins[id] ?? 0,
        alive: view.alive.includes(id),
        note: players.get(id)?.connected ? null : "mất kết nối",
      }))}
      turn={view.turn}
      phase={view.phase}
      need={view.need}
      chain={view.chain}
      secs={secs}
      target={view.target}
      roundNo={view.roundNo}
      out={view.out}
      roundWinner={view.roundWinner}
      reason={view.reason}
      hints={view.hints}
      error={view.myError}
      champion={view.champion}
      onWord={(text) => api.act({ type: "duel:word", text })}
      onSkip={() => api.act({ type: "duel:skip" })}
      roundEndNote={view.phase === "roundEnd" ? `Hiệp tiếp theo sau ${nextIn}s…` : null}
      overActions={
        <>
          <button type="button" onClick={() => api.act({ type: "duel:rematch" })} disabled={iWant} className="btn-primary px-8 disabled:opacity-60">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            {iWant ? `Chờ mọi người đồng ý… (${view.rematch.length}/${present.length})` : view.rematch.length ? `Chơi lại (${view.rematch.length}/${present.length} đã sẵn sàng)` : "Chơi lại"}
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

const BOT_SECONDS = 30;
const BOT_TARGET = 3;
const BOT_ID = "bot";
const ME_ID = "me";

function BotDuel({ onExit }: { onExit: () => void }) {
  const [level, setLevel] = useState<BotLevel | null>(null);
  const [, force] = useState(0);
  const rerender = useCallback(() => force((n) => n + 1), []);
  const game = useRef<{ round: DuelRound; wins: [number, number]; roundNo: number; phase: "play" | "roundEnd" | "over"; endsAt: number; nextAt: number; hints: string[] | null }>(null);
  const [error, setError] = useState<{ text: string; at: number } | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const startRound = useCallback(() => {
    const g = game.current!;
    g.roundNo++;
    // Player opens odd rounds, computer even rounds
    g.round = openRound(2, g.roundNo % 2 === 1 ? 0 : 1, Math.random);
    g.phase = "play";
    g.hints = null;
    g.endsAt = Date.now() + BOT_SECONDS * 1000;
    setError(null);
    rerender();
  }, [rerender]);

  const endRound = useCallback(() => {
    const g = game.current!;
    const w = g.round.winner;
    if (w === null) return;
    g.wins[w as 0 | 1]++;
    g.endsAt = 0;
    if (g.wins[w as 0 | 1] >= BOT_TARGET) {
      g.phase = "over";
      gameEnd("noi-tu", { score: g.wins[0] });
    } else {
      g.phase = "roundEnd";
      g.nextAt = Date.now() + 3000;
    }
    rerender();
  }, [rerender]);

  const begin = (lv: BotLevel) => {
    // Vs-computer matches count as plays of the game (online games are counted by "party-start")
    gameStart("noi-tu");
    game.current = { round: openRound(2, 0, Math.random), wins: [0, 0], roundNo: 0, phase: "play", endsAt: 0, nextAt: 0, hints: null };
    setLevel(lv);
    startRound();
  };

  // Clock: player's turn timeout, round break
  useEffect(() => {
    const g = game.current;
    if (!level || !g) return;
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (g.phase === "play" && g.round.turn === 0 && t >= g.endsAt) {
        g.hints = hints(g.round);
        loseTurn(g.round, "timeout");
        endRound();
      } else if (g.phase === "roundEnd" && t >= g.nextAt) startRound();
    }, 200);
    return () => clearInterval(id);
  }, [level, endRound, startRound]);

  // Computer's turn
  const g = game.current;
  const botTurn = !!g && g.phase === "play" && g.round.turn === 1;
  const chainLen = g?.round.chain.length ?? 0;
  useEffect(() => {
    if (!botTurn || !level) return;
    const think = 900 + Math.random() * (level === "hard" ? 1600 : 2200);
    const id = setTimeout(() => {
      const cur = game.current!;
      if (cur.phase !== "play" || cur.round.turn !== 1) return;
      const word = botPick(cur.round, level, Math.random);
      if (!word) {
        loseTurn(cur.round, "skip");
        endRound();
        return;
      }
      playWord(cur.round, 1, lastSyllable(word));
      if (cur.round.winner !== null) endRound();
      else {
        cur.endsAt = Date.now() + BOT_SECONDS * 1000;
        rerender();
      }
    }, think);
    return () => clearTimeout(id);
  }, [botTurn, chainLen, level, endRound, rerender]);

  if (!level || !g) {
    return (
      <div className="mx-auto w-full max-w-[860px]">
        <div className="grid min-h-[520px] place-items-center rounded-2xl bg-bg p-5">
          <div className="w-full max-w-sm text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl text-white shadow-lift" style={{ backgroundImage: `linear-gradient(135deg, ${accent[0]}, ${accent[1]})` }}>
              <Bot className="h-8 w-8" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight">Đấu với máy</h2>
            <p className="mt-1 text-sm text-muted">
              Chạm {BOT_TARGET} hiệp, mỗi lượt {BOT_SECONDS} giây. Chọn độ khó:
            </p>
            <div className="mt-5 grid gap-3">
              <button type="button" onClick={() => begin("easy")} className="btn-primary h-12">
                Dễ: máy chọn từ thông dụng
              </button>
              <button type="button" onClick={() => begin("hard")} className="btn-ghost h-12">
                Khó: máy tìm cách làm bạn bí
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

  const submit = (text: string) => {
    const r = playWord(g.round, 0, text);
    if (!r.ok) {
      if (r.error !== "turn") setError({ text: PLAY_ERROR_TEXT[r.error](r.word ?? ""), at: Date.now() });
      return;
    }
    setError(null);
    if (g.round.winner !== null) endRound();
    else {
      g.endsAt = Date.now() + BOT_SECONDS * 1000;
      rerender();
    }
  };

  const ids = [ME_ID, BOT_ID];
  return (
    <div className="mx-auto w-full max-w-[860px]">
      <div className="min-h-[520px] rounded-2xl bg-bg p-3 sm:p-5">
        <DuelBoard
          me={ME_ID}
          players={[
            { id: ME_ID, name: "Bạn", wins: g.wins[0], alive: g.round.alive[0], note: null },
            { id: BOT_ID, name: level === "hard" ? "Máy (khó)" : "Máy (dễ)", wins: g.wins[1], alive: g.round.alive[1], note: botTurn ? "đang nghĩ…" : null },
          ]}
          turn={ids[g.round.turn]}
          phase={g.phase}
          need={g.round.need}
          chain={g.round.chain.map((c) => ({ word: c.word, by: c.by === null ? null : ids[c.by] }))}
          secs={g.phase === "play" && g.round.turn === 0 ? Math.max(0, Math.ceil((g.endsAt - now) / 1000)) : BOT_SECONDS}
          target={BOT_TARGET}
          roundNo={g.roundNo}
          out={g.round.out.map((o) => ({ id: ids[o.seat], reason: o.reason }))}
          roundWinner={g.round.winner === null ? null : ids[g.round.winner]}
          reason={g.round.reason}
          hints={g.phase === "play" ? null : g.hints}
          error={error}
          champion={g.phase === "over" ? (g.wins[0] >= BOT_TARGET ? ME_ID : BOT_ID) : null}
          onWord={submit}
          onSkip={() => {
            g.hints = hints(g.round);
            loseTurn(g.round, "skip");
            endRound();
          }}
          roundEndNote={g.phase === "roundEnd" ? `Hiệp tiếp theo sau ${Math.max(0, Math.ceil((g.nextAt - now) / 1000))}s…` : null}
          overActions={
            <>
              <button type="button" onClick={() => begin(level)} className="btn-primary px-8">
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Đấu lại
              </button>
              <button type="button" onClick={() => setLevel(null)} className="btn-ghost px-6">
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

type Player = { id: string; name: string; wins: number; alive: boolean; note: string | null };

type BoardProps = {
  me: string;
  /** In turn order */
  players: Player[];
  turn: string;
  phase: "play" | "roundEnd" | "over";
  need: string;
  /** by: player id, null for an opening word */
  chain: { word: string; by: string | null }[];
  secs: number;
  target: number;
  roundNo: number;
  out: { id: string; reason: EndReason }[];
  roundWinner: string | null;
  reason: EndReason | null;
  hints: string[] | null;
  error: { text: string; at: number } | null;
  champion: string | null;
  onWord: (text: string) => void;
  onSkip: () => void;
  roundEndNote: string | null;
  overActions: ReactNode;
};

const BUBBLE = ["bg-[#f5a400]", "bg-[#16b364]", "bg-[#1a9fe8]", "bg-[#ec4899]", "bg-[#0ea5e9]", "bg-[#e5484d]", "bg-[#8b5cf6]", "bg-[#14b8a6]", "bg-[#f97316]"];

function DuelBoard(p: BoardProps) {
  const [text, setText] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const meAlive = p.players.find((x) => x.id === p.me)?.alive ?? false;
  const myTurn = p.turn === p.me;
  const canType = p.phase === "play" && myTurn;
  const others = p.players.filter((x) => x.id !== p.me);
  const colorOf = new Map(others.map((x, i) => [x.id, BUBBLE[i % BUBBLE.length]]));
  const nameOf = (id: string | null) => (id ? (p.players.find((x) => x.id === id)?.name ?? "Ai đó") : "");
  const shortName = (id: string) => (id === p.me ? "Bạn" : nameOf(id));
  const group = p.players.length > 2;

  // A new word was accepted: clear the box, scroll the chain, focus when it is my turn again
  const len = p.chain.length;
  useEffect(() => {
    setText("");
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" });
  }, [len]);
  useEffect(() => {
    if (canType) input.current?.focus({ preventScroll: true });
  }, [canType, p.roundNo]);

  const send = () => {
    if (!canType || !text.trim()) return;
    p.onWord(text);
  };

  const lastOut = p.out[p.out.length - 1];
  const result =
    p.roundWinner === null
      ? null
      : p.roundWinner === p.me
        ? group
          ? "Bạn trụ lại cuối cùng: thắng hiệp!"
          : p.reason === "stuck"
            ? `Bạn làm ${nameOf(lastOut?.id ?? null)} bí từ! Thắng hiệp`
            : `${nameOf(lastOut?.id ?? null)} ${OUT_TEXT[p.reason ?? "timeout"]}, bạn thắng hiệp`
        : `${nameOf(p.roundWinner)} thắng hiệp${lastOut ? ` (${shortName(lastOut.id)} ${OUT_TEXT[lastOut.reason]})` : ""}`;

  return (
    <div className="mx-auto max-w-xl">
      {/* Players & score */}
      <div className="rounded-2xl p-3 text-white shadow-lift" style={{ backgroundImage: `linear-gradient(135deg, ${accent[0]}, ${accent[1]})` }}>
        <div className="flex items-center justify-between text-xs text-white/85">
          <span>
            Hiệp {p.roundNo} · chạm {p.target}
          </span>
          {p.phase === "play" && group && <span>{p.players.filter((x) => x.alive).length} người còn trong hiệp</span>}
        </div>
        <ul className={`mt-2 grid gap-1.5 ${p.players.length > 4 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2"}`}>
          {p.players.map((x) => {
            const up = p.phase === "play" && x.id === p.turn;
            const outNow = p.phase === "play" && !x.alive;
            return (
              <li key={x.id} className={`flex min-w-0 items-center gap-2 rounded-xl px-2.5 py-1.5 ${up ? "bg-white/30 ring-2 ring-white/70" : "bg-white/10"} ${outNow ? "opacity-50" : ""}`}>
                <span className={`min-w-0 flex-1 truncate text-sm font-semibold ${outNow ? "line-through" : ""}`}>{x.name}</span>
                {x.note && <span className="shrink-0 text-[10px] text-white/80">{x.note}</span>}
                <span className="shrink-0 rounded-md bg-black/20 px-1.5 font-mono text-sm font-bold tabular-nums" aria-label={`${x.wins} hiệp thắng`}>
                  {x.wins}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Chain */}
      <ol ref={list} className="mt-3 flex max-h-64 min-h-40 flex-col gap-1.5 overflow-y-auto rounded-2xl border border-line bg-surface p-3" aria-label="Chuỗi từ">
        {p.chain.map((c, i) => {
          const mine = c.by === p.me;
          return (
            <li key={`${i}-${c.word}`} className={`flex flex-col ${c.by === null ? "items-center" : mine ? "items-end" : "items-start"}`}>
              {group && c.by && !mine && <span className="mb-0.5 px-1 text-[11px] text-muted">{nameOf(c.by)}</span>}
              <span
                className={`rounded-2xl px-3 py-1.5 text-sm font-semibold ${
                  c.by === null ? "bg-surface-2 text-muted" : mine ? "bg-brand text-white" : `${colorOf.get(c.by) ?? "bg-[#f5a400]"} text-white`
                } ${i === p.chain.length - 1 ? "ring-2 ring-fg/20" : ""}`}
              >
                {c.word}
              </span>
            </li>
          );
        })}
      </ol>

      {p.phase === "play" && lastOut && group && (
        <p className="mt-2 text-center text-sm text-muted" role="status">
          {shortName(lastOut.id)} bị loại ({OUT_TEXT[lastOut.reason]}){p.hints && p.hints.length > 0 ? `. Có thể nối: ${p.hints.join(", ")}` : ""}
        </p>
      )}

      {p.phase === "play" && (
        <>
          <div className="mt-3 flex items-center justify-between gap-2 text-sm">
            <span className="font-semibold">{myTurn ? "Lượt của bạn" : meAlive ? `Lượt của ${nameOf(p.turn)}` : `Bạn đã bị loại ở hiệp này · lượt của ${nameOf(p.turn)}`}</span>
            <span className={`font-mono font-bold tabular-nums ${myTurn && p.secs <= 5 ? "text-[#e5484d]" : "text-muted"}`}>{p.secs}s</span>
          </div>
          <form
            className="mt-2 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <span className="flex h-12 shrink-0 items-center rounded-xl bg-surface-2 px-3 font-semibold">{p.need}</span>
            <input
              ref={input}
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 20))}
              disabled={!canType}
              placeholder={canType ? "gõ tiếng tiếp theo" : meAlive ? "chờ tới lượt…" : "đang xem…"}
              aria-label={`Tiếng tiếp theo sau “${p.need}”`}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              enterKeyHint="send"
              className="h-12 w-full min-w-0 rounded-xl border border-line bg-surface px-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-60"
            />
            <button type="submit" disabled={!canType} className="btn-primary h-12 shrink-0 px-4 disabled:opacity-50" aria-label="Gửi">
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
          <div className="mt-2 flex min-h-6 items-center justify-between gap-2">
            {p.error && canType ? (
              <p key={p.error.at} role="alert" className="text-sm font-medium text-[#e5484d]">
                {p.error.text}
              </p>
            ) : (
              <span />
            )}
            {canType && (
              <button type="button" onClick={p.onSkip} className="inline-flex shrink-0 items-center gap-1 text-xs text-muted underline hover:text-fg">
                <Flag className="h-3.5 w-3.5" aria-hidden="true" />
                Chịu thua hiệp này
              </button>
            )}
          </div>
        </>
      )}

      {p.phase !== "play" && result && (
        <div className="mt-4 text-center">
          <p className={`text-lg font-bold ${p.roundWinner === p.me ? "text-party" : "text-fg"}`}>{result}</p>
          {p.hints && p.hints.length > 0 && <p className="mt-1 text-sm text-muted">Có thể nối: {p.hints.join(", ")}</p>}
          {p.roundEndNote && <p className="mt-2 text-sm text-muted">{p.roundEndNote}</p>}
        </div>
      )}

      {p.phase === "over" && (
        <div className="mt-5 text-center">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <Trophy className={`mx-auto h-8 w-8 ${p.champion === p.me ? "text-[#f5a400]" : "text-muted"}`} aria-hidden="true" />
            <p className="mt-2 text-2xl font-extrabold">{p.champion === p.me ? "Bạn thắng trận!" : `${nameOf(p.champion)} thắng trận`}</p>
            <p className="mt-1 text-sm text-muted">
              {[...p.players]
                .sort((a, b) => b.wins - a.wins)
                .map((x) => `${shortName(x.id)} ${x.wins}`)
                .join(" · ")}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">{p.overActions}</div>
        </div>
      )}
    </div>
  );
}
