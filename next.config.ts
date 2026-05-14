import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // Emit `<route>/index.html` rather than `<route>.html` so S3-style static
  // hosting (Scaleway) resolves direct nav to `/conversation/` etc. without 404.
  trailingSlash: true,
};

export default nextConfig;
