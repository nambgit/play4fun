"use client";

import { useState } from "react";

/** Show / hide my name and avatar on the public leaderboards */
export function LeaderboardToggle({ initial }: { initial: boolean }) {
  const [on, setOn] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const toggle = async () => {
    setBusy(true);
    setFailed(false);
    const res = await fetch("/api/me/preferences", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ showOnLeaderboard: !on }),
    }).catch(() => null);
    if (res?.ok) setOn(!on);
    else setFailed(true);
    setBusy(false);
  };
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-4 shadow-card">
      <span>
        <span className="block text-sm font-semibold">Hiện tên tôi trên bảng xếp hạng</span>
        <span className="block text-xs text-muted">Tên và ảnh đại diện của bạn được hiện công khai cạnh kỷ lục.</span>
        {failed && (
          <span role="alert" className="mt-1 block text-xs text-[#e5484d]">
            Chưa lưu được thay đổi, thử lại nhé.
          </span>
        )}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        disabled={busy}
        onClick={toggle}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${on ? "bg-party" : "bg-line"}`}
      >
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-6" : "left-1"}`} />
      </button>
    </label>
  );
}
