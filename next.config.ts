import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Старые адреса до разделения на два направления
  async redirects() {
    return [
      { source: "/pulse", destination: "/culture-health", permanent: true },
      { source: "/example/pulse", destination: "/culture-health/demo", permanent: true },
      { source: "/example", destination: "/hr-brand/demo", permanent: true },
      { source: "/culture-index", destination: "/methodology", permanent: true },
    ]
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
