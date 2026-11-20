"use client";

import { useEffect, useRef, useState } from "react";
import type { AdPlacement, AdsConfig } from "@/lib/ads";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

let configPromise: Promise<AdsConfig> | null = null;
const loadConfig = () =>
  (configPromise ??= fetch("/api/ads")
    .then((r) => (r.ok ? (r.json() as Promise<AdsConfig>) : null))
    .catch(() => null));

function loadScript(client: string) {
  if (document.querySelector("script[data-adsense]")) return;
  const s = document.createElement("script");
  s.async = true;
  s.crossOrigin = "anonymous";
  s.dataset.adsense = "1";
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
  document.head.appendChild(s);
}

/** A clearly labelled ad. Renders nothing (no reserved space) until AdSense is configured. */
export function AdSlot({ placement, className = "" }: { placement: AdPlacement; className?: string }) {
  const [cfg, setCfg] = useState<{ client: string; slot: string } | null>(null);
  const pushed = useRef(false);

  useEffect(() => {
    let alive = true;
    loadConfig().then((c) => {
      const slot = c?.slots[placement];
      if (alive && c && slot) setCfg({ client: c.client, slot });
    });
    return () => {
      alive = false;
    };
  }, [placement]);

  useEffect(() => {
    if (!cfg || pushed.current) return;
    loadScript(cfg.client);
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* blocked by an ad blocker: nothing to show */
    }
  }, [cfg]);

  if (!cfg) return null;
  return (
    <aside aria-label="Quảng cáo" className={`overflow-hidden rounded-2xl border border-line bg-surface p-2 ${className}`}>
      <p className="px-1 pb-1 text-[10px] tracking-wider text-muted uppercase">Quảng cáo</p>
      <ins
        className="adsbygoogle block"
        style={{ display: "block", minHeight: 100 }}
        data-ad-client={cfg.client}
        data-ad-slot={cfg.slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
