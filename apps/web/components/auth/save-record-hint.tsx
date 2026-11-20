"use client";

import { CloudCheck, LogIn } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { loginHref } from "./account-menu";

/**
 * One quiet line under a game's result: guests get an optional link to sign in,
 * signed-in players see that the record is saved. Never blocks playing again.
 */
export function SaveRecordHint({ dark = false }: { dark?: boolean }) {
  const { data, isPending } = useSession();
  const pathname = usePathname();
  if (isPending) return null;
  const tone = dark ? "text-white/60 hover:text-white" : "text-muted hover:text-fg";

  if (data?.user) {
    return (
      <p className={`mt-2 inline-flex items-center gap-1.5 text-xs ${dark ? "text-white/60" : "text-muted"}`}>
        <CloudCheck className="h-3.5 w-3.5 text-party" aria-hidden="true" />
        Kỷ lục được lưu vào tài khoản của bạn
      </p>
    );
  }
  return (
    <p className="mt-2">
      <Link href={loginHref(pathname)} className={`inline-flex items-center gap-1.5 text-xs underline-offset-2 hover:underline ${tone}`}>
        <LogIn className="h-3.5 w-3.5" aria-hidden="true" />
        Đăng nhập để lưu kỷ lục lên tài khoản (không bắt buộc)
      </Link>
    </p>
  );
}
