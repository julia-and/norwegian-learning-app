import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  transpilePackages: ['dexie', 'dexie-cloud-addon'],
};

export default nextConfig;
