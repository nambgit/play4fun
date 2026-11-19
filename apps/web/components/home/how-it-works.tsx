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
        <h2 id="cach-choi" className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Đơn giản như mở một tab mới
        </h2>
      </div>
      <ol className="mt-12 grid gap-5 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <li key={s.title} className="relative rounded-2xl border border-line bg-surface p-6 shadow-card">
            <span className="absolute top-5 right-6 text-5xl font-extrabold text-surface-2 select-none" aria-hidden="true">
              0{i + 1}
            </span>
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-soft text-brand">
              <s.icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
