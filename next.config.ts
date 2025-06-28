import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverActions: {
    bodySizeLimit: '10mb', // Increase to 10MB or adjust as needed
  },
};

export default nextConfig;
