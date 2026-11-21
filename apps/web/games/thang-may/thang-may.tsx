"use client";

import { ArrowUp, Building2, Check, Clock, Heart, Pause, Play, RotateCcw, Sparkles, Trophy, Users } from "lucide-react";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { NewBest, Overlay, ReadyHeader, Rule, Rules, ShareButton, Stat, Stats, useLocalBest, usePauseOnHide, useShare } from "@/components/game-kit";
import { gameEnd, gameStart } from "@/lib/analytics";
import { CAPACITY, MAX_LIVES, MAX_LOBBY, canSend, clockText, createGame, picked, rankFor, send, tick, toggle, tripSeconds, type GameState } from "./engine";

type Phase = "ready" | "playing" | "paused" | "over";
type Result = { score: number; delivered: number; trips: number; nice: number; angry: number; reason: "time" | "lives"; isBest: boolean };

const BEST_KEY = "p4f:thang-may:best";

export default function ThangMay() {
  const stageRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<GameState | null>(null);
  const phaseRef = useRef<Phase>("ready");
  const [phase, setPhaseState] = useState<Phase>("ready");
  const [, render] = useReducer((n: number) => n + 1, 0);
  const [result, setResult] = useState<Result | null>(null);
  const [best, submitBest] = useLocalBest(BEST_KEY, "high");
  const { share, copied } = useShare("Thang máy giờ cao điểm");

  const setPhase = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhaseState(p);
  }, []);

  const start = useCallback(() => {
    stateRef.current = createGame(Date.now() ^ Math.floor(Math.random() * 2 ** 31));
    setResult(null);
    setPhase("playing");
    gameStart("thang-may");
    stageRef.current?.focus({ preventScroll: true });
  }, [setPhase]);

  const finish = useCallback(() => {
    const s = stateRef.current!;
    setResult({ score: s.score, delivered: s.delivered, trips: s.trips, nice: s.niceTrips, angry: s.angry, reason: s.overReason ?? "time", isBest: submitBest(s.score) });
    gameEnd("thang-may", { score: s.score });
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
        tick(s, dt);
        if (s.over) finish();
        render();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [finish]);

  const act = (fn: (s: GameState) => void) => {
    const s = stateRef.current;
    if (!s || phaseRef.current !== "playing") return;
    fn(s);
    render();
  };

  const togglePause = useCallback(() => {
    if (phaseRef.current === "playing") setPhase("paused");
    else if (phaseRef.current === "paused") setPhase("playing");
  }, [setPhase]);

  usePauseOnHide(
    useCallback(() => {
      if (phaseRef.current === "playing") setPhase("paused");
    }, [setPhase]),
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Escape" && (phaseRef.current === "playing" || phaseRef.current === "paused")) {
        e.preventDefault();
        togglePause();
      } else if ((e.code === "Space" || e.code === "Enter") && phaseRef.current === "playing") {
        e.preventDefault();
        act(send);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [togglePause]);

  const s = stateRef.current;
  const active = !!s && (phase === "playing" || phase === "paused");
  const sel = s ? picked(s) : [];
  const eta = tripSeconds(sel.map((p) => p.floor));
  const selFloors = [...new Set(sel.map((p) => p.floor))].sort((a, b) => a - b);

  return (
    <div className="mx-auto w-full max-w-[560px]">
      <div ref={stageRef} tabIndex={-1} className="relative flex min-h-[600px] flex-col overflow-hidden rounded-2xl bg-bg p-3 outline-none select-none sm:p-5">
        {/* HUD */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface px-2.5 py-1.5 font-mono text-sm font-bold tabular-nums shadow-card">
            <Clock className="h-4 w-4 text-arcade" aria-hidden="true" />
            {clockText(active && s ? s.t : 0)}
          </span>
          <span className="font-mono text-sm font-bold tabular-nums">{active && s ? s.score : 0} điểm</span>
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

        {/* Elevator status */}
        <div className="mt-3 overflow-hidden rounded-2xl border border-line bg-surface p-3 shadow-card">
          {s?.trip ? (
            <>
              <p className="flex items-center gap-2 text-sm font-semibold">
                <ArrowUp className="h-4 w-4 animate-bounce text-brand motion-reduce:animate-none" aria-hidden="true" />
                Đang chở {s.trip.people} người: tầng {s.trip.floors.join(", ")}
                <span className="ml-auto font-mono text-xs text-muted tabular-nums">{s.trip.left.toFixed(1)}s</span>
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2">
                <div className="h-full rounded-full bg-brand" style={{ width: `${100 - (s.trip.left / s.trip.total) * 100}%` }} />
              </div>
            </>
          ) : (
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Building2 className="h-4 w-4 text-party" aria-hidden="true" />
              Thang đang ở sảnh, mở cửa
              <span className="ml-auto text-xs font-normal text-muted">Tối đa {CAPACITY} người</span>
            </p>
          )}
        </div>

        {/* Lobby */}
        <div className="mt-3 flex items-center justify-between text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            Sảnh chờ ({s?.lobby.length ?? 0}/{MAX_LOBBY})
          </span>
          <span>Chạm để chọn người lên thang</span>
        </div>
        <div className="mt-2 grid flex-1 grid-cols-4 content-start gap-2">
          {(s?.lobby ?? []).map((p) => {
            const ratio = Math.max(0, p.patience / p.total);
            const tone = ratio > 0.5 ? "bg-party" : ratio > 0.25 ? "bg-[#f5a400]" : "bg-[#e5484d]";
            return (
              <button
                key={p.id}
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  act((st) => toggle(st, p.id));
                }}
                onClick={(e) => e.detail === 0 && act((st) => toggle(st, p.id))}
                aria-pressed={p.picked}
                aria-label={`Nhân viên lên tầng ${p.floor}${p.picked ? ", đã chọn" : ""}`}
                className={`relative flex animate-[card-in_160ms_ease-out] flex-col items-center overflow-hidden rounded-xl border bg-surface pt-2 pb-2.5 shadow-card transition active:scale-95 ${
                  p.picked ? "border-brand ring-2 ring-brand" : "border-line"
                } ${ratio < 0.25 ? "animate-pulse" : ""}`}
              >
                {p.picked && (
                  <span className="absolute top-1 right-1 grid h-4 w-4 place-items-center rounded-full bg-brand text-white">
                    <Check className="h-3 w-3" aria-hidden="true" />
                  </span>
                )}
                <span className="text-2xl leading-none" aria-hidden="true">
                  {p.avatar}
                </span>
                <span className="mt-1 font-mono text-lg leading-none font-extrabold">{p.floor}</span>
                <span className="text-[10px] text-muted">tầng</span>
                <span className="absolute inset-x-0 bottom-0 h-1 bg-surface-2">
                  <span className={`block h-full ${tone}`} style={{ width: `${ratio * 100}%` }} />
                </span>
              </button>
            );
          })}
        </div>

        {s?.feedback && active && (
          <p role="status" className={`mt-2 rounded-xl px-3 py-2 text-center text-sm font-bold text-white ${s.feedback.good ? "bg-[#16b364]" : "bg-[#e5484d]"}`}>
            {s.feedback.text}
          </p>
        )}

        {/* Send */}
        <div className="mt-3 flex items-center gap-3">
          <div className="min-w-0 flex-1 text-xs text-muted">
            {sel.length ? (
              <>
                <p className="font-semibold text-fg">
                  {sel.length}/{CAPACITY} người · tầng {selFloors.join(", ")}
                </p>
                <p>Chuyến đi mất khoảng {eta.toFixed(1)}s</p>
              </>
            ) : (
              <p>Gom người cùng tầng hoặc tầng gần nhau để thang đi nhanh hơn.</p>
            )}
          </div>
          <button type="button" onClick={() => act(send)} disabled={!s || !canSend(s) || phase !== "playing"} className="btn-primary shrink-0 px-5 py-3.5 disabled:opacity-40">
            <ArrowUp className="h-4 w-4" aria-hidden="true" />
            Đi thôi!
          </button>
        </div>

        {phase === "ready" && (
          <Overlay>
            <ReadyHeader emoji="🛗" title="Thang máy giờ cao điểm" pitch="8 giờ sáng, cả tòa nhà đổ về sảnh. Đưa mọi người lên đúng tầng trước 9 giờ!" tone="bg-arcade" />
            <Rules>
              <Rule icon={<Users className="h-4 w-4" />} tone="bg-brand-soft text-brand">
                Chạm để chọn tối đa <b>{CAPACITY} người</b>, rồi bấm <b>Đi thôi!</b>
              </Rule>
              <Rule icon={<Sparkles className="h-4 w-4" />} tone="bg-party-soft text-party">
                Gom <b>cùng tầng hoặc tầng gần</b>: thang về nhanh hơn, có điểm thưởng
              </Rule>
              <Rule icon={<Heart className="h-4 w-4" />} tone="bg-[#e5484d]/10 text-[#e5484d]">
                Ai chờ quá lâu sẽ <b>đi thang bộ</b>, mất 1 tim
              </Rule>
            </Rules>
            <button type="button" onClick={start} className="btn-primary mt-6 px-8 py-3.5 text-base">
              <Play className="h-4 w-4 fill-current" aria-hidden="true" />
              Mở cửa tòa nhà
            </button>
            {best !== null && (
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
                <Trophy className="h-3.5 w-3.5 text-arcade" aria-hidden="true" />
                Kỷ lục của bạn: {best} điểm
              </p>
            )}
            <p className="mt-3 text-xs text-muted pointer-coarse:hidden">Bàn phím: Space/Enter để gửi thang · Esc tạm dừng</p>
          </Overlay>
        )}

        {phase === "paused" && (
          <Overlay>
            <h2 className="text-2xl font-extrabold">Đã tạm dừng</h2>
            <p className="mt-2 text-sm text-muted">Đồng hồ tòa nhà đứng yên, không ai bỏ đi đâu.</p>
            <button type="button" onClick={togglePause} className="btn-primary mt-6 px-8">
              <Play className="h-4 w-4 fill-current" aria-hidden="true" />
              Chơi tiếp
            </button>
          </Overlay>
        )}

        {phase === "over" && result && (
          <Overlay>
            <p className="text-sm font-semibold text-muted">{result.reason === "lives" ? "Quá nhiều người bỏ đi thang bộ!" : "9:00 rồi, hết giờ cao điểm!"}</p>
            <p className="mt-1 font-mono text-6xl font-extrabold tracking-tight tabular-nums">{result.score}</p>
            <p className="mt-1 text-sm text-muted">điểm</p>
            <p className="mt-2 text-lg font-bold">{rankFor(result.score)}</p>
            {result.isBest && <NewBest />}
            <Stats cols={4}>
              <Stat label="Đã chở" value={result.delivered} />
              <Stat label="Chuyến" value={result.trips} />
              <Stat label="Chuyến đẹp" value={result.nice} />
              <Stat label="Bỏ đi" value={result.angry} />
            </Stats>
            <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
              <ShareButton
                copied={copied}
                onClick={() => share(`🛗 Thang máy giờ cao điểm: ${result.score} điểm, chở ${result.delivered} người trong ${result.trips} chuyến (${rankFor(result.score)}).\nBạn điều phối giỏi hơn mình không?`)}
              />
              <button type="button" onClick={start} className="btn-ghost px-6">
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Chơi lại
              </button>
            </div>
            {best !== null && <p className="mt-3 text-xs text-muted">Kỷ lục trên máy này: {best} điểm</p>}
          </Overlay>
        )}
      </div>
    </div>
  );
}
