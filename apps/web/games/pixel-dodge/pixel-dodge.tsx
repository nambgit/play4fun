"use client";

import { Check, Pause, Play, RotateCcw, Share2, Trophy } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { H, W, createGame, createInput, scoreOf, step, type GameState } from "./engine";
import { render } from "./render";
import { notifyRecordChanged } from "@/lib/record-sync";
import { SaveRecordHint } from "@/components/auth/save-record-hint";

type Phase = "ready" | "playing" | "paused" | "over";
type Result = { time: number; wave: number; grazes: number; score: number; isBest: boolean };

const BEST_KEY = "p4f:pixel-dodge:best";
const STEP = 1 / 120;

const KEY_DIR: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  KeyA: [-1, 0],
  ArrowRight: [1, 0],
  KeyD: [1, 0],
  ArrowUp: [0, -1],
  KeyW: [0, -1],
  ArrowDown: [0, 1],
  KeyS: [0, 1],
};

function readBest(): number {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

function writeBest(score: number) {
  try {
    localStorage.setItem(BEST_KEY, String(score));
    notifyRecordChanged();
  } catch {
    /* private mode / storage blocked: best score just isn't remembered */
  }
}

export default function PixelDodge() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const waveRef = useRef<HTMLParagraphElement>(null);
  const grazeRef = useRef<HTMLParagraphElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  const stateRef = useRef<GameState>(createGame(1));
  const inputRef = useRef(createInput());
  const phaseRef = useRef<Phase>("ready");
  const keysRef = useRef(new Set<string>());
  const dragRef = useRef<{ id: number; x: number; y: number } | null>(null);

  const [phase, setPhaseState] = useState<Phase>("ready");
  const [result, setResult] = useState<Result | null>(null);
  const [best, setBest] = useState(0);
  const [copied, setCopied] = useState(false);

  const setPhase = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhaseState(p);
  }, []);

  useEffect(() => setBest(readBest()), []);

  const start = useCallback(() => {
    stateRef.current = createGame(Date.now());
    inputRef.current = createInput();
    keysRef.current.clear();
    setResult(null);
    setCopied(false);
    setPhase("playing");
    stageRef.current?.focus({ preventScroll: true });
  }, [setPhase]);

  const togglePause = useCallback(() => {
    if (phaseRef.current === "playing") setPhase("paused");
    else if (phaseRef.current === "paused") setPhase("playing");
  }, [setPhase]);

  // ------------------------------------------------------------ game loop
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    let lastHud = "";

    const finish = (s: GameState) => {
      const score = scoreOf(s);
      const prev = readBest();
      const isBest = score > prev;
      if (isBest) {
        writeBest(score);
        setBest(score);
      }
      setResult({ time: s.t, wave: s.wave + 1, grazes: s.grazes, score, isBest });
      setPhase("over");
    };

    const frame = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const s = stateRef.current;
      const playing = phaseRef.current === "playing";

      if (playing) {
        acc += dt;
        while (acc >= STEP) {
          step(s, STEP, inputRef.current);
          inputRef.current.dragX = 0;
          inputRef.current.dragY = 0;
          acc -= STEP;
        }
        if (s.over && s.deadFor > 0.9) finish(s);
      } else {
        acc = 0;
      }

      render(ctx, s, now / 1000, phaseRef.current !== "ready");

      const hud = `${s.t.toFixed(2)}|${s.wave + 1}|${s.grazes}`;
      if (hud !== lastHud) {
        lastHud = hud;
        if (timeRef.current) timeRef.current.textContent = s.t.toFixed(2);
        if (waveRef.current) waveRef.current.textContent = String(s.wave + 1);
        if (grazeRef.current) grazeRef.current.textContent = String(s.grazes);
      }
      if (bannerRef.current) {
        const show = playing && !s.over && s.waveFlash > 0;
        bannerRef.current.style.opacity = show ? String(Math.min(1, s.waveFlash)) : "0";
        bannerRef.current.textContent = `Đợt ${s.wave + 1}`;
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [setPhase]);

  // ------------------------------------------------------------ keyboard
  useEffect(() => {
    const syncDir = () => {
      let dx = 0;
      let dy = 0;
      for (const k of keysRef.current) {
        const d = KEY_DIR[k];
        if (d) {
          dx += d[0];
          dy += d[1];
        }
      }
      const input = inputRef.current;
      input.dx = Math.sign(dx);
      input.dy = Math.sign(dy);
      input.focus = keysRef.current.has("ShiftLeft") || keysRef.current.has("ShiftRight");
      if (dx || dy) input.target = null;
    };

    const stageFocused = () => !!stageRef.current && stageRef.current.contains(document.activeElement);

    const onDown = (e: KeyboardEvent) => {
      const p = phaseRef.current;
      if (e.code === "Escape" || e.code === "KeyP") {
        if (p === "playing" || p === "paused") {
          e.preventDefault();
          togglePause();
        }
        return;
      }
      if ((e.code === "Space" || e.code === "Enter") && (p === "ready" || p === "over" || p === "paused") && stageFocused()) {
        // Let a focused button handle Enter/Space itself
        if (document.activeElement instanceof HTMLButtonElement) return;
        e.preventDefault();
        if (p === "paused") togglePause();
        else start();
        return;
      }
      if (e.code === "KeyR" && p === "over" && stageFocused()) {
        start();
        return;
      }
      if (p === "playing" && (KEY_DIR[e.code] || e.code.startsWith("Shift") || e.code === "Space")) {
        e.preventDefault();
        keysRef.current.add(e.code);
        syncDir();
      }
    };
    const onUp = (e: KeyboardEvent) => {
      if (keysRef.current.delete(e.code)) syncDir();
    };
    const onBlur = () => {
      keysRef.current.clear();
      syncDir();
      if (phaseRef.current === "playing") setPhase("paused");
    };
    const onVisibility = () => document.hidden && onBlur();

    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [setPhase, start, togglePause]);

  // ------------------------------------------------------------ pointer (mouse follows, touch drags)
  const toLogical = (clientX: number, clientY: number) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: ((clientX - rect.left) / rect.width) * W, y: ((clientY - rect.top) / rect.height) * H, scale: W / rect.width };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" || phaseRef.current !== "playing") return;
    dragRef.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (phaseRef.current !== "playing") return;
    if (e.pointerType === "mouse") {
      const { x, y } = toLogical(e.clientX, e.clientY);
      inputRef.current.target = { x, y };
      return;
    }
    const drag = dragRef.current;
    if (!drag || drag.id !== e.pointerId) return;
    const { scale } = toLogical(e.clientX, e.clientY);
    // 1.3× so a short thumb movement covers the arena; finger never hides the ship
    inputRef.current.dragX += (e.clientX - drag.x) * scale * 1.3;
    inputRef.current.dragY += (e.clientY - drag.y) * scale * 1.3;
    drag.x = e.clientX;
    drag.y = e.clientY;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragRef.current?.id === e.pointerId) dragRef.current = null;
  };

  const share = async () => {
    if (!result) return;
    const url = `${window.location.origin}/games/pixel-dodge`;
    const text = `🕹️ Pixel Dodge: mình sống sót ${result.time.toFixed(2)}s, tới đợt ${result.wave}, sượt qua ${result.grazes} viên đạn — ${result.score.toLocaleString("vi-VN")} điểm. Bạn trụ được bao lâu?`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Pixel Dodge | Play4Fun", text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* user cancelled share sheet */
    }
  };

  return (
    // Cap by viewport height so the whole arena fits on short laptop screens
    <div className="mx-auto w-full max-w-[min(640px,calc(100dvh-11rem))] min-w-[280px]">
      <div
        ref={stageRef}
        tabIndex={-1}
        className={`relative aspect-square w-full touch-none overflow-hidden rounded-2xl bg-[#07060d] outline-none select-none ring-1 ring-white/10 ${phase === "playing" ? "cursor-none" : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="absolute inset-0 h-full w-full [image-rendering:pixelated]"
          aria-label="Màn chơi Pixel Dodge"
        />

        {/* HUD */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3 font-mono text-white sm:p-4">
          <div>
            <p className="text-[10px] tracking-widest text-white/50 uppercase">Thời gian</p>
            <p className="text-xl font-bold tabular-nums sm:text-2xl">
              <span ref={timeRef}>0.00</span>
              <span className="text-sm text-white/50">s</span>
            </p>
          </div>
          <div className="flex gap-4 text-right">
            <div>
              <p className="text-[10px] tracking-widest text-white/50 uppercase">Đợt</p>
              <p className="text-lg font-bold tabular-nums" ref={waveRef}>
                1
              </p>
            </div>
            <div>
              <p className="text-[10px] tracking-widest text-white/50 uppercase">Sượt</p>
              <p className="text-lg font-bold tabular-nums" ref={grazeRef}>
                0
              </p>
            </div>
          </div>
        </div>

        {phase === "playing" && (
          <button
            type="button"
            onClick={togglePause}
            className="absolute right-3 bottom-3 grid h-10 w-10 cursor-pointer place-items-center rounded-xl bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            aria-label="Tạm dừng"
          >
            <Pause className="h-4 w-4" />
          </button>
        )}

        <div
          ref={bannerRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/3 text-center font-mono text-3xl font-extrabold tracking-[0.3em] text-white uppercase opacity-0 transition-opacity [text-shadow:0_0_24px_rgb(140_107_255)]"
        />

        {phase === "ready" && (
          <Overlay>
            <p className="font-mono text-xs tracking-[0.3em] text-[#7ee2ff] uppercase">Play4Fun Arcade</p>
            <h2 className="mt-2 font-mono text-3xl font-extrabold tracking-wider text-white sm:text-4xl">PIXEL DODGE</h2>
            <p className="mx-auto mt-3 max-w-xs text-sm text-white/70">Né mưa đạn pixel càng lâu càng tốt. Chạm một viên là hết ván.</p>
            {/* Desktop controls */}
            <ul className="mx-auto mt-5 grid max-w-sm gap-2 text-left text-xs text-white/75 pointer-coarse:hidden">
              <li className="flex items-center gap-2">
                <Kbd>WASD</Kbd> hoặc <Kbd>← ↑ → ↓</Kbd> để di chuyển
              </li>
              <li className="flex items-center gap-2">
                Giữ <Kbd>Shift</Kbd> để đi chậm, luồn qua khe hẹp
              </li>
              <li className="flex items-center gap-2">
                Hoặc dùng <Kbd>Chuột</Kbd> — phi thuyền bay theo con trỏ
              </li>
            </ul>
            {/* Touch controls */}
            <p className="mx-auto mt-5 hidden max-w-xs text-sm text-white/75 pointer-coarse:block">
              Kéo ngón tay ở bất kỳ đâu trên màn để điều khiển — ngón tay sẽ không che phi thuyền.
            </p>
            <button type="button" onClick={start} className="btn-primary mt-6 px-8 py-3.5 text-base">
              <Play className="h-4 w-4 fill-current" aria-hidden="true" />
              Bắt đầu
            </button>
            {best > 0 && (
              <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-white/60">
                <Trophy className="h-3.5 w-3.5 text-[#ffb547]" aria-hidden="true" />
                Kỷ lục của bạn: {best.toLocaleString("vi-VN")} điểm
              </p>
            )}
          </Overlay>
        )}

        {phase === "paused" && (
          <Overlay>
            <h2 className="font-mono text-2xl font-extrabold tracking-widest text-white">TẠM DỪNG</h2>
            <p className="mt-2 text-sm text-white/60">Nhấn Esc hoặc P để chơi tiếp</p>
            <button type="button" onClick={togglePause} className="btn-primary mt-6 px-8">
              <Play className="h-4 w-4 fill-current" aria-hidden="true" />
              Chơi tiếp
            </button>
          </Overlay>
        )}

        {phase === "over" && result && (
          <Overlay>
            {result.isBest && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ffb547] px-3 py-1 text-xs font-bold text-[#2a1a00]">
                <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
                Kỷ lục mới!
              </span>
            )}
            <p className="mt-3 text-sm text-white/60">Bạn đã sống sót</p>
            <p className="font-mono text-5xl font-extrabold text-white tabular-nums">
              {result.time.toFixed(2)}
              <span className="text-2xl text-white/50">s</span>
            </p>
            <dl className="mx-auto mt-5 grid max-w-xs grid-cols-3 gap-2 text-center">
              <Stat label="Đợt" value={result.wave} />
              <Stat label="Sượt qua" value={result.grazes} />
              <Stat label="Điểm" value={result.score.toLocaleString("vi-VN")} />
            </dl>
            <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
              <button type="button" onClick={start} className="btn-primary px-6">
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Chơi lại
              </button>
              <button type="button" onClick={share} className="btn border border-white/20 bg-white/10 px-6 text-white hover:bg-white/20">
                {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Share2 className="h-4 w-4" aria-hidden="true" />}
                {copied ? "Đã sao chép!" : "Khoe kết quả"}
              </button>
            </div>
            <p className="mt-4 text-xs text-white/50">Kỷ lục: {best.toLocaleString("vi-VN")} điểm · nhấn R để chơi lại</p>
            <SaveRecordHint dark />
          </Overlay>
        )}
      </div>

      <p className="mt-3 text-center text-xs text-white/50 pointer-coarse:hidden">
        <Kbd>Esc</Kbd> / <Kbd>P</Kbd> tạm dừng · <Kbd>Shift</Kbd> đi chậm · ô vàng nhấp nháy = đạn sắp bắn ra
      </p>
    </div>
  );
}

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 grid place-items-center overflow-y-auto bg-[#07060d]/80 p-6 text-center backdrop-blur-sm">
      <div>{children}</div>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-block rounded-md border border-white/20 bg-white/10 px-1.5 py-0.5 font-mono text-[11px] font-semibold whitespace-nowrap text-white">
      {children}
    </kbd>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white/5 px-2 py-2.5 ring-1 ring-white/10">
      <dt className="text-[10px] tracking-wider text-white/50 uppercase">{label}</dt>
      <dd className="mt-0.5 font-mono text-lg font-bold text-white tabular-nums">{value}</dd>
    </div>
  );
}
