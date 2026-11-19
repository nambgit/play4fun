#!/usr/bin/env bash
# Chạy trên server, trong thư mục chứa docker-compose.yml:  ./deploy/deploy.sh
set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  echo "Thiếu file .env — copy từ .env.example rồi sửa mật khẩu trước." >&2
  exit 1
fi

if [ -d .git ]; then
  git pull --ff-only
fi

docker compose build
docker compose up -d --remove-orphans
docker image prune -f

docker compose ps
