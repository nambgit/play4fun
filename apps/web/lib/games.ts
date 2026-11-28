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
  | "hearts"
  | "vote"
  | "swords"
  | "grid";

export type GameEntry = {
  slug: string;
  title: string;
  type: GameType;
  tagline: string;
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
    audience: ["office", "student"],
    status: "live",
    icon: "inbox",
    cover: ["#7b4dff", "#ff6a9a"],
    thumbnail: "/thumbnails/inbox-zero.webp",
    duration: "1 phút",
    players: "1 người",
  },
  {
    slug: "deadline-dash",
    title: "Deadline Dash",
    type: "arcade",
    tagline: "Chạy trốn deadline: nhảy qua họp đột xuất, cúi né “em ơi gấp”.",
    audience: ["office", "student", "gamer"],
    status: "live",
    icon: "run",
    cover: ["#ff6a3d", "#ffb547"],
    thumbnail: "/thumbnails/deadline-dash.webp",
    duration: "1–3 phút",
    players: "1 người",
  },
  {
    slug: "bai-kiem-tra-15-phut",
    title: "Kiểm tra 15 phút",
    type: "arcade",
    tagline: "Giải nhanh phép tính trước khi chuông reo.",
    audience: ["student"],
    status: "live",
    icon: "calculator",
    cover: ["#0ea5e9", "#22d3a5"],
    thumbnail: "/thumbnails/bai-kiem-tra-15-phut.webp",
    duration: "1 phút",
    players: "1 người",
  },
  {
    slug: "pixel-dodge",
    title: "Pixel Dodge",
    type: "arcade",
    tagline: "Né đạn kiểu bullet-hell, càng sống lâu càng khó.",
    audience: ["gamer", "office", "student"],
    status: "live",
    icon: "crosshair",
    cover: ["#1e1b4b", "#7c3aed"],
    thumbnail: "/thumbnails/pixel-dodge.webp",
    duration: "1–3 phút",
    players: "1 người",
  },
  {
    slug: "go-phim-nhanh",
    title: "Gõ phím thần tốc",
    type: "arcade",
    tagline: "Đo tốc độ gõ tiếng Việt có dấu và tiếng Anh — mỗi ván một đoạn văn mới.",
    audience: ["office", "student", "gamer"],
    status: "live",
    icon: "keyboard",
    cover: ["#111827", "#16b364"],
    thumbnail: "/thumbnails/go-phim-nhanh.webp",
    duration: "1 phút",
    players: "1 người",
  },
  // --- Quiz ---
  {
    slug: "ban-la-kieu-dong-nghiep-nao",
    title: "Bạn là kiểu đồng nghiệp nào?",
    type: "quiz",
    tagline: "10 câu hỏi, 1 kết quả để khoe lên Facebook.",
    audience: ["office"],
    status: "live",
    icon: "briefcase",
    cover: ["#1a9fe8", "#6b3cf5"],
    thumbnail: "/thumbnails/ban-la-kieu-dong-nghiep-nao.webp",
    duration: "3 phút",
    players: "1 người",
  },
  {
    slug: "ban-hoc-kieu-gi",
    title: "Bạn học kiểu gì?",
    type: "quiz",
    tagline: "Cú đêm, chiến thần nước rút hay mọt sách chính hiệu?",
    audience: ["student"],
    status: "live",
    icon: "book",
    cover: ["#f59e0b", "#ef4444"],
    thumbnail: "/thumbnails/ban-hoc-kieu-gi.webp",
    duration: "3 phút",
    players: "1 người",
  },
  {
    slug: "gamer-he-nao",
    title: "Bạn là gamer hệ nào?",
    type: "quiz",
    tagline: "Tryhard, chill hay chuyên đi gánh team?",
    audience: ["gamer"],
    status: "live",
    icon: "gamepad",
    cover: ["#ec4899", "#8b5cf6"],
    thumbnail: "/thumbnails/gamer-he-nao.webp",
    duration: "3 phút",
    players: "1 người",
  },
  // --- Party ---
  {
    slug: "ai-la-gian-diep",
    title: "Ai là gián điệp?",
    type: "party",
    tagline: "Mọi người cùng một từ khoá — chỉ gián điệp là khác.",
    audience: ["group", "office", "student"],
    status: "live",
    icon: "spy",
    cover: ["#0f172a", "#16b364"],
    thumbnail: "/thumbnails/ai-la-gian-diep.webp",
    duration: "10 phút",
    players: "3–12 người",
  },
  {
    slug: "ve-doan-chu",
    title: "Vẽ & đoán",
    type: "party",
    tagline: "Một người vẽ, cả phòng thi nhau đoán.",
    audience: ["group", "student", "gamer"],
    status: "live",
    icon: "brush",
    cover: ["#16b364", "#0ea5e9"],
    thumbnail: "/thumbnails/ve-doan-chu.webp",
    duration: "15 phút",
    players: "2–12 người",
  },
  {
    slug: "do-vui-team-building",
    title: "Đố vui team building",
    type: "party",
    tagline: "Quiz realtime cho cả phòng, bảng xếp hạng trực tiếp.",
    audience: ["group", "office"],
    status: "live",
    icon: "trophy",
    cover: ["#6b3cf5", "#1a9fe8"],
    thumbnail: "/thumbnails/do-vui-team-building.webp",
    duration: "10–20 phút",
    players: "2–50 người",
  },
  // --- Added in the second batch ---
  {
    slug: "doan-chu",
    title: "Đoán chữ hằng ngày",
    type: "arcade",
    tagline: "Đoán một từ tiếng Việt 5 chữ cái trong 6 lượt. Mỗi ngày một từ mới.",
    audience: ["office", "student", "gamer"],
    status: "live",
    icon: "letters",
    cover: ["#16b364", "#0ea5e9"],
    thumbnail: "/thumbnails/doan-chu.webp",
    duration: "3–5 phút",
    players: "1 người",
  },
  {
    slug: "phan-xa",
    title: "Phản xạ 0,2 giây",
    type: "arcade",
    tagline: "Màn hình chuyển xanh là chạm. Đo thời gian phản xạ bằng mili-giây.",
    audience: ["gamer", "office", "student"],
    status: "live",
    icon: "zap",
    cover: ["#16b364", "#e5484d"],
    thumbnail: "/thumbnails/phan-xa.webp",
    duration: "1 phút",
    players: "1 người",
  },
  {
    slug: "lat-the",
    title: "Nhớ thẻ bài",
    type: "arcade",
    tagline: "Lật thẻ, nhớ hình, tìm đủ cặp qua 4 cấp độ. Rèn trí nhớ trong 3 phút.",
    audience: ["student", "office"],
    status: "live",
    icon: "brain",
    cover: ["#6b3cf5", "#ec4899"],
    thumbnail: "/thumbnails/lat-the.webp",
    duration: "2–4 phút",
    players: "1 người",
  },
  {
    slug: "thang-may",
    title: "Thang máy giờ cao điểm",
    type: "arcade",
    tagline: "8 giờ sáng, cả tòa nhà đổ về sảnh. Đưa mọi người lên đúng tầng trước 9 giờ!",
    audience: ["office", "gamer"],
    status: "live",
    icon: "building",
    cover: ["#ff6a3d", "#6b3cf5"],
    thumbnail: "/thumbnails/thang-may.webp",
    duration: "1–2 phút",
    players: "1 người",
  },
  {
    slug: "duong-len-ceo",
    title: "Đường lên CEO",
    type: "arcade",
    tagline: "Game clicker công sở: bấm làm việc, thuê nhân sự, xử lý tình huống và leo từ thực tập sinh lên CEO.",
    audience: ["office", "student", "gamer"],
    status: "live",
    icon: "briefcase",
    cover: ["#6b3cf5", "#1a9fe8"],
    thumbnail: "/thumbnails/duong-len-ceo.webp",
    duration: "Tùy thích",
    players: "1 người",
  },
  {
    slug: "ban-hop-nghe-gi",
    title: "Bạn hợp nghề gì?",
    type: "quiz",
    tagline: "12 tình huống để biết nhóm nghề hợp với bạn, kèm gợi ý ngành học.",
    audience: ["student", "office"],
    status: "live",
    icon: "compass",
    cover: ["#0ea5e9", "#16b364"],
    thumbnail: "/thumbnails/ban-hop-nghe-gi.webp",
    duration: "3 phút",
    players: "1 người",
  },
  {
    slug: "ban-la-mon-an-viet-nao",
    title: "Bạn là món ăn Việt nào?",
    type: "quiz",
    tagline: "Phở ấm áp, bánh mì năng động hay trà sữa vui vẻ? 10 câu là biết.",
    audience: ["office", "student", "gamer"],
    status: "live",
    icon: "bowl",
    cover: ["#ff8a3d", "#e5484d"],
    thumbnail: "/thumbnails/ban-la-mon-an-viet-nao.webp",
    duration: "2 phút",
    players: "1 người",
  },
  {
    slug: "kien-thuc-viet-nam",
    title: "Kiểm tra kiến thức Việt Nam",
    type: "quiz",
    tagline: "15 câu về lịch sử, địa lý, văn hóa, đời sống. Bạn được mấy điểm?",
    audience: ["student", "office"],
    status: "live",
    icon: "flag",
    cover: ["#da251d", "#f5a400"],
    thumbnail: "/thumbnails/kien-thuc-viet-nam.webp",
    duration: "5 phút",
    players: "1 người",
  },
  {
    slug: "ma-soi",
    title: "Ma sói",
    type: "party",
    tagline: "Máy làm quản trò: sói, tiên tri, bảo vệ và dân làng trên điện thoại.",
    audience: ["group", "student", "gamer"],
    status: "live",
    icon: "moon",
    cover: ["#3b1d6e", "#e5484d"],
    thumbnail: "/thumbnails/ma-soi.webp",
    duration: "15–30 phút",
    players: "5–16 người",
  },
  {
    slug: "ai-hieu-ai",
    title: "Ai hiểu ai nhất?",
    type: "party",
    tagline: "Một người lên ghế nóng, cả nhóm đoán câu trả lời. Ai hiểu nhau nhất?",
    audience: ["group", "office"],
    status: "live",
    icon: "hearts",
    cover: ["#ec4899", "#8b5cf6"],
    thumbnail: "/thumbnails/ai-hieu-ai.webp",
    duration: "10–15 phút",
    players: "2–20 người",
  },
  {
    slug: "ai-de-nhat",
    title: "Ai dễ… nhất?",
    type: "party",
    tagline: "Ai dễ ngủ gật trong họp nhất? Cả nhóm bình chọn ẩn danh, đoán trúng số đông để ăn điểm.",
    audience: ["group", "office"],
    status: "live",
    icon: "vote",
    cover: ["#f59e0b", "#e5484d"],
    thumbnail: "/thumbnails/ai-de-nhat.webp",
    duration: "10–15 phút",
    players: "3–20 người",
  },
  {
    slug: "noi-tu",
    title: "Nối từ",
    type: "party",
    tagline: "Nối từ tiếng Việt online: đấu 1-1 với người lạ, mở phòng cho nhóm tới 10 người hoặc đấu với máy. Làm đối thủ bí từ để thắng!",
    audience: ["group", "student", "office"],
    status: "live",
    icon: "link",
    cover: ["#1a9fe8", "#6b3cf5"],
    thumbnail: "/thumbnails/noi-tu.webp",
    duration: "3–8 phút",
    players: "2–10 người",
  },
  {
    slug: "co-caro",
    title: "Cờ caro",
    type: "party",
    tagline: "Cờ caro 2 người online: ghép ngẫu nhiên, mời bạn bằng link hoặc đấu với máy. 5 quân liền hàng là thắng!",
    audience: ["group", "student", "office"],
    status: "live",
    icon: "grid",
    cover: ["#e5484d", "#1a9fe8"],
    thumbnail: "/thumbnails/co-caro.webp",
    duration: "5–15 phút",
    players: "2 người",
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

/** Category landing page (/giai-lao, /test-vui, /choi-nhom) */
export const categoryHref = (t: GameType) => `/${TYPE_META[t].anchor}`;

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
