import Link from "next/link";
import { PlayCta, Table, Tip } from "@/components/article/parts";

export default function Article() {
  return (
    <>
      <p>
        Ôn thi hiệu quả không nằm ở số giờ ngồi bàn học, mà ở cách học: <strong>tự kiểm tra thay vì đọc lại</strong>, <strong>chia nhỏ và ôn lặp lại theo thời gian</strong>, và <strong>ngủ đủ</strong> trước ngày thi.
        Bài này tổng hợp 7 phương pháp ôn thi được dùng nhiều nhất, một lịch ôn mẫu 4 tuần, và mẹo riêng cho từng kiểu người học: cú đêm, chiến thần nước rút, mọt sách hay thủ lĩnh học nhóm.
      </p>

      <h2>7 phương pháp ôn thi hiệu quả</h2>
      <h3>1. Tự kiểm tra (active recall)</h3>
      <p>
        Gấp sách lại và tự hỏi: “Mình nhớ được gì về phần này?”. Viết ra, nói ra, hoặc làm đề. Việc cố nhớ lại khiến kiến thức bám chắc hơn nhiều so với đọc đi đọc lại, dù đọc lại cho cảm giác “quen quen” dễ chịu hơn.
      </p>
      <h3>2. Ôn lặp lại ngắt quãng (spaced repetition)</h3>
      <p>Thay vì học một bài 3 tiếng liền, chia ra ôn 30 phút hôm nay, 20 phút sau 2 ngày, 15 phút sau 1 tuần. Mỗi lần ôn lại đúng lúc sắp quên, trí nhớ được củng cố lâu hơn.</p>
      <h3>3. Phương pháp Pomodoro</h3>
      <p>Học tập trung 25 phút, nghỉ 5 phút; sau 4 lượt thì nghỉ dài 15–30 phút. Khung thời gian ngắn giúp dễ bắt đầu, nhất là với môn mình ngại.</p>
      <h3>4. Giảng lại cho người khác</h3>
      <p>Nếu bạn giải thích được một khái niệm bằng lời đơn giản cho bạn bè (hoặc cho một người tưởng tượng), bạn đã hiểu nó. Chỗ nào ngập ngừng chính là chỗ cần học lại.</p>
      <h3>5. Học xen kẽ các dạng bài</h3>
      <p>Trộn nhiều dạng bài trong một buổi (ví dụ toán: phương trình, hình học, xác suất) thay vì làm 20 bài cùng một dạng. Ban đầu khó hơn, nhưng giúp bạn nhận ra dạng bài khi đi thi, đúng như đề thật.</p>
      <h3>6. Làm đề thi thử có tính giờ</h3>
      <p>Ít nhất 2–3 đề trong điều kiện giống thật: đúng thời gian, không xem tài liệu. Sau đó dành thời gian chữa từng câu sai, vì phần chữa bài mới là lúc học nhiều nhất.</p>
      <h3>7. Ngủ đủ, đặc biệt đêm trước khi thi</h3>
      <p>Trong lúc ngủ, não sắp xếp và lưu lại những gì đã học. Thức trắng đêm để “nhồi” thêm thường khiến bạn mệt, kém tập trung và quên chính những phần vừa học.</p>

      <h2>Lịch ôn thi mẫu 4 tuần</h2>
      <Table
        head={["Thời gian", "Việc cần làm"]}
        rows={[
          ["Tuần 1", "Lập đề cương, đánh dấu phần trọng tâm và phần mình yếu. Ôn lý thuyết từng chương, mỗi tối tự kiểm tra lại chương vừa học."],
          ["Tuần 2", "Làm bài tập theo chương, xen kẽ các dạng. Ôn lại nhanh chương tuần 1 (ôn ngắt quãng)."],
          ["Tuần 3", "Làm 2–3 đề thi thử có tính giờ, chữa kỹ câu sai, học lại phần còn hổng."],
          ["Tuần 4", "Ôn lại phần trọng tâm và lỗi hay mắc. Hai ngày cuối học nhẹ, ngủ đủ, chuẩn bị giấy tờ và đồ dùng thi."],
        ]}
      />

      <h2>Mẹo ôn thi cho từng kiểu người học</h2>
      <p>Mỗi người có một kiểu học quen thuộc. Biết mình thuộc kiểu nào giúp bạn giữ điểm mạnh và tránh cái bẫy riêng của kiểu đó.</p>
      <Table
        head={["Kiểu người học", "Điểm mạnh", "Cần cẩn thận", "Mẹo ôn thi"]}
        rows={[
          ["🦉 Cú đêm", "Tập trung sâu khi yên tĩnh", "Thiếu ngủ làm giảm trí nhớ", "Học khung 21h–23h30 thay vì quá nửa đêm; ôn nhanh 10 phút mỗi sáng"],
          ["🏃 Chiến thần nước rút", "Tập trung cao khi có áp lực", "Nhồi nhanh thì quên nhanh", "Ôn nhẹ 2 buổi mỗi tuần từ sớm; dùng flashcard và tự kiểm tra"],
          ["📖 Mọt sách chính hiệu", "Kỷ luật, nền tảng vững", "Mất nhiều thời gian chép cho đẹp", "Bớt chép lại, dành thời gian giải đề và giảng bài cho bạn"],
          ["🤝 Thủ lĩnh học nhóm", "Hiểu sâu nhờ thảo luận", "Học nhóm dễ thành tán gẫu", "Mỗi buổi một mục tiêu rõ ràng; xen 1–2 buổi tự học mỗi tuần"],
        ]}
      />
      <PlayCta slug="ban-hoc-kieu-gi" text="10 tình huống mùa thi, 3 phút để biết bạn thuộc kiểu học nào, kèm điểm mạnh và mẹo ôn thi riêng." />

      <h2>Những sai lầm hay gặp khi ôn thi</h2>
      <ul>
        <li>
          <strong>Tô màu, gạch chân thật nhiều</strong> rồi nghĩ là đã học. Gạch chân chỉ giúp tìm lại thông tin, không giúp nhớ.
        </li>
        <li>
          <strong>Chỉ học phần mình đã giỏi</strong> vì thấy dễ chịu, bỏ qua phần yếu.
        </li>
        <li>
          <strong>Vừa học vừa lướt điện thoại.</strong> Để điện thoại ở phòng khác trong mỗi lượt Pomodoro.
        </li>
        <li>
          <strong>Học dồn đêm cuối</strong> và vào phòng thi trong tình trạng thiếu ngủ.
        </li>
      </ul>
      <Tip>
        Giờ nghỉ giữa các lượt học, hãy rời mắt khỏi sách: đứng dậy đi lại, uống nước, hoặc chơi một mini-game ngắn để đổi hoạt động cho não. Môn toán thì có thể vừa nghỉ vừa luyện{" "}
        <Link href="/games/bai-kiem-tra-15-phut">tính nhẩm 15 phút</Link> hoặc xem <Link href="/cam-nang/meo-tinh-nham-nhanh">10 mẹo tính nhẩm nhanh</Link>.
      </Tip>
    </>
  );
}
