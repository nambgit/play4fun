/**
 * A game screenshot that follows the device theme: <slug>.webp in light mode,
 * <slug>-dark.webp (captured from the game in dark mode) when the system is dark.
 * Pure <picture>/<source media> — no JS, no flash of the wrong image.
 * Use inside a positioned box; the image fills it.
 */
/** Each thumbnail also exists at 600px (scripts/thumb-variants.mjs): phones and small cards load that */
const srcSetOf = (src: string) => `${src.replace(/\.webp$/, "-600.webp")} 600w, ${src} 1200w`;

export function GameImage({
  src,
  alt = "",
  className = "",
  priority = false,
  sizes = "(min-width: 1024px) 380px, (min-width: 640px) 50vw, 80vw",
}: {
  src: string;
  alt?: string;
  className?: string;
  priority?: boolean;
  /** Rendered width hint for srcset, see `sizes` on <img> */
  sizes?: string;
}) {
  const dark = src.replace(/\.webp$/, "-dark.webp");
  const responsive = src.endsWith(".webp");
  return (
    <picture>
      {dark !== src && <source srcSet={srcSetOf(dark)} sizes={sizes} media="(prefers-color-scheme: dark)" type="image/webp" />}
      {/* eslint-disable-next-line @next/next/no-img-element -- pre-optimized 1200×750 WebP; <picture> needed for the theme switch */}
      <img
        src={src}
        srcSet={responsive ? srcSetOf(src) : undefined}
        sizes={responsive ? sizes : undefined}
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
