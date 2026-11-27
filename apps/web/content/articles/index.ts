import type { ComponentType } from "react";
import KieuDongNghiep from "./cac-kieu-dong-nghiep";
import NeDan from "./game-ne-dan";
import ThangMay from "./van-hoa-di-thang-may";
import KieuGameThu from "./cac-kieu-game-thu";
import CoCaro from "./cach-choi-co-caro";
import Deadline from "./cach-quan-ly-deadline";
import AiDeNhat from "./cau-hoi-ai-de-nhat";
import TruaAnGi from "./trua-nay-an-gi";
import DoanChu from "./cach-choi-doan-chu";
import EmailLuaDao from "./cach-nhan-biet-email-lua-dao";
import OnThi from "./cach-on-thi-hieu-qua";
import TriNho from "./cach-ren-luyen-tri-nho";
import ChonNganh from "./chon-nganh-nghe-phu-hop";
import HieuNhau from "./cau-hoi-de-hieu-nhau";
import CauHoiDoVui from "./cau-hoi-do-vui-team-building";
import KienThucVN from "./cau-hoi-kien-thuc-viet-nam";
import GiaiLao from "./giai-lao-van-phong";
import AiLaGianDiep from "./luat-choi-ai-la-gian-diep";
import LuyenGoPhim from "./luyen-go-phim-10-ngon";
import MaSoi from "./luat-choi-ma-soi";
import NoiTu from "./luat-choi-noi-tu";
import TinhNham from "./meo-tinh-nham-nhanh";
import TocDoGoPhim from "./toc-do-go-phim";
import PhanXa from "./thoi-gian-phan-xa";
import ChoiOnline from "./tro-choi-online-qua-zoom";
import TatNien from "./tro-choi-tat-nien-cong-ty";
import TeamBuilding from "./tro-choi-team-building-trong-phong-hop";
import VeDoanChu from "./tu-khoa-ve-doan-chu";

/** Article bodies by slug (metadata is in lib/articles.ts) */
export const ARTICLE_BODY: Record<string, ComponentType> = {
  "cac-kieu-dong-nghiep": KieuDongNghiep,
  "game-ne-dan": NeDan,
  "van-hoa-di-thang-may": ThangMay,
  "cach-choi-co-caro": CoCaro,
  "cau-hoi-ai-de-nhat": AiDeNhat,
  "cac-kieu-game-thu": KieuGameThu,
  "trua-nay-an-gi": TruaAnGi,
  "cach-quan-ly-deadline": Deadline,
  "cach-choi-doan-chu": DoanChu,
  "chon-nganh-nghe-phu-hop": ChonNganh,
  "cach-ren-luyen-tri-nho": TriNho,
  "luyen-go-phim-10-ngon": LuyenGoPhim,
  "toc-do-go-phim": TocDoGoPhim,
  "tro-choi-team-building-trong-phong-hop": TeamBuilding,
  "cau-hoi-do-vui-team-building": CauHoiDoVui,
  "luat-choi-ai-la-gian-diep": AiLaGianDiep,
  "luat-choi-ma-soi": MaSoi,
  "tu-khoa-ve-doan-chu": VeDoanChu,
  "meo-tinh-nham-nhanh": TinhNham,
  "giai-lao-van-phong": GiaiLao,
  "tro-choi-tat-nien-cong-ty": TatNien,
  "tro-choi-online-qua-zoom": ChoiOnline,
  "cach-nhan-biet-email-lua-dao": EmailLuaDao,
  "cau-hoi-de-hieu-nhau": HieuNhau,
  "luat-choi-noi-tu": NoiTu,
  "cau-hoi-kien-thuc-viet-nam": KienThucVN,
  "thoi-gian-phan-xa": PhanXa,
  "cach-on-thi-hieu-qua": OnThi,
};
