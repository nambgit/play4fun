import Link from "next/link";
import { PlayCta, Table, Tip } from "@/components/article/parts";

export default function Article() {
  return (
    <>
      <p>
        Ma sói là trò chơi suy luận cho nhóm từ 5 người trở lên. Mỗi người nhận một vai bí mật: phe <strong>sói</strong> giết người vào ban đêm, phe <strong>dân làng</strong> phải tìm và treo cổ sói vào ban ngày. Dân thắng khi diệt
        hết sói; sói thắng khi số sói bằng số người còn lại. Bài này giải thích luật chơi từng bước, các vai cơ bản, cách chia vai theo số người và mẹo cho cả hai phe.
      </p>

      <h2>Các vai cơ bản</h2>
      <Table
        head={["Vai", "Phe", "Khả năng"]}
        rows={[
          ["🐺 Ma sói", "Sói", "Biết đồng bọn. Mỗi đêm cùng chọn một người để cắn."],
          ["🔮 Tiên tri", "Dân", "Mỗi đêm soi một người để biết người đó có phải sói không."],
          ["🛡️ Bảo vệ", "Dân", "Mỗi đêm che chở một người khỏi sói, không được chọn cùng một người hai đêm liền."],
          ["🧑‍🌾 Dân làng", "Dân", "Không có khả năng đặc biệt; dùng lý lẽ và lá phiếu để tìm sói."],
        ]}
      />
      <p>Nhiều nhóm chơi thêm các vai như Phù thủy, Thợ săn, Cupid… Với người mới, bốn vai trên là đủ để ván chơi cân bằng và dễ hiểu.</p>

      <h2>Luật chơi từng bước</h2>
      <h3>1. Chia vai</h3>
      <p>Mỗi người xem vai của mình bí mật. Sói được biết ai là đồng bọn; những người khác chỉ biết vai của chính mình.</p>
      <h3>2. Ban đêm</h3>
      <ol>
        <li>Cả làng “đi ngủ” (nhắm mắt, hoặc cúi vào điện thoại nếu chơi online).</li>
        <li>Bầy sói thống nhất chọn một nạn nhân.</li>
        <li>Tiên tri chọn một người để soi và biết người đó có phải sói không.</li>
        <li>Bảo vệ chọn một người để che chở. Nếu đó đúng là người sói chọn, người đó sống sót.</li>
      </ol>
      <h3>3. Ban ngày</h3>
      <ol>
        <li>Công bố ai đã chết trong đêm (hoặc đêm bình yên nếu được bảo vệ). Người chết không được nói gì thêm về vai của mình.</li>
        <li>Mọi người còn sống thảo luận trong một khoảng thời gian (thường 2–3 phút).</li>
        <li>Bỏ phiếu: người nhiều phiếu nhất bị treo cổ và lật vai. Hòa phiếu thì không ai bị treo.</li>
      </ol>
      <h3>4. Kết thúc</h3>
      <p>Lặp lại đêm và ngày cho đến khi một phe thắng: dân thắng khi không còn sói nào, sói thắng khi số sói còn sống bằng hoặc nhiều hơn số người còn lại.</p>

      <PlayCta slug="ma-soi" text="Máy làm quản trò: chia vai, gọi từng vai dậy ban đêm trên điện thoại, đếm giờ thảo luận và tính phiếu. 5–16 người." />

      <h2>Chia vai theo số người</h2>
      <Table
        head={["Số người", "Sói", "Vai đặc biệt gợi ý"]}
        rows={[
          ["5–7", "1", "Tiên tri, Bảo vệ"],
          ["8–11", "2", "Tiên tri, Bảo vệ"],
          ["12–15", "3", "Tiên tri, Bảo vệ"],
          ["16", "4", "Tiên tri, Bảo vệ"],
        ]}
      />
      <p>Muốn ván dễ hơn cho dân thì giữ cả Tiên tri và Bảo vệ; muốn sói có lợi hơn thì bỏ bớt một vai đặc biệt.</p>

      <h2>Mẹo cho phe dân làng</h2>
      <ul>
        <li>
          <strong>Nghe nhiều hơn nói.</strong> Sói thường cố hướng cả làng về một người vô tội, hoặc bám theo ý kiến số đông để không bị chú ý.
        </li>
        <li>
          <strong>Để ý phiếu bầu.</strong> Sau mỗi lần treo cổ, xem ai đã bỏ phiếu cho ai. Hai người luôn tránh bỏ phiếu cho nhau là một tín hiệu đáng ngờ.
        </li>
        <li>
          <strong>Tiên tri đừng lộ quá sớm.</strong> Lộ vai vào ngày đầu dễ bị sói cắn ngay đêm sau. Hãy chờ khi đã soi ra sói để thông tin có giá trị.
        </li>
        <li>
          <strong>Bảo vệ hãy đoán ý sói.</strong> Người nói hay nhất, hoặc người vừa bị nghi là Tiên tri, thường là mục tiêu tiếp theo của sói.
        </li>
      </ul>

      <h2>Mẹo cho phe sói</h2>
      <ul>
        <li>Đừng bảo vệ đồng bọn quá lộ liễu; đôi khi bỏ phiếu treo cổ chính đồng đội lại giúp bạn được tin tưởng.</li>
        <li>Cắn người có ảnh hưởng nhất trong làng, hoặc người đang tiến gần đến sự thật.</li>
        <li>Giữ câu chuyện của mình nhất quán từ ngày đầu đến cuối.</li>
      </ul>

      <Tip title="Không cần quản trò">
        Khi chơi bằng bài, một người phải làm quản trò và không được chơi. Chơi Ma sói trên điện thoại thì máy làm thay: ai cũng nhận vai, ban đêm mỗi vai bấm chọn trên máy của mình, nên không ai lộ vai vì mở mắt nhầm lúc.
      </Tip>

      <p>
        Thích trò suy luận? Thử thêm <Link href="/cam-nang/luat-choi-ai-la-gian-diep">Ai là gián điệp</Link>, nhẹ nhàng hơn và chơi được từ 3 người, hoặc xem{" "}
        <Link href="/cam-nang/tro-choi-team-building-trong-phong-hop">12 trò chơi team building trong phòng họp</Link>.
      </p>
    </>
  );
}
