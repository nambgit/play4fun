"use client";

import { ArrowLeft, Check, Heart, Lightbulb, Play, RotateCcw, Share2, Shuffle, Sparkles, TriangleAlert } from "lucide-react";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { answer, back, createRun, isDone, result as computeResult, type Quiz, type QuizResult, type QuizRun } from "./engine";
import { notifyRecordChanged } from "@/lib/record-sync";
import { SaveRecordHint } from "@/components/auth/save-record-hint";

type Phase = "intro" | "question" | "result";

const LETTERS = ["A", "B", "C", "D"];
const PICK_MS = 220;

const seenKey = (slug: string) => `p4f:quiz:${slug}:seen`;
const lastKey = (slug: string) => `p4f:quiz:${slug}:last`;

function readSeen(slug: string): Set<string> {
  try {
    const raw = JSON.parse(localStorage.getItem(seenKey(slug)) ?? "[]");
    return new Set(Array.isArray(raw) ? raw.filter((x) => typeof x === "string") : []);
  } catch {
    return new Set();
  }
}
function rememberSeen(slug: string, ids: string[], keep: number) {
  try {
    const merged = [...readSeen(slug), ...ids];
    const unique = [...new Set(merged.reverse())].reverse();
    localStorage.setItem(seenKey(slug), JSON.stringify(unique.slice(-keep)));
  } catch {
    /* storage blocked — runs are still random, just without memory */
  }
}
function readStr(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function writeStr(key: string, v: string) {
  try {
    localStorage.setItem(key, v);
  } catch {
    /* storage blocked */
  }
}

/**
 * Shared player for every personality quiz.
 * @param accent two-stop gradient (the game's cover colours) used for the result header and accents
 */
export function QuizGame({ quiz, accent }: { quiz: Quiz; accent: [string, string] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const runRef = useRef<QuizRun | null>(null);
  const [phase, setPhase] = useState<Phase>("intro");
  const [, render] = useReducer((n: number) => n + 1, 0);
  const [picked, setPicked] = useState<number | null>(null);
  const [res, setRes] = useState<QuizResult | null>(null);
  const [lastType, setLastType] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [from, to] = accent;

  useEffect(() => setLastType(readStr(lastKey(quiz.slug))), [quiz.slug]);

  /** Every run: new random questions (recently seen ones last) in a new order with shuffled answers */
  const start = useCallback(() => {
    runRef.current = createRun(quiz, Date.now() ^ Math.floor(Math.random() * 2 ** 31), readSeen(quiz.slug));
    setPicked(null);
    setRes(null);
    setCopied(false);
    setPhase("question");
    stageRef.current?.focus({ preventScroll: true });
  }, [quiz]);

  const finish = useCallback(() => {
    const run = runRef.current!;
    const r = computeResult(quiz, run);
    rememberSeen(
      quiz.slug,
      run.questions.map((q) => q.id),
      quiz.ask,
    );
    writeStr(lastKey(quiz.slug), r.type.id);
    notifyRecordChanged();
    setLastType(r.type.id);
    setRes(r);
    setPhase("result");
    // Bring the top of the result card into view on small screens
    requestAnimationFrame(() => {
      const el = stageRef.current;
      if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [quiz]);

  const choose = useCallback(
    (i: number) => {
      const run = runRef.current;
      if (!run || phase !== "question" || picked !== null) return;
      const q = run.questions[run.answers.length];
      if (!q || i < 0 || i >= q.options.length) return;
      setPicked(i);
      setTimeout(() => {
        answer(run, i);
        setPicked(null);
        if (isDone(run)) finish();
        else render();
      }, PICK_MS);
    },
    [finish, phase, picked],
  );

  const goBack = useCallback(() => {
    const run = runRef.current;
    if (!run || picked !== null || run.answers.length === 0) return;
    back(run);
    render();
  }, [picked]);

  // ------------------------------------------------------------ keyboard: 1–4 / A–D pick, Backspace goes back
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase !== "question" || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const num = /^Digit([1-4])$/.exec(e.code)?.[1];
      const letter = /^Key([A-D])$/.exec(e.code)?.[1];
      const idx = num ? Number(num) - 1 : letter ? LETTERS.indexOf(letter) : -1;
      if (idx >= 0) {
        e.preventDefault();
        choose(idx);
      } else if (e.code === "Backspace") {
        e.preventDefault();
        goBack();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [choose, goBack, phase]);

  const share = async () => {
    if (!res) return;
    const url = `${window.location.origin}/games/${quiz.slug}`;
    const text = `${quiz.emoji} ${quiz.title}\nMình là ${res.type.emoji} ${res.type.name}: ${res.type.tagline}\nCòn bạn thì sao?`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${quiz.title} | Play4Fun`, text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* share sheet cancelled */
    }
  };

  const run = runRef.current;
  const qi = run?.answers.length ?? 0;
  const q = run?.questions[qi];
  const total = run?.questions.length ?? quiz.ask;
  const last = lastType ? quiz.types.find((t) => t.id === lastType) : null;

  return (
    <div className="mx-auto w-full max-w-[680px]">
      <div
        ref={stageRef}
        tabIndex={-1}
        data-quiz-active={phase !== "intro" ? "" : undefined}
        className="relative min-h-[520px] scroll-mt-24 overflow-hidden rounded-2xl bg-bg p-3 outline-none sm:p-5"
      >
        {/* ---------------- intro ---------------- */}
        {phase === "intro" && (
          <div className="grid min-h-[488px] place-items-center text-center">
            <div className="w-full">
              <span
                className="mx-auto grid h-20 w-20 place-items-center rounded-3xl text-4xl shadow-lift"
                style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
                aria-hidden="true"
              >
                {quiz.emoji}
              </span>
              <h2 className="mt-5 text-3xl font-extrabold tracking-tight">{quiz.title}</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">{quiz.intro}</p>
              <ul className="mx-auto mt-6 flex max-w-md flex-wrap justify-center gap-2" aria-label="Các kết quả có thể">
                {quiz.types.map((t) => (
                  <li key={t.id} className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold">
                    {t.emoji} {t.name}
                  </li>
                ))}
              </ul>
              <button type="button" onClick={start} className="btn-primary mt-7 px-8 py-3.5 text-base">
                <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                Bắt đầu
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
                <Shuffle className="h-3.5 w-3.5" aria-hidden="true" />
                {quiz.ask} câu hỏi, mỗi lần làm là một bộ câu hỏi khác
              </p>
              {last && (
                <p className="mt-2 text-xs text-muted">
                  Lần trước bạn là{" "}
                  <b className="text-fg">
                    {last.emoji} {last.name}
                  </b>
                  , thử lại xem có đổi không?
                </p>
              )}
            </div>
          </div>
        )}

        {/* ---------------- question ---------------- */}
        {phase === "question" && run && q && (
          <div className="flex min-h-[488px] flex-col">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={goBack}
                disabled={qi === 0}
                aria-label="Câu trước"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-surface text-muted transition hover:text-fg disabled:opacity-30"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full transition-[width] duration-300"
                  style={{ width: `${(qi / total) * 100}%`, backgroundImage: `linear-gradient(90deg, ${from}, ${to})` }}
                />
              </div>
              <span className="w-14 text-right font-mono text-sm font-bold tabular-nums">
                {qi + 1}/{total}
              </span>
            </div>

            <div key={q.id} className="mt-5 flex flex-1 animate-[card-in_220ms_ease-out] flex-col">
              <p className="text-xs font-semibold tracking-wider text-muted uppercase">Câu {qi + 1}</p>
              <h3 className="mt-2 text-xl leading-snug font-bold sm:text-2xl">{q.text}</h3>
              <ul className="mt-6 grid gap-2.5">
                {q.options.map((o, i) => {
                  const isPicked = picked === i;
                  return (
                    <li key={o.text}>
                      <button
                        type="button"
                        onClick={() => choose(i)}
                        disabled={picked !== null}
                        className={`flex w-full items-center gap-3 rounded-2xl border bg-surface p-3.5 text-left text-sm leading-snug transition sm:p-4 sm:text-base ${
                          isPicked ? "scale-[0.99] border-transparent text-white shadow-lift" : "border-line shadow-card hover:-translate-y-0.5 hover:border-fg/20"
                        } ${picked !== null && !isPicked ? "opacity-50" : ""}`}
                        style={isPicked ? { backgroundImage: `linear-gradient(135deg, ${from}, ${to})` } : undefined}
                      >
                        <span
                          className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm font-bold ${isPicked ? "bg-white/25 text-white" : "bg-surface-2 text-muted"}`}
                        >
                          {isPicked ? <Check className="h-4 w-4" aria-hidden="true" /> : LETTERS[i]}
                        </span>
                        <span className="flex-1">{o.text}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-auto pt-5 text-center text-xs text-muted pointer-coarse:hidden">Phím tắt: 1–4 hoặc A–D để chọn · Backspace quay lại</p>
            </div>
          </div>
        )}

        {/* ---------------- result ---------------- */}
        {phase === "result" && res && (
          <div className="animate-[card-in_260ms_ease-out]">
            <div className="relative overflow-hidden rounded-2xl p-6 text-center text-white shadow-lift sm:p-8" style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}>
              <div className="bg-dots absolute inset-0 opacity-30" aria-hidden="true" />
              <div className="relative">
                <p className="text-sm font-semibold text-white/80">Bạn là</p>
                <p className="mt-2 text-6xl" aria-hidden="true">
                  {res.type.emoji}
                </p>
                <h3 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{res.type.name}</h3>
                <p className="mx-auto mt-2 max-w-sm text-base font-medium text-white/90">{res.type.tagline}</p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-relaxed sm:text-base">{res.type.description}</p>

            <section className="mt-6" aria-label="Tỉ lệ các kiểu">
              <h4 className="text-sm font-semibold">Bạn có bao nhiêu phần trăm mỗi kiểu?</h4>
              <ul className="mt-3 grid gap-2">
                {res.breakdown.map(({ type, pct }, i) => (
                  <li key={type.id} className="flex items-center gap-3 text-sm">
                    <span className="w-40 shrink-0 truncate sm:w-48">
                      {type.emoji} {type.name}
                    </span>
                    <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                      <span
                        className="block h-full rounded-full"
                        style={{ width: `${pct}%`, backgroundImage: i === 0 ? `linear-gradient(90deg, ${from}, ${to})` : undefined, backgroundColor: i === 0 ? undefined : "var(--line)" }}
                      />
                    </span>
                    <span className={`w-10 text-right font-mono tabular-nums ${i === 0 ? "font-bold" : "text-muted"}`}>{pct}%</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <TraitList icon={<Sparkles className="h-4 w-4" />} title="Điểm mạnh" items={res.type.strengths} tone="text-party bg-party-soft" />
              <TraitList icon={<TriangleAlert className="h-4 w-4" />} title="Cần lưu ý" items={res.type.watchOut} tone="text-arcade bg-arcade-soft" />
            </div>

            <section className="mt-3 rounded-2xl border border-line bg-surface p-4 sm:p-5">
              <h4 className="flex items-center gap-2 text-sm font-semibold">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-soft text-brand">
                  <Lightbulb className="h-4 w-4" aria-hidden="true" />
                </span>
                Mẹo dành riêng cho bạn
              </h4>
              <ol className="mt-3 space-y-2">
                {res.type.tips.map((tip, i) => (
                  <li key={tip} className="flex gap-3 text-sm leading-relaxed text-muted">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-soft text-[11px] font-bold text-brand">{i + 1}</span>
                    {tip}
                  </li>
                ))}
              </ol>
            </section>

            <p className="mt-3 flex items-center gap-2 rounded-2xl border border-line bg-surface p-4 text-sm">
              <Heart className="h-4 w-4 shrink-0 fill-[#ec4899] text-[#ec4899]" aria-hidden="true" />
              <span className="text-muted">
                Hợp cạ nhất với:{" "}
                <b className="text-fg">
                  {res.buddy.emoji} {res.buddy.name}
                </b>
              </span>
            </p>

            <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
              <button type="button" onClick={share} className="btn-primary px-6">
                {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Share2 className="h-4 w-4" aria-hidden="true" />}
                {copied ? "Đã sao chép!" : "Khoe kết quả"}
              </button>
              <button type="button" onClick={start} className="btn-ghost px-6">
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Làm lại với câu hỏi khác
              </button>
            </div>
            <div className="text-center">
              <SaveRecordHint />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TraitList({ icon, title, items, tone }: { icon: React.ReactNode; title: string; items: string[]; tone: string }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
      <h4 className="flex items-center gap-2 text-sm font-semibold">
        <span className={`grid h-7 w-7 place-items-center rounded-lg ${tone}`} aria-hidden="true">
          {icon}
        </span>
        {title}
      </h4>
      <ul className="mt-3 space-y-1.5">
        {items.map((it) => (
          <li key={it} className="flex gap-2 text-sm leading-relaxed text-muted">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted" aria-hidden="true" />
            {it}
          </li>
        ))}
      </ul>
    </section>
  );
}
