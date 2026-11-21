"use client";

import {
  DRAW_COLORS,
  DRAW_ROUND_OPTIONS,
  DRAW_SIZES,
  DRAW_TIME_OPTIONS,
  type ChatMsg,
  type DrawOp,
  type DrawSettings,
  type DrawView,
  type Stroke,
} from "@play4fun/party";
import { Check, Eraser, Pencil, RotateCcw, Send, SkipForward, Trophy, Undo2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Choice, HostBar, PartyRoom, nameOf, type GameProps, type SettingsProps } from "@/components/party/party-room";
import { useCountdown, type PartyApi } from "@/lib/party-client";
import { getGame } from "@/lib/games";

const accent = getGame("ve-doan-chu")!.cover;
/** Logical canvas: coordinates are 0–1000 on both axes, shown at 4:3 */
const UNITS = 1000;
const ASPECT = 4 / 3;
const FLUSH_MS = 40;

export default function Play() {
  return (
    <PartyRoom
      slug="ve-doan-chu"
      title="Vẽ & đoán"
      emoji="🎨"
      accent={accent}
      Settings={DrawSettingsPanel}
      Game={DrawGame}
      rules={
        <ol className="list-decimal space-y-1 pl-4">
          <li>Mỗi lượt một người vẽ, chọn 1 trong 3 từ (dễ, vừa, khó).</li>
          <li>
            Mọi người gõ đáp án vào ô đoán, <b>không cần gõ dấu</b>.
          </li>
          <li>Đoán càng sớm càng nhiều điểm; người vẽ được điểm cho mỗi người đoán đúng.</li>
          <li>Không được viết chữ hay số lên tranh nhé!</li>
        </ol>
      }
    />
  );
}

function DrawSettingsPanel({ value, onChange, disabled }: SettingsProps<DrawSettings>) {
  return (
    <>
      <Choice label="Số vòng" value={value.rounds} options={DRAW_ROUND_OPTIONS} onChange={(rounds) => onChange({ ...value, rounds })} disabled={disabled} />
      <Choice
        label="Thời gian vẽ"
        value={value.drawTime}
        options={DRAW_TIME_OPTIONS}
        format={(s) => `${s} giây`}
        onChange={(drawTime) => onChange({ ...value, drawTime })}
        disabled={disabled}
      />
      <p className="mt-1 text-xs text-muted">Mỗi vòng, ai cũng được vẽ một lần.</p>
    </>
  );
}

// ------------------------------------------------------------ game

function DrawGame({ view, api, me, isHost, players }: GameProps<DrawView>) {
  const name = (id: string) => nameOf(players, id);
  const isDrawer = view.drawerId === me;
  const secs = useCountdown(view.endsAt, api.now);
  const [chat, setChat] = useState<ChatMsg[]>([]);

  // Chat history after (re)connecting, then live messages
  useEffect(() => {
    let alive = true;
    // Merge by id: messages that arrived while the sync was in flight must not be lost
    api.sync<{ chat: ChatMsg[] }>().then(
      (d) =>
        alive &&
        d &&
        setChat((c) => {
          const byId = new Map([...d.chat, ...c].map((m) => [m.id, m]));
          return [...byId.values()].sort((a, b) => a.id - b.id).slice(-60);
        }),
    );
    const off = api.onChat((m) => setChat((c) => [...c.slice(-60), m]));
    return () => {
      alive = false;
      off();
    };
  }, [api]);

  const ranking = Object.entries(view.scores)
    .filter(([id]) => players.has(id))
    .sort((a, b) => b[1] - a[1]);

  if (view.phase === "over") {
    return (
      <div className="mx-auto max-w-lg text-center">
        <Trophy className="mx-auto h-10 w-10 text-[#f5a400]" aria-hidden="true" />
        <h3 className="mt-2 text-2xl font-extrabold">Kết thúc!</h3>
        <Podium ranking={ranking} name={name} me={me} />
        <HostBar isHost={isHost} waiting="Chờ chủ phòng mở ván mới…">
          <button type="button" onClick={() => api.act({ type: "again" })} className="btn-primary px-8">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Chơi ván mới
          </button>
        </HostBar>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
      <div className="min-w-0">
        {/* top bar */}
        <div className="mb-2 flex items-center gap-3">
          <span className={`grid h-10 w-12 shrink-0 place-items-center rounded-xl font-mono text-lg font-bold ${secs <= 10 && view.phase === "drawing" ? "bg-[#e5484d] text-white" : "bg-surface-2"}`}>
            {secs}
          </span>
          <div className="min-w-0 flex-1 text-center">
            {view.phase === "choosing" ? (
              <p className="text-sm font-semibold text-muted">{isDrawer ? "Chọn một từ để vẽ" : `${name(view.drawerId)} đang chọn từ…`}</p>
            ) : view.word ? (
              <p className="truncate text-xl font-extrabold tracking-wide">{view.word}</p>
            ) : (
              <WordMask mask={view.mask ?? ""} />
            )}
          </div>
          <span className="shrink-0 text-right text-xs text-muted">
            Vòng {view.round}/{view.rounds}
            <br />
            Lượt {view.turn}/{view.totalTurns}
          </span>
        </div>

        <Board view={view} api={api} isDrawer={isDrawer} name={name} />

        {isDrawer && view.phase === "drawing" ? null : (
          <GuessBox api={api} done={view.guessed.includes(me)} drawing={view.phase === "drawing"} />
        )}
        {isHost && !isDrawer && (view.phase === "drawing" || view.phase === "choosing") && (
          <div className="mt-2 text-right">
            <button type="button" onClick={() => api.act({ type: "draw:skip" })} className="text-xs text-muted underline hover:text-fg">
              Bỏ qua lượt của {name(view.drawerId)}
            </button>
          </div>
        )}
      </div>

      <aside className="flex min-w-0 flex-col gap-3">
        <ol className="rounded-2xl border border-line bg-surface p-3">
          {ranking.map(([id, score], i) => (
            <li key={id} className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${id === me ? "bg-brand-soft" : ""}`}>
              <span className="w-5 text-center font-mono text-xs text-muted">{i + 1}</span>
              <span className="min-w-0 flex-1 truncate font-medium">{name(id)}</span>
              {id === view.drawerId && <Pencil className="h-3.5 w-3.5 text-brand" aria-label="Đang vẽ" />}
              {view.guessed.includes(id) && <Check className="h-3.5 w-3.5 text-party" aria-label="Đã đoán đúng" />}
              <span className="font-mono text-xs font-bold tabular-nums">{score}</span>
            </li>
          ))}
        </ol>
        <ChatLog chat={chat} />
      </aside>
    </div>
  );
}

function WordMask({ mask }: { mask: string }) {
  const letters = [...mask].filter((c) => c !== " ").length;
  return (
    <p className="flex flex-wrap items-end justify-center gap-x-1 gap-y-1" aria-label={`Từ gồm ${letters} chữ cái`}>
      {mask.split(" ").map((word, wi) => (
        <span key={wi} className="mr-3 inline-flex gap-1">
          {[...word].map((ch, i) => (
            <span key={i} className="inline-block w-4 border-b-2 border-fg text-center font-mono text-lg leading-tight font-bold sm:w-5">
              {ch === "_" ? " " : ch}
            </span>
          ))}
        </span>
      ))}
      <span className="ml-1 text-xs text-muted">({letters})</span>
    </p>
  );
}

// ------------------------------------------------------------ board

function Board({ view, api, isDrawer, name }: { view: DrawView; api: PartyApi; isDrawer: boolean; name: (id: string) => string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokes = useRef<Stroke[]>([]);
  const pending = useRef<number[]>([]);
  const drawing = useRef<string | null>(null);
  const [color, setColor] = useState(DRAW_COLORS[0]);
  const [size, setSize] = useState(DRAW_SIZES[0]);
  const canDraw = isDrawer && view.phase === "drawing";

  const redraw = useCallback(() => {
    const c = canvasRef.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);
    for (const s of strokes.current) paint(ctx, c, s, 0);
  }, []);

  // Size the canvas to its box (crisp on high-DPI screens)
  useEffect(() => {
    const wrap = wrapRef.current;
    const c = canvasRef.current;
    if (!wrap || !c) return;
    const ro = new ResizeObserver(() => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = wrap.clientWidth;
      c.width = Math.round(w * dpr);
      c.height = Math.round((w / ASPECT) * dpr);
      redraw();
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [redraw]);

  // Strokes from the server: full sync on mount / new turn, then live ops
  useEffect(() => {
    let alive = true;
    api.sync<{ strokes: Stroke[] }>().then((d) => {
      if (alive && d) {
        strokes.current = d.strokes;
        redraw();
      }
    });
    return () => {
      alive = false;
    };
  }, [api, redraw, view.drawerId, view.turn, view.round]);

  useEffect(
    () =>
      api.onOp((op: DrawOp) => {
        const c = canvasRef.current;
        const ctx = c?.getContext("2d");
        if (op.op === "begin") strokes.current.push({ id: op.id, color: op.color, size: op.size, pts: [op.x, op.y] });
        else if (op.op === "points") {
          const s = strokes.current.at(-1);
          if (s && s.id === op.id) {
            const from = s.pts.length - 2;
            s.pts.push(...op.pts);
            if (c && ctx) paint(ctx, c, s, from);
          }
          return;
        } else if (op.op === "undo") strokes.current.pop();
        else strokes.current = [];
        redraw();
      }),
    [api, redraw],
  );

  // Batch outgoing points
  useEffect(() => {
    if (!canDraw) return;
    const id = setInterval(() => {
      if (drawing.current && pending.current.length) {
        api.op({ op: "points", id: drawing.current, pts: pending.current.splice(0, 200) });
      }
    }, FLUSH_MS);
    return () => clearInterval(id);
  }, [api, canDraw]);

  const toUnits = (e: React.PointerEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    const clamp = (v: number) => Math.max(0, Math.min(UNITS, Math.round(v)));
    return [clamp(((e.clientX - r.left) / r.width) * UNITS), clamp(((e.clientY - r.top) / r.height) * UNITS)] as const;
  };

  const down = (e: React.PointerEvent) => {
    if (!canDraw) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const [x, y] = toUnits(e);
    const id = Math.random().toString(36).slice(2, 10);
    drawing.current = id;
    pending.current = [];
    const s: Stroke = { id, color, size, pts: [x, y] };
    strokes.current.push(s);
    api.op({ op: "begin", id, color, size, x, y });
    const c = canvasRef.current!;
    paint(c.getContext("2d")!, c, s, 0);
  };
  const move = (e: React.PointerEvent) => {
    if (!canDraw || !drawing.current) return;
    const s = strokes.current.at(-1);
    if (!s || s.id !== drawing.current) return;
    const [x, y] = toUnits(e);
    const lx = s.pts[s.pts.length - 2];
    const ly = s.pts[s.pts.length - 1];
    if (Math.abs(x - lx) + Math.abs(y - ly) < 3) return;
    const from = s.pts.length - 2;
    s.pts.push(x, y);
    pending.current.push(x, y);
    const c = canvasRef.current!;
    paint(c.getContext("2d")!, c, s, from);
  };
  // The server relays ops to everyone except the drawer, so apply them locally too
  const undo = () => {
    api.op({ op: "undo" });
    strokes.current.pop();
    redraw();
  };
  const clearAll = () => {
    api.op({ op: "clear" });
    strokes.current = [];
    redraw();
  };
  const up = () => {
    if (drawing.current && pending.current.length) api.op({ op: "points", id: drawing.current, pts: pending.current.splice(0, 200) });
    drawing.current = null;
  };

  return (
    <div>
      <div ref={wrapRef} className="relative overflow-hidden rounded-2xl border border-line bg-white shadow-card">
        <canvas
          ref={canvasRef}
          className={`block w-full touch-none ${canDraw ? "cursor-crosshair" : ""}`}
          style={{ aspectRatio: "4 / 3" }}
          aria-label="Bảng vẽ"
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
        />

        {view.phase === "choosing" && (
          <Overlay>
            {view.choices ? (
              <>
                <p className="text-sm font-semibold text-muted">Đến lượt bạn vẽ! Chọn một từ:</p>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {view.choices.map((w, i) => (
                    <button key={w} type="button" onClick={() => api.act({ type: "draw:choose", index: i })} className="btn-ghost px-4">
                      <span className={`h-2 w-2 rounded-full ${["bg-party", "bg-[#f5a400]", "bg-[#e5484d]"][i]}`} aria-hidden="true" />
                      {w}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted">Xanh: dễ · Vàng: vừa · Đỏ: khó (cùng điểm, khó hơn thì vui hơn!)</p>
              </>
            ) : (
              <p className="text-lg font-semibold">
                <Pencil className="mr-1 inline h-5 w-5 text-brand" aria-hidden="true" />
                {name(view.drawerId)} đang chọn từ…
              </p>
            )}
          </Overlay>
        )}

        {view.phase === "turnEnd" && (
          <Overlay>
            <p className="text-sm text-muted">Đáp án là</p>
            <p className="text-3xl font-extrabold">{view.word}</p>
            <ul className="mx-auto mt-3 max-w-xs space-y-1 text-sm">
              {Object.entries(view.turnGains ?? {})
                .sort((a, b) => b[1] - a[1])
                .map(([id, pts]) => (
                  <li key={id} className="flex justify-between gap-4">
                    <span className="truncate">{name(id)}</span>
                    <span className="font-mono font-bold text-party">+{pts}</span>
                  </li>
                ))}
              {Object.keys(view.turnGains ?? {}).length === 0 && <li className="text-muted">Không ai đoán ra 😅</li>}
            </ul>
          </Overlay>
        )}
      </div>

      {canDraw && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1" role="radiogroup" aria-label="Màu bút">
            {DRAW_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={color === c}
                aria-label={`Màu ${c}`}
                onClick={() => setColor(c)}
                className={`h-7 w-7 rounded-full border ${color === c ? "ring-2 ring-brand ring-offset-2 ring-offset-bg" : "border-line"}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <div className="flex gap-1" role="radiogroup" aria-label="Cỡ bút">
            {DRAW_SIZES.map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={size === s}
                aria-label={`Cỡ ${s}`}
                onClick={() => setSize(s)}
                className={`grid h-8 w-8 place-items-center rounded-lg border ${size === s ? "border-brand bg-brand-soft" : "border-line bg-surface"}`}
              >
                <span className="rounded-full bg-fg" style={{ width: Math.max(4, s * 0.8), height: Math.max(4, s * 0.8) }} />
              </button>
            ))}
          </div>
          <span className="ml-auto flex gap-1">
            <ToolButton label="Hoàn tác" onClick={undo} icon={<Undo2 className="h-4 w-4" />} />
            <ToolButton label="Xóa hết" onClick={clearAll} icon={<Eraser className="h-4 w-4" />} />
            <ToolButton label="Bỏ lượt" onClick={() => api.act({ type: "draw:skip" })} icon={<SkipForward className="h-4 w-4" />} />
          </span>
        </div>
      )}
    </div>
  );
}

function paint(ctx: CanvasRenderingContext2D, c: HTMLCanvasElement, s: Stroke, from: number) {
  const sx = c.width / UNITS;
  const sy = c.height / UNITS;
  ctx.strokeStyle = s.color;
  ctx.fillStyle = s.color;
  ctx.lineWidth = s.size * (c.width / 800);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const pts = s.pts;
  if (pts.length === 2) {
    ctx.beginPath();
    ctx.arc(pts[0] * sx, pts[1] * sy, ctx.lineWidth / 2, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  ctx.beginPath();
  const start = Math.max(0, from);
  ctx.moveTo(pts[start] * sx, pts[start + 1] * sy);
  for (let i = start + 2; i < pts.length; i += 2) ctx.lineTo(pts[i] * sx, pts[i + 1] * sy);
  ctx.stroke();
}

function ToolButton({ label, onClick, icon }: { label: string; onClick: () => void; icon: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-surface text-muted hover:text-fg">
      {icon}
    </button>
  );
}

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-white/92 p-4 text-center text-[#1b1a22] backdrop-blur-sm">
      <div>{children}</div>
    </div>
  );
}

// ------------------------------------------------------------ chat & guesses

function GuessBox({ api, done, drawing }: { api: PartyApi; done: boolean; drawing: boolean }) {
  const [text, setText] = useState("");
  const send = () => {
    const t = text.trim();
    if (!t) return;
    api.act({ type: "draw:guess", text: t });
    setText("");
  };
  return (
    <form
      className="mt-2 flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        send();
      }}
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, 60))}
        placeholder={drawing ? (done ? "Bạn đã đoán đúng! Nhắn với những người cũng đoán ra…" : "Gõ đáp án, không cần dấu…") : "Nhắn tin…"}
        aria-label="Ô đoán"
        autoComplete="off"
        className="h-11 min-w-0 flex-1 rounded-xl border border-line bg-surface px-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-50"
      />
      <button type="submit" className="btn-primary h-11 px-4" aria-label="Gửi">
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}

function ChatLog({ chat }: { chat: ChatMsg[] }) {
  const ref = useRef<HTMLUListElement>(null);
  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight });
  }, [chat]);
  return (
    <ul ref={ref} className="h-48 overflow-y-auto rounded-2xl border border-line bg-surface p-3 text-sm lg:h-[300px]" aria-label="Tin nhắn" aria-live="polite">
      {chat.length === 0 && <li className="text-muted">Các câu đoán sẽ hiện ở đây.</li>}
      {chat.map((m) => (
        <li
          key={m.id}
          className={`py-0.5 ${m.kind === "correct" ? "font-semibold text-party" : m.kind === "close" ? "font-semibold text-[#f5a400]" : m.kind === "system" ? "text-muted italic" : ""}`}
        >
          {m.kind === "chat" && <b className="mr-1">{m.name}:</b>}
          {m.text}
        </li>
      ))}
    </ul>
  );
}

function Podium({ ranking, name, me }: { ranking: [string, number][]; name: (id: string) => string; me: string }) {
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <ol className="mt-5 space-y-2 text-left">
      {ranking.map(([id, score], i) => (
        <li key={id} className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 ${i === 0 ? "border-[#f5a400]/50 bg-[#ffb547]/15" : "border-line bg-surface"} ${id === me ? "ring-2 ring-brand/30" : ""}`}>
          <span className="w-7 text-center text-lg">{medals[i] ?? i + 1}</span>
          <span className="min-w-0 flex-1 truncate font-semibold">{name(id)}</span>
          <span className="font-mono font-bold tabular-nums">{score}</span>
        </li>
      ))}
    </ol>
  );
}
