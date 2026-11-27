/**
 * Word-chain dictionary index shared by the solo "Nối từ" game (web), the duel game (server, which
 * validates every word) and the duel's vs-computer mode (web).
 *
 * Every word has two syllables; the next word must start with the last syllable of the previous
 * one ("con mèo" → "mèo mướp"). Lookups ignore tone-mark placement ("hòa" = "hoà").
 */
import { WORDS } from "./dictionary";
import { MORE_WORDS } from "./dictionary-more";

export const norm = (s: string) => s.normalize("NFC").toLowerCase().trim().replace(/\s+/g, " ");
export const syllables = (w: string) => w.split(" ");
export const lastSyllable = (w: string) => syllables(w)[1];

const TONES = /[̣̀́̃̉]/g;
/**
 * Spelling-independent key of a syllable: the tone mark is moved to the end, so the old and new
 * tone placements match ("hòa" = "hoà", "thủy" = "thuỷ").
 */
export function sylKey(syl: string) {
  const d = norm(syl).normalize("NFD");
  const tone = d.match(TONES)?.[0] ?? "";
  return d.replace(TONES, "").normalize("NFC") + tone;
}
const wordKey = (w: string) => syllables(w).map(sylKey).join(" ");

/** First-syllable key → words starting with it (dictionary spelling) */
const BY_FIRST = new Map<string, string[]>();
/** Word key → dictionary spelling */
const ALL = new Map<string, string>();
/**
 * Words from the hand-picked core list (dictionary.ts). The computer prefers these, so it mostly
 * says the most common words; the larger MORE_WORDS list mainly lets players use more real words
 * and keeps fewer syllables a dead end.
 */
const CORE = new Set<string>();
for (const [list, core] of [
  [WORDS, true],
  [MORE_WORDS, false],
] as const) {
  for (const raw of list) {
    const w = norm(raw);
    const k = wordKey(w);
    if (ALL.has(k) || syllables(w).length !== 2) continue;
    ALL.set(k, w);
    if (core) CORE.add(w);
    const first = sylKey(syllables(w)[0]);
    const words = BY_FIRST.get(first);
    if (words) words.push(w);
    else BY_FIRST.set(first, [w]);
  }
}

export const dictionarySize = ALL.size;
export const coreWords = () => [...CORE];
export const isCore = (w: string) => CORE.has(w);

/** Dictionary spelling of a two-syllable word, or null if it is not in the dictionary */
export const lookup = (word: string) => ALL.get(wordKey(norm(word))) ?? null;

/** Unused words starting with this syllable */
export const followers = (syl: string, used: ReadonlySet<string>) => (BY_FIRST.get(sylKey(syl)) ?? []).filter((w) => !used.has(w));

/** Core words of a pool if there are any, otherwise the whole pool */
export function preferCore(words: string[]) {
  const core = words.filter((w) => CORE.has(w));
  return core.length ? core : words;
}

/** Words that can still be answered after (at least `min` unused followers other than the word itself) */
export const continuable = (words: string[], used: ReadonlySet<string>, min = 1) =>
  words.filter((w) => !used.has(w) && followers(lastSyllable(w), used).filter((f) => f !== w).length >= min);
