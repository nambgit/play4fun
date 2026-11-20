"use client";

import { PARTY_GAMES, type GameView, type PartySettings, type PartySlug, type PlayerView, type ServerState } from "@play4fun/party";
import { Check, Copy, Crown, DoorOpen, LogIn, Plus, Share2, UserX, Users, WifiOff, X } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useMemo, useState, type ComponentType, type ReactNode } from "react";
import { useSession } from "@/lib/auth-client";
import { useParty, type PartyApi } from "@/lib/party-client";

/** Props every party game screen receives */
export type GameProps<V extends GameView = GameView> = {
  view: V;
  state: ServerState;
  api: PartyApi;
  me: string;
  isHost: boolean;
  players: Map<string, PlayerView>;
};

export type SettingsProps<S extends PartySettings = PartySettings> = {
  value: S;
  onChange: (s: S) => void;
  disabled: boolean;
  playerCount: number;
};

type Props = {
  slug: PartySlug;
  title: string;
  emoji: string;
  accent: [string, string];
  /** Short rules shown in the lobby */
  rules: ReactNode;
  Settings: ComponentType<SettingsProps<any>>; // eslint-disable-line @typescript-eslint/no-explicit-any
  Game: ComponentType<GameProps<any>>; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export function PartyRoom({ slug, title, emoji, accent, rules, Settings, Game }: Props) {
  const api = useParty(slug);
  const { state, conn } = api;

  return (
    <div className="mx-auto w-full max-w-[860px]">
      <div className="relative min-h-[520px] overflow-hidden rounded-2xl bg-bg p-3 sm:p-5">
        {conn !== "online" && state && (
          <div className="mb-3 flex items-center gap-2 rounded-xl bg-[#ffb547]/20 px-3 py-2 text-sm font-medium text-fg">
            <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
            Mất kết nối, đang thử kết nối lại… Bạn vẫn giữ chỗ trong phòng.
          </div>
        )}
        {!state ? (
          <Entry api={api} slug={slug} title={title} emoji={emoji} accent={accent} />
        ) : state.room.status === "lobby" ? (
          <Lobby api={api} state={state} slug={slug} title={title} emoji={emoji} accent={accent} rules={rules} Settings={Settings} />
        ) : state.game ? (
          <InGame api={api} state={state} Game={Game} />
        ) : null}
      </div>
    </div>
  );
}

// ------------------------------------------------------------ entry

function Entry({ api, slug, title, emoji, accent }: { api: PartyApi; slug: PartySlug; title: string; emoji: string; accent: [string, string] }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [invited, setInvited] = useState(false);
  const [busy, setBusy] = useState<"create" | "join" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const limits = PARTY_GAMES[slug];

  // Prefill: last name used in a room, else the signed-in account's name
  const account = useSession().data?.user?.name;
  useEffect(() => setName((n) => n || api.savedName || (account ?? "").slice(0, 20)), [api.savedName, account]);
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("room");
    if (fromUrl) {
      setCode(fromUrl.toUpperCase().slice(0, 5));
      setInvited(true);
    }
  }, []);

  const go = async (kind: "create" | "join") => {
    const n = name.trim();
    if (!n) return setError("Nhập tên của bạn trước nhé.");
    if (kind === "join" && code.trim().length !== 5) return setError("Mã phòng gồm 5 ký tự.");
    setBusy(kind);
    setError(null);
    const err = kind === "create" ? await api.create(n) : await api.join(code.trim(), n);
    setBusy(null);
    setError(err);
  };

  return (
    <div className="grid min-h-[488px] place-items-center">
      <div className="w-full max-w-md text-center">
        <span
          className="mx-auto grid h-16 w-16 place-items-center rounded-2xl text-3xl shadow-lift"
          style={{ backgroundImage: `linear-gradient(135deg, ${accent[0]}, ${accent[1]})` }}
          aria-hidden="true"
        >
          {emoji}
        </span>
        <h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2>
        <p className="mt-1 text-sm text-muted">
          {limits.minPlayers}–{limits.maxPlayers} người · mỗi người dùng điện thoại của mình
        </p>
        {invited && (
          <p className="mx-auto mt-4 w-fit rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold text-brand">
            Bạn được mời vào phòng <span className="font-mono">{code}</span>
          </p>
        )}
        {api.notice && <p className="mx-auto mt-4 w-fit rounded-lg bg-surface-2 px-3 py-1.5 text-sm text-muted">{api.notice}</p>}

        <label className="mt-6 block text-left text-sm font-semibold" htmlFor="party-name">
          Tên của bạn
        </label>
        <input
          id="party-name"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 20))}
          onKeyDown={(e) => e.key === "Enter" && go(invited ? "join" : "create")}
          placeholder="Ví dụ: Minh béo"
          autoComplete="nickname"
          className="mt-1.5 h-12 w-full rounded-xl border border-line bg-surface px-4 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />

        <div className={`mt-4 grid gap-3 ${invited ? "" : "sm:grid-cols-2"}`}>
          {!invited && (
            <button type="button" onClick={() => go("create")} disabled={!!busy || api.conn !== "online"} className="btn-primary h-12 disabled:opacity-60">
              <Plus className="h-4 w-4" aria-hidden="true" />
              {busy === "create" ? "Đang tạo…" : "Tạo phòng mới"}
            </button>
          )}
          <div className="flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5))}
              onKeyDown={(e) => e.key === "Enter" && go("join")}
              placeholder="MÃ PHÒNG"
              aria-label="Mã phòng"
              autoCapitalize="characters"
              className="h-12 w-full min-w-0 rounded-xl border border-line bg-surface px-3 text-center font-mono text-lg font-bold tracking-[0.3em] uppercase outline-none placeholder:text-sm placeholder:font-sans placeholder:font-semibold placeholder:tracking-normal focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <button
              type="button"
              onClick={() => go("join")}
              disabled={!!busy || api.conn !== "online"}
              className={`${invited ? "btn-primary" : "btn-ghost"} h-12 shrink-0 px-4 disabled:opacity-60`}
            >
              <LogIn className="h-4 w-4" aria-hidden="true" />
              {busy === "join" ? "…" : "Vào"}
            </button>
          </div>
        </div>
        {invited && (
          <button type="button" onClick={() => setInvited(false)} className="mt-3 text-xs text-muted underline hover:text-fg">
            Hoặc tạo phòng mới
          </button>
        )}
        {error && (
          <p role="alert" className="mt-3 text-sm font-medium text-[#e5484d]">
            {error}
          </p>
        )}
        {api.conn !== "online" && (
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted">
            <WifiOff className="h-3.5 w-3.5" aria-hidden="true" />
            {api.conn === "connecting" ? "Đang kết nối máy chủ…" : "Không kết nối được máy chủ. Kiểm tra mạng rồi tải lại trang."}
          </p>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------ lobby

function Lobby({
  api,
  state,
  slug,
  title,
  emoji,
  accent,
  rules,
  Settings,
}: {
  api: PartyApi;
  state: ServerState;
  slug: PartySlug;
  title: string;
  emoji: string;
  accent: [string, string];
  rules: ReactNode;
  Settings: ComponentType<SettingsProps<any>>; // eslint-disable-line @typescript-eslint/no-explicit-any
}) {
  const { room, me } = state;
  const isHost = room.hostId === me;
  const limits = PARTY_GAMES[slug];
  const online = room.players.filter((p) => p.connected).length;
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  const start = async () => {
    setStarting(true);
    setError(await api.start());
    setStarting(false);
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl text-xl" style={{ backgroundImage: `linear-gradient(135deg, ${accent[0]}, ${accent[1]})` }} aria-hidden="true">
          {emoji}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-muted">Sảnh chờ</p>
          <h2 className="truncate text-lg font-extrabold tracking-tight">{title}</h2>
        </div>
        <button type="button" onClick={api.leave} className="btn-ghost h-9 px-3 text-sm">
          <DoorOpen className="h-4 w-4" aria-hidden="true" />
          Rời phòng
        </button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1.1fr]">
        <Invite code={room.code} slug={slug} />

        <section className="rounded-2xl border border-line bg-surface p-4" aria-label="Người chơi">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Users className="h-4 w-4 text-muted" aria-hidden="true" />
            Người chơi
            <span className="ml-auto font-mono text-xs text-muted">
              {room.players.length}/{limits.maxPlayers}
            </span>
          </h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {room.players.map((p) => (
              <li
                key={p.id}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium ${p.id === me ? "border-brand/40 bg-brand-soft" : "border-line bg-surface"} ${p.connected ? "" : "opacity-50"}`}
              >
                {p.id === room.hostId && <Crown className="h-3.5 w-3.5 text-[#f5a400]" aria-label="Chủ phòng" />}
                {p.name}
                {p.id === me && <span className="text-xs text-muted">(bạn)</span>}
                {!p.connected && <span className="text-xs text-muted">· mất mạng</span>}
                {isHost && p.id !== me && (
                  <button type="button" onClick={() => api.kick(p.id)} aria-label={`Mời ${p.name} ra khỏi phòng`} className="-mr-1 rounded-full p-0.5 text-muted hover:bg-surface-2 hover:text-[#e5484d]">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </li>
            ))}
          </ul>
          {online < limits.minPlayers && (
            <p className="mt-3 text-xs text-muted">
              Cần thêm {limits.minPlayers - online} người nữa để bắt đầu. Gửi mã phòng cho bạn bè nhé!
            </p>
          )}
        </section>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-line bg-surface p-4">
          <h3 className="text-sm font-semibold">Cài đặt {isHost ? "" : "(chủ phòng chỉnh)"}</h3>
          <div className="mt-3">
            <Settings value={room.settings} onChange={api.settings} disabled={!isHost} playerCount={online} />
          </div>
        </section>
        <section className="rounded-2xl border border-line bg-surface p-4 text-sm leading-relaxed text-muted [&_b]:text-fg">
          <h3 className="mb-2 text-sm font-semibold text-fg">Cách chơi</h3>
          {rules}
        </section>
      </div>

      <div className="mt-5 text-center">
        {isHost ? (
          <button type="button" onClick={start} disabled={starting || online < limits.minPlayers} className="btn-primary px-10 py-3.5 text-base disabled:opacity-50">
            {starting ? "Đang bắt đầu…" : "Bắt đầu chơi"}
          </button>
        ) : (
          <p className="inline-flex items-center gap-2 rounded-full bg-surface-2 px-4 py-2 text-sm text-muted">
            <span className="h-2 w-2 animate-pulse rounded-full bg-party" aria-hidden="true" />
            Chờ chủ phòng bắt đầu…
          </p>
        )}
        {error && (
          <p role="alert" className="mt-2 text-sm font-medium text-[#e5484d]">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

function Invite({ code, slug }: { code: string; slug: PartySlug }) {
  const [qr, setQr] = useState("");
  const [copied, setCopied] = useState<"code" | "link" | null>(null);
  const link = useMemo(() => (typeof window === "undefined" ? "" : `${window.location.origin}/games/${slug}?room=${code}`), [code, slug]);

  useEffect(() => {
    QRCode.toString(link, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#1b1a22", light: "#ffffff" } })
      .then(setQr)
      .catch(() => setQr(""));
  }, [link]);

  const copy = async (what: "code" | "link") => {
    try {
      if (what === "link" && navigator.share) {
        await navigator.share({ title: "Vào phòng chơi cùng mình!", text: `Mã phòng: ${code}`, url: link });
        return;
      }
      await navigator.clipboard.writeText(what === "code" ? code : link);
      setCopied(what);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      /* cancelled */
    }
  };

  return (
    <section className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4" aria-label="Mời bạn bè">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-muted">Mã phòng</p>
        <button type="button" onClick={() => copy("code")} className="group mt-1 flex items-center gap-2" aria-label={`Sao chép mã phòng ${code}`}>
          <span className="font-mono text-4xl font-extrabold tracking-[0.18em] sm:text-5xl">{code}</span>
          {copied === "code" ? <Check className="h-5 w-5 text-party" /> : <Copy className="h-5 w-5 text-muted group-hover:text-fg" />}
        </button>
        <p className="mt-1 text-xs text-muted">Vào play4fun.io.vn, chọn game này rồi nhập mã, hoặc quét mã QR.</p>
        <button type="button" onClick={() => copy("link")} className="btn-ghost mt-3 h-9 px-3 text-sm">
          {copied === "link" ? <Check className="h-4 w-4" aria-hidden="true" /> : <Share2 className="h-4 w-4" aria-hidden="true" />}
          {copied === "link" ? "Đã sao chép link" : "Gửi link mời"}
        </button>
      </div>
      {qr && (
        <div
          className="h-28 w-28 shrink-0 rounded-xl bg-white p-2 ring-1 ring-line sm:h-32 sm:w-32 [&_svg]:h-full [&_svg]:w-full"
          aria-label="Mã QR vào phòng"
          role="img"
          dangerouslySetInnerHTML={{ __html: qr }}
        />
      )}
    </section>
  );
}

// ------------------------------------------------------------ in game

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function InGame({ api, state, Game }: { api: PartyApi; state: ServerState; Game: ComponentType<GameProps<any>> }) {
  const { room, me } = state;
  const isHost = room.hostId === me;
  const players = useMemo(() => new Map(room.players.map((p) => [p.id, p])), [room.players]);
  const offline = room.players.filter((p) => !p.connected);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted">
        <span className="rounded-md bg-surface-2 px-2 py-1 font-mono font-bold text-fg">{room.code}</span>
        <span className="inline-flex items-center gap-1">
          <Users className="h-3.5 w-3.5" aria-hidden="true" />
          {room.players.length - offline.length} online
        </span>
        {offline.length > 0 && (
          <span className="inline-flex items-center gap-1">
            <UserX className="h-3.5 w-3.5" aria-hidden="true" />
            {offline.map((p) => p.name).join(", ")} mất mạng
          </span>
        )}
        <span className="ml-auto flex gap-2">
          {isHost && (
            <button type="button" onClick={api.toLobby} className="rounded-md px-2 py-1 font-semibold hover:bg-surface-2 hover:text-fg">
              Về sảnh chờ
            </button>
          )}
          <button type="button" onClick={api.leave} className="rounded-md px-2 py-1 font-semibold hover:bg-surface-2 hover:text-fg">
            Rời phòng
          </button>
        </span>
      </div>
      <Game view={state.game!} state={state} api={api} me={me} isHost={isHost} players={players} />
    </div>
  );
}

// ------------------------------------------------------------ small shared pieces for games

export function Choice<T extends string | number>({
  label,
  value,
  options,
  onChange,
  disabled,
  format = String,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
  disabled: boolean;
  format?: (v: T) => string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-1.5">
      <span className="text-sm text-muted">{label}</span>
      <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap rounded-full border border-line bg-bg p-0.5">
        {options.map((o) => (
          <button
            key={String(o)}
            type="button"
            role="radio"
            aria-checked={value === o}
            disabled={disabled}
            onClick={() => onChange(o)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition disabled:cursor-default ${value === o ? "bg-fg text-bg" : "text-muted enabled:hover:text-fg"}`}
          >
            {format(o)}
          </button>
        ))}
      </div>
    </div>
  );
}

export function HostBar({ isHost, children, waiting }: { isHost: boolean; children: ReactNode; waiting: string }) {
  return (
    <div className="mt-5 flex flex-wrap justify-center gap-2">
      {isHost ? (
        children
      ) : (
        <p className="inline-flex items-center gap-2 rounded-full bg-surface-2 px-4 py-2 text-sm text-muted">
          <span className="h-2 w-2 animate-pulse rounded-full bg-party" aria-hidden="true" />
          {waiting}
        </p>
      )}
    </div>
  );
}

export function nameOf(players: Map<string, PlayerView>, id: string) {
  return players.get(id)?.name ?? "Ai đó";
}
