import Link from "next/link";
import { PlayCta, Table, Tip } from "@/components/article/parts";

export default function Article() {
  return (
    <>
      <p>
        Thời gian phản xạ là khoảng thời gian từ lúc bạn thấy (hoặc nghe) một tín hiệu đến lúc cơ thể phản ứng, ví dụ thấy màn hình chuyển xanh rồi chạm tay. Với phản xạ thị giác đơn giản, phần lớn người trưởng thành
        nằm trong khoảng <strong>200–300 mili-giây (ms)</strong>. Khi đo trên điện thoại hay máy tính, kết quả thường cao hơn một chút vì có thêm độ trễ của màn hình và thiết bị.
      </p>

      <h2>Thời gian phản xạ bao nhiêu là nhanh?</h2>
      <p>Bảng dưới áp dụng cho bài test kiểu “màn hình đổi màu thì chạm” trên điện thoại hoặc máy tính, tính trung bình nhiều lần:</p>
      <Table
        head={["Kết quả trung bình", "Đánh giá"]}
        rows={[
          ["Dưới 200 ms", "Hiếm gặp, rất nhanh"],
          ["200–240 ms", "Rất nhanh"],
          ["240–300 ms", "Phổ biến, mức của đa số người"],
          ["300–350 ms", "Hơi chậm, có thể do mệt hoặc thiết bị"],
          ["Trên 350 ms", "Chậm, nên đo lại khi tỉnh táo"],
        ]}
      />
      <p>
        Đừng so kết quả giữa hai thiết bị khác nhau. Màn hình 60 Hz chỉ cập nhật khoảng 16,7 ms một lần, cảm ứng và chuột cũng có độ trễ riêng. So với chính mình trên cùng một máy mới là cách đo tiến bộ chính xác nhất.
      </p>

      <PlayCta slug="phan-xa" text="Màn hình chuyển xanh là chạm, đo bằng mili-giây, lấy trung bình 5 lần. Chạm sớm phải làm lại nên không ăn gian được." />

      <h2>Điều gì làm phản xạ nhanh hay chậm?</h2>
      <ul>
        <li>
          <strong>Giấc ngủ:</strong> thiếu ngủ là nguyên nhân phổ biến nhất khiến phản xạ chậm đi rõ rệt. Đo vào buổi sáng sau một đêm ngủ đủ thường cho kết quả tốt nhất.
        </li>
        <li>
          <strong>Mức độ tỉnh táo và tập trung:</strong> vừa làm việc căng thẳng xong hay đang bị phân tâm đều làm chậm phản ứng.
        </li>
        <li>
          <strong>Rượu bia:</strong> làm chậm phản xạ ngay cả khi bạn cảm thấy mình vẫn tỉnh.
        </li>
        <li>
          <strong>Tuổi tác:</strong> phản xạ thường nhanh nhất ở tuổi trẻ và chậm dần theo tuổi, nhưng luyện tập và vận động đều giúp giữ phong độ.
        </li>
        <li>
          <strong>Loại tín hiệu:</strong> phản xạ với âm thanh thường nhanh hơn với hình ảnh. Phản xạ có lựa chọn (thấy màu đỏ bấm trái, màu xanh bấm phải) luôn chậm hơn phản xạ đơn giản.
        </li>
        <li>
          <strong>Khởi động:</strong> vài lần đầu thường chậm hơn. Đó là lý do bài test tốt nên lấy trung bình nhiều lần.
        </li>
      </ul>

      <h2>Phản xạ và lái xe: vì sao vài trăm mili-giây lại quan trọng</h2>
      <p>
        Khi lái xe, từ lúc nhìn thấy nguy hiểm đến lúc đạp phanh không chỉ là phản xạ thuần túy mà còn gồm thời gian nhận ra và quyết định, thường khoảng 1–1,5 giây. Ở tốc độ 60 km/h, xe đi gần 17 mét mỗi giây, nghĩa là
        xe đã chạy thêm 17–25 mét trước khi bắt đầu phanh. Chỉ chậm thêm nửa giây vì mệt hay vì vừa uống rượu bia là thêm khoảng 8 mét, đủ để biến một tình huống suýt va chạm thành tai nạn.
      </p>

      <h2>Cách cải thiện tốc độ phản xạ</h2>
      <ol>
        <li>
          <strong>Ngủ đủ 7–8 tiếng.</strong> Cách đơn giản và hiệu quả nhất.
        </li>
        <li>
          <strong>Luyện tập đều đặn.</strong> Làm bài test phản xạ hoặc chơi các game cần phản ứng nhanh vài phút mỗi ngày, theo dõi kết quả trung bình theo tuần thay vì từng lần.
        </li>
        <li>
          <strong>Chơi thể thao dùng phản xạ</strong> như cầu lông, bóng bàn, tennis: vừa luyện phản xạ, vừa vận động.
        </li>
        <li>
          <strong>Giữ tư thế sẵn sàng:</strong> khi làm test, đặt ngón tay sát màn hình, nhìn vào giữa vùng chạm.
        </li>
        <li>
          <strong>Hạn chế phân tâm:</strong> tắt thông báo, làm bài ở nơi yên tĩnh.
        </li>
      </ol>
      <Tip>
        Đo 5 lần vào cùng một khung giờ mỗi ngày trong một tuần, ghi lại kết quả trung bình. Bạn sẽ thấy rõ ảnh hưởng của giấc ngủ: những ngày ngủ ít, kết quả thường chậm hơn thấy rõ.
      </Tip>
      <p>
        Muốn thử thêm game cần phản ứng nhanh? Chơi <Link href="/games/pixel-dodge">Pixel Dodge</Link> (né đạn) hoặc <Link href="/games/deadline-dash">Deadline Dash</Link> (chạy vô tận).
      </p>
    </>
  );
}
