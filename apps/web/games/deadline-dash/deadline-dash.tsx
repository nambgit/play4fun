"use client";

import { ArrowDown, ArrowUp, Award, Check, Coffee, Pause, Play, RotateCcw, Share2, Shuffle, Trophy } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { H, createGame, createInput, meters, scoreOf, step, titleFor, type GameState } from "./engine";
import { render } from "./render";
import { gameEnd, gameStart } from "@/lib/analytics";
import { notifyRecordChanged } from "@/lib/record-sync";
import { SaveRecordHint } from "@/components/auth/save-record-hint";

type Phase = "ready" | "playing" | "paused" | "over";
type Result = { meters: number; coffees: number; hits: number; smashed: number; score: number; title: string; scenario: string; isBest: boolean; best: number };

const BEST_KEY = "p4f:deadline-dash:best";
const LAST_SCENARIO_KEY = "p4f:deadline-dash:last-scenario";
const STEP = 1 / 120;
const SWIPE_DOWN = 30;

function readStore(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function writeStore(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage blocked — nothing remembered between runs */
  }
}

/** Narrow screens get a shorter arena so obstacles stay readable */
const arenaWidth = (px: number) => (px < 520 ? 520 : 800);

export default function DeadlineDash() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const distRef = useRef<HTMLSpanElement>(null);
  const leadRef = useRef<HTMLDivElement>(null);
  const meterRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  const stateRef = useRef<GameState | null>(null);
  const inputRef = useRef(createInput());
  const phaseRef = useRef<Phase>("ready");
  const touchRef = useRef<{ id: number; y: number; ducked: boolean } | null>(null);
  const fontRef = useRef("sans-serif");

  const [phase, setPhaseState] = useState<Phase>("ready");
  const [result, setResult] = useState<Result | null>(null);
  const [best, setBest] = useState(0);
  const [copied, setCopied] = useState(false);

  const setPhase = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhaseState(p);
  }, []);

  useEffect(() => {
    setBest(Number(readStore(BEST_KEY)) || 0);
    fontRef.current = getComputedStyle(document.body).fontFamily || "sans-serif";
  }, []);

  const newGame = useCallback(() => {
    const width = arenaWidth(canvasRef.current?.clientWidth ?? 800);
    const s = createGame(width, Date.now() ^ Math.floor(Math.random() * 2 ** 31), readStore(LAST_SCENARIO_KEY));
    writeStore(LAST_SCENARIO_KEY, s.scenario.id);
    return s;
  }, []);

  const start = useCallback(() => {
    stateRef.current = newGame();
    inputRef.current = createInput();
    setResult(null);
    setCopied(false);
    setPhase("playing");
    gameStart("deadline-dash");
    stageRef.current?.focus({ preventScroll: true });
  }, [newGame, setPhase]);

  const togglePause = useCallback(() => {
    if (phaseRef.current === "playing") setPhase("paused");
    else if (phaseRef.current === "paused") setPhase("playing");
  }, [setPhase]);

  const jump = () => {
    if (phaseRef.current === "playing") inputRef.current.jump = true;
  };

  // ------------------------------------------------------------ loop + canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    let lastHud = "";

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const logicalW = arenaWidth(canvas.clientWidth);
      canvas.style.aspectRatio = `${logicalW} / ${H}`;
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      if (!stateRef.current || phaseRef.current === "ready") stateRef.current = newGame();
      else stateRef.current.W = logicalW;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const finish = (s: GameState) => {
      const m = meters(s);
      const score = scoreOf(s);
      const prev = Number(readStore(BEST_KEY)) || 0;
      const isBest = score > prev;
      if (isBest) {
        writeStore(BEST_KEY, String(score));
        notifyRecordChanged();
      }
      setBest(Math.max(prev, score));
      setResult({ meters: m, coffees: s.coffeeCount, hits: s.hits, smashed: s.smashed, score, title: titleFor(m), scenario: s.scenario.title, isBest, best: Math.max(prev, score) });
      gameEnd("deadline-dash", { score });
      setPhase("over");
    };

    const frame = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const s = stateRef.current!;
      if (phaseRef.current === "playing") {
        acc += dt;
        while (acc >= STEP) {
          step(s, STEP, inputRef.current);
          acc -= STEP;
        }
        if (s.over && s.deadFor > 1.1) finish(s);
      } else acc = 0;

      ctx.setTransform(canvas.width / s.W, 0, 0, canvas.height / H, 0, 0);
      render(ctx, s, now / 1000, fontRef.current, phaseRef.current !== "ready");

      const hud = `${meters(s)}|${Math.round(s.lead)}|${s.meter}|${s.turbo > 0}`;
      if (hud !== lastHud) {
        lastHud = hud;
        if (distRef.current) distRef.current.textContent = `${meters(s)}`;
        if (leadRef.current) {
          leadRef.current.style.width = `${s.lead}%`;
          leadRef.current.style.backgroundColor = s.lead > 60 ? "#16b364" : s.lead > 30 ? "#f59e0b" : "#e5484d";
        }
        if (meterRef.current) {
          [...meterRef.current.children].forEach((el, i) => {
            (el as HTMLElement).style.opacity = s.turbo > 0 || i < s.meter ? "1" : "0.25";
          });
        }
      }
      if (bannerRef.current) {
        const b = phaseRef.current === "playing" ? s.banner : null;
        bannerRef.current.style.opacity = b ? String(Math.min(1, b.t * 3)) : "0";
        if (b) {
          bannerRef.current.textContent = b.text;
          bannerRef.current.dataset.tone = b.tone;
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [newGame, setPhase]);

  // ------------------------------------------------------------ keyboard
  useEffect(() => {
    const focused = () => !!stageRef.current && stageRef.current.contains(document.activeElement);
    const onDown = (e: KeyboardEvent) => {
      const p = phaseRef.current;
      if (e.code === "Escape" || e.code === "KeyP") {
        if (p === "playing" || p === "paused") {
          e.preventDefault();
          togglePause();
        }
        return;
      }
      if (p === "playing") {
        if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
          e.preventDefault();
          if (!e.repeat) inputRef.current.jump = true;
        } else if (e.code === "ArrowDown" || e.code === "KeyS") {
          e.preventDefault();
          inputRef.current.duck = true;
        }
        return;
      }
      if ((e.code === "Space" || e.code === "Enter") && focused() && !(document.activeElement instanceof HTMLButtonElement)) {
        e.preventDefault();
        if (p === "paused") togglePause();
        else start();
      }
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.code === "ArrowDown" || e.code === "KeyS") inputRef.current.duck = false;
    };
    const onHide = () => {
      inputRef.current.duck = false;
      if (phaseRef.current === "playing") setPhase("paused");
    };
    const onVisibility = () => document.hidden && onHide();
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    window.addEventListener("blur", onHide);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      window.removeEventListener("blur", onHide);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [setPhase, start, togglePause]);

  // ------------------------------------------------------------ touch / mouse on the arena: tap = jump, swipe down = duck
  const onPointerDown = (e: React.PointerEvent) => {
    if (phaseRef.current !== "playing") return;
    if (e.pointerType === "mouse") {
      if (e.button === 0) jump();
      return;
    }
    touchRef.current = { id: e.pointerId, y: e.clientY, ducked: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const t = touchRef.current;
    if (!t || t.id !== e.pointerId || t.ducked) return;
    if (e.clientY - t.y > SWIPE_DOWN) {
      t.ducked = true;
      inputRef.current.duckTimer = 0.6;
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const t = touchRef.current;
    if (!t || t.id !== e.pointerId) return;
    if (!t.ducked) jump();
    touchRef.current = null;
  };

  const share = async () => {
    if (!result) return;
    const url = `${window.location.origin}/games/deadline-dash`;
    const text = `🏃 Deadline Dash — mình chạy ${result.meters.toLocaleString("vi-VN")}m trước khi bị deadline tóm!\n☕×${result.coffees} · Kịch bản: ${result.scenario}\nDanh hiệu: ${result.title}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Deadline Dash | Play4Fun", text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* share sheet cancelled */
    }
  };

  const holdDuck = (on: boolean) => (e: React.PointerEvent) => {
    e.preventDefault();
    if (phaseRef.current === "playing" || !on) inputRef.current.duck = on;
  };

  return (
    <div className="mx-auto w-full max-w-[880px]">
      <div ref={stageRef} tabIndex={-1} className="relative overflow-hidden rounded-2xl bg-bg outline-none select-none">
        {/* HUD */}
        <div className="flex items-center gap-3 px-3 py-2.5 sm:px-4">
          <p className="font-mono text-lg font-bold tabular-nums">
            <span ref={distRef}>0</span>
            <span className="text-sm text-muted"> m</span>
          </p>
          <div className="flex flex-1 items-center gap-2">
            <span className="hidden text-xs font-semibold whitespace-nowrap text-muted sm:inline">Cách deadline</span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-2" title="Khoảng cách tới deadline">
              <div ref={leadRef} className="h-full rounded-full bg-party transition-[width] duration-150" style={{ width: "100%" }} />
            </div>
          </div>
          <div ref={meterRef} className="flex gap-0.5" title="3 ly cà phê = Turbo">
            {[0, 1, 2].map((i) => (
              <Coffee key={i} className="h-5 w-5 text-[#8b5a2b] opacity-25 transition-opacity" aria-hidden="true" />
            ))}
          </div>
          {(phase === "playing" || phase === "paused") && (
            <button type="button" onClick={togglePause} aria-label="Tạm dừng" className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-surface text-muted hover:text-fg">
              <Pause className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Arena */}
        <div
          className="relative touch-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (touchRef.current = null)}
        >
          <canvas ref={canvasRef} className="block w-full" style={{ aspectRatio: "800 / 320" }} aria-label="Màn chơi Deadline Dash" />
          <div
            ref={bannerRef}
            aria-live="polite"
            className="pointer-events-none absolute inset-x-3 top-3 rounded-xl px-4 py-2 text-center text-sm font-semibold opacity-0 shadow-card transition-opacity data-[tone=bad]:bg-[#e5484d] data-[tone=bad]:text-white data-[tone=good]:bg-party data-[tone=good]:text-white data-[tone=info]:bg-surface data-[tone=info]:text-fg"
          />

        </div>

        {/* Touch controls */}
        <div className="hidden grid-cols-2 gap-2 p-3 pointer-coarse:grid">
          <button
            type="button"
            onPointerDown={holdDuck(true)}
            onPointerUp={holdDuck(false)}
            onPointerLeave={holdDuck(false)}
            onPointerCancel={holdDuck(false)}
            onContextMenu={(e) => e.preventDefault()}
            className="flex touch-none items-center justify-center gap-2 rounded-xl border border-line bg-surface py-4 text-base font-bold active:scale-95 active:bg-surface-2"
          >
            <ArrowDown className="h-5 w-5 text-quiz" aria-hidden="true" />
            Cúi (giữ)
          </button>
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              jump();
            }}
            onContextMenu={(e) => e.preventDefault()}
            className="flex touch-none items-center justify-center gap-2 rounded-xl bg-brand py-4 text-base font-bold text-brand-ink active:scale-95"
          >
            <ArrowUp className="h-5 w-5" aria-hidden="true" />
            Nhảy
          </button>
        </div>

        {phase === "ready" && (
          <Overlay>
            <h2 className="text-3xl font-extrabold tracking-tight">Deadline Dash</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              Deadline đang đuổi sát sau lưng! Chạy càng xa càng tốt — vấp ngã là deadline áp sát thêm một bước.
            </p>
            <div className="mx-auto mt-4 hidden max-w-md grid-cols-3 gap-2 text-left text-sm sm:grid">
              <Hint icon={<ArrowUp className="h-4 w-4" />} title="Nhảy" body="qua hồ sơ, thùng giấy, cuộc họp" />
              <Hint icon={<ArrowDown className="h-4 w-4" />} title="Cúi" body="né tin nhắn bay ngang đầu" />
              <Hint icon={<Coffee className="h-4 w-4" />} title="3 ly cà phê" body="= Turbo, húc bay mọi thứ" />
            </div>
            <button type="button" onClick={start} className="btn-primary mt-5 px-8 py-3.5 text-base">
              <Play className="h-4 w-4 fill-current" aria-hidden="true" />
              Bắt đầu chạy
            </button>
            <p className="mx-auto mt-2 flex max-w-xs items-start justify-center gap-1.5 text-xs text-muted sm:max-w-none">
              <Shuffle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Mỗi ván một kịch bản ngẫu nhiên: Thứ Hai đầu tuần, mùa thi, cày rank…
            </p>
            <p className="mt-1 text-xs text-muted pointer-coarse:hidden">Space / ↑ nhảy · ↓ cúi (giữ) · Esc tạm dừng</p>
            <p className="mt-1 hidden text-xs text-muted pointer-coarse:block">Chạm để nhảy · vuốt xuống để cúi</p>
            {best > 0 && (
              <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted">
                <Trophy className="h-3.5 w-3.5 text-arcade" aria-hidden="true" />
                Kỷ lục: {best.toLocaleString("vi-VN")} điểm
              </p>
            )}
          </Overlay>
        )}

        {phase === "paused" && (
          <Overlay>
            <h2 className="text-2xl font-extrabold">Tạm dừng</h2>
            <p className="mt-1 text-sm text-muted">Deadline cũng đang đứng chờ… nhưng không lâu đâu.</p>
            <button type="button" onClick={togglePause} className="btn-primary mt-5 px-8">
              <Play className="h-4 w-4 fill-current" aria-hidden="true" />
              Chạy tiếp
            </button>
          </Overlay>
        )}

        {phase === "over" && result && (
          <Overlay>
            <p className="text-sm font-semibold text-[#e5484d]">Deadline đã bắt kịp bạn! · {result.scenario}</p>
            <p className="mt-1 text-5xl font-extrabold tracking-tight tabular-nums">
              {result.meters.toLocaleString("vi-VN")}
              <span className="text-xl font-semibold text-muted"> m</span>
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-sm font-bold text-brand">
                <Award className="h-4 w-4" aria-hidden="true" />
                {result.title}
              </span>
              {result.isBest && <span className="rounded-full bg-[#ffb547] px-2.5 py-1 text-xs font-bold text-[#2a1a00]">Kỷ lục mới!</span>}
            </div>
            <dl className="mx-auto mt-4 grid max-w-sm grid-cols-4 gap-2">
              <Stat label="Điểm" value={result.score.toLocaleString("vi-VN")} />
              <Stat label="Cà phê" value={result.coffees} />
              <Stat label="Vấp" value={result.hits} />
              <Stat label="Húc bay" value={result.smashed} />
            </dl>
            <div className="mt-4 flex flex-col justify-center gap-2 sm:flex-row">
              <button type="button" onClick={share} className="btn-primary px-6">
                {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Share2 className="h-4 w-4" aria-hidden="true" />}
                {copied ? "Đã sao chép!" : "Khoe kết quả"}
              </button>
              <button type="button" onClick={start} className="btn-ghost px-6">
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Chạy ván mới
              </button>
            </div>
            <p className="mt-2 text-xs text-muted">Kỷ lục: {result.best.toLocaleString("vi-VN")} điểm · ván mới là kịch bản khác</p>
            <SaveRecordHint />
          </Overlay>
        )}
      </div>
    </div>
  );
}

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-10 grid place-items-center overflow-y-auto bg-bg/90 p-4 text-center backdrop-blur-sm">
      <div className="w-full">{children}</div>
    </div>
  );
}

function Hint({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-line bg-surface px-3 py-2 sm:flex-col sm:items-start sm:gap-1">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">{icon}</span>
      <p className="text-xs text-muted">
        <b className="text-fg">{title}</b> {body}
      </p>
    </div>
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
