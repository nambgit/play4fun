import Link from "next/link";
import { PlayCta, Table, Tip } from "@/components/article/parts";

export default function Article() {
  return (
    <>
      <p>
        Ma sói có hai phe: <strong>phe Sói</strong> muốn ăn hết dân làng, <strong>phe Dân làng</strong> muốn tìm ra và loại hết sói. Bộ cơ bản gồm 4 vai: <strong>Ma sói, Tiên tri, Bảo vệ và Dân làng</strong>.
        Khi nhóm đã quen, người ta thêm các vai đặc biệt như Phù thủy, Thợ săn hay Cupid để ván chơi nhiều bất ngờ hơn. Bài này giải thích chức năng và cách chơi tốt từng vai.
      </p>

      <h2>4 vai cơ bản</h2>
      <Table
        head={["Vai", "Phe", "Chức năng", "Mục tiêu"]}
        rows={[
          ["🐺 Ma sói", "Sói", "Mỗi đêm cùng các sói khác chọn một người để cắn. Các sói biết nhau.", "Số sói bằng số người còn lại"],
          ["🔮 Tiên tri", "Dân làng", "Mỗi đêm soi một người để biết người đó có phải sói không.", "Dẫn dắt dân làng tìm sói mà không lộ mình"],
          ["🛡️ Bảo vệ", "Dân làng", "Mỗi đêm che chở một người khỏi bị sói cắn, không được bảo vệ cùng một người hai đêm liền.", "Giữ sống những người quan trọng"],
          ["🧑‍🌾 Dân làng", "Dân làng", "Không có khả năng ban đêm, ban ngày thảo luận và bỏ phiếu.", "Tìm ra sói bằng lập luận"],
        ]}
      />
      <PlayCta slug="ma-soi" text="Chơi Ma sói online cho 5–16 người với 4 vai cơ bản: máy làm quản trò, vai bí mật trên điện thoại, tự đếm giờ thảo luận và bỏ phiếu." />

      <h2>Cách chơi tốt từng vai</h2>
      <h3>🐺 Ma sói</h3>
      <ul>
        <li>Ban ngày cư xử như một dân làng bình thường: tham gia thảo luận, đặt câu hỏi, đừng im lặng quá lâu.</li>
        <li>Đêm đầu nên cắn người nói nhiều, có vẻ thông minh, hoặc người bạn nghi là Tiên tri.</li>
        <li>Đừng bênh nhau quá rõ. Đôi khi bỏ phiếu loại chính đồng đội sói đã lộ lại giúp bạn được tin tưởng.</li>
      </ul>
      <h3>🔮 Tiên tri</h3>
      <ul>
        <li>Đừng lộ vai quá sớm, vì sói sẽ cắn bạn ngay đêm sau.</li>
        <li>Ưu tiên soi người đang được nhiều người tin tưởng hoặc người dẫn dắt cuộc bỏ phiếu.</li>
        <li>Khi đã tìm ra sói và thấy mình sắp bị loại, đó là lúc công khai kết quả để dân làng có thông tin.</li>
      </ul>
      <h3>🛡️ Bảo vệ</h3>
      <ul>
        <li>Đoán xem sói muốn cắn ai: thường là người vừa nói rất thuyết phục hoặc người nghi là Tiên tri.</li>
        <li>Vì không được bảo vệ một người hai đêm liền, hãy luân phiên để sói khó đoán.</li>
        <li>Không nên lộ vai: Bảo vệ bị lộ sẽ thành mục tiêu tiếp theo.</li>
      </ul>
      <h3>🧑‍🌾 Dân làng</h3>
      <ul>
        <li>Ghi nhớ ai bỏ phiếu cho ai qua từng ngày: sói thường bỏ phiếu theo nhóm hoặc né tránh nhau.</li>
        <li>Để ý người đổi ý đột ngột, người cố hướng mũi nhọn sang người khác quá nhanh.</li>
        <li>Đừng ngại nói: phe dân thắng nhờ thảo luận, im lặng chỉ giúp sói.</li>
      </ul>

      <h2>Các vai mở rộng phổ biến</h2>
      <p>Những vai dưới đây thường dùng khi chơi bằng bài giấy với người quản trò. Bản online hiện có 4 vai cơ bản ở trên, các vai này phù hợp khi bạn tự tổ chức trực tiếp.</p>
      <Table
        head={["Vai", "Phe", "Chức năng"]}
        rows={[
          ["🧪 Phù thủy", "Dân làng", "Có hai bình thuốc, mỗi bình dùng một lần: một bình cứu người bị sói cắn, một bình giết một người"],
          ["🏹 Thợ săn", "Dân làng", "Khi chết (bị cắn hoặc bị treo), được bắn chết ngay một người khác"],
          ["💘 Cupid", "Dân làng", "Đêm đầu ghép đôi hai người; một người chết thì người kia chết theo"],
          ["👧 Cô bé", "Dân làng", "Được hé mắt nhìn ban đêm; nếu sói phát hiện thì bị cắn thay"],
          ["👴 Già làng", "Dân làng", "Sống sót qua lần bị sói cắn đầu tiên"],
          ["🤪 Thằng ngốc", "Dân làng", "Nếu bị dân treo cổ thì lộ vai và được sống, nhưng mất quyền bỏ phiếu"],
          ["🐐 Kẻ thế mạng", "Dân làng", "Khi bỏ phiếu hòa, người này bị treo thay"],
        ]}
      />
      <Tip title="Thêm vai mở rộng thế nào cho cân bằng">
        Mỗi vai đặc biệt bên dân làng làm phe dân mạnh lên. Khi thêm 2–3 vai như Phù thủy, Thợ săn, hãy giữ đủ số sói (khoảng 1 sói cho mỗi 4 người) để ván không bị nghiêng về một phe.
      </Tip>

      <h2>Chia vai theo số người</h2>
      <Table
        head={["Số người", "Số sói", "Gợi ý vai đặc biệt"]}
        rows={[
          ["5–7", "1", "Tiên tri, Bảo vệ"],
          ["8–11", "2", "Tiên tri, Bảo vệ, có thể thêm Thợ săn"],
          ["12–15", "3", "Tiên tri, Bảo vệ, Phù thủy, Thợ săn"],
          ["16", "4", "Tiên tri, Bảo vệ, Phù thủy, Thợ săn, Cupid"],
        ]}
      />
      <p>
        Mới chơi lần đầu? Đọc trước <Link href="/cam-nang/luat-choi-ma-soi">luật chơi Ma sói từng bước</Link>. Thích trò suy luận nhẹ hơn, ít người hơn? Thử{" "}
        <Link href="/cam-nang/luat-choi-ai-la-gian-diep">Ai là gián điệp</Link>.
      </p>
    </>
  );
}
