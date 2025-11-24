import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['ffmpeg-static', 'fluent-ffmpeg'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('ffmpeg-static');
    }
    return config;
  }
};

export default nextConfig;
