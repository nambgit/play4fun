export type GameType = "arcade" | "quiz" | "party";
export type Audience = "office" | "student" | "gamer" | "group";

/** Key into the icon map in components/game-icon.tsx (kept as string so data stays serializable) */
export type GameIcon =
  | "run"
  | "inbox"
  | "calculator"
  | "crosshair"
  | "keyboard"
  | "briefcase"
  | "book"
  | "gamepad"
  | "spy"
  | "brush"
  | "trophy"
  | "zap"
  | "brain"
  | "building"
  | "letters"
  | "link"
  | "compass"
  | "bowl"
  | "flag"
  | "moon"
  | "hearts";

export type GameEntry = {
  slug: string;
  title: string;
  type: GameType;
  tagline: string;
  description: string;
  audience: Audience[];
  status: "live" | "soon";
  icon: GameIcon;
  /** Two-stop gradient for the generated cover art (fallback when there is no thumbnail) */
  cover: [string, string];
  /**
   * Real in-game screenshot, 1200×750 (16:10). Generate with
   * `npm run thumbnails -w @play4fun/web -- <slug>` (see scripts/capture-thumbnails.mjs).
   */
  thumbnail?: string;
  duration: string;
  players: string;
  /** Short rules shown next to a playable game */
  howTo?: string[];
};

/** Game the global "Chơi ngay" buttons point to */
export const FEATURED_SLUG = "pixel-dodge";

export const GAMES: GameEntry[] = [
  // --- Arcade ---
  {
    slug: "inbox-zero",
    title: "Inbox Zero",
    type: "arcade",
    tagline: "Vuốt trái, vuốt phải — dọn sạch hộp thư trong 90 giây.",
    description:
      "Email đổ về liên tục: việc gấp của sếp, khách hàng hỏi giá, và cả đống thư rác “trúng thưởng”. Phân loại thật nhanh, né email lừa đảo và giữ combo càng lâu càng tốt.",
    audience: ["office", "student"],
    status: "live",
    icon: "inbox",
    cover: ["#7b4dff", "#ff6a9a"],
    thumbnail: "/thumbnails/inbox-zero.webp",
    duration: "1 phút",
    players: "1 người",
    howTo: [
      "Vuốt phải (→) để xử lý email công việc thật của bạn.",
      "Vuốt trái (←) để xóa quảng cáo, thư rác và email lừa đảo.",
      "Sau 20 giây mở khóa vuốt lên (↑): chuyển tiếp thư của phòng khác.",
      "Soi kỹ địa chỉ người gửi — đồng nghiệp thật luôn dùng @mayxanh.vn.",
      "Sai hoặc để email quá hạn mất 1 tim; hết 3 tim là “sếp gọi lên phòng”.",
      "Mỗi ván là một hộp thư ngẫu nhiên mới — chơi lại không bị lặp đề.",
    ],
  },
  {
    slug: "deadline-dash",
    title: "Deadline Dash",
    type: "arcade",
    tagline: "Chạy trốn deadline: nhảy qua họp đột xuất, cúi né “em ơi gấp”.",
    description:
      "Deadline đang đuổi sát sau lưng! Nhảy qua cuộc họp bất ngờ, cúi né tin nhắn “em ơi gấp”, gom cà phê để bật Turbo. Mỗi ván là một kịch bản ngẫu nhiên — từ Thứ Hai đầu tuần, mùa thi cử đến đêm cày rank.",
    audience: ["office", "student", "gamer"],
    status: "live",
    icon: "run",
    cover: ["#ff6a3d", "#ffb547"],
    thumbnail: "/thumbnails/deadline-dash.webp",
    duration: "1–3 phút",
    players: "1 người",
    howTo: [
      "Nhảy (Space / ↑ / chạm) qua hồ sơ, thùng giấy và bàn họp.",
      "Cúi (↓ / vuốt xuống) để né tin nhắn bay ngang đầu — nhảy không qua được đâu.",
      "Mỗi lần vấp, bức tường deadline áp sát hơn; chạy trơn tru thì khoảng cách hồi lại.",
      "Gom đủ 3 ly cà phê để bật Turbo: chạy nhanh và húc bay mọi chướng ngại.",
      "Mỗi ván một kịch bản ngẫu nhiên, không lặp lại kịch bản vừa chơi.",
    ],
  },
  {
    slug: "bai-kiem-tra-15-phut",
    title: "Kiểm tra 15 phút",
    type: "arcade",
    tagline: "Giải nhanh phép tính trước khi chuông reo.",
    description:
      "Những phép tính nhẩm xuất hiện ngày càng nhanh. Trả lời đúng để kéo dài thời gian, sai là mất tim. Bạn trụ được đến câu thứ mấy?",
    audience: ["student"],
    status: "live",
    icon: "calculator",
    cover: ["#0ea5e9", "#22d3a5"],
    thumbnail: "/thumbnails/bai-kiem-tra-15-phut.webp",
    duration: "1 phút",
    players: "1 người",
    howTo: [
      "Bắt đầu với 12 giây, mỗi câu đúng được cộng thêm giờ (càng lên cao càng ít).",
      "Gõ đáp án bằng bàn phím số; gõ đủ chữ số là tự chấm.",
      "Sai một câu mất 1 tim và xem đáp án đúng; hết 3 tim là nộp bài.",
      "Đề khó dần: cộng trừ, bảng cửu chương, phép chia, tìm số còn thiếu, nhân chia trước cộng trừ sau.",
      "30 câu đúng là điểm 10. Mỗi lần làm là một đề mới.",
    ],
  },
  {
    slug: "pixel-dodge",
    title: "Pixel Dodge",
    type: "arcade",
    tagline: "Né đạn kiểu bullet-hell, càng sống lâu càng khó.",
    description:
      "Điều khiển một chấm sáng giữa màn mưa đạn pixel. Mỗi 10 giây là một đợt tấn công mới — phản xạ là tất cả.",
    audience: ["gamer", "office", "student"],
    status: "live",
    icon: "crosshair",
    cover: ["#1e1b4b", "#7c3aed"],
    thumbnail: "/thumbnails/pixel-dodge.webp",
    duration: "1–3 phút",
    players: "1 người",
    howTo: [
      "Né mọi viên đạn — chạm một viên là hết ván.",
      "Cứ 10 giây là một đợt mới, đạn nhanh và dày hơn.",
      "Lướt sát đạn để “sượt qua” và nhận điểm thưởng.",
      "Ô vàng nhấp nháy báo trước chỗ đạn sắp bắn ra.",
      "Nhặt khiên xanh để chịu thêm được một lần trúng đạn.",
    ],
  },
  {
    slug: "go-phim-nhanh",
    title: "Gõ phím thần tốc",
    type: "arcade",
    tagline: "Đo tốc độ gõ tiếng Việt có dấu và tiếng Anh — mỗi ván một đoạn văn mới.",
    description:
      "60 giây gõ càng nhanh càng tốt: chọn tiếng Việt (Telex, VNI đều được) hoặc tiếng Anh. Mỗi ván là các đoạn văn ngẫu nhiên về đời văn phòng, mùa thi, game và đủ thứ chuyện, không lặp lại đoạn vừa gõ. Xem tốc độ WPM, độ chính xác và so tài với đồng nghiệp, bạn cùng lớp.",
    audience: ["office", "student", "gamer"],
    status: "live",
    icon: "keyboard",
    cover: ["#111827", "#16b364"],
    thumbnail: "/thumbnails/go-phim-nhanh.webp",
    duration: "1 phút",
    players: "1 người",
    howTo: [
      "Chọn ngôn ngữ: Tiếng Việt hoặc English.",
      "Gõ từ đang được tô sáng, xong mỗi từ thì bấm Space.",
      "Từ chỉ được tính khi đúng cả chữ lẫn dấu; gõ sai vẫn đi tiếp được.",
      "Đồng hồ 60 giây chạy từ phím đầu tiên; Esc để tạm dừng.",
      "WPM = số ký tự gõ đúng ÷ 5 trong một phút.",
      "Mỗi ván là đoạn văn ngẫu nhiên, đoạn vừa gõ sẽ không quay lại ngay.",
    ],
  },
  // --- Quiz ---
  {
    slug: "ban-la-kieu-dong-nghiep-nao",
    title: "Bạn là kiểu đồng nghiệp nào?",
    type: "quiz",
    tagline: "10 câu hỏi, 1 kết quả để khoe lên Facebook.",
    description:
      "Người giữ nhịp cuộc họp, chuyên gia trà sữa hay “chiến thần deadline”? Trả lời 10 tình huống công sở để biết bạn thuộc kiểu nào.",
    audience: ["office"],
    status: "live",
    icon: "briefcase",
    cover: ["#1a9fe8", "#6b3cf5"],
    thumbnail: "/thumbnails/ban-la-kieu-dong-nghiep-nao.webp",
    duration: "3 phút",
    players: "1 người",
    howTo: [
      "Trả lời 10 tình huống công sở, chọn điều bạn thật sự sẽ làm.",
      "Không có đáp án đúng sai, mỗi lựa chọn nghiêng về một kiểu đồng nghiệp.",
      "Bấm nút ← để sửa câu trước nếu đổi ý.",
      "Nhận kết quả kèm tỉ lệ từng kiểu, điểm mạnh, điểm cần lưu ý và mẹo làm việc.",
      "Mỗi lần làm là một bộ câu hỏi khác, đáp án cũng được xáo trộn.",
    ],
  },
  {
    slug: "ban-hoc-kieu-gi",
    title: "Bạn học kiểu gì?",
    type: "quiz",
    tagline: "Cú đêm, chiến thần nước rút hay mọt sách chính hiệu?",
    description:
      "Khám phá phong cách học của bạn qua những tình huống quen thuộc mùa thi — và nhận vài mẹo học hợp với chính mình.",
    audience: ["student"],
    status: "live",
    icon: "book",
    cover: ["#f59e0b", "#ef4444"],
    thumbnail: "/thumbnails/ban-hoc-kieu-gi.webp",
    duration: "3 phút",
    players: "1 người",
    howTo: [
      "Trả lời 10 tình huống quen thuộc mùa thi.",
      "Không có đáp án đúng sai, cứ chọn điều bạn hay làm nhất.",
      "Bấm nút ← để sửa câu trước nếu đổi ý.",
      "Nhận phong cách học của bạn kèm mẹo ôn thi hợp với chính mình.",
      "Mỗi lần làm là một bộ câu hỏi khác, đáp án cũng được xáo trộn.",
    ],
  },
  {
    slug: "gamer-he-nao",
    title: "Bạn là gamer hệ nào?",
    type: "quiz",
    tagline: "Tryhard, chill hay chuyên đi gánh team?",
    description:
      "Từ cách chọn tướng đến phản ứng khi thua liên tiếp — 12 câu hỏi để biết bạn là kiểu gamer nào trong mắt đồng đội.",
    audience: ["gamer"],
    status: "live",
    icon: "gamepad",
    cover: ["#ec4899", "#8b5cf6"],
    thumbnail: "/thumbnails/gamer-he-nao.webp",
    duration: "3 phút",
    players: "1 người",
    howTo: [
      "Trả lời 12 tình huống từ phòng chờ đến lúc thua trận.",
      "Không có đáp án đúng sai, chọn phản ứng thật nhất của bạn.",
      "Bấm nút ← để sửa câu trước nếu đổi ý.",
      "Nhận hệ gamer của bạn, tỉ lệ từng hệ và hệ hợp cạ nhất để rủ chơi cùng.",
      "Mỗi lần làm là một bộ câu hỏi khác, đáp án cũng được xáo trộn.",
    ],
  },
  // --- Party ---
  {
    slug: "ai-la-gian-diep",
    title: "Ai là gián điệp?",
    type: "party",
    tagline: "Mọi người cùng một từ khoá — chỉ gián điệp là khác.",
    description:
      "Mỗi người nhận một từ khoá bí mật, riêng gián điệp nhận từ khác. Lần lượt mô tả, tranh luận và bỏ phiếu tìm ra kẻ mạo danh.",
    audience: ["group", "office", "student"],
    status: "live",
    icon: "spy",
    cover: ["#0f172a", "#16b364"],
    thumbnail: "/thumbnails/ai-la-gian-diep.webp",
    duration: "10 phút",
    players: "3–12 người",
    howTo: [
      "Một người tạo phòng, mọi người vào bằng mã phòng hoặc quét QR.",
      "Mỗi người xem từ khóa bí mật trên điện thoại của mình.",
      "Lần lượt mô tả từ khóa bằng một câu, ngồi cùng nhau hoặc qua cuộc gọi video.",
      "Bỏ phiếu trên điện thoại để loại người đáng ngờ nhất.",
      "Dân thắng khi loại hết gián điệp; gián điệp thắng khi còn bằng số dân.",
    ],
  },
  {
    slug: "ve-doan-chu",
    title: "Vẽ & đoán",
    type: "party",
    tagline: "Một người vẽ, cả phòng thi nhau đoán.",
    description:
      "Đến lượt bạn cầm bút: vẽ từ khoá thật nhanh để cả phòng đoán. Đoán đúng càng sớm càng nhiều điểm.",
    audience: ["group", "student", "gamer"],
    status: "live",
    icon: "brush",
    cover: ["#16b364", "#0ea5e9"],
    thumbnail: "/thumbnails/ve-doan-chu.webp",
    duration: "15 phút",
    players: "2–12 người",
    howTo: [
      "Một người tạo phòng, mọi người vào bằng mã phòng hoặc quét QR.",
      "Đến lượt mình thì chọn 1 trong 3 từ và vẽ trên màn hình.",
      "Những người khác gõ đáp án, không cần gõ dấu.",
      "Đoán càng sớm càng nhiều điểm, người vẽ được điểm cho mỗi người đoán đúng.",
      "Gợi ý chữ cái sẽ hiện dần khi thời gian trôi qua.",
    ],
  },
  {
    slug: "do-vui-team-building",
    title: "Đố vui team building",
    type: "party",
    tagline: "Quiz realtime cho cả phòng, bảng xếp hạng trực tiếp.",
    description:
      "Chiếu câu hỏi lên màn hình lớn, mọi người trả lời bằng điện thoại. Bảng xếp hạng cập nhật sau mỗi câu — hoàn hảo cho buổi họp đầu tuần.",
    audience: ["group", "office"],
    status: "live",
    icon: "trophy",
    cover: ["#6b3cf5", "#1a9fe8"],
    thumbnail: "/thumbnails/do-vui-team-building.webp",
    duration: "10–20 phút",
    players: "2–50 người",
    howTo: [
      "Chủ phòng mở game trên máy chiếu hoặc TV và tạo phòng.",
      "Mọi người quét QR để vào bằng điện thoại, đến muộn vẫn vào được.",
      "Mỗi câu chọn 1 trong 4 đáp án trước khi hết giờ.",
      "Đúng càng nhanh càng nhiều điểm, đúng liên tiếp được thưởng thêm.",
      "Bảng xếp hạng cập nhật sau mỗi câu, cuối game có bảng vàng.",
    ],
  },
  // --- Added in the second batch ---
  {
    slug: "doan-chu",
    title: "Đoán chữ hằng ngày",
    type: "arcade",
    tagline: "Đoán một từ tiếng Việt 5 chữ cái trong 6 lượt. Mỗi ngày một từ mới.",
    description:
      "Mỗi ngày cả nước cùng đoán một từ. Gõ không dấu, ô xanh là đúng chữ đúng chỗ, ô vàng là có chữ đó nhưng sai chỗ. Đoán xong khoe lưới ô màu mà không lộ đáp án, rồi luyện thêm ở chế độ tự do.",
    audience: ["office", "student", "gamer"],
    status: "live",
    icon: "letters",
    cover: ["#16b364", "#0ea5e9"],
    thumbnail: "/thumbnails/doan-chu.webp",
    duration: "3–5 phút",
    players: "1 người",
    howTo: [
      "Gõ một từ tiếng Việt có 5 chữ cái, không cần dấu (“nguoi” là “người”, “duong” là “đường”).",
      "Ô xanh: chữ đúng và đúng vị trí. Ô vàng: có chữ đó nhưng sai vị trí. Ô xám: không có.",
      "Bạn có 6 lượt đoán. Mỗi ngày một từ mới cho tất cả mọi người, lúc 0 giờ.",
      "Thắng liên tiếp để giữ chuỗi ngày. Muốn chơi thêm thì chọn “Luyện tập”.",
    ],
  },
  {
    slug: "noi-tu",
    title: "Nối từ",
    type: "arcade",
    tagline: "Đấu trí với máy: nối tiếng cuối thành từ mới, “con mèo” → “mèo mướp”.",
    description:
      "Trò nối từ quen thuộc, giờ chơi với máy. Máy nói một từ, bạn nối tiếp bằng từ bắt đầu bằng tiếng cuối của nó. Thời gian mỗi lượt ngắn dần, làm máy bí từ để ăn điểm thưởng.",
    audience: ["student", "office"],
    status: "live",
    icon: "link",
    cover: ["#1a9fe8", "#6b3cf5"],
    thumbnail: "/thumbnails/noi-tu.webp",
    duration: "2–5 phút",
    players: "1 người",
    howTo: [
      "Máy đưa ra một từ hai tiếng, ví dụ “con mèo”.",
      "Tiếng đầu của từ tiếp theo đã có sẵn (“mèo”), bạn chỉ gõ tiếng thứ hai, có dấu (“mướp”).",
      "Mỗi từ chỉ được dùng một lần. Từ chưa có trong từ điển thì gõ lại, không bị trừ điểm.",
      "Trả lời nhanh được thưởng điểm, làm máy bí từ được +3. Hết giờ hoặc bỏ qua mất 1 tim.",
    ],
  },
  {
    slug: "phan-xa",
    title: "Phản xạ 0,2 giây",
    type: "arcade",
    tagline: "Màn hình chuyển xanh là chạm. Đo thời gian phản xạ bằng mili-giây.",
    description:
      "Bài kiểm tra phản xạ đơn giản mà gây nghiện: chờ màu đỏ chuyển sang xanh rồi chạm thật nhanh. Làm 5 lần để lấy trung bình, chạm sớm phải làm lại. Bạn nhanh hơn số đông không?",
    audience: ["gamer", "office", "student"],
    status: "live",
    icon: "zap",
    cover: ["#16b364", "#e5484d"],
    thumbnail: "/thumbnails/phan-xa.webp",
    duration: "1 phút",
    players: "1 người",
    howTo: [
      "Màn hình đỏ: chờ, đừng chạm. Chạm sớm thì lần đó phải làm lại.",
      "Màn hình chuyển xanh: chạm (hoặc bấm Space) nhanh nhất có thể.",
      "Làm 5 lần, kết quả là thời gian trung bình tính bằng mili-giây.",
      "Kết quả phụ thuộc cả màn hình và thiết bị, nên so với chính mình trên cùng một máy.",
    ],
  },
  {
    slug: "lat-the",
    title: "Nhớ thẻ bài",
    type: "arcade",
    tagline: "Lật thẻ, nhớ hình, tìm đủ cặp qua 4 cấp độ. Rèn trí nhớ trong 3 phút.",
    description:
      "Trò chơi trí nhớ lật hình chủ đề Việt Nam: phở, bánh mì, đèn lồng, trâu… Lật hai thẻ mỗi lượt, giống nhau thì giữ lại. Bàn chơi to dần từ 12 lên 24 thẻ, càng ít lượt và càng nhanh càng giỏi.",
    audience: ["student", "office"],
    status: "live",
    icon: "brain",
    cover: ["#6b3cf5", "#ec4899"],
    thumbnail: "/thumbnails/lat-the.webp",
    duration: "2–4 phút",
    players: "1 người",
    howTo: [
      "Chạm để lật 2 thẻ. Hai hình giống nhau thì giữ lại, khác nhau thì úp xuống.",
      "Tìm hết các cặp để qua cấp. Có 4 cấp, từ 12 thẻ đến 24 thẻ.",
      "Đồng hồ chạy suốt game (dừng khi nghỉ giữa các cấp). Điểm là tổng thời gian.",
      "Mỗi ván các hình và vị trí đều được xáo mới.",
    ],
  },
  {
    slug: "thang-may",
    title: "Thang máy giờ cao điểm",
    type: "arcade",
    tagline: "8 giờ sáng, cả tòa nhà đổ về sảnh. Đưa mọi người lên đúng tầng trước 9 giờ!",
    description:
      "Game điều phối thang máy chủ đề văn phòng: chọn ai lên chuyến này, gom người cùng tầng để thang đi nhanh hơn, và đừng để ai chờ lâu đến mức bỏ đi thang bộ. Đơn giản lúc đầu, căng thẳng khi gần 9 giờ.",
    audience: ["office", "gamer"],
    status: "live",
    icon: "building",
    cover: ["#ff6a3d", "#6b3cf5"],
    thumbnail: "/thumbnails/thang-may.webp",
    duration: "1–2 phút",
    players: "1 người",
    howTo: [
      "Chạm vào nhân viên ở sảnh để chọn người lên thang (tối đa 6 người), rồi bấm “Đi thôi!”.",
      "Thang đi càng cao và dừng càng nhiều tầng thì càng lâu mới quay lại.",
      "Gom 3 người trở lên chỉ đi 1–2 tầng là “chuyến đẹp”, được điểm thưởng.",
      "Ai chờ quá lâu sẽ bỏ đi thang bộ, mất 1 tim. Chơi đến 9:00 hoặc hết tim.",
    ],
  },
  {
    slug: "ban-hop-nghe-gi",
    title: "Bạn hợp nghề gì?",
    type: "quiz",
    tagline: "12 tình huống để biết nhóm nghề hợp với bạn, kèm gợi ý ngành học.",
    description:
      "Sáng tạo, kỹ thuật, phân tích, chăm sóc, kinh doanh hay tổ chức? Trả lời 12 tình huống quen thuộc ở trường, ở chỗ làm thêm và lúc rảnh để biết nhóm nghề hợp với mình nhất, kèm gợi ý ngành học và kỹ năng nên thử.",
    audience: ["student", "office"],
    status: "live",
    icon: "compass",
    cover: ["#0ea5e9", "#16b364"],
    thumbnail: "/thumbnails/ban-hop-nghe-gi.webp",
    duration: "3 phút",
    players: "1 người",
    howTo: [
      "Trả lời 12 tình huống, chọn điều bạn thật sự sẽ làm.",
      "Không có đáp án đúng sai, mỗi lựa chọn nghiêng về một nhóm nghề.",
      "Bấm nút ← để sửa câu trước nếu đổi ý.",
      "Nhận nhóm nghề hợp nhất kèm tỉ lệ từng nhóm, điểm mạnh và gợi ý ngành học.",
      "Đây là trắc nghiệm tham khảo cho vui, không thay thế tư vấn hướng nghiệp chuyên môn.",
    ],
  },
  {
    slug: "ban-la-mon-an-viet-nao",
    title: "Bạn là món ăn Việt nào?",
    type: "quiz",
    tagline: "Phở ấm áp, bánh mì năng động hay trà sữa vui vẻ? 10 câu là biết.",
    description:
      "Bài test tính cách vui nhộn: mỗi kiểu người là một món ăn Việt quen thuộc. Trả lời 10 câu hỏi về thói quen và cách bạn đối xử với mọi người, rồi khoe món ăn của mình với bạn bè.",
    audience: ["office", "student", "gamer"],
    status: "live",
    icon: "bowl",
    cover: ["#ff8a3d", "#e5484d"],
    thumbnail: "/thumbnails/ban-la-mon-an-viet-nao.webp",
    duration: "2 phút",
    players: "1 người",
    howTo: [
      "Trả lời 10 câu hỏi về thói quen và tính cách.",
      "Không có đáp án đúng sai, cứ chọn điều giống bạn nhất.",
      "Bấm nút ← để sửa câu trước nếu đổi ý.",
      "Nhận món ăn của bạn, tỉ lệ từng món và món “hợp cạ” nhất.",
      "Mỗi lần làm là một bộ câu hỏi khác, đáp án cũng được xáo trộn.",
    ],
  },
  {
    slug: "kien-thuc-viet-nam",
    title: "Kiểm tra kiến thức Việt Nam",
    type: "quiz",
    tagline: "15 câu về lịch sử, địa lý, văn hóa, đời sống. Bạn được mấy điểm?",
    description:
      "Bài trắc nghiệm có đáp án đúng sai về Việt Nam: từ Ngô Quyền, Truyện Kiều đến các dòng sông và lễ hội. 15 câu chia đều 4 chủ đề, mỗi câu 20 giây, chấm theo thang điểm 10 và có giải thích sau mỗi câu.",
    audience: ["student", "office"],
    status: "live",
    icon: "flag",
    cover: ["#da251d", "#f5a400"],
    thumbnail: "/thumbnails/kien-thuc-viet-nam.webp",
    duration: "5 phút",
    players: "1 người",
    howTo: [
      "15 câu, chia đều lịch sử, địa lý, văn hóa và đời sống.",
      "Mỗi câu 20 giây, chọn 1 trong 4 đáp án.",
      "Sau mỗi câu có đáp án đúng và một dòng giải thích.",
      "Chấm theo thang điểm 10, xem lại các câu chưa đúng ở cuối bài.",
      "Mỗi lần làm là bộ câu hỏi khác, câu đã gặp được để sau.",
    ],
  },
  {
    slug: "ma-soi",
    title: "Ma sói",
    type: "party",
    tagline: "Máy làm quản trò: sói, tiên tri, bảo vệ và dân làng trên điện thoại.",
    description:
      "Ma sói online cho 5–16 người, không cần bài hay quản trò. Mỗi người nhận vai bí mật trên điện thoại; ban đêm sói chọn nạn nhân, tiên tri soi, bảo vệ che chở; ban ngày cả nhóm thảo luận và bỏ phiếu treo cổ.",
    audience: ["group", "student", "gamer"],
    status: "live",
    icon: "moon",
    cover: ["#3b1d6e", "#e5484d"],
    thumbnail: "/thumbnails/ma-soi.webp",
    duration: "15–30 phút",
    players: "5–16 người",
    howTo: [
      "Một người tạo phòng, mọi người vào bằng mã phòng hoặc quét QR.",
      "Mỗi người xem vai bí mật: Ma sói, Tiên tri, Bảo vệ hoặc Dân làng.",
      "Ban đêm: sói chọn nạn nhân, Tiên tri soi một người, Bảo vệ che chở một người, tất cả trên điện thoại.",
      "Ban ngày: công bố người chết, thảo luận theo giờ rồi bỏ phiếu treo cổ.",
      "Dân thắng khi diệt hết sói; sói thắng khi số sói bằng số người còn lại.",
    ],
  },
  {
    slug: "ai-hieu-ai",
    title: "Ai hiểu ai nhất?",
    type: "party",
    tagline: "Một người lên ghế nóng, cả nhóm đoán câu trả lời. Ai hiểu nhau nhất?",
    description:
      "Game chơi nhóm cho hội bạn, đồng nghiệp và buổi team building. Mỗi lượt một người bí mật chọn câu trả lời đúng với mình, những người khác đoán xem người đó chọn gì. Đoán trúng nhiều nhất là người hiểu cả nhóm nhất.",
    audience: ["group", "office"],
    status: "live",
    icon: "hearts",
    cover: ["#ec4899", "#8b5cf6"],
    thumbnail: "/thumbnails/ai-hieu-ai.webp",
    duration: "10–15 phút",
    players: "2–20 người",
    howTo: [
      "Một người tạo phòng, mọi người vào bằng mã phòng hoặc quét QR, đến muộn vẫn vào được.",
      "Mỗi lượt một người lên ghế nóng và bí mật chọn câu trả lời đúng với mình.",
      "Những người còn lại đoán xem người đó chọn gì.",
      "Đoán đúng được 100 điểm; người ghế nóng được 50 điểm cho mỗi người đoán trúng.",
      "Ai cũng được lên ghế nóng. Cuối game có bảng xếp hạng.",
    ],
  },
];

export const TYPE_META: Record<
  GameType,
  { label: string; anchor: string; heading: string; blurb: string; dot: string; soft: string; text: string }
> = {
  arcade: {
    label: "Giải lao",
    anchor: "giai-lao",
    heading: "Mini-game giải lao",
    blurb: "Chơi 1–3 phút, không cần cài đặt, mượt trên điện thoại.",
    dot: "bg-arcade",
    soft: "bg-arcade-soft",
    text: "text-arcade",
  },
  quiz: {
    label: "Test vui",
    anchor: "test-vui",
    heading: "Trắc nghiệm & test vui",
    blurb: "Hiểu mình hơn một chút — và có ngay kết quả để khoe.",
    dot: "bg-quiz",
    soft: "bg-quiz-soft",
    text: "text-quiz",
  },
  party: {
    label: "Chơi nhóm",
    anchor: "choi-nhom",
    heading: "Party game chơi nhóm",
    blurb: "Tạo phòng, gửi mã, cả nhóm cùng chơi trên điện thoại.",
    dot: "bg-party",
    soft: "bg-party-soft",
    text: "text-party",
  },
};

export const AUDIENCE_LABEL: Record<Audience, string> = {
  office: "Dân văn phòng",
  student: "Học sinh",
  gamer: "Gamer",
  group: "Nhóm & team",
};

export const GAME_TYPES: GameType[] = ["arcade", "quiz", "party"];
export const AUDIENCES: Audience[] = ["office", "student", "gamer", "group"];

export function getGame(slug: string) {
  return GAMES.find((g) => g.slug === slug);
}

/** og:image for sharing: JPEG twin of the WebP thumbnail (written by the capture script) */
export function shareImage(game: GameEntry) {
  return game.thumbnail?.replace(/\.webp$/, ".jpg");
}

export function relatedGames(game: GameEntry, limit = 3) {
  return GAMES.filter((g) => g.slug !== game.slug && g.type === game.type).slice(0, limit);
}
