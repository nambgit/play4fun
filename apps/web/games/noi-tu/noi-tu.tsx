"use client";

import { Bot, Heart, Link2, Pause, Play, RotateCcw, SendHorizontal, SkipForward, Timer, Trophy } from "lucide-react";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { NewBest, Overlay, ReadyHeader, Rule, Rules, ShareButton, Stat, Stats, useLocalBest, useShare } from "@/components/game-kit";
import { gameEnd, gameStart } from "@/lib/analytics";
import { MAX_LIVES, createGame, dictionarySize, play, rankFor, skip, tick, type GameState } from "./engine";

type Phase = "ready" | "playing" | "paused" | "over";
type Result = { score: number; words: number; stuck: number; longest: string[]; isBest: boolean };

const BEST_KEY = "p4f:noi-tu:best";

export default function NoiTu() {
  const stageRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const stateRef = useRef<GameState | null>(null);
  const phaseRef = useRef<Phase>("ready");
  const [phase, setPhaseState] = useState<Phase>("ready");
  const [, render] = useReducer((n: number) => n + 1, 0);
  const [value, setValue] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [best, submitBest] = useLocalBest(BEST_KEY, "high");
  const { share, copied } = useShare("Nối từ");

  const setPhase = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhaseState(p);
  }, []);

  const start = useCallback(() => {
    stateRef.current = createGame(Date.now() ^ Math.floor(Math.random() * 2 ** 31));
    setValue("");
    setResult(null);
    setPhase("playing");
    gameStart("noi-tu");
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [setPhase]);

  const finish = useCallback(() => {
    const s = stateRef.current!;
    // Longest run of consecutive words without a restart
    let run: string[] = [];
    let longest: string[] = [];
    for (let i = 0; i < s.chain.length; i++) {
      const prev = s.chain[i - 1];
      const cur = s.chain[i];
      if (prev && prev.word.split(" ")[1] === cur.word.split(" ")[0]) run.push(cur.word);
      else run = [cur.word];
      if (run.length > longest.length) longest = [...run];
    }
    setResult({ score: s.score, words: s.myWords, stuck: s.botStuck, longest, isBest: submitBest(s.score) });
    gameEnd("noi-tu", { score: s.score });
    setPhase("over");
  }, [setPhase, submitBest]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const s = stateRef.current;
      if (s && phaseRef.current === "playing") {
        const before = s.chain.length;
        tick(s, dt);
        if (s.over) finish();
        else if (s.chain.length !== before) setValue("");
        render();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [finish]);

  const chainLen = stateRef.current?.chain.length ?? 0;
  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView({ block: "nearest" });
  }, [chainLen]);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const s = stateRef.current;
    if (!s || phaseRef.current !== "playing") return;
    const r = play(s, value);
    if (r === "ok") setValue("");
    render();
    inputRef.current?.focus();
  };

  const onSkip = () => {
    const s = stateRef.current;
    if (!s || phaseRef.current !== "playing") return;
    skip(s);
    setValue("");
    if (s.over) finish();
    render();
    inputRef.current?.focus();
  };

  const togglePause = useCallback(() => {
    if (phaseRef.current === "playing") setPhase("paused");
    else if (phaseRef.current === "paused") {
      setPhase("playing");
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [setPhase]);

  useEffect(() => {
    const onHide = () => phaseRef.current === "playing" && setPhase("paused");
    const vis = () => document.hidden && onHide();
    document.addEventListener("visibilitychange", vis);
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Escape" && (phaseRef.current === "playing" || phaseRef.current === "paused")) {
        e.preventDefault();
        togglePause();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("visibilitychange", vis);
      window.removeEventListener("keydown", onKey);
    };
  }, [setPhase, togglePause]);

  const s = stateRef.current;
  const active = !!s && (phase === "playing" || phase === "paused");
  const pct = s ? Math.max(0, (s.timeLeft / s.turnTotal) * 100) : 100;
  const urgent = !!s && s.timeLeft < 4;

  return (
    <div className="mx-auto w-full max-w-[560px]">
      <div ref={stageRef} tabIndex={-1} className="relative flex h-[600px] flex-col overflow-hidden rounded-2xl bg-bg p-3 outline-none sm:p-5">
        {/* HUD */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold tabular-nums">{active && s ? s.score : 0} điểm</span>
          <span className="text-xs text-muted">· {active && s ? s.myWords : 0} từ</span>
          <div className="ml-auto flex gap-0.5" aria-label={`Còn ${active && s ? s.lives : MAX_LIVES} tim`}>
            {Array.from({ length: MAX_LIVES }, (_, i) => (
              <Heart key={i} className={`h-5 w-5 ${i < (active && s ? s.lives : MAX_LIVES) ? "fill-[#e5484d] text-[#e5484d]" : "text-line"}`} aria-hidden="true" />
            ))}
          </div>
          {active && (
            <button type="button" onClick={togglePause} aria-label="Tạm dừng" className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-surface text-muted hover:text-fg">
              <Pause className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2">
          <div className={`h-full rounded-full transition-[width] duration-100 ${urgent ? "bg-[#e5484d]" : "bg-brand"}`} style={{ width: `${pct}%` }} />
        </div>

        {/* Chain */}
        <ol ref={listRef} className="mt-3 flex-1 space-y-2 overflow-y-auto pr-1" aria-live="polite">
          {(s?.chain ?? []).map((e, i) => {
            const prev = s!.chain[i - 1];
            const restart = e.by === "bot" && (!prev || prev.word.split(" ")[1] !== e.word.split(" ")[0]);
            return (
              <li key={i}>
                {restart && i > 0 && <p className="my-2 text-center text-[11px] font-semibold tracking-wider text-muted uppercase">Chuỗi mới</p>}
                <div className={`flex items-end gap-2 ${e.by === "me" ? "justify-end" : ""}`}>
                  {e.by === "bot" && (
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-surface-2 text-muted">
                      <Bot className="h-4 w-4" aria-hidden="true" />
                    </span>
                  )}
                  <span
                    className={`max-w-[75%] animate-[card-in_160ms_ease-out] rounded-2xl px-3.5 py-2 text-base font-semibold ${
                      e.by === "me" ? "rounded-br-md bg-brand text-brand-ink" : "rounded-bl-md border border-line bg-surface"
                    }`}
                  >
                    {e.word}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>

        {s?.missed && active && s.missed.ex.length > 0 && (
          <p className="mt-2 rounded-xl bg-surface-2 px-3 py-2 text-xs text-muted">
            Có thể nói: <b className="text-fg">{s.missed.ex.join(", ")}</b>
          </p>
        )}
        {s?.feedback && active && (
          <p role="status" className={`mt-2 rounded-xl px-3 py-2 text-center text-sm font-bold text-white ${s.feedback.good ? "bg-[#16b364]" : "bg-[#e5484d]"}`}>
            {s.feedback.text}
          </p>
        )}

        {/* Input */}
        <form onSubmit={submit} className="mt-3 flex items-center gap-2">
          <label className={`flex min-w-0 flex-1 items-center gap-2 rounded-xl border bg-surface px-3 py-2.5 shadow-card ${urgent ? "border-[#e5484d]" : "border-line focus-within:border-brand"}`}>
            <span className="shrink-0 rounded-lg bg-brand-soft px-2 py-1 text-base font-bold text-brand">{active && s ? s.need : "…"}</span>
            <span className="sr-only">Tiếng thứ hai</span>
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={phase !== "playing"}
              placeholder="gõ tiếng tiếp theo"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              enterKeyHint="send"
              maxLength={12}
              className="min-w-0 flex-1 bg-transparent text-base font-semibold outline-none placeholder:font-normal placeholder:text-muted"
            />
            <span className={`shrink-0 font-mono text-sm font-bold tabular-nums ${urgent ? "text-[#e5484d]" : "text-muted"}`}>{active && s ? Math.ceil(s.timeLeft) : ""}</span>
          </label>
          <button type="submit" disabled={phase !== "playing" || !value.trim()} aria-label="Gửi" className="btn-primary h-12 w-12 shrink-0 p-0 disabled:opacity-40">
            <SendHorizontal className="h-5 w-5" aria-hidden="true" />
          </button>
          <button type="button" onClick={onSkip} disabled={phase !== "playing"} aria-label="Bỏ qua (mất 1 tim)" title="Bỏ qua (mất 1 tim)" className="btn-ghost h-12 w-12 shrink-0 p-0 disabled:opacity-40">
            <SkipForward className="h-5 w-5" aria-hidden="true" />
          </button>
        </form>

        {phase === "ready" && (
          <Overlay>
            <ReadyHeader emoji="🔗" title="Nối từ" pitch="Đấu trí với máy: nối tiếng cuối thành từ mới. “con mèo” → “mèo mướp” → “mướp đắng”…" tone="bg-quiz" />
            <Rules>
              <Rule icon={<Link2 className="h-4 w-4" />} tone="bg-brand-soft text-brand">
                Tiếng đầu có sẵn, bạn chỉ <b>gõ tiếng thứ hai</b> (có dấu)
              </Rule>
              <Rule icon={<Timer className="h-4 w-4" />} tone="bg-arcade-soft text-arcade">
                Thời gian mỗi lượt <b>ngắn dần</b>, trả lời nhanh được thưởng điểm
              </Rule>
              <Rule icon={<Bot className="h-4 w-4" />} tone="bg-party-soft text-party">
                Làm máy <b>bí từ</b> được +3 điểm. Hết giờ mất 1 tim
              </Rule>
            </Rules>
            <button type="button" onClick={start} className="btn-primary mt-6 px-8 py-3.5 text-base">
              <Play className="h-4 w-4 fill-current" aria-hidden="true" />
              Bắt đầu
            </button>
            <p className="mt-2 text-xs text-muted">Từ điển {dictionarySize.toLocaleString("vi-VN")} từ ghép thông dụng</p>
            {best !== null && (
              <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted">
                <Trophy className="h-3.5 w-3.5 text-arcade" aria-hidden="true" />
                Kỷ lục của bạn: {best} điểm
              </p>
            )}
          </Overlay>
        )}

        {phase === "paused" && (
          <Overlay>
            <h2 className="text-2xl font-extrabold">Đã tạm dừng</h2>
            <p className="mt-2 text-sm text-muted">Đồng hồ đứng yên, cứ từ từ nghĩ.</p>
            <button type="button" onClick={togglePause} className="btn-primary mt-6 px-8">
              <Play className="h-4 w-4 fill-current" aria-hidden="true" />
              Chơi tiếp
            </button>
          </Overlay>
        )}

        {phase === "over" && result && (
          <Overlay>
            <p className="text-sm font-semibold text-muted">Hết tim rồi!</p>
            <p className="mt-1 font-mono text-6xl font-extrabold tracking-tight tabular-nums">{result.score}</p>
            <p className="mt-1 text-sm text-muted">điểm</p>
            <p className="mt-2 text-lg font-bold">{rankFor(result.score)}</p>
            {result.isBest && <NewBest />}
            <Stats>
              <Stat label="Từ của bạn" value={result.words} />
              <Stat label="Máy bí" value={result.stuck} />
              <Stat label="Chuỗi dài nhất" value={result.longest.length} />
            </Stats>
            {result.longest.length > 2 && <p className="mx-auto mt-3 max-w-sm text-sm text-muted">{result.longest.slice(0, 8).join(" → ")}{result.longest.length > 8 ? " → …" : ""}</p>}
            <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
              <ShareButton
                copied={copied}
                onClick={() => share(`🔗 Nối từ: ${result.score} điểm, ${result.words} từ, làm máy bí ${result.stuck} lần (${rankFor(result.score)}).\nVốn từ của bạn có hơn mình không?`)}
              />
              <button type="button" onClick={start} className="btn-ghost px-6">
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Chơi lại
              </button>
            </div>
          </Overlay>
        )}
      </div>
    </div>
  );
}
