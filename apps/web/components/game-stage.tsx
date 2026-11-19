"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

type Frame = "dark" | "light";

const FRAME_CLASS: Record<Frame, string> = {
  dark: "rounded-3xl bg-[#0b0a12] p-2 shadow-lift sm:p-4",
  light: "rounded-3xl border border-line bg-surface-2 p-2 shadow-card sm:p-4",
};

function skeleton(frame: Frame) {
  function StageSkeleton() {
    return (
      <div
        className={`mx-auto w-full animate-pulse rounded-2xl ${
          frame === "dark" ? "aspect-square max-w-[min(640px,calc(100dvh-11rem))] min-w-[280px] bg-[#07060d]" : "h-[560px] max-w-[560px] bg-bg"
        }`}
      />
    );
  }
  return StageSkeleton;
}

/** Playable games, loaded client-side only (they use canvas / window). Add new games here. */
const PLAYABLE: Record<string, { Game: ComponentType; frame: Frame }> = {
  "pixel-dodge": {
    Game: dynamic(() => import("@/games/pixel-dodge/pixel-dodge"), { ssr: false, loading: skeleton("dark") }),
    frame: "dark",
  },
  "inbox-zero": {
    Game: dynamic(() => import("@/games/inbox-zero/inbox-zero"), { ssr: false, loading: skeleton("light") }),
    frame: "light",
  },
};

export function GameStage({ slug }: { slug: string }) {
  const entry = PLAYABLE[slug];
  if (!entry) return null;
  return (
    <div className={`self-start ${FRAME_CLASS[entry.frame]}`}>
      <entry.Game />
    </div>
  );
}
