import type { Quiz } from "../engine";

const D = "deadline";
const N = "nhip";
const T = "trasua";
const Y = "ytuong";
const C = "chuachay";

export const DONG_NGHIEP: Quiz = {
  slug: "ban-la-kieu-dong-nghiep-nao",
  title: "Bạn là kiểu đồng nghiệp nào?",
  emoji: "💼",
  intro: "10 tình huống công sở quen thuộc. Cứ chọn điều bạn thật sự sẽ làm, không phải điều sếp muốn nghe!",
  ask: 10,
  types: [
    {
      id: D,
      name: "Chiến thần deadline",
      emoji: "⚡",
      tagline: "Áp lực càng cao, tay gõ càng nhanh.",
      description:
        "Bạn không vội, bạn chỉ chờ đúng thời điểm. Cả tuần trông có vẻ thong thả, nhưng khi đồng hồ điểm giờ G thì bạn bật chế độ siêu tập trung và hoàn thành mọi thứ một cách thần kỳ. Đồng nghiệp vừa nể vừa sợ nhịp tim của bạn.",
      strengths: ["Tập trung cực cao khi có áp lực", "Bình tĩnh trước hạn chót", "Ra quyết định nhanh, không cầu toàn"],
      watchOut: ["Dễ dồn việc tới phút chót", "Người làm cùng hay bị hồi hộp lây", "Ít thời gian để soát lỗi"],
      tips: [
        "Tự đặt deadline giả sớm hơn deadline thật 1 ngày.",
        "Chia việc lớn thành vài mốc nhỏ để có nhiều lần “nước rút” thay vì một lần thức trắng.",
        "Luôn chừa 30 phút cuối để soát lại trước khi gửi.",
      ],
      buddy: N,
    },
    {
      id: N,
      name: "Người giữ nhịp",
      emoji: "📋",
      tagline: "Có bạn, cuộc họp nào cũng có biên bản.",
      description:
        "Bạn là người biết ai đang làm gì, hạn là ngày nào và file nằm ở thư mục nào. Kế hoạch của bạn có màu sắc, có mốc thời gian và có cả phương án dự phòng. Nhóm nào có bạn thì mọi thứ chạy đều như một chiếc đồng hồ.",
      strengths: ["Tổ chức, lên kế hoạch xuất sắc", "Đáng tin, luôn đúng hẹn", "Giúp cả nhóm nhìn rõ bức tranh chung"],
      watchOut: ["Dễ căng thẳng khi kế hoạch bị phá", "Hay ôm việc nhắc nhở cho cả nhóm", "Đôi khi cầu toàn quá mức"],
      tips: [
        "Chừa sẵn 20% thời gian trống trong kế hoạch cho những việc phát sinh.",
        "Giao việc nhắc deadline cho công cụ (lịch, checklist chung) thay vì tự nhắc từng người.",
        "Thử một buổi chiều không lịch họp mỗi tuần để làm việc sâu.",
      ],
      buddy: Y,
    },
    {
      id: T,
      name: "Đại sứ trà sữa",
      emoji: "🧋",
      tagline: "Người kết nối, nguồn năng lượng của cả phòng.",
      description:
        "Bạn nhớ sinh nhật mọi người, biết quán nào ngon và luôn là người mở lời rủ cả phòng đi ăn. Nhờ bạn mà người mới thấy ấm áp, còn những ngày căng thẳng bớt nặng nề hơn. Bạn chính là chất keo giữ cho team gắn kết.",
      strengths: ["Giao tiếp, kết nối con người", "Tạo không khí tích cực", "Giỏi hòa giải khi có mâu thuẫn"],
      watchOut: ["Dễ bị cuốn vào trò chuyện, quên việc riêng", "Khó từ chối khi được nhờ", "Đôi khi bị xem nhẹ năng lực chuyên môn"],
      tips: [
        "Đặt khung giờ “không làm phiền” để tập trung việc chính.",
        "Tập nói “để mình xong việc này rồi giúp nhé” thay vì nhận ngay.",
        "Biến khả năng kết nối thành lợi thế: nhận các việc cần phối hợp nhiều phòng ban.",
      ],
      buddy: C,
    },
    {
      id: Y,
      name: "Ngôi sao ý tưởng",
      emoji: "💡",
      tagline: "Mỗi ngày một ý tưởng, mỗi tuần một kế hoạch táo bạo.",
      description:
        "Trong buổi brainstorm, bạn là người nói “hay là mình thử…” nhiều nhất. Bạn nhìn vấn đề từ góc lạ, thích cái mới và chán ngấy sự lặp lại. Nhiều dự án thú vị nhất của công ty bắt đầu từ một câu nói bâng quơ của bạn.",
      strengths: ["Sáng tạo, nhiều góc nhìn mới", "Truyền cảm hứng cho người khác", "Không ngại thử nghiệm"],
      watchOut: ["Hay bắt đầu nhiều hơn kết thúc", "Dễ chán việc lặp lại", "Ý tưởng đôi khi đi trước nguồn lực"],
      tips: [
        "Ghi mọi ý tưởng vào một nơi, mỗi tuần chọn đúng một cái để làm tới cùng.",
        "Bắt cặp với một người giữ nhịp để biến ý tưởng thành kế hoạch.",
        "Thử nghiệm nhỏ trước, xin nguồn lực lớn sau.",
      ],
      buddy: N,
    },
    {
      id: C,
      name: "Người chữa cháy",
      emoji: "🧯",
      tagline: "Sự cố ở đâu, bạn có mặt ở đó.",
      description:
        "Hệ thống lỗi, khách hàng nổi giận, file mất lúc nửa đêm: ai cũng nghĩ ngay đến bạn. Bạn bình tĩnh, thực tế và luôn tìm ra cách xử lý. Bạn không cần ánh hào quang, chỉ cần mọi thứ chạy ổn trở lại.",
      strengths: ["Xử lý sự cố nhanh và bình tĩnh", "Thực tế, giỏi tìm giải pháp", "Được tin tưởng tuyệt đối"],
      watchOut: ["Dễ bị gọi vào mọi việc, kể cả không phải của mình", "Ít thời gian cho việc dài hạn", "Hay quên ghi nhận công sức bản thân"],
      tips: [
        "Sau mỗi sự cố, viết lại 3 dòng nguyên nhân và cách phòng để lần sau không phải chữa nữa.",
        "Hướng dẫn thêm một người biết xử lý để bạn không phải trực 24/7.",
        "Nhớ kể lại những lần chữa cháy thành công trong buổi đánh giá cuối năm.",
      ],
      buddy: T,
    },
  ],
  pool: [
    {
      id: "dn-sang-thu-hai",
      text: "Sáng thứ Hai đến công ty, việc đầu tiên bạn làm là gì?",
      options: [
        { text: "Mở danh sách việc tuần này, sắp xếp lại thứ tự ưu tiên", scores: { [N]: 2 } },
        { text: "Chào cả phòng và hỏi cuối tuần mọi người đi đâu chơi", scores: { [T]: 2 } },
        { text: "Kiểm tra xem cuối tuần có sự cố gì cần xử lý ngay không", scores: { [C]: 2 } },
        { text: "Pha cà phê, việc gấp thì để chiều tính", scores: { [D]: 2 } },
      ],
    },
    {
      id: "dn-hop-dot-xuat",
      text: "Sếp triệu tập họp đột xuất để bàn về một dự án mới. Bạn sẽ…",
      options: [
        { text: "Tuôn ra một tràng ý tưởng ngay khi sếp vừa dứt lời", scores: { [Y]: 2 } },
        { text: "Mở laptop ghi biên bản và chốt ai làm gì", scores: { [N]: 2 } },
        { text: "Hỏi ngay: dự án này có rủi ro gì cần lường trước?", scores: { [C]: 2 } },
        { text: "Hỏi câu quan trọng nhất: hạn chót là khi nào?", scores: { [D]: 2 } },
      ],
    },
    {
      id: "dn-deadline-mai",
      text: "Còn 1 ngày nữa là hạn nộp báo cáo, bạn đang ở đâu?",
      options: [
        { text: "Mới làm được 20%, nhưng mình hiểu sức mình", scores: { [D]: 2 } },
        { text: "Xong từ tuần trước, đang soát lại lần cuối", scores: { [N]: 2 } },
        { text: "Đang làm dở vì vừa phải chạy đi giúp phòng khác sửa lỗi", scores: { [C]: 2, [T]: 1 } },
        { text: "Đang muốn làm lại theo một hướng hoàn toàn mới hay hơn", scores: { [Y]: 2 } },
      ],
    },
    {
      id: "dn-dong-nghiep-moi",
      text: "Phòng có thành viên mới, bạn làm gì?",
      options: [
        { text: "Rủ đi ăn trưa ngay ngày đầu và giới thiệu với cả phòng", scores: { [T]: 2 } },
        { text: "Gửi tài liệu hướng dẫn và lịch làm quen công việc tuần đầu", scores: { [N]: 2 } },
        { text: "Chỉ những “hố” hay gặp và cách xử lý khi hệ thống trục trặc", scores: { [C]: 2 } },
        { text: "Hỏi xem bạn ấy có ý tưởng gì mới từ chỗ làm cũ", scores: { [Y]: 2 } },
      ],
    },
    {
      id: "dn-he-thong-sap",
      text: "16h55 chiều thứ Sáu, hệ thống báo lỗi. Phản ứng của bạn?",
      options: [
        { text: "Xắn tay áo, mở log ra xem ngay", scores: { [C]: 2 } },
        { text: "Báo cho đúng người phụ trách và ghi lại sự cố", scores: { [N]: 2 } },
        { text: "Nhắn nhóm chat động viên mọi người và gọi đồ ăn cho ai ở lại", scores: { [T]: 2 } },
        { text: "Nghĩ xem có cách nào làm lại cho nó không bao giờ lỗi kiểu này nữa", scores: { [Y]: 2, [C]: 1 } },
      ],
    },
    {
      id: "dn-team-building",
      text: "Công ty giao bạn lo chuyến team building. Bạn sẽ…",
      options: [
        { text: "Lập bảng tính chi tiết từ xe, phòng đến lịch trình từng giờ", scores: { [N]: 2 } },
        { text: "Đề xuất một concept chưa ai làm: cắm trại kết hợp săn kho báu", scores: { [Y]: 2 } },
        { text: "Hỏi ý kiến từng người và lo phần trò chơi gắn kết", scores: { [T]: 2 } },
        { text: "Tuần trước khi đi mới chốt, nhưng chắc chắn sẽ vui", scores: { [D]: 2 } },
      ],
    },
    {
      id: "dn-email-sep",
      text: "23h đêm sếp gửi email “Em xem giúp anh cái này nhé”. Bạn…",
      options: [
        { text: "Mở ra xem ngay, lỡ có chuyện gấp", scores: { [C]: 2 } },
        { text: "Đánh dấu, sáng mai xếp vào danh sách việc", scores: { [N]: 2 } },
        { text: "Sáng mai làm, vì việc gì cũng xong được trong 2 tiếng", scores: { [D]: 2 } },
        { text: "Đọc xong nghĩ ra luôn 3 cách làm khác nhau", scores: { [Y]: 2 } },
      ],
    },
    {
      id: "dn-gio-an-trua",
      text: "Giờ ăn trưa của bạn thường thế nào?",
      options: [
        { text: "Đi ăn cùng hội đông vui, chuyện trò rôm rả", scores: { [T]: 2 } },
        { text: "Ăn nhanh tại bàn vì đang chạy việc gấp", scores: { [D]: 2, [C]: 1 } },
        { text: "Đúng 12h đi, 13h về, ngày nào cũng như ngày nào", scores: { [N]: 2 } },
        { text: "Thử một quán mới toanh vừa mở gần công ty", scores: { [Y]: 2 } },
      ],
    },
    {
      id: "dn-bao-cao-thang",
      text: "Báo cáo cuối tháng của bạn trông như thế nào?",
      options: [
        { text: "Đúng mẫu, đủ số liệu, nộp đúng giờ", scores: { [N]: 2 } },
        { text: "Có biểu đồ đẹp và một góc nhìn mới mà chưa ai nghĩ tới", scores: { [Y]: 2 } },
        { text: "Hoàn thành lúc 2h sáng nhưng chất lượng không chê vào đâu được", scores: { [D]: 2 } },
        { text: "Ngắn gọn, tập trung vào vấn đề đã xử lý và việc cần làm tiếp", scores: { [C]: 2 } },
      ],
    },
    {
      id: "dn-cai-nhau",
      text: "Hai đồng nghiệp tranh luận căng thẳng trong cuộc họp. Bạn…",
      options: [
        { text: "Pha trò cho không khí dịu lại rồi mời cả hai đi uống nước", scores: { [T]: 2 } },
        { text: "Đề nghị quay lại mục tiêu cuộc họp và thời gian còn lại", scores: { [N]: 2 } },
        { text: "Đưa ra phương án thứ ba kết hợp ý của cả hai", scores: { [Y]: 2, [T]: 1 } },
        { text: "Tìm điểm mấu chốt đang gây vướng và đề xuất cách gỡ cụ thể", scores: { [C]: 2 } },
      ],
    },
    {
      id: "dn-ban-lam-viec",
      text: "Bàn làm việc của bạn trông như thế nào?",
      options: [
        { text: "Gọn gàng, giấy tờ có nhãn, bút xếp theo màu", scores: { [N]: 2 } },
        { text: "Đầy giấy nhớ ghi ý tưởng dán khắp màn hình", scores: { [Y]: 2 } },
        { text: "Có bánh kẹo, ai đi ngang cũng ghé lấy một cái", scores: { [T]: 2 } },
        { text: "Hơi lộn xộn, nhưng cần gì là mình tìm ra ngay", scores: { [D]: 2, [C]: 1 } },
      ],
    },
    {
      id: "dn-viec-moi",
      text: "Sếp giao một việc bạn chưa từng làm bao giờ. Bạn…",
      options: [
        { text: "Hào hứng, cuối cùng cũng có thứ mới để thử", scores: { [Y]: 2 } },
        { text: "Hỏi rõ yêu cầu, kết quả mong muốn và hạn chót", scores: { [N]: 2 } },
        { text: "Hỏi khắp nơi xem ai từng làm để học hỏi", scores: { [T]: 2 } },
        { text: "Cứ làm, gặp vấn đề tới đâu thì giải quyết tới đó", scores: { [C]: 2, [D]: 1 } },
      ],
    },
    {
      id: "dn-tang-ca",
      text: "Cả team phải tăng ca để kịp ra mắt sản phẩm. Vai trò của bạn?",
      options: [
        { text: "Người đặt pizza và giữ tinh thần cả team", scores: { [T]: 2 } },
        { text: "Người làm việc năng suất nhất khi đồng hồ chỉ 23h", scores: { [D]: 2 } },
        { text: "Người sửa những lỗi cuối cùng ngay trước giờ ra mắt", scores: { [C]: 2 } },
        { text: "Người cập nhật tiến độ để biết còn bao nhiêu việc", scores: { [N]: 2 } },
      ],
    },
    {
      id: "dn-danh-gia-cuoi-nam",
      text: "Trong buổi đánh giá cuối năm, sếp thường khen bạn điều gì?",
      options: [
        { text: "“Em làm việc rất có kế hoạch, ai cũng yên tâm”", scores: { [N]: 2 } },
        { text: "“Nhờ em mà không khí phòng mình vui hẳn”", scores: { [T]: 2 } },
        { text: "“Em có nhiều sáng kiến cho công ty”", scores: { [Y]: 2 } },
        { text: "“Lúc nguy cấp nhất luôn có em”", scores: { [C]: 2, [D]: 1 } },
      ],
    },
  ],
};
