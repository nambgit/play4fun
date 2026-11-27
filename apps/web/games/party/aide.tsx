"use client";

import { AIDE_ROUND_OPTIONS, AIDE_SECONDS_OPTIONS, type AiDeSettings, type AiDeView } from "@play4fun/party";
import { Award, Check, RotateCcw, Trophy } from "lucide-react";
import { Choice, HostBar, PartyRoom, nameOf, type GameProps, type SettingsProps } from "@/components/party/party-room";
import { getGame } from "@/lib/games";
import { useCountdown } from "@/lib/party-client";

const accent = getGame("ai-de-nhat")!.cover;
const CARD = "bg-gradient-to-br from-[#f59e0b] to-[#e5484d]";

export default function Play() {
  return (
    <PartyRoom
      slug="ai-de-nhat"
      title="Ai dễ… nhất?"
      emoji="🗳️"
      accent={accent}
      Settings={AiDeSettingsPanel}
      Game={AiDeGame}
      rules={
        <ol className="list-decimal space-y-1 pl-4">
          <li>
            Mỗi lượt hiện một câu như <b>“Ai dễ ngủ gật trong cuộc họp nhất?”</b>
          </li>
          <li>Mọi người bí mật bình chọn một người khác trong phòng. Phiếu ẩn danh, chỉ hiện tổng số.</li>
          <li>
            Chọn trùng người được nhiều phiếu nhất: <b>+100 điểm</b>. Người được gọi tên nhiều nhất nhận <b>danh hiệu</b> và <b>+50 điểm</b>.
          </li>
          <li>Cuối game xem ai “đọc vị” cả nhóm giỏi nhất và mỗi người nhận những danh hiệu gì!</li>
        </ol>
      }
    />
  );
}

function AiDeSettingsPanel({ value, onChange, disabled }: SettingsProps<AiDeSettings>) {
  return (
    <>
      <Choice label="Số câu" value={value.rounds} options={AIDE_ROUND_OPTIONS} format={(v) => `${v} câu`} onChange={(rounds) => onChange({ ...value, rounds })} disabled={disabled} />
      <Choice label="Thời gian" value={value.seconds} options={AIDE_SECONDS_OPTIONS} format={(v) => `${v} giây`} onChange={(seconds) => onChange({ ...value, seconds })} disabled={disabled} />
      <p className="mt-1 text-xs text-muted">Cần ít nhất 3 người. Câu hỏi vui, nhẹ nhàng, hợp cả với đồng nghiệp.</p>
    </>
  );
}

function AiDeGame({ view, api, me, isHost, players }: GameProps<AiDeView>) {
  const name = (id: string) => nameOf(players, id);
  const secs = useCountdown(view.phase === "vote" ? view.endsAt : undefined, api.now);
  const inGame = Object.keys(view.scores);
  const online = inGame.filter((id) => players.get(id)?.connected);
  const board = Object.entries(view.scores).sort((a, b) => b[1] - a[1]);

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="font-semibold">
          Câu {Math.min(view.round, view.totalRounds)}/{view.totalRounds}
        </span>
        {view.phase === "vote" && <span className={`font-mono font-bold tabular-nums ${secs <= 5 ? "text-[#e5484d]" : "text-muted"}`}>{secs}s</span>}
      </div>

      {view.phase !== "over" && (
        <>
          <div className={`rounded-2xl ${CARD} p-5 text-center text-white shadow-lift`}>
            <p className="text-xl leading-snug font-bold text-balance sm:text-2xl">{view.prompt}</p>
            <p className="mt-2 text-sm text-white/85">
              {view.phase === "vote" ? (view.myVote ? `Bạn đã chọn ${name(view.myVote)}. Có thể đổi trước khi hết giờ.` : "Chọn một người trong phòng") : "Kết quả bình chọn"}
            </p>
          </div>

          {view.phase === "vote" && (
            <>
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                {inGame
                  .filter((id) => id !== me)
                  .map((id) => {
                    const mine = view.myVote === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => api.act({ type: "aide:vote", target: id })}
                        className={`flex min-h-14 items-center gap-2 rounded-2xl border-2 px-4 py-3 text-left font-semibold shadow-card transition hover:-translate-y-0.5 active:scale-[0.98] ${
                          mine ? "border-[#e5484d] bg-[#e5484d] text-white" : "border-line bg-surface"
                        } ${players.get(id)?.connected ? "" : "opacity-50"}`}
                      >
                        <span className="min-w-0 flex-1 truncate">{name(id)}</span>
                        {mine && <Check className="h-5 w-5 shrink-0" aria-hidden="true" />}
                      </button>
                    );
                  })}
              </div>
              <p className="mt-4 text-center text-xs text-muted">
                {view.voted.length}/{online.length} người đã bình chọn
              </p>
              {isHost && (
                <p className="mt-2 text-center">
                  <button type="button" onClick={() => api.act({ type: "aide:close" })} className="text-xs text-muted underline hover:text-fg">
                    Công bố kết quả ngay
                  </button>
                </p>
              )}
            </>
          )}

          {view.phase === "reveal" && view.tally && (
            <>
              {view.winners && view.winners.length > 0 ? (
                <div className="mt-4 rounded-2xl border-2 border-[#f59e0b] bg-surface p-4 text-center">
                  <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted">
                    <Award className="h-4 w-4 text-[#f59e0b]" aria-hidden="true" />
                    Danh hiệu “{view.title}”
                  </p>
                  <p className="mt-1 text-2xl font-extrabold">{view.winners.map((id) => (id === me ? "BẠN" : name(id))).join(" & ")}</p>
                </div>
              ) : (
                <p className="mt-4 text-center text-sm text-muted">Chưa ai bình chọn ở câu này.</p>
              )}
              <Tally tally={view.tally} winners={view.winners ?? []} name={name} me={me} />
              {view.gains?.[me] ? (
                <p className="mt-4 text-center text-lg font-bold text-party">+{view.gains[me]} điểm</p>
              ) : view.myVote ? (
                <p className="mt-4 text-center text-sm text-muted">Lần này bạn chọn khác số đông!</p>
              ) : null}
              <Scoreboard board={board} name={name} me={me} gains={view.gains} />
              <HostBar isHost={isHost} waiting="Chờ chủ phòng sang câu tiếp…">
                <button type="button" onClick={() => api.act({ type: "aide:next" })} className="btn-primary px-8">
                  {view.round >= view.totalRounds ? "Xem kết quả" : "Câu tiếp theo"}
                </button>
              </HostBar>
            </>
          )}
        </>
      )}

      {view.phase === "over" && (
        <>
          <div className={`rounded-2xl ${CARD} p-6 text-center text-white shadow-lift`}>
            <Trophy className="mx-auto h-8 w-8" aria-hidden="true" />
            <p className="mt-2 text-sm text-white/85">Người đọc vị cả nhóm giỏi nhất</p>
            <p className="mt-1 text-3xl font-extrabold">{board[0] ? name(board[0][0]) : "—"}</p>
            {board[0] && <p className="mt-1 text-white/90">{board[0][1]} điểm</p>}
          </div>
          <h3 className="mt-6 mb-2 font-bold">Danh hiệu của cả nhóm</h3>
          <ul className="space-y-2">
            {board.map(([id]) => {
              const titles = view.titles[id] ?? [];
              return (
                <li key={id} className={`rounded-xl px-3 py-2.5 ${id === me ? "bg-brand-soft" : "bg-surface"}`}>
                  <p className="font-semibold">
                    {name(id)}
                    {id === me && " (bạn)"}
                  </p>
                  <p className="mt-0.5 text-sm text-muted">{titles.length ? titles.map((t) => `🏅 ${t}`).join(" · ") : "Chưa có danh hiệu: người bí ẩn nhất nhóm!"}</p>
                </li>
              );
            })}
          </ul>
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

function Tally({ tally, winners, name, me }: { tally: Record<string, number>; winners: string[]; name: (id: string) => string; me: string }) {
  const rows = Object.entries(tally).sort((a, b) => b[1] - a[1]);
  const max = Math.max(1, ...rows.map(([, n]) => n));
  return (
    <ul className="mt-4 space-y-1.5" aria-label="Số phiếu">
      {rows.map(([id, n]) => (
        <li key={id} className="flex items-center gap-3 text-sm">
          <span className="w-28 shrink-0 truncate font-medium">
            {name(id)}
            {id === me && " (bạn)"}
          </span>
          <span className="h-6 flex-1 overflow-hidden rounded-lg bg-surface-2">
            <span className={`block h-full rounded-lg ${winners.includes(id) ? "bg-[#f59e0b]" : "bg-muted/40"}`} style={{ width: `${(n / max) * 100}%` }} />
          </span>
          <span className="w-12 text-right font-mono font-bold tabular-nums">{n} phiếu</span>
        </li>
      ))}
    </ul>
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
