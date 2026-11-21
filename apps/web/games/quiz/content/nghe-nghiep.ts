import type { Quiz } from "../engine";

const ST = "sang-tao";
const KT = "ky-thuat";
const PT = "phan-tich";
const CS = "cham-soc";
const KD = "kinh-doanh";
const TC = "to-chuc";

export const NGHE_NGHIEP: Quiz = {
  slug: "ban-hop-nghe-gi",
  title: "Bạn hợp nghề gì?",
  emoji: "🧭",
  intro: "12 tình huống quen thuộc ở trường, chỗ làm thêm và lúc rảnh rỗi. Không có đáp án đúng sai, cứ chọn điều bạn thật sự sẽ làm!",
  ask: 12,
  types: [
    {
      id: ST,
      name: "Nhóm Sáng tạo",
      emoji: "🎨",
      tagline: "Ý tưởng là nguyên liệu, thế giới là trang giấy trắng.",
      description:
        "Bạn nhìn mọi thứ bằng con mắt riêng và luôn muốn biến ý tưởng thành thứ người khác nhìn thấy, nghe thấy, cảm nhận được. Bạn thấy hứng thú nhất khi được tự do thể hiện, dù là một bức hình, một đoạn video hay một câu chuyện.",
      strengths: ["Trí tưởng tượng phong phú", "Nhạy cảm với cái đẹp và cảm xúc", "Dám nghĩ khác, không đi lối mòn"],
      watchOut: ["Dễ chán việc lặp đi lặp lại", "Hay cầu toàn nên trễ hạn", "Đôi khi khó giải thích ý tưởng bằng số liệu"],
      tips: [
        "Xây portfolio từ sớm: mỗi tháng một sản phẩm nhỏ như poster, video ngắn hay bài viết.",
        "Thử học Figma, Canva, CapCut hoặc viết blog để xem mình hợp mảng nào nhất.",
        "Ngành gợi ý: thiết kế đồ họa, truyền thông đa phương tiện, kiến trúc, marketing nội dung, sản xuất video.",
      ],
      buddy: KD,
    },
    {
      id: KT,
      name: "Nhóm Kỹ thuật – Công nghệ",
      emoji: "🛠️",
      tagline: "Thấy cái gì hỏng là muốn mở ra xem bên trong.",
      description:
        "Bạn thích hiểu mọi thứ vận hành ra sao và tự tay làm cho nó chạy. Từ sửa máy tính, lắp ráp đồ chơi đến viết vài dòng code, bạn thấy vui khi giải quyết được một vấn đề cụ thể bằng công cụ phù hợp.",
      strengths: ["Tư duy logic, giải quyết vấn đề tốt", "Học công cụ mới nhanh", "Kiên nhẫn mày mò đến khi xong"],
      watchOut: ["Dễ mải mê chi tiết kỹ thuật mà quên mục tiêu chung", "Ít khi chia sẻ tiến độ cho người khác", "Hay đánh giá thấp kỹ năng giao tiếp"],
      tips: [
        "Bắt đầu với một khóa lập trình miễn phí và làm ngay một dự án nhỏ, ví dụ trang web cá nhân.",
        "Tham gia câu lạc bộ robot, cuộc thi khoa học kỹ thuật hoặc hackathon để học cùng người khác.",
        "Ngành gợi ý: công nghệ thông tin, kỹ thuật điện – điện tử, cơ khí, tự động hóa, an toàn thông tin.",
      ],
      buddy: PT,
    },
    {
      id: PT,
      name: "Nhóm Phân tích – Dữ liệu – Tài chính",
      emoji: "📊",
      tagline: "Có số liệu thì mới yên tâm quyết định.",
      description:
        "Bạn thích tìm quy luật đằng sau những con số và đưa ra kết luận có căn cứ. Bạn hay so sánh, tính toán và đặt câu hỏi “tại sao” trước khi tin vào điều gì đó. Người khác thường tìm đến bạn khi cần một góc nhìn tỉnh táo.",
      strengths: ["Tư duy phản biện sắc bén", "Cẩn thận, chính xác", "Biết biến dữ liệu rối thành thông tin rõ ràng"],
      watchOut: ["Dễ phân tích quá lâu mà chậm hành động", "Đôi khi bị xem là khô khan", "Khó chịu khi phải quyết định thiếu thông tin"],
      tips: [
        "Học Excel thật chắc, sau đó thử Google Sheets nâng cao, SQL hoặc Python cho phân tích dữ liệu.",
        "Tập phân tích một chủ đề bạn thích, như chi tiêu cá nhân hay thống kê bóng đá, rồi trình bày bằng biểu đồ.",
        "Ngành gợi ý: tài chính – ngân hàng, kế toán – kiểm toán, khoa học dữ liệu, kinh tế học, thống kê.",
      ],
      buddy: TC,
    },
    {
      id: CS,
      name: "Nhóm Chăm sóc – Giáo dục – Y tế",
      emoji: "🤝",
      tagline: "Thấy người khác tiến bộ là mình vui cả ngày.",
      description:
        "Bạn quan tâm đến cảm xúc của người xung quanh và có năng lượng tích cực khi được giúp đỡ, lắng nghe hay hướng dẫn ai đó. Bạn kiên nhẫn, biết đặt mình vào vị trí người khác và thường là người bạn bè tìm đến để tâm sự.",
      strengths: ["Biết lắng nghe và thấu hiểu", "Kiên nhẫn, tận tâm", "Tạo được sự tin tưởng nhanh"],
      watchOut: ["Hay ôm việc của người khác vào mình", "Khó từ chối khi được nhờ", "Dễ kiệt sức nếu quên chăm sóc bản thân"],
      tips: [
        "Thử làm gia sư, trợ giảng hoặc tình nguyện viên để xem bạn thích làm việc với nhóm người nào.",
        "Rèn kỹ năng giao tiếp và sơ cứu cơ bản qua các khóa ngắn hạn của trường hoặc tổ chức uy tín.",
        "Ngành gợi ý: sư phạm, tâm lý học, công tác xã hội, điều dưỡng, y dược, quản trị nhân sự.",
      ],
      buddy: KD,
    },
    {
      id: KD,
      name: "Nhóm Kinh doanh – Lãnh đạo",
      emoji: "🚀",
      tagline: "Có cơ hội là phải thử, có mục tiêu là phải chốt.",
      description:
        "Bạn thích thuyết phục, dẫn dắt và biến ý tưởng thành kết quả có thể đo được. Bạn không ngại đứng trước đám đông, nhanh nhạy với cơ hội và thường là người khởi xướng những kế hoạch mới trong nhóm.",
      strengths: ["Tự tin, giao tiếp thuyết phục", "Dám chịu rủi ro, dám quyết", "Truyền động lực cho người khác"],
      watchOut: ["Dễ nóng vội, bỏ qua chi tiết", "Hay ôm nhiều kế hoạch cùng lúc", "Có lúc lấn át ý kiến của người khác"],
      tips: [
        "Thử bán một món nhỏ online hoặc tổ chức một sự kiện ở trường để trải nghiệm kinh doanh thật.",
        "Tham gia câu lạc bộ khởi nghiệp, tranh biện hoặc ứng tuyển vị trí trưởng nhóm để rèn kỹ năng dẫn dắt.",
        "Ngành gợi ý: quản trị kinh doanh, marketing, kinh doanh quốc tế, thương mại điện tử, quản trị khách sạn – du lịch.",
      ],
      buddy: TC,
    },
    {
      id: TC,
      name: "Nhóm Tổ chức – Vận hành",
      emoji: "🗂️",
      tagline: "Mọi thứ đúng chỗ, đúng giờ là mọi thứ ổn.",
      description:
        "Bạn giỏi sắp xếp, lên kế hoạch và giữ cho công việc chạy trơn tru. Trong khi người khác còn đang bàn ý tưởng, bạn đã có danh sách việc cần làm, người phụ trách và hạn chót. Nhóm nào có bạn cũng bớt rối hẳn.",
      strengths: ["Ngăn nắp, có kế hoạch rõ ràng", "Đáng tin, luôn đúng hẹn", "Nhìn ra chỗ chưa hợp lý trong quy trình"],
      watchOut: ["Dễ căng thẳng khi kế hoạch bị thay đổi", "Đôi khi cứng nhắc với quy tắc", "Hay tự làm thay vì giao việc"],
      tips: [
        "Tập dùng Notion, Trello hoặc Google Calendar để quản lý việc học và việc nhóm.",
        "Nhận vai trò hậu cần trong một sự kiện hoặc câu lạc bộ để rèn kỹ năng điều phối.",
        "Ngành gợi ý: logistics và chuỗi cung ứng, quản trị văn phòng, quản lý dự án, hành chính công, quản trị vận hành.",
      ],
      buddy: PT,
    },
  ],
  pool: [
    {
      id: "nn-du-an-nhom",
      text: "Làm dự án nhóm trên lớp, bạn thường tự nhận phần nào?",
      options: [
        { text: "Thiết kế slide và hình ảnh cho thật bắt mắt", scores: { [ST]: 2 } },
        { text: "Tìm số liệu, khảo sát và rút ra kết luận", scores: { [PT]: 2 } },
        { text: "Chia việc, đặt hạn chót và nhắc mọi người", scores: { [TC]: 2 } },
        { text: "Đứng lên thuyết trình trước cả lớp", scores: { [KD]: 2 } },
      ],
    },
    {
      id: "nn-may-tinh-hong",
      text: "Máy tính của bạn bè bỗng dưng không lên nguồn. Bạn…",
      options: [
        { text: "Xin mở ra xem thử, biết đâu sửa được", scores: { [KT]: 2 } },
        { text: "Hỏi kỹ xem trước đó đã xảy ra chuyện gì để đoán nguyên nhân", scores: { [PT]: 2, [KT]: 1 } },
        { text: "Trấn an bạn và cho mượn máy mình dùng tạm", scores: { [CS]: 2 } },
        { text: "Liệt kê vài tiệm sửa uy tín, gọi hỏi giá giúp bạn", scores: { [TC]: 2 } },
      ],
    },
    {
      id: "nn-lam-them",
      text: "Nếu được chọn một công việc làm thêm mùa hè, bạn chọn…",
      options: [
        { text: "Gia sư hoặc trợ giảng lớp hè cho các em nhỏ", scores: { [CS]: 2 } },
        { text: "Bán hàng, tư vấn khách ở cửa hàng", scores: { [KD]: 2 } },
        { text: "Chụp ảnh, quay dựng video cho quán cà phê", scores: { [ST]: 2 } },
        { text: "Hỗ trợ kỹ thuật, cài đặt phần mềm cho văn phòng", scores: { [KT]: 2 } },
      ],
    },
    {
      id: "nn-mon-hoc",
      text: "Trong các môn ở trường, kiểu bài nào khiến bạn hứng thú nhất?",
      options: [
        { text: "Bài toán có nhiều cách giải, phải lập luận chặt chẽ", scores: { [PT]: 2 } },
        { text: "Thí nghiệm, thực hành, được tự tay làm", scores: { [KT]: 2 } },
        { text: "Viết văn, vẽ, làm sản phẩm tự do theo ý mình", scores: { [ST]: 2 } },
        { text: "Thảo luận về con người, xã hội và cách giúp đỡ cộng đồng", scores: { [CS]: 2 } },
      ],
    },
    {
      id: "nn-su-kien-lop",
      text: "Lớp chuẩn bị tổ chức một buổi dã ngoại. Bạn xung phong…",
      options: [
        { text: "Lên lịch trình chi tiết, danh sách đồ cần mang", scores: { [TC]: 2 } },
        { text: "Đi xin tài trợ và thương lượng giá xe", scores: { [KD]: 2 } },
        { text: "Nghĩ trò chơi và làm áo đồng phục cho lớp", scores: { [ST]: 2 } },
        { text: "Chuẩn bị túi thuốc cơ bản, để ý các bạn bị say xe", scores: { [CS]: 2, [TC]: 1 } },
      ],
    },
    {
      id: "nn-tien-tiet-kiem",
      text: "Bạn có một khoản tiền tiết kiệm nho nhỏ. Bạn sẽ…",
      options: [
        { text: "Lập bảng tính, chia khoản chi tiêu và tiết kiệm", scores: { [PT]: 2, [TC]: 1 } },
        { text: "Nhập ít hàng về bán thử xem có lời không", scores: { [KD]: 2 } },
        { text: "Mua linh kiện để tự lắp một món đồ công nghệ", scores: { [KT]: 2 } },
        { text: "Đăng ký một khóa học vẽ hoặc nhiếp ảnh", scores: { [ST]: 2 } },
      ],
    },
    {
      id: "nn-ban-buon",
      text: "Một người bạn nhắn tin than đang rất áp lực chuyện học. Bạn…",
      options: [
        { text: "Gọi điện ngay, lắng nghe bạn kể hết", scores: { [CS]: 2 } },
        { text: "Giúp bạn lập lại thời gian biểu cho hợp lý", scores: { [TC]: 2, [CS]: 1 } },
        { text: "Cùng bạn xem môn nào yếu nhất để ưu tiên ôn", scores: { [PT]: 2 } },
        { text: "Rủ bạn đi chơi cuối tuần, bao luôn trà sữa", scores: { [KD]: 2 } },
      ],
    },
    {
      id: "nn-cuoi-tuan",
      text: "Một buổi chiều cuối tuần rảnh rỗi, bạn thường…",
      options: [
        { text: "Vẽ, chơi nhạc hoặc quay một video ngắn", scores: { [ST]: 2 } },
        { text: "Xem video công nghệ, mày mò một ứng dụng mới", scores: { [KT]: 2 } },
        { text: "Dọn dẹp góc học tập, lên kế hoạch cho tuần tới", scores: { [TC]: 2 } },
        { text: "Đọc tin tức kinh tế hoặc xem thống kê thể thao", scores: { [PT]: 2 } },
      ],
    },
    {
      id: "nn-clb",
      text: "Đầu năm học, câu lạc bộ nào khiến bạn muốn đăng ký nhất?",
      options: [
        { text: "Câu lạc bộ khởi nghiệp hoặc tranh biện", scores: { [KD]: 2 } },
        { text: "Câu lạc bộ tình nguyện", scores: { [CS]: 2 } },
        { text: "Câu lạc bộ lập trình, robot", scores: { [KT]: 2 } },
        { text: "Câu lạc bộ truyền thông, thiết kế", scores: { [ST]: 2, [KD]: 1 } },
      ],
    },
    {
      id: "nn-nhom-cai-nhau",
      text: "Nhóm làm bài bất đồng ý kiến, không khí căng thẳng. Bạn…",
      options: [
        { text: "Hỏi ý từng người để ai cũng thấy được lắng nghe", scores: { [CS]: 2 } },
        { text: "Đề nghị so sánh ưu nhược điểm từng phương án", scores: { [PT]: 2 } },
        { text: "Đứng ra chốt một hướng để cả nhóm đi tiếp", scores: { [KD]: 2 } },
        { text: "Đề xuất chia việc rõ ràng để ai làm phần nấy", scores: { [TC]: 2 } },
      ],
    },
    {
      id: "nn-ung-dung-moi",
      text: "Trường vừa đưa vào dùng một ứng dụng học tập mới. Bạn…",
      options: [
        { text: "Khám phá hết các tính năng ẩn trong một tối", scores: { [KT]: 2 } },
        { text: "Viết hướng dẫn ngắn gọn để cả lớp cùng dùng", scores: { [TC]: 2, [CS]: 1 } },
        { text: "Kèm mấy bạn chưa quen cách dùng", scores: { [CS]: 2 } },
        { text: "Góp ý giao diện nên đổi màu, đổi bố cục cho đẹp hơn", scores: { [ST]: 2 } },
      ],
    },
    {
      id: "nn-khen",
      text: "Lời khen nào làm bạn vui nhất?",
      options: [
        { text: "“Ý tưởng của cậu độc đáo thật!”", scores: { [ST]: 2 } },
        { text: "“Cậu phân tích chuẩn quá, đúng y như vậy.”", scores: { [PT]: 2 } },
        { text: "“Nhờ cậu mà mình thấy nhẹ lòng hơn.”", scores: { [CS]: 2 } },
        { text: "“Có cậu dẫn dắt nên nhóm mới làm được.”", scores: { [KD]: 2 } },
      ],
    },
    {
      id: "nn-quan-ca-phe",
      text: "Bạn làm thêm ở một quán cà phê đang vắng khách. Bạn đề xuất…",
      options: [
        { text: "Chạy chương trình khuyến mãi và đi phát tờ rơi", scores: { [KD]: 2 } },
        { text: "Xem doanh thu theo giờ để biết khách vắng lúc nào, vì sao", scores: { [PT]: 2 } },
        { text: "Trang trí lại góc chụp ảnh cho thật xinh", scores: { [ST]: 2, [KD]: 1 } },
        { text: "Sắp xếp lại quầy pha chế cho khách đỡ phải chờ", scores: { [TC]: 2 } },
      ],
    },
    {
      id: "nn-video-hoc",
      text: "Lướt mạng xã hội, kiểu video nào khiến bạn xem hết không bỏ?",
      options: [
        { text: "Hướng dẫn tự làm đồ điện tử, mẹo công nghệ", scores: { [KT]: 2 } },
        { text: "Quá trình vẽ tranh, làm phim, thiết kế", scores: { [ST]: 2 } },
        { text: "Câu chuyện khởi nghiệp của một thương hiệu", scores: { [KD]: 2 } },
        { text: "Mẹo sắp xếp nhà cửa, quản lý thời gian", scores: { [TC]: 2 } },
      ],
    },
    {
      id: "nn-thi-khoa-hoc",
      text: "Trường tổ chức cuộc thi sáng tạo khoa học. Nhóm bạn cần bạn làm gì?",
      options: [
        { text: "Lắp ráp mô hình và viết phần điều khiển", scores: { [KT]: 2 } },
        { text: "Đo đạc, ghi số liệu thí nghiệm và vẽ biểu đồ", scores: { [PT]: 2, [KT]: 1 } },
        { text: "Thuyết phục ban giám khảo bằng phần trình bày", scores: { [KD]: 2 } },
        { text: "Quản lý tiến độ và chuẩn bị hồ sơ dự thi", scores: { [TC]: 2 } },
      ],
    },
    {
      id: "nn-em-hoc-kem",
      text: "Em họ nhờ bạn kèm môn Toán vì sắp thi. Bạn…",
      options: [
        { text: "Kiên nhẫn giảng lại từ đầu, động viên em", scores: { [CS]: 2 } },
        { text: "Làm bài kiểm tra nhỏ để biết em hổng phần nào", scores: { [PT]: 2 } },
        { text: "Lập lịch ôn tập theo từng tuần đến ngày thi", scores: { [TC]: 2 } },
        { text: "Tìm ứng dụng, trò chơi giúp em học vui hơn", scores: { [KT]: 2, [ST]: 1 } },
      ],
    },
    {
      id: "nn-ngay-lam-viec",
      text: "Bạn hình dung một ngày làm việc lý tưởng của mình là…",
      options: [
        { text: "Ngồi với ý tưởng mới, tự do sáng tác", scores: { [ST]: 2 } },
        { text: "Giải quyết một bài toán kỹ thuật khó", scores: { [KT]: 2 } },
        { text: "Gặp khách hàng, đàm phán và chốt hợp đồng", scores: { [KD]: 2 } },
        { text: "Giúp đỡ, hướng dẫn hoặc chăm sóc người khác", scores: { [CS]: 2 } },
      ],
    },
    {
      id: "nn-mua-dien-thoai",
      text: "Bạn sắp mua điện thoại mới. Bạn chọn thế nào?",
      options: [
        { text: "Lập bảng so sánh giá, cấu hình, đánh giá các mẫu", scores: { [PT]: 2 } },
        { text: "Đọc kỹ thông số chip, camera, thử tính năng tận tay", scores: { [KT]: 2 } },
        { text: "Chọn mẫu có thiết kế và màu sắc mình thích", scores: { [ST]: 2 } },
        { text: "Mặc cả khéo để được giá tốt và thêm quà", scores: { [KD]: 2 } },
      ],
    },
    {
      id: "nn-ban-moi",
      text: "Lớp có bạn mới chuyển đến, còn bỡ ngỡ. Bạn…",
      options: [
        { text: "Chủ động bắt chuyện, rủ bạn ăn trưa cùng", scores: { [CS]: 2 } },
        { text: "Giới thiệu bạn với cả nhóm và các câu lạc bộ", scores: { [KD]: 2, [CS]: 1 } },
        { text: "Gửi bạn thời khóa biểu và danh sách việc cần chuẩn bị", scores: { [TC]: 2 } },
        { text: "Chỉ bạn cách đăng nhập hệ thống học online của trường", scores: { [KT]: 2 } },
      ],
    },
    {
      id: "nn-ke-hoach-hong",
      text: "Kế hoạch đã chuẩn bị kỹ bỗng bị thay đổi phút chót. Bạn…",
      options: [
        { text: "Nhanh chóng sắp xếp lại các đầu việc và báo cho mọi người", scores: { [TC]: 2 } },
        { text: "Coi đây là cơ hội thử một cách làm mới", scores: { [ST]: 2 } },
        { text: "Xem lại thông tin mới để đánh giá rủi ro trước đã", scores: { [PT]: 2 } },
        { text: "Hỏi thăm xem mọi người có ổn không, có ai cần giúp không", scores: { [CS]: 2 } },
      ],
    },
    {
      id: "nn-phan-thuong",
      text: "Bạn thắng một suất học bổng ngắn hạn tự chọn. Bạn chọn khóa…",
      options: [
        { text: "Lập trình ứng dụng hoặc trí tuệ nhân tạo", scores: { [KT]: 2 } },
        { text: "Phân tích dữ liệu hoặc đầu tư tài chính cơ bản", scores: { [PT]: 2 } },
        { text: "Kỹ năng lãnh đạo và bán hàng", scores: { [KD]: 2 } },
        { text: "Quản lý dự án và kỹ năng làm việc hiệu quả", scores: { [TC]: 2 } },
      ],
    },
    {
      id: "nn-goc-hoc-tap",
      text: "Góc học tập của bạn trông như thế nào?",
      options: [
        { text: "Đầy giấy nhớ màu, tranh vẽ và đồ trang trí tự làm", scores: { [ST]: 2 } },
        { text: "Gọn gàng, mỗi thứ có một chỗ riêng", scores: { [TC]: 2 } },
        { text: "Dây sạc, tai nghe, linh kiện ở khắp nơi", scores: { [KT]: 2 } },
        { text: "Có ảnh bạn bè và vài lá thư tay được tặng", scores: { [CS]: 2 } },
      ],
    },
    {
      id: "nn-tin-don",
      text: "Trên mạng lan truyền một thông tin gây sốc. Bạn…",
      options: [
        { text: "Tìm nguồn gốc, đối chiếu nhiều trang trước khi tin", scores: { [PT]: 2 } },
        { text: "Nhắc người thân đừng hoảng và đừng chia sẻ vội", scores: { [CS]: 2, [PT]: 1 } },
        { text: "Làm một bức ảnh tóm tắt dễ hiểu để mọi người cùng kiểm chứng", scores: { [ST]: 2 } },
        { text: "Thử kiểm tra ảnh, video xem có bị chỉnh sửa không", scores: { [KT]: 2 } },
      ],
    },
    {
      id: "nn-truong-nhom",
      text: "Cô giáo bất ngờ chọn bạn làm trưởng nhóm. Việc đầu tiên bạn làm là…",
      options: [
        { text: "Truyền lửa cho cả nhóm bằng một mục tiêu thật rõ", scores: { [KD]: 2 } },
        { text: "Lập bảng phân công và mốc thời gian", scores: { [TC]: 2, [KD]: 1 } },
        { text: "Hỏi từng bạn thích và giỏi phần nào", scores: { [CS]: 2 } },
        { text: "Xem lại tiêu chí chấm điểm để biết cần tập trung vào đâu", scores: { [PT]: 2 } },
      ],
    },
    {
      id: "nn-noi-lam-viec",
      text: "Môi trường làm việc nào khiến bạn thấy thoải mái nhất?",
      options: [
        { text: "Studio tự do, được bày bừa theo cảm hứng", scores: { [ST]: 2 } },
        { text: "Xưởng hoặc phòng lab đầy máy móc", scores: { [KT]: 2 } },
        { text: "Văn phòng năng động, nhiều cuộc gặp gỡ", scores: { [KD]: 2 } },
        { text: "Lớp học, bệnh viện hay nơi được gặp và giúp nhiều người", scores: { [CS]: 2 } },
      ],
    },
    {
      id: "nn-loi-sai",
      text: "Bạn phát hiện một lỗi nhỏ trong báo cáo nhóm sắp nộp. Bạn…",
      options: [
        { text: "Kiểm tra lại toàn bộ số liệu cho chắc", scores: { [PT]: 2 } },
        { text: "Sửa ngay và cập nhật danh sách kiểm tra cho lần sau", scores: { [TC]: 2 } },
        { text: "Nhắn nhẹ nhàng cho bạn phụ trách phần đó cùng sửa", scores: { [CS]: 2 } },
        { text: "Viết công thức tự động để lần sau khỏi tính tay", scores: { [KT]: 2, [PT]: 1 } },
      ],
    },
  ],
};
