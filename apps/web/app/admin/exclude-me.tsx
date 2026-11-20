"use client";

import { EyeOff } from "lucide-react";
import { useEffect, useState } from "react";

/** Umami skips tracking when localStorage "umami.disabled" is set: keep the admin's own visits out of the numbers */
export function ExcludeMe() {
  const [off, setOff] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      setOff(!!localStorage.getItem("umami.disabled"));
    } catch {
      setOff(false);
    }
  }, []);
  if (off === null) return null;
  const toggle = () => {
    try {
      if (off) localStorage.removeItem("umami.disabled");
      else localStorage.setItem("umami.disabled", "1");
      setOff(!off);
    } catch {
      /* storage blocked */
    }
  };
  return (
    <button type="button" onClick={toggle} aria-pressed={off} className="btn-ghost h-9 px-3 text-xs">
      <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
      {off ? "Đang không tính lượt truy cập của tôi" : "Không tính lượt truy cập của tôi"}
    </button>
  );
}
