import Link from "next/link";
import { PlayCta, Table, Tip } from "@/components/article/parts";

export default function Article() {
  return (
    <>
      <p>
        Để chọn ngành nghề phù hợp, hãy xét cùng lúc ba câu hỏi: <strong>bạn thích làm loại việc gì</strong> (sáng tạo, kỹ thuật, phân tích, chăm sóc, kinh doanh hay tổ chức), <strong>bạn làm tốt điều gì</strong>, và{" "}
        <strong>ngành đó có cơ hội việc làm thực tế không</strong>. Bài này giúp bạn tự trả lời từng câu, kèm bảng 6 nhóm nghề với ngành học gợi ý và cách “thử” một nghề trước khi chọn.
      </p>

      <h2>Bước 1: Biết mình thích loại việc gì</h2>
      <p>
        Thay vì hỏi “mình thích ngành gì”, hãy hỏi “mình thấy vui khi làm loại việc gì”. Hãy nhớ lại những lần bạn quên cả thời gian: lúc dựng một video, sửa một món đồ, giải một bài toán, nghe bạn bè tâm sự, bán được
        món hàng đầu tiên, hay sắp xếp cả nhóm đi chơi. Những khoảnh khắc đó cho biết bạn thuộc nhóm nghề nào rõ hơn mọi lời khuyên.
      </p>

      <h2>6 nhóm nghề và ngành học gợi ý</h2>
      <Table
        head={["Nhóm nghề", "Hợp với người", "Ngành học gợi ý"]}
        rows={[
          ["🎨 Sáng tạo", "Giàu tưởng tượng, nhạy với cái đẹp, thích tự do thể hiện", "Thiết kế đồ họa, truyền thông đa phương tiện, kiến trúc, marketing nội dung, sản xuất video"],
          ["🛠️ Kỹ thuật – Công nghệ", "Thích mày mò, hiểu cách mọi thứ vận hành, tư duy logic", "Công nghệ thông tin, điện – điện tử, cơ khí, tự động hóa, an toàn thông tin"],
          ["📊 Phân tích – Dữ liệu – Tài chính", "Cẩn thận, thích con số, hay hỏi “tại sao”", "Tài chính – ngân hàng, kế toán – kiểm toán, khoa học dữ liệu, kinh tế, thống kê"],
          ["🤝 Chăm sóc – Giáo dục – Y tế", "Biết lắng nghe, kiên nhẫn, vui khi giúp người khác", "Sư phạm, tâm lý học, công tác xã hội, điều dưỡng, y dược, quản trị nhân sự"],
          ["🚀 Kinh doanh – Lãnh đạo", "Tự tin, thích thuyết phục, nhanh nhạy với cơ hội", "Quản trị kinh doanh, marketing, kinh doanh quốc tế, thương mại điện tử, du lịch – khách sạn"],
          ["🗂️ Tổ chức – Vận hành", "Ngăn nắp, đúng hẹn, giỏi lên kế hoạch", "Logistics, quản trị văn phòng, quản lý dự án, hành chính công, quản trị vận hành"],
        ]}
      />
      <p>
        Hiếm ai thuộc trọn một nhóm. Thường bạn sẽ mạnh ở một nhóm và khá ở một nhóm khác, và chính sự kết hợp đó mở ra nghề phù hợp. Ví dụ, sáng tạo cộng kinh doanh hợp với marketing; kỹ thuật cộng phân tích hợp với
        khoa học dữ liệu; chăm sóc cộng tổ chức hợp với quản trị nhân sự.
      </p>
      <PlayCta slug="ban-hop-nghe-gi" text="12 tình huống quen thuộc ở trường và chỗ làm thêm, 3 phút để biết nhóm nghề hợp với bạn, kèm điểm mạnh, điểm cần lưu ý và ngành học gợi ý." />

      <h2>Bước 2: Đối chiếu với điểm mạnh thật</h2>
      <p>Sở thích cần đi kèm năng lực. Vài cách kiểm tra nhanh:</p>
      <ul>
        <li>
          <strong>Nhìn lại điểm số và nhận xét</strong> các môn liên quan, nhưng đừng chỉ dựa vào điểm: có người học toán bình thường nhưng phân tích số liệu thực tế rất tốt.
        </li>
        <li>
          <strong>Hỏi 3 người hiểu bạn</strong> (bạn thân, thầy cô, người thân): “Theo bạn, mình làm việc gì giỏi nhất?”. Câu trả lời giống nhau thường đáng tin.
        </li>
        <li>
          <strong>Để ý việc người khác hay nhờ bạn</strong>: sửa máy, thiết kế poster, giảng bài hay lên kế hoạch đi chơi.
        </li>
      </ul>

      <h2>Bước 3: Thử nghề trước khi chọn</h2>
      <p>Đọc về một nghề khác rất xa so với làm thử nó. Trước khi quyết định, hãy có ít nhất một trải nghiệm thật:</p>
      <Table
        head={["Nhóm nghề", "Cách thử nhanh, gần như miễn phí"]}
        rows={[
          ["Sáng tạo", "Mỗi tháng làm một sản phẩm nhỏ: poster bằng Canva, video ngắn bằng CapCut, một bài viết"],
          ["Kỹ thuật – Công nghệ", "Học một khóa lập trình miễn phí và làm trang web cá nhân; tham gia câu lạc bộ robot, hackathon"],
          ["Phân tích – Tài chính", "Ghi chép chi tiêu cá nhân bằng Excel trong một tháng rồi tự vẽ biểu đồ, rút ra nhận xét"],
          ["Chăm sóc – Giáo dục", "Làm gia sư, trợ giảng hoặc tình nguyện viên vài buổi"],
          ["Kinh doanh", "Bán thử một món nhỏ online hoặc nhận bán hàng làm thêm mùa hè"],
          ["Tổ chức – Vận hành", "Nhận phần hậu cần cho một sự kiện ở trường hoặc câu lạc bộ"],
        ]}
      />
      <Tip>
        Hãy nói chuyện với ít nhất một người đang làm nghề bạn định chọn. Hỏi họ một ngày làm việc thật trông như thế nào và điều gì khiến họ mệt nhất. Câu trả lời thường khác hẳn hình dung ban đầu.
      </Tip>

      <h2>Những sai lầm hay gặp khi chọn ngành</h2>
      <ul>
        <li>
          <strong>Chọn theo bạn bè</strong> hoặc theo ngành đang “hot” mà không xem mình có hợp không.
        </li>
        <li>
          <strong>Chỉ nhìn mức lương khởi điểm</strong>, bỏ qua việc mình có làm nổi công việc đó mỗi ngày trong nhiều năm hay không.
        </li>
        <li>
          <strong>Nghĩ chọn sai là hết đường.</strong> Rất nhiều người đổi hướng sau vài năm; kỹ năng như giao tiếp, Excel, ngoại ngữ dùng được ở mọi ngành.
        </li>
        <li>
          <strong>Chỉ dựa vào một bài trắc nghiệm.</strong> Trắc nghiệm giúp gợi ý hướng đi; quyết định cuối cùng nên dựa trên trải nghiệm thật và trao đổi với người làm nghề.
        </li>
      </ul>
      <p>
        Đang đi làm và tò mò mình là kiểu đồng nghiệp nào? Thử <Link href="/games/ban-la-kieu-dong-nghiep-nao">Bạn là kiểu đồng nghiệp nào?</Link>. Còn đang đi học thì xem thêm{" "}
        <Link href="/cam-nang/cach-on-thi-hieu-qua">cách ôn thi hiệu quả</Link>.
      </p>
    </>
  );
}
