"use client";

import { HIEU_SECONDS_OPTIONS, HIEU_TURN_OPTIONS, type HieuSettings, type HieuView } from "@play4fun/party";
import { Check, Crown, RotateCcw, Trophy } from "lucide-react";
import { Choice, HostBar, PartyRoom, nameOf, type GameProps, type SettingsProps } from "@/components/party/party-room";
import { getGame } from "@/lib/games";
import { useCountdown } from "@/lib/party-client";

const accent = getGame("ai-hieu-ai")!.cover;
const COLORS = ["bg-[#e5484d]", "bg-[#1a9fe8]", "bg-[#f5a400]", "bg-[#16b364]"];
const LETTERS = ["A", "B", "C", "D"];

export default function Play() {
  return (
    <PartyRoom
      slug="ai-hieu-ai"
      title="Ai hiểu ai nhất?"
      emoji="💞"
      accent={accent}
      Settings={HieuSettingsPanel}
      Game={HieuGame}
      rules={
        <ol className="list-decimal space-y-1 pl-4">
          <li>
            Mỗi lượt một người <b>“lên ghế nóng”</b> và bí mật chọn câu trả lời đúng với mình.
          </li>
          <li>Những người còn lại đoán xem người đó đã chọn gì.</li>
          <li>
            Đoán đúng được <b>100 điểm</b>; người ghế nóng được <b>50 điểm</b> cho mỗi người đoán trúng.
          </li>
          <li>Ai cũng sẽ được lên ghế nóng. Cuối game xem ai hiểu cả nhóm nhất!</li>
        </ol>
      }
    />
  );
}

function HieuSettingsPanel({ value, onChange, disabled }: SettingsProps<HieuSettings>) {
  return (
    <>
      <Choice label="Số lượt" value={value.turns} options={HIEU_TURN_OPTIONS} format={(v) => `${v} lượt`} onChange={(turns) => onChange({ ...value, turns })} disabled={disabled} />
      <Choice label="Thời gian" value={value.seconds} options={HIEU_SECONDS_OPTIONS} format={(v) => `${v} giây`} onChange={(seconds) => onChange({ ...value, seconds })} disabled={disabled} />
      <p className="mt-1 text-xs text-muted">Mỗi người sẽ lên ghế nóng ít nhất một lần nếu số lượt đủ cho cả phòng.</p>
    </>
  );
}

function HieuGame({ view, api, me, isHost, players }: GameProps<HieuView>) {
  const name = (id: string) => nameOf(players, id);
  const secs = useCountdown(view.phase === "answer" ? view.endsAt : undefined, api.now);
  const hot = view.hotSeat === me;
  const text = view.question.text.replaceAll("{name}", hot ? "bạn" : name(view.hotSeat));
  const online = [...players.values()].filter((p) => p.connected).length;
  const board = Object.entries(view.scores).sort((a, b) => b[1] - a[1]);

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="font-semibold">
          Lượt {Math.min(view.turn, view.totalTurns)}/{view.totalTurns}
        </span>
        {view.phase === "answer" && <span className={`font-mono font-bold tabular-nums ${secs <= 5 ? "text-[#e5484d]" : "text-muted"}`}>{secs}s</span>}
      </div>

      {view.phase !== "over" && (
        <>
          <div className="rounded-2xl bg-gradient-to-br from-[#ec4899] to-[#8b5cf6] p-5 text-center text-white shadow-lift">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
              <Crown className="h-3.5 w-3.5" aria-hidden="true" />
              Ghế nóng: {hot ? "BẠN" : name(view.hotSeat)}
            </p>
            <p className="mt-3 text-xl leading-snug font-bold text-balance sm:text-2xl">{text}</p>
            <p className="mt-2 text-sm text-white/85">
              {view.phase === "answer" ? (hot ? "Chọn câu trả lời đúng với bạn. Mọi người sẽ đoán!" : `Đoán xem ${name(view.hotSeat)} chọn gì`) : view.skipped ? `${name(view.hotSeat)} chưa kịp trả lời, lượt này bỏ qua.` : "Đáp án đã lộ!"}
            </p>
          </div>

          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {view.question.options.map((opt, i) => {
              const mine = view.myPick === i;
              const isHot = view.hotPick === i;
              const reveal = view.phase === "reveal";
              return (
                <button
                  key={i}
                  type="button"
                  disabled={view.phase !== "answer"}
                  onClick={() => api.act({ type: "hieu:pick", index: i })}
                  className={`relative flex min-h-16 items-center gap-3 rounded-2xl p-4 text-left font-semibold text-white shadow-card transition ${COLORS[i]} ${
                    reveal && !isHot ? "opacity-40" : ""
                  } ${mine ? "ring-4 ring-fg/70 ring-offset-2 ring-offset-bg" : ""} ${view.phase === "answer" ? "hover:-translate-y-0.5 active:scale-[0.98]" : ""}`}
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/25 text-sm font-bold">{LETTERS[i]}</span>
                  <span className="flex-1">{opt}</span>
                  {reveal && view.counts && !hot && <span className="rounded-full bg-black/20 px-2 py-0.5 text-xs">{view.counts[i]} người đoán</span>}
                  {reveal && isHot && <Check className="h-5 w-5" aria-hidden="true" />}
                </button>
              );
            })}
          </div>

          {view.phase === "answer" && (
            <>
              <p className="mt-4 text-center text-xs text-muted">
                {view.answered.length}/{online} người đã chọn{view.answered.includes(view.hotSeat) ? " · ghế nóng đã chốt" : ""}
              </p>
              {isHost && (
                <p className="mt-2 text-center">
                  <button type="button" onClick={() => api.act({ type: "hieu:close" })} className="text-xs text-muted underline hover:text-fg">
                    Lật đáp án ngay
                  </button>
                </p>
              )}
            </>
          )}

          {view.phase === "reveal" && (
            <>
              {view.gains && view.gains[me] !== undefined && <p className="mt-4 text-center text-lg font-bold text-party">+{view.gains[me]} điểm</p>}
              {view.gains && view.gains[me] === undefined && !view.skipped && !hot && <p className="mt-4 text-center text-sm text-muted">Lần này đoán chưa trúng!</p>}
              <Scoreboard board={board} name={name} me={me} gains={view.gains} />
              <HostBar isHost={isHost} waiting="Chờ chủ phòng sang lượt tiếp…">
                <button type="button" onClick={() => api.act({ type: "hieu:next" })} className="btn-primary px-8">
                  {view.turn >= view.totalTurns ? "Xem kết quả" : "Lượt tiếp theo"}
                </button>
              </HostBar>
            </>
          )}
        </>
      )}

      {view.phase === "over" && (
        <>
          <div className="rounded-2xl bg-gradient-to-br from-[#ec4899] to-[#8b5cf6] p-6 text-center text-white shadow-lift">
            <Trophy className="mx-auto h-8 w-8" aria-hidden="true" />
            <p className="mt-2 text-sm text-white/85">Người hiểu cả nhóm nhất</p>
            <p className="mt-1 text-3xl font-extrabold">{board[0] ? name(board[0][0]) : "—"}</p>
            {board[0] && <p className="mt-1 text-white/90">{board[0][1]} điểm</p>}
          </div>
          <Scoreboard board={board} name={name} me={me} gains={null} />
          <HostBar isHost={isHost} waiting="Chờ chủ phòng mở ván mới…">
            <button type="button" onClick={() => api.act({ type: "again" })} className="btn-primary px-8">
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Chơi ván mới
            </button>
          </HostBar>
        </>
      )}
    </div>
  );
}

function Scoreboard({ board, name, me, gains }: { board: [string, number][]; name: (id: string) => string; me: string; gains: Record<string, number> | null }) {
  return (
    <ol className="mt-5 space-y-1.5">
      {board.map(([id, score], i) => (
        <li key={id} className={`flex items-center gap-3 rounded-xl px-3 py-2 ${id === me ? "bg-brand-soft" : "bg-surface"}`}>
          <span className="w-6 text-center font-mono text-sm font-bold text-muted">{i + 1}</span>
          <span className="min-w-0 flex-1 truncate font-medium">
            {name(id)}
            {id === me && " (bạn)"}
          </span>
          {gains?.[id] ? <span className="text-xs font-semibold text-party">+{gains[id]}</span> : null}
          <span className="font-mono font-bold tabular-nums">{score}</span>
        </li>
      ))}
    </ol>
  );
}
