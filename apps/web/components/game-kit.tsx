"use client";

import { Check, Share2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

/**
 * Shared building blocks for single-player games (overlays, rules, stats, share, local best).
 * Keeps new games consistent with the look of Kiểm tra 15 phút / Gõ phím thần tốc.
 */

/** Full-stage overlay for the ready / paused / result screens */
export function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-30 grid place-items-center overflow-y-auto bg-bg/92 p-5 text-center backdrop-blur-sm">
      <div className="w-full">{children}</div>
    </div>
  );
}

/** Big emoji tile + title + one-line pitch on a ready screen */
export function ReadyHeader({ emoji, title, pitch, tone = "bg-brand" }: { emoji: string; title: string; pitch: string; tone?: string }) {
  return (
    <>
      <span className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl text-2xl text-white shadow-lift ${tone}`} aria-hidden="true">
        {emoji}
      </span>
      <h2 className="mt-4 text-3xl font-extrabold tracking-tight">{title}</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-pretty text-muted">{pitch}</p>
    </>
  );
}

export function Rules({ children }: { children: React.ReactNode }) {
  return <ul className="mx-auto mt-5 grid max-w-sm gap-2 text-left text-sm">{children}</ul>;
}

export function Rule({ icon, tone, children }: { icon: React.ReactNode; tone: string; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3">
      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${tone}`}>{icon}</span>
      <span className="text-muted [&_b]:text-fg">{children}</span>
    </li>
  );
}

export function Stats({ children, cols = 3 }: { children: React.ReactNode; cols?: 2 | 3 | 4 }) {
  const grid = cols === 2 ? "grid-cols-2" : cols === 4 ? "grid-cols-4" : "grid-cols-3";
  return <dl className={`mx-auto mt-4 grid max-w-sm gap-2 ${grid}`}>{children}</dl>;
}

export function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-surface px-1 py-2">
      <dt className="text-[10px] tracking-wider text-muted uppercase">{label}</dt>
      <dd className="mt-0.5 font-mono text-base font-bold tabular-nums">{value}</dd>
    </div>
  );
}

export function NewBest() {
  return <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-[#ffb547] px-2.5 py-1 text-xs font-bold text-[#2a1a00]">Kỷ lục mới!</span>;
}

/** Share text + link to the game page (native share sheet on phones, clipboard elsewhere) */
export function useShare(title: string) {
  const [copied, setCopied] = useState(false);
  const share = useCallback(
    async (text: string, path = window.location.pathname) => {
      const url = `${window.location.origin}${path}`;
      try {
        if (navigator.share) {
          await navigator.share({ title: `${title} | Play4Fun`, text, url });
          return;
        }
        await navigator.clipboard.writeText(`${text}\n${url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        /* share sheet cancelled */
      }
    },
    [title],
  );
  return { share, copied };
}

export function ShareButton({ onClick, copied, label = "Khoe kết quả" }: { onClick: () => void; copied: boolean; label?: string }) {
  return (
    <button type="button" onClick={onClick} className="btn-primary px-6">
      {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Share2 className="h-4 w-4" aria-hidden="true" />}
      {copied ? "Đã sao chép!" : label}
    </button>
  );
}

// ------------------------------------------------------------ local storage

export function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeStore(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage blocked: progress just isn't remembered */
  }
}

/**
 * Personal best kept on this device. `better` says which way is better
 * (reaction time: lower; score: higher). Returns [best, submit] where submit
 * returns true when the value is a new record.
 */
export function useLocalBest(key: string, better: "high" | "low") {
  const [best, setBest] = useState<number | null>(null);
  useEffect(() => setBest(readStore<number | null>(key, null)), [key]);
  const submit = useCallback(
    (v: number) => {
      const prev = readStore<number | null>(key, null);
      const isBest = prev === null || (better === "high" ? v > prev : v < prev);
      if (isBest) {
        writeStore(key, v);
        setBest(v);
      }
      return isBest;
    },
    [key, better],
  );
  return [best, submit] as const;
}

/** Pause when the tab is hidden or the window loses focus */
export function usePauseOnHide(onHide: () => void) {
  useEffect(() => {
    const vis = () => document.hidden && onHide();
    window.addEventListener("blur", onHide);
    document.addEventListener("visibilitychange", vis);
    return () => {
      window.removeEventListener("blur", onHide);
      document.removeEventListener("visibilitychange", vis);
    };
  }, [onHide]);
}
