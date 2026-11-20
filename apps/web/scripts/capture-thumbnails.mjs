#!/usr/bin/env node
/**
 * Chụp thumbnail thật cho các game đang chạy: mở game trong trình duyệt,
 * bấm "Chơi", tự chơi vài giây rồi chụp khung game giữa ván.
 *
 *   npm run dev:web                          # terminal 1
 *   npm run thumbnails -w @play4fun/web      # terminal 2 (mọi game có trong SHOTS)
 *   npm run thumbnails -w @play4fun/web -- pixel-dodge   # chỉ 1 game
 *
 * Ảnh ra: public/thumbnails/<slug>.webp (1200×750, 16:10 khớp với card)
 *         + <slug>.jpg cùng nội dung, dùng làm og:image khi chia sẻ.
 * Sau đó khai báo `thumbnail: "/thumbnails/<slug>.webp"` cho game trong lib/games.ts.
 *
 * Dùng Edge/Chrome có sẵn trên máy (playwright-core, không tải trình duyệt).
 * Đổi bằng BROWSER_CHANNEL=chrome; đổi server bằng BASE_URL=http://...
 */
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import sharp from "sharp";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const CHANNEL = process.env.BROWSER_CHANNEL ?? "msedge";
const OUT_DIR = fileURLToPath(new URL("../public/thumbnails/", import.meta.url));
const SIZE = { width: 1200, height: 750 };
const ATTEMPTS = 6;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Mỗi game:
 *  - captureAt: chụp sau bao nhiêu ms kể từ lúc bấm "Chơi"
 *  - play(page, stage, elapsedMs): gọi lặp lại mỗi ~150ms cho tới lúc chụp
 *  - beforeShot(page, stage): tuỳ chọn, tạo khoảnh khắc đẹp ngay trước khi chụp
 *  - minAt: tuỳ chọn, từ mốc này chụp dự phòng; thua sau mốc này vẫn dùng được ảnh
 *  - attempts: số ván thử tối đa (mặc định ATTEMPTS)
 *  - goodMoment(page, stage): tuỳ chọn, chỉ chụp khi trả về true
 *  - fit: "cover" (mặc định, cắt cho đầy 16:10) | "contain" (giữ nguyên khung, thêm nền)
 *  - position: với "cover", phần nào được giữ lại khi cắt (sharp `position`)
 *  - hideHud: tuỳ chọn, selector (trong khung game) của HUD nổi đè lên màn chơi, ẩn khi chụp
 *  - cropBelow: tuỳ chọn, selector của dải HUD phía trên, ảnh bắt đầu ngay dưới nó
 *  - frame: tuỳ chọn, cắt bớt khung theo tỉ lệ {left, top, width, height} trước khi resize
 */
const SHOTS = {
  "pixel-dodge": {
    // Mỗi 10 giây một đợt mới, đạn dày dần: cố trụ sang đợt 2–3 cho ảnh "đã" hơn
    captureAt: 24000,
    minAt: 11000,
    attempts: 12,
    // Khung vuông: đặt giữa nền tối thay vì cắt, để giữ trọn màn chơi
    fit: "contain",
    // HUD (thời gian, đợt, sượt) nằm đè lên góc trên, trùng chỗ badge của card
    hideHud: ":scope > div.top-0",
    async play(page) {
      // Đi ngẫu nhiên kiểu "random walk" bằng phím mũi tên
      const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
      for (const k of keys) await page.keyboard.up(k);
      await page.keyboard.down(pick(keys));
      if (Math.random() < 0.5) await page.keyboard.down(pick(keys));
    },
    async beforeShot(page) {
      for (const k of ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]) await page.keyboard.up(k);
    },
  },

  "deadline-dash": {
    captureAt: 5200,
    position: "left",
    // Dải HUD (mét, thanh "Cách deadline", cà phê) trùng chỗ badge của card
    cropBelow: ":scope > div:first-child",
    async play(page) {
      const r = Math.random();
      if (r < 0.3) await page.keyboard.press("Space");
      else if (r < 0.4) {
        await page.keyboard.down("ArrowDown");
        await sleep(250);
        await page.keyboard.up("ArrowDown");
      }
    },
    // Không chụp lúc banner "Vấp phải…" đang che màn chơi
    goodMoment: (page, stage) =>
      stage.locator('[aria-live="polite"]').evaluate((el) => getComputedStyle(el).opacity === "0"),
  },

  "go-phim-nhanh": {
    captureAt: 6000,
    // Dải HUD (đồng hồ, WPM) trùng chỗ badge của card
    cropBelow: ":scope > div:first-child",
    async play(page, stage) {
      // Gõ đúng từ đang được tô sáng (thỉnh thoảng gõ sai cho giống người thật)
      const word = await stage.locator("[data-current-word]").getAttribute("data-current-word");
      if (!word) return;
      await page.keyboard.type(Math.random() < 0.08 ? `${word.slice(0, -1)}x ` : `${word} `, { delay: 25 });
    },
    async beforeShot(page, stage) {
      // Chụp lúc đang gõ dở một từ: thấy cả con trỏ lẫn chữ đã gõ
      const word = await stage.locator("[data-current-word]").getAttribute("data-current-word");
      if (word && word.length > 2) await page.keyboard.type(word.slice(0, Math.ceil(word.length / 2)), { delay: 25 });
    },
  },

  "inbox-zero": {
    captureAt: 2500,
    fit: "contain",
    // Dải HUD (thời gian, tim, điểm) trùng chỗ badge của card
    cropBelow: ":scope > div:first-child",
    async play() {
      // Không thao tác: chỉ cần email đầu tiên hiện lên
    },
    async beforeShot(page, stage) {
      // Kéo dở thẻ email sang phải (chưa đủ ngưỡng vuốt) để ảnh có chuyển động
      const box = await stage.boundingBox();
      const x = box.x + box.width / 2;
      const y = box.y + box.height * 0.45;
      await page.mouse.move(x, y);
      await page.mouse.down();
      for (let i = 1; i <= 6; i++) await page.mouse.move(x + i * 7, y - i);
      await sleep(250);
    },
    async afterShot(page) {
      await page.mouse.up();
    },
  },
};

async function captureOne(page, slug, cfg) {
  await page.goto(`${BASE_URL}/games/${slug}`, { waitUntil: "networkidle" });
  const stage = page.locator('main div[tabindex="-1"]').first();
  await stage.waitFor({ state: "visible", timeout: 30_000 });
  await stage.scrollIntoViewIfNeeded();
  // Bỏ bo góc/viền để ảnh không lộ nền trang ở 4 góc
  await stage.evaluate((el) => {
    el.style.borderRadius = "0";
    el.style.boxShadow = "none";
  });
  const pause = stage.getByRole("button", { name: "Tạm dừng" });

  // Ẩn nút tạm dừng + HUD nổi trong ảnh (opacity 0 vẫn tính là "visible" nên không ảnh hưởng việc dò trạng thái)
  const hidden = [pause, ...(cfg.hideHud ? [stage.locator(cfg.hideHud)] : [])];
  const setHidden = (on) =>
    Promise.all(
      hidden.map((l) =>
        l.evaluateAll((els, on) => {
          for (const el of els) Object.assign(el.style, on ? { transition: "none", opacity: "0" } : { transition: "", opacity: "" });
        }, on),
      ),
    );
  const shoot = async () => {
    await setHidden(true);
    try {
      const box = await stage.boundingBox();
      let clip = box;
      if (cfg.cropBelow) {
        // Cắt bỏ dải HUD phía trên: ảnh bắt đầu ngay dưới phần tử này
        const hud = await stage.locator(cfg.cropBelow).first().boundingBox();
        const top = hud.y + hud.height;
        clip = { x: box.x, y: top, width: box.width, height: box.y + box.height - top };
      }
      return await page.screenshot({ clip, animations: "allow" });
    } finally {
      await setHidden(false);
    }
  };
  const isGood = async () => !cfg.goodMoment || (await cfg.goodMoment(page, stage));
  const attempts = cfg.attempts ?? ATTEMPTS;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    // "Bắt đầu…" ở màn chờ, hoặc "Chơi lại / Chơi ván mới / Chạy ván mới" sau khi thua
    await stage.getByRole("button", { name: /^(Bắt đầu|Chơi|Chạy ván)/ }).first().click();
    await pause.waitFor({ state: "visible", timeout: 10_000 });

    // Chơi tới captureAt. Sau minAt (nếu có) chụp dự phòng định kỳ: lỡ thua sớm
    // vẫn còn ảnh đẹp gần nhất thay vì phải chơi lại từ đầu.
    const t0 = Date.now();
    let alive = true;
    const backups = []; // { t, png }
    let lastBackupAt = 0;
    let diedAt = Infinity;
    while (Date.now() - t0 < cfg.captureAt) {
      await cfg.play(page, stage, Date.now() - t0);
      await sleep(150);
      if (!(await pause.isVisible())) {
        alive = false;
        diedAt = Date.now() - t0;
        break;
      }
      const t = Date.now() - t0;
      if (cfg.minAt && t >= cfg.minAt && t - lastBackupAt > 700 && (await isGood())) {
        backups.push({ t, png: await shoot() });
        lastBackupAt = t;
      }
    }

    if (alive) {
      await cfg.beforeShot?.(page, stage);
      // Đợi tối đa 4s cho một khung hình "đẹp" (ví dụ không có banner che)
      for (let i = 0; i < 40 && !(await isGood()); i++) {
        await cfg.play(page, stage, Date.now() - t0);
        await sleep(100);
      }
      const png = (await pause.isVisible()) && (await isGood()) ? await shoot() : null;
      await cfg.afterShot?.(page, stage);
      if (png) return png;
    }
    await cfg.afterShot?.(page, stage);
    // Bỏ các ảnh sát lúc thua: game còn diễn hiệu ứng nổ/va chạm trước khi báo "thua"
    const backup = backups.filter((b) => b.t <= diedAt - 1500).at(-1);
    if (backup) return backup.png;
    console.log(`  ${slug}: thua trước lúc chụp, thử lại (${attempt}/${attempts})`);
  }
  throw new Error(`${slug}: không chụp được sau ${attempts} lần`);
}

async function toThumbnail(png, cfg) {
  let img = sharp(png);
  if (cfg.frame) {
    const { width, height } = await img.metadata();
    const f = cfg.frame;
    img = sharp(
      await img
        .extract({
          left: Math.round(width * f.left),
          top: Math.round(height * f.top),
          width: Math.round(width * f.width),
          height: Math.round(height * f.height),
        })
        .toBuffer(),
    );
  }
  if (cfg.fit === "contain") {
    // Nền = màu điểm ảnh ở mép trên khung game, để phần thêm vào liền mạch
    const { data } = await img.clone().extract({ left: 4, top: 4, width: 1, height: 1 }).raw().toBuffer({ resolveWithObject: true });
    const background = { r: data[0], g: data[1], b: data[2], alpha: 1 };
    return img.resize({ ...SIZE, fit: "contain", background }).webp({ quality: 82 }).toBuffer();
  }
  return img.resize({ ...SIZE, fit: "cover", position: cfg.position ?? "centre" }).webp({ quality: 82 }).toBuffer();
}

async function main() {
  const wanted = process.argv.slice(2);
  const slugs = wanted.length ? wanted : Object.keys(SHOTS);
  const unknown = slugs.filter((s) => !SHOTS[s]);
  if (unknown.length) {
    console.error(`Chưa có cấu hình chụp cho: ${unknown.join(", ")}. Thêm vào SHOTS trong ${fileURLToPath(import.meta.url)}`);
    process.exit(1);
  }

  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ channel: CHANNEL });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: "light",
    reducedMotion: "no-preference",
  });

  let failed = 0;
  try {
    for (const slug of slugs) {
      const page = await context.newPage();
      try {
        const png = await captureOne(page, slug, SHOTS[slug]);
        if (process.env.KEEP_RAW) await sharp(png).toFile(`${OUT_DIR}${slug}.raw.png`);
        const webp = await toThumbnail(png, SHOTS[slug]);
        await sharp(webp).toFile(`${OUT_DIR}${slug}.webp`);
        // Bản JPEG cho og:image: Facebook/Zalo không phải lúc nào cũng nhận WebP
        await sharp(webp).jpeg({ quality: 85, mozjpeg: true }).toFile(`${OUT_DIR}${slug}.jpg`);
        console.log(`✓ ${slug} → public/thumbnails/${slug}.webp + .jpg (${Math.round(webp.length / 1024)} KB)`);
      } catch (err) {
        failed++;
        console.error(`✗ ${slug}: ${err.message}`);
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
  process.exit(failed ? 1 : 0);
}

main();
