import Link from "next/link";
import { PlayCta, Table, Tip } from "@/components/article/parts";

export default function Article() {
  return (
    <>
      <p>
        Mỗi người một nơi vẫn chơi cùng nhau được: mọi người gọi nhóm qua Zoom, Google Meet, Messenger hoặc Zalo để nghe và nói, còn trò chơi chạy trên điện thoại của từng người. Dưới đây là 10 trò chơi online với bạn bè
        hoặc đồng nghiệp ở xa, có trò cần game trên trình duyệt (miễn phí, không cần cài), có trò chỉ cần cuộc gọi video.
      </p>

      <h2>Cách chơi khi mỗi người ở một nơi</h2>
      <ol>
        <li>
          <strong>Mở cuộc gọi nhóm</strong> trên ứng dụng cả nhóm hay dùng. Bật camera nếu được, trò suy luận vui hơn nhiều khi nhìn thấy mặt nhau.
        </li>
        <li>
          <strong>Một người tạo phòng game</strong> rồi gửi mã phòng hoặc link vào nhóm chat. Mọi người mở bằng trình duyệt trên điện thoại, không cần tài khoản.
        </li>
        <li>
          <strong>Nói chuyện qua cuộc gọi, thao tác trên điện thoại:</strong> xem từ khóa, bỏ phiếu, trả lời câu hỏi. Ai dùng máy tính để gọi thì có thể chia sẻ màn hình bảng xếp hạng cho cả nhóm.
        </li>
      </ol>

      <h2>Trò chơi trên điện thoại (cần một trang web game)</h2>
      <h3>1. Ai là gián điệp</h3>
      <p>
        Mọi người nhận cùng một từ khóa trên điện thoại, riêng gián điệp nhận từ gần giống. Lần lượt mô tả qua cuộc gọi rồi bỏ phiếu trên máy. Đây là trò hợp nhất để chơi từ xa vì chỉ cần nói, không cần nhìn chung một màn
        hình. Xem <Link href="/cam-nang/luat-choi-ai-la-gian-diep">luật chơi và 100 cặp từ khóa</Link>.
      </p>
      <PlayCta slug="ai-la-gian-diep" text="3–12 người, máy chia từ và đếm phiếu. Hòa phiếu thì tự đổi bộ từ mới." />
      <h3>2. Ma sói</h3>
      <p>
        Máy làm quản trò: chia vai, gọi từng vai dậy vào ban đêm và thông báo ai bị cắn. Ban ngày cả làng tranh luận qua cuộc gọi rồi bỏ phiếu. Hợp nhóm 6–12 người, một ván khoảng 20–30 phút. Người mới xem{" "}
        <Link href="/cam-nang/luat-choi-ma-soi">luật chơi Ma sói chi tiết</Link>.
      </p>
      <PlayCta slug="ma-soi" />
      <h3>3. Vẽ đoán chữ</h3>
      <p>Một người vẽ trên điện thoại, nét vẽ hiện trực tiếp trên máy của cả nhóm, ai gõ đúng đáp án trước được nhiều điểm. Không cần chia sẻ màn hình, không cần bảng trắng.</p>
      <PlayCta slug="ve-doan-chu" />
      <h3>4. Đố vui có bảng xếp hạng</h3>
      <p>Mọi người trả lời cùng lúc trên điện thoại, bảng xếp hạng cập nhật sau mỗi câu. Hợp cho buổi họp online của cả phòng, kể cả khi đông tới vài chục người.</p>
      <PlayCta slug="do-vui-team-building" />
      <h3>5. Ai hiểu ai nhất?</h3>
      <p>Một người lên “ghế nóng” trả lời bí mật câu hỏi về bản thân, những người còn lại đoán. Rất hợp nhóm bạn thân, cặp đôi yêu xa hoặc team mới muốn hiểu nhau hơn.</p>
      <PlayCta slug="ai-hieu-ai" />

      <h2>Trò chơi chỉ cần cuộc gọi video</h2>
      <h3>6. Hai sự thật, một lời nói dối</h3>
      <p>Mỗi người kể ba điều về mình, một điều là bịa. Cả nhóm đoán đâu là lời nói dối. Nhẹ nhàng, hợp để mở đầu buổi gọi.</p>
      <h3>7. Truy tìm đồ vật trong nhà</h3>
      <p>Người dẫn hô một món (“thứ gì đó màu đỏ”, “cuốn sách cũ nhất nhà bạn”), ai mang ra trước camera đầu tiên được điểm. Trò vận động duy nhất trong danh sách, hợp sau khi ngồi lâu.</p>
      <h3>8. 20 câu hỏi</h3>
      <p>Một người nghĩ về một người, vật hoặc địa danh. Cả nhóm hỏi tối đa 20 câu chỉ được trả lời “có” hoặc “không” để đoán ra.</p>
      <h3>9. Đoán bài hát qua giai điệu</h3>
      <p>Một người ngân nga (không lời) một bài hát, ai đoán đúng tên bài trước thì thắng và ngân bài tiếp theo. Bật tiếng gốc của ứng dụng gọi để âm thanh đỡ bị cắt.</p>
      <h3>10. Kể chuyện nối tiếp</h3>
      <p>Mỗi người nói một câu để nối thành câu chuyện, người sau phải nối hợp lý với câu trước. Thêm luật mỗi câu phải chứa một từ ngẫu nhiên do người khác đưa ra để khó hơn.</p>

      <h2>Chọn trò theo số người</h2>
      <Table
        head={["Số người", "Trò gợi ý"]}
        rows={[
          ["2–4 người", "Ai hiểu ai nhất, Vẽ đoán chữ, 20 câu hỏi"],
          ["5–8 người", "Ai là gián điệp, Ma sói, Hai sự thật một lời nói dối"],
          ["9–12 người", "Ma sói, Ai là gián điệp (2–3 gián điệp), Đố vui"],
          ["13–16 người", "Ma sói, Ai hiểu ai nhất, Đố vui"],
          ["Trên 16 người", "Đố vui có bảng xếp hạng"],
        ]}
      />

      <h2>Mẹo để buổi chơi online không bị “đơ”</h2>
      <ul>
        <li>
          <strong>Tắt mic khi không nói</strong> để đỡ tiếng vọng, nhất là khi có người dùng loa ngoài.
        </li>
        <li>
          <strong>Có một người dẫn</strong> giữ lượt nói và nhắc thời gian. Trò suy luận rất dễ loạn khi ai cũng nói cùng lúc.
        </li>
        <li>
          <strong>Dùng điện thoại để chơi, máy tính để gọi</strong> nếu có thể. Chuyển qua lại giữa ứng dụng gọi và trình duyệt trên cùng một điện thoại vẫn được, nhưng hơi bất tiện.
        </li>
      </ul>
      <Tip>
        Mở đầu bằng một trò nhẹ như Hai sự thật một lời nói dối, rồi mới vào Ai là gián điệp hoặc Ma sói. Nhóm đã “ấm” lên thì trò suy luận vui hơn hẳn.
      </Tip>
      <p>
        Chơi trực tiếp trong phòng họp? Xem <Link href="/cam-nang/tro-choi-team-building-trong-phong-hop">12 trò chơi team building trong phòng họp</Link>.
      </p>
    </>
  );
}
