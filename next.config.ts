import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      }
    ],
  },
  // Suppress Turbopack warnings for client-side libraries
  experimental: {
    turbo: {
      resolveAlias: {
        '@tanstack/react-table': '@tanstack/react-table',
      },
    },
  },
};

export default nextConfig;
