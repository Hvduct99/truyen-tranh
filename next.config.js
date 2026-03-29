/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.otruyenapi.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "sv1.otruyencdn.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
