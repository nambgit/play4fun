"use client";

import { getGame } from "@/lib/games";
import { DONG_NGHIEP } from "./content/dong-nghiep";
import { QuizGame } from "./quiz-game";

const accent = getGame("ban-la-kieu-dong-nghiep-nao")!.cover;

export default function Play() {
  return <QuizGame quiz={DONG_NGHIEP} accent={accent} />;
}
