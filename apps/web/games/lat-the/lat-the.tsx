"use client";

import { Brain, ChevronRight, Eye, Layers, Pause, Play, RotateCcw, Timer, Trophy } from "lucide-react";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { NewBest, Overlay, ReadyHeader, Rule, Rules, ShareButton, Stat, Stats, useLocalBest, usePauseOnHide, useShare } from "@/components/game-kit";
import { gameEnd, gameStart } from "@/lib/analytics";
import { LEVELS, accuracy, createGame, flip, nextLevel, rankFor, tick, type GameState } from "./engine";

type Phase = "ready" | "playing" | "paused" | "level" | "over";
type Result = { seconds: number; moves: number; accuracy: number; isBest: boolean };

const BEST_KEY = "p4f:lat-the:best";
const fmt = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;

export default function LatThe() {
  const stageRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<GameState | null>(null);
  const phaseRef = useRef<Phase>("ready");
  const [phase, setPhaseState] = useState<Phase>("ready");
  const [, render] = useReducer((n: number) => n + 1, 0);
  const [result, setResult] = useState<Result | null>(null);
  const [best, submitBest] = useLocalBest(BEST_KEY, "low");
  const { share, copied } = useShare("Nhớ thẻ bài");

  const setPhase = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhaseState(p);
  }, []);

  const start = useCallback(() => {
    stateRef.current = createGame(Date.now() ^ Math.floor(Math.random() * 2 ** 31));
    setResult(null);
    setPhase("playing");
    gameStart("lat-the");
    stageRef.current?.focus({ preventScroll: true });
  }, [setPhase]);

  const finish = useCallback(() => {
    const s = stateRef.current!;
    const seconds = Math.round(s.elapsed);
    setResult({ seconds, moves: s.moves, accuracy: accuracy(s), isBest: submitBest(seconds) });
    gameEnd("lat-the", { score: seconds });
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
        render();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onCard = (i: number) => {
    const s = stateRef.current;
    if (!s || phaseRef.current !== "playing") return;
    const r = flip(s, i);
    if (r === "ignored") return;
    if (s.over) {
      setTimeout(finish, 450);
    } else if (s.levelDone) {
      setTimeout(() => setPhase("level"), 450);
    }
    render();
  };

  const continueLevel = () => {
    const s = stateRef.current;
    if (!s) return;
    nextLevel(s);
    setPhase("playing");
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
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [togglePause]);

  const s = stateRef.current;
  const active = !!s && phase !== "ready" && phase !== "over";
  const [cols, rows] = s ? LEVELS[s.level] : LEVELS[0];

  return (
    <div className="mx-auto w-full max-w-[560px]">
      <div ref={stageRef} tabIndex={-1} className="relative flex min-h-[580px] flex-col overflow-hidden rounded-2xl bg-bg p-3 outline-none select-none sm:p-5">
        {/* HUD */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface px-2.5 py-1.5 text-sm font-semibold shadow-card">
            <Layers className="h-4 w-4 text-brand" aria-hidden="true" />
            Cấp {active && s ? s.level + 1 : 1}/{LEVELS.length}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface px-2.5 py-1.5 font-mono text-sm font-bold tabular-nums shadow-card">
            <Timer className="h-4 w-4 text-muted" aria-hidden="true" />
            {fmt(active && s ? s.elapsed : 0)}
          </span>
          <span className="ml-auto text-sm text-muted">{active && s ? s.moves : 0} lượt</span>
          {active && (
            <button type="button" onClick={togglePause} aria-label="Tạm dừng" className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-surface text-muted hover:text-fg">
              <Pause className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Board */}
        {/* Board width follows the row count so even the 4×6 board fits the stage height */}
        <div
          className="mx-auto mt-4 grid w-full flex-1 content-center gap-2 sm:gap-2.5"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, maxWidth: `calc(470px * ${cols} / ${rows})` }}
        >
          {(s?.cards ?? Array.from({ length: 12 }, (_, id) => ({ id, pic: "", up: false, matched: false }))).map((c, i) => {
            const shown = c.up || c.matched;
            return (
              <button
                key={`${s?.level ?? 0}-${c.id}`}
                type="button"
                data-card
                onPointerDown={(e) => {
                  e.preventDefault();
                  onCard(i);
                }}
                onClick={(e) => e.detail === 0 && onCard(i)}
                disabled={!active || c.matched}
                aria-label={shown ? c.pic : `Thẻ ${i + 1}, úp`}
                className="aspect-square [perspective:600px]"
              >
                <span
                  className={`relative block h-full w-full rounded-xl transition-transform duration-300 [transform-style:preserve-3d] motion-reduce:transition-none ${shown ? "[transform:rotateY(180deg)]" : ""}`}
                >
                  {/* back */}
                  <span className="absolute inset-0 grid place-items-center rounded-xl bg-gradient-to-br from-brand to-[#9b5cff] text-white/80 shadow-card [backface-visibility:hidden]">
                    <span className="text-lg font-extrabold">?</span>
                  </span>
                  {/* face */}
                  <span
                    className={`absolute inset-0 grid place-items-center rounded-xl border text-3xl shadow-card [backface-visibility:hidden] [transform:rotateY(180deg)] sm:text-4xl ${
                      c.matched ? "border-party/50 bg-party-soft" : "border-line bg-surface"
                    }`}
                  >
                    {c.pic}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {phase === "ready" && (
          <Overlay>
            <ReadyHeader emoji="🧠" title="Nhớ thẻ bài" pitch="Lật thẻ, nhớ hình, tìm cho đủ cặp qua 4 cấp độ. Càng nhanh càng giỏi." tone="bg-brand" />
            <Rules>
              <Rule icon={<Eye className="h-4 w-4" />} tone="bg-brand-soft text-brand">
                Lật <b>2 thẻ</b> mỗi lượt, giống nhau thì giữ lại
              </Rule>
              <Rule icon={<Layers className="h-4 w-4" />} tone="bg-quiz-soft text-quiz">
                <b>4 cấp độ</b>: từ 12 thẻ đến 24 thẻ
              </Rule>
              <Rule icon={<Timer className="h-4 w-4" />} tone="bg-arcade-soft text-arcade">
                Điểm là <b>tổng thời gian</b>, ít lượt hơn là trí nhớ tốt hơn
              </Rule>
            </Rules>
            <button type="button" onClick={start} className="btn-primary mt-6 px-8 py-3.5 text-base">
              <Play className="h-4 w-4 fill-current" aria-hidden="true" />
              Bắt đầu
            </button>
            {best !== null && (
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
                <Trophy className="h-3.5 w-3.5 text-arcade" aria-hidden="true" />
                Kỷ lục của bạn: {fmt(best)}
              </p>
            )}
          </Overlay>
        )}

        {phase === "paused" && (
          <Overlay>
            <h2 className="text-2xl font-extrabold">Đã tạm dừng</h2>
            <p className="mt-2 text-sm text-muted">Đồng hồ đứng yên. Đừng ghi chú lại nhé!</p>
            <button type="button" onClick={togglePause} className="btn-primary mt-6 px-8">
              <Play className="h-4 w-4 fill-current" aria-hidden="true" />
              Chơi tiếp
            </button>
          </Overlay>
        )}

        {phase === "level" && s && (
          <Overlay>
            <p className="text-5xl" aria-hidden="true">
              🎉
            </p>
            <h2 className="mt-3 text-2xl font-extrabold">Xong cấp {s.level + 1}!</h2>
            <p className="mt-2 text-sm text-muted">
              Cấp tiếp theo có {LEVELS[s.level + 1][0] * LEVELS[s.level + 1][1]} thẻ. Đồng hồ dừng trong lúc nghỉ.
            </p>
            <button type="button" onClick={continueLevel} className="btn-primary mt-6 px-8">
              Cấp {s.level + 2}
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </Overlay>
        )}

        {phase === "over" && result && (
          <Overlay>
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted">
              <Brain className="h-4 w-4 text-brand" aria-hidden="true" />
              Hoàn thành cả 4 cấp
            </p>
            <p className="mt-1 font-mono text-6xl font-extrabold tracking-tight tabular-nums">{fmt(result.seconds)}</p>
            <p className="mt-2 text-lg font-bold">{rankFor(result.seconds)}</p>
            {result.isBest && <NewBest />}
            <Stats>
              <Stat label="Lượt lật" value={result.moves} />
              <Stat label="Chính xác" value={`${result.accuracy}%`} />
              <Stat label="Kỷ lục" value={best !== null ? fmt(best) : "—"} />
            </Stats>
            <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
              <ShareButton
                copied={copied}
                onClick={() => share(`🧠 Nhớ thẻ bài: xong 4 cấp trong ${fmt(result.seconds)}, ${result.moves} lượt (chính xác ${result.accuracy}%).\nThử xem trí nhớ bạn tốt hơn mình không?`)}
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
