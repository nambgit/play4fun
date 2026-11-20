# syntax=docker/dockerfile:1
# Một Dockerfile, 3 target: web | realtime | migrate
#   docker build --target web -t play4fun-web .

ARG NODE_IMAGE=node:24-alpine

# ---------- deps: cài dependencies (cache theo package*.json) ----------
FROM ${NODE_IMAGE} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/
COPY apps/realtime/package.json apps/realtime/
COPY packages/db/package.json packages/db/
COPY packages/party/package.json packages/party/
# npm nuốt lỗi tải gói optional (binary native) khi mạng chập chờn -> kiểm tra ngay để fail sớm
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund \
 && node -e "require('lightningcss'); require('@tailwindcss/oxide')"

# ---------- build: build tất cả workspace ----------
FROM deps AS build
ENV NEXT_TELEMETRY_DISABLED=1
COPY . .
RUN npm run build

# ---------- web: Next.js standalone ----------
FROM ${NODE_IMAGE} AS web
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
COPY --from=build --chown=node:node /app/apps/web/.next/standalone ./
COPY --from=build --chown=node:node /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build --chown=node:node /app/apps/web/public ./apps/web/public
USER node
EXPOSE 3000
CMD ["node", "apps/web/server.js"]

# ---------- realtime: Socket.IO server (bundle 1 file) ----------
FROM ${NODE_IMAGE} AS realtime
WORKDIR /app
ENV NODE_ENV=production PORT=3001
COPY --from=build --chown=node:node /app/apps/realtime/dist ./dist
USER node
EXPOSE 3001
CMD ["node", "dist/index.cjs"]

# ---------- migrate: chạy migration Drizzle rồi thoát ----------
FROM ${NODE_IMAGE} AS migrate
WORKDIR /app
ENV NODE_ENV=production MIGRATIONS_DIR=/app/drizzle
COPY --from=build --chown=node:node /app/packages/db/dist ./dist
COPY --from=build --chown=node:node /app/packages/db/drizzle ./drizzle
USER node
CMD ["node", "dist/migrate.cjs"]
