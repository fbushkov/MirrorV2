import type { NextConfig } from "next";

// Заголовки безопасности для всех ответов. CSP пока без ограничения скриптов: Next вставляет свои встроенные скрипты,
// строгую политику с nonce добавим вместе с формой и Метрикой. HSTS браузеры учитывают только по HTTPS.
const SECURITY_HEADERS = [
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'" },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }]
  },
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
