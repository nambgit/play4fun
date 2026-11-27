import Link from "next/link";
import { PlayCta, Tip } from "@/components/article/parts";
import { QUESTIONS, type Question } from "@/games/kien-thuc/questions";

/**
 * Questions are taken from the game's own bank (games/kien-thuc/questions.ts), so the article
 * and the game share one fact-checked source. Pick ids here; pick ones not already used in
 * the "cau-hoi-do-vui-team-building" article.
 */
const SECTIONS: { title: string; intro: string; ids: string[] }[] = [
  {
    title: "Lịch sử",
    intro: "Từ thời dựng nước đến thế kỷ 20, những mốc mà ai cũng từng học.",
    ids: ["kt-001", "kt-002", "kt-007", "kt-011", "kt-013", "kt-016", "kt-017", "kt-018", "kt-027", "kt-036"],
  },
  {
    title: "Địa lý",
    intro: "Núi, sông, đảo và những điểm cực của đất nước.",
    ids: ["kt-041", "kt-045", "kt-046", "kt-050", "kt-054", "kt-058", "kt-059", "kt-063", "kt-065", "kt-071"],
  },
  {
    title: "Văn hóa, truyền thuyết, lễ hội",
    intro: "Văn học, di sản, phong tục ngày Tết và những câu chuyện từ thuở nhỏ.",
    ids: ["kt-085", "kt-095", "kt-097", "kt-098", "kt-101", "kt-103", "kt-104", "kt-106", "kt-112", "kt-114"],
  },
  {
    title: "Đời sống",
    intro: "Những con số và ngày lễ quen thuộc, nhưng không phải ai cũng trả lời chắc chắn.",
    ids: ["kt-127", "kt-129", "kt-130", "kt-131", "kt-138", "kt-139", "kt-140", "kt-142", "kt-158", "kt-161"],
  },
];

const byId = new Map(QUESTIONS.map((q) => [q.id, q]));
const pick = (ids: string[]) => ids.map((id) => byId.get(id)).filter((q): q is Question => !!q);
const GROUPS = SECTIONS.map((s) => ({ ...s, questions: pick(s.ids) }));
/** Number of the first question in each section, so numbering runs 1–40 across sections */
const STARTS = GROUPS.map((_, i) => 1 + GROUPS.slice(0, i).reduce((sum, g) => sum + g.questions.length, 0));

export default function Article() {
  return (
    <>
      <p>
        Dưới đây là 40 câu hỏi kiến thức Việt Nam có đáp án và giải thích ngắn, chia thành 4 chủ đề: lịch sử, địa lý, văn hóa và đời sống. Bạn có thể tự kiểm tra (bấm “Xem đáp án” sau khi đã nghĩ xong), dùng làm câu đố
        cho lớp học, buổi sinh hoạt hay vòng đố vui team building.
      </p>
      <Tip title="Cách dùng nhanh">
        Tự trả lời trước rồi mới mở đáp án. Đúng từ 30 câu trở lên là bạn nắm kiến thức Việt Nam rất chắc. Muốn thi tính giờ và chấm điểm? Cuối bài có bài trắc nghiệm online 15 câu.
      </Tip>

      {GROUPS.map((s, si) => (
        <section key={s.title}>
          <h2>
            Câu hỏi {s.title.toLowerCase()} Việt Nam
          </h2>
          <p>{s.intro}</p>
          <ol start={STARTS[si]}>
            {s.questions.map((q) => (
                <li key={q.id}>
                  <strong>{q.q}</strong>
                  <br />
                  <span className="text-muted">{q.options.map((o, i) => `${"ABCD"[i]}. ${o}`).join("   ")}</span>
                  <details>
                    <summary>Xem đáp án</summary>
                    <p>
                      <strong>
                        {"ABCD"[q.answer]}. {q.options[q.answer]}
                      </strong>{" "}
                      – {q.note}
                    </p>
                  </details>
                </li>
            ))}
          </ol>
        </section>
      ))}

      <h2>Làm bài trắc nghiệm kiến thức Việt Nam online</h2>
      <p>Mỗi lượt 15 câu chia đều 4 chủ đề, mỗi câu 20 giây, chấm thang điểm 10 và xem lại câu sai kèm giải thích. Câu hỏi lấy ngẫu nhiên từ kho hơn 160 câu nên mỗi lần làm là một đề mới.</p>
      <PlayCta slug="kien-thuc-viet-nam" />

      <h2>Mẹo dùng bộ câu hỏi cho lớp học, team building</h2>
      <ul>
        <li>
          <strong>Đi từ dễ đến khó:</strong> mở đầu bằng câu đời sống, để câu lịch sử và địa lý về sau.
        </li>
        <li>
          <strong>Đọc kèm giải thích</strong> sau mỗi câu: phần thú vị nhất thường là câu chuyện đằng sau đáp án.
        </li>
        <li>
          <strong>Chia đội và tính điểm</strong> để mọi người hào hứng hơn. Cần cả phòng trả lời cùng lúc bằng điện thoại? Dùng{" "}
          <Link href="/games/do-vui-team-building">Đố vui team building</Link> có bảng xếp hạng trực tiếp.
        </li>
      </ul>
      <p>
        Cần thêm câu hỏi chung? Xem <Link href="/cam-nang/cau-hoi-do-vui-team-building">60 câu hỏi đố vui team building có đáp án</Link>.
      </p>
    </>
  );
}
