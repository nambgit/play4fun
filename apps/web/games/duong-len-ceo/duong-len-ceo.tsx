"use client";

import { Award, BarChart3, Briefcase, CalendarDays, Coffee, Rocket, Sparkles, TrendingUp, Users, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ShareButton, useShare } from "@/components/game-kit";
import { gameEnd, gameStart } from "@/lib/analytics";
import { PROGRESS_EVENT } from "@/lib/progress-sync";
import { CEO_KEY } from "@/lib/progress-keys";
import { ACHIEVEMENTS, NEWS, RANKS, STAFF, WEEKDAYS, WEEKDAY_NOTE } from "./content";
import * as E from "./engine";

const TICK_MS = 100;
const SAVE_EVERY_MS = 10_000;
type Tab = "staff" | "shop" | "awards" | "career";
type Toast = { id: number; text: string; tone: "good" | "info" };
type Float = { id: number; x: number; y: number; text: string };

function load(): E.State {
  try {
    return E.deserialize(localStorage.getItem(E.SAVE_KEY));
  } catch {
    return E.createState();
  }
}
function save(s: E.State) {
  try {
    localStorage.setItem(E.SAVE_KEY, E.serialize(s));
  } catch {
    /* storage blocked: progress lasts for this tab only */
  }
}

export default function DuongLenCeo() {
  const stateRef = useRef<E.State | null>(null);
  const [, setFrame] = useState(0);
  const rerender = useCallback(() => setFrame((n) => n + 1), []);
  const [tab, setTab] = useState<Tab>("staff");
  const [buyN, setBuyN] = useState<1 | 10 | "max">(1);
  const [intro, setIntro] = useState(false);
  const [offline, setOffline] = useState<{ seconds: number; amount: number } | null>(null);
  const [rankUp, setRankUp] = useState<number | null>(null);
  const [result, setResult] = useState<E.Resolved | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [floats, setFloats] = useState<Float[]>([]);
  const [newsIdx, setNewsIdx] = useState(0);
  const started = useRef(false);
  const seq = useRef(0);
  const { share, copied } = useShare("Đường lên CEO");

  const toast = useCallback((text: string, tone: Toast["tone"] = "info") => {
    const id = ++seq.current;
    setToasts((t) => [...t.slice(-2), { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const begin = useCallback(() => {
    if (started.current) return;
    started.current = true;
    gameStart("duong-len-ceo");
  }, []);

  // Load the save, pay offline earnings, then run the game clock
  useEffect(() => {
    const s = load();
    stateRef.current = s;
    if (s.allTime === 0) setIntro(true);
    else {
      const off = E.applyOffline(s);
      if (off) setOffline(off);
    }
    rerender();

    let last = performance.now();
    let lastSave = Date.now();
    const id = setInterval(() => {
      const st = stateRef.current;
      if (!st) return;
      const now = performance.now();
      // Hidden tab: the clock stops (time away is paid as offline earnings when the tab returns)
      if (document.visibilityState === "hidden") {
        last = now;
        return;
      }
      const dt = Math.min(1, (now - last) / 1000);
      last = now;
      const news = E.tick(st, dt);
      if (news.rankUp !== null) setRankUp(news.rankUp);
      for (const a of news.achievements) {
        const def = ACHIEVEMENTS.find((x) => x.id === a);
        if (def) toast(`${def.emoji} Thành tựu mới: ${def.name}`, "good");
      }
      if (Date.now() - lastSave > SAVE_EVERY_MS) {
        save(st);
        lastSave = Date.now();
      }
      rerender();
    }, TICK_MS);

    // Save when the tab is hidden or closed; pay offline earnings when it comes back
    const onVis = () => {
      const st = stateRef.current;
      if (!st) return;
      if (document.visibilityState === "hidden") save(st);
      else {
        last = performance.now();
        const off = E.applyOffline(st);
        if (off) setOffline(off);
      }
    };
    const onHide = () => stateRef.current && save(stateRef.current);
    // Signed in on another device with more progress: the account sync replaced the save
    const onProgress = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== CEO_KEY) return;
      const next = load();
      if (stateRef.current && next.allTime > stateRef.current.allTime) {
        stateRef.current = next;
        toast("☁️ Đã tải tiến độ từ tài khoản của bạn", "good");
        rerender();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pagehide", onHide);
    window.addEventListener(PROGRESS_EVENT, onProgress);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pagehide", onHide);
      window.removeEventListener(PROGRESS_EVENT, onProgress);
      if (stateRef.current) save(stateRef.current);
    };
  }, [rerender, toast]);

  // News ticker
  useEffect(() => {
    const id = setInterval(() => setNewsIdx((i) => i + 1), 8000);
    return () => clearInterval(id);
  }, []);

  const s = stateRef.current;
  if (!s) return <div className="min-h-[560px] rounded-2xl bg-bg" aria-hidden="true" />;

  const rank = RANKS[s.rank];
  const nextRank = RANKS[s.rank + 1];
  const cal = E.calendar(s);
  const inc = E.income(s);
  const perClick = E.clickValue(s);
  const pending = E.situation(s.event);
  const shopItems = E.shop(s);
  const affordableShop = shopItems.filter((u) => u.cost <= s.money).length;
  const news = NEWS.filter((n) => s.rank >= (n.minRank ?? 0));
  const progress = nextRank ? Math.min(1, (s.career - rank.at) / (nextRank.at - rank.at)) : 1;
  // Only one dialog at a time, in this order; the golden coffee waits until none is open
  const modal: "intro" | "offline" | "rank" | "situation" | null = intro ? "intro" : offline ? "offline" : rankUp !== null ? "rank" : pending || result ? "situation" : null;

  const work = (e: React.MouseEvent<HTMLButtonElement>) => {
    begin();
    const v = E.click(s);
    const box = e.currentTarget.getBoundingClientRect();
    const id = ++seq.current;
    const x = e.clientX ? e.clientX - box.left : box.width / 2;
    const y = e.clientY ? e.clientY - box.top : box.height / 2;
    setFloats((f) => [...f.slice(-12), { id, x, y, text: `+${E.fmtMoney(v)}` }]);
    setTimeout(() => setFloats((f) => f.filter((p) => p.id !== id)), 900);
    rerender();
  };

  const hire = (id: string) => {
    begin();
    const n = buyN === "max" ? E.maxAffordable(s, id) : buyN;
    if (E.buyStaff(s, id, n)) rerender();
  };

  const buy = (id: string) => {
    begin();
    if (E.buyUpgrade(s, id)) rerender();
  };

  const choose = (i: number) => {
    const r = E.resolveSituation(s, i);
    if (r) setResult(r);
    rerender();
  };

  const coffee = () => {
    const r = E.catchCoffee(s);
    if (r) toast(`☕ ${r.text}${r.amount ? ` +${E.fmtMoney(r.amount)}` : ""}`, "good");
    rerender();
  };

  const doRestart = () => {
    const gain = E.restart(s);
    if (!gain) return;
    gameEnd("duong-len-ceo", { score: s.stars });
    started.current = false;
    save(s);
    toast(`🚀 Khởi nghiệp lại! +${gain} danh tiếng, thu nhập vĩnh viễn +${gain * 2}%`, "good");
    setTab("staff");
    rerender();
  };

  return (
    <div className="relative mx-auto w-full max-w-[920px] overflow-hidden rounded-2xl bg-bg p-3 sm:p-5">
      {/* Status */}
      <div className="rounded-2xl bg-gradient-to-br from-[#6b3cf5] to-[#1a9fe8] p-4 text-white shadow-lift">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="inline-flex items-center gap-2 text-sm font-semibold">
            <span className="text-xl" aria-hidden="true">
              {rank.emoji}
            </span>
            {rank.name}
            {s.stars > 0 && <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">⭐ {s.stars} danh tiếng</span>}
          </p>
          <p className="inline-flex items-center gap-1.5 text-xs text-white/85">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {WEEKDAYS[cal.weekday]}, {cal.dayOfMonth}/{cal.month} · Năm {cal.year}
          </p>
        </div>
        <p className="mt-2 font-mono text-3xl font-extrabold tabular-nums sm:text-4xl" aria-live="off">
          {E.fmtMoney(s.money)}
        </p>
        <p className="mt-0.5 text-sm text-white/90">
          {E.fmtMoney(inc)}/giây · mỗi lần bấm {E.fmtMoney(perClick)}
        </p>
        {nextRank && (
          <div className="mt-3">
            <div className="flex justify-between text-[11px] text-white/80">
              <span>Lên {nextRank.name}</span>
              <span>
                {E.fmtMoney(s.career)} / {E.fmtMoney(nextRank.at)}
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/25">
              <div className="h-full rounded-full bg-white" style={{ width: `${progress * 100}%` }} />
            </div>
          </div>
        )}
        {(WEEKDAY_NOTE[cal.weekday] || s.boosts.length > 0) && (
          <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
            {WEEKDAY_NOTE[cal.weekday] && <span className="rounded-full bg-black/20 px-2 py-0.5">{WEEKDAY_NOTE[cal.weekday]}</span>}
            {s.boosts.map((b, i) => (
              <span key={i} className="rounded-full bg-[#f5c400] px-2 py-0.5 font-semibold text-[#1b1a22]">
                {b.target === "prod" ? "Thu nhập" : "Mỗi lần bấm"} ×{b.mult.toLocaleString("vi-VN")} · {Math.ceil(b.until - s.time)}s
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {/* Work */}
        <div>
          <div className="relative flex flex-col items-center rounded-2xl border border-line bg-surface p-5">
            <button
              type="button"
              onClick={work}
              className="relative grid h-40 w-40 place-items-center rounded-full bg-gradient-to-br from-[#ffb547] to-[#ff6a3d] text-6xl shadow-lift transition active:scale-95 sm:h-44 sm:w-44"
              aria-label={`Làm việc, mỗi lần bấm được ${E.fmtMoney(perClick)}`}
            >
              <span aria-hidden="true">💻</span>
              {floats.map((f) => (
                <span key={f.id} className="pointer-events-none absolute animate-[ceo-float_0.9s_ease-out_forwards] text-sm font-extrabold whitespace-nowrap text-white drop-shadow" style={{ left: f.x, top: f.y }}>
                  {f.text}
                </span>
              ))}
            </button>
            <p className="mt-3 text-sm font-semibold">Bấm để làm việc</p>
            <p className="text-xs text-muted">Thuê nhân sự để tiền tự chảy về, kể cả khi bạn rời đi.</p>
          </div>
          <div className="mt-3 rounded-2xl border border-line bg-surface px-4 py-3 text-sm">
            <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">Bản tin công ty</p>
            <p className="mt-1 min-h-10" aria-live="polite">
              {news[newsIdx % news.length]?.text}
            </p>
          </div>
        </div>

        {/* Panels */}
        <div className="min-w-0">
          <div role="tablist" className="grid grid-cols-4 gap-1 rounded-xl bg-surface-2 p-1 text-xs font-semibold sm:text-sm">
            {(
              [
                ["staff", "Nhân sự", Users, null],
                ["shop", "Nâng cấp", TrendingUp, affordableShop || null],
                ["awards", "Thành tựu", Award, null],
                ["career", "Sự nghiệp", Briefcase, E.starsOnRestart(s) > 0 ? "!" : null],
              ] as [Tab, string, typeof Users, number | string | null][]
            ).map(([id, label, , badge]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={`relative inline-flex items-center justify-center rounded-lg px-1 py-2 whitespace-nowrap ${tab === id ? "bg-surface text-fg shadow-card" : "text-muted hover:text-fg"}`}
              >
                {label}
                {badge !== null && <span className="absolute -top-1 -right-1 grid h-4 min-w-4 place-items-center rounded-full bg-party px-1 text-[10px] text-white">{badge}</span>}
              </button>
            ))}
          </div>

          <div className="mt-3 max-h-[440px] overflow-y-auto pr-1">
            {tab === "staff" && (
              <>
                <div className="mb-2 flex items-center justify-end gap-1 text-xs">
                  <span className="mr-1 text-muted">Thuê</span>
                  {([1, 10, "max"] as const).map((n) => (
                    <button key={n} type="button" onClick={() => setBuyN(n)} className={`rounded-md px-2 py-1 font-semibold ${buyN === n ? "bg-fg text-bg" : "bg-surface-2 text-muted"}`}>
                      {n === "max" ? "Tối đa" : `×${n}`}
                    </button>
                  ))}
                </div>
                <ul className="space-y-2">
                  {STAFF.map((st, i) => {
                    if (!E.staffVisible(s, i)) return null;
                    const n = buyN === "max" ? Math.max(1, E.maxAffordable(s, st.id)) : buyN;
                    const cost = E.staffCost(s, st.id, n);
                    const can = s.money >= cost;
                    const each = st.rate * E.staffMult(s, st.id) * E.permanentMult(s);
                    return (
                      <li key={st.id}>
                        <button
                          type="button"
                          onClick={() => hire(st.id)}
                          disabled={!can}
                          className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${can ? "border-line bg-surface hover:border-brand/50" : "border-line bg-surface opacity-60"}`}
                        >
                          <span className="text-2xl" aria-hidden="true">
                            {st.emoji}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-baseline justify-between gap-2">
                              <span className="truncate font-semibold">{st.name}</span>
                              <span className="shrink-0 font-mono text-sm font-bold tabular-nums">{E.owned(s, st.id)}</span>
                            </span>
                            <span className="block truncate text-xs text-muted">{st.desc}</span>
                            <span className="mt-0.5 flex justify-between gap-2 text-xs">
                              <span className="text-muted">+{E.fmtMoney(each)}/giây mỗi người</span>
                              <span className={`font-semibold ${can ? "text-party" : "text-muted"}`}>
                                {n > 1 ? `×${n} · ` : ""}
                                {E.fmtMoney(cost)}
                              </span>
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}

            {tab === "shop" &&
              (shopItems.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted">Chưa có nâng cấp mới. Thuê thêm nhân sự để mở khóa!</p>
              ) : (
                <ul className="space-y-2">
                  {shopItems.map((u) => {
                    const can = s.money >= u.cost;
                    return (
                      <li key={u.id}>
                        <button
                          type="button"
                          onClick={() => buy(u.id)}
                          disabled={!can}
                          className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left ${can ? "border-line bg-surface hover:border-brand/50" : "border-line bg-surface opacity-60"}`}
                        >
                          <span className="text-2xl" aria-hidden="true">
                            {u.emoji}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-semibold">{u.name}</span>
                            <span className="block text-xs text-muted">{u.desc}</span>
                          </span>
                          <span className={`shrink-0 text-xs font-semibold ${can ? "text-party" : "text-muted"}`}>{E.fmtMoney(u.cost)}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ))}

            {tab === "awards" && (
              <>
                <p className="mb-2 text-xs text-muted">
                  {s.achievements.length}/{ACHIEVEMENTS.length} thành tựu · mỗi thành tựu +1% thu nhập vĩnh viễn
                </p>
                <ul className="grid grid-cols-2 gap-2">
                  {ACHIEVEMENTS.map((a) => {
                    const done = s.achievements.includes(a.id);
                    return (
                      <li key={a.id} className={`rounded-xl border border-line p-2.5 text-xs ${done ? "bg-surface" : "bg-surface-2 opacity-60"}`}>
                        <span className="text-lg" aria-hidden="true">
                          {done ? a.emoji : "🔒"}
                        </span>
                        <span className="block font-semibold">{a.name}</span>
                        <span className="block text-muted">{a.desc}</span>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}

            {tab === "career" && (
              <CareerPanel s={s} onRestart={doRestart} share={() => share(`Mình đã lên ${rank.emoji} ${rank.name} trong Đường lên CEO, thu nhập ${E.fmtMoney(inc)}/giây! Bạn leo được tới đâu?`)} copied={copied} />
            )}
          </div>
        </div>
      </div>

      {/* Golden coffee */}
      {s.coffee && !modal && (
        <button
          type="button"
          onClick={coffee}
          className="absolute z-10 grid h-14 w-14 animate-bounce place-items-center rounded-full bg-[#f5c400] text-3xl shadow-lift ring-4 ring-[#f5c400]/40"
          style={{ left: `${s.coffee.x * 100}%`, top: `${s.coffee.y * 100}%` }}
          aria-label="Ly cà phê vàng: bấm để nhận thưởng"
        >
          <Coffee className="h-7 w-7 text-[#6b3a0b]" aria-hidden="true" />
        </button>
      )}

      {/* Toasts */}
      <div className="pointer-events-none absolute inset-x-3 bottom-3 z-20 flex flex-col items-center gap-2" aria-live="polite">
        {toasts.map((t) => (
          <p key={t.id} className={`rounded-xl px-3 py-2 text-sm font-semibold shadow-lift ${t.tone === "good" ? "bg-fg text-bg" : "bg-surface text-fg"}`}>
            {t.text}
          </p>
        ))}
      </div>

      {/* Situation */}
      {modal === "situation" && (
        <Modal>
          {result ? (
            <>
              <p className="text-4xl" aria-hidden="true">
                {result.won === false ? "😅" : "✅"}
              </p>
              <p className="mt-3 font-semibold">{result.text}</p>
              <div className="mt-2 space-y-0.5 text-sm">
                {result.amount > 0 && <p className="font-bold text-party">+{E.fmtMoney(result.amount)}</p>}
                {result.lost > 0 && <p className="font-bold text-[#e5484d]">−{E.fmtMoney(result.lost)}</p>}
                {result.boost && (
                  <p className="font-semibold text-[#b77900] dark:text-[#ffb547]">
                    {result.boost.target === "prod" ? "Thu nhập" : "Mỗi lần bấm"} ×{result.boost.mult.toLocaleString("vi-VN")} trong {Math.round(result.boost.until - s.time)} giây
                  </p>
                )}
              </div>
              <button type="button" onClick={() => setResult(null)} className="btn-primary mt-5 w-full">
                Tiếp tục làm việc
              </button>
            </>
          ) : (
            pending && (
              <>
                <p className="text-4xl" aria-hidden="true">
                  {pending.emoji}
                </p>
                <p className="mt-2 text-xs font-semibold tracking-wide text-muted uppercase">Tình huống</p>
                <h3 className="mt-1 text-lg font-extrabold">{pending.title}</h3>
                <p className="mt-2 text-sm text-muted">{pending.text}</p>
                <div className="mt-4 grid gap-2">
                  {pending.choices.map((c, i) => (
                    <button key={i} type="button" onClick={() => choose(i)} className="btn-ghost w-full justify-between text-left">
                      <span>{c.label}</span>
                      {"chance" in c && <span className="text-xs text-muted">may rủi</span>}
                    </button>
                  ))}
                </div>
              </>
            )
          )}
        </Modal>
      )}

      {/* Rank up */}
      {modal === "rank" && rankUp !== null && (
        <Modal>
          <p className="text-5xl" aria-hidden="true">
            {RANKS[rankUp].emoji}
          </p>
          <p className="mt-2 text-xs font-semibold tracking-wide text-party uppercase">Thăng chức!</p>
          <h3 className="mt-1 text-2xl font-extrabold">{RANKS[rankUp].name}</h3>
          <p className="mt-2 text-sm text-muted">{RANKS[rankUp].line}</p>
          <button type="button" onClick={() => setRankUp(null)} className="btn-primary mt-5 w-full">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Tuyệt vời!
          </button>
        </Modal>
      )}

      {/* Welcome back */}
      {modal === "offline" && offline && (
        <Modal>
          <p className="text-4xl" aria-hidden="true">
            🌙
          </p>
          <h3 className="mt-2 text-lg font-extrabold">Chào mừng trở lại!</h3>
          <p className="mt-2 text-sm text-muted">Trong {E.fmtDuration(offline.seconds)} bạn vắng mặt, đội ngũ vẫn làm việc chăm chỉ và kiếm được</p>
          <p className="mt-1 text-2xl font-extrabold text-party">+{E.fmtMoney(offline.amount)}</p>
          <p className="mt-1 text-xs text-muted">Khi vắng mặt, công ty làm việc bằng một nửa năng suất, tối đa 8 giờ.</p>
          <button type="button" onClick={() => setOffline(null)} className="btn-primary mt-5 w-full">
            Vào làm thôi
          </button>
        </Modal>
      )}

      {/* First visit */}
      {modal === "intro" && (
        <Modal>
          <p className="text-5xl" aria-hidden="true">
            🧑‍🎓
          </p>
          <h3 className="mt-2 text-xl font-extrabold">Ngày đầu đi làm</h3>
          <p className="mt-2 text-sm text-muted">
            Bạn là thực tập sinh với một chiếc laptop cũ. Bấm để làm việc kiếm lương, thuê nhân sự, mở phòng ban, chi nhánh… và leo dần lên ghế CEO. Đừng bỏ lỡ những ly cà phê vàng và các tình huống bất ngờ ở công
            sở!
          </p>
          <button
            type="button"
            onClick={() => {
              setIntro(false);
              begin();
            }}
            className="btn-primary mt-5 w-full"
          >
            Bắt đầu đi làm
          </button>
        </Modal>
      )}

      <style>{`@keyframes ceo-float { from { opacity: 1; transform: translate(-50%, -50%); } to { opacity: 0; transform: translate(-50%, -160%); } }`}</style>
    </div>
  );
}

function Modal({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-0 z-30 grid place-items-center bg-black/45 p-4 backdrop-blur-[2px]" role="dialog" aria-modal="true">
      <div className="w-full max-w-sm rounded-2xl bg-surface p-5 text-center shadow-lift">{children}</div>
    </div>
  );
}

function CareerPanel({ s, onRestart, share, copied }: { s: E.State; onRestart: () => void; share: () => void; copied: boolean }) {
  const [confirm, setConfirm] = useState(false);
  const gain = E.starsOnRestart(s);
  const nextStarAt = Math.pow(E.starsWorth(s.allTime) + 1, 2) * 1e12;
  const rows: [string, ReactNode][] = [
    ["Tổng tiền đã kiếm", E.fmtMoney(s.allTime)],
    ["Kiếm trong sự nghiệp này", E.fmtMoney(s.career)],
    ["Số lần bấm", s.clicks.toLocaleString("vi-VN")],
    ["Tình huống đã xử lý", s.events.toLocaleString("vi-VN")],
    ["Ly cà phê vàng", s.coffees.toLocaleString("vi-VN")],
    ["Thời gian làm việc", E.fmtDuration(s.time)],
    ["Số lần khởi nghiệp", s.prestiges.toLocaleString("vi-VN")],
    ["Hệ số vĩnh viễn", `×${E.permanentMult(s).toLocaleString("vi-VN", { maximumFractionDigits: 2 })}`],
  ];
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-line bg-surface p-4">
        <h3 className="flex items-center gap-2 font-bold">
          <BarChart3 className="h-4 w-4 text-brand" aria-hidden="true" />
          Thống kê
        </h3>
        <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-muted">{k}</dt>
              <dd className="text-right font-mono font-semibold tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-3 text-center">
          <ShareButton onClick={share} copied={copied} label="Khoe chức danh" />
        </div>
      </div>

      <div className="rounded-xl border border-line bg-surface p-4">
        <h3 className="flex items-center gap-2 font-bold">
          <Rocket className="h-4 w-4 text-party" aria-hidden="true" />
          Khởi nghiệp lại
        </h3>
        <p className="mt-1 text-sm text-muted">
          Nghỉ việc để mở công ty riêng: bắt đầu lại từ thực tập sinh nhưng giữ <b className="text-fg">danh tiếng ⭐</b>, mỗi sao +2% thu nhập vĩnh viễn. Thành tựu cũng được giữ lại.
        </p>
        <p className="mt-2 text-sm">
          {gain > 0 ? (
            <>
              Khởi nghiệp bây giờ nhận <b className="text-party">+{gain} ⭐</b> (thu nhập vĩnh viễn +{gain * 2}%).
            </>
          ) : (
            <>Cần kiếm tổng cộng {E.fmtMoney(nextStarAt)} để nhận sao danh tiếng đầu tiên.</>
          )}
        </p>
        {gain > 0 &&
          (confirm ? (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setConfirm(false)} className="btn-ghost">
                <X className="h-4 w-4" aria-hidden="true" />
                Ở lại
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirm(false);
                  onRestart();
                }}
                className="btn-primary"
              >
                Chắc chắn
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirm(true)} className="btn-primary mt-3 w-full">
              <Rocket className="h-4 w-4" aria-hidden="true" />
              Khởi nghiệp lại
            </button>
          ))}
      </div>
    </div>
  );
}
