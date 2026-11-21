import Link from "next/link";
import { PlayCta, Table, Tip } from "@/components/article/parts";

const PAIRS: { topic: string; pairs: [string, string][] }[] = [
  {
    topic: "Đồ ăn, thức uống",
    pairs: [
      ["Phở", "Bún bò"], ["Trà sữa", "Trà đào"], ["Bánh mì", "Bánh bao"], ["Lẩu", "Đồ nướng"], ["Kem", "Chè"],
      ["Cà phê", "Trà"], ["Bánh chưng", "Bánh tét"], ["Xôi", "Cơm nắm"], ["Pizza", "Hamburger"], ["Sầu riêng", "Mít"],
    ],
  },
  {
    topic: "Địa điểm",
    pairs: [
      ["Bãi biển", "Hồ bơi"], ["Thư viện", "Hiệu sách"], ["Rạp chiếu phim", "Quán karaoke"], ["Sân bay", "Ga tàu"], ["Bệnh viện", "Phòng khám"],
      ["Siêu thị", "Chợ"], ["Công viên", "Sở thú"], ["Khách sạn", "Homestay"], ["Phòng gym", "Sân bóng"], ["Trường học", "Trung tâm tiếng Anh"],
    ],
  },
  {
    topic: "Đồ vật",
    pairs: [
      ["Điện thoại", "Máy tính bảng"], ["Ô", "Áo mưa"], ["Gối", "Chăn"], ["Bút bi", "Bút chì"], ["Đồng hồ", "Vòng tay"],
      ["Tủ lạnh", "Máy giặt"], ["Kính râm", "Kính cận"], ["Ba lô", "Vali"], ["Quạt", "Điều hòa"], ["Son môi", "Sơn móng tay"],
    ],
  },
  {
    topic: "Nghề nghiệp",
    pairs: [
      ["Bác sĩ", "Y tá"], ["Giáo viên", "Gia sư"], ["Ca sĩ", "Diễn viên"], ["Đầu bếp", "Phục vụ"], ["Phi công", "Tiếp viên"],
      ["Cảnh sát", "Bảo vệ"], ["Lập trình viên", "Thiết kế đồ họa"], ["Nhà báo", "Nhà văn"], ["Kế toán", "Thủ quỹ"], ["Shipper", "Tài xế công nghệ"],
    ],
  },
  {
    topic: "Công sở",
    pairs: [
      ["Họp online", "Họp trực tiếp"], ["Sếp", "Trưởng phòng"], ["Email", "Tin nhắn Zalo"], ["Tăng ca", "Làm cuối tuần"], ["Thực tập sinh", "Nhân viên mới"],
      ["Thưởng Tết", "Lương tháng 13"], ["Máy in", "Máy photocopy"], ["Nghỉ phép", "Nghỉ ốm"], ["Báo cáo", "Thuyết trình"], ["Team building", "Tiệc tất niên"],
    ],
  },
  {
    topic: "Giải trí",
    pairs: [
      ["Bóng đá", "Bóng chuyền"], ["Netflix", "YouTube"], ["Facebook", "Instagram"], ["Cầu lông", "Tennis"], ["Đàn guitar", "Đàn ukulele"],
      ["Truyện tranh", "Hoạt hình"], ["Bơi lội", "Lặn biển"], ["Cắm trại", "Dã ngoại"], ["Game điện thoại", "Game máy tính"], ["Nhạc rap", "Nhạc pop"],
    ],
  },
];

export default function Article() {
  return (
    <>
      <p>
        Ai là gián điệp là trò chơi suy luận cho nhóm từ 3 đến 12 người. Mọi người nhận cùng một từ khóa, riêng gián điệp nhận một từ gần giống mà thường không biết mình là gián điệp. Lần lượt mô tả, tranh luận rồi bỏ
        phiếu: dân thắng khi loại hết gián điệp, gián điệp thắng khi còn bằng số dân. Bên dưới là luật chơi đầy đủ, mẹo cho từng vai và 60 cặp từ khóa theo chủ đề.
      </p>

      <h2>Chuẩn bị</h2>
      <ul>
        <li>
          <strong>Số người:</strong> 3–12 người. Từ khoảng 7 người trở lên có thể để 2 gián điệp.
        </li>
        <li>
          <strong>Từ khóa:</strong> một cặp từ gần nghĩa, ví dụ “Phở” và “Bún bò”. Dân nhận từ thứ nhất, gián điệp nhận từ thứ hai.
        </li>
        <li>
          <strong>Quản trò:</strong> khi chơi bằng giấy cần một người chia từ và không được chơi. Khi chơi trên điện thoại, máy chia từ nên ai cũng được chơi.
        </li>
      </ul>

      <h2>Luật chơi từng bước</h2>
      <ol>
        <li>
          <strong>Nhận từ.</strong> Mỗi người xem từ khóa của mình bí mật. Gián điệp nhận từ khác nhưng không được báo là gián điệp.
        </li>
        <li>
          <strong>Mô tả.</strong> Lần lượt theo thứ tự, mỗi người nói <strong>một câu</strong> mô tả từ của mình mà không nói thẳng từ đó. Ví dụ với “Phở”: “Ăn nóng mới ngon”.
        </li>
        <li>
          <strong>Thảo luận.</strong> Sau một vòng, cả nhóm bàn xem ai mô tả “lệch” nhất.
        </li>
        <li>
          <strong>Bỏ phiếu.</strong> Mỗi người bầu một người. Ai nhiều phiếu nhất bị loại và lật vai. Nếu hòa phiếu thì không ai bị loại.
        </li>
        <li>
          <strong>Kết thúc.</strong> Dân thắng khi loại hết gián điệp. Gián điệp thắng khi số gián điệp còn lại bằng hoặc nhiều hơn số dân.
        </li>
      </ol>

      <h3>Chế độ gián điệp trắng</h3>
      <p>Ở biến thể này, gián điệp không nhận từ nào nhưng biết mình là gián điệp. Gián điệp phải nghe người khác mô tả để đoán từ khóa và nói theo sao cho không bị lộ. Chế độ này khó cho gián điệp hơn và hợp nhóm đã quen trò.</p>

      <PlayCta slug="ai-la-gian-diep" text="Máy chia từ, mỗi người xem từ trên điện thoại riêng, bỏ phiếu ngay trên máy. Có chế độ gián điệp trắng." />

      <h2>Mẹo cho dân thường</h2>
      <ul>
        <li>Mô tả đủ để đồng đội nhận ra, nhưng đừng quá rõ kẻo gián điệp đoán được từ của dân.</li>
        <li>Để ý người mô tả chung chung (“thứ này ai cũng biết”), đó thường là người đang dò đường.</li>
        <li>Vòng đầu đừng vội tố ai; nghe hết một lượt rồi mới so sánh.</li>
      </ul>

      <h2>Mẹo cho gián điệp</h2>
      <ul>
        <li>Nếu thấy mô tả của người khác hơi lệch với từ của mình, rất có thể bạn là gián điệp. Hãy mô tả phần chung của hai từ.</li>
        <li>Đừng là người đầu tiên tố cáo ai đó quá gay gắt; hãy “đồng tình” với số đông.</li>
        <li>Nói tự tin. Ngập ngừng là thứ dễ lộ nhất.</li>
      </ul>

      <h2>Bao nhiêu gián điệp là hợp lý?</h2>
      <Table
        head={["Số người chơi", "Số gián điệp gợi ý"]}
        rows={[
          ["3–6 người", "1 gián điệp"],
          ["7–10 người", "1–2 gián điệp"],
          ["11–12 người", "2–3 gián điệp"],
        ]}
      />

      <h2>60 cặp từ khóa Ai là gián điệp theo chủ đề</h2>
      <p>Cặp từ hay là hai thứ đủ giống để mô tả của người này cũng “nghe hợp lý” với từ kia, nhưng vẫn khác nhau rõ ràng khi nghĩ kỹ.</p>
      {PAIRS.map((g) => (
        <section key={g.topic}>
          <h3>{g.topic}</h3>
          <Table head={["Từ của dân", "Từ của gián điệp"]} rows={g.pairs} />
        </section>
      ))}
      <Tip>
        Đổi bên ngẫu nhiên giữa hai từ (lúc thì dân nhận “Phở”, lúc nhận “Bún bò”) để người chơi không đoán được ai giữ từ nào. Game trên Play4Fun tự làm việc này và tránh lặp cặp từ trong cùng một phòng.
      </Tip>
      <p>
        Cần thêm trò cho buổi tụ tập? Xem <Link href="/cam-nang/tro-choi-team-building-trong-phong-hop">12 trò chơi team building trong phòng họp</Link> hoặc{" "}
        <Link href="/cam-nang/tu-khoa-ve-doan-chu">100 từ khóa vẽ đoán chữ</Link>.
      </p>
    </>
  );
}
