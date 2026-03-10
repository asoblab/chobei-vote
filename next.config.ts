import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "chobei-onigiri.jp",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
