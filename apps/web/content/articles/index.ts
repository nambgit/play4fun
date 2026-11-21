import type { ComponentType } from "react";
import CauHoiDoVui from "./cau-hoi-do-vui-team-building";
import GiaiLao from "./giai-lao-van-phong";
import AiLaGianDiep from "./luat-choi-ai-la-gian-diep";
import LuyenGoPhim from "./luyen-go-phim-10-ngon";
import TinhNham from "./meo-tinh-nham-nhanh";
import TocDoGoPhim from "./toc-do-go-phim";
import TeamBuilding from "./tro-choi-team-building-trong-phong-hop";
import VeDoanChu from "./tu-khoa-ve-doan-chu";

/** Article bodies by slug (metadata is in lib/articles.ts) */
export const ARTICLE_BODY: Record<string, ComponentType> = {
  "luyen-go-phim-10-ngon": LuyenGoPhim,
  "toc-do-go-phim": TocDoGoPhim,
  "tro-choi-team-building-trong-phong-hop": TeamBuilding,
  "cau-hoi-do-vui-team-building": CauHoiDoVui,
  "luat-choi-ai-la-gian-diep": AiLaGianDiep,
  "tu-khoa-ve-doan-chu": VeDoanChu,
  "meo-tinh-nham-nhanh": TinhNham,
  "giai-lao-van-phong": GiaiLao,
};
