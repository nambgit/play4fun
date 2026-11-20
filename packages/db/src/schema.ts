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

const updatedAt = () =>
  timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date());

/**
 * Người chơi. Better Auth dùng bảng này làm model `user`
 * (name → displayName, image → avatarUrl; xem apps/web/lib/auth.ts).
 * Tên thuộc tính Drizzle phải khớp tên field Better Auth (email, emailVerified, createdAt…).
 */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 32 }).unique(),
  displayName: varchar("display_name", { length: 64 }).notNull(),
  avatarUrl: text("avatar_url"),
  /** Có với tài khoản đăng nhập (Google/Facebook); null với khách */
  email: varchar("email", { length: 255 }).unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  /** Khách chơi không cần đăng nhập; nâng cấp thành tài khoản thật khi login */
  isGuest: boolean("is_guest").notNull().default(true),
  /** Hiện tên + ảnh trên bảng xếp hạng công khai (người chơi tắt được trong /accounts) */
  showOnLeaderboard: boolean("show_on_leaderboard").notNull().default(true),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

// ------------------------------------------------------------ Better Auth (đăng nhập)

/** Phiên đăng nhập (cookie `better-auth.session_token`) */
export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("sessions_user_idx").on(t.userId)],
);

/** Liên kết tài khoản mạng xã hội (Google, Facebook) với người chơi */
export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    /** Id người dùng phía nhà cung cấp */
    accountId: text("account_id").notNull(),
    /** "google" | "facebook" | "credential" */
    providerId: text("provider_id").notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    password: text("password"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("accounts_user_idx").on(t.userId), uniqueIndex("accounts_provider_account_uq").on(t.providerId, t.accountId)],
);

/** Mã tạm (OAuth state…) do Better Auth quản lý */
export const verifications = pgTable(
  "verifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("verifications_identifier_idx").on(t.identifier)],
);

/**
 * Kỷ lục cá nhân lưu theo tài khoản, đồng bộ với localStorage trên máy người chơi.
 * key: "inbox-zero", "go-phim-nhanh:vi", "quiz:gamer-he-nao"… (danh sách trong apps/web/lib/record-keys.ts)
 */
export const userRecords = pgTable(
  "user_records",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    key: varchar("key", { length: 80 }).notNull(),
    /** Điểm cao nhất (kỷ lục) — 0 với bản ghi dạng "kết quả gần nhất" như quiz */
    value: integer("value").notNull().default(0),
    /** Ví dụ: kiểu tính cách gần nhất của quiz */
    meta: jsonb("meta").$type<Record<string, unknown>>(),
    updatedAt: updatedAt(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.key] })],
);

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

// ------------------------------------------------------------ Gói công ty (Studio)

export type QuestionSetItem = { q: string; options: string[]; correct: number };

/**
 * Bộ câu hỏi tự soạn cho Đố vui team building, kèm thương hiệu (tên, màu, logo) hiện trong phòng chơi.
 * Không công khai: chỉ người có id (uuid, không đoán được) mới dùng được — chủ bộ chọn trong sảnh chờ.
 */
export const questionSets = pgTable(
  "question_sets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 80 }).notNull(),
    brandName: varchar("brand_name", { length: 60 }),
    /** "#rrggbb" */
    brandColor: varchar("brand_color", { length: 7 }),
    /** Logo nhỏ (PNG/JPEG/WebP ≤ 150 KB) dạng data URL */
    logo: text("logo"),
    questions: jsonb("questions").$type<QuestionSetItem[]>().notNull().default([]),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("question_sets_owner_idx").on(t.ownerId)],
);
