# Play4Fun — play4fun.io.vn

Cổng game trên trình duyệt: **mini-game giải lao**, **test vui / quiz** và **party game chơi nhóm realtime**,
dành cho dân văn phòng, học sinh, gamer.

## Danh sách game

| Mục | Game | Slug | Code |
|---|---|---|---|
| Giải lao | Inbox Zero | `inbox-zero` | `apps/web/games/inbox-zero/` |
| Giải lao | Deadline Dash | `deadline-dash` | `apps/web/games/deadline-dash/` |
| Giải lao | Kiểm tra 15 phút | `bai-kiem-tra-15-phut` | `apps/web/games/kiem-tra-15-phut/` |
| Giải lao | Pixel Dodge | `pixel-dodge` | `apps/web/games/pixel-dodge/` |
| Giải lao | Gõ phím thần tốc (Việt + Anh) | `go-phim-nhanh` | `apps/web/games/go-phim-nhanh/` |
| Test vui | Bạn là kiểu đồng nghiệp nào? | `ban-la-kieu-dong-nghiep-nao` | `apps/web/games/quiz/content/dong-nghiep.ts` |
| Test vui | Bạn học kiểu gì? | `ban-hoc-kieu-gi` | `apps/web/games/quiz/content/hoc-kieu-gi.ts` |
| Test vui | Bạn là gamer hệ nào? | `gamer-he-nao` | `apps/web/games/quiz/content/gamer.ts` |
| Chơi nhóm | Ai là gián điệp? (3–12 người) | `ai-la-gian-diep` | server `apps/realtime/src/games/spy.ts`, giao diện `apps/web/games/party/spy.tsx` |
| Chơi nhóm | Vẽ & đoán (2–12 người) | `ve-doan-chu` | server `.../games/draw.ts`, giao diện `.../party/draw.tsx` |
| Chơi nhóm | Đố vui team building (tối đa 50 người) | `do-vui-team-building` | server `.../games/trivia.ts`, giao diện `.../party/trivia.tsx` |

Nguyên tắc chung: mỗi lần chơi là nội dung ngẫu nhiên và hạn chế lặp lại. Game một người nhớ nội dung vừa gặp trong `localStorage`; party game nhớ nội dung đã dùng trong từng phòng.

## Stack

| Lớp | Công nghệ | Vai trò |
|---|---|---|
| Web | Next.js 16 (App Router) + React 19 + Tailwind 4 | Trang chủ, trang game (SSR/SSG cho SEO), API routes |
| Game client | Canvas 2D + React (không dùng game engine ngoài) | Code game chạy trong trình duyệt, nhẹ, mượt trên điện thoại |
| Realtime | Node.js + Socket.IO 4 | Phòng chơi nhóm (mã phòng, QR), logic party game chạy trên server |
| Database | PostgreSQL 17 + Drizzle ORM | Người chơi, điểm, thử thách hằng ngày, kết quả ván party |
| Cache | Valkey 8 (tương thích Redis) | Bảng xếp hạng (sorted set), rate limit, sau này scale realtime |
| Auth (giai đoạn 2) | Better Auth: khách + Google/Facebook | Chơi ngay không cần đăng nhập, login để lưu điểm |
| Hạ tầng | Docker Compose + nginx native + Let's Encrypt | |

## Cấu trúc

```
play4fun/
├── apps/
│   ├── web/            # Next.js
│   │   ├── app/                 # route: trang chủ, /games/[slug], /api/health
│   │   ├── lib/games.ts         # danh mục game: tiêu đề, mô tả, cách chơi, thumbnail, trạng thái live/soon
│   │   ├── components/          # card, cover, game-stage.tsx (đăng ký game chơi được), party/ (khung phòng chơi)
│   │   ├── games/               # code từng game; quiz/ = engine quiz dùng chung; party/ = giao diện party game
│   │   ├── lib/party-client.ts  # kết nối Socket.IO, tự vào lại phòng khi rớt mạng
│   │   ├── scripts/capture-thumbnails.mjs
│   │   └── public/thumbnails/   # ảnh card + og:image
│   └── realtime/       # Socket.IO server: phòng chơi + logic party game (src/games/, nội dung trong src/games/content/)
├── packages/
│   ├── db/             # Drizzle schema, migrations (drizzle/), migrate runner
│   └── party/          # Protocol dùng chung realtime ↔ web cho party game
├── deploy/
│   ├── nginx/play4fun.io.vn.conf
│   └── deploy.sh
├── Dockerfile          # 3 target: web | realtime | migrate
├── docker-compose.yml
└── .env.example
```

## Kiến trúc khi chạy

```
Internet ──443──▶ nginx (native trên host, SSL)
                    ├── /socket.io/*  ──▶ 127.0.0.1:3001  realtime container
                    └── /*            ──▶ 127.0.0.1:3000  web container
                                              │
                         ┌────────────────────┴───────────┐
                         ▼                                ▼
                 postgres:17 (volume pgdata)      valkey:8 (volume valkeydata)
```

- Mọi container chỉ bind vào `127.0.0.1`, không mở ra internet; chỉ nginx nhận traffic ngoài.
- Container `migrate` tự chạy migration mỗi lần `docker compose up`; `web` chỉ khởi động khi migrate thành công.

## Phát triển local

Yêu cầu: Node 22+ và Docker.

```bash
npm install
cp .env.example .env                       # sửa mật khẩu
docker compose up -d postgres valkey       # chỉ chạy DB + cache

# apps/web/.env.local:
#   DATABASE_URL=postgres://play4fun:<mật khẩu>@localhost:5432/play4fun
DATABASE_URL=postgres://play4fun:<mật khẩu>@localhost:5432/play4fun npm run db:migrate

npm run dev:web          # http://localhost:3000
npm run dev:realtime     # http://localhost:3001/health
```

Party game cần chạy **cả hai** lệnh trên. Ở local, web (cổng 3000) tự kết nối realtime ở cổng 3001; trên production thì dùng chung domain qua nginx (`/socket.io/`). Muốn trỏ sang chỗ khác thì đặt `NEXT_PUBLIC_REALTIME_URL`. Thử nhiều người chơi trên một máy: mở thêm cửa sổ ẩn danh hoặc trình duyệt khác (mỗi người cần `localStorage` riêng).

Kiểm tra trước khi commit:

```bash
npm run typecheck        # web + realtime + packages
npm run build            # build production tất cả workspace
```

Đổi schema: sửa `packages/db/src/schema.ts` → `npm run db:generate` → commit file SQL mới trong `packages/db/drizzle/`.

### Thêm game mới

1. Khai báo game trong `apps/web/lib/games.ts` (để `status: "soon"` cho tới khi chơi được).
2. Viết code:
   - **Giải lao**: thư mục mới trong `apps/web/games/<tên>/`, tách `engine.ts` (logic thuần) và component React (vẽ bằng canvas hoặc DOM). Làm theo mẫu `inbox-zero` hoặc `kiem-tra-15-phut`.
   - **Test vui**: chỉ cần thêm một file nội dung trong `apps/web/games/quiz/content/` (kiểu dữ liệu `Quiz`) và một file bọc ngắn như `games/quiz/gamer.tsx`. Kho câu hỏi nên lớn hơn số câu hỏi mỗi lượt.
   - **Chơi nhóm**: thêm slug và giới hạn người chơi vào `packages/party/src/index.ts`, viết module server trong `apps/realtime/src/games/` (đăng ký ở `MODULES` trong `src/index.ts`), rồi viết giao diện dùng `PartyRoom` trong `apps/web/games/party/`. Thông tin bí mật chỉ để trên server và chỉ đưa vào `view()` của người được phép thấy.
3. Đăng ký component trong `PLAYABLE` ở `apps/web/components/game-stage.tsx`, đổi `status` sang `"live"`, thêm `howTo`.
4. Chụp thumbnail (mục dưới).

### Thumbnail game

Card trên trang chủ và ảnh preview khi chia sẻ link (`og:image`) dùng ảnh chụp thật từ game. Script mở game bằng Edge có sẵn trên máy, tự chơi vài giây rồi chụp giữa ván:

```bash
npm run dev:web                                        # terminal 1
npm run dev:realtime                                   # terminal 1b: chỉ cần cho party game
npm run thumbnails -w @play4fun/web                    # terminal 2: chụp lại mọi game
npm run thumbnails -w @play4fun/web -- deadline-dash   # hoặc chỉ 1 game
```

Ảnh ra `apps/web/public/thumbnails/<slug>.webp` (hiển thị trên card) và `.jpg` (dùng cho Facebook/Zalo). Ảnh chụp ngẫu nhiên nên chưa ưng thì chạy lại. Khi thêm game mới:

1. Thêm cấu hình chụp (cách chơi, thời điểm chụp, cách cắt) vào `SHOTS` trong [`apps/web/scripts/capture-thumbnails.mjs`](apps/web/scripts/capture-thumbnails.mjs).
2. Chạy lệnh trên cho slug đó.
3. Khai báo `thumbnail: "/thumbnails/<slug>.webp"` cho game trong `apps/web/lib/games.ts`. Game chưa có thumbnail vẫn dùng ảnh gradient như cũ.

## Deploy lên server

### 1. Lần đầu

```bash
# Trên server (đã cài Docker + nginx)
git clone <repo> /opt/play4fun && cd /opt/play4fun
cp .env.example .env && nano .env          # đặt POSTGRES_PASSWORD dài, ngẫu nhiên
docker compose up -d --build
docker compose ps                          # web/realtime phải "healthy"
curl -s 127.0.0.1:3000/api/health          # {"status":"ok","db":"ok"}
```

### 2. Nginx + SSL

```bash
sudo mkdir -p /var/www/certbot
# Lấy chứng chỉ lần đầu (tạm dừng nginx để certbot dùng cổng 80)
sudo systemctl stop nginx
sudo certbot certonly --standalone -d play4fun.io.vn -d www.play4fun.io.vn
sudo systemctl start nginx

# Tắt site mặc định của Ubuntu: config của ta đã có block default_server riêng,
# để cả hai sẽ lỗi "duplicate default server". Lệnh này chỉ xoá symlink,
# file gốc vẫn còn trong sites-available.
sudo rm -f /etc/nginx/sites-enabled/default

sudo cp deploy/nginx/play4fun.io.vn.conf /etc/nginx/conf.d/
sudo nginx -t && sudo systemctl reload nginx

# Chuyển sang xác thực webroot để certbot tự gia hạn mà không cần dừng nginx
sudo certbot certonly --webroot -w /var/www/certbot -d play4fun.io.vn -d www.play4fun.io.vn --force-renewal
```

DNS: trỏ bản ghi `A` của `play4fun.io.vn` và `www` về IP server.

Config nginx có sẵn các lớp chặn bot quét lỗ hổng:

- **Block `default_server`**: request nào không gọi đúng domain (truy cập thẳng bằng IP, `Host` lạ) đều bị đóng kết nối (`444`) và bị từ chối TLS, không ghi log. Bot quét theo dải IP sẽ không được redirect sang domain thật.
- **Chặn dotfile**: `/.env`, `/.git/...` trả `404`, trừ `/.well-known/` (certbot cần).

Kiểm tra sau khi cài:

```bash
curl -sI https://play4fun.io.vn | head -1                              # HTTP/2 200
curl -sI http://<IP server>/env                                        # Empty reply from server
curl -so /dev/null -w '%{http_code}\n' https://play4fun.io.vn/.env     # 404
```

### 3. Các lần cập nhật sau

```bash
./deploy/deploy.sh      # git pull → build → up -d → dọn image cũ
```

Lưu ý với party game: phòng chơi nằm trong RAM của container `realtime`, nên mỗi lần deploy thì các phòng đang chơi sẽ mất. Nên deploy lúc ít người chơi. Kiểm tra realtime sau khi deploy:

```bash
curl -s 127.0.0.1:3001/health                                          # {"status":"ok","rooms":0}
curl -s 'https://play4fun.io.vn/socket.io/?EIO=4&transport=polling' | head -c 60   # bắt đầu bằng 0{"sid":...
```

`deploy.sh` không đụng tới nginx. Nếu commit có sửa `deploy/nginx/play4fun.io.vn.conf`, chạy thêm:

```bash
sudo cp deploy/nginx/play4fun.io.vn.conf /etc/nginx/conf.d/
sudo nginx -t && sudo systemctl reload nginx
```

### Xử lý sự cố

- **`nginx -t` báo `duplicate default server`**: site mặc định của Ubuntu vẫn đang bật. Chạy `sudo rm /etc/nginx/sites-enabled/default` rồi chạy lại.
- **Party game báo "Đang kết nối máy chủ…" mãi**: kiểm tra container `realtime` đang chạy (`docker compose ps`), lệnh `curl` kiểm tra `/socket.io/` ở trên, và `CORS_ORIGINS` (lấy từ `PUBLIC_URL` trong `.env`) phải đúng domain đang truy cập.
- **Trình duyệt báo lỗi SSL dù server không đổi gì**: chạy `openssl s_client -connect play4fun.io.vn:443 -servername play4fun.io.vn </dev/null | grep issuer`. Nếu issuer không phải Let's Encrypt (ví dụ Fortinet) thì firewall của mạng đang dùng đang giải mã HTTPS (SSL inspection), server không có lỗi. Thử lại bằng 4G, hoặc nhờ IT thêm domain vào danh sách miễn trừ.

### Sao lưu database

```bash
docker compose exec -T postgres pg_dump -U play4fun -Fc play4fun > backup_$(date +%F).dump
```

Nên đặt cron chạy hằng ngày và copy file backup ra ngoài server.

## Lộ trình

1. ✅ **MVP**: trang chủ, 5 mini-game, 3 quiz, chia sẻ kết quả, thumbnail + `og:image` từ ảnh chụp game (chưa cần đăng nhập)
2. ✅ **Party game**: "Ai là gián điệp?", "Vẽ & đoán", "Đố vui team building" (phòng chơi realtime, mã phòng + QR)
3. **Giai đoạn 2**: thử thách hằng ngày, đăng nhập, bảng xếp hạng online (hiện kỷ lục chỉ lưu trên máy người chơi), ảnh OG riêng cho từng kết quả
4. **Giai đoạn 3**: gói cho công ty (phòng team building có thương hiệu, bộ câu hỏi riêng), quảng cáo; scale realtime nhiều instance (Valkey + socket.io adapter)
