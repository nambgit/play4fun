import Link from "next/link";
import { PlayCta, Tip } from "@/components/article/parts";

export default function Article() {
  return (
    <>
      <p>
        Ngồi làm liên tục hàng giờ không giúp bạn làm được nhiều hơn; đầu óc mỏi dần, sai sót tăng lên. Một quãng nghỉ ngắn khoảng <strong>5 phút</strong> sau mỗi 45–60 phút làm việc tập trung giúp bạn quay lại bàn làm việc
        tỉnh táo hơn. Bí quyết là nghỉ <strong>đúng kiểu</strong>: đổi hoạt động, cho mắt và cơ thể nghỉ, và không để 5 phút kéo thành 30 phút.
      </p>

      <h2>1. Cho mắt nghỉ trước</h2>
      <p>
        Nhìn màn hình lâu khiến mắt khô và mỏi. Một cách đơn giản thường được khuyên là <strong>quy tắc 20-20-20</strong>: cứ khoảng 20 phút, nhìn một vật cách xa chừng 6 mét (20 feet) trong 20 giây. Trong giờ nghỉ 5 phút,
        hãy đứng dậy nhìn ra cửa sổ trước khi làm bất cứ việc gì khác.
      </p>

      <h2>2. Đứng dậy và vận động nhẹ</h2>
      <ul>
        <li>Đi lấy một cốc nước hoặc đi bộ một vòng quanh văn phòng.</li>
        <li>Xoay cổ, xoay vai, duỗi tay lên cao vài lần.</li>
        <li>Đứng nghe điện thoại thay vì ngồi.</li>
      </ul>
      <p>Chỉ cần rời ghế vài phút đã khác hẳn so với ngồi lì và lướt điện thoại tại chỗ.</p>

      <h2>3. Đổi kiểu hoạt động cho não</h2>
      <p>
        Nếu bạn vừa viết báo cáo, đừng chuyển sang đọc email; đó vẫn là cùng một kiểu việc. Hãy làm thứ gì đó <strong>khác hẳn</strong>: nói chuyện với đồng nghiệp, nghe một bài hát, hoặc chơi một ván game ngắn cần phản xạ.
        Thứ quan trọng là việc đó có điểm kết thúc rõ ràng, để bạn không bị cuốn vào.
      </p>

      <h2>4. Chọn mini-game có hồi kết rõ ràng</h2>
      <p>
        Mạng xã hội và video ngắn rất dễ biến 5 phút thành nửa tiếng vì chúng không bao giờ hết. Một ván game 1–3 phút thì khác: chơi xong là xong. Vài lựa chọn hợp giờ nghỉ, chơi ngay trên trình duyệt, không cần cài đặt:
      </p>
      <PlayCta slug="inbox-zero" text="Vuốt trái, vuốt phải dọn hộp thư trong 90 giây. Chủ đề công sở, xả stress nhẹ nhàng." />
      <PlayCta slug="deadline-dash" text="Chạy trốn deadline, nhảy qua họp đột xuất. Mỗi ván 1–3 phút." />
      <PlayCta slug="pixel-dodge" text="Né đạn tập trung cao độ trong 1–3 phút, đầu óc được “reset” hoàn toàn." />
      <Tip title="Giữ kỷ luật">
        Đặt luật cho mình: <strong>tối đa 2 ván</strong> mỗi lần nghỉ. Muốn có thêm động lực? Mỗi ngày có một <Link href="/daily">thử thách hôm nay</Link>, chỉ ván đầu tiên được tính điểm, nên bạn chơi một lần là đủ.
      </Tip>

      <h2>5. Những kiểu “nghỉ” không thật sự là nghỉ</h2>
      <ul>
        <li>
          <strong>Đọc tin tức tiêu cực:</strong> đầu óc căng thêm thay vì thư giãn.
        </li>
        <li>
          <strong>Kiểm tra email công việc:</strong> não vẫn đang làm việc.
        </li>
        <li>
          <strong>Lướt mạng xã hội không giới hạn:</strong> dễ quá giờ và khó tập trung lại.
        </li>
      </ul>

      <h2>Gợi ý lịch nghỉ trong một ngày làm việc</h2>
      <ul>
        <li>Mỗi 45–60 phút tập trung: nghỉ 5 phút (mắt, đứng dậy, một ván game ngắn).</li>
        <li>Giữa buổi sáng và giữa buổi chiều: nghỉ 10–15 phút, đi lại hoặc trò chuyện.</li>
        <li>Đầu tuần: thử 10 phút đố vui cả phòng để khởi động. Xem thêm <Link href="/cam-nang/tro-choi-team-building-trong-phong-hop">trò chơi team building trong phòng họp</Link>.</li>
      </ul>
      <p>
        Muốn vừa nghỉ vừa rèn kỹ năng? <Link href="/games/go-phim-nhanh">Gõ phím thần tốc</Link> giúp tăng tốc độ gõ, còn <Link href="/games/bai-kiem-tra-15-phut">Kiểm tra 15 phút</Link> luyện tính nhẩm, mỗi lượt chỉ 1
        phút.
      </p>
    </>
  );
}
