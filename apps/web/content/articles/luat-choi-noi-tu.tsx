import Link from "next/link";
import { PlayCta, Table, Tip } from "@/components/article/parts";

export default function Article() {
  return (
    <>
      <p>
        Nối từ là trò chơi chữ quen thuộc của người Việt: người trước nói một từ hai tiếng, người sau phải nói một từ mới bắt đầu bằng tiếng cuối của từ đó, ví dụ “học sinh” → “sinh viên” → “viên chức”. Ai không nghĩ ra từ
        kịp thì thua lượt. Dưới đây là luật chơi đầy đủ, các biến thể phổ biến và mẹo để làm đối thủ “bí từ”.
      </p>

      <h2>Luật chơi nối từ cơ bản</h2>
      <ol>
        <li>
          <strong>Mỗi từ gồm hai tiếng</strong> và phải là từ có nghĩa, ví dụ “bàn ghế”, “mặt trời”. Không dùng tên riêng.
        </li>
        <li>
          <strong>Từ sau bắt đầu bằng tiếng cuối của từ trước</strong>, giữ nguyên dấu: “trời mưa” chỉ nối được bằng từ bắt đầu bằng “mưa” (mưa phùn), không phải “mua”.
        </li>
        <li>
          <strong>Mỗi từ chỉ dùng một lần</strong> trong cả ván.
        </li>
        <li>
          <strong>Có giới hạn thời gian</strong>, thường 5–10 giây mỗi lượt. Hết giờ hoặc nói từ không có nghĩa thì mất lượt hoặc bị loại.
        </li>
        <li>Người cuối cùng còn trụ lại thắng.</li>
      </ol>

      <h2>Các biến thể hay gặp</h2>
      <Table
        head={["Biến thể", "Cách chơi", "Hợp với"]}
        rows={[
          ["Nối từ theo chủ đề", "Mọi từ phải thuộc một chủ đề: đồ ăn, nghề nghiệp, thiên nhiên", "Lớp học, trẻ em"],
          ["Nối từ đảo", "Nối bằng tiếng đầu thay vì tiếng cuối", "Người đã chơi giỏi"],
          ["Nối từ có loại", "Ai bí từ thì bị loại, chơi đến người cuối", "Nhóm đông"],
          ["Nối từ đồng đội", "Chia hai đội, nối luân phiên, đội nào bí trước thua", "Team building"],
          ["Nối từ online", "Đấu 1-1 với bạn bè, người lạ hoặc với máy, máy kiểm tra từ điển", "Luyện từ vựng, giải trí"],
        ]}
      />

      <PlayCta slug="noi-tu" text="Chơi nối từ online: ghép ngẫu nhiên với người lạ, mời bạn bằng link hoặc đấu với máy. Hơn 20.000 từ ghép, làm đối thủ bí để thắng." />

      <h2>Mẹo chơi nối từ giỏi hơn</h2>
      <h3>Dùng từ có tiếng cuối “khó nối”</h3>
      <p>
        Một số tiếng gần như chỉ đứng cuối từ, rất ít từ bắt đầu bằng chúng. Ví dụ “bâng khuâng” (khuâng), “loằng ngoằng” (ngoằng), “ngoằn ngoèo” (ngoèo). Ở nhiều nhóm, nói được những từ này gần như chắc thắng lượt, nên
        hãy thống nhất trước có cho dùng từ láy hay không.
      </p>
      <h3>Nhớ sẵn vài “từ cứu cánh” cho tiếng hay gặp</h3>
      <p>Những tiếng xuất hiện liên tục trong ván nên có sẵn hai ba từ để nối ngay:</p>
      <Table
        head={["Tiếng", "Từ nối gợi ý"]}
        rows={[
          ["sinh", "sinh viên, sinh nhật, sinh động"],
          ["học", "học sinh, học bổng, học hỏi"],
          ["nhà", "nhà cửa, nhà hàng, nhà văn"],
          ["người", "người yêu, người lớn, người dân"],
          ["hoa", "hoa hồng, hoa quả, hoa văn"],
          ["mặt", "mặt trời, mặt trăng, mặt nạ"],
          ["tình", "tình yêu, tình bạn, tình cảm"],
          ["đất", "đất nước, đất đai, đất liền"],
        ]}
      />
      <h3>Tránh tự đưa mình vào thế khó</h3>
      <p>Trước khi nói, nghĩ nhanh xem tiếng cuối từ của mình có dễ bị dùng ngược lại để chặn bạn ở lượt sau không, nhất là khi chơi hai người.</p>
      <h3>Đọc nhiều, chơi nhiều</h3>
      <p>Vốn từ là lợi thế lớn nhất. Chơi vài ván mỗi ngày, với bạn bè hay với máy, là cách nhanh để nhớ thêm từ ghép, vì mỗi lần thua hiệp bạn sẽ thấy gợi ý những từ có thể dùng.</p>

      <Tip>
        Khi chơi với trẻ em, bỏ giới hạn thời gian và cho phép gợi ý. Nối từ là cách học từ vựng tiếng Việt rất tự nhiên, quan trọng là để các bé thấy vui chứ không phải thắng thua.
      </Tip>
      <p>
        Thích trò chơi chữ? Thử thêm <Link href="/games/doan-chu">đoán chữ hằng ngày</Link> hoặc xem <Link href="/cam-nang/tu-khoa-ve-doan-chu">100 từ khóa vẽ đoán chữ</Link> cho buổi chơi nhóm.
      </p>
    </>
  );
}
