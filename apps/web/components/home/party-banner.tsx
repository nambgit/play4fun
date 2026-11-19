import { ArrowRight, Check, Smartphone } from "lucide-react";
import Link from "next/link";

const POINTS = ["Tạo phòng trong 3 giây, chia sẻ bằng mã 5 ký tự", "Mỗi người dùng điện thoại của mình", "Từ 3 đến 50 người, hợp cả lớp học lẫn cả phòng ban"];

export function PartyBanner() {
  return (
    <section className="container-page">
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-[#120f24] px-6 py-12 text-white sm:px-12 md:py-16">
        <div className="absolute -top-24 -left-24 -z-10 h-80 w-80 rounded-full bg-[#6b3cf5]/50 blur-[100px]" />
        <div className="absolute -right-20 -bottom-28 -z-10 h-80 w-80 rounded-full bg-[#16b364]/35 blur-[100px]" />
        <div className="bg-dots absolute inset-0 -z-10 opacity-30" />

        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-[#7ee2a8] uppercase">Chơi nhóm</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
              Biến 5 phút giải lao thành một buổi team building.
            </h2>
            <ul className="mt-6 space-y-3">
              {POINTS.map((p) => (
                <li key={p} className="flex items-start gap-3 text-white/80">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#7ee2a8]" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
            <Link
              href="/games/ai-la-gian-diep"
              className="btn mt-8 bg-white px-6 py-3.5 text-base text-[#120f24] hover:bg-white/90"
            >
              Xem các party game
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mx-auto w-full max-w-xs rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur" aria-hidden="true">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Smartphone className="h-4 w-4" />
              Nhập mã để vào phòng
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {"K7QX2".split("").map((ch) => (
                <span key={ch} className="grid aspect-square place-items-center rounded-xl border border-white/15 bg-white/10 font-mono text-2xl font-bold">
                  {ch}
                </span>
              ))}
            </div>
            <div className="mt-5 space-y-2">
              {[
                ["Minh", "Chủ phòng", "bg-[#8c6bff]"],
                ["Lan", "Sẵn sàng", "bg-[#ff6a3d]"],
                ["Hùng", "Sẵn sàng", "bg-[#1a9fe8]"],
              ].map(([name, status, color]) => (
                <div key={name} className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2">
                  <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${color}`}>{name[0]}</span>
                  <span className="text-sm font-medium">{name}</span>
                  <span className="ml-auto text-xs text-[#7ee2a8]">{status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
