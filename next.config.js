/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // All images come through our own /api/img proxy (MangaDex is blocked in VN),
  // so plain <img> tags are used and the optimizer isn't needed.
  images: { unoptimized: true },
};

module.exports = nextConfig;
