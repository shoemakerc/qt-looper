import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build to plain HTML/CSS/JS in `out/` so GitHub Pages can serve it.
  output: "export",
  // GitHub serves this repo at shoemakerc.github.io/qt-looper/,
  // right alongside the main site.
  basePath: "/qt-looper",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
