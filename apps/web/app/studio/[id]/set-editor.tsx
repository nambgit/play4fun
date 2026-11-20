"use client";

import type { QuestionSetItem } from "@play4fun/db";
import { ArrowDown, ArrowLeft, ArrowUp, Check, ClipboardPaste, ImagePlus, Play, Plus, Save, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SET_LIMITS, parseBulk } from "@/lib/question-sets";

type SetData = { id: string; title: string; brandName: string | null; brandColor: string | null; logo: string | null; questions: QuestionSetItem[] };

const LETTERS = ["A", "B", "C", "D"];
const emptyQuestion = (): QuestionSetItem => ({ q: "", options: ["", "", "", ""], correct: 0 });
const padOptions = (q: QuestionSetItem): QuestionSetItem => ({ ...q, options: [...q.options, "", "", "", ""].slice(0, 4) });

/** Shrink an uploaded logo to ≤256px WebP in the browser so it stays small */
async function shrinkLogo(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });
    const scale = Math.min(1, 256 / Math.max(img.width, img.height));
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(img.width * scale));
    c.height = Math.max(1, Math.round(img.height * scale));
    c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
    const webp = c.toDataURL("image/webp", 0.85);
    return webp.startsWith("data:image/webp") ? webp : c.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function SetEditor({ initial }: { initial: SetData }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial.title);
  const [brandName, setBrandName] = useState(initial.brandName ?? "");
  const [brandColor, setBrandColor] = useState(initial.brandColor ?? "#6b3cf5");
  const [logo, setLogo] = useState<string | null>(initial.logo);
  const [questions, setQuestions] = useState<QuestionSetItem[]>(initial.questions.length ? initial.questions.map(padOptions) : [emptyQuestion()]);
  const [bulk, setBulk] = useState<string | null>(null);
  const [status, setStatus] = useState<{ kind: "idle" | "saving" | "saved" | "error"; text?: string }>({ kind: "idle" });
  const [dirty, setDirty] = useState(false);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const touch = <T,>(fn: (v: T) => void) => (v: T) => {
    fn(v);
    setDirty(true);
    setStatus({ kind: "idle" });
  };
  const updateQ = (i: number, patch: Partial<QuestionSetItem>) => touch(setQuestions)(questions.map((q, j) => (j === i ? { ...q, ...patch } : q)));
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= questions.length) return;
    const next = [...questions];
    [next[i], next[j]] = [next[j], next[i]];
    touch(setQuestions)(next);
  };

  const save = async () => {
    setStatus({ kind: "saving" });
    const res = await fetch(`/api/sets/${initial.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title, brandName, brandColor, logo, questions }),
    }).catch(() => null);
    const data = (await res?.json().catch(() => ({}))) as { ok?: boolean; count?: number; error?: string };
    if (res?.ok && data.ok) {
      setDirty(false);
      setStatus({ kind: "saved", text: `Đã lưu ${data.count} câu hỏi` });
      router.refresh();
    } else setStatus({ kind: "error", text: data?.error ?? "Chưa lưu được, thử lại nhé." });
  };

  const remove = async () => {
    if (!confirm(`Xóa bộ "${title}"? Không thể hoàn tác.`)) return;
    await fetch(`/api/sets/${initial.id}`, { method: "DELETE" });
    setDirty(false);
    router.push("/studio");
    router.refresh();
  };

  const filled = questions.filter((q) => q.q.trim()).length;

  return (
    <div>
      <Link href="/studio" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-fg">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Studio câu hỏi
      </Link>

      {/* Sticky action bar */}
      <div className="sticky top-16 z-20 -mx-4 mt-3 flex flex-wrap items-center gap-2 border-b border-line bg-bg/90 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-4">
        <h1 className="min-w-0 flex-1 truncate text-lg font-extrabold">{title || "Bộ câu hỏi"}</h1>
        <span className={`text-xs ${status.kind === "error" ? "text-[#e5484d]" : "text-muted"}`} role="status">
          {status.kind === "saving" ? "Đang lưu…" : status.text ?? (dirty ? "Chưa lưu" : `${filled} câu hỏi`)}
        </span>
        <button type="button" onClick={save} disabled={status.kind === "saving"} className="btn-primary h-10 px-4">
          {status.kind === "saved" && !dirty ? <Check className="h-4 w-4" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
          Lưu
        </button>
        <Link href="/games/do-vui-team-building" className="btn-ghost h-10 px-4" title="Mở Đố vui team building, chọn bộ này trong sảnh chờ">
          <Play className="h-4 w-4" aria-hidden="true" />
          Dùng để chơi
        </Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* Brand */}
        <aside className="flex flex-col gap-4 self-start lg:sticky lg:top-36">
          <section className="rounded-3xl border border-line bg-surface p-5 shadow-card">
            <label className="block text-sm font-semibold" htmlFor="set-title">
              Tên bộ câu hỏi
            </label>
            <input id="set-title" value={title} maxLength={SET_LIMITS.title} onChange={(e) => touch(setTitle)(e.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-line bg-bg px-3" />

            <label className="mt-4 block text-sm font-semibold" htmlFor="set-brand">
              Tên công ty / đội nhóm <span className="font-normal text-muted">(hiện trên màn hình)</span>
            </label>
            <input id="set-brand" value={brandName} maxLength={SET_LIMITS.brand} placeholder="Ví dụ: Công ty Mây Xanh" onChange={(e) => touch(setBrandName)(e.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-line bg-bg px-3" />

            <div className="mt-4 flex items-center gap-3">
              <label className="text-sm font-semibold" htmlFor="set-color">
                Màu thương hiệu
              </label>
              <input id="set-color" type="color" value={brandColor} onChange={(e) => touch(setBrandColor)(e.target.value)} className="h-9 w-14 cursor-pointer rounded-lg border border-line bg-bg" />
              <span className="font-mono text-xs text-muted">{brandColor}</span>
            </div>

            <p className="mt-4 text-sm font-semibold">Logo</p>
            <div className="mt-1.5 flex items-center gap-3">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element -- local data URL preview
                <img src={logo} alt="Logo" className="h-14 w-14 rounded-xl border border-line bg-white object-contain p-1" />
              ) : (
                <span className="grid h-14 w-14 place-items-center rounded-xl border border-dashed border-line text-muted">
                  <ImagePlus className="h-5 w-5" aria-hidden="true" />
                </span>
              )}
              <label className="btn-ghost h-9 cursor-pointer px-3 text-sm">
                Tải ảnh lên
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) touch(setLogo)(await shrinkLogo(f));
                    e.target.value = "";
                  }}
                />
              </label>
              {logo && (
                <button type="button" onClick={() => touch(setLogo)(null)} className="text-xs text-muted hover:text-[#e5484d]">
                  Bỏ logo
                </button>
              )}
            </div>
          </section>

          {/* Live preview of the branded header */}
          <section aria-label="Xem trước" className="overflow-hidden rounded-3xl border border-line bg-surface shadow-card">
            <div className="flex items-center gap-3 p-4 text-white" style={{ background: brandColor }}>
              {logo && (
                // eslint-disable-next-line @next/next/no-img-element -- local data URL preview
                <img src={logo} alt="" className="h-9 w-9 rounded-lg bg-white object-contain p-0.5" />
              )}
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold">{brandName || "Tên công ty của bạn"}</span>
                <span className="block truncate text-xs text-white/80">Đố vui team building</span>
              </span>
            </div>
            <p className="p-3 text-xs text-muted">Thanh này hiện trên màn hình chiếu và điện thoại người chơi khi dùng bộ câu hỏi.</p>
          </section>

          <button type="button" onClick={remove} className="inline-flex items-center gap-1.5 self-start px-1 text-xs text-muted hover:text-[#e5484d]">
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            Xóa bộ câu hỏi này
          </button>
        </aside>

        {/* Questions */}
        <section aria-label="Câu hỏi">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-bold">
              Câu hỏi <span className="font-normal text-muted">({questions.length}/{SET_LIMITS.questions})</span>
            </h2>
            <button type="button" onClick={() => setBulk(bulk === null ? "" : null)} className="btn-ghost h-9 px-3 text-sm">
              <ClipboardPaste className="h-4 w-4" aria-hidden="true" />
              Dán nhiều câu
            </button>
          </div>

          {bulk !== null && (
            <div className="mt-3 rounded-2xl border border-brand/30 bg-brand-soft p-4">
              <p className="text-sm">
                Mỗi dòng một câu: <code className="rounded bg-surface px-1.5 py-0.5 text-xs">Câu hỏi | Đáp án đúng | Sai 1 | Sai 2 | Sai 3</code>. Có thể sao chép từ Excel (nối các cột bằng dấu
                |).
              </p>
              <textarea
                value={bulk}
                onChange={(e) => setBulk(e.target.value)}
                rows={6}
                aria-label="Dán câu hỏi"
                placeholder={"Năm thành lập công ty? | 2015 | 2012 | 2018 | 2020\nGiá trị cốt lõi đầu tiên? | Tận tâm | Nhanh | Rẻ"}
                className="mt-2 w-full rounded-xl border border-line bg-surface p-3 font-mono text-sm"
              />
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const added = parseBulk(bulk).map(padOptions);
                    const base = questions.filter((q) => q.q.trim() || q.options.some((o) => o.trim()));
                    touch(setQuestions)([...base, ...added].slice(0, SET_LIMITS.questions));
                    setBulk(null);
                  }}
                  className="btn-primary h-9 px-3 text-sm"
                >
                  Thêm {parseBulk(bulk).length} câu
                </button>
                <button type="button" onClick={() => setBulk(null)} className="btn-ghost h-9 px-3 text-sm">
                  Hủy
                </button>
              </div>
            </div>
          )}

          <ol className="mt-4 space-y-3">
            {questions.map((q, i) => (
              <li key={i} className="rounded-2xl border border-line bg-surface p-4 shadow-card">
                <div className="flex items-start gap-2">
                  <span className="mt-2.5 w-7 shrink-0 font-mono text-sm font-bold text-muted">{i + 1}.</span>
                  <textarea
                    value={q.q}
                    maxLength={SET_LIMITS.q}
                    rows={2}
                    onChange={(e) => updateQ(i, { q: e.target.value })}
                    placeholder="Nội dung câu hỏi"
                    aria-label={`Câu hỏi ${i + 1}`}
                    className="min-w-0 flex-1 resize-y rounded-xl border border-line bg-bg px-3 py-2 text-sm"
                  />
                  <div className="flex shrink-0 flex-col gap-1">
                    <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Lên" className="grid h-7 w-7 place-items-center rounded-lg text-muted hover:bg-surface-2 disabled:opacity-30">
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => move(i, 1)} disabled={i === questions.length - 1} aria-label="Xuống" className="grid h-7 w-7 place-items-center rounded-lg text-muted hover:bg-surface-2 disabled:opacity-30">
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => touch(setQuestions)(questions.filter((_, j) => j !== i))} aria-label="Xóa câu" className="grid h-7 w-7 place-items-center rounded-lg text-muted hover:bg-[#e5484d]/10 hover:text-[#e5484d]">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 grid gap-2 sm:ml-9 sm:grid-cols-2" role="radiogroup" aria-label={`Đáp án câu ${i + 1}`}>
                  {q.options.map((o, k) => (
                    <div key={k} className={`flex items-center gap-2 rounded-xl border px-2 py-1.5 ${q.correct === k ? "border-party bg-party-soft" : "border-line"}`}>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={q.correct === k}
                        aria-label={`Đáp án ${LETTERS[k]} là đáp án đúng`}
                        onClick={() => updateQ(i, { correct: k })}
                        className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold ${q.correct === k ? "bg-party text-white" : "bg-surface-2 text-muted"}`}
                      >
                        {q.correct === k ? <Check className="h-3.5 w-3.5" /> : LETTERS[k]}
                      </button>
                      <input
                        value={o}
                        maxLength={SET_LIMITS.option}
                        onChange={(e) => updateQ(i, { options: q.options.map((x, j) => (j === k ? e.target.value : x)) })}
                        placeholder={k < 2 ? `Đáp án ${LETTERS[k]}` : `Đáp án ${LETTERS[k]} (không bắt buộc)`}
                        aria-label={`Câu ${i + 1}, đáp án ${LETTERS[k]}`}
                        className="h-8 min-w-0 flex-1 bg-transparent text-sm outline-none"
                      />
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ol>
          {questions.length < SET_LIMITS.questions && (
            <button type="button" onClick={() => touch(setQuestions)([...questions, emptyQuestion()])} className="btn-ghost mt-3 w-full">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Thêm câu hỏi
            </button>
          )}
          <p className="mt-3 text-xs text-muted">Bấm vào chữ cái để đánh dấu đáp án đúng. Đáp án giữ nguyên thứ tự bạn soạn khi chơi.</p>
        </section>
      </div>
    </div>
  );
}
