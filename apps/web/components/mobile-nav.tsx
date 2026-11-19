"use client";

import { Menu, Play, X } from "lucide-react";
import Link from "next/link";
import { FEATURED_SLUG } from "@/lib/games";
import { useEffect, useState } from "react";

type NavLink = { href: string; label: string; dot: string };

export function MobileNav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Đóng menu" : "Mở menu"}
        className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-fg"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div id="mobile-menu" className="absolute inset-x-0 top-16 border-b border-line bg-bg px-4 pt-2 pb-5 shadow-card">
          <nav aria-label="Danh mục" className="flex flex-col">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-base font-medium hover:bg-surface-2"
              >
                <span className={`h-2 w-2 rounded-full ${l.dot}`} />
                {l.label}
              </Link>
            ))}
          </nav>
          <Link href={`/games/${FEATURED_SLUG}`} onClick={() => setOpen(false)} className="btn-primary mt-3 w-full">
            <Play className="h-4 w-4 fill-current" aria-hidden="true" />
            Chơi ngay
          </Link>
        </div>
      )}
    </div>
  );
}
