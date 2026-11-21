"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Admin: take down an implausible record */
export function RemoveRecord({ userId, recordKey }: { userId: string; recordKey: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      title={failed ? "Chưa gỡ được, thử lại" : undefined}
      onClick={async () => {
        if (!confirm("Gỡ kỷ lục này khỏi bảng xếp hạng?")) return;
        setBusy(true);
        setFailed(false);
        const res = await fetch("/api/admin/records", {
          method: "DELETE",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ userId, key: recordKey }),
        }).catch(() => null);
        setBusy(false);
        if (res?.ok) router.refresh();
        else setFailed(true);
      }}
      className={`rounded-md px-1.5 py-0.5 text-xs hover:bg-[#e5484d]/10 hover:text-[#e5484d] ${failed ? "text-[#e5484d]" : "text-muted"}`}
    >
      {busy ? "…" : failed ? "Lỗi, thử lại" : "Gỡ"}
    </button>
  );
}
