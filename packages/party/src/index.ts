/**
 * Party-game protocol shared by apps/realtime (server, authoritative) and apps/web (client).
 *
 * The server owns all game state. After every change it sends each player a personal
 * `room:state` (ServerState): hidden information (the spy's word, the word being drawn,
 * the trivia answer) only appears in the view of the player allowed to see it.
 */

// ------------------------------------------------------------ games & limits

export type PartySlug = "ai-la-gian-diep" | "ve-doan-chu" | "do-vui-team-building";

export const PARTY_GAMES: Record<PartySlug, { minPlayers: number; maxPlayers: number; /** players may join a game already running */ lateJoin: boolean }> = {
  "ai-la-gian-diep": { minPlayers: 3, maxPlayers: 12, lateJoin: false },
  "ve-doan-chu": { minPlayers: 2, maxPlayers: 12, lateJoin: true },
  "do-vui-team-building": { minPlayers: 2, maxPlayers: 50, lateJoin: true },
};

export const isPartySlug = (s: unknown): s is PartySlug => typeof s === "string" && s in PARTY_GAMES;

export const NAME_MAX = 20;
export const CHAT_MAX = 60;
/** Seconds a disconnected player keeps their seat before being removed */
export const RECONNECT_GRACE_S = 90;

// ------------------------------------------------------------ settings

export type SpySettings = { spies: number; blankSpy: boolean };
export type DrawSettings = { rounds: number; drawTime: number };
export type TriviaCategory = "all" | "chung" | "vietnam" | "khoahoc" | "congso";
export type TriviaSettings = { count: number; seconds: number; category: TriviaCategory };

export type PartySettings = SpySettings | DrawSettings | TriviaSettings;

export const TRIVIA_CATEGORY_LABEL: Record<TriviaCategory, string> = {
  all: "Tất cả chủ đề",
  chung: "Kiến thức chung",
  vietnam: "Việt Nam",
  khoahoc: "Khoa học & tự nhiên",
  congso: "Công sở & công nghệ",
};

export const DRAW_ROUND_OPTIONS = [1, 2, 3];
export const DRAW_TIME_OPTIONS = [60, 80, 100];
export const TRIVIA_COUNT_OPTIONS = [10, 15, 20];
export const TRIVIA_SECONDS_OPTIONS = [15, 20, 30];

/** Max spies allowed for a player count: spies must stay a clear minority */
export const maxSpies = (players: number) => Math.max(1, Math.min(3, Math.floor((players - 1) / 3)));

export function defaultSettings(slug: PartySlug): PartySettings {
  switch (slug) {
    case "ai-la-gian-diep":
      return { spies: 1, blankSpy: false } satisfies SpySettings;
    case "ve-doan-chu":
      return { rounds: 2, drawTime: 80 } satisfies DrawSettings;
    case "do-vui-team-building":
      return { count: 10, seconds: 20, category: "all" } satisfies TriviaSettings;
  }
}

// ------------------------------------------------------------ room

export type PlayerView = { id: string; name: string; connected: boolean };

export type RoomPublic = {
  code: string;
  gameSlug: PartySlug;
  hostId: string;
  status: "lobby" | "playing";
  players: PlayerView[];
  settings: PartySettings;
};

export type ServerState = {
  room: RoomPublic;
  /** The receiving player's id */
  me: string;
  game: GameView | null;
  /** Server clock (ms) when this state was sent — clients use it to align countdowns */
  serverNow: number;
};

export type JoinResult = { ok: true; state: ServerState } | { ok: false; error: JoinError };
export type JoinError = "invalid_input" | "room_not_found" | "game_in_progress" | "room_full" | "unknown_game";

export const JOIN_ERROR_TEXT: Record<JoinError, string> = {
  invalid_input: "Tên hoặc mã phòng chưa hợp lệ.",
  room_not_found: "Không tìm thấy phòng. Kiểm tra lại mã nhé!",
  game_in_progress: "Phòng này đang chơi dở, chờ ván sau nhé.",
  room_full: "Phòng đã đủ người.",
  unknown_game: "Phòng này dành cho trò chơi khác.",
};

// ------------------------------------------------------------ game views

export type GameView = SpyView | DrawView | TriviaView;

export type SpyPhase = "reveal" | "describe" | "vote" | "result" | "over";
export type SpyView = {
  kind: "spy";
  phase: SpyPhase;
  round: number;
  spies: number;
  /** null = blank spy (knows they are the spy, has no word) */
  myWord: string | null;
  /** Only true for a blank spy: regular spies do not know they are the spy */
  iKnowImSpy: boolean;
  amAlive: boolean;
  alive: string[];
  /** Players who confirmed they saw their word (reveal phase) */
  ready: string[];
  /** Speaking order for this round (alive players) */
  order: string[];
  /** Who has voted already (not whom they voted for) */
  voted: string[];
  myVote: string | null;
  /** Result of the last vote */
  lastOut: { id: string; wasSpy: boolean } | null;
  tie: boolean;
  /** Vote tally of the last vote, shown in the result phase */
  tally: { id: string; votes: number }[] | null;
  winner: "civilians" | "spies" | null;
  /** Everyone's role and word, only at the end */
  reveal: { id: string; spy: boolean; word: string | null }[] | null;
  civilianWord: string | null;
  spyWord: string | null;
};

export type DrawPhase = "choosing" | "drawing" | "turnEnd" | "over";
export type DrawView = {
  kind: "draw";
  phase: DrawPhase;
  round: number;
  rounds: number;
  turn: number;
  totalTurns: number;
  drawerId: string;
  /** Drawer only, while choosing */
  choices: string[] | null;
  /** Drawer while drawing; everyone at turn end / game over */
  word: string | null;
  /** Guessers while drawing: letters as "_", spaces kept, some letters revealed as hints */
  mask: string | null;
  endsAt: number;
  guessed: string[];
  scores: Record<string, number>;
  /** Points gained this turn, shown at turn end */
  turnGains: Record<string, number> | null;
};

export type TriviaPhase = "question" | "reveal" | "over";
export type TriviaView = {
  kind: "trivia";
  phase: TriviaPhase;
  index: number;
  total: number;
  seconds: number;
  question: { text: string; options: string[]; category: string } | null;
  endsAt: number;
  answered: string[];
  myAnswer: number | null;
  /** Revealed after the question closes */
  correct: number | null;
  counts: number[] | null;
  myGain: number | null;
  leaderboard: { id: string; score: number; streak: number }[];
};

// ------------------------------------------------------------ client → server game actions

export type GameAction =
  // spy
  | { type: "spy:ready" }
  | { type: "spy:startVote" }
  | { type: "spy:vote"; target: string }
  | { type: "spy:endVote" }
  | { type: "spy:next" }
  // draw
  | { type: "draw:choose"; index: number }
  | { type: "draw:guess"; text: string }
  | { type: "draw:skip" }
  // trivia
  | { type: "trivia:answer"; index: number }
  | { type: "trivia:close" }
  | { type: "trivia:next" }
  // any game: host starts a fresh game with the same players
  | { type: "again" };

/** Drawing ops relayed to everyone (coordinates are 0–1000 on both axes) */
export type DrawOp =
  | { op: "begin"; id: string; color: string; size: number; x: number; y: number }
  | { op: "points"; id: string; pts: number[] }
  | { op: "undo" }
  | { op: "clear" };

export type Stroke = { id: string; color: string; size: number; pts: number[] };

export type ChatMsg = { id: number; kind: "chat" | "system" | "correct" | "close"; name?: string; text: string };

export const DRAW_COLORS = ["#1b1a22", "#ffffff", "#e5484d", "#ff8a3d", "#f5c400", "#16b364", "#1a9fe8", "#6b3cf5", "#ec4899", "#8b5a2b"];
export const DRAW_SIZES = [4, 10, 24];

// ------------------------------------------------------------ text helpers

/** "  Phở   Bò " → "phở bò" */
export const normalizeText = (s: string) => s.normalize("NFC").trim().replace(/\s+/g, " ").toLowerCase();

/** Strip Vietnamese diacritics: "Việt" → "Viet", "đ" → "d" */
export function fold(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

/** Lenient answer key: lowercase, no accents, no punctuation/spaces */
export const answerKey = (s: string) => fold(normalizeText(s)).replace(/[^a-z0-9]/g, "");
