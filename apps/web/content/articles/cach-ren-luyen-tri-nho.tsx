import Link from "next/link";
import { PlayCta, Table, Tip } from "@/components/article/parts";

export default function Article() {
  return (
    <>
      <p>
        Muốn rèn luyện trí nhớ, hãy tập trung vào ba việc: <strong>chú ý thật sự khi tiếp nhận thông tin</strong>, <strong>gắn thông tin mới với hình ảnh hoặc điều đã biết</strong>, và <strong>nhắc lại theo thời gian</strong>.
        Ngủ đủ và vận động đều giúp cả ba việc đó hiệu quả hơn. Dưới đây là 8 bài tập trí nhớ đơn giản làm được hằng ngày, phù hợp cho cả học sinh và người đi làm.
      </p>

      <h2>Vì sao chúng ta hay quên?</h2>
      <p>
        Trí nhớ làm việc (phần giữ thông tin trong vài giây để xử lý) chỉ chứa được vài thứ cùng lúc. Vì vậy khi vừa nghe tên người mới vừa nghĩ câu trả lời, bạn quên tên ngay. Phần lớn trường hợp “quên” thật ra là{" "}
        <strong>chưa từng ghi nhớ</strong> vì lúc đó không tập trung. Thông tin đã vào trí nhớ dài hạn thì cũng phai dần nếu không được nhắc lại.
      </p>

      <h2>8 bài tập rèn luyện trí nhớ</h2>
      <h3>1. Chơi game lật thẻ tìm cặp</h3>
      <p>
        Lật hai thẻ, nhớ vị trí hình, tìm đủ các cặp. Trò này luyện trực tiếp trí nhớ ngắn hạn về vị trí. Bắt đầu với bàn nhỏ rồi tăng dần số thẻ, và cố giảm số lượt lật sau mỗi lần chơi.
      </p>
      <PlayCta slug="lat-the" text="4 cấp độ từ 12 đến 24 thẻ với hình ảnh Việt Nam: phở, bánh mì, đèn lồng, xe máy, con trâu… Tính tổng thời gian và số lượt lật để so với lần trước." />

      <h3>2. Kể lại một ngày theo thứ tự ngược</h3>
      <p>Trước khi ngủ, nhớ lại ngày hôm nay từ tối về sáng: ăn tối món gì, chiều gặp ai, trưa làm gì. Bài tập này buộc não truy xuất ký ức theo cách khác thường ngày.</p>

      <h3>3. Nhớ danh sách bằng “cung điện trí nhớ”</h3>
      <p>
        Chọn một lộ trình quen thuộc, ví dụ từ cửa nhà vào bếp. Đặt từng món cần nhớ vào một vị trí trên lộ trình, kèm hình ảnh càng lạ càng tốt: chai nước mắm treo trên tay nắm cửa, bó rau muống nằm trên sofa. Khi cần
        nhớ, chỉ việc “đi lại” lộ trình trong đầu.
      </p>

      <h3>4. Chia nhỏ thông tin thành cụm</h3>
      <p>Số điện thoại 0912345678 khó nhớ hơn nhiều so với 0912 345 678. Áp dụng cho mọi dãy số, mã đơn hàng, mật khẩu: gom thành cụm 3–4 phần tử.</p>

      <h3>5. Nhắc lại tên người mới ngay lập tức</h3>
      <p>Khi được giới thiệu “Đây là anh Tuấn”, hãy đáp “Chào anh Tuấn” và gọi tên một lần nữa trong cuộc trò chuyện. Gắn tên với một đặc điểm (Tuấn đeo kính tròn) để nhớ lâu hơn.</p>

      <h3>6. Tự kiểm tra thay vì đọc lại</h3>
      <p>
        Đọc xong một trang, gấp lại và tóm tắt bằng lời của mình. Cố nhớ lại khiến thông tin bám chắc hơn đọc nhiều lần. Áp dụng cho học bài lẫn tài liệu công việc, xem thêm trong{" "}
        <Link href="/cam-nang/cach-on-thi-hieu-qua">cách ôn thi hiệu quả</Link>.
      </p>

      <h3>7. Tính nhẩm hằng ngày</h3>
      <p>
        Tính nhẩm đòi hỏi giữ các con số trung gian trong đầu, là bài tập tốt cho trí nhớ làm việc. Vài phút mỗi ngày với <Link href="/games/bai-kiem-tra-15-phut">bài kiểm tra tính nhẩm</Link> là đủ, kèm{" "}
        <Link href="/cam-nang/meo-tinh-nham-nhanh">10 mẹo tính nhẩm nhanh</Link>.
      </p>

      <h3>8. Học một kỹ năng mới</h3>
      <p>Học một ngôn ngữ, một nhạc cụ hay một môn thể thao mới buộc não ghi nhớ liên tục. Đây là cách rèn trí nhớ bền vững và thú vị hơn mọi bài tập lặp lại.</p>

      <h2>Thói quen hằng ngày ảnh hưởng đến trí nhớ</h2>
      <Table
        head={["Thói quen", "Tác động", "Nên làm"]}
        rows={[
          ["Giấc ngủ", "Trong lúc ngủ, não sắp xếp và lưu lại điều đã học trong ngày", "Ngủ 7–8 tiếng, tránh thức khuya liên tục"],
          ["Vận động", "Tập thể dục đều giúp tỉnh táo và tập trung tốt hơn", "Đi bộ nhanh 30 phút, hầu hết các ngày trong tuần"],
          ["Làm nhiều việc cùng lúc", "Chia nhỏ sự chú ý, thông tin không kịp được ghi nhớ", "Làm từng việc một, tắt thông báo khi cần tập trung"],
          ["Căng thẳng kéo dài", "Khó tập trung, dễ quên việc vặt", "Nghỉ giải lao ngắn giữa giờ, hít thở sâu"],
          ["Ghi chép", "Viết ra giúp nhớ tốt hơn và giải phóng đầu óc", "Ghi việc cần làm vào sổ hoặc ứng dụng ghi chú"],
        ]}
      />
      <Tip>
        Đặt mục tiêu nhỏ và đo được: chơi lật thẻ mỗi sáng một lượt trong 2 tuần, ghi lại thời gian và số lượt lật. Kết quả tiến bộ rõ ràng là động lực tốt nhất để duy trì thói quen.
      </Tip>
      <p>
        Nếu bạn thấy hay quên đột ngột, quên nhiều đến mức ảnh hưởng công việc và sinh hoạt, hãy đi khám bác sĩ thay vì chỉ tự luyện tập. Muốn thêm cách giải lao có ích giữa giờ làm, xem{" "}
        <Link href="/cam-nang/giai-lao-van-phong">gợi ý giải lao văn phòng</Link>.
      </p>
    </>
  );
}
