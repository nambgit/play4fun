import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chính sách quyền riêng tư",
  description: "Play4Fun lưu những dữ liệu gì, dùng để làm gì và cách xóa dữ liệu của bạn.",
  alternates: { canonical: "/privacy" },
};

const UPDATED = "21/11/2026";

export default function PrivacyPage() {
  return (
    <article className="container-page max-w-3xl py-8 sm:py-14">
      <p className="eyebrow">Quyền riêng tư</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Chính sách quyền riêng tư</h1>
      <p className="mt-2 text-sm text-muted">Cập nhật lần cuối: {UPDATED}</p>

      <div className="mt-8 space-y-8 text-[15px] leading-relaxed text-muted [&_b]:text-fg [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-fg [&_li]:mt-1.5 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
        <section>
          <h2>Tóm tắt</h2>
          <p className="mt-3">
            Bạn chơi được mọi game trên Play4Fun <b>mà không cần đăng nhập</b>. Đăng nhập là tùy chọn, chỉ để lưu kỷ lục lên tài khoản. Chúng tôi không bán dữ liệu,
            không đăng gì lên mạng xã hội của bạn và không gửi email quảng cáo.
          </p>
        </section>

        <section>
          <h2>Khi bạn chơi mà không đăng nhập</h2>
          <ul>
            <li>
              Kỷ lục, lựa chọn (ví dụ ngôn ngữ của game gõ phím) và danh sách nội dung bạn vừa gặp được lưu <b>ngay trên trình duyệt của bạn</b> (localStorage).
            </li>
            <li>
              Khi một ván có tính kỷ lục kết thúc, trình duyệt gửi <b>điểm và dữ liệu của ván đó</b> lên máy chủ để kiểm tra điểm là thật: ví dụ các từ đã gõ (Gõ phím
              thần tốc), các đáp án và thời điểm trả lời (Kiểm tra 15 phút), thời gian chơi (các game khác). Nếu bạn chưa đăng nhập, máy chủ chỉ kiểm tra rồi trả về một
              biên nhận có chữ ký để lưu trên máy bạn, không lưu dữ liệu ván chơi. Biên nhận hết hạn sau 24 giờ.
            </li>
            <li>
              Khi chơi nhóm, tên bạn nhập và một mã ngẫu nhiên của trình duyệt được gửi tới máy chủ phòng chơi để những người cùng phòng thấy bạn. Mã này chỉ máy chủ
              biết, người khác trong phòng không thấy. Phòng chơi nằm trong bộ nhớ máy chủ; khi máy chủ khởi động lại (cập nhật phiên bản), phòng đang mở được lưu tạm
              tối đa 15 phút để mọi người vào lại chơi tiếp, rồi tự xóa.
            </li>
          </ul>
        </section>

        <section>
          <h2>Khi bạn đăng nhập bằng Google hoặc Facebook</h2>
          <ul>
            <li>
              Chúng tôi nhận và lưu: <b>tên, ảnh đại diện, địa chỉ email</b> và mã tài khoản của bạn phía Google/Facebook.
            </li>
            <li>
              <b>Kỷ lục game</b> và kết quả test vui gần nhất được lưu theo tài khoản để đồng bộ giữa các thiết bị.
            </li>
            <li>
              Một <b>cookie phiên đăng nhập</b> giữ bạn đăng nhập trong 60 ngày. Kèm theo phiên là địa chỉ IP và thông tin trình duyệt, chỉ dùng để bảo vệ tài khoản.
            </li>
            <li>Chúng tôi không đọc danh sách bạn bè, không đăng bài và không truy cập dữ liệu nào khác trên tài khoản mạng xã hội của bạn.</li>
          </ul>
        </section>

        <section>
          <h2>Thống kê truy cập</h2>
          <p className="mt-3">
            Để biết game nào được yêu thích và cải thiện trang, Play4Fun dùng <b>Umami</b>, công cụ thống kê mã nguồn mở <b>tự vận hành trên máy chủ của chúng tôi</b>, không
            gửi dữ liệu cho Google hay bên quảng cáo nào và <b>không dùng cookie</b>. Mỗi lượt xem trang và mỗi ván game ghi lại: trang đã xem, trang dẫn tới (ví dụ
            Facebook), loại thiết bị, trình duyệt, quốc gia, game đã chơi, thời gian chơi và điểm. Địa chỉ IP chỉ dùng để suy ra quốc gia và không được lưu lại. Số liệu chỉ
            được xem ở dạng tổng hợp.
          </p>
        </section>

        <section>
          <h2>Bảng xếp hạng</h2>
          <p className="mt-3">
            Khi bạn đăng nhập, <b>tên và ảnh đại diện</b> của bạn được hiện công khai cạnh kỷ lục trên bảng xếp hạng và bảng thử thách hằng ngày. Bạn tắt được việc này trong
            trang Tài khoản (mục &ldquo;Hiện tên tôi trên bảng xếp hạng&rdquo;).
          </p>
        </section>

        <section>
          <h2>Quảng cáo</h2>
          <p className="mt-3">
            Một số trang có thể hiển thị quảng cáo của <b>Google AdSense</b> (được ghi rõ chữ &ldquo;Quảng cáo&rdquo;, không bao giờ nằm trong màn chơi). Khi có quảng cáo,
            Google có thể dùng cookie để hiển thị và đo lường quảng cáo theo{" "}
            <a href="https://policies.google.com/technologies/ads" className="font-semibold text-brand hover:underline" rel="noopener noreferrer" target="_blank">
              chính sách của Google
            </a>
            ; bạn có thể tắt quảng cáo cá nhân hóa tại{" "}
            <a href="https://adssettings.google.com" className="font-semibold text-brand hover:underline" rel="noopener noreferrer" target="_blank">
              Cài đặt quảng cáo của Google
            </a>
            .
          </p>
        </section>

        <section>
          <h2>Dữ liệu được dùng để làm gì</h2>
          <ul>
            <li>Đăng nhập và nhận ra bạn khi quay lại.</li>
            <li>Hiển thị và đồng bộ kỷ lục của bạn.</li>
            <li>Điền sẵn tên khi bạn vào phòng chơi nhóm.</li>
            <li>Lưu bộ câu hỏi bạn soạn trong Studio (kèm tên, màu và logo công ty nếu có).</li>
          </ul>
          <p className="mt-3">Dữ liệu được lưu trên máy chủ của Play4Fun và không chia sẻ cho bên thứ ba, trừ khi pháp luật yêu cầu.</p>
        </section>

        <section id="xoa-du-lieu">
          <h2>Xóa dữ liệu của bạn</h2>
          <ul>
            <li>
              Vào{" "}
              <Link href="/accounts" className="font-semibold text-brand hover:underline">
                Tài khoản
              </Link>{" "}
              → bấm biểu tượng thùng rác → <b>Xóa vĩnh viễn</b>. Tài khoản, phiên đăng nhập và toàn bộ kỷ lục đã lưu sẽ bị xóa ngay lập tức.
            </li>
            <li>Dữ liệu chỉ nằm trên trình duyệt (khi chơi không đăng nhập) có thể xóa bằng cách xóa dữ liệu trang web trong cài đặt trình duyệt.</li>
            <li>
              Bạn cũng có thể gỡ quyền truy cập của Play4Fun trong phần cài đặt bảo mật của tài khoản Google hoặc Facebook. Nếu không tự xóa được, hãy nhắn tin cho fanpage
              Play4Fun và chúng tôi sẽ xóa giúp bạn.
            </li>
          </ul>
        </section>

        <section>
          <h2>Trẻ em</h2>
          <p className="mt-3">
            Play4Fun phù hợp cho học sinh. Học sinh chưa đủ tuổi để tự tạo tài khoản Google/Facebook nên chơi ở chế độ không đăng nhập, vốn không thu thập thông tin cá nhân.
          </p>
        </section>
      </div>
    </article>
  );
}
