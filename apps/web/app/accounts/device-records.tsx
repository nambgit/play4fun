"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { syncRecords } from "@/lib/record-sync";

/** Manual "sync now" — records sync automatically, this is for peace of mind */
export function DeviceRecords() {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  return (
    <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
      Kỷ lục trên máy này được gửi lên tự động.
      <button
        type="button"
        disabled={state === "busy"}
        onClick={async () => {
          setState("busy");
          const res = await syncRecords(true);
          setState(res ? "done" : "error");
          router.refresh();
        }}
        className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-semibold text-brand hover:bg-brand-soft"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${state === "busy" ? "animate-spin" : ""}`} aria-hidden="true" />
        {state === "done" ? "Đã đồng bộ" : state === "error" ? "Thử lại" : "Đồng bộ ngay"}
      </button>
    </p>
  );
}
