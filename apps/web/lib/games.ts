export type GameType = "arcade" | "quiz" | "party";

export type GameEntry = {
  slug: string;
  title: string;
  type: GameType;
  tagline: string;
  audience: string[];
  status: "live" | "soon";
};

/**
 * Danh mục game tĩnh cho giai đoạn đầu. Khi có trang admin thì chuyển sang bảng `games`.
 */
export const GAMES: GameEntry[] = [
  // --- Arcade: chơi 1–3 phút ---
  { slug: "deadline-dash", title: "Deadline Dash", type: "arcade", tagline: "Chạy vô tận, né họp đột xuất, nhặt cà phê tăng tốc.", audience: ["Văn phòng"], status: "soon" },
  { slug: "inbox-zero", title: "Inbox Zero", type: "arcade", tagline: "Vuốt trái/phải phân loại email trong 60 giây.", audience: ["Văn phòng"], status: "soon" },
  { slug: "bai-kiem-tra-15-phut", title: "Kiểm tra 15 phút", type: "arcade", tagline: "Giải nhanh phép tính trước khi chuông reo.", audience: ["Học sinh"], status: "soon" },
  { slug: "pixel-dodge", title: "Pixel Dodge", type: "arcade", tagline: "Né đạn kiểu bullet-hell, càng sống lâu càng khó.", audience: ["Gamer"], status: "soon" },
  { slug: "go-phim-nhanh", title: "Gõ phím thần tốc", type: "arcade", tagline: "Đo tốc độ gõ tiếng Việt có dấu.", audience: ["Tất cả"], status: "soon" },
  // --- Quiz: test vui, dễ share ---
  { slug: "ban-la-kieu-dong-nghiep-nao", title: "Bạn là kiểu đồng nghiệp nào?", type: "quiz", tagline: "10 câu hỏi, 1 kết quả để khoe lên Facebook.", audience: ["Văn phòng"], status: "soon" },
  { slug: "ban-hoc-kieu-gi", title: "Bạn học kiểu gì?", type: "quiz", tagline: "Cú đêm, chiến thần nước rút hay mọt sách?", audience: ["Học sinh"], status: "soon" },
  { slug: "gamer-hay-gamer-thu", title: "Bạn là gamer hệ nào?", type: "quiz", tagline: "Tryhard, chill hay chuyên đi gánh team?", audience: ["Gamer"], status: "soon" },
  // --- Party: chơi nhóm bằng mã phòng ---
  { slug: "ai-la-gian-diep", title: "Ai là gián điệp?", type: "party", tagline: "Mọi người cùng một từ, chỉ gián điệp là khác.", audience: ["Nhóm bạn", "Team"], status: "soon" },
  { slug: "ve-doan-chu", title: "Vẽ & đoán", type: "party", tagline: "Một người vẽ, cả phòng thi nhau đoán.", audience: ["Nhóm bạn", "Lớp học"], status: "soon" },
  { slug: "do-vui-cong-ty", title: "Đố vui team building", type: "party", tagline: "Quiz realtime cho cả phòng, có bảng xếp hạng trực tiếp.", audience: ["Team"], status: "soon" },
];

export const TYPE_META: Record<GameType, { label: string; color: string; blurb: string }> = {
  arcade: { label: "Giải lao", color: "bg-arcade", blurb: "Mini-game 1–3 phút, chơi ngay trên điện thoại." },
  quiz: { label: "Test vui", color: "bg-quiz", blurb: "Trắc nghiệm tính cách & đố vui, kết quả để share." },
  party: { label: "Chơi nhóm", color: "bg-party", blurb: "Tạo phòng, gửi mã, cả nhóm cùng chơi realtime." },
};

export function getGame(slug: string) {
  return GAMES.find((g) => g.slug === slug);
}
