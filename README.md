# Play4Fun — play4fun.io.vn

Cổng game trên trình duyệt: **mini-game giải lao**, **test vui / quiz** và **party game chơi nhóm realtime**,
dành cho dân văn phòng, học sinh, gamer.

## Stack

| Lớp | Công nghệ | Vai trò |
|---|---|---|
| Web | Next.js 16 (App Router) + React 19 + Tailwind 4 | Trang chủ, trang game (SSR/SSG cho SEO), API routes |
| Game client | Phaser 3 (arcade), React (quiz) | Code game trong trình duyệt |
| Realtime | Node.js + Socket.IO 4 | Phòng chơi nhóm, mã phòng, đồng bộ trạng thái |
| Database | PostgreSQL 17 + Drizzle ORM | Người chơi, điểm, thử thách hằng ngày, kết quả ván party |
| Cache | Valkey 8 (tương thích Redis) | Bảng xếp hạng (sorted set), rate limit, sau này scale realtime |
| Auth (giai đoạn 2) | Better Auth: khách + Google/Facebook | Chơi ngay không cần đăng nhập, login để lưu điểm |
| Hạ tầng | Docker Compose + nginx native + Let's Encrypt | |

## Cấu trúc

```
play4fun/
├── apps/
│   ├── web/            # Next.js
│   └── realtime/       # Socket.IO server
├── packages/
│   └── db/             # Drizzle schema, migrations (drizzle/), migrate runner
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

Đổi schema: sửa `packages/db/src/schema.ts` → `npm run db:generate` → commit file SQL mới trong `packages/db/drizzle/`.

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

sudo cp deploy/nginx/play4fun.io.vn.conf /etc/nginx/conf.d/
sudo nginx -t && sudo systemctl reload nginx

# Chuyển sang xác thực webroot để certbot tự gia hạn mà không cần dừng nginx
sudo certbot certonly --webroot -w /var/www/certbot -d play4fun.io.vn -d www.play4fun.io.vn --force-renewal
```

DNS: trỏ bản ghi `A` của `play4fun.io.vn` và `www` về IP server.

### 3. Các lần cập nhật sau

```bash
./deploy/deploy.sh      # git pull → build → up -d → dọn image cũ
```

### Sao lưu database

```bash
docker compose exec -T postgres pg_dump -U play4fun -Fc play4fun > backup_$(date +%F).dump
```

Nên đặt cron chạy hằng ngày và copy file backup ra ngoài server.

## Lộ trình

1. **MVP**: trang chủ, 3 mini-game, 2 quiz, chia sẻ kết quả (chưa cần đăng nhập)
2. **Giai đoạn 2**: thử thách hằng ngày, đăng nhập, bảng xếp hạng, ảnh OG tự sinh
3. **Giai đoạn 3**: party game ("Ai là gián điệp?", "Vẽ & đoán", "Đố vui team building"), gói cho công ty, quảng cáo
