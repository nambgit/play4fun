/** Only same-site paths are allowed as a post-login destination (no open redirects) */
export function safeNext(raw: unknown, fallback = "/"): string {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (typeof v !== "string" || !v.startsWith("/") || v.startsWith("//") || v.startsWith("/\\") || v.startsWith("/login")) return fallback;
  return v.slice(0, 300);
}
