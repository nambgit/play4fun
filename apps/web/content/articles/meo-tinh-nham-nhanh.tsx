import Link from "next/link";
import { PlayCta, Tip } from "@/components/article/parts";

export default function Article() {
  return (
    <>
      <p>
        Tính nhẩm nhanh không phải năng khiếu bẩm sinh mà là vài mẹo biến phép tính khó thành phép tính dễ. Dưới đây là 10 mẹo kèm ví dụ, đi từ đơn giản đến nâng cao. Học một mẹo mỗi ngày, rồi luyện vài phút để nó thành
        phản xạ.
      </p>

      <h2>1. Cộng bằng cách làm tròn rồi bù lại</h2>
      <p>
        Làm tròn một số lên hàng chục gần nhất, cộng, rồi trừ phần đã thêm. Ví dụ <strong>47 + 38</strong>: tính 47 + 40 = 87, rồi trừ 2 vì đã thêm 2, được <strong>85</strong>.
      </p>

      <h2>2. Trừ bằng cách đếm lên</h2>
      <p>
        Thay vì trừ, hãy đếm từ số nhỏ lên số lớn. Ví dụ <strong>100 − 64</strong>: từ 64 lên 70 là 6, từ 70 lên 100 là 30, tổng <strong>36</strong>. Cách này đặc biệt tiện khi tính tiền thừa.
      </p>

      <h2>3. Nhân với 5: nhân 10 rồi chia đôi</h2>
      <p>
        Ví dụ <strong>48 × 5</strong> = 480 ÷ 2 = <strong>240</strong>. Tương tự, nhân với 25 là nhân 100 rồi chia 4: 36 × 25 = 3.600 ÷ 4 = <strong>900</strong>.
      </p>

      <h2>4. Nhân với 9: nhân 10 rồi trừ đi chính số đó</h2>
      <p>
        Ví dụ <strong>7 × 9</strong> = 70 − 7 = <strong>63</strong>; <strong>23 × 9</strong> = 230 − 23 = <strong>207</strong>. Nhân với 99 cũng vậy: 14 × 99 = 1.400 − 14 = <strong>1.386</strong>.
      </p>

      <h2>5. Nhân số có hai chữ số với 11</h2>
      <p>
        Cộng hai chữ số rồi đặt kết quả vào giữa. Ví dụ <strong>36 × 11</strong>: 3 + 6 = 9, đặt vào giữa được <strong>396</strong>. Nếu tổng lớn hơn 9 thì nhớ 1 sang chữ số đầu: <strong>78 × 11</strong>: 7 + 8 = 15, ghi
        5 ở giữa và cộng 1 vào 7, được <strong>858</strong>.
      </p>

      <h2>6. Bình phương số tận cùng bằng 5</h2>
      <p>
        Lấy phần đứng trước số 5 nhân với số liền sau nó, rồi viết thêm 25 vào cuối. Ví dụ <strong>35²</strong>: 3 × 4 = 12, viết thêm 25 được <strong>1.225</strong>. <strong>65²</strong>: 6 × 7 = 42, được{" "}
        <strong>4.225</strong>.
      </p>

      <h2>7. Tách số để nhân</h2>
      <p>
        Tách một thừa số thành tổng của các số tròn. Ví dụ <strong>14 × 6</strong> = 10 × 6 + 4 × 6 = 60 + 24 = <strong>84</strong>. Với <strong>12 × 15</strong> = 12 × 10 + 12 × 5 = 120 + 60 = <strong>180</strong>.
      </p>

      <h2>8. Tính phần trăm từ 10%</h2>
      <p>
        10% của một số chỉ là dời dấu phẩy sang trái một chữ số. Từ đó suy ra các mức khác: 5% là một nửa của 10%, 20% là gấp đôi, 15% là 10% cộng 5%. Ví dụ <strong>15% của 240.000 đồng</strong>: 10% là 24.000, 5% là 12.000,
        tổng <strong>36.000 đồng</strong>.
      </p>
      <Tip>
        Phần trăm có thể đảo chiều: <strong>8% của 50</strong> bằng <strong>50% của 8</strong>, tức là 4. Khi một chiều khó, hãy thử chiều còn lại.
      </Tip>

      <h2>9. Chia cho 5: nhân đôi rồi chia 10</h2>
      <p>
        Ví dụ <strong>135 ÷ 5</strong> = 270 ÷ 10 = <strong>27</strong>. Chia cho 25 thì nhân 4 rồi chia 100: 175 ÷ 25 = 700 ÷ 100 = <strong>7</strong>.
      </p>

      <h2>10. Nhớ thứ tự: nhân chia trước, cộng trừ sau</h2>
      <p>
        Nhiều người tính sai không phải vì tính chậm mà vì làm sai thứ tự. Ví dụ <strong>6 + 4 × 5</strong> = 6 + 20 = <strong>26</strong>, không phải 50. Khi gặp biểu thức dài, nhẩm phần nhân chia trước, giữ kết quả trong
        đầu, rồi mới cộng trừ.
      </p>

      <h2>Luyện thế nào để nhanh thật sự?</h2>
      <ul>
        <li>
          <strong>Ngắn mà đều:</strong> 5 phút mỗi ngày tốt hơn 1 tiếng mỗi tuần.
        </li>
        <li>
          <strong>Có áp lực thời gian:</strong> đồng hồ đếm ngược buộc não dùng mẹo thay vì đặt tính.
        </li>
        <li>
          <strong>Đề luôn mới:</strong> làm lại đề cũ chỉ là luyện trí nhớ, không phải luyện tính nhẩm.
        </li>
      </ul>
      <PlayCta slug="bai-kiem-tra-15-phut" text="Phép tính khó dần theo từng cấp, mỗi câu đúng được cộng giờ. 30 câu đúng là điểm 10." />
      <p>
        Muốn rèn thêm phản xạ ngón tay? Thử <Link href="/cam-nang/toc-do-go-phim">kiểm tra tốc độ gõ phím</Link> hoặc xem tất cả <Link href="/giai-lao">game giải lao</Link>.
      </p>
    </>
  );
}
