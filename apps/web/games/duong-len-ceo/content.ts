/**
 * Đường lên CEO — content: staff (auto income), upgrades, career ranks, random office situations,
 * achievements and the company news ticker. Original office-themed idle/clicker design.
 *
 * Money is in đồng. Balancing follows the usual idle curve: each staff tier costs ~10× the previous
 * one and earns ~6×; buying one more of a tier costs 15% more than the last.
 */

// ------------------------------------------------------------ staff (auto income)

export type Staff = { id: string; name: string; emoji: string; desc: string; cost: number; rate: number; upgrades: [string, string, string, string, string] };

/** Owned counts at which a staff upgrade (×2 for that tier) becomes available */
export const STAFF_UPGRADE_AT = [1, 10, 25, 50, 100];

export const STAFF: Staff[] = [
  { id: "tts", name: "Thực tập sinh", emoji: "🧑‍🎓", desc: "Nhiệt tình, hay hỏi, pha cà phê ngon.", cost: 15e3, rate: 100, upgrades: ["Buổi onboarding", "Sổ tay thực tập", "Mentor tận tâm", "Phụ cấp ăn trưa", "Chuyển chính thức sớm"] },
  { id: "nv", name: "Nhân viên chính thức", emoji: "🧑‍💼", desc: "Đúng giờ, đúng việc, đúng deadline (thường thôi).", cost: 1e5, rate: 1e3, upgrades: ["Laptop mới", "Bảo hiểm sức khỏe", "Khóa học Excel", "Lương tháng 13", "Làm việc linh hoạt"] },
  { id: "cv", name: "Chuyên viên", emoji: "👩‍💻", desc: "Giải quyết việc khó mà không cần hỏi ai.", cost: 1.1e6, rate: 8e3, upgrades: ["Chứng chỉ nghề", "Quy trình chuẩn", "Phần mềm bản quyền", "Hội thảo chuyên ngành", "Chuyên gia đầu ngành"] },
  { id: "tn", name: "Trưởng nhóm", emoji: "🧭", desc: "Chia việc, gỡ rối và họp đứng 15 phút.", cost: 1.2e7, rate: 4.7e4, upgrades: ["Họp đứng 15 phút", "Bảng Kanban", "Kỹ năng phản hồi", "OKR rõ ràng", "Nhóm tự vận hành"] },
  { id: "pb", name: "Phòng ban", emoji: "🏢", desc: "Cả một phòng làm việc nhịp nhàng.", cost: 1.3e8, rate: 2.6e5, upgrades: ["Văn phòng mở", "Phần mềm quản lý", "Ngân sách đào tạo", "Quy chế thưởng", "Phòng ban kiểu mẫu"] },
  { id: "cn", name: "Chi nhánh tỉnh", emoji: "🏬", desc: "Mang thương hiệu về khắp các tỉnh thành.", cost: 1.4e9, rate: 1.4e6, upgrades: ["Văn phòng mặt tiền", "Đội ngũ địa phương", "Kho hàng riêng", "Giao hàng trong ngày", "Chi nhánh xuất sắc"] },
  { id: "nm", name: "Nhà máy", emoji: "🏭", desc: "Sản xuất cả ngày lẫn đêm.", cost: 2e10, rate: 7.8e6, upgrades: ["Dây chuyền tự động", "Tiêu chuẩn ISO", "Điện mặt trời áp mái", "Robot đóng gói", "Nhà máy thông minh"] },
  { id: "ctc", name: "Công ty con", emoji: "🏛️", desc: "Thương hiệu riêng, ban điều hành riêng.", cost: 3.3e11, rate: 4.4e7, upgrades: ["Thương hiệu riêng", "Hội đồng quản trị", "Kiểm toán độc lập", "Niêm yết cổ phiếu", "Hệ sinh thái"] },
  { id: "qt", name: "Chi nhánh quốc tế", emoji: "🌏", desc: "Có mặt ở Singapore, Tokyo, Sydney…", cost: 5.1e12, rate: 2.6e8, upgrades: ["Văn phòng Singapore", "Đối tác Nhật Bản", "Hội chợ quốc tế", "Chuỗi cung ứng toàn cầu", "Thương hiệu toàn cầu"] },
  { id: "td", name: "Tập đoàn đa ngành", emoji: "🏙️", desc: "Bất động sản, bán lẻ, công nghệ, gì cũng có.", cost: 7.5e13, rate: 1.6e9, upgrades: ["Quỹ đầu tư riêng", "Mua lại đối thủ", "Trụ sở 50 tầng", "Học viện nội bộ", "Biểu tượng quốc gia"] },
  { id: "ai", name: "Trung tâm nghiên cứu AI", emoji: "🤖", desc: "Siêu máy tính chạy không nghỉ.", cost: 1e15, rate: 1e10, upgrades: ["Siêu máy tính", "Dữ liệu lớn", "Mô hình riêng", "Bằng sáng chế", "Trí tuệ vượt trội"] },
  { id: "tp", name: "Thành phố công nghệ", emoji: "🌆", desc: "Một thành phố mang tên công ty bạn.", cost: 1.4e16, rate: 6.5e10, upgrades: ["Tàu điện nội khu", "Công viên xanh", "Trường đại học riêng", "Sân bay riêng", "Thành phố tương lai"] },
];

export const COST_GROWTH = 1.15;

// ------------------------------------------------------------ upgrades bought once

export type Upgrade =
  | { id: string; kind: "click"; name: string; emoji: string; desc: string; cost: number; mult?: number; pctOfIncome?: number }
  | { id: string; kind: "global"; name: string; emoji: string; desc: string; cost: number; pct: number };

export const CLICK_UPGRADES: Upgrade[] = [
  { id: "c-banphim", kind: "click", name: "Bàn phím cơ", emoji: "⌨️", desc: "Mỗi lần bấm ×2", cost: 1e5, mult: 2 },
  { id: "c-chuot", kind: "click", name: "Chuột không dây", emoji: "🖱️", desc: "Mỗi lần bấm ×2", cost: 5e5, mult: 2 },
  { id: "c-manhinh", kind: "click", name: "Màn hình thứ hai", emoji: "🖥️", desc: "Mỗi lần bấm ×2", cost: 1e7, mult: 2 },
  { id: "c-phimtat", kind: "click", name: "Thuộc lòng phím tắt", emoji: "⚡", desc: "Mỗi lần bấm ×2", cost: 1e8, mult: 2 },
  { id: "c-trolyai", kind: "click", name: "Trợ lý AI", emoji: "🤖", desc: "Mỗi lần bấm thêm 1% thu nhập mỗi giây", cost: 1e9, pctOfIncome: 0.01 },
  { id: "c-10ngon", kind: "click", name: "Gõ 10 ngón thần tốc", emoji: "🖐️", desc: "Mỗi lần bấm thêm 2% thu nhập mỗi giây", cost: 5e10, pctOfIncome: 0.02 },
];

export const GLOBAL_UPGRADES: Upgrade[] = [
  { id: "g-caphe", kind: "global", name: "Cà phê sữa đá miễn phí", emoji: "🧋", desc: "Cả công ty +5% năng suất", cost: 5e4, pct: 0.05 },
  { id: "g-dieuhoa", kind: "global", name: "Điều hòa mát rượi", emoji: "❄️", desc: "Cả công ty +5% năng suất", cost: 2e6, pct: 0.05 },
  { id: "g-ghe", kind: "global", name: "Ghế công thái học", emoji: "🪑", desc: "Cả công ty +10% năng suất", cost: 5e7, pct: 0.1 },
  { id: "g-pantry", kind: "global", name: "Pantry đầy đồ ăn vặt", emoji: "🍪", desc: "Cả công ty +10% năng suất", cost: 1e9, pct: 0.1 },
  { id: "g-dalat", kind: "global", name: "Team building Đà Lạt", emoji: "🏕️", desc: "Cả công ty +15% năng suất", cost: 3e10, pct: 0.15 },
  { id: "g-xanh", kind: "global", name: "Văn phòng xanh", emoji: "🪴", desc: "Cả công ty +15% năng suất", cost: 1e12, pct: 0.15 },
  { id: "g-phucloi", kind: "global", name: "Phúc lợi 5 sao", emoji: "⭐", desc: "Cả công ty +20% năng suất", cost: 5e13, pct: 0.2 },
  { id: "g-vanhoa", kind: "global", name: "Văn hóa doanh nghiệp", emoji: "🤝", desc: "Cả công ty +25% năng suất", cost: 2e15, pct: 0.25 },
  { id: "g-tuyendung", kind: "global", name: "Nơi làm việc mơ ước", emoji: "🏆", desc: "Cả công ty +30% năng suất", cost: 1e17, pct: 0.3 },
];

// ------------------------------------------------------------ career ranks

export type Rank = { name: string; emoji: string; at: number; line: string };

/** Reached by money earned in the current career (since the last "khởi nghiệp lại") */
export const RANKS: Rank[] = [
  { name: "Thực tập sinh", emoji: "🧑‍🎓", at: 0, line: "Ngày đầu đi làm, bạn được giao một chiếc laptop cũ và một chậu cây." },
  { name: "Nhân viên", emoji: "🧑‍💼", at: 1e6, line: "Chúc mừng! Bạn đã được ký hợp đồng chính thức." },
  { name: "Chuyên viên", emoji: "👩‍💻", at: 5e7, line: "Bạn trở thành người mọi người tìm đến khi có việc khó." },
  { name: "Trưởng nhóm", emoji: "🧭", at: 1e9, line: "Lần đầu dẫn dắt một nhóm. Họp đứng 15 phút bắt đầu từ hôm nay!" },
  { name: "Trưởng phòng", emoji: "📋", at: 5e10, line: "Bạn có phòng riêng, có cả cửa kính nhìn ra thành phố." },
  { name: "Giám đốc", emoji: "👔", at: 2e12, line: "Chữ ký của bạn giờ quyết định cả những dự án lớn." },
  { name: "Phó Tổng Giám đốc", emoji: "🎩", at: 1e14, line: "Bạn ngồi cạnh CEO trong mọi cuộc họp quan trọng." },
  { name: "CEO", emoji: "👑", at: 1e15, line: "Bạn chính thức là CEO. Cả công ty chờ bài phát biểu đầu tiên!" },
  { name: "Chủ tịch HĐQT", emoji: "🏛️", at: 5e16, line: "Tập đoàn của bạn có mặt trên khắp các châu lục." },
  { name: "Huyền thoại khởi nghiệp", emoji: "🌟", at: 1e18, line: "Câu chuyện của bạn được kể trong mọi lớp khởi nghiệp." },
];

// ------------------------------------------------------------ random situations

/**
 * Outcome of a choice. gain: seconds of current income (at least a few clicks' worth early on);
 * lose: share of current money; boost: temporary multiplier on income ("prod") or on clicks.
 */
export type Outcome = { text: string; gain?: number; lose?: number; boost?: { target: "prod" | "click"; mult: number; sec: number } };
export type Choice = { label: string; outcome: Outcome } | { label: string; chance: number; win: Outcome; fail: Outcome };
export type Situation = {
  id: string;
  emoji: string;
  title: string;
  text: string;
  /** Rank index range in which it can happen */
  minRank?: number;
  maxRank?: number;
  /** In-game months (1–12) or weekdays (0 = Thứ Hai … 6 = Chủ nhật) when it can happen */
  months?: number[];
  weekdays?: number[];
  choices: Choice[];
};

export const SITUATIONS: Situation[] = [
  // --- Công việc, sếp, khách hàng ---
  {
    id: "hop-dot-xuat", emoji: "📢", title: "Sếp gọi họp đột xuất", text: "10 giờ sáng, cả phòng nhận tin nhắn: “Họp gấp 5 phút nhé!”. Ai cũng biết 5 phút nghĩa là 1 tiếng.",
    choices: [
      { label: "Tham gia và ghi biên bản", outcome: { text: "Sếp khen bạn ghi chép cẩn thận, giao thêm việc quan trọng.", gain: 120 } },
      { label: "Xin phép ở lại tập trung làm việc", chance: 0.6, win: { text: "Không ai làm phiền, bạn làm việc hiệu quả hẳn.", boost: { target: "prod", mult: 1.5, sec: 60 } }, fail: { text: "Sếp không vui, bạn phải làm lại báo cáo từ đầu.", lose: 0.02 } },
    ],
  },
  {
    id: "deadline-gap", emoji: "⏰", title: "Deadline dí sát", text: "Báo cáo phải nộp trước 5 giờ chiều nay, mà file vẫn còn trắng trơn.",
    choices: [
      { label: "Bật chế độ nước rút", outcome: { text: "Tay gõ không ngừng! Mỗi lần bấm ×5 trong 30 giây.", boost: { target: "click", mult: 5, sec: 30 } } },
      { label: "Xin lùi deadline một ngày", outcome: { text: "Sếp đồng ý, nhưng nhắc khéo lần sau báo sớm hơn.", gain: 30 } },
    ],
  },
  {
    id: "khach-kho-tinh", emoji: "😤", title: "Khách hàng khó tính", text: "Khách gọi lần thứ 7 trong ngày để đổi màu logo “to hơn nhưng nhỏ lại”.",
    choices: [
      { label: "Kiên nhẫn giải thích", chance: 0.7, win: { text: "Khách hài lòng, ký luôn hợp đồng năm sau!", gain: 300 }, fail: { text: "Khách vẫn chưa ưng, nhưng ít nhất đã hết gọi.", gain: 30 } },
      { label: "Nhờ đồng nghiệp xử lý giúp", outcome: { text: "Đồng nghiệp gánh giúp. Bạn nợ họ một ly trà sữa.", gain: 20 } },
    ],
  },
  {
    id: "bao-cao-thang", emoji: "📊", title: "Báo cáo cuối tháng", text: "300 dòng số liệu cần tổng hợp trước cuộc họp sáng mai.",
    choices: [
      { label: "Làm thủ công từng dòng", outcome: { text: "Mất cả buổi nhưng chính xác tuyệt đối.", gain: 90 } },
      { label: "Viết công thức tự động", chance: 0.55, win: { text: "Công thức chạy mượt, cả phòng xin dùng chung. Năng suất ×2 trong 2 phút!", boost: { target: "prod", mult: 2, sec: 120 } }, fail: { text: "Công thức lỗi, số liệu lệch, phải làm lại.", lose: 0.01 } },
    ],
  },
  {
    id: "viec-ngoai-gio", emoji: "🌙", title: "Sếp nhờ việc ngoài giờ", text: "6 giờ chiều, sếp nhắn: “Em xem giúp anh file này tối nay nhé”.",
    choices: [
      { label: "Nhận lời", outcome: { text: "Sếp nhớ công bạn, thưởng thêm cuối tháng.", gain: 180 } },
      { label: "Từ chối khéo, hẹn sáng mai", outcome: { text: "Bạn được nghỉ ngơi đầy đủ, hôm sau làm việc hăng say.", boost: { target: "prod", mult: 1.3, sec: 120 } } },
    ],
  },
  {
    id: "thuyet-trinh", emoji: "🎤", title: "Thuyết trình trước ban giám đốc", text: "Dự án của bạn được chọn trình bày trong cuộc họp quý.", minRank: 2,
    choices: [
      { label: "Chuẩn bị slide thật kỹ", outcome: { text: "Bài trình bày gọn gàng, ai cũng gật gù.", gain: 400 } },
      { label: "Ứng biến cho tự nhiên", chance: 0.5, win: { text: "Bạn nói cuốn hút đến mức được vỗ tay giữa chừng!", gain: 1000 }, fail: { text: "Quên mất số liệu quan trọng, may mà kịp chữa cháy.", gain: 50 } },
    ],
  },
  {
    id: "danh-gia-kpi", emoji: "🎯", title: "Đánh giá KPI quý", text: "Đến kỳ tự đánh giá. Ô “Thành tích nổi bật” đang chờ bạn điền.", minRank: 1,
    choices: [
      { label: "Liệt kê đầy đủ thành tích", outcome: { text: "Sếp ghi nhận, bạn được xếp loại xuất sắc.", gain: 600 } },
      { label: "Khiêm tốn, ghi vài dòng", outcome: { text: "Sếp tự bổ sung thêm thành tích cho bạn. Cả nhóm có động lực hơn!", gain: 200, boost: { target: "prod", mult: 1.3, sec: 180 } } },
    ],
  },
  {
    id: "cai-tien", emoji: "💡", title: "Đề xuất cải tiến quy trình", text: "Một nhân viên đề xuất bỏ bớt 3 bước duyệt giấy tờ không cần thiết.", minRank: 4,
    choices: [
      { label: "Áp dụng thử ngay", chance: 0.7, win: { text: "Quy trình nhanh hẳn! Năng suất ×1,8 trong 10 phút.", boost: { target: "prod", mult: 1.8, sec: 600 } }, fail: { text: "Còn vài chỗ vướng, phải chỉnh lại.", gain: 60 } },
      { label: "Để dành cho quý sau", outcome: { text: "Đề xuất được lưu lại. Nhân viên hơi hụt hẫng.", gain: 30 } },
    ],
  },
  {
    id: "hop-dong-lon", emoji: "🤝", title: "Cơ hội hợp đồng lớn", text: "Một đối tác lớn muốn gặp trong tuần này để bàn hợp tác.", minRank: 3,
    choices: [
      { label: "Chuẩn bị đề xuất chi tiết", outcome: { text: "Đối tác ấn tượng với sự chuyên nghiệp.", gain: 900 } },
      { label: "Mời đối tác đi ăn trước", chance: 0.6, win: { text: "Bữa tối vui vẻ, hợp đồng ký ngay tại bàn!", gain: 1800 }, fail: { text: "Đối tác bận, hẹn lại tháng sau.", lose: 0.01 } },
    ],
  },

  // --- Đời sống văn phòng ---
  {
    id: "tra-sua", emoji: "🧋", title: "Cả phòng rủ order trà sữa", text: "3 giờ chiều, ai đó hô lên: “Có ai uống trà sữa không?”.",
    choices: [
      { label: "Order luôn, thêm trân châu", outcome: { text: "Năng lượng dâng trào! Năng suất ×1,5 trong 90 giây.", lose: 0.005, boost: { target: "prod", mult: 1.5, sec: 90 } } },
      { label: "Uống nước lọc thôi", outcome: { text: "Tiết kiệm được một khoản nho nhỏ.", gain: 10 } },
    ],
  },
  {
    id: "sinh-nhat", emoji: "🎂", title: "Sinh nhật đồng nghiệp", text: "Hôm nay là sinh nhật chị kế toán. Cả phòng đang lén góp tiền mua bánh.",
    choices: [
      { label: "Góp tiền và hát chúc mừng", outcome: { text: "Cả phòng vui vẻ, làm việc ăn ý hơn hẳn.", lose: 0.01, boost: { target: "prod", mult: 1.3, sec: 180 } } },
      { label: "Chúc mừng qua tin nhắn", outcome: { text: "Chị kế toán thả tim tin nhắn của bạn.", gain: 5 } },
    ],
  },
  {
    id: "may-in", emoji: "🖨️", title: "Máy in kẹt giấy", text: "Đúng lúc cần in hợp đồng, máy in kêu “rè rè” rồi im bặt.",
    choices: [
      { label: "Tự mở máy ra sửa", chance: 0.5, win: { text: "Bạn thành người hùng của cả phòng!", gain: 60 }, fail: { text: "Máy in nuốt luôn tờ hợp đồng, phải in lại.", lose: 0.005 } },
      { label: "Gọi bộ phận IT", outcome: { text: "IT đến sau 2 tiếng, bảo “khởi động lại là được”." } },
    ],
  },
  {
    id: "dieu-hoa-hong", emoji: "🥵", title: "Điều hòa hỏng giữa trưa hè", text: "Văn phòng nóng như lò, ai cũng phe phẩy tập tài liệu.", months: [5, 6, 7, 8],
    choices: [
      { label: "Mua quạt mini cho cả phòng", outcome: { text: "Mát mẻ trở lại, ai cũng cảm ơn bạn.", lose: 0.01, boost: { target: "prod", mult: 1.4, sec: 240 } } },
      { label: "Ra quán cà phê làm việc", outcome: { text: "Đổi không khí, đầu óc tỉnh táo hơn.", boost: { target: "prod", mult: 1.2, sec: 120 } } },
    ],
  },
  {
    id: "thang-may", emoji: "🛗", title: "Thang máy giờ cao điểm", text: "8 giờ kém 5, hàng chờ thang máy dài đến tận cửa tòa nhà.",
    choices: [
      { label: "Đi thang bộ 8 tầng", outcome: { text: "Khởi động cơ thể! Mỗi lần bấm ×2 trong 1 phút.", boost: { target: "click", mult: 2, sec: 60 } } },
      { label: "Kiên nhẫn chờ thang", outcome: { text: "Bạn đến muộn 3 phút. Không sao, sếp cũng đang kẹt thang." } },
    ],
  },
  {
    id: "team-building", emoji: "🏕️", title: "Công ty tổ chức team building", text: "Cuối tuần này cả công ty đi biển, có trò chơi và tiệc nướng.", minRank: 1,
    choices: [
      { label: "Hăng hái tham gia", outcome: { text: "Cả đội gắn kết hơn. Năng suất ×1,5 trong 5 phút!", boost: { target: "prod", mult: 1.5, sec: 300 } } },
      { label: "Xin ở nhà nghỉ ngơi", outcome: { text: "Bạn nạp lại năng lượng sau một tuần dài.", gain: 60 } },
    ],
  },
  {
    id: "dong-nghiep-om", emoji: "🤒", title: "Đồng nghiệp nghỉ ốm", text: "Anh ngồi cạnh bị cảm, phần việc của anh ấy vẫn phải xong hôm nay.",
    choices: [
      { label: "Làm thay giúp anh ấy", outcome: { text: "Anh ấy cảm ơn rối rít, sếp cũng ghi nhận.", gain: 240 } },
      { label: "Chia việc cho cả nhóm", outcome: { text: "Mỗi người một tay, xong sớm hơn dự kiến.", boost: { target: "prod", mult: 1.2, sec: 120 } } },
    ],
  },
  {
    id: "nhan-vien-moi", emoji: "👋", title: "Nhân viên mới nhận việc", text: "Một bạn mới vào nhóm, còn bỡ ngỡ chưa biết bắt đầu từ đâu.", minRank: 3,
    choices: [
      { label: "Kèm cặp tận tình", outcome: { text: "Bạn mới tiến bộ nhanh, cả nhóm nhẹ việc hơn.", boost: { target: "prod", mult: 1.5, sec: 300 } } },
      { label: "Đưa tài liệu cho tự đọc", outcome: { text: "Bạn mới tự xoay xở được, chậm hơn một chút.", gain: 30 } },
    ],
  },
  {
    id: "giam-can", emoji: "🥗", title: "Phong trào ăn healthy", text: "Cả phòng rủ nhau ăn salad trưa và đi bộ 10.000 bước mỗi ngày.",
    choices: [
      { label: "Tham gia cùng mọi người", outcome: { text: "Buổi chiều không còn buồn ngủ nữa!", boost: { target: "click", mult: 1.5, sec: 300 } } },
      { label: "Trung thành với cơm tấm", outcome: { text: "No bụng, vui vẻ, làm việc như thường.", gain: 30 } },
    ],
  },

  // --- Công nghệ ---
  {
    id: "mat-mang", emoji: "📡", title: "Mất mạng cả tòa nhà", text: "Wi-Fi tắt phụt, cả văn phòng đồng loạt kêu “Ơ…”.",
    choices: [
      { label: "Phát 4G từ điện thoại", outcome: { text: "Tốn chút dung lượng nhưng công việc vẫn chạy.", lose: 0.005, gain: 120 } },
      { label: "Tranh thủ dọn bàn và lên kế hoạch", outcome: { text: "Bàn gọn gàng, đầu óc sáng suốt.", boost: { target: "prod", mult: 1.15, sec: 120 } } },
    ],
  },
  {
    id: "email-lua-dao", emoji: "🎣", title: "Email lạ đòi xác minh tài khoản", text: "“Tài khoản của bạn sẽ bị khóa sau 2 giờ. Bấm vào đây để xác minh ngay!”",
    choices: [
      { label: "Bấm vào link cho chắc", outcome: { text: "Đó là email lừa đảo! Mất tiền và mất cả buổi để xử lý.", lose: 0.05 } },
      { label: "Kiểm tra người gửi và báo IT", outcome: { text: "IT khen bạn cảnh giác và thưởng nóng!", gain: 150 } },
    ],
  },
  {
    id: "laptop-cham", emoji: "🐢", title: "Laptop chạy chậm như rùa", text: "Mở một file Excel mất 3 phút. Chuột quay vòng tròn liên tục.",
    choices: [
      { label: "Đề xuất xin máy mới", chance: 0.6, win: { text: "Được duyệt! Máy mới chạy vèo vèo, mỗi lần bấm ×2 trong 5 phút.", boost: { target: "click", mult: 2, sec: 300 } }, fail: { text: "Chưa có ngân sách, hẹn quý sau.", gain: 10 } },
      { label: "Dọn bớt file rác", outcome: { text: "Máy nhanh hơn được một chút.", boost: { target: "click", mult: 1.3, sec: 120 } } },
    ],
  },
  {
    id: "cap-nhat-may", emoji: "🔄", title: "Máy tự cập nhật lúc 4 giờ 59", text: "Còn 1 phút nữa là gửi báo cáo thì máy hiện: “Đang cập nhật, đừng tắt máy…”.",
    choices: [
      { label: "Ngồi chờ cập nhật xong", outcome: { text: "20 phút sau máy chạy lại. Bạn về muộn một chút." } },
      { label: "Mượn máy đồng nghiệp gửi gấp", outcome: { text: "Báo cáo đến tay sếp đúng hạn!", gain: 60 } },
    ],
  },
  {
    id: "cong-cu-ai", emoji: "🧠", title: "Công cụ AI mới ra mắt", text: "Ai cũng bàn tán về một công cụ AI giúp viết báo cáo trong vài giây.", minRank: 2,
    choices: [
      { label: "Thử nghiệm ngay", chance: 0.7, win: { text: "Tiết kiệm hàng giờ mỗi ngày! Năng suất ×2 trong 5 phút.", boost: { target: "prod", mult: 2, sec: 300 } }, fail: { text: "AI viết sai số liệu, phải kiểm tra lại từng dòng.", lose: 0.01 } },
      { label: "Chờ người khác dùng thử trước", outcome: { text: "An toàn là trên hết.", gain: 30 } },
    ],
  },

  // --- Nhân sự, tiền bạc ---
  {
    id: "headhunter", emoji: "🕵️", title: "Headhunter mời về đối thủ", text: "Một công ty đối thủ đề nghị mức lương cao hơn 30%.", minRank: 3,
    choices: [
      { label: "Ở lại và đàm phán tăng lương", chance: 0.6, win: { text: "Công ty giữ chân bạn bằng mức thưởng hấp dẫn!", boost: { target: "prod", mult: 1.5, sec: 600 } }, fail: { text: "Chưa được tăng, nhưng sếp hứa xem xét cuối năm." } },
      { label: "Lịch sự từ chối", outcome: { text: "Sếp biết chuyện và thưởng cho lòng trung thành.", gain: 300 } },
    ],
  },
  {
    id: "tang-luong", emoji: "💸", title: "Kỳ xét tăng lương", text: "Phòng nhân sự mở đợt xét tăng lương giữa năm.", minRank: 1,
    choices: [
      { label: "Mạnh dạn đề xuất", chance: 0.6, win: { text: "Được duyệt tăng lương 15%!", gain: 900 }, fail: { text: "Lần này chưa được, nhưng sếp đã ghi nhận.", gain: 60 } },
      { label: "Chờ sếp tự nhận ra", outcome: { text: "Sếp nhận ra thật, tăng nhẹ một chút.", gain: 200 } },
    ],
  },
  {
    id: "thuong-nong", emoji: "🎁", title: "Thưởng nóng dự án", text: "Dự án vừa bàn giao sớm hơn kế hoạch. Ban giám đốc quyết định thưởng nóng!",
    choices: [{ label: "Nhận thưởng", outcome: { text: "Một khoản thưởng bất ngờ vào tài khoản!", gain: 600 } }],
  },
  {
    id: "luong-13", emoji: "💰", title: "Lương tháng 13 về", text: "Tin nhắn ngân hàng báo số dư tăng mạnh. Cả phòng rộn ràng.", months: [12, 1],
    choices: [
      { label: "Tiết kiệm để đầu tư", outcome: { text: "Một khoản dự phòng vững chắc.", gain: 1200 } },
      { label: "Đi du lịch nạp năng lượng", outcome: { text: "Trở về với tinh thần mới! Năng suất ×2 trong 10 phút.", boost: { target: "prod", mult: 2, sec: 600 } } },
    ],
  },
  {
    id: "rủ-dau-tu", emoji: "📈", title: "Đồng nghiệp rủ đầu tư", text: "“Cơ hội nghìn năm có một, lãi gấp đôi trong một tháng!”", minRank: 2,
    choices: [
      { label: "Đầu tư một ít cho biết", chance: 0.4, win: { text: "May mắn có lãi thật!", gain: 1500 }, fail: { text: "Lãi đâu chẳng thấy, vốn cũng bay mất một phần.", lose: 0.05 } },
      { label: "Gửi tiết kiệm ngân hàng", outcome: { text: "Chậm mà chắc.", gain: 300 } },
    ],
  },

  // --- Theo mùa, theo ngày ---
  {
    id: "tet", emoji: "🧧", title: "Tết Nguyên Đán đến rồi", text: "Văn phòng treo đầy câu đối đỏ, ai cũng mong được về quê.", months: [1, 2],
    choices: [
      { label: "Lì xì cả nhóm đầu năm", outcome: { text: "Năm mới phát tài! Năng suất ×2 trong 10 phút.", lose: 0.02, boost: { target: "prod", mult: 2, sec: 600 } } },
      { label: "Xin về quê sớm một ngày", outcome: { text: "Gia đình đoàn tụ, bạn trở lại đầy năng lượng.", gain: 300 } },
    ],
  },
  {
    id: "trung-thu", emoji: "🥮", title: "Mùa Trung thu", text: "Khách hàng gửi hộp bánh trung thu, đối tác hỏi có quà tặng không.", months: [8, 9],
    choices: [
      { label: "Tặng bánh cho khách hàng thân thiết", outcome: { text: "Khách cảm động, đặt thêm đơn hàng mới.", lose: 0.01, gain: 800 } },
      { label: "Phá cỗ cùng cả phòng", outcome: { text: "Bánh nướng, trà nóng, chuyện vui rôm rả.", boost: { target: "prod", mult: 1.3, sec: 300 } } },
    ],
  },
  {
    id: "black-friday", emoji: "🛍️", title: "Black Friday", text: "Cả thị trường chạy khuyến mãi. Đội bán hàng hỏi có giảm giá không.", months: [11], minRank: 4,
    choices: [
      { label: "Chạy khuyến mãi lớn", chance: 0.7, win: { text: "Đơn hàng tăng vọt, kho gần cạn!", gain: 2000 }, fail: { text: "Khuyến mãi lỗ vốn hơn dự kiến.", lose: 0.02 } },
      { label: "Giữ giá, tặng quà kèm", outcome: { text: "Khách quen vẫn ủng hộ đều đặn.", gain: 300 } },
    ],
  },
  {
    id: "mua-ngap", emoji: "🌧️", title: "Mưa lớn ngập đường", text: "Trời mưa như trút, nhiều tuyến đường ngập đến bánh xe.", months: [6, 7, 8, 9],
    choices: [
      { label: "Làm việc tại nhà", outcome: { text: "An toàn và vẫn hiệu quả.", boost: { target: "prod", mult: 1.2, sec: 300 } } },
      { label: "Lội nước đến công ty", outcome: { text: "Đến nơi thì cả phòng còn mỗi mình bạn. Sếp ấn tượng!", gain: 200 } },
    ],
  },
  {
    id: "thu-hai", emoji: "😩", title: "Sáng thứ Hai uể oải", text: "Cuối tuần trôi qua quá nhanh, mắt vẫn còn díp lại.", weekdays: [0],
    choices: [
      { label: "Pha một ly cà phê thật đậm", outcome: { text: "Tỉnh hẳn! Mỗi lần bấm ×2 trong 2 phút.", boost: { target: "click", mult: 2, sec: 120 } } },
      { label: "Lướt mạng xã hội thêm 10 phút", outcome: { text: "Thứ Hai vẫn là thứ Hai." } },
    ],
  },
  {
    id: "thu-sau", emoji: "🥳", title: "Chiều thứ Sáu", text: "Còn 2 tiếng nữa là cuối tuần. Ai cũng đang nhìn đồng hồ.", weekdays: [4],
    choices: [
      { label: "Hoàn thành nốt việc tồn", outcome: { text: "Cuối tuần thảnh thơi, không còn việc treo.", gain: 300 } },
      { label: "Rủ cả nhóm đi ăn tối", outcome: { text: "Nhóm gắn kết hơn sau bữa tối vui vẻ.", boost: { target: "prod", mult: 1.4, sec: 300 } } },
    ],
  },
  {
    id: "tat-nien", emoji: "🎤", title: "Tiệc tất niên công ty", text: "Sân khấu, ban nhạc và bốc thăm trúng thưởng. MC gọi tên bạn lên hát!", months: [12, 1],
    choices: [
      { label: "Lên hát luôn", chance: 0.5, win: { text: "Cả hội trường vỗ tay, bạn còn trúng giải nhất bốc thăm!", gain: 1000 }, fail: { text: "Hát lạc tông, nhưng ai cũng cười vui vẻ.", gain: 60 } },
      { label: "Xin phép nhường người khác", outcome: { text: "Bạn ngồi thưởng thức tiệc ngon.", gain: 150 } },
    ],
  },
  {
    id: "kpi-cuoi-nam", emoji: "🏁", title: "Chạy KPI cuối năm", text: "Còn ít ngày nữa là chốt năm. Chỉ tiêu vẫn còn thiếu một chút.", months: [12], minRank: 3,
    choices: [
      { label: "Tăng tốc toàn công ty", outcome: { text: "Cả công ty bứt phá! Năng suất ×2 trong 5 phút.", boost: { target: "prod", mult: 2, sec: 300 } } },
      { label: "Giữ nhịp ổn định", outcome: { text: "Không ai bị quá tải, chỉ tiêu vẫn đạt.", gain: 600 } },
    ],
  },

  // --- Thực tập sinh ---
  {
    id: "pha-ca-phe", emoji: "☕", title: "Sếp nhờ pha cà phê", text: "Ngày thứ ba đi làm, sếp hỏi: “Em pha giúp anh ly cà phê nhé?”", maxRank: 1,
    choices: [
      { label: "Pha thật ngon theo công thức", outcome: { text: "Sếp khen ngon và nhớ tên bạn từ hôm nay!", gain: 60 } },
      { label: "Mua cà phê ngoài cho nhanh", outcome: { text: "Tốn chút tiền nhưng sếp vẫn vui.", lose: 0.01, gain: 120 } },
    ],
  },
  {
    id: "anh-chi-chi-meo", emoji: "📝", title: "Anh chị đi trước chỉ mẹo", text: "Chị trưởng nhóm chỉ bạn 5 phím tắt giúp làm Excel nhanh gấp đôi.", maxRank: 1,
    choices: [
      { label: "Ghi chép cẩn thận", outcome: { text: "Học được nhiều thứ! Mỗi lần bấm ×2 trong 5 phút.", boost: { target: "click", mult: 2, sec: 300 } } },
      { label: "Gật đầu cho qua", outcome: { text: "Hôm sau bạn quên sạch." } },
    ],
  },
  {
    id: "photo-tai-lieu", emoji: "📄", title: "Photo 200 bản tài liệu gấp", text: "Cuộc họp bắt đầu sau 15 phút, cần 200 bản tài liệu.", maxRank: 2,
    choices: [
      { label: "Chạy ngay ra máy photo", outcome: { text: "Kịp giờ, sếp gật đầu hài lòng.", gain: 90 } },
      { label: "Đề xuất gửi file qua email", chance: 0.7, win: { text: "Sếp thấy hợp lý, còn khen bạn tiết kiệm giấy!", gain: 150 }, fail: { text: "Sếp vẫn muốn bản giấy. Bạn chạy đi photo trong 5 phút.", gain: 20 } },
    ],
  },

  // --- Lãnh đạo cấp cao ---
  {
    id: "phong-van-bao", emoji: "📰", title: "Phỏng vấn báo chí", text: "Một tờ báo kinh tế muốn phỏng vấn bạn về câu chuyện thành công.", minRank: 5,
    choices: [
      { label: "Chia sẻ thật lòng", outcome: { text: "Bài báo lan truyền, nhiều người tài muốn về làm việc.", boost: { target: "prod", mult: 1.4, sec: 600 } } },
      { label: "Trả lời theo kịch bản", outcome: { text: "Bài báo an toàn, thương hiệu được nhắc tên.", gain: 600 } },
    ],
  },
  {
    id: "doi-thu-giam-gia", emoji: "⚔️", title: "Đối thủ giảm giá sốc", text: "Đối thủ cạnh tranh tung chương trình giảm giá 50% toàn bộ sản phẩm.", minRank: 5,
    choices: [
      { label: "Đáp trả bằng chất lượng", outcome: { text: "Khách hàng trung thành vẫn ở lại.", boost: { target: "prod", mult: 1.5, sec: 600 } } },
      { label: "Giảm giá theo", outcome: { text: "Giữ được thị phần nhưng lợi nhuận mỏng hơn.", lose: 0.03, gain: 600 } },
    ],
  },
  {
    id: "goi-von", emoji: "💼", title: "Nhà đầu tư muốn rót vốn", text: "Một quỹ đầu tư lớn đề nghị rót vốn để đổi lấy 20% cổ phần.", minRank: 6,
    choices: [
      { label: "Nhận vốn để mở rộng", outcome: { text: "Dòng vốn mới giúp công ty tăng tốc mạnh mẽ.", gain: 3600 } },
      { label: "Giữ quyền tự chủ", outcome: { text: "Đội ngũ tự hào vì công ty vẫn là của mình.", boost: { target: "prod", mult: 1.5, sec: 900 } } },
    ],
  },
  {
    id: "khung-hoang", emoji: "🔥", title: "Khủng hoảng truyền thông", text: "Một bài đăng phàn nàn về sản phẩm lan truyền khắp mạng xã hội.", minRank: 6,
    choices: [
      { label: "Xin lỗi công khai và khắc phục", outcome: { text: "Khách hàng đánh giá cao sự thẳng thắn.", lose: 0.03, boost: { target: "prod", mult: 1.3, sec: 600 } } },
      { label: "Im lặng chờ mọi chuyện qua", chance: 0.4, win: { text: "Mọi người nhanh chóng quên đi." }, fail: { text: "Sự việc lớn hơn, doanh số sụt giảm mạnh.", lose: 0.1 } },
    ],
  },
  {
    id: "sap-nhap", emoji: "🧩", title: "Cơ hội sáp nhập", text: "Một công ty khởi nghiệp công nghệ đang tìm người mua lại.", minRank: 7,
    choices: [
      { label: "Mua lại toàn bộ", outcome: { text: "Công nghệ mới giúp năng suất ×2 trong 20 phút!", lose: 0.15, boost: { target: "prod", mult: 2, sec: 1200 } } },
      { label: "Hợp tác chiến lược", outcome: { text: "Đôi bên cùng có lợi.", gain: 1800 } },
    ],
  },
  {
    id: "ipo", emoji: "🔔", title: "Niêm yết sàn chứng khoán", text: "Hồ sơ niêm yết đã được duyệt. Bạn sẽ rung chuông phiên giao dịch đầu tiên.", minRank: 7,
    choices: [
      { label: "Rung chuông IPO", chance: 0.6, win: { text: "Cổ phiếu tăng trần ngay phiên đầu tiên!", gain: 7200 }, fail: { text: "Thị trường ảm đạm, cổ phiếu đi ngang.", gain: 600 } },
      { label: "Hoãn lại chờ thời điểm tốt hơn", outcome: { text: "Thận trọng không bao giờ thừa.", gain: 900 } },
    ],
  },
];

// ------------------------------------------------------------ achievements

export type Achievement = { id: string; name: string; desc: string; emoji: string };

export const ACHIEVEMENTS: Achievement[] = [
  { id: "a-click-100", name: "Chăm chỉ", desc: "Bấm làm việc 100 lần", emoji: "👆" },
  { id: "a-click-1k", name: "Ngón tay thép", desc: "Bấm làm việc 1.000 lần", emoji: "💪" },
  { id: "a-click-10k", name: "Bàn phím mòn phím", desc: "Bấm làm việc 10.000 lần", emoji: "⌨️" },
  { id: "a-earn-1m", name: "Triệu phú văn phòng", desc: "Kiếm tổng cộng 1 triệu đồng", emoji: "💵" },
  { id: "a-earn-1b", name: "Tỷ phú đầu tiên", desc: "Kiếm tổng cộng 1 tỷ đồng", emoji: "💰" },
  { id: "a-earn-1t", name: "Nghìn tỷ", desc: "Kiếm tổng cộng 1 nghìn tỷ đồng", emoji: "🏦" },
  { id: "a-earn-1q", name: "Triệu tỷ", desc: "Kiếm tổng cộng 1 triệu tỷ đồng", emoji: "🪙" },
  { id: "a-staff-10", name: "Nhóm nhỏ", desc: "Có 10 nhân sự", emoji: "👥" },
  { id: "a-staff-100", name: "Công ty vừa", desc: "Có 100 nhân sự", emoji: "🏢" },
  { id: "a-staff-500", name: "Doanh nghiệp lớn", desc: "Có 500 nhân sự", emoji: "🏙️" },
  ...STAFF.map((s) => ({ id: `a-first-${s.id}`, name: `Có ${s.name.toLowerCase()} đầu tiên`, desc: `Sở hữu 1 ${s.name.toLowerCase()}`, emoji: s.emoji })),
  { id: "a-event-10", name: "Xử lý khéo léo", desc: "Giải quyết 10 tình huống", emoji: "🧠" },
  { id: "a-event-50", name: "Bản lĩnh công sở", desc: "Giải quyết 50 tình huống", emoji: "🎖️" },
  { id: "a-coffee-1", name: "Ly cà phê vàng", desc: "Bắt được 1 ly cà phê vàng", emoji: "☕" },
  { id: "a-coffee-25", name: "Tín đồ cà phê", desc: "Bắt được 25 ly cà phê vàng", emoji: "🏅" },
  { id: "a-rank-tn", name: "Lần đầu làm sếp", desc: "Lên Trưởng nhóm", emoji: "🧭" },
  { id: "a-rank-gd", name: "Ghế giám đốc", desc: "Lên Giám đốc", emoji: "👔" },
  { id: "a-rank-ceo", name: "Đỉnh cao sự nghiệp", desc: "Lên CEO", emoji: "👑" },
  { id: "a-prestige-1", name: "Khởi nghiệp lần đầu", desc: "Khởi nghiệp lại 1 lần", emoji: "🚀" },
  { id: "a-prestige-5", name: "Nhà khởi nghiệp hàng loạt", desc: "Khởi nghiệp lại 5 lần", emoji: "🌟" },
  { id: "a-year-1", name: "Một năm gắn bó", desc: "Làm việc tròn 1 năm trong game", emoji: "📅" },
];

/** Each achievement adds this much to income (applies across careers) */
export const ACHIEVEMENT_BONUS = 0.01;

// ------------------------------------------------------------ company news ticker

/** Lines shown in the news ticker; minRank keeps senior news for later */
export const NEWS: { text: string; minRank?: number }[] = [
  { text: "Máy pha cà phê tầng 3 đã được sửa. Cả tòa nhà thở phào." },
  { text: "Phòng nhân sự nhắc: vui lòng không để đồ ăn qua đêm trong tủ lạnh chung." },
  { text: "Thang máy số 2 bảo trì. Thang bộ bỗng đông vui lạ thường." },
  { text: "Ai đó đã đặt nhầm 50 ly trà sữa. Không ai phàn nàn." },
  { text: "Chậu cây trên bàn bạn mọc thêm một chiếc lá mới." },
  { text: "Bộ phận IT khuyên: hãy thử tắt máy rồi bật lại." },
  { text: "Tin đồn: tháng này có thể có thưởng. Chưa ai xác nhận." },
  { text: "Phòng họp lớn đã kín lịch đến hết tuần." },
  { text: "Chị lao công khen bàn làm việc của bạn gọn nhất tầng." },
  { text: "Wi-Fi văn phòng đổi mật khẩu. Cả phòng đi hỏi nhau." },
  { text: "Cuộc thi “Ai đến sớm nhất” tuần này vẫn chưa có người thắng.", minRank: 1 },
  { text: "Khách hàng gửi thư khen dịch vụ chăm sóc tận tình.", minRank: 2 },
  { text: "Nhóm của bạn được nêu tên trong bản tin nội bộ.", minRank: 3 },
  { text: "Phòng ban vừa chuyển sang văn phòng mới rộng rãi hơn.", minRank: 4 },
  { text: "Báo chí đưa tin công ty mở thêm chi nhánh mới.", minRank: 5 },
  { text: "Cổ phiếu công ty tăng nhẹ sau báo cáo quý khả quan.", minRank: 6 },
  { text: "Ứng viên xếp hàng nộp hồ sơ vào công ty bạn.", minRank: 6 },
  { text: "Tạp chí kinh doanh bình chọn bạn là “CEO của năm”.", minRank: 7 },
  { text: "Logo công ty xuất hiện trên biển quảng cáo giữa trung tâm thành phố.", minRank: 7 },
  { text: "Một trường đại học mời bạn đến chia sẻ kinh nghiệm khởi nghiệp.", minRank: 8 },
  { text: "Tập đoàn của bạn được nhắc đến trong sách giáo khoa kinh tế.", minRank: 9 },
];

export const WEEKDAYS = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ nhật"];
/** Income multiplier by weekday: Monday blues, Friday energy */
export const WEEKDAY_MULT = [0.9, 1, 1, 1, 1.1, 1, 1];
export const WEEKDAY_NOTE: (string | null)[] = ["Thứ Hai uể oải: năng suất −10%", null, null, null, "Thứ Sáu hăng hái: năng suất +10%", null, null];
