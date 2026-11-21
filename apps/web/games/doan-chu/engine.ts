/**
 * Đoán chữ hằng ngày — guess a 5-letter Vietnamese word in 6 tries (pure logic, no React).
 *
 * Letters are compared without diacritics (đ = d), so "nguoi" stands for "người". A guess is
 * accepted if it is a well-formed Vietnamese syllable (onset + rhyme), which lets players
 * type any real word without shipping a full dictionary. Everyone gets the same word per day
 * (Vietnam time); practice mode picks random words.
 */
import { ANSWERS, type Answer } from "./words";

export const LENGTH = 5;
export const TRIES = 6;
/** Letters used by Vietnamese without diacritics (no f, j, w, z) */
export const KEY_ROWS = ["e r t y u i o p", "a s d g h k l", "x c v b n m q"].map((r) => r.split(" "));

export type Mark = "hit" | "near" | "miss";

// ------------------------------------------------------------ syllable check

const ONSETS = ["ngh", "ch", "gh", "gi", "kh", "ng", "nh", "ph", "qu", "th", "tr", "b", "c", "d", "g", "h", "k", "l", "m", "n", "p", "r", "s", "t", "v", "x", ""];

// Rhymes written without diacritics (ă/â → a, ê → e, ô/ơ → o, ư → u)
const RHYMES = new Set(
  (
    "a ac ach ai am an ang anh ao ap at au ay " +
    "e ec ech em en eng enh eo ep et eu " +
    "i ia ich iec iem ien ieng iep iet ieu im in inh ip it iu " +
    "o oa oac oach oai oam oan oang oanh oao oap oat oay oc oe oen oeo oet oi om on ong ooc oong op ot " +
    "u ua uan uang uat uay uc ue uech uen uenh uet ui um un ung uo uoc uoi uom uon uong uop uot uou up ut uu uy uya uych uyen uyet uynh uyt uyu " +
    "y yen yet yeu"
  ).split(" "),
);

export function isSyllable(word: string) {
  if (!/^[a-z]+$/.test(word)) return false;
  return ONSETS.some((o) => {
    if (!word.startsWith(o)) return false;
    const rhyme = word.slice(o.length);
    // "qu" already carries the u: "quang" = qu + ang; "gi" can stand alone before a consonant ("gin")
    return RHYMES.has(rhyme) || (o === "gi" && RHYMES.has(`i${rhyme}`));
  });
}

export const fold = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();

export function isValidGuess(word: string) {
  return word.length === LENGTH && (isSyllable(word) || ANSWERS.some((a) => a.w === word));
}

// ------------------------------------------------------------ marking

/** Standard marking with repeated letters: exact hits first, then near matches from what is left */
export function mark(guess: string, answer: string): Mark[] {
  const res: Mark[] = Array(LENGTH).fill("miss");
  const left: Record<string, number> = {};
  for (let i = 0; i < LENGTH; i++) {
    if (guess[i] === answer[i]) res[i] = "hit";
    else left[answer[i]] = (left[answer[i]] ?? 0) + 1;
  }
  for (let i = 0; i < LENGTH; i++) {
    if (res[i] === "hit") continue;
    const c = guess[i];
    if (left[c]) {
      res[i] = "near";
      left[c]--;
    }
  }
  return res;
}

/** Best known state per key for the on-screen keyboard */
export function keyMarks(guesses: string[], answer: string) {
  const rank: Record<Mark, number> = { miss: 0, near: 1, hit: 2 };
  const out: Record<string, Mark> = {};
  for (const g of guesses) {
    mark(g, answer).forEach((m, i) => {
      const k = g[i];
      if (!out[k] || rank[m] > rank[out[k]]) out[k] = m;
    });
  }
  return out;
}

// ------------------------------------------------------------ picking words

function daysSinceEpoch(day: string) {
  return Math.floor(Date.UTC(+day.slice(0, 4), +day.slice(5, 7) - 1, +day.slice(8, 10)) / 86_400_000);
}
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

/** Same word for everyone on a given day; walks the list with a step coprime to its length, so no repeats for ANSWERS.length days */
export function dailyAnswer(day: string): Answer {
  const n = ANSWERS.length;
  let step = 7919 % n || 1;
  while (gcd(step, n) !== 1) step++;
  return ANSWERS[(((daysSinceEpoch(day) - 20000) * step) % n + n) % n];
}

export const randomAnswer = (rnd = Math.random): Answer => ANSWERS[Math.floor(rnd() * ANSWERS.length)];

/** Puzzle number shown in the share text (#1 = 21/11/2026) */
export const puzzleNumber = (day: string) => daysSinceEpoch(day) - daysSinceEpoch("2026-11-21") + 1;

export function shareGrid(guesses: string[], answer: string) {
  const sq: Record<Mark, string> = { hit: "🟩", near: "🟨", miss: "⬜" };
  return guesses.map((g) => mark(g, answer).map((m) => sq[m]).join("")).join("\n");
}
