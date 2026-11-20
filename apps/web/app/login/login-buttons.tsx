"use client";

import { useState } from "react";
import { authClient, signIn } from "@/lib/auth-client";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8Z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3a7.2 7.2 0 0 1-10.8-3.8h-4v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8l4-3.1Z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.5-3.5A12 12 0 0 0 1.3 6.6l4 3.1A7.2 7.2 0 0 1 12 4.8Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#1877F2" d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12Z" />
      <path fill="#fff" d="m16.7 15.5.5-3.5h-3.4V9.8c0-1 .5-1.9 2-1.9h1.5v-3s-1.4-.2-2.7-.2c-2.7 0-4.5 1.6-4.5 4.7V12h-3v3.5h3v8.4a12 12 0 0 0 3.7 0v-8.4h2.9Z" />
    </svg>
  );
}

const LABEL = { google: "Tiếp tục với Google", facebook: "Tiếp tục với Facebook" } as const;
const ICON = { google: GoogleIcon, facebook: FacebookIcon } as const;

export function LoginButtons({ providers, next, devPassword }: { providers: ("google" | "facebook")[]; next: string; devPassword: boolean }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const go = async (provider: "google" | "facebook") => {
    setBusy(provider);
    setError(null);
    const { error } = await signIn.social({ provider, callbackURL: next, errorCallbackURL: `/login?next=${encodeURIComponent(next)}` });
    // On success the browser is already redirecting to Google/Facebook
    if (error) {
      setError("Không mở được trang đăng nhập, thử lại sau giây lát.");
      setBusy(null);
    }
  };

  return (
    <div className="space-y-3">
      {providers.length === 0 && !devPassword && (
        <p className="rounded-xl bg-surface-2 px-4 py-3 text-sm text-muted">Tính năng đăng nhập đang được chuẩn bị. Bạn vẫn chơi được mọi game như bình thường.</p>
      )}
      {providers.map((p) => {
        const Icon = ICON[p];
        return (
          <button
            key={p}
            type="button"
            onClick={() => go(p)}
            disabled={!!busy}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-line bg-surface text-base font-semibold shadow-card transition hover:border-fg/25 hover:bg-surface-2 disabled:opacity-60"
          >
            <Icon />
            {busy === p ? "Đang chuyển hướng…" : LABEL[p]}
          </button>
        );
      })}
      {devPassword && <DevLogin next={next} />}
      {error && (
        <p role="alert" className="text-sm text-[#e5484d]">
          {error}
        </p>
      )}
    </div>
  );
}

/** Development only (AUTH_DEV_PASSWORD=1, never in production): test accounts without OAuth apps */
function DevLogin({ next }: { next: string }) {
  const [email, setEmail] = useState("test@example.com");
  const [msg, setMsg] = useState<string | null>(null);
  const password = "play4fun-dev-password";
  const submit = async () => {
    setMsg(null);
    const signInRes = await authClient.signIn.email({ email, password });
    if (signInRes.error) {
      const up = await authClient.signUp.email({ email, password, name: email.split("@")[0] });
      if (up.error) return setMsg(up.error.message ?? "Lỗi");
    }
    window.location.href = next;
  };
  return (
    <div className="rounded-xl border border-dashed border-arcade/60 p-3">
      <p className="text-xs font-semibold text-arcade">Chỉ môi trường dev: đăng nhập thử</p>
      <div className="mt-2 flex gap-2">
        <input value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email thử" className="h-10 min-w-0 flex-1 rounded-lg border border-line bg-bg px-3 text-sm" />
        <button type="button" onClick={submit} className="btn-primary h-10 px-3 text-sm">
          Vào
        </button>
      </div>
      {msg && <p className="mt-1 text-xs text-[#e5484d]">{msg}</p>}
    </div>
  );
}
