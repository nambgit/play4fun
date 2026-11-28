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
/** Spread into every page's openGraph: Next replaces the layout's openGraph object as a whole */
export const OG_BASE = {
  siteName: SITE_NAME,
  locale: "vi_VN",
  // Default preview (app/opengraph-image.tsx); pages with their own picture set `images` after this spread
  images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Play4Fun – Game online miễn phí" }],
};

export type Faq = [question: string, answer: string];
/**
 * <title> for a page: "Title | Play4Fun" when that fits in a Google result (about 60 characters),
 * otherwise the title alone, so the useful words are not cut off with "…".
 */
export const BRAND_SUFFIX = " | Play4Fun";
export const pageTitle = (title: string) => (title.length + BRAND_SUFFIX.length <= 60 ? title : { absolute: title });

export type GameSeo = { title: string; description: string; genre: string; faq: Faq[] };

const FREE: Faq = ["Có mất phí hay phải tải app không?", "Không. Mọi game trên Play4Fun đều miễn phí và chơi ngay trên trình duyệt của điện thoại hoặc máy tính, không cần cài đặt, không bắt buộc đăng ký."];
const SAVE: Faq = ["Kỷ lục của tôi có được lưu không?", "Kỷ lục luôn được lưu trên máy của bạn. Nếu đăng nhập bằng Google hoặc Facebook (không bắt buộc), kỷ lục được giữ trên tài khoản, dùng được trên mọi thiết bị và có tên trên bảng xếp hạng."];
const PARTY_JOIN: Faq = ["Người chơi vào phòng bằng cách nào?", "Một người bấm “Tạo phòng mới” rồi gửi mã phòng 5 ký tự hoặc cho mọi người quét mã QR. Ai cũng chơi bằng điện thoại của mình, không cần tài khoản."];
const PARTY_REMOTE: Faq = ["Có chơi được khi mỗi người ở một nơi không?", "Được. Mọi người vào cùng một phòng qua mạng, rồi nói chuyện qua Zoom, Google Meet, Messenger hoặc Zalo trong lúc chơi."];

export const GAME_SEO: Record<string, GameSeo> = {
  "inbox-zero": {
    title: "Inbox Zero – Game phân loại email văn phòng vui nhộn",
    description: "Vuốt trái, vuốt phải dọn sạch hộp thư trong 90 giây: xử lý việc sếp giao, xóa thư rác, né email lừa đảo. Game giải lao văn phòng miễn phí.",
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
    title: "Kiểm tra tốc độ gõ phím tiếng Việt online (WPM)",
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
    title: "Bạn là kiểu đồng nghiệp nào? Test tính cách công sở",
    description: "10 tình huống công sở để biết bạn là chiến thần deadline, người giữ nhịp, đại sứ trà sữa hay ngôi sao ý tưởng. Test miễn phí, có kết quả để chia sẻ.",
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
    description: "Cú đêm, chiến thần nước rút hay mọt sách? 10 tình huống mùa thi giúp bạn hiểu phong cách học của mình, kèm mẹo ôn thi phù hợp. Miễn phí.",
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
    description: "Tryhard, chill hay chuyên gánh team? 12 tình huống từ phòng chờ đến lúc thua trận để biết bạn là gamer hệ nào và hợp cạ với ai. Test miễn phí.",
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
    description: "Một người vẽ, cả phòng thi nhau đoán: game vẽ đoán chữ online miễn phí cho 2–12 người, đoán tiếng Việt không cần gõ dấu, chơi ngay trên điện thoại.",
    genre: "Party game",
    faq: [
      ["Cách chơi vẽ đoán chữ online?", "Đến lượt mình, bạn chọn 1 trong 3 từ và vẽ trên màn hình. Những người khác gõ đáp án; đoán càng sớm càng nhiều điểm, người vẽ được điểm cho mỗi người đoán đúng."],
      ["Có phải gõ dấu tiếng Việt khi đoán không?", "Không cần. “ca phe” hay “cà phê” đều được tính đúng. Gợi ý chữ cái hiện dần khi thời gian trôi qua."],
      PARTY_JOIN,
      PARTY_REMOTE,
    ],
  },
  "do-vui-team-building": {
    title: "Đố vui team building online – Quiz nhóm trên điện thoại",
    description: "Đố vui team building cho 2–50 người: chiếu câu hỏi lên màn hình lớn, mọi người trả lời bằng điện thoại, xếp hạng trực tiếp. Tự soạn câu hỏi công ty miễn phí.",
    genre: "Trivia",
    faq: [
      ["Tổ chức đố vui team building cần chuẩn bị gì?", "Một máy tính nối máy chiếu hoặc TV để mở phòng, và điện thoại của người chơi. Mọi người quét QR để vào, đến muộn vẫn vào được, không cần cài app."],
      ["Có tự soạn câu hỏi về công ty được không?", "Được, miễn phí. Đăng nhập rồi vào Studio để soạn bộ câu hỏi riêng (hoặc dán nhiều câu một lúc), thêm tên, màu và logo công ty; phòng chơi sẽ hiện thương hiệu của bạn."],
      ["Điểm được tính thế nào?", "Mỗi câu chọn 1 trong 4 đáp án trước khi hết giờ. Đúng càng nhanh càng nhiều điểm, đúng liên tiếp được thưởng thêm; bảng xếp hạng cập nhật sau mỗi câu và cuối game có bảng vàng."],
      PARTY_REMOTE,
    ],
  },
  "doan-chu": {
    title: "Đoán chữ hằng ngày – Game đoán từ tiếng Việt 5 chữ cái",
    description: "Mỗi ngày một từ tiếng Việt 5 chữ cái, đoán trong 6 lượt với gợi ý ô xanh, ô vàng. Gõ không dấu, giữ chuỗi ngày thắng và khoe kết quả. Miễn phí, chơi ngay.",
    genre: "Word game",
    faq: [
      ["Đoán chữ chơi như thế nào?", "Gõ một từ tiếng Việt 5 chữ cái (không dấu) rồi bấm Đoán. Ô xanh là chữ đúng và đúng chỗ, ô vàng là từ có chữ đó nhưng ở chỗ khác, ô xám là không có. Bạn có 6 lượt."],
      ["Có phải gõ dấu không?", "Không. Chữ được so sánh không dấu và chữ đ tính là d, nên gõ “nguoi” là “người”, “duong” là “đường”. Đáp án có dấu được hiện ở cuối lượt."],
      ["Bao giờ có từ mới?", "Mỗi ngày lúc 0 giờ (giờ Việt Nam) có một từ mới, giống nhau cho tất cả mọi người. Muốn chơi thêm thì chọn chế độ Luyện tập với từ ngẫu nhiên."],
      FREE,
    ],
  },
  "phan-xa": {
    title: "Test phản xạ online – Đo thời gian phản xạ (ms)",
    description: "Kiểm tra tốc độ phản xạ: màn hình chuyển xanh là chạm, đo bằng mili-giây, lấy trung bình 5 lần. Xem bạn nhanh hơn số đông không. Miễn phí, chơi trên điện thoại.",
    genre: "Reflex",
    faq: [
      ["Thời gian phản xạ bao nhiêu là nhanh?", "Trên điện thoại hay máy tính, khoảng 250–300 ms là mức phổ biến, dưới 240 ms là rất nhanh, dưới 200 ms là hiếm. Con số này gồm cả độ trễ của màn hình và thiết bị."],
      ["Vì sao kết quả mỗi máy một khác?", "Màn hình, chuột, cảm ứng và trình duyệt đều có độ trễ riêng. So với chính mình trên cùng một thiết bị là chính xác nhất."],
      ["Chạm sớm có bị trừ điểm không?", "Không trừ điểm, nhưng lần đó phải làm lại. Chạm nhanh hơn 90 ms sau khi chuyển xanh cũng được tính là chạm sớm, vì đó là đoán mò chứ không phải phản xạ."],
      FREE,
    ],
  },
  "lat-the": {
    title: "Game lật hình tìm cặp – Nhớ thẻ bài rèn trí nhớ",
    description: "Trò chơi trí nhớ lật thẻ tìm cặp hình chủ đề Việt Nam qua 4 cấp độ, từ 12 đến 24 thẻ. Tính giờ và số lượt, hợp cả trẻ em và người lớn. Miễn phí.",
    genre: "Memory",
    faq: [
      ["Chơi nhớ thẻ bài thế nào?", "Lật 2 thẻ mỗi lượt. Hai hình giống nhau thì giữ lại, khác nhau thì úp xuống sau một chút. Tìm hết các cặp để qua cấp; có 4 cấp với bàn chơi to dần."],
      ["Điểm được tính ra sao?", "Điểm là tổng thời gian hoàn thành cả 4 cấp, càng ít càng tốt. Game cũng tính độ chính xác: số cặp chia cho số lượt lật."],
      ["Game có giúp rèn trí nhớ không?", "Lật thẻ tìm cặp là bài luyện trí nhớ ngắn hạn quen thuộc. Mỗi ván hình và vị trí được xáo mới nên không thể học thuộc."],
      FREE,
    ],
  },
  "thang-may": {
    title: "Thang máy giờ cao điểm – Game điều phối văn phòng",
    description: "8 giờ sáng, cả tòa nhà đổ về sảnh: chọn ai lên thang, gom người cùng tầng để chở kịp mọi người trước 9 giờ. Game giải trí văn phòng miễn phí, chơi trong 2 phút.",
    genre: "Puzzle",
    faq: [
      ["Thang máy giờ cao điểm chơi thế nào?", "Chạm vào nhân viên ở sảnh để chọn tối đa 6 người rồi bấm “Đi thôi!”. Thang quay lại sau khi chở xong. Chơi từ 8:00 đến 9:00 hoặc đến khi hết 3 tim."],
      ["Làm sao để được nhiều điểm?", "Mỗi điểm dừng tốn nhiều thời gian hơn việc đi cao thêm một tầng. Hãy chở đầy thang nhưng chỉ dừng ở 1–2 tầng: thang về nhanh hơn, và 3 người trở lên chỉ đi 1–2 tầng là “chuyến đẹp” có điểm thưởng."],
      ["Khi nào bị mất tim?", "Thanh màu dưới mỗi người là độ kiên nhẫn. Ai chờ hết kiên nhẫn sẽ bỏ đi thang bộ và bạn mất 1 tim."],
      FREE,
    ],
  },
  "ban-hop-nghe-gi": {
    title: "Trắc nghiệm hướng nghiệp: Bạn hợp nghề gì?",
    description: "Trắc nghiệm nghề nghiệp 12 câu: biết nhóm nghề hợp với bạn (sáng tạo, kỹ thuật, phân tích, chăm sóc, kinh doanh, tổ chức) kèm gợi ý ngành học. Miễn phí.",
    genre: "Quiz",
    faq: [
      ["Bài trắc nghiệm này dành cho ai?", "Học sinh đang chọn ngành, sinh viên và người đi làm muốn hiểu mình hợp kiểu công việc nào. 12 tình huống quen thuộc, mất khoảng 3 phút."],
      ["Kết quả gồm những gì?", "Nhóm nghề hợp nhất với bạn, tỉ lệ của cả 6 nhóm, điểm mạnh, điểm cần lưu ý, kỹ năng nên thử và gợi ý ngành học."],
      ["Kết quả có chính xác không?", "Đây là trắc nghiệm tham khảo cho vui, giúp bạn có thêm góc nhìn. Khi chọn ngành thật, hãy kết hợp với tư vấn hướng nghiệp, trải nghiệm thực tế và ý kiến của người đi trước."],
      FREE,
    ],
  },
  "ban-la-mon-an-viet-nao": {
    title: "Test tính cách: Bạn là món ăn Việt nào?",
    description: "Bài test vui 10 câu: bạn là phở ấm áp, bánh mì năng động, bún bò cá tính hay trà sữa vui vẻ? Nhận kết quả kèm món hợp cạ nhất và khoe ngay với bạn bè. Miễn phí.",
    genre: "Quiz",
    faq: [
      ["Bài test có bao nhiêu câu?", "10 câu hỏi về thói quen và cách bạn đối xử với mọi người, mất khoảng 2 phút. Không có đáp án đúng sai."],
      ["Có những món nào?", "Phở, bánh mì, bún bò, trà sữa, bánh xèo và chè, mỗi món là một kiểu tính cách. Kết quả có tỉ lệ từng món và món hợp cạ nhất với bạn."],
      ["Làm lại có ra câu hỏi khác không?", "Có. Mỗi lần làm là một bộ câu hỏi khác, thứ tự đáp án cũng được xáo trộn."],
      FREE,
    ],
  },
  "kien-thuc-viet-nam": {
    title: "Câu hỏi kiến thức Việt Nam có đáp án – Trắc nghiệm online",
    description: "Trắc nghiệm kiến thức Việt Nam 15 câu: lịch sử, địa lý, văn hóa, đời sống, mỗi câu 20 giây, chấm thang điểm 10 kèm giải thích. Hơn 160 câu hỏi, miễn phí.",
    genre: "Trivia",
    faq: [
      ["Bài kiểm tra gồm những chủ đề nào?", "Lịch sử, địa lý, văn hóa – văn học – lễ hội, và đời sống. Mỗi lượt 15 câu chia đều các chủ đề, lấy ngẫu nhiên từ hơn 160 câu hỏi."],
      ["Điểm được tính thế nào?", "Mỗi câu đúng được tính, quy ra thang điểm 10. Hết 20 giây mà chưa chọn thì câu đó tính là sai. Cuối bài bạn xem lại được các câu chưa đúng kèm giải thích."],
      ["Làm lại có bị trùng câu không?", "Câu bạn đã gặp gần đây được để xuống sau, nên làm nhiều lần sẽ gặp câu mới cho đến khi đi hết kho câu hỏi."],
      FREE,
    ],
  },
  "ma-soi": {
    title: "Ma sói online – Chơi trên điện thoại, máy làm quản trò",
    description: "Chơi Ma sói online miễn phí cho 5–16 người: vai bí mật trên điện thoại (sói, tiên tri, bảo vệ, dân làng), máy làm quản trò, đếm giờ thảo luận và bỏ phiếu.",
    genre: "Party game",
    faq: [
      ["Luật chơi Ma sói như thế nào?", "Ban đêm, sói chọn một người để cắn, Tiên tri soi xem một người có phải sói không, Bảo vệ che chở một người. Ban ngày công bố ai chết, cả làng thảo luận rồi bỏ phiếu treo cổ. Dân thắng khi diệt hết sói; sói thắng khi số sói bằng số người còn lại."],
      ["Có cần quản trò không?", "Không. Máy chia vai, gọi từng vai dậy ban đêm trên điện thoại của họ, tính kết quả, đếm giờ thảo luận và bỏ phiếu. Ai cũng được chơi."],
      ["Cần bao nhiêu người?", "Từ 5 đến 16 người. Gợi ý 1 sói cho 5–7 người, 2 sói từ 8 người, 3 sói từ 12 người. Có thể tắt Tiên tri hoặc Bảo vệ để đổi độ khó."],
      PARTY_REMOTE,
    ],
  },
  "ai-hieu-ai": {
    title: "Ai hiểu ai nhất? – Game đoán ý bạn bè chơi nhóm online",
    description: "Game chơi nhóm cho hội bạn và đồng nghiệp: một người lên ghế nóng chọn câu trả lời thật, cả nhóm đoán. Hơn 100 câu hỏi vui, 2–20 người, miễn phí.",
    genre: "Party game",
    faq: [
      ["Cách chơi Ai hiểu ai nhất?", "Mỗi lượt, một người lên ghế nóng và bí mật chọn đáp án đúng với mình (ví dụ món có thể ăn cả tuần không chán). Những người khác đoán xem người đó chọn gì, rồi cùng lật đáp án."],
      ["Điểm được tính ra sao?", "Đoán trúng được 100 điểm. Người ghế nóng được 50 điểm cho mỗi người đoán trúng, nên càng thật lòng và cả nhóm càng hiểu nhau thì càng nhiều điểm."],
      ["Hợp với dịp nào?", "Buổi team building, làm quen đồng nghiệp mới, tụ tập bạn bè hay lớp học. Câu hỏi nhẹ nhàng, không đụng chuyện riêng tư."],
      PARTY_JOIN,
    ],
  },
  "ai-de-nhat": {
    title: "Ai dễ… nhất? – Game bình chọn vui chơi nhóm online",
    description: "“Ai dễ ngủ gật trong họp nhất?” Cả nhóm bình chọn ẩn danh trên điện thoại, đoán trúng số đông để ăn điểm, nhận danh hiệu vui. 130+ câu, 3–20 người.",
    genre: "Party game",
    faq: [
      ["Cách chơi Ai dễ… nhất?", "Mỗi câu hiện một tình huống như “Ai dễ quên tắt mic khi họp online nhất?”. Mọi người bí mật chọn một người khác trong phòng trên điện thoại của mình, rồi cùng xem kết quả bình chọn."],
      ["Điểm được tính ra sao?", "Chọn trùng người được nhiều phiếu nhất được 100 điểm, nên phải đoán xem cả nhóm nghĩ gì. Người được gọi tên nhiều nhất nhận danh hiệu vui của câu đó (ví dụ “Thánh ngủ gật”) và 50 điểm."],
      ["Có ai biết mình bị chọn bởi ai không?", "Không. Phiếu bầu ẩn danh, chỉ hiện tổng số phiếu của mỗi người. Câu hỏi đều nhẹ nhàng về thói quen, sở thích, không đụng ngoại hình hay chuyện riêng tư."],
      PARTY_JOIN,
    ],
  },
  "noi-tu": {
    title: "Nối từ online – Chơi nối từ 2 người, cả nhóm hoặc với máy",
    description: "Chơi nối từ tiếng Việt online: đấu 1-1 với người lạ, mở phòng cho nhóm 2–10 người hoặc đấu với máy. Từ điển hơn 20.000 từ, miễn phí, không cần cài.",
    genre: "Word game",
    faq: [
      ["Chơi nối từ online với bạn bè thế nào?", "Bấm “Tạo phòng mời bạn” rồi gửi link hoặc mã phòng. Từ 2 đến 10 người cùng vào, chủ phòng bấm bắt đầu. Mọi người lần lượt nối từ: từ sau bắt đầu bằng tiếng cuối của từ trước, mỗi lượt 30 giây."],
      ["Không có ai chơi cùng thì sao?", "Bấm “Tìm đối thủ ngẫu nhiên” để đấu 1-1 với người đang chờ, hoặc chọn “Chơi với máy”: mức Dễ máy dùng từ thông dụng, mức Khó máy chủ động tìm từ làm bạn bí."],
      ["Khi nào bị loại?", "Khi hết giờ hoặc bỏ cuộc, hoặc khi người trước nói một từ mà không còn từ nào bắt đầu bằng tiếng cuối của nó. Gõ sai từ không bị trừ lượt, chỉ cần thử lại trước khi hết giờ. Người trụ lại cuối cùng thắng hiệp."],
      ["Từ điển có bao nhiêu từ?", "Hơn 20.000 từ ghép hai tiếng thông dụng. Máy chủ kiểm tra từng từ nên không ai gian lận được."],
    ],
  },
  "co-caro": {
    title: "Cờ caro online – Chơi cờ ca rô 2 người, đấu với máy",
    description: "Chơi cờ caro online miễn phí: ghép ngẫu nhiên với người lạ, mời bạn bằng link hoặc đấu với máy. Bàn 20×20, 5 quân liền hàng thắng, có luật chặn hai đầu.",
    genre: "Board game",
    faq: [
      ["Luật chơi cờ caro như thế nào?", "Hai người lần lượt đặt X và O lên bàn cờ, X đi trước. Ai có 5 quân liền nhau theo hàng ngang, dọc hoặc chéo trước là thắng."],
      ["Luật chặn hai đầu là gì?", "Với luật này, 5 quân liền nhau mà bị quân đối thủ chặn ở cả hai đầu thì không được tính thắng. Đây là luật phổ biến khi chơi caro ở Việt Nam, bạn có thể bật hoặc tắt khi tạo phòng."],
      ["Chơi caro với bạn bè ở xa được không?", "Được. Bấm “Tạo phòng mời bạn” rồi gửi link hoặc mã phòng. Bạn bè mở link trên điện thoại hay máy tính là vào chơi ngay, không cần cài đặt."],
      ["Không có ai chơi cùng thì sao?", "Bấm “Tìm đối thủ ngẫu nhiên” để ghép với người đang chờ, hoặc chọn “Chơi với máy”: mức Dễ máy hay sơ hở, mức Khó máy công thủ chắc chắn."],
    ],
  },
};

export type CategorySeo = { path: string; title: string; h1: string; description: string; intro: string[]; faq: Faq[] };

export const CATEGORY_SEO: Record<GameType, CategorySeo> = {
  arcade: {
    path: "/giai-lao",
    title: "Game giải lao online miễn phí cho dân văn phòng",
    h1: "Game giải lao online miễn phí",
    description: "Mini-game giải lao 1–3 phút trên trình duyệt: đoán chữ hằng ngày, gõ phím tiếng Việt, tính nhẩm, test phản xạ, lật hình. Không cần cài, mượt trên điện thoại.",
    intro: [
      "Năm phút nghỉ giữa giờ là đủ cho một ván. Các mini-game ở đây được làm cho dân văn phòng, học sinh và game thủ: luật chơi hiểu ngay, mỗi ván 1 đến 3 phút, có bảng xếp hạng và thử thách hằng ngày để thi với bạn bè.",
      "Không cần tải app hay tạo tài khoản. Mở trên điện thoại hoặc máy tính là chơi được ngay.",
    ],
    faq: [
      ["Game nào hợp để giải lao ở văn phòng?", "Inbox Zero, Deadline Dash và Thang máy giờ cao điểm lấy chủ đề công sở, mỗi ván khoảng 1 đến 3 phút. Muốn vừa chơi vừa luyện thì thử Gõ phím thần tốc, Kiểm tra 15 phút (tính nhẩm), Nối từ hoặc Đoán chữ hằng ngày (mỗi ngày một từ mới)."],
      ["Thử thách hằng ngày là gì?", "Mỗi ngày một mini-game, cả nước chơi cùng một đề. Lần chơi đầu tiên trong ngày được tính lên bảng xếp hạng hôm nay, chơi liên tục nhiều ngày để giữ chuỗi."],
      FREE,
    ],
  },
  quiz: {
    path: "/test-vui",
    title: "Trắc nghiệm tính cách & test vui online miễn phí",
    h1: "Trắc nghiệm tính cách & test vui",
    description: "Trắc nghiệm vui 3 phút: bạn hợp nghề gì, bạn là món ăn Việt nào, kiểu đồng nghiệp, phong cách học, gamer hệ nào, và bài kiểm tra kiến thức Việt Nam có đáp án.",
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
    description: "Party game chơi nhóm miễn phí: Ma sói, Ai là gián điệp, vẽ đoán chữ, đố vui team building, nối từ, cờ caro… Vào phòng bằng mã hoặc QR trên điện thoại.",
    intro: [
      "Hợp cho buổi họp đầu tuần, tiệc công ty, lớp học hay hội bạn tụ tập. Một người tạo phòng và gửi mã, mọi người vào bằng điện thoại của mình, không cần cài app hay tạo tài khoản.",
      "Ở xa nhau vẫn chơi được: vào cùng một phòng rồi gọi video qua Zoom, Google Meet, Messenger hoặc Zalo.",
    ],
    faq: [
      ["Game nào hợp cho team building?", "Đố vui team building cho tối đa 50 người, có thể tự soạn câu hỏi về công ty kèm logo. Ai hiểu ai nhất (2–20 người) giúp đồng nghiệp hiểu nhau hơn, Ai dễ… nhất (3–20 người) là trò bình chọn vui khởi động rất nhanh. Nhóm nhỏ thì Ai là gián điệp, Vẽ & đoán hoặc Ma sói (5–16 người) rất dễ khuấy động không khí."],
      PARTY_JOIN,
      PARTY_REMOTE,
    ],
  },
};

export const gameSeo = (g: GameEntry): GameSeo => GAME_SEO[g.slug] ?? { title: g.title, description: g.tagline, genre: "Casual", faq: [] };
export { categoryHref } from "./games";
