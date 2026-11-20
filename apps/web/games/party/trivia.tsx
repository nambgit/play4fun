"use client";

import { TRIVIA_CATEGORY_LABEL, TRIVIA_COUNT_OPTIONS, TRIVIA_SECONDS_OPTIONS, type TriviaCategory, type TriviaSettings, type TriviaView } from "@play4fun/party";
import { Check, Flame, RotateCcw, Trophy, X } from "lucide-react";
import { Choice, HostBar, PartyRoom, nameOf, type GameProps, type SettingsProps } from "@/components/party/party-room";
import { useCountdown } from "@/lib/party-client";
import { getGame } from "@/lib/games";

const accent = getGame("do-vui-team-building")!.cover;

/** Colour + shape per answer, so colour-blind players can tell them apart */
const ANSWER_STYLE = [
  { bg: "bg-[#e5484d]", shape: "▲" },
  { bg: "bg-[#1a9fe8]", shape: "◆" },
  { bg: "bg-[#f5a400]", shape: "●" },
  { bg: "bg-[#16b364]", shape: "■" },
];

const CATEGORIES: TriviaCategory[] = ["all", "chung", "vietnam", "khoahoc", "congso"];

export default function Play() {
  return (
    <PartyRoom
      slug="do-vui-team-building"
      title="Đố vui team building"
      emoji="🏆"
      accent={accent}
      Settings={TriviaSettingsPanel}
      Game={TriviaGame}
      rules={
        <ol className="list-decimal space-y-1 pl-4">
          <li>
            Chủ phòng mở trang này trên <b>máy chiếu / TV</b>, mọi người quét QR để vào bằng điện thoại.
          </li>
          <li>Mỗi câu chọn 1 trong 4 đáp án trước khi hết giờ.</li>
          <li>
            Đúng càng nhanh càng nhiều điểm, trả lời đúng <b>liên tiếp</b> được thưởng thêm.
          </li>
          <li>Đến muộn vẫn vào chơi tiếp được.</li>
        </ol>
      }
    />
  );
}

function TriviaSettingsPanel({ value, onChange, disabled }: SettingsProps<TriviaSettings>) {
  return (
    <>
      <Choice label="Số câu hỏi" value={value.count} options={TRIVIA_COUNT_OPTIONS} onChange={(count) => onChange({ ...value, count })} disabled={disabled} />
      <Choice label="Thời gian mỗi câu" value={value.seconds} options={TRIVIA_SECONDS_OPTIONS} format={(s) => `${s}s`} onChange={(seconds) => onChange({ ...value, seconds })} disabled={disabled} />
      <div className="py-1.5">
        <label htmlFor="trivia-cat" className="text-sm text-muted">
          Chủ đề
        </label>
        <select
          id="trivia-cat"
          value={value.category}
          disabled={disabled}
          onChange={(e) => onChange({ ...value, category: e.target.value as TriviaCategory })}
          className="mt-1 h-10 w-full rounded-xl border border-line bg-bg px-3 text-sm disabled:opacity-70"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {TRIVIA_CATEGORY_LABEL[c]}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

function TriviaGame({ view, api, me, isHost, players }: GameProps<TriviaView>) {
  const name = (id: string) => nameOf(players, id);
  const secs = useCountdown(view.phase === "question" ? view.endsAt : undefined, api.now);
  const q = view.question;
  const myRank = view.leaderboard.findIndex((r) => r.id === me);
  const onlinePlayers = view.leaderboard.filter((r) => players.get(r.id)?.connected).length;

  if (view.phase === "over") {
    const [first, second, third] = view.leaderboard;
    return (
      <div className="mx-auto max-w-2xl text-center">
        <Trophy className="mx-auto h-10 w-10 text-[#f5a400]" aria-hidden="true" />
        <h3 className="mt-2 text-2xl font-extrabold sm:text-3xl">Bảng vàng</h3>
        <div className="mt-6 grid grid-cols-3 items-end gap-2 sm:gap-4">
          {[second, first, third].map((r, i) =>
            r ? (
              <div key={r.id}>
                <p className="text-3xl" aria-hidden="true">
                  {["🥈", "🥇", "🥉"][i]}
                </p>
                <p className="mt-1 truncate font-bold">{name(r.id)}</p>
                <p className="font-mono text-sm text-muted">{r.score.toLocaleString("vi-VN")}</p>
                <div
                  className={`mt-2 rounded-t-xl ${["h-20 bg-[#c0c4d0]", "h-28 bg-[#f5c400]", "h-14 bg-[#d08a4e]"][i]}`}
                  aria-hidden="true"
                />
              </div>
            ) : (
              <div key={i} />
            ),
          )}
        </div>
        <Leaderboard view={view} name={name} me={me} limit={50} from={3} />
        <HostBar isHost={isHost} waiting="Chờ chủ phòng mở ván mới…">
          <button type="button" onClick={() => api.act({ type: "again" })} className="btn-primary px-8">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Chơi bộ câu hỏi mới
          </button>
        </HostBar>
      </div>
    );
  }

  if (!q) return null;
  const answered = view.myAnswer !== null;
  const reveal = view.phase === "reveal";
  const maxCount = Math.max(1, ...(view.counts ?? [1]));

  return (
    <div className="mx-auto max-w-3xl">
      {/* progress + timer */}
      <div className="flex items-center gap-3 text-sm">
        <span className="font-semibold">
          Câu {view.index + 1}/{view.total}
        </span>
        <span className="truncate text-muted">· {q.category}</span>
        <span className="ml-auto text-muted">
          {view.answered.length}/{onlinePlayers} đã trả lời
        </span>
        {!reveal && (
          <span className={`grid h-10 w-12 place-items-center rounded-xl font-mono text-lg font-bold ${secs <= 5 ? "bg-[#e5484d] text-white" : "bg-surface-2"}`}>{secs}</span>
        )}
      </div>
      {!reveal && (
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-brand transition-[width] duration-300 ease-linear"
            style={{ width: `${Math.min(100, (secs / view.seconds) * 100)}%`, backgroundImage: `linear-gradient(90deg, ${accent[0]}, ${accent[1]})` }}
          />
        </div>
      )}

      <h3 key={view.index} className="mt-5 animate-[card-in_220ms_ease-out] text-center text-xl leading-snug font-extrabold sm:text-3xl">
        {q.text}
      </h3>

      <ul className="mt-6 grid gap-2.5 sm:grid-cols-2" aria-label="Các đáp án">
        {q.options.map((opt, i) => {
          const st = ANSWER_STYLE[i];
          const mine = view.myAnswer === i;
          const isCorrect = reveal && view.correct === i;
          const dim = (reveal && !isCorrect) || (!reveal && answered && !mine);
          return (
            <li key={i}>
              <button
                type="button"
                disabled={answered || reveal}
                onClick={() => api.act({ type: "trivia:answer", index: i })}
                className={`relative flex min-h-16 w-full items-center gap-3 overflow-hidden rounded-2xl p-4 text-left text-base font-bold text-white shadow-card transition sm:min-h-20 sm:text-lg ${st.bg} ${
                  dim ? "opacity-35" : ""
                } ${mine ? "ring-4 ring-fg/70 ring-offset-2 ring-offset-bg" : ""} ${!answered && !reveal ? "hover:-translate-y-0.5 hover:shadow-lift active:scale-[0.98]" : ""}`}
              >
                <span className="text-xl" aria-hidden="true">
                  {st.shape}
                </span>
                <span className="relative flex-1">{opt}</span>
                {isCorrect && <Check className="relative h-6 w-6 shrink-0" aria-label="Đáp án đúng" />}
                {reveal && view.counts && (
                  <>
                    <span className="absolute inset-y-0 left-0 bg-black/15" style={{ width: `${(view.counts[i] / maxCount) * 100}%` }} aria-hidden="true" />
                    <span className="relative font-mono text-sm">{view.counts[i]}</span>
                  </>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {/* my status */}
      <div className="mt-5 text-center">
        {!reveal && answered && <p className="inline-flex items-center gap-2 rounded-full bg-surface-2 px-4 py-2 text-sm font-semibold">Đã chốt đáp án! Chờ mọi người…</p>}
        {reveal &&
          (view.myGain === null ? null : view.myGain > 0 ? (
            <p className="inline-flex items-center gap-2 rounded-full bg-party px-5 py-2 text-base font-bold text-white">
              <Check className="h-5 w-5" aria-hidden="true" /> Chính xác! +{view.myGain}
              {(view.leaderboard[myRank]?.streak ?? 0) >= 2 && (
                <span className="inline-flex items-center gap-0.5 text-sm">
                  <Flame className="h-4 w-4" aria-hidden="true" />×{view.leaderboard[myRank].streak}
                </span>
              )}
            </p>
          ) : (
            <p className="inline-flex items-center gap-2 rounded-full bg-[#e5484d] px-5 py-2 text-base font-bold text-white">
              <X className="h-5 w-5" aria-hidden="true" /> {view.myAnswer === null ? "Hết giờ mất rồi!" : "Sai rồi!"}
            </p>
          ))}
      </div>

      {reveal && <Leaderboard view={view} name={name} me={me} limit={5} from={0} />}

      <HostBar isHost={isHost} waiting={reveal ? "Chờ chủ phòng chuyển câu…" : "Chọn nhanh để được nhiều điểm!"}>
        {reveal ? (
          <button type="button" onClick={() => api.act({ type: "trivia:next" })} className="btn-primary px-8">
            {view.index + 1 >= view.total ? "Xem bảng vàng" : "Câu tiếp theo"}
          </button>
        ) : (
          <button type="button" onClick={() => api.act({ type: "trivia:close" })} className="btn-ghost px-6 text-sm">
            Đóng câu hỏi ngay
          </button>
        )}
      </HostBar>
    </div>
  );
}

function Leaderboard({ view, name, me, limit, from }: { view: TriviaView; name: (id: string) => string; me: string; limit: number; from: number }) {
  const rows = view.leaderboard.slice(from, from + limit);
  const myRank = view.leaderboard.findIndex((r) => r.id === me);
  if (rows.length === 0) return null;
  return (
    <div className="mx-auto mt-5 max-w-md text-left">
      <ol className="space-y-1.5">
        {rows.map((r, i) => (
          <li key={r.id} className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-sm ${r.id === me ? "border-brand/40 bg-brand-soft" : "border-line bg-surface"}`}>
            <span className="w-6 text-center font-mono text-xs text-muted">{from + i + 1}</span>
            <span className="min-w-0 flex-1 truncate font-semibold">{name(r.id)}</span>
            {r.streak >= 2 && (
              <span className="inline-flex items-center text-xs font-bold text-arcade">
                <Flame className="h-3.5 w-3.5" aria-hidden="true" />
                {r.streak}
              </span>
            )}
            <span className="font-mono font-bold tabular-nums">{r.score.toLocaleString("vi-VN")}</span>
          </li>
        ))}
      </ol>
      {myRank >= from + limit && (
        <p className="mt-2 text-center text-xs text-muted">
          Bạn đang xếp hạng {myRank + 1}/{view.leaderboard.length} với {view.leaderboard[myRank].score.toLocaleString("vi-VN")} điểm
        </p>
      )}
    </div>
  );
}
