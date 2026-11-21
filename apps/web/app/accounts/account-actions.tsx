"use client";

import { LogOut, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient, signOut } from "@/lib/auth-client";

export function AccountActions() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = async () => {
    setBusy(true);
    setError(null);
    try {
      await signOut();
      router.push("/");
      router.refresh();
    } catch {
      setBusy(false);
      setError("Chưa đăng xuất được, kiểm tra mạng rồi thử lại.");
    }
  };

  const remove = async () => {
    setBusy(true);
    setError(null);
    const { error } = await authClient.deleteUser().catch(() => ({ error: true }));
    if (error) {
      setBusy(false);
      // Deleting needs a recent login; ask to sign in again
      setError("Vì an toàn, hãy đăng xuất rồi đăng nhập lại trước khi xóa tài khoản.");
      return;
    }
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-2 sm:items-end">
      <div className="flex gap-2">
        <button type="button" onClick={logout} disabled={busy} className="btn-ghost h-10 px-4">
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Đăng xuất
        </button>
        {!confirming && (
          <button type="button" onClick={() => setConfirming(true)} disabled={busy} className="btn h-10 px-3 text-muted hover:text-[#e5484d]" aria-label="Xóa tài khoản">
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
      {confirming && (
        <div role="alertdialog" aria-label="Xác nhận xóa tài khoản" className="max-w-xs rounded-2xl border border-[#e5484d]/40 bg-[#e5484d]/5 p-3 text-sm">
          <p className="font-semibold">Xóa tài khoản và toàn bộ kỷ lục đã lưu?</p>
          <p className="mt-1 text-xs text-muted">Không thể hoàn tác. Kỷ lục trên máy này vẫn còn.</p>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={remove} disabled={busy} className="btn h-9 bg-[#e5484d] px-3 text-white hover:bg-[#d13d42]">
              {busy ? "Đang xóa…" : "Xóa vĩnh viễn"}
            </button>
            <button type="button" onClick={() => setConfirming(false)} disabled={busy} className="btn-ghost h-9 px-3">
              Hủy
            </button>
          </div>
          {error && <p className="mt-2 text-xs text-[#e5484d]">{error}</p>}
        </div>
      )}
      {!confirming && error && (
        <p role="alert" className="text-xs text-[#e5484d]">
          {error}
        </p>
      )}
    </div>
  );
}
