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
      { source: "/culture-index", destination: "/hr-brand/methodology", permanent: true },
      // Общей методики больше нет: у каждого направления своя «Как считаем» (решение 2026-10-30)
      { source: "/methodology", destination: "/hr-brand/methodology", permanent: true },
      // «О нас» убрана из меню и вернётся позже (решение 2026-10-28) — пока временно на главную
      { source: "/about", destination: "/", permanent: false },
    ]
  },
};

export default nextConfig;
