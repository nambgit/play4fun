"use client";

import { getGame } from "@/lib/games";
import { GAMER } from "./content/gamer";
import { QuizGame } from "./quiz-game";

const accent = getGame("gamer-he-nao")!.cover;

export default function Play() {
  return <QuizGame quiz={GAMER} accent={accent} />;
}
