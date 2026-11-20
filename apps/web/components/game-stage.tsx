"use client";

import dynamic from "next/dynamic";
import { useEffect, type ComponentType } from "react";
import { gameLeave } from "@/lib/analytics";
import { getGame } from "@/lib/games";

type Frame = "dark" | "light";

const FRAME_CLASS: Record<Frame, string> = {
  dark: "rounded-2xl bg-[#0b0a12] p-1.5 shadow-lift sm:rounded-3xl sm:p-4",
  // Thin mat on phones (more room for the game), roomier from sm up
  light: "rounded-2xl border border-line bg-surface-2 p-1.5 shadow-card sm:rounded-3xl sm:p-5",
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
  "deadline-dash": {
    Game: dynamic(() => import("@/games/deadline-dash/deadline-dash"), { ssr: false, loading: skeleton("light") }),
    frame: "light",
  },
  "bai-kiem-tra-15-phut": {
    Game: dynamic(() => import("@/games/kiem-tra-15-phut/kiem-tra-15-phut"), { ssr: false, loading: skeleton("light") }),
    frame: "light",
  },
  "go-phim-nhanh": {
    Game: dynamic(() => import("@/games/go-phim-nhanh/go-phim-nhanh"), { ssr: false, loading: skeleton("light") }),
    frame: "light",
  },
  // --- Quizzes (shared engine in games/quiz) ---
  "ban-la-kieu-dong-nghiep-nao": {
    Game: dynamic(() => import("@/games/quiz/dong-nghiep"), { ssr: false, loading: skeleton("light") }),
    frame: "light",
  },
  "ban-hoc-kieu-gi": {
    Game: dynamic(() => import("@/games/quiz/hoc-kieu-gi"), { ssr: false, loading: skeleton("light") }),
    frame: "light",
  },
  "gamer-he-nao": {
    Game: dynamic(() => import("@/games/quiz/gamer"), { ssr: false, loading: skeleton("light") }),
    frame: "light",
  },
  // --- Party games (realtime rooms, server in apps/realtime) ---
  "ai-la-gian-diep": {
    Game: dynamic(() => import("@/games/party/spy"), { ssr: false, loading: skeleton("light") }),
    frame: "light",
  },
  "ve-doan-chu": {
    Game: dynamic(() => import("@/games/party/draw"), { ssr: false, loading: skeleton("light") }),
    frame: "light",
  },
  "do-vui-team-building": {
    Game: dynamic(() => import("@/games/party/trivia"), { ssr: false, loading: skeleton("light") }),
    frame: "light",
  },
};

export function GameStage({ slug }: { slug: string }) {
  // Navigating to another page in the middle of a round counts as "quit" (with play time)
  useEffect(() => () => gameLeave(slug), [slug]);
  const entry = PLAYABLE[slug];
  if (!entry) return null;
  // Light frames get a soft tint of the game's own colours, so the space around
  // narrower games reads as a designed mat rather than an empty grey box
  const cover = getGame(slug)?.cover;
  const tint =
    entry.frame === "light" && cover
      ? {
          backgroundImage: `linear-gradient(135deg, color-mix(in srgb, ${cover[0]} 16%, var(--surface-2)), color-mix(in srgb, ${cover[1]} 16%, var(--surface-2)))`,
        }
      : undefined;
  return (
    <div className={`self-start ${FRAME_CLASS[entry.frame]}`} style={tint}>
      <entry.Game />
    </div>
  );
}
