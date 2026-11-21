"use client";

import { BookOpen, Check, ChevronRight, Clock, Flag, Play, RotateCcw, Shuffle, Trophy, X } from "lucide-react";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { NewBest, Overlay, ReadyHeader, Rule, Rules, ShareButton, readStore, useLocalBest, useShare, writeStore } from "@/components/game-kit";
import { gameEnd, gameStart } from "@/lib/analytics";
import { ASK, SECONDS, TOPIC_LABEL, answer, byTopic, correctCount, createGame, current, formatGrade, grade, next, tick, verdict, type GameState } from "./engine";

type Phase = "ready" | "playing" | "over";
type Result = { correct: number; grade: number; topics: ReturnType<typeof byTopic>; wrong: GameState["items"]; isBest: boolean };

const BEST_KEY = "p4f:kien-thuc:best";
const SEEN_KEY = "p4f:kien-thuc:seen";
const LETTERS = ["A", "B", "C", "D"];

export default function KienThuc() {
  const stateRef = useRef<GameState | null>(null);
  const phaseRef = useRef<Phase>("ready");
  const [phase, setPhaseState] = useState<Phase>("ready");
  const [, render] = useReducer((n: number) => n + 1, 0);
  const [result, setResult] = useState<Result | null>(null);
  const [best, submitBest] = useLocalBest(BEST_KEY, "high");
  const { share, copied } = useShare("Kiểm tra kiến thức Việt Nam");

  const setPhase = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhaseState(p);
  }, []);

  const start = useCallback(() => {
    stateRef.current = createGame(new Set(readStore<string[]>(SEEN_KEY, [])));
    setResult(null);
    setPhase("playing");
    gameStart("kien-thuc-viet-nam");
  }, [setPhase]);

  const finish = useCallback(() => {
    const s = stateRef.current!;
    const c = correctCount(s);
    const seen = readStore<string[]>(SEEN_KEY, []);
    writeStore(SEEN_KEY, [...new Set([...seen, ...s.items.map((i) => i.q.id)])].slice(-90));
    setResult({ correct: c, grade: grade(c), topics: byTopic(s), wrong: s.items.filter((i) => !i.correct), isBest: submitBest(c) });
    gameEnd("kien-thuc-viet-nam", { score: c });
    setPhase("over");
  }, [setPhase, submitBest]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const s = stateRef.current;
      if (s && phaseRef.current === "playing" && !s.revealed) {
        tick(s, dt);
        render();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  const pick = (i: number) => {
    const s = stateRef.current;
    if (!s || phaseRef.current !== "playing") return;
    answer(s, i);
    render();
  };

  const goNext = useCallback(() => {
    const s = stateRef.current;
    if (!s || !s.revealed) return;
    next(s);
    if (s.over) finish();
    render();
  }, [finish]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (phaseRef.current !== "playing" || !s) return;
      const n = ["Digit1", "Digit2", "Digit3", "Digit4", "KeyA", "KeyB", "KeyC", "KeyD"].indexOf(e.code);
      if (n >= 0 && !s.revealed) {
        e.preventDefault();
        pick(n % 4);
      } else if ((e.code === "Enter" || e.code === "Space") && s.revealed) {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext]);

  const s = stateRef.current;
  const it = s && phase === "playing" ? current(s) : null;
  const urgent = !!s && s.timeLeft <= 5;

  return (
    <div className="mx-auto w-full max-w-[560px]">
      <div className="relative flex min-h-[600px] flex-col overflow-hidden rounded-2xl bg-bg p-3 select-none sm:p-5">
        {/* Progress */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold">
            Câu {s && phase === "playing" ? s.index + 1 : 1}/{ASK}
          </span>
          <div className="flex flex-1 gap-1" aria-hidden="true">
            {Array.from({ length: ASK }, (_, i) => {
              const a = s?.items[i];
              const done = !!a && (i < (s?.index ?? 0) || (i === s?.index && s.revealed));
              return <span key={i} className={`h-1.5 flex-1 rounded-full ${done ? (a.correct ? "bg-[#16b364]" : "bg-[#e5484d]") : i === s?.index ? "bg-brand" : "bg-surface-2"}`} />;
            })}
          </div>
          <span className={`inline-flex w-12 items-center justify-end gap-1 font-mono text-sm font-bold tabular-nums ${urgent ? "text-[#e5484d]" : "text-muted"}`}>
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {s && phase === "playing" ? Math.ceil(s.timeLeft) : SECONDS}
          </span>
        </div>

        {/* Question */}
        {it && s && (
          <div key={it.q.id} className="mt-4 flex flex-1 animate-[card-in_160ms_ease-out] flex-col">
            <span className="self-start rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand">{TOPIC_LABEL[it.q.topic]}</span>
            <h2 className="mt-3 text-xl leading-snug font-bold text-balance sm:text-2xl">{it.q.q}</h2>
            <div className="mt-5 grid gap-2.5">
              {it.order.map((orig, shown) => {
                const isAnswer = orig === it.q.answer;
                const isPicked = it.picked === orig;
                const tone = !s.revealed
                  ? "border-line bg-surface hover:border-brand/50"
                  : isAnswer
                    ? "border-[#16b364] bg-[#16b364]/12"
                    : isPicked
                      ? "border-[#e5484d] bg-[#e5484d]/10"
                      : "border-line bg-surface opacity-60";
                return (
                  <button
                    key={orig}
                    type="button"
                    disabled={s.revealed}
                    onClick={() => pick(shown)}
                    className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-[15px] font-semibold shadow-card transition ${tone}`}
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-surface-2 text-xs font-bold">{LETTERS[shown]}</span>
                    <span className="flex-1">{it.q.options[orig]}</span>
                    {s.revealed && isAnswer && <Check className="h-5 w-5 text-[#16b364]" aria-hidden="true" />}
                    {s.revealed && isPicked && !isAnswer && <X className="h-5 w-5 text-[#e5484d]" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
            {s.revealed && (
              <div className="mt-4 rounded-2xl bg-surface-2 p-4" role="status">
                <p className={`text-sm font-bold ${it.correct ? "text-[#16b364]" : "text-[#e5484d]"}`}>{it.correct ? "Chính xác!" : it.timedOut ? "Hết giờ!" : "Chưa đúng!"}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{it.q.note}</p>
                <button type="button" onClick={goNext} autoFocus className="btn-primary mt-3 w-full">
                  {s.index >= ASK - 1 ? "Xem kết quả" : "Câu tiếp theo"}
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        )}

        {phase === "ready" && (
          <Overlay>
            <ReadyHeader emoji="🇻🇳" title="Kiểm tra kiến thức Việt Nam" pitch="15 câu về lịch sử, địa lý, văn hóa và đời sống. Bạn được mấy điểm?" tone="bg-[#da251d]" />
            <Rules>
              <Rule icon={<Flag className="h-4 w-4" />} tone="bg-[#da251d]/10 text-[#da251d]">
                <b>{ASK} câu</b>, chia đều 4 chủ đề, chấm theo <b>thang điểm 10</b>
              </Rule>
              <Rule icon={<Clock className="h-4 w-4" />} tone="bg-arcade-soft text-arcade">
                Mỗi câu <b>{SECONDS} giây</b>, chọn 1 trong 4 đáp án
              </Rule>
              <Rule icon={<BookOpen className="h-4 w-4" />} tone="bg-brand-soft text-brand">
                Sau mỗi câu có <b>giải thích ngắn</b> để bạn biết thêm
              </Rule>
            </Rules>
            <button type="button" onClick={start} className="btn-primary mt-6 px-8 py-3.5 text-base">
              <Play className="h-4 w-4 fill-current" aria-hidden="true" />
              Bắt đầu làm bài
            </button>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted">
              <Shuffle className="h-3.5 w-3.5" aria-hidden="true" />
              Mỗi lần làm là bộ câu hỏi khác, câu đã gặp được để sau
            </p>
            {best !== null && (
              <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted">
                <Trophy className="h-3.5 w-3.5 text-arcade" aria-hidden="true" />
                Kỷ lục của bạn: {best}/{ASK} câu · {formatGrade(grade(best))} điểm
              </p>
            )}
            <p className="mt-2 text-xs text-muted pointer-coarse:hidden">Bàn phím: 1–4 hoặc A–D để chọn · Enter sang câu tiếp</p>
          </Overlay>
        )}

        {phase === "over" && result && (
          <Overlay>
            <p className="text-sm font-semibold text-muted">Kết quả của bạn</p>
            <p className="mt-1 font-mono text-6xl font-extrabold tracking-tight tabular-nums">
              {formatGrade(result.grade)}
              <span className="ml-1 text-2xl text-muted">/10</span>
            </p>
            <p className="mt-2 text-lg font-bold">{verdict(result.grade)}</p>
            <p className="text-sm text-muted">
              Đúng {result.correct}/{ASK} câu
            </p>
            {result.isBest && <NewBest />}
            <div className="mx-auto mt-4 grid max-w-sm grid-cols-2 gap-2 text-left">
              {result.topics.map((t) => (
                <div key={t.topic} className="rounded-xl border border-line bg-surface px-3 py-2">
                  <p className="text-xs text-muted">{t.label}</p>
                  <p className="font-mono font-bold">
                    {t.correct}/{t.total}
                  </p>
                </div>
              ))}
            </div>
            {result.wrong.length > 0 && (
              <details className="mx-auto mt-4 max-w-sm rounded-xl border border-line bg-surface p-3 text-left">
                <summary className="cursor-pointer text-sm font-semibold">Xem lại {result.wrong.length} câu chưa đúng</summary>
                <ul className="mt-3 space-y-3">
                  {result.wrong.map((w) => (
                    <li key={w.q.id} className="text-sm">
                      <p className="font-semibold">{w.q.q}</p>
                      <p className="mt-0.5 text-[#16b364]">✓ {w.q.options[w.q.answer]}</p>
                      <p className="mt-0.5 text-xs text-muted">{w.q.note}</p>
                    </li>
                  ))}
                </ul>
              </details>
            )}
            <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
              <ShareButton
                copied={copied}
                onClick={() => share(`🇻🇳 Kiểm tra kiến thức Việt Nam: ${formatGrade(result.grade)}/10 (đúng ${result.correct}/${ASK} câu). ${verdict(result.grade)}!\nBạn được mấy điểm?`)}
              />
              <button type="button" onClick={start} className="btn-ghost px-6">
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Làm bộ khác
              </button>
            </div>
          </Overlay>
        )}
      </div>
    </div>
  );
}
