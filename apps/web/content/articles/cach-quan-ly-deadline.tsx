import Link from "next/link";
import { PlayCta, Table, Tip } from "@/components/article/parts";

export default function Article() {
  return (
    <>
      <p>
        Để không trễ deadline, hãy làm ba việc ngay khi nhận việc: <strong>chia việc lớn thành các bước nhỏ có thể xong trong một buổi</strong>, <strong>ước lượng thời gian rồi cộng thêm khoảng một nửa</strong>,
        và <strong>đặt cho mình một hạn chót sớm hơn hạn thật</strong>. Bài này tổng hợp 8 cách quản lý deadline dễ áp dụng cho dân văn phòng và sinh viên, kèm cách xử lý khi biết chắc mình sẽ trễ.
      </p>

      <h2>Vì sao chúng ta hay trễ deadline?</h2>
      <ul>
        <li>
          <strong>Ước lượng quá lạc quan:</strong> con người thường đánh giá thấp thời gian cần để làm xong một việc, kể cả việc đã làm nhiều lần.
        </li>
        <li>
          <strong>Việc lớn khó bắt đầu:</strong> “làm báo cáo quý” nghe nặng nề, nên dễ bị đẩy sang ngày mai.
        </li>
        <li>
          <strong>Bị ngắt quãng liên tục:</strong> tin nhắn, email, “em ơi gấp” làm mỗi việc kéo dài gấp đôi.
        </li>
        <li>
          <strong>Nhận quá nhiều việc cùng lúc</strong> mà không ai biết bạn đang quá tải.
        </li>
      </ul>

      <h2>8 cách quản lý deadline hiệu quả</h2>
      <h3>1. Chia nhỏ việc ngay khi nhận</h3>
      <p>Viết ra các bước cụ thể, mỗi bước xong được trong 1–2 tiếng. “Làm báo cáo quý” thành “gom số liệu”, “làm biểu đồ”, “viết nhận xét”, “gửi trưởng nhóm xem”. Bước nhỏ thì dễ bắt đầu hơn nhiều.</p>
      <h3>2. Ước lượng rồi cộng thêm 50%</h3>
      <p>Nghĩ mất 4 tiếng thì lên lịch 6 tiếng. Phần dư sẽ dành cho những việc phát sinh mà bạn chưa nghĩ tới, và gần như lúc nào cũng có.</p>
      <h3>3. Đặt deadline của riêng bạn sớm hơn</h3>
      <p>Hạn thật là thứ Sáu thì đặt hạn cho mình là thứ Năm. Ngày dư dùng để kiểm tra lại, sửa lỗi hoặc xử lý sự cố.</p>
      <h3>4. Sắp xếp theo mức gấp và mức quan trọng</h3>
      <Table
        head={["", "Gấp", "Không gấp"]}
        rows={[
          ["Quan trọng", "Làm ngay", "Lên lịch cụ thể để làm"],
          ["Không quan trọng", "Nhờ người khác hoặc làm nhanh", "Bỏ qua hoặc để sau"],
        ]}
      />
      <p>Đây là cách chia việc theo ma trận Eisenhower. Phần lớn việc đáng làm nằm ở ô “quan trọng nhưng không gấp”: làm sớm thì chúng không bao giờ biến thành “gấp”.</p>
      <h3>5. Chặn lịch cho việc cần tập trung</h3>
      <p>Đặt một khung 60–90 phút trên lịch, tắt thông báo, để trạng thái “đang bận”. Làm việc sâu một mạch hiệu quả hơn nhiều so với làm xen giữa các tin nhắn.</p>
      <h3>6. Việc dưới 2 phút thì làm luôn</h3>
      <p>Trả lời một email ngắn, xác nhận một lịch họp: làm ngay thay vì ghi vào danh sách. Danh sách việc sẽ gọn hơn và đầu óc nhẹ hơn.</p>
      <h3>7. Giữ một danh sách việc duy nhất</h3>
      <p>Ghi mọi việc và hạn chót vào một chỗ (sổ tay, Google Tasks, Notion, Trello), xem lại mỗi sáng. Đừng để việc nằm rải rác trong đầu, tin nhắn và email.</p>
      <h3>8. Báo sớm khi có nguy cơ trễ</h3>
      <p>
        Biết mình có thể trễ thì báo ngay khi biết, không phải vào ngày cuối. Nói rõ phần nào đã xong, phần nào còn lại và thời điểm mới bạn chắc chắn làm được. Báo sớm cho người quản lý thêm lựa chọn: lùi hạn,
        giảm phạm vi hoặc thêm người hỗ trợ.
      </p>

      <Tip title="Mẫu tin nhắn xin lùi deadline">
        “Chị ơi, báo cáo quý em đã xong phần số liệu và biểu đồ, còn phần nhận xét. Do phải xử lý thêm việc X, em cần thêm đến 10h sáng thứ Hai để làm kỹ phần này. Nếu cần gấp, em có thể gửi bản rút gọn trong
        chiều nay ạ.”
      </Tip>

      <h2>Giải lao cũng là một phần của quản lý thời gian</h2>
      <p>
        Làm liên tục nhiều giờ không làm bạn nhanh hơn mà dễ khiến bạn sai nhiều hơn. Cứ 45–60 phút, đứng dậy vài phút, uống nước, hoặc chơi một ván game ngắn để đổi hoạt động cho não. Xem thêm{" "}
        <Link href="/cam-nang/giai-lao-van-phong">gợi ý giải lao văn phòng</Link> và <Link href="/cam-nang/cach-nhan-biet-email-lua-dao">cách nhận biết email lừa đảo</Link> để hộp thư gọn gàng hơn.
      </p>
      <PlayCta slug="deadline-dash" text="Giải lao kiểu dân văn phòng: chạy trốn bức tường deadline, nhảy qua họp đột xuất, cúi né “em ơi gấp”. Mỗi ván 1–3 phút." />
      <p>
        Tò mò mình là kiểu đồng nghiệp nào khi deadline đến gần? Thử <Link href="/games/ban-la-kieu-dong-nghiep-nao">Bạn là kiểu đồng nghiệp nào?</Link>.
      </p>
    </>
  );
}
