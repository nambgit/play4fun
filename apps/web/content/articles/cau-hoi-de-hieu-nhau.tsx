import Link from "next/link";
import { PlayCta, Tip } from "@/components/article/parts";

const GROUPS: { topic: string; intro: string; questions: string[] }[] = [
  {
    topic: "Câu hỏi làm quen, phá băng",
    intro: "Nhẹ nhàng, ai cũng trả lời được. Hợp với buổi đầu gặp mặt, đồng nghiệp mới hoặc mở đầu buổi team building.",
    questions: [
      "Món ăn nào bạn có thể ăn cả tuần không chán?",
      "Nếu được nghỉ phép một tháng, bạn sẽ đi đâu?",
      "Bài hát nào bạn hay nghe lại nhất dạo gần đây?",
      "Bạn là người dậy sớm hay cú đêm?",
      "Ứng dụng nào trên điện thoại bạn mở nhiều nhất?",
      "Hồi nhỏ bạn muốn làm nghề gì khi lớn lên?",
      "Bạn thích biển hay núi hơn?",
      "Món đồ nào bạn luôn mang theo khi ra ngoài?",
      "Bộ phim nào bạn xem đi xem lại không chán?",
      "Nếu có thêm một tiếng mỗi ngày, bạn sẽ làm gì?",
    ],
  },
  {
    topic: "Câu hỏi để hiểu bạn bè hơn",
    intro: "Đi sâu hơn một chút nhưng vẫn vui. Hợp với hội bạn thân đã quen nhau một thời gian.",
    questions: [
      "Kỷ niệm nào của nhóm mình bạn nhớ nhất?",
      "Điều gì khiến bạn vui nhất trong tuần này?",
      "Bạn sợ điều gì nhất, dù biết là hơi vô lý?",
      "Thói quen nào của bạn mà người khác thấy kỳ lạ?",
      "Bạn sẽ mua gì đầu tiên nếu trúng số?",
      "Ai là người có ảnh hưởng lớn nhất đến bạn?",
      "Điều gì bạn muốn thử ít nhất một lần trong đời?",
      "Bạn thường làm gì khi buồn?",
      "Lời khen nào bạn nhớ mãi?",
      "Nếu được quay lại một năm trong quá khứ, bạn chọn năm nào?",
    ],
  },
  {
    topic: "Câu hỏi cho đồng nghiệp",
    intro: "Giúp team hiểu cách làm việc của nhau mà không đụng chuyện riêng tư.",
    questions: [
      "Bạn làm việc tập trung nhất vào lúc nào trong ngày?",
      "Bạn thích nhận phản hồi trực tiếp hay qua tin nhắn?",
      "Việc nào trong công việc khiến bạn thấy hào hứng nhất?",
      "Cuộc họp lý tưởng với bạn dài bao lâu?",
      "Bạn thích làm việc ở văn phòng hay ở nhà hơn?",
      "Kỹ năng nào bạn đang muốn học thêm?",
      "Đồ uống “tiếp năng lượng” của bạn là gì?",
      "Thành tích nào trong năm nay bạn tự hào nhất?",
      "Bạn muốn đồng nghiệp làm gì khi thấy bạn đang bận?",
      "Nếu được đổi việc với ai đó trong team một ngày, bạn chọn ai?",
    ],
  },
  {
    topic: "Câu hỏi cho cặp đôi",
    intro: "Để hai người hiểu nhau hơn, kể cả khi đã yêu lâu. Hỏi lúc thư thả, đừng hỏi khi đang giận nhau.",
    questions: [
      "Khoảnh khắc nào bạn biết mình thích người kia?",
      "Cách thể hiện tình cảm nào khiến bạn thấy được yêu nhất?",
      "Buổi hẹn hò lý tưởng của bạn trông như thế nào?",
      "Món ăn nào gắn với kỷ niệm của hai đứa?",
      "Điều nhỏ nhặt nào người kia làm khiến bạn thấy ấm lòng?",
      "Bạn muốn hai đứa cùng đi đâu trong năm tới?",
      "Khi giận, bạn cần được để yên hay được hỏi han ngay?",
      "Thói quen nào của người kia bạn thấy đáng yêu nhất?",
      "Năm năm nữa bạn hình dung một ngày cuối tuần của hai đứa ra sao?",
      "Điều gì bạn chưa từng kể nhưng muốn người kia biết?",
    ],
  },
  {
    topic: "Câu hỏi “chọn một” vui nhộn",
    intro: "Trả lời nhanh, dễ gây tranh luận. Hợp để chơi đoán xem người kia chọn gì.",
    questions: [
      "Trà sữa hay cà phê?",
      "Đi du lịch tự túc hay đi tour?",
      "Xem phim ở rạp hay ở nhà?",
      "Ăn cay được hay không ăn được cay?",
      "Mùa hè hay mùa đông?",
      "Nhắn tin hay gọi điện?",
      "Chó hay mèo?",
      "Lên kế hoạch kỹ hay tới đâu tính tới đó?",
      "Ngủ nướng cuối tuần hay dậy sớm đi chơi?",
      "Tiệc đông người hay gặp riêng vài người thân?",
    ],
  },
];

export default function Article() {
  return (
    <>
      <p>
        Câu hỏi hay không phải câu hỏi khó, mà là câu hỏi khiến người kia muốn kể thêm. Dưới đây là 50 câu hỏi để hiểu nhau hơn, chia theo từng mối quan hệ: làm quen, bạn bè, đồng nghiệp, cặp đôi và loạt câu “chọn một”
        để chơi đoán ý nhau. Cuối bài có cách biến danh sách này thành trò chơi cho cả nhóm.
      </p>

      {GROUPS.map((g) => (
        <section key={g.topic}>
          <h2>{g.topic}</h2>
          <p>{g.intro}</p>
          <ol>
            {g.questions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ol>
        </section>
      ))}

      <h2>Biến câu hỏi thành trò chơi “Ai hiểu ai nhất?”</h2>
      <p>Hỏi đáp lần lượt dễ thành phỏng vấn. Thêm chút luật chơi sẽ vui hơn nhiều:</p>
      <ol>
        <li>Một người lên “ghế nóng” và bí mật chọn câu trả lời thật của mình.</li>
        <li>Những người còn lại đoán xem người đó chọn gì.</li>
        <li>Lật đáp án: ai đoán trúng được điểm, người ghế nóng cũng được điểm cho mỗi người đoán trúng mình.</li>
        <li>Đổi người lên ghế nóng, chơi đến khi ai cũng được một lượt.</li>
      </ol>
      <PlayCta slug="ai-hieu-ai" text="Hơn 100 câu hỏi vui có sẵn, mỗi người trả lời trên điện thoại, điểm tự tính. 2–20 người, chơi được cả khi ở xa." />

      <h2>Mẹo đặt câu hỏi để cuộc trò chuyện không bị gượng</h2>
      <ul>
        <li>
          <strong>Hỏi “vì sao” sau câu trả lời.</strong> “Bạn thích biển hơn à, vì sao vậy?” mới là lúc câu chuyện thật sự bắt đầu.
        </li>
        <li>
          <strong>Tự trả lời trước.</strong> Kể câu trả lời của mình trước giúp người kia thoải mái hơn, nhất là với câu hỏi sâu.
        </li>
        <li>
          <strong>Tôn trọng khi ai đó muốn bỏ qua.</strong> Luôn cho phép “câu này mình xin qua”, nhất là trong nhóm đồng nghiệp.
        </li>
        <li>
          <strong>Đừng hỏi dồn dập.</strong> Ba bốn câu hay, nói chuyện thoải mái, tốt hơn mười câu hỏi liên tục.
        </li>
      </ul>
      <Tip>
        Với team mới, bắt đầu bằng nhóm câu hỏi làm quen, buổi sau mới sang câu hỏi cho đồng nghiệp. Đi từ nhẹ đến sâu giúp không ai thấy bị “điều tra”.
      </Tip>
      <p>
        Muốn thêm trò cho buổi tụ tập? Xem <Link href="/cam-nang/tro-choi-team-building-trong-phong-hop">12 trò chơi team building trong phòng họp</Link> hoặc{" "}
        <Link href="/cam-nang/tro-choi-online-qua-zoom">10 trò chơi online qua Zoom, Google Meet, Zalo</Link>.
      </p>
    </>
  );
}
