/**
 * A game screenshot that follows the device theme: <slug>.webp in light mode,
 * <slug>-dark.webp (captured from the game in dark mode) when the system is dark.
 * Pure <picture>/<source media> — no JS, no flash of the wrong image.
 * Use inside a positioned box; the image fills it.
 */
export function GameImage({ src, alt = "", className = "", priority = false }: { src: string; alt?: string; className?: string; priority?: boolean }) {
  const dark = src.replace(/\.webp$/, "-dark.webp");
  return (
    <picture>
      {dark !== src && <source srcSet={dark} media="(prefers-color-scheme: dark)" type="image/webp" />}
      {/* eslint-disable-next-line @next/next/no-img-element -- pre-optimized 1200×750 WebP; <picture> needed for the theme switch */}
      <img
        src={src}
        alt={alt}
        width={1200}
        height={750}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        className={`absolute inset-0 h-full w-full object-cover ${className}`}
      />
    </picture>
  );
}
