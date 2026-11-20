/**
 * Inbox Zero email pool. The player works in the Marketing team of the fictional
 * "Công ty Cổ phần Mây Xanh" — real colleagues always use @mayxanh.vn.
 *
 *  handle  → swipe right: real work for you
 *  delete  → swipe left : spam, ads, auto-replies, and phishing
 *  forward → swipe up   : meant for another department
 */

export type Answer = "handle" | "delete" | "forward";
export type Category = "handle" | "delete" | "forward" | "phishing";

export type Email = {
  from: string;
  address: string;
  subject: string;
  preview: string;
  answer: Answer;
  category: Category;
  /** Shown when the player gets this one wrong */
  reason: string;
  attachment?: string;
};

export const COMPANY_DOMAIN = "mayxanh.vn";

type Raw = Omit<Email, "answer" | "category">;

const handle = (e: Raw): Email => ({ ...e, answer: "handle", category: "handle" });
const junk = (e: Raw): Email => ({ ...e, answer: "delete", category: "delete" });
const forward = (e: Raw): Email => ({ ...e, answer: "forward", category: "forward" });
const phishing = (e: Raw): Email => ({ ...e, answer: "delete", category: "phishing" });

export const EMAILS: Email[] = [
  // ------------------------------------------------------------ việc của bạn
  handle({ from: "Sếp Tuấn", address: "tuan.le@mayxanh.vn", subject: "Cần slide báo cáo trước 17h", preview: "Em gửi anh bản slide chiến dịch tháng 11 trước 5h chiều nay nhé, 3h anh họp với ban giám đốc.", reason: "Việc sếp giao — phải xử lý ngay!" }),
  handle({ from: "Chị Hoa · TP Marketing", address: "hoa.tran@mayxanh.vn", subject: "Duyệt caption fanpage thứ Sáu", preview: "Em xem giúp chị 3 caption cho bài đăng thứ Sáu, sửa trực tiếp trong file nhé.", reason: "Trưởng phòng nhờ việc chuyên môn — xử lý nhé." , attachment: "caption_thu6.docx" }),
  handle({ from: "Thảo · Cty Bình Minh", address: "thao@binhminhfood.vn", subject: "Hỏi báo giá gói quảng cáo Tết", preview: "Bên em muốn chạy chiến dịch Tết 2027, anh/chị gửi giúp báo giá các gói nhé.", reason: "Khách hàng hỏi giá — cơ hội doanh thu, phải xử lý!" }),
  handle({ from: "Minh · Thiết kế", address: "minh.vo@mayxanh.vn", subject: "Banner v3 — xin feedback", preview: "Em đã sửa màu và font theo góp ý, anh/chị xem bản v3 rồi chốt giúp em.", reason: "Đồng nghiệp chờ góp ý của bạn — xử lý nhé.", attachment: "banner_v3.png" }),
  handle({ from: "Sóng Việt Agency", address: "account@songviet.agency", subject: "Chốt lịch quay TVC tuần sau", preview: "Bên mình đề xuất quay thứ Ba lúc 8h tại studio Quận 7, anh/chị xác nhận giúp.", reason: "Đối tác cần bạn xác nhận lịch — xử lý." }),
  handle({ from: "Sếp Tuấn", address: "tuan.le@mayxanh.vn", subject: "Dời 1:1 sang 10h mai", preview: "Mai anh dời buổi 1:1 sang 10h nhé, em accept lịch mới giúp anh.", reason: "Lịch họp với sếp — cần xác nhận." }),
  handle({ from: "Lan · Sales", address: "lan.pham@mayxanh.vn", subject: "Xin số liệu lead tháng 10", preview: "Chị cần số lead từ chiến dịch Facebook tháng 10 để báo cáo cuối tuần.", reason: "Số liệu lead do Marketing nắm — bạn xử lý." }),
  handle({ from: "Gia Hân Media", address: "booking@giahan.media", subject: "Xác nhận livestream 25/11", preview: "Bên em giữ slot livestream 20h ngày 25/11, anh/chị xác nhận trước thứ Tư nhé.", reason: "Booking KOL cho chiến dịch — xử lý." }),
  handle({ from: "Chị Hoa · TP Marketing", address: "hoa.tran@mayxanh.vn", subject: "Ngân sách ads tháng 12", preview: "Em lên đề xuất ngân sách quảng cáo tháng 12, gửi chị trước thứ Năm nhé.", reason: "Việc trưởng phòng giao — xử lý." }),
  handle({ from: "Shop Mộc", address: "hello@shopmoc.vn", subject: "Phản hồi chương trình affiliate", preview: "Shop mình muốn tham gia affiliate của Mây Xanh, cần trao đổi thêm về hoa hồng.", reason: "Đối tác tiềm năng — xử lý nhé." }),
  handle({ from: "Đức · Content", address: "duc.ng@mayxanh.vn", subject: "Nhờ soát bài PR trước khi gửi báo", preview: "Bài PR ra mắt sản phẩm mới, nhờ anh/chị soát lỗi giúp em trước 15h.", reason: "Đồng nghiệp cần bạn duyệt — xử lý.", attachment: "PR_sanphammoi.docx" }),
  handle({ from: "Báo Đời Sống Số", address: "phongvien@doisongso.vn", subject: "Xin phỏng vấn về chiến dịch Sống Xanh", preview: "Phóng viên muốn hẹn 20 phút phỏng vấn về chiến dịch Sống Xanh của công ty.", reason: "Truyền thông báo chí là việc của Marketing — xử lý!" }),
  handle({ from: "Trang · Sự kiện", address: "trang.do@mayxanh.vn", subject: "Chốt khách mời workshop", preview: "Còn thiếu danh sách khách mời phía Marketing, anh/chị gửi em trong hôm nay nhé.", reason: "Đồng nghiệp chờ bạn — xử lý." }),
  handle({ from: "Chị Hoa · TP Marketing", address: "hoa.tran@mayxanh.vn", subject: "Brief chiến dịch Black Friday", preview: "Chị gửi brief, em đọc trước và ghi câu hỏi cho buổi họp chiều nay.", reason: "Brief chiến dịch — việc chính của bạn!", attachment: "brief_BF.pdf" }),
  handle({ from: "In Nhanh 24h", address: "order@innhanh24h.vn", subject: "Duyệt file in standee trước 14h", preview: "Bên in cần anh/chị duyệt file standee trước 14h để kịp giao sáng mai.", reason: "Nhà in chờ duyệt — trễ là hỏng sự kiện!" }),
  handle({ from: "Quang · Cty An Phát", address: "quang@anphat.com.vn", subject: "Gia hạn hợp đồng truyền thông 2027", preview: "Bên mình muốn gia hạn hợp đồng truyền thông, hẹn anh/chị một buổi trao đổi.", reason: "Khách hàng muốn gia hạn — xử lý ngay!" }),
  handle({ from: "Huy · Data", address: "huy.bui@mayxanh.vn", subject: "Dashboard đã cập nhật CTR", preview: "Em vừa cập nhật dashboard, anh/chị kiểm tra giúp số CTR tuần này có hợp lý không.", reason: "Số liệu chiến dịch của bạn — xử lý." }),
  handle({ from: "Sếp Tuấn", address: "tuan.le@mayxanh.vn", subject: "Góp ý gấp email gửi đối tác", preview: "Em đọc lại email anh soạn cho đối tác Nhật, sửa giúp anh câu chữ cho mềm hơn.", reason: "Sếp nhờ gấp — xử lý!" }),
  handle({ from: "Chị Hoa · TP Marketing", address: "hoa.tran@mayxanh.vn", subject: "Báo cáo hiệu quả chiến dịch Q3", preview: "Em tổng hợp giúp chị reach, CTR và chi phí mỗi đơn của quý 3, gửi trước sáng thứ Hai.", reason: "Báo cáo chiến dịch là việc của bạn — xử lý." }),
  handle({ from: "Phương · Cty Hạt Ngọc", address: "phuong@hatngoc.vn", subject: "Muốn đặt lịch demo sản phẩm", preview: "Bên chị quan tâm gói truyền thông trọn gói, em sắp xếp giúp một buổi demo tuần sau nhé.", reason: "Khách hàng tiềm năng — xử lý ngay!" }),
  handle({ from: "Minh · Thiết kế", address: "minh.vo@mayxanh.vn", subject: "Cần nội dung cho bộ ảnh Tết", preview: "Anh/chị gửi em câu chữ cho 6 ảnh Tết để em dàn trang trong hôm nay nhé.", reason: "Đồng nghiệp đang chờ nội dung từ bạn — xử lý." }),
  handle({ from: "Sếp Tuấn", address: "tuan.le@mayxanh.vn", subject: "Chuẩn bị số liệu họp giao ban", preview: "Thứ Hai giao ban, em chuẩn bị 3 slide về kết quả fanpage tháng này giúp anh.", reason: "Sếp giao việc — xử lý!" }),
  handle({ from: "Linh · Radio Phố", address: "linh@radiopho.vn", subject: "Mời tham gia talkshow sáng thứ Bảy", preview: "Chương trình muốn mời đại diện Mây Xanh chia sẻ về sống xanh, anh/chị phản hồi giúp.", reason: "Cơ hội truyền thông — Marketing xử lý." }),
  handle({ from: "Đức · Content", address: "duc.ng@mayxanh.vn", subject: "Duyệt kịch bản video TikTok", preview: "Em gửi 2 kịch bản video 30 giây, anh/chị chọn giúp một bản để mai quay.", reason: "Duyệt nội dung là việc của bạn — xử lý.", attachment: "kichban_tiktok.docx" }),

  // ------------------------------------------------------------ rác
  junk({ from: "Siêu Sale XYZ", address: "promo@sieusale-xyz.shop", subject: "SIÊU SALE 11.11 — GIẢM ĐẾN 90%!!!", preview: "Chỉ hôm nay! Hàng ngàn deal sốc, săn ngay kẻo lỡ!!!", reason: "Quảng cáo — xóa cho gọn hộp thư." }),
  junk({ from: "Quà Tặng Miễn Phí", address: "thongbao@quatang-mienphi.win", subject: "Chúc mừng! Bạn đã trúng iPhone 20", preview: "Bạn là khách hàng may mắn thứ 1.000.000! Nhận quà ngay hôm nay.", reason: "Trúng thưởng trên trời rơi xuống = rác. Xóa!" }),
  junk({ from: "Mẹo Sống Xanh", address: "newsletter@tipsxanh.blog", subject: "Bản tin tuần: 10 mẹo sống xanh", preview: "Tuần này: cách tái chế chai nhựa thành chậu cây và nhiều hơn nữa.", reason: "Bản tin không cần xử lý — xóa cho gọn." }),
  junk({ from: "Học Viện Làm Giàu", address: "info@lamgiau7ngay.vip", subject: "Thu nhập 100 triệu/tháng sau 7 ngày", preview: "Bí quyết làm giàu không cần vốn, đăng ký ngay để nhận ưu đãi.", reason: "Quảng cáo nhảm — xóa." }),
  junk({ from: "Tài Chính Nhanh", address: "tuvan@vaynhanh-online.biz", subject: "Vay 500 triệu không cần thế chấp", preview: "Giải ngân trong 5 phút, chỉ cần CMND.", reason: "Quảng cáo vay tiền — xóa." }),
  junk({ from: "Nam · IT", address: "nam.ho@mayxanh.vn", subject: "[Tự động] Trả lời vắng mặt", preview: "Mình đang nghỉ phép đến 30/11, sẽ phản hồi khi quay lại.", reason: "Thư trả lời tự động — không cần làm gì, xóa." }),
  junk({ from: "Mạng Xã Hội", address: "no-reply@social-notify.app", subject: "Bạn có 3 thông báo mới", preview: "Ai đó đã thích ảnh của bạn và 2 thông báo khác.", reason: "Thông báo mạng xã hội — xóa." }),
  junk({ from: "Hội Cựu Học Sinh", address: "alumni-list@nhomlop12a.org", subject: "Re: Re: Fwd: Ảnh mèo dễ thương 😹", preview: "Haha con này giống thằng Tú lớp mình quá!!!", reason: "Chuỗi thư nhóm vui vẻ — để sau giờ làm, xóa." }),
  junk({ from: "Gym 24/7", address: "uudai@gym247.fit", subject: "Giảm 50% gói tập cho dân văn phòng", preview: "Đăng ký trong tuần này để nhận thêm 2 buổi PT miễn phí.", reason: "Quảng cáo — xóa." }),
  junk({ from: "Thầy Phong Thủy", address: "tuvan@phongthuy-vanphong.net", subject: "Đặt bàn làm việc hút tài lộc", preview: "Bàn hướng Đông Nam giúp thăng chức nhanh gấp 3 lần!", reason: "Quảng cáo nhảm — xóa." }),
  junk({ from: "Trà Sữa Mây", address: "khuyenmai@trasuamay.cafe", subject: "Mua 1 tặng 1 hôm nay thôi!", preview: "Áp dụng toàn bộ menu từ 14h đến 17h.", reason: "Hấp dẫn thật nhưng vẫn là quảng cáo — xóa." }),
  junk({ from: "Ứng dụng Chỉnh Ảnh", address: "update@photoapp.io", subject: "Đã có phiên bản mới 8.2", preview: "Thêm 20 bộ lọc mới và sửa một số lỗi nhỏ.", reason: "Thông báo cập nhật ứng dụng — xóa." }),
  junk({ from: "Thời Gian Màn Hình", address: "baocao@screentime.app", subject: "Báo cáo tuần: 52 giờ trên điện thoại", preview: "Tăng 12% so với tuần trước. Bạn có muốn đặt giới hạn?", reason: "Thông báo tự động — xóa." }),
  junk({ from: "Du Lịch Giá Rẻ", address: "deal@dulich-giare.travel", subject: "Tour Đà Lạt 3 ngày chỉ 999k", preview: "Số lượng có hạn, đặt ngay hôm nay để giữ chỗ cuối tuần!", reason: "Quảng cáo du lịch — xóa." }),
  junk({ from: "Nhóm Chạy Bộ", address: "clb@chaybo-sangsom.club", subject: "Nhắc lịch chạy bộ 5h sáng mai", preview: "Tập trung cổng công viên, nhớ mang nước nhé cả nhà!", reason: "Việc cá nhân ngoài giờ — không liên quan công việc, xóa." }),
  junk({ from: "Sàn Thương Mại", address: "khuyenmai@muasam-24h.shop", subject: "Bạn còn 3 món trong giỏ hàng", preview: "Hoàn tất đơn hàng trong 2 giờ tới để được miễn phí vận chuyển.", reason: "Nhắc giỏ hàng mua sắm — xóa." }),
  junk({ from: "Hội Nghị Online", address: "moi@webinar-thanhcong.live", subject: "Webinar: Bí quyết thành công tuổi 25", preview: "Diễn giả nổi tiếng chia sẻ 7 thói quen của người giàu, đăng ký miễn phí.", reason: "Quảng cáo hội thảo — xóa." }),
  junk({ from: "Lan · Sales", address: "lan.pham@mayxanh.vn", subject: "[Tự động] Đã đọc: Lịch họp tuần", preview: "Thư của bạn đã được đọc lúc 09:12.", reason: "Xác nhận đã đọc tự động — không cần làm gì, xóa." }),
  junk({ from: "Ứng Dụng Học Tiếng Anh", address: "hello@hoctienganh.app", subject: "Bạn đã bỏ lỡ 3 ngày học!", preview: "Chú cú buồn lắm đấy. Quay lại học 5 phút thôi nào.", reason: "Thông báo ứng dụng — xóa." }),

  // ------------------------------------------------------------ chuyển phòng khác
  forward({ from: "Giấy Việt", address: "ketoan@giayviet.vn", subject: "Hóa đơn VAT tháng 11", preview: "Kính gửi phòng Kế toán: đính kèm hóa đơn VAT cho đơn hàng giấy in tháng 11.", reason: "Hóa đơn là việc của phòng Kế toán — chuyển tiếp!", attachment: "HD_VAT_T11.pdf" }),
  forward({ from: "An · Thực tập", address: "an.tt@mayxanh.vn", subject: "Đơn xin nghỉ phép (gửi nhầm)", preview: "Em gửi nhầm đơn nghỉ phép, nhờ anh/chị chuyển giúp chị Hạnh bên Nhân sự ạ.", reason: "Đơn nghỉ phép thuộc phòng Nhân sự — chuyển tiếp." }),
  forward({ from: "Lễ tân", address: "letan@mayxanh.vn", subject: "Máy in tầng 3 kẹt giấy", preview: "Nhờ chuyển IT giúp: máy in tầng 3 kẹt giấy từ sáng, mọi người không in được.", reason: "Sự cố máy in là việc của IT — chuyển tiếp." }),
  forward({ from: "Ngọc · Ứng viên", address: "ngoc.ungvien@gmail.com", subject: "CV ứng tuyển Kế toán tổng hợp", preview: "Em gửi CV ứng tuyển vị trí Kế toán tổng hợp, mong được phòng Nhân sự xem xét.", reason: "CV ứng viên gửi phòng Nhân sự — chuyển tiếp.", attachment: "CV_Ngoc.pdf" }),
  forward({ from: "Khách hàng Hưng", address: "hung.tran@khachhang.vn", subject: "Khiếu nại giao hàng chậm", preview: "Đơn hàng của tôi trễ 5 ngày, đề nghị bộ phận Chăm sóc khách hàng phản hồi.", reason: "Khiếu nại giao hàng thuộc bộ phận CSKH — chuyển tiếp." }),
  forward({ from: "Cty Hoàng Long", address: "congno@hoanglong.vn", subject: "Đối chiếu công nợ quý 4", preview: "Đề nghị phòng Kế toán Mây Xanh đối chiếu công nợ quý 4 trước ngày 30.", reason: "Công nợ là việc của Kế toán — chuyển tiếp." }),
  forward({ from: "Vy · Sales", address: "vy.le@mayxanh.vn", subject: "Xin cấp lại mật khẩu VPN", preview: "Mình bị khóa VPN, nhờ chuyển giúp bên IT reset mật khẩu với.", reason: "Mật khẩu VPN thuộc IT — chuyển tiếp." }),
  forward({ from: "Luật Minh Tâm", address: "hopdong@luatminhtam.vn", subject: "Phụ lục hợp đồng lao động", preview: "Gửi phòng Nhân sự phụ lục hợp đồng lao động cần ký lại trong tháng này.", reason: "Hợp đồng lao động thuộc Nhân sự — chuyển tiếp." }),
  forward({ from: "Server Pro", address: "sales@serverpro.vn", subject: "Báo giá linh kiện máy chủ", preview: "Theo yêu cầu của phòng IT, bên em gửi báo giá ổ cứng và RAM máy chủ.", reason: "Báo giá máy chủ dành cho IT — chuyển tiếp." }),
  forward({ from: "Phòng khám Đa Khoa", address: "lichkham@dakhoa.vn", subject: "Lịch khám sức khỏe định kỳ", preview: "Gửi phòng Nhân sự lịch khám sức khỏe định kỳ cho nhân viên Mây Xanh.", reason: "Khám sức khỏe do Nhân sự tổ chức — chuyển tiếp." }),
  forward({ from: "Ban Quản Lý Tòa Nhà", address: "bql@toanhasao.vn", subject: "Lịch bảo trì thang máy", preview: "Kính gửi bộ phận Hành chính: thang máy số 2 bảo trì từ 20h thứ Bảy.", reason: "Thông báo tòa nhà gửi phòng Hành chính — chuyển tiếp." }),
  forward({ from: "Khoa · Sales", address: "khoa.dang@mayxanh.vn", subject: "Thanh toán tạm ứng công tác", preview: "Nhờ chuyển kế toán giúp mình hồ sơ tạm ứng công tác phí Đà Nẵng.", reason: "Tạm ứng công tác phí thuộc Kế toán — chuyển tiếp." }),
  forward({ from: "Trường ĐH Kinh Tế", address: "thuctap@dhkinhte.edu.vn", subject: "Giới thiệu sinh viên thực tập kế toán", preview: "Nhà trường gửi phòng Nhân sự danh sách sinh viên ngành Kế toán xin thực tập.", reason: "Tuyển thực tập sinh là việc của Nhân sự — chuyển tiếp." }),
  forward({ from: "Bảo vệ tòa nhà", address: "baove@toanhasao.vn", subject: "Camera tầng hầm mất tín hiệu", preview: "Nhờ chuyển bộ phận IT kiểm tra giúp, camera tầng hầm mất tín hiệu từ tối qua.", reason: "Sự cố camera là việc của IT — chuyển tiếp." }),
  forward({ from: "Điện Lực Quận", address: "hoadon@dienluc.vn", subject: "Hóa đơn tiền điện tháng 11", preview: "Kính gửi phòng Kế toán: hóa đơn tiền điện văn phòng tháng 11 đã phát hành.", reason: "Hóa đơn điện thuộc Kế toán — chuyển tiếp.", attachment: "HD_dien_T11.pdf" }),
  forward({ from: "Bảo hiểm An Tâm", address: "baohiem@antam.vn", subject: "Gia hạn bảo hiểm sức khỏe nhân viên", preview: "Gửi phòng Nhân sự hồ sơ gia hạn gói bảo hiểm sức khỏe năm 2027.", reason: "Bảo hiểm nhân viên thuộc Nhân sự — chuyển tiếp." }),
  forward({ from: "Hà · Thực tập", address: "ha.ng@mayxanh.vn", subject: "Laptop không vào được Wi-Fi", preview: "Laptop công ty của em không bắt được Wi-Fi, nhờ anh/chị chuyển giúp IT ạ.", reason: "Lỗi Wi-Fi là việc của IT — chuyển tiếp." }),
  forward({ from: "Văn Phòng Phẩm Sao Mai", address: "donhang@saomai.vn", subject: "Xác nhận đơn văn phòng phẩm", preview: "Kính gửi bộ phận Hành chính: xác nhận đơn giấy in, bút và kẹp tài liệu tháng 12.", reason: "Văn phòng phẩm do Hành chính lo — chuyển tiếp." }),

  // ------------------------------------------------------------ lừa đảo (xóa!)
  phishing({ from: "Sếp Tuấn", address: "tuan.le@rnayxanh.vn", subject: "GẤP: chuyển 50 triệu cho đối tác", preview: "Anh đang họp không nghe máy được, em chuyển khoản gấp giúp anh, số tài khoản anh gửi sau.", reason: "Lừa đảo! “rnayxanh.vn” (r-n) giả mạo mayxanh.vn." }),
  phishing({ from: "Phòng IT", address: "it-support@mayxanh-vn.com", subject: "Mật khẩu email sắp hết hạn", preview: "Bấm vào đường link trong 24h để giữ nguyên mật khẩu cũ.", reason: "Lừa đảo! “mayxanh-vn.com” không phải tên miền công ty." }),
  phishing({ from: "Chị Hoa · TP Marketing", address: "hoa.tran@mayxahn.vn", subject: "Mua giúp chị 10 thẻ quà tặng", preview: "Em mua giúp chị 10 thẻ quà tặng 500k tặng khách, chụp mã gửi chị nhé.", reason: "Lừa đảo! “mayxahn.vn” bị đảo chữ — giả mạo trưởng phòng." }),
  phishing({ from: "Ngân hàng", address: "canhbao@nganhang-xacminh.top", subject: "Tài khoản của bạn bị khóa tạm thời", preview: "Đăng nhập ngay để xác minh danh tính, nếu không tài khoản sẽ bị khóa vĩnh viễn.", reason: "Lừa đảo! Ngân hàng không bao giờ yêu cầu đăng nhập qua link email." }),
  phishing({ from: "Ban Giám đốc", address: "bgd@mayxanh.vn.bangluong.xyz", subject: "Bảng lương tháng 11 — xem ngay", preview: "Đăng nhập bằng tài khoản công ty để xem chi tiết lương và thưởng.", reason: "Lừa đảo! Tên miền thật là “bangluong.xyz”, không phải mayxanh.vn." }),
  phishing({ from: "Kế toán", address: "ketoan@mayxanh.co", subject: "Cập nhật số tài khoản nhận lương", preview: "Vui lòng điền lại số tài khoản và mã OTP để nhận lương tháng này.", reason: "Lừa đảo! “mayxanh.co” thiếu “.vn” — và không ai được hỏi OTP." }),
  phishing({ from: "Giao Hàng Nhanh", address: "giaohang@ship-nhanh-vn.click", subject: "Bưu kiện bị giữ — đóng phí 15.000đ", preview: "Bưu kiện của bạn đang bị giữ, thanh toán phí để được giao trong hôm nay.", reason: "Lừa đảo phổ biến! Đừng bấm link trả phí lạ." }),
  phishing({ from: "Sếp Tuấn", address: "tuanle.mayxanh@gmail.com", subject: "Gửi anh mã OTP vừa nhận", preview: "Em vừa nhận được mã OTP 6 số, gửi lại cho anh để anh đăng nhập nhé.", reason: "Lừa đảo! Sếp thật dùng @mayxanh.vn — và không bao giờ xin OTP." }),
  phishing({ from: "Phòng Nhân sự", address: "hr@mayxanh.vn-portal.net", subject: "Khảo sát thưởng Tết — đăng nhập để nhận", preview: "Hoàn thành khảo sát và đăng nhập để nhận thưởng Tết sớm.", reason: "Lừa đảo! Tên miền thật là “vn-portal.net”." }),
  phishing({ from: "Thuế điện tử", address: "hoantien@thue-online.site", subject: "Bạn được hoàn thuế 3.200.000đ", preview: "Nhập thông tin thẻ ngân hàng để nhận tiền hoàn thuế trong 24h.", reason: "Lừa đảo! Cơ quan thuế không gửi link đòi thông tin thẻ." }),
  phishing({ from: "Chị Hoa · TP Marketing", address: "hoa.tran@mayxanh-mail.com", subject: "Gửi chị file khách hàng VIP", preview: "Em gửi gấp chị toàn bộ danh sách khách hàng VIP kèm số điện thoại nhé, chị đang ở ngoài.", reason: "Lừa đảo! “mayxanh-mail.com” giả mạo — đừng gửi dữ liệu khách hàng." }),
  phishing({ from: "Phòng IT", address: "admin@mayxanh.vn.secure-login.app", subject: "Phát hiện đăng nhập lạ vào tài khoản", preview: "Xác minh ngay bằng cách nhập tên đăng nhập và mật khẩu tại đường link bên dưới.", reason: "Lừa đảo! Tên miền thật là “secure-login.app”." }),
  phishing({ from: "Sếp Tuấn", address: "tuan.le@mayxanh.vn.co", subject: "Anh nhờ chút việc riêng, đừng nói ai", preview: "Em mua giúp anh 5 thẻ cào 500k, gửi mã qua email này, chiều anh hoàn tiền.", reason: "Lừa đảo! “mayxanh.vn.co” không phải mayxanh.vn — và xin thẻ cào là dấu hiệu kinh điển." }),
  phishing({ from: "Đối tác Sóng Việt", address: "account@songviet-agency.net", subject: "Đổi số tài khoản nhận thanh toán", preview: "Bên mình vừa đổi ngân hàng, từ đợt này vui lòng chuyển khoản sang số tài khoản mới.", reason: "Lừa đảo! Đối tác thật dùng songviet.agency — đổi số tài khoản qua email là chiêu quen thuộc." }),
  phishing({ from: "Hộp thư Mây Xanh", address: "mailbox@rnayxanh.vn", subject: "Hộp thư của bạn đã đầy 99%", preview: "Bấm vào đây và đăng nhập để được nâng cấp dung lượng miễn phí.", reason: "Lừa đảo! “rnayxanh.vn” (r-n) giả mạo mayxanh.vn." }),
  phishing({ from: "Quà Tri Ân", address: "tri-an@mayxanh-quatang.vip", subject: "Nhận quà tri ân cuối năm từ công ty", preview: "Điền họ tên, số CCCD và số tài khoản để nhận phần quà 2 triệu đồng.", reason: "Lừa đảo! Công ty không phát quà qua tên miền lạ và không hỏi CCCD." }),
];

export const POWERUPS = {
  coffee: { title: "Cà phê sữa đá", body: "Tỉnh cả người! +8 giây", emoji: "☕" },
  leave: { title: "Phiếu nghỉ phép", body: "Hồi phục 1 tim", emoji: "🏖️" },
} as const;

export type PowerUp = keyof typeof POWERUPS;
