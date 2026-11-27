import Link from "next/link";
import { PlayCta, Table, Tip } from "@/components/article/parts";

export default function Article() {
  return (
    <>
      <p>
        Email lừa đảo (phishing) thường giả danh ngân hàng, sếp, phòng IT hoặc đối tác để lừa bạn bấm link, mở file hay nhập mật khẩu. Cách nhận biết nhanh nhất là kiểm tra ba thứ: <strong>địa chỉ người gửi</strong>,{" "}
        <strong>link thật sự dẫn đi đâu</strong>, và <strong>email có đang hối thúc bạn làm gì gấp không</strong>. Dưới đây là 8 dấu hiệu cụ thể kèm ví dụ, và những việc cần làm ngay nếu lỡ bấm vào.
      </p>

      <h2>8 dấu hiệu nhận biết email lừa đảo</h2>
      <h3>1. Tên miền người gửi sai một chút</h3>
      <p>
        Tên hiển thị có thể ghi “Phòng Nhân sự” hay tên sếp của bạn, nhưng địa chỉ thật lại khác. Kẻ gian hay đổi một ký tự để khó nhận ra: <code>congty.vn</code> thành <code>cong-ty.vn</code>, <code>c0ngty.vn</code> (số 0 thay
        chữ o) hoặc <code>congty.vn.support-mail.com</code>. Luôn bấm vào tên người gửi để xem địa chỉ đầy đủ.
      </p>
      <h3>2. Hối thúc, đe dọa hoặc tạo cảm giác gấp</h3>
      <p>“Tài khoản sẽ bị khóa trong 24 giờ”, “Anh cần em chuyển khoản gấp trước 3 giờ chiều”, “Bạn có đơn hàng chưa thanh toán”. Áp lực thời gian khiến người ta làm trước, nghĩ sau. Email càng gấp càng nên chậm lại.</p>
      <h3>3. Link hiển thị một đằng, dẫn một nẻo</h3>
      <p>
        Chữ trong email ghi đường dẫn ngân hàng quen thuộc, nhưng khi rê chuột lên (trên điện thoại: nhấn giữ link) thì địa chỉ thật lại là một trang lạ. Chỉ tin phần tên miền ngay trước dấu <code>/</code> đầu tiên: trong{" "}
        <code>nganhang.vn.xac-minh.top/login</code>, tên miền thật là <code>xac-minh.top</code>.
      </p>
      <h3>4. Đòi mật khẩu, mã OTP hoặc thông tin thẻ</h3>
      <p>Ngân hàng, phòng IT hay các dịch vụ uy tín không bao giờ hỏi mật khẩu hoặc mã OTP qua email. Bất kỳ email nào yêu cầu những thông tin này đều nên coi là lừa đảo cho đến khi xác minh được.</p>
      <h3>5. File đính kèm đáng ngờ</h3>
      <p>
        Cẩn thận với file nén (<code>.zip</code>, <code>.rar</code>), file chạy được (<code>.exe</code>, <code>.scr</code>), file <code>.html</code> đính kèm, hoặc tài liệu Word, Excel đòi “Enable Content” (bật macro) mới xem
        được. Hóa đơn thật hiếm khi cần bạn bật macro.
      </p>
      <h3>6. Phần thưởng quá hời</h3>
      <p>Trúng thưởng iPhone dù không tham gia chương trình nào, hoàn tiền thuế, quà tri ân khách hàng chỉ cần “xác nhận thông tin”. Nếu quá tốt để là thật thì thường không phải thật.</p>
      <h3>7. Lời chào chung chung, câu chữ lạ</h3>
      <p>“Kính gửi Quý khách hàng” thay vì tên của bạn, sai chính tả, câu văn như dịch máy, hoặc giọng điệu không giống người gửi thường ngày (sếp vốn nói chuyện thân mật bỗng viết rất trang trọng).</p>
      <h3>8. Yêu cầu bất thường từ người quen</h3>
      <p>
        Sếp nhờ mua thẻ cào, kế toán nhận email “đối tác đổi số tài khoản nhận tiền”, đồng nghiệp gửi link đăng nhập lại Microsoft 365. Đây là kiểu lừa đảo nhắm vào doanh nghiệp, rất hay gặp. Cách chặn đơn giản nhất:{" "}
        <strong>gọi điện hoặc nhắn tin xác nhận qua một kênh khác</strong>, không trả lời ngay trong email đó.
      </p>

      <PlayCta slug="inbox-zero" text="Tập soi email trong 90 giây: vuốt để xử lý thư công việc, xóa thư rác và né email giả mạo tên miền." />

      <h2>Bảng kiểm tra nhanh trước khi bấm</h2>
      <Table
        head={["Kiểm tra", "An toàn", "Đáng ngờ"]}
        rows={[
          ["Địa chỉ người gửi", "Đúng tên miền công ty, đối tác", "Sai một ký tự, đuôi lạ, Gmail cá nhân"],
          ["Link", "Tên miền quen, đúng trang chính thức", "Tên miền lạ, link rút gọn, IP"],
          ["Nội dung", "Có ngữ cảnh, đúng việc đang làm", "Gấp gáp, đe dọa, trúng thưởng"],
          ["Yêu cầu", "Đọc, phản hồi công việc", "Mật khẩu, OTP, chuyển tiền, đổi tài khoản"],
          ["File đính kèm", "PDF, ảnh từ người quen đã báo trước", "ZIP, EXE, HTML, file đòi bật macro"],
        ]}
      />

      <h2>Lỡ bấm link hoặc nhập mật khẩu thì làm gì?</h2>
      <ol>
        <li>
          <strong>Đổi mật khẩu ngay</strong> tài khoản vừa nhập, và mọi tài khoản khác đang dùng chung mật khẩu đó.
        </li>
        <li>
          <strong>Bật xác thực hai lớp</strong> (2FA) nếu chưa bật.
        </li>
        <li>
          <strong>Báo ngay cho bộ phận IT</strong> của công ty. Báo sớm giúp họ chặn kịp email tương tự gửi tới đồng nghiệp khác. Đừng ngại, ai cũng có thể bị lừa.
        </li>
        <li>
          <strong>Nếu đã nhập thông tin thẻ hoặc OTP ngân hàng:</strong> gọi ngay tổng đài ngân hàng để khóa thẻ hoặc tài khoản.
        </li>
        <li>
          <strong>Nếu đã mở file đính kèm:</strong> ngắt mạng máy tính và nhờ IT kiểm tra trước khi dùng tiếp.
        </li>
      </ol>

      <Tip>
        Tạo thói quen “3 giây”: trước khi bấm bất kỳ link nào trong email, dừng 3 giây để nhìn địa chỉ người gửi và rê chuột lên link. Phần lớn email lừa đảo lộ diện ngay ở bước này.
      </Tip>
      <p>
        Cần nghỉ ngơi sau một ngày dọn hộp thư? Xem <Link href="/cam-nang/giai-lao-van-phong">giải lao 5 phút ở văn phòng cho đúng cách</Link>.
      </p>
    </>
  );
}
