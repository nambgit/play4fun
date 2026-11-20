"use client";

import { Bell, BellRing, Check, Delete, Heart, Pause, Play, RotateCcw, Share2, Shuffle, Trophy } from "lucide-react";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import {
  MAX_LIVES,
  MAX_SECONDS,
  START_SECONDS,
  backspace,
  createGame,
  formatGrade,
  grade,
  levelFor,
  markSheet,
  submit,
  teacherComment,
  tick,
  typeDigit,
  type GameState,
} from "./engine";
import { DailyBadge } from "@/components/daily-badge";
import type { DailyInfo } from "@/lib/daily";
import { finishDaily } from "@/lib/daily-client";
import { gameEnd, gameStart } from "@/lib/analytics";
import { resultUrl } from "@/lib/share";
import { notifyRecordChanged } from "@/lib/record-sync";
import { SaveRecordHint } from "@/components/auth/save-record-hint";

type Phase = "ready" | "playing" | "paused" | "over";
type Result = {
  correct: number;
  wrong: number;
  bestStreak: number;
  level: number;
  grade: number;
  comment: string;
  sheet: string;
  reason: "time" | "lives";
  isBest: boolean;
  best: number;
};

const BEST_KEY = "p4f:kiem-tra-15-phut:best";

function readNum(key: string) {
  try {
    return Number(localStorage.getItem(key)) || 0;
  } catch {
    return 0;
  }
}
function writeNum(key: string, v: number) {
  try {
    localStorage.setItem(key, String(v));
  } catch {
    /* storage blocked — best score just isn't remembered */
  }
}

const CHALK = "#f4f1e8";

export default function KiemTra15Phut({ daily }: { daily?: DailyInfo }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<GameState | null>(null);
  const phaseRef = useRef<Phase>("ready");
  const [phase, setPhaseState] = useState<Phase>("ready");
  const [, render] = useReducer((n: number) => n + 1, 0);
  const [result, setResult] = useState<Result | null>(null);
  const [best, setBest] = useState(0);
  const [copied, setCopied] = useState(false);

  const setPhase = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhaseState(p);
  }, []);

  useEffect(() => setBest(readNum(BEST_KEY)), []);

  /** Every round: new random seed → a fresh set of generated questions */
  const start = useCallback(() => {
    stateRef.current = createGame(daily ? daily.seed : Date.now() ^ Math.floor(Math.random() * 2 ** 31));
    setResult(null);
    setCopied(false);
    setPhase("playing");
    gameStart("bai-kiem-tra-15-phut");
    stageRef.current?.focus({ preventScroll: true });
  }, [daily, setPhase]);

  const finish = useCallback(() => {
    const s = stateRef.current!;
    const prev = readNum(BEST_KEY);
    const isBest = s.correct > prev;
    if (isBest) {
      writeNum(BEST_KEY, s.correct);
      notifyRecordChanged();
    }
    const g = grade(s.correct);
    setBest(Math.max(prev, s.correct));
    setResult({
      correct: s.correct,
      wrong: s.wrong,
      bestStreak: s.bestStreak,
      level: levelFor(s.correct),
      grade: g,
      comment: teacherComment(g),
      sheet: markSheet(s.marks),
      reason: s.overReason ?? "time",
      isBest,
      best: Math.max(prev, s.correct),
    });
    gameEnd("bai-kiem-tra-15-phut", { score: s.correct });
    if (daily) void finishDaily(daily, "bai-kiem-tra-15-phut", s.correct);
    setPhase("over");
  }, [daily, setPhase]);

  // ------------------------------------------------------------ loop
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const s = stateRef.current;
      if (s && phaseRef.current === "playing") {
        tick(s, dt);
        if (s.over) finish();
        render();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [finish]);

  const press = useCallback(
    (key: string) => {
      const s = stateRef.current;
      if (!s || phaseRef.current !== "playing") return;
      if (key === "back") backspace(s);
      else if (key === "enter") submit(s);
      else typeDigit(s, key);
      if (s.over) finish();
      render();
    },
    [finish],
  );

  const togglePause = useCallback(() => {
    if (phaseRef.current === "playing") setPhase("paused");
    else if (phaseRef.current === "paused") setPhase("playing");
  }, [setPhase]);

  // ------------------------------------------------------------ keyboard
  useEffect(() => {
    const focused = () => !!stageRef.current && stageRef.current.contains(document.activeElement);
    const onKey = (e: KeyboardEvent) => {
      const p = phaseRef.current;
      if (e.code === "Escape" || e.code === "KeyP") {
        if (p === "playing" || p === "paused") {
          e.preventDefault();
          togglePause();
        }
        return;
      }
      if (p === "playing") {
        const digit = /^(?:Digit|Numpad)(\d)$/.exec(e.code)?.[1];
        if (digit) {
          e.preventDefault();
          press(digit);
        } else if (e.code === "Backspace") {
          e.preventDefault();
          press("back");
        } else if (e.code === "Enter" || e.code === "NumpadEnter") {
          e.preventDefault();
          press("enter");
        }
        return;
      }
      if ((e.code === "KeyR" || e.code === "Enter") && p === "over" && focused() && !(document.activeElement instanceof HTMLButtonElement)) start();
    };
    const onHide = () => {
      if (phaseRef.current === "playing") setPhase("paused");
    };
    const onVisibility = () => document.hidden && onHide();
    window.addEventListener("keydown", onKey);
    window.addEventListener("blur", onHide);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("blur", onHide);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [press, setPhase, start, togglePause]);

  const share = async () => {
    if (!result) return;
    const url = resultUrl("bai-kiem-tra-15-phut", { v: result.correct, d: daily?.day });
    const text = `📝 Kiểm tra 15 phút — ${result.correct} câu đúng · Điểm ${formatGrade(result.grade)}\n${result.sheet}\nCô phê: ${result.comment}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Kiểm tra 15 phút | Play4Fun", text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* share sheet cancelled */
    }
  };

  const s = stateRef.current;
  const active = !!s && (phase === "playing" || phase === "paused");

  return (
    <div className="mx-auto w-full max-w-[560px]">
      <div
        ref={stageRef}
        tabIndex={-1}
        className="relative flex min-h-[560px] flex-col overflow-hidden rounded-2xl bg-bg p-3 outline-none select-none sm:p-5"
      >
        {/* HUD */}
        <Hud s={s} active={active} onPause={togglePause} />

        {/* Chalkboard */}
        <div className="relative mt-4 flex flex-1 flex-col overflow-hidden rounded-2xl border-[6px] border-[#8b5a2b] bg-[#1f3b2d] shadow-lift" style={{ color: CHALK }}>
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: "radial-gradient(circle at 20% 30%, #fff 0 1px, transparent 2px), radial-gradient(circle at 70% 60%, #fff 0 1px, transparent 2px)", backgroundSize: "22px 22px, 31px 31px" }}
            aria-hidden="true"
          />
          <div className="relative flex items-center justify-between px-4 pt-3 text-xs font-semibold tracking-wide opacity-70">
            <span>Câu {active && s ? s.correct + s.wrong + 1 : 1}</span>
            <span>Cấp độ {active && s ? levelFor(s.correct) : 1}</span>
          </div>

          <div className="relative grid flex-1 place-items-center px-4 py-6">
            {active && s ? (
              <p key={s.q.text} className="animate-[card-in_160ms_ease-out] text-center font-mono text-4xl font-bold tracking-tight sm:text-5xl" aria-live="polite">
                <Equation text={s.q.text} typed={s.typed} reveal={s.reveal > 0 ? s.q.answer : null} />
              </p>
            ) : (
              <p className="text-center font-mono text-4xl font-bold opacity-30">7 × 8 = ?</p>
            )}

            {s?.bonus && active && (
              <span key={`b-${s.correct}`} className="absolute top-4 right-5 animate-[pop_200ms_ease-out] font-mono text-lg font-bold text-[#9be37b]">
                +{s.bonus.amount.toFixed(1)}s
              </span>
            )}
          </div>

          {s?.feedback && active && (
            <p
              role="status"
              className={`relative mx-3 mb-3 rounded-xl px-4 py-2 text-center text-sm font-bold ${s.feedback.good ? "bg-[#16b364] text-white" : "bg-[#e5484d] text-white"}`}
            >
              {s.feedback.text}
            </p>
          )}
        </div>

        {/* Keypad */}
        <div className="mt-3 grid grid-cols-3 gap-2" aria-label="Bàn phím số">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
            <Key key={d} label={d} onPress={() => press(d)} disabled={phase !== "playing"} />
          ))}
          <Key label="Xóa" icon={<Delete className="h-5 w-5" />} onPress={() => press("back")} disabled={phase !== "playing"} muted />
          <Key label="0" onPress={() => press("0")} disabled={phase !== "playing"} />
          <Key label="Chấm" icon={<Check className="h-5 w-5" />} onPress={() => press("enter")} disabled={phase !== "playing"} muted />
        </div>

        {/* ---------------- overlays ---------------- */}
        {phase === "ready" && (
          <Overlay>
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#1f3b2d] text-2xl text-white shadow-lift" aria-hidden="true">
              📝
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight">Kiểm tra 15 phút</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted">Cô phát đề rồi! Tính nhẩm thật nhanh trước khi chuông reo.</p>
            <ul className="mx-auto mt-5 grid max-w-sm gap-2 text-left text-sm">
              <Rule icon={<Bell className="h-4 w-4" />} tone="text-brand bg-brand-soft">
                Bắt đầu với <b>{START_SECONDS} giây</b>, mỗi câu đúng được <b>cộng thêm giờ</b>
              </Rule>
              <Rule icon={<Heart className="h-4 w-4" />} tone="text-[#e5484d] bg-[#e5484d]/10">
                Sai một câu mất <b>1 tim</b>, hết {MAX_LIVES} tim là nộp bài
              </Rule>
              <Rule icon={<Trophy className="h-4 w-4" />} tone="text-arcade bg-arcade-soft">
                Đề <b>khó dần</b>: cộng trừ, bảng cửu chương, chia, tìm x…
              </Rule>
            </ul>
            {daily && <DailyBadge daily={daily} where="ready" />}
            <button type="button" onClick={start} className="btn-primary mt-6 px-8 py-3.5 text-base">
              <Play className="h-4 w-4 fill-current" aria-hidden="true" />
              Bắt đầu làm bài
            </button>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted">
              <Shuffle className="h-3.5 w-3.5" aria-hidden="true" />
              Mỗi lần làm là một đề mới, không câu nào lặp lại trong bài
            </p>
            {best > 0 && (
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
                <Trophy className="h-3.5 w-3.5 text-arcade" aria-hidden="true" />
                Kỷ lục của bạn: {best} câu đúng · điểm {formatGrade(grade(best))}
              </p>
            )}
            <p className="mt-3 text-xs text-muted pointer-coarse:hidden">Bàn phím: gõ số (tự chấm khi đủ chữ số) · Backspace xóa · Esc tạm dừng</p>
          </Overlay>
        )}

        {phase === "paused" && (
          <Overlay>
            <h2 className="text-2xl font-extrabold">Cô ra ngoài một chút ☕</h2>
            <p className="mt-2 text-sm text-muted">Đồng hồ đã dừng. Không được giở sách đâu nhé!</p>
            <button type="button" onClick={togglePause} className="btn-primary mt-6 px-8">
              <Play className="h-4 w-4 fill-current" aria-hidden="true" />
              Làm bài tiếp
            </button>
          </Overlay>
        )}

        {phase === "over" && result && (
          <Overlay>
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted">
              <BellRing className="h-4 w-4 text-[#e5484d]" aria-hidden="true" />
              {result.reason === "lives" ? "Hết tim rồi, nộp bài thôi!" : "Reng reng! Hết giờ!"}
            </p>
            {/* Graded test sheet */}
            <div className="relative mx-auto mt-3 max-w-sm rounded-xl border border-line bg-white p-5 text-left text-[#1b1a22] shadow-lift">
              <div className="pointer-events-none absolute inset-y-0 left-8 w-px bg-[#e5484d]/40" aria-hidden="true" />
              <p className="pl-6 text-xs font-semibold tracking-wider text-[#6b6880] uppercase">Bài kiểm tra 15 phút · Môn Toán</p>
              <div className="mt-3 flex items-center gap-4 pl-6">
                <span className="grid h-20 w-20 shrink-0 -rotate-6 place-items-center rounded-full border-[3px] border-[#e5484d] font-mono text-3xl font-extrabold text-[#e5484d]">
                  {formatGrade(result.grade)}
                </span>
                <div>
                  <p className="text-sm text-[#6b6880]">Lời phê của cô:</p>
                  <p className="mt-0.5 font-semibold text-[#e5484d] italic">{result.comment}</p>
                </div>
              </div>
              {result.sheet && <pre className="mt-3 pl-6 font-sans text-base leading-snug whitespace-pre-wrap">{result.sheet}</pre>}
            </div>
            {result.isBest && <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-[#ffb547] px-2.5 py-1 text-xs font-bold text-[#2a1a00]">Kỷ lục mới!</span>}
            <dl className="mx-auto mt-4 grid max-w-sm grid-cols-4 gap-2">
              <Stat label="Câu đúng" value={result.correct} />
              <Stat label="Câu sai" value={result.wrong} />
              <Stat label="Chuỗi" value={`×${result.bestStreak}`} />
              <Stat label="Cấp độ" value={result.level} />
            </dl>
            <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
              <button type="button" onClick={share} className="btn-primary px-6">
                {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Share2 className="h-4 w-4" aria-hidden="true" />}
                {copied ? "Đã sao chép!" : "Khoe bài kiểm tra"}
              </button>
              <button type="button" onClick={start} className="btn-ghost px-6">
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Làm đề khác
              </button>
            </div>
            <p className="mt-3 text-xs text-muted">Kỷ lục: {result.best} câu đúng · đề mới sẽ là các phép tính khác</p>
            {daily && <DailyBadge daily={daily} where="over" />}
            <SaveRecordHint />
          </Overlay>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------ pieces

/** Writes the equation; the typed answer (or the revealed right one) takes the place of "?" */
function Equation({ text, typed, reveal }: { text: string; typed: string; reveal: number | null }) {
  const slot = (
    <span className={`inline-block min-w-[1.4ch] border-b-4 px-1 ${reveal !== null ? "border-[#ffb547] text-[#ffb547]" : "border-white/60 text-[#ffe08a]"}`}>
      {reveal !== null ? reveal : typed || " "}
    </span>
  );
  if (text.includes("?")) {
    const [before, after] = text.split("?");
    return (
      <>
        {before}
        {slot}
        {after}
      </>
    );
  }
  return (
    <>
      {text} = {slot}
    </>
  );
}

function Hud({ s, active, onPause }: { s: GameState | null; active: boolean; onPause: () => void }) {
  const timeLeft = active && s ? s.timeLeft : START_SECONDS;
  const pct = Math.min(100, (timeLeft / MAX_SECONDS) * 100);
  const lives = active && s ? s.lives : MAX_LIVES;
  const urgent = timeLeft <= 4;
  return (
    <div className="flex items-center gap-3">
      <span className={`flex w-16 items-center gap-1 font-mono text-xl font-bold tabular-nums ${urgent ? "text-[#e5484d]" : ""}`}>
        <Bell className={`h-4 w-4 ${urgent && active ? "animate-[pop_300ms_ease-out_infinite]" : ""}`} aria-hidden="true" />
        {timeLeft.toFixed(1)}
      </span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-2">
        <div className={`h-full rounded-full ${urgent ? "bg-[#e5484d]" : "bg-[#16b364]"}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex gap-0.5" aria-label={`Còn ${lives} tim`}>
        {Array.from({ length: MAX_LIVES }, (_, i) => (
          <Heart key={i} className={`h-5 w-5 ${i < lives ? "fill-[#e5484d] text-[#e5484d]" : "text-line"}`} aria-hidden="true" />
        ))}
      </div>
      {active && (
        <button type="button" onClick={onPause} aria-label="Tạm dừng" className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-surface text-muted hover:text-fg">
          <Pause className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function Key({ label, icon, onPress, disabled, muted = false }: { label: string; icon?: React.ReactNode; onPress: () => void; disabled: boolean; muted?: boolean }) {
  return (
    <button
      type="button"
      // pointerdown feels instant on phones (no 300ms click delay, no double-tap zoom)
      onPointerDown={(e) => {
        e.preventDefault();
        if (!disabled) onPress();
      }}
      // Screen readers / switch access fire click without a pointer (detail === 0)
      onClick={(e) => {
        if (e.detail === 0 && !disabled) onPress();
      }}
      // Keyboard players type digits directly (handled globally), so keys stay out of the tab order
      tabIndex={-1}
      disabled={disabled}
      aria-label={label}
      className={`flex h-12 items-center justify-center rounded-xl border border-line font-mono text-xl font-bold shadow-card transition active:scale-95 disabled:opacity-40 sm:h-14 ${
        muted ? "bg-surface-2 text-muted" : "bg-surface text-fg"
      }`}
    >
      {icon ?? label}
    </button>
  );
}

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-30 grid place-items-center overflow-y-auto bg-bg/92 p-5 text-center backdrop-blur-sm">
      <div className="w-full">{children}</div>
    </div>
  );
}

function Rule({ icon, tone, children }: { icon: React.ReactNode; tone: string; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3">
      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${tone}`}>{icon}</span>
      <span className="text-muted [&_b]:text-fg">{children}</span>
    </li>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-surface px-1 py-2">
      <dt className="text-[10px] tracking-wider text-muted uppercase">{label}</dt>
      <dd className="mt-0.5 font-mono text-base font-bold tabular-nums">{value}</dd>
    </div>
  );
}
