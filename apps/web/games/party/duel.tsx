"use client";

import { DUEL_SECONDS_OPTIONS, DUEL_TARGET_OPTIONS, type DuelSettings, type DuelView } from "@play4fun/party";
import { PLAY_ERROR_TEXT, botPick, hints, lastSyllable, loseTurn, openRound, playWord, type BotLevel, type DuelRound, type EndReason } from "@play4fun/party/noi-tu";
import { ArrowLeft, Bot, Flag, RotateCcw, Send, Trophy } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Choice, PartyRoom, nameOf, type GameProps, type SettingsProps } from "@/components/party/party-room";
import { getGame } from "@/lib/games";
import { useCountdown } from "@/lib/party-client";

const accent = getGame("noi-tu")!.cover;
const TITLE = "Nối từ";

const RULES = (
  <ol className="list-decimal space-y-1 pl-4">
    <li>
      Hai người thay phiên nối từ: từ sau bắt đầu bằng tiếng cuối của từ trước, ví dụ <b>“học sinh” → “sinh viên”</b>. Bạn chỉ cần gõ tiếng thứ hai.
    </li>
    <li>Mỗi từ chỉ dùng một lần trong một hiệp. Gõ sai không mất lượt, cứ thử lại khi còn giờ.</li>
    <li>
      Hết giờ hoặc bỏ cuộc là <b>thua hiệp</b>. Nói được từ khiến đối thủ <b>hết đường nối</b> là thắng hiệp ngay!
    </li>
    <li>Ai thắng đủ số hiệp trước là thắng trận.</li>
  </ol>
);

export default function Play() {
  const [mode, setMode] = useState<"online" | "bot">("online");
  if (mode === "bot") return <BotDuel onExit={() => setMode("online")} />;
  return (
    <PartyRoom
      slug="noi-tu"
      title={TITLE}
      emoji="⚔️"
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
      <Choice label="Thể thức" value={value.target} options={DUEL_TARGET_OPTIONS} format={(v) => `Chạm ${v} hiệp`} onChange={(target) => onChange({ ...value, target })} disabled={disabled} />
      <Choice label="Mỗi lượt" value={value.seconds} options={DUEL_SECONDS_OPTIONS} format={(v) => `${v} giây`} onChange={(seconds) => onChange({ ...value, seconds })} disabled={disabled} />
    </>
  );
}

// ------------------------------------------------------------ online

function OnlineDuel({ view, api, me, players }: GameProps<DuelView>) {
  const opp = view.seats.find((id) => id !== me) ?? view.seats[1];
  const secs = useCountdown(view.phase === "play" ? view.endsAt : undefined, api.now);
  const nextIn = useCountdown(view.phase === "roundEnd" ? view.nextAt : undefined, api.now);
  const iWant = view.rematch.includes(me);
  const oppWants = view.rematch.includes(opp);
  const oppOnline = players.get(opp)?.connected ?? false;

  return (
    <DuelBoard
      meName={nameOf(players, me)}
      oppName={nameOf(players, opp)}
      oppNote={oppOnline ? null : "mất kết nối…"}
      myTurn={view.turn === me}
      phase={view.phase}
      need={view.need}
      chain={view.chain.map((c) => ({ word: c.word, mine: c.by === null ? null : c.by === me }))}
      secs={secs}
      wins={[view.wins[me] ?? 0, view.wins[opp] ?? 0]}
      target={view.target}
      roundNo={view.roundNo}
      roundWonByMe={view.roundWinner === null ? null : view.roundWinner === me}
      reason={view.reason}
      hints={view.hints}
      error={view.myError}
      onWord={(text) => api.act({ type: "duel:word", text })}
      onSkip={() => api.act({ type: "duel:skip" })}
      roundEndNote={view.phase === "roundEnd" ? `Hiệp tiếp theo sau ${nextIn}s…` : null}
      overActions={
        <>
          <button type="button" onClick={() => api.act({ type: "duel:rematch" })} disabled={iWant} className="btn-primary px-8 disabled:opacity-60">
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

const BOT_SECONDS = 15;
const BOT_TARGET = 3;

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
    g.round = openRound(g.roundNo % 2 === 1 ? 0 : 1, Math.random);
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
    g.wins[w]++;
    g.endsAt = 0;
    if (g.wins[w] >= BOT_TARGET) g.phase = "over";
    else {
      g.phase = "roundEnd";
      g.nextAt = Date.now() + 3000;
    }
    rerender();
  }, [rerender]);

  const begin = (lv: BotLevel) => {
    game.current = { round: openRound(0, Math.random), wins: [0, 0], roundNo: 0, phase: "play", endsAt: 0, nextAt: 0, hints: null };
    setLevel(lv);
    startRound();
  };

  // Clock: player's turn timeout, round break, computer's "thinking"
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

  return (
    <div className="mx-auto w-full max-w-[860px]">
      <div className="min-h-[520px] rounded-2xl bg-bg p-3 sm:p-5">
        <DuelBoard
          meName="Bạn"
          oppName={level === "hard" ? "Máy (khó)" : "Máy (dễ)"}
          oppNote={botTurn ? "đang nghĩ…" : null}
          myTurn={g.round.turn === 0}
          phase={g.phase}
          need={g.round.need}
          chain={g.round.chain.map((c) => ({ word: c.word, mine: c.by === null ? null : c.by === 0 }))}
          secs={g.phase === "play" && g.round.turn === 0 ? Math.max(0, Math.ceil((g.endsAt - now) / 1000)) : BOT_SECONDS}
          wins={g.wins}
          target={BOT_TARGET}
          roundNo={g.roundNo}
          roundWonByMe={g.round.winner === null ? null : g.round.winner === 0}
          reason={g.round.reason}
          hints={g.phase === "play" ? null : g.hints}
          error={error}
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

type BoardProps = {
  meName: string;
  oppName: string;
  oppNote: string | null;
  myTurn: boolean;
  phase: "play" | "roundEnd" | "over";
  need: string;
  /** mine: null for the opening word */
  chain: { word: string; mine: boolean | null }[];
  secs: number;
  wins: [number, number];
  target: number;
  roundNo: number;
  roundWonByMe: boolean | null;
  reason: EndReason | null;
  hints: string[] | null;
  error: { text: string; at: number } | null;
  onWord: (text: string) => void;
  onSkip: () => void;
  roundEndNote: string | null;
  overActions: ReactNode;
};

function DuelBoard(p: BoardProps) {
  const [text, setText] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const canType = p.phase === "play" && p.myTurn;

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

  const result =
    p.roundWonByMe === null
      ? null
      : p.roundWonByMe
        ? p.reason === "stuck"
          ? `Bạn làm ${p.oppName} bí từ! Thắng hiệp`
          : `${p.oppName} ${p.reason === "timeout" ? "hết giờ" : "bỏ cuộc"}, bạn thắng hiệp`
        : p.reason === "stuck"
          ? `Không còn từ nào để nối “${p.need}”, ${p.oppName} thắng hiệp`
          : `Bạn ${p.reason === "timeout" ? "hết giờ" : "bỏ cuộc"}, ${p.oppName} thắng hiệp`;
  const matchWon = p.wins[0] >= p.target;

  return (
    <div className="mx-auto max-w-xl">
      {/* Score */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-2xl p-3 text-white shadow-lift" style={{ backgroundImage: `linear-gradient(135deg, ${accent[0]}, ${accent[1]})` }}>
        <div className={`min-w-0 rounded-xl px-2 py-1.5 ${p.phase === "play" && p.myTurn ? "bg-white/25" : ""}`}>
          <p className="truncate text-sm font-semibold">{p.meName}</p>
          <p className="text-xs text-white/80">bạn</p>
        </div>
        <div className="text-center">
          <p className="font-mono text-3xl font-extrabold tabular-nums">
            {p.wins[0]} : {p.wins[1]}
          </p>
          <p className="text-[11px] text-white/80">
            Hiệp {p.roundNo} · chạm {p.target}
          </p>
        </div>
        <div className={`min-w-0 rounded-xl px-2 py-1.5 text-right ${p.phase === "play" && !p.myTurn ? "bg-white/25" : ""}`}>
          <p className="truncate text-sm font-semibold">{p.oppName}</p>
          <p className="truncate text-xs text-white/80">{p.oppNote ?? "đối thủ"}</p>
        </div>
      </div>

      {/* Chain */}
      <ol ref={list} className="mt-3 flex max-h-64 min-h-40 flex-col gap-1.5 overflow-y-auto rounded-2xl border border-line bg-surface p-3" aria-label="Chuỗi từ">
        {p.chain.map((c, i) => (
          <li key={`${i}-${c.word}`} className={`flex ${c.mine === null ? "justify-center" : c.mine ? "justify-start" : "justify-end"}`}>
            <span
              className={`rounded-2xl px-3 py-1.5 text-sm font-semibold ${
                c.mine === null ? "bg-surface-2 text-muted" : c.mine ? "bg-brand text-white" : "bg-[#f5a400] text-white"
              } ${i === p.chain.length - 1 ? "ring-2 ring-fg/20" : ""}`}
            >
              {c.word}
            </span>
          </li>
        ))}
      </ol>

      {p.phase === "play" && (
        <>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="font-semibold">{p.myTurn ? "Lượt của bạn" : `Lượt của ${p.oppName}`}</span>
            <span className={`font-mono font-bold tabular-nums ${p.myTurn && p.secs <= 5 ? "text-[#e5484d]" : "text-muted"}`}>{p.secs}s</span>
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
              placeholder={canType ? "gõ tiếng tiếp theo" : "chờ đối thủ…"}
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
          <p className={`text-lg font-bold ${p.roundWonByMe ? "text-party" : "text-fg"}`}>{result}</p>
          {p.hints && p.hints.length > 0 && <p className="mt-1 text-sm text-muted">Có thể nối: {p.hints.join(", ")}</p>}
          {p.roundEndNote && <p className="mt-2 text-sm text-muted">{p.roundEndNote}</p>}
        </div>
      )}

      {p.phase === "over" && (
        <div className="mt-5 text-center">
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
