/**
 * Passage pools for "Gõ phím thần tốc". Original short texts (plus public-domain
 * Vietnamese proverbs / folk verses), themed for office workers, students and gamers.
 *
 * Rules for new passages:
 *  - 18–40 words, one or two sentences that read naturally.
 *  - Only characters on a normal keyboard: letters (with Vietnamese diacritics), digits,
 *    straight punctuation . , ? ! : ; ' - ( ). No curly quotes, em dashes or emoji.
 *  - `id` must be unique and never reused (it is stored in players' "recently seen" list).
 */

export type Lang = "vi" | "en";

export type Passage = { id: string; text: string };

export const LANG_LABEL: Record<Lang, string> = { vi: "Tiếng Việt", en: "English" };

export const PASSAGES: Record<Lang, Passage[]> = {
  vi: [
    { id: "vi-sang-thu-hai", text: "Sáng thứ Hai, cả phòng ai cũng cầm một ly cà phê và nhìn màn hình như thể chỉ cần nhìn đủ lâu thì đống email sẽ tự trả lời." },
    { id: "vi-hop-5-phut", text: "Sếp nói cuộc họp chỉ kéo dài năm phút, nhưng đến khi tan họp thì trời đã tối và căng tin cũng đã đóng cửa từ lâu." },
    { id: "vi-deadline-dem", text: "Deadline là liều thuốc thần kỳ: cả tuần không viết được dòng nào, nhưng đêm cuối cùng lại gõ xong mười trang báo cáo." },
    { id: "vi-tra-sua", text: "Chiều thứ Sáu, nhóm chat của phòng bỗng sôi nổi hẳn lên khi có người hỏi một câu đơn giản: hôm nay ai muốn đặt trà sữa không?" },
    { id: "vi-wifi", text: "Mạng ở văn phòng chỉ chậm vào đúng hai thời điểm: khi bạn đang họp trực tuyến với khách hàng và khi bạn cần gửi file gấp." },
    { id: "vi-mat-khau", text: "Hệ thống yêu cầu mật khẩu mới phải có chữ hoa, chữ thường, chữ số, ký tự đặc biệt và không được trùng với mười mật khẩu cũ." },
    { id: "vi-kiem-tra-mieng", text: "Cô giáo vừa mở sổ điểm, cả lớp lập tức cúi đầu thật thấp, ai cũng cầu mong cái tên được gọi lên bảng không phải là mình." },
    { id: "vi-on-thi", text: "Kế hoạch ôn thi được lập rất chi tiết từ đầu học kỳ, nhưng thực tế thì mọi thứ chỉ thật sự bắt đầu vào đêm trước ngày thi." },
    { id: "vi-thu-vien", text: "Thư viện trường vào mùa thi đông đến mức muốn có một chỗ ngồi gần ổ cắm điện thì phải đến từ lúc cổng vừa mở." },
    { id: "vi-nhom-bai-tap", text: "Làm bài tập nhóm luôn có bốn kiểu người: một người làm hết, một người góp ý, một người hỏi hạn nộp và một người không bao giờ online." },
    { id: "vi-rank", text: "Chỉ cần thắng thêm một trận nữa là lên hạng, thế nhưng đồng đội lại bấm nhầm kỹ năng và cả đội phải bắt đầu lại từ đầu." },
    { id: "vi-mot-tran-nua", text: "Câu nói nguy hiểm nhất của game thủ không phải là thua rồi, mà là chơi thêm một trận nữa thôi rồi đi ngủ." },
    { id: "vi-pho-sang", text: "Hà Nội vào thu, gió heo may thổi nhẹ qua những con phố cũ, mùi hoa sữa thoang thoảng và hàng phở đầu ngõ đã đông khách từ sớm." },
    { id: "vi-sai-gon-mua", text: "Sài Gòn mưa rất lạ, mới nắng chang chang đó mà chỉ mười phút sau đường đã ngập, ai cũng vội tấp vào mái hiên gần nhất để trú." },
    { id: "vi-banh-mi", text: "Một ổ bánh mì nóng giòn với pa tê, chả lụa, dưa leo và chút nước sốt là bữa sáng nhanh gọn của biết bao người đi làm." },
    { id: "vi-ha-long", text: "Vịnh Hạ Long có gần hai nghìn hòn đảo lớn nhỏ, mỗi hòn mang một hình dáng riêng và gắn với những truyền thuyết được kể từ đời này sang đời khác." },
    { id: "vi-tet", text: "Những ngày giáp Tết, ai cũng tất bật dọn nhà, gói bánh chưng và chuẩn bị mâm ngũ quả để đón một năm mới bình an, sung túc." },
    { id: "vi-ca-dao-cong-cha", text: "Công cha như núi Thái Sơn, nghĩa mẹ như nước trong nguồn chảy ra. Một lòng thờ mẹ kính cha, cho tròn chữ hiếu mới là đạo con." },
    { id: "vi-tuc-ngu-hoc", text: "Có công mài sắt có ngày nên kim. Học hôm nay một chút, ngày mai thêm một chút, rồi sẽ đến lúc bạn ngạc nhiên vì mình đã đi xa đến vậy." },
    { id: "vi-bau-oi", text: "Bầu ơi thương lấy bí cùng, tuy rằng khác giống nhưng chung một giàn. Người trong một nước phải thương nhau cùng." },
    { id: "vi-di-mot-ngay", text: "Đi một ngày đàng học một sàng khôn. Mỗi chuyến đi xa là một dịp để mở mang tầm mắt và hiểu thêm về chính bản thân mình." },
    { id: "vi-ban-phim", text: "Gõ phím mười ngón không khó như bạn nghĩ, chỉ cần đặt tay đúng vị trí, nhìn màn hình thay vì nhìn bàn phím và kiên nhẫn luyện mỗi ngày." },
    { id: "vi-telex", text: "Người dùng Telex gõ chữ ư bằng phím w, còn người dùng VNI lại quen bấm số bảy. Hai phe tranh luận mãi mà vẫn chưa ai chịu ai." },
    { id: "vi-nghi-phep", text: "Đơn xin nghỉ phép đã viết xong từ tuần trước, nhưng đến giờ vẫn nằm trong thư mục nháp vì chưa tìm được lúc nào sếp vui vẻ để gửi." },
    { id: "vi-may-in", text: "Máy in của công ty có một năng lực đặc biệt: nó luôn biết lúc nào bạn đang vội nhất để báo kẹt giấy hoặc hết mực." },
    { id: "vi-luong-ve", text: "Ngày lương về, cả phòng rủ nhau đi ăn lẩu thật sang. Một tuần sau, cũng chính những người ấy ngồi chia nhau gói mì tôm cuối cùng." },
    { id: "vi-the-duc", text: "Mỗi tối trước khi ngủ, tôi đều tự hứa sáng mai sẽ dậy sớm chạy bộ. Mỗi sáng thức dậy, tôi lại tự hứa sẽ bắt đầu vào ngày mai." },
    { id: "vi-meo-van-phong", text: "Con mèo của tòa nhà thích nhất là nằm ngủ trên bàn phím của người đang gấp nhất, và chẳng ai nỡ đuổi nó đi cả." },
    { id: "vi-sao-luu", text: "Hãy sao lưu dữ liệu thường xuyên, vì máy tính chỉ hỏng vào đúng ngày bạn chưa kịp lưu bản trình bày quan trọng nhất của năm." },
    { id: "vi-cho-tet", text: "Chợ hoa ngày Tết rực rỡ sắc màu: đào thắm miền Bắc, mai vàng miền Nam, quất trĩu quả và những chậu cúc vàng tươi xếp dọc lối đi." },
  ],
  en: [
    { id: "en-monday", text: "Every Monday morning the whole office stares at their screens, holding coffee and hoping the unread emails will somehow answer themselves." },
    { id: "en-quick-meeting", text: "The manager promised a quick five minute meeting, but by the time it ended the sun had set and the cafeteria was already closed." },
    { id: "en-deadline", text: "A deadline is a strange kind of magic: you write nothing for a whole week, then finish ten pages in a single night." },
    { id: "en-wifi", text: "The office wifi only slows down at two moments: when you are on a video call with a client and when you need to send an urgent file." },
    { id: "en-password", text: "Your new password must contain uppercase and lowercase letters, a number, a symbol, and must not match any of your last ten passwords." },
    { id: "en-printer", text: "The office printer has a special talent: it always knows when you are in a hurry and chooses that exact moment to jam." },
    { id: "en-reply-all", text: "Someone pressed reply all on a company wide email, and within minutes four hundred people were asking everyone else to stop replying to all." },
    { id: "en-friday", text: "On Friday afternoon the team chat suddenly came alive when someone asked a simple question: does anyone want to order bubble tea?" },
    { id: "en-exam", text: "The study plan was perfect at the start of the semester, but the real studying only began on the night before the final exam." },
    { id: "en-group-project", text: "Every group project has four kinds of people: one who does everything, one who gives advice, one who asks about the deadline, and one who is never online." },
    { id: "en-library", text: "During exam season the library is so crowded that the only way to get a seat near a power outlet is to arrive before the doors open." },
    { id: "en-homework", text: "My homework was finished on time, saved twice, and backed up to the cloud, yet somehow the file refused to open in class." },
    { id: "en-one-more", text: "The most dangerous words a gamer can say are not I lost again, but just one more match and then I will go to sleep." },
    { id: "en-rank", text: "We needed only one more win to reach the next rank, but a teammate pressed the wrong button and we had to start all over again." },
    { id: "en-lag", text: "It was a perfect play until the screen froze for one second, and when it came back our whole team was already waiting to respawn." },
    { id: "en-fox", text: "The quick brown fox jumps over the lazy dog, a short sentence that uses every letter of the alphabet and is loved by typists everywhere." },
    { id: "en-touch-typing", text: "Touch typing is easier than it looks: keep your fingers on the home row, look at the screen instead of the keys, and practice a little every day." },
    { id: "en-coffee", text: "Coffee is not a drink in this office, it is a support system. Without it, nobody would remember their passwords before ten in the morning." },
    { id: "en-cat", text: "The building cat loves to sleep on the keyboard of whoever is busiest, and somehow nobody ever has the heart to move it away." },
    { id: "en-rain", text: "The rain started without warning, and within ten minutes the streets were full of people running for the nearest shelter with bags over their heads." },
    { id: "en-ocean", text: "The ocean covers more than two thirds of our planet, yet people have explored only a small part of the deep water far below the surface." },
    { id: "en-moon", text: "Astronauts first walked on the moon in 1969, and the footprints they left behind may stay there for millions of years because there is no wind." },
    { id: "en-bees", text: "A single honey bee visits hundreds of flowers in one trip, and a whole hive must work together for months to fill just one jar of honey." },
    { id: "en-octopus", text: "An octopus has three hearts and blue blood, and it can change the color of its skin in less than a second to hide from danger." },
    { id: "en-backup", text: "Always back up your work, because computers only crash on the day you forgot to save the most important presentation of the year." },
    { id: "en-alarm", text: "Every night I promise myself that I will wake up early and go for a run. Every morning I promise myself that I will start tomorrow." },
    { id: "en-payday", text: "On payday the whole team went out for a fancy dinner. One week later, the same people were sharing the last pack of instant noodles." },
    { id: "en-practice", text: "Small steps every day add up to big results. You do not need to be fast at the beginning, you only need to keep going." },
    { id: "en-travel", text: "Traveling to a new city teaches you more than any book: how to read a map, how to order food in another language, and how to stay calm when lost." },
    { id: "en-bug", text: "The bug disappeared the moment I asked a colleague to look at it, and came back as soon as they walked away from my desk." },
  ],
};
