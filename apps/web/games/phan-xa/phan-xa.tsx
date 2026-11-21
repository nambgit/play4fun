"use client";

import { Hand, Play, RotateCcw, Timer, TriangleAlert, Trophy, Zap } from "lucide-react";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { NewBest, Overlay, ReadyHeader, Rule, Rules, ShareButton, Stat, Stats, useLocalBest, useShare } from "@/components/game-kit";
import { gameEnd, gameStart } from "@/lib/analytics";
import { ATTEMPTS, average, createGame, go, next, rankFor, tap, type GameState } from "./engine";

type Phase = "ready" | "playing" | "over";
type Result = { avg: number; best: number; times: number[]; falseStarts: number; isBest: boolean };

const BEST_KEY = "p4f:phan-xa:best";

const PANEL: Record<string, { bg: string; title: string; sub: string }> = {
  wait: { bg: "bg-[#e5484d]", title: "Chờ màu xanh…", sub: "Đừng chạm vội!" },
  go: { bg: "bg-[#16b364]", title: "CHẠM!", sub: "" },
  early: { bg: "bg-[#f5a400]", title: "Sớm quá!", sub: "Chạm để thử lại lần này" },
  shown: { bg: "bg-[#2a7de1]", title: "", sub: "Chạm để tiếp tục" },
};

export default function PhanXa() {
  const stageRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<GameState | null>(null);
  const timerRef = useRef<number | null>(null);
  const [phase, setPhase] = useState<Phase>("ready");
  const [, render] = useReducer((n: number) => n + 1, 0);
  const [result, setResult] = useState<Result | null>(null);
  const [best, submitBest] = useLocalBest(BEST_KEY, "low");
  const { share, copied } = useShare("Phản xạ 0,2 giây");

  const clear = () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  const arm = useCallback(() => {
    const s = stateRef.current;
    if (!s) return;
    clear();
    timerRef.current = window.setTimeout(() => {
      go(s, performance.now());
      render();
    }, s.wait);
  }, []);

  const start = useCallback(() => {
    stateRef.current = createGame();
    setResult(null);
    setPhase("playing");
    gameStart("phan-xa");
    arm();
    render();
    stageRef.current?.focus({ preventScroll: true });
  }, [arm]);

  const finish = useCallback(() => {
    const s = stateRef.current!;
    const avg = average(s.times);
    setResult({ avg, best: Math.min(...s.times), times: [...s.times], falseStarts: s.falseStarts, isBest: submitBest(avg) });
    gameEnd("phan-xa", { score: avg });
    setPhase("over");
  }, [submitBest]);

  /** Taps are timed on pointerdown / keydown (click fires ~100 ms later on phones) */
  const press = useCallback(() => {
    const s = stateRef.current;
    if (!s || phase !== "playing") return;
    const now = performance.now();
    if (s.stage === "early" || s.stage === "shown") {
      next(s);
      arm();
    } else {
      const r = tap(s, now);
      if (r === "early") clear();
      if (s.stage === "done") {
        clear();
        finish();
        return;
      }
    }
    render();
  }, [arm, finish, phase]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.code === "Space" || e.code === "Enter") {
        if (phase === "playing") {
          e.preventDefault();
          press();
        } else if (stageRef.current?.contains(document.activeElement) && !(document.activeElement instanceof HTMLButtonElement)) {
          e.preventDefault();
          start();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, press, start]);

  // A hidden tab would delay the timer and spoil the measurement: restart the attempt
  useEffect(() => {
    const onHide = () => {
      const s = stateRef.current;
      if (phase === "playing" && s && (s.stage === "wait" || s.stage === "go")) {
        clear();
        s.stage = "early";
        render();
      }
    };
    const vis = () => document.hidden && onHide();
    document.addEventListener("visibilitychange", vis);
    window.addEventListener("blur", onHide);
    return () => {
      document.removeEventListener("visibilitychange", vis);
      window.removeEventListener("blur", onHide);
    };
  }, [phase]);

  // Leaving the page: drop a pending "turn green" timer (not on phase changes, or the first attempt never starts)
  useEffect(() => () => clear(), []);

  const s = stateRef.current;
  const panel = s && phase === "playing" ? PANEL[s.stage] : null;
  const rank = result ? rankFor(result.avg) : null;

  return (
    <div className="mx-auto w-full max-w-[560px]">
      <div ref={stageRef} tabIndex={-1} className="relative flex min-h-[520px] flex-col overflow-hidden rounded-2xl bg-bg p-3 outline-none select-none sm:p-5">
        {/* Attempts row */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-muted">
            Lần {s && phase === "playing" ? Math.min(s.times.length + 1, ATTEMPTS) : 1}/{ATTEMPTS}
          </span>
          <ol className="flex gap-1.5" aria-label="Kết quả từng lần">
            {Array.from({ length: ATTEMPTS }, (_, i) => {
              const t = s?.times[i];
              return (
                <li key={i} className={`min-w-12 rounded-lg px-2 py-1 text-center font-mono text-xs font-bold tabular-nums ${t ? "bg-surface text-fg shadow-card" : "bg-surface-2 text-muted"}`}>
                  {t ? `${t}` : "—"}
                </li>
              );
            })}
          </ol>
        </div>

        {/* Tap panel */}
        <button
          type="button"
          tabIndex={-1}
          onPointerDown={(e) => {
            e.preventDefault();
            press();
          }}
          onClick={(e) => e.detail === 0 && press()}
          className={`mt-4 flex flex-1 touch-manipulation flex-col items-center justify-center rounded-2xl text-white transition-colors duration-75 ${panel?.bg ?? "bg-surface-2"}`}
          aria-live="assertive"
        >
          {panel && s && (
            <>
              {s.stage === "go" && <Zap className="h-14 w-14 fill-current" aria-hidden="true" />}
              {s.stage === "early" && <TriangleAlert className="h-12 w-12" aria-hidden="true" />}
              {s.stage === "wait" && <Hand className="h-12 w-12" aria-hidden="true" />}
              <span className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">{s.stage === "shown" ? `${s.last} ms` : panel.title}</span>
              {panel.sub && <span className="mt-2 text-sm font-medium text-white/85">{panel.sub}</span>}
            </>
          )}
        </button>

        {phase === "ready" && (
          <Overlay>
            <ReadyHeader emoji="⚡" title="Phản xạ 0,2 giây" pitch="Màn hình chuyển xanh là chạm ngay. Bạn nhanh đến mức nào?" tone="bg-[#16b364]" />
            <Rules>
              <Rule icon={<Hand className="h-4 w-4" />} tone="bg-[#e5484d]/10 text-[#e5484d]">
                Màn hình <b>đỏ</b>: chờ, chạm sớm là phải làm lại
              </Rule>
              <Rule icon={<Zap className="h-4 w-4" />} tone="bg-party-soft text-party">
                Chuyển <b>xanh</b>: chạm (hoặc bấm Space) nhanh nhất có thể
              </Rule>
              <Rule icon={<Timer className="h-4 w-4" />} tone="bg-brand-soft text-brand">
                Điểm là <b>trung bình {ATTEMPTS} lần</b>, tính bằng mili-giây
              </Rule>
            </Rules>
            <button type="button" onClick={start} className="btn-primary mt-6 px-8 py-3.5 text-base">
              <Play className="h-4 w-4 fill-current" aria-hidden="true" />
              Bắt đầu
            </button>
            {best !== null && (
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
                <Trophy className="h-3.5 w-3.5 text-arcade" aria-hidden="true" />
                Kỷ lục của bạn: {best} ms
              </p>
            )}
          </Overlay>
        )}

        {phase === "over" && result && rank && (
          <Overlay>
            <p className="text-sm font-semibold text-muted">Thời gian phản xạ trung bình</p>
            <p className="mt-1 font-mono text-6xl font-extrabold tracking-tight tabular-nums">
              {result.avg}
              <span className="ml-1 text-2xl text-muted">ms</span>
            </p>
            <p className="mt-2 text-lg font-bold">
              {rank.emoji} {rank.title}
            </p>
            {result.isBest && <NewBest />}
            <Stats>
              <Stat label="Nhanh nhất" value={`${result.best}`} />
              <Stat label="Chậm nhất" value={`${Math.max(...result.times)}`} />
              <Stat label="Chạm sớm" value={result.falseStarts} />
            </Stats>
            <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
              <ShareButton
                copied={copied}
                onClick={() => share(`⚡ Phản xạ 0,2 giây: ${result.avg} ms (${rank.title})\nLần nhanh nhất ${result.best} ms. Bạn nhanh hơn mình không?`)}
              />
              <button type="button" onClick={start} className="btn-ghost px-6">
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Thử lại
              </button>
            </div>
            {best !== null && <p className="mt-3 text-xs text-muted">Kỷ lục trên máy này: {best} ms</p>}
            <p className="mx-auto mt-2 max-w-xs text-xs text-muted">Kết quả còn phụ thuộc màn hình và thiết bị; so với chính mình trên cùng một máy là chính xác nhất.</p>
          </Overlay>
        )}
      </div>
    </div>
  );
}
