import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Increase to 10MB or adjust as needed
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wjevqjmnalarrqrytjlq.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
