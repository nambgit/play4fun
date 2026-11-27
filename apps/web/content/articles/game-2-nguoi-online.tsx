import Link from "next/link";
import { PlayCta, Table, Tip } from "@/components/article/parts";

export default function Article() {
  return (
    <>
      <p>
        Muốn chơi game 2 người online với bạn bè, người yêu hay đồng nghiệp ở xa mà không cần cài app? Cách đơn giản nhất là các game chạy trên trình duyệt: một người tạo phòng, gửi link, người kia mở
        link là vào chơi ngay trên điện thoại hoặc máy tính. Dưới đây là 8 trò chơi hai người miễn phí, chia theo kiểu chơi: đấu trí đối kháng, hiểu nhau hơn, và thi điểm.
      </p>

      <h2>So sánh nhanh 8 game 2 người</h2>
      <Table
        head={["Game", "Kiểu chơi", "Thời gian", "Hợp với"]}
        rows={[
          ["Cờ caro", "Đối kháng, 5 quân liền hàng", "5–15 phút", "Thích đấu trí, tính toán"],
          ["Nối từ", "Đối kháng, nối tiếng cuối", "3–8 phút", "Thích chơi chữ"],
          ["Ai hiểu ai nhất?", "Đoán câu trả lời của nhau", "10–15 phút", "Cặp đôi, bạn thân"],
          ["Vẽ & đoán", "Một người vẽ, người kia đoán", "khoảng 15 phút", "Thích sáng tạo, vui nhộn"],
          ["Đố vui team building", "Trả lời nhanh trên điện thoại", "10–20 phút", "Thích kiến thức"],
          ["Đoán chữ hằng ngày", "Cùng một từ mỗi ngày, so số lượt", "3–5 phút", "Thách nhau mỗi ngày"],
          ["Gõ phím thần tốc", "So tốc độ gõ", "1 phút", "Dân văn phòng"],
          ["Pixel Dodge", "So điểm né đạn", "1–3 phút", "Thích game phản xạ"],
        ]}
      />

      <h2>Game đối kháng 2 người</h2>
      <h3>Cờ caro</h3>
      <p>
        Hai người lần lượt đặt X và O, ai có 5 quân liền nhau trước là thắng. Có thể ghép ngẫu nhiên với người lạ, gửi link cho bạn, hoặc luyện với máy trước. Xem thêm{" "}
        <Link href="/cam-nang/cach-choi-co-caro">mẹo chơi cờ caro luôn thắng</Link>.
      </p>
      <PlayCta slug="co-caro" />
      <h3>Nối từ</h3>
      <p>
        Thay phiên nối tiếng cuối thành từ mới, “học sinh” → “sinh viên”. Ai hết giờ hoặc bị dồn vào tiếng không còn từ nối thì thua hiệp. Chơi được 2 người hoặc cả nhóm tới 10 người. Xem{" "}
        <Link href="/cam-nang/luat-choi-noi-tu">luật chơi nối từ và mẹo làm đối thủ bí</Link>.
      </p>
      <PlayCta slug="noi-tu" />

      <h2>Game để hiểu nhau hơn</h2>
      <h3>Ai hiểu ai nhất?</h3>
      <p>
        Một người bí mật chọn câu trả lời thật của mình (món có thể ăn cả tuần không chán, nơi muốn đi du lịch…), người kia đoán. Rất hợp cho cặp đôi hoặc hai người bạn mới quen. Thêm câu hỏi:{" "}
        <Link href="/cam-nang/cau-hoi-de-hieu-nhau">50 câu hỏi để hiểu nhau hơn</Link>.
      </p>
      <PlayCta slug="ai-hieu-ai" />
      <h3>Vẽ & đoán</h3>
      <p>
        Thay nhau vẽ từ khóa trên điện thoại, người kia đoán bằng cách gõ đáp án. Vẽ xấu càng vui. Xem <Link href="/cam-nang/luat-choi-ve-doan-chu">luật chơi và mẹo vẽ nhanh</Link>.
      </p>

      <h2>Thi điểm với nhau</h2>
      <p>Những game một người dưới đây có cùng đề hoặc có bảng xếp hạng, nên rất hợp để thách đấu: chơi xong chụp màn hình kết quả gửi cho nhau.</p>
      <ul>
        <li>
          <Link href="/games/doan-chu">Đoán chữ hằng ngày</Link>: cả nước cùng một từ mỗi ngày, ai đoán ra với ít lượt hơn thì thắng.
        </li>
        <li>
          <Link href="/games/go-phim-nhanh">Gõ phím thần tốc</Link>: so tốc độ gõ tiếng Việt có dấu.
        </li>
        <li>
          <Link href="/games/pixel-dodge">Pixel Dodge</Link>: ai né đạn lâu hơn, điểm cao hơn.
        </li>
        <li>
          <Link href="/games/do-vui-team-building">Đố vui team building</Link>: tạo phòng cho 2 người, trả lời câu hỏi kiến thức, xem ai nhanh và đúng hơn.
        </li>
      </ul>
      <Tip title="Chơi khi ở xa nhau">
        Gọi video hoặc gọi thoại song song trong lúc chơi để nghe phản ứng của nhau, vui hơn nhiều so với chỉ nhìn màn hình. Các game ở đây chạy trên trình duyệt nên vừa gọi Zalo, Messenger vừa chơi được.
      </Tip>
      <p>
        Đông người hơn? Xem <Link href="/cam-nang/tro-choi-online-qua-zoom">10 trò chơi online qua Zoom, Google Meet, Zalo</Link>.
      </p>
    </>
  );
}
