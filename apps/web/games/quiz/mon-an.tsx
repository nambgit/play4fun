"use client";

import { getGame } from "@/lib/games";
import { MON_AN } from "./content/mon-an";
import { QuizGame } from "./quiz-game";

const accent = getGame("ban-la-mon-an-viet-nao")!.cover;

export default function Play() {
  return <QuizGame quiz={MON_AN} accent={accent} />;
}
