"use client";

import { Download, Share, X } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * "Thêm vào màn hình chính": installs play4fun like an app (the manifest is app/manifest.ts).
 * - Chrome / Edge / Android: the browser's own install prompt (beforeinstallprompt).
 * - iPhone / iPad Safari: no prompt exists, so we show the two taps to do it by hand.
 * Hidden when already running as an installed app, or when the browser offers neither.
 */

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

// Captured as early as possible: the event can fire before any button is on screen
let deferred: InstallEvent | null = null;
const listeners = new Set<() => void>();
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e as InstallEvent;
    listeners.forEach((fn) => fn());
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    listeners.forEach((fn) => fn());
  });
}

const standalone = () => window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

export function useInstall() {
  const [mode, setMode] = useState<"prompt" | "ios" | null>(null);
  useEffect(() => {
    const update = () => setMode(standalone() ? null : deferred ? "prompt" : isIos() ? "ios" : null);
    update();
    listeners.add(update);
    return () => void listeners.delete(update);
  }, []);
  return mode;
}

export function InstallButton({ className = "btn-ghost", label = "Thêm vào màn hình chính" }: { className?: string; label?: string }) {
  const mode = useInstall();
  const [help, setHelp] = useState(false);
  if (!mode) return null;

  const install = async () => {
    if (mode === "ios") return setHelp(true);
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice.catch(() => null);
    deferred = null;
    listeners.forEach((fn) => fn());
  };

  return (
    <>
      <button type="button" onClick={install} className={className}>
        <Download className="h-4 w-4" aria-hidden="true" />
        {label}
      </button>
      {help && (
        <div className="fixed inset-0 z-[70] grid place-items-end bg-black/50 p-4 sm:place-items-center" role="dialog" aria-modal="true" aria-label="Cách thêm play4fun vào màn hình chính" onClick={() => setHelp(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-surface p-5 text-left shadow-lift" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-extrabold">Thêm play4fun vào màn hình chính</h3>
              <button type="button" onClick={() => setHelp(false)} className="rounded-lg p-1 text-muted hover:bg-surface-2" aria-label="Đóng">
                <X className="h-5 w-5" />
              </button>
            </div>
            <ol className="mt-3 space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-soft font-bold text-brand">1</span>
                <span>
                  Bấm nút <b>Chia sẻ</b> <Share className="inline h-4 w-4 align-text-bottom" aria-label="(biểu tượng hình vuông có mũi tên lên)" /> ở thanh dưới của Safari.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-soft font-bold text-brand">2</span>
                <span>
                  Kéo xuống, chọn <b>Thêm vào MH chính</b> (Add to Home Screen), rồi bấm <b>Thêm</b>.
                </span>
              </li>
            </ol>
            <p className="mt-3 text-xs text-muted">Biểu tượng play4fun sẽ nằm trên màn hình điện thoại, mở lên chơi ngay như một ứng dụng.</p>
          </div>
        </div>
      )}
    </>
  );
}
