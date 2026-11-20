import type { Quiz } from "../engine";

const TH = "tryhard";
const CH = "chill";
const GT = "ganhteam";
const KP = "khampha";
const TA = "tauhai";

export const GAMER: Quiz = {
  slug: "gamer-he-nao",
  title: "Bạn là gamer hệ nào?",
  emoji: "🎮",
  intro: "12 tình huống từ phòng chờ đến màn hình thua trận. Đồng đội của bạn nghĩ gì về bạn?",
  ask: 12,
  types: [
    {
      id: TH,
      name: "Hệ Tryhard",
      emoji: "🔥",
      tagline: "Không có trận nào là trận giao hữu.",
      description:
        "Bạn chơi để thắng và để giỏi hơn mỗi ngày. Bạn xem lại trận đấu, thuộc lòng chỉ số, luyện thao tác đến khi thành phản xạ. Leo hạng không phải sở thích, đó là sứ mệnh. Đồng đội nể bạn, đối thủ thì ngán bạn.",
      strengths: ["Kỹ năng cao, luôn tiến bộ", "Kỷ luật luyện tập", "Phân tích trận đấu sắc bén"],
      watchOut: ["Dễ cáu khi đồng đội mắc lỗi", "Thua là mất ngủ", "Quên mất chơi game là để vui"],
      tips: [
        "Đặt giới hạn số trận leo hạng mỗi ngày, dừng lại sau 2 trận thua liên tiếp.",
        "Góp ý đồng đội bằng thông tin cụ thể thay vì cảm xúc, team sẽ nghe bạn hơn.",
        "Thỉnh thoảng chơi một chế độ cho vui để nạp lại hứng thú.",
      ],
      buddy: GT,
    },
    {
      id: CH,
      name: "Hệ Chill",
      emoji: "🌿",
      tagline: "Thắng cũng vui, thua cũng vui, miễn có game là vui.",
      description:
        "Với bạn, game là để thư giãn sau một ngày dài. Bạn không quan tâm hạng hay chỉ số, chỉ cần nhạc hay, cảnh đẹp và bạn bè cùng chơi. Bạn là người giữ cho phòng chơi luôn yên bình, kể cả lúc thua liền năm trận.",
      strengths: ["Tâm lý vững, không bao giờ cay cú", "Dễ chơi cùng, ai cũng quý", "Biết cân bằng game và cuộc sống"],
      watchOut: ["Đôi khi bị chê thiếu cố gắng", "Ngại thử thách khó", "Dễ bỏ dở game giữa chừng khi thấy chán"],
      tips: [
        "Thử đặt một mục tiêu nhỏ cho vui, ví dụ hoàn thành một thử thách mỗi tuần.",
        "Bạn rất hợp với game hợp tác và game xây dựng, đừng ngại rủ bạn bè cùng chơi.",
        "Giữ nguyên tinh thần này: đó là siêu năng lực hiếm có trong giới game thủ.",
      ],
      buddy: TA,
    },
    {
      id: GT,
      name: "Hệ Gánh team",
      emoji: "🛡️",
      tagline: "Đồng đội có thể bỏ cuộc, bạn thì không.",
      description:
        "Bạn là người chọn vị trí còn trống, đứng ra chỉ huy khi team rối và hỗ trợ đồng đội đến giây cuối. Bạn hiểu rằng thắng là chuyện của cả đội. Những trận lội ngược dòng đáng nhớ nhất thường có dấu ấn của bạn.",
      strengths: ["Tinh thần đồng đội cao", "Chỉ huy và giao tiếp tốt", "Không bỏ cuộc khi bị dẫn trước"],
      watchOut: ["Hay ôm hết trách nhiệm khi thua", "Dễ mệt vì phải lo cho cả team", "Ít khi được chơi vị trí mình thích"],
      tips: [
        "Thỉnh thoảng nhận vị trí mình thích, team cũng cần bạn vui vẻ.",
        "Chỉ huy ngắn gọn: một câu, một mục tiêu, đúng lúc.",
        "Sau trận thua, nhớ rằng không ai gánh được mãi; nghỉ một lát rồi quay lại.",
      ],
      buddy: TH,
    },
    {
      id: KP,
      name: "Hệ Khám phá",
      emoji: "🗺️",
      tagline: "Cốt truyện chính để sau, bản đồ còn nhiều góc chưa đi.",
      description:
        "Bạn mở game không phải để thắng mà để khám phá. Bạn đọc từng dòng thoại, đi vào mọi ngõ ngách, tìm từng vật phẩm ẩn và hoàn thành mọi nhiệm vụ phụ. Chơi xong một game với bạn có nghĩa là đạt 100%.",
      strengths: ["Kiên nhẫn và tỉ mỉ", "Hiểu sâu thế giới và cốt truyện game", "Tìm ra bí mật mà ít ai biết"],
      watchOut: ["Một game có thể chơi cả năm chưa xong", "Dễ lạc khỏi mục tiêu chính", "Danh sách game chờ chơi ngày càng dài"],
      tips: [
        "Chọn một game để hoàn thành trước khi mở game mới.",
        "Ghi chép hoặc chia sẻ những bí mật bạn tìm được, cộng đồng rất thích điều đó.",
        "Thử các game thế giới mở hoặc giải đố: đúng sở trường của bạn.",
      ],
      buddy: CH,
    },
    {
      id: TA,
      name: "Hệ Tấu hài",
      emoji: "🤡",
      tagline: "Thua thì thua, nhưng trận này phải có tiếng cười.",
      description:
        "Bạn đến với game để mang lại tiếng cười. Bạn thử những chiến thuật kỳ quặc, chọn nhân vật không ai chọn và luôn có một câu đùa đúng lúc. Có thể bạn không giúp team thắng, nhưng trận nào có bạn cũng đáng nhớ.",
      strengths: ["Mang lại niềm vui cho cả nhóm", "Sáng tạo, dám thử điều lạ", "Không bao giờ để thua trận làm buồn"],
      watchOut: ["Đồng đội nghiêm túc có thể bực mình", "Dễ bị hiểu nhầm là phá game", "Ít khi được giao vai trò quan trọng"],
      tips: [
        "Tấu hài ở chế độ thường, nghiêm túc ở chế độ leo hạng: ai cũng vui.",
        "Hỏi team trước khi thử chiến thuật lạ, có khi cả đội cùng hưởng ứng.",
        "Thử làm video hoặc livestream: khiếu hài của bạn rất hợp để chia sẻ.",
      ],
      buddy: CH,
    },
  ],
  pool: [
    {
      id: "gm-chon-nhan-vat",
      text: "Đến lượt chọn nhân vật, bạn chọn thế nào?",
      options: [
        { text: "Nhân vật mạnh nhất phiên bản hiện tại", scores: { [TH]: 2 } },
        { text: "Vị trí mà team còn thiếu", scores: { [GT]: 2 } },
        { text: "Nhân vật trông đẹp hoặc dễ thương nhất", scores: { [CH]: 2 } },
        { text: "Nhân vật kỳ quặc chẳng ai dùng, để xem có gì vui", scores: { [TA]: 2 } },
      ],
    },
    {
      id: "gm-thua-lien-tiep",
      text: "Bạn vừa thua 3 trận liên tiếp. Bạn sẽ…",
      options: [
        { text: "Xem lại trận đấu để tìm lỗi sai", scores: { [TH]: 2 } },
        { text: "Tắt máy đi ngủ, mai chơi tiếp", scores: { [CH]: 2 } },
        { text: "Rủ đúng đội đó chơi tiếp, lần này mình sẽ chỉ huy", scores: { [GT]: 2 } },
        { text: "Chuyển sang chế độ khác cho đổi gió", scores: { [KP]: 2, [TA]: 1 } },
      ],
    },
    {
      id: "gm-game-moi",
      text: "Mở một game mới tải về, việc đầu tiên bạn làm là…",
      options: [
        { text: "Tìm hướng dẫn và chỉ số để chơi tối ưu nhất", scores: { [TH]: 2 } },
        { text: "Đi lang thang khắp bản đồ trước khi làm nhiệm vụ", scores: { [KP]: 2 } },
        { text: "Chỉnh nhân vật cho thật đẹp, mất 30 phút", scores: { [CH]: 2, [KP]: 1 } },
        { text: "Thử xem nhảy từ chỗ cao nhất xuống thì có sao không", scores: { [TA]: 2 } },
      ],
    },
    {
      id: "gm-dong-doi-yeu",
      text: "Đồng đội chơi kém và liên tục mắc lỗi. Bạn…",
      options: [
        { text: "Hướng dẫn nhẹ nhàng và chơi gần để hỗ trợ", scores: { [GT]: 2 } },
        { text: "Thở dài, tự mình phải gánh thôi", scores: { [TH]: 2, [GT]: 1 } },
        { text: "Không sao cả, ai cũng có lúc mới chơi", scores: { [CH]: 2 } },
        { text: "Nhắn một câu đùa cho cả team cùng cười", scores: { [TA]: 2 } },
      ],
    },
    {
      id: "gm-cot-truyen",
      text: "Game có đoạn phim cắt cảnh dài 5 phút. Bạn…",
      options: [
        { text: "Xem hết, còn đọc thêm cả tài liệu cốt truyện", scores: { [KP]: 2 } },
        { text: "Bấm bỏ qua ngay, vào trận nhanh còn luyện", scores: { [TH]: 2 } },
        { text: "Xem, vừa xem vừa ăn bim bim", scores: { [CH]: 2 } },
        { text: "Chụp màn hình biểu cảm buồn cười của nhân vật gửi nhóm", scores: { [TA]: 2 } },
      ],
    },
    {
      id: "gm-mic",
      text: "Trong trận, mic của bạn thường dùng để…",
      options: [
        { text: "Gọi vị trí đối thủ và chỉ huy đội hình", scores: { [GT]: 2 } },
        { text: "Báo thông tin ngắn gọn, đúng trọng tâm", scores: { [TH]: 2 } },
        { text: "Kể chuyện cười và hát linh tinh", scores: { [TA]: 2 } },
        { text: "Tắt mic, nghe nhạc thư giãn", scores: { [CH]: 2, [KP]: 1 } },
      ],
    },
    {
      id: "gm-nhiem-vu-phu",
      text: "Gặp một nhiệm vụ phụ chẳng có phần thưởng gì đáng giá. Bạn…",
      options: [
        { text: "Vẫn làm, biết đâu có bí mật gì phía sau", scores: { [KP]: 2 } },
        { text: "Bỏ qua, không đáng thời gian", scores: { [TH]: 2 } },
        { text: "Làm nếu nhiệm vụ nghe có vẻ vui", scores: { [CH]: 2 } },
        { text: "Rủ bạn cùng làm cho vui", scores: { [GT]: 2, [TA]: 1 } },
      ],
    },
    {
      id: "gm-dan-truoc",
      text: "Team bị dẫn trước rất xa. Bạn…",
      options: [
        { text: "Động viên cả team: chưa hết trận là chưa thua", scores: { [GT]: 2 } },
        { text: "Tập trung tìm cơ hội lật kèo, không nói nhiều", scores: { [TH]: 2 } },
        { text: "Chơi tiếp bình thường, kết quả không quan trọng", scores: { [CH]: 2 } },
        { text: "Đề nghị cả team cùng dùng chiến thuật điên rồ nhất", scores: { [TA]: 2 } },
      ],
    },
    {
      id: "gm-thoi-gian",
      text: "Một buổi tối chơi game điển hình của bạn kéo dài…",
      options: [
        { text: "Đến khi lên được hạng mới thôi", scores: { [TH]: 2 } },
        { text: "Một hai tiếng cho thư giãn rồi đi ngủ", scores: { [CH]: 2 } },
        { text: "Không biết, mải đi khám phá nên quên cả giờ", scores: { [KP]: 2 } },
        { text: "Đến khi nhóm bạn đi ngủ hết", scores: { [GT]: 2, [TA]: 1 } },
      ],
    },
    {
      id: "gm-thanh-tuu",
      text: "Thành tựu nào khiến bạn tự hào nhất?",
      options: [
        { text: "Leo lên top bảng xếp hạng máy chủ", scores: { [TH]: 2 } },
        { text: "Hoàn thành game 100%, không sót vật phẩm nào", scores: { [KP]: 2 } },
        { text: "Trận lội ngược dòng nhờ mình gọi đúng lúc", scores: { [GT]: 2 } },
        { text: "Clip mình làm trò được cả nhóm xem đi xem lại", scores: { [TA]: 2 } },
      ],
    },
    {
      id: "gm-mua-do",
      text: "Có tiền mua vật phẩm trong game, bạn mua gì?",
      options: [
        { text: "Trang phục đẹp, chẳng cần mạnh", scores: { [CH]: 2 } },
        { text: "Thứ gì giúp mình chơi tốt hơn", scores: { [TH]: 2 } },
        { text: "Bản mở rộng có thêm bản đồ và cốt truyện mới", scores: { [KP]: 2 } },
        { text: "Biểu cảm và hành động hài hước để chọc đối thủ", scores: { [TA]: 2 } },
      ],
    },
    {
      id: "gm-ban-moi-choi",
      text: "Bạn thân mới tập chơi game bạn đang chơi. Bạn…",
      options: [
        { text: "Kèm từng bước, nhường đồ tốt cho bạn ấy", scores: { [GT]: 2 } },
        { text: "Dẫn đi xem những chỗ đẹp nhất trên bản đồ", scores: { [KP]: 2 } },
        { text: "Cứ chơi thoải mái, không cần áp lực gì", scores: { [CH]: 2 } },
        { text: "Dạy bạn ấy mấy trò troll trước tiên", scores: { [TA]: 2 } },
      ],
    },
    {
      id: "gm-lag",
      text: "Đang giao tranh căng thẳng thì mạng lag. Phản ứng của bạn?",
      options: [
        { text: "Ôi không! Trận này đang thắng mà!", scores: { [TH]: 2 } },
        { text: "Thôi kệ, đi lấy nước uống chờ mạng", scores: { [CH]: 2 } },
        { text: "Báo ngay cho team để mọi người chơi bù", scores: { [GT]: 2 } },
        { text: "Chụp lại khoảnh khắc nhân vật đơ để làm meme", scores: { [TA]: 2 } },
      ],
    },
    {
      id: "gm-the-loai",
      text: "Thể loại game bạn chơi nhiều nhất?",
      options: [
        { text: "Đối kháng, bắn súng hoặc đấu trường xếp hạng", scores: { [TH]: 2 } },
        { text: "Nông trại, xây dựng, trang trí nhà cửa", scores: { [CH]: 2 } },
        { text: "Thế giới mở, nhập vai, phiêu lưu", scores: { [KP]: 2 } },
        { text: "Game nhóm, game tiệc chơi cùng bạn bè", scores: { [TA]: 2, [GT]: 1 } },
      ],
    },
    {
      id: "gm-bi-to-cao",
      text: "Sau trận, bạn bị đồng đội “chê” trong khung chat. Bạn…",
      options: [
        { text: "Giải thích lại tình huống bằng số liệu cụ thể", scores: { [TH]: 2 } },
        { text: "Xin lỗi nếu mình sai và rủ trận sau cố hơn", scores: { [GT]: 2 } },
        { text: "Không đọc chat, chẳng ảnh hưởng gì tâm trạng", scores: { [CH]: 2 } },
        { text: "Trả lời bằng một câu đùa khiến cả phòng cười", scores: { [TA]: 2 } },
      ],
    },
    {
      id: "gm-update",
      text: "Game ra bản cập nhật lớn. Bạn quan tâm điều gì nhất?",
      options: [
        { text: "Chỉ số nhân vật thay đổi thế nào, ai mạnh lên", scores: { [TH]: 2 } },
        { text: "Có khu vực hay bí mật mới để khám phá không", scores: { [KP]: 2 } },
        { text: "Có chế độ mới để chơi cùng nhóm không", scores: { [GT]: 2, [TA]: 1 } },
        { text: "Có trang phục mới đẹp không", scores: { [CH]: 2 } },
      ],
    },
  ],
};
