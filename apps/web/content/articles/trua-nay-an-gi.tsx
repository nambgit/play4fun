import Link from "next/link";
import { PlayCta, Table, Tip } from "@/components/article/parts";

const GROUPS: { title: string; intro: string; items: string[] }[] = [
  {
    title: "Cơm: no lâu, đủ chất cho buổi chiều",
    intro: "Lựa chọn quen thuộc nhất của dân văn phòng, dễ đổi món mỗi ngày.",
    items: ["Cơm tấm sườn bì chả", "Cơm gà xối mỡ", "Cơm rang dưa bò", "Cơm văn phòng (một mặn, một rau, một canh)", "Cơm chiên hải sản", "Cơm cá kho tộ", "Cơm thịt kho trứng", "Cơm gà Hội An", "Cơm niêu", "Cơm chay"],
  },
  {
    title: "Món nước: bún, phở, miến, hủ tiếu",
    intro: "Ấm bụng, ăn nhanh, hợp những ngày mưa hoặc khi muốn đổi vị.",
    items: ["Phở bò", "Phở gà", "Bún chả", "Bún bò Huế", "Bún riêu cua", "Bún cá", "Miến gà", "Hủ tiếu Nam Vang", "Bánh canh cua", "Mì Quảng"],
  },
  {
    title: "Nhanh gọn khi bận việc",
    intro: "Mua mang về bàn, ăn trong 10 phút, hợp những ngày dí deadline.",
    items: ["Bánh mì thịt", "Bánh mì chảo", "Xôi gà", "Xôi xéo", "Bánh cuốn", "Bánh bao", "Cơm nắm", "Bánh giò"],
  },
  {
    title: "Nhẹ bụng, không buồn ngủ buổi chiều",
    intro: "Ít dầu mỡ, nhiều rau, hợp khi muốn giữ đầu óc tỉnh táo cả chiều.",
    items: ["Gỏi cuốn tôm thịt", "Bún thịt nướng (nhiều rau)", "Salad gà", "Cháo gà", "Bún trộn Nam Bộ", "Canh chua cá với cơm ít", "Miến trộn rau củ"],
  },
  {
    title: "Ăn chung cả nhóm",
    intro: "Khi cả team muốn ngồi lâu hơn một chút, nói chuyện ngoài công việc.",
    items: ["Bánh xèo", "Lẩu nấm", "Bò lá lốt", "Gà nướng cơm lam", "Bún đậu mắm tôm"],
  },
];

export default function Article() {
  const total = GROUPS.reduce((n, g) => n + g.items.length, 0);
  return (
    <>
      <p>
        “Trưa nay ăn gì?” là câu hỏi khó nhất ngày của nhiều dân văn phòng. Cách nhanh nhất là chọn theo <strong>tình trạng của bạn hôm nay</strong>: đang bận thì món mang đi, muốn tỉnh táo buổi chiều thì món nhẹ,
        có thời gian thì rủ cả nhóm đi ăn chung. Dưới đây là {total} món ăn trưa quen thuộc chia theo từng tình huống, kèm mẹo chọn nhanh để không mất 15 phút chỉ để quyết định.
      </p>

      <h2>Chọn nhanh theo tình huống</h2>
      <Table
        head={["Hôm nay bạn…", "Nên chọn"]}
        rows={[
          ["Đang dí deadline", "Bánh mì, xôi, cơm nắm: mang về bàn, ăn nhanh"],
          ["Có cuộc họp quan trọng buổi chiều", "Món nhẹ, ít dầu mỡ: gỏi cuốn, bún thịt nướng nhiều rau"],
          ["Trời mưa, lạnh", "Món nước nóng: phở, bún bò, miến gà"],
          ["Đói từ sáng", "Cơm: cơm tấm, cơm văn phòng"],
          ["Cả team vừa xong dự án", "Ăn chung: bánh xèo, lẩu, bún đậu"],
        ]}
      />

      {GROUPS.map((g) => (
        <section key={g.title}>
          <h2>{g.title}</h2>
          <p>{g.intro}</p>
          <ul>
            {g.items.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        </section>
      ))}

      <h2>Mẹo để bữa trưa không làm bạn buồn ngủ</h2>
      <ul>
        <li>
          <strong>Đừng ăn quá no:</strong> bữa trưa quá nhiều tinh bột và dầu mỡ dễ khiến bạn uể oải đầu giờ chiều.
        </li>
        <li>
          <strong>Thêm rau và đạm:</strong> giúp no lâu hơn mà không nặng bụng.
        </li>
        <li>
          <strong>Đi bộ vài phút sau khi ăn</strong> thay vì ngồi ngay vào bàn.
        </li>
        <li>
          <strong>Uống đủ nước</strong> và để dành cà phê cho lúc thật sự cần.
        </li>
      </ul>
      <Tip title="Hết cãi nhau chọn quán">
        Mỗi người trong nhóm đề xuất một món, rồi bốc thăm hoặc thay phiên nhau “làm chủ thực đơn” mỗi ngày trong tuần. Không ai phải nghĩ mãi, và ai cũng được ăn món mình thích ít nhất một lần.
      </Tip>
      <PlayCta slug="ban-la-mon-an-viet-nao" text="Nghỉ trưa vui một chút: 10 câu hỏi để biết bạn là phở, bánh mì, bún bò, trà sữa, bánh xèo hay chè." />
      <p>
        Ăn xong còn chút thời gian? Xem <Link href="/cam-nang/giai-lao-van-phong">gợi ý giải lao văn phòng</Link> hoặc chơi một ván <Link href="/games/doan-chu">đoán chữ hằng ngày</Link>.
      </p>
    </>
  );
}
