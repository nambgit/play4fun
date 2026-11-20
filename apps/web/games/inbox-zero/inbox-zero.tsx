"use client";

import {
  AlarmClock,
  ArrowLeft,
  Award,
  ArrowRight,
  ArrowUp,
  Check,
  Forward,
  Heart,
  Inbox,
  Lock,
  Paperclip,
  Pause,
  PhoneCall,
  Play,
  RotateCcw,
  Share2,
  Shuffle,
  Trash2,
  Trophy,
} from "lucide-react";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { COMPANY_DOMAIN, POWERUPS } from "./content";
import {
  FORWARD_UNLOCK_AT,
  MAX_LIVES,
  ROUND_SECONDS,
  accuracy,
  act,
  createGame,
  emojiGrid,
  multiplier,
  tick,
  titleFor,
  type Action,
  type Card,
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
type Leaving = { card: Card; dir: Action; dx: number; dy: number };
type Result = {
  processed: number;
  correct: number;
  accuracy: number;
  bestCombo: number;
  score: number;
  phishing: number;
  title: string;
  grid: string;
  reason: "time" | "lives";
  isBest: boolean;
  best: number;
};

const SWIPE_X = 90;
const SWIPE_UP = 80;

// v2: round length changed to 90s, so older 60s scores are not comparable
const BEST_KEY = "p4f:inbox-zero:best:v2";
const SEEN_KEY = "p4f:inbox-zero:seen";
/** How many recently shown emails to push to the back of the next round */
const SEEN_MEMORY = 45;

function readSeen(): Set<string> {
  try {
    const raw = JSON.parse(localStorage.getItem(SEEN_KEY) ?? "[]");
    return new Set(Array.isArray(raw) ? raw.filter((x) => typeof x === "string") : []);
  } catch {
    return new Set();
  }
}
function rememberSeen(dealt: string[]) {
  try {
    const merged = [...readSeen(), ...dealt];
    const unique = [...new Set(merged.reverse())].reverse(); // keep latest occurrence order
    localStorage.setItem(SEEN_KEY, JSON.stringify(unique.slice(-SEEN_MEMORY)));
  } catch {
    /* storage blocked — rounds are still shuffled, just without memory */
  }
}

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

const AVATAR_COLORS = ["bg-[#6b3cf5]", "bg-[#ff6a3d]", "bg-[#1a9fe8]", "bg-[#16b364]", "bg-[#ec4899]", "bg-[#f59e0b]", "bg-[#0f766e]"];
function avatarColor(name: string) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
function initials(name: string) {
  const clean = name.split("·")[0].trim().split(/\s+/);
  return (clean.length > 1 ? clean[0][0] + clean[clean.length - 1][0] : clean[0][0]).toUpperCase();
}

export default function InboxZero({ daily }: { daily?: DailyInfo }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<GameState | null>(null);
  const phaseRef = useRef<Phase>("ready");
  const [phase, setPhaseState] = useState<Phase>("ready");
  const [, render] = useReducer((n: number) => n + 1, 0);
  const [leaving, setLeaving] = useState<Leaving[]>([]);
  const [drag, setDrag] = useState<{ id: number; x0: number; y0: number; dx: number; dy: number } | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);
  const [best, setBest] = useState(0);

  const setPhase = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhaseState(p);
  }, []);

  useEffect(() => setBest(readNum(BEST_KEY)), []);

  /** Every round: new random seed + emails seen in recent rounds pushed to the back of the deck */
  const start = useCallback(() => {
    // Daily challenge: same inbox for everyone (fixed seed, no "recently seen" reordering)
    stateRef.current = daily ? createGame(daily.seed) : createGame(Date.now() ^ Math.floor(Math.random() * 2 ** 31), readSeen());
    setLeaving([]);
    setDrag(null);
    setResult(null);
    setCopied(false);
    setPhase("playing");
    gameStart("inbox-zero");
    stageRef.current?.focus({ preventScroll: true });
  }, [daily, setPhase]);

  const finish = useCallback(() => {
    const s = stateRef.current!;
    rememberSeen(s.dealt);
    const prev = readNum(BEST_KEY);
    const isBest = s.score > prev;
    if (isBest) {
      writeNum(BEST_KEY, s.score);
      notifyRecordChanged();
    }
    const best = Math.max(prev, s.score);
    setBest(best);
    setResult({
      processed: s.processed,
      correct: s.correct,
      accuracy: accuracy(s),
      bestCombo: s.bestCombo,
      score: s.score,
      phishing: s.phishingCaught,
      title: titleFor(s.correct),
      grid: emojiGrid(s.outcomes),
      reason: s.overReason ?? "time",
      isBest,
      best,
    });
    gameEnd("inbox-zero", { score: s.score });
    if (daily) void finishDaily(daily, "inbox-zero", s.score);
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

  const doAction = useCallback(
    (dir: Action, dx = 0, dy = 0) => {
      const s = stateRef.current;
      if (!s || phaseRef.current !== "playing") return;
      const res = act(s, dir);
      if (!res) return;
      const item: Leaving = { card: res.card, dir, dx, dy };
      setLeaving((l) => [...l, item]);
      setTimeout(() => setLeaving((l) => l.filter((x) => x !== item)), 260);
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
        const map: Record<string, Action> = {
          ArrowLeft: "delete",
          KeyA: "delete",
          ArrowRight: "handle",
          KeyD: "handle",
          ArrowUp: "forward",
          KeyW: "forward",
        };
        const dir = map[e.code];
        if (dir) {
          e.preventDefault();
          if (!e.repeat) doAction(dir);
        }
        return;
      }
      if (e.code === "KeyR" && p === "over" && focused()) start();
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
  }, [doAction, setPhase, start, togglePause]);

  // ------------------------------------------------------------ swipe
  const onPointerDown = (e: React.PointerEvent) => {
    if (phaseRef.current !== "playing" || e.button > 0) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDrag({ id: e.pointerId, x0: e.clientX, y0: e.clientY, dx: 0, dy: 0 });
  };
  const onPointerMove = (e: React.PointerEvent) => {
    setDrag((d) => (d && d.id === e.pointerId ? { ...d, dx: e.clientX - d.x0, dy: e.clientY - d.y0 } : d));
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag;
    setDrag(null);
    if (!d || d.id !== e.pointerId) return;
    const s = stateRef.current;
    if (d.dy < -SWIPE_UP && Math.abs(d.dy) > Math.abs(d.dx) && s?.forwardUnlocked) doAction("forward", d.dx, d.dy);
    else if (d.dx > SWIPE_X) doAction("handle", d.dx, d.dy);
    else if (d.dx < -SWIPE_X) doAction("delete", d.dx, d.dy);
  };

  const share = async () => {
    if (!result) return;
    const url = resultUrl("inbox-zero", { v: result.score, d: daily?.day });
    const head = "📥 Inbox Zero";
    const text = `${head} — ${result.correct} email / ${ROUND_SECONDS}s · ${result.score.toLocaleString("vi-VN")} điểm\n${result.grid}\nDanh hiệu: ${result.title}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Inbox Zero | Play4Fun", text, url });
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
  const showGame = s && (phase === "playing" || phase === "paused");
  const dragHint =
    drag && s?.card
      ? drag.dy < -40 && Math.abs(drag.dy) > Math.abs(drag.dx) && s.forwardUnlocked
        ? "forward"
        : drag.dx > 30
          ? "handle"
          : drag.dx < -30
            ? "delete"
            : null
      : null;
  const dragStrength = drag ? Math.min(1, Math.max(Math.abs(drag.dx) / SWIPE_X, -drag.dy / SWIPE_UP)) : 0;

  return (
    <div className="mx-auto w-full max-w-[560px]">
      <div
        ref={stageRef}
        tabIndex={-1}
        className="relative flex min-h-[540px] flex-col overflow-hidden rounded-2xl bg-bg p-3 outline-none select-none sm:min-h-[560px] sm:p-5"
      >
        {/* HUD */}
        <Hud s={s} active={!!showGame} onPause={togglePause} />

        {/* Card area */}
        <div className="relative mt-4 flex-1">
          {showGame && s && (
            <>
              {/* stack behind */}
              <div className="absolute inset-x-6 top-5 bottom-2 rounded-2xl border border-line bg-surface opacity-50" />
              <div className="absolute inset-x-3 top-2.5 bottom-4 rounded-2xl border border-line bg-surface opacity-80" />

              {s.card && (
                <div
                  key={s.card.uid}
                  className="absolute inset-0 bottom-6 animate-[card-in_180ms_ease-out] cursor-grab touch-none active:cursor-grabbing"
                  style={
                    drag
                      ? { transform: `translate(${drag.dx}px, ${Math.min(0, drag.dy) * 0.9 + Math.max(0, drag.dy) * 0.2}px) rotate(${drag.dx / 18}deg)` }
                      : { transition: "transform 180ms ease-out" }
                  }
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={() => setDrag(null)}
                >
                  <CardView card={s.card} hint={dragHint} strength={dragStrength} />
                </div>
              )}

              {leaving.map((l) => (
                <div
                  key={`leave-${l.card.uid}`}
                  className={`pointer-events-none absolute inset-0 bottom-6 ${
                    l.dir === "handle" ? "animate-[fly-right_240ms_ease-in_forwards]" : l.dir === "delete" ? "animate-[fly-left_240ms_ease-in_forwards]" : "animate-[fly-up_240ms_ease-in_forwards]"
                  }`}
                  style={{ transform: `translate(${l.dx}px, ${Math.min(0, l.dy)}px) rotate(${l.dx / 18}deg)` }}
                >
                  <CardView card={l.card} hint={l.dir} strength={1} />
                </div>
              ))}

              {s.feedback && (
                <div
                  role="status"
                  className={`absolute inset-x-2 -top-1 z-20 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-lift ${
                    s.feedback.good ? "bg-party text-white" : "bg-[#e5484d] text-white"
                  }`}
                >
                  {s.feedback.text}
                </div>
              )}
              {s.unlockFlash > 0 && !s.feedback && (
                <div className="absolute inset-x-2 -top-1 z-20 flex items-center gap-2 rounded-xl bg-quiz px-4 py-2.5 text-sm font-semibold text-white shadow-lift">
                  <Forward className="h-4 w-4" aria-hidden="true" />
                  Mở khóa: vuốt lên ↑ để chuyển tiếp email cho phòng khác!
                </div>
              )}
            </>
          )}
        </div>

        {/* Actions */}
        <div className="mt-2 grid grid-cols-3 gap-2">
          <ActionButton label="Xóa" keyHint="←" tone="bad" icon={<Trash2 className="h-5 w-5" />} disabled={!showGame || phase !== "playing"} onClick={() => doAction("delete", -1)} />
          <ActionButton
            label="Chuyển"
            keyHint="↑"
            tone="info"
            icon={s?.forwardUnlocked ? <Forward className="h-5 w-5" /> : <Lock className="h-4.5 w-4.5" />}
            disabled={!showGame || phase !== "playing" || !s?.forwardUnlocked}
            onClick={() => doAction("forward", 0, -1)}
          />
          <ActionButton label="Xử lý" keyHint="→" tone="good" icon={<Check className="h-5 w-5" />} disabled={!showGame || phase !== "playing"} onClick={() => doAction("handle", 1)} />
        </div>

        {/* ---------------- overlays ---------------- */}
        {phase === "ready" && (
          <Overlay>
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand text-white shadow-lift">
              <Inbox className="h-7 w-7" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight">Inbox Zero</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
              Bạn là nhân viên Marketing của công ty <b className="text-fg">Mây Xanh</b>. Dọn sạch hộp thư trong {ROUND_SECONDS} giây!
            </p>
            <ul className="mx-auto mt-5 grid max-w-sm gap-2 text-left text-sm">
              <Rule icon={<ArrowRight className="h-4 w-4" />} tone="text-party bg-party-soft">
                <b>Xử lý</b> — việc thật của bạn: sếp, khách hàng, đồng nghiệp
              </Rule>
              <Rule icon={<ArrowLeft className="h-4 w-4" />} tone="text-[#e5484d] bg-[#e5484d]/10">
                <b>Xóa</b> — quảng cáo, thư rác và email lừa đảo
              </Rule>
              <Rule icon={<ArrowUp className="h-4 w-4" />} tone="text-quiz bg-quiz-soft">
                <b>Chuyển tiếp</b> — thư của phòng khác (mở sau {FORWARD_UNLOCK_AT} giây)
              </Rule>
            </ul>
            <p className="mx-auto mt-3 max-w-sm rounded-lg bg-arcade-soft px-3 py-2 text-xs text-fg">
              💡 Đồng nghiệp thật luôn dùng đuôi <b className="font-mono">@{COMPANY_DOMAIN}</b> — soi kỹ địa chỉ người gửi!
            </p>
            {daily && <DailyBadge daily={daily} where="ready" />}
            <button type="button" onClick={start} className="btn-primary mt-6 px-8 py-3.5 text-base">
              <Play className="h-4 w-4 fill-current" aria-hidden="true" />
              Bắt đầu
            </button>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted">
              <Shuffle className="h-3.5 w-3.5" aria-hidden="true" />
              Mỗi ván là một hộp thư ngẫu nhiên mới
            </p>
            {best > 0 && (
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
                <Trophy className="h-3.5 w-3.5 text-arcade" aria-hidden="true" />
                Kỷ lục của bạn: {best.toLocaleString("vi-VN")} điểm
              </p>
            )}
            <p className="mt-3 text-xs text-muted pointer-coarse:hidden">Bàn phím: ← xóa · → xử lý · ↑ chuyển tiếp · Esc tạm dừng</p>
          </Overlay>
        )}

        {phase === "paused" && (
          <Overlay>
            <h2 className="text-2xl font-extrabold">Đang giải lao ☕</h2>
            <p className="mt-2 text-sm text-muted">Hộp thư vẫn chờ bạn đấy.</p>
            <button type="button" onClick={togglePause} className="btn-primary mt-6 px-8">
              <Play className="h-4 w-4 fill-current" aria-hidden="true" />
              Làm việc tiếp
            </button>
          </Overlay>
        )}

        {phase === "over" && result && (
          <Overlay>
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted">
              {result.reason === "lives" ? (
                <PhoneCall className="h-4 w-4 text-[#e5484d]" aria-hidden="true" />
              ) : (
                <AlarmClock className="h-4 w-4 text-brand" aria-hidden="true" />
              )}
              {result.reason === "lives" ? "Sếp gọi lên phòng!" : "Hết giờ làm việc!"}
            </p>
            <p className="mt-1 text-5xl font-extrabold tracking-tight">
              {result.correct}
              <span className="text-xl font-semibold text-muted"> email</span>
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-sm font-bold text-brand">
              <Award className="h-4 w-4" aria-hidden="true" />
              {result.title}
            </span>
            {result.isBest && (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-[#ffb547] px-2.5 py-1 text-xs font-bold text-[#2a1a00]">Kỷ lục mới!</span>
            )}
            <dl className="mx-auto mt-5 grid max-w-sm grid-cols-4 gap-2">
              <Stat label="Điểm" value={result.score.toLocaleString("vi-VN")} />
              <Stat label="Chính xác" value={`${result.accuracy}%`} />
              <Stat label="Combo" value={`×${result.bestCombo}`} />
              <Stat label="Bắt lừa đảo" value={result.phishing} />
            </dl>
            {result.grid && <pre className="mx-auto mt-4 w-fit text-left font-sans text-lg leading-snug">{result.grid}</pre>}
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
            <p className="mt-3 text-xs text-muted">
              Kỷ lục: {result.best.toLocaleString("vi-VN")} điểm · ván mới sẽ là bộ email khác
            </p>
            {daily && <DailyBadge daily={daily} where="over" />}
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
  const lives = active && s ? s.lives : MAX_LIVES;
  const combo = active && s ? s.combo : 0;
  const mult = multiplier(combo);
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className={`w-14 font-mono text-xl font-bold tabular-nums ${timeLeft <= 10 ? "text-[#e5484d]" : ""}`}>{Math.ceil(timeLeft)}s</span>
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-2">
          <div
            className={`h-full rounded-full transition-[width] duration-100 ${timeLeft <= 10 ? "bg-[#e5484d]" : "bg-brand"}`}
            style={{ width: `${pct}%` }}
          />
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
      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="font-mono font-bold tabular-nums">{(active && s ? s.score : 0).toLocaleString("vi-VN")} điểm</span>
        {combo >= 2 && (
          <span key={combo} className="inline-flex animate-[pop_200ms_ease-out] items-center gap-1 rounded-full bg-arcade-soft px-2.5 py-0.5 text-xs font-bold text-arcade">
            🔥 Combo {combo} {mult > 1 && `· ×${mult}`}
          </span>
        )}
      </div>
    </div>
  );
}

const HINT_STYLE: Record<Action, { label: string; cls: string }> = {
  handle: { label: "XỬ LÝ", cls: "border-party text-party rotate-[-8deg] left-4" },
  delete: { label: "XÓA", cls: "border-[#e5484d] text-[#e5484d] rotate-[8deg] right-4" },
  forward: { label: "CHUYỂN", cls: "border-quiz text-quiz left-1/2 -translate-x-1/2" },
};

function CardView({ card, hint, strength }: { card: Card; hint: Action | null; strength: number }) {
  const pct = Math.max(0, card.patience / card.total);
  const barColor = pct > 0.5 ? "bg-party" : pct > 0.25 ? "bg-[#f59e0b]" : "bg-[#e5484d]";

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-lift">
      {card.kind === "email" ? (
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-bold text-white ${avatarColor(card.email.from)}`}>
              {initials(card.email.from)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{card.email.from}</p>
              <p className="truncate font-mono text-xs text-muted">&lt;{card.email.address}&gt;</p>
            </div>
            <span className="text-xs text-muted">{card.time}</span>
          </div>
          <h3 className="mt-5 text-lg leading-snug font-bold sm:text-xl">{card.email.subject}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">{card.email.preview}</p>
          {card.email.attachment && (
            <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-lg border border-line bg-surface-2 px-2.5 py-1.5 text-xs">
              <Paperclip className="h-3.5 w-3.5" aria-hidden="true" />
              {card.email.attachment}
            </span>
          )}
        </div>
      ) : (
        <div className="grid flex-1 place-items-center bg-gradient-to-br from-[#ffb547]/25 to-[#ff6a3d]/20 p-6 text-center">
          <div>
            <p className="text-6xl">{POWERUPS[card.power].emoji}</p>
            <p className="mt-3 text-xl font-extrabold">{POWERUPS[card.power].title}</p>
            <p className="mt-1 text-sm text-muted">{POWERUPS[card.power].body}</p>
            <p className="mt-3 text-xs font-semibold text-arcade">Vuốt hướng nào cũng được để nhận!</p>
          </div>
        </div>
      )}

      <div className="h-1.5 bg-surface-2">
        <div className={`h-full ${barColor}`} style={{ width: `${pct * 100}%` }} />
      </div>

      {hint && card.kind === "email" && (
        <span
          className={`absolute bottom-10 rounded-lg border-[3px] bg-surface/85 px-3 py-1 text-2xl font-extrabold tracking-wider ${HINT_STYLE[hint].cls}`}
          style={{ opacity: strength }}
        >
          {HINT_STYLE[hint].label}
        </span>
      )}
    </div>
  );
}

function ActionButton({
  label,
  keyHint,
  icon,
  tone,
  disabled,
  onClick,
}: {
  label: string;
  keyHint: string;
  icon: React.ReactNode;
  tone: "good" | "bad" | "info";
  disabled: boolean;
  onClick: () => void;
}) {
  const toneCls = {
    good: "text-party hover:bg-party-soft",
    bad: "text-[#e5484d] hover:bg-[#e5484d]/10",
    info: "text-quiz hover:bg-quiz-soft",
  }[tone];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center gap-1 rounded-xl border border-line bg-surface py-2.5 text-sm font-semibold transition active:scale-95 disabled:opacity-40 disabled:hover:bg-surface ${toneCls}`}
    >
      {icon}
      <span className="text-fg">
        {label} <span className="text-xs text-muted pointer-coarse:hidden">{keyHint}</span>
      </span>
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
