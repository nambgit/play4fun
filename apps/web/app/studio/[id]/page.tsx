import { and, eq, questionSets } from "@play4fun/db";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { SetEditor } from "./set-editor";

export const metadata: Metadata = { title: "Soạn bộ câu hỏi", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function EditSetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await currentUser();
  if (!user) redirect(`/login?next=/studio/${id}`);
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const [row] = await getDb()
    .select()
    .from(questionSets)
    .where(and(eq(questionSets.id, id), eq(questionSets.ownerId, user.id)));
  if (!row) notFound();
  return (
    <div className="container-page py-6 sm:py-10">
      <SetEditor
        initial={{ id: row.id, title: row.title, brandName: row.brandName, brandColor: row.brandColor, logo: row.logo, questions: row.questions }}
      />
    </div>
  );
}
