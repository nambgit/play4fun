import Link from "next/link";
import { PlayCta, Table, Tip } from "@/components/article/parts";

export default function Article() {
  return (
    <>
      <p>
        Cờ caro là trò hai người lần lượt đặt X và O lên bàn kẻ ô, ai có <strong>5 quân liền nhau</strong> theo hàng ngang, dọc hoặc chéo trước là thắng. Muốn thắng thường xuyên, bí quyết không nằm ở việc chặn
        từng nước mà ở <strong>tạo hai đe dọa cùng lúc</strong> để đối thủ chỉ chặn được một. Bài này giải thích luật chơi, các thế cờ cơ bản và 10 mẹo để bạn thắng nhiều hơn.
      </p>

      <h2>Luật chơi cờ caro</h2>
      <ol>
        <li>Bàn cờ là lưới ô vuông, thường từ 15×15 trở lên. Bàn càng rộng, ván cờ càng có nhiều hướng phát triển.</li>
        <li>Hai người lần lượt đặt quân, người cầm X đi trước.</li>
        <li>Ai có 5 quân liền nhau theo hàng ngang, hàng dọc hoặc đường chéo trước là thắng.</li>
        <li>
          <strong>Luật chặn hai đầu</strong> (tùy nhóm): 5 quân liền nhau nhưng bị quân đối thủ chặn ở cả hai đầu thì không được tính thắng. Luật này phổ biến khi chơi ở Việt Nam và làm ván cờ khó hơn.
        </li>
        <li>Nếu bàn kín mà không ai thắng thì hòa.</li>
      </ol>
      <PlayCta slug="co-caro" text="Bàn 20×20, chơi 2 người online: ghép ngẫu nhiên, mời bạn bằng link hoặc đấu với máy. Có tùy chọn luật chặn hai đầu." />

      <h2>Các thế cờ cần biết</h2>
      <p>Người chơi caro gọi tên các thế theo số quân liền nhau và việc hai đầu còn trống (“mở”, “thoáng”) hay đã bị chặn:</p>
      <Table
        head={["Thế cờ", "Ví dụ (· là ô trống, O là quân chặn)", "Ý nghĩa"]}
        rows={[
          ["Hai mở", "· X X ·", "Mầm của thế tấn công"],
          ["Ba mở (ba thoáng)", "· X X X ·", "Phải chặn ngay, nếu không sẽ thành bốn mở"],
          ["Ba chặn", "O X X X ·", "Còn một đầu, chưa nguy hiểm ngay"],
          ["Bốn chặn", "O X X X X ·", "Buộc đối thủ chặn ô còn lại"],
          ["Bốn mở", "· X X X X ·", "Thắng chắc: chặn đầu này thì đi đầu kia"],
        ]}
      />
      <p>
        Từ bảng trên có thể thấy: <strong>bốn mở</strong> là thắng, nên <strong>ba mở</strong> là lời cảnh báo cuối cùng. Khi đối thủ có ba mở mà bạn không có nước thắng nhanh hơn, hãy chặn ngay.
      </p>

      <h2>Chìa khóa để thắng: đe dọa kép</h2>
      <p>Đối thủ mỗi lượt chỉ chặn được một chỗ. Vì vậy, nước đi tạo ra hai đe dọa cùng lúc gần như luôn quyết định ván cờ:</p>
      <Table
        head={["Đòn", "Cách tạo", "Vì sao thắng"]}
        rows={[
          ["Bốn – ba", "Một nước vừa tạo bốn chặn, vừa tạo ba mở", "Đối thủ buộc chặn bốn, bạn biến ba mở thành bốn mở"],
          ["Ba – ba (đôi ba)", "Một nước tạo hai ba mở trên hai hướng", "Chặn hướng này thì hướng kia thành bốn mở"],
          ["Bốn – bốn", "Một nước tạo hai bốn chặn", "Không thể chặn cả hai ô cùng lúc"],
        ]}
      />
      <Tip title="Luyện mắt nhìn đòn kép">
        Trước mỗi nước, hãy tìm ô giao nhau của hai đường quân mình đang có. Ô giao nhau đó thường là nơi tạo được đe dọa kép, cả với bạn lẫn với đối thủ.
      </Tip>

      <h2>10 mẹo chơi cờ caro giỏi hơn</h2>
      <ol>
        <li>
          <strong>Mở đầu gần trung tâm.</strong> Ở giữa bàn, quân của bạn phát triển được theo cả 8 hướng; sát mép thì mất một nửa.
        </li>
        <li>
          <strong>Đánh thành cụm, đừng rải rác.</strong> Quân đứng gần nhau mới tạo được nhiều đường cùng lúc.
        </li>
        <li>
          <strong>Ưu tiên nước vừa công vừa thủ:</strong> ô vừa chặn đường của đối thủ vừa nối dài đường của mình.
        </li>
        <li>
          <strong>Chặn ba mở ngay</strong>, trừ khi bạn có chuỗi tấn công buộc đối thủ phải đỡ liên tục đến khi thắng.
        </li>
        <li>
          <strong>Chặn ở đầu có lợi cho mình:</strong> khi chặn, chọn đầu nào giúp quân của bạn nối thêm được.
        </li>
        <li>
          <strong>Để ý đường chéo.</strong> Người mới hay bỏ sót đòn chéo vì mắt quen nhìn hàng ngang và dọc.
        </li>
        <li>
          <strong>Tấn công liên tục bằng bốn chặn.</strong> Mỗi lần tạo bốn, đối thủ buộc phải chặn; tận dụng những lượt “bắt buộc” đó để xếp quân cho đòn kép.
        </li>
        <li>
          <strong>Đi trước thì tấn công, đi sau thì phòng thủ chắc.</strong> Người đi trước có lợi thế rõ trong caro; khi đi sau, chặn sớm và chờ đối thủ sơ hở.
        </li>
        <li>
          <strong>Với luật chặn hai đầu</strong>, giữ đường của mình luôn có một đầu thoáng; đường đã bị chặn một đầu thì nên chuyển hướng.
        </li>
        <li>
          <strong>Luyện với máy ở mức khó</strong> để quen phản xạ chặn, rồi xem lại ván thua để tìm nước bạn bỏ sót.
        </li>
      </ol>

      <h2>Những lỗi người mới hay mắc</h2>
      <ul>
        <li>Chỉ lo tấn công đường của mình và không thấy ba mở của đối thủ.</li>
        <li>Chặn quá sớm những thế chưa nguy hiểm (như hai chặn), mất lượt tấn công.</li>
        <li>Đánh dạt ra mép bàn, tự giới hạn hướng phát triển.</li>
        <li>Vội vàng: một nước đi chậm vài giây để quét toàn bàn thường cứu được cả ván.</li>
      </ul>
      <p>
        Thích trò đấu trí hai người? Thử thêm <Link href="/games/noi-tu">nối từ online</Link> hoặc rủ cả nhóm chơi <Link href="/cam-nang/luat-choi-ma-soi">Ma sói</Link>.
      </p>
    </>
  );
}
