"use client";

import { maxWolves, WOLF_TALK_OPTIONS, type WolfRole, type WolfSettings, type WolfView } from "@play4fun/party";
import { Check, Eye, EyeOff, Moon, RotateCcw, Skull, Sun, Trophy, Vote } from "lucide-react";
import { useEffect, useState } from "react";
import { Choice, HostBar, PartyRoom, nameOf, type GameProps, type SettingsProps } from "@/components/party/party-room";
import { getGame } from "@/lib/games";
import { useCountdown } from "@/lib/party-client";

const accent = getGame("ma-soi")!.cover;

const ROLE: Record<WolfRole, { name: string; emoji: string; tone: string; goal: string; night: string }> = {
  wolf: { name: "Ma sói", emoji: "🐺", tone: "text-[#e5484d]", goal: "Cùng bầy sói ăn thịt dân làng mà không bị lộ.", night: "Chọn người bầy sói sẽ tấn công đêm nay" },
  seer: { name: "Tiên tri", emoji: "🔮", tone: "text-[#8b5cf6]", goal: "Mỗi đêm soi một người để biết họ có phải sói không.", night: "Chọn người muốn soi" },
  guard: { name: "Bảo vệ", emoji: "🛡️", tone: "text-quiz", goal: "Mỗi đêm che chở một người khỏi sói (không chọn cùng một người 2 đêm liền).", night: "Chọn người muốn bảo vệ đêm nay" },
  villager: { name: "Dân làng", emoji: "🧑‍🌾", tone: "text-party", goal: "Thảo luận, tìm ra sói và treo cổ chúng vào ban ngày.", night: "" },
};

export default function Play() {
  return (
    <PartyRoom
      slug="ma-soi"
      title="Ma sói"
      emoji="🐺"
      accent={accent}
      Settings={WolfSettingsPanel}
      Game={WolfGame}
      rules={
        <ol className="list-decimal space-y-1 pl-4">
          <li>
            Mỗi người nhận một <b>vai bí mật</b>: Ma sói, Tiên tri, Bảo vệ hoặc Dân làng. Máy làm quản trò.
          </li>
          <li>
            <b>Ban đêm</b>: sói chọn nạn nhân, Tiên tri soi một người, Bảo vệ che chở một người. Ai cũng cầm máy để không lộ vai.
          </li>
          <li>
            <b>Ban ngày</b>: công bố người chết, cả nhóm thảo luận rồi bỏ phiếu treo cổ người đáng ngờ nhất.
          </li>
          <li>Dân thắng khi diệt hết sói; sói thắng khi số sói bằng số người còn lại.</li>
        </ol>
      }
    />
  );
}

function WolfSettingsPanel({ value, onChange, disabled, playerCount }: SettingsProps<WolfSettings>) {
  const max = maxWolves(Math.max(5, playerCount));
  return (
    <>
      <Choice
        label="Số sói"
        value={Math.min(value.wolves, max)}
        options={Array.from({ length: max }, (_, i) => i + 1)}
        onChange={(wolves) => onChange({ ...value, wolves })}
        disabled={disabled}
      />
      <Choice label="Tiên tri" value={value.seer ? 1 : 0} options={[1, 0]} format={(v) => (v ? "Có" : "Không")} onChange={(v) => onChange({ ...value, seer: v === 1 })} disabled={disabled} />
      <Choice label="Bảo vệ" value={value.guard ? 1 : 0} options={[1, 0]} format={(v) => (v ? "Có" : "Không")} onChange={(v) => onChange({ ...value, guard: v === 1 })} disabled={disabled} />
      <Choice
        label="Thảo luận"
        value={value.talkSeconds}
        options={WOLF_TALK_OPTIONS}
        format={(v) => `${v / 60} phút`}
        onChange={(talkSeconds) => onChange({ ...value, talkSeconds })}
        disabled={disabled}
      />
      <p className="mt-1 text-xs text-muted">Cần ít nhất 5 người. Từ 8 người có thể chơi 2 sói, từ 12 người 3 sói.</p>
    </>
  );
}

function RoleCard({ view, name }: { view: WolfView; name: (id: string) => string }) {
  const [shown, setShown] = useState(false);
  if (!view.myRole) return null;
  const r = ROLE[view.myRole];
  const mates = view.pack ?? [];
  return (
    <button
      type="button"
      onClick={() => setShown((s) => !s)}
      className="w-full rounded-2xl border-2 border-dashed border-line bg-surface p-5 text-center transition hover:border-brand/40"
      aria-pressed={shown}
    >
      <p className="text-xs font-semibold tracking-wider text-muted uppercase">Vai của bạn</p>
      {shown ? (
        <>
          <p className="mt-2 text-4xl" aria-hidden="true">
            {r.emoji}
          </p>
          <p className={`mt-1 text-2xl font-extrabold ${r.tone}`}>{r.name}</p>
          <p className="mx-auto mt-1 max-w-xs text-sm text-muted">{r.goal}</p>
          {view.myRole === "wolf" && mates.length > 1 && <p className="mt-2 text-sm font-semibold">Đồng bọn: {mates.map(name).join(", ")}</p>}
        </>
      ) : (
        <p className="mt-2 text-3xl font-extrabold tracking-[0.3em] text-muted/50" aria-hidden="true">
          • • • •
        </p>
      )}
      <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted">
        {shown ? <EyeOff className="h-3.5 w-3.5" aria-hidden="true" /> : <Eye className="h-3.5 w-3.5" aria-hidden="true" />}
        {shown ? "Chạm để che lại" : "Chạm để xem (che màn hình nhé!)"}
      </p>
    </button>
  );
}

function PlayerPicker({ ids, picked, onPick, name, me, tone = "bg-[#e5484d]", note }: { ids: string[]; picked: string | null; onPick: (id: string) => void; name: (id: string) => string; me: string; tone?: string; note?: (id: string) => string | null }) {
  return (
    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
      {ids.map((id) => (
        <li key={id}>
          <button
            type="button"
            onClick={() => onPick(id)}
            className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left font-medium transition ${picked === id ? `border-transparent ${tone} text-white shadow-lift` : "border-line bg-surface text-fg hover:border-fg/20"}`}
          >
            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${picked === id ? "bg-white/25" : "bg-surface-2"}`}>
              {picked === id ? <Check className="h-4 w-4" /> : name(id).slice(0, 1).toUpperCase()}
            </span>
            <span className="min-w-0 flex-1 truncate">
              {name(id)}
              {id === me && " (bạn)"}
            </span>
            {note?.(id) && <span className={`text-xs ${picked === id ? "text-white/85" : "text-muted"}`}>{note(id)}</span>}
          </button>
        </li>
      ))}
    </ul>
  );
}

function WolfGame({ view, api, me, isHost, players }: GameProps<WolfView>) {
  const name = (id: string) => nameOf(players, id);
  const secs = useCountdown(view.endsAt || undefined, api.now);
  const online = (id: string) => !!players.get(id)?.connected;
  const [pick, setPick] = useState<string | null>(view.myNightPick ?? view.myVote);
  useEffect(() => setPick(view.phase === "night" ? view.myNightPick : view.myVote), [view.phase, view.day, view.myNightPick, view.myVote]);
  const role = view.myRole;
  const night = view.phase === "night" || view.phase === "reveal";

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="inline-flex items-center gap-1.5 font-semibold">
          {night ? <Moon className="h-4 w-4 text-[#8b5cf6]" aria-hidden="true" /> : <Sun className="h-4 w-4 text-[#f5a400]" aria-hidden="true" />}
          {view.phase === "reveal" ? "Nhận vai" : view.phase === "night" ? `Đêm ${view.day + 1}` : `Ngày ${view.day}`}
        </span>
        <span className="text-muted">
          🐺 {view.roleCounts.wolf} sói · còn {view.alive.length} người{secs > 0 ? ` · ${secs}s` : ""}
        </span>
      </div>

      {/* ---------------- reveal ---------------- */}
      {view.phase === "reveal" && (
        <>
          <RoleCard view={view} name={name} />
          <div className="mt-4 text-center">
            {view.ready.includes(me) ? (
              <p className="inline-flex items-center gap-1.5 rounded-full bg-party-soft px-4 py-2 text-sm font-semibold text-party">
                <Check className="h-4 w-4" aria-hidden="true" /> Đã sẵn sàng
              </p>
            ) : (
              <button type="button" onClick={() => api.act({ type: "wolf:ready" })} className="btn-primary px-8">
                Tôi đã xem vai
              </button>
            )}
            <p className="mt-2 text-xs text-muted">
              {view.ready.length}/{view.alive.filter(online).length} người sẵn sàng
            </p>
          </div>
          {isHost && (
            <p className="mt-2 text-center">
              <button type="button" onClick={() => api.act({ type: "wolf:next" })} className="text-xs text-muted underline hover:text-fg">
                Không chờ nữa, vào đêm đầu tiên
              </button>
            </p>
          )}
        </>
      )}

      {/* ---------------- night ---------------- */}
      {view.phase === "night" && (
        <div className="rounded-3xl bg-[#14112b] p-5 text-white shadow-lift">
          <p className="text-center text-sm text-white/70">Màn đêm buông xuống… Mọi người cúi mặt vào điện thoại.</p>
          {!view.amAlive ? (
            <p className="mt-4 text-center text-white/80">Bạn đã chết. Hãy giữ im lặng nhé 👻</p>
          ) : role === "villager" ? (
            <div className="mt-4 text-center">
              <p className="text-4xl" aria-hidden="true">
                😴
              </p>
              <p className="mt-2 font-semibold">Dân làng đang ngủ</p>
              <p className="mt-1 text-sm text-white/70">Chờ trời sáng. Đừng nhìn màn hình người khác!</p>
            </div>
          ) : role ? (
            <>
              <p className="mt-3 text-center text-lg font-bold">
                {ROLE[role].emoji} {ROLE[role].night}
              </p>
              {role === "wolf" && view.pack && view.pack.length > 1 && (
                <p className="mt-1 text-center text-xs text-white/70">
                  Bầy sói: {view.pack.map(name).join(", ")}. Chọn trùng nhau thì chắc chắn hơn; nếu khác nhau máy chọn người được nhiều sói chọn nhất.
                </p>
              )}
              <div>
                <PlayerPicker
                  ids={view.alive.filter((id) => (role === "wolf" ? !view.pack?.includes(id) : role === "seer" ? id !== me : id !== view.guardLast))}
                  picked={pick}
                  name={name}
                  me={me}
                  tone={role === "wolf" ? "bg-[#e5484d]" : role === "seer" ? "bg-[#8b5cf6]" : "bg-quiz"}
                  note={(id) => {
                    if (role === "wolf" && view.packPicks) {
                      const n = Object.entries(view.packPicks).filter(([w, t]) => t === id && w !== me).length;
                      return n ? `${n} sói chọn` : null;
                    }
                    if (role === "seer") {
                      const seen = view.seerLog?.find((l) => l.id === id);
                      return seen ? (seen.wolf ? "🐺 Sói" : "🙂 Không phải sói") : null;
                    }
                    return null;
                  }}
                  onPick={(id) => {
                    setPick(id);
                    api.act({ type: "wolf:pick", target: id });
                  }}
                />
              </div>
              {role === "guard" && view.guardLast && <p className="mt-2 text-center text-xs text-white/70">Đêm qua bạn đã bảo vệ {name(view.guardLast)}, đêm nay phải chọn người khác.</p>}
              {pick && <p className="mt-3 text-center text-sm text-white/80">Đã chọn {name(pick)}. Có thể đổi đến khi trời sáng.</p>}
            </>
          ) : null}
          {role === "seer" && view.seerLog && view.seerLog.length > 0 && (
            <p className="mt-4 text-center text-xs text-white/70">
              Đã soi: {view.seerLog.map((l) => `${name(l.id)} ${l.wolf ? "🐺" : "🙂"}`).join(" · ")}
            </p>
          )}
          <p className="mt-4 text-center text-xs text-white/60">Trời sáng khi mọi vai đã chọn xong, hoặc sau {secs}s.</p>
        </div>
      )}

      {/* ---------------- dawn ---------------- */}
      {view.phase === "dawn" && (
        <>
          <div className={`rounded-2xl p-6 text-center ${view.died ? "bg-[#e5484d]/10" : "bg-party-soft"}`}>
            <p className="text-4xl" aria-hidden="true">
              {view.died ? "☠️" : "🌅"}
            </p>
            <p className="mt-2 text-xl font-bold">{view.died ? `Đêm qua, ${name(view.died)} đã bị sói cắn chết.` : "Một đêm bình yên, không ai chết!"}</p>
            {view.died === me && <p className="mt-1 text-sm text-muted">Bạn đã chết. Bạn vẫn xem được nhưng đừng tiết lộ vai của mình nhé.</p>}
          </div>
          <HostBar isHost={isHost} waiting="Sắp vào phần thảo luận…">
            <button type="button" onClick={() => api.act({ type: "wolf:next" })} className="btn-primary px-8">
              <Sun className="h-4 w-4" aria-hidden="true" />
              Bắt đầu thảo luận
            </button>
          </HostBar>
        </>
      )}

      {/* ---------------- day ---------------- */}
      {view.phase === "day" && (
        <>
          <div className="rounded-2xl border border-line bg-surface p-5 text-center">
            <p className="font-mono text-5xl font-extrabold tabular-nums">
              {Math.floor(secs / 60)}:{String(secs % 60).padStart(2, "0")}
            </p>
            <p className="mt-2 font-semibold">Thảo luận: ai là sói?</p>
            <p className="mt-1 text-sm text-muted">Nói chuyện trực tiếp hoặc qua cuộc gọi. Hết giờ sẽ bỏ phiếu.</p>
          </div>
          <ul className="mt-4 flex flex-wrap justify-center gap-2">
            {view.alive.map((id) => (
              <li key={id} className={`rounded-full px-3 py-1 text-sm ${id === me ? "bg-brand-soft font-semibold text-brand" : "bg-surface-2"}`}>
                {name(id)}
              </li>
            ))}
          </ul>
          {view.amAlive && (
            <div className="mt-4">
              <RoleCard view={view} name={name} />
            </div>
          )}
          <HostBar isHost={isHost} waiting="Hết giờ thảo luận sẽ chuyển sang bỏ phiếu.">
            <button type="button" onClick={() => api.act({ type: "wolf:startVote" })} className="btn-primary px-8">
              <Vote className="h-4 w-4" aria-hidden="true" />
              Bỏ phiếu ngay
            </button>
          </HostBar>
        </>
      )}

      {/* ---------------- vote ---------------- */}
      {view.phase === "vote" && (
        <>
          {view.amAlive ? (
            <>
              <h3 className="text-center text-lg font-bold">Treo cổ ai?</h3>
              <p className="mt-1 text-center text-sm text-muted">Chọn người bạn nghi là sói. Có thể đổi phiếu đến khi hết giờ.</p>
              <PlayerPicker
                ids={view.alive.filter((id) => id !== me)}
                picked={pick}
                name={name}
                me={me}
                onPick={(id) => {
                  setPick(id);
                  api.act({ type: "wolf:vote", target: id });
                }}
              />
            </>
          ) : (
            <Dead />
          )}
          <p className="mt-4 text-center text-xs text-muted">
            {view.voted.length}/{view.alive.filter(online).length} người đã bỏ phiếu
          </p>
          {isHost && (
            <p className="mt-2 text-center">
              <button type="button" onClick={() => api.act({ type: "wolf:endVote" })} className="text-xs text-muted underline hover:text-fg">
                Kết thúc bỏ phiếu ngay
              </button>
            </p>
          )}
        </>
      )}

      {/* ---------------- result ---------------- */}
      {view.phase === "result" && (
        <>
          <Lynch view={view} name={name} />
          <Tally view={view} name={name} />
          <HostBar isHost={isHost} waiting="Chờ chủ phòng gọi màn đêm…">
            <button type="button" onClick={() => api.act({ type: "wolf:next" })} className="btn-primary px-8">
              <Moon className="h-4 w-4" aria-hidden="true" />
              Đêm tiếp theo
            </button>
          </HostBar>
        </>
      )}

      {/* ---------------- over ---------------- */}
      {view.phase === "over" && (
        <>
          {view.lastOut && <Lynch view={view} name={name} />}
          {!view.lastOut && view.died && <p className="mb-3 text-center text-sm text-muted">Đêm cuối, {name(view.died)} bị sói cắn chết.</p>}
          <div className={`mt-4 rounded-2xl p-6 text-center text-white shadow-lift ${view.winner === "village" ? "bg-gradient-to-br from-[#16b364] to-[#0ea5e9]" : "bg-gradient-to-br from-[#e5484d] to-[#3b1d6e]"}`}>
            <Trophy className="mx-auto h-8 w-8" aria-hidden="true" />
            <p className="mt-2 text-2xl font-extrabold">{view.winner === "village" ? "Dân làng chiến thắng!" : "Bầy sói chiến thắng!"}</p>
          </div>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {view.reveal?.map((r) => (
              <li key={r.id} className={`flex items-center gap-3 rounded-xl border px-3 py-2 ${r.role === "wolf" ? "border-[#e5484d]/40 bg-[#e5484d]/10" : "border-line bg-surface"} ${r.alive ? "" : "opacity-60"}`}>
                <span aria-hidden="true">{ROLE[r.role].emoji}</span>
                <span className="min-w-0 flex-1 truncate font-medium">
                  {name(r.id)}
                  {r.id === me && " (bạn)"}
                </span>
                <span className="text-sm text-muted">
                  {ROLE[r.role].name}
                  {!r.alive && " · đã chết"}
                </span>
              </li>
            ))}
          </ul>
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

function Lynch({ view, name }: { view: WolfView; name: (id: string) => string }) {
  if (view.tie) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-5 text-center">
        <p className="text-2xl" aria-hidden="true">
          ⚖️
        </p>
        <p className="mt-1 text-lg font-bold">Hòa phiếu! Không ai bị treo cổ.</p>
      </div>
    );
  }
  if (!view.lastOut) return null;
  const wolf = view.lastOut.role === "wolf";
  return (
    <div className={`rounded-2xl p-5 text-center ${wolf ? "bg-party-soft" : "bg-[#e5484d]/10"}`}>
      <p className="text-3xl" aria-hidden="true">
        {wolf ? "🎯" : "😱"}
      </p>
      <p className="mt-1 text-lg font-bold">
        {name(view.lastOut.id)} bị treo cổ và là… {ROLE[view.lastOut.role].name.toUpperCase()} {ROLE[view.lastOut.role].emoji}
      </p>
    </div>
  );
}

function Tally({ view, name }: { view: WolfView; name: (id: string) => string }) {
  if (!view.tally?.length) return null;
  const max = Math.max(...view.tally.map((t) => t.votes));
  return (
    <ul className="mt-4 space-y-1.5">
      {view.tally.map((t) => (
        <li key={t.id} className="flex items-center gap-3 text-sm">
          <span className="w-28 truncate">{name(t.id)}</span>
          <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-2">
            <span className="block h-full rounded-full bg-[#e5484d]" style={{ width: `${(t.votes / max) * 100}%` }} />
          </span>
          <span className="w-12 text-right font-mono">{t.votes} phiếu</span>
        </li>
      ))}
    </ul>
  );
}

function Dead() {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 text-center">
      <Skull className="mx-auto h-7 w-7 text-muted" aria-hidden="true" />
      <p className="mt-2 font-semibold">Bạn đã chết</p>
      <p className="mt-1 text-sm text-muted">Hồn ma không được bỏ phiếu. Đừng tiết lộ gì nhé!</p>
    </div>
  );
}

