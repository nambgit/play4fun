import type { TriviaCategory } from "@play4fun/party";

/**
 * Questions for "Đố vui team building". `a[0]` is the correct answer; the server shuffles
 * the options for each game. Only stable, uncontroversial facts: avoid things that change
 * over time (administrative boundaries, records, "the newest…") or are disputed.
 * `id` must stay unique (used to avoid repeats in the same room).
 */
export type TriviaQuestion = { id: string; cat: Exclude<TriviaCategory, "all">; q: string; a: [string, string, string, string] };

export const TRIVIA: TriviaQuestion[] = [
  // ------------------------------------------------------------ Kiến thức chung
  { id: "c-chau-luc", cat: "chung", q: "Châu lục nào rộng lớn nhất thế giới?", a: ["Châu Á", "Châu Phi", "Châu Mỹ", "Châu Âu"] },
  { id: "c-dai-duong", cat: "chung", q: "Đại dương nào lớn nhất Trái Đất?", a: ["Thái Bình Dương", "Đại Tây Dương", "Ấn Độ Dương", "Bắc Băng Dương"] },
  { id: "c-nam-nhuan", cat: "chung", q: "Một năm nhuận dương lịch có bao nhiêu ngày?", a: ["366", "365", "364", "367"] },
  { id: "c-tokyo", cat: "chung", q: "Thủ đô của Nhật Bản là thành phố nào?", a: ["Tokyo", "Osaka", "Kyoto", "Seoul"] },
  { id: "c-canberra", cat: "chung", q: "Thủ đô của Úc là thành phố nào?", a: ["Canberra", "Sydney", "Melbourne", "Perth"] },
  { id: "c-kim-tu-thap", cat: "chung", q: "Kim tự tháp Giza nằm ở quốc gia nào?", a: ["Ai Cập", "Mexico", "Peru", "Iraq"] },
  { id: "c-eiffel", cat: "chung", q: "Tháp Eiffel nằm ở thành phố nào?", a: ["Paris", "London", "Rome", "Berlin"] },
  { id: "c-mona-lisa", cat: "chung", q: "Ai là tác giả bức tranh Mona Lisa?", a: ["Leonardo da Vinci", "Pablo Picasso", "Vincent van Gogh", "Michelangelo"] },
  { id: "c-world-cup", cat: "chung", q: "World Cup bóng đá nam được tổ chức mấy năm một lần?", a: ["4 năm", "2 năm", "3 năm", "5 năm"] },
  { id: "c-doi-bong", cat: "chung", q: "Mỗi đội bóng đá có bao nhiêu cầu thủ trên sân khi bắt đầu trận?", a: ["11", "10", "9", "12"] },
  { id: "c-yen", cat: "chung", q: "Đơn vị tiền tệ của Nhật Bản là gì?", a: ["Yên", "Won", "Nhân dân tệ", "Baht"] },
  { id: "c-cau-vong", cat: "chung", q: "Theo cách gọi phổ biến, cầu vồng có bao nhiêu màu?", a: ["7", "6", "5", "8"] },
  { id: "c-everest", cat: "chung", q: "Ngọn núi nào cao nhất thế giới tính từ mực nước biển?", a: ["Everest", "K2", "Kilimanjaro", "Phú Sĩ"] },
  { id: "c-olympic", cat: "chung", q: "Thế vận hội Olympic mùa hè thường được tổ chức mấy năm một lần?", a: ["4 năm", "2 năm", "3 năm", "6 năm"] },
  { id: "c-shakespeare", cat: "chung", q: "Vở kịch “Romeo và Juliet” là của tác giả nào?", a: ["William Shakespeare", "Victor Hugo", "Lev Tolstoy", "Charles Dickens"] },
  { id: "c-gio-tuan", cat: "chung", q: "Một tuần có bao nhiêu giờ?", a: ["168", "144", "172", "186"] },
  { id: "c-chiec-ung", cat: "chung", q: "Quốc gia nào có lãnh thổ hình chiếc ủng?", a: ["Ý", "Hy Lạp", "Tây Ban Nha", "Chile"] },
  { id: "c-nu-than", cat: "chung", q: "Tượng Nữ thần Tự do ở New York là quà tặng của nước nào?", a: ["Pháp", "Anh", "Tây Ban Nha", "Hà Lan"] },
  { id: "c-dan-piano", cat: "chung", q: "Đàn piano tiêu chuẩn có bao nhiêu phím?", a: ["88", "76", "61", "100"] },
  { id: "c-co-vua", cat: "chung", q: "Bàn cờ vua có tất cả bao nhiêu ô?", a: ["64", "81", "100", "49"] },

  // ------------------------------------------------------------ Việt Nam
  { id: "v-phan-xi-pang", cat: "vietnam", q: "Đỉnh núi nào cao nhất Việt Nam?", a: ["Phan Xi Păng", "Pu Si Lung", "Tây Côn Lĩnh", "Bà Đen"] },
  { id: "v-ha-long", cat: "vietnam", q: "Vịnh Hạ Long thuộc tỉnh nào?", a: ["Quảng Ninh", "Hải Phòng", "Ninh Bình", "Thanh Hóa"] },
  { id: "v-ngan-hoa", cat: "vietnam", q: "Thành phố nào được mệnh danh là “thành phố ngàn hoa”?", a: ["Đà Lạt", "Huế", "Hội An", "Sa Pa"] },
  { id: "v-song-hong", cat: "vietnam", q: "Con sông lớn nào chảy qua Hà Nội?", a: ["Sông Hồng", "Sông Hương", "Sông Hàn", "Sông Đà"] },
  { id: "v-song-huong", cat: "vietnam", q: "Sông Hương gắn liền với thành phố nào?", a: ["Huế", "Đà Nẵng", "Hà Nội", "Cần Thơ"] },
  { id: "v-lang-lieu", cat: "vietnam", q: "Theo truyền thuyết, ai là người làm ra bánh chưng, bánh giầy?", a: ["Lang Liêu", "Thánh Gióng", "Sơn Tinh", "An Dương Vương"] },
  { id: "v-doi-do", cat: "vietnam", q: "Ai là người dời đô từ Hoa Lư về Thăng Long?", a: ["Lý Thái Tổ", "Trần Thái Tông", "Lê Lợi", "Đinh Bộ Lĩnh"] },
  { id: "v-nam-1010", cat: "vietnam", q: "Kinh đô được dời về Thăng Long vào năm nào?", a: ["1010", "938", "1225", "1428"] },
  { id: "v-bach-dang-938", cat: "vietnam", q: "Chiến thắng Bạch Đằng năm 938 gắn với tên tuổi của ai?", a: ["Ngô Quyền", "Trần Hưng Đạo", "Lê Hoàn", "Lý Thường Kiệt"] },
  { id: "v-truyen-kieu", cat: "vietnam", q: "Ai là tác giả của Truyện Kiều?", a: ["Nguyễn Du", "Nguyễn Trãi", "Hồ Xuân Hương", "Nguyễn Đình Chiểu"] },
  { id: "v-binh-ngo", cat: "vietnam", q: "“Bình Ngô đại cáo” do ai soạn thảo?", a: ["Nguyễn Trãi", "Lê Lợi", "Lý Thường Kiệt", "Trần Quốc Tuấn"] },
  { id: "v-vnd", cat: "vietnam", q: "Mã tiền tệ quốc tế của đồng Việt Nam là gì?", a: ["VND", "VNM", "VDN", "DVN"] },
  { id: "v-son-doong", cat: "vietnam", q: "Hang động tự nhiên lớn nhất thế giới ở Việt Nam có tên là gì?", a: ["Sơn Đoòng", "Phong Nha", "Thiên Đường", "Sửng Sốt"] },
  { id: "v-quoc-khanh", cat: "vietnam", q: "Ngày Quốc khánh nước Cộng hòa Xã hội Chủ nghĩa Việt Nam là ngày nào?", a: ["2/9", "30/4", "1/5", "19/8"] },
  { id: "v-cai-rang", cat: "vietnam", q: "Chợ nổi Cái Răng nổi tiếng thuộc thành phố nào?", a: ["Cần Thơ", "Vĩnh Long", "Long Xuyên", "Sóc Trăng"] },
  { id: "v-van-mieu", cat: "vietnam", q: "Văn Miếu – Quốc Tử Giám, được xem là trường đại học đầu tiên của Việt Nam, nằm ở đâu?", a: ["Hà Nội", "Huế", "Ninh Bình", "Bắc Ninh"] },
  { id: "v-dan-bau", cat: "vietnam", q: "Nhạc cụ truyền thống nào của Việt Nam chỉ có một dây?", a: ["Đàn bầu", "Đàn tranh", "Đàn nguyệt", "Đàn tỳ bà"] },
  { id: "v-trung-thu", cat: "vietnam", q: "Tết Trung Thu rơi vào ngày nào âm lịch?", a: ["Rằm tháng 8", "Rằm tháng Giêng", "Mùng 5 tháng 5", "Rằm tháng 7"] },
  { id: "v-cau-rong", cat: "vietnam", q: "Cây cầu có hình con rồng phun lửa, phun nước nằm ở thành phố nào?", a: ["Đà Nẵng", "Hà Nội", "Huế", "Hải Phòng"] },
  { id: "v-hai-ba-trung", cat: "vietnam", q: "Cuộc khởi nghĩa năm 40 chống ách đô hộ nhà Hán do ai lãnh đạo?", a: ["Hai Bà Trưng", "Bà Triệu", "Lý Bí", "Mai Thúc Loan"] },

  // ------------------------------------------------------------ Khoa học & tự nhiên
  { id: "k-sao-thuy", cat: "khoahoc", q: "Hành tinh nào gần Mặt Trời nhất?", a: ["Sao Thủy", "Sao Kim", "Sao Hỏa", "Trái Đất"] },
  { id: "k-sao-moc", cat: "khoahoc", q: "Hành tinh nào lớn nhất trong Hệ Mặt Trời?", a: ["Sao Mộc", "Sao Thổ", "Sao Hải Vương", "Trái Đất"] },
  { id: "k-hanh-tinh-do", cat: "khoahoc", q: "Hành tinh nào thường được gọi là “Hành tinh Đỏ”?", a: ["Sao Hỏa", "Sao Kim", "Sao Mộc", "Sao Thiên Vương"] },
  { id: "k-h2o", cat: "khoahoc", q: "Công thức hóa học của nước là gì?", a: ["H₂O", "CO₂", "O₂", "NaCl"] },
  { id: "k-nito", cat: "khoahoc", q: "Khí nào chiếm tỉ lệ lớn nhất trong không khí?", a: ["Nitơ", "Oxy", "Cacbonic", "Hydro"] },
  { id: "k-nuoc-soi", cat: "khoahoc", q: "Ở áp suất tiêu chuẩn, nước sôi ở bao nhiêu độ C?", a: ["100°C", "90°C", "80°C", "120°C"] },
  { id: "k-da", cat: "khoahoc", q: "Cơ quan nào lớn nhất trên cơ thể người?", a: ["Da", "Gan", "Phổi", "Não"] },
  { id: "k-206-xuong", cat: "khoahoc", q: "Cơ thể người trưởng thành có khoảng bao nhiêu chiếc xương?", a: ["206", "180", "250", "300"] },
  { id: "k-tim-4-ngan", cat: "khoahoc", q: "Tim người có bao nhiêu ngăn?", a: ["4", "2", "3", "5"] },
  { id: "k-voi", cat: "khoahoc", q: "Loài động vật trên cạn nào lớn nhất hiện nay?", a: ["Voi châu Phi", "Tê giác trắng", "Hà mã", "Hươu cao cổ"] },
  { id: "k-ca-voi-xanh", cat: "khoahoc", q: "Loài động vật nào lớn nhất từng được biết đến trên Trái Đất?", a: ["Cá voi xanh", "Khủng long bạo chúa", "Cá mập voi", "Voi ma mút"] },
  { id: "k-anh-sang", cat: "khoahoc", q: "Ánh sáng Mặt Trời mất khoảng bao lâu để đến Trái Đất?", a: ["Khoảng 8 phút", "Khoảng 8 giây", "Khoảng 8 giờ", "Khoảng 1 ngày"] },
  { id: "k-thuy-ngan", cat: "khoahoc", q: "Kim loại nào ở thể lỏng ở nhiệt độ phòng?", a: ["Thủy ngân", "Chì", "Nhôm", "Thiếc"] },
  { id: "k-au", cat: "khoahoc", q: "“Au” là ký hiệu hóa học của nguyên tố nào?", a: ["Vàng", "Bạc", "Đồng", "Nhôm"] },
  { id: "k-quang-hop", cat: "khoahoc", q: "Khi quang hợp, cây xanh hấp thụ khí nào?", a: ["Cacbonic (CO₂)", "Oxy", "Nitơ", "Hydro"] },
  { id: "k-einstein", cat: "khoahoc", q: "Ai là người đề xuất thuyết tương đối?", a: ["Albert Einstein", "Isaac Newton", "Galileo Galilei", "Nikola Tesla"] },
  { id: "k-46-nst", cat: "khoahoc", q: "Tế bào cơ thể người bình thường có bao nhiêu nhiễm sắc thể?", a: ["46", "23", "44", "48"] },
  { id: "k-ampe", cat: "khoahoc", q: "Đơn vị đo cường độ dòng điện là gì?", a: ["Ampe", "Vôn", "Oát", "Ôm"] },
  { id: "k-da-dieu", cat: "khoahoc", q: "Loài chim nào lớn nhất thế giới và không biết bay?", a: ["Đà điểu", "Chim cánh cụt hoàng đế", "Chim kiwi", "Bồ nông"] },
  { id: "k-mat-trang", cat: "khoahoc", q: "Mặt Trăng quay hết một vòng quanh Trái Đất mất khoảng bao lâu?", a: ["Khoảng 1 tháng", "Khoảng 1 tuần", "Khoảng 1 năm", "Khoảng 1 ngày"] },

  // ------------------------------------------------------------ Công sở & công nghệ
  { id: "o-ctrl-c", cat: "congso", q: "Trên Windows, phím tắt nào dùng để sao chép (copy)?", a: ["Ctrl + C", "Ctrl + V", "Ctrl + X", "Ctrl + Z"] },
  { id: "o-ctrl-z", cat: "congso", q: "Ctrl + Z thường dùng để làm gì?", a: ["Hoàn tác thao tác vừa làm", "Lưu tài liệu", "In tài liệu", "Đóng cửa sổ"] },
  { id: "o-cc", cat: "congso", q: "Trong email, “CC” là viết tắt của cụm từ nào?", a: ["Carbon copy", "Copy content", "Contact center", "Company code"] },
  { id: "o-bcc", cat: "congso", q: "Người nhận được thêm vào ô “BCC” của email sẽ…", a: ["Không hiện tên với những người nhận khác", "Nhận email sau 1 ngày", "Không thể trả lời email", "Nhận bản không có file đính kèm"] },
  { id: "o-xlsx", cat: "congso", q: "Đuôi file nào là của bảng tính Excel?", a: [".xlsx", ".docx", ".pptx", ".txt"] },
  { id: "o-kpi", cat: "congso", q: "KPI là viết tắt của cụm từ nào?", a: ["Key Performance Indicator", "Key Product Item", "Knowledge Process Index", "Keep People Informed"] },
  { id: "o-win-shift-s", cat: "congso", q: "Trên Windows 10/11, tổ hợp phím nào mở công cụ chụp một vùng màn hình?", a: ["Windows + Shift + S", "Ctrl + P", "Alt + Tab", "Windows + D"] },
  { id: "o-alt-f4", cat: "congso", q: "Alt + F4 trên Windows dùng để làm gì?", a: ["Đóng cửa sổ đang mở", "Mở trình duyệt", "Đổi ngôn ngữ bàn phím", "Chụp màn hình"] },
  { id: "o-wfh", cat: "congso", q: "“WFH” là viết tắt của cụm từ nào?", a: ["Work From Home", "Work For Hours", "Wait For Help", "Weekly Feedback Hub"] },
  { id: "o-tb", cat: "congso", q: "Đơn vị dung lượng nào lớn nhất?", a: ["1 TB", "1 GB", "1 MB", "1 KB"] },
  { id: "o-byte", cat: "congso", q: "1 byte bằng bao nhiêu bit?", a: ["8", "4", "10", "16"] },
  { id: "o-pdf", cat: "congso", q: "PDF là viết tắt của cụm từ nào?", a: ["Portable Document Format", "Print Data File", "Public Document File", "Personal Data Form"] },
  { id: "o-microsoft", cat: "congso", q: "Ai là người đồng sáng lập Microsoft?", a: ["Bill Gates", "Steve Jobs", "Mark Zuckerberg", "Jeff Bezos"] },
  { id: "o-otp", cat: "congso", q: "Mã OTP thường được dùng để làm gì?", a: ["Xác thực một lần khi đăng nhập/giao dịch", "Đặt tên file", "Nén dữ liệu", "Tăng tốc wifi"] },
  { id: "o-sum", cat: "congso", q: "Trong Excel, hàm nào dùng để tính tổng?", a: ["SUM", "AVERAGE", "COUNT", "MAX"] },
  { id: "o-brainstorm", cat: "congso", q: "Buổi “brainstorm” trong công ty là buổi…", a: ["Cùng nhau đưa ra thật nhiều ý tưởng", "Kiểm tra sức khỏe định kỳ", "Đánh giá lương thưởng", "Tập thể dục giữa giờ"] },
  { id: "o-url", cat: "congso", q: "“URL” là gì?", a: ["Địa chỉ của một trang web", "Một loại virus máy tính", "Phần mềm diệt virus", "Cổng kết nối USB"] },
  { id: "o-ctrl-v", cat: "congso", q: "Phím tắt nào dùng để dán (paste) trên Windows?", a: ["Ctrl + V", "Ctrl + C", "Ctrl + P", "Ctrl + B"] },
  { id: "o-ctrl-f", cat: "congso", q: "Ctrl + F thường dùng để làm gì?", a: ["Tìm kiếm chữ trong trang", "Mở file mới", "Phóng to màn hình", "Gửi email"] },
  { id: "o-at", cat: "congso", q: "Ký tự “@” trong địa chỉ email, tiếng Anh đọc là gì?", a: ["at", "and", "about", "address"] },
];
