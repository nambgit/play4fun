"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Light/dark switch in the header. By default the site follows the device; picking the other
 * theme stores the choice (localStorage "p4f:theme") and sets data-theme on <html>, which the CSS
 * tokens and the `dark:` variant follow (app/globals.css). Picking the device's own theme again
 * clears the choice, so the site follows the device from then on. The saved choice is applied
 * before first paint by the inline script in app/layout.tsx.
 */
const KEY = "p4f:theme";
const COLORS = { light: "#f7f6fb", dark: "#0b0a12" };

const systemDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

function effective(): "light" | "dark" {
  const t = document.documentElement.getAttribute("data-theme");
  return t === "light" || t === "dark" ? t : systemDark() ? "dark" : "light";
}

/** Browser UI colour (address bar on phones) to match the chosen theme */
function syncThemeColor(theme: "light" | "dark" | null) {
  for (const m of document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) {
    if (!m.dataset.media) m.dataset.media = m.media;
    if (theme) {
      m.media = "";
      m.content = COLORS[theme];
    } else {
      m.media = m.dataset.media ?? "";
      m.content = m.dataset.media?.includes("dark") ? COLORS.dark : COLORS.light;
    }
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    setTheme(effective());
    const chosen = document.documentElement.getAttribute("data-theme");
    if (chosen === "light" || chosen === "dark") syncThemeColor(chosen);
    // Following the device: update the icon when the device switches
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setTheme(effective());
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const next = effective() === "dark" ? "light" : "dark";
    const root = document.documentElement;
    const followDevice = next === (systemDark() ? "dark" : "light");
    try {
      if (followDevice) localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, next);
    } catch {
      /* storage blocked: the choice lasts for this page only */
    }
    if (followDevice) root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", next);
    syncThemeColor(followDevice ? null : next);
    setTheme(next);
  };

  const dark = theme === "dark";
  const label = dark ? "Chuyển sang nền sáng" : "Chuyển sang nền tối";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-muted transition-colors hover:border-brand/40 hover:text-fg"
    >
      {/* Before mount the theme is unknown: render both icons' space with the moon hidden by CSS in dark mode */}
      {theme === null ? (
        <>
          <Moon className="h-[18px] w-[18px] dark:hidden" aria-hidden="true" />
          <Sun className="hidden h-[18px] w-[18px] dark:block" aria-hidden="true" />
        </>
      ) : dark ? (
        <Sun className="h-[18px] w-[18px]" aria-hidden="true" />
      ) : (
        <Moon className="h-[18px] w-[18px]" aria-hidden="true" />
      )}
    </button>
  );
}
