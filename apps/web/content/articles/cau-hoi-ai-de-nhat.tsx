import Link from "next/link";
import { PlayCta, Tip } from "@/components/article/parts";

const GROUPS: { topic: string; intro: string; questions: string[] }[] = [
  {
    topic: "Câu hỏi về công sở",
    intro: "Những thói quen văn phòng ai cũng nhận ra, hợp để mở màn buổi họp hay buổi team building.",
    questions: [
      "Ai dễ ngủ gật trong cuộc họp nhất?",
      "Ai dễ vào họp muộn 5 phút nhất?",
      "Ai dễ làm xong việc sát deadline nhất?",
      "Ai giỏi Excel nhất nhóm?",
      "Ai dễ quên tắt mic khi họp online nhất?",
      "Ai uống nhiều cà phê nhất?",
      "Ai dễ rủ cả team order trà sữa nhất?",
      "Ai luôn biết quán ăn trưa ngon nhất?",
      "Ai có bàn làm việc gọn gàng nhất?",
      "Ai luôn có sẵn đồ ăn vặt trên bàn?",
      "Ai đến văn phòng sớm nhất?",
      "Ai dùng sticker nhiều nhất trong nhóm chat?",
      "Ai trả lời tin nhắn nhanh nhất?",
      "Ai làm slide đẹp nhất?",
      "Ai được nhờ sửa máy tính nhiều nhất?",
      "Ai mở nhiều tab trình duyệt nhất?",
      "Ai hay nói “vậy mình chốt nhé” nhất?",
      "Ai bình tĩnh nhất khi có sự cố?",
      "Ai nhớ sinh nhật cả team nhất?",
      "Ai vẫn tươi tỉnh vào sáng thứ Hai?",
    ],
  },
  {
    topic: "Câu hỏi về tính cách, thói quen",
    intro: "Hợp với hội bạn thân hoặc đồng nghiệp đã quen nhau một thời gian.",
    questions: [
      "Ai cười to nhất nhóm?",
      "Ai kể chuyện hài nhất?",
      "Ai lạc quan nhất nhóm?",
      "Ai hay quên đồ nhất?",
      "Ai đúng giờ nhất?",
      "Ai dễ ngủ nướng cuối tuần nhất?",
      "Ai thức khuya nhất?",
      "Ai lên kế hoạch kỹ nhất?",
      "Ai săn sale giỏi nhất?",
      "Ai chụp ảnh đẹp nhất?",
      "Ai dễ chụp ảnh đồ ăn trước khi ăn nhất?",
      "Ai cầm mic lâu nhất khi đi karaoke?",
      "Ai luôn có sẵn sạc dự phòng?",
      "Ai đọc sách nhiều nhất?",
      "Ai dễ lỡ tiết lộ nội dung phim nhất?",
      "Ai nấu ăn ngon nhất?",
      "Ai chọn món lâu nhất khi đi ăn?",
      "Ai chỉ đường giỏi nhất?",
      "Ai giữ bí mật tốt nhất?",
      "Ai lắng nghe giỏi nhất?",
    ],
  },
  {
    topic: "Câu hỏi tình huống vui",
    intro: "Tưởng tượng một chút, gây tranh luận nhiều nhất và thường là phần cười nhiều nhất.",
    questions: [
      "Ai sống sót lâu nhất nếu có đại dịch zombie?",
      "Ai hữu ích nhất nếu cả nhóm lạc trên đảo hoang?",
      "Ai dễ trúng thưởng bốc thăm may mắn nhất?",
      "Ai dễ trở nên nổi tiếng nhất?",
      "Ai dễ khởi nghiệp thành công nhất?",
      "Ai hợp làm trưởng nhóm du lịch nhất?",
      "Ai dễ thắng gameshow truyền hình nhất?",
      "Ai hợp làm YouTuber nhất?",
      "Ai hợp làm MC tiệc cuối năm nhất?",
      "Ai bình tĩnh nhất khi cả tòa nhà mất điện?",
      "Ai dễ bắt chuyện với người lạ trong thang máy nhất?",
      "Ai hăng hái nhất trong buổi team building?",
      "Ai dễ đòi chơi lại khi thua game nhất?",
      "Ai hợp làm thủ quỹ của nhóm nhất?",
      "Ai luôn là người cầm máy chụp ảnh nhóm?",
      "Ai dễ xúc động khi xem phim nhất?",
      "Ai dễ ngủ trên xe khi đi chơi xa nhất?",
      "Ai được giao chọn nhạc trên xe nhất?",
      "Ai mang quà quê lên chia cả team nhất?",
      "Ai lì xì hào phóng nhất?",
    ],
  },
];

export default function Article() {
  return (
    <>
      <p>
        “Ai dễ… nhất?” là trò bình chọn vui: đọc một câu như “Ai dễ ngủ gật trong cuộc họp nhất?”, cả nhóm cùng chỉ (hoặc bấm chọn) người hợp nhất. Trò này khởi động không khí rất nhanh vì ai cũng có ý kiến, và
        câu trả lời thường gây cười. Dưới đây là 60 câu hỏi chia 3 nhóm, kèm cách chơi và lưu ý để không ai thấy bị trêu quá đà.
      </p>

      <h2>Cách chơi “Ai dễ… nhất?”</h2>
      <ol>
        <li>Một người đọc to câu hỏi.</li>
        <li>Đếm “1, 2, 3” rồi mọi người cùng chỉ tay vào người mình chọn (không được chỉ chính mình).</li>
        <li>Người được chỉ nhiều nhất nhận “danh hiệu” của câu đó, ví dụ “Thánh ngủ gật”, và có thể kể một câu chuyện ngắn để “thanh minh”.</li>
        <li>Muốn tính điểm: ai chỉ trùng người được nhiều phiếu nhất thì được 1 điểm. Như vậy mọi người phải đoán xem cả nhóm nghĩ gì.</li>
      </ol>
      <PlayCta slug="ai-de-nhat" text="Bản online: mỗi người bình chọn trên điện thoại, phiếu ẩn danh, máy tự đếm điểm và trao danh hiệu. 3–20 người, hơn 130 câu hỏi." />

      {GROUPS.map((g) => (
        <section key={g.topic}>
          <h2>{g.topic}</h2>
          <p>{g.intro}</p>
          <ol>
            {g.questions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ol>
        </section>
      ))}

      <h2>Lưu ý để trò chơi vui cho tất cả</h2>
      <ul>
        <li>
          <strong>Chỉ hỏi về thói quen, sở thích, tài lẻ.</strong> Tránh ngoại hình, cân nặng, tiền bạc, chuyện tình cảm hay bất cứ điều gì có thể làm ai đó ngại trước tập thể.
        </li>
        <li>
          <strong>Mỗi câu nên vừa là lời trêu vừa là lời khen.</strong> “Ai bình tĩnh nhất khi có sự cố?” tốt hơn nhiều so với “Ai hay làm hỏng việc nhất?”.
        </li>
        <li>
          <strong>Với đồng nghiệp mới, dùng phiếu ẩn danh</strong> (bản online) để không ai phải chỉ thẳng mặt người khác.
        </li>
        <li>
          <strong>Để ý người bị chọn quá nhiều lần</strong> và chuyển sang câu khác nếu thấy họ không thoải mái.
        </li>
      </ul>
      <Tip>
        Cuối buổi, đọc lại danh sách danh hiệu của từng người. Đó thường là khoảnh khắc cả phòng cười nhiều nhất và là “chiến lợi phẩm” để chụp ảnh lưu niệm.
      </Tip>
      <p>
        Cần thêm trò cho buổi tụ tập? Xem <Link href="/cam-nang/cau-hoi-de-hieu-nhau">50 câu hỏi để hiểu nhau hơn</Link> và{" "}
        <Link href="/cam-nang/tro-choi-team-building-trong-phong-hop">12 trò chơi team building trong phòng họp</Link>.
      </p>
    </>
  );
}
