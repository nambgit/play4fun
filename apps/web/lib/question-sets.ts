import type { QuestionSetItem } from "@play4fun/db";

/** Limits and validation for Studio question sets (shared by the API and the editor) */
export const SET_LIMITS = { sets: 30, questions: 100, title: 80, brand: 60, q: 200, option: 80, logoBytes: 150_000 };

export type SetInput = { title: string; brandName: string | null; brandColor: string | null; logo: string | null; questions: QuestionSetItem[] };

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.normalize("NFC").replace(/\s+/g, " ").trim().slice(0, max) : "");

/** Returns the cleaned set or an error message (Vietnamese, shown in the editor) */
export function validateSet(raw: unknown): { ok: true; set: SetInput } | { ok: false; error: string } {
  const r = (raw ?? {}) as Record<string, unknown>;
  const title = clean(r.title, SET_LIMITS.title);
  if (!title) return { ok: false, error: "Bộ câu hỏi cần có tên." };
  const brandName = clean(r.brandName, SET_LIMITS.brand) || null;
  const brandColor = typeof r.brandColor === "string" && /^#[0-9a-f]{6}$/i.test(r.brandColor) ? r.brandColor.toLowerCase() : null;
  let logo: string | null = null;
  if (typeof r.logo === "string" && r.logo) {
    if (!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(r.logo)) return { ok: false, error: "Logo phải là ảnh PNG, JPEG hoặc WebP." };
    if (r.logo.length > SET_LIMITS.logoBytes * 1.37) return { ok: false, error: "Logo quá lớn (tối đa ~150 KB)." };
    logo = r.logo;
  }
  const list = Array.isArray(r.questions) ? r.questions : [];
  if (list.length > SET_LIMITS.questions) return { ok: false, error: `Tối đa ${SET_LIMITS.questions} câu hỏi mỗi bộ.` };
  const questions: QuestionSetItem[] = [];
  for (const [i, item] of list.entries()) {
    const it = (item ?? {}) as Record<string, unknown>;
    const q = clean(it.q, SET_LIMITS.q);
    const options = (Array.isArray(it.options) ? it.options : []).map((o) => clean(o, SET_LIMITS.option));
    const correct = Number(it.correct);
    if (!q && options.every((o) => !o)) continue; // empty row
    if (!q) return { ok: false, error: `Câu ${i + 1}: chưa có nội dung câu hỏi.` };
    // Keep the author's order; drop empty option slots but remember where the correct one moved
    const kept = options.map((o, idx) => ({ o, idx })).filter((x) => x.o).slice(0, 4);
    if (kept.length < 2) return { ok: false, error: `Câu ${i + 1}: cần ít nhất 2 đáp án.` };
    const newCorrect = kept.findIndex((x) => x.idx === correct);
    if (!Number.isInteger(correct) || newCorrect < 0) return { ok: false, error: `Câu ${i + 1}: chọn đáp án đúng.` };
    questions.push({ q, options: kept.map((x) => x.o), correct: newCorrect });
  }
  return { ok: true, set: { title, brandName, brandColor, logo, questions } };
}

/** Bulk import: one question per line — "Câu hỏi | Đáp án đúng | Sai 1 | Sai 2 | Sai 3" */
export function parseBulk(text: string): QuestionSetItem[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.split("|").map((p) => p.trim()))
    .filter((p) => p.length >= 3 && p[0] && p[1] && p[2])
    .map((p) => ({ q: p[0], options: p.slice(1, 5), correct: 0 }));
}
