import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { quizTypes } from "@/lib/quiz-types";
import { parseShare } from "@/lib/share";

/**
 * 1200×630 link preview for a shared result: /og/result?slug=inbox-zero&v=3400
 * Fonts ship in apps/web/assets/fonts (Be Vietnam Pro, OFL) for Vietnamese diacritics.
 */

const W = 1200;
const H = 630;
const root = process.cwd(); // the standalone server chdirs into apps/web

const fonts = Promise.all(
  [
    ["BeVietnamPro-Medium.ttf", 500],
    ["BeVietnamPro-Bold.ttf", 700],
    ["BeVietnamPro-ExtraBold.ttf", 800],
  ].map(async ([file, weight]) => ({
    name: "Be Vietnam Pro",
    data: await readFile(join(root, "assets/fonts", file as string)),
    weight: weight as 500 | 700 | 800,
    style: "normal" as const,
  })),
);

async function thumbnailDataUrl(slug: string) {
  try {
    const buf = await readFile(join(root, "public/thumbnails", `${slug}.jpg`));
    return `data:image/jpeg;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const params = Object.fromEntries(new URL(req.url).searchParams);
  const slug = params.slug ?? "";
  const c = parseShare(slug, params, quizTypes);
  if (!c) return new Response("Not found", { status: 404 });
  const [from, to] = c.game.cover;
  const quiz = c.game.type === "quiz";
  // A quiz screenshot shows some other result, so quiz cards are text only
  const thumb = quiz ? null : await thumbnailDataUrl(slug);

  return new ImageResponse(
    (
      <div style={{ width: W, height: H, display: "flex", fontFamily: "Be Vietnam Pro", color: "white", backgroundImage: `linear-gradient(135deg, ${from}, ${to})`, padding: 64 }}>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: 40 }}>
          <div style={{ display: "flex", alignSelf: "flex-start", fontSize: 26, fontWeight: 700, background: "rgba(0,0,0,0.22)", padding: "10px 22px", borderRadius: 999 }}>
            {c.daily ? `Thử thách ngày ${c.daily.slice(8, 10)}/${c.daily.slice(5, 7)} · ${c.game.title}` : c.game.title}
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", marginBottom: "auto" }}>
            <div style={{ fontSize: 34, fontWeight: 500, opacity: 0.9 }}>{quiz ? c.unit : "Mình đạt"}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
              <div style={{ fontSize: quiz ? (c.headline.length > 16 ? 76 : 96) : 150, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>{c.headline}</div>
              {!quiz && <div style={{ fontSize: 44, fontWeight: 700, opacity: 0.9 }}>{c.unit}</div>}
            </div>
            <div style={{ fontSize: 30, fontWeight: 500, opacity: 0.92, marginTop: 14, maxWidth: thumb ? 620 : 980 }}>{c.subtitle}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 30, fontWeight: 800 }}>
            {/* Logo mark as SVG (the ▶ glyph is not in the font) */}
            <div style={{ display: "flex", width: 46, height: 46, borderRadius: 12, background: "white", alignItems: "center", justifyContent: "center" }}>
              <svg width="26" height="26" viewBox="0 0 24 24">
                <path d="M8 5.5v13l10.5-6.5z" fill="#6b3cf5" />
              </svg>
            </div>
            play4fun.io.vn
          </div>
        </div>
        {thumb && (
          <div style={{ display: "flex", alignSelf: "center", width: 430, height: 269, borderRadius: 28, overflow: "hidden", border: "6px solid rgba(255,255,255,0.85)", boxShadow: "0 30px 60px rgba(0,0,0,0.35)", transform: "rotate(3deg)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- satori renders plain <img> */}
            <img src={thumb} width={430} height={269} style={{ objectFit: "cover" }} alt="" />
          </div>
        )}
      </div>
    ),
    {
      width: W,
      height: H,
      fonts: await fonts,
      headers: { "cache-control": "public, max-age=86400, immutable" },
    },
  );
}
