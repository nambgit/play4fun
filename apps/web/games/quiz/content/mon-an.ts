import type { Quiz } from "../engine";

const PHO = "pho";
const BM = "banh-mi";
const BB = "bun-bo";
const TS = "tra-sua";
const BX = "banh-xeo";
const CHE = "che";

export const MON_AN: Quiz = {
  slug: "ban-la-mon-an-viet-nao",
  title: "Bạn là món ăn Việt nào?",
  emoji: "🍜",
  intro: "10 tình huống đời thường để tìm ra món ăn Việt mang đúng tính cách của bạn. Đói bụng thì cứ làm, không sao!",
  ask: 10,
  types: [
    {
      id: PHO,
      name: "Phở",
      emoji: "🍜",
      tagline: "Ấm áp, đáng tin, càng quen càng thấy thương.",
      description:
        "Bạn giống một tô phở nóng buổi sáng: không cần ồn ào mà ai cũng nhớ. Bạn sống có nguyên tắc, trân trọng những giá trị lâu bền và luôn là chỗ dựa vững chắc cho người thân. Bạn bè gặp chuyện là nghĩ tới bạn đầu tiên.",
      strengths: ["Đáng tin, giữ lời", "Điềm tĩnh trong mọi tình huống", "Biết quan tâm theo cách bền bỉ"],
      watchOut: ["Hơi ngại thay đổi thói quen", "Đôi khi giữ cảm xúc trong lòng quá lâu", "Dễ bị xem là “cổ điển”"],
      tips: [
        "Mỗi tháng thử một điều mới nhỏ: quán mới, cung đường mới, sở thích mới.",
        "Nói ra điều mình cần, người thân sẽ vui vì được chăm sóc lại bạn.",
        "Giữ những thói quen tốt của bạn, đó là nền móng để mọi người dựa vào.",
      ],
      buddy: BM,
    },
    {
      id: BM,
      name: "Bánh mì",
      emoji: "🥖",
      tagline: "Nhanh gọn, linh hoạt, kẹp gì cũng hợp.",
      description:
        "Bạn là người năng động, thích nghi cực nhanh và luôn sẵn sàng cho chuyến đi tiếp theo. Kế hoạch đổi phút chót cũng không làm khó được bạn. Ở đâu bạn cũng hòa nhập được, giống ổ bánh mì ăn lúc nào cũng hợp.",
      strengths: ["Thích nghi nhanh với mọi hoàn cảnh", "Làm việc hiệu quả, gọn gàng", "Tháo vát, luôn có cách xoay xở"],
      watchOut: ["Lúc nào cũng vội, quên nghỉ ngơi", "Dễ ôm quá nhiều việc cùng lúc", "Ít khi dừng lại tận hưởng khoảnh khắc"],
      tips: [
        "Chừa trong lịch một khoảng trống không làm gì cả, coi như “nạp năng lượng”.",
        "Ăn chậm một bữa mỗi ngày, không điện thoại, không vội vã.",
        "Sự linh hoạt của bạn là điểm mạnh, hãy dùng nó để giúp nhóm vượt qua lúc rối.",
      ],
      buddy: PHO,
    },
    {
      id: BB,
      name: "Bún bò",
      emoji: "🌶️",
      tagline: "Đậm đà, cá tính, đã thích là thích thật.",
      description:
        "Bạn có cá tính mạnh và chính kiến rõ ràng, không dễ bị lung lay bởi số đông. Bạn nói thẳng, làm thật và sống hết mình với đam mê. Ai đã hiểu bạn sẽ thấy bên trong vị cay nồng là một trái tim rất nhiệt thành.",
      strengths: ["Quyết đoán, dám nghĩ dám làm", "Thẳng thắn, rõ ràng", "Đam mê và bền bỉ với mục tiêu"],
      watchOut: ["Đôi khi nói thẳng quá làm người khác chạnh lòng", "Khó nhường khi tranh luận", "Dễ nóng khi bị cản trở"],
      tips: [
        "Trước khi góp ý, thử bắt đầu bằng một điểm bạn thấy tốt ở người kia.",
        "Chọn một đam mê và đi thật sâu, bạn có đủ lửa để làm đến nơi đến chốn.",
        "Khi bực, đi một vòng hoặc uống ly nước rồi hãy trả lời.",
      ],
      buddy: CHE,
    },
    {
      id: TS,
      name: "Trà sữa",
      emoji: "🧋",
      tagline: "Vui vẻ, bắt trend, thêm topping là thêm niềm vui.",
      description:
        "Bạn luôn biết cái gì đang hot, quán nào mới mở, câu nói nào đang viral. Bạn vui tính, thích thử nghiệm và có muôn vàn sở thích như muôn vàn loại topping. Ở cạnh bạn, ngày bình thường cũng trở nên thú vị hơn.",
      strengths: ["Cập nhật xu hướng nhanh", "Vui vẻ, dễ gần", "Sáng tạo, thích thử cái mới"],
      watchOut: ["Dễ cả thèm chóng chán", "Hay tiêu tiền theo cảm hứng", "Đôi khi lo lắng mình bị bỏ lỡ điều gì đó"],
      tips: [
        "Đặt một khoản “quỹ thử cái mới” mỗi tháng để vui mà ví vẫn ổn.",
        "Chọn một sở thích để theo đuổi lâu dài bên cạnh những thứ bạn thử cho vui.",
        "Thỉnh thoảng tắt mạng xã hội một buổi, bạn sẽ thấy mình chẳng bỏ lỡ gì nhiều.",
      ],
      buddy: BX,
    },
    {
      id: BX,
      name: "Bánh xèo",
      emoji: "🥞",
      tagline: "Chưa thấy mặt đã nghe tiếng, xèo xèo vui cả bàn.",
      description:
        "Bạn là linh hồn của mọi cuộc vui, hướng ngoại, hào sảng và cực kỳ biết cách kéo mọi người lại gần nhau. Bạn thích tụ tập, thích những bữa ăn đông người, nói cười rôm rả. Ở đâu có bạn, ở đó không bao giờ có chuyện im lặng.",
      strengths: ["Hướng ngoại, kết nối giỏi", "Mang năng lượng tích cực cho nhóm", "Hào phóng, nhiệt tình"],
      watchOut: ["Đôi khi hơi ồn trong những lúc cần yên tĩnh", "Ngại ở một mình", "Hay nhận lời quá nhiều cuộc hẹn"],
      tips: [
        "Thỉnh thoảng hỏi người trầm tính nhất nhóm một câu, họ sẽ rất quý bạn.",
        "Dành một buổi tối mỗi tuần cho riêng mình để sạc pin.",
        "Biến khả năng kết nối thành điểm mạnh: bạn rất hợp làm người tổ chức sự kiện.",
      ],
      buddy: TS,
    },
    {
      id: CHE,
      name: "Chè",
      emoji: "🍧",
      tagline: "Ngọt ngào, chu đáo, mỗi lớp là một sự quan tâm.",
      description:
        "Bạn tinh tế và chu đáo, luôn nhớ sinh nhật bạn bè, để ý từng thay đổi nhỏ của người xung quanh. Bạn thích làm người khác vui bằng những món quà nhỏ và lời hỏi han đúng lúc. Như một ly chè nhiều tầng, càng tìm hiểu bạn càng thấy nhiều điều dễ thương.",
      strengths: ["Tinh tế, để ý chi tiết", "Ân cần, biết chăm sóc người khác", "Tạo cảm giác dễ chịu cho mọi người"],
      watchOut: ["Hay nghĩ cho người khác mà quên mình", "Dễ buồn khi sự quan tâm không được đáp lại", "Ngại nói “không”"],
      tips: [
        "Tập từ chối nhẹ nhàng: “Lần này mình không giúp được, lần sau nhé”.",
        "Dành cho bản thân sự chu đáo giống như bạn dành cho người khác.",
        "Ghi lại những điều nhỏ làm bạn vui để tự thưởng khi mệt.",
      ],
      buddy: PHO,
    },
  ],
  pool: [
    {
      id: "ma-sang-chu-nhat",
      text: "Sáng Chủ nhật lý tưởng của bạn là…",
      options: [
        { text: "Dậy sớm, ăn sáng ở quán quen rồi đọc báo", scores: { [PHO]: 2 } },
        { text: "Tranh thủ chạy việc vặt, xong sớm để còn đi chơi", scores: { [BM]: 2 } },
        { text: "Hẹn cả nhóm đi ăn sáng thật đông vui", scores: { [BX]: 2 } },
        { text: "Đi check-in quán cà phê mới đang hot", scores: { [TS]: 2 } },
      ],
    },
    {
      id: "ma-sinh-nhat-ban",
      text: "Sắp đến sinh nhật bạn thân, bạn chuẩn bị…",
      options: [
        { text: "Món quà tự tay làm kèm lá thư dài", scores: { [CHE]: 2 } },
        { text: "Một bữa tiệc bất ngờ với thật nhiều người", scores: { [BX]: 2 } },
        { text: "Món quà bạn ấy đã nhắc đến từ lâu, thiết thực và bền", scores: { [PHO]: 2, [CHE]: 1 } },
        { text: "Món đồ đang hot nhất trên mạng", scores: { [TS]: 2 } },
      ],
    },
    {
      id: "ma-tranh-luan",
      text: "Cả nhóm tranh luận chọn quán ăn tối. Bạn…",
      options: [
        { text: "Nói thẳng: “Đi quán này, ngon nhất, khỏi bàn”", scores: { [BB]: 2 } },
        { text: "Chọn đại một quán gần nhất để đi cho nhanh", scores: { [BM]: 2 } },
        { text: "Hỏi xem ai đang thèm gì, ai kiêng gì", scores: { [CHE]: 2 } },
        { text: "Gợi ý quán mới mở đang được review nhiều", scores: { [TS]: 2 } },
      ],
    },
    {
      id: "ma-ke-hoach-doi",
      text: "Chuyến đi chơi bị đổi kế hoạch phút chót. Bạn…",
      options: [
        { text: "Không sao, có phương án B ngay trong đầu", scores: { [BM]: 2 } },
        { text: "Hơi tiếc, mình thích đi đúng như đã hẹn hơn", scores: { [PHO]: 2 } },
        { text: "Thôi thì rủ hết mọi người về nhà mình nấu ăn", scores: { [BX]: 2, [CHE]: 1 } },
        { text: "Bực một chút, nói rõ cho mọi người biết mình không vui", scores: { [BB]: 2 } },
      ],
    },
    {
      id: "ma-tiec-dong-nguoi",
      text: "Ở một bữa tiệc toàn người lạ, bạn thường…",
      options: [
        { text: "Làm quen hết cả phòng chỉ sau nửa tiếng", scores: { [BX]: 2 } },
        { text: "Tìm một hai người hợp chuyện rồi nói chuyện thật sâu", scores: { [PHO]: 2 } },
        { text: "Rót nước, mời bánh, để ý xem ai đang lạc lõng", scores: { [CHE]: 2 } },
        { text: "Chụp ảnh, quay story, bắt trend cùng mọi người", scores: { [TS]: 2 } },
      ],
    },
    {
      id: "ma-mon-quen",
      text: "Đi ăn ở quán quen, bạn gọi món thế nào?",
      options: [
        { text: "Vẫn món cũ, chưa bao giờ thất vọng", scores: { [PHO]: 2 } },
        { text: "Món nào ra nhanh nhất", scores: { [BM]: 2 } },
        { text: "Món cay nhất, đậm vị nhất menu", scores: { [BB]: 2 } },
        { text: "Món mới ra mắt, thêm đủ loại topping", scores: { [TS]: 2 } },
      ],
    },
    {
      id: "ma-ban-buon",
      text: "Bạn thân đang buồn chuyện tình cảm. Bạn…",
      options: [
        { text: "Mang đồ ăn ngọt tới, ngồi nghe bạn kể suốt buổi", scores: { [CHE]: 2 } },
        { text: "Nói thật: “Người đó không xứng với cậu đâu!”", scores: { [BB]: 2 } },
        { text: "Kéo bạn đi hát karaoke cho quên hết", scores: { [BX]: 2 } },
        { text: "Lặng lẽ ở bên, nhắn tin hỏi thăm đều đặn mỗi ngày", scores: { [PHO]: 2 } },
      ],
    },
    {
      id: "ma-tien-thuong",
      text: "Bất ngờ nhận được một khoản tiền thưởng. Bạn sẽ…",
      options: [
        { text: "Mua ngay món đồ mới đang được săn lùng", scores: { [TS]: 2 } },
        { text: "Khao cả nhóm một bữa thật linh đình", scores: { [BX]: 2 } },
        { text: "Mua quà biếu bố mẹ, phần còn lại để dành", scores: { [PHO]: 2, [CHE]: 1 } },
        { text: "Đặt vé đi đâu đó ngay cuối tuần này", scores: { [BM]: 2 } },
      ],
    },
    {
      id: "ma-nhom-chat",
      text: "Trong nhóm chat, bạn thường là người…",
      options: [
        { text: "Gửi meme và nhãn dán mới nhất", scores: { [TS]: 2 } },
        { text: "Nhắn liên tục, rủ rê tụ tập", scores: { [BX]: 2 } },
        { text: "Nhớ sinh nhật và hỏi thăm từng người", scores: { [CHE]: 2 } },
        { text: "Thẳng thắn nêu ý kiến khi nhóm bàn chuyện", scores: { [BB]: 2 } },
      ],
    },
    {
      id: "ma-du-lich",
      text: "Đi du lịch, phong cách của bạn là…",
      options: [
        { text: "Một ba lô gọn nhẹ, đi đâu tính đó", scores: { [BM]: 2 } },
        { text: "Về lại nơi quen thuộc mình đã yêu thích", scores: { [PHO]: 2 } },
        { text: "Săn những địa điểm sống ảo đang nổi", scores: { [TS]: 2 } },
        { text: "Thử những trải nghiệm mạo hiểm nhất có thể", scores: { [BB]: 2, [BM]: 1 } },
      ],
    },
    {
      id: "ma-phong-o",
      text: "Phòng của bạn trông như thế nào?",
      options: [
        { text: "Ngăn nắp, đồ đạc dùng nhiều năm vẫn bền", scores: { [PHO]: 2 } },
        { text: "Tối giản, đồ ít để dễ dọn đi lúc nào cũng được", scores: { [BM]: 2 } },
        { text: "Nhiều đồ dễ thương, nến thơm và thiệp được tặng", scores: { [CHE]: 2 } },
        { text: "Treo poster thần tượng, đầy món đồ mua theo trend", scores: { [TS]: 2 } },
      ],
    },
    {
      id: "ma-lam-viec-nhom",
      text: "Khi làm việc nhóm, bạn thường…",
      options: [
        { text: "Nhận phần khó nhất và làm đến cùng", scores: { [BB]: 2 } },
        { text: "Làm xong phần mình thật nhanh rồi giúp người khác", scores: { [BM]: 2 } },
        { text: "Giữ không khí vui vẻ để ai cũng có hứng làm", scores: { [BX]: 2 } },
        { text: "Mang bánh kẹo đến và nhắc mọi người nghỉ giải lao", scores: { [CHE]: 2 } },
      ],
    },
    {
      id: "ma-bi-che",
      text: "Có người góp ý thẳng về một việc bạn làm chưa tốt. Bạn…",
      options: [
        { text: "Đáp lại thẳng thắn, đúng thì nhận, sai thì cãi", scores: { [BB]: 2 } },
        { text: "Cảm ơn, ghi nhận và lặng lẽ sửa", scores: { [PHO]: 2 } },
        { text: "Hơi buồn, nhưng vẫn cố cười cho người kia đỡ ngại", scores: { [CHE]: 2 } },
        { text: "Sửa ngay trong ngày, xong việc là quên", scores: { [BM]: 2 } },
      ],
    },
    {
      id: "ma-nhac",
      text: "Danh sách nhạc của bạn chủ yếu là…",
      options: [
        { text: "Bản hit đang đứng đầu bảng xếp hạng tuần này", scores: { [TS]: 2 } },
        { text: "Những bài hát cũ nghe mãi không chán", scores: { [PHO]: 2 } },
        { text: "Nhạc sôi động để mở lúc tụ tập", scores: { [BX]: 2 } },
        { text: "Một thể loại mình mê, người khác thấy lạ cũng mặc", scores: { [BB]: 2 } },
      ],
    },
    {
      id: "ma-tre-hen",
      text: "Bạn bè đến trễ hẹn 30 phút. Bạn…",
      options: [
        { text: "Tranh thủ làm việc khác, chẳng phí phút nào", scores: { [BM]: 2 } },
        { text: "Nhắn hỏi xem bạn có gặp chuyện gì trên đường không", scores: { [CHE]: 2 } },
        { text: "Nói rõ là mình không thích chờ lâu như vậy", scores: { [BB]: 2 } },
        { text: "Lướt mạng xem có gì mới rồi kể lại cho bạn", scores: { [TS]: 2, [BX]: 1 } },
      ],
    },
    {
      id: "ma-nau-an",
      text: "Được giao nấu một bữa cho cả nhà, bạn…",
      options: [
        { text: "Nấu đúng món truyền thống theo công thức của mẹ", scores: { [PHO]: 2 } },
        { text: "Thử công thức mới vừa thấy trên mạng", scores: { [TS]: 2 } },
        { text: "Rủ thêm họ hàng đến, biến thành bữa liên hoan", scores: { [BX]: 2 } },
        { text: "Nêm theo khẩu vị từng người, chuẩn bị thêm món tráng miệng", scores: { [CHE]: 2 } },
      ],
    },
    {
      id: "ma-ngay-ban-ron",
      text: "Một ngày bận rộn với cả chục việc, bạn xử lý thế nào?",
      options: [
        { text: "Làm vèo vèo từng việc, vừa đi vừa ăn cũng được", scores: { [BM]: 2 } },
        { text: "Làm theo thứ tự quen thuộc, chậm mà chắc", scores: { [PHO]: 2 } },
        { text: "Tập trung xử lý dứt điểm việc khó nhất trước", scores: { [BB]: 2 } },
        { text: "Rủ bạn cùng làm cho đỡ chán, vừa làm vừa nói chuyện", scores: { [BX]: 2 } },
      ],
    },
    {
      id: "ma-qua-tang",
      text: "Món quà nào khiến bạn vui nhất?",
      options: [
        { text: "Một tấm thiệp viết tay thật dài", scores: { [CHE]: 2 } },
        { text: "Món đồ phiên bản giới hạn vừa ra mắt", scores: { [TS]: 2 } },
        { text: "Món đồ hữu ích, mang theo người được mọi lúc", scores: { [BM]: 2 } },
        { text: "Vé xem buổi biểu diễn của nghệ sĩ mình mê", scores: { [BB]: 2, [TS]: 1 } },
      ],
    },
    {
      id: "ma-khen",
      text: "Bạn bè hay khen bạn câu nào nhất?",
      options: [
        { text: "“Có cậu là yên tâm hẳn.”", scores: { [PHO]: 2 } },
        { text: "“Cậu vui tính thật, đi đâu cũng rộn ràng.”", scores: { [BX]: 2 } },
        { text: "“Cậu cá tính ghê, chẳng giống ai.”", scores: { [BB]: 2 } },
        { text: "“Cậu chu đáo quá, nhớ cả chuyện nhỏ xíu.”", scores: { [CHE]: 2 } },
      ],
    },
    {
      id: "ma-toi-ranh",
      text: "Một buổi tối rảnh rỗi, bạn thường…",
      options: [
        { text: "Xem lại bộ phim cũ yêu thích", scores: { [PHO]: 2 } },
        { text: "Thử hết các trend mới trên mạng xã hội", scores: { [TS]: 2 } },
        { text: "Gọi điện rủ ai đó ra ngoài ngay", scores: { [BX]: 2, [BM]: 1 } },
        { text: "Học thêm một kỹ năng mới qua video ngắn", scores: { [BM]: 2 } },
      ],
    },
    {
      id: "ma-mua-mua",
      text: "Trời bỗng đổ mưa to đúng giờ tan học, tan làm. Bạn…",
      options: [
        { text: "Mặc áo mưa, len lỏi về nhà nhanh nhất có thể", scores: { [BM]: 2 } },
        { text: "Rủ mọi người vào quán gần đó ngồi chờ, tán gẫu", scores: { [BX]: 2 } },
        { text: "Chia áo mưa dự phòng cho bạn quên mang", scores: { [CHE]: 2 } },
        { text: "Đội mưa về luôn, ướt một chút có sao đâu", scores: { [BB]: 2 } },
      ],
    },
    {
      id: "ma-tro-choi-moi",
      text: "Cả nhóm rủ chơi một trò mới mà bạn chưa biết. Bạn…",
      options: [
        { text: "Tham gia ngay, chơi dở cũng được miễn vui", scores: { [BX]: 2 } },
        { text: "Hào hứng vì trò này đang hot trên mạng", scores: { [TS]: 2 } },
        { text: "Đứng xem một lượt cho hiểu luật rồi mới vào", scores: { [PHO]: 2 } },
        { text: "Chơi thì phải chơi thắng, luyện đến khi giỏi mới thôi", scores: { [BB]: 2 } },
      ],
    },
  ],
};
