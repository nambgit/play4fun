import Link from "next/link";
import { PlayCta, Tip } from "@/components/article/parts";

type Q = [question: string, answer: string];

const SECTIONS: { title: string; intro: string; items: Q[] }[] = [
  {
    title: "Kiến thức chung",
    intro: "Mức dễ đến trung bình, hợp để mở màn.",
    items: [
      ["Hành tinh nào gần Mặt Trời nhất?", "Sao Thủy"],
      ["Một năm nhuận có bao nhiêu ngày?", "366 ngày"],
      ["Đại dương lớn nhất thế giới là gì?", "Thái Bình Dương"],
      ["Bức tranh Mona Lisa do ai vẽ?", "Leonardo da Vinci"],
      ["Thủ đô của Nhật Bản là thành phố nào?", "Tokyo"],
      ["Con vật nào là biểu tượng của nước Úc, nổi tiếng với chiếc túi trước bụng?", "Chuột túi (kangaroo)"],
      ["Có bao nhiêu châu lục trên thế giới (theo cách chia phổ biến)?", "7 châu lục"],
      ["Đồng tiền của Hàn Quốc tên là gì?", "Won"],
      ["Môn thể thao nào dùng cầu lông vũ và vợt?", "Cầu lông"],
      ["Thế vận hội (Olympic) hiện đại được tổ chức mấy năm một lần?", "4 năm một lần"],
      ["Ngọn núi cao nhất thế giới là gì?", "Everest"],
      ["Trong bảng chữ cái tiếng Anh có bao nhiêu chữ cái?", "26 chữ cái"],
      ["Màu nào được tạo ra khi trộn màu xanh dương và màu vàng?", "Màu xanh lá"],
      ["Loài vật nào được gọi là “chúa sơn lâm”?", "Con hổ"],
      ["Một tuần có bao nhiêu giờ?", "168 giờ"],
    ],
  },
  {
    title: "Việt Nam",
    intro: "Ai cũng nghĩ mình biết, nhưng vẫn có bất ngờ.",
    items: [
      ["Sông nào dài nhất chảy qua lãnh thổ Việt Nam?", "Sông Mê Kông (sông Cửu Long)"],
      ["Đỉnh núi cao nhất Việt Nam là gì?", "Fansipan"],
      ["Việt Nam có bao nhiêu tỉnh, thành phố trực thuộc trung ương sau đợt sắp xếp năm 2025?", "34 tỉnh, thành phố"],
      ["Vịnh nào của Việt Nam được UNESCO công nhận là Di sản thiên nhiên thế giới?", "Vịnh Hạ Long"],
      ["Hang Sơn Đoòng, hang động tự nhiên lớn nhất thế giới, nằm trong vườn quốc gia nào?", "Phong Nha – Kẻ Bàng"],
      ["Tác phẩm “Truyện Kiều” là của ai?", "Nguyễn Du"],
      ["Quốc khánh Việt Nam là ngày nào?", "Ngày 2 tháng 9"],
      ["Bánh chưng gắn với truyền thuyết về vị hoàng tử nào?", "Lang Liêu"],
      ["Thành phố nào được gọi là “thành phố ngàn hoa”?", "Đà Lạt"],
      ["Phố cổ Hội An thuộc thành phố nào hiện nay?", "Đà Nẵng (trước đây thuộc tỉnh Quảng Nam)"],
      ["Chợ nổi Cái Răng nổi tiếng ở thành phố nào?", "Cần Thơ"],
      ["Áo dài truyền thống thường được mặc cùng loại nón nào?", "Nón lá"],
      ["Tết Trung thu rơi vào ngày nào âm lịch?", "Rằm tháng 8 (15/8 âm lịch)"],
      ["Theo truyền thuyết “Con Rồng cháu Tiên”, Âu Cơ sinh ra bọc trứng nở thành bao nhiêu người con?", "100 người con"],
      ["Thủ đô Hà Nội có hồ nào gắn với truyền thuyết trả gươm?", "Hồ Hoàn Kiếm"],
    ],
  },
  {
    title: "Khoa học và công nghệ",
    intro: "Thử thách hơn một chút, hợp cho vòng giữa.",
    items: [
      ["Công thức hóa học của nước là gì?", "H₂O"],
      ["Cơ quan nào bơm máu đi khắp cơ thể người?", "Tim"],
      ["Ánh sáng từ Mặt Trời đến Trái Đất mất khoảng bao lâu?", "Khoảng 8 phút"],
      ["Khí nào chiếm tỷ lệ lớn nhất trong không khí?", "Nitơ (khoảng 78%)"],
      ["Đơn vị đo cường độ dòng điện là gì?", "Ampe (A)"],
      ["Người trưởng thành có bao nhiêu chiếc xương (thông thường)?", "206 chiếc"],
      ["Kim loại nào ở thể lỏng ở nhiệt độ phòng?", "Thủy ngân"],
      ["Trong máy tính, CPU là viết tắt của gì?", "Central Processing Unit (bộ xử lý trung tâm)"],
      ["Nước sôi ở bao nhiêu độ C ở áp suất thường?", "100 °C"],
      ["Hành tinh nào được gọi là “Hành tinh Đỏ”?", "Sao Hỏa"],
      ["1 byte bằng bao nhiêu bit?", "8 bit"],
      ["Loài động vật có vú nào biết bay?", "Dơi"],
      ["Cây xanh hấp thụ khí gì để quang hợp?", "Khí cacbonic (CO₂)"],
      ["Âm thanh truyền nhanh hơn trong không khí hay trong nước?", "Trong nước"],
      ["Số Pi (π) xấp xỉ bằng bao nhiêu (hai chữ số thập phân)?", "3,14"],
    ],
  },
  {
    title: "Đời sống công sở",
    intro: "Câu hỏi vui, đáp án gây cười, hợp để kết thúc.",
    items: [
      ["Phím tắt nào dùng để hoàn tác (undo) trên Windows?", "Ctrl + Z"],
      ["Trong email, “CC” là viết tắt của gì?", "Carbon copy (gửi đồng thời)"],
      ["Phím tắt nào dùng để sao chép?", "Ctrl + C (Cmd + C trên Mac)"],
      ["Trong Excel, hàm nào dùng để tính tổng?", "SUM"],
      ["“Deadline” nghĩa là gì?", "Hạn chót"],
      ["Gửi email cho nhiều người mà không ai thấy địa chỉ của nhau thì dùng ô nào?", "BCC"],
      ["KPI là viết tắt của cụm từ nào?", "Key Performance Indicator (chỉ số đo hiệu suất)"],
      ["Phím tắt nào khóa màn hình nhanh trên Windows?", "Windows + L"],
      ["Định dạng file nào thường dùng để gửi tài liệu mà không bị lệch định dạng?", "PDF"],
      ["Trong cuộc họp online, nút nào bạn nên bật khi không nói?", "Tắt mic (mute)"],
      ["“OT” trong công sở thường là viết tắt của gì?", "Overtime (làm thêm giờ)"],
      ["Phím tắt nào tìm kiếm chữ trong trang hoặc tài liệu?", "Ctrl + F"],
      ["“WFH” là viết tắt của cụm từ nào?", "Work from home (làm việc tại nhà)"],
      ["Trong Excel, hàm nào tính giá trị trung bình?", "AVERAGE"],
      ["Đồ uống nào được dân văn phòng gọi vui là “nhiên liệu buổi sáng”?", "Cà phê (đáp án nào khác cũng được nếu cả phòng đồng ý)"],
    ],
  },
];

export default function Article() {
  return (
    <>
      <p>
        Dưới đây là 60 câu hỏi đố vui có đáp án, chia thành 4 nhóm: kiến thức chung, Việt Nam, khoa học công nghệ và đời sống công sở. Một vòng đố vui khoảng 10–15 câu là vừa cho 15 phút team building. Cuối bài có cách tổ
        chức để cả phòng trả lời bằng điện thoại và xem bảng xếp hạng trực tiếp.
      </p>
      <Tip title="Cách dùng nhanh">
        Chọn 3–4 câu ở mỗi nhóm, đi từ dễ đến khó, và chen thêm 2–3 câu về chính công ty bạn. Câu hỏi về công ty luôn là phần được mong chờ nhất.
      </Tip>

      {SECTIONS.map((s, si) => (
        <section key={s.title}>
          <h2>
            {si + 1}. {s.title}
          </h2>
          <p>{s.intro}</p>
          <ol start={si * 15 + 1}>
            {s.items.map(([q, a]) => (
              <li key={q}>
                {q} <span className="text-muted">Đáp án: </span>
                <strong>{a}</strong>
              </li>
            ))}
          </ol>
        </section>
      ))}

      <h2>Cách tổ chức đố vui cho cả phòng</h2>
      <ol>
        <li>Mở một máy tính nối máy chiếu hoặc TV, vào game đố vui và tạo phòng.</li>
        <li>Mọi người quét mã QR trên màn hình để vào bằng điện thoại, đến muộn vẫn vào được.</li>
        <li>Mỗi câu có 4 đáp án và đồng hồ đếm ngược. Trả lời đúng càng nhanh càng nhiều điểm.</li>
        <li>Bảng xếp hạng hiện sau mỗi câu, cuối game có bảng vàng cho người dẫn đầu.</li>
      </ol>
      <PlayCta slug="do-vui-team-building" text="Có sẵn câu hỏi theo 4 chủ đề cho 2–50 người. Miễn phí, không cần cài app." />

      <h2>Tự soạn câu hỏi về công ty</h2>
      <p>
        Muốn dùng câu hỏi riêng (về lịch sử công ty, sản phẩm, đồng nghiệp)? Đăng nhập rồi vào Studio để soạn bộ câu hỏi, hoặc dán nhiều câu một lúc theo dạng <strong>Câu hỏi | Đáp án đúng | Sai 1 | Sai 2 | Sai 3</strong>.
        Bạn có thể thêm tên, màu và logo công ty; phòng chơi sẽ hiện thương hiệu của bạn trên điện thoại của mọi người. Tính năng này miễn phí.
      </p>
      <p>
        Cần thêm ý tưởng cho buổi team building? Xem <Link href="/cam-nang/tro-choi-team-building-trong-phong-hop">12 trò chơi team building trong phòng họp</Link>.
      </p>
    </>
  );
}
