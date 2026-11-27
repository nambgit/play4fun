import Link from "next/link";
import { PlayCta, Table, Tip } from "@/components/article/parts";

export default function Article() {
  return (
    <>
      <p>
        Đi thang máy văn phòng lịch sự gói gọn trong vài việc: <strong>đứng sang hai bên cửa để người trong ra trước</strong>, <strong>vào rồi thì đi sâu vào trong</strong>, giữ yên lặng và nhường người cần
        ưu tiên. Giờ cao điểm buổi sáng, mỗi hành động nhỏ đều làm cả hàng người chờ nhanh hoặc chậm đi. Dưới đây là 10 phép lịch sự khi đi thang máy và vài mẹo để đỡ phải chờ lâu.
      </p>

      <h2>10 phép lịch sự khi đi thang máy</h2>
      <ol>
        <li>
          <strong>Đứng sang hai bên cửa</strong> khi chờ, chừa lối giữa cho người trong thang bước ra.
        </li>
        <li>
          <strong>Để người trong ra hết rồi mới vào.</strong>
        </li>
        <li>
          <strong>Vào rồi thì đi sâu vào trong</strong>, đừng đứng chắn ngay cửa.
        </li>
        <li>
          <strong>Hỏi “anh/chị lên tầng mấy ạ?”</strong> và bấm giúp nếu bạn đứng gần bảng nút.
        </li>
        <li>
          <strong>Giữ cửa cho người đang tới gần</strong> khi thang chưa đầy, nhưng đừng giữ lâu khi cả thang đang chờ.
        </li>
        <li>
          <strong>Nhường người cần ưu tiên:</strong> người lớn tuổi, phụ nữ mang thai, người bế trẻ, người mang đồ nặng hoặc đi xe lăn.
        </li>
        <li>
          <strong>Nói nhỏ, hạn chế gọi điện</strong> trong thang máy; không gian hẹp nên âm thanh rất dễ làm phiền người khác.
        </li>
        <li>
          <strong>Tránh mang đồ ăn nặng mùi</strong> vào thang giờ cao điểm.
        </li>
        <li>
          <strong>Thang báo quá tải thì người vào sau cùng bước ra</strong> chờ chuyến sau.
        </li>
        <li>
          <strong>Chuyển đồ cồng kềnh, xe đẩy hàng vào giờ thấp điểm</strong> để không chiếm chỗ lúc mọi người đi làm.
        </li>
      </ol>
      <PlayCta slug="thang-may" text="8 giờ sáng, cả tòa nhà đổ về sảnh: bạn là người điều phối thang máy, gom người cùng tầng để thang đi nhanh, đừng để ai chờ lâu đến mức bỏ đi thang bộ." />

      <h2>Vì sao giờ cao điểm thang máy lại chậm?</h2>
      <p>
        Thời gian một chuyến thang không chỉ nằm ở quãng đường, mà ở <strong>số lần dừng</strong>: mỗi lần dừng là thêm thời gian giảm tốc, mở cửa, chờ người ra vào và đóng cửa. Một chuyến chở 8 người đến 8
        tầng khác nhau mất nhiều thời gian hơn hẳn chuyến chở 8 người cùng lên một tầng. Đó là lý do nhiều tòa nhà chia thang theo nhóm tầng (thang chỉ dừng tầng thấp, thang chỉ dừng tầng cao) để giảm số lần
        dừng.
      </p>
      <Table
        head={["Thói quen", "Ảnh hưởng tới cả hàng chờ"]}
        rows={[
          ["Đi thang máy lên 1–2 tầng giờ cao điểm", "Thêm một lần dừng cho cả thang"],
          ["Bấm nút cả lên lẫn xuống “cho chắc”", "Thang dừng ở tầng của bạn dù không ai cần"],
          ["Giữ cửa chờ người đang đi tít ngoài sảnh", "Cả thang đứng chờ, chuyến sau đến muộn hơn"],
          ["Đứng chắn cửa khi thang đông", "Người ra vào chậm, thang đóng cửa lâu hơn"],
        ]}
      />

      <h2>Mẹo đỡ phải chờ thang máy</h2>
      <ul>
        <li>Đến sớm hơn giờ cao điểm 10–15 phút: thang thường vắng hơn hẳn.</li>
        <li>Đi thang bộ khi chỉ lên hoặc xuống 1–2 tầng, vừa nhanh vừa là cách vận động nhẹ trong ngày.</li>
        <li>Bấm đúng một nút theo hướng bạn đi.</li>
        <li>Nếu tòa nhà chia thang theo nhóm tầng, đứng chờ đúng cụm thang của tầng mình.</li>
      </ul>
      <Tip title="Nếu bị kẹt trong thang máy">
        Giữ bình tĩnh, bấm nút chuông hoặc nút gọi khẩn cấp trong thang và gọi số điện thoại cứu hộ dán trong cabin hoặc bộ phận quản lý tòa nhà. Không tự cạy cửa hay cố trèo ra ngoài, hãy chờ người có
        chuyên môn tới hỗ trợ.
      </Tip>
      <p>
        Thêm mẹo cho dân văn phòng: <Link href="/cam-nang/giai-lao-van-phong">giải lao giữa giờ sao cho hiệu quả</Link> và <Link href="/cam-nang/trua-nay-an-gi">trưa nay ăn gì</Link>.
      </p>
    </>
  );
}
