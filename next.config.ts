import type { NextConfig } from "next";

const nextConfig: any = {
  trailingSlash: false,
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/images/:path*',
      },
    ];
  },
};

export default nextConfig;
