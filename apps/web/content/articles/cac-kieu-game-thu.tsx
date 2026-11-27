import Link from "next/link";
import { PlayCta, Table, Tip } from "@/components/article/parts";

export default function Article() {
  return (
    <>
      <p>
        Mỗi người chơi game vì một lý do khác nhau: có người để thắng, có người để thư giãn, có người vì bạn bè. Dựa vào cách bạn chơi, có thể chia game thủ thành 5 “hệ” quen thuộc:{" "}
        <strong>Tryhard, Chill, Gánh team, Khám phá và Tấu hài</strong>. Bài này mô tả từng hệ, thể loại game hợp với mỗi hệ và mẹo để chơi vui hơn.
      </p>

      <h2>5 kiểu game thủ phổ biến</h2>
      <Table
        head={["Hệ", "Chơi game để…", "Điểm mạnh", "Hay gặp"]}
        rows={[
          ["🔥 Tryhard", "Thắng và giỏi hơn mỗi ngày", "Kỹ năng cao, kỷ luật luyện tập", "Dễ cáu khi đồng đội mắc lỗi"],
          ["🌿 Chill", "Thư giãn sau một ngày dài", "Tâm lý vững, dễ chơi cùng", "Ngại thử thách khó, hay bỏ dở"],
          ["🛡️ Gánh team", "Cùng cả đội chiến thắng", "Chỉ huy, giao tiếp, không bỏ cuộc", "Ôm hết trách nhiệm khi thua"],
          ["🗺️ Khám phá", "Đi hết mọi ngóc ngách, đạt 100%", "Kiên nhẫn, hiểu sâu cốt truyện", "Một game chơi mãi chưa xong"],
          ["🤡 Tấu hài", "Mang lại tiếng cười", "Sáng tạo, dám thử điều lạ", "Đồng đội nghiêm túc có thể bực mình"],
        ]}
      />
      <PlayCta slug="gamer-he-nao" text="12 tình huống khi chơi game, 3 phút để biết bạn thuộc hệ nào, kèm điểm mạnh, điểm cần lưu ý và bạn chơi hợp cạ." />

      <h2>Mỗi hệ hợp với thể loại game nào?</h2>
      <h3>Hệ Tryhard: game đối kháng, có bảng xếp hạng</h3>
      <p>
        Game thi đấu xếp hạng, game bắn súng, game đối kháng, hay đơn giản là mini-game có bảng xếp hạng kỷ lục đều hợp với người thích vượt qua chính mình. Mẹo: đặt giới hạn số trận leo hạng mỗi ngày và dừng
        sau 2 trận thua liên tiếp.
      </p>
      <h3>Hệ Chill: game nông trại, xây dựng, giải đố nhẹ</h3>
      <p>
        Những game không áp lực thời gian, có nhạc hay và cảnh đẹp. Game hợp tác với bạn bè cũng rất hợp, vì bạn là người giữ cho cả nhóm vui vẻ kể cả khi thua.
      </p>
      <h3>Hệ Gánh team: game đồng đội</h3>
      <p>
        Game chiến thuật theo đội, game sinh tồn chơi nhóm, game nhập vai nhiều người. Mẹo: chỉ huy ngắn gọn, một câu một mục tiêu, và thỉnh thoảng nhận vị trí mình thích để chính bạn cũng vui.
      </p>
      <h3>Hệ Khám phá: game thế giới mở, nhập vai, giải đố</h3>
      <p>Game có bản đồ rộng, nhiều nhiệm vụ phụ và bí mật ẩn. Mẹo: chọn một game để hoàn thành trước khi mở game mới, danh sách “chờ chơi” sẽ bớt dài.</p>
      <h3>Hệ Tấu hài: party game</h3>
      <p>
        Trò chơi nhóm như <Link href="/games/ve-doan-chu">Vẽ &amp; đoán</Link>, <Link href="/games/ai-la-gian-diep">Ai là gián điệp</Link> hay <Link href="/games/ai-de-nhat">Ai dễ… nhất?</Link> là sân
        khấu của bạn. Mẹo: tấu hài ở chế độ thường, nghiêm túc ở chế độ xếp hạng, vậy là ai cũng vui.
      </p>

      <h2>Chơi game lành mạnh, kiểu nào cũng nên nhớ</h2>
      <ul>
        <li>
          <strong>Nghỉ mắt định kỳ:</strong> cứ khoảng 20 phút, nhìn ra xa vài giây cho mắt thư giãn.
        </li>
        <li>
          <strong>Không thức khuya vì “trận cuối”:</strong> thiếu ngủ làm phản xạ chậm đi rõ rệt, chơi càng thua. Xem thêm{" "}
          <Link href="/cam-nang/thoi-gian-phan-xa">thời gian phản xạ và cách cải thiện</Link>.
        </li>
        <li>
          <strong>Đứng dậy vận động</strong> giữa các trận dài, uống nước và giãn cơ cổ, vai.
        </li>
        <li>
          <strong>Tôn trọng đồng đội và đối thủ:</strong> thắng thua là chuyện bình thường, cuộc trò chuyện tử tế mới làm game vui.
        </li>
      </ul>
      <Tip>
        Rủ bạn bè cùng làm trắc nghiệm rồi so kết quả: mỗi hệ có một “bạn chơi hợp cạ”, ví dụ hệ Tryhard thường chơi ăn ý với hệ Gánh team.
      </Tip>
      <p>
        Muốn thử tay ngay? Chơi <Link href="/games/pixel-dodge">Pixel Dodge</Link> (né đạn) hoặc <Link href="/games/deadline-dash">Deadline Dash</Link> và leo bảng xếp hạng.
      </p>
    </>
  );
}
