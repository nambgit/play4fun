/**
 * Words for "Vẽ & đoán". Concrete things that can be drawn in ~1 minute.
 * The drawer picks one of three: one easy, one medium, one hard.
 * Guesses are compared without accents/spaces, so "ca phe" matches "Cà phê".
 */
export const DRAW_WORDS: Record<"easy" | "medium" | "hard", string[]> = {
  easy: [
    "Mặt trời", "Mặt trăng", "Ngôi sao", "Cái cây", "Bông hoa", "Ngôi nhà", "Con cá", "Con mèo", "Con chó", "Con gà",
    "Quả táo", "Quả chuối", "Quả dưa hấu", "Cái ô", "Cái ghế", "Cái bàn", "Cái cốc", "Cái kính", "Đôi giày", "Cái mũ",
    "Xe đạp", "Ô tô", "Máy bay", "Con thuyền", "Trái tim", "Đám mây", "Cầu vồng", "Quả bóng", "Cái bánh", "Cây nến",
    "Chìa khóa", "Cái kéo", "Bút chì", "Quyển sách", "Điện thoại", "Đồng hồ", "Cái đèn", "Con rắn", "Con bướm", "Con rùa",
    "Quả trứng", "Cái lá", "Ngọn núi", "Con ốc sên", "Cây kem", "Cái chén", "Bàn tay", "Con mắt", "Cái tai", "Người tuyết",
    "Quả dứa", "Củ cà rốt", "Con vịt", "Con cua", "Cái nồi",
  ],
  medium: [
    "Bánh mì", "Tô phở", "Trà sữa", "Bánh chưng", "Áo dài", "Nón lá", "Xe máy", "Đèn lồng", "Cái quạt", "Tivi",
    "Máy tính", "Bàn phím", "Con chuột máy tính", "Tai nghe", "Ba lô", "Cái thang", "Cây đàn ghi ta", "Cái trống", "Con diều", "Bể bơi",
    "Lâu đài", "Cái cầu", "Hải đăng", "Tàu hỏa", "Xe buýt", "Trực thăng", "Tên lửa", "Người ngoài hành tinh", "Ma cà rồng", "Bộ xương",
    "Con voi", "Con hươu cao cổ", "Con khỉ", "Con thỏ", "Con heo", "Con bò", "Con ngựa", "Cá mập", "Bạch tuộc", "Con cánh cụt",
    "Bàn chải đánh răng", "Cái chổi", "Máy giặt", "Tủ lạnh", "Cái gương", "Bồn tắm", "Cây thông Noel", "Bánh sinh nhật", "Quà tặng", "Pháo hoa",
    "Cái lều", "Lửa trại", "Cái võng", "Xích đu", "Cầu trượt", "Bóng đèn", "Nam châm", "Kính lúp", "Con robot", "Vương miện",
  ],
  hard: [
    "Họp online", "Deadline", "Kẹt xe", "Mất điện", "Wifi", "Sạc pin", "Chụp ảnh tự sướng", "Livestream", "Ngủ gật", "Tăng ca",
    "Ăn lẩu", "Uống cà phê", "Chơi game", "Đi chợ", "Câu cá", "Leo núi", "Lặn biển", "Trượt tuyết", "Nhảy dù", "Đá bóng",
    "Kim tự tháp", "Tháp Eiffel", "Vạn Lý Trường Thành", "Chùa Một Cột", "Vịnh Hạ Long", "Ruộng bậc thang", "Núi lửa", "Sa mạc", "Thác nước", "Hòn đảo",
    "Siêu nhân", "Nàng tiên cá", "Phù thủy", "Cướp biển", "Ninja", "Ông già Noel", "Thần đèn", "Rồng", "Kỳ lân", "Khủng long",
    "Nhà khoa học", "Bác sĩ", "Đầu bếp", "Lính cứu hỏa", "Phi hành gia", "Ảo thuật gia", "Ca sĩ", "Thợ cắt tóc", "Cảnh sát giao thông", "Shipper",
    "Mưa đá", "Sấm sét", "Lốc xoáy", "Nhật thực", "Bão tuyết",
  ],
};
