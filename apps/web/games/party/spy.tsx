"use client";

import { maxSpies, type SpySettings, type SpyView } from "@play4fun/party";
import { Check, Eye, EyeOff, Megaphone, RotateCcw, Skull, Trophy, Vote } from "lucide-react";
import { useEffect, useState } from "react";
import { Choice, HostBar, PartyRoom, nameOf, type GameProps, type SettingsProps } from "@/components/party/party-room";
import { getGame } from "@/lib/games";

const accent = getGame("ai-la-gian-diep")!.cover;

export default function Play() {
  return (
    <PartyRoom
      slug="ai-la-gian-diep"
      title="Ai là gián điệp?"
      emoji="🕵️"
      accent={accent}
      Settings={SpySettingsPanel}
      Game={SpyGame}
      rules={
        <ol className="list-decimal space-y-1 pl-4">
          <li>
            Mỗi người nhận một <b>từ khóa bí mật</b>. Dân thường cùng một từ, <b>gián điệp</b> nhận từ hơi khác và không biết mình là gián điệp.
          </li>
          <li>Lần lượt mô tả từ của mình bằng một câu, đừng nói thẳng từ đó ra.</li>
          <li>Bỏ phiếu trên điện thoại để loại người đáng ngờ nhất.</li>
          <li>
            Dân thắng khi loại hết gián điệp; gián điệp thắng khi còn <b>bằng số dân</b>.
          </li>
        </ol>
      }
    />
  );
}

function SpySettingsPanel({ value, onChange, disabled, playerCount }: SettingsProps<SpySettings>) {
  const max = maxSpies(Math.max(3, playerCount));
  const options = Array.from({ length: max }, (_, i) => i + 1);
  return (
    <>
      <Choice label="Số gián điệp" value={Math.min(value.spies, max)} options={options} onChange={(spies) => onChange({ ...value, spies })} disabled={disabled} />
      <Choice
        label="Gián điệp"
        value={value.blankSpy ? 1 : 0}
        options={[0, 1]}
        format={(v) => (v ? "Không có từ" : "Có từ na ná")}
        onChange={(v) => onChange({ ...value, blankSpy: v === 1 })}
        disabled={disabled}
      />
      <p className="mt-1 text-xs text-muted">
        {value.blankSpy ? "Gián điệp biết mình là gián điệp nhưng không có từ khóa, phải nghe để đoán." : "Gián điệp có từ na ná và không biết mình là gián điệp. Khó đoán hơn!"}
      </p>
      {playerCount >= 4 && max < 3 && <p className="mt-1 text-xs text-muted">Thêm người chơi để mở thêm gián điệp.</p>}
    </>
  );
}

function SecretWord({ view }: { view: SpyView }) {
  const [shown, setShown] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setShown((s) => !s)}
      className="w-full rounded-2xl border-2 border-dashed border-line bg-surface p-5 text-center transition hover:border-brand/40"
      aria-pressed={shown}
    >
      <p className="text-xs font-semibold tracking-wider text-muted uppercase">Từ khóa của bạn</p>
      {shown ? (
        view.iKnowImSpy ? (
          <p className="mt-2 text-2xl font-extrabold text-[#e5484d]">Bạn là GIÁN ĐIỆP 🕵️</p>
        ) : (
          <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{view.myWord}</p>
        )
      ) : (
        <p className="mt-2 text-3xl font-extrabold tracking-[0.3em] text-muted/50" aria-hidden="true">
          • • • •
        </p>
      )}
      {shown && view.iKnowImSpy && <p className="mt-1 text-sm text-muted">Bạn không có từ khóa. Hãy nghe mọi người mô tả và giả vờ thật khéo!</p>}
      <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted">
        {shown ? <EyeOff className="h-3.5 w-3.5" aria-hidden="true" /> : <Eye className="h-3.5 w-3.5" aria-hidden="true" />}
        {shown ? "Chạm để che lại" : "Chạm để xem (che màn hình khỏi người bên cạnh nhé!)"}
      </p>
    </button>
  );
}

function SpyGame({ view, api, me, isHost, players }: GameProps<SpyView>) {
  const name = (id: string) => nameOf(players, id);
  const connectedAlive = view.alive.filter((id) => players.get(id)?.connected);

  // Reset local selection when a new vote starts
  const [pick, setPick] = useState<string | null>(view.myVote);
  useEffect(() => setPick(view.myVote), [view.myVote, view.phase]);

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="font-semibold">{view.round > 0 ? `Vòng ${view.round}` : "Chuẩn bị"}</span>
        <span className="text-muted">
          {view.spies} gián điệp · còn {view.alive.length} người
        </span>
      </div>

      {/* ---------------- reveal ---------------- */}
      {view.phase === "reveal" && (
        <>
          <SecretWord view={view} />
          <p className="mt-4 text-center text-sm text-muted">Nhớ từ khóa rồi bấm sẵn sàng. Đừng để ai nhìn thấy màn hình của bạn!</p>
          <div className="mt-4 text-center">
            {view.ready.includes(me) ? (
              <p className="inline-flex items-center gap-1.5 rounded-full bg-party-soft px-4 py-2 text-sm font-semibold text-party">
                <Check className="h-4 w-4" aria-hidden="true" /> Đã sẵn sàng
              </p>
            ) : (
              <button type="button" onClick={() => api.act({ type: "spy:ready" })} className="btn-primary px-8">
                Tôi đã nhớ từ
              </button>
            )}
            <p className="mt-2 text-xs text-muted">
              {view.ready.length}/{connectedAlive.length} người sẵn sàng
            </p>
          </div>
          {isHost && (
            <div className="mt-2 text-center">
              <button type="button" onClick={() => api.act({ type: "spy:next" })} className="text-xs text-muted underline hover:text-fg">
                Không chờ nữa, bắt đầu luôn
              </button>
            </div>
          )}
        </>
      )}

      {/* ---------------- describe ---------------- */}
      {view.phase === "describe" && (
        <>
          <div className="rounded-2xl border border-line bg-surface p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Megaphone className="h-4 w-4 text-brand" aria-hidden="true" />
              Lần lượt mô tả từ khóa bằng một câu
            </h3>
            <ol className="mt-3 grid gap-2 sm:grid-cols-2">
              {view.order.map((id, i) => (
                <li key={id} className={`flex items-center gap-3 rounded-xl px-3 py-2 ${id === me ? "bg-brand-soft" : "bg-surface-2"}`}>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-surface font-mono text-sm font-bold">{i + 1}</span>
                  <span className="truncate font-medium">
                    {name(id)}
                    {id === me && " (bạn)"}
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-xs text-muted">Mẹo: đừng quá rõ để gián điệp không đoán được, cũng đừng quá mơ hồ kẻo bị nghi oan.</p>
          </div>
          {view.amAlive && (
            <div className="mt-4">
              <SecretWord view={view} />
            </div>
          )}
          <HostBar isHost={isHost} waiting="Mọi người mô tả xong, chủ phòng sẽ mở bỏ phiếu.">
            <button type="button" onClick={() => api.act({ type: "spy:startVote" })} className="btn-primary px-8">
              <Vote className="h-4 w-4" aria-hidden="true" />
              Mọi người đã mô tả xong, bỏ phiếu!
            </button>
          </HostBar>
        </>
      )}

      {/* ---------------- vote ---------------- */}
      {view.phase === "vote" && (
        <>
          {view.amAlive ? (
            <>
              <h3 className="text-center text-lg font-bold">Ai là gián điệp?</h3>
              <p className="mt-1 text-center text-sm text-muted">Chọn người bạn nghi ngờ nhất. Có thể đổi phiếu đến khi kết thúc.</p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {view.alive
                  .filter((id) => id !== me)
                  .map((id) => (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => {
                          setPick(id);
                          api.act({ type: "spy:vote", target: id });
                        }}
                        className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left font-medium transition ${
                          pick === id ? "border-transparent bg-[#e5484d] text-white shadow-lift" : "border-line bg-surface hover:border-fg/20"
                        }`}
                      >
                        <span className={`grid h-8 w-8 place-items-center rounded-full ${pick === id ? "bg-white/25" : "bg-surface-2"}`}>
                          {pick === id ? <Check className="h-4 w-4" /> : name(id).slice(0, 1).toUpperCase()}
                        </span>
                        <span className="truncate">{name(id)}</span>
                      </button>
                    </li>
                  ))}
              </ul>
            </>
          ) : (
            <Eliminated />
          )}
          <p className="mt-4 text-center text-xs text-muted">
            {view.voted.length}/{connectedAlive.length} người đã bỏ phiếu
          </p>
          {isHost && (
            <div className="mt-2 text-center">
              <button type="button" onClick={() => api.act({ type: "spy:endVote" })} className="text-xs text-muted underline hover:text-fg">
                Kết thúc bỏ phiếu ngay
              </button>
            </div>
          )}
        </>
      )}

      {/* ---------------- result ---------------- */}
      {view.phase === "result" && (
        <>
          <Outcome view={view} name={name} />
          <Tally view={view} name={name} />
          <HostBar isHost={isHost} waiting="Chờ chủ phòng mở vòng tiếp theo…">
            <button type="button" onClick={() => api.act({ type: "spy:next" })} className="btn-primary px-8">
              Vòng tiếp theo
            </button>
          </HostBar>
        </>
      )}

      {/* ---------------- over ---------------- */}
      {view.phase === "over" && (
        <>
          {view.lastOut && <Outcome view={view} name={name} />}
          <div
            className={`mt-4 rounded-2xl p-6 text-center text-white shadow-lift ${view.winner === "civilians" ? "bg-gradient-to-br from-[#16b364] to-[#0ea5e9]" : "bg-gradient-to-br from-[#e5484d] to-[#6b3cf5]"}`}
          >
            <Trophy className="mx-auto h-8 w-8" aria-hidden="true" />
            <p className="mt-2 text-2xl font-extrabold">{view.winner === "civilians" ? "Dân thường chiến thắng!" : "Gián điệp chiến thắng!"}</p>
            <p className="mt-2 text-sm text-white/90">
              Từ của dân: <b>{view.civilianWord}</b> · Từ của gián điệp: <b>{view.spyWord}</b>
            </p>
          </div>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {view.reveal?.map((r) => (
              <li key={r.id} className={`flex items-center gap-3 rounded-xl border px-3 py-2 ${r.spy ? "border-[#e5484d]/40 bg-[#e5484d]/10" : "border-line bg-surface"}`}>
                <span aria-hidden="true">{r.spy ? "🕵️" : "🙂"}</span>
                <span className="min-w-0 flex-1 truncate font-medium">
                  {name(r.id)}
                  {r.id === me && " (bạn)"}
                </span>
                <span className="text-sm text-muted">{r.word ?? "(không có từ)"}</span>
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

function Outcome({ view, name }: { view: SpyView; name: (id: string) => string }) {
  if (view.tie) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-5 text-center">
        <p className="text-2xl">⚖️</p>
        <p className="mt-1 text-lg font-bold">Hòa phiếu! Không ai bị loại.</p>
        <p className="mt-1 text-sm text-muted">Mô tả thêm một vòng nữa để lộ diện gián điệp.</p>
      </div>
    );
  }
  if (!view.lastOut) return null;
  return (
    <div className={`rounded-2xl p-5 text-center ${view.lastOut.wasSpy ? "bg-party-soft" : "bg-[#e5484d]/10"}`}>
      <p className="text-3xl" aria-hidden="true">
        {view.lastOut.wasSpy ? "🎯" : "😱"}
      </p>
      <p className="mt-1 text-lg font-bold">
        {name(view.lastOut.id)} bị loại và là… {view.lastOut.wasSpy ? "GIÁN ĐIỆP!" : "dân thường!"}
      </p>
      {!view.lastOut.wasSpy && view.phase === "result" && <p className="mt-1 text-sm text-muted">Gián điệp vẫn đang ẩn mình. Cẩn thận!</p>}
    </div>
  );
}

function Tally({ view, name }: { view: SpyView; name: (id: string) => string }) {
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

function Eliminated() {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 text-center">
      <Skull className="mx-auto h-7 w-7 text-muted" aria-hidden="true" />
      <p className="mt-2 font-semibold">Bạn đã bị loại</p>
      <p className="mt-1 text-sm text-muted">Ngồi xem mọi người tìm gián điệp nhé, đừng tiết lộ gì!</p>
    </div>
  );
}
