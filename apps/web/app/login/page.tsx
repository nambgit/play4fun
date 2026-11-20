import { Cloud, Gamepad2, ShieldCheck, Trophy } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AUTH_PROVIDERS, DEV_PASSWORD_LOGIN, currentUser } from "@/lib/auth";
import { safeNext } from "@/lib/safe-next";
import { LoginButtons } from "./login-buttons";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập để lưu kỷ lục lên tài khoản. Không bắt buộc — vẫn chơi được mọi game mà không cần đăng nhập.",
  robots: { index: false },
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const BENEFITS = [
  { icon: Cloud, text: "Kỷ lục được lưu lên tài khoản, không mất khi đổi máy hay xóa trình duyệt" },
  { icon: Trophy, text: "Kỷ lục bạn đã có trên máy này được chuyển lên tài khoản ngay" },
  { icon: Gamepad2, text: "Tên của bạn được điền sẵn khi vào phòng chơi nhóm" },
];

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const next = safeNext(params.next);
  if (await currentUser()) redirect(next);

  const providers = (Object.keys(AUTH_PROVIDERS) as (keyof typeof AUTH_PROVIDERS)[]).filter((p) => AUTH_PROVIDERS[p]);
  const error = typeof params.error === "string" ? params.error : null;

  return (
    <div className="container-page grid min-h-[70vh] place-items-center py-10 sm:py-16">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-line bg-surface p-6 shadow-lift sm:p-8">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Đăng nhập</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            <b className="text-fg">Không bắt buộc.</b> Mọi game vẫn chơi được như bình thường khi không đăng nhập. Đăng nhập chỉ để lưu kỷ lục của bạn.
          </p>

          {error && (
            <p role="alert" className="mt-4 rounded-xl bg-[#e5484d]/10 px-3 py-2 text-sm text-[#e5484d]">
              Đăng nhập chưa thành công{error === "email_not_found" ? " vì tài khoản không có email" : ""}. Thử lại hoặc chọn cách khác nhé.
            </p>
          )}

          <div className="mt-6">
            <LoginButtons providers={providers} next={next} devPassword={DEV_PASSWORD_LOGIN} />
          </div>

          <ul className="mt-6 space-y-3 border-t border-line pt-5">
            {BENEFITS.map((b) => (
              <li key={b.text} className="flex gap-3 text-sm text-muted">
                <b.icon className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                {b.text}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-4 flex items-start gap-2 px-2 text-xs leading-relaxed text-muted">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            Play4Fun chỉ lưu tên, ảnh đại diện, email và kỷ lục game của bạn. Không đăng gì lên mạng xã hội của bạn. Xem{" "}
            <Link href="/privacy" className="underline hover:text-fg">
              chính sách quyền riêng tư
            </Link>
            .
          </span>
        </p>
        <p className="mt-3 text-center">
          <Link href={next} className="text-sm font-medium text-muted hover:text-fg">
            ← Quay lại chơi tiếp không cần đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
