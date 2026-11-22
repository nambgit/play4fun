import Link from "next/link";
import { PlayCta, Table, Tip } from "@/components/article/parts";

export default function Article() {
  return (
    <>
      <p>
        Một tiệc tất niên vui không cần nhiều tiền, chỉ cần vài trò chơi đúng lúc: trò khởi động để mọi người bớt ngại, trò thi đấu giữa các bàn để cả hội trường cùng hò reo, và một trò “chốt” để trao quà. Dưới đây là 15
        trò chơi tất niên công ty chia theo từng phần của buổi tiệc, kèm một kịch bản mẫu 2 tiếng và mẹo tổ chức để không ai bị bỏ rơi.
      </p>

      <h2>Trò khởi động (5–10 phút, lúc khách mới vào)</h2>
      <h3>1. Bingo đồng nghiệp</h3>
      <p>
        Phát cho mỗi người một tờ bingo 4×4 với các ô như “đi làm bằng xe buýt”, “từng làm ở chi nhánh khác”, “có con nhỏ dưới 3 tuổi”. Mọi người đi hỏi nhau và ghi tên vào ô; ai đủ một hàng trước thì lên nhận quà. Trò này
        giúp các phòng ban ít gặp nhau bắt chuyện tự nhiên.
      </p>
      <h3>2. Đoán ảnh hồi nhỏ</h3>
      <p>Thu trước ảnh lúc nhỏ của các sếp và vài nhân viên “nổi tiếng”, chiếu lần lượt lên màn hình để cả hội trường đoán. Gần như lúc nào cũng có tiếng cười, nhất là ảnh của sếp tổng.</p>
      <h3>3. Một từ cho năm nay</h3>
      <p>MC mời đại diện mỗi phòng nói đúng một từ mô tả năm vừa qua rồi giải thích trong một câu. Nhanh, nhẹ nhàng và dễ chuyển sang phần tổng kết.</p>

      <h2>Trò chơi cả hội trường cùng tham gia</h2>
      <h3>4. Đố vui trên điện thoại có bảng xếp hạng</h3>
      <p>
        Chiếu câu hỏi lên màn hình lớn, mọi người quét mã QR và trả lời bằng điện thoại, bảng xếp hạng cập nhật sau mỗi câu. Trộn câu hỏi kiến thức chung với câu hỏi về chính công ty: năm thành lập, khách hàng đầu tiên, ai
        đi làm sớm nhất năm nay. Đây là trò hợp nhất cho hội trường đông vì ai cũng chơi được cùng lúc, không phải chờ lượt.
      </p>
      <PlayCta slug="do-vui-team-building" text="Quiz realtime cho tới 50 người, quét QR là vào. Tự soạn câu hỏi về công ty và gắn logo lên màn hình miễn phí." />
      <h3>5. Ai hiểu sếp nhất?</h3>
      <p>
        Sếp lên “ghế nóng” trả lời bí mật vài câu hỏi vui (món ăn yêu thích, nơi muốn đi du lịch, câu cửa miệng khi họp). Cả hội trường đoán câu trả lời của sếp, ai đoán trúng nhiều nhất thắng. Có thể thay sếp bằng trưởng
        phòng hoặc nhân viên xuất sắc của năm.
      </p>
      <PlayCta slug="ai-hieu-ai" text="Một người lên ghế nóng, cả nhóm đoán câu trả lời trên điện thoại. 2–20 người." />
      <h3>6. Hát theo giai điệu, đoán tên bài</h3>
      <p>MC bật 5 giây đầu của một bài hát, các bàn giơ bảng đoán tên bài. Chọn bài theo nhiều thế hệ (nhạc Trịnh, nhạc Tết, V-pop mới) để cả nhân viên trẻ lẫn các anh chị lâu năm đều có lợi thế.</p>
      <h3>7. Rung chuông vàng mini</h3>
      <p>Mọi người cùng trả lời trên bảng con, ai sai thì ngồi xuống, người cuối cùng còn đứng thắng. Nên có câu “cứu trợ” cho khán giả để những người bị loại vẫn còn việc để làm.</p>

      <h2>Trò thi đấu giữa các bàn hoặc phòng ban</h2>
      <h3>8. Truyền tin bằng hành động</h3>
      <p>Mỗi đội xếp hàng, người đầu xem một từ (ví dụ “deadline”, “sếp duyệt rồi”) rồi diễn tả không lời cho người sau, cứ thế đến người cuối đoán. Kết quả càng lệch càng vui.</p>
      <h3>9. Vẽ đoán chữ tiếp sức</h3>
      <p>
        Mỗi đội cử một người vẽ, cả đội đoán trong 60 giây, đổi người vẽ sau mỗi từ. Chọn từ gần gũi với công ty như “họp online”, “tăng ca”, “thưởng Tết”. Cần thêm gợi ý? Xem{" "}
        <Link href="/cam-nang/tu-khoa-ve-doan-chu">100 từ khóa vẽ đoán chữ</Link>.
      </p>
      <PlayCta slug="ve-doan-chu" text="Một người vẽ trên điện thoại, cả nhóm thấy nét vẽ trực tiếp và gõ đáp án." />
      <h3>10. Ai là gián điệp theo bàn</h3>
      <p>
        Mỗi bàn 5–10 người chơi một ván riêng: mọi người cùng một từ khóa, riêng gián điệp nhận từ gần giống. Bàn nào tìm ra gián điệp nhanh nhất thắng. Xem{" "}
        <Link href="/cam-nang/luat-choi-ai-la-gian-diep">luật chơi và 100 cặp từ khóa</Link>.
      </p>
      <PlayCta slug="ai-la-gian-diep" />
      <h3>11. Kéo co hoặc thổi bóng</h3>
      <p>Nếu không gian rộng, trò vận động ngắn giữa các phòng ban luôn khuấy động hội trường. Thổi bóng đến nổ là phiên bản an toàn cho nhà hàng chật, chỉ cần vài gói bóng bay.</p>

      <h2>Trò chốt và trao quà</h2>
      <h3>12. Bốc thăm may mắn có “thử thách”</h3>
      <p>Mỗi phần quà đi kèm một thử thách nhỏ: hát một câu, nhảy 10 giây, khen một đồng nghiệp. Người trúng làm xong mới được nhận quà. Nhớ chuẩn bị thử thách nhẹ nhàng để không ai thấy bị ép.</p>
      <h3>13. Ma sói cho nhóm ở lại sau tiệc</h3>
      <p>Sau phần chính, nhóm 8–12 người còn hứng có thể chơi Ma sói. Khi dùng điện thoại, máy làm quản trò nên ai cũng được chơi.</p>
      <PlayCta slug="ma-soi" text="Máy làm quản trò: sói, tiên tri, bảo vệ và dân làng trên điện thoại. 5–16 người." />
      <h3>14. Bình chọn danh hiệu vui của năm</h3>
      <p>Bình chọn trước “người đi muộn đáng yêu nhất”, “thánh trả lời tin nhắn lúc nửa đêm”, “đại sứ trà sữa”. Công bố trong tiệc kèm cúp giấy, chi phí gần như bằng 0 nhưng rất được nhớ.</p>
      <h3>15. Thư gửi chính mình năm sau</h3>
      <p>Mỗi người viết vài dòng mục tiêu cho năm mới, bỏ phong bì dán kín, công ty giữ đến tất niên năm sau mới mở. Một kết thúc nhẹ nhàng, khác với không khí ồn ào cả buổi.</p>

      <h2>Kịch bản mẫu cho tiệc tất niên 2 tiếng</h2>
      <Table
        head={["Thời gian", "Nội dung", "Gợi ý trò chơi"]}
        rows={[
          ["0:00–0:15", "Đón khách, check-in", "Bingo đồng nghiệp"],
          ["0:15–0:35", "Khai mạc, tổng kết năm, khen thưởng", "Một từ cho năm nay"],
          ["0:35–1:05", "Ăn uống, trò chơi cả hội trường", "Đố vui trên điện thoại, Ai hiểu sếp nhất"],
          ["1:05–1:35", "Thi đấu giữa các bàn", "Vẽ đoán chữ tiếp sức, Ai là gián điệp"],
          ["1:35–2:00", "Bốc thăm, trao danh hiệu, bế mạc", "Bốc thăm có thử thách, danh hiệu vui"],
        ]}
      />

      <h2>Mẹo tổ chức để ai cũng vui</h2>
      <ul>
        <li>
          <strong>Ưu tiên trò không cần lên sân khấu.</strong> Nhiều người ngại đứng trước đám đông; trò chơi trên điện thoại hoặc theo bàn giúp họ vẫn tham gia được.
        </li>
        <li>
          <strong>Thử trước thiết bị.</strong> Kiểm tra máy chiếu, loa và Wi-Fi của nhà hàng trước một ngày. Với trò trên điện thoại, chuẩn bị sẵn mã QR to trên màn hình.
        </li>
        <li>
          <strong>Mỗi trò không quá 15 phút.</strong> Dừng khi không khí đang lên, đừng đợi mọi người chán.
        </li>
        <li>
          <strong>Quà nhỏ nhưng nhiều.</strong> 10 phần quà 100 nghìn thường vui hơn 1 phần quà 1 triệu, vì nhiều người có cơ hội lên nhận.
        </li>
      </ul>
      <Tip>
        Soạn sẵn 10–15 câu hỏi về công ty từ trước một tuần và nhờ mỗi phòng ban góp vài câu. Câu hỏi về chính đồng nghiệp luôn được hưởng ứng nhiều hơn câu hỏi kiến thức chung. Nếu cần câu hỏi sẵn, xem{" "}
        <Link href="/cam-nang/cau-hoi-do-vui-team-building">60 câu hỏi đố vui team building có đáp án</Link>.
      </Tip>
      <p>
        Tổ chức buổi nhỏ hơn trong giờ làm? Xem <Link href="/cam-nang/tro-choi-team-building-trong-phong-hop">12 trò chơi team building trong phòng họp</Link>.
      </p>
    </>
  );
}
