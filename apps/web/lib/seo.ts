import type { GameEntry, GameType } from "./games";

/**
 * Search-facing copy, kept apart from lib/games.ts (which holds what the UI shows).
 *
 * - `title` is what people type into Google ("game gõ phím tiếng việt", "ai là gián điệp online"),
 *   not the brand name alone. The layout template appends " | Play4Fun".
 * - `description` ≈ 140–160 characters, says what you get + "miễn phí, không cần cài đặt".
 * - `faq` is shown on the page (Google only uses content people can see) and in JSON-LD.
 */

export const SITE_URL = process.env.PUBLIC_URL ?? "https://play4fun.io.vn";
export const SITE_NAME = "Play4Fun";

export type Faq = [question: string, answer: string];
export type GameSeo = { title: string; description: string; genre: string; faq: Faq[] };

const FREE: Faq = ["Có mất phí hay phải tải app không?", "Không. Mọi game trên Play4Fun đều miễn phí và chơi ngay trên trình duyệt của điện thoại hoặc máy tính, không cần cài đặt, không bắt buộc đăng ký."];
const SAVE: Faq = ["Kỷ lục của tôi có được lưu không?", "Kỷ lục luôn được lưu trên máy của bạn. Nếu đăng nhập bằng Google hoặc Facebook (không bắt buộc), kỷ lục được giữ trên tài khoản, dùng được trên mọi thiết bị và có tên trên bảng xếp hạng."];
const PARTY_JOIN: Faq = ["Người chơi vào phòng bằng cách nào?", "Một người bấm “Tạo phòng mới” rồi gửi mã phòng 5 ký tự hoặc cho mọi người quét mã QR. Ai cũng chơi bằng điện thoại của mình, không cần tài khoản."];
const PARTY_REMOTE: Faq = ["Có chơi được khi mỗi người ở một nơi không?", "Được. Mọi người vào cùng một phòng qua mạng, rồi nói chuyện qua Zoom, Google Meet, Messenger hoặc Zalo trong lúc chơi."];

export const GAME_SEO: Record<string, GameSeo> = {
  "inbox-zero": {
    title: "Inbox Zero – Game phân loại email văn phòng vui nhộn",
    description: "Vuốt trái, vuốt phải để dọn sạch hộp thư trong 90 giây: xử lý việc của sếp, xóa thư rác, né email lừa đảo. Game giải lao văn phòng miễn phí, chơi ngay trên điện thoại.",
    genre: "Arcade",
    faq: [
      ["Inbox Zero chơi như thế nào?", "Mỗi email hiện lên là một lá bài: vuốt phải để xử lý email công việc, vuốt trái để xóa quảng cáo, thư rác và email lừa đảo. Sau 20 giây bạn mở khóa vuốt lên để chuyển tiếp thư của phòng khác."],
      ["Làm sao nhận ra email lừa đảo trong game?", "Soi kỹ địa chỉ người gửi: đồng nghiệp thật luôn dùng tên miền @mayxanh.vn. Email giả mạo thường đổi một chữ cái trong tên miền hoặc hứa hẹn trúng thưởng. Đây cũng là thói quen tốt khi đọc email thật."],
      ["Một ván Inbox Zero kéo dài bao lâu?", "90 giây, cộng thêm thời gian nếu bạn nhặt được ly cà phê. Hết 3 tim (xử lý sai hoặc để email quá hạn) là kết thúc sớm."],
      FREE,
    ],
  },
  "deadline-dash": {
    title: "Deadline Dash – Game chạy vô tận chủ đề văn phòng",
    description: "Chạy trốn deadline: nhảy qua cuộc họp đột xuất, cúi né tin nhắn “em ơi gấp”, gom cà phê bật Turbo. Game endless runner miễn phí, chơi ngay trên trình duyệt.",
    genre: "Endless runner",
    faq: [
      ["Deadline Dash điều khiển thế nào?", "Trên máy tính bấm Space hoặc ↑ để nhảy, ↓ để cúi. Trên điện thoại chạm màn hình để nhảy, vuốt xuống để cúi."],
      ["Làm sao để chạy được xa hơn?", "Đừng để vấp: mỗi lần vấp, bức tường deadline áp sát hơn. Gom đủ 3 ly cà phê để bật Turbo, khi đó bạn chạy nhanh và húc bay mọi chướng ngại."],
      ["Chơi trên điện thoại và máy tính có giống nhau không?", "Có. Màn chơi được sinh giống hệt nhau trên mọi kích thước màn hình, nên thử thách hằng ngày công bằng cho mọi người."],
      FREE,
    ],
  },
  "bai-kiem-tra-15-phut": {
    title: "Kiểm tra 15 phút – Game tính nhẩm nhanh, luyện toán nhẩm",
    description: "Giải nhanh phép tính trước khi chuông reo: cộng trừ, bảng cửu chương, phép chia, tìm số còn thiếu. Game luyện tính nhẩm miễn phí cho học sinh và người lớn.",
    genre: "Puzzle",
    faq: [
      ["Kiểm tra 15 phút có những dạng toán nào?", "Đề khó dần theo từng cấp: cộng trừ, bảng cửu chương, phép chia, tìm số còn thiếu, nhân chia trước cộng trừ sau, bình phương và phần trăm. Đáp án luôn là số nguyên."],
      ["Bao nhiêu câu đúng thì được điểm 10?", "30 câu đúng là điểm 10. Mỗi câu đúng được cộng thêm thời gian, sai một câu mất 1 tim; hết giờ hoặc hết 3 tim là nộp bài."],
      ["Game có giúp luyện tính nhẩm không?", "Có. Mỗi lần chơi là một đề mới được sinh ngẫu nhiên, không lặp câu trong một lượt, nên chơi vài phút mỗi ngày là cách luyện tính nhẩm nhẹ nhàng cho cả học sinh lẫn người đi làm."],
      SAVE,
    ],
  },
  "pixel-dodge": {
    title: "Pixel Dodge – Game né đạn bullet hell online",
    description: "Điều khiển chấm sáng giữa màn mưa đạn pixel, cứ 10 giây một đợt mới khó hơn. Game né đạn kiểu bullet hell miễn phí, chơi mượt trên điện thoại và máy tính.",
    genre: "Bullet hell",
    faq: [
      ["Pixel Dodge điều khiển thế nào?", "Trên máy tính dùng phím mũi tên hoặc WASD. Trên điện thoại kéo ngón tay ở bất kỳ đâu trên màn hình, chấm sáng di chuyển theo mà không bị ngón tay che."],
      ["Điểm được tính ra sao?", "Mỗi giây sống sót được 100 điểm, lướt sát đạn (sượt qua) được thưởng thêm. Ô vàng nhấp nháy báo trước chỗ đạn sắp bắn ra, khiên xanh giúp chịu thêm một lần trúng đạn."],
      ["Bullet hell là gì?", "Là thể loại game né đạn, màn hình dày đặc đạn theo nhiều hình dạng và người chơi phải luồn lách giữa chúng. Pixel Dodge là một phiên bản ngắn gọn, mỗi ván chỉ 1 đến 3 phút."],
      SAVE,
    ],
  },
  "go-phim-nhanh": {
    title: "Kiểm tra tốc độ gõ phím tiếng Việt online (WPM) – Gõ phím thần tốc",
    description: "Đo tốc độ gõ phím tiếng Việt có dấu (Telex, VNI) và tiếng Anh trong 60 giây, tính WPM và độ chính xác. Mỗi lượt một đoạn văn mới, miễn phí, không cần cài đặt.",
    genre: "Typing",
    faq: [
      ["WPM là gì và được tính thế nào?", "WPM (words per minute) là số từ gõ được mỗi phút. Một “từ” được tính bằng 5 ký tự gõ đúng, kể cả dấu cách. Chỉ những từ đúng cả chữ lẫn dấu mới được tính."],
      ["Gõ tiếng Việt bằng Telex hay VNI đều được không?", "Được. Game hỗ trợ mọi bộ gõ như Unikey, EVKey và bàn phím điện thoại. Trong lúc bạn đang bỏ dấu, chữ chưa đủ dấu được hiển thị là “đang gõ” chứ không bị tính lỗi."],
      ["Tốc độ gõ phím bao nhiêu là nhanh?", "Gõ tiếng Việt có dấu khoảng 30 đến 40 WPM là mức dân văn phòng, trên 55 WPM là rất nhanh, trên 70 WPM là hiếm gặp. Gõ tiếng Anh thường nhanh hơn vì không phải bỏ dấu."],
      ["Có bị lặp đoạn văn không?", "Mỗi lượt là các đoạn văn ngẫu nhiên về đời văn phòng, mùa thi và game; đoạn vừa gõ sẽ không quay lại ngay ở các lượt sau."],
    ],
  },
  "ban-la-kieu-dong-nghiep-nao": {
    title: "Trắc nghiệm: Bạn là kiểu đồng nghiệp nào? – Test tính cách công sở",
    description: "10 tình huống công sở quen thuộc để biết bạn là chiến thần deadline, người giữ nhịp, đại sứ trà sữa hay ngôi sao ý tưởng. Test tính cách miễn phí, có kết quả để chia sẻ.",
    genre: "Quiz",
    faq: [
      ["Bài test có bao nhiêu câu?", "10 câu hỏi tình huống công sở, mất khoảng 3 phút. Không có đáp án đúng sai, hãy chọn điều bạn thật sự sẽ làm."],
      ["Kết quả gồm những gì?", "Kiểu đồng nghiệp nổi bật nhất của bạn, tỉ lệ phần trăm từng kiểu, điểm mạnh, điểm cần lưu ý và mẹo làm việc cùng người khác. Bạn có thể chia sẻ kết quả lên Facebook hoặc Zalo."],
      ["Làm lại có ra câu hỏi khác không?", "Có. Mỗi lần làm là một bộ câu hỏi khác lấy từ kho câu hỏi lớn hơn, thứ tự đáp án cũng được xáo trộn."],
      FREE,
    ],
  },
  "ban-hoc-kieu-gi": {
    title: "Trắc nghiệm phong cách học tập: Bạn học kiểu gì?",
    description: "Cú đêm, chiến thần nước rút hay mọt sách chính hiệu? 10 tình huống mùa thi giúp bạn hiểu phong cách học của mình, kèm mẹo ôn thi phù hợp. Miễn phí, có kết quả ngay.",
    genre: "Quiz",
    faq: [
      ["Bài trắc nghiệm này dành cho ai?", "Học sinh, sinh viên và cả người đang ôn thi chứng chỉ. 10 tình huống quen thuộc mùa thi, mất khoảng 3 phút."],
      ["Biết phong cách học thì có ích gì?", "Kết quả đi kèm mẹo ôn thi hợp với chính bạn, ví dụ cách chia nhỏ thời gian nếu bạn hay học dồn, hoặc cách giữ tập trung nếu bạn là cú đêm."],
      ["Làm lại có ra câu hỏi khác không?", "Có. Mỗi lần làm là một bộ câu hỏi khác, đáp án cũng được xáo trộn."],
      FREE,
    ],
  },
  "gamer-he-nao": {
    title: "Test: Bạn là gamer hệ nào? – Trắc nghiệm tính cách game thủ",
    description: "Tryhard, chill hay chuyên đi gánh team? 12 tình huống từ phòng chờ đến lúc thua trận để biết bạn là hệ gamer nào và hợp cạ với ai. Test vui miễn phí cho game thủ.",
    genre: "Quiz",
    faq: [
      ["Bài test có bao nhiêu câu?", "12 tình huống quen thuộc với game thủ, từ cách chọn tướng đến phản ứng khi thua liên tiếp, mất khoảng 3 phút."],
      ["Kết quả có gì?", "Hệ gamer của bạn, tỉ lệ từng hệ và hệ hợp cạ nhất để rủ chơi cùng. Kết quả có ảnh riêng để chia sẻ lên nhóm bạn."],
      ["Làm lại có ra câu hỏi khác không?", "Có. Mỗi lần làm là một bộ câu hỏi khác, đáp án cũng được xáo trộn."],
      FREE,
    ],
  },
  "ai-la-gian-diep": {
    title: "Ai là gián điệp online – Game chơi nhóm trên điện thoại",
    description: "Chơi Ai là gián điệp online miễn phí cho 3–12 người: mỗi người một từ khóa bí mật trên điện thoại, mô tả và bỏ phiếu tìm kẻ mạo danh. Tạo phòng trong 5 giây.",
    genre: "Party game",
    faq: [
      ["Luật chơi Ai là gián điệp như thế nào?", "Dân thường nhận cùng một từ khóa, gián điệp nhận một từ gần giống. Mọi người lần lượt mô tả từ của mình bằng một câu, rồi bỏ phiếu loại người đáng ngờ nhất. Dân thắng khi loại hết gián điệp; gián điệp thắng khi còn bằng số dân."],
      ["Cần bao nhiêu người để chơi?", "Từ 3 đến 12 người, mỗi người dùng điện thoại của mình. Ngồi cùng nhau hoặc qua cuộc gọi video đều chơi được."],
      PARTY_JOIN,
      PARTY_REMOTE,
    ],
  },
  "ve-doan-chu": {
    title: "Vẽ đoán chữ online – Game vẽ hình đoán từ chơi nhóm",
    description: "Một người vẽ, cả phòng thi nhau đoán: game vẽ đoán chữ online miễn phí cho 2–12 người, đoán bằng tiếng Việt không cần gõ dấu. Chơi trên điện thoại, không cần tài khoản.",
    genre: "Party game",
    faq: [
      ["Cách chơi vẽ đoán chữ online?", "Đến lượt mình, bạn chọn 1 trong 3 từ và vẽ trên màn hình. Những người khác gõ đáp án; đoán càng sớm càng nhiều điểm, người vẽ được điểm cho mỗi người đoán đúng."],
      ["Có phải gõ dấu tiếng Việt khi đoán không?", "Không cần. “ca phe” hay “cà phê” đều được tính đúng. Gợi ý chữ cái hiện dần khi thời gian trôi qua."],
      PARTY_JOIN,
      PARTY_REMOTE,
    ],
  },
  "do-vui-team-building": {
    title: "Đố vui team building online – Quiz nhóm realtime trên điện thoại",
    description: "Đố vui team building cho 2–50 người: chiếu câu hỏi lên màn hình lớn, mọi người trả lời bằng điện thoại, xếp hạng trực tiếp. Tự soạn câu hỏi công ty miễn phí.",
    genre: "Trivia",
    faq: [
      ["Tổ chức đố vui team building cần chuẩn bị gì?", "Một máy tính nối máy chiếu hoặc TV để mở phòng, và điện thoại của người chơi. Mọi người quét QR để vào, đến muộn vẫn vào được, không cần cài app."],
      ["Có tự soạn câu hỏi về công ty được không?", "Được, miễn phí. Đăng nhập rồi vào Studio để soạn bộ câu hỏi riêng (hoặc dán nhiều câu một lúc), thêm tên, màu và logo công ty; phòng chơi sẽ hiện thương hiệu của bạn."],
      ["Điểm được tính thế nào?", "Mỗi câu chọn 1 trong 4 đáp án trước khi hết giờ. Đúng càng nhanh càng nhiều điểm, đúng liên tiếp được thưởng thêm; bảng xếp hạng cập nhật sau mỗi câu và cuối game có bảng vàng."],
      PARTY_REMOTE,
    ],
  },
};

export type CategorySeo = { path: string; title: string; h1: string; description: string; intro: string[]; faq: Faq[] };

export const CATEGORY_SEO: Record<GameType, CategorySeo> = {
  arcade: {
    path: "/giai-lao",
    title: "Game giải lao online miễn phí cho dân văn phòng",
    h1: "Game giải lao online miễn phí",
    description: "Mini-game giải lao 1–3 phút chơi ngay trên trình duyệt: gõ phím tiếng Việt, tính nhẩm, né đạn, chạy trốn deadline. Không cần cài đặt, mượt trên điện thoại.",
    intro: [
      "Năm phút nghỉ giữa giờ là đủ cho một ván. Các mini-game ở đây được làm cho dân văn phòng, học sinh và game thủ: luật chơi hiểu ngay, mỗi ván 1 đến 3 phút, có bảng xếp hạng và thử thách hằng ngày để thi với bạn bè.",
      "Không cần tải app hay tạo tài khoản. Mở trên điện thoại hoặc máy tính là chơi được ngay.",
    ],
    faq: [
      ["Game nào hợp để giải lao ở văn phòng?", "Inbox Zero và Deadline Dash lấy chủ đề công sở, mỗi ván khoảng 1 đến 3 phút. Muốn vừa chơi vừa luyện thì thử Gõ phím thần tốc (đo tốc độ gõ tiếng Việt) hoặc Kiểm tra 15 phút (tính nhẩm)."],
      ["Thử thách hằng ngày là gì?", "Mỗi ngày một mini-game, cả nước chơi cùng một đề. Lần chơi đầu tiên trong ngày được tính lên bảng xếp hạng hôm nay, chơi liên tục nhiều ngày để giữ chuỗi."],
      FREE,
    ],
  },
  quiz: {
    path: "/test-vui",
    title: "Trắc nghiệm tính cách & test vui online miễn phí",
    h1: "Trắc nghiệm tính cách & test vui",
    description: "Các bài trắc nghiệm vui 3 phút: bạn là kiểu đồng nghiệp nào, phong cách học tập của bạn, bạn là gamer hệ nào. Kết quả chi tiết, có ảnh để chia sẻ lên Facebook.",
    intro: [
      "Mỗi bài test gồm 10 đến 12 tình huống quen thuộc, không có đáp án đúng sai. Kết quả cho biết kiểu nổi bật nhất của bạn kèm tỉ lệ từng kiểu, điểm mạnh và vài mẹo nhỏ.",
      "Làm lại sẽ ra bộ câu hỏi khác, nên rủ cả nhóm cùng làm rồi so kết quả cũng vui.",
    ],
    faq: [
      ["Các bài trắc nghiệm có chính xác không?", "Đây là test vui để hiểu mình hơn một chút và có chuyện để nói với bạn bè, không phải bài đánh giá tâm lý chuyên môn."],
      ["Chia sẻ kết quả thế nào?", "Cuối bài có nút chia sẻ, đường link kèm ảnh kết quả riêng của bạn khi đăng lên Facebook, Zalo hoặc Messenger."],
      FREE,
    ],
  },
  party: {
    path: "/choi-nhom",
    title: "Game chơi nhóm online trên điện thoại – Party game miễn phí",
    h1: "Game chơi nhóm online",
    description: "Party game chơi nhóm miễn phí: Ai là gián điệp, vẽ đoán chữ, đố vui team building. Tạo phòng, cả nhóm vào bằng mã hoặc QR trên điện thoại, không cần cài app.",
    intro: [
      "Hợp cho buổi họp đầu tuần, tiệc công ty, lớp học hay hội bạn tụ tập. Một người tạo phòng và gửi mã, mọi người vào bằng điện thoại của mình, không cần cài app hay tạo tài khoản.",
      "Ở xa nhau vẫn chơi được: vào cùng một phòng rồi gọi video qua Zoom, Google Meet, Messenger hoặc Zalo.",
    ],
    faq: [
      ["Game nào hợp cho team building?", "Đố vui team building cho tối đa 50 người, có thể tự soạn câu hỏi về công ty kèm logo. Nhóm nhỏ hơn thì Ai là gián điệp (3–12 người) và Vẽ & đoán (2–12 người) rất dễ khuấy động không khí."],
      PARTY_JOIN,
      PARTY_REMOTE,
    ],
  },
};

export const gameSeo = (g: GameEntry): GameSeo => GAME_SEO[g.slug] ?? { title: g.title, description: g.tagline, genre: "Casual", faq: [] };
export const categoryHref = (t: GameType) => CATEGORY_SEO[t].path;
