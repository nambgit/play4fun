import type { ComponentType } from "react";
import EmailLuaDao from "./cach-nhan-biet-email-lua-dao";
import HieuNhau from "./cau-hoi-de-hieu-nhau";
import CauHoiDoVui from "./cau-hoi-do-vui-team-building";
import GiaiLao from "./giai-lao-van-phong";
import AiLaGianDiep from "./luat-choi-ai-la-gian-diep";
import LuyenGoPhim from "./luyen-go-phim-10-ngon";
import MaSoi from "./luat-choi-ma-soi";
import NoiTu from "./luat-choi-noi-tu";
import TinhNham from "./meo-tinh-nham-nhanh";
import TocDoGoPhim from "./toc-do-go-phim";
import ChoiOnline from "./tro-choi-online-qua-zoom";
import TatNien from "./tro-choi-tat-nien-cong-ty";
import TeamBuilding from "./tro-choi-team-building-trong-phong-hop";
import VeDoanChu from "./tu-khoa-ve-doan-chu";

/** Article bodies by slug (metadata is in lib/articles.ts) */
export const ARTICLE_BODY: Record<string, ComponentType> = {
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
};
