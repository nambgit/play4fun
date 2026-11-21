import { DONG_NGHIEP } from "@/games/quiz/content/dong-nghiep";
import { GAMER } from "@/games/quiz/content/gamer";
import { HOC_KIEU_GI } from "@/games/quiz/content/hoc-kieu-gi";
import { MON_AN } from "@/games/quiz/content/mon-an";
import { NGHE_NGHIEP } from "@/games/quiz/content/nghe-nghiep";
import type { QuizTypeLite } from "./share";

const BY_SLUG = new Map([DONG_NGHIEP, HOC_KIEU_GI, GAMER, NGHE_NGHIEP, MON_AN].map((q) => [q.slug, q.types.map(({ id, name, emoji, tagline }) => ({ id, name, emoji, tagline }))]));

/** Personality types of a quiz (server side: share pages, OG images) */
export const quizTypes = (slug: string): QuizTypeLite[] | undefined => BY_SLUG.get(slug);
