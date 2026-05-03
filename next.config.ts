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
};

export default nextConfig;
