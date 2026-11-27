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
    slug: "cau-hoi-kien-thuc-viet-nam",
    title: "40 câu hỏi kiến thức Việt Nam có đáp án: lịch sử, địa lý, văn hóa",
    description: "40 câu hỏi trắc nghiệm kiến thức Việt Nam có đáp án và giải thích: lịch sử, địa lý, văn hóa, đời sống. Dùng cho lớp học, team building, kèm bài thi online 15 câu.",
    kicker: "Đố vui",
    games: ["kien-thuc-viet-nam", "do-vui-team-building"],
    published: "2026-11-27",
    updated: "2026-11-27",
    readMinutes: 8,
    faq: [
      ["Có bài trắc nghiệm kiến thức Việt Nam online không?", "Có. Mỗi lượt 15 câu chia đều lịch sử, địa lý, văn hóa và đời sống, mỗi câu 20 giây, chấm thang điểm 10 kèm giải thích, lấy ngẫu nhiên từ hơn 160 câu hỏi. Miễn phí, không cần đăng ký."],
      ["Dùng bộ câu hỏi này cho team building thế nào?", "Chia đội, đọc câu hỏi và cho mỗi đội 20–30 giây trả lời, đi từ câu đời sống dễ đến câu lịch sử khó hơn. Nếu muốn cả phòng trả lời bằng điện thoại và có bảng xếp hạng, dùng game Đố vui team building."],
    ],
  },
  {
    slug: "thoi-gian-phan-xa",
    title: "Thời gian phản xạ trung bình bao nhiêu ms? Cách đo và cải thiện",
    description: "Thời gian phản xạ trung bình của người trưởng thành, bảng đánh giá kết quả test phản xạ, các yếu tố làm phản xạ chậm đi và 5 cách cải thiện. Kèm bài test phản xạ online miễn phí.",
    kicker: "Phản xạ",
    games: ["phan-xa", "pixel-dodge"],
    published: "2026-11-27",
    updated: "2026-11-27",
    readMinutes: 5,
    faq: [
      ["Thời gian phản xạ trung bình là bao nhiêu?", "Với phản xạ thị giác đơn giản, phần lớn người trưởng thành nằm trong khoảng 200–300 ms. Khi đo trên điện thoại hay máy tính, khoảng 250–300 ms là mức phổ biến vì có thêm độ trễ của màn hình và thiết bị."],
      ["Làm sao để phản xạ nhanh hơn?", "Ngủ đủ giấc là cách hiệu quả nhất, sau đó là luyện tập đều đặn với bài test phản xạ hoặc game cần phản ứng nhanh, chơi thể thao như cầu lông, bóng bàn, và hạn chế phân tâm khi làm việc cần tập trung."],
    ],
  },
  {
    slug: "cach-on-thi-hieu-qua",
    title: "Cách ôn thi hiệu quả: 7 phương pháp và lịch ôn 4 tuần",
    description: "7 phương pháp ôn thi hiệu quả: tự kiểm tra, ôn ngắt quãng, Pomodoro, giảng lại, làm đề thử. Kèm lịch ôn thi 4 tuần và mẹo cho từng kiểu người học.",
    kicker: "Học tập",
    games: ["ban-hoc-kieu-gi", "bai-kiem-tra-15-phut"],
    published: "2026-11-27",
    updated: "2026-11-27",
    readMinutes: 7,
    faq: [
      ["Phương pháp ôn thi nào hiệu quả nhất?", "Tự kiểm tra (gấp sách lại và cố nhớ, hoặc làm đề) kết hợp ôn lặp lại ngắt quãng theo thời gian hiệu quả hơn nhiều so với đọc đi đọc lại hay gạch chân."],
      ["Có nên thức khuya ôn bài đêm trước khi thi?", "Không nên. Giấc ngủ giúp não lưu lại những gì đã học; thức trắng đêm thường khiến bạn mệt, kém tập trung và quên chính những phần vừa học. Hai ngày cuối nên học nhẹ và ngủ đủ."],
    ],
  },
  {
    slug: "cach-nhan-biet-email-lua-dao",
    title: "Cách nhận biết email lừa đảo: 8 dấu hiệu dân văn phòng cần nhớ",
    description: "8 dấu hiệu nhận biết email lừa đảo (phishing) kèm ví dụ: tên miền giả, link độc, đòi OTP, file đính kèm lạ. Bảng kiểm tra nhanh và việc cần làm nếu lỡ bấm vào.",
    kicker: "Văn phòng",
    games: ["inbox-zero"],
    published: "2026-11-27",
    updated: "2026-11-27",
    readMinutes: 6,
    faq: [
      ["Làm sao biết email có phải lừa đảo không?", "Kiểm tra ba thứ: địa chỉ người gửi có đúng tên miền không (kẻ gian hay đổi một ký tự), link thật sự dẫn tới đâu khi rê chuột lên, và email có hối thúc, đe dọa hay đòi mật khẩu, mã OTP không."],
      ["Lỡ bấm vào link lừa đảo thì phải làm gì?", "Đổi ngay mật khẩu tài khoản vừa nhập và các tài khoản dùng chung mật khẩu, bật xác thực hai lớp, báo cho bộ phận IT. Nếu đã nhập thông tin thẻ hoặc OTP, gọi ngay tổng đài ngân hàng để khóa thẻ."],
    ],
  },
  {
    slug: "cau-hoi-de-hieu-nhau",
    title: "50 câu hỏi để hiểu nhau hơn cho bạn bè, đồng nghiệp, cặp đôi",
    description: "50 câu hỏi để hiểu nhau hơn chia theo mối quan hệ: làm quen, bạn thân, đồng nghiệp, cặp đôi và câu hỏi chọn một. Kèm cách biến thành trò chơi đoán ý cho cả nhóm.",
    kicker: "Chơi nhóm",
    games: ["ai-hieu-ai"],
    published: "2026-11-27",
    updated: "2026-11-27",
    readMinutes: 6,
    faq: [
      ["Hỏi gì để hiểu một người hơn?", "Bắt đầu bằng câu hỏi nhẹ về sở thích (món ăn, nơi muốn đi), rồi hỏi thêm “vì sao” sau mỗi câu trả lời. Câu chuyện thật thường bắt đầu từ câu hỏi thứ hai, không phải câu đầu tiên."],
      ["Có trò chơi nào dùng câu hỏi để hiểu nhau không?", "Có, trò “Ai hiểu ai nhất?”: một người bí mật chọn câu trả lời của mình, những người khác đoán, ai đoán trúng được điểm. Có thể chơi trên điện thoại với 2–20 người."],
    ],
  },
  {
    slug: "luat-choi-noi-tu",
    title: "Luật chơi nối từ tiếng Việt và mẹo làm đối thủ bí từ",
    description: "Luật chơi nối từ tiếng Việt đầy đủ, 5 biến thể phổ biến, mẹo chọn từ khó nối và bảng từ cứu cánh cho tiếng hay gặp. Chơi nối từ online với máy miễn phí.",
    kicker: "Trò chơi chữ",
    games: ["noi-tu", "doan-chu"],
    published: "2026-11-27",
    updated: "2026-11-27",
    readMinutes: 5,
    faq: [
      ["Luật chơi nối từ là gì?", "Mỗi người nói một từ hai tiếng có nghĩa, từ sau phải bắt đầu bằng tiếng cuối của từ trước và giữ nguyên dấu, ví dụ “học sinh” → “sinh viên”. Mỗi từ chỉ dùng một lần, ai bí từ hoặc hết giờ thì thua lượt."],
      ["Nối từ có được dùng từ láy không?", "Tùy nhóm thống nhất trước. Nhiều nhóm cấm từ láy vì các từ như “bâng khuâng” gần như không ai nối tiếp được."],
    ],
  },
  {
    slug: "tro-choi-tat-nien-cong-ty",
    title: "15 trò chơi tất niên công ty vui, dễ tổ chức cho mọi quy mô",
    description: "15 trò chơi tất niên công ty: khởi động, trò cả hội trường chơi trên điện thoại, thi đấu giữa các bàn, trò trao quà. Kèm kịch bản mẫu 2 tiếng và mẹo tổ chức.",
    kicker: "Team building",
    games: ["do-vui-team-building", "ai-hieu-ai", "ve-doan-chu", "ai-la-gian-diep", "ma-soi"],
    published: "2026-11-22",
    updated: "2026-11-22",
    readMinutes: 8,
    faq: [
      ["Tiệc tất niên đông người nên chơi trò gì?", "Trò mà cả hội trường chơi cùng lúc, không phải chờ lượt: đố vui trả lời bằng điện thoại có bảng xếp hạng là lựa chọn dễ nhất, sau đó là trò thi đấu giữa các bàn như vẽ đoán chữ tiếp sức."],
      ["Mỗi trò chơi tất niên nên kéo dài bao lâu?", "Khoảng 10–15 phút mỗi trò. Nên dừng khi không khí đang vui, cả buổi tiệc 2 tiếng thường chỉ cần 4–5 trò."],
    ],
  },
  {
    slug: "tro-choi-online-qua-zoom",
    title: "10 trò chơi online với bạn bè qua Zoom, Google Meet, Zalo",
    description: "10 trò chơi online khi mỗi người một nơi: Ai là gián điệp, Ma sói, vẽ đoán chữ, đố vui trên điện thoại và các trò chỉ cần cuộc gọi video. Miễn phí, không cần cài.",
    kicker: "Chơi nhóm",
    games: ["ai-la-gian-diep", "ma-soi", "ve-doan-chu", "do-vui-team-building", "ai-hieu-ai"],
    published: "2026-11-22",
    updated: "2026-11-22",
    readMinutes: 6,
    faq: [
      ["Chơi game nhóm online có cần tải ứng dụng không?", "Không. Mọi người gọi nhau bằng ứng dụng quen thuộc (Zoom, Google Meet, Messenger, Zalo) và mở game bằng trình duyệt trên điện thoại qua mã phòng hoặc link, không cần cài đặt hay đăng ký."],
      ["Trò chơi online nào hợp cho nhóm 5–8 người?", "Ai là gián điệp và Ma sói là hai trò hợp nhất: chỉ cần nói chuyện qua cuộc gọi, còn từ khóa, vai và phiếu bầu nằm trên điện thoại của từng người."],
    ],
  },
  {
    slug: "luat-choi-ma-soi",
    title: "Luật chơi Ma sói chi tiết cho người mới: các vai, cách chơi, mẹo",
    description: "Luật chơi Ma sói từ A đến Z: vai Sói, Tiên tri, Bảo vệ, Dân làng, diễn biến ngày đêm, chia vai theo số người và mẹo cho từng phe. Chơi online miễn phí.",
    kicker: "Chơi nhóm",
    games: ["ma-soi", "ai-la-gian-diep"],
    published: "2026-11-21",
    updated: "2026-11-21",
    readMinutes: 7,
    faq: [
      ["Chơi Ma sói cần ít nhất bao nhiêu người?", "Từ 5 người trở lên. Dưới 5 người, phe sói hoặc phe dân sẽ quá dễ thắng. Nhóm nhỏ hơn có thể chơi Ai là gián điệp (từ 3 người)."],
      ["Người chết có được nói không?", "Theo luật phổ biến, người chết không được tiết lộ vai hay gợi ý gì thêm, chỉ được ngồi xem. Vai của người bị treo cổ được lật cho cả làng biết."],
    ],
  },
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
    games: ["do-vui-team-building", "ai-hieu-ai", "ma-soi", "ai-la-gian-diep", "ve-doan-chu"],
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
    title: "Luật chơi Ai là gián điệp chi tiết và 100 cặp từ khóa hay",
    description: "Luật chơi Ai là gián điệp từ A đến Z, mẹo cho dân và gián điệp, xử lý khi hòa phiếu và 100 cặp từ khóa theo 10 chủ đề. Chơi online miễn phí trên điện thoại.",
    kicker: "Chơi nhóm",
    games: ["ai-la-gian-diep"],
    published: "2026-11-21",
    updated: "2026-11-22",
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
    games: ["bai-kiem-tra-15-phut", "lat-the"],
    published: "2026-11-21",
    updated: "2026-11-21",
    readMinutes: 6,
  },
  {
    slug: "giai-lao-van-phong",
    title: "Giải lao 5 phút ở văn phòng: làm gì để đầu óc tỉnh táo lại?",
    description: "Giải lao 5 phút ở văn phòng cho đúng: nghỉ mắt, vận động nhẹ, đổi hoạt động cho não và vài mini-game ngắn giúp xả stress mà không quá giờ nghỉ.",
    kicker: "Giải lao",
    games: ["inbox-zero", "thang-may", "phan-xa", "doan-chu"],
    published: "2026-11-21",
    updated: "2026-11-21",
    readMinutes: 5,
  },
];

export const getArticle = (slug: string) => ARTICLES.find((a) => a.slug === slug);
export const articlesForGame = (gameSlug: string) => ARTICLES.filter((a) => a.games.includes(gameSlug));
export const formatDate = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;
