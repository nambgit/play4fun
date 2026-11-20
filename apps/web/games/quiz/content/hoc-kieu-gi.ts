import type { Quiz } from "../engine";

const CU = "cudem";
const NR = "nuocrut";
const MS = "motsach";
const NH = "hocnhom";

export const HOC_KIEU_GI: Quiz = {
  slug: "ban-hoc-kieu-gi",
  title: "Bạn học kiểu gì?",
  emoji: "📚",
  intro: "10 tình huống mùa thi rất quen. Chọn thật lòng nhé, không ai chấm điểm bài này đâu!",
  ask: 10,
  types: [
    {
      id: CU,
      name: "Cú đêm",
      emoji: "🦉",
      tagline: "Ban ngày buồn ngủ, nửa đêm mới là giờ vàng.",
      description:
        "Khi cả nhà đã ngủ say, bạn mới bắt đầu tỉnh táo. Không gian yên tĩnh, ánh đèn bàn và một cốc nước là đủ để bạn học hiệu quả gấp đôi ban ngày. Vấn đề duy nhất là tiết đầu buổi sáng hôm sau.",
      strengths: ["Tập trung sâu khi yên tĩnh", "Tự học tốt, không cần ai nhắc", "Ghi nhớ lâu những gì học lúc đêm khuya"],
      watchOut: ["Thiếu ngủ làm giảm trí nhớ", "Hay mệt và gà gật ở lớp buổi sáng", "Giờ giấc lệch với bạn bè, gia đình"],
      tips: [
        "Học khung 21h–23h30 thay vì quá nửa đêm: vẫn yên tĩnh mà vẫn ngủ đủ 7 tiếng.",
        "Ngủ đủ giấc giúp não lưu bài học vào trí nhớ dài hạn, thức trắng đêm trước kỳ thi thường phản tác dụng.",
        "Ôn lại nhanh 10 phút vào buổi sáng những gì đã học tối hôm trước.",
      ],
      buddy: MS,
    },
    {
      id: NR,
      name: "Chiến thần nước rút",
      emoji: "🏃",
      tagline: "Ba ngày trước kỳ thi là ba ngày thần thánh.",
      description:
        "Cả học kỳ bạn sống rất thảnh thơi, nhưng khi lịch thi xuất hiện thì bạn hóa thành cỗ máy học. Khả năng nhồi kiến thức trong thời gian ngắn của bạn khiến ai cũng phải ngỡ ngàng, dù chính bạn cũng không nhớ mình đã học bằng cách nào.",
      strengths: ["Tập trung cao độ khi có áp lực", "Biết chọn phần trọng tâm rất nhanh", "Không bị căng thẳng suốt cả học kỳ"],
      watchOut: ["Kiến thức nhồi nhanh thì quên cũng nhanh", "Dễ hổng phần nền cho môn học sau", "Rủi ro cao nếu bị ốm đúng mùa thi"],
      tips: [
        "Mỗi tuần dành 2 buổi ôn nhẹ 20 phút: đến mùa thi bạn chỉ cần nước rút một nửa quãng đường.",
        "Dùng thẻ ghi nhớ (flashcard) và tự kiểm tra thay vì chỉ đọc lại sách.",
        "Lập danh sách phần trọng tâm ngay từ buổi học đầu, đánh dấu khi thầy cô nhấn mạnh.",
      ],
      buddy: NH,
    },
    {
      id: MS,
      name: "Mọt sách chính hiệu",
      emoji: "📖",
      tagline: "Vở ghi đẹp như sách, lịch học đều như đồng hồ.",
      description:
        "Bạn học đều đặn mỗi ngày, ghi chép cẩn thận với đủ màu bút và luôn làm bài tập trước hạn. Bạn bè hay mượn vở của bạn trước kỳ thi. Với bạn, mùa thi chỉ là lúc ôn lại những gì đã học rất kỹ từ trước.",
      strengths: ["Kỷ luật, học đều đặn", "Nền tảng kiến thức vững chắc", "Ghi chép rõ ràng, dễ ôn tập"],
      watchOut: ["Dễ lo lắng khi gặp câu hỏi ngoài sách", "Hay dành quá nhiều thời gian cho trình bày đẹp", "Ít khi cho phép mình nghỉ ngơi"],
      tips: [
        "Bớt thời gian chép lại cho đẹp, dành thời gian đó để tự giải đề và câu hỏi mở rộng.",
        "Thử giảng lại bài cho bạn khác: cách tốt nhất để phát hiện chỗ mình chưa hiểu sâu.",
        "Lên lịch nghỉ có chủ đích, não cũng cần thời gian để sắp xếp kiến thức.",
      ],
      buddy: CU,
    },
    {
      id: NH,
      name: "Thủ lĩnh học nhóm",
      emoji: "🤝",
      tagline: "Một mình thì buồn ngủ, cả nhóm thì hiểu bài.",
      description:
        "Bạn học hiệu quả nhất khi được thảo luận, hỏi đáp và giảng cho nhau nghe. Bạn thường là người lập nhóm ôn thi, chia đề cương và kéo mọi người vào guồng. Với bạn, kiến thức được hiểu sâu nhất khi nói ra thành lời.",
      strengths: ["Hiểu bài sâu nhờ thảo luận", "Giỏi giải thích cho người khác", "Tạo động lực cho cả nhóm"],
      watchOut: ["Buổi học nhóm dễ biến thành buổi tán gẫu", "Hay phụ thuộc vào lịch của người khác", "Ít luyện khả năng tự học một mình"],
      tips: [
        "Mỗi buổi học nhóm đặt một mục tiêu rõ ràng và giới hạn thời gian, ví dụ “giải xong 10 câu trong 1 tiếng”.",
        "Phân công mỗi người chuẩn bị trước một phần để giảng cho cả nhóm.",
        "Xen kẽ 1–2 buổi tự học một mình mỗi tuần để kiểm tra mình thật sự nhớ được bao nhiêu.",
      ],
      buddy: NR,
    },
  ],
  pool: [
    {
      id: "hk-lich-thi",
      text: "Lịch thi vừa được công bố, bạn làm gì đầu tiên?",
      options: [
        { text: "Lập kế hoạch ôn từng môn theo từng ngày", scores: { [MS]: 2 } },
        { text: "Lập nhóm chat ôn thi và chia đề cương cho mọi người", scores: { [NH]: 2 } },
        { text: "Đếm ngược: vẫn còn tận 2 tuần, thong thả", scores: { [NR]: 2 } },
        { text: "Tối nay bắt đầu ôn, đêm nay sẽ dài đây", scores: { [CU]: 2 } },
      ],
    },
    {
      id: "hk-gio-vang",
      text: "Bạn học vào khung giờ nào hiệu quả nhất?",
      options: [
        { text: "Sau 23h, khi cả nhà đã đi ngủ", scores: { [CU]: 2 } },
        { text: "Đúng giờ đã lên lịch, ngày nào cũng như ngày nào", scores: { [MS]: 2 } },
        { text: "Khi cả nhóm hẹn nhau ở quán cà phê hay thư viện", scores: { [NH]: 2 } },
        { text: "Bất kỳ giờ nào, miễn là ngày mai thi", scores: { [NR]: 2 } },
      ],
    },
    {
      id: "hk-vo-ghi",
      text: "Vở ghi của bạn trông như thế nào?",
      options: [
        { text: "Đủ 4 màu bút, có đề mục và đánh dấu trọng tâm", scores: { [MS]: 2 } },
        { text: "Vở ghi gì cơ? Mình chụp ảnh vở của bạn", scores: { [NR]: 2, [NH]: 1 } },
        { text: "Ghi vội trên lớp, tối về chép lại cho đầy đủ", scores: { [CU]: 2 } },
        { text: "Ghi thêm cả những câu bạn bè hỏi và lời giải thích của nhau", scores: { [NH]: 2 } },
      ],
    },
    {
      id: "hk-bai-kho",
      text: "Gặp một bài tập khó mãi không giải được, bạn sẽ…",
      options: [
        { text: "Gửi vào nhóm chat, cả nhóm cùng bàn", scores: { [NH]: 2 } },
        { text: "Lật lại sách và vở ghi, đọc kỹ từ phần lý thuyết", scores: { [MS]: 2 } },
        { text: "Ngồi tới 2h sáng cho bằng được thì thôi", scores: { [CU]: 2 } },
        { text: "Đánh dấu bỏ qua, đi thi chắc không ra câu này", scores: { [NR]: 2 } },
      ],
    },
    {
      id: "hk-dem-truoc-thi",
      text: "Đêm trước ngày thi, bạn đang làm gì?",
      options: [
        { text: "Đọc lại lần cuối rồi đi ngủ sớm", scores: { [MS]: 2 } },
        { text: "Học từ chương 1 vì chưa kịp mở sách", scores: { [NR]: 2 } },
        { text: "Thức tới sáng, đêm là thời gian quen thuộc rồi", scores: { [CU]: 2, [NR]: 1 } },
        { text: "Gọi video với cả nhóm để hỏi đáp lần cuối", scores: { [NH]: 2 } },
      ],
    },
    {
      id: "hk-thu-vien",
      text: "Đi thư viện, bạn thường chọn chỗ nào?",
      options: [
        { text: "Bàn lớn trong phòng thảo luận để ngồi cả nhóm", scores: { [NH]: 2 } },
        { text: "Góc yên tĩnh nhất, xa cửa ra vào", scores: { [CU]: 2 } },
        { text: "Chỗ quen thuộc, ngày nào cũng ngồi đúng chỗ đó", scores: { [MS]: 2 } },
        { text: "Chỉ đến thư viện vào tuần thi, chỗ nào trống ngồi chỗ đó", scores: { [NR]: 2 } },
      ],
    },
    {
      id: "hk-bai-tap-ve-nha",
      text: "Thầy cô giao bài tập về nhà, hạn nộp tuần sau. Bạn làm khi nào?",
      options: [
        { text: "Ngay tối hôm đó cho xong", scores: { [MS]: 2 } },
        { text: "Tối trước hạn nộp, lúc nửa đêm", scores: { [NR]: 2, [CU]: 1 } },
        { text: "Rủ mấy đứa bạn làm chung vào cuối tuần", scores: { [NH]: 2 } },
        { text: "Làm dần vào các buổi tối khuya trong tuần", scores: { [CU]: 2 } },
      ],
    },
    {
      id: "hk-dong-luc",
      text: "Điều gì giúp bạn có động lực học nhất?",
      options: [
        { text: "Thấy kế hoạch học được đánh dấu hoàn thành từng ô", scores: { [MS]: 2 } },
        { text: "Hạn chót đang tới rất gần", scores: { [NR]: 2 } },
        { text: "Không muốn tụt lại phía sau cả nhóm", scores: { [NH]: 2 } },
        { text: "Sự yên tĩnh tuyệt đối của đêm khuya", scores: { [CU]: 2 } },
      ],
    },
    {
      id: "hk-diem-thap",
      text: "Bài kiểm tra vừa rồi bạn bị điểm thấp. Bạn sẽ…",
      options: [
        { text: "Xem lại từng câu sai và ghi vào sổ lỗi sai", scores: { [MS]: 2 } },
        { text: "Rủ bạn điểm cao giảng lại cho mình", scores: { [NH]: 2 } },
        { text: "Tự nhủ kỳ sau sẽ ôn sớm hơn, nhưng chắc chắn sẽ lại để sát giờ", scores: { [NR]: 2 } },
        { text: "Tối nay thức khuya cày lại toàn bộ chương đó", scores: { [CU]: 2 } },
      ],
    },
    {
      id: "hk-giai-lao",
      text: "Giữa giờ học, bạn giải lao bằng cách nào?",
      options: [
        { text: "Đặt hẹn giờ đúng 5 phút rồi quay lại học", scores: { [MS]: 2 } },
        { text: "Pha mì gói, giờ này mà không ăn thì không chịu được", scores: { [CU]: 2 } },
        { text: "Tám chuyện với nhóm, đôi khi hơi lâu hơn dự định", scores: { [NH]: 2 } },
        { text: "Lướt điện thoại, và thế là hết buổi tối", scores: { [NR]: 2 } },
      ],
    },
    {
      id: "hk-mon-moi",
      text: "Bắt đầu một môn học mới hoàn toàn, bạn sẽ…",
      options: [
        { text: "Đọc trước giáo trình và mục lục để nắm khung", scores: { [MS]: 2 } },
        { text: "Hỏi các anh chị khóa trên xem môn này học thế nào", scores: { [NH]: 2 } },
        { text: "Đi học đủ, còn ôn thì để sau", scores: { [NR]: 2 } },
        { text: "Tối về xem thêm video bài giảng trên mạng tới khuya", scores: { [CU]: 2, [MS]: 1 } },
      ],
    },
    {
      id: "hk-bao-thuc",
      text: "Chuông báo thức buổi sáng của bạn…",
      options: [
        { text: "Đặt 5 cái cách nhau 5 phút mà vẫn suýt muộn", scores: { [CU]: 2 } },
        { text: "Một cái là đủ, dậy đúng giờ như mọi ngày", scores: { [MS]: 2 } },
        { text: "Bạn cùng phòng hoặc bạn thân gọi dậy giùm", scores: { [NH]: 2 } },
        { text: "Mùa thi thì dậy sớm, ngày thường thì tùy duyên", scores: { [NR]: 2 } },
      ],
    },
    {
      id: "hk-de-cuong",
      text: "Thầy cô phát đề cương ôn tập 50 câu. Bạn xử lý thế nào?",
      options: [
        { text: "Chia cho cả nhóm, mỗi người soạn 10 câu rồi gộp lại", scores: { [NH]: 2 } },
        { text: "Tự soạn đủ 50 câu, viết tay cho dễ nhớ", scores: { [MS]: 2 } },
        { text: "Chờ bản soạn sẵn của lớp rồi học thuộc trong 2 ngày", scores: { [NR]: 2, [NH]: 1 } },
        { text: "Mỗi đêm soạn vài câu trong lúc mọi người đã ngủ", scores: { [CU]: 2 } },
      ],
    },
    {
      id: "hk-sau-thi",
      text: "Thi xong môn cuối cùng, bạn làm gì?",
      options: [
        { text: "Ngủ bù một giấc thật dài cho những đêm thức khuya", scores: { [CU]: 2 } },
        { text: "Tổ chức ăn mừng cùng cả nhóm ôn thi", scores: { [NH]: 2 } },
        { text: "Thở phào: lại một lần nước rút thành công", scores: { [NR]: 2 } },
        { text: "Xem trước chương trình của học kỳ sau", scores: { [MS]: 2 } },
      ],
    },
  ],
};
