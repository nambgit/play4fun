"use client";

import { AlarmClock, Award, Check, Keyboard, Pause, Play, RotateCcw, Share2, Shuffle, Space, Target, Trophy } from "lucide-react";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { LANG_LABEL, PASSAGES, type Lang } from "./content";
import {
  ROUND_SECONDS,
  accuracy,
  charStates,
  createGame,
  currentWord,
  input as feedInput,
  tick,
  titleFor,
  wpm,
  type CharState,
  type GameState,
} from "./engine";
import { gameEnd, gameStart } from "@/lib/analytics";
import { notifyRecordChanged } from "@/lib/record-sync";
import { SaveRecordHint } from "@/components/auth/save-record-hint";

type Phase = "ready" | "playing" | "paused" | "over";
type Result = {
  lang: Lang;
  wpm: number;
  accuracy: number;
  correctWords: number;
  wrongWords: number;
  passages: number;
  title: string;
  isBest: boolean;
  best: number;
};

const LANG_KEY = "p4f:go-phim-nhanh:lang";
const bestKey = (lang: Lang) => `p4f:go-phim-nhanh:best:${lang}`;
const seenKey = (lang: Lang) => `p4f:go-phim-nhanh:seen:${lang}`;
/** Recently typed passages go to the back of the next rounds' deck (pool is 30 per language) */
const SEEN_MEMORY = 24;

function readSeen(lang: Lang): Set<string> {
  try {
    const raw = JSON.parse(localStorage.getItem(seenKey(lang)) ?? "[]");
    return new Set(Array.isArray(raw) ? raw.filter((x) => typeof x === "string") : []);
  } catch {
    return new Set();
  }
}
function rememberSeen(lang: Lang, dealt: string[]) {
  try {
    const merged = [...readSeen(lang), ...dealt];
    const unique = [...new Set(merged.reverse())].reverse(); // keep latest occurrence order
    localStorage.setItem(seenKey(lang), JSON.stringify(unique.slice(-SEEN_MEMORY)));
  } catch {
    /* storage blocked — rounds are still shuffled, just without memory */
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

export default function GoPhimNhanh() {
  const stageRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef<GameState | null>(null);
  const phaseRef = useRef<Phase>("ready");
  const [phase, setPhaseState] = useState<Phase>("ready");
  const [, render] = useReducer((n: number) => n + 1, 0);
  const [lang, setLangState] = useState<Lang>("vi");
  const [best, setBest] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);

  const setPhase = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhaseState(p);
  }, []);

  useEffect(() => {
    const saved = readStr(LANG_KEY);
    const l: Lang = saved === "en" ? "en" : "vi";
    setLangState(l);
    setBest(Number(readStr(bestKey(l))) || 0);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    writeStr(LANG_KEY, l);
    setBest(Number(readStr(bestKey(l))) || 0);
  }, []);

  /** Every round: fresh random seed + passages typed in recent rounds pushed to the back */
  const start = useCallback(() => {
    stateRef.current = createGame(lang, Date.now() ^ Math.floor(Math.random() * 2 ** 31), readSeen(lang));
    if (inputRef.current) inputRef.current.value = "";
    setResult(null);
    setCopied(false);
    setPhase("playing");
    gameStart("go-phim-nhanh");
  }, [lang, setPhase]);

  const finish = useCallback(() => {
    const s = stateRef.current!;
    rememberSeen(s.lang, s.dealt);
    const speed = wpm(s);
    const prev = Number(readStr(bestKey(s.lang))) || 0;
    const isBest = speed > prev;
    if (isBest) {
      writeStr(bestKey(s.lang), String(speed));
      notifyRecordChanged();
    }
    setBest(Math.max(prev, speed));
    setResult({
      lang: s.lang,
      wpm: speed,
      accuracy: accuracy(s),
      correctWords: s.correctWords,
      wrongWords: s.wrongWords,
      passages: s.passagesDone,
      title: titleFor(speed),
      isBest,
      best: Math.max(prev, speed),
    });
    if (inputRef.current) inputRef.current.value = "";
    gameEnd("go-phim-nhanh", { score: speed });
    setPhase("over");
  }, [setPhase]);

  // Focus the input whenever play (re)starts — after React has enabled it
  useEffect(() => {
    if (phase === "playing") inputRef.current?.focus({ preventScroll: true });
  }, [phase]);

  // ------------------------------------------------------------ clock
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const s = stateRef.current;
      if (s && s.started && phaseRef.current === "playing") {
        tick(s, dt);
        if (s.over) finish();
        render();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [finish]);

  const togglePause = useCallback(() => {
    if (phaseRef.current === "playing") setPhase("paused");
    else if (phaseRef.current === "paused") setPhase("playing");
  }, [setPhase]);

  // ------------------------------------------------------------ keyboard (global)
  useEffect(() => {
    const focused = () => !!stageRef.current && stageRef.current.contains(document.activeElement);
    const onKey = (e: KeyboardEvent) => {
      const p = phaseRef.current;
      if (e.code === "Escape") {
        if (p === "playing" || p === "paused") {
          e.preventDefault();
          togglePause();
        }
        return;
      }
      if (e.code === "Enter" && p === "over" && focused() && !(document.activeElement instanceof HTMLButtonElement)) {
        e.preventDefault();
        start();
      }
    };
    const onHide = () => {
      if (phaseRef.current === "playing" && stateRef.current?.started) setPhase("paused");
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
  }, [setPhase, start, togglePause]);

  // ------------------------------------------------------------ typing
  const handleValue = (el: HTMLInputElement, composing: boolean) => {
    const s = stateRef.current;
    if (!s || phaseRef.current !== "playing") return;
    const rest = feedInput(s, el.value, composing);
    if (!composing && rest !== el.value) el.value = rest;
    if (s.over) finish();
    render();
  };

  const share = async () => {
    if (!result) return;
    const url = `${window.location.origin}/games/go-phim-nhanh`;
    const text = `⌨️ Gõ phím thần tốc (${LANG_LABEL[result.lang]}) — ${result.wpm} WPM · chính xác ${result.accuracy}%\nDanh hiệu: ${result.title}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Gõ phím thần tốc | Play4Fun", text, url });
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
    <div className="mx-auto w-full max-w-[760px]">
      <div
        ref={stageRef}
        tabIndex={-1}
        className="relative flex min-h-[460px] flex-col overflow-hidden rounded-2xl bg-bg p-3 outline-none sm:min-h-[480px] sm:p-5"
      >
        {/* HUD */}
        <Hud s={s} active={active} onPause={togglePause} />

        {/* Passage */}
        <div
          className="relative mt-4 flex-1 cursor-text rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-7"
          onPointerDown={(e) => {
            // Tapping the text keeps focus in the input (and opens the mobile keyboard)
            if (phaseRef.current === "playing") {
              e.preventDefault();
              inputRef.current?.focus({ preventScroll: true });
            }
          }}
        >
          {active && s ? (
            <>
              <p className="mb-3 flex items-center justify-between text-xs font-semibold text-muted">
                <span>
                  Đoạn {s.passagesDone + 1} · {LANG_LABEL[s.lang]}
                </span>
                <span>
                  {s.done.length}/{s.words.length} từ
                </span>
              </p>
              <Passage s={s} />
            </>
          ) : (
            <p className="text-xl leading-relaxed font-medium text-muted/50 blur-[2px] select-none sm:text-2xl" aria-hidden="true">
              {PASSAGES[lang][0].text}
            </p>
          )}
        </div>

        {/* Input */}
        <div className="mt-3 flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            disabled={phase !== "playing"}
            onInput={(e) => handleValue(e.currentTarget, (e.nativeEvent as InputEvent).isComposing)}
            onCompositionEnd={(e) => handleValue(e.currentTarget, false)}
            onPaste={(e) => e.preventDefault()}
            onDrop={(e) => e.preventDefault()}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="next"
            aria-label="Ô gõ chữ"
            placeholder={s?.started ? "" : "Gõ từ đầu tiên để bắt đầu tính giờ…"}
            // 16px+ so iOS does not zoom in on focus
            className="h-12 min-w-0 flex-1 rounded-xl border border-line bg-surface px-4 font-mono text-base text-fg shadow-card outline-none placeholder:font-sans placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-50 sm:text-lg"
          />
          <span className="hidden items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-2 text-xs text-muted sm:inline-flex">
            <Space className="h-4 w-4" aria-hidden="true" />
            sang từ mới
          </span>
        </div>

        {/* ---------------- overlays ---------------- */}
        {phase === "ready" && (
          <Overlay>
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#16b364] text-white shadow-lift">
              <Keyboard className="h-7 w-7" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight">Gõ phím thần tốc</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              {ROUND_SECONDS} giây, gõ càng nhiều từ đúng càng tốt. Đồng hồ chỉ chạy khi bạn gõ phím đầu tiên.
            </p>
            <LangPicker value={lang} onChange={setLang} className="mt-5" />
            <ul className="mx-auto mt-5 grid max-w-md gap-2 text-left text-sm">
              <Rule icon={<Space className="h-4 w-4" />} tone="text-party bg-party-soft">
                Gõ xong mỗi từ thì bấm <b>Space</b> để sang từ tiếp theo
              </Rule>
              <Rule icon={<Target className="h-4 w-4" />} tone="text-brand bg-brand-soft">
                Từ chỉ được tính khi đúng <b>cả chữ lẫn dấu</b>
              </Rule>
              <Rule icon={<Keyboard className="h-4 w-4" />} tone="text-arcade bg-arcade-soft">
                {lang === "vi" ? (
                  <>
                    Dùng bộ gõ quen thuộc: <b>Unikey, EVKey</b> hay bàn phím <b>Telex/VNI</b> của máy
                  </>
                ) : (
                  <>
                    Tắt bộ gõ tiếng Việt (chuyển sang <b>E</b>) để gõ tiếng Anh cho mượt
                  </>
                )}
              </Rule>
            </ul>
            <button type="button" onClick={start} className="btn-primary mt-6 px-8 py-3.5 text-base">
              <Play className="h-4 w-4 fill-current" aria-hidden="true" />
              Bắt đầu
            </button>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted">
              <Shuffle className="h-3.5 w-3.5" aria-hidden="true" />
              Mỗi ván là các đoạn văn ngẫu nhiên, không lặp lại đoạn vừa gõ
            </p>
            {best > 0 && (
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
                <Trophy className="h-3.5 w-3.5 text-arcade" aria-hidden="true" />
                Kỷ lục {LANG_LABEL[lang]}: {best} WPM
              </p>
            )}
          </Overlay>
        )}

        {phase === "paused" && (
          <Overlay>
            <h2 className="text-2xl font-extrabold">Tạm nghỉ tay ☕</h2>
            <p className="mt-2 text-sm text-muted">Đồng hồ đã dừng, bàn phím vẫn chờ bạn.</p>
            <button type="button" onClick={togglePause} className="btn-primary mt-6 px-8">
              <Play className="h-4 w-4 fill-current" aria-hidden="true" />
              Gõ tiếp
            </button>
          </Overlay>
        )}

        {phase === "over" && result && (
          <Overlay>
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted">
              <AlarmClock className="h-4 w-4 text-brand" aria-hidden="true" />
              Hết giờ! · {LANG_LABEL[result.lang]}
            </p>
            <p className="mt-1 text-6xl font-extrabold tracking-tight">
              {result.wpm}
              <span className="text-xl font-semibold text-muted"> WPM</span>
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-sm font-bold text-brand">
              <Award className="h-4 w-4" aria-hidden="true" />
              {result.title}
            </span>
            {result.isBest && (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-[#ffb547] px-2.5 py-1 text-xs font-bold text-[#2a1a00]">Kỷ lục mới!</span>
            )}
            <dl className="mx-auto mt-5 grid max-w-md grid-cols-4 gap-2">
              <Stat label="Chính xác" value={`${result.accuracy}%`} />
              <Stat label="Từ đúng" value={result.correctWords} />
              <Stat label="Từ sai" value={result.wrongWords} />
              <Stat label="Đoạn xong" value={result.passages} />
            </dl>
            <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
              <button type="button" onClick={share} className="btn-primary px-6">
                {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Share2 className="h-4 w-4" aria-hidden="true" />}
                {copied ? "Đã sao chép!" : "Khoe kết quả"}
              </button>
              <button type="button" onClick={start} className="btn-ghost px-6">
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Chơi ván mới
              </button>
            </div>
            <LangPicker value={lang} onChange={setLang} className="mt-4" small />
            <p className="mt-3 text-xs text-muted">
              Kỷ lục {LANG_LABEL[lang]}: {lang === result.lang ? result.best : best} WPM · ván mới sẽ là đoạn văn khác
            </p>
            <SaveRecordHint />
          </Overlay>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------ pieces

function Hud({ s, active, onPause }: { s: GameState | null; active: boolean; onPause: () => void }) {
  const timeLeft = active && s ? s.timeLeft : ROUND_SECONDS;
  const pct = Math.min(100, (timeLeft / ROUND_SECONDS) * 100);
  const waiting = active && s && !s.started;
  return (
    <div className="flex items-center gap-3">
      <span className={`w-14 font-mono text-xl font-bold tabular-nums ${timeLeft <= 10 ? "text-[#e5484d]" : ""}`}>{Math.ceil(timeLeft)}s</span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-2">
        <div
          className={`h-full rounded-full transition-[width] duration-100 ${timeLeft <= 10 ? "bg-[#e5484d]" : "bg-[#16b364]"} ${waiting ? "animate-pulse" : ""}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-baseline gap-1 font-mono tabular-nums" title="Từ mỗi phút (5 ký tự = 1 từ)">
        <span className="text-xl font-bold">{active && s ? wpm(s) : 0}</span>
        <span className="text-xs text-muted">WPM</span>
      </div>
      <div className="hidden items-baseline gap-1 font-mono tabular-nums sm:flex" title="Độ chính xác theo ký tự">
        <span className="text-base font-bold">{active && s ? accuracy(s) : 100}%</span>
      </div>
      {active && (
        <button type="button" onClick={onPause} aria-label="Tạm dừng" className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-surface text-muted hover:text-fg">
          <Pause className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

const CHAR_CLASS: Record<CharState, string> = {
  correct: "text-fg",
  pending: "text-arcade",
  wrong: "text-[#e5484d] bg-[#e5484d]/10 rounded-sm",
  untyped: "text-muted",
};

function Passage({ s }: { s: GameState }) {
  const cur = s.done.length;
  const target = currentWord(s);
  const { states, extra } = charStates(target, s.typed);
  const caretAt = Math.min(s.typed.normalize("NFC").length, target.length);

  return (
    <p className="text-xl leading-[1.9] font-medium tracking-wide sm:text-2xl" aria-label="Đoạn văn cần gõ">
      {s.words.map((w, i) => {
        if (i < cur) {
          const r = s.done[i];
          return (
            <span key={i}>
              <span className={r.correct ? "text-party" : "text-[#e5484d] line-through decoration-2"} title={r.correct ? undefined : `Bạn gõ: ${r.typed}`}>
                {w}
              </span>{" "}
            </span>
          );
        }
        if (i === cur) {
          return (
            <span key={i}>
              <span data-current-word={w} className="relative rounded-md bg-brand-soft px-0.5 py-0.5">
                {[...w].map((ch, j) => (
                  <span key={j} className={`relative ${CHAR_CLASS[states[j]]}`}>
                    {j === caretAt && <Caret />}
                    {ch}
                  </span>
                ))}
                {extra && <span className="rounded-sm bg-[#e5484d]/10 text-[#e5484d]">{extra}</span>}
                {caretAt >= w.length && !extra && <Caret end />}
              </span>{" "}
            </span>
          );
        }
        return (
          <span key={i} className="text-muted">
            {w}{" "}
          </span>
        );
      })}
    </p>
  );
}

function Caret({ end = false }: { end?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute top-[0.15em] bottom-[0.15em] w-0.5 animate-pulse rounded-full bg-brand ${end ? "right-0" : "-left-px"}`}
    />
  );
}

function LangPicker({ value, onChange, className = "", small = false }: { value: Lang; onChange: (l: Lang) => void; className?: string; small?: boolean }) {
  return (
    <div role="radiogroup" aria-label="Ngôn ngữ" className={`mx-auto inline-flex rounded-full border border-line bg-surface p-1 ${className}`}>
      {(["vi", "en"] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          role="radio"
          aria-checked={value === l}
          onClick={() => onChange(l)}
          className={`rounded-full font-semibold transition ${small ? "px-3 py-1 text-xs" : "px-4 py-1.5 text-sm"} ${
            value === l ? "bg-fg text-bg" : "text-muted hover:text-fg"
          }`}
        >
          {LANG_LABEL[l]}
        </button>
      ))}
    </div>
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
