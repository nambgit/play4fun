"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

function StageSkeleton() {
  return <div className="mx-auto aspect-square w-full max-w-[min(640px,calc(100dvh-11rem))] min-w-[280px] animate-pulse rounded-2xl bg-[#07060d]" />;
}

/** Playable games, loaded client-side only (they use canvas / window). Add new games here. */
const PLAYABLE: Record<string, ComponentType> = {
  "pixel-dodge": dynamic(() => import("@/games/pixel-dodge/pixel-dodge"), { ssr: false, loading: StageSkeleton }),
};

export function GameStage({ slug }: { slug: string }) {
  const Game = PLAYABLE[slug];
  return Game ? <Game /> : null;
}
