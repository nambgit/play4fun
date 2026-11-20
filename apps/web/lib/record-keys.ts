/**
 * Personal records that can be saved to an account (shared by the server API and the browser).
 *
 * Games keep writing their best score to localStorage exactly as before; when the player is
 * signed in, lib/record-sync merges localStorage with the account (highest value wins).
 */

export type RecordDef = {
  /** Key stored in the database (user_records.key) */
  key: string;
  /** localStorage key the game already uses */
  storage: string;
  /** Game page slug, for links on the account page */
  slug: string;
  label: string;
  /**
   * best   → numeric best score, keep the highest
   * latest → last quiz result (type id kept in meta), most recent wins
   */
  kind: "best" | "latest";
  unit?: string;
  /** Sanity cap for self-reported scores */
  max?: number;
};

const QUIZZES: [string, string][] = [
  ["ban-la-kieu-dong-nghiep-nao", "Bạn là kiểu đồng nghiệp nào?"],
  ["ban-hoc-kieu-gi", "Bạn học kiểu gì?"],
  ["gamer-he-nao", "Bạn là gamer hệ nào?"],
];

export const RECORDS: RecordDef[] = [
  { key: "inbox-zero", storage: "p4f:inbox-zero:best:v2", slug: "inbox-zero", label: "Inbox Zero", kind: "best", unit: "điểm", max: 1_000_000 },
  { key: "deadline-dash", storage: "p4f:deadline-dash:best", slug: "deadline-dash", label: "Deadline Dash", kind: "best", unit: "điểm", max: 10_000_000 },
  { key: "bai-kiem-tra-15-phut", storage: "p4f:kiem-tra-15-phut:best", slug: "bai-kiem-tra-15-phut", label: "Kiểm tra 15 phút", kind: "best", unit: "câu đúng", max: 1_000 },
  { key: "pixel-dodge", storage: "p4f:pixel-dodge:best", slug: "pixel-dodge", label: "Pixel Dodge", kind: "best", unit: "điểm", max: 10_000_000 },
  { key: "go-phim-nhanh:vi", storage: "p4f:go-phim-nhanh:best:vi", slug: "go-phim-nhanh", label: "Gõ phím thần tốc · Tiếng Việt", kind: "best", unit: "WPM", max: 400 },
  { key: "go-phim-nhanh:en", storage: "p4f:go-phim-nhanh:best:en", slug: "go-phim-nhanh", label: "Gõ phím thần tốc · English", kind: "best", unit: "WPM", max: 400 },
  ...QUIZZES.map(([slug, label]): RecordDef => ({ key: `quiz:${slug}`, storage: `p4f:quiz:${slug}:last`, slug, label, kind: "latest" })),
];

export const RECORD_BY_KEY = new Map(RECORDS.map((r) => [r.key, r]));

/** What the browser sends / the server returns for one record */
export type RecordValue = { key: string; value: number; meta?: { result?: string } | null; updatedAt?: string };
