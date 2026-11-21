import Link from "next/link";
import { PlayCta, Tip, WordGrid } from "@/components/article/parts";

const LISTS: { title: string; note: string; words: string[] }[] = [
  {
    title: "Dễ: đồ vật quen thuộc",
    note: "Vẽ được bằng vài nét, hợp cho trẻ em hoặc vòng khởi động.",
    words: ["Cái ô", "Quả táo", "Ngôi nhà", "Mặt trời", "Cây kem", "Đôi kính", "Chiếc lá", "Cái ghế", "Quả bóng", "Ngôi sao", "Bông hoa", "Cái cốc", "Chìa khóa", "Đám mây", "Cầu vồng", "Con cá", "Trái tim", "Cái kéo", "Bóng đèn", "Chiếc mũ"],
  },
  {
    title: "Dễ: con vật",
    note: "Mẹo: vẽ đặc điểm nổi bật nhất (vòi voi, cổ hươu) trước.",
    words: ["Con mèo", "Con voi", "Con rùa", "Con rắn", "Hươu cao cổ", "Con thỏ", "Con gà", "Con cua", "Con bướm", "Con nhện", "Chim cánh cụt", "Con khỉ", "Cá heo", "Con ốc sên", "Con ong", "Con cú", "Con ngựa", "Con sứa", "Con heo", "Cá sấu"],
  },
  {
    title: "Trung bình: món ăn",
    note: "Hợp với nhóm người Việt, có nhiều món dễ nhận ra.",
    words: ["Bánh mì", "Bát phở", "Bánh chưng", "Trà sữa", "Pizza", "Xúc xích", "Bánh sinh nhật", "Trứng ốp la", "Sushi", "Bắp rang", "Cơm tấm", "Bánh xèo", "Dưa hấu", "Mì tôm", "Kẹo bông"],
  },
  {
    title: "Trung bình: nghề nghiệp và hoạt động",
    note: "Vẽ dụng cụ đặc trưng của nghề sẽ nhanh hơn vẽ người.",
    words: ["Bác sĩ", "Đầu bếp", "Phi công", "Lính cứu hỏa", "Thợ cắt tóc", "Ca sĩ", "Họa sĩ", "Shipper", "Câu cá", "Cắm trại", "Đá bóng", "Bơi lội", "Chụp ảnh", "Đạp xe", "Leo núi"],
  },
  {
    title: "Khó: công sở",
    note: "Rất hợp cho team building văn phòng, đoán ra là cả phòng cười.",
    words: ["Deadline", "Họp online", "Máy in kẹt giấy", "Tăng ca", "Wifi yếu", "Thang máy", "Bảng lương", "Sếp đi công tác", "Cà phê sáng", "Ngủ gật", "Thẻ nhân viên", "Bàn phím", "Lịch họp", "Nghỉ phép", "Tiệc tất niên"],
  },
  {
    title: "Rất khó: thành ngữ, khái niệm",
    note: "Dành cho nhóm đã quen chơi. Có thể vẽ từng chữ rồi ghép lại.",
    words: ["Đàn gảy tai trâu", "Nước đổ đầu vịt", "Ếch ngồi đáy giếng", "Mèo mù vớ cá rán", "Cưỡi ngựa xem hoa", "Đứng núi này trông núi nọ", "Nồi nào úp vung nấy", "Thời gian", "Tình bạn", "Giấc mơ", "Mất ngủ", "Hạnh phúc", "Ăn cháo đá bát", "Có công mài sắt có ngày nên kim", "Gió chiều nào che chiều ấy"],
  },
];

export default function Article() {
  return (
    <>
      <p>
        Dưới đây là 100 từ khóa vẽ đoán chữ chia theo độ khó và chủ đề, từ đồ vật vẽ trong 10 giây đến thành ngữ khiến cả nhóm vò đầu. Chọn danh sách hợp với nhóm của bạn, hoặc trộn vài từ mỗi loại để ván chơi có lúc dễ lúc
        khó. Cuối bài có mẹo vẽ nhanh và cách chơi online để ai cũng thấy nét vẽ trên điện thoại.
      </p>

      {LISTS.map((l) => (
        <section key={l.title}>
          <h2>{l.title}</h2>
          <p>{l.note}</p>
          <WordGrid words={l.words} />
        </section>
      ))}

      <h2>Mẹo vẽ nhanh để cả nhóm đoán ra</h2>
      <ol>
        <li>
          <strong>Vẽ thứ nổi bật nhất trước.</strong> Với “hươu cao cổ”, vẽ cái cổ dài trước khi vẽ thân.
        </li>
        <li>
          <strong>Dùng ký hiệu.</strong> Mũi tên, dấu hỏi, dấu bằng giúp nối các hình lại với nhau (ví dụ “nước” + mũi tên + “đầu vịt”).
        </li>
        <li>
          <strong>Tách từ ghép.</strong> “Bóng đèn” có thể vẽ quả bóng và cái đèn cạnh nhau rồi khoanh lại.
        </li>
        <li>
          <strong>Không viết chữ.</strong> Đây là luật cơ bản của trò chơi; vẽ chữ cái hoặc số để gợi ý là phạm luật.
        </li>
        <li>
          <strong>Quan sát người đoán.</strong> Nếu mọi người đoán gần đúng, hãy vẽ thêm chi tiết theo hướng đó thay vì xóa đi vẽ lại.
        </li>
      </ol>

      <h2>Chơi vẽ đoán chữ online</h2>
      <p>
        Khi chơi trên điện thoại, mỗi người vào cùng một phòng bằng mã hoặc QR. Đến lượt ai thì người đó chọn 1 trong 3 từ và vẽ trên màn hình, những người còn lại thấy nét vẽ trực tiếp và gõ đáp án (không cần gõ dấu). Đoán
        càng sớm càng nhiều điểm, và chữ cái gợi ý hiện dần khi thời gian trôi qua.
      </p>
      <PlayCta slug="ve-doan-chu" text="Vẽ đoán chữ cho 2–12 người, đoán bằng tiếng Việt không cần gõ dấu. Miễn phí, không cần tài khoản." />
      <Tip>
        Chơi cùng nhóm ở xa? Vào chung một phòng rồi gọi video qua Zoom, Meet hoặc Messenger để nghe nhau cười khi tranh vẽ “sai sai”. Xem thêm <Link href="/cam-nang/luat-choi-ai-la-gian-diep">luật chơi Ai là gián điệp</Link>{" "}
        cho buổi tụ tập tiếp theo.
      </Tip>
    </>
  );
}
