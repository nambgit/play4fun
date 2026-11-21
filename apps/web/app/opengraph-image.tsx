import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { GAMES, GAME_TYPES, TYPE_META } from "@/lib/games";

/**
 * Default link preview (1200×630) for every page without its own image: home, categories,
 * Cẩm nang index, leaderboard… Rendered once at build time (no request data).
 * Game pages and shared results keep their own screenshots.
 */

export const alt = "Play4Fun – Game online miễn phí: giải lao, trắc nghiệm, chơi nhóm";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const font = (file: string, weight: 500 | 700 | 800) =>
  readFile(join(process.cwd(), "assets/fonts", file)).then((data) => ({ name: "Be Vietnam Pro", data, weight, style: "normal" as const }));

const thumb = (slug: string) =>
  readFile(join(process.cwd(), "public/thumbnails", `${slug}.jpg`))
    .then((b) => `data:image/jpeg;base64,${b.toString("base64")}`)
    .catch(() => null);

export default async function Image() {
  const fonts = await Promise.all([font("BeVietnamPro-Medium.ttf", 500), font("BeVietnamPro-Bold.ttf", 700), font("BeVietnamPro-ExtraBold.ttf", 800)]);
  const shots = (await Promise.all(["go-phim-nhanh", "ma-soi", "doan-chu"].map(thumb))).filter((x): x is string => !!x);
  const live = GAMES.filter((g) => g.status === "live");

  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, display: "flex", fontFamily: "Be Vietnam Pro", color: "white", backgroundImage: "linear-gradient(135deg, #6b3cf5, #c04cf0 55%, #ff6a3d)", padding: 64 }}>
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 40, fontWeight: 800 }}>
            <div style={{ display: "flex", width: 64, height: 64, borderRadius: 16, background: "white", alignItems: "center", justifyContent: "center" }}>
              <svg width="36" height="36" viewBox="0 0 24 24">
                <path d="M8 5.5v13l10.5-6.5z" fill="#6b3cf5" />
              </svg>
            </div>
            Play4Fun
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", marginBottom: "auto" }}>
            <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>Chơi 5 phút,</div>
            <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>xả stress cả ngày.</div>
            <div style={{ fontSize: 30, fontWeight: 500, opacity: 0.92, marginTop: 20, maxWidth: 560 }}>{`${live.length} game online miễn phí, không cần cài đặt, chơi ngay trên điện thoại.`}</div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {GAME_TYPES.map((t) => (
              <div key={t} style={{ display: "flex", fontSize: 24, fontWeight: 700, background: "rgba(0,0,0,0.2)", padding: "8px 20px", borderRadius: 999 }}>
                {TYPE_META[t].label}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 18, width: 400 }}>
          {shots.map((src, i) => (
            <div
              key={src.slice(-20)}
              style={{
                display: "flex",
                width: 360,
                height: 165,
                borderRadius: 20,
                overflow: "hidden",
                border: "5px solid rgba(255,255,255,0.85)",
                boxShadow: "0 24px 48px rgba(0,0,0,0.3)",
                transform: `rotate(${i === 1 ? -3 : 3}deg)`,
                marginLeft: i === 1 ? 0 : 40,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- satori renders plain <img> */}
              <img src={src} width={360} height={225} style={{ objectFit: "cover" }} alt="" />
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
