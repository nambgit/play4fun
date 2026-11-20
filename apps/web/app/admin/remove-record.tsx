"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Admin: take down an implausible record */
export function RemoveRecord({ userId, recordKey }: { userId: string; recordKey: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        if (!confirm("Gỡ kỷ lục này khỏi bảng xếp hạng?")) return;
        setBusy(true);
        await fetch("/api/admin/records", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ userId, key: recordKey }) });
        router.refresh();
      }}
      className="rounded-md px-1.5 py-0.5 text-xs text-muted hover:bg-[#e5484d]/10 hover:text-[#e5484d]"
    >
      Gỡ
    </button>
  );
}
