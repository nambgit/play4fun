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
  | "trophy";

export type GameEntry = {
  slug: string;
  title: string;
  type: GameType;
  tagline: string;
  description: string;
  audience: Audience[];
  status: "live" | "soon";
  icon: GameIcon;
  /** Two-stop gradient for the generated cover art */
  cover: [string, string];
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
    tagline: "Chạy vô tận, né họp đột xuất, nhặt cà phê để tăng tốc.",
    description:
      "Một ngày làm việc biến thành đường chạy vô tận. Nhảy qua cuộc họp bất ngờ, cúi né tin nhắn “em ơi gấp”, gom cà phê để kích hoạt chế độ tăng tốc.",
    audience: ["office", "gamer"],
    status: "soon",
    icon: "run",
    cover: ["#ff6a3d", "#ffb547"],
    duration: "2 phút",
    players: "1 người",
  },
  {
    slug: "bai-kiem-tra-15-phut",
    title: "Kiểm tra 15 phút",
    type: "arcade",
    tagline: "Giải nhanh phép tính trước khi chuông reo.",
    description:
      "Những phép tính nhẩm xuất hiện ngày càng nhanh. Trả lời đúng để kéo dài thời gian, sai là mất tim. Bạn trụ được đến câu thứ mấy?",
    audience: ["student"],
    status: "soon",
    icon: "calculator",
    cover: ["#0ea5e9", "#22d3a5"],
    duration: "1 phút",
    players: "1 người",
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
    tagline: "Đo tốc độ gõ tiếng Việt có dấu — Telex hay VNI đều được.",
    description:
      "Gõ đúng và nhanh các câu tiếng Việt có dấu. Xem tốc độ WPM, độ chính xác và so tài với đồng nghiệp, bạn cùng lớp.",
    audience: ["office", "student", "gamer"],
    status: "soon",
    icon: "keyboard",
    cover: ["#111827", "#16b364"],
    duration: "1 phút",
    players: "1 người",
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
    status: "soon",
    icon: "briefcase",
    cover: ["#1a9fe8", "#6b3cf5"],
    duration: "3 phút",
    players: "1 người",
  },
  {
    slug: "ban-hoc-kieu-gi",
    title: "Bạn học kiểu gì?",
    type: "quiz",
    tagline: "Cú đêm, chiến thần nước rút hay mọt sách chính hiệu?",
    description:
      "Khám phá phong cách học của bạn qua những tình huống quen thuộc mùa thi — và nhận vài mẹo học hợp với chính mình.",
    audience: ["student"],
    status: "soon",
    icon: "book",
    cover: ["#f59e0b", "#ef4444"],
    duration: "3 phút",
    players: "1 người",
  },
  {
    slug: "gamer-he-nao",
    title: "Bạn là gamer hệ nào?",
    type: "quiz",
    tagline: "Tryhard, chill hay chuyên đi gánh team?",
    description:
      "Từ cách chọn tướng đến phản ứng khi thua liên tiếp — 12 câu hỏi để biết bạn là kiểu gamer nào trong mắt đồng đội.",
    audience: ["gamer"],
    status: "soon",
    icon: "gamepad",
    cover: ["#ec4899", "#8b5cf6"],
    duration: "3 phút",
    players: "1 người",
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
    status: "soon",
    icon: "spy",
    cover: ["#0f172a", "#16b364"],
    duration: "10 phút",
    players: "3–12 người",
  },
  {
    slug: "ve-doan-chu",
    title: "Vẽ & đoán",
    type: "party",
    tagline: "Một người vẽ, cả phòng thi nhau đoán.",
    description:
      "Đến lượt bạn cầm bút: vẽ từ khoá thật nhanh để cả phòng đoán. Đoán đúng càng sớm càng nhiều điểm.",
    audience: ["group", "student", "gamer"],
    status: "soon",
    icon: "brush",
    cover: ["#16b364", "#0ea5e9"],
    duration: "15 phút",
    players: "2–12 người",
  },
  {
    slug: "do-vui-team-building",
    title: "Đố vui team building",
    type: "party",
    tagline: "Quiz realtime cho cả phòng, bảng xếp hạng trực tiếp.",
    description:
      "Chiếu câu hỏi lên màn hình lớn, mọi người trả lời bằng điện thoại. Bảng xếp hạng cập nhật sau mỗi câu — hoàn hảo cho buổi họp đầu tuần.",
    audience: ["group", "office"],
    status: "soon",
    icon: "trophy",
    cover: ["#6b3cf5", "#1a9fe8"],
    duration: "10–20 phút",
    players: "3–50 người",
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

export function relatedGames(game: GameEntry, limit = 3) {
  return GAMES.filter((g) => g.slug !== game.slug && g.type === game.type).slice(0, limit);
}
