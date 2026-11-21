"use client";

import { CalendarDays, CornerDownLeft, Delete, Dices, Flame, RotateCcw, Trophy } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ShareButton, readStore, useShare, writeStore } from "@/components/game-kit";
import { gameEnd, gameStart } from "@/lib/analytics";
import { dayOf, msUntilNextDay, shortDay } from "@/lib/daily";
import { KEY_ROWS, LENGTH, TRIES, dailyAnswer, isValidGuess, keyMarks, mark, puzzleNumber, randomAnswer, shareGrid, type Mark } from "./engine";
import type { Answer } from "./words";

type Mode = "daily" | "practice";
type Saved = { guesses: string[] };
type Stats = { played: number; wins: number; streak: number; maxStreak: number; dist: number[]; lastWinDay: string | null };

const STATS_KEY = "p4f:doan-chu:stats";
const dayKey = (day: string) => `p4f:doan-chu:${day}`;
const EMPTY_STATS: Stats = { played: 0, wins: 0, streak: 0, maxStreak: 0, dist: [0, 0, 0, 0, 0, 0], lastWinDay: null };

const TILE: Record<Mark | "empty" | "typing", string> = {
  hit: "border-[#16b364] bg-[#16b364] text-white",
  near: "border-[#f5a400] bg-[#f5a400] text-white",
  miss: "border-transparent bg-[#787c8e] text-white dark:bg-[#3a3a48]",
  typing: "border-fg/40 bg-surface text-fg",
  empty: "border-line bg-surface text-fg",
};
const KEY: Record<Mark | "none", string> = {
  hit: "bg-[#16b364] text-white",
  near: "bg-[#f5a400] text-white",
  miss: "bg-[#787c8e] text-white/90 dark:bg-[#2a2a36] dark:text-white/50",
  none: "bg-surface-2 text-fg",
};

function yesterday(day: string) {
  const d = new Date(`${day}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

export default function DoanChu() {
  const today = useMemo(() => dayOf(), []);
  const [mode, setMode] = useState<Mode>("daily");
  const [answer, setAnswer] = useState<Answer>(() => dailyAnswer(today));
  const [guesses, setGuesses] = useState<string[]>([]);
  const [typed, setTyped] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);
  const [countdown, setCountdown] = useState("");
  const { share, copied } = useShare("Đoán chữ hằng ngày");

  const won = guesses.includes(answer.w);
  const over = won || guesses.length >= TRIES;

  // Restore today's progress and stats
  useEffect(() => {
    setStats(readStore(STATS_KEY, EMPTY_STATS));
    setGuesses(readStore<Saved>(dayKey(today), { guesses: [] }).guesses.filter((g) => /^[a-z]{5}$/.test(g)).slice(0, TRIES));
  }, [today]);

  useEffect(() => {
    if (!over || mode !== "daily") return;
    const tick = () => {
      const ms = msUntilNextDay();
      const h = Math.floor(ms / 3_600_000);
      const m = Math.floor((ms % 3_600_000) / 60_000);
      const sec = Math.floor((ms % 60_000) / 1000);
      setCountdown(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [over, mode]);

  const flash = (text: string) => {
    setToast(text);
    setShake(true);
    window.setTimeout(() => setShake(false), 400);
    window.setTimeout(() => setToast((t) => (t === text ? null : t)), 1600);
  };

  const recordDaily = useCallback(
    (all: string[], didWin: boolean) => {
      const prev = readStore(STATS_KEY, EMPTY_STATS);
      const streak = didWin ? (prev.lastWinDay === yesterday(today) ? prev.streak + 1 : 1) : 0;
      const dist = [...prev.dist];
      if (didWin) dist[all.length - 1]++;
      const next: Stats = {
        played: prev.played + 1,
        wins: prev.wins + (didWin ? 1 : 0),
        streak,
        maxStreak: Math.max(prev.maxStreak, streak),
        dist,
        lastWinDay: didWin ? today : prev.lastWinDay,
      };
      writeStore(STATS_KEY, next);
      setStats(next);
    },
    [today],
  );

  const submit = useCallback(() => {
    if (over) return;
    if (typed.length < LENGTH) return flash("Chưa đủ 5 chữ cái");
    if (!isValidGuess(typed)) return flash("Không giống một từ tiếng Việt");
    if (guesses.includes(typed)) return flash("Bạn đoán từ này rồi");
    const all = [...guesses, typed];
    if (all.length === 1) gameStart("doan-chu");
    setGuesses(all);
    setTyped("");
    const didWin = typed === answer.w;
    if (mode === "daily") writeStore(dayKey(today), { guesses: all } satisfies Saved);
    if (didWin || all.length >= TRIES) {
      gameEnd("doan-chu", { score: didWin ? all.length : 0 });
      if (mode === "daily") recordDaily(all, didWin);
    }
  }, [answer.w, guesses, mode, over, recordDaily, today, typed]);

  const press = useCallback(
    (k: string) => {
      if (over) return;
      if (k === "enter") submit();
      else if (k === "back") setTyped((t) => t.slice(0, -1));
      else if (/^[a-z]$/.test(k)) setTyped((t) => (t.length < LENGTH ? t + k : t));
    },
    [over, submit],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      if (e.key === "Enter") {
        e.preventDefault();
        press("enter");
      } else if (e.key === "Backspace") {
        e.preventDefault();
        press("back");
      } else {
        const letter = /^[a-zA-Z]$/.test(e.key) ? e.key.toLowerCase() : null;
        if (letter) press(letter);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [press]);

  const switchMode = (m: Mode) => {
    setMode(m);
    setTyped("");
    if (m === "daily") {
      setAnswer(dailyAnswer(today));
      setGuesses(readStore<Saved>(dayKey(today), { guesses: [] }).guesses);
    } else {
      setAnswer(randomAnswer());
      setGuesses([]);
    }
  };

  const newPractice = () => {
    setAnswer(randomAnswer());
    setGuesses([]);
    setTyped("");
  };

  const keys = keyMarks(guesses, answer.w);
  const rows = Array.from({ length: TRIES }, (_, r) => (r < guesses.length ? guesses[r] : r === guesses.length ? typed : ""));
  const title = mode === "daily" ? `Đoán chữ #${puzzleNumber(today)} · ${shortDay(today)}` : "Đoán chữ · Luyện tập";

  return (
    <div className="mx-auto w-full max-w-[560px]">
      <div className="relative flex min-h-[600px] flex-col rounded-2xl bg-bg p-3 select-none sm:p-5">
        {/* Mode switch */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl border border-line bg-surface p-1 text-sm font-semibold shadow-card" role="tablist" aria-label="Chế độ chơi">
            {(
              [
                ["daily", "Hôm nay", CalendarDays],
                ["practice", "Luyện tập", Dices],
              ] as const
            ).map(([m, label, Icon]) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => switchMode(m)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors ${mode === m ? "bg-brand text-brand-ink" : "text-muted hover:text-fg"}`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
          {stats.streak > 0 && (
            <span className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-arcade" title="Chuỗi ngày thắng">
              <Flame className="h-4 w-4" aria-hidden="true" />
              {stats.streak}
            </span>
          )}
        </div>
        <p className="mt-2 text-center text-xs font-semibold text-muted">{title}</p>

        {/* Board */}
        <div className="relative mx-auto mt-2 grid w-full max-w-[330px] gap-1.5" aria-label="Bảng đoán chữ">
          {rows.map((word, r) => {
            const done = r < guesses.length;
            const marks = done ? mark(word, answer.w) : null;
            return (
              <div key={r} className={`grid grid-cols-5 gap-1.5 ${shake && r === guesses.length ? "animate-[shake_350ms_ease-in-out]" : ""}`}>
                {Array.from({ length: LENGTH }, (_, i) => {
                  const ch = word[i] ?? "";
                  const tone = marks ? TILE[marks[i]] : ch ? TILE.typing : TILE.empty;
                  return (
                    <span
                      key={i}
                      className={`grid aspect-square place-items-center rounded-lg border-2 text-2xl font-extrabold uppercase transition-colors duration-300 sm:text-3xl ${tone}`}
                      style={marks ? { transitionDelay: `${i * 90}ms` } : undefined}
                    >
                      {ch}
                    </span>
                  );
                })}
              </div>
            );
          })}
          {toast && (
            <p role="alert" className="absolute top-2 left-1/2 z-10 -translate-x-1/2 rounded-lg bg-fg px-3 py-2 text-sm font-semibold whitespace-nowrap text-bg shadow-lift">
              {toast}
            </p>
          )}
        </div>

        {/* Result */}
        {over ? (
          <div className="mt-4 rounded-2xl border border-line bg-surface p-4 text-center shadow-card">
            <p className="text-sm text-muted">{won ? `Đoán đúng sau ${guesses.length}/${TRIES} lượt!` : "Hết lượt rồi! Từ đúng là"}</p>
            <p className="mt-1 text-3xl font-extrabold tracking-tight">{answer.vi}</p>
            {mode === "daily" && (
              <div className="mx-auto mt-3 grid max-w-xs grid-cols-4 gap-2 text-center">
                {(
                  [
                    ["Đã chơi", stats.played],
                    ["Thắng", stats.played ? `${Math.round((stats.wins / stats.played) * 100)}%` : "0%"],
                    ["Chuỗi", stats.streak],
                    ["Dài nhất", stats.maxStreak],
                  ] as const
                ).map(([l, v]) => (
                  <div key={l}>
                    <p className="font-mono text-lg font-bold">{v}</p>
                    <p className="text-[10px] tracking-wider text-muted uppercase">{l}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 flex flex-col justify-center gap-2 sm:flex-row">
              <ShareButton
                copied={copied}
                onClick={() =>
                  share(`${mode === "daily" ? `Đoán chữ #${puzzleNumber(today)}` : "Đoán chữ (luyện tập)"} ${won ? guesses.length : "X"}/${TRIES}\n${shareGrid(guesses, answer.w)}`)
                }
              />
              {mode === "daily" ? (
                <button type="button" onClick={() => switchMode("practice")} className="btn-ghost px-6">
                  <Dices className="h-4 w-4" aria-hidden="true" />
                  Chơi luyện tập
                </button>
              ) : (
                <button type="button" onClick={newPractice} className="btn-ghost px-6">
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Từ khác
                </button>
              )}
            </div>
            {mode === "daily" && countdown && <p className="mt-3 text-xs text-muted">Từ mới sau {countdown}</p>}
          </div>
        ) : (
          <p className="mt-3 text-center text-xs text-muted">
            Gõ không dấu: “nguoi” là “người”. <span className="inline-block rounded bg-[#16b364] px-1 text-white">Xanh</span> đúng chỗ,{" "}
            <span className="inline-block rounded bg-[#f5a400] px-1 text-white">vàng</span> có trong từ nhưng sai chỗ.
          </p>
        )}

        {/* Keyboard */}
        <div className="mt-auto space-y-1.5 pt-4" aria-label="Bàn phím">
          {KEY_ROWS.map((row, r) => (
            <div key={r} className="flex justify-center gap-1.5">
              {r === 2 && <KeyButton label="Đoán" wide onPress={() => press("enter")} icon={<CornerDownLeft className="h-4 w-4" />} />}
              {row.map((k) => (
                <KeyButton key={k} label={k} tone={KEY[keys[k] ?? "none"]} onPress={() => press(k)} />
              ))}
              {r === 2 && <KeyButton label="Xóa" wide onPress={() => press("back")} icon={<Delete className="h-4 w-4" />} />}
            </div>
          ))}
        </div>
        {mode === "daily" && !over && stats.maxStreak > 0 && (
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
            <Trophy className="h-3.5 w-3.5 text-arcade" aria-hidden="true" />
            Chuỗi dài nhất: {stats.maxStreak} ngày
          </p>
        )}
      </div>
    </div>
  );
}

function KeyButton({ label, onPress, tone = KEY.none, wide = false, icon }: { label: string; onPress: () => void; tone?: string; wide?: boolean; icon?: React.ReactNode }) {
  return (
    <button
      type="button"
      tabIndex={-1}
      aria-label={label}
      onPointerDown={(e) => {
        e.preventDefault();
        onPress();
      }}
      onClick={(e) => e.detail === 0 && onPress()}
      className={`flex h-12 items-center justify-center gap-1 rounded-lg text-sm font-bold uppercase transition active:scale-95 sm:h-13 ${wide ? "min-w-14 flex-[1.4] px-2 text-xs normal-case" : "max-w-11 flex-1"} ${
        wide ? KEY.none : tone
      }`}
    >
      {icon}
      {wide ? <span className="hidden sm:inline">{label}</span> : label}
    </button>
  );
}
