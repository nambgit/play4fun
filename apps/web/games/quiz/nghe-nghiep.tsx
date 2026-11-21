"use client";

import { getGame } from "@/lib/games";
import { NGHE_NGHIEP } from "./content/nghe-nghiep";
import { QuizGame } from "./quiz-game";

const accent = getGame("ban-hop-nghe-gi")!.cover;

export default function Play() {
  return <QuizGame quiz={NGHE_NGHIEP} accent={accent} />;
}
