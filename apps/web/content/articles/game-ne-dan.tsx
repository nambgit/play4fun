import Link from "next/link";
import { PlayCta, Table, Tip } from "@/components/article/parts";

export default function Article() {
  return (
    <>
      <p>
        Game né đạn (thường gọi là <strong>bullet hell</strong>) là thể loại game mà màn hình phủ kín đạn theo những hình mẫu dày đặc, và nhiệm vụ của bạn là luồn lách giữa các khe hở để sống sót. Bí quyết
        không phải phản xạ thật nhanh mà là <strong>di chuyển nhỏ, chính xác và nhìn trước đường thoát</strong>. Bài này giải thích thể loại game né đạn và 8 mẹo giúp bạn sống lâu hơn.
      </p>

      <h2>Game né đạn là gì?</h2>
      <p>
        Thể loại này bắt nguồn từ các game bắn máy bay màn hình dọc của Nhật Bản, nơi số lượng đạn tăng dần đến mức trông như không thể né. Điều làm nó chơi được là <strong>vùng va chạm</strong> của nhân vật
        thường rất nhỏ, nhỏ hơn nhiều so với hình vẽ, và đạn bay theo quy luật chứ không ngẫu nhiên hoàn toàn. Người chơi giỏi đọc được quy luật đó và tìm ra lối đi.
      </p>
      <Table
        head={["Khái niệm", "Ý nghĩa"]}
        rows={[
          ["Hitbox", "Vùng thật sự tính va chạm của nhân vật, thường chỉ là một chấm nhỏ"],
          ["Pattern", "Hình mẫu bắn đạn: xoáy ốc, hình quạt, mưa đạn, đạn đuổi theo vị trí bạn"],
          ["Graze (sượt qua)", "Lướt sát đạn mà không trúng, nhiều game thưởng điểm cho việc này"],
          ["Telegraph", "Dấu hiệu báo trước một đợt tấn công, giúp bạn có thời gian né"],
          ["Đợt (wave)", "Mỗi giai đoạn đạn nhanh và dày hơn giai đoạn trước"],
        ]}
      />
      <PlayCta slug="pixel-dodge" text="Né mưa đạn pixel ngay trên trình duyệt: mỗi 10 giây một đợt mới, có ô báo trước, khiên chắn và điểm thưởng khi lướt sát đạn. Mỗi ván 1–3 phút." />

      <h2>8 mẹo chơi game né đạn sống lâu hơn</h2>
      <ol>
        <li>
          <strong>Di chuyển từng chút một.</strong> Phần lớn lần trúng đạn đến từ việc lao đi quá xa. Những bước nhỏ, đều tay giúp bạn luồn qua khe hẹp an toàn hơn.
        </li>
        <li>
          <strong>Ở gần giữa màn hình.</strong> Góc và mép màn hình là ngõ cụt: khi đạn ép tới, bạn không còn hướng nào để thoát.
        </li>
        <li>
          <strong>Nhìn khoảng trống phía trước, không nhìn đạn.</strong> Mắt dán vào từng viên đạn sẽ khiến bạn rối. Hãy tìm khe hở mà mình sắp đi tới.
        </li>
        <li>
          <strong>Tận dụng dấu hiệu báo trước.</strong> Khi thấy cảnh báo (trong Pixel Dodge là ô vàng nhấp nháy), di chuyển khỏi hướng đó ngay, đừng đợi đạn xuất hiện.
        </li>
        <li>
          <strong>Với đạn đuổi theo bạn, dụ rồi né.</strong> Đứng yên một chút để đạn nhắm vào chỗ đó, rồi bước sang bên vừa đủ.
        </li>
        <li>
          <strong>Lướt sát đạn khi đã tự tin</strong> để kiếm điểm thưởng, nhưng chỉ khi đợt đạn còn thưa; đến đợt dày thì ưu tiên sống sót.
        </li>
        <li>
          <strong>Giữ vật phẩm phòng thủ cho lúc khó.</strong> Khiên hay mạng phụ giá trị nhất ở các đợt cuối, khi đạn dày nhất.
        </li>
        <li>
          <strong>Bình tĩnh và nghỉ giữa các ván.</strong> Sau vài lần thua liên tiếp, tay thường căng và phản xạ chậm đi. Nghỉ một phút rồi chơi lại thường cho kết quả tốt hơn.
        </li>
      </ol>
      <Tip>
        Đặt mục tiêu theo đợt thay vì theo điểm: hôm nay vượt đợt 4, tuần sau vượt đợt 6. Mục tiêu nhỏ giúp bạn thấy mình tiến bộ, và bảng xếp hạng sẽ tự lên theo.
      </Tip>

      <h2>Game né đạn có giúp phản xạ nhanh hơn?</h2>
      <p>
        Game cần phản ứng nhanh là một cách luyện tập vui, nhưng ngủ đủ và tỉnh táo ảnh hưởng tới phản xạ rõ rệt hơn nhiều. Xem thêm <Link href="/cam-nang/thoi-gian-phan-xa">thời gian phản xạ trung bình
        và cách cải thiện</Link>, hoặc đo thử bằng <Link href="/games/phan-xa">bài test phản xạ</Link>.
      </p>
      <p>
        Thích game nhịp nhanh? Thử thêm <Link href="/games/deadline-dash">Deadline Dash</Link> (chạy vô tận) và xem <Link href="/cam-nang/cac-kieu-game-thu">bạn là gamer hệ nào</Link>.
      </p>
    </>
  );
}
