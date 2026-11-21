import type { MetadataRoute } from "next";

/** Web app manifest: "Add to Home Screen" shows Play4Fun like an app */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Play4Fun – Game online miễn phí",
    short_name: "Play4Fun",
    description: "Mini-game giải lao, trắc nghiệm vui và game chơi nhóm ngay trên trình duyệt.",
    start_url: "/",
    display: "standalone",
    lang: "vi",
    background_color: "#0b0a12",
    theme_color: "#6b3cf5",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
