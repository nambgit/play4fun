import Link from "next/link";
import { PlayCta, Table, Tip } from "@/components/article/parts";

export default function Article() {
  return (
    <>
      <p>
        Tốc độ gõ phím thường được đo bằng <strong>WPM</strong> (words per minute, số từ mỗi phút). Với tiếng Anh, khoảng <strong>40 WPM</strong> thường được coi là mức trung bình của người hay dùng máy tính, trên{" "}
        <strong>60 WPM</strong> là nhanh. Gõ tiếng Việt có dấu thường chậm hơn một chút vì phải gõ thêm phím bỏ dấu. Dưới đây là cách tính WPM, các mốc tham khảo và cách tăng tốc.
      </p>

      <h2>WPM được tính như thế nào?</h2>
      <p>
        Vì từ dài ngắn khác nhau, quy ước chung là <strong>một “từ” bằng 5 ký tự</strong>, tính cả dấu cách. Công thức:
      </p>
      <p>
        <strong>WPM = (số ký tự gõ đúng ÷ 5) ÷ số phút</strong>
      </p>
      <p>
        Ví dụ: trong 60 giây bạn gõ đúng 200 ký tự thì tốc độ là 200 ÷ 5 = <strong>40 WPM</strong>. Nhiều bài kiểm tra (trong đó có <Link href="/games/go-phim-nhanh">Gõ phím thần tốc</Link>) chỉ tính những từ gõ đúng cả
        chữ lẫn dấu, nên con số phản ánh tốc độ “dùng được”, không phải tốc độ gõ bừa.
      </p>

      <h2>Bao nhiêu WPM là nhanh?</h2>
      <p>Các mốc dưới đây là ước lượng tham khảo cho bài kiểm tra 60 giây, không phải tiêu chuẩn chính thức:</p>
      <Table
        head={["Tiếng Việt có dấu", "Tiếng Anh", "Mức"]}
        rows={[
          ["Dưới 20 WPM", "Dưới 25 WPM", "Mới làm quen, còn nhìn bàn phím"],
          ["20–30 WPM", "25–40 WPM", "Dùng máy tính hằng ngày"],
          ["30–45 WPM", "40–55 WPM", "Dân văn phòng thành thạo"],
          ["45–60 WPM", "55–75 WPM", "Nhanh, gõ 10 ngón chuẩn"],
          ["Trên 60 WPM", "Trên 75 WPM", "Rất nhanh, hiếm gặp"],
        ]}
      />
      <p>
        Với công việc văn phòng, gõ được khoảng 35–40 WPM tiếng Việt với độ chính xác trên 95% là đủ thoải mái. Các vị trí nhập liệu, thư ký, biên bản thường mong muốn cao hơn.
      </p>

      <PlayCta slug="go-phim-nhanh" text="Đo WPM và độ chính xác trong 60 giây. Hỗ trợ Telex, VNI và tiếng Anh." />

      <h2>Vì sao gõ tiếng Việt chậm hơn tiếng Anh?</h2>
      <ul>
        <li>Mỗi chữ có dấu cần thêm 1 đến 2 lần bấm (ví dụ “việt” gõ Telex là v-i-e-e-t-j, 6 lần bấm cho 4 chữ cái).</li>
        <li>Bộ gõ phải xử lý dấu, đôi khi bạn chờ chữ hiện ra đúng mới gõ tiếp.</li>
        <li>Tiếng Việt có nhiều từ ngắn và nhiều dấu cách, làm nhịp gõ bị ngắt quãng hơn.</li>
      </ul>
      <p>Vì vậy đừng so WPM tiếng Việt của bạn với bảng xếp hạng tiếng Anh; hãy so với chính mình qua từng tuần.</p>

      <h2>6 cách tăng tốc độ gõ mà không giảm độ chính xác</h2>
      <ol>
        <li>
          <strong>Gõ 10 ngón đúng vị trí.</strong> Đây là bước khó nhất nhưng mở khóa mọi mức tốc độ cao. Xem <Link href="/cam-nang/luyen-go-phim-10-ngon">cách luyện gõ 10 ngón</Link>.
        </li>
        <li>
          <strong>Đọc trước một từ.</strong> Khi tay đang gõ từ hiện tại, mắt đã đọc từ tiếp theo. Người gõ nhanh gần như không bao giờ dừng giữa các từ.
        </li>
        <li>
          <strong>Giữ nhịp đều thay vì giật cục.</strong> Gõ đều tay ở tốc độ vừa phải thường cho WPM cao hơn là lúc nhanh lúc dừng để sửa lỗi.
        </li>
        <li>
          <strong>Ưu tiên độ chính xác trên 95%.</strong> Mỗi lỗi tốn thêm 2–3 lần bấm để xóa và gõ lại.
        </li>
        <li>
          <strong>Tập ngắn, tập đều.</strong> Ba lượt kiểm tra 60 giây mỗi ngày là đủ để thấy tiến bộ sau 2–3 tuần.
        </li>
        <li>
          <strong>Dùng bàn phím quen tay.</strong> Bàn phím có hành trình phím rõ ràng giúp giảm lỗi gõ lặp hoặc gõ thiếu.
        </li>
      </ol>
      <Tip title="Thử thách hằng ngày">
        Mỗi ngày có một mini-game được chọn làm <Link href="/daily">thử thách hôm nay</Link>, cả nước chơi cùng một đề. Khi đến lượt Gõ phím thần tốc, mọi người gõ cùng một đoạn văn, nên đây là cách so tài công bằng nhất với
        bạn bè.
      </Tip>
    </>
  );
}
