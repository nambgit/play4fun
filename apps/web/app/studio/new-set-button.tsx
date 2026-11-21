"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function NewSetButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="text-right">
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setError(null);
          const res = await fetch("/api/sets", { method: "POST", headers: { "content-type": "application/json" }, body: "{}" }).catch(() => null);
          const data = ((await res?.json().catch(() => ({}))) ?? {}) as { id?: string; error?: string };
          if (data.id) router.push(`/studio/${data.id}`);
          else {
            setError(data.error ?? "Chưa tạo được, thử lại nhé.");
            setBusy(false);
          }
        }}
        className="btn-primary h-10 px-4"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        {busy ? "Đang tạo…" : "Tạo bộ mới"}
      </button>
      {error && <p className="mt-1 text-xs text-[#e5484d]">{error}</p>}
    </div>
  );
}
