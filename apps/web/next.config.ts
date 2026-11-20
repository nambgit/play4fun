import path from "node:path";
import type { NextConfig } from "next";

// npm workspace scripts run with cwd = apps/web, so the monorepo root is two levels up.
const monorepoRoot = path.resolve(process.cwd(), "../..");

const nextConfig: NextConfig = {
  // Build ra .next/standalone để chạy trong container mà không cần node_modules đầy đủ
  output: "standalone",
  outputFileTracingRoot: monorepoRoot,
  turbopack: { root: monorepoRoot },
  transpilePackages: ["@play4fun/db", "@play4fun/party"],
  poweredByHeader: false,
};

export default nextConfig;
