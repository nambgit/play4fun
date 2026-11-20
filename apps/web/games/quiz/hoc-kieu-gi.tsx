"use client";

import { getGame } from "@/lib/games";
import { HOC_KIEU_GI } from "./content/hoc-kieu-gi";
import { QuizGame } from "./quiz-game";

const accent = getGame("ban-hoc-kieu-gi")!.cover;

export default function Play() {
  return <QuizGame quiz={HOC_KIEU_GI} accent={accent} />;
}
