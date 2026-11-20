/**
 * Word pairs for "Ai là gián điệp?". The two words must be close enough that describing one
 * could fit the other (that is the fun), but clearly different things.
 * Each game randomly decides which side the civilians get.
 * `id` must stay unique (used to avoid repeating a pair in the same room).
 */
export type SpyPair = { id: string; a: string; b: string };

export const SPY_PAIRS: SpyPair[] = [
  // Đồ ăn, thức uống
  { id: "pho-bun-bo", a: "Phở", b: "Bún bò" },
  { id: "tra-sua-ca-phe", a: "Trà sữa", b: "Cà phê sữa đá" },
  { id: "banh-mi-xoi", a: "Bánh mì", b: "Xôi" },
  { id: "banh-chung-banh-tet", a: "Bánh chưng", b: "Bánh tét" },
  { id: "lau-nuong", a: "Lẩu", b: "Đồ nướng" },
  { id: "nem-ran-cha-gio", a: "Nem rán", b: "Gỏi cuốn" },
  { id: "kem-che", a: "Kem", b: "Chè" },
  { id: "mi-tom-chao", a: "Mì tôm", b: "Cháo" },
  { id: "pizza-hamburger", a: "Pizza", b: "Hamburger" },
  { id: "sau-rieng-mit", a: "Sầu riêng", b: "Mít" },
  { id: "dua-hau-dua", a: "Dưa hấu", b: "Dừa" },
  { id: "nuoc-mam-xi-dau", a: "Nước mắm", b: "Xì dầu" },
  { id: "bia-ruou", a: "Bia", b: "Rượu vang" },
  { id: "banh-trang-tron-bot-chien", a: "Bánh tráng trộn", b: "Bột chiên" },
  // Địa điểm
  { id: "bien-ho-boi", a: "Bãi biển", b: "Hồ bơi" },
  { id: "thu-vien-hieu-sach", a: "Thư viện", b: "Hiệu sách" },
  { id: "rap-phim-karaoke", a: "Rạp chiếu phim", b: "Quán karaoke" },
  { id: "benh-vien-hieu-thuoc", a: "Bệnh viện", b: "Hiệu thuốc" },
  { id: "san-bay-ga-tau", a: "Sân bay", b: "Ga tàu" },
  { id: "cho-sieu-thi", a: "Chợ", b: "Siêu thị" },
  { id: "da-lat-sa-pa", a: "Đà Lạt", b: "Sa Pa" },
  { id: "ha-long-phu-quoc", a: "Hạ Long", b: "Phú Quốc" },
  { id: "phong-gym-san-bong", a: "Phòng gym", b: "Sân bóng" },
  { id: "khach-san-homestay", a: "Khách sạn", b: "Homestay" },
  // Đồ vật
  { id: "dien-thoai-may-tinh-bang", a: "Điện thoại", b: "Máy tính bảng" },
  { id: "o-ao-mua", a: "Ô (dù)", b: "Áo mưa" },
  { id: "xe-may-xe-dap", a: "Xe máy", b: "Xe đạp" },
  { id: "dong-ho-vong-tay", a: "Đồng hồ đeo tay", b: "Vòng tay" },
  { id: "tai-nghe-loa", a: "Tai nghe", b: "Loa" },
  { id: "kinh-ram-kinh-can", a: "Kính râm", b: "Kính cận" },
  { id: "dieu-hoa-quat", a: "Điều hòa", b: "Quạt" },
  { id: "goi-chan", a: "Gối", b: "Chăn" },
  { id: "ban-chai-luoc", a: "Bàn chải đánh răng", b: "Lược" },
  { id: "nen-den-pin", a: "Nến", b: "Đèn pin" },
  // Công sở, trường học
  { id: "sep-truong-phong", a: "Sếp", b: "Trưởng phòng" },
  { id: "hop-online-hop-truc-tiep", a: "Họp online", b: "Họp trực tiếp" },
  { id: "luong-thuong", a: "Lương", b: "Thưởng Tết" },
  { id: "email-tin-nhan", a: "Email", b: "Tin nhắn Zalo" },
  { id: "may-in-may-photo", a: "Máy in", b: "Máy photo" },
  { id: "nghi-phep-nghi-le", a: "Nghỉ phép", b: "Nghỉ lễ" },
  { id: "thi-hoc-ky-kiem-tra", a: "Thi học kỳ", b: "Kiểm tra 15 phút" },
  { id: "giao-vien-gia-su", a: "Giáo viên", b: "Gia sư" },
  { id: "but-bi-but-chi", a: "Bút bi", b: "Bút chì" },
  { id: "balo-tui-xach", a: "Ba lô", b: "Túi xách" },
  // Nghề nghiệp, con người
  { id: "bac-si-y-ta", a: "Bác sĩ", b: "Y tá" },
  { id: "ca-si-dien-vien", a: "Ca sĩ", b: "Diễn viên" },
  { id: "dau-bep-phuc-vu", a: "Đầu bếp", b: "Bồi bàn" },
  { id: "shipper-tai-xe", a: "Shipper", b: "Tài xế công nghệ" },
  { id: "cong-an-bao-ve", a: "Công an", b: "Bảo vệ" },
  { id: "youtuber-streamer", a: "YouTuber", b: "Streamer" },
  // Động vật
  { id: "cho-meo", a: "Chó", b: "Mèo" },
  { id: "ho-su-tu", a: "Hổ", b: "Sư tử" },
  { id: "ga-vit", a: "Gà", b: "Vịt" },
  { id: "ca-heo-ca-map", a: "Cá heo", b: "Cá mập" },
  { id: "buom-ong", a: "Bướm", b: "Ong" },
  // Giải trí, hoạt động
  { id: "bong-da-bong-ro", a: "Bóng đá", b: "Bóng rổ" },
  { id: "tiktok-facebook", a: "TikTok", b: "Facebook" },
  { id: "cam-trai-du-lich-bui", a: "Cắm trại", b: "Du lịch bụi" },
  { id: "tet-trung-thu", a: "Tết Nguyên Đán", b: "Tết Trung Thu" },
  { id: "dam-cuoi-sinh-nhat", a: "Đám cưới", b: "Tiệc sinh nhật" },
  { id: "ngu-trua-ngu-nuong", a: "Ngủ trưa", b: "Ngủ nướng" },
];
