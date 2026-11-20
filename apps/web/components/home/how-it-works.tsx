import { MousePointerClick, Share2, Timer } from "lucide-react";

const STEPS = [
  {
    icon: MousePointerClick,
    title: "Chọn một game",
    body: "Không tải app, không đăng ký. Bấm vào là chơi — trên máy tính hay điện thoại đều mượt.",
  },
  {
    icon: Timer,
    title: "Chơi trong 1–5 phút",
    body: "Vừa đủ cho giờ giải lao, giữa hai tiết học hay lúc chờ trận. Không lo bị cuốn quá giờ.",
  },
  {
    icon: Share2,
    title: "Khoe kết quả",
    body: "Mỗi ván có thẻ kết quả đẹp để chia sẻ. Rủ đồng nghiệp, bạn bè vào so điểm.",
  },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="cach-choi" className="container-page">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Cách chơi</p>
        <h2 id="cach-choi" className="mt-1.5 text-2xl font-extrabold tracking-tight sm:mt-2 sm:text-4xl">
          Đơn giản như mở một tab mới
        </h2>
      </div>
      <ol className="mt-8 grid gap-3 sm:mt-12 md:grid-cols-3 md:gap-5">
        {STEPS.map((s, i) => (
          <li key={s.title} className="relative flex gap-4 rounded-2xl border border-line bg-surface p-4 shadow-card md:block md:p-6">
            <span className="absolute top-5 right-6 hidden text-5xl font-extrabold text-surface-2 select-none md:block" aria-hidden="true">
              0{i + 1}
            </span>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand md:h-12 md:w-12">
              <s.icon className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-bold md:mt-5 md:text-lg">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted md:mt-2">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
