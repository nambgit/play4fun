import { desc, eq, questionSets, sql } from "@play4fun/db";
import { Building2, ChevronRight, Palette, Presentation, Upload } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { NewSetButton } from "./new-set-button";

export const metadata: Metadata = { title: "Studio câu hỏi", robots: { index: false } };
export const dynamic = "force-dynamic";

const STEPS = [
  { icon: Upload, text: "Soạn câu hỏi riêng của công ty, lớp học, hay dán cả danh sách từ Excel" },
  { icon: Palette, text: "Gắn tên, màu và logo công ty — hiện trên màn hình chiếu và điện thoại người chơi" },
  { icon: Presentation, text: "Mở Đố vui team building, chọn bộ của bạn trong sảnh chờ là chơi" },
];

export default async function StudioPage() {
  const user = await currentUser();
  if (!user) redirect("/login?next=/studio");
  const sets = await getDb()
    .select({
      id: questionSets.id,
      title: questionSets.title,
      brandName: questionSets.brandName,
      brandColor: questionSets.brandColor,
      count: sql<number>`jsonb_array_length(${questionSets.questions})::int`,
      updatedAt: questionSets.updatedAt,
    })
    .from(questionSets)
    .where(eq(questionSets.ownerId, user.id))
    .orderBy(desc(questionSets.updatedAt));

  return (
    <div className="container-page py-6 sm:py-10">
      <p className="eyebrow">Gói công ty · miễn phí</p>
      <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-4xl">Studio câu hỏi</h1>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {STEPS.map((s) => (
          <li key={s.text} className="flex gap-3 rounded-2xl border border-line bg-surface p-4 text-sm text-muted shadow-card">
            <s.icon className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
            {s.text}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold">Bộ câu hỏi của bạn</h2>
        <NewSetButton />
      </div>

      {sets.length === 0 ? (
        <div className="mt-4 rounded-3xl border border-dashed border-line p-10 text-center text-sm text-muted">
          <Building2 className="mx-auto h-8 w-8" aria-hidden="true" />
          <p className="mt-3">Chưa có bộ câu hỏi nào. Tạo bộ đầu tiên cho buổi team building sắp tới nhé!</p>
        </div>
      ) : (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sets.map((s) => (
            <li key={s.id}>
              <Link href={`/studio/${s.id}`} className="flex h-full items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-card transition hover:border-brand/30">
                <span className="h-10 w-2 shrink-0 rounded-full" style={{ background: s.brandColor ?? "var(--brand)" }} aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{s.title}</span>
                  <span className="block truncate text-xs text-muted">
                    {s.count} câu hỏi{s.brandName ? ` · ${s.brandName}` : ""}
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
