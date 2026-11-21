import type { Faq } from "./seo";

/**
 * Cẩm nang: helpful articles that answer what people search for and lead to a game.
 * Metadata lives here (used by the index, sitemap, game pages); the body of each article is a
 * component in content/articles/<slug>.tsx, registered in content/articles/index.ts.
 *
 * Writing rules: answer the question in the first paragraph, use real examples, no keyword
 * stuffing, every fact checkable. Link to the game where it genuinely helps.
 */
export type ArticleMeta = {
  slug: string;
  /** <title> and H1: the phrase people search for */
  title: string;
  description: string;
  /** Short label for cards */
  kicker: string;
  /** Games this article leads to (first one is the main call to action) */
  games: string[];
  published: string;
  updated: string;
  readMinutes: number;
  faq?: Faq[];
};

export const ARTICLES: ArticleMeta[] = [
  {
    slug: "luyen-go-phim-10-ngon",
    title: "Cách luyện gõ phím 10 ngón tiếng Việt cho người mới bắt đầu",
    description: "Luyện gõ 10 ngón từ con số 0: tư thế, vị trí ngón tay, cách gõ Telex có dấu, lộ trình 4 tuần và cách đo tiến bộ bằng WPM. Tập miễn phí trên trình duyệt.",
    kicker: "Gõ phím",
    games: ["go-phim-nhanh"],
    published: "2026-11-21",
    updated: "2026-11-21",
    readMinutes: 7,
    faq: [
      ["Luyện gõ 10 ngón mất bao lâu?", "Phần lớn người mới nhớ được vị trí phím sau 1 đến 2 tuần tập 15–20 phút mỗi ngày. Để gõ nhanh hơn cách gõ cũ thường mất khoảng 3 đến 6 tuần."],
      ["Nên gõ Telex hay VNI?", "Telex phổ biến hơn vì các phím bỏ dấu (s, f, r, x, j) nằm ngay trong vùng chữ cái, ngón tay không phải rời hàng phím cơ sở. VNI dùng hàng số, dễ nhớ hơn lúc đầu nhưng phải với tay xa hơn."],
    ],
  },
  {
    slug: "toc-do-go-phim",
    title: "Tốc độ gõ phím bao nhiêu WPM là nhanh? Cách đo và cải thiện",
    description: "WPM là gì, gõ phím tiếng Việt bao nhiêu WPM là nhanh, và 6 cách tăng tốc mà không giảm độ chính xác. Kèm bài kiểm tra tốc độ gõ miễn phí 60 giây.",
    kicker: "Gõ phím",
    games: ["go-phim-nhanh"],
    published: "2026-11-21",
    updated: "2026-11-21",
    readMinutes: 6,
  },
  {
    slug: "tro-choi-team-building-trong-phong-hop",
    title: "12 trò chơi team building trong phòng họp, không cần đạo cụ",
    description: "12 trò chơi team building trong phòng họp: khởi động 5 phút, trò chơi nhóm 15–30 phút, cách chơi cho team làm việc từ xa. Có game điện thoại miễn phí.",
    kicker: "Team building",
    games: ["do-vui-team-building", "ai-la-gian-diep", "ve-doan-chu"],
    published: "2026-11-21",
    updated: "2026-11-21",
    readMinutes: 8,
  },
  {
    slug: "cau-hoi-do-vui-team-building",
    title: "60 câu hỏi đố vui team building có đáp án",
    description: "60 câu hỏi đố vui có đáp án cho team building: kiến thức chung, Việt Nam, khoa học, công sở. Kèm cách tổ chức quiz cho cả phòng bằng điện thoại.",
    kicker: "Team building",
    games: ["do-vui-team-building"],
    published: "2026-11-21",
    updated: "2026-11-21",
    readMinutes: 9,
  },
  {
    slug: "luat-choi-ai-la-gian-diep",
    title: "Luật chơi Ai là gián điệp chi tiết và 60 cặp từ khóa hay",
    description: "Luật chơi Ai là gián điệp từ A đến Z, mẹo cho dân và gián điệp, cùng 60 cặp từ khóa theo chủ đề. Chơi online miễn phí trên điện thoại.",
    kicker: "Chơi nhóm",
    games: ["ai-la-gian-diep"],
    published: "2026-11-21",
    updated: "2026-11-21",
    readMinutes: 8,
    faq: [
      ["Gián điệp có biết mình là gián điệp không?", "Ở luật phổ biến (và chế độ mặc định trên Play4Fun), gián điệp nhận một từ gần giống và không biết mình là gián điệp. Ở chế độ “gián điệp trắng”, gián điệp không có từ nào nhưng biết vai của mình."],
      ["Bao nhiêu người thì nên có 2 gián điệp?", "Từ khoảng 7 người trở lên có thể để 2 gián điệp. Nhóm nhỏ hơn nên để 1 để dân còn cơ hội thắng."],
    ],
  },
  {
    slug: "tu-khoa-ve-doan-chu",
    title: "100 từ khóa vẽ đoán chữ hay, từ dễ đến khó",
    description: "100 từ khóa vẽ đoán chữ theo độ khó và chủ đề: đồ vật, con vật, món ăn, nghề nghiệp, công sở, thành ngữ. Kèm mẹo vẽ nhanh và cách chơi online.",
    kicker: "Chơi nhóm",
    games: ["ve-doan-chu"],
    published: "2026-11-21",
    updated: "2026-11-21",
    readMinutes: 6,
  },
  {
    slug: "meo-tinh-nham-nhanh",
    title: "10 mẹo tính nhẩm nhanh ai cũng học được",
    description: "10 mẹo tính nhẩm nhanh có ví dụ: nhân với 5, 9, 11, bình phương số tận cùng bằng 5, tính phần trăm. Luyện ngay với game tính nhẩm miễn phí.",
    kicker: "Tính nhẩm",
    games: ["bai-kiem-tra-15-phut"],
    published: "2026-11-21",
    updated: "2026-11-21",
    readMinutes: 6,
  },
  {
    slug: "giai-lao-van-phong",
    title: "Giải lao 5 phút ở văn phòng: làm gì để đầu óc tỉnh táo lại?",
    description: "Giải lao 5 phút ở văn phòng cho đúng: nghỉ mắt, vận động nhẹ, đổi hoạt động cho não và vài mini-game ngắn giúp xả stress mà không quá giờ nghỉ.",
    kicker: "Giải lao",
    games: ["inbox-zero", "deadline-dash", "pixel-dodge"],
    published: "2026-11-21",
    updated: "2026-11-21",
    readMinutes: 5,
  },
];

export const getArticle = (slug: string) => ARTICLES.find((a) => a.slug === slug);
export const articlesForGame = (gameSlug: string) => ARTICLES.filter((a) => a.games.includes(gameSlug));
export const formatDate = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;
