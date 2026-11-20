/**
 * Deadline Dash scenarios. Each run picks one at random (never the same as the previous run),
 * then shuffles its messages and obstacle labels — so no two runs read the same.
 *
 *  messages → speech bubbles flying at head height (duck under them)
 *  boxes    → ground clutter (jump over)
 *  meetings → wide ground obstacle (long jump)
 */

export type Scenario = {
  id: string;
  title: string;
  subtitle: string;
  audience: "office" | "student" | "gamer";
  messages: string[];
  boxes: string[];
  meetings: string[];
  /** Wall tint for the background */
  wall: [string, string];
};

export const SCENARIOS: Scenario[] = [
  {
    id: "monday",
    title: "Thứ Hai đầu tuần",
    subtitle: "Sếp vừa giao 7 việc trong một tin nhắn",
    audience: "office",
    messages: ["Em ơi gấp!", "Họp giao ban 8h nha", "Tuần này KPI x2 nhé", "Ai trực fanpage?", "File slide đâu em?", "Cuối tuần OT nhé?", "Check mail chưa em?", "Sửa lại bản v5 nha"],
    boxes: ["Hồ sơ", "Thùng A4", "Việc tồn", "Hóa đơn", "Máy in hỏng"],
    meetings: ["HỌP ĐỘT XUẤT", "HỌP 5 PHÚT (1 TIẾNG)", "SYNC NHANH"],
    wall: ["#f3efff", "#e7e0fb"],
  },
  {
    id: "quarter-end",
    title: "Cuối quý chốt số",
    subtitle: "Báo cáo quý phải nộp trước 17h",
    audience: "office",
    messages: ["Số liệu lệch rồi em!", "Gửi bản final_v7", "Kế toán cần chứng từ", "Chốt doanh số chưa?", "Sếp tổng hỏi kìa", "Excel lỗi #REF!", "Thiếu chữ ký nè", "Gửi lại file gốc"],
    boxes: ["Chứng từ", "Báo cáo", "Excel 40MB", "Hợp đồng", "Sổ sách"],
    meetings: ["HỌP CHỐT SỐ", "REVIEW QUÝ", "HỌP BAN GIÁM ĐỐC"],
    wall: ["#eef6ff", "#dcebfb"],
  },
  {
    id: "before-tet",
    title: "Trước kỳ nghỉ Tết",
    subtitle: "Ai cũng muốn về quê sớm",
    audience: "office",
    messages: ["Tất niên mấy giờ?", "Chốt đơn Tết gấp!", "Thưởng Tết khi nào?", "Còn 3 hợp đồng nè", "Dọn bàn trước nghỉ", "Vé xe hết rồi!", "Lì xì đầu năm nha", "Gói quà cho khách"],
    boxes: ["Giỏ quà", "Bánh chưng", "Hộp mứt", "Thùng quà", "Hồ sơ"],
    meetings: ["HỌP TỔNG KẾT NĂM", "TẤT NIÊN SỚM", "BỐC THĂM QUÀ"],
    wall: ["#fff3ec", "#ffe3d3"],
  },
  {
    id: "launch-day",
    title: "Ngày ra mắt sản phẩm",
    subtitle: "Mọi thứ phải xong trước 9h sáng",
    audience: "office",
    messages: ["Website sập rồi!", "Khách VIP đến sớm", "Banner in sai màu!", "Livestream bị lag", "Ai cầm micro?", "Thêm 1 slide nữa", "Báo chí tới rồi!", "Link đăng ký lỗi"],
    boxes: ["Standee", "Loa kéo", "Thùng quà", "Cuộn dây điện", "Brochure"],
    meetings: ["TỔNG DUYỆT GẤP", "BRIEF LẦN CUỐI", "HỌP BÁO"],
    wall: ["#eefcf4", "#d8f5e5"],
  },
  {
    id: "exam-season",
    title: "Mùa thi cử",
    subtitle: "Kiểm tra 1 tiết vào sáng mai",
    audience: "student",
    messages: ["Nhóm ơi làm slide chưa?", "Thầy dời lịch thi!", "Đề cương đâu rồi?", "Ai mượn vở ghi?", "Nộp bài trước 23:59", "Group chat 99+ tin", "Mai kiểm tra miệng!", "Bài tập nhóm nè"],
    boxes: ["Sách giáo khoa", "Đề cương", "Balo 5kg", "Vở bài tập", "Máy tính"],
    meetings: ["KIỂM TRA MIỆNG", "HỌP PHỤ HUYNH", "THI THỬ"],
    wall: ["#fffbe8", "#fbf1c7"],
  },
  {
    id: "rank-grind",
    title: "Cày rank đêm khuya",
    subtitle: "Phải lên hạng trước giờ đi ngủ",
    audience: "gamer",
    messages: ["Mẹ gọi ăn cơm!", "Wifi chập chờn", "Team AFK rồi!", "Cập nhật 12GB", "Mai đi học đó!", "Pin còn 5%", "Ping 999ms", "Ai gánh với?"],
    boxes: ["Ly mì tôm", "Bàn phím cơ", "Tai nghe", "Sạc dự phòng", "Gối ôm"],
    meetings: ["MẸ GỌI ĂN CƠM", "BẢO TRÌ SERVER", "GIỜ ĐI NGỦ"],
    wall: ["#f1edff", "#ddd3ff"],
  },
];
