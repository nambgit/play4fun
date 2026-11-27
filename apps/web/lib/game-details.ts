/**
 * Long texts of each game (intro + rules), used only by server-rendered pages. Kept out of
 * lib/games.ts so the catalogue that client components import stays small.
 */
export type GameDetails = { description: string; howTo?: string[] };

export const GAME_DETAILS: Record<string, GameDetails> = {
  "inbox-zero": {
    description: "Email đổ về liên tục: việc gấp của sếp, khách hàng hỏi giá, và cả đống thư rác “trúng thưởng”. Phân loại thật nhanh, né email lừa đảo và giữ combo càng lâu càng tốt.",
    howTo: [
      "Vuốt phải (→) để xử lý email công việc thật của bạn.",
      "Vuốt trái (←) để xóa quảng cáo, thư rác và email lừa đảo.",
      "Sau 20 giây mở khóa vuốt lên (↑): chuyển tiếp thư của phòng khác.",
      "Soi kỹ địa chỉ người gửi — đồng nghiệp thật luôn dùng @mayxanh.vn.",
      "Sai hoặc để email quá hạn mất 1 tim; hết 3 tim là “sếp gọi lên phòng”.",
      "Mỗi ván là một hộp thư ngẫu nhiên mới — chơi lại không bị lặp đề.",
    ],
  },
  "deadline-dash": {
    description: "Deadline đang đuổi sát sau lưng! Nhảy qua cuộc họp bất ngờ, cúi né tin nhắn “em ơi gấp”, gom cà phê để bật Turbo. Mỗi ván là một kịch bản ngẫu nhiên — từ Thứ Hai đầu tuần, mùa thi cử đến đêm cày rank.",
    howTo: [
      "Nhảy (Space / ↑ / chạm) qua hồ sơ, thùng giấy và bàn họp.",
      "Cúi (↓ / vuốt xuống) để né tin nhắn bay ngang đầu — nhảy không qua được đâu.",
      "Mỗi lần vấp, bức tường deadline áp sát hơn; chạy trơn tru thì khoảng cách hồi lại.",
      "Gom đủ 3 ly cà phê để bật Turbo: chạy nhanh và húc bay mọi chướng ngại.",
      "Mỗi ván một kịch bản ngẫu nhiên, không lặp lại kịch bản vừa chơi.",
    ],
  },
  "bai-kiem-tra-15-phut": {
    description: "Những phép tính nhẩm xuất hiện ngày càng nhanh. Trả lời đúng để kéo dài thời gian, sai là mất tim. Bạn trụ được đến câu thứ mấy?",
    howTo: [
      "Bắt đầu với 12 giây, mỗi câu đúng được cộng thêm giờ (càng lên cao càng ít).",
      "Gõ đáp án bằng bàn phím số; gõ đủ chữ số là tự chấm.",
      "Sai một câu mất 1 tim và xem đáp án đúng; hết 3 tim là nộp bài.",
      "Đề khó dần: cộng trừ, bảng cửu chương, phép chia, tìm số còn thiếu, nhân chia trước cộng trừ sau.",
      "30 câu đúng là điểm 10. Mỗi lần làm là một đề mới.",
    ],
  },
  "pixel-dodge": {
    description: "Điều khiển một chấm sáng giữa màn mưa đạn pixel. Mỗi 10 giây là một đợt tấn công mới — phản xạ là tất cả.",
    howTo: [
      "Né mọi viên đạn — chạm một viên là hết ván.",
      "Cứ 10 giây là một đợt mới, đạn nhanh và dày hơn.",
      "Lướt sát đạn để “sượt qua” và nhận điểm thưởng.",
      "Ô vàng nhấp nháy báo trước chỗ đạn sắp bắn ra.",
      "Nhặt khiên xanh để chịu thêm được một lần trúng đạn.",
    ],
  },
  "go-phim-nhanh": {
    description: "60 giây gõ càng nhanh càng tốt: chọn tiếng Việt (Telex, VNI đều được) hoặc tiếng Anh. Mỗi ván là các đoạn văn ngẫu nhiên về đời văn phòng, mùa thi, game và đủ thứ chuyện, không lặp lại đoạn vừa gõ. Xem tốc độ WPM, độ chính xác và so tài với đồng nghiệp, bạn cùng lớp.",
    howTo: [
      "Chọn ngôn ngữ: Tiếng Việt hoặc English.",
      "Gõ từ đang được tô sáng, xong mỗi từ thì bấm Space.",
      "Từ chỉ được tính khi đúng cả chữ lẫn dấu; gõ sai vẫn đi tiếp được.",
      "Đồng hồ 60 giây chạy từ phím đầu tiên; Esc để tạm dừng.",
      "WPM = số ký tự gõ đúng ÷ 5 trong một phút.",
      "Mỗi ván là đoạn văn ngẫu nhiên, đoạn vừa gõ sẽ không quay lại ngay.",
    ],
  },
  "ban-la-kieu-dong-nghiep-nao": {
    description: "Người giữ nhịp cuộc họp, chuyên gia trà sữa hay “chiến thần deadline”? Trả lời 10 tình huống công sở để biết bạn thuộc kiểu nào.",
    howTo: [
      "Trả lời 10 tình huống công sở, chọn điều bạn thật sự sẽ làm.",
      "Không có đáp án đúng sai, mỗi lựa chọn nghiêng về một kiểu đồng nghiệp.",
      "Bấm nút ← để sửa câu trước nếu đổi ý.",
      "Nhận kết quả kèm tỉ lệ từng kiểu, điểm mạnh, điểm cần lưu ý và mẹo làm việc.",
      "Mỗi lần làm là một bộ câu hỏi khác, đáp án cũng được xáo trộn.",
    ],
  },
  "ban-hoc-kieu-gi": {
    description: "Khám phá phong cách học của bạn qua những tình huống quen thuộc mùa thi — và nhận vài mẹo học hợp với chính mình.",
    howTo: [
      "Trả lời 10 tình huống quen thuộc mùa thi.",
      "Không có đáp án đúng sai, cứ chọn điều bạn hay làm nhất.",
      "Bấm nút ← để sửa câu trước nếu đổi ý.",
      "Nhận phong cách học của bạn kèm mẹo ôn thi hợp với chính mình.",
      "Mỗi lần làm là một bộ câu hỏi khác, đáp án cũng được xáo trộn.",
    ],
  },
  "gamer-he-nao": {
    description: "Từ cách chọn tướng đến phản ứng khi thua liên tiếp — 12 câu hỏi để biết bạn là kiểu gamer nào trong mắt đồng đội.",
    howTo: [
      "Trả lời 12 tình huống từ phòng chờ đến lúc thua trận.",
      "Không có đáp án đúng sai, chọn phản ứng thật nhất của bạn.",
      "Bấm nút ← để sửa câu trước nếu đổi ý.",
      "Nhận hệ gamer của bạn, tỉ lệ từng hệ và hệ hợp cạ nhất để rủ chơi cùng.",
      "Mỗi lần làm là một bộ câu hỏi khác, đáp án cũng được xáo trộn.",
    ],
  },
  "ai-la-gian-diep": {
    description: "Mỗi người nhận một từ khoá bí mật, riêng gián điệp nhận từ khác. Lần lượt mô tả, tranh luận và bỏ phiếu tìm ra kẻ mạo danh.",
    howTo: [
      "Một người tạo phòng, mọi người vào bằng mã phòng hoặc quét QR.",
      "Mỗi người xem từ khóa bí mật trên điện thoại của mình.",
      "Lần lượt mô tả từ khóa bằng một câu, ngồi cùng nhau hoặc qua cuộc gọi video.",
      "Bỏ phiếu trên điện thoại để loại người đáng ngờ nhất.",
      "Dân thắng khi loại hết gián điệp; gián điệp thắng khi còn bằng số dân.",
    ],
  },
  "ve-doan-chu": {
    description: "Đến lượt bạn cầm bút: vẽ từ khoá thật nhanh để cả phòng đoán. Đoán đúng càng sớm càng nhiều điểm.",
    howTo: [
      "Một người tạo phòng, mọi người vào bằng mã phòng hoặc quét QR.",
      "Đến lượt mình thì chọn 1 trong 3 từ và vẽ trên màn hình.",
      "Những người khác gõ đáp án, không cần gõ dấu.",
      "Đoán càng sớm càng nhiều điểm, người vẽ được điểm cho mỗi người đoán đúng.",
      "Gợi ý chữ cái sẽ hiện dần khi thời gian trôi qua.",
    ],
  },
  "do-vui-team-building": {
    description: "Chiếu câu hỏi lên màn hình lớn, mọi người trả lời bằng điện thoại. Bảng xếp hạng cập nhật sau mỗi câu — hoàn hảo cho buổi họp đầu tuần.",
    howTo: [
      "Chủ phòng mở game trên máy chiếu hoặc TV và tạo phòng.",
      "Mọi người quét QR để vào bằng điện thoại, đến muộn vẫn vào được.",
      "Mỗi câu chọn 1 trong 4 đáp án trước khi hết giờ.",
      "Đúng càng nhanh càng nhiều điểm, đúng liên tiếp được thưởng thêm.",
      "Bảng xếp hạng cập nhật sau mỗi câu, cuối game có bảng vàng.",
    ],
  },
  "doan-chu": {
    description: "Mỗi ngày cả nước cùng đoán một từ. Gõ không dấu, ô xanh là đúng chữ đúng chỗ, ô vàng là có chữ đó nhưng sai chỗ. Đoán xong khoe lưới ô màu mà không lộ đáp án, rồi luyện thêm ở chế độ tự do.",
    howTo: [
      "Gõ một từ tiếng Việt có 5 chữ cái, không cần dấu (“nguoi” là “người”, “duong” là “đường”).",
      "Ô xanh: chữ đúng và đúng vị trí. Ô vàng: có chữ đó nhưng sai vị trí. Ô xám: không có.",
      "Bạn có 6 lượt đoán. Mỗi ngày một từ mới cho tất cả mọi người, lúc 0 giờ.",
      "Thắng liên tiếp để giữ chuỗi ngày. Muốn chơi thêm thì chọn “Luyện tập”.",
    ],
  },
  "phan-xa": {
    description: "Bài kiểm tra phản xạ đơn giản mà gây nghiện: chờ màu đỏ chuyển sang xanh rồi chạm thật nhanh. Làm 5 lần để lấy trung bình, chạm sớm phải làm lại. Bạn nhanh hơn số đông không?",
    howTo: [
      "Màn hình đỏ: chờ, đừng chạm. Chạm sớm thì lần đó phải làm lại.",
      "Màn hình chuyển xanh: chạm (hoặc bấm Space) nhanh nhất có thể.",
      "Làm 5 lần, kết quả là thời gian trung bình tính bằng mili-giây.",
      "Kết quả phụ thuộc cả màn hình và thiết bị, nên so với chính mình trên cùng một máy.",
    ],
  },
  "lat-the": {
    description: "Trò chơi trí nhớ lật hình chủ đề Việt Nam: phở, bánh mì, đèn lồng, trâu… Lật hai thẻ mỗi lượt, giống nhau thì giữ lại. Bàn chơi to dần từ 12 lên 24 thẻ, càng ít lượt và càng nhanh càng giỏi.",
    howTo: [
      "Chạm để lật 2 thẻ. Hai hình giống nhau thì giữ lại, khác nhau thì úp xuống.",
      "Tìm hết các cặp để qua cấp. Có 4 cấp, từ 12 thẻ đến 24 thẻ.",
      "Đồng hồ chạy suốt game (dừng khi nghỉ giữa các cấp). Điểm là tổng thời gian.",
      "Mỗi ván các hình và vị trí đều được xáo mới.",
    ],
  },
  "thang-may": {
    description: "Game điều phối thang máy chủ đề văn phòng: chọn ai lên chuyến này, gom người cùng tầng để thang đi nhanh hơn, và đừng để ai chờ lâu đến mức bỏ đi thang bộ. Đơn giản lúc đầu, căng thẳng khi gần 9 giờ.",
    howTo: [
      "Chạm vào nhân viên ở sảnh để chọn người lên thang (tối đa 6 người), rồi bấm “Đi thôi!”.",
      "Thang đi càng cao và dừng càng nhiều tầng thì càng lâu mới quay lại.",
      "Gom 3 người trở lên chỉ đi 1–2 tầng là “chuyến đẹp”, được điểm thưởng.",
      "Ai chờ quá lâu sẽ bỏ đi thang bộ, mất 1 tim. Chơi đến 9:00 hoặc hết tim.",
    ],
  },
  "ban-hop-nghe-gi": {
    description: "Sáng tạo, kỹ thuật, phân tích, chăm sóc, kinh doanh hay tổ chức? Trả lời 12 tình huống quen thuộc ở trường, ở chỗ làm thêm và lúc rảnh để biết nhóm nghề hợp với mình nhất, kèm gợi ý ngành học và kỹ năng nên thử.",
    howTo: [
      "Trả lời 12 tình huống, chọn điều bạn thật sự sẽ làm.",
      "Không có đáp án đúng sai, mỗi lựa chọn nghiêng về một nhóm nghề.",
      "Bấm nút ← để sửa câu trước nếu đổi ý.",
      "Nhận nhóm nghề hợp nhất kèm tỉ lệ từng nhóm, điểm mạnh và gợi ý ngành học.",
      "Đây là trắc nghiệm tham khảo cho vui, không thay thế tư vấn hướng nghiệp chuyên môn.",
    ],
  },
  "ban-la-mon-an-viet-nao": {
    description: "Bài test tính cách vui nhộn: mỗi kiểu người là một món ăn Việt quen thuộc. Trả lời 10 câu hỏi về thói quen và cách bạn đối xử với mọi người, rồi khoe món ăn của mình với bạn bè.",
    howTo: [
      "Trả lời 10 câu hỏi về thói quen và tính cách.",
      "Không có đáp án đúng sai, cứ chọn điều giống bạn nhất.",
      "Bấm nút ← để sửa câu trước nếu đổi ý.",
      "Nhận món ăn của bạn, tỉ lệ từng món và món “hợp cạ” nhất.",
      "Mỗi lần làm là một bộ câu hỏi khác, đáp án cũng được xáo trộn.",
    ],
  },
  "kien-thuc-viet-nam": {
    description: "Bài trắc nghiệm có đáp án đúng sai về Việt Nam: từ Ngô Quyền, Truyện Kiều đến các dòng sông và lễ hội. 15 câu chia đều 4 chủ đề, mỗi câu 20 giây, chấm theo thang điểm 10 và có giải thích sau mỗi câu.",
    howTo: [
      "15 câu, chia đều lịch sử, địa lý, văn hóa và đời sống.",
      "Mỗi câu 20 giây, chọn 1 trong 4 đáp án.",
      "Sau mỗi câu có đáp án đúng và một dòng giải thích.",
      "Chấm theo thang điểm 10, xem lại các câu chưa đúng ở cuối bài.",
      "Mỗi lần làm là bộ câu hỏi khác, câu đã gặp được để sau.",
    ],
  },
  "ma-soi": {
    description: "Ma sói online cho 5–16 người, không cần bài hay quản trò. Mỗi người nhận vai bí mật trên điện thoại; ban đêm sói chọn nạn nhân, tiên tri soi, bảo vệ che chở; ban ngày cả nhóm thảo luận và bỏ phiếu treo cổ.",
    howTo: [
      "Một người tạo phòng, mọi người vào bằng mã phòng hoặc quét QR.",
      "Mỗi người xem vai bí mật: Ma sói, Tiên tri, Bảo vệ hoặc Dân làng.",
      "Ban đêm: sói chọn nạn nhân, Tiên tri soi một người, Bảo vệ che chở một người, tất cả trên điện thoại.",
      "Ban ngày: công bố người chết, thảo luận theo giờ rồi bỏ phiếu treo cổ.",
      "Dân thắng khi diệt hết sói; sói thắng khi số sói bằng số người còn lại.",
    ],
  },
  "ai-hieu-ai": {
    description: "Game chơi nhóm cho hội bạn, đồng nghiệp và buổi team building. Mỗi lượt một người bí mật chọn câu trả lời đúng với mình, những người khác đoán xem người đó chọn gì. Đoán trúng nhiều nhất là người hiểu cả nhóm nhất.",
    howTo: [
      "Một người tạo phòng, mọi người vào bằng mã phòng hoặc quét QR, đến muộn vẫn vào được.",
      "Mỗi lượt một người lên ghế nóng và bí mật chọn câu trả lời đúng với mình.",
      "Những người còn lại đoán xem người đó chọn gì.",
      "Đoán đúng được 100 điểm; người ghế nóng được 50 điểm cho mỗi người đoán trúng.",
      "Ai cũng được lên ghế nóng. Cuối game có bảng xếp hạng.",
    ],
  },
  "ai-de-nhat": {
    description: "Game bình chọn vui cho hội bạn, đồng nghiệp và buổi team building. Mỗi câu hỏi kiểu “Ai dễ ngủ gật trong cuộc họp nhất?”, cả nhóm bí mật bình chọn một người trong phòng. Phiếu ẩn danh; ai chọn trùng số đông được điểm, người được gọi tên nhiều nhất nhận danh hiệu vui.",
    howTo: [
      "Một người tạo phòng, mọi người vào bằng mã phòng hoặc quét QR. Cần ít nhất 3 người, đến muộn vẫn vào được.",
      "Mỗi câu hiện một tình huống vui, ví dụ “Ai dễ quên tắt mic khi họp online nhất?”.",
      "Mọi người bí mật chọn một người khác trong phòng. Chỉ hiện tổng số phiếu, không lộ ai chọn ai.",
      "Chọn trùng người được nhiều phiếu nhất được 100 điểm; người đó nhận danh hiệu và 50 điểm.",
      "Cuối game có bảng xếp hạng và danh sách danh hiệu của từng người.",
    ],
  },
  "noi-tu": {
    description: "Trò chơi nối từ tiếng Việt cho 2 người. Bấm “Tìm đối thủ” để ghép ngẫu nhiên với người đang chờ, tạo phòng gửi link cho bạn bè, hoặc đấu với máy hai mức dễ và khó. Máy chủ kiểm tra từng từ với từ điển hơn 20.000 từ ghép.",
    howTo: [
      "Chọn cách chơi: tìm đối thủ ngẫu nhiên, tạo phòng mời bạn (gửi link hoặc mã phòng), hoặc chơi với máy.",
      "Mỗi hiệp mở đầu bằng một từ. Hai người thay phiên gõ tiếng tiếp theo, ví dụ “học sinh” → “sinh viên”.",
      "Gõ sai không mất lượt, nhưng hết giờ hoặc bỏ cuộc là thua hiệp.",
      "Nói được từ khiến đối thủ không còn từ nào để nối là thắng hiệp ngay.",
      "Ai thắng đủ số hiệp trước (mặc định chạm 3) là thắng trận. Bấm “Chơi lại” để đấu tiếp.",
    ],
  },
  "co-caro": {
    description: "Cờ caro (cờ ca rô) online cho 2 người trên bàn 15×15. Bấm “Tìm đối thủ” để ghép ngẫu nhiên, tạo phòng gửi link cho bạn bè, hoặc chơi với máy hai mức dễ và khó. Có tùy chọn luật chặn hai đầu, mượt trên điện thoại.",
    howTo: [
      "Chọn cách chơi: tìm đối thủ ngẫu nhiên, tạo phòng mời bạn (gửi link hoặc mã phòng), hoặc chơi với máy.",
      "Hai người lần lượt đặt X và O lên bàn 15×15, X đi trước.",
      "Ai có 5 quân liền nhau theo hàng ngang, dọc hoặc chéo trước là thắng ván.",
      "Bật luật chặn hai đầu nếu muốn: 5 quân bị chặn cả hai đầu không tính thắng.",
      "Mỗi nước có giới hạn thời gian; hết giờ là thua ván. Người cầm X đổi sau mỗi ván.",
    ],
  },
};

export const gameDetails = (slug: string): GameDetails => GAME_DETAILS[slug] ?? { description: "" };
