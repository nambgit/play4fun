import Link from "next/link";
import { PlayCta, Table, Tip } from "@/components/article/parts";

export default function Article() {
  return (
    <>
      <p>
        Gõ 10 ngón là dùng đủ cả mười ngón tay, mỗi ngón phụ trách một nhóm phím cố định, mắt nhìn màn hình thay vì nhìn bàn phím. Người mới thường mất <strong>1 đến 2 tuần</strong> để nhớ vị trí phím và khoảng{" "}
        <strong>3 đến 6 tuần</strong> để gõ nhanh hơn cách gõ cũ, nếu tập đều 15–20 phút mỗi ngày. Bài này đi từ tư thế ngồi đến cách gõ tiếng Việt có dấu, kèm một lộ trình 4 tuần.
      </p>

      <h2>1. Tư thế đúng trước khi đặt tay lên phím</h2>
      <ul>
        <li>Ngồi thẳng lưng, hai bàn chân chạm sàn, khuỷu tay gập khoảng 90 độ.</li>
        <li>Màn hình ngang hoặc thấp hơn tầm mắt một chút, cách mắt khoảng một sải tay.</li>
        <li>Cổ tay thả lỏng, không tì mạnh xuống bàn; các ngón hơi cong như đang cầm một quả bóng nhỏ.</li>
      </ul>
      <p>Tư thế sai không làm bạn gõ chậm ngay, nhưng sau vài tuần sẽ mỏi vai, đau cổ tay và rất khó tăng tốc.</p>

      <h2>2. Hàng phím cơ sở và nhiệm vụ của từng ngón</h2>
      <p>
        Mọi thao tác đều bắt đầu và kết thúc ở <strong>hàng phím cơ sở</strong>: tay trái đặt trên <strong>A S D F</strong>, tay phải trên <strong>J K L ;</strong>. Hai phím F và J có gờ nổi nhỏ để bạn tìm lại vị trí mà không cần
        nhìn. Hai ngón cái chỉ lo phím cách (Space).
      </p>
      <Table
        head={["Ngón", "Tay trái", "Tay phải"]}
        rows={[
          ["Ngón út", "Q A Z, Tab, Caps Lock, Shift trái", "P ; /, Enter, Shift phải, Backspace"],
          ["Ngón áp út", "W S X", "O L ."],
          ["Ngón giữa", "E D C", "I K ,"],
          ["Ngón trỏ", "R T F G V B", "Y U H J N M"],
          ["Ngón cái", "Phím cách", "Phím cách"],
        ]}
      />
      <p>Ngón trỏ phải gánh nhiều phím nhất, nên lúc đầu bạn sẽ hay gõ nhầm giữa T–Y hoặc G–H. Đó là bình thường.</p>

      <h2>3. Gõ tiếng Việt có dấu bằng Telex</h2>
      <p>
        Với Telex, dấu được gõ bằng chính các phím chữ nằm trong vùng 10 ngón, nên tay không phải rời hàng phím cơ sở. Đó là lý do phần lớn người gõ nhanh dùng Telex thay vì VNI (VNI bỏ dấu bằng hàng số, phải với tay xa
        hơn).
      </p>
      <Table
        head={["Muốn gõ", "Telex", "Ví dụ"]}
        rows={[
          ["Dấu sắc", "s", "as → á"],
          ["Dấu huyền", "f", "af → à"],
          ["Dấu hỏi", "r", "ar → ả"],
          ["Dấu ngã", "x", "ax → ã"],
          ["Dấu nặng", "j", "aj → ạ"],
          ["â, ê, ô", "aa, ee, oo", "caan → cân"],
          ["ă, ơ, ư", "aw, ow, uw (hoặc w)", "thuw → thư"],
          ["đ", "dd", "ddi → đi"],
        ]}
      />
      <Tip>
        Hãy bỏ dấu ở <strong>cuối từ</strong> thay vì giữa từ: gõ “vieetj” hoặc “vieejt” đều ra “việt”, nhưng thói quen gõ hết chữ rồi mới thêm dấu giúp nhịp tay đều hơn. Các bộ gõ như Unikey, EVKey và bàn phím điện thoại
        đều tự đặt dấu đúng vị trí.
      </Tip>

      <h2>4. Lộ trình 4 tuần cho người mới</h2>
      <h3>Tuần 1: Nhớ vị trí, chấp nhận chậm</h3>
      <p>Chỉ tập hàng cơ sở, sau đó thêm hàng trên. Tuyệt đối không nhìn bàn phím, kể cả khi phải gõ rất chậm. Tốc độ lúc này thường chỉ 10–15 WPM, thấp hơn cách gõ cũ, và đó là cái giá phải trả.</p>
      <h3>Tuần 2: Đủ ba hàng phím và phím Shift</h3>
      <p>Tập gõ cả câu ngắn, viết hoa đầu câu bằng ngón út của tay còn lại (gõ chữ tay trái thì giữ Shift phải, và ngược lại).</p>
      <h3>Tuần 3: Tiếng Việt có dấu</h3>
      <p>Bắt đầu gõ đoạn văn tiếng Việt. Ưu tiên gõ đúng dấu ngay từ đầu, vì sửa lỗi tốn thời gian hơn nhiều so với gõ chậm mà chính xác.</p>
      <h3>Tuần 4: Tăng tốc có kiểm soát</h3>
      <p>Mỗi ngày làm vài bài kiểm tra 60 giây, ghi lại WPM và độ chính xác. Mục tiêu là độ chính xác trên 95%, tốc độ sẽ tự tăng theo.</p>

      <PlayCta slug="go-phim-nhanh" text="Kiểm tra WPM 60 giây với tiếng Việt có dấu hoặc tiếng Anh, mỗi lượt một đoạn văn mới." />

      <h2>5. Những lỗi khiến bạn mãi không gõ nhanh được</h2>
      <ul>
        <li>
          <strong>Liếc bàn phím “một chút thôi”.</strong> Mỗi lần nhìn xuống là não lại dựa vào mắt thay vì trí nhớ của ngón tay.
        </li>
        <li>
          <strong>Dùng sai ngón cho phím quen.</strong> Ví dụ gõ B bằng tay phải. Lúc đầu thấy tiện nhưng sẽ chặn bạn ở một mức tốc độ.
        </li>
        <li>
          <strong>Tập một lần thật lâu rồi bỏ cả tuần.</strong> 15 phút mỗi ngày hiệu quả hơn hẳn 2 tiếng vào cuối tuần.
        </li>
        <li>
          <strong>Chỉ chăm chăm vào tốc độ.</strong> Gõ nhanh mà sai nhiều thì tổng thời gian vẫn chậm vì phải xóa sửa.
        </li>
      </ul>

      <h2>6. Đo tiến bộ thế nào?</h2>
      <p>
        Chỉ số chuẩn là <strong>WPM</strong> (số từ mỗi phút, mỗi từ tính bằng 5 ký tự gõ đúng). Hãy đo cùng một kiểu bài, cùng ngôn ngữ, cùng thời lượng để so sánh công bằng. Xem thêm{" "}
        <Link href="/cam-nang/toc-do-go-phim">tốc độ gõ phím bao nhiêu WPM là nhanh</Link> để biết mình đang ở mức nào.
      </p>
    </>
  );
}
