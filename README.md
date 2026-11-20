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

Ngoài ra:

- **Thử thách hằng ngày** (`/daily`): mỗi ngày một game giải lao, cả nước chơi cùng một đề (cùng seed), chỉ lần chơi đầu được tính, có bảng ngày và chuỗi ngày chơi. Logic trong `apps/web/lib/daily.ts`.
- **Bảng xếp hạng** (`/leaderboard` và thẻ ở trang game): kỷ lục của người đã đăng nhập; người chơi ẩn tên được trong `/accounts`; admin gỡ kỷ lục bất thường trong `/admin`.
- **Chia sẻ kết quả**: nút "Khoe" tạo link `/s/<game>?v=…` có ảnh preview riêng (`/og/result`, font Be Vietnam Pro trong `apps/web/assets/fonts`).
- **Studio câu hỏi** (`/studio`, gói công ty, miễn phí cho tài khoản): tự soạn bộ câu hỏi + tên, màu, logo công ty; dùng trong Đố vui team building.

Nguyên tắc chung: mỗi lần chơi là nội dung ngẫu nhiên và hạn chế lặp lại. Game một người nhớ nội dung vừa gặp trong `localStorage`; party game nhớ nội dung đã dùng trong từng phòng.

## Stack

| Lớp | Công nghệ | Vai trò |
|---|---|---|
| Web | Next.js 16 (App Router) + React 19 + Tailwind 4 | Trang chủ, trang game (SSR/SSG cho SEO), API routes |
| Game client | Canvas 2D + React (không dùng game engine ngoài) | Code game chạy trong trình duyệt, nhẹ, mượt trên điện thoại |
| Realtime | Node.js + Socket.IO 4 | Phòng chơi nhóm (mã phòng, QR), logic party game chạy trên server |
| Database | PostgreSQL 17 + Drizzle ORM | Người chơi, điểm, thử thách hằng ngày, kết quả ván party |
| Cache | Valkey 8 (tương thích Redis) | Bảng xếp hạng (sorted set), rate limit, sau này scale realtime |
| Đăng nhập | Better Auth 1.7 (bảng trong Postgres) + Google/Facebook | Không bắt buộc: khách chơi mọi game; đăng nhập để lưu kỷ lục lên tài khoản |
| Thống kê | Umami 3.4 tự host (không cookie) + trang `/admin` | Lượt truy cập, nguồn Facebook/TikTok, game chơi nhiều, thời gian chơi |
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

### Đăng nhập ở máy local

`apps/web/.env.local` (không commit) cần ít nhất:

```bash
DATABASE_URL=postgres://play4fun:<mật khẩu>@localhost:5432/play4fun
BETTER_AUTH_SECRET=<chuỗi ngẫu nhiên>     # openssl rand -base64 32
BETTER_AUTH_URL=http://localhost:3000
AUTH_DEV_PASSWORD=1                      # nút "đăng nhập thử" bằng email, chỉ chạy khi dev
# Thống kê ở local (tùy chọn): docker compose up -d umami → http://localhost:3002 (admin/umami), tạo website
UMAMI_INTERNAL_URL=http://localhost:3002
UMAMI_WEBSITE_ID=<id website trong Umami local>
UMAMI_DATABASE_URL=postgres://play4fun:<mật khẩu>@localhost:5432/umami
REALTIME_INTERNAL_URL=http://localhost:3001
ADMIN_EMAILS=test@example.com
```

Server realtime đọc `apps/realtime/.env` (không commit) khi chạy `npm run dev:realtime`:

```bash
DATABASE_URL=postgres://play4fun:<mật khẩu>@localhost:5432/play4fun   # bộ câu hỏi Studio
REDIS_URL=redis://localhost:6379                                     # giữ phòng khi khởi động lại (docker compose up -d valkey)
```

`AUTH_DEV_PASSWORD` giúp thử toàn bộ luồng (đồng bộ kỷ lục, trang tài khoản, xóa tài khoản) mà không cần app Google/Facebook. Trên production biến này bị bỏ qua.

### Thêm game mới

1. Khai báo game trong `apps/web/lib/games.ts` (để `status: "soon"` cho tới khi chơi được).
2. Viết code:
   - **Giải lao**: thư mục mới trong `apps/web/games/<tên>/`, tách `engine.ts` (logic thuần) và component React (vẽ bằng canvas hoặc DOM). Làm theo mẫu `inbox-zero` hoặc `kiem-tra-15-phut`.
   - **Test vui**: chỉ cần thêm một file nội dung trong `apps/web/games/quiz/content/` (kiểu dữ liệu `Quiz`) và một file bọc ngắn như `games/quiz/gamer.tsx`. Kho câu hỏi nên lớn hơn số câu hỏi mỗi lượt.
   - **Chơi nhóm**: thêm slug và giới hạn người chơi vào `packages/party/src/index.ts`, viết module server trong `apps/realtime/src/games/` (đăng ký ở `MODULES` trong `src/index.ts`), rồi viết giao diện dùng `PartyRoom` trong `apps/web/games/party/`. Thông tin bí mật chỉ để trên server và chỉ đưa vào `view()` của người được phép thấy.
3. Đăng ký component trong `PLAYABLE` ở `apps/web/components/game-stage.tsx`, đổi `status` sang `"live"`, thêm `howTo`.
4. Nếu game có kỷ lục (bảng xếp hạng): thêm khóa vào `apps/web/lib/record-keys.ts` và một luật kiểm tra trong `apps/web/lib/run-rules.ts`, rồi trong game gọi `startRun()` lúc bắt đầu ván và `run.finish(score, proof)` lúc kết thúc (xem mục *Điểm số được kiểm tra trên server*).
5. Chụp thumbnail (mục dưới).

### Điểm số được kiểm tra trên server

Kỷ lục chỉ lên tài khoản, bảng xếp hạng và thử thách ngày khi server đã kiểm tra ván chơi:

1. Bắt đầu ván, trình duyệt xin một **vé** (`POST /api/runs`): vé ký bằng HMAC, ghi giờ bắt đầu và seed của ván. Game không phải chờ vé.
2. Kết thúc ván, game gửi điểm kèm bằng chứng (`POST /api/runs/finish`). Server so với vé theo luật trong `lib/run-rules.ts`:
   - **Gõ phím thần tốc**: server tự tính lại WPM từ các từ đã gõ. Ván phải kéo dài đủ 60 giây.
   - **Kiểm tra 15 phút**: server chơi lại ván từ seed và danh sách câu trả lời (kèm thời điểm), tự đếm số câu đúng.
   - **Inbox Zero, Deadline Dash, Pixel Dodge**: các chỉ số tạo nên điểm phải khớp với điểm và phải vừa với thời gian thật đã trôi qua.
3. Điểm hợp lệ được lưu ngay nếu đã đăng nhập. Khách nhận một **biên nhận** lưu trên máy, khi đăng nhập thì biên nhận đưa kỷ lục lên tài khoản. Điểm sửa tay trong localStorage (không có biên nhận) sẽ không bao giờ lên server.

Vé và biên nhận được ký bằng `RUN_SECRET`, hoặc `BETTER_AUTH_SECRET` nếu không đặt. Không cần bảng DB nào thêm. Giới hạn còn lại: với 3 game hành động, một bản game bị sửa code vẫn có thể gửi chỉ số "đẹp" trong giới hạn thời gian thật. Muốn chặn triệt để thì cần server chạy lại toàn bộ thao tác của ván.

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

### 3. Đăng nhập Google / Facebook (tùy chọn)

Người chơi không bắt buộc đăng nhập, nên có thể bật sau. Nhà cung cấp nào chưa điền khóa thì nút đó tự ẩn; chưa điền gì thì trang `/login` báo "đang chuẩn bị" và mọi game vẫn chạy bình thường.

1. Trong `.env` trên server, đặt `BETTER_AUTH_SECRET` (chạy `openssl rand -base64 32`). **Không đổi chuỗi này sau khi đã chạy**, đổi là mọi người bị đăng xuất và biên nhận kỷ lục của khách trên các máy hết hiệu lực. Chuỗi này cũng dùng để ký vé ván chơi; thiếu nó thì kỷ lục không được lưu lên server.
2. **Google**: [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → *Create credentials* → *OAuth client ID* → loại *Web application*.
   - Authorized JavaScript origins: `https://play4fun.io.vn`
   - Authorized redirect URIs: `https://play4fun.io.vn/api/auth/callback/google`
   - Màn hình *OAuth consent screen*: tên app Play4Fun, link chính sách `https://play4fun.io.vn/privacy`, rồi *Publish app* (để ai cũng đăng nhập được, không chỉ tài khoản test).
   - Điền `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` vào `.env`.
3. **Facebook**: [Meta for Developers](https://developers.facebook.com/apps) → tạo app → thêm sản phẩm *Facebook Login*.
   - Valid OAuth Redirect URIs: `https://play4fun.io.vn/api/auth/callback/facebook`
   - Privacy Policy URL: `https://play4fun.io.vn/privacy`
   - User data deletion → *Data deletion instructions URL*: `https://play4fun.io.vn/privacy#xoa-du-lieu`
   - Chuyển app sang chế độ *Live*, rồi điền `FACEBOOK_CLIENT_ID` (App ID), `FACEBOOK_CLIENT_SECRET` (App Secret) vào `.env`.
4. `./deploy/deploy.sh` (migration tạo bảng đăng nhập tự chạy). Kiểm tra: `curl -s https://play4fun.io.vn/api/auth/get-session` trả `null`.

Dữ liệu: bảng `users` (tên, ảnh, email), `accounts` (liên kết Google/Facebook), `sessions` (phiên 60 ngày), `user_records` (kỷ lục). Người chơi tự xóa tài khoản trong trang `/accounts`; xóa user thì phiên, liên kết và kỷ lục bị xóa theo (`ON DELETE CASCADE`).

### 4. Thống kê & trang admin

Container `umami` (thống kê mã nguồn mở, không cookie) chạy cùng docker-compose, dùng database `umami` riêng trong Postgres sẵn có (tự tạo bởi `umami-db-init`). Dashboard Umami chỉ mở trên `127.0.0.1:3002`; người chơi gửi dữ liệu qua `https://play4fun.io.vn/stats/*` (web chuyển tiếp vào container). Trang `/admin` gom số liệu từ Umami, tài khoản và phòng chơi nhóm.

1. Thêm vào `.env`: `UMAMI_APP_SECRET` (chạy `openssl rand -base64 32`) và `ADMIN_EMAILS=email-google-cua-ban@gmail.com` (nhiều email cách nhau bởi dấu phẩy), rồi `./deploy/deploy.sh`.
2. Mở dashboard Umami qua SSH tunnel từ máy bạn: `ssh -L 3002:127.0.0.1:3002 user@IP-server`, rồi vào `http://localhost:3002`.
3. Đăng nhập `admin` / `umami` → **đổi mật khẩu ngay** (Settings → Profile).
4. Settings → Websites → *Add website*: tên `Play4Fun`, domain `play4fun.io.vn` → mở website vừa tạo, sao chép **Website ID**.
5. Thêm `UMAMI_WEBSITE_ID=<id vừa chép>` vào `.env`, chạy lại `./deploy/deploy.sh`.
6. Đăng nhập trang web bằng email trong `ADMIN_EMAILS` → menu tài khoản → **Bảng điều khiển** (`/admin`). Người khác vào `/admin` chỉ thấy trang 404. Bấm "Không tính lượt truy cập của tôi" để loại lượt xem của chính bạn khỏi số liệu.

Sự kiện được ghi: `game-start`, `game-end` (kèm `seconds`, `score`), `game-quit` (đóng tab / chuyển trang giữa ván), `party-start` (kèm số người). Code ở `apps/web/lib/analytics.ts`; game mới chỉ cần gọi `gameStart(slug)` và `gameEnd(slug, { score })`. Bot và trình duyệt tự động bị Umami loại khỏi số liệu.

`/admin` đọc thẳng các bảng của Umami 3.4.1 (`website_event`, `event_data`, `session`) trong `apps/web/lib/admin-stats.ts`; khi nâng phiên bản Umami, kiểm tra lại các câu truy vấn đó.

### 5. Quảng cáo Google AdSense (tùy chọn)

Đã làm sẵn 2 vị trí: trang chủ (`home`) và cột bên của trang game / thử thách / xếp hạng (`sidebar`). Không đặt quảng cáo trong màn chơi hay cạnh nút điều khiển (dễ bấm nhầm, vi phạm chính sách AdSense). Khi chưa điền mã thì không hiện gì và `/ads.txt` trả 404.

1. Đăng ký [AdSense](https://adsense.google.com), thêm site `play4fun.io.vn`, chờ duyệt.
2. Tạo 2 đơn vị quảng cáo hiển thị (Ads → By ad unit → Display ads), chép **Publisher ID** (`ca-pub-…`) và 2 **ad slot id**.
3. Điền `ADSENSE_CLIENT`, `ADSENSE_SLOT_HOME`, `ADSENSE_SLOT_SIDEBAR` vào `.env`, chạy `./deploy/deploy.sh`. Kiểm tra `https://play4fun.io.vn/ads.txt`.

### 6. Phòng chơi nhóm khi deploy

Khi container `realtime` dừng (SIGTERM lúc deploy), mọi phòng đang mở được lưu vào Valkey (giữ 15 phút); container mới nạp lại, đồng hồ trong ván được cộng thêm thời gian gián đoạn, điện thoại người chơi tự kết nối lại vào đúng chỗ. Không cần cấu hình gì thêm (dùng `REDIS_URL` sẵn có). Log: `docker compose logs realtime | grep -E "saved|restored"`.

### 7. Các lần cập nhật sau

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
3. ✅ **Đăng nhập** Google/Facebook (không bắt buộc), kỷ lục đồng bộ giữa các thiết bị, trang tài khoản, xóa tài khoản
4. ✅ **Thống kê** (Umami tự host) và trang `/admin`
5. ✅ **Giai đoạn 2**: thử thách hằng ngày, bảng xếp hạng online, ảnh chia sẻ riêng cho từng kết quả, điểm số được server kiểm tra (chấm lại Gõ phím và Kiểm tra 15 phút; kiểm tra thời gian thật cho game hành động)
6. ✅ **Giai đoạn 3**: Studio câu hỏi + phòng có thương hiệu (miễn phí cho tài khoản), vị trí quảng cáo AdSense (bật bằng `.env`), giữ phòng chơi nhóm qua mỗi lần deploy
7. **Sau này (khi cần)**: chạy nhiều instance realtime (socket.io redis adapter), thu phí gói công ty, chạy lại toàn bộ thao tác của game hành động trên server nếu có trao giải
