/**
 * Party-game protocol shared by apps/realtime (server, authoritative) and apps/web (client).
 *
 * The server owns all game state. After every change it sends each player a personal
 * `room:state` (ServerState): hidden information (the spy's word, the word being drawn,
 * the trivia answer) only appears in the view of the player allowed to see it.
 */

// ------------------------------------------------------------ games & limits

export type PartySlug = "ai-la-gian-diep" | "ve-doan-chu" | "do-vui-team-building" | "ma-soi" | "ai-hieu-ai" | "ai-de-nhat" | "noi-tu" | "co-caro";

export const PARTY_GAMES: Record<
  PartySlug,
  {
    minPlayers: number;
    maxPlayers: number;
    /** players may join a game already running */
    lateJoin: boolean;
    /** "Tìm đối thủ": random pairing with a stranger (two-player games) */
    matchmaking?: boolean;
  }
> = {
  "ai-la-gian-diep": { minPlayers: 3, maxPlayers: 12, lateJoin: false },
  "ve-doan-chu": { minPlayers: 2, maxPlayers: 12, lateJoin: true },
  "do-vui-team-building": { minPlayers: 2, maxPlayers: 50, lateJoin: true },
  "ma-soi": { minPlayers: 5, maxPlayers: 16, lateJoin: false },
  "ai-hieu-ai": { minPlayers: 2, maxPlayers: 20, lateJoin: true },
  "ai-de-nhat": { minPlayers: 3, maxPlayers: 20, lateJoin: true },
  "noi-tu": { minPlayers: 2, maxPlayers: 10, lateJoin: false, matchmaking: true },
  "co-caro": { minPlayers: 2, maxPlayers: 2, lateJoin: false, matchmaking: true },
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
/** setId: a Studio question set (company package) instead of the built-in questions */
export type TriviaSettings = { count: number; seconds: number; category: TriviaCategory; setId: string | null };

/** Ma sói: number of werewolves, optional special roles, discussion length */
export type WolfSettings = { wolves: number; seer: boolean; guard: boolean; talkSeconds: number };
/** Ai hiểu ai nhất: number of turns (hot seats) and answer time */
export type HieuSettings = { turns: number; seconds: number };
/** Ai dễ… nhất: number of prompts and voting time */
export type AiDeSettings = { rounds: number; seconds: number };
/** Nối từ (2–10 players): rounds needed to win the match and seconds per turn */
export type DuelSettings = { target: number; seconds: number };
/** Cờ caro: games needed to win the match, seconds per move, "chặn hai đầu" rule */
export type CaroSettings = { target: number; seconds: number; blocked: boolean };

export type PartySettings = SpySettings | DrawSettings | TriviaSettings | WolfSettings | HieuSettings | AiDeSettings | DuelSettings | CaroSettings;

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
export const WOLF_TALK_OPTIONS = [60, 120, 180];
export const HIEU_TURN_OPTIONS = [5, 10, 15];
export const HIEU_SECONDS_OPTIONS = [20, 30];
export const AIDE_ROUND_OPTIONS = [8, 12, 16];
export const AIDE_SECONDS_OPTIONS = [15, 25];
/** Rounds a player must win to take the match */
export const DUEL_TARGET_OPTIONS = [1, 2, 3];
export const DUEL_SECONDS_OPTIONS = [15, 20, 30];
export const CARO_TARGET_OPTIONS = [1, 2, 3];
export const CARO_SECONDS_OPTIONS = [20, 30, 60];

/** Werewolves must stay a minority: 5–7 players → 1, 8–11 → 2, 12–15 → 3, 16 → 4 */
export const maxWolves = (players: number) => Math.max(1, Math.min(4, Math.floor(players / 4)));

/** Max spies allowed for a player count: spies must stay a clear minority */
export const maxSpies = (players: number) => Math.max(1, Math.min(3, Math.floor((players - 1) / 3)));

export function defaultSettings(slug: PartySlug): PartySettings {
  switch (slug) {
    case "ai-la-gian-diep":
      return { spies: 1, blankSpy: false } satisfies SpySettings;
    case "ve-doan-chu":
      return { rounds: 2, drawTime: 80 } satisfies DrawSettings;
    case "do-vui-team-building":
      return { count: 10, seconds: 20, category: "all", setId: null } satisfies TriviaSettings;
    case "ma-soi":
      return { wolves: 1, seer: true, guard: true, talkSeconds: 120 } satisfies WolfSettings;
    case "ai-hieu-ai":
      return { turns: 10, seconds: 20 } satisfies HieuSettings;
    case "ai-de-nhat":
      return { rounds: 12, seconds: 15 } satisfies AiDeSettings;
    case "noi-tu":
      return { target: 2, seconds: 30 } satisfies DuelSettings;
    case "co-caro":
      return { target: 2, seconds: 30, blocked: false } satisfies CaroSettings;
  }
}

// ------------------------------------------------------------ room

export type PlayerView = { id: string; name: string; connected: boolean };

/** Company branding from a Studio question set: shown on the big screen and every phone */
export type RoomBrand = { name: string | null; color: string | null; logo: string | null };

export type RoomPublic = {
  code: string;
  gameSlug: PartySlug;
  hostId: string;
  status: "lobby" | "playing";
  players: PlayerView[];
  settings: PartySettings;
  brand: RoomBrand | null;
  /** The Studio question set in use (title and size only — questions stay on the server) */
  customSet: { id: string; title: string; count: number } | null;
  /**
   * Games started in this room so far (start, "again", rematch, matchmaking). The host's browser
   * sends one "party-start" analytics event each time it goes up, so every game is counted once.
   */
  gameNo: number;
};

export const isUuid = (s: unknown): s is string => typeof s === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

export type ServerState = {
  room: RoomPublic;
  /** The receiving player's id */
  me: string;
  game: GameView | null;
  /** Server clock (ms) when this state was sent — clients use it to align countdowns */
  serverNow: number;
};

export type JoinResult = { ok: true; state: ServerState } | { ok: false; error: JoinError };
/** "match:find": paired at once (state), or queued until an opponent shows up (room:state follows) */
export type MatchResult = { ok: true; state: ServerState } | { ok: true; waiting: true } | { ok: false; error: JoinError };
export type JoinError = "invalid_input" | "room_not_found" | "game_in_progress" | "room_full" | "unknown_game";

export const JOIN_ERROR_TEXT: Record<JoinError, string> = {
  invalid_input: "Tên hoặc mã phòng chưa hợp lệ.",
  room_not_found: "Không tìm thấy phòng. Kiểm tra lại mã nhé!",
  game_in_progress: "Phòng này đang chơi dở, chờ ván sau nhé.",
  room_full: "Phòng đã đủ người.",
  unknown_game: "Phòng này dành cho trò chơi khác.",
};

// ------------------------------------------------------------ game views

export type GameView = SpyView | DrawView | TriviaView | WolfView | HieuView | AiDeView | DuelView | CaroView;

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
  /** Reveal phase after a tied vote: everyone just got a new pair of words */
  redealt: boolean;
  /** Earlier pairs of this game (replaced after tied votes), only at the end */
  pastPairs: { civilianWord: string; spyWord: string }[] | null;
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

export type WolfRole = "wolf" | "villager" | "seer" | "guard";
export type WolfPhase = "reveal" | "night" | "dawn" | "day" | "vote" | "result" | "over";
export type WolfView = {
  kind: "wolf";
  phase: WolfPhase;
  /** Day number (1 after the first night) */
  day: number;
  myRole: WolfRole | null;
  amAlive: boolean;
  alive: string[];
  /** How many of each role are in this game (public) */
  roleCounts: Record<WolfRole, number>;
  /** Fellow werewolves: only for werewolves (and everyone at the end) */
  pack: string[] | null;
  ready: string[];
  /** Deadline of the current timed phase (night / day / vote), 0 if none */
  endsAt: number;
  /** Night: my chosen target (wolf kill, seer check or guard protect) */
  myNightPick: string | null;
  /** Night: werewolves see each other's picks */
  packPicks: Record<string, string> | null;
  /** Seer only: everything learned so far */
  seerLog: { id: string; wolf: boolean }[] | null;
  /** Guard only: who was protected last night (cannot be protected twice in a row) */
  guardLast: string | null;
  /** Dawn: who died in the night (null = nobody) */
  died: string | null;
  voted: string[];
  myVote: string | null;
  tally: { id: string; votes: number }[] | null;
  lastOut: { id: string; role: WolfRole } | null;
  tie: boolean;
  winner: "village" | "wolves" | null;
  reveal: { id: string; role: WolfRole; alive: boolean }[] | null;
};

export type HieuPhase = "answer" | "reveal" | "over";
export type HieuView = {
  kind: "hieu";
  phase: HieuPhase;
  turn: number;
  totalTurns: number;
  /** Player whose answer everyone tries to guess */
  hotSeat: string;
  /** Question text with a {name} placeholder (client fills in the name or "bạn") */
  question: { text: string; options: string[] };
  endsAt: number;
  /** Who has locked in (not what) */
  answered: string[];
  myPick: number | null;
  /** Revealed after the turn closes */
  hotPick: number | null;
  /** Hot seat ran out of time: the turn is skipped */
  skipped: boolean;
  counts: number[] | null;
  gains: Record<string, number> | null;
  scores: Record<string, number>;
};

export type AiDePhase = "vote" | "reveal" | "over";
export type AiDeView = {
  kind: "aide";
  phase: AiDePhase;
  round: number;
  totalRounds: number;
  /** "Ai dễ ngủ gật trong cuộc họp nhất?" */
  prompt: string;
  /** Award the most-voted player gets ("Thánh ngủ gật") */
  title: string;
  endsAt: number;
  /** Who has voted (not for whom: votes stay anonymous) */
  voted: string[];
  myVote: string | null;
  /** After the round: votes received per player, and the most-voted (ties share the title) */
  tally: Record<string, number> | null;
  winners: string[] | null;
  gains: Record<string, number> | null;
  scores: Record<string, number>;
  /** Awards won so far, per player */
  titles: Record<string, string[]>;
};

export type DuelPhase = "play" | "roundEnd" | "over";
export type DuelView = {
  kind: "duel";
  phase: DuelPhase;
  /** Players in turn order (2–10) */
  seats: string[];
  /** Players still in the current round */
  alive: string[];
  /** Knock-outs this round, in order */
  out: { id: string; reason: "stuck" | "timeout" | "skip" | "left" }[];
  /** Player whose turn it is */
  turn: string;
  /** Syllable the next word must start with */
  need: string;
  /** Words this round; by = null for the opening word */
  chain: { word: string; by: string | null }[];
  endsAt: number;
  roundNo: number;
  target: number;
  wins: Record<string, number>;
  /** After a round */
  roundWinner: string | null;
  reason: "stuck" | "timeout" | "skip" | "left" | null;
  /** Words that could have been played (after a timeout / give-up) */
  hints: string[] | null;
  /** When the next round starts (phase roundEnd) */
  nextAt: number;
  /** Your last rejected word, only in your own view */
  myError: { text: string; at: number } | null;
  /** Players who asked for a rematch (phase over) */
  rematch: string[];
  /** Match winner (phase over) */
  champion: string | null;
};

export type CaroPhase = "play" | "roundEnd" | "over";
export type CaroView = {
  kind: "caro";
  phase: CaroPhase;
  seats: [string, string];
  /** Player with X this game (X moves first; alternates every game) */
  x: string;
  turn: string;
  /** 0 empty, 1 X, 2 O; index = row * CARO_SIZE + col */
  board: number[];
  lastMove: number | null;
  /** Cells of the winning five */
  winLine: number[] | null;
  endsAt: number;
  gameNo: number;
  target: number;
  blocked: boolean;
  wins: Record<string, number>;
  /** After a game: null = draw */
  gameWinner: string | null;
  reason: "five" | "timeout" | "resign" | "draw" | null;
  nextAt: number;
  rematch: string[];
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
  // ma sói
  | { type: "wolf:ready" }
  | { type: "wolf:pick"; target: string }
  | { type: "wolf:vote"; target: string }
  | { type: "wolf:startVote" }
  | { type: "wolf:endVote" }
  | { type: "wolf:next" }
  // ai hiểu ai nhất
  | { type: "hieu:pick"; index: number }
  | { type: "hieu:close" }
  | { type: "hieu:next" }
  // ai dễ… nhất
  | { type: "aide:vote"; target: string }
  | { type: "aide:close" }
  | { type: "aide:next" }
  // nối từ đối kháng
  | { type: "duel:word"; text: string }
  | { type: "duel:skip" }
  | { type: "duel:rematch" }
  // cờ caro
  | { type: "caro:move"; cell: number }
  | { type: "caro:resign" }
  | { type: "caro:rematch" }
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
