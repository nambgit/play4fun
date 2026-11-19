import {
  bigserial,
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const createdAt = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();

/** arcade = mini-game giải lao, quiz = trắc nghiệm/test vui, party = chơi nhóm realtime */
export const gameType = pgEnum("game_type", ["arcade", "quiz", "party"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 32 }).unique(),
  displayName: varchar("display_name", { length: 64 }).notNull(),
  avatarUrl: text("avatar_url"),
  /** Khách chơi không cần đăng nhập; nâng cấp thành tài khoản thật khi login */
  isGuest: boolean("is_guest").notNull().default(true),
  createdAt: createdAt(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const games = pgTable("games", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  title: varchar("title", { length: 120 }).notNull(),
  type: gameType("type").notNull(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  /** Cấu hình riêng từng game; với quiz thì chứa câu hỏi + kết quả */
  config: jsonb("config").$type<Record<string, unknown>>().notNull().default({}),
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: createdAt(),
});

export const scores = pgTable(
  "scores",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    score: integer("score").notNull(),
    durationMs: integer("duration_ms"),
    /** Dữ liệu thêm: kết quả quiz, replay seed, thiết bị... */
    meta: jsonb("meta").$type<Record<string, unknown>>(),
    createdAt: createdAt(),
  },
  (t) => [
    index("scores_game_score_idx").on(t.gameId, t.score.desc()),
    index("scores_user_idx").on(t.userId),
  ],
);

/** Thử thách hằng ngày: mỗi game tối đa 1 thử thách / ngày, mọi người chơi cùng seed */
export const dailyChallenges = pgTable(
  "daily_challenges",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    day: date("day", { mode: "string" }).notNull(),
    seed: varchar("seed", { length: 64 }).notNull(),
    config: jsonb("config").$type<Record<string, unknown>>(),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("daily_challenges_game_day_uq").on(t.gameId, t.day)],
);

export const dailyResults = pgTable(
  "daily_results",
  {
    challengeId: uuid("challenge_id")
      .notNull()
      .references(() => dailyChallenges.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    score: integer("score").notNull(),
    attempts: integer("attempts").notNull().default(1),
    /** Chuỗi emoji để share kiểu Wordle */
    shareText: text("share_text"),
    createdAt: createdAt(),
  },
  (t) => [
    primaryKey({ columns: [t.challengeId, t.userId] }),
    index("daily_results_challenge_score_idx").on(t.challengeId, t.score.desc()),
  ],
);

/** Lưu kết quả các ván party game (trạng thái phòng đang chơi nằm trong realtime server) */
export const partyMatches = pgTable(
  "party_matches",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    roomCode: varchar("room_code", { length: 8 }).notNull(),
    players: jsonb("players").$type<Array<{ userId?: string; name: string }>>().notNull(),
    results: jsonb("results").$type<Record<string, unknown>>(),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    endedAt: timestamp("ended_at", { withTimezone: true }),
  },
  (t) => [index("party_matches_game_idx").on(t.gameId, t.startedAt.desc())],
);
