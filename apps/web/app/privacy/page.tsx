import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chính sách quyền riêng tư",
  description: "Play4Fun lưu những dữ liệu gì, dùng để làm gì và cách xóa dữ liệu của bạn.",
};

const UPDATED = "20/11/2026";

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
              Kỷ lục, lựa chọn (ví dụ ngôn ngữ của game gõ phím) và danh sách nội dung bạn vừa gặp được lưu <b>ngay trên trình duyệt của bạn</b> (localStorage),
              không gửi về máy chủ.
            </li>
            <li>
              Khi chơi nhóm, tên bạn nhập và một mã ngẫu nhiên của trình duyệt được gửi tới máy chủ phòng chơi để những người cùng phòng thấy bạn. Phòng chơi chỉ tồn tại
              trong bộ nhớ máy chủ và biến mất khi mọi người rời đi.
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
          <h2>Dữ liệu được dùng để làm gì</h2>
          <ul>
            <li>Đăng nhập và nhận ra bạn khi quay lại.</li>
            <li>Hiển thị và đồng bộ kỷ lục của bạn.</li>
            <li>Điền sẵn tên khi bạn vào phòng chơi nhóm.</li>
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
