import Link from "next/link";

export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="p4f-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8c6bff" />
          <stop offset="1" stopColor="#5527e0" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#p4f-mark)" />
      <path d="M12.5 9.8v12.4c0 .8.9 1.3 1.6.9l9.6-6.2c.6-.4.6-1.3 0-1.7l-9.6-6.2c-.7-.5-1.6 0-1.6.8Z" fill="#fff" />
      <circle cx="24.5" cy="8" r="2.2" fill="#ffb547" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 rounded-lg" aria-label="Play4Fun — trang chủ">
      <LogoMark />
      <span className="text-lg font-extrabold tracking-tight">
        Play<span className="text-brand">4</span>Fun
      </span>
    </Link>
  );
}
