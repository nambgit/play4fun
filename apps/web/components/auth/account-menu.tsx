"use client";

import { Building2, LogIn, LogOut, Trophy, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "@/lib/auth-client";

export function loginHref(next: string) {
  return next && next !== "/" && !next.startsWith("/login") ? `/login?next=${encodeURIComponent(next)}` : "/login";
}

export function Avatar({ name, image, size = 32 }: { name: string; image?: string | null; size?: number }) {
  const [broken, setBroken] = useState(false);
  if (image && !broken) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- remote avatar from Google/Facebook, tiny
      <img
        src={image}
        alt=""
        width={size}
        height={size}
        referrerPolicy="no-referrer"
        onError={() => setBroken(true)}
        className="shrink-0 rounded-full bg-surface-2 object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span className="grid shrink-0 place-items-center rounded-full bg-brand text-sm font-bold text-brand-ink" style={{ width: size, height: size }} aria-hidden="true">
      {(name.trim()[0] ?? "?").toUpperCase()}
    </span>
  );
}

/** Header: "Đăng nhập" for guests, avatar + menu when signed in */
export function AccountMenu() {
  const { data, isPending } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const user = data?.user;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (isPending) return <span className="hidden h-9 w-9 animate-pulse rounded-full bg-surface-2 sm:block" aria-hidden="true" />;

  if (!user) {
    return (
      <Link href={loginHref(pathname)} className="btn-ghost hidden h-10 px-3.5 sm:inline-flex">
        <LogIn className="h-4 w-4" aria-hidden="true" />
        Đăng nhập
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Tài khoản của ${user.name}`}
        className="flex items-center gap-2 rounded-full border border-line bg-surface p-1 pr-3 text-sm font-semibold transition hover:border-brand/40"
      >
        <Avatar name={user.name} image={user.image} />
        <span className="max-w-[9rem] truncate">{user.name}</span>
      </button>
      {open && (
        <div role="menu" className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-line bg-surface p-1.5 shadow-lift">
          <div className="px-3 py-2.5">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            {!user.email.endsWith(".invalid") && <p className="truncate text-xs text-muted">{user.email}</p>}
          </div>
          <Link role="menuitem" href="/accounts" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm hover:bg-surface-2">
            <Trophy className="h-4 w-4 text-arcade" aria-hidden="true" />
            Kỷ lục & tài khoản
          </Link>
          <Link role="menuitem" href="/studio" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm hover:bg-surface-2">
            <Building2 className="h-4 w-4 text-brand" aria-hidden="true" />
            Studio câu hỏi (công ty)
          </Link>
          <button
            role="menuitem"
            type="button"
            onClick={async () => {
              setOpen(false);
              await signOut();
              router.refresh();
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-surface-2"
          >
            <LogOut className="h-4 w-4 text-muted" aria-hidden="true" />
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}

/** Account row inside the mobile menu */
export function MobileAccountLinks({ onNavigate }: { onNavigate: () => void }) {
  const { data } = useSession();
  const pathname = usePathname();
  const user = data?.user;
  if (!user) {
    return (
      <Link href={loginHref(pathname)} onClick={onNavigate} className="flex items-center gap-3 rounded-xl px-3 py-3 text-base font-medium hover:bg-surface-2">
        <LogIn className="h-5 w-5 text-muted" aria-hidden="true" />
        Đăng nhập để lưu kỷ lục
      </Link>
    );
  }
  return (
    <Link href="/accounts" onClick={onNavigate} className="flex items-center gap-3 rounded-xl px-3 py-3 text-base font-medium hover:bg-surface-2">
      <Avatar name={user.name} image={user.image} size={28} />
      <span className="min-w-0 flex-1 truncate">{user.name}</span>
      <UserRound className="h-4 w-4 text-muted" aria-hidden="true" />
    </Link>
  );
}
