import Link from "next/link";
import { PlayCta, Table, Tip } from "@/components/article/parts";

export default function Article() {
  return (
    <>
      <p>
        Đoán chữ tiếng Việt (giống Wordle) là trò đoán một từ 5 chữ cái trong 6 lượt. Bạn gõ một từ có nghĩa, mỗi ô đổi màu để gợi ý: <strong>xanh</strong> là chữ đúng và đúng chỗ, <strong>vàng</strong> là chữ có trong
        từ nhưng sai chỗ, <strong>xám</strong> là chữ không có. Từ được gõ không dấu, ví dụ “nguoi” là “người”. Dưới đây là luật chơi chi tiết, từ mở đầu nên dùng và một ván mẫu giải trong 4 lượt.
      </p>

      <h2>Luật chơi đoán chữ</h2>
      <ol>
        <li>
          <strong>Mỗi lượt gõ một từ 5 chữ cái</strong>, viết không dấu, “đ” gõ thành “d”. Từ phải là một tiếng Việt viết được, như “thang”, “chieu”, không phải dãy chữ bất kỳ.
        </li>
        <li>
          <strong>Đọc màu sau mỗi lượt:</strong> xanh đúng chỗ, vàng có nhưng sai chỗ, xám không có trong từ.
        </li>
        <li>
          <strong>Có 6 lượt.</strong> Đoán đúng cả 5 ô xanh là thắng.
        </li>
        <li>
          <strong>Mỗi ngày một từ chung cho mọi người</strong>, nên bạn có thể so kết quả với bạn bè. Muốn chơi thêm thì dùng chế độ luyện tập với từ ngẫu nhiên.
        </li>
      </ol>
      <Tip title="Chữ lặp lại">
        Nếu bạn gõ một chữ hai lần mà đáp án chỉ có một, chỉ một ô được tô màu, ô còn lại là xám. Ô xanh luôn được tính trước, sau đó mới đến ô vàng.
      </Tip>

      <PlayCta slug="doan-chu" text="Mỗi ngày một từ mới, 6 lượt đoán, có chuỗi ngày thắng và nút chia sẻ kết quả dạng ô màu cho bạn bè." />

      <h2>Đặc điểm của từ 5 chữ cái tiếng Việt</h2>
      <p>
        Bỏ dấu đi, tiếng Việt không có nhiều tiếng dài đúng 5 chữ cái, và chúng có cấu trúc rất đều. Mình đếm trên kho 134 từ đáp án của game Đoán chữ trên play4fun:
      </p>
      <Table
        head={["Đặc điểm", "Số liệu", "Ý nghĩa khi đoán"]}
        rows={[
          ["Chữ thứ 2 là “h”", "63/134 từ", "Gần một nửa bắt đầu bằng kh, th, ch, nh, ph, gh…"],
          ["Kết thúc bằng “ng”", "49/134 từ", "Hơn 1/3 số từ: thang, khung, huong, chong…"],
          ["Kết thúc bằng “nh”", "15/134 từ", "chanh, thanh, nhanh, tranh, ngành…"],
          ["Chữ “n” xuất hiện", "99/134 từ", "Chữ phổ biến nhất, gần như luôn nên có trong từ đầu"],
          ["Chữ hiếm", "b, s, v, l, d, q", "Mỗi chữ chỉ có trong 2–4 từ, đừng thử sớm"],
        ]}
      />
      <p>
        Nói cách khác, phần lớn từ có dạng <strong>phụ âm đôi + nguyên âm + ng/nh</strong>. Hiểu được khung này, bạn sẽ đoán nhanh hơn rất nhiều so với thử ngẫu nhiên.
      </p>

      <h2>Từ mở đầu nên dùng</h2>
      <p>Từ đầu tiên tốt là từ chứa các chữ phổ biến nhất (n, h, g, u, o, i, e) và không lặp chữ. Một số lựa chọn mạnh:</p>
      <Table
        head={["Từ gõ", "Nghĩa", "Vì sao tốt"]}
        rows={[
          ["huong", "hương", "Có cả h, u, o, n, g, đều là chữ hay gặp nhất"],
          ["nguoi", "người", "Thử 3 nguyên âm u, o, i cùng lúc, kèm n và g"],
          ["nghia", "nghĩa", "Kiểm tra cụm “ngh” và hai nguyên âm i, a"],
          ["thang", "tháng", "Thử t (phụ âm đầu hay gặp nhất) và đuôi “ng”"],
          ["chieu", "chiều", "Hợp làm từ thứ hai: thử c, e và đuôi “eu”"],
        ]}
      />
      <p>Một cặp mở đầu dễ nhớ là “nguoi” rồi “thang”: sau hai lượt bạn đã thử 3 nguyên âm, phụ âm đầu t và đuôi “ng”, đủ để khoanh vùng hầu hết các từ.</p>

      <h2>Ván mẫu: giải trong 4 lượt</h2>
      <p>Giả sử đáp án là “khung”. Đây là cách các gợi ý dẫn đường:</p>
      <Table
        head={["Lượt", "Từ gõ", "Kết quả", "Rút ra"]}
        rows={[
          ["1", "nguoi", "n vàng, g vàng, u xanh, o xám, i xám", "Có n, g nhưng sai chỗ; chữ thứ 3 là u"],
          ["2", "thang", "t xám, h xanh, a xám, n xanh, g xanh", "Dạng _hung; loại t nên không phải “thung”"],
          ["3", "chung", "c xám, còn lại xanh", "Còn “khung” và “nhung”"],
          ["4", "khung", "Cả 5 ô xanh", "Thắng!"],
        ]}
      />
      <p>
        Lượt 3 cho thấy cái bẫy hay gặp: khi đã biết 4 chữ, vẫn còn vài từ cùng khung (chung, khung, nhung, thung). Nếu còn nhiều lượt, hãy đoán từ phổ biến nhất trước. Nếu chỉ còn 1–2 lượt mà có 3 khả năng, có
        thể gõ một từ chứa nhiều phụ âm đầu cần loại để thăm dò thay vì đoán mò.
      </p>

      <h2>Mẹo đoán chữ nhanh hơn</h2>
      <ul>
        <li>
          <strong>Nghĩ theo vần, không theo chữ cái:</strong> biết đuôi là “ng” thì liệt kê các vần ang, ong, ung, uong, ieng rồi ghép phụ âm đầu.
        </li>
        <li>
          <strong>Dùng chữ xám để loại trừ:</strong> bàn phím trên màn hình tô xám các chữ đã loại, nhìn vào đó trước khi gõ.
        </li>
        <li>
          <strong>Không lặp lại chữ đã biết là sai.</strong> Mỗi lượt nên thử ít nhất 2–3 chữ mới.
        </li>
        <li>
          <strong>Nhớ rằng dấu không tính:</strong> “thang” có thể là tháng, thằng hay thẳng. Đừng mất thời gian nghĩ xem từ có dấu gì.
        </li>
      </ul>

      <p>
        Thích trò chơi chữ? Thử thêm <Link href="/games/noi-tu">nối từ 2 người</Link>, đọc <Link href="/cam-nang/luat-choi-noi-tu">luật chơi nối từ và mẹo làm đối thủ bí</Link>, hoặc chơi{" "}
        <Link href="/cam-nang/tu-khoa-ve-doan-chu">vẽ đoán chữ</Link> cùng nhóm bạn.
      </p>
    </>
  );
}
