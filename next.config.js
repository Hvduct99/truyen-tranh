/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  generateBuildId: async () => null,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uploads.mangadex.org",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
