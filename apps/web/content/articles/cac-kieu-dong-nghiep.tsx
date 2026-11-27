import Link from "next/link";
import { PlayCta, Table, Tip } from "@/components/article/parts";

export default function Article() {
  return (
    <>
      <p>
        Ở văn phòng nào cũng có vài “kiểu đồng nghiệp” quen thuộc: người nước rút sát deadline, người cầm biên bản mọi cuộc họp, người rủ cả phòng đi trà sữa, người nhiều ý tưởng nhất và người được gọi
        mỗi khi có sự cố. Mỗi kiểu có điểm mạnh riêng. Hiểu mình và đồng nghiệp thuộc kiểu nào giúp chia việc hợp lý hơn và bớt va chạm hơn. Bài này mô tả 5 kiểu đồng nghiệp phổ biến và cách làm việc ăn ý
        với từng kiểu.
      </p>

      <h2>5 kiểu đồng nghiệp nơi công sở</h2>
      <Table
        head={["Kiểu", "Điểm mạnh", "Hay gặp"]}
        rows={[
          ["⚡ Chiến thần deadline", "Tập trung cực cao khi có áp lực, quyết nhanh", "Dồn việc tới phút chót, ít thời gian soát lỗi"],
          ["📋 Người giữ nhịp", "Lên kế hoạch xuất sắc, đáng tin, đúng hẹn", "Căng thẳng khi kế hoạch bị phá, hay cầu toàn"],
          ["🧋 Đại sứ trà sữa", "Kết nối mọi người, tạo không khí tích cực", "Khó từ chối khi được nhờ, dễ bị cuốn vào trò chuyện"],
          ["💡 Ngôi sao ý tưởng", "Sáng tạo, truyền cảm hứng, dám thử", "Bắt đầu nhiều hơn kết thúc, chán việc lặp lại"],
          ["🧯 Người chữa cháy", "Xử lý sự cố nhanh, bình tĩnh, thực tế", "Bị gọi vào mọi việc, ít thời gian cho việc dài hạn"],
        ]}
      />
      <PlayCta slug="ban-la-kieu-dong-nghiep-nao" text="10 tình huống công sở, 3 phút để biết bạn thuộc kiểu nào, kèm tỉ lệ từng kiểu, điểm mạnh và mẹo làm việc riêng." />

      <h2>Làm việc ăn ý với từng kiểu đồng nghiệp</h2>
      <h3>⚡ Chiến thần deadline</h3>
      <p>
        Đừng hối thúc từng ngày; thay vào đó, thống nhất vài <strong>mốc trung gian</strong> rõ ràng, ví dụ “thứ Tư gửi bản nháp”. Họ làm tốt nhất khi có mốc cụ thể. Nếu bạn là kiểu này: tự đặt deadline
        sớm hơn hạn thật một ngày và luôn chừa 30 phút cuối để soát lỗi trước khi gửi.
      </p>
      <h3>📋 Người giữ nhịp</h3>
      <p>
        Báo sớm khi có thay đổi, đừng để họ phát hiện vào phút chót. Cập nhật tiến độ vào nơi chung (bảng việc, file theo dõi) để họ không phải đi hỏi từng người. Nếu bạn là kiểu này: chừa khoảng 20% thời
        gian trống trong kế hoạch cho việc phát sinh, và để lịch, checklist nhắc deadline thay vì tự nhắc từng người.
      </p>
      <h3>🧋 Đại sứ trà sữa</h3>
      <p>
        Họ rất hợp với việc cần phối hợp nhiều người, nhiều phòng ban. Khi cần họ tập trung, hãy nói rõ thời hạn và tôn trọng khung giờ “không làm phiền” của họ. Nếu bạn là kiểu này: tập nói “để mình xong
        việc này rồi giúp nhé” thay vì nhận ngay mọi lời nhờ.
      </p>
      <h3>💡 Ngôi sao ý tưởng</h3>
      <p>
        Lắng nghe trước khi phản biện, rồi cùng họ chọn <strong>một</strong> ý tưởng để làm tới cùng. Ghép họ với một người giữ nhịp là cặp đôi rất mạnh: một người nghĩ, một người biến thành kế hoạch. Nếu
        bạn là kiểu này: ghi mọi ý tưởng vào một chỗ, thử nghiệm nhỏ trước rồi mới xin nguồn lực lớn.
      </p>
      <h3>🧯 Người chữa cháy</h3>
      <p>
        Đừng gọi họ cho mọi việc nhỏ; tự thử trước, ghi lại đã làm gì rồi mới nhờ. Ghi nhận công sức của họ trước cả nhóm, vì công việc “dập lửa” thường âm thầm. Nếu bạn là kiểu này: sau mỗi sự cố, viết 3
        dòng về nguyên nhân và cách phòng, và hướng dẫn thêm một người biết xử lý để bạn không phải trực mọi lúc.
      </p>

      <h2>Một nhóm tốt cần đủ các kiểu</h2>
      <p>
        Không kiểu nào “tốt hơn” kiểu nào. Nhóm chỉ toàn người giữ nhịp sẽ chắc chắn nhưng thiếu ý tưởng mới; nhóm chỉ toàn ngôi sao ý tưởng sẽ có nhiều kế hoạch nhưng ít việc về đích. Khi chia việc, hãy
        để mỗi người làm phần hợp với điểm mạnh của mình và bổ sung cho nhau.
      </p>
      <Tip title="Hoạt động cho buổi họp team">
        Cho cả team làm trắc nghiệm trong 3 phút rồi chia sẻ kết quả. Mọi người thường bất ngờ về đồng nghiệp, và đây là cách nhẹ nhàng để nói về cách làm việc của nhau mà không ai thấy bị phê bình.
      </Tip>
      <p>
        Thêm hoạt động cho team: <Link href="/cam-nang/cau-hoi-ai-de-nhat">60 câu hỏi “Ai dễ… nhất?”</Link>, <Link href="/cam-nang/cau-hoi-de-hieu-nhau">50 câu hỏi để hiểu nhau hơn</Link> và{" "}
        <Link href="/cam-nang/cach-quan-ly-deadline">cách quản lý deadline không bị trễ hạn</Link>.
      </p>
    </>
  );
}
