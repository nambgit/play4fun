import Link from "next/link";
import { PlayCta, Table, Tip } from "@/components/article/parts";

export default function Article() {
  return (
    <>
      <p>
        Vẽ đoán chữ là trò một người vẽ một từ khóa bí mật, những người còn lại đoán xem đó là gì. Luật cơ bản: <strong>người vẽ không được viết chữ, không nói, không ra hiệu</strong>; ai đoán đúng trước được
        nhiều điểm hơn, và người vẽ cũng được điểm khi có người đoán ra. Bài này hướng dẫn luật chơi đầy đủ, cách tính điểm, mẹo vẽ để người khác đoán nhanh và mẹo đoán giỏi.
      </p>

      <h2>Luật chơi vẽ đoán chữ</h2>
      <ol>
        <li>Lần lượt từng người làm người vẽ. Người vẽ chọn (hoặc bốc) một từ khóa bí mật.</li>
        <li>Người vẽ có một khoảng thời gian cố định, thường 60–100 giây, để vẽ từ đó.</li>
        <li>
          <strong>Không viết chữ hay con số</strong>, không nói, không dùng tay ra hiệu. Chỉ được vẽ.
        </li>
        <li>Những người còn lại đoán. Ai đoán đúng được điểm, đoán càng sớm càng nhiều điểm.</li>
        <li>Người vẽ được điểm cho mỗi người đoán đúng, nên vẽ dễ hiểu là có lợi cho chính mình.</li>
        <li>Mỗi người vẽ một lần là hết một vòng. Chơi 1–3 vòng, cộng điểm để tìm người thắng.</li>
      </ol>

      <h2>Cách chơi trên điện thoại</h2>
      <p>Bản online giữ nguyên luật trên và tự lo những việc khó làm khi chơi trực tiếp:</p>
      <Table
        head={["Việc", "Cách game xử lý"]}
        rows={[
          ["Chọn từ", "Người vẽ chọn 1 trong 3 từ (dễ, vừa, khó) trong 15 giây"],
          ["Thời gian vẽ", "Chủ phòng chọn 60, 80 hoặc 100 giây mỗi lượt"],
          ["Gợi ý", "Lộ dần một chữ cái ở mốc nửa thời gian và ba phần tư thời gian, luôn giấu ít nhất hai chữ"],
          ["Đoán", "Gõ đáp án, không cần dấu và khoảng trắng: “cay du” cũng tính là “cây dù”"],
          ["Tính điểm", "Đoán đúng càng nhanh càng nhiều điểm; người vẽ được điểm theo số người đoán đúng"],
        ]}
      />
      <PlayCta slug="ve-doan-chu" text="Vẽ & đoán online cho 2–12 người: vẽ trên điện thoại, cả phòng đoán bằng tiếng Việt không cần gõ dấu, máy tự tính điểm." />

      <h2>Mẹo vẽ để người khác đoán nhanh</h2>
      <ul>
        <li>
          <strong>Vẽ hình tổng thể trước, chi tiết sau.</strong> Vài nét đầu quyết định người khác đoán đúng hướng hay không.
        </li>
        <li>
          <strong>Vẽ thứ đặc trưng nhất</strong> của từ: “bánh chưng” thì vẽ khối vuông có dây buộc chữ thập, không cần vẽ lá.
        </li>
        <li>
          <strong>Từ khó thì vẽ bối cảnh:</strong> “bác sĩ” khó vẽ người, nhưng ống nghe và chữ thập đỏ thì ai cũng hiểu.
        </li>
        <li>
          <strong>Từ ghép thì vẽ từng phần</strong>, cách nhau rõ ràng: “xe đạp” vẽ hai bánh xe và bàn đạp.
        </li>
        <li>
          <strong>Dùng mũi tên và màu</strong> để chỉ chỗ quan trọng, nhưng nhớ không được viết chữ.
        </li>
      </ul>

      <h2>Mẹo đoán giỏi hơn</h2>
      <ul>
        <li>
          <strong>Đoán sớm, đoán nhiều:</strong> đoán sai không bị trừ điểm, còn đoán đúng sớm thì được nhiều điểm hơn.
        </li>
        <li>
          <strong>Đếm số chữ trong gợi ý</strong> để loại bớt khả năng, rồi chờ chữ cái được lộ ra.
        </li>
        <li>
          <strong>Nghĩ theo chủ đề:</strong> người vẽ vẽ bếp rồi thêm nồi, đáp án nhiều khả năng là một món ăn hay đồ dùng nhà bếp.
        </li>
        <li>
          <strong>Thử cả từ đồng nghĩa:</strong> “xe máy”, “xe gắn máy”, “mô tô”; đáp án thường là từ phổ biến nhất.
        </li>
      </ul>
      <Tip title="Chơi trực tiếp không cần điện thoại">
        Chuẩn bị bảng trắng hoặc giấy A4, bút dạ và một hũ phiếu ghi từ khóa. Chia hai đội, mỗi đội lần lượt cử người vẽ, đội nào đoán đúng trong 60 giây được 1 điểm. Cần từ khóa? Xem{" "}
        <Link href="/cam-nang/tu-khoa-ve-doan-chu">100 từ khóa vẽ đoán chữ từ dễ đến khó</Link>.
      </Tip>
      <p>
        Thêm trò cho buổi tụ tập: <Link href="/cam-nang/tro-choi-team-building-trong-phong-hop">12 trò chơi team building trong phòng họp</Link> và{" "}
        <Link href="/cam-nang/tro-choi-online-qua-zoom">trò chơi online qua Zoom, Google Meet</Link>.
      </p>
    </>
  );
}
